/**
 * Go Grind - Overlays & Animations
 * All-Out Attack, grade screen, level-up, skill-up, combo, XP floats.
 */
(function() {
    'use strict';

    var comboCount = 0;
    var comboTimer = null;
    var COMBO_TIMEOUT = 120000;

    // === Screen Shake ===
    function screenShake(intensity, duration) {
        var main = document.querySelector('.main-panel');
        if (!main) return;
        main.classList.add('screen-shake');
        main.style.setProperty('--shake-intensity', intensity + 'px');
        setTimeout(function() { main.classList.remove('screen-shake'); }, duration || 300);
    }

    // === Particle Burst ===
    function particleBurst(x, y, count, color) {
        var container = document.createElement('div');
        container.className = 'particle-container';
        container.style.left = x + 'px';
        container.style.top = y + 'px';
        document.body.appendChild(container);

        for (var i = 0; i < (count || 12); i++) {
            var p = document.createElement('div');
            p.className = 'particle';
            var angle = (i / (count || 12)) * 360;
            var dist = 40 + Math.random() * 80;
            var dx = Math.cos(angle * Math.PI / 180) * dist;
            var dy = Math.sin(angle * Math.PI / 180) * dist;
            p.style.setProperty('--dx', dx + 'px');
            p.style.setProperty('--dy', dy + 'px');
            p.style.background = color || 'var(--red)';
            p.style.width = (3 + Math.random() * 5) + 'px';
            p.style.height = p.style.width;
            container.appendChild(p);
        }

        setTimeout(function() { container.remove(); }, 1000);
    }

    // === Combo System ===
    function incrementCombo() {
        comboCount++;
        clearTimeout(comboTimer);
        comboTimer = setTimeout(function() { comboCount = 0; removeComboDisplay(); }, COMBO_TIMEOUT);
        if (comboCount > 1) showComboDisplay();
    }

    function showComboDisplay() {
        var existing = document.querySelector('.combo-display');
        if (existing) existing.remove();

        var el = document.createElement('div');
        el.className = 'combo-display';
        el.innerHTML = '<div class="combo-count">' + comboCount + 'x</div><div class="combo-label">COMBO</div>';
        document.body.appendChild(el);
        setTimeout(function() { if (el.parentNode) el.remove(); }, 3000);
    }

    function removeComboDisplay() {
        var el = document.querySelector('.combo-display');
        if (el) el.remove();
    }

    // === XP Float ===
    function showXPFloat(xpAmount, sourceEl) {
        var el = document.createElement('div');
        el.className = 'xp-float';
        el.textContent = '+' + xpAmount + ' XP';

        if (sourceEl) {
            var rect = sourceEl.getBoundingClientRect();
            el.style.left = rect.left + rect.width / 2 - 30 + 'px';
            el.style.top = rect.top - 10 + 'px';
        } else {
            el.style.left = '50%';
            el.style.top = '40%';
            el.style.transform = 'translateX(-50%)';
        }

        document.body.appendChild(el);
        setTimeout(function() { if (el.parentNode) el.remove(); }, 1500);
    }

    // === All-Out Attack ===
    function showAllOutAttack() {
        return new Promise(function(resolve) {
            var overlay = document.createElement('div');
            overlay.className = 'all-out-attack-overlay';
            overlay.innerHTML = '<div class="all-out-attack-bg"></div><div class="all-out-attack-text">ALL-OUT ATTACK</div>';
            document.body.appendChild(overlay);

            if (window.GameAudio) window.GameAudio.playAllOutAttack();
            screenShake(6, 400);

            // Particle burst from center
            setTimeout(function() {
                particleBurst(window.innerWidth / 2, window.innerHeight / 2, 20, 'var(--red)');
            }, 200);

            setTimeout(function() {
                overlay.classList.add('all-out-attack-fade');
                setTimeout(function() { overlay.remove(); resolve(); }, 300);
            }, 600);
        });
    }

    // === Grade Screen ===
    function showGradeScreen(detail) {
        return new Promise(function(resolve) {
            var grade = detail.grade;
            var xpEarned = detail.xpEarned;
            var xpProgress = detail.xpProgress || { current: 0, needed: 100, pct: 0 };
            var level = detail.level;

            if (window.GameAudio) window.GameAudio.playGrade(grade);

            var comboText = comboCount > 1 ? ' <span style="color:var(--gold);font-size:0.9rem">' + comboCount + 'x COMBO</span>' : '';

            var overlay = document.createElement('div');
            overlay.className = 'grade-overlay';
            overlay.innerHTML =
                '<div class="grade-card">' +
                    '<div class="grade-title">Results</div>' +
                    '<div class="grade-letter grade-' + grade + '">' + grade + '</div>' +
                    '<div class="grade-xp">+' + xpEarned + ' XP' + comboText + '</div>' +
                    '<div class="grade-xp-bar-container"><div class="grade-xp-bar" style="width: 0%"></div></div>' +
                    '<div class="grade-level">LV ' + level + ' &bull; ' + xpProgress.current + ' / ' + xpProgress.needed + ' XP</div>' +
                    '<div class="grade-stats"><span>Shadows Defeated: ' + (window.GameState ? window.GameState.getCompletedCount() : '?') + '</span></div>' +
                    '<div class="grade-dismiss">click to dismiss</div>' +
                '</div>';

            document.body.appendChild(overlay);

            requestAnimationFrame(function() {
                var bar = overlay.querySelector('.grade-xp-bar');
                if (bar) bar.style.width = xpProgress.pct + '%';
            });

            // Grade letter particle burst
            setTimeout(function() {
                var letter = overlay.querySelector('.grade-letter');
                if (letter) {
                    var rect = letter.getBoundingClientRect();
                    var color = grade === 'S' ? 'var(--gold)' : grade === 'A' ? 'var(--cyan)' : 'var(--red)';
                    particleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 15, color);
                }
            }, 400);

            var dismissed = false;
            function dismiss() {
                if (dismissed) return;
                dismissed = true;
                overlay.remove();
                resolve();
            }
            overlay.addEventListener('click', dismiss);
            setTimeout(function() { if (overlay.parentNode) dismiss(); }, 4000);
        });
    }

    // === Level Up ===
    function showLevelUp(detail) {
        return new Promise(function(resolve) {
            if (window.GameAudio) window.GameAudio.playLevelUp();

            var statsHtml = '';
            if (detail.statIncreases) {
                Object.keys(detail.statIncreases).forEach(function(stat) {
                    statsHtml += '<div class="levelup-stat">' +
                        stat.charAt(0).toUpperCase() + stat.slice(1) + ' +' + detail.statIncreases[stat] + '</div>';
                });
            }

            var overlay = document.createElement('div');
            overlay.className = 'levelup-overlay';
            overlay.innerHTML =
                '<div class="levelup-card">' +
                    '<div class="levelup-title">Level Up!</div>' +
                    '<div class="levelup-level">' + detail.newLevel + '</div>' +
                    '<div class="levelup-stats">' + statsHtml + '</div>' +
                '</div>';

            document.body.appendChild(overlay);

            var dismissed = false;
            function dismiss() {
                if (dismissed) return;
                dismissed = true;
                overlay.remove();
                resolve();
            }
            overlay.addEventListener('click', dismiss);
            setTimeout(function() { if (overlay.parentNode) dismiss(); }, 3500);
        });
    }

    // === Skill Level Up Banner ===
    function showSkillLevelUp(detail) {
        if (window.GameAudio) window.GameAudio.playSkillUp();

        var banner = document.createElement('div');
        banner.className = 'skill-levelup-banner';
        banner.innerHTML =
            '<div class="skill-levelup-banner-title">Skill Level Up</div>' +
            '<div class="skill-levelup-banner-name">' + (detail.skillName || 'Unknown') + '</div>' +
            '<div class="skill-levelup-banner-level">Level ' + detail.newLevel + '</div>';

        document.body.appendChild(banner);

        setTimeout(function() {
            banner.classList.add('dismissing');
            setTimeout(function() { banner.remove(); }, 400);
        }, 3000);
    }

    // === Event Queue ===
    var eventQueue = [];
    var processing = false;

    function enqueueEvent(fn) {
        eventQueue.push(fn);
        processQueue();
    }

    function processQueue() {
        if (processing || eventQueue.length === 0) return;
        processing = true;
        var fn = eventQueue.shift();
        fn().then(function() {
            processing = false;
            processQueue();
        }).catch(function() {
            processing = false;
            processQueue();
        });
    }

    // === Event Listeners ===
    window.addEventListener('gradeCalculated', function(e) {
        incrementCombo();
        screenShake(3, 200);

        var activeBtn = document.querySelector('.game-complete-btn.completed:last-of-type');
        showXPFloat(e.detail.xpEarned, activeBtn);

        // Particles from the button
        if (activeBtn) {
            var rect = activeBtn.getBoundingClientRect();
            particleBurst(rect.left + rect.width / 2, rect.top, 10, 'var(--gold)');
        }

        enqueueEvent(function() {
            return showAllOutAttack().then(function() {
                return showGradeScreen(e.detail);
            });
        });

        // Refresh sidebar player card
        setTimeout(function() {
            if (window.App) window.App.updatePlayerCard();
        }, 1000);
    });

    window.addEventListener('levelUp', function(e) {
        enqueueEvent(function() {
            return showLevelUp(e.detail);
        });
    });

    window.addEventListener('skillLevelUp', function(e) {
        showSkillLevelUp(e.detail);
    });

    window.Overlays = {
        showAllOutAttack: showAllOutAttack,
        showGradeScreen: showGradeScreen,
        showLevelUp: showLevelUp,
        showSkillLevelUp: showSkillLevelUp
    };
})();
