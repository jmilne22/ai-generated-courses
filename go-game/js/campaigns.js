/**
 * Go Grind - Palace Infiltration Mode
 * Timed dungeon runs through skill clusters with security mechanics.
 */
(function() {
    'use strict';

    // Infiltration state
    var infiltration = null;
    var infiltrationTimer = null;

    // Configuration
    var CONFIG = {
        floorsPerRun: 5,
        exercisesPerFloor: 2,
        timePerFloor: 300, // 5 minutes per floor
        securityPerHint: 15,
        securityPerWrongAnswer: 25,
        securityDecayPerFloor: 5,
        maxSecurity: 100,
        bossThreshold: 80 // Palace progress % needed for boss
    };

    // Floor types
    var FLOOR_TYPES = [
        { name: 'Shadow Patrol', desc: 'Standard encounters', xpMod: 1.0 },
        { name: 'Treasure Room', desc: 'Bonus XP available', xpMod: 1.5 },
        { name: 'Safe Room', desc: 'Security reduced', xpMod: 0.8, securityReduction: 20 },
        { name: 'Elite Shadows', desc: 'Harder but rewarding', xpMod: 2.0, difficultyMod: 1 },
        { name: 'Ambush!', desc: 'Time pressure', xpMod: 1.3, timeMod: 0.5 }
    ];

    function seededRandom(seed) {
        var x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    function generateFloors(palaceKey, seed) {
        var floors = [];
        for (var i = 0; i < CONFIG.floorsPerRun; i++) {
            var typeIdx = Math.floor(seededRandom(seed + i * 7) * FLOOR_TYPES.length);
            // Last floor is always Elite Shadows before boss
            if (i === CONFIG.floorsPerRun - 1) typeIdx = 3;
            // Third floor is often a safe room
            if (i === 2 && seededRandom(seed + 100) > 0.5) typeIdx = 2;

            floors.push({
                number: i + 1,
                type: FLOOR_TYPES[typeIdx],
                completed: false,
                exercises: [],
                xpEarned: 0
            });
        }
        return floors;
    }

    function selectExercisesForFloor(floor, palaceKey, exerciseData, seed) {
        if (!exerciseData || !window.GameState) return [];

        var palaceDefs = window.GameState.getPalaceDefs();
        var palace = palaceDefs[palaceKey];
        if (!palace) return [];

        // Get exercises matching palace concepts
        var validExercises = (exerciseData.challenges || []).filter(function(ex) {
            var skillKey = window.GameState.conceptToSkillKey(ex.concept || '');
            return palace.concepts.indexOf(skillKey) !== -1;
        });

        if (validExercises.length === 0) return [];

        // Pick exercises for this floor
        var count = CONFIG.exercisesPerFloor;
        var picked = [];
        var pool = validExercises.slice();

        for (var i = 0; i < count && pool.length > 0; i++) {
            var idx = Math.floor(seededRandom(seed + floor.number * 13 + i) * pool.length);
            var exercise = pool.splice(idx, 1)[0];

            // Pick a variant
            var variants = exercise.variants || [];
            if (variants.length === 0) continue;

            var diffMod = floor.type.difficultyMod || 0;
            var targetDiff = 2 + diffMod;

            // Sort by distance from target difficulty
            variants.sort(function(a, b) {
                var aDiff = Math.abs((a.difficulty || 2) - targetDiff);
                var bDiff = Math.abs((b.difficulty || 2) - targetDiff);
                return aDiff - bDiff;
            });

            var variant = variants[0];
            picked.push({
                exercise: exercise,
                variant: variant,
                completed: false,
                hintsUsed: 0,
                startTime: null
            });
        }

        return picked;
    }

    function startInfiltration(palaceKey, exerciseData) {
        if (!window.GameState) return;

        var palaces = window.GameState.getPalaces();
        var palace = palaces[palaceKey];
        if (!palace) return;

        var seed = Date.now();

        infiltration = {
            palaceKey: palaceKey,
            seed: seed,
            startTime: Date.now(),
            security: 0,
            currentFloor: 0,
            floors: generateFloors(palaceKey, seed),
            totalXP: 0,
            exerciseData: exerciseData,
            status: 'active', // active, retreated, victory
            hintsUsedTotal: 0,
            perfectFloors: 0
        };

        // Generate exercises for first floor
        var floor = infiltration.floors[0];
        floor.exercises = selectExercisesForFloor(floor, palaceKey, exerciseData, seed);

        renderInfiltrationView();
        startFloorTimer();
    }

    function startFloorTimer() {
        if (infiltrationTimer) clearInterval(infiltrationTimer);

        infiltrationTimer = setInterval(function() {
            if (!infiltration || infiltration.status !== 'active') {
                clearInterval(infiltrationTimer);
                return;
            }

            // Update timer display
            var floor = infiltration.floors[infiltration.currentFloor];
            var timeMod = floor.type.timeMod || 1;
            var floorTime = CONFIG.timePerFloor * timeMod;
            var elapsed = Math.floor((Date.now() - (floor.startTime || infiltration.startTime)) / 1000);
            var remaining = Math.max(0, floorTime - elapsed);

            var timerEl = document.getElementById('infiltration-floor-timer');
            if (timerEl) {
                var mins = Math.floor(remaining / 60);
                var secs = remaining % 60;
                timerEl.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;

                if (remaining <= 60) {
                    timerEl.classList.add('urgent');
                } else {
                    timerEl.classList.remove('urgent');
                }
            }

            // Time's up - forced retreat
            if (remaining <= 0) {
                forceRetreat('Time ran out!');
            }
        }, 1000);
    }

    function forceRetreat(reason) {
        if (!infiltration) return;

        infiltration.status = 'retreated';
        clearInterval(infiltrationTimer);

        // Award partial XP
        var partialXP = Math.floor(infiltration.totalXP * 0.5);
        if (window.GameState && partialXP > 0) {
            // Add XP manually
            var state = window.GameState.getState();
            state.player.totalXP += partialXP;
            window.GameState.save();
        }

        renderRetreatScreen(reason, partialXP);
    }

    function completeFloor() {
        if (!infiltration) return;

        var floor = infiltration.floors[infiltration.currentFloor];

        // Calculate floor XP
        var baseXP = 50 * floor.type.xpMod;
        floor.exercises.forEach(function(ex) {
            baseXP += ex.xpEarned || 0;
        });

        // Check for perfect floor (no hints)
        var floorHints = floor.exercises.reduce(function(sum, ex) { return sum + ex.hintsUsed; }, 0);
        if (floorHints === 0) {
            infiltration.perfectFloors++;
            baseXP *= 1.25; // 25% bonus for no hints
        }

        floor.xpEarned = Math.floor(baseXP);
        floor.completed = true;
        infiltration.totalXP += floor.xpEarned;

        // Security decay at safe rooms
        if (floor.type.securityReduction) {
            infiltration.security = Math.max(0, infiltration.security - floor.type.securityReduction);
        }

        // Move to next floor or victory
        infiltration.currentFloor++;

        if (infiltration.currentFloor >= CONFIG.floorsPerRun) {
            // Victory!
            completeInfiltration();
        } else {
            // Next floor
            var nextFloor = infiltration.floors[infiltration.currentFloor];
            nextFloor.exercises = selectExercisesForFloor(
                nextFloor,
                infiltration.palaceKey,
                infiltration.exerciseData,
                infiltration.seed
            );
            nextFloor.startTime = Date.now();
            renderInfiltrationView();
        }
    }

    function completeInfiltration() {
        if (!infiltration) return;

        infiltration.status = 'victory';
        clearInterval(infiltrationTimer);

        // Calculate final bonuses
        var bonusXP = 0;

        // Speed bonus
        var totalTime = Math.floor((Date.now() - infiltration.startTime) / 1000);
        var expectedTime = CONFIG.floorsPerRun * CONFIG.timePerFloor;
        if (totalTime < expectedTime * 0.5) {
            bonusXP += 100; // Speed demon bonus
        }

        // Stealth bonus (low security)
        if (infiltration.security < 30) {
            bonusXP += 75;
        }

        // Perfect bonus (all floors without hints)
        if (infiltration.perfectFloors === CONFIG.floorsPerRun) {
            bonusXP += 150;
        }

        infiltration.bonusXP = bonusXP;
        infiltration.totalXP += bonusXP;

        // Award XP
        if (window.GameState) {
            var state = window.GameState.getState();
            state.player.totalXP += infiltration.totalXP;

            // Update palace progress
            var palaces = state.palaces;
            if (palaces[infiltration.palaceKey]) {
                palaces[infiltration.palaceKey].progress = Math.min(1,
                    (palaces[infiltration.palaceKey].progress || 0) + 0.15
                );
            }

            window.GameState.save();
            window.App.updatePlayerCard();
        }

        renderVictoryScreen();
    }

    function addSecurity(amount) {
        if (!infiltration) return;

        infiltration.security = Math.min(CONFIG.maxSecurity, infiltration.security + amount);

        // Check for detection
        if (infiltration.security >= CONFIG.maxSecurity) {
            forceRetreat('Security reached 100%! You\'ve been detected!');
        }

        // Update security display
        var secBar = document.getElementById('infiltration-security-fill');
        var secText = document.getElementById('infiltration-security-text');
        if (secBar) secBar.style.width = infiltration.security + '%';
        if (secText) secText.textContent = infiltration.security + '%';
    }

    function onHintUsed() {
        addSecurity(CONFIG.securityPerHint);
        infiltration.hintsUsedTotal++;

        var floor = infiltration.floors[infiltration.currentFloor];
        var currentEx = floor.exercises.find(function(ex) { return !ex.completed; });
        if (currentEx) currentEx.hintsUsed++;
    }

    function onExerciseComplete(xpEarned) {
        if (!infiltration || infiltration.status !== 'active') return;

        var floor = infiltration.floors[infiltration.currentFloor];
        var currentEx = floor.exercises.find(function(ex) { return !ex.completed; });

        if (currentEx) {
            currentEx.completed = true;
            currentEx.xpEarned = xpEarned;
        }

        // Check if floor is complete
        var allDone = floor.exercises.every(function(ex) { return ex.completed; });
        if (allDone) {
            completeFloor();
        } else {
            renderInfiltrationView();
        }
    }

    function renderInfiltrationView() {
        var view = document.getElementById('view-palace');
        if (!view || !infiltration) return;

        var floor = infiltration.floors[infiltration.currentFloor];
        var palaceDefs = window.GameState.getPalaceDefs();
        var palace = palaceDefs[infiltration.palaceKey];

        // Get names
        var locationName = palace.name;

        // Labels
        var floorLabel = 'FLOOR';
        var securityLabel = 'SECURITY LEVEL';
        var timeLabel = 'TIME REMAINING';
        var xpLabel = 'RUN XP';
        var enemyLabel = 'Shadow';
        var defeatedLabel = 'DEFEATED';
        var engageLabel = 'ENGAGE';
        var retreatLabel = 'RETREAT (Keep 50% XP)';
        var retreatConfirm = 'Retreat from the palace? You\'ll keep 50% of earned XP.';

        var floorTypeName = floor.type.name;
        var floorTypeDesc = floor.type.desc;

        var html = '';

        // Header
        html += '<div class="infiltration-header">';
        html += '<div class="infiltration-palace">' + locationName + '</div>';
        html += '<div class="infiltration-floor">' + floorLabel + ' ' + floor.number + ' / ' + CONFIG.floorsPerRun + '</div>';
        html += '</div>';

        // Status bar
        html += '<div class="infiltration-status">';

        // Security/Alert meter
        html += '<div class="security-meter">';
        html += '<div class="security-label">' + securityLabel + '</div>';
        html += '<div class="security-bar"><div class="security-fill" id="infiltration-security-fill" style="width:' + infiltration.security + '%"></div></div>';
        html += '<div class="security-text" id="infiltration-security-text">' + infiltration.security + '%</div>';
        html += '</div>';

        // Timer
        html += '<div class="floor-timer">';
        html += '<div class="timer-label">' + timeLabel + '</div>';
        html += '<div class="timer-value" id="infiltration-floor-timer">5:00</div>';
        html += '</div>';

        // XP/Production
        html += '<div class="run-xp">';
        html += '<div class="xp-label">' + xpLabel + '</div>';
        html += '<div class="xp-value">' + infiltration.totalXP + '</div>';
        html += '</div>';

        html += '</div>'; // infiltration-status

        // Floor/Sector type
        html += '<div class="floor-type">';
        html += '<span class="floor-type-name">' + floorTypeName + '</span>';
        html += '<span class="floor-type-desc">' + floorTypeDesc + '</span>';
        html += '</div>';

        // Exercises/Targets
        html += '<div class="infiltration-exercises">';

        floor.exercises.forEach(function(exData, idx) {
            var statusClass = exData.completed ? 'completed' : (idx === 0 || floor.exercises[idx - 1].completed ? 'active' : 'locked');

            html += '<div class="infiltration-exercise ' + statusClass + '">';
            html += '<div class="exercise-number">' + enemyLabel + ' ' + (idx + 1) + '</div>';

            if (statusClass === 'completed') {
                html += '<div class="exercise-status">' + defeatedLabel + '</div>';
                html += '<div class="exercise-xp">+' + (exData.xpEarned || 0) + ' XP</div>';
            } else if (statusClass === 'active') {
                html += '<div class="exercise-title">' + exData.variant.title + '</div>';
                html += '<div class="exercise-concept">' + (exData.exercise.concept || '') + '</div>';
                html += '<button class="engage-btn" data-idx="' + idx + '">' + engageLabel + '</button>';
            } else {
                html += '<div class="exercise-status">???</div>';
            }

            html += '</div>';
        });

        html += '</div>'; // infiltration-exercises

        // Retreat button
        html += '<div class="infiltration-actions">';
        html += '<button class="retreat-btn" id="retreat-btn">' + retreatLabel + '</button>';
        html += '</div>';

        view.innerHTML = html;

        // Bind events
        view.querySelectorAll('.engage-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(btn.dataset.idx);
                showExerciseOverlay(idx);
            });
        });

        document.getElementById('retreat-btn').addEventListener('click', function() {
            if (confirm(retreatConfirm)) {
                forceRetreat('You chose to retreat.');
            }
        });

        // Start floor timer
        if (!floor.startTime) floor.startTime = Date.now();
    }

    function showExerciseOverlay(idx) {
        var floor = infiltration.floors[infiltration.currentFloor];
        var exData = floor.exercises[idx];
        if (!exData || exData.completed) return;

        // Create overlay
        var overlay = document.createElement('div');
        overlay.className = 'infiltration-exercise-overlay';
        overlay.id = 'infiltration-overlay';

        var html = '<div class="infiltration-exercise-modal">';
        html += '<div class="modal-header">';
        html += '<span>SHADOW ENCOUNTER</span>';
        html += '<span>' + (exData.exercise.concept || '') + '</span>';
        html += '</div>';

        // Render exercise content
        html += '<div class="modal-content">';
        html += '<h3>' + exData.variant.title + '</h3>';
        html += '<p>' + exData.variant.description + '</p>';

        // Hints
        if (exData.variant.hints) {
            exData.variant.hints.forEach(function(hint, i) {
                var title = typeof hint === 'object' ? hint.title : 'Hint ' + (i + 1);
                var content = typeof hint === 'object' ? hint.content : hint;
                html += '<details class="infiltration-hint" data-hint-idx="' + i + '"><summary>' + title + ' (+' + CONFIG.securityPerHint + '% Security)</summary>';
                html += '<div class="hint-content">' + content + '</div></details>';
            });
        }

        // Solution
        html += '<details class="infiltration-solution"><summary>Solution (+' + CONFIG.securityPerHint + '% Security)</summary>';
        html += '<div class="hint-content"><pre>' + exData.variant.solution + '</pre></div></details>';

        // Expected output
        if (exData.variant.expected) {
            html += '<div class="expected"><div class="expected-title">Expected Output</div>';
            html += '<pre>' + exData.variant.expected + '</pre></div>';
        }

        html += '</div>'; // modal-content

        // Actions
        html += '<div class="modal-actions">';
        html += '<button class="complete-btn" id="complete-shadow-btn">SHADOW DEFEATED</button>';
        html += '<button class="cancel-btn" id="cancel-shadow-btn">Cancel</button>';
        html += '</div>';

        html += '</div>'; // modal

        overlay.innerHTML = html;
        document.body.appendChild(overlay);

        // Track hints
        overlay.querySelectorAll('.infiltration-hint, .infiltration-solution').forEach(function(details) {
            details.addEventListener('toggle', function() {
                if (details.open && !details.dataset.opened) {
                    details.dataset.opened = 'true';
                    onHintUsed();
                }
            });
        });

        // Complete button
        document.getElementById('complete-shadow-btn').addEventListener('click', function() {
            var xp = 30 + (exData.variant.difficulty || 2) * 10;
            if (exData.hintsUsed === 0) xp *= 1.5; // No hints bonus
            onExerciseComplete(Math.floor(xp));
            overlay.remove();
        });

        // Cancel button
        document.getElementById('cancel-shadow-btn').addEventListener('click', function() {
            overlay.remove();
        });
    }

    function renderRetreatScreen(reason, partialXP) {
        var view = document.getElementById('view-palace');
        if (!view) return;

        // Labels
        var icon = '\u{1F3C3}';
        var title = 'RETREAT';
        var floorLabel = 'Floors Cleared';
        var xpLabel = 'XP Earned';
        var securityLabel = 'Final Security';
        var returnLabel = 'Return to Palace Select';

        var html = '<div class="infiltration-result retreat">';
        html += '<div class="result-icon">' + icon + '</div>';
        html += '<div class="result-title">' + title + '</div>';
        html += '<div class="result-reason">' + reason + '</div>';
        html += '<div class="result-stats">';
        html += '<div class="stat">' + floorLabel + ': ' + infiltration.currentFloor + '/' + CONFIG.floorsPerRun + '</div>';
        html += '<div class="stat">' + xpLabel + ': ' + partialXP + ' (50% penalty)</div>';
        html += '<div class="stat">' + securityLabel + ': ' + infiltration.security + '%</div>';
        html += '</div>';
        html += '<button class="return-btn" id="return-palace-btn">' + returnLabel + '</button>';
        html += '</div>';

        view.innerHTML = html;

        document.getElementById('return-palace-btn').addEventListener('click', function() {
            infiltration = null;
            window.App.navigateTo('palace');
        });
    }

    function renderVictoryScreen() {
        var view = document.getElementById('view-palace');
        if (!view) return;

        var locationName = infiltration.palaceKey.toUpperCase() + '\'S PALACE';

        // Labels
        var icon = '\u{1F3AD}';
        var title = 'INFILTRATION COMPLETE';
        var floorLabel = 'Floors Cleared';
        var baseLabel = 'Base XP';
        var bonusLabel = 'Bonus XP';
        var totalLabel = 'Total XP';
        var securityLabel = 'Final Security';
        var perfectLabel = 'Perfect Floors';
        var continueLabel = 'Continue';

        var html = '<div class="infiltration-result victory">';
        html += '<div class="result-icon">' + icon + '</div>';
        html += '<div class="result-title">' + title + '</div>';
        html += '<div class="result-palace">' + locationName + '</div>';

        html += '<div class="result-stats">';
        html += '<div class="stat-row"><span>' + floorLabel + '</span><span>' + CONFIG.floorsPerRun + '/' + CONFIG.floorsPerRun + '</span></div>';
        html += '<div class="stat-row"><span>' + baseLabel + '</span><span>' + (infiltration.totalXP - infiltration.bonusXP) + '</span></div>';

        if (infiltration.bonusXP > 0) {
            html += '<div class="stat-row bonus"><span>' + bonusLabel + '</span><span>+' + infiltration.bonusXP + '</span></div>';
        }

        html += '<div class="stat-row total"><span>' + totalLabel + '</span><span>' + infiltration.totalXP + '</span></div>';
        html += '<div class="stat-row"><span>' + securityLabel + '</span><span>' + infiltration.security + '%</span></div>';
        html += '<div class="stat-row"><span>' + perfectLabel + '</span><span>' + infiltration.perfectFloors + '/' + CONFIG.floorsPerRun + '</span></div>';
        html += '</div>';

        html += '<button class="return-btn" id="return-palace-btn">' + continueLabel + '</button>';
        html += '</div>';

        view.innerHTML = html;

        document.getElementById('return-palace-btn').addEventListener('click', function() {
            infiltration = null;
            window.App.navigateTo('palace');
        });
    }

    // Enhanced palace view with infiltration option
    function renderPalaceView() {
        var view = document.getElementById('view-palace');
        if (!view || !window.GameState) return;

        // If infiltration is active, show that instead
        if (infiltration && infiltration.status === 'active') {
            renderInfiltrationView();
            return;
        }

        var palaces = window.GameState.getPalaces();
        var palaceDefs = window.GameState.getPalaceDefs();
        var skillDefs = window.GameState.getSkillDefs();

        var html = '';

        // PERSONA 5 THEMED: PALACE INFILTRATION
        html += '<div class="section-header">';
        html += '<h2>PALACE INFILTRATION</h2>';
        html += '<div class="section-subtitle">Timed dungeon runs through skill clusters</div>';
        html += '</div>';

        html += '<div class="palace-list">';

        Object.keys(palaceDefs).forEach(function(key) {
            var def = palaceDefs[key];
            var palace = palaces[key] || { progress: 0, unlocked: false, defeated: false };
            var pct = Math.round(palace.progress * 100);

            html += '<div class="palace-item ' + (palace.defeated ? 'defeated' : '') + '">';
            html += '<div class="palace-name">' + def.name + '</div>';
            html += '<div class="palace-concepts">' + def.concepts.map(function(c) {
                return skillDefs[c] ? skillDefs[c].label : c;
            }).join(', ') + ' &bull; ' + def.theme + '</div>';
            html += '<div class="palace-bar"><div class="palace-bar-fill" style="width:' + pct + '%"></div></div>';
            html += '<div class="palace-status"><span>' + pct + '%</span>';
            if (palace.defeated) {
                html += '<span class="boss-defeated">BOSS DEFEATED</span>';
            } else if (pct >= CONFIG.bossThreshold) {
                html += '<span class="boss-available">BOSS AVAILABLE</span>';
            } else {
                html += '<span>Boss at ' + CONFIG.bossThreshold + '%</span>';
            }
            html += '</div>';

            // Infiltrate button
            html += '<button class="infiltrate-btn" data-palace="' + key + '">INFILTRATE</button>';

            html += '</div>';
        });

        html += '</div>';

        view.innerHTML = html;

        // Bind infiltrate buttons
        view.querySelectorAll('.infiltrate-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var palaceKey = btn.dataset.palace;
                // Get exercise data from Combat module
                if (window.Combat && window.Combat.getExerciseData) {
                    startInfiltration(palaceKey, window.Combat.getExerciseData());
                }
            });
        });
    }

    // Export with generic name, keep alias for compatibility
    var api = {
        start: startInfiltration,
        startInfiltration: startInfiltration, // Alias
        render: renderPalaceView,
        renderPalaceView: renderPalaceView, // Alias
        isActive: function() { return infiltration && infiltration.status === 'active'; }
    };

    // Generic name
    window.Campaigns = api;
    // Legacy alias for backwards compatibility
    window.PalaceMode = api;
})();
