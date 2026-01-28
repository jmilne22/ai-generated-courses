/**
 * Go Grind - Main Application
 * Entry point, sidebar navigation, view switching, data loading.
 */
(function() {
    'use strict';

    var exerciseData = null;
    var currentView = 'training';

    function loadExerciseData() {
        return fetch('data/exercises.json')
            .then(function(res) { return res.json(); })
            .then(function(data) {
                exerciseData = {
                    conceptLinks: data.conceptLinks || {},
                    sharedContent: data.sharedContent || {},
                    warmups: data.variants ? data.variants.warmups : (data.warmups || []),
                    challenges: data.variants ? data.variants.challenges : (data.challenges || [])
                };
                // Normalize: ensure each exercise has an id
                exerciseData.warmups.forEach(function(w, i) { if (!w.id) w.id = 'warmup' + (i + 1); });
                exerciseData.challenges.forEach(function(c, i) { if (!c.id) c.id = 'challenge' + (i + 1); });
                return exerciseData;
            });
    }

    function updatePlayerCard() {
        if (!window.GameState) return;
        var player = window.GameState.getPlayer();
        var xpProgress = window.GameState.getPlayerXPProgress();
        var completedCount = window.GameState.getCompletedCount();

        var nameEl = document.getElementById('player-name');
        var levelEl = document.getElementById('player-level');
        var xpFill = document.getElementById('player-xp-fill');
        var xpText = document.getElementById('player-xp-text');

        if (nameEl) nameEl.textContent = player.name;
        if (levelEl) levelEl.textContent = 'LV ' + player.level + ' \u2022 ' + completedCount + ' shadows';
        if (xpFill) xpFill.style.width = xpProgress.pct + '%';
        if (xpText) xpText.textContent = xpProgress.current + ' / ' + xpProgress.needed + ' XP';

        // Update skill levels in sidebar
        var skills = window.GameState.getSkills();
        document.querySelectorAll('.nav-item[data-view^="skill-"]').forEach(function(item) {
            var skillKey = item.dataset.view.replace('skill-', '');
            var skill = skills[skillKey];
            var levelSpan = item.querySelector('.nav-level');
            if (levelSpan && skill) levelSpan.textContent = 'LV ' + skill.level;
        });
    }

    function buildSidebar() {
        var skillDefs = window.GameState ? window.GameState.getSkillDefs() : {};
        var skills = window.GameState ? window.GameState.getSkills() : {};

        var nav = document.getElementById('sidebar-nav');
        if (!nav) return;

        var html = '';

        // COMBAT section
        html += '<div class="nav-section"><div class="nav-section-title">Combat</div>';
        html += navItem('training', 'Training Ground', 'T');
        html += navItem('mementos', 'Mementos', 'M');
        html += navItem('palace', 'Palaces', 'P');
        html += '</div>';

        // SKILLS section
        html += '<div class="nav-section"><div class="nav-section-title">Skills</div>';
        Object.keys(skillDefs).forEach(function(key) {
            var def = skillDefs[key];
            var skill = skills[key] || { level: 1 };
            html += '<div class="nav-item" data-view="skill-' + key + '">' +
                '<span class="nav-icon">' + (def.icon || '\u2022') + '</span>' +
                '<span class="nav-label">' + def.label + '</span>' +
                '<span class="nav-level">LV ' + skill.level + '</span></div>';
        });
        html += '</div>';

        // PROJECTS section
        html += '<div class="nav-section"><div class="nav-section-title">Requests</div>';
        html += navItem('projects', 'Side Projects', '\u2692');
        html += '</div>';

        // STATUS section
        html += '<div class="nav-section"><div class="nav-section-title">Status</div>';
        html += navItem('stats', 'Stats', 'S');
        html += navItem('calendar', 'Calendar', 'C');
        html += navItem('exams', 'Exams', 'E');
        html += '</div>';

        // VELVET ROOM
        html += '<div class="nav-section"><div class="nav-section-title">Velvet Room</div>';
        html += navItem('velvet', 'Compendium', 'V');
        html += '</div>';

        // SETTINGS
        html += '<div class="nav-section"><div class="nav-section-title">System</div>';
        html += navItem('settings', 'Settings', '\u2699');
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
                renderPalaceView();
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

        var html = '<div class="section-title" style="margin-top:0">Palace Infiltration</div>';
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
            } else if (palace.unlocked) {
                html += '<span class="boss-available">BOSS AVAILABLE</span>';
            } else {
                html += '<span>Boss at 80%</span>';
            }
            html += '</div>';
            if (def.boss) {
                html += '<div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-dim);margin-top:0.25rem">Boss: ' + def.boss + '</div>';
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

        var html = '<div class="section-title" style="margin-top:0">Settings</div>';
        html += '<div class="settings-group">';

        // Sound toggle
        html += '<div class="settings-item">' +
            '<span class="settings-label">Sound Effects</span>' +
            '<button class="settings-toggle ' + (settings.sound !== false ? 'on' : '') + '" id="setting-sound">' + (settings.sound !== false ? 'ON' : 'OFF') + '</button></div>';

        // Timer duration
        html += '<div class="settings-item">' +
            '<span class="settings-label">Thinking Timer (seconds)</span>' +
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
        initMobile();
        initKeyboardShortcuts();

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
                    '<p>Make sure data/exercises.json exists and is valid JSON.</p>' +
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
