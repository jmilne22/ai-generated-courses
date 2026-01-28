/**
 * Go Grind - Skill Pages & Mastery Tracking
 */
(function() {
    'use strict';

    var MILESTONES = [
        { level: 10, label: 'Concept tutorial unlocked', label4x: 'Basic doctrine unlocked' },
        { level: 20, label: 'Reduced hint XP penalty (-5 instead of -10)', label4x: 'Reduced intel cost (-5 instead of -10)' },
        { level: 30, label: 'Timer extended (+15s)', label4x: 'Planning phase extended (+15s)' },
        { level: 40, label: 'Bonus XP multiplier 1.1x', label4x: 'Production bonus 1.1x' },
        { level: 50, label: 'Persona evolution', label4x: 'General promotion' }
    ];

    function renderSkillPage(skillKey) {
        var view = document.getElementById('view-skill');
        if (!view || !window.GameState) return;

        var skill = window.GameState.getSkill(skillKey);
        var skillDefs = window.GameState.getSkillDefs();
        var def = skillDefs[skillKey];
        if (!def) {
            view.innerHTML = '<p style="color:var(--text-dim)">Unknown skill.</p>';
            return;
        }

        var xpNeeded = window.GameState.skillXPForLevel(skill.level);
        var xpPct = skill.level >= 99 ? 100 : Math.min(100, Math.round(skill.xp / xpNeeded * 100));

        var exerciseData = window.Combat ? window.Combat.getExerciseData() : null;
        var masteryPct = window.GameState.getSkillMasteryPct(skillKey, exerciseData);

        var html = '';

        // Skill header
        html += '<div class="skill-header">' +
            '<div class="skill-level-badge">' + skill.level + '</div>' +
            '<div class="skill-info">' +
                '<div class="skill-name">' + def.label + '</div>' +
                '<div class="skill-xp-info">' + skill.xp + ' / ' + xpNeeded + ' XP to next level</div>' +
                '<div class="skill-xp-bar"><div class="skill-xp-fill" style="width:' + xpPct + '%"></div></div>' +
            '</div>' +
            '<button class="skill-train-btn" data-skill="' + skillKey + '">TRAIN</button>' +
        '</div>';

        // Mastery overview
        html += '<div class="mastery-total">Total Mastery: ' + masteryPct + '%</div>';

        // Milestones
        html += '<div class="section-title">Milestones</div>';
        html += '<div class="milestones">';
        MILESTONES.forEach(function(m) {
            var unlocked = skill.level >= m.level;
            html += '<div class="milestone-item ' + (unlocked ? 'unlocked' : 'locked') + '">' +
                '<span class="milestone-level">LV ' + m.level + '</span>' +
                '<span>' + (unlocked ? '\u2713 ' : '') + m.label + '</span></div>';
        });
        html += '</div>';

        // Exercise mastery list
        if (exerciseData) {
            html += '<div class="section-title">Exercise Mastery</div>';
            html += '<div class="mastery-list">';

            var allExercises = (exerciseData.warmups || []).concat(exerciseData.challenges || []);
            var conceptKey = window.GameState.conceptToSkillKey;

            allExercises.forEach(function(ex) {
                var exSkill = ex.concept ? conceptKey(ex.concept) : null;
                if (exSkill !== skillKey) return;

                (ex.variants || []).forEach(function(v) {
                    var key = ex.id + '_' + v.id;
                    var mastery = window.GameState.getMastery()[key];
                    var completed = window.GameState.getCompletedExercises()[key];
                    var mPct = mastery ? Math.min(100, Math.round(mastery.xp / 100 * 100)) : 0;
                    var grade = completed ? completed.grade : null;

                    html += '<div class="mastery-item ' + (completed ? '' : 'locked') + '">';
                    if (grade) {
                        html += '<span class="mastery-item-grade grade-' + grade + '">' + grade + '</span>';
                    } else {
                        html += '<span class="mastery-item-grade" style="color:var(--text-dim)">\u2014</span>';
                    }
                    html += '<span class="mastery-item-name">' + v.title + '</span>';
                    html += '<div class="mastery-item-bar"><div class="mastery-item-fill" style="width:' + mPct + '%"></div></div>';
                    html += '<span class="mastery-item-pct">' + mPct + '%</span>';
                    html += '</div>';
                });
            });

            html += '</div>';
        }

        view.innerHTML = html;

        // Bind train button
        var trainBtn = view.querySelector('.skill-train-btn');
        if (trainBtn) {
            trainBtn.addEventListener('click', function() {
                if (window.GameAudio) window.GameAudio.playMenuSelect();

                // Find the concept name for this skill
                var conceptName = null;
                var exerciseData = window.Combat ? window.Combat.getExerciseData() : null;
                var conceptKey = window.GameState ? window.GameState.conceptToSkillKey : function(c) { return c; };

                if (exerciseData) {
                    // Check warmups
                    if (exerciseData.warmups) {
                        exerciseData.warmups.forEach(function(w) {
                            if (w.concept && conceptKey(w.concept) === skillKey) {
                                conceptName = w.concept;
                            }
                        });
                    }
                    // Check challenges
                    if (exerciseData.challenges) {
                        exerciseData.challenges.forEach(function(c) {
                            if (c.concept && conceptKey(c.concept) === skillKey) {
                                conceptName = c.concept;
                            }
                        });
                    }
                }

                // Navigate to training ground
                if (window.App) window.App.navigateTo('training');

                // Set the filter after a short delay to let the view render
                setTimeout(function() {
                    if (conceptName && window.Combat) {
                        window.Combat.setConceptFilter(conceptName);

                        // Update UI to show active filter
                        var btns = document.querySelectorAll('#challenge-concept-filter .concept-btn');
                        btns.forEach(function(b) {
                            b.classList.remove('active');
                            if (b.dataset.concept === conceptName) b.classList.add('active');
                        });

                        // Also set warmup filter
                        var warmupBtns = document.querySelectorAll('#warmup-concept-filter .concept-btn');
                        warmupBtns.forEach(function(b) {
                            b.classList.remove('active');
                            if (b.dataset.concept === conceptName) b.classList.add('active');
                        });

                        // Scroll to challenges section
                        var challengesSection = document.querySelector('#challenges-container');
                        if (challengesSection) {
                            challengesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                }, 150);
            });
        }
    }

    function renderStatsView() {
        var view = document.getElementById('view-stats');
        if (!view || !window.GameState) return;

        var player = window.GameState.getPlayer();
        var xpProgress = window.GameState.getPlayerXPProgress();
        var completedCount = window.GameState.getCompletedCount();

        var html = '';

        // Streak widget and daily challenges (if Gamification available)
        if (window.Gamification) {
            html += window.Gamification.renderStreakWidget();
            html += window.Gamification.renderDailyChallenges();
        }

        // Player overview
        html += '<div class="section-title" style="margin-top:0">Player</div>';
        html += '<div class="skill-header">' +
            '<div class="skill-level-badge">' + player.level + '</div>' +
            '<div class="skill-info">';
        html += '<div class="skill-name">' + player.name + '</div>';
        html += '<div class="skill-xp-info">' + player.totalXP + ' total XP &bull; ' + completedCount + ' shadows defeated</div>' +
                '<div class="skill-xp-bar"><div class="skill-xp-fill" style="width:' + xpProgress.pct + '%"></div></div>' +
                '<div class="skill-xp-info">' + xpProgress.current + ' / ' + xpProgress.needed + ' XP to next level</div>' +
            '</div></div>';

        // Social Stats
        html += '<div class="section-title">Social Stats</div>';
        html += '<div class="stats-grid">';
        var statNames = ['knowledge', 'proficiency', 'guts', 'charm', 'kindness'];
        statNames.forEach(function(stat) {
            var val = player.stats[stat] || 0;
            var rank = window.GameState.getStatRank(val);
            html += '<div class="stat-item">' +
                '<div class="stat-name">' + stat + '</div>' +
                '<div class="stat-value">' + val + '</div>' +
                (rank ? '<div class="stat-rank">' + rank + '</div>' : '') +
            '</div>';
        });
        html += '</div>';

        // Achievements (if Gamification available)
        if (window.Gamification) {
            html += '<div class="section-title">Achievements</div>';
            html += window.Gamification.renderAchievements(true);
        }

        // Skills overview
        html += '<div class="section-title">Skills</div>';
        var skills = window.GameState.getSkills();
        var skillDefs = window.GameState.getSkillDefs();
        html += '<div class="mastery-list">';
        Object.keys(skillDefs).forEach(function(key) {
            var skill = skills[key] || { level: 1, xp: 0 };
            var xpNeeded = window.GameState.skillXPForLevel(skill.level);
            var pct = Math.min(100, Math.round(skill.xp / xpNeeded * 100));
            html += '<div class="mastery-item" style="cursor:pointer" data-skill-nav="' + key + '">' +
                '<span class="mastery-item-grade" style="color:var(--gold);font-size:0.85rem">' + skill.level + '</span>' +
                '<span class="mastery-item-name">' + skillDefs[key].label + '</span>' +
                '<div class="mastery-item-bar"><div class="mastery-item-fill" style="width:' + pct + '%"></div></div>' +
                '<span class="mastery-item-pct">' + pct + '%</span>' +
            '</div>';
        });
        html += '</div>';

        // Detailed Statistics (if Gamification available)
        if (window.Gamification) {
            html += '<div class="section-title">Statistics</div>';
            html += window.Gamification.renderStatistics();
        }

        // Progress Analytics (visual charts)
        if (window.Analytics) {
            html += '<div class="section-title">Progress Analytics</div>';
            html += window.Analytics.render();
        }

        view.innerHTML = html;

        // Bind skill clicks
        view.querySelectorAll('[data-skill-nav]').forEach(function(el) {
            el.addEventListener('click', function() {
                if (window.App) window.App.navigateTo('skill-' + el.dataset.skillNav);
            });
        });
    }

    window.Skills = {
        renderSkillPage: renderSkillPage,
        renderStatsView: renderStatsView
    };
})();
