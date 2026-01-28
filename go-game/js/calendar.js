/**
 * Go Grind - Activity Calendar & Streak Tracking
 */
(function() {
    'use strict';

    function renderCalendarView() {
        var view = document.getElementById('view-calendar');
        if (!view || !window.GameState) return;

        // Theme detection
        var T = window.ThemeRegistry;
        var is4X = T && T.getThemeId() === '4x-strategy';

        // Themed labels
        var streakTitle = is4X ? 'Supply Line' : 'Streak';
        var currentStreakLabel = is4X ? 'Active Supply Chain' : 'Current Streak';
        var longestLabel = is4X ? 'Longest Chain' : 'Longest';
        var exercisesLabel = is4X ? 'Total Operations' : 'Total Exercises';
        var xpLabel = is4X ? 'Total Production' : 'Total XP';
        var activeDaysLabel = is4X ? 'Campaign Days' : 'Active Days';
        var xpAbbr = is4X ? 'PP' : 'XP';
        var exerciseWord = is4X ? 'operations' : 'exercises';
        var heatmapTitle = is4X ? 'Campaign Timeline' : 'Activity Heatmap';
        var recentTitle = is4X ? 'Recent Operations' : 'Recent Activity';
        var noActivityMsg = is4X ? 'No operations yet. Begin your campaign!' : 'No activity yet. Start training!';

        var calendar = window.GameState.getCalendar();
        var streaks = window.GameState.getStreaks();

        var html = '';

        // Streak
        html += '<div class="section-title" style="margin-top:0">' + streakTitle + '</div>';
        html += '<div class="mementos-streak">' + (streaks.current || 0) + ' DAYS</div>';
        html += '<div class="mementos-streak-label">' + currentStreakLabel + '</div>';
        html += '<div style="text-align:center;font-family:var(--font-mono);font-size:0.8rem;color:var(--text-dim);margin-top:0.5rem">' + longestLabel + ': ' + (streaks.longest || 0) + ' days</div>';

        // Totals
        var totalXP = 0, totalExercises = 0, activeDays = 0;
        Object.keys(calendar).forEach(function(date) {
            var day = calendar[date];
            totalXP += day.xpEarned || 0;
            totalExercises += day.exercisesCompleted || 0;
            activeDays++;
        });

        html += '<div class="calendar-totals">' +
            '<div class="calendar-total-item"><div class="calendar-total-value">' + totalExercises + '</div><div class="calendar-total-label">' + exercisesLabel + '</div></div>' +
            '<div class="calendar-total-item"><div class="calendar-total-value">' + totalXP + '</div><div class="calendar-total-label">' + xpLabel + '</div></div>' +
            '<div class="calendar-total-item"><div class="calendar-total-value">' + activeDays + '</div><div class="calendar-total-label">' + activeDaysLabel + '</div></div>' +
        '</div>';

        // Weekly average
        if (activeDays > 0) {
            var avgXP = Math.round(totalXP / activeDays);
            var avgEx = (totalExercises / activeDays).toFixed(1);
            html += '<div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-dim);margin:1rem 0">Daily average: ' + avgXP + ' ' + xpAbbr + ', ' + avgEx + ' ' + exerciseWord + '</div>';
        }

        // Heatmap (last 56 days = 8 weeks)
        html += '<div class="section-title">' + heatmapTitle + '</div>';
        html += '<div class="calendar-container">';

        // Day labels
        html += '<div style="display:flex;gap:3px;margin-bottom:4px">';
        ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(function(d) {
            html += '<div style="width:calc((100% - 18px)/7);max-width:36px;text-align:center;font-size:0.55rem;color:var(--text-dim)">' + d + '</div>';
        });
        html += '</div>';

        html += '<div class="calendar-grid">';
        for (var d = 55; d >= 0; d--) {
            var date = new Date(Date.now() - d * 86400000);
            var dateKey = date.toISOString().split('T')[0];
            var dayData = calendar[dateKey];
            var cls = 'calendar-day';
            var title = dateKey;
            if (dayData) {
                var xp = dayData.xpEarned || 0;
                if (xp >= 200) cls += ' activity-high';
                else if (xp >= 100) cls += ' activity-med';
                else if (xp > 0) cls += ' activity-low';
                else cls += ' has-activity';
                title += ': ' + xp + ' ' + xpAbbr + ', ' + (dayData.exercisesCompleted || 0) + ' ' + exerciseWord;
            }
            html += '<div class="' + cls + '" title="' + title + '"></div>';
        }
        html += '</div>';

        html += '<div class="calendar-streak">' + currentStreakLabel + ': ' + (streaks.current || 0) + ' days &bull; ' + longestLabel + ': ' + (streaks.longest || 0) + ' days</div>';
        html += '</div>';

        // Recent activity
        html += '<div class="section-title">' + recentTitle + '</div>';
        var dates = Object.keys(calendar).sort().reverse().slice(0, 14);
        if (dates.length === 0) {
            html += '<p style="color:var(--text-dim)">' + noActivityMsg + '</p>';
        } else {
            html += '<div class="mastery-list">';
            dates.forEach(function(date) {
                var day = calendar[date];
                html += '<div class="mastery-item">' +
                    '<span class="mastery-item-name" style="font-family:var(--font-mono)">' + date + '</span>' +
                    '<span style="color:var(--gold);font-family:var(--font-mono);font-size:0.8rem">+' + (day.xpEarned || 0) + ' ' + xpAbbr + '</span>' +
                    '<span style="color:var(--text-dim);font-family:var(--font-mono);font-size:0.8rem">' + (day.exercisesCompleted || 0) + ' ' + exerciseWord + '</span>' +
                '</div>';
            });
            html += '</div>';
        }

        view.innerHTML = html;
    }

    window.Calendar = {
        renderCalendarView: renderCalendarView
    };
})();
