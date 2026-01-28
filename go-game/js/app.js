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

        // Check for 4X theme - show military rank instead of level
        var levelDisplay = levelLabel + ' ' + player.level;
        if (T && T.getThemeId() === '4x-strategy') {
            var rank = T.getRankForLevel(player.level);
            if (rank) {
                levelDisplay = rank.insignia + ' ' + rank.name;
            }
        }

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

        // Get theme-aware labels
        var is4X = T && T.getThemeId() === '4x-strategy';

        // COMBAT/WARFARE section
        var combatTitle = T ? T.getTerm('navCombat', 'Combat') : 'Combat';
        html += '<div class="nav-section"><div class="nav-section-title">' + combatTitle + '</div>';
        html += navItem('training', T ? T.getTerm('training', 'Training Ground') : 'Training Ground', is4X ? '⚔️' : 'T');
        html += navItem('mementos', T ? T.getTerm('daily', 'Mementos') : 'Mementos', is4X ? '📋' : 'M');
        html += navItem('palace', T ? T.getTerm('palaces', 'Palaces') : 'Palaces', is4X ? '🗺️' : 'P');
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
            var techTier = skillInfo && skillInfo.techTier ? ' [' + skillInfo.techTier + ']' : '';

            // For 4X, show tech tier or rank
            var levelDisplay = is4X && skillInfo ? techTier : levelLabel + ' ' + skill.level;
            if (is4X) {
                var rank = T.getRankForLevel(skill.level);
                levelDisplay = rank ? rank.insignia : levelLabel + ' ' + skill.level;
            }

            html += '<div class="nav-item" data-view="skill-' + key + '">' +
                '<span class="nav-icon">' + (is4X ? '🔬' : (def.icon || '\u2022')) + '</span>' +
                '<span class="nav-label">' + skillLabel + '</span>' +
                '<span class="nav-level skill-level-badge">' + levelDisplay + '</span></div>';
        });
        html += '</div>';

        // PROJECTS/STRATEGIC section
        var requestsTitle = T ? T.getTerm('navRequests', 'Requests') : 'Requests';
        html += '<div class="nav-section"><div class="nav-section-title">' + requestsTitle + '</div>';
        html += navItem('projects', T ? T.getTerm('projects', 'Side Projects') : 'Side Projects', is4X ? '📋' : '\u2692');
        html += '</div>';

        // PART-TIME/DOMESTIC JOBS
        var partTimeTitle = T ? T.getTerm('navPartTime', 'Part-Time') : 'Part-Time';
        html += '<div class="nav-section"><div class="nav-section-title">' + partTimeTitle + '</div>';
        html += navItem('jobs', T ? T.getTerm('jobs', 'Jobs') : 'Jobs', is4X ? '🏭' : '💼');
        html += '</div>';

        // STATUS/ADMINISTRATION section
        var statusTitle = T ? T.getTerm('navStatus', 'Status') : 'Status';
        html += '<div class="nav-section"><div class="nav-section-title">' + statusTitle + '</div>';
        html += navItem('stats', T ? T.getTerm('stats', 'Stats') : 'Stats', is4X ? '📊' : 'S');
        html += navItem('calendar', T ? T.getTerm('calendar', 'Calendar') : 'Calendar', is4X ? '📅' : 'C');
        html += navItem('exams', T ? T.getTerm('exams', 'Exams') : 'Exams', is4X ? '🎓' : 'E');
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
            var confIcon = is4X ? c.stratIcon : c.p5Icon;
            var rankLabel = is4X ? 'Rel. ' : 'Rank ';

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

        // KNOWLEDGE / INTELLIGENCE section
        var knowledgeTitle = is4X ? 'Intelligence' : 'Knowledge';
        html += '<div class="nav-section"><div class="nav-section-title">' + knowledgeTitle + '</div>';
        html += navItem('library', is4X ? 'War College' : 'Library', is4X ? '📚' : '📖');
        html += '</div>';

        // VELVET ROOM / HIGH COMMAND
        var velvetTitle = T ? T.getTerm('navVelvetRoom', 'Velvet Room') : 'Velvet Room';
        html += '<div class="nav-section"><div class="nav-section-title">' + velvetTitle + '</div>';
        html += navItem('velvet', T ? T.getTerm('compendium', 'Compendium') : 'Compendium', is4X ? '🎖️' : 'V');
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
        var is4X = T && T.getThemeId() === '4x-strategy';

        // Theme-aware labels
        var pageTitle = is4X ? 'Territorial Conquest' : 'Palace Infiltration';
        var defeatedLabel = is4X ? 'CONQUERED' : 'BOSS DEFEATED';
        var availableLabel = is4X ? 'READY TO ANNEX' : 'BOSS AVAILABLE';
        var bossLabel = is4X ? 'Annexation at 80%' : 'Boss at 80%';
        var bossPrefix = is4X ? 'Final Battle: ' : 'Boss: ';

        var html = '<div class="section-title" style="margin-top:0">' + pageTitle + '</div>';
        html += '<div class="palace-list">';

        Object.keys(palaceDefs).forEach(function(key) {
            var def = palaceDefs[key];
            var palace = palaces[key] || { progress: 0, unlocked: false, defeated: false };
            var pct = Math.round(palace.progress * 100);

            // Get themed palace info
            var palaceInfo = T ? T.getPalaceInfo(key) : null;
            var palaceName = palaceInfo ? palaceInfo.name : def.name;
            var palaceTheme = palaceInfo ? palaceInfo.theme : def.theme;

            // Determine status class
            var statusClass = palace.defeated ? 'conquered' : (palace.unlocked ? 'victory-imminent' : (pct > 0 ? 'at-war' : ''));

            html += '<div class="palace-item palace-card ' + (palace.defeated ? 'defeated ' : '') + statusClass + '">';
            html += '<div class="palace-name">' + palaceName + '</div>';
            html += '<div class="palace-concepts">' + def.concepts.map(function(c) {
                var skillInfo = T ? T.getSkillInfo(c) : null;
                return skillInfo ? skillInfo.label : (skillDefs[c] ? skillDefs[c].label : c);
            }).join(', ') + ' &bull; ' + palaceTheme + '</div>';
            html += '<div class="palace-bar"><div class="palace-bar-fill" style="width:' + pct + '%"></div></div>';
            html += '<div class="palace-status"><span>' + pct + '% ' + (is4X ? 'Control' : '') + '</span>';
            if (palace.defeated) {
                html += '<span class="boss-defeated palace-status conquered">' + defeatedLabel + '</span>';
            } else if (palace.unlocked) {
                html += '<span class="boss-available palace-status">' + availableLabel + '</span>';
            } else {
                html += '<span>' + bossLabel + '</span>';
            }
            html += '</div>';
            if (def.boss) {
                html += '<div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-dim);margin-top:0.25rem">' + bossPrefix + def.boss + '</div>';
            }
            html += '</div>';
        });

        html += '</div>';
        view.innerHTML = html;
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
