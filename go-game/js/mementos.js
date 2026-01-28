/**
 * Go Grind - Mementos Daily Challenges
 * Date-seeded targets with streak bonuses.
 */
(function() {
    'use strict';

    function getMementosChallenge() {
        var today = new Date().toISOString().split('T')[0];
        var seed = 0;
        for (var i = 0; i < today.length; i++) seed += today.charCodeAt(i) * (i + 1);

        var targets = [
            { text: 'Complete 3 exercises', key: 'exercises', goal: 3 },
            { text: 'Complete 5 exercises', key: 'exercises', goal: 5 },
            { text: 'Earn 100 XP', key: 'xp', goal: 100 },
            { text: 'Earn 200 XP', key: 'xp', goal: 200 },
            { text: 'Get an S grade', key: 'sgrade', goal: 1 },
            { text: 'Get 2 A grades or better', key: 'agrade', goal: 2 },
            { text: 'Complete a challenge without hints', key: 'nohints', goal: 1 },
            { text: 'Complete 3 exercises in under 2 minutes each', key: 'fast', goal: 3 }
        ];

        var picked = [];
        var pool = targets.slice();
        for (var j = 0; j < 5; j++) {
            if (pool.length === 0) break;
            var idx = (seed + j * 17) % pool.length;
            picked.push(pool.splice(idx, 1)[0]);
        }

        return {
            date: today,
            targets: picked,
            reward: 50 + (seed % 50)
        };
    }

    function checkProgress(challenge) {
        if (!window.GameState) return challenge;
        var calendar = window.GameState.getCalendar();
        var todayData = calendar[challenge.date] || { exercisesCompleted: 0, xpEarned: 0 };

        challenge.targets.forEach(function(t) {
            switch (t.key) {
                case 'exercises':
                    t.current = todayData.exercisesCompleted || 0;
                    t.done = t.current >= t.goal;
                    break;
                case 'xp':
                    t.current = todayData.xpEarned || 0;
                    t.done = t.current >= t.goal;
                    break;
                default:
                    t.current = 0;
                    t.done = false;
                    break;
            }
        });

        challenge.allDone = challenge.targets.every(function(t) { return t.done; });
        return challenge;
    }

    function getStreakMultiplier() {
        if (!window.GameState) return 1;
        var streak = window.GameState.getStreaks().current || 0;
        if (streak >= 30) return 3;
        if (streak >= 10) return 2;
        if (streak >= 5) return 1.5;
        return 1;
    }

    function renderMementosView() {
        var view = document.getElementById('view-mementos');
        if (!view || !window.GameState) return;

        var challenge = getMementosChallenge();
        challenge = checkProgress(challenge);
        var streaks = window.GameState.getStreaks();
        var multiplier = getStreakMultiplier();

        var html = '';

        // Streak display
        html += '<div class="mementos-streak">' + (streaks.current || 0) + ' DAY STREAK</div>';
        html += '<div class="mementos-streak-label">Longest: ' + (streaks.longest || 0) + ' days</div>';
        if (multiplier > 1) {
            html += '<div class="mementos-multiplier">' + multiplier + 'x XP MULTIPLIER ACTIVE</div>';
        }

        // Today's targets
        html += '<div class="mementos-card" style="margin-top:1.5rem">';
        html += '<div class="mementos-title">Mementos Request</div>';
        html += '<div class="mementos-desc">Daily targets &bull; ' + challenge.date + '</div>';
        html += '<div class="mementos-targets">';
        challenge.targets.forEach(function(t) {
            html += '<div class="mementos-target' + (t.done ? ' done' : '') + '">';
            html += '<div class="mementos-check"></div>';
            html += '<span>' + t.text + '</span>';
            if (t.current !== undefined && !t.done) {
                html += '<span style="margin-left:auto;color:var(--text-dim);font-size:0.7rem">' + (t.current || 0) + '/' + t.goal + '</span>';
            }
            html += '</div>';
        });
        html += '</div>';
        html += '<div class="mementos-reward">Reward: +' + challenge.reward + ' XP' + (challenge.allDone ? ' (CLAIMED)' : '') + '</div>';
        html += '</div>';

        // Quick action
        if (!challenge.allDone) {
            html += '<div style="text-align:center;margin-top:1.5rem">';
            html += '<button class="skill-train-btn" id="mementos-train-btn">START TRAINING</button>';
            html += '</div>';
        } else {
            html += '<div style="text-align:center;margin-top:1.5rem;color:var(--green);font-family:var(--font-display);font-size:1.5rem;letter-spacing:3px">ALL TARGETS COMPLETE</div>';
        }

        view.innerHTML = html;

        var trainBtn = document.getElementById('mementos-train-btn');
        if (trainBtn) {
            trainBtn.addEventListener('click', function() {
                if (window.App) window.App.navigateTo('training');
            });
        }
    }

    window.Mementos = {
        getMementosChallenge: getMementosChallenge,
        checkProgress: checkProgress,
        getStreakMultiplier: getStreakMultiplier,
        renderMementosView: renderMementosView
    };
})();
