/**
 * Go Grind - Main Application
 * Entry point, sidebar navigation, view switching, data loading.
 */
(function() {
    'use strict';

    var exerciseData = null;
    var currentView = 'training';

    function loadYamlFile(path) {
        return fetch(path)
            .then(function(res) {
                if (!res.ok) throw new Error('Failed to load ' + path);
                return res.text();
            })
            .then(function(text) {
                return jsyaml.load(text);
            });
    }

    function loadExerciseData() {
        // Load manifest to know which files to fetch
        return loadYamlFile('exercises/manifest.yaml')
            .then(function(manifest) {
                var promises = [];
                var fileMap = {};

                // Load config
                promises.push(
                    loadYamlFile('exercises/' + manifest.config)
                        .then(function(data) { fileMap.config = data; })
                );

                // Load warmups
                (manifest.warmups || []).forEach(function(file) {
                    promises.push(
                        loadYamlFile('exercises/' + file)
                            .then(function(data) {
                                fileMap.warmups = (fileMap.warmups || []).concat(data || []);
                            })
                    );
                });

                // Load challenges
                (manifest.challenges || []).forEach(function(file) {
                    promises.push(
                        loadYamlFile('exercises/' + file)
                            .then(function(data) {
                                fileMap.challenges = (fileMap.challenges || []).concat(data || []);
                            })
                    );
                });

                // Load advanced
                (manifest.advanced || []).forEach(function(file) {
                    promises.push(
                        loadYamlFile('exercises/' + file)
                            .then(function(data) {
                                fileMap.advanced = (fileMap.advanced || []).concat(data || []);
                            })
                    );
                });

                // Load pre-exercises
                (manifest.preExercises || []).forEach(function(file) {
                    promises.push(
                        loadYamlFile('exercises/' + file)
                            .then(function(data) {
                                fileMap.preExercises = (fileMap.preExercises || []).concat(data || []);
                            })
                    );
                });

                return Promise.all(promises).then(function() { return fileMap; });
            })
            .then(function(fileMap) {
                var config = fileMap.config || {};
                exerciseData = {
                    conceptLinks: config.conceptLinks || {},
                    sharedContent: config.sharedContent || {},
                    warmups: fileMap.warmups || [],
                    challenges: fileMap.challenges || [],
                    advanced: fileMap.advanced || [],
                    preExercises: fileMap.preExercises || []
                };
                // Normalize: ensure each exercise has an id
                exerciseData.warmups.forEach(function(w, i) { if (!w.id) w.id = 'warmup' + (i + 1); });
                exerciseData.challenges.forEach(function(c, i) { if (!c.id) c.id = 'challenge' + (i + 1); });
                return exerciseData;
            })
            .catch(function(err) {
                // Fallback to JSON if YAML fails
                console.warn('YAML load failed, trying JSON fallback:', err);
                return fetch('data/exercises.json')
                    .then(function(res) { return res.json(); })
                    .then(function(data) {
                        exerciseData = {
                            conceptLinks: data.conceptLinks || {},
                            sharedContent: data.sharedContent || {},
                            warmups: data.variants ? data.variants.warmups : (data.warmups || []),
                            challenges: data.variants ? data.variants.challenges : (data.challenges || [])
                        };
                        exerciseData.warmups.forEach(function(w, i) { if (!w.id) w.id = 'warmup' + (i + 1); });
                        exerciseData.challenges.forEach(function(c, i) { if (!c.id) c.id = 'challenge' + (i + 1); });
                        return exerciseData;
                    });
            });
    }

    function updatePlayerCard() {
        if (!window.GameState) return;
        var player = window.GameState.getPlayer();
        var xpProgress = window.GameState.getPlayerXPProgress();
        var completedCount = window.GameState.getCompletedCount();
        var T = window.ThemeRegistry;

        var nameEl = document.getElementById('player-name');
        var levelEl = document.getElementById('player-level');
        var xpFill = document.getElementById('player-xp-fill');
        var xpText = document.getElementById('player-xp-text');

        // Theme-aware display
        var levelLabel = T ? T.getTerm('levelAbbr', 'LV') : 'LV';
        var xpLabel = T ? T.getTerm('xp', 'XP') : 'XP';
        var exerciseLabel = T ? T.getTerm('exercises', 'shadows') : 'shadows';

        var levelDisplay = levelLabel + ' ' + player.level;

        if (nameEl) nameEl.textContent = T ? T.getTerm('playerName', player.name) : player.name;
        if (levelEl) levelEl.textContent = levelDisplay + ' \u2022 ' + completedCount + ' ' + exerciseLabel;
        if (xpFill) xpFill.style.width = xpProgress.pct + '%';
        if (xpText) xpText.textContent = xpProgress.current + ' / ' + xpProgress.needed + ' ' + xpLabel;

        // Update skill levels in sidebar
        var skills = window.GameState.getSkills();
        document.querySelectorAll('.nav-item[data-view^="skill-"]').forEach(function(item) {
            var skillKey = item.dataset.view.replace('skill-', '');
            var skill = skills[skillKey];
            var levelSpan = item.querySelector('.nav-level');
            if (levelSpan && skill) levelSpan.textContent = 'LV ' + skill.level;
        });

        // Update confidant ranks in sidebar
        document.querySelectorAll('.nav-item[data-view^="confidant-"]').forEach(function(item) {
            var confId = item.dataset.view.replace('confidant-', '');
            var conf = window.GameState.getConfidant(confId);
            var levelSpan = item.querySelector('.nav-level');
            if (levelSpan && conf) levelSpan.textContent = 'Rank ' + conf.rank;
        });
    }

    function buildSidebar() {
        var skillDefs = window.GameState ? window.GameState.getSkillDefs() : {};
        var skills = window.GameState ? window.GameState.getSkills() : {};
        var T = window.ThemeRegistry;

        var nav = document.getElementById('sidebar-nav');
        if (!nav) return;

        var html = '';

        // Next Objective Widget
        if (window.Goals) {
            var nextObj = window.Goals.getNextObjective();
            if (nextObj) {
                var territoryName = nextObj.territoryNameP5;
                var objDesc = nextObj.objective.descriptionP5;
                var progress = nextObj.objective.status;

                html += '<div class="next-objective-widget" data-view="goals">';
                html += '<div class="next-objective-label">Next Target</div>';
                html += '<div class="next-objective-territory">' + territoryName + '</div>';
                html += '<div class="next-objective-task">' + objDesc + '</div>';
                if (nextObj.objective.type !== 'boss') {
                    html += '<div class="next-objective-progress">' + progress.current + ' / ' + progress.target + '</div>';
                }
                html += '</div>';
            }
        }

        // GOALS/OBJECTIVES section (at top for visibility)
        html += '<div class="nav-section"><div class="nav-section-title">STORY</div>';
        html += navItem('goals', 'Phantom Thieves', '🎭');
        html += '</div>';

        // COMBAT/WARFARE section
        var combatTitle = T ? T.getTerm('navCombat', 'Combat') : 'Combat';
        html += '<div class="nav-section"><div class="nav-section-title">' + combatTitle + '</div>';
        html += navItem('training', T ? T.getTerm('training', 'Training Ground') : 'Training Ground', 'T');
        html += navItem('mementos', T ? T.getTerm('daily', 'Mementos') : 'Mementos', 'M');
        html += navItem('palace', T ? T.getTerm('palaces', 'Palaces') : 'Palaces', 'P');
        html += '</div>';

        // SKILLS/TECHNOLOGIES section
        var skillsTitle = T ? T.getTerm('navSkills', 'Skills') : 'Skills';
        var levelLabel = T ? T.getTerm('levelAbbr', 'LV') : 'LV';
        html += '<div class="nav-section"><div class="nav-section-title">' + skillsTitle + '</div>';
        Object.keys(skillDefs).forEach(function(key) {
            var def = skillDefs[key];
            var skill = skills[key] || { level: 1 };

            // Get theme-specific skill info
            var skillInfo = T ? T.getSkillInfo(key) : null;
            var skillLabel = skillInfo ? skillInfo.label : def.label;

            html += '<div class="nav-item" data-view="skill-' + key + '">' +
                '<span class="nav-icon">' + (def.icon || '\u2022') + '</span>' +
                '<span class="nav-label">' + skillLabel + '</span>' +
                '<span class="nav-level skill-level-badge">' + levelLabel + ' ' + skill.level + '</span></div>';
        });
        html += '</div>';

        // PROJECTS/STRATEGIC section
        var requestsTitle = T ? T.getTerm('navRequests', 'Requests') : 'Requests';
        html += '<div class="nav-section"><div class="nav-section-title">' + requestsTitle + '</div>';
        html += navItem('projects', T ? T.getTerm('projects', 'Side Projects') : 'Side Projects', '\u2692');
        html += '</div>';

        // PART-TIME/DOMESTIC JOBS
        var partTimeTitle = T ? T.getTerm('navPartTime', 'Part-Time') : 'Part-Time';
        html += '<div class="nav-section"><div class="nav-section-title">' + partTimeTitle + '</div>';
        html += navItem('jobs', T ? T.getTerm('jobs', 'Jobs') : 'Jobs', '💼');
        html += '</div>';

        // STATUS/ADMINISTRATION section
        var statusTitle = T ? T.getTerm('navStatus', 'Status') : 'Status';
        html += '<div class="nav-section"><div class="nav-section-title">' + statusTitle + '</div>';
        html += navItem('stats', T ? T.getTerm('stats', 'Stats') : 'Stats', 'S');
        html += navItem('calendar', T ? T.getTerm('calendar', 'Calendar') : 'Calendar', 'C');
        html += navItem('exams', T ? T.getTerm('exams', 'Exams') : 'Exams', 'E');
        html += '</div>';

        // CONFIDANTS/DIPLOMACY
        var confidantsTitle = T ? T.getTerm('navConfidants', 'Confidants') : 'Confidants';
        html += '<div class="nav-section"><div class="nav-section-title">' + confidantsTitle + '</div>';
        var confidantList = [
            { id: 'morgana', p5Icon: '🐱', stratIcon: '🤝', p5Name: 'Morgana' },
            { id: 'makoto', p5Icon: '📚', stratIcon: '⚙️', p5Name: 'Makoto' },
            { id: 'futaba', p5Icon: '🦊', stratIcon: '🔬', p5Name: 'Futaba' }
        ];
        confidantList.forEach(function(c) {
            var confState = window.GameState ? window.GameState.getConfidant(c.id) : { rank: 1, unlocked: false };
            var confInfo = T ? T.getConfidantInfo(c.id) : null;
            var confName = confInfo ? confInfo.name : c.p5Name;
            var confIcon = c.p5Icon;
            var rankLabel = 'Rank ';

            if (confState.unlocked) {
                html += '<div class="nav-item" data-view="confidant-' + c.id + '">' +
                    '<span class="nav-icon">' + confIcon + '</span>' +
                    '<span class="nav-label">' + confName + '</span>' +
                    '<span class="nav-level">' + rankLabel + confState.rank + '</span></div>';
            } else {
                html += '<div class="nav-item locked" style="opacity:0.4;pointer-events:none">' +
                    '<span class="nav-icon">🔒</span>' +
                    '<span class="nav-label">' + confName + '</span>' +
                    '<span class="nav-level">Locked</span></div>';
            }
        });
        html += '</div>';

        // KNOWLEDGE section
        html += '<div class="nav-section"><div class="nav-section-title">Knowledge</div>';
        html += navItem('library', 'Library', '📖');
        html += '</div>';

        // VELVET ROOM
        var velvetTitle = T ? T.getTerm('navVelvetRoom', 'Velvet Room') : 'Velvet Room';
        html += '<div class="nav-section"><div class="nav-section-title">' + velvetTitle + '</div>';
        html += navItem('velvet', T ? T.getTerm('compendium', 'Compendium') : 'Compendium', 'V');
        html += '</div>';

        // SETTINGS/SYSTEM
        var systemTitle = T ? T.getTerm('navSystem', 'System') : 'System';
        html += '<div class="nav-section"><div class="nav-section-title">' + systemTitle + '</div>';
        html += navItem('settings', T ? T.getTerm('settings', 'Settings') : 'Settings', '\u2699');
        html += '</div>';

        nav.innerHTML = html;

        // Bind clicks
        nav.querySelectorAll('.nav-item').forEach(function(item) {
            item.addEventListener('click', function() {
                var view = item.dataset.view;
                if (view) {
                    navigateTo(view);
                    if (window.GameAudio) window.GameAudio.playMenuSelect();
                    // Close mobile sidebar
                    var sidebar = document.querySelector('.sidebar');
                    if (sidebar) sidebar.classList.remove('open');
                    var overlay = document.querySelector('.mobile-overlay');
                    if (overlay) overlay.classList.remove('active');
                }
            });
        });

        // Bind next objective widget click
        var objWidget = nav.querySelector('.next-objective-widget');
        if (objWidget) {
            objWidget.addEventListener('click', function() {
                navigateTo('goals');
                if (window.GameAudio) window.GameAudio.playMenuSelect();
            });
        }
    }

    function navItem(viewId, label, icon) {
        return '<div class="nav-item" data-view="' + viewId + '">' +
            '<span class="nav-icon">' + icon + '</span>' +
            '<span class="nav-label">' + label + '</span></div>';
    }

    function navigateTo(viewId) {
        currentView = viewId;

        // Update active nav
        document.querySelectorAll('.nav-item').forEach(function(item) {
            item.classList.toggle('active', item.dataset.view === viewId);
        });

        // Hide all views
        document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });

        // Handle skill views
        if (viewId.startsWith('skill-')) {
            var skillView = document.getElementById('view-skill');
            if (skillView) {
                skillView.classList.add('active');
                var skillKey = viewId.replace('skill-', '');
                if (window.Skills) window.Skills.renderSkillPage(skillKey);
            }
            return;
        }

        // Handle confidant views
        if (viewId.startsWith('confidant-')) {
            var confidantView = document.getElementById('view-confidant');
            if (confidantView) {
                confidantView.classList.add('active');
                var confidantId = viewId.replace('confidant-', '');
                if (window.Confidants) window.Confidants.renderConfidantView(confidantId);
            }
            return;
        }

        // Show target view
        var target = document.getElementById('view-' + viewId);
        if (target) {
            target.classList.add('active');
        }

        // Render view content
        switch (viewId) {
            case 'training':
                if (window.Combat && exerciseData) window.Combat.renderTrainingGround();
                break;
            case 'mementos':
                if (window.Mementos) window.Mementos.renderMementosView();
                break;
            case 'palace':
                if (window.PalaceMode) {
                    window.PalaceMode.renderPalaceView();
                } else {
                    renderPalaceView();
                }
                break;
            case 'stats':
                if (window.Skills) window.Skills.renderStatsView();
                break;
            case 'calendar':
                if (window.Calendar) window.Calendar.renderCalendarView();
                break;
            case 'exams':
                if (window.GameExam) window.GameExam.renderExamsView();
                break;
            case 'projects':
                if (window.Projects) window.Projects.renderProjectsView();
                break;
            case 'velvet':
                if (window.VelvetRoom) window.VelvetRoom.renderVelvetRoom();
                break;
            case 'jobs':
                if (window.Jobs) window.Jobs.renderJobsView();
                break;
            case 'library':
                if (window.Library) window.Library.load();
                break;
            case 'settings':
                renderSettingsView();
                break;
            case 'goals':
                renderGoalsView();
                break;
        }

        // Scroll main panel to top
        var main = document.querySelector('.main-panel');
        if (main) main.scrollTop = 0;
    }

    function renderPalaceView() {
        var view = document.getElementById('view-palace');
        if (!view || !window.GameState) return;

        var palaces = window.GameState.getPalaces();
        var palaceDefs = window.GameState.getPalaceDefs();
        var skillDefs = window.GameState.getSkillDefs();
        var T = window.ThemeRegistry;

        // Get objectives if Goals module is loaded
        var territories = window.Goals ? window.Goals.getAllTerritoryProgress() : {};

        // Theme-aware labels
        var pageTitle = 'Palace Infiltration';
        var defeatedLabel = 'HEART CHANGED';
        var availableLabel = 'BOSS AVAILABLE';
        var bossPrefix = 'Boss: ';

        var html = '<div class="section-title" style="margin-top:0">' + pageTitle + '</div>';
        html += '<div class="palace-list">';

        Object.keys(palaceDefs).forEach(function(key) {
            var def = palaceDefs[key];
            var palace = palaces[key] || { progress: 0, unlocked: false, defeated: false };
            var territory = territories[key] || { pct: 0, completedCount: 0, totalCount: 5, objectives: [] };
            var pct = territory.pct;

            // Get themed palace info
            var palaceInfo = T ? T.getPalaceInfo(key) : null;
            var palaceName = palaceInfo ? palaceInfo.name : def.name;
            var palaceTheme = palaceInfo ? palaceInfo.theme : def.theme;

            // Determine status class
            var statusClass = palace.defeated ? 'conquered' : (palace.unlocked ? 'victory-imminent' : (pct > 0 ? 'at-war' : ''));

            html += '<div class="palace-item palace-card ' + (palace.defeated ? 'defeated ' : '') + statusClass + '" data-palace="' + key + '" style="cursor:pointer">';
            html += '<div class="palace-name">' + palaceName + '</div>';
            html += '<div class="palace-concepts">' + def.concepts.map(function(c) {
                var skillInfo = T ? T.getSkillInfo(c) : null;
                return skillInfo ? skillInfo.label : (skillDefs[c] ? skillDefs[c].label : c);
            }).join(', ') + ' &bull; ' + palaceTheme + '</div>';

            // Objectives progress bar
            html += '<div class="palace-bar"><div class="palace-bar-fill" style="width:' + pct + '%"></div></div>';

            // Status line with objectives count
            html += '<div class="palace-status">';
            html += '<span>' + territory.completedCount + '/' + territory.totalCount + ' tasks (' + pct + '%)</span>';
            if (palace.defeated) {
                html += '<span class="boss-defeated palace-status conquered">' + defeatedLabel + '</span>';
            } else if (palace.unlocked) {
                html += '<span class="boss-available palace-status">' + availableLabel + '</span>';
            }
            html += '</div>';

            // Show first incomplete objective as hint
            if (!palace.defeated && territory.objectives) {
                var nextObj = territory.objectives.find(function(o) { return !o.status.complete; });
                if (nextObj) {
                    var objDesc = nextObj.descriptionP5;
                    html += '<div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--accent);margin-top:0.5rem;padding:0.5rem;background:var(--bg-dark);border-radius:4px">';
                    html += '<span style="color:var(--text-dim)">Next: </span>' + objDesc;
                    if (nextObj.type !== 'boss') {
                        html += ' <span style="color:var(--text-dim)">(' + nextObj.status.current + '/' + nextObj.status.target + ')</span>';
                    }
                    html += '</div>';
                }
            }

            if (def.boss && !palace.defeated) {
                html += '<div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-dim);margin-top:0.25rem">' + bossPrefix + def.boss + '</div>';
            }
            html += '</div>';
        });

        html += '</div>';
        view.innerHTML = html;

        // Bind clicks to show detail modal
        view.querySelectorAll('.palace-card[data-palace]').forEach(function(el) {
            el.addEventListener('click', function() {
                var palaceKey = el.dataset.palace;
                if (palaceKey && window.Goals) {
                    showTerritoryDetail(palaceKey);
                }
            });
        });
    }

    function renderSettingsView() {
        var view = document.getElementById('view-settings');
        if (!view || !window.GameState) return;

        var settings = window.GameState.getSettings();
        var T = window.ThemeRegistry;

        var html = '<div class="section-title" style="margin-top:0">Settings</div>';
        html += '<div class="settings-group">';

        // Theme switcher
        html += '<div class="settings-item">' +
            '<span class="settings-label">Game Theme</span>' +
            '<select id="setting-theme" class="settings-select" style="background:var(--bg-card);color:var(--text);border:1px solid var(--border);padding:0.5rem;font-family:var(--font-body);cursor:pointer">';
        if (T) {
            var themes = T.getThemes();
            var currentTheme = T.getThemeId();
            themes.forEach(function(theme) {
                html += '<option value="' + theme.id + '"' + (theme.id === currentTheme ? ' selected' : '') + '>' + theme.name + '</option>';
            });
        }
        html += '</select></div>';

        // Sound toggle
        html += '<div class="settings-item">' +
            '<span class="settings-label">Sound Effects</span>' +
            '<button class="settings-toggle ' + (settings.sound !== false ? 'on' : '') + '" id="setting-sound">' + (settings.sound !== false ? 'ON' : 'OFF') + '</button></div>';

        // Timer duration
        var timerLabel = T ? T.getTerm('planningPhase', 'Thinking Timer') : 'Thinking Timer';
        html += '<div class="settings-item">' +
            '<span class="settings-label">' + timerLabel + ' (seconds)</span>' +
            '<span style="display:flex;gap:0.5rem;align-items:center">' +
            '<button class="settings-toggle" id="timer-minus">-</button>' +
            '<span id="timer-value" style="font-family:var(--font-mono);min-width:30px;text-align:center">' + (settings.timerSeconds || 45) + '</span>' +
            '<button class="settings-toggle" id="timer-plus">+</button></span></div>';

        html += '</div>';

        // Danger zone
        html += '<div class="section-title">Danger Zone</div>';
        html += '<div class="settings-group">';
        html += '<div class="settings-item">' +
            '<span class="settings-label">Reset all progress</span>' +
            '<button class="settings-danger-btn" id="setting-reset">RESET GAME</button></div>';
        html += '</div>';

        // Stats
        var player = window.GameState.getPlayer();
        html += '<div class="section-title">Debug Info</div>';
        html += '<div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-dim)">';
        html += 'Player Level: ' + player.level + '<br>';
        html += 'Total XP: ' + player.totalXP + '<br>';
        html += 'Completed Exercises: ' + window.GameState.getCompletedCount() + '<br>';
        html += 'Personas Discovered: ' + Object.keys(window.GameState.getPersonas()).length + '<br>';
        html += '</div>';

        view.innerHTML = html;

        // Bind settings
        var themeSelect = document.getElementById('setting-theme');
        if (themeSelect) {
            themeSelect.addEventListener('change', function() {
                if (window.ThemeRegistry) {
                    window.ThemeRegistry.setTheme(this.value);
                }
            });
        }

        document.getElementById('setting-sound').addEventListener('click', function() {
            var newVal = settings.sound === false ? true : false;
            window.GameState.updateSetting('sound', newVal);
            this.textContent = newVal ? 'ON' : 'OFF';
            this.classList.toggle('on', newVal);
        });

        document.getElementById('timer-minus').addEventListener('click', function() {
            var val = Math.max(0, (settings.timerSeconds || 45) - 5);
            window.GameState.updateSetting('timerSeconds', val);
            document.getElementById('timer-value').textContent = val;
        });

        document.getElementById('timer-plus').addEventListener('click', function() {
            var val = Math.min(120, (settings.timerSeconds || 45) + 5);
            window.GameState.updateSetting('timerSeconds', val);
            document.getElementById('timer-value').textContent = val;
        });

        document.getElementById('setting-reset').addEventListener('click', function() {
            if (confirm('Are you sure? This will delete ALL progress permanently.')) {
                if (confirm('Really? This cannot be undone.')) {
                    window.GameState.resetState();
                    window.location.reload();
                }
            }
        });
    }

    function renderGoalsView() {
        var view = document.getElementById('view-goals');
        if (!view || !window.GameState || !window.Goals) return;

        var progress = window.Goals.getVictoryProgress();
        var territories = window.Goals.getAllTerritoryProgress();
        var palaces = window.GameState.getPalaces();
        var palaceDefs = window.GameState.getPalaceDefs();
        var domination = progress.domination;

        var html = '<div class="story-progress">';

        // Header
        html += '<div class="story-header">';
        html += '<h2>Phantom Thieves Progress</h2>';
        html += '<div class="hearts-changed">Hearts Changed: <span class="count">' + domination.current + '</span> / ' + domination.total + '</div>';
        html += '</div>';

        // Palace story cards
        var order = ['kamoshida', 'madarame', 'kaneshiro', 'futaba', 'okumura', 'sae', 'shido', 'mementos_depths'];
        var icons = ['🏰', '🎨', '💰', '🔺', '🚀', '🎲', '🚢', '🌑'];

        order.forEach(function(key, idx) {
            var territory = territories[key];
            var palace = palaces[key] || {};
            var def = palaceDefs[key] || {};
            var statusClass = palace.defeated ? 'defeated' : (territory.pct > 0 ? 'available' : 'locked');
            var statusText = palace.defeated ? 'HEART CHANGED' : (territory.pct > 0 ? 'INFILTRATING' : 'NOT YET TARGETED');

            html += '<div class="palace-story-card ' + statusClass + '" data-palace="' + key + '">';
            html += '<div class="palace-story-header">';
            html += '<span class="palace-story-icon">' + icons[idx] + '</span>';
            html += '<span class="palace-story-name">' + territory.nameP5 + '</span>';
            html += '<span class="palace-story-status ' + statusClass + '">' + statusText + '</span>';
            html += '</div>';
            html += '<div class="palace-story-theme">' + def.theme + '</div>';
            if (!palace.defeated) {
                html += '<div class="palace-story-progress">';
                html += '<div class="palace-story-bar"><div class="palace-story-bar-fill" style="width:' + territory.pct + '%"></div></div>';
                html += '<span class="palace-story-pct">' + territory.pct + '%</span>';
                html += '</div>';
            }
            html += '</div>';
        });

        // Confidant summary
        html += '<div class="section-title" style="margin-top:2rem">Confidant Bonds</div>';
        html += renderConfidantSummary();

        html += '</div>';
        view.innerHTML = html;

        // Bind palace clicks
        view.querySelectorAll('.palace-story-card').forEach(function(el) {
            el.addEventListener('click', function() {
                var palaceKey = el.dataset.palace;
                if (palaceKey) {
                    showTerritoryDetail(palaceKey);
                }
            });
        });
    }

    function renderConfidantSummary() {
        var confidants = window.GameState.getConfidants();
        var html = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem;padding:1rem">';

        var confData = [
            { id: 'morgana', name: 'Morgana', icon: '🐱' },
            { id: 'makoto', name: 'Makoto', icon: '📚' },
            { id: 'futaba', name: 'Futaba', icon: '🦊' }
        ];

        confData.forEach(function(c) {
            var conf = confidants[c.id] || { rank: 0, unlocked: false };
            html += '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:6px;padding:1rem;text-align:center">';
            html += '<div style="font-size:1.5rem;margin-bottom:0.5rem">' + c.icon + '</div>';
            html += '<div style="font-weight:600">' + c.name + '</div>';
            html += '<div style="font-family:var(--font-mono);color:var(--text-dim)">Rank ' + conf.rank + ' / 10</div>';
            html += '</div>';
        });

        html += '</div>';
        return html;
    }

    function showTerritoryDetail(palaceKey) {
        var territory = window.Goals.getTerritoryObjectives(palaceKey);
        if (!territory) return;

        var palaces = window.GameState.getPalaces();
        var palace = palaces[palaceKey] || {};

        var name = territory.nameP5;
        var statusText = palace.defeated ? 'HEART CHANGED' : 'INFILTRATING';

        // Create modal
        var overlay = document.createElement('div');
        overlay.className = 'grade-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem';

        var modal = document.createElement('div');
        modal.style.cssText = 'background:var(--bg-card);border:2px solid var(--accent);border-radius:12px;padding:1.5rem;max-width:500px;width:100%;max-height:80vh;overflow-y:auto';

        var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">';
        html += '<h3 style="margin:0;font-family:var(--font-display)">' + name + '</h3>';
        html += '<span style="font-size:0.75rem;font-weight:bold;color:' + (palace.defeated ? 'var(--green)' : 'var(--yellow)') + '">' + statusText + '</span>';
        html += '</div>';

        html += '<div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-dim);margin-bottom:1rem">';
        html += 'Objectives: ' + territory.completedCount + ' / ' + territory.totalCount + ' (' + territory.pct + '%)';
        html += '</div>';

        html += '<div class="territory-objectives">';
        territory.objectives.forEach(function(obj) {
            var desc = obj.descriptionP5;
            var isComplete = obj.status.complete;

            html += '<div class="objective-item' + (isComplete ? ' complete' : '') + '">';
            html += '<div class="objective-checkbox' + (isComplete ? ' complete' : '') + '"></div>';
            html += '<div class="objective-content">';
            html += '<div class="objective-description">' + desc + '</div>';
            if (obj.type !== 'boss') {
                html += '<div class="objective-progress">' + obj.status.current + ' / ' + obj.status.target + '</div>';
            }
            html += '</div>';
            html += '</div>';
        });
        html += '</div>';

        html += '<div style="text-align:center;margin-top:1.5rem">';
        html += '<button class="close-modal-btn" style="background:var(--accent);color:#000;border:none;padding:0.75rem 2rem;font-family:var(--font-display);font-weight:600;cursor:pointer;border-radius:4px">Close</button>';
        html += '</div>';

        modal.innerHTML = html;
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay || e.target.classList.contains('close-modal-btn')) {
                document.body.removeChild(overlay);
            }
        });
    }

    // === Mobile menu ===
    function initMobile() {
        var toggle = document.querySelector('.mobile-toggle');
        var sidebar = document.querySelector('.sidebar');
        var overlay = document.querySelector('.mobile-overlay');

        if (toggle && sidebar) {
            toggle.addEventListener('click', function() {
                sidebar.classList.toggle('open');
                if (overlay) overlay.classList.toggle('active');
            });
        }
        if (overlay) {
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            });
        }
    }

    // === Keyboard shortcuts ===
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Don't handle if typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            // Escape or Enter to close overlays
            if (e.key === 'Escape' || e.key === 'Enter') {
                var overlay = document.querySelector('.grade-overlay, .levelup-overlay, .exam-results-overlay');
                if (overlay) {
                    overlay.click();
                    e.preventDefault();
                    return;
                }
            }

            // Escape to close mobile sidebar
            if (e.key === 'Escape') {
                var sidebar = document.querySelector('.sidebar.open');
                if (sidebar) {
                    sidebar.classList.remove('open');
                    var mobileOverlay = document.querySelector('.mobile-overlay');
                    if (mobileOverlay) mobileOverlay.classList.remove('active');
                    e.preventDefault();
                    return;
                }
            }

            // 1-4 keys for exam answers
            if (e.key >= '1' && e.key <= '4') {
                var examBtn = document.querySelector('.exam-answer-btn[data-index="' + (parseInt(e.key) - 1) + '"]');
                if (examBtn && examBtn.style.pointerEvents !== 'none') {
                    examBtn.click();
                    e.preventDefault();
                    return;
                }
            }

            // A/B/C/D keys for exam answers
            var letterMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
            if (letterMap.hasOwnProperty(e.key.toLowerCase()) && !e.ctrlKey && !e.metaKey) {
                var examAnswerBtn = document.querySelector('.exam-answer-btn[data-index="' + letterMap[e.key.toLowerCase()] + '"]');
                if (examAnswerBtn && examAnswerBtn.style.pointerEvents !== 'none') {
                    examAnswerBtn.click();
                    e.preventDefault();
                    return;
                }
            }
        });
    }

    // === Initialize ===
    function init() {
        // Initialize theme registry first
        if (window.ThemeRegistry) {
            window.ThemeRegistry.init();
        }

        initMobile();
        initKeyboardShortcuts();

        // Listen for theme changes to rebuild UI
        window.addEventListener('themeChanged', function() {
            buildSidebar();
            updatePlayerCard();
            // Re-render current view
            navigateTo(currentView);
        });

        loadExerciseData().then(function(data) {
            if (window.Combat) window.Combat.init(data);
            buildSidebar();
            updatePlayerCard();
            navigateTo('training');
        }).catch(function(err) {
            console.error('Failed to load exercise data:', err);
            var main = document.querySelector('.main-panel');
            if (main) {
                main.innerHTML = '<div style="padding:2rem;color:var(--red)">' +
                    '<h2>Failed to load exercise data</h2>' +
                    '<p>Make sure exercises/ YAML files exist (or data/exercises.json as fallback).</p>' +
                    '<pre>' + err.message + '</pre></div>';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.App = {
        navigateTo: navigateTo,
        updatePlayerCard: updatePlayerCard
    };
})();
