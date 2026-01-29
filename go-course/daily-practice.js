/**
 * Daily Practice Page Logic
 *
 * Builds exercise queues from SRS data and renders exercises
 * from across multiple modules for focused review sessions.
 */
(function() {
    'use strict';

    // Module names for display
    const MODULE_NAMES = {
        0: 'Quick Reference',
        1: 'Go Fundamentals',
        2: 'Pointers & Memory',
        3: 'Structs Deep Dive',
        4: 'Interfaces',
        5: 'Data Structures',
        6: 'CLI Foundations',
        7: 'Files & YAML',
        8: 'Building TUIs',
        9: 'Error Handling',
        10: 'Design Patterns',
        11: 'HTTP & APIs',
        12: 'Concurrency',
        13: 'Project Structure',
        14: 'System Interaction',
        15: 'Sets & Diffing',
        16: 'Unit Testing',
        17: 'Integration Testing'
    };

    let sessionConfig = { count: 10, mode: 'review', type: 'all', modules: 'all' };
    let sessionQueue = [];
    let sessionIndex = 0;
    let sessionResults = { completed: 0, skipped: 0, ratings: { 1: 0, 2: 0, 3: 0 } };

    // --- Initialization ---

    function init() {
        updateStats();
        setupConfigButtons();
        checkAvailability();
    }

    function updateStats() {
        if (!window.SRS) return;

        const due = window.SRS.getDueExercises();
        const weak = window.SRS.getWeakestExercises(10).filter(e => e.easeFactor < 2.0);
        const all = window.SRS.getAll();
        const total = Object.keys(all).length;

        setText('dp-due', due.length);
        setText('dp-weak', weak.length);
        setText('dp-total', total);
    }

    function checkAvailability() {
        if (!window.SRS) return;
        const all = window.SRS.getAll();
        const total = Object.keys(all).length;

        if (total === 0) {
            show('dp-empty');
            hide('dp-config');
        }
    }

    function setupConfigButtons() {
        document.querySelectorAll('#dp-count-options .dp-option').forEach(btn => {
            btn.addEventListener('click', () => {
                setActiveOption('dp-count-options', btn);
                sessionConfig.count = parseInt(btn.dataset.count);
            });
        });

        document.querySelectorAll('#dp-mode-options .dp-option').forEach(btn => {
            btn.addEventListener('click', () => {
                setActiveOption('dp-mode-options', btn);
                sessionConfig.mode = btn.dataset.mode;
            });
        });

        document.querySelectorAll('#dp-type-options .dp-option').forEach(btn => {
            btn.addEventListener('click', () => {
                setActiveOption('dp-type-options', btn);
                sessionConfig.type = btn.dataset.type;
            });
        });

        document.querySelectorAll('#dp-module-options .dp-option').forEach(btn => {
            btn.addEventListener('click', () => {
                // Module filter supports multi-select: clicking "All" resets, clicking a module toggles it
                if (btn.dataset.module === 'all') {
                    // Reset to all
                    document.querySelectorAll('#dp-module-options .dp-option').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    sessionConfig.modules = 'all';
                } else {
                    // Remove "All" active state
                    const allBtn = document.querySelector('#dp-module-options .dp-option[data-module="all"]');
                    if (allBtn) allBtn.classList.remove('active');

                    // Toggle this module
                    btn.classList.toggle('active');

                    // Collect active modules
                    const activeModules = [];
                    document.querySelectorAll('#dp-module-options .dp-option.active').forEach(b => {
                        if (b.dataset.module !== 'all') activeModules.push(parseInt(b.dataset.module));
                    });

                    if (activeModules.length === 0) {
                        // Nothing selected — revert to all
                        if (allBtn) allBtn.classList.add('active');
                        sessionConfig.modules = 'all';
                    } else {
                        sessionConfig.modules = activeModules;
                    }
                }
            });
        });
    }

    // --- Session Management ---

    window.startSession = function() {
        sessionQueue = buildQueue(sessionConfig.mode, sessionConfig.count);

        if (sessionQueue.length === 0) {
            show('dp-empty');
            hide('dp-config');
            return;
        }

        sessionIndex = 0;
        sessionResults = { completed: 0, skipped: 0, ratings: { 1: 0, 2: 0, 3: 0 } };

        hide('dp-config');
        hide('dp-stats');
        show('dp-session');

        renderCurrentExercise();
    };

    window.nextExercise = function() {
        sessionResults.completed++;
        advance();
    };

    window.skipExercise = function() {
        sessionResults.skipped++;
        advance();
    };

    function advance() {
        sessionIndex++;
        if (sessionIndex >= sessionQueue.length) {
            finishSession();
        } else {
            renderCurrentExercise();
        }
    }

    function finishSession() {
        hide('dp-session');
        show('dp-complete');

        const resultsEl = document.getElementById('dp-results');
        if (resultsEl) {
            // Count ratings from exercise progress
            const progress = window.ExerciseProgress?.loadAll() || {};
            let gotIt = 0, struggled = 0, peeked = 0;
            sessionQueue.forEach(item => {
                const p = progress[item.key];
                if (p?.selfRating === 1) gotIt++;
                else if (p?.selfRating === 2) struggled++;
                else if (p?.selfRating === 3) peeked++;
            });

            resultsEl.innerHTML = `
                <div class="dp-stat">
                    <div class="dp-stat-value" style="color: var(--green-bright);">${sessionResults.completed}</div>
                    <div class="dp-stat-label">Completed</div>
                </div>
                <div class="dp-stat">
                    <div class="dp-stat-value" style="color: var(--text-dim);">${sessionResults.skipped}</div>
                    <div class="dp-stat-label">Skipped</div>
                </div>
                <div class="dp-stat">
                    <div class="dp-stat-value" style="color: var(--green-bright);">${gotIt}</div>
                    <div class="dp-stat-label">Got It</div>
                </div>
                <div class="dp-stat">
                    <div class="dp-stat-value" style="color: var(--orange);">${struggled}</div>
                    <div class="dp-stat-label">Struggled</div>
                </div>
                <div class="dp-stat">
                    <div class="dp-stat-value" style="color: var(--purple);">${peeked}</div>
                    <div class="dp-stat-label">Had to Peek</div>
                </div>`;
        }
    }

    // --- Queue Building ---

    function matchesFilters(key) {
        const cfg = sessionConfig;

        // Type filter
        if (cfg.type !== 'all') {
            const isWarmup = key.includes('warmup');
            const isChallenge = key.includes('challenge');
            if (cfg.type === 'warmup' && !isWarmup) return false;
            if (cfg.type === 'challenge' && !isChallenge) return false;
        }

        // Module filter
        if (cfg.modules !== 'all') {
            const match = key.match(/^m(\d+)_/);
            const moduleNum = match ? parseInt(match[1]) : null;
            if (moduleNum === null || !cfg.modules.includes(moduleNum)) return false;
        }

        return true;
    }

    function buildQueue(mode, count) {
        if (!window.SRS) return [];

        let candidates = [];

        if (mode === 'review') {
            candidates = window.SRS.getDueExercises();
        } else if (mode === 'weakest') {
            candidates = window.SRS.getWeakestExercises(count * 2);
        } else if (mode === 'mixed') {
            const due = window.SRS.getDueExercises();
            const weak = window.SRS.getWeakestExercises(count);
            // Interleave: due first, then weak, deduplicated
            const seen = new Set();
            candidates = [];
            [...due, ...weak].forEach(item => {
                if (!seen.has(item.key)) {
                    seen.add(item.key);
                    candidates.push(item);
                }
            });
        }

        // Apply type and module filters
        candidates = candidates.filter(item => matchesFilters(item.key));

        // If we don't have enough from SRS, pad with random tracked exercises
        if (candidates.length < count) {
            const all = window.SRS.getAll();
            const existing = new Set(candidates.map(c => c.key));
            const extras = Object.entries(all)
                .filter(([key]) => !existing.has(key) && matchesFilters(key))
                .map(([key, item]) => ({ key, ...item }))
                .sort(() => Math.random() - 0.5);
            candidates.push(...extras);
        }

        // Limit to requested count and resolve to renderable items
        return candidates.slice(0, count).map(item => {
            const match = item.key.match(/^m(\d+)_/);
            const moduleNum = match ? parseInt(match[1]) : null;
            return {
                key: item.key,
                moduleNum,
                moduleName: MODULE_NAMES[moduleNum] || `Module ${moduleNum}`,
                srsData: item
            };
        });
    }

    // --- Exercise Rendering ---

    function renderCurrentExercise() {
        const item = sessionQueue[sessionIndex];
        if (!item) return;

        // Update header
        const labelEl = document.getElementById('dp-session-label');
        if (labelEl) {
            labelEl.innerHTML = `Exercise <strong>${sessionIndex + 1}</strong> of <strong>${sessionQueue.length}</strong>`;
        }

        const moduleEl = document.getElementById('dp-session-module');
        if (moduleEl) {
            moduleEl.textContent = `Module ${item.moduleNum}: ${item.moduleName}`;
        }

        // Update progress bar
        const barEl = document.getElementById('dp-session-bar');
        if (barEl) {
            barEl.style.width = `${(sessionIndex / sessionQueue.length) * 100}%`;
        }

        const container = document.getElementById('dp-exercise-container');
        if (!container) return;

        // Try to render from loaded variant data
        const exerciseHtml = renderFromKey(item);
        if (exerciseHtml) {
            container.innerHTML = exerciseHtml;
            // Initialize progress tracking and notes
            if (window.initExerciseProgress) window.initExerciseProgress();
            container.querySelectorAll('.exercise').forEach(ex => {
                if (window.ExerciseRenderer) {
                    window.ExerciseRenderer.initPersonalNotes(ex);
                }
            });
        } else {
            // Fallback: show link to module
            container.innerHTML = `
                <div class="exercise">
                    <h4>Exercise from Module ${item.moduleNum}</h4>
                    <p>This exercise's variant data isn't loaded. Open the module to practice it.</p>
                    <a href="module${item.moduleNum}.html" style="color: var(--green-bright);">
                        Go to Module ${item.moduleNum}: ${item.moduleName} &rarr;
                    </a>
                </div>`;
        }
    }

    function renderFromKey(item) {
        const key = item.key;
        // Parse the key to find the exercise
        // Format: m{moduleNum}_{exerciseId}_{variantId}  (variant system)
        //    or:  m{moduleNum}_{type}_{num}               (static exercises)

        // Check if we have variant data loaded in the registry
        const registry = window.moduleDataRegistry;
        if (!registry || !registry[item.moduleNum]) {
            // Try to load dynamically
            loadModuleData(item.moduleNum);
            return null; // Will render fallback
        }

        const moduleData = registry[item.moduleNum];
        const variants = moduleData.variants;
        if (!variants) return null;

        // Try to find the exercise in warmups or challenges
        const keyParts = key.replace(`m${item.moduleNum}_`, '');

        // Search warmups
        if (variants.warmups) {
            for (const warmup of variants.warmups) {
                for (const variant of warmup.variants) {
                    const testKey = `${warmup.id}_${variant.id}`;
                    if (keyParts === testKey) {
                        return window.ExerciseRenderer?.renderExerciseCard({
                            num: 1,
                            variant,
                            challenge: null,
                            type: 'warmup',
                            exerciseKey: key,
                            moduleLabel: `M${item.moduleNum}`
                        }) || null;
                    }
                }
            }
        }

        // Search challenges
        if (variants.challenges) {
            for (const challenge of variants.challenges) {
                for (const variant of challenge.variants) {
                    const testKey = `${challenge.id}_${variant.id}`;
                    if (keyParts === testKey) {
                        return window.ExerciseRenderer?.renderExerciseCard({
                            num: 1,
                            variant,
                            challenge,
                            type: 'challenge',
                            exerciseKey: key,
                            moduleLabel: `M${item.moduleNum}`
                        }) || null;
                    }
                }
            }
        }

        return null;
    }

    // Dynamically load a module's variant data
    const loadedModules = new Set();

    function loadModuleData(moduleNum) {
        if (loadedModules.has(moduleNum)) return;
        loadedModules.add(moduleNum);

        const script = document.createElement('script');
        script.src = `data/module${moduleNum}-variants.js`;
        script.onload = () => {
            // Re-render current exercise now that data is available
            renderCurrentExercise();
        };
        script.onerror = () => {
            // Module doesn't have variant data yet — fallback link will show
        };
        document.head.appendChild(script);
    }

    // --- Helpers ---

    function setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function show(id) {
        const el = document.getElementById(id);
        if (el) el.hidden = false;
    }

    function hide(id) {
        const el = document.getElementById(id);
        if (el) el.hidden = true;
    }

    function setActiveOption(containerId, activeBtn) {
        document.querySelectorAll(`#${containerId} .dp-option`).forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    // Init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
