/**
 * Go Grind - Combat System (Exercise Rendering)
 * Transplanted from course.js, adapted for concept-based standalone game.
 */
(function() {
    'use strict';

    var THINKING_TIME_SECONDS = 45;
    var exerciseData = null;
    var currentWarmupVariants = {};
    var currentChallengeVariants = {};
    var currentConceptFilter = null;
    var currentWarmupConceptFilter = null;
    var difficultyMode = 'balanced';
    var exerciseTimers = {};
    var exerciseHints = {};

    var DIFFICULTY_TARGETS = { 1: 0.35, 2: 0.40, 3: 0.25 };

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getDifficultyStars(d) {
        return '\u2B50'.repeat(Math.min(Math.max(d || 1, 1), 5));
    }

    function getVariantDifficulty(variant, challenge) {
        if (variant && variant.difficulty) return variant.difficulty;
        return challenge ? (challenge.difficulty || challenge.block || 2) : 2;
    }

    function getExerciseDifficulty(exercise) {
        return exercise.difficulty || exercise.block || 1;
    }

    function pickVariantFromPool(pool, current) {
        if (!pool || pool.length === 0) return null;
        if (pool.length === 1) return pool[0];
        var available = pool.filter(function(v) { return !current || v.id !== current.id; });
        var finalPool = available.length > 0 ? available : pool;
        return finalPool[Math.floor(Math.random() * finalPool.length)];
    }

    // === Personal Notes ===
    var NOTES_KEY = 'go-game-notes';
    var saveNotesTimer = null;

    function loadNote(exId, vId) {
        try {
            var all = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
            return all[exId + '_' + vId] || '';
        } catch(e) { return ''; }
    }

    function saveNote(exId, vId, text) {
        try {
            var all = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
            var key = exId + '_' + vId;
            if (text.trim() === '') { delete all[key]; } else { all[key] = text; }
            localStorage.setItem(NOTES_KEY, JSON.stringify(all));
        } catch(e) {}
    }

    function renderPersonalNotes(exId, vId) {
        var saved = loadNote(exId, vId);
        var tid = 'notes-' + exId + '-' + vId;
        return '<details class="personal-notes"><summary>Personal Notes</summary>' +
            '<div class="hint-content"><textarea class="personal-notes-textarea" id="' + tid + '" ' +
            'placeholder="Write your notes about this exercise...">' + escapeHtml(saved) + '</textarea>' +
            '<div class="personal-notes-hint">Auto-saves to browser storage</div></div></details>';
    }

    function initPersonalNotes(container) {
        container.querySelectorAll('.personal-notes-textarea').forEach(function(ta) {
            var match = ta.id.match(/notes-(.+?)-(.+)/);
            if (!match) return;
            var exId = match[1], vId = match[2];
            ta.addEventListener('input', function() {
                clearTimeout(saveNotesTimer);
                var val = ta.value;
                saveNotesTimer = setTimeout(function() { saveNote(exId, vId, val); }, 500);
            });
        });
    }

    // === Thinking Timer ===
    function initThinkingTimer(container) {
        var timerSecs = (window.GameState ? window.GameState.getSettings().timerSeconds : null) || THINKING_TIME_SECONDS;
        if (timerSecs <= 0) return;

        var allDetails = container.querySelectorAll('details');
        var details = Array.from(allDetails).filter(function(d) {
            var s = d.querySelector('summary');
            return s && !s.textContent.includes('Documentation') && !s.textContent.includes('Personal Notes');
        });
        if (details.length === 0) return;

        var btn = document.createElement('button');
        btn.className = 'thinking-timer-btn';
        btn.textContent = 'Start ' + timerSecs + 's thinking timer';
        container.insertBefore(btn, allDetails[0]);

        btn.addEventListener('click', function() {
            details.forEach(function(d) { d.classList.add('thinking-locked'); });

            var timerDiv = document.createElement('div');
            timerDiv.className = 'thinking-timer';
            timerDiv.innerHTML = '<span class="timer-icon">THINK</span> <span class="timer-countdown">' + timerSecs + '</span>s';
            btn.replaceWith(timerDiv);

            var remaining = timerSecs;
            var countdownSpan = timerDiv.querySelector('.timer-countdown');
            var interval = setInterval(function() {
                remaining--;
                countdownSpan.textContent = remaining;
                if (remaining <= 0) {
                    clearInterval(interval);
                    details.forEach(function(d) { d.classList.remove('thinking-locked'); });
                    timerDiv.textContent = 'Hints unlocked!';
                    timerDiv.classList.add('timer-done');
                    setTimeout(function() { timerDiv.remove(); }, 2000);
                }
            }, 1000);
        });
    }

    // === Rendering ===
    function renderSingleExercise(num, variant, exercise, type) {
        var variantDiff = getVariantDifficulty(variant, exercise);
        var variantStars = getDifficultyStars(variantDiff);
        var isChallenge = type === 'challenge';

        var html = '<div class="exercise" data-exercise-id="' + exercise.id + '" data-variant-id="' + variant.id + '" data-type="' + type + '">';

        // Shadow encounter bar
        html += '<div class="shadow-encounter-bar">' +
            '<span class="encounter-label">SHADOW ENCOUNTER</span>' +
            '<span class="encounter-name">' + (exercise.concept || '') + '</span></div>';

        html += '<h4>' + (isChallenge ? 'Challenge' : 'Warmup') + ' ' + num + ': ' + escapeHtml(variant.title) +
            ' <span class="variant-difficulty" title="Difficulty: ' + variantDiff + '">' + variantStars + '</span></h4>';

        // Easier/Harder buttons (challenges only)
        if (isChallenge) {
            var hasEasier = exercise.variants.some(function(v) { return getVariantDifficulty(v, exercise) < variantDiff; });
            var hasHarder = exercise.variants.some(function(v) { return getVariantDifficulty(v, exercise) > variantDiff; });
            if (hasEasier || hasHarder) {
                html += '<div class="variant-btn-container">';
                if (hasEasier) {
                    html += '<button class="easier-variant-btn" data-exercise-id="' + exercise.id + '">Get Easier Version</button>';
                }
                if (hasHarder) {
                    html += '<button class="harder-variant-btn" data-exercise-id="' + exercise.id + '">Get Harder Version</button>';
                }
                html += '</div>';
            }
        }

        html += '<p>' + variant.description + '</p>';

        // Hints with party assist labels
        var partyMembers = ['Morgana', 'Ann', 'Ryuji', 'Makoto', 'Futaba', 'Yusuke', 'Haru'];
        if (variant.hints) {
            variant.hints.forEach(function(hint, i) {
                var title = typeof hint === 'object' ? hint.title : 'Hint';
                var content = typeof hint === 'object' ? hint.content : hint;
                var member = partyMembers[i % partyMembers.length];
                html += '<details><summary>' + title + ' <span class="party-assist-label">[' + member + ']</span></summary>' +
                    '<div class="hint-content">' + content + '</div></details>';
            });
        }

        // Confidant Tip (from any unlocked confidant)
        if (window.Confidants && exercise.concept) {
            var skillKey = window.GameState ? window.GameState.conceptToSkillKey(exercise.concept) : null;
            if (skillKey) {
                var confTip = window.Confidants.getConfidantTip(skillKey);
                if (confTip) {
                    var tipClass = confTip.confidantId === 'morgana' ? 'morgana-tip' :
                                   confTip.confidantId === 'futaba' ? 'futaba-tip' :
                                   confTip.confidantId === 'makoto' ? 'makoto-tip' : 'confidant-tip';
                    html += '<details class="' + tipClass + '"><summary>' + confTip.title +
                        ' <span class="party-assist-label">[' + confTip.member + ']</span></summary>' +
                        '<div class="hint-content">' + confTip.content + '</div></details>';
                }
            }
        }

        // Solution
        html += '<details><summary>Solution</summary>' +
            '<div class="hint-content"><pre>' + escapeHtml(variant.solution) + '</pre></div></details>';

        // Personal notes
        html += renderPersonalNotes(exercise.id, variant.id);

        // Documentation links
        if (exercise.docLinks && exercise.docLinks.length > 0) {
            html += '<details><summary>Documentation</summary><div class="hint-content">' +
                '<ul style="padding-left:1.5rem">';
            exercise.docLinks.forEach(function(link) {
                html += '<li><a href="' + link.url + '" target="_blank" rel="noopener" style="color:var(--cyan)">' +
                    escapeHtml(link.title) + '</a>' + (link.note ? ' <span style="color:var(--text-dim)"> - ' + escapeHtml(link.note) + '</span>' : '') + '</li>';
            });
            html += '</ul></div></details>';
        }

        // Expected output / test cases
        if (variant.testCases && variant.testCases.length > 0) {
            html += '<div class="expected"><div class="expected-title">Expected Output</div>' +
                '<pre>' + variant.testCases.map(function(tc) { return escapeHtml(tc.input) + ' \u2192 ' + escapeHtml(tc.output); }).join('\n') + '</pre></div>';
        } else if (variant.expected) {
            html += '<div class="expected"><div class="expected-title">Expected Output</div>' +
                '<pre>' + escapeHtml(variant.expected) + '</pre></div>';
        }

        html += '</div>';
        return html;
    }

    function renderWarmups() {
        var container = document.getElementById('warmups-container');
        if (!container || !exerciseData || !exerciseData.warmups) return;

        var warmups = currentWarmupConceptFilter
            ? exerciseData.warmups.filter(function(w) { return w.concept === currentWarmupConceptFilter; })
            : exerciseData.warmups;

        if (warmups.length === 0) {
            container.innerHTML = '<p style="color:var(--text-dim);text-align:center">No warmups match this filter.</p>';
            return;
        }

        var html = '';

        if (currentWarmupConceptFilter) {
            var allVariants = [];
            warmups.forEach(function(w) {
                w.variants.forEach(function(v) { allVariants.push({ variant: v, warmup: w }); });
            });
            allVariants.sort(function() { return Math.random() - 0.5; });
            var selected = allVariants.slice(0, 5);
            html += '<p style="color:var(--green-bright);font-size:0.9rem;margin:0 0 1rem;font-weight:600">Practicing: ' + currentWarmupConceptFilter + ' (' + selected.length + ' of ' + allVariants.length + ' variants)</p>';
            selected.forEach(function(item, idx) {
                html += renderSingleExercise(idx + 1, item.variant, item.warmup, 'warmup');
            });
        } else {
            warmups.forEach(function(warmup, idx) {
                var variant = currentWarmupVariants[warmup.id];
                if (!variant) {
                    variant = warmup.variants[Math.floor(Math.random() * warmup.variants.length)];
                    currentWarmupVariants[warmup.id] = variant;
                }
                html += renderSingleExercise(idx + 1, variant, warmup, 'warmup');
            });
        }

        container.innerHTML = html;
        container.querySelectorAll('.exercise').forEach(function(ex) {
            initThinkingTimer(ex);
            initPersonalNotes(ex);
            initGameTracking(ex);
        });
    }

    function renderChallenges() {
        var container = document.getElementById('challenges-container');
        if (!container || !exerciseData || !exerciseData.challenges) return;

        var challenges = currentConceptFilter
            ? exerciseData.challenges.filter(function(c) { return c.concept === currentConceptFilter; })
            : exerciseData.challenges;

        if (challenges.length === 0) {
            container.innerHTML = '<p style="color:var(--text-dim);text-align:center">No challenges match this filter.</p>';
            return;
        }

        var html = '';

        if (currentConceptFilter) {
            var totalVariants = challenges.reduce(function(sum, c) { return sum + c.variants.length; }, 0);
            html += '<p style="color:var(--red);font-size:0.9rem;margin:0 0 1rem;font-weight:600">Practicing: ' + currentConceptFilter + ' (' + challenges.length + ' challenges, ' + totalVariants + ' variants)</p>';

            // Show pattern primer if available
            if (challenges[0] && challenges[0].patternPrimer) {
                var pp = challenges[0].patternPrimer;
                html += '<details style="border:2px solid var(--red);padding:1rem;margin-bottom:1.5rem;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)">' +
                    '<summary style="color:var(--red);font-weight:600;cursor:pointer">Pattern Primer: ' + currentConceptFilter + '</summary>' +
                    '<div class="hint-content" style="margin-top:1rem">' +
                    '<div style="margin-bottom:0.75rem"><strong>Brute force:</strong> ' + pp.bruteForce + '</div>' +
                    '<div style="margin-bottom:0.75rem"><strong>Best approach:</strong> ' + pp.bestApproach + '</div>' +
                    '<div><strong>Typical:</strong> ' + pp.typical + '</div></div></details>';
            }
        }

        // Distribution info (non-concept-filtered)
        if (!currentConceptFilter) {
            var counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
            challenges.forEach(function(c) {
                var v = currentChallengeVariants[c.id];
                if (v) { var d = getVariantDifficulty(v, c); counts[d] = (counts[d] || 0) + 1; }
            });
            var total = Object.values(counts).reduce(function(a, b) { return a + b; }, 0);
            if (total > 0) {
                var infoText = '';
                if (difficultyMode === 'easy') infoText = 'Easy mode: ' + total + ' challenges';
                else if (difficultyMode === 'hard') infoText = 'Hard mode: ' + (counts[3] + counts[4]) + ' hard challenges';
                else if (difficultyMode === 'balanced') infoText = 'Distribution: Easy ' + counts[1] + ' | Med ' + counts[2] + ' | Hard ' + (counts[3] + counts[4]);
                else if (difficultyMode === 'progressive') infoText = 'Progressive: ' + total + ' challenges, increasing difficulty';
                else infoText = 'Mixed: ' + total + ' random challenges';
                html += '<div class="shuffle-info">' + infoText + '</div>';
            }
        }

        var displayNum = 1;
        challenges.forEach(function(challenge) {
            var variant = currentChallengeVariants[challenge.id];
            if (!variant) return;
            html += renderSingleExercise(displayNum, variant, challenge, 'challenge');
            displayNum++;
        });

        container.innerHTML = html;
        container.querySelectorAll('.exercise').forEach(function(ex) {
            initThinkingTimer(ex);
            initPersonalNotes(ex);
            initVariantButtons(ex);
            initGameTracking(ex);
        });
    }

    function initVariantButtons(exerciseEl) {
        var easierBtn = exerciseEl.querySelector('.easier-variant-btn');
        if (easierBtn) {
            easierBtn.addEventListener('click', function() {
                var id = this.getAttribute('data-exercise-id');
                swapVariant(id, 'easier');
            });
        }
        var harderBtn = exerciseEl.querySelector('.harder-variant-btn');
        if (harderBtn) {
            harderBtn.addEventListener('click', function() {
                var id = this.getAttribute('data-exercise-id');
                swapVariant(id, 'harder');
            });
        }
    }

    function swapVariant(exerciseId, direction) {
        if (!exerciseData || !exerciseData.challenges) return;
        var challenge = exerciseData.challenges.find(function(c) { return c.id === exerciseId; });
        if (!challenge) return;

        var current = currentChallengeVariants[exerciseId];
        if (!current) return;
        var currentDiff = getVariantDifficulty(current, challenge);

        var targetDiff = direction === 'easier' ? currentDiff - 1 : currentDiff + 1;
        var pool = challenge.variants.filter(function(v) { return getVariantDifficulty(v, challenge) === targetDiff; });

        if (pool.length === 0 && direction === 'easier' && targetDiff > 1) {
            pool = challenge.variants.filter(function(v) { return getVariantDifficulty(v, challenge) === targetDiff - 1; });
        }
        if (pool.length === 0 && direction === 'harder' && targetDiff < 5) {
            pool = challenge.variants.filter(function(v) { return getVariantDifficulty(v, challenge) === targetDiff + 1; });
        }
        if (pool.length === 0) return;

        currentChallengeVariants[exerciseId] = pool[Math.floor(Math.random() * pool.length)];
        renderChallenges();

        setTimeout(function() {
            var el = document.querySelector('.exercise[data-exercise-id="' + exerciseId + '"]');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.style.transition = 'border-color 0.5s';
                el.style.borderColor = direction === 'easier' ? 'var(--green-bright)' : 'var(--purple)';
                setTimeout(function() { el.style.borderColor = ''; }, 800);
            }
        }, 100);
    }

    // === Game Tracking (Mark Complete, hint counting) ===
    function initGameTracking(exerciseEl) {
        var exId = exerciseEl.getAttribute('data-exercise-id');
        var vId = exerciseEl.getAttribute('data-variant-id');
        if (!exId || !vId) return;

        var fullKey = exId + '_' + vId;
        if (exerciseEl.querySelector('.game-complete-btn')) return;

        var alreadyCompleted = window.GameState && window.GameState.isExerciseCompleted(exId, vId);

        // Track start time
        if (!exerciseTimers[fullKey]) {
            exerciseTimers[fullKey] = Date.now();
        }

        // Track hints
        if (!exerciseHints[fullKey]) {
            exerciseHints[fullKey] = 0;
        }
        exerciseEl.querySelectorAll('details').forEach(function(d) {
            var summary = d.querySelector('summary');
            if (!summary) return;
            var text = summary.textContent;
            if (text.includes('Solution') || text.includes('Documentation') || text.includes('Personal Notes')) return;
            if (!d.hasAttribute('data-game-tracked')) {
                d.setAttribute('data-game-tracked', '1');
                d.addEventListener('toggle', function() {
                    if (d.open) {
                        exerciseHints[fullKey] = (exerciseHints[fullKey] || 0) + 1;
                        if (window.GameAudio) window.GameAudio.playHintOpen();
                    }
                });
            }
        });

        // Add Mark Complete button
        var btn = document.createElement('button');
        btn.className = 'game-complete-btn' + (alreadyCompleted ? ' completed' : '');
        btn.textContent = alreadyCompleted ? 'COMPLETED' : 'MARK COMPLETE';
        btn.type = 'button';

        if (!alreadyCompleted) {
            btn.addEventListener('click', function() {
                if (window.GameAudio) window.GameAudio.playMarkComplete();

                var startTime = exerciseTimers[fullKey] || Date.now();
                var timeSpent = Math.floor((Date.now() - startTime) / 1000);
                var hintsUsed = exerciseHints[fullKey] || 0;

                // Find concept
                var concept = null;
                var type = exerciseEl.getAttribute('data-type');
                if (type === 'challenge' && exerciseData && exerciseData.challenges) {
                    var ch = exerciseData.challenges.find(function(c) { return c.id === exId; });
                    if (ch) {
                        concept = ch.concept;
                        var variant = currentChallengeVariants[exId];
                        var diff = variant ? getVariantDifficulty(variant, ch) : getExerciseDifficulty(ch);
                    }
                } else if (exerciseData && exerciseData.warmups) {
                    var w = exerciseData.warmups.find(function(w) { return w.id === exId; });
                    if (w) concept = w.concept;
                }

                window.dispatchEvent(new CustomEvent('exerciseCompleted', {
                    detail: {
                        exerciseId: exId,
                        variantId: vId,
                        difficulty: diff || 1,
                        hintsUsed: hintsUsed,
                        timeSpent: timeSpent,
                        concept: concept
                    }
                }));

                btn.textContent = 'COMPLETED';
                btn.classList.add('completed');
            });
        }

        exerciseEl.appendChild(btn);
    }

    // === Shuffling ===
    function shuffleWarmups() {
        if (!exerciseData || !exerciseData.warmups) return;
        var warmups = currentWarmupConceptFilter
            ? exerciseData.warmups.filter(function(w) { return w.concept === currentWarmupConceptFilter; })
            : exerciseData.warmups;

        warmups.forEach(function(warmup) {
            currentWarmupVariants[warmup.id] = pickVariantFromPool(warmup.variants, currentWarmupVariants[warmup.id]);
        });
        renderWarmups();
    }

    function shuffleChallenges() {
        if (!exerciseData || !exerciseData.challenges) return;
        var challenges = currentConceptFilter
            ? exerciseData.challenges.filter(function(c) { return c.concept === currentConceptFilter; })
            : exerciseData.challenges;

        if (difficultyMode === 'easy') {
            challenges.forEach(function(ch) {
                var pool = ch.variants.filter(function(v) { return getVariantDifficulty(v, ch) <= 1; });
                if (pool.length === 0) pool = ch.variants.filter(function(v) { return getVariantDifficulty(v, ch) <= 2; });
                if (pool.length === 0) pool = ch.variants;
                currentChallengeVariants[ch.id] = pickVariantFromPool(pool, currentChallengeVariants[ch.id]);
            });
        } else if (difficultyMode === 'hard') {
            challenges.forEach(function(ch) {
                var pool = ch.variants.filter(function(v) { var d = getVariantDifficulty(v, ch); return d >= 3; });
                if (pool.length === 0) pool = ch.variants.filter(function(v) { return getVariantDifficulty(v, ch) >= 2; });
                if (pool.length === 0) pool = ch.variants;
                currentChallengeVariants[ch.id] = pickVariantFromPool(pool, currentChallengeVariants[ch.id]);
            });
        } else if (difficultyMode === 'mixed') {
            challenges.forEach(function(ch) {
                currentChallengeVariants[ch.id] = pickVariantFromPool(ch.variants, currentChallengeVariants[ch.id]);
            });
        } else if (difficultyMode === 'balanced') {
            var targetCount = challenges.length;
            var targetEasy = Math.round(targetCount * DIFFICULTY_TARGETS[1]);
            var targetMed = Math.round(targetCount * DIFFICULTY_TARGETS[2]);
            var easyC = 0, medC = 0, hardC = 0;

            challenges.forEach(function(ch) {
                var byDiff = {
                    1: ch.variants.filter(function(v) { return getVariantDifficulty(v, ch) === 1; }),
                    2: ch.variants.filter(function(v) { return getVariantDifficulty(v, ch) === 2; }),
                    3: ch.variants.filter(function(v) { var d = getVariantDifficulty(v, ch); return d >= 3; })
                };
                var target = 2;
                if (easyC < targetEasy && byDiff[1].length > 0) { target = 1; easyC++; }
                else if (medC < targetMed && byDiff[2].length > 0) { target = 2; medC++; }
                else if (byDiff[3].length > 0) { target = 3; hardC++; }
                else { target = byDiff[2].length > 0 ? 2 : byDiff[1].length > 0 ? 1 : 3; }

                var pool = byDiff[target];
                if (!pool || pool.length === 0) pool = ch.variants;
                currentChallengeVariants[ch.id] = pickVariantFromPool(pool, currentChallengeVariants[ch.id]);
            });
        } else if (difficultyMode === 'progressive') {
            challenges.forEach(function(ch, idx) {
                var pct = idx / challenges.length;
                var byDiff = {
                    1: ch.variants.filter(function(v) { return getVariantDifficulty(v, ch) === 1; }),
                    2: ch.variants.filter(function(v) { return getVariantDifficulty(v, ch) === 2; }),
                    3: ch.variants.filter(function(v) { var d = getVariantDifficulty(v, ch); return d >= 3; })
                };
                var target;
                if (pct < 0.4) target = byDiff[1].length > 0 ? 1 : byDiff[2].length > 0 ? 2 : 3;
                else if (pct < 0.7) target = byDiff[2].length > 0 ? 2 : byDiff[1].length > 0 ? 1 : 3;
                else target = byDiff[3].length > 0 ? 3 : byDiff[2].length > 0 ? 2 : 1;

                var pool = byDiff[target];
                if (!pool || pool.length === 0) pool = ch.variants;
                currentChallengeVariants[ch.id] = pickVariantFromPool(pool, currentChallengeVariants[ch.id]);
            });
        }

        renderChallenges();
    }

    // === Setup filters and render training ground ===
    function renderTrainingGround() {
        var view = document.getElementById('view-training');
        if (!view || !exerciseData) return;

        var warmupConcepts = [];
        var challengeConcepts = [];
        if (exerciseData.warmups) {
            var ws = new Set();
            exerciseData.warmups.forEach(function(w) { if (w.concept) ws.add(w.concept); });
            warmupConcepts = Array.from(ws).sort();
        }
        if (exerciseData.challenges) {
            var cs = new Set();
            exerciseData.challenges.forEach(function(c) { if (c.concept) cs.add(c.concept); });
            challengeConcepts = Array.from(cs).sort();
        }

        var totalWarmups = exerciseData.warmups ? exerciseData.warmups.reduce(function(s, w) { return s + w.variants.length; }, 0) : 0;
        var totalChallenges = exerciseData.challenges ? exerciseData.challenges.reduce(function(s, c) { return s + c.variants.length; }, 0) : 0;

        var html = '';
        html += '<div class="training-header"><h2>Training Ground</h2>' +
            '<span class="training-count">' + (totalWarmups + totalChallenges) + ' exercise variants</span></div>';

        // Warmup section
        html += '<div class="section-title">Warmups</div>';
        html += '<div class="concept-filter" id="warmup-concept-filter">' +
            '<span class="concept-filter-label">FOCUS CONCEPT</span>' +
            '<div class="concept-filter-buttons">' +
            '<button class="concept-btn active" data-concept="">All</button>';
        warmupConcepts.forEach(function(c) {
            html += '<button class="concept-btn" data-concept="' + c + '">' + c + '</button>';
        });
        html += '</div></div>';
        html += '<button class="shuffle-btn" id="shuffle-warmups-btn">Shuffle Warmups</button>';
        html += '<div id="warmups-container"></div>';

        // Challenge section
        html += '<div class="section-title" style="margin-top:2.5rem">Challenges</div>';

        // Difficulty selector
        html += '<div class="difficulty-mode-selector">' +
            '<span class="difficulty-mode-label">DIFFICULTY MODE</span>' +
            '<div class="difficulty-mode-buttons">' +
            '<button class="difficulty-mode-btn easy" data-mode="easy"><div>Easy</div><span class="mode-desc">Only easy variants</span></button>' +
            '<button class="difficulty-mode-btn" data-mode="mixed"><div>Mixed</div><span class="mode-desc">Random mix</span></button>' +
            '<button class="difficulty-mode-btn active" data-mode="balanced"><div>Balanced</div><span class="mode-desc">35/40/25 split</span></button>' +
            '<button class="difficulty-mode-btn" data-mode="progressive"><div>Progressive</div><span class="mode-desc">Easy to Hard</span></button>' +
            '<button class="difficulty-mode-btn hard" data-mode="hard"><div>Hard</div><span class="mode-desc">Only hard variants</span></button>' +
            '</div></div>';

        // Challenge concept filter
        html += '<div class="concept-filter" id="challenge-concept-filter">' +
            '<span class="concept-filter-label">FOCUS PATTERN</span>' +
            '<div class="concept-filter-buttons">' +
            '<button class="concept-btn active" data-concept="">All Patterns</button>';
        challengeConcepts.forEach(function(c) {
            html += '<button class="concept-btn" data-concept="' + c + '">' + c + '</button>';
        });
        html += '</div></div>';
        html += '<button class="shuffle-btn" id="shuffle-challenges-btn">Shuffle Challenges</button>';
        html += '<div id="challenges-container"></div>';

        view.innerHTML = html;

        // Bind warmup concept filter
        view.querySelector('#warmup-concept-filter').querySelectorAll('.concept-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                view.querySelector('#warmup-concept-filter').querySelectorAll('.concept-btn').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentWarmupConceptFilter = btn.dataset.concept || null;
                shuffleWarmups();
            });
        });

        // Bind difficulty mode
        view.querySelectorAll('.difficulty-mode-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                view.querySelectorAll('.difficulty-mode-btn').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                difficultyMode = btn.dataset.mode;
                shuffleChallenges();
            });
        });

        // Bind challenge concept filter
        view.querySelector('#challenge-concept-filter').querySelectorAll('.concept-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                view.querySelector('#challenge-concept-filter').querySelectorAll('.concept-btn').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentConceptFilter = btn.dataset.concept || null;
                shuffleChallenges();
            });
        });

        // Bind shuffle buttons
        document.getElementById('shuffle-warmups-btn').addEventListener('click', shuffleWarmups);
        document.getElementById('shuffle-challenges-btn').addEventListener('click', shuffleChallenges);

        // Initial render
        shuffleWarmups();
        shuffleChallenges();
    }

    // Public API
    window.Combat = {
        init: function(data) {
            exerciseData = data;
        },
        renderTrainingGround: renderTrainingGround,
        getExerciseData: function() { return exerciseData; },
        shuffleWarmups: shuffleWarmups,
        shuffleChallenges: shuffleChallenges,
        setConceptFilter: function(concept) {
            currentConceptFilter = concept || null;
            currentWarmupConceptFilter = concept || null;
            shuffleWarmups();
            shuffleChallenges();
        }
    };
})();
