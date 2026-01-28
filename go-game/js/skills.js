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

        // Theme detection
        var T = window.ThemeRegistry;
        var is4X = T && T.getThemeId() === '4x-strategy';

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

        // Get themed labels
        var xpLabel = is4X ? 'PP' : 'XP';
        var xpWord = is4X ? 'Production' : 'XP';
        var trainLabel = is4X ? 'DEPLOY' : 'TRAIN';
        var masteryLabel = is4X ? 'Campaign Progress' : 'Total Mastery';
        var milestonesLabel = is4X ? 'Doctrines' : 'Milestones';
        var exerciseMasteryLabel = is4X ? 'Operation Progress' : 'Exercise Mastery';

        // Get themed skill info
        var themeSkill = is4X && T.getSkillInfo ? T.getSkillInfo(skillKey) : null;
        var skillLabel = themeSkill ? themeSkill.label : def.label;
        var techTier = themeSkill ? themeSkill.techTier : null;

        // Get general info for 4X theme
        var general = is4X && T.getPersonaInfo ? T.getPersonaInfo(skillKey) : null;

        var html = '';

        // General card (4X theme only)
        if (is4X && general) {
            html += '<div class="general-card" style="background:var(--surface-color);border:2px solid var(--border-color);border-radius:8px;padding:1rem;margin-bottom:1rem;display:flex;gap:1rem;align-items:center">';
            html += '<div class="general-insignia" style="font-size:2rem;color:var(--gold)">' + T.getIcon('general', '🎖️') + '</div>';
            html += '<div class="general-details">';
            html += '<div class="general-name" style="font-weight:bold;color:var(--gold)">' + general.name + '</div>';
            html += '<div class="general-title" style="font-size:0.85rem;color:var(--accent)">"' + general.title + '"</div>';
            html += '<div class="general-branch" style="font-size:0.75rem;color:var(--text-dim)">' + general.branch + '</div>';
            if (general.bio) {
                html += '<div class="general-bio" style="font-size:0.75rem;color:var(--text-secondary);margin-top:0.25rem">' + general.bio + '</div>';
            }
            html += '</div>';
            html += '</div>';
        }

        // Skill/Technology header
        html += '<div class="skill-header">' +
            '<div class="skill-level-badge">' + skill.level + '</div>' +
            '<div class="skill-info">' +
                '<div class="skill-name">' + skillLabel + (techTier ? ' <span style="color:var(--text-dim);font-size:0.75rem">[Tier ' + techTier + ']</span>' : '') + '</div>' +
                '<div class="skill-xp-info">' + skill.xp + ' / ' + xpNeeded + ' ' + xpLabel + ' to next level</div>' +
                '<div class="skill-xp-bar"><div class="skill-xp-fill" style="width:' + xpPct + '%"></div></div>' +
            '</div>' +
            '<button class="skill-train-btn" data-skill="' + skillKey + '">' + trainLabel + '</button>' +
        '</div>';

        // Mastery overview
        html += '<div class="mastery-total">' + masteryLabel + ': ' + masteryPct + '%</div>';

        // Milestones/Doctrines
        html += '<div class="section-title">' + milestonesLabel + '</div>';
        html += '<div class="milestones">';
        MILESTONES.forEach(function(m) {
            var unlocked = skill.level >= m.level;
            var label = is4X ? m.label4x : m.label;
            html += '<div class="milestone-item ' + (unlocked ? 'unlocked' : 'locked') + '">' +
                '<span class="milestone-level">LV ' + m.level + '</span>' +
                '<span>' + (unlocked ? '\u2713 ' : '') + label + '</span></div>';
        });
        html += '</div>';

        // Exercise/Operation mastery list
        if (exerciseData) {
            html += '<div class="section-title">' + exerciseMasteryLabel + '</div>';
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

                    // Use themed grade display for 4X
                    var gradeDisplay = grade;
                    if (is4X && grade && T.getTheme && T.getTheme().gradeShort) {
                        gradeDisplay = T.getTheme().gradeShort[grade] || grade;
                    }

                    html += '<div class="mastery-item ' + (completed ? '' : 'locked') + '">';
                    if (grade) {
                        html += '<span class="mastery-item-grade grade-' + grade + '">' + gradeDisplay + '</span>';
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

        // Theme detection
        var T = window.ThemeRegistry;
        var is4X = T && T.getThemeId() === '4x-strategy';

        var player = window.GameState.getPlayer();
        var xpProgress = window.GameState.getPlayerXPProgress();
        var completedCount = window.GameState.getCompletedCount();

        // Themed labels
        var playerLabel = is4X ? 'Empire Status' : 'Player';
        var playerName = is4X ? 'Supreme Commander' : player.name;
        var xpLabel = is4X ? 'Production Points' : 'total XP';
        var xpAbbr = is4X ? 'PP' : 'XP';
        var defeatedLabel = is4X ? 'operations completed' : 'shadows defeated';
        var socialStatsLabel = is4X ? 'National Power' : 'Social Stats';
        var achievementsLabel = is4X ? 'Decorations' : 'Achievements';
        var skillsLabel = is4X ? 'Technologies' : 'Skills';
        var statsLabel = is4X ? 'War Statistics' : 'Statistics';

        var html = '';

        // Streak widget and daily challenges (if Gamification available)
        if (window.Gamification) {
            html += window.Gamification.renderStreakWidget();
            html += window.Gamification.renderDailyChallenges();
        }

        // Military rank badge for 4X theme
        var rankInfo = is4X && T.getRankForLevel ? T.getRankForLevel(player.level) : null;

        // Player overview
        html += '<div class="section-title" style="margin-top:0">' + playerLabel + '</div>';
        html += '<div class="skill-header">' +
            '<div class="skill-level-badge">' + player.level + '</div>' +
            '<div class="skill-info">';
        if (is4X && rankInfo) {
            html += '<div class="skill-name">' + rankInfo.insignia + ' ' + rankInfo.name + '</div>';
            html += '<div class="skill-xp-info" style="color:var(--accent)">Supreme Commander</div>';
        } else {
            html += '<div class="skill-name">' + playerName + '</div>';
        }
        html += '<div class="skill-xp-info">' + player.totalXP + ' ' + xpLabel + ' &bull; ' + completedCount + ' ' + defeatedLabel + '</div>' +
                '<div class="skill-xp-bar"><div class="skill-xp-fill" style="width:' + xpProgress.pct + '%"></div></div>' +
                '<div class="skill-xp-info">' + xpProgress.current + ' / ' + xpProgress.needed + ' ' + xpAbbr + ' to next level</div>' +
            '</div></div>';

        // Social Stats / National Power
        html += '<div class="section-title">' + socialStatsLabel + '</div>';
        html += '<div class="stats-grid">';
        var statNames = ['knowledge', 'proficiency', 'guts', 'charm', 'kindness'];
        statNames.forEach(function(stat) {
            var val = player.stats[stat] || 0;
            var rank = window.GameState.getStatRank(val);
            var statDisplayName = is4X && T.getStatLabel ? T.getStatLabel(stat) : stat;
            html += '<div class="stat-item">' +
                '<div class="stat-name">' + statDisplayName + '</div>' +
                '<div class="stat-value">' + val + '</div>' +
                (rank ? '<div class="stat-rank">' + rank + '</div>' : '') +
            '</div>';
        });
        html += '</div>';

        // Achievements / Decorations (if Gamification available)
        if (window.Gamification) {
            html += '<div class="section-title">' + achievementsLabel + '</div>';
            html += window.Gamification.renderAchievements(true);
        }

        // Skills / Technologies overview
        html += '<div class="section-title">' + skillsLabel + '</div>';
        var skills = window.GameState.getSkills();
        var skillDefs = window.GameState.getSkillDefs();
        html += '<div class="mastery-list">';
        Object.keys(skillDefs).forEach(function(key) {
            var skill = skills[key] || { level: 1, xp: 0 };
            var xpNeeded = window.GameState.skillXPForLevel(skill.level);
            var pct = Math.min(100, Math.round(skill.xp / xpNeeded * 100));
            var themeSkill = is4X && T.getSkillInfo ? T.getSkillInfo(key) : null;
            var skillLabel = themeSkill ? themeSkill.label : skillDefs[key].label;
            html += '<div class="mastery-item" style="cursor:pointer" data-skill-nav="' + key + '">' +
                '<span class="mastery-item-grade" style="color:var(--gold);font-size:0.85rem">' + skill.level + '</span>' +
                '<span class="mastery-item-name">' + skillLabel + '</span>' +
                '<div class="mastery-item-bar"><div class="mastery-item-fill" style="width:' + pct + '%"></div></div>' +
                '<span class="mastery-item-pct">' + pct + '%</span>' +
            '</div>';
        });
        html += '</div>';

        // Detailed Statistics / War Statistics (if Gamification available)
        if (window.Gamification) {
            html += '<div class="section-title">' + statsLabel + '</div>';
            html += window.Gamification.renderStatistics();
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
