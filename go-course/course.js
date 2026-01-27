/**
 * Shared Exercise Rendering System for Go Course
 * 
 * Expects these globals to be defined by module-specific data files:
 * - window.conceptLinks - object mapping concept names to lesson section IDs
 * - window.sharedContent - object with advanced exercise hints/pre-reading
 * - window.variantsDataEmbedded - object with all exercise variants
 */
(function() {
    'use strict';

    // Thinking timer configuration (seconds) - set to 0 to disable
    // Can be overridden per-page with: window.THINKING_TIME_SECONDS = 30;
    const THINKING_TIME_SECONDS = window.THINKING_TIME_SECONDS ?? 45;

    // Inject thinking timer CSS
    const timerStyles = document.createElement('style');
    timerStyles.textContent = `
        .thinking-timer-btn {
            background: transparent;
            border: 2px solid #8b5cf6;
            color: #8b5cf6;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 1rem;
            transition: all 0.2s;
        }
        .thinking-timer-btn:hover {
            background: #8b5cf6;
            color: white;
        }
        .thinking-timer {
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            color: white;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: pulse 2s ease-in-out infinite;
        }
        .thinking-timer .timer-icon {
            font-size: 1.2em;
        }
        .thinking-timer .timer-countdown {
            font-family: monospace;
            font-size: 1.1em;
            background: rgba(255,255,255,0.2);
            padding: 0.1rem 0.4rem;
            border-radius: 4px;
        }
        .thinking-timer.timer-done {
            background: #22c55e;
            animation: none;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.85; }
        }
        details.thinking-locked {
            opacity: 0.5;
            pointer-events: none;
        }
        details.thinking-locked summary {
            cursor: not-allowed;
        }
        details.thinking-locked summary::after {
            content: ' 🔒';
        }
        .concept-filter {
            margin-bottom: 1rem;
            padding: 1rem;
            background: var(--bg-card);
            border-radius: 8px;
            border: 1px solid var(--bg-lighter);
        }
        .concept-filter-label {
            font-size: 0.85rem;
            color: var(--text-dim);
            margin-bottom: 0.5rem;
            display: block;
        }
        .concept-filter-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        .concept-btn {
            background: transparent;
            border: 1px solid var(--bg-lighter);
            color: var(--text);
            padding: 0.35rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s;
        }
        .concept-btn:hover {
            border-color: var(--orange);
            color: var(--orange);
        }
        .concept-btn.active {
            background: var(--orange);
            border-color: var(--orange);
            color: white;
        }
        .difficulty-mode-selector {
            margin-bottom: 1rem;
            padding: 1rem;
            background: var(--bg-card);
            border-radius: 8px;
            border: 1px solid var(--bg-lighter);
        }
        .difficulty-mode-label {
            font-size: 0.85rem;
            color: var(--text-dim);
            margin-bottom: 0.5rem;
            display: block;
        }
        .difficulty-mode-buttons {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        .difficulty-mode-btn {
            background: transparent;
            border: 2px solid var(--bg-lighter);
            color: var(--text);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s;
            flex: 1;
            min-width: 120px;
        }
        .difficulty-mode-btn:hover {
            border-color: var(--orange);
            transform: translateY(-2px);
        }
        .difficulty-mode-btn.active {
            background: var(--orange);
            border-color: var(--orange);
            color: white;
            font-weight: 600;
        }
        .difficulty-mode-btn.easy.active {
            background: var(--green-bright);
            border-color: var(--green-bright);
            color: var(--bg-dark);
        }
        .difficulty-mode-btn.hard.active {
            background: var(--purple);
            border-color: var(--purple);
            color: white;
        }
        .difficulty-mode-btn .mode-desc {
            display: block;
            font-size: 0.7rem;
            opacity: 0.8;
            margin-top: 0.2rem;
        }
        .variant-difficulty {
            display: inline-block;
            font-size: 0.9rem;
            opacity: 0.8;
            margin-left: 0.5rem;
        }
        .shuffle-info {
            background: var(--bg-lighter);
            padding: 0.5rem 0.75rem;
            border-radius: 6px;
            font-size: 0.8rem;
            color: var(--text-dim);
            margin-top: 0.5rem;
        }
        .personal-notes {
            margin-top: 0.5rem;
        }
        .personal-notes summary {
            cursor: pointer;
            color: var(--purple);
            font-weight: 600;
            padding: 0.5rem 0;
        }
        .personal-notes-textarea {
            width: 100%;
            min-height: 100px;
            margin-top: 0.5rem;
            padding: 0.75rem;
            background: var(--bg-lighter);
            border: 1px solid var(--bg-lighter);
            border-radius: 4px;
            color: var(--text);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            resize: vertical;
        }
        .personal-notes-textarea:focus {
            outline: none;
            border-color: var(--purple);
            background: var(--bg-card);
        }
        .personal-notes-hint {
            font-size: 0.75rem;
            color: var(--text-dim);
            margin-top: 0.25rem;
        }
    `;
    document.head.appendChild(timerStyles);

    // State for tracking current variants
    let variantsData = null;
    const currentVariants = {};
    const currentWarmupVariants = {};
    const currentChallengeVariants = {};
    let currentConceptFilter = null; // null = show all (for challenges)
    let currentWarmupConceptFilter = null; // null = show all (for warmups)

    // Personal notes storage
    const NOTES_STORAGE_KEY = 'go-course-personal-notes';
    let saveNotesTimer = null;

    function getNotesKey(exerciseId, variantId) {
        return `${exerciseId}_${variantId}`;
    }

    function loadNote(exerciseId, variantId) {
        const allNotes = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY) || '{}');
        return allNotes[getNotesKey(exerciseId, variantId)] || '';
    }

    function saveNote(exerciseId, variantId, text) {
        const allNotes = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY) || '{}');
        const key = getNotesKey(exerciseId, variantId);

        if (text.trim() === '') {
            delete allNotes[key];
        } else {
            allNotes[key] = text;
        }

        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(allNotes));
    }

    function renderPersonalNotes(exerciseId, variantId) {
        const savedNote = loadNote(exerciseId, variantId);
        const textareaId = `notes-${exerciseId}-${variantId}`;

        return `<details class="personal-notes">
            <summary>📝 Personal Notes</summary>
            <div class="hint-content">
                <textarea
                    class="personal-notes-textarea"
                    id="${textareaId}"
                    placeholder="Write your notes about this exercise...&#10;&#10;• What did you learn?&#10;• Edge cases to remember&#10;• Patterns you discovered"
                >${escapeHtml(savedNote)}</textarea>
                <div class="personal-notes-hint">Auto-saves to browser storage</div>
            </div>
        </details>`;
    }

    function initPersonalNotes(container) {
        container.querySelectorAll('.personal-notes-textarea').forEach(textarea => {
            const id = textarea.id;
            const match = id.match(/notes-(.+?)_(.+)/);
            if (!match) return;

            const [, exerciseId, variantId] = match;

            textarea.addEventListener('input', () => {
                // Debounce saves
                clearTimeout(saveNotesTimer);
                saveNotesTimer = setTimeout(() => {
                    saveNote(exerciseId, variantId, textarea.value);
                }, 500);
            });
        });
    }

    // Unified difficulty mode: 'mixed', 'balanced', 'progressive', 'easy', 'hard'
    let difficultyMode = 'balanced';
    const DIFFICULTY_TARGETS = {
        1: 0.35,  // 35% easy
        2: 0.40,  // 40% medium
        3: 0.25   // 25% hard
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Convert difficulty number (1-5) to star string
    function getDifficultyStars(difficulty) {
        const stars = Math.min(Math.max(difficulty || 1, 1), 5);
        return '⭐'.repeat(stars);
    }

    // Get difficulty from exercise, with fallback to block number
    function getExerciseDifficulty(exercise) {
        return exercise.difficulty || exercise.block || 1;
    }

    // Get variant-specific difficulty (supports both variant.difficulty and fallback)
    function getVariantDifficulty(variant, challenge) {
        // First check if variant has its own difficulty
        if (variant && variant.difficulty) {
            return variant.difficulty;
        }
        // Fallback to challenge difficulty or block
        return challenge ? (challenge.difficulty || challenge.block || 2) : 2;
    }

    // Thinking timer - adds a button to start timer that locks hints/solutions (not docs)
    function initThinkingTimer(container) {
        if (THINKING_TIME_SECONDS <= 0) return;

        const allDetails = container.querySelectorAll('details');
        // Only lock hints and solutions, not documentation
        const details = Array.from(allDetails).filter(d => {
            const summary = d.querySelector('summary');
            return summary && !summary.textContent.includes('Documentation');
        });
        if (details.length === 0) return;

        // Add "Start Timer" button
        const btn = document.createElement('button');
        btn.className = 'thinking-timer-btn';
        btn.innerHTML = `🧠 Start ${THINKING_TIME_SECONDS}s thinking timer`;
        container.insertBefore(btn, allDetails[0]);

        btn.addEventListener('click', function() {
            // Lock hints/solutions (not docs)
            details.forEach(d => {
                d.classList.add('thinking-locked');
            });

            // Replace button with timer display
            const timerDiv = document.createElement('div');
            timerDiv.className = 'thinking-timer';
            timerDiv.innerHTML = `<span class="timer-icon">🧠</span> Think first: <span class="timer-countdown">${THINKING_TIME_SECONDS}</span>s`;
            btn.replaceWith(timerDiv);

            // Countdown
            let remaining = THINKING_TIME_SECONDS;
            const countdownSpan = timerDiv.querySelector('.timer-countdown');

            const interval = setInterval(() => {
                remaining--;
                countdownSpan.textContent = remaining;

                if (remaining <= 0) {
                    clearInterval(interval);
                    // Unlock hints/solutions
                    details.forEach(d => {
                        d.classList.remove('thinking-locked');
                    });
                    timerDiv.innerHTML = '✅ Hints unlocked!';
                    timerDiv.classList.add('timer-done');
                    setTimeout(() => timerDiv.remove(), 2000);
                }
            }, 1000);
        });
    }

    function setupDifficultyModeSelector() {
        // Check if selector already exists
        if (document.getElementById('difficulty-mode-selector')) return;

        const container = document.getElementById('challenges-container');
        if (!container) return;

        const selectorDiv = document.createElement('div');
        selectorDiv.id = 'difficulty-mode-selector';
        selectorDiv.className = 'difficulty-mode-selector';
        selectorDiv.innerHTML = `
            <span class="difficulty-mode-label">🎚️ Difficulty Mode:</span>
            <div class="difficulty-mode-buttons">
                <button class="difficulty-mode-btn easy" data-mode="easy">
                    <div>⭐ Easy</div>
                    <span class="mode-desc">Only easy variants</span>
                </button>
                <button class="difficulty-mode-btn" data-mode="mixed">
                    <div>🎲 Mixed</div>
                    <span class="mode-desc">Random mix</span>
                </button>
                <button class="difficulty-mode-btn active" data-mode="balanced">
                    <div>⚖️ Balanced</div>
                    <span class="mode-desc">35% easy, 40% med, 25% hard</span>
                </button>
                <button class="difficulty-mode-btn" data-mode="progressive">
                    <div>📈 Progressive</div>
                    <span class="mode-desc">Easy → Medium → Hard</span>
                </button>
                <button class="difficulty-mode-btn hard" data-mode="hard">
                    <div>⭐⭐⭐ Hard</div>
                    <span class="mode-desc">Only hard variants</span>
                </button>
            </div>
        `;

        // Insert before challenges container
        if (container.parentNode) {
            container.parentNode.insertBefore(selectorDiv, container);
        }

        // Add click handlers
        selectorDiv.querySelectorAll('.difficulty-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectorDiv.querySelectorAll('.difficulty-mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                difficultyMode = btn.dataset.mode;
                shuffleChallenges();
            });
        });
    }

    function loadVariants() {
        variantsData = window.variantsDataEmbedded;
        setupWarmupConceptFilter();  // Setup warmup filter
        shuffleWarmups();
        // Setup filters in reverse order (they insert before container, so last becomes first)
        setupConceptFilter();        // Will be 2nd (pattern filter)
        setupDifficultyModeSelector();  // Will be 1st (difficulty mode)
        shuffleChallenges();
        shuffleVariants();
    }

    function getUniqueWarmupConcepts() {
        if (!variantsData || !variantsData.warmups) return [];
        const concepts = new Set();
        variantsData.warmups.forEach(w => {
            if (w.concept) concepts.add(w.concept);
        });
        return Array.from(concepts).sort();
    }

    function setupWarmupConceptFilter() {
        const container = document.getElementById('warmups-container');
        if (!container) return;

        // Check if filter already exists
        if (document.getElementById('warmup-concept-filter')) return;

        const concepts = getUniqueWarmupConcepts();
        if (concepts.length === 0) return;

        const filterDiv = document.createElement('div');
        filterDiv.id = 'warmup-concept-filter';
        filterDiv.className = 'concept-filter';
        filterDiv.innerHTML = `
            <span class="concept-filter-label">🎯 Focus on a specific concept:</span>
            <div class="concept-filter-buttons">
                <button class="concept-btn active" data-concept="">All Concepts</button>
                ${concepts.map(c => `<button class="concept-btn" data-concept="${c}">${c}</button>`).join('')}
            </div>
        `;

        container.parentNode.insertBefore(filterDiv, container);

        // Add click handlers
        filterDiv.querySelectorAll('.concept-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                filterDiv.querySelectorAll('.concept-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentWarmupConceptFilter = btn.dataset.concept || null;
                shuffleWarmups();
            });
        });
    }

    function shuffleWarmups() {
        if (!variantsData || !variantsData.warmups) return;

        // Filter warmups by concept if active
        const warmups = currentWarmupConceptFilter
            ? variantsData.warmups.filter(w => w.concept === currentWarmupConceptFilter)
            : variantsData.warmups;

        // Pick a random variant for each warmup
        warmups.forEach(warmup => {
            const current = currentWarmupVariants[warmup.id];
            const available = warmup.variants.filter(v => !current || v.id !== current.id);
            const pool = available.length > 0 ? available : warmup.variants;
            currentWarmupVariants[warmup.id] = pool[Math.floor(Math.random() * pool.length)];
        });

        renderWarmups();

        // Visual feedback
        const btn = document.getElementById('shuffle-warmups-btn');
        if (btn) {
            btn.textContent = '✓ Shuffled!';
            btn.style.background = 'var(--green-bright)';
            btn.style.color = 'var(--bg-dark)';
            setTimeout(() => {
                btn.textContent = '🎲 Shuffle';
                btn.style.background = 'var(--bg-card)';
                btn.style.color = 'var(--green-bright)';
            }, 800);
        }
    }

    function renderWarmups() {
        const container = document.getElementById('warmups-container');
        if (!container || !variantsData || !variantsData.warmups) return;

        // Filter warmups by concept if active
        const warmups = currentWarmupConceptFilter
            ? variantsData.warmups.filter(w => w.concept === currentWarmupConceptFilter)
            : variantsData.warmups;

        let html = '';

        if (warmups.length === 0) {
            html = '<p style="color: var(--text-dim); text-align: center;">No warmups match this filter.</p>';
            container.innerHTML = html;
            return;
        }

        // When filtering by concept, show 5 random variants for practice
        if (currentWarmupConceptFilter) {
            // Collect all variants from the filtered warmup(s)
            const allVariants = [];
            warmups.forEach(warmup => {
                warmup.variants.forEach(variant => {
                    allVariants.push({ variant, warmup });
                });
            });

            // Shuffle and pick 5
            const shuffled = allVariants.sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, 5);

            html += `<p style="color: var(--green-bright); font-size: 0.9rem; margin: 0 0 1rem; font-weight: 600;">Practicing: ${currentWarmupConceptFilter} (${selected.length} of ${allVariants.length} variants)</p>`;

            selected.forEach((item, idx) => {
                const conceptLink = window.conceptLinks[item.warmup.concept];
                const conceptHtml = conceptLink
                    ? `<a href="${conceptLink}" class="concept-link" style="color: var(--green-dim); opacity: 0.8;">(${item.warmup.concept} ↗)</a>`
                    : `<span style="font-size: 0.75rem; opacity: 0.6; color: var(--text-dim);">(${item.warmup.concept})</span>`;

                html += `<div class="exercise">
                    <h4>Warmup ${idx + 1}: ${item.variant.title} ${conceptHtml}</h4>
                    <p>${item.variant.description}</p>`;

                // Add hints
                if (item.variant.hints) {
                    item.variant.hints.forEach((hint) => {
                        const title = typeof hint === 'object' ? hint.title : '💡 Hint';
                        const content = typeof hint === 'object' ? hint.content : hint;
                        html += `<details>
                            <summary>${title}</summary>
                            <div class="hint-content">${content}</div>
                        </details>`;
                    });
                }

                // Add solution
                html += `<details>
                    <summary>✅ Solution</summary>
                    <div class="hint-content"><pre>${escapeHtml(item.variant.solution)}</pre></div>
                </details>`;

                // Add personal notes
                html += renderPersonalNotes(item.warmup.id, item.variant.id);

                // Add expected output if available
                if (item.variant.expected) {
                    html += `<div class="expected">
                        <div class="expected-title">Expected Output</div>
                        <pre>${escapeHtml(item.variant.expected)}</pre>
                    </div>`;
                }

                html += '</div>';
            });

            container.innerHTML = html;
            container.querySelectorAll('.exercise').forEach(ex => {
                initThinkingTimer(ex);
                initPersonalNotes(ex);
            });
            return;
        }

        // No filter active - show one variant per warmup
        warmups.forEach((warmup, idx) => {
            const variant = currentWarmupVariants[warmup.id];
            const num = idx + 1;

            const conceptLink = window.conceptLinks[warmup.concept];
            const conceptHtml = conceptLink
                ? `<a href="${conceptLink}" class="concept-link" style="color: var(--green-dim); opacity: 0.8;">(${warmup.concept} ↗)</a>`
                : `<span style="font-size: 0.75rem; opacity: 0.6; color: var(--text-dim);">(${warmup.concept})</span>`;

            html += `<div class="exercise">
                <h4>Warmup ${num}: ${variant.title} ${conceptHtml}</h4>
                <p>${variant.description}</p>`;

            // Add hints
            if (variant.hints) {
                variant.hints.forEach((hint) => {
                    // Support both old string format and new object format
                    const title = typeof hint === 'object' ? hint.title : '💡 Hint';
                    const content = typeof hint === 'object' ? hint.content : hint;
                    html += `<details>
                        <summary>${title}</summary>
                        <div class="hint-content">${content}</div>
                    </details>`;
                });
            }

            // Add solution
            html += `<details>
                <summary>✅ Solution</summary>
                <div class="hint-content"><pre>${escapeHtml(variant.solution)}</pre></div>
            </details>`;

            // Add personal notes
            html += renderPersonalNotes(warmup.id, variant.id);

            // Add expected output if available
            if (variant.expected) {
                html += `<div class="expected">
                    <div class="expected-title">Expected Output</div>
                    <pre>${escapeHtml(variant.expected)}</pre>
                </div>`;
            }

            html += '</div>';
        });

        container.innerHTML = html;
        container.querySelectorAll('.exercise').forEach(ex => {
            initThinkingTimer(ex);
            initPersonalNotes(ex);
        });
    }

    function shuffleChallenges() {
        if (!variantsData || !variantsData.challenges) return;

        // Filter challenges by concept if active
        const challenges = currentConceptFilter
            ? variantsData.challenges.filter(c => c.concept === currentConceptFilter)
            : variantsData.challenges;

        if (difficultyMode === 'easy') {
            // Easy mode: Only show easy variants
            challenges.forEach(challenge => {
                const easyVariants = challenge.variants.filter(v => getVariantDifficulty(v, challenge) === 1);
                if (easyVariants.length === 0) {
                    // No easy variants, skip this challenge
                    return;
                }
                const current = currentChallengeVariants[challenge.id];
                const available = easyVariants.filter(v => !current || v.id !== current.id);
                const pool = available.length > 0 ? available : easyVariants;
                currentChallengeVariants[challenge.id] = pool[Math.floor(Math.random() * pool.length)];
            });
        } else if (difficultyMode === 'hard') {
            // Hard mode: Only show hard variants
            challenges.forEach(challenge => {
                const hardVariants = challenge.variants.filter(v => getVariantDifficulty(v, challenge) === 3);
                if (hardVariants.length === 0) {
                    // No hard variants, skip this challenge
                    return;
                }
                const current = currentChallengeVariants[challenge.id];
                const available = hardVariants.filter(v => !current || v.id !== current.id);
                const pool = available.length > 0 ? available : hardVariants;
                currentChallengeVariants[challenge.id] = pool[Math.floor(Math.random() * pool.length)];
            });
        } else if (difficultyMode === 'mixed') {
            // Original random shuffle
            challenges.forEach(challenge => {
                const current = currentChallengeVariants[challenge.id];
                const available = challenge.variants.filter(v => !current || v.id !== current.id);
                const pool = available.length > 0 ? available : challenge.variants;
                currentChallengeVariants[challenge.id] = pool[Math.floor(Math.random() * pool.length)];
            });
        } else if (difficultyMode === 'balanced') {
            // Balanced shuffle - ensure difficulty distribution
            const targetCount = challenges.length;
            const targetEasy = Math.round(targetCount * DIFFICULTY_TARGETS[1]);
            const targetMedium = Math.round(targetCount * DIFFICULTY_TARGETS[2]);
            const targetHard = targetCount - targetEasy - targetMedium;

            let easyCount = 0;
            let mediumCount = 0;
            let hardCount = 0;

            challenges.forEach(challenge => {
                // Group variants by difficulty
                const variantsByDifficulty = {
                    1: challenge.variants.filter(v => getVariantDifficulty(v, challenge) === 1),
                    2: challenge.variants.filter(v => getVariantDifficulty(v, challenge) === 2),
                    3: challenge.variants.filter(v => getVariantDifficulty(v, challenge) === 3)
                };

                // Determine which difficulty to pick from based on targets
                let targetDifficulty = 2; // default to medium

                if (easyCount < targetEasy && variantsByDifficulty[1].length > 0) {
                    targetDifficulty = 1;
                    easyCount++;
                } else if (mediumCount < targetMedium && variantsByDifficulty[2].length > 0) {
                    targetDifficulty = 2;
                    mediumCount++;
                } else if (hardCount < targetHard && variantsByDifficulty[3].length > 0) {
                    targetDifficulty = 3;
                    hardCount++;
                } else {
                    // Targets met or no variants at target difficulty, pick from available
                    const availableDifficulties = Object.keys(variantsByDifficulty)
                        .filter(d => variantsByDifficulty[d].length > 0)
                        .map(Number);

                    if (availableDifficulties.length > 0) {
                        targetDifficulty = availableDifficulties[Math.floor(Math.random() * availableDifficulties.length)];
                        if (targetDifficulty === 1) easyCount++;
                        else if (targetDifficulty === 2) mediumCount++;
                        else hardCount++;
                    }
                }

                // Pick random variant of target difficulty
                const pool = variantsByDifficulty[targetDifficulty];
                if (pool && pool.length > 0) {
                    currentChallengeVariants[challenge.id] = pool[Math.floor(Math.random() * pool.length)];
                } else {
                    // Fallback to any variant if no variants at target difficulty
                    currentChallengeVariants[challenge.id] = challenge.variants[
                        Math.floor(Math.random() * challenge.variants.length)
                    ];
                }
            });
        } else if (difficultyMode === 'progressive') {
            // Progressive mode - sort by challenge order, pick easier variants first
            challenges.forEach((challenge, idx) => {
                const variantsByDifficulty = {
                    1: challenge.variants.filter(v => getVariantDifficulty(v, challenge) === 1),
                    2: challenge.variants.filter(v => getVariantDifficulty(v, challenge) === 2),
                    3: challenge.variants.filter(v => getVariantDifficulty(v, challenge) === 3)
                };

                // Early challenges get easier variants
                const progressPct = idx / challenges.length;
                let targetDifficulty;

                if (progressPct < 0.4) {
                    // First 40% of challenges: prefer easy
                    targetDifficulty = variantsByDifficulty[1].length > 0 ? 1 :
                                     variantsByDifficulty[2].length > 0 ? 2 : 3;
                } else if (progressPct < 0.7) {
                    // Middle 30%: prefer medium
                    targetDifficulty = variantsByDifficulty[2].length > 0 ? 2 :
                                     variantsByDifficulty[1].length > 0 ? 1 : 3;
                } else {
                    // Last 30%: prefer hard
                    targetDifficulty = variantsByDifficulty[3].length > 0 ? 3 :
                                     variantsByDifficulty[2].length > 0 ? 2 : 1;
                }

                const pool = variantsByDifficulty[targetDifficulty];
                if (pool && pool.length > 0) {
                    currentChallengeVariants[challenge.id] = pool[Math.floor(Math.random() * pool.length)];
                } else {
                    currentChallengeVariants[challenge.id] = challenge.variants[
                        Math.floor(Math.random() * challenge.variants.length)
                    ];
                }
            });
        }

        renderChallenges();

        // Visual feedback
        const btn = document.getElementById('shuffle-challenges-btn');
        if (btn) {
            btn.textContent = '✓ Shuffled!';
            btn.style.background = 'var(--green-bright)';
            btn.style.color = 'var(--bg-dark)';
            btn.style.borderColor = 'var(--green-bright)';
            setTimeout(() => {
                btn.textContent = '🎲 Shuffle Challenges';
                btn.style.background = 'var(--bg-card)';
                btn.style.color = 'var(--orange)';
                btn.style.borderColor = 'var(--orange)';
            }, 800);
        }
    }

    function getUniqueConcepts() {
        if (!variantsData || !variantsData.challenges) return [];
        const concepts = new Set();
        variantsData.challenges.forEach(c => {
            if (c.concept) concepts.add(c.concept);
        });
        return Array.from(concepts).sort();
    }

    function setupConceptFilter() {
        const container = document.getElementById('challenges-container');
        if (!container) return;

        // Check if filter already exists
        if (document.getElementById('concept-filter')) return;

        const concepts = getUniqueConcepts();
        if (concepts.length === 0) return;

        const filterDiv = document.createElement('div');
        filterDiv.id = 'concept-filter';
        filterDiv.className = 'concept-filter';
        filterDiv.innerHTML = `
            <span class="concept-filter-label">🎯 Focus on a specific pattern:</span>
            <div class="concept-filter-buttons">
                <button class="concept-btn active" data-concept="">All Patterns</button>
                ${concepts.map(c => `<button class="concept-btn" data-concept="${c}">${c}</button>`).join('')}
            </div>
        `;

        container.parentNode.insertBefore(filterDiv, container);

        // Add click handlers
        filterDiv.querySelectorAll('.concept-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                filterDiv.querySelectorAll('.concept-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentConceptFilter = btn.dataset.concept || null;
                shuffleChallenges();
            });
        });
    }

    function renderSingleChallenge(num, variant, challenge, difficulty) {
        // Get variant-specific difficulty if available
        const variantDiff = getVariantDifficulty(variant, challenge);
        const variantStars = getDifficultyStars(variantDiff);

        let html = `<div class="exercise">
            <h4>Challenge ${num}: ${variant.title}
                <span class="variant-difficulty" title="Variant difficulty: ${variantDiff} stars">${variantStars}</span>
            </h4>
            <p>${variant.description}</p>`;

        // Add hints
        if (variant.hints) {
            variant.hints.forEach((hint) => {
                const title = typeof hint === 'object' ? hint.title : '💡 Hint';
                const content = typeof hint === 'object' ? hint.content : hint;
                html += `<details>
                    <summary>${title}</summary>
                    <div class="hint-content">${content}</div>
                </details>`;
            });
        }

        // Add solution
        html += `<details>
            <summary>✅ Solution</summary>
            <div class="hint-content"><pre>${escapeHtml(variant.solution)}</pre></div>
        </details>`;

        // Add personal notes
        html += renderPersonalNotes(challenge.id, variant.id);

        // Add documentation links if available
        if (challenge.docLinks && challenge.docLinks.length > 0) {
            html += `<details>
                <summary>📚 Documentation</summary>
                <div class="hint-content">
                    <p style="margin-bottom: 0.5rem; color: var(--text-dim);">Relevant Go docs:</p>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        ${challenge.docLinks.map(link =>
                            `<li><a href="${link.url}" target="_blank" rel="noopener" style="color: var(--cyan);">${link.title}</a>${link.note ? ` <span style="color: var(--text-dim);">— ${link.note}</span>` : ''}</li>`
                        ).join('\n                        ')}
                    </ul>
                </div>
            </details>`;
        }

        // Add expected output
        html += `<div class="expected">
            <div class="expected-title">Expected Output</div>
            <pre>${variant.testCases.map(tc =>
                `${tc.input} → ${tc.output}`
            ).join('\n')}</pre>
        </div></div>`;

        return html;
    }

    function renderChallenges() {
        const container = document.getElementById('challenges-container');
        if (!container || !variantsData || !variantsData.challenges) return;

        // Filter challenges by concept if a filter is active
        const challenges = currentConceptFilter
            ? variantsData.challenges.filter(c => c.concept === currentConceptFilter)
            : variantsData.challenges;

        let html = '';
        let currentBlock = 0;
        const blockNames = { 1: 'Core Patterns', 2: 'Building & Filtering', 3: 'Two-Pointer Foundation', 4: 'Two-Pointer Application' };

        if (challenges.length === 0) {
            html = '<p style="color: var(--text-dim); text-align: center;">No challenges match this filter.</p>';
            container.innerHTML = html;
            return;
        }

        // When filtering by concept, show 6 random variants for practice
        if (currentConceptFilter) {
            // Collect all variants with their challenge info
            const allVariants = [];
            challenges.forEach(challenge => {
                const difficulty = getExerciseDifficulty(challenge);
                challenge.variants.forEach(variant => {
                    allVariants.push({ variant, challenge, difficulty: getDifficultyStars(difficulty) });
                });
            });

            // Shuffle and pick 6
            const shuffled = allVariants.sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, 6);

            html += `<p style="color: var(--orange); font-size: 0.9rem; margin: 0 0 1rem; font-weight: 600;">Practicing: ${currentConceptFilter} (${selected.length} of ${allVariants.length} variants)</p>`;

            // Add pattern primer if available for this concept
            const firstChallenge = challenges[0];
            if (firstChallenge && firstChallenge.patternPrimer) {
                const pp = firstChallenge.patternPrimer;
                html += `<details style="border: 2px solid var(--orange); border-radius: 6px; padding: 1rem; margin-bottom: 1.5rem;">
                    <summary style="color: var(--orange); font-weight: 600; cursor: pointer;">Pattern Primer: ${currentConceptFilter} (brute force + best approach)</summary>
                    <div class="hint-content" style="margin-top: 1rem;">
                        <div style="margin-bottom: 0.75rem;">
                            <strong>Brute force:</strong> ${pp.bruteForce}
                        </div>
                        <div style="margin-bottom: 0.75rem;">
                            <strong>Best approach:</strong> ${pp.bestApproach}
                        </div>
                        <div>
                            <strong>Typical:</strong> ${pp.typical}
                        </div>
                    </div>
                </details>`;
            }

            selected.forEach((item, idx) => {
                html += renderSingleChallenge(idx + 1, item.variant, item.challenge, item.difficulty);
            });

            container.innerHTML = html;
            container.querySelectorAll('.exercise').forEach(initThinkingTimer);
            return;
        }

        // Calculate distribution stats
        const counts = { 1: 0, 2: 0, 3: 0 };
        challenges.forEach(challenge => {
            const variant = currentChallengeVariants[challenge.id];
            if (variant) {
                const diff = getVariantDifficulty(variant, challenge);
                counts[diff] = (counts[diff] || 0) + 1;
            }
        });

        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        if (total > 0) {
            let infoText = '';
            if (difficultyMode === 'easy') {
                infoText = `⭐ Easy mode: ${total} easy challenge${total !== 1 ? 's' : ''}`;
            } else if (difficultyMode === 'hard') {
                infoText = `⭐⭐⭐ Hard mode: ${total} hard challenge${total !== 1 ? 's' : ''}`;
            } else if (difficultyMode === 'balanced') {
                infoText = `⚖️ Distribution: ⭐ ${counts[1]} (${Math.round(counts[1]/total*100)}%) | ⭐⭐ ${counts[2]} (${Math.round(counts[2]/total*100)}%) | ⭐⭐⭐ ${counts[3]} (${Math.round(counts[3]/total*100)}%)`;
            } else if (difficultyMode === 'progressive') {
                infoText = `📈 Progressive: ${total} challenges with increasing difficulty`;
            } else {
                infoText = `🎲 Mixed: ${total} random challenges`;
            }

            if (infoText) {
                html += `<div class="shuffle-info">${infoText}</div>`;
            }
        }

        let displayNum = 1;
        challenges.forEach((challenge, idx) => {
            const variant = currentChallengeVariants[challenge.id];

            // Skip if no variant was selected (due to difficulty filter)
            if (!variant) return;

            const difficultyNum = getExerciseDifficulty(challenge);
            const difficultyStars = getDifficultyStars(difficultyNum);

            // Add block header if new block
            if (challenge.block !== currentBlock) {
                currentBlock = challenge.block;
                html += `<p style="color: var(--cyan); font-size: 0.85rem; margin: 1.5rem 0 0.5rem; font-weight: 600;">Block ${currentBlock}: ${blockNames[currentBlock] || ''} <span style="opacity: 0.7">${difficultyStars}</span></p>`;
            }

            html += renderSingleChallenge(displayNum, variant, challenge, difficultyStars);
            displayNum++;
        });

        container.innerHTML = html;
        container.querySelectorAll('.exercise').forEach(ex => {
            initThinkingTimer(ex);
            initPersonalNotes(ex);
        });
    }

    function shuffleVariants() {
        if (!variantsData) return;

        // Pick a DIFFERENT random variant for each exercise
        variantsData.advanced.forEach(exercise => {
            const currentVariant = currentVariants[exercise.id];
            const availableVariants = exercise.variants.filter(v =>
                !currentVariant || v.id !== currentVariant.id
            );
            // If all variants exhausted (only 1), just pick randomly
            const pool = availableVariants.length > 0 ? availableVariants : exercise.variants;
            const randomIndex = Math.floor(Math.random() * pool.length);
            currentVariants[exercise.id] = pool[randomIndex];
        });

        renderExercises();

        // Visual feedback - flash the button
        const btn = document.getElementById('shuffle-btn');
        if (btn) {
            btn.textContent = '✓ Shuffled!';
            btn.style.background = 'var(--green-bright)';
            btn.style.color = 'var(--bg-dark)';
            btn.style.borderColor = 'var(--green-bright)';
            setTimeout(() => {
                btn.textContent = '🎲 Shuffle Variants';
                btn.style.background = 'var(--bg-card)';
                btn.style.color = 'var(--purple)';
                btn.style.borderColor = 'var(--purple)';
            }, 800);
        }
    }

    function renderExercises() {
        const container = document.getElementById('advanced-exercises-container');
        if (!container) return;

        let html = '';

        // Render each advanced exercise with its pre-exercises
        variantsData.advanced.forEach((exercise, idx) => {
            const variant = currentVariants[exercise.id];
            const shared = window.sharedContent[exercise.id];
            const num = idx + 1;
            const difficultyStars = getDifficultyStars(getExerciseDifficulty(exercise));

            // Render pre-exercises for this specific advanced exercise (if any)
            html += renderPreExercisesFor(exercise.id, num, variant.title);

            html += `<div class="exercise">
                <h4>Advanced ${num}: ${variant.title} <span style="font-size: 0.75rem; opacity: 0.6;">${difficultyStars}</span></h4>
                <p>${variant.description}</p>`;

            // Add pre-reading if available
            if (shared && shared.preReading) {
                html += `<details>
                    <summary>${shared.preReading.title}</summary>
                    <div class="hint-content">${shared.preReading.content}</div>
                </details>`;
            }

            // Add hints
            if (shared && shared.hints) {
                shared.hints.forEach(hint => {
                    html += `<details>
                        <summary>${hint.title}</summary>
                        <div class="hint-content">${hint.content}</div>
                    </details>`;
                });
            }

            // Add solution
            html += `<details>
                <summary>✅ Solution with Explanation</summary>
                <div class="hint-content">
                    <pre>${escapeHtml(variant.solution)}</pre>
                    ${variant.solutionNotes ? `<br>${variant.solutionNotes}` : ''}
                </div>
            </details>`;

            // Add personal notes
            html += renderPersonalNotes(advanced.id, variant.id);

            // Add documentation links if available
            if (shared && shared.docLinks && shared.docLinks.length > 0) {
                html += `<details>
                    <summary>📚 Documentation</summary>
                    <div class="hint-content">
                        <p style="margin-bottom: 0.5rem; color: var(--text-dim);">Relevant Go docs to explore:</p>
                        <ul style="margin: 0; padding-left: 1.5rem;">
                            ${shared.docLinks.map(link =>
                                `<li><a href="${link.url}" target="_blank" rel="noopener" style="color: var(--purple);">${link.title}</a>${link.note ? ` <span style="color: var(--text-dim);">— ${link.note}</span>` : ''}</li>`
                            ).join('\n                            ')}
                        </ul>
                    </div>
                </details>`;
            }

            // Add expected output
            html += `<div class="expected">
                <div class="expected-title">Expected Output</div>
                <pre>${variant.testCases.map(tc =>
                    `${variant.functionSignature.match(/func (\w+)/)[1]}(${tc.input}) → ${tc.output}${tc.note ? ` (${tc.note})` : ''}`
                ).join('\n')}</pre>
            </div>`;

            html += '</div>';

            // Add section divider (except after last exercise)
            if (idx < variantsData.advanced.length - 1) {
                html += `<hr style="border: none; border-top: 2px dashed var(--bg-lighter); margin: 3rem 0;">`;
            }
        });

        container.innerHTML = html;
        container.querySelectorAll('.exercise').forEach(ex => {
            initThinkingTimer(ex);
            initPersonalNotes(ex);
        });
    }

    function renderPreExercisesFor(advancedId, advancedNum, advancedTitle) {
        if (!variantsData.preExercises || !variantsData.preExercises[advancedId]) {
            return '';
        }

        const preEx = variantsData.preExercises[advancedId];
        let html = `
            <div style="background: linear-gradient(135deg, rgba(157, 0, 255, 0.15), rgba(157, 0, 255, 0.05)); border: 2px solid var(--purple); border-radius: 8px; padding: 1.5rem; margin: 2rem 0 1rem 0;">
                <div style="color: var(--purple); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">⬇️ Warm up for Advanced ${advancedNum}</div>
                <div style="color: var(--text); font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">🎯 ${preEx.title}</div>
                <p style="color: var(--text-dim); margin: 0;">${preEx.description}</p>
            </div>`;

        preEx.exercises.forEach((ex, idx) => {
            html += `<div class="exercise" style="border-color: var(--purple); margin-bottom: 1.5rem;">
                <h4 style="color: var(--purple);">Warm-up ${advancedNum}.${idx + 1}: ${ex.title}</h4>
                <p>${ex.problem}</p>`;

            // Add hints
            ex.hints.forEach(hint => {
                html += `<details>
                    <summary>💡 ${hint.title}</summary>
                    <div class="hint-content">${hint.content}</div>
                </details>`;
            });

            // Add solution
            html += `<details>
                <summary>✅ Solution</summary>
                <div class="hint-content">
                    <pre>${escapeHtml(ex.solution)}</pre>
                    <br><strong>Key insight:</strong> ${ex.keyInsight}
                </div>
            </details>`;

            // Add expected output
            html += `<div class="expected">
                <div class="expected-title">Expected Output</div>
                <pre>${escapeHtml(ex.expectedOutput)}</pre>
            </div>`;

            html += '</div>';
        });

        // Add transition to main exercise
        html += `
            <div style="text-align: center; margin: 1.5rem 0; color: var(--purple); font-weight: 600;">
                ⬇️ Now try the full exercise ⬇️
            </div>`;

        return html;
    }

    // Load variants when module data is ready
    // If data is already loaded (sync script), load immediately
    // Otherwise wait for the moduleDataLoaded event (async loader)
    function initWhenReady() {
        if (window.variantsDataEmbedded) {
            loadVariants();
        } else {
            window.addEventListener('moduleDataLoaded', loadVariants, { once: true });
        }
    }

    document.addEventListener('DOMContentLoaded', initWhenReady);

    // Style the shuffle buttons hover
    document.addEventListener('DOMContentLoaded', () => {
        const advBtn = document.getElementById('shuffle-btn');
        if (advBtn) {
            advBtn.addEventListener('mouseenter', () => {
                advBtn.style.background = 'var(--purple)';
                advBtn.style.color = 'white';
            });
            advBtn.addEventListener('mouseleave', () => {
                advBtn.style.background = 'var(--bg-card)';
                advBtn.style.color = 'var(--purple)';
            });
        }

        const chalBtn = document.getElementById('shuffle-challenges-btn');
        if (chalBtn) {
            chalBtn.addEventListener('mouseenter', () => {
                chalBtn.style.background = 'var(--orange)';
                chalBtn.style.color = 'white';
            });
            chalBtn.addEventListener('mouseleave', () => {
                chalBtn.style.background = 'var(--bg-card)';
                chalBtn.style.color = 'var(--orange)';
            });
        }
    });

    // Expose functions globally for onclick handlers
    window.shuffleWarmups = shuffleWarmups;
    window.shuffleChallenges = shuffleChallenges;
    window.shuffleVariants = shuffleVariants;
})();