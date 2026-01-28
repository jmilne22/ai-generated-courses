/**
 * Go Grind - Study Mode
 * Reading/studying content for rewards and temporary buffs.
 */
(function() {
    'use strict';

    // Study session state
    var currentSession = null;
    var studyTimer = null;

    // Configuration
    var CONFIG = {
        minStudyTimeFactor: 0.6, // 60% of estimated read time minimum
        baseXPPerMinute: 10,
        buffDuration: 5, // Number of exercises the buff applies to
        buffMultiplier: 1.15 // 15% XP bonus
    };

    // Active buffs storage
    var activeBuffs = [];

    // Load buffs from localStorage
    function loadBuffs() {
        try {
            var saved = localStorage.getItem('go-game-study-buffs');
            if (saved) {
                activeBuffs = JSON.parse(saved);
                // Clean up expired buffs
                activeBuffs = activeBuffs.filter(function(buff) {
                    return buff.remaining > 0;
                });
                saveBuffs();
            }
        } catch (e) {
            activeBuffs = [];
        }
    }

    function saveBuffs() {
        try {
            localStorage.setItem('go-game-study-buffs', JSON.stringify(activeBuffs));
        } catch (e) {
            console.warn('Study: Could not save buffs');
        }
    }

    /**
     * Start a study session for an article
     */
    function startStudySession(article) {
        if (!article) return;

        // Parse read time (e.g., "5 min" -> 5)
        var readTimeMinutes = parseReadTime(article.readTime) || 5;
        var minTimeSeconds = Math.floor(readTimeMinutes * 60 * CONFIG.minStudyTimeFactor);

        currentSession = {
            articleId: article.id,
            articleTitle: article.title,
            skill: article.skill,
            startTime: Date.now(),
            minTimeSeconds: minTimeSeconds,
            readTimeMinutes: readTimeMinutes,
            completed: false
        };

        renderStudyOverlay(article);
        startStudyTimer();
    }

    function parseReadTime(readTime) {
        if (!readTime) return 5;
        var match = readTime.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 5;
    }

    function startStudyTimer() {
        if (studyTimer) clearInterval(studyTimer);

        studyTimer = setInterval(function() {
            if (!currentSession) {
                clearInterval(studyTimer);
                return;
            }

            updateStudyTimerDisplay();
        }, 1000);
    }

    function updateStudyTimerDisplay() {
        var timerEl = document.getElementById('study-timer');
        var completeBtn = document.getElementById('study-complete-btn');
        if (!timerEl || !currentSession) return;

        var elapsed = Math.floor((Date.now() - currentSession.startTime) / 1000);
        var remaining = Math.max(0, currentSession.minTimeSeconds - elapsed);

        var mins = Math.floor(remaining / 60);
        var secs = remaining % 60;

        if (remaining > 0) {
            timerEl.textContent = 'Minimum time remaining: ' + mins + ':' + (secs < 10 ? '0' : '') + secs;
            timerEl.classList.remove('complete');
            if (completeBtn) {
                completeBtn.disabled = true;
                completeBtn.textContent = 'Keep Reading...';
            }
        } else {
            var totalElapsed = Math.floor(elapsed / 60);
            timerEl.textContent = 'Time studied: ' + totalElapsed + ' min - Ready to complete!';
            timerEl.classList.add('complete');
            if (completeBtn) {
                completeBtn.disabled = false;
                completeBtn.textContent = 'Complete Study Session';
            }
        }
    }

    function renderStudyOverlay(article) {
        var overlay = document.createElement('div');
        overlay.className = 'study-overlay';
        overlay.id = 'study-overlay';

        var title = 'Library Study Session';
        var subtitle = 'Studying: ' + article.title;

        var html = '<div class="study-modal">';

        // Header
        html += '<div class="study-header">';
        html += '<h2>' + title + '</h2>';
        html += '<p class="study-subtitle">' + subtitle + '</p>';
        html += '</div>';

        // Timer
        html += '<div class="study-timer-section">';
        html += '<div id="study-timer" class="study-timer">Calculating...</div>';
        html += '</div>';

        // Content area
        html += '<div class="study-content">';
        if (article.content) {
            html += parseMarkdown(article.content);
        } else if (article.sections) {
            article.sections.forEach(function(section) {
                if (section.title) {
                    html += '<h3>' + escapeHtml(section.title) + '</h3>';
                }
                if (section.content) {
                    html += parseMarkdown(section.content);
                }
                if (section.code) {
                    html += '<pre><code>' + escapeHtml(section.code) + '</code></pre>';
                }
            });
        } else {
            html += '<p>Read through this material carefully to earn rewards.</p>';
        }
        html += '</div>';

        // Reward preview
        var estimatedXP = Math.floor(currentSession.readTimeMinutes * CONFIG.baseXPPerMinute);
        var skillLabel = article.skill || 'General';

        html += '<div class="study-rewards-preview">';
        html += '<div class="reward-label">Study Rewards:</div>';
        html += '<div class="reward-item">+' + estimatedXP + ' XP (' + skillLabel + ')</div>';
        html += '<div class="reward-item">+' + CONFIG.buffDuration + ' exercises with ' + Math.round((CONFIG.buffMultiplier - 1) * 100) + '% XP bonus</div>';
        html += '</div>';

        // Buttons
        html += '<div class="study-actions">';
        html += '<button id="study-complete-btn" class="study-btn primary" disabled>Keep Reading...</button>';
        html += '<button id="study-cancel-btn" class="study-btn secondary">Cancel</button>';
        html += '</div>';

        html += '</div>';

        overlay.innerHTML = html;
        document.body.appendChild(overlay);

        // Bind events
        document.getElementById('study-complete-btn').addEventListener('click', completeStudySession);
        document.getElementById('study-cancel-btn').addEventListener('click', cancelStudySession);

        // Initial timer update
        updateStudyTimerDisplay();
    }

    function completeStudySession() {
        if (!currentSession) return;

        var elapsed = Math.floor((Date.now() - currentSession.startTime) / 1000);
        if (elapsed < currentSession.minTimeSeconds) {
            return; // Can't complete yet
        }

        // Calculate rewards
        var minutesStudied = Math.max(currentSession.readTimeMinutes, Math.floor(elapsed / 60));
        var xpEarned = Math.floor(minutesStudied * CONFIG.baseXPPerMinute);

        // Award XP
        var skillKey = null;
        if (currentSession.skill && window.GameState) {
            skillKey = window.GameState.conceptToSkillKey(currentSession.skill);
            if (skillKey) {
                // Update skill XP
                var skills = window.GameState.getSkills();
                if (skills[skillKey]) {
                    skills[skillKey].xp += xpEarned;
                    // Check for level up
                    while (skills[skillKey].xp >= window.GameState.skillXPForLevel(skills[skillKey].level) && skills[skillKey].level < 99) {
                        skills[skillKey].xp -= window.GameState.skillXPForLevel(skills[skillKey].level);
                        skills[skillKey].level++;
                    }
                }
            }
        }

        // Add player XP
        if (window.GameState) {
            window.GameState.addBonusXP(xpEarned, 'Study: ' + currentSession.articleTitle);
        }

        // Add buff
        if (skillKey) {
            activeBuffs.push({
                skill: skillKey,
                multiplier: CONFIG.buffMultiplier,
                remaining: CONFIG.buffDuration,
                source: currentSession.articleTitle
            });
            saveBuffs();
        }

        // Show completion overlay
        showStudyComplete(xpEarned, skillKey);

        // Clean up
        clearInterval(studyTimer);
        currentSession = null;

        // Remove study overlay
        var overlay = document.getElementById('study-overlay');
        if (overlay) overlay.remove();

        // Update UI
        if (window.App) window.App.updatePlayerCard();
    }

    function showStudyComplete(xpEarned, skillKey) {
        var overlay = document.createElement('div');
        overlay.className = 'grade-overlay study-complete-overlay';

        var skillDefs = window.GameState ? window.GameState.getSkillDefs() : {};
        var skillLabel = skillDefs[skillKey] ? skillDefs[skillKey].label : (skillKey || 'General');

        var html = '<div class="study-complete-modal">';
        html += '<div class="study-complete-icon">\u{2728}</div>';
        html += '<h2>Study Complete!</h2>';
        html += '<div class="study-complete-rewards">';
        html += '<div class="reward-line">+' + xpEarned + ' XP (' + skillLabel + ')</div>';
        html += '<div class="reward-line buff">+' + CONFIG.buffDuration + ' exercises with ' + Math.round((CONFIG.buffMultiplier - 1) * 100) + '% bonus</div>';
        html += '</div>';
        html += '<p class="study-complete-hint">Your understanding has deepened. Practice to reinforce!</p>';
        html += '<button class="study-btn primary" onclick="this.closest(\'.study-complete-overlay\').remove()">Continue</button>';
        html += '</div>';

        overlay.innerHTML = html;
        document.body.appendChild(overlay);

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    function cancelStudySession() {
        if (studyTimer) clearInterval(studyTimer);
        currentSession = null;

        var overlay = document.getElementById('study-overlay');
        if (overlay) overlay.remove();
    }

    /**
     * Check and apply buff to exercise completion
     */
    function applyStudyBuff(skillKey, baseXP) {
        var buffApplied = null;

        for (var i = 0; i < activeBuffs.length; i++) {
            var buff = activeBuffs[i];
            if (buff.skill === skillKey && buff.remaining > 0) {
                // Apply buff
                var bonusXP = Math.floor(baseXP * (buff.multiplier - 1));
                buff.remaining--;

                buffApplied = {
                    bonusXP: bonusXP,
                    source: buff.source,
                    remaining: buff.remaining
                };

                // Clean up if exhausted
                if (buff.remaining <= 0) {
                    activeBuffs.splice(i, 1);
                }

                saveBuffs();
                break;
            }
        }

        return buffApplied;
    }

    /**
     * Get active buff for a skill
     */
    function getActiveBuff(skillKey) {
        for (var i = 0; i < activeBuffs.length; i++) {
            if (activeBuffs[i].skill === skillKey && activeBuffs[i].remaining > 0) {
                return activeBuffs[i];
            }
        }
        return null;
    }

    /**
     * Get all active buffs
     */
    function getAllBuffs() {
        return activeBuffs.filter(function(buff) {
            return buff.remaining > 0;
        });
    }

    // Simple markdown parser (duplicated from library for independence)
    function parseMarkdown(text) {
        if (!text) return '';
        var html = escapeHtml(text);

        // Code blocks
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, function(match, lang, code) {
            return '<pre><code class="language-' + lang + '">' + code.trim() + '</code></pre>';
        });

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Headers
        html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>');
        html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');

        // Bold
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Lists
        html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

        // Paragraphs
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';
        html = html.replace(/<p>\s*<\/p>/g, '');

        return html;
    }

    function escapeHtml(text) {
        if (!text) return '';
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize
    loadBuffs();

    // Listen for exercise completions to apply buffs
    window.addEventListener('gradeCalculated', function(e) {
        var detail = e.detail;
        // Buff application would need to be integrated into the grade calculation
        // This is informational - the actual XP is already calculated
    });

    // Public API
    window.Study = {
        startSession: startStudySession,
        completeSession: completeStudySession,
        cancelSession: cancelStudySession,
        applyBuff: applyStudyBuff,
        getActiveBuff: getActiveBuff,
        getAllBuffs: getAllBuffs,
        isInSession: function() { return currentSession !== null; },
        getSession: function() { return currentSession; }
    };

})();
