/**
 * Go Grind - Gamification System
 * Daily Challenges, Achievements, Streaks, Statistics
 */
(function() {
    'use strict';

    // ==================== ACHIEVEMENTS ====================
    var ACHIEVEMENTS = [
        // Getting Started
        { id: 'first_blood', name: 'First Blood', desc: 'Complete your first exercise', icon: '1', category: 'milestone' },
        { id: 'warming_up', name: 'Warming Up', desc: 'Complete 10 exercises', icon: '10', category: 'milestone' },
        { id: 'century', name: 'Century', desc: 'Complete 100 exercises', icon: '100', category: 'milestone' },
        { id: 'dedicated', name: 'Dedicated', desc: 'Complete 500 exercises', icon: '500', category: 'milestone' },
        { id: 'master', name: 'Master', desc: 'Complete 1000 exercises', icon: '1K', category: 'milestone' },

        // Grades
        { id: 'perfectionist', name: 'Perfectionist', desc: 'Get an S rank', icon: 'S', category: 'grade' },
        { id: 's_streak_5', name: 'On Fire', desc: 'Get 5 S ranks in a row', icon: 'S5', category: 'grade' },
        { id: 's_streak_10', name: 'Unstoppable', desc: 'Get 10 S ranks in a row', icon: 'S10', category: 'grade' },
        { id: 'no_hints', name: 'Solo Act', desc: 'Complete 10 exercises without hints', icon: 'NH', category: 'grade' },

        // Streaks
        { id: 'streak_3', name: 'Getting Started', desc: '3 day streak', icon: '3d', category: 'streak' },
        { id: 'streak_7', name: 'Week Warrior', desc: '7 day streak', icon: '7d', category: 'streak' },
        { id: 'streak_14', name: 'Fortnight Fighter', desc: '14 day streak', icon: '14d', category: 'streak' },
        { id: 'streak_30', name: 'Monthly Master', desc: '30 day streak', icon: '30d', category: 'streak' },
        { id: 'streak_100', name: 'Legendary', desc: '100 day streak', icon: '100d', category: 'streak' },

        // Skills
        { id: 'skill_10', name: 'Apprentice', desc: 'Reach level 10 in any skill', icon: 'L10', category: 'skill' },
        { id: 'skill_25', name: 'Journeyman', desc: 'Reach level 25 in any skill', icon: 'L25', category: 'skill' },
        { id: 'skill_50', name: 'Expert', desc: 'Reach level 50 in any skill', icon: 'L50', category: 'skill' },
        { id: 'all_skills_5', name: 'Well Rounded', desc: 'All skills at level 5+', icon: 'ALL', category: 'skill' },
        { id: 'all_skills_10', name: 'Renaissance', desc: 'All skills at level 10+', icon: 'ALL', category: 'skill' },

        // Speed
        { id: 'speed_demon', name: 'Speed Demon', desc: 'Complete exercise in under 10 seconds', icon: 'SPD', category: 'speed' },
        { id: 'lightning', name: 'Lightning', desc: 'Complete 5 exercises in under 10 seconds each', icon: 'ZAP', category: 'speed' },

        // Concepts
        { id: 'pointer_master', name: 'Pointer Master', desc: 'Complete all Pointer exercises', icon: '*', category: 'concept' },
        { id: 'struct_master', name: 'Struct Master', desc: 'Complete all Struct exercises', icon: '{}', category: 'concept' },
        { id: 'interface_master', name: 'Interface Master', desc: 'Complete all Interface exercises', icon: 'I', category: 'concept' },

        // Special
        { id: 'night_owl', name: 'Night Owl', desc: 'Study after midnight', icon: 'OWL', category: 'special' },
        { id: 'early_bird', name: 'Early Bird', desc: 'Study before 6 AM', icon: 'BIRD', category: 'special' },
        { id: 'weekend_warrior', name: 'Weekend Warrior', desc: 'Study on Saturday and Sunday', icon: 'WKD', category: 'special' },

        // XP
        { id: 'xp_1000', name: 'Rising Star', desc: 'Earn 1,000 total XP', icon: '1K', category: 'xp' },
        { id: 'xp_10000', name: 'Shining Star', desc: 'Earn 10,000 total XP', icon: '10K', category: 'xp' },
        { id: 'xp_50000', name: 'Superstar', desc: 'Earn 50,000 total XP', icon: '50K', category: 'xp' },
        { id: 'xp_100000', name: 'Legend', desc: 'Earn 100,000 total XP', icon: '100K', category: 'xp' }
    ];

    // ==================== DAILY CHALLENGE TEMPLATES ====================
    var CHALLENGE_TEMPLATES = [
        { id: 'complete_n', name: 'Complete {n} exercises', check: function(stats, n) { return stats.todayCompleted >= n; }, n: [3, 5, 7, 10] },
        { id: 's_rank_n', name: 'Get {n} S ranks today', check: function(stats, n) { return stats.todaySRanks >= n; }, n: [1, 2, 3] },
        { id: 'no_hints_n', name: 'Complete {n} exercises without hints', check: function(stats, n) { return stats.todayNoHints >= n; }, n: [2, 3, 5] },
        { id: 'concept_n', name: 'Complete {n} {concept} exercises', check: function(stats, n, concept) { return (stats.todayByConcept[concept] || 0) >= n; }, n: [2, 3], concepts: ['Pointers', 'Structs', 'Methods', 'Interfaces', 'For Loops', 'Slices & Range'] },
        { id: 'streak_n', name: 'Get a {n}x combo (correct in a row)', check: function(stats, n) { return stats.todayMaxCombo >= n; }, n: [3, 5, 7] },
        { id: 'speed_n', name: 'Complete {n} exercises under 15 seconds', check: function(stats, n) { return stats.todaySpeedRuns >= n; }, n: [2, 3, 5] },
        { id: 'xp_n', name: 'Earn {n} XP today', check: function(stats, n) { return stats.todayXP >= n; }, n: [100, 200, 500] }
    ];

    // ==================== STATE HELPERS ====================
    function getGamificationState() {
        if (!window.GameState) return null;
        var state = window.GameState.getFullState();
        if (!state.gamification) {
            state.gamification = {
                achievements: {},
                dailyChallenges: { date: null, challenges: [], completed: [] },
                statistics: {
                    totalTimeSpent: 0,
                    exercisesByGrade: { S: 0, A: 0, B: 0, C: 0, D: 0 },
                    hintsUsed: 0,
                    fastestTime: null,
                    longestSession: 0,
                    totalSessions: 0,
                    exercisesByDay: {},
                    sRankStreak: 0,
                    maxSRankStreak: 0,
                    noHintCount: 0,
                    speedRunCount: 0,
                    weekendDays: 0
                },
                todayStats: { date: null, completed: 0, sRanks: 0, noHints: 0, byConcept: {}, maxCombo: 0, currentCombo: 0, speedRuns: 0, xp: 0 }
            };
            window.GameState.save();
        }
        return state.gamification;
    }

    function saveGamification() {
        if (window.GameState) window.GameState.save();
    }

    function getToday() {
        return new Date().toISOString().split('T')[0];
    }

    // ==================== DAILY CHALLENGES ====================
    function generateDailyChallenges() {
        var gam = getGamificationState();
        if (!gam) return [];

        var today = getToday();
        if (gam.dailyChallenges.date === today) {
            return gam.dailyChallenges.challenges;
        }

        // Generate 3 new challenges
        var seed = hashCode(today);
        var challenges = [];
        var usedTypes = {};

        for (var i = 0; i < 3; i++) {
            var template;
            var attempts = 0;
            do {
                template = CHALLENGE_TEMPLATES[Math.abs(seed + i * 7 + attempts) % CHALLENGE_TEMPLATES.length];
                attempts++;
            } while (usedTypes[template.id] && attempts < 20);
            usedTypes[template.id] = true;

            var n = template.n[Math.abs(seed + i * 13) % template.n.length];
            var concept = template.concepts ? template.concepts[Math.abs(seed + i * 17) % template.concepts.length] : null;
            var xpReward = Math.round(n * (template.id.includes('s_rank') ? 30 : template.id.includes('xp') ? 0.2 : 20));

            challenges.push({
                id: template.id + '_' + n + (concept ? '_' + concept : ''),
                name: template.name.replace('{n}', n).replace('{concept}', concept || ''),
                templateId: template.id,
                n: n,
                concept: concept,
                xpReward: Math.max(xpReward, 25)
            });
        }

        gam.dailyChallenges = { date: today, challenges: challenges, completed: [] };
        gam.todayStats = { date: today, completed: 0, sRanks: 0, noHints: 0, byConcept: {}, maxCombo: 0, currentCombo: 0, speedRuns: 0, xp: 0 };
        saveGamification();

        return challenges;
    }

    function hashCode(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }

    function checkDailyChallenges() {
        var gam = getGamificationState();
        if (!gam) return [];

        var today = getToday();
        if (gam.dailyChallenges.date !== today) {
            generateDailyChallenges();
        }

        var completed = [];
        var stats = {
            todayCompleted: gam.todayStats.completed,
            todaySRanks: gam.todayStats.sRanks,
            todayNoHints: gam.todayStats.noHints,
            todayByConcept: gam.todayStats.byConcept,
            todayMaxCombo: gam.todayStats.maxCombo,
            todaySpeedRuns: gam.todayStats.speedRuns,
            todayXP: gam.todayStats.xp
        };

        gam.dailyChallenges.challenges.forEach(function(challenge) {
            if (gam.dailyChallenges.completed.indexOf(challenge.id) >= 0) return;

            var template = CHALLENGE_TEMPLATES.find(function(t) { return t.id === challenge.templateId; });
            if (template && template.check(stats, challenge.n, challenge.concept)) {
                gam.dailyChallenges.completed.push(challenge.id);
                completed.push(challenge);

                // Award XP
                if (window.GameState) {
                    window.GameState.addBonusXP(challenge.xpReward, 'Daily Challenge: ' + challenge.name);
                }
            }
        });

        if (completed.length > 0) saveGamification();
        return completed;
    }

    // ==================== ACHIEVEMENTS ====================
    function checkAchievements() {
        var gam = getGamificationState();
        if (!gam || !window.GameState) return [];

        var unlocked = [];
        var state = window.GameState.getFullState();
        var completedCount = Object.keys(state.completedExercises || {}).length;
        var skills = state.skills || {};
        var streaks = state.streaks || { current: 0, longest: 0 };
        var stats = gam.statistics;
        var hour = new Date().getHours();
        var dayOfWeek = new Date().getDay();

        ACHIEVEMENTS.forEach(function(ach) {
            if (gam.achievements[ach.id]) return;

            var earned = false;

            switch (ach.id) {
                // Milestones
                case 'first_blood': earned = completedCount >= 1; break;
                case 'warming_up': earned = completedCount >= 10; break;
                case 'century': earned = completedCount >= 100; break;
                case 'dedicated': earned = completedCount >= 500; break;
                case 'master': earned = completedCount >= 1000; break;

                // Grades
                case 'perfectionist': earned = stats.exercisesByGrade.S >= 1; break;
                case 's_streak_5': earned = stats.maxSRankStreak >= 5; break;
                case 's_streak_10': earned = stats.maxSRankStreak >= 10; break;
                case 'no_hints': earned = stats.noHintCount >= 10; break;

                // Streaks
                case 'streak_3': earned = streaks.longest >= 3; break;
                case 'streak_7': earned = streaks.longest >= 7; break;
                case 'streak_14': earned = streaks.longest >= 14; break;
                case 'streak_30': earned = streaks.longest >= 30; break;
                case 'streak_100': earned = streaks.longest >= 100; break;

                // Skills
                case 'skill_10': earned = Object.values(skills).some(function(s) { return s.level >= 10; }); break;
                case 'skill_25': earned = Object.values(skills).some(function(s) { return s.level >= 25; }); break;
                case 'skill_50': earned = Object.values(skills).some(function(s) { return s.level >= 50; }); break;
                case 'all_skills_5': earned = Object.values(skills).every(function(s) { return s.level >= 5; }); break;
                case 'all_skills_10': earned = Object.values(skills).every(function(s) { return s.level >= 10; }); break;

                // Speed
                case 'speed_demon': earned = stats.fastestTime !== null && stats.fastestTime < 10; break;
                case 'lightning': earned = stats.speedRunCount >= 5; break;

                // Special
                case 'night_owl': earned = hour >= 0 && hour < 5 && completedCount > 0; break;
                case 'early_bird': earned = hour >= 5 && hour < 6 && completedCount > 0; break;
                case 'weekend_warrior': earned = stats.weekendDays >= 2; break;

                // XP
                case 'xp_1000': earned = state.player.totalXP >= 1000; break;
                case 'xp_10000': earned = state.player.totalXP >= 10000; break;
                case 'xp_50000': earned = state.player.totalXP >= 50000; break;
                case 'xp_100000': earned = state.player.totalXP >= 100000; break;
            }

            if (earned) {
                gam.achievements[ach.id] = { date: getToday(), timestamp: Date.now() };
                unlocked.push(ach);
            }
        });

        if (unlocked.length > 0) saveGamification();
        return unlocked;
    }

    // ==================== STATISTICS TRACKING ====================
    function trackExerciseComplete(exerciseData) {
        var gam = getGamificationState();
        if (!gam) return;

        var today = getToday();
        if (gam.todayStats.date !== today) {
            gam.todayStats = { date: today, completed: 0, sRanks: 0, noHints: 0, byConcept: {}, maxCombo: 0, currentCombo: 0, speedRuns: 0, xp: 0 };
        }

        var stats = gam.statistics;
        var todayStats = gam.todayStats;

        // Update counts
        todayStats.completed++;
        todayStats.xp += exerciseData.xp || 0;

        // Grade tracking
        var grade = exerciseData.grade || 'C';
        stats.exercisesByGrade[grade] = (stats.exercisesByGrade[grade] || 0) + 1;

        if (grade === 'S') {
            todayStats.sRanks++;
            stats.sRankStreak++;
            stats.maxSRankStreak = Math.max(stats.maxSRankStreak, stats.sRankStreak);
            todayStats.currentCombo++;
            todayStats.maxCombo = Math.max(todayStats.maxCombo, todayStats.currentCombo);
        } else {
            stats.sRankStreak = 0;
            todayStats.currentCombo = 0;
        }

        // Hint tracking
        if (!exerciseData.usedHint) {
            todayStats.noHints++;
            stats.noHintCount++;
        } else {
            stats.hintsUsed++;
        }

        // Speed tracking
        if (exerciseData.time && exerciseData.time < 15) {
            todayStats.speedRuns++;
            stats.speedRunCount++;
            if (stats.fastestTime === null || exerciseData.time < stats.fastestTime) {
                stats.fastestTime = exerciseData.time;
            }
        }

        // Concept tracking
        if (exerciseData.concept) {
            todayStats.byConcept[exerciseData.concept] = (todayStats.byConcept[exerciseData.concept] || 0) + 1;
        }

        // Day tracking
        var dayOfWeek = new Date().getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            if (!stats.exercisesByDay[today]) {
                stats.weekendDays++;
            }
        }
        stats.exercisesByDay[today] = (stats.exercisesByDay[today] || 0) + 1;

        saveGamification();
    }

    // ==================== UI RENDERING ====================
    function renderDailyChallenges() {
        var gam = getGamificationState();
        if (!gam) return '<div class="daily-challenges-empty">Loading...</div>';

        var challenges = generateDailyChallenges();
        var html = '<div class="daily-challenges">';
        html += '<div class="daily-header"><span class="daily-title">Daily Challenges</span><span class="daily-reset">Resets at midnight</span></div>';

        challenges.forEach(function(challenge) {
            var isComplete = gam.dailyChallenges.completed.indexOf(challenge.id) >= 0;
            html += '<div class="daily-challenge ' + (isComplete ? 'complete' : '') + '">' +
                '<span class="challenge-check">' + (isComplete ? '&#10003;' : '&#9675;') + '</span>' +
                '<span class="challenge-name">' + challenge.name + '</span>' +
                '<span class="challenge-reward">+' + challenge.xpReward + ' XP</span>' +
            '</div>';
        });

        html += '</div>';
        return html;
    }

    function renderStreakWidget() {
        if (!window.GameState) return '';
        var streaks = window.GameState.getStreaks();

        var html = '<div class="streak-widget">';
        html += '<div class="streak-flame">' + (streaks.current > 0 ? '&#128293;' : '&#9898;') + '</div>';
        html += '<div class="streak-info">';
        html += '<div class="streak-current">' + streaks.current + ' day' + (streaks.current !== 1 ? 's' : '') + '</div>';
        html += '<div class="streak-best">Best: ' + streaks.longest + '</div>';
        html += '</div></div>';
        return html;
    }

    function renderAchievements(showLocked) {
        var gam = getGamificationState();
        if (!gam) return '';

        var unlockedCount = Object.keys(gam.achievements).length;
        var html = '<div class="achievements-header">';
        html += '<span class="achievements-title">Achievements</span>';
        html += '<span class="achievements-count">' + unlockedCount + ' / ' + ACHIEVEMENTS.length + '</span>';
        html += '</div>';

        html += '<div class="achievements-grid">';

        // Group by category
        var categories = {};
        ACHIEVEMENTS.forEach(function(ach) {
            if (!categories[ach.category]) categories[ach.category] = [];
            categories[ach.category].push(ach);
        });

        Object.keys(categories).forEach(function(cat) {
            html += '<div class="achievement-category">';
            html += '<div class="category-name">' + cat.charAt(0).toUpperCase() + cat.slice(1) + '</div>';

            categories[cat].forEach(function(ach) {
                var unlocked = gam.achievements[ach.id];
                if (!showLocked && !unlocked) return;

                html += '<div class="achievement-item ' + (unlocked ? 'unlocked' : 'locked') + '" title="' + ach.desc + '">';
                html += '<div class="achievement-icon">' + ach.icon + '</div>';
                html += '<div class="achievement-info">';
                html += '<div class="achievement-name">' + ach.name + '</div>';
                html += '<div class="achievement-desc">' + ach.desc + '</div>';
                html += '</div></div>';
            });

            html += '</div>';
        });

        html += '</div>';
        return html;
    }

    function renderStatistics() {
        var gam = getGamificationState();
        if (!gam || !window.GameState) return '';

        var state = window.GameState.getFullState();
        var stats = gam.statistics;
        var streaks = state.streaks || { current: 0, longest: 0 };
        var completedCount = Object.keys(state.completedExercises || {}).length;

        var totalGraded = Object.values(stats.exercisesByGrade).reduce(function(a, b) { return a + b; }, 0);
        var accuracy = totalGraded > 0 ? Math.round((stats.exercisesByGrade.S + stats.exercisesByGrade.A) / totalGraded * 100) : 0;

        var html = '<div class="statistics-panel">';

        // Overview
        html += '<div class="stat-section">';
        html += '<div class="stat-section-title">Overview</div>';
        html += '<div class="stat-row"><span>Total Exercises</span><span>' + completedCount + '</span></div>';
        html += '<div class="stat-row"><span>Total XP</span><span>' + (state.player.totalXP || 0).toLocaleString() + '</span></div>';
        html += '<div class="stat-row"><span>Player Level</span><span>' + state.player.level + '</span></div>';
        html += '<div class="stat-row"><span>Accuracy (S+A)</span><span>' + accuracy + '%</span></div>';
        html += '</div>';

        // Streaks
        html += '<div class="stat-section">';
        html += '<div class="stat-section-title">Streaks</div>';
        html += '<div class="stat-row"><span>Current Streak</span><span>' + streaks.current + ' days</span></div>';
        html += '<div class="stat-row"><span>Longest Streak</span><span>' + streaks.longest + ' days</span></div>';
        html += '<div class="stat-row"><span>Best S-Rank Streak</span><span>' + stats.maxSRankStreak + '</span></div>';
        html += '</div>';

        // Grades
        html += '<div class="stat-section">';
        html += '<div class="stat-section-title">Grades</div>';
        ['S', 'A', 'B', 'C', 'D'].forEach(function(grade) {
            var count = stats.exercisesByGrade[grade] || 0;
            var pct = totalGraded > 0 ? Math.round(count / totalGraded * 100) : 0;
            html += '<div class="stat-row"><span>Grade ' + grade + '</span><span>' + count + ' (' + pct + '%)</span></div>';
        });
        html += '</div>';

        // Performance
        html += '<div class="stat-section">';
        html += '<div class="stat-section-title">Performance</div>';
        html += '<div class="stat-row"><span>Hints Used</span><span>' + stats.hintsUsed + '</span></div>';
        html += '<div class="stat-row"><span>No-Hint Completions</span><span>' + stats.noHintCount + '</span></div>';
        html += '<div class="stat-row"><span>Speed Runs (&lt;15s)</span><span>' + stats.speedRunCount + '</span></div>';
        if (stats.fastestTime !== null) {
            html += '<div class="stat-row"><span>Fastest Time</span><span>' + stats.fastestTime.toFixed(1) + 's</span></div>';
        }
        html += '</div>';

        html += '</div>';
        return html;
    }

    // ==================== NOTIFICATION HELPERS ====================
    function showAchievementUnlock(achievement) {
        if (!window.Overlays || !window.Overlays.showNotification) {
            console.log('Achievement unlocked:', achievement.name);
            return;
        }

        window.Overlays.showNotification({
            title: 'Achievement Unlocked!',
            message: achievement.name,
            subtitle: achievement.desc,
            icon: achievement.icon,
            type: 'achievement'
        });
    }

    function showChallengeComplete(challenge) {
        if (!window.Overlays || !window.Overlays.showNotification) {
            console.log('Challenge complete:', challenge.name);
            return;
        }

        window.Overlays.showNotification({
            title: 'Daily Challenge Complete!',
            message: challenge.name,
            subtitle: '+' + challenge.xpReward + ' XP',
            type: 'challenge'
        });
    }

    // ==================== PUBLIC API ====================
    window.Gamification = {
        // Daily Challenges
        getDailyChallenges: generateDailyChallenges,
        checkDailyChallenges: function() {
            var completed = checkDailyChallenges();
            completed.forEach(showChallengeComplete);
            return completed;
        },
        renderDailyChallenges: renderDailyChallenges,

        // Achievements
        getAchievements: function() { return ACHIEVEMENTS; },
        getUnlockedAchievements: function() {
            var gam = getGamificationState();
            return gam ? gam.achievements : {};
        },
        checkAchievements: function() {
            var unlocked = checkAchievements();
            unlocked.forEach(showAchievementUnlock);
            return unlocked;
        },
        renderAchievements: renderAchievements,

        // Streaks
        renderStreakWidget: renderStreakWidget,

        // Statistics
        getStatistics: function() {
            var gam = getGamificationState();
            return gam ? gam.statistics : null;
        },
        renderStatistics: renderStatistics,

        // Tracking
        trackExerciseComplete: function(data) {
            trackExerciseComplete(data);
            // Check for completed challenges and achievements
            var challenges = checkDailyChallenges();
            var achievements = checkAchievements();
            challenges.forEach(showChallengeComplete);
            achievements.forEach(showAchievementUnlock);
        },

        // Full gamification view render
        renderGamificationView: function() {
            var html = '';
            html += renderStreakWidget();
            html += renderDailyChallenges();
            html += '<div class="section-title" style="margin-top:1.5rem">Achievements</div>';
            html += renderAchievements(true);
            html += '<div class="section-title" style="margin-top:1.5rem">Statistics</div>';
            html += renderStatistics();
            return html;
        }
    };

    // ==================== AUTO EVENT LISTENERS ====================
    var pendingExerciseData = null;

    // Listen for exercise completion data (from combat.js)
    window.addEventListener('exerciseCompleted', function(e) {
        pendingExerciseData = {
            concept: e.detail.concept,
            timeSpent: e.detail.timeSpent,
            usedHint: e.detail.hintsUsed > 0,
            difficulty: e.detail.difficulty
        };
    });

    // Listen for grade calculation (from state.js) - this has the final XP and grade
    window.addEventListener('gradeCalculated', function(e) {
        var data = {
            grade: e.detail.grade,
            xp: e.detail.xpEarned,
            concept: pendingExerciseData ? pendingExerciseData.concept : null,
            time: pendingExerciseData ? pendingExerciseData.timeSpent : null,
            usedHint: pendingExerciseData ? pendingExerciseData.usedHint : false
        };

        trackExerciseComplete(data);

        // Check for completed challenges and achievements
        var challenges = checkDailyChallenges();
        var achievements = checkAchievements();
        challenges.forEach(showChallengeComplete);
        achievements.forEach(showAchievementUnlock);

        pendingExerciseData = null;
    });
})();
