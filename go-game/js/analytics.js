/**
 * Go Grind - Progress Analytics
 * Visual charts and graphs for tracking progress
 */
(function() {
    'use strict';

    // Get theme labels
    function getLabels() {
        var T = window.ThemeRegistry;
        var is4X = T && T.getThemeId() === '4x-strategy';

        return {
            title: is4X ? 'Campaign Analytics' : 'Progress Analytics',
            activity: is4X ? 'Operations Activity' : 'Activity',
            grades: is4X ? 'Commendation Distribution' : 'Grade Distribution',
            concepts: is4X ? 'Doctrine Proficiency' : 'Concept Mastery',
            weekly: is4X ? 'Weekly Deployment' : 'Weekly Progress',
            recent: is4X ? 'Recent Operations' : 'Recent Activity',
            noData: is4X ? 'No operations data yet. Deploy to the field!' : 'No data yet. Complete some exercises!',
            exercises: is4X ? 'ops' : 'exercises',
            gradeNames: is4X
                ? { S: 'DSC', A: 'OM', B: 'BS', C: 'SAT', F: 'CM' }
                : { S: 'S', A: 'A', B: 'B', C: 'C', F: 'F' }
        };
    }

    // Get analytics data from game state
    function getAnalyticsData() {
        if (!window.GameState) return null;

        var state = window.GameState.getFullState();
        var gam = state.gamification || {};
        var stats = gam.statistics || {};
        var completed = state.completedExercises || {};
        var mastery = state.mastery || {};

        // Build exercises by day (last 12 weeks)
        var exercisesByDay = stats.exercisesByDay || {};

        // Build concept performance
        var conceptStats = {};
        Object.keys(completed).forEach(function(key) {
            var ex = completed[key];
            if (ex.concept) {
                if (!conceptStats[ex.concept]) {
                    conceptStats[ex.concept] = { total: 0, grades: { S: 0, A: 0, B: 0, C: 0, F: 0 } };
                }
                conceptStats[ex.concept].total++;
                if (ex.grade && conceptStats[ex.concept].grades[ex.grade] !== undefined) {
                    conceptStats[ex.concept].grades[ex.grade]++;
                }
            }
        });

        // Build recent activity (last 10)
        var recentList = [];
        Object.keys(completed).forEach(function(key) {
            var ex = completed[key];
            if (ex.timestamp) {
                recentList.push({
                    key: key,
                    title: ex.title || key,
                    grade: ex.grade,
                    concept: ex.concept,
                    timestamp: ex.timestamp,
                    xp: ex.xpEarned || 0
                });
            }
        });
        recentList.sort(function(a, b) { return b.timestamp - a.timestamp; });
        recentList = recentList.slice(0, 10);

        return {
            exercisesByDay: exercisesByDay,
            exercisesByGrade: stats.exercisesByGrade || { S: 0, A: 0, B: 0, C: 0, F: 0 },
            conceptStats: conceptStats,
            recent: recentList,
            totalXP: state.player.totalXP || 0,
            totalCompleted: Object.keys(completed).length
        };
    }

    // Render activity heatmap (GitHub-style)
    function renderActivityHeatmap(data) {
        var L = getLabels();
        var html = '<div class="analytics-section">';
        html += '<div class="analytics-section-title">' + L.activity + '</div>';

        // Generate last 12 weeks of dates
        var today = new Date();
        var weeks = [];
        var dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

        // Start from 12 weeks ago, aligned to Sunday
        var startDate = new Date(today);
        startDate.setDate(startDate.getDate() - (12 * 7) - startDate.getDay());

        for (var w = 0; w < 13; w++) {
            var week = [];
            for (var d = 0; d < 7; d++) {
                var date = new Date(startDate);
                date.setDate(date.getDate() + (w * 7) + d);
                var dateKey = date.toISOString().split('T')[0];
                var count = data.exercisesByDay[dateKey] || 0;
                var level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 10 ? 3 : 4;
                week.push({
                    date: dateKey,
                    count: count,
                    level: level,
                    future: date > today
                });
            }
            weeks.push(week);
        }

        html += '<div class="heatmap-container">';
        html += '<div class="heatmap-days">';
        dayNames.forEach(function(d, i) {
            if (i % 2 === 1) {
                html += '<div class="heatmap-day-label">' + d + '</div>';
            } else {
                html += '<div class="heatmap-day-label"></div>';
            }
        });
        html += '</div>';

        html += '<div class="heatmap-grid">';
        weeks.forEach(function(week) {
            html += '<div class="heatmap-week">';
            week.forEach(function(day) {
                var cls = 'heatmap-cell level-' + day.level;
                if (day.future) cls += ' future';
                html += '<div class="' + cls + '" title="' + day.date + ': ' + day.count + ' ' + L.exercises + '"></div>';
            });
            html += '</div>';
        });
        html += '</div>';
        html += '</div>';

        // Legend
        html += '<div class="heatmap-legend">';
        html += '<span>Less</span>';
        for (var i = 0; i <= 4; i++) {
            html += '<div class="heatmap-cell level-' + i + '"></div>';
        }
        html += '<span>More</span>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    // Render grade distribution bar chart
    function renderGradeChart(data) {
        var L = getLabels();
        var html = '<div class="analytics-section">';
        html += '<div class="analytics-section-title">' + L.grades + '</div>';

        var grades = data.exercisesByGrade;
        var total = Object.values(grades).reduce(function(a, b) { return a + b; }, 0);

        if (total === 0) {
            html += '<div class="analytics-empty">' + L.noData + '</div>';
            html += '</div>';
            return html;
        }

        var gradeOrder = ['S', 'A', 'B', 'C', 'F'];
        var maxCount = Math.max.apply(null, gradeOrder.map(function(g) { return grades[g] || 0; }));

        html += '<div class="grade-chart">';
        gradeOrder.forEach(function(grade) {
            var count = grades[grade] || 0;
            var pct = total > 0 ? Math.round(count / total * 100) : 0;
            var barHeight = maxCount > 0 ? Math.round(count / maxCount * 100) : 0;

            html += '<div class="grade-bar-container">';
            html += '<div class="grade-bar-wrapper">';
            html += '<div class="grade-bar grade-' + grade + '" style="height:' + barHeight + '%"></div>';
            html += '</div>';
            html += '<div class="grade-bar-label grade-' + grade + '">' + L.gradeNames[grade] + '</div>';
            html += '<div class="grade-bar-count">' + count + '</div>';
            html += '<div class="grade-bar-pct">' + pct + '%</div>';
            html += '</div>';
        });
        html += '</div>';

        html += '</div>';
        return html;
    }

    // Render concept mastery bars
    function renderConceptMastery(data) {
        var L = getLabels();
        var html = '<div class="analytics-section">';
        html += '<div class="analytics-section-title">' + L.concepts + '</div>';

        var concepts = data.conceptStats;
        var conceptKeys = Object.keys(concepts);

        if (conceptKeys.length === 0) {
            html += '<div class="analytics-empty">' + L.noData + '</div>';
            html += '</div>';
            return html;
        }

        // Sort by total completed, descending
        conceptKeys.sort(function(a, b) {
            return concepts[b].total - concepts[a].total;
        });

        // Show top 8 concepts
        conceptKeys = conceptKeys.slice(0, 8);

        html += '<div class="concept-mastery-list">';
        conceptKeys.forEach(function(concept) {
            var stats = concepts[concept];
            var total = stats.total;
            var saPct = total > 0 ? Math.round((stats.grades.S + stats.grades.A) / total * 100) : 0;

            html += '<div class="concept-mastery-item">';
            html += '<div class="concept-mastery-header">';
            html += '<span class="concept-mastery-name">' + concept + '</span>';
            html += '<span class="concept-mastery-count">' + total + ' ' + L.exercises + '</span>';
            html += '</div>';
            html += '<div class="concept-mastery-bar-bg">';
            html += '<div class="concept-mastery-bar" style="width:' + saPct + '%"></div>';
            html += '</div>';
            html += '<div class="concept-mastery-pct">' + saPct + '% mastery</div>';
            html += '</div>';
        });
        html += '</div>';

        html += '</div>';
        return html;
    }

    // Render weekly progress
    function renderWeeklyProgress(data) {
        var L = getLabels();
        var html = '<div class="analytics-section">';
        html += '<div class="analytics-section-title">' + L.weekly + '</div>';

        // Calculate exercises per week for last 8 weeks
        var today = new Date();
        var weeks = [];

        for (var w = 7; w >= 0; w--) {
            var weekStart = new Date(today);
            weekStart.setDate(weekStart.getDate() - (w * 7) - weekStart.getDay());

            var weekCount = 0;
            for (var d = 0; d < 7; d++) {
                var date = new Date(weekStart);
                date.setDate(date.getDate() + d);
                var dateKey = date.toISOString().split('T')[0];
                weekCount += data.exercisesByDay[dateKey] || 0;
            }

            weeks.push({
                label: 'W' + (8 - w),
                count: weekCount
            });
        }

        var maxWeek = Math.max.apply(null, weeks.map(function(w) { return w.count; }));

        html += '<div class="weekly-chart">';
        weeks.forEach(function(week, i) {
            var barHeight = maxWeek > 0 ? Math.round(week.count / maxWeek * 100) : 0;
            var isLatest = i === weeks.length - 1;

            html += '<div class="weekly-bar-container' + (isLatest ? ' current' : '') + '">';
            html += '<div class="weekly-bar-wrapper">';
            html += '<div class="weekly-bar" style="height:' + barHeight + '%">' +
                    '<span class="weekly-bar-value">' + week.count + '</span></div>';
            html += '</div>';
            html += '<div class="weekly-bar-label">' + week.label + '</div>';
            html += '</div>';
        });
        html += '</div>';

        html += '</div>';
        return html;
    }

    // Render recent activity
    function renderRecentActivity(data) {
        var L = getLabels();
        var html = '<div class="analytics-section">';
        html += '<div class="analytics-section-title">' + L.recent + '</div>';

        if (data.recent.length === 0) {
            html += '<div class="analytics-empty">' + L.noData + '</div>';
            html += '</div>';
            return html;
        }

        html += '<div class="recent-activity-list">';
        data.recent.forEach(function(item) {
            var timeAgo = getTimeAgo(item.timestamp);
            html += '<div class="recent-activity-item">';
            html += '<span class="recent-grade grade-' + item.grade + '">' + (L.gradeNames[item.grade] || item.grade) + '</span>';
            html += '<span class="recent-title">' + escapeHtml(item.title || item.concept || 'Exercise') + '</span>';
            html += '<span class="recent-xp">+' + item.xp + ' XP</span>';
            html += '<span class="recent-time">' + timeAgo + '</span>';
            html += '</div>';
        });
        html += '</div>';

        html += '</div>';
        return html;
    }

    function getTimeAgo(timestamp) {
        var now = Date.now();
        var diff = now - timestamp;
        var minutes = Math.floor(diff / 60000);
        var hours = Math.floor(diff / 3600000);
        var days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'just now';
        if (minutes < 60) return minutes + 'm ago';
        if (hours < 24) return hours + 'h ago';
        if (days < 7) return days + 'd ago';
        return new Date(timestamp).toLocaleDateString();
    }

    function escapeHtml(text) {
        if (!text) return '';
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Main render function
    function renderAnalytics() {
        var data = getAnalyticsData();
        if (!data) return '<div class="analytics-empty">Loading...</div>';

        var L = getLabels();
        var html = '';

        html += '<div class="analytics-container">';

        // Activity heatmap
        html += renderActivityHeatmap(data);

        // Two-column layout for charts
        html += '<div class="analytics-row">';
        html += '<div class="analytics-col">';
        html += renderGradeChart(data);
        html += '</div>';
        html += '<div class="analytics-col">';
        html += renderWeeklyProgress(data);
        html += '</div>';
        html += '</div>';

        // Concept mastery
        html += renderConceptMastery(data);

        // Recent activity
        html += renderRecentActivity(data);

        html += '</div>';

        return html;
    }

    // Public API
    window.Analytics = {
        render: renderAnalytics,
        getData: getAnalyticsData
    };
})();
