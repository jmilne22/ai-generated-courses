/**
 * Go Grind - Activity Calendar & Streak Tracking
 */
(function() {
    'use strict';

    function renderCalendarView() {
        var view = document.getElementById('view-calendar');
        if (!view || !window.GameState) return;

        var calendar = window.GameState.getCalendar();
        var streaks = window.GameState.getStreaks();

        var html = '';

        // Streak
        html += '<div class="section-title" style="margin-top:0">Streak</div>';
        html += '<div class="mementos-streak">' + (streaks.current || 0) + ' DAYS</div>';
        html += '<div class="mementos-streak-label">Current Streak</div>';
        html += '<div style="text-align:center;font-family:var(--font-mono);font-size:0.8rem;color:var(--text-dim);margin-top:0.5rem">Longest: ' + (streaks.longest || 0) + ' days</div>';

        // Totals
        var totalXP = 0, totalExercises = 0, activeDays = 0;
        Object.keys(calendar).forEach(function(date) {
            var day = calendar[date];
            totalXP += day.xpEarned || 0;
            totalExercises += day.exercisesCompleted || 0;
            activeDays++;
        });

        html += '<div class="calendar-totals">' +
            '<div class="calendar-total-item"><div class="calendar-total-value">' + totalExercises + '</div><div class="calendar-total-label">Total Exercises</div></div>' +
            '<div class="calendar-total-item"><div class="calendar-total-value">' + totalXP + '</div><div class="calendar-total-label">Total XP</div></div>' +
            '<div class="calendar-total-item"><div class="calendar-total-value">' + activeDays + '</div><div class="calendar-total-label">Active Days</div></div>' +
        '</div>';

        // Weekly average
        if (activeDays > 0) {
            var avgXP = Math.round(totalXP / activeDays);
            var avgEx = (totalExercises / activeDays).toFixed(1);
            html += '<div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-dim);margin:1rem 0">Daily average: ' + avgXP + ' XP, ' + avgEx + ' exercises</div>';
        }

        // Heatmap (last 56 days = 8 weeks)
        html += '<div class="section-title">Activity Heatmap</div>';
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
                title += ': ' + xp + ' XP, ' + (dayData.exercisesCompleted || 0) + ' exercises';
            }
            html += '<div class="' + cls + '" title="' + title + '"></div>';
        }
        html += '</div>';

        html += '<div class="calendar-streak">Current Streak: ' + (streaks.current || 0) + ' days &bull; Longest: ' + (streaks.longest || 0) + ' days</div>';
        html += '</div>';

        // Recent activity
        html += '<div class="section-title">Recent Activity</div>';
        var dates = Object.keys(calendar).sort().reverse().slice(0, 14);
        if (dates.length === 0) {
            html += '<p style="color:var(--text-dim)">No activity yet. Start training!</p>';
        } else {
            html += '<div class="mastery-list">';
            dates.forEach(function(date) {
                var day = calendar[date];
                html += '<div class="mastery-item">' +
                    '<span class="mastery-item-name" style="font-family:var(--font-mono)">' + date + '</span>' +
                    '<span style="color:var(--gold);font-family:var(--font-mono);font-size:0.8rem">+' + (day.xpEarned || 0) + ' XP</span>' +
                    '<span style="color:var(--text-dim);font-family:var(--font-mono);font-size:0.8rem">' + (day.exercisesCompleted || 0) + ' exercises</span>' +
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
