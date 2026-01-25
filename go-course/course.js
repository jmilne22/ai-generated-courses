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
    `;
    document.head.appendChild(timerStyles);

    // State for tracking current variants
    let variantsData = null;
    const currentVariants = {};
    const currentWarmupVariants = {};
    const currentIntermediateVariants = {};
    const currentChallengeVariants = {};
    let currentPatternFilter = null; // null = show all

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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

    function loadVariants() {
        variantsData = window.variantsDataEmbedded;
        shuffleWarmups();
        shuffleIntermediate();
        shuffleChallenges();
        setupConceptFilter();
        shuffleVariants();
    }

    function shuffleWarmups() {
        if (!variantsData || !variantsData.warmups) return;

        // Pick a random variant for each warmup
        variantsData.warmups.forEach(warmup => {
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

        let html = '';

        variantsData.warmups.forEach((warmup, idx) => {
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

            html += '</div>';
        });

        container.innerHTML = html;
        container.querySelectorAll('.exercise').forEach(initThinkingTimer);
    }

    function shuffleIntermediate() {
        if (!variantsData || !variantsData.intermediate) return;

        // Pick a random variant for each intermediate exercise
        variantsData.intermediate.forEach(exercise => {
            const current = currentIntermediateVariants[exercise.id];
            const available = exercise.variants.filter(v => !current || v.id !== current.id);
            const pool = available.length > 0 ? available : exercise.variants;
            currentIntermediateVariants[exercise.id] = pool[Math.floor(Math.random() * pool.length)];
        });

        renderIntermediate();

        // Visual feedback
        const btn = document.getElementById('shuffle-intermediate-btn');
        if (btn) {
            btn.textContent = '✓ Shuffled!';
            btn.style.background = 'var(--cyan)';
            btn.style.color = 'var(--bg-dark)';
            setTimeout(() => {
                btn.textContent = '🎲 Shuffle';
                btn.style.background = 'var(--bg-card)';
                btn.style.color = 'var(--cyan)';
            }, 800);
        }
    }

    function renderIntermediate() {
        const container = document.getElementById('intermediate-container');
        if (!container || !variantsData || !variantsData.intermediate) return;

        let html = '';

        variantsData.intermediate.forEach((exercise, idx) => {
            const variant = currentIntermediateVariants[exercise.id];
            const num = idx + 1;

            const conceptLink = window.conceptLinks[exercise.concept];
            const conceptHtml = conceptLink
                ? `<a href="${conceptLink}" class="concept-link" style="color: var(--cyan); opacity: 0.8;">(${exercise.concept} ↗)</a>`
                : `<span style="font-size: 0.75rem; opacity: 0.6; color: var(--text-dim);">(${exercise.concept})</span>`;

            html += `<div class="exercise">
                <h4>Intermediate ${num}: ${variant.title} ${conceptHtml}</h4>
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
        container.querySelectorAll('.exercise').forEach(initThinkingTimer);
    }

    function shuffleChallenges() {
        if (!variantsData || !variantsData.challenges) return;

        // Pick a random variant for each challenge
        variantsData.challenges.forEach(challenge => {
            const current = currentChallengeVariants[challenge.id];
            const available = challenge.variants.filter(v => !current || v.id !== current.id);
            const pool = available.length > 0 ? available : challenge.variants;
            currentChallengeVariants[challenge.id] = pool[Math.floor(Math.random() * pool.length)];
        });

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

    function getUniquePatterns() {
        if (!variantsData || !variantsData.challenges) return [];

        const patternsById = new Map();
        variantsData.challenges.forEach(c => {
            const patternId = c.patternId || c.concept;
            if (!patternId) return;

            const patternLabel = c.patternLabel || c.concept || patternId;
            if (!patternsById.has(patternId)) {
                patternsById.set(patternId, { patternId, patternLabel });
            }
        });

        const patterns = Array.from(patternsById.values());

        // Prefer JSON-defined learning-path ordering
        const order = variantsData?.meta?.patternOrder;
        if (Array.isArray(order) && order.length > 0) {
            const index = new Map(order.map((id, i) => [id, i]));
            patterns.sort((a, b) => {
                const ai = index.has(a.patternId) ? index.get(a.patternId) : Number.MAX_SAFE_INTEGER;
                const bi = index.has(b.patternId) ? index.get(b.patternId) : Number.MAX_SAFE_INTEGER;
                if (ai !== bi) return ai - bi;
                return a.patternLabel.localeCompare(b.patternLabel);
            });
            return patterns;
        }

        // Fallback: alphabetical by label
        patterns.sort((a, b) => a.patternLabel.localeCompare(b.patternLabel));
        return patterns;
    }

    function setupConceptFilter() {
        const container = document.getElementById('challenges-container');
        if (!container) return;

        // Check if filter already exists
        if (document.getElementById('concept-filter')) return;

        const patterns = getUniquePatterns();
        if (patterns.length === 0) return;

        const filterDiv = document.createElement('div');
        filterDiv.id = 'concept-filter';
        filterDiv.className = 'concept-filter';
        filterDiv.innerHTML = `
            <span class="concept-filter-label">🎯 Focus on a specific pattern:</span>
            <div class="concept-filter-buttons">
                <button class="concept-btn active" data-pattern="">All Patterns</button>
                ${patterns.map(p => `<button class="concept-btn" data-pattern="${p.patternId}">${p.patternLabel}</button>`).join('')}
            </div>
        `;

        container.parentNode.insertBefore(filterDiv, container);

        // Add click handlers
        filterDiv.querySelectorAll('.concept-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                filterDiv.querySelectorAll('.concept-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentPatternFilter = btn.dataset.pattern || null;
                shuffleChallenges();
            });
        });
    }

    function renderSingleChallenge(num, variant, challenge, difficulty) {
        let html = `<div class="exercise">
            <h4>Challenge ${num}: ${variant.title} <span style="font-size: 0.75rem; opacity: 0.6;">${difficulty}</span></h4>
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

    function starsForTier(tier) {
        if (tier === 'easy') return '⭐';
        if (tier === 'hard') return '⭐⭐⭐';
        return '⭐⭐';
    }

    function renderPatternPrimer(patternId, fallbackLabel) {
        const info = variantsData?.meta?.patternInfo?.[patternId];
        if (!info) return '';

        const label = info.label || fallbackLabel || patternId;
        const brute = info.bruteForce || '';
        const opt = info.optimized || '';
        const comp = info.complexity;

        return `
            <details style="background: linear-gradient(135deg, rgba(255, 126, 25, 0.12), rgba(255, 126, 25, 0.03)); border: 1px solid rgba(255, 126, 25, 0.35); border-radius: 10px; padding: 0.85rem 1.1rem; margin: 0 0 1.25rem 0;">
                <summary style="cursor: pointer; color: var(--orange); font-weight: 700;">Pattern Primer: ${label} (brute force + best approach)</summary>
                <div class="hint-content" style="padding-top: 0.75rem;">
                    <div style="color: var(--text); margin: 0.25rem 0;"><strong>Brute force:</strong> <span style="color: var(--text-dim);">${brute}</span></div>
                    <div style="color: var(--text); margin: 0.25rem 0;"><strong>Best approach:</strong> <span style="color: var(--text-dim);">${opt}</span></div>
                    ${comp ? `<div style="color: var(--text); margin: 0.25rem 0;"><strong>Typical:</strong> <span style="color: var(--text-dim);">${comp}</span></div>` : ''}
                </div>
            </details>
        `;
    }

    function renderChallenges() {
        const container = document.getElementById('challenges-container');
        if (!container || !variantsData || !variantsData.challenges) return;

        // Filter challenges by pattern if a filter is active
        const challenges = currentPatternFilter
            ? variantsData.challenges.filter(c => (c.patternId || c.concept) === currentPatternFilter)
            : variantsData.challenges;

        let html = '';
        let currentBlock = 0;
        const blocks = variantsData?.meta?.challengeBlocks || {};
        const blockNames = Object.keys(blocks).length > 0
            ? Object.fromEntries(Object.entries(blocks).map(([k, v]) => [Number(k), v.name]))
            : { 1: 'Core Patterns', 2: 'Building & Filtering', 3: 'Two-Pointer Foundation', 4: 'Two-Pointer Application' };
        const blockDifficulty = Object.keys(blocks).length > 0
            ? Object.fromEntries(Object.entries(blocks).map(([k, v]) => [Number(k), v.difficulty]))
            : { 1: '⭐', 2: '⭐⭐', 3: '⭐⭐', 4: '⭐⭐⭐' };

        if (challenges.length === 0) {
            html = '<p style="color: var(--text-dim); text-align: center;">No challenges match this filter.</p>';
            container.innerHTML = html;
            return;
        }

        // When filtering by pattern, show 6 mixed-difficulty variants for practice
        if (currentPatternFilter) {
            // Collect all variants with their challenge info
            const allVariants = [];
            challenges.forEach(challenge => {
                challenge.variants.forEach(variant => {
                    allVariants.push({
                        variant,
                        challenge,
                        difficulty: blockDifficulty[challenge.block],
                        tier: variant.tier || 'medium'
                    });
                });
            });

            // Pick 6 with a guaranteed mix: at least 1 easy, 1 medium, 1 hard
            const pickRandom = (arr, n) => arr.slice().sort(() => Math.random() - 0.5).slice(0, n);
            const key = (x) => `${x.challenge.id}:${x.variant.id}`;

            const easyPool = allVariants.filter(v => v.tier === 'easy');
            const medPool = allVariants.filter(v => v.tier === 'medium');
            const hardPool = allVariants.filter(v => v.tier === 'hard');

            let selected = [];
            selected = selected.concat(pickRandom(easyPool, Math.min(1, easyPool.length)));
            selected = selected.concat(pickRandom(medPool, Math.min(1, medPool.length)));
            selected = selected.concat(pickRandom(hardPool, Math.min(1, hardPool.length)));

            const selectedSet = new Set(selected.map(key));
            const remaining = allVariants.filter(x => !selectedSet.has(key(x)));
            selected = selected.concat(pickRandom(remaining, Math.max(0, 6 - selected.length)));
            selected = selected.slice(0, 6);

            const practicingLabel = challenges[0]?.patternLabel || challenges[0]?.concept || currentPatternFilter;
            html += `<p style="color: var(--orange); font-size: 0.9rem; margin: 0 0 1rem; font-weight: 600;">Practicing: ${practicingLabel} (${selected.length} of ${allVariants.length} variants)</p>`;

            html += renderPatternPrimer(currentPatternFilter, practicingLabel);

            selected.forEach((item, idx) => {
                // In focus mode, show difficulty by tier (not by block)
                html += renderSingleChallenge(idx + 1, item.variant, item.challenge, starsForTier(item.tier));
            });

            container.innerHTML = html;
            container.querySelectorAll('.exercise').forEach(initThinkingTimer);
            return;
        }

        challenges.forEach((challenge, idx) => {
            const variant = currentChallengeVariants[challenge.id];
            const num = idx + 1;
            const difficulty = blockDifficulty[challenge.block];

            // Add block header if new block
            if (challenge.block !== currentBlock) {
                currentBlock = challenge.block;
                html += `<p style="color: var(--cyan); font-size: 0.85rem; margin: 1.5rem 0 0.5rem; font-weight: 600;">Block ${currentBlock}: ${blockNames[currentBlock]} <span style="opacity: 0.7">${difficulty}</span></p>`;
            }

            html += renderSingleChallenge(num, variant, challenge, difficulty);
        });

        container.innerHTML = html;
        container.querySelectorAll('.exercise').forEach(initThinkingTimer);
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

            // Render pre-exercises for this specific advanced exercise (if any)
            html += renderPreExercisesFor(exercise.id, num, variant.title);

            html += `<div class="exercise">
                <h4>Advanced ${num}: ${variant.title}</h4>
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
        container.querySelectorAll('.exercise').forEach(initThinkingTimer);
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
    window.shuffleIntermediate = shuffleIntermediate;
    window.shuffleChallenges = shuffleChallenges;
    window.shuffleVariants = shuffleVariants;
})();
