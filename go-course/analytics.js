/**
 * Weak Concept Report — Analytics for Go Course
 *
 * Reads SRS and exercise-progress data from localStorage,
 * groups by module, computes strength rankings, and renders
 * a visual report of the weakest concepts.
 */
(function() {
    'use strict';

    const MODULE_NAMES = {
        0: 'Quick Reference', 1: 'Go Fundamentals', 2: 'Pointers & Memory',
        3: 'Structs Deep Dive', 4: 'Interfaces & Polymorphism', 5: 'Data Structures',
        6: 'CLI Foundations', 7: 'Files, YAML & Shell', 8: 'Building TUIs',
        9: 'Error Handling & Testing', 10: 'Design Patterns', 11: 'HTTP & API Design',
        12: 'Concurrency & Goroutines', 13: 'Project Structure', 14: 'System Interaction',
        15: 'Sets & Diffing', 16: 'Unit Testing', 17: 'Integration Testing'
    };

    // ---------------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------------

    /** Extract module number from an exercise key like "m2_warmup_1" */
    function extractModuleNum(key) {
        var match = key.match(/^m(\d+)_/);
        return match ? parseInt(match[1], 10) : null;
    }

    /** Prettify an exercise key: "m2_warmup_1" -> "Module 2 — Warmup 1" */
    function prettifyKey(key) {
        var match = key.match(/^m(\d+)_(\w+?)_(\d+)$/);
        if (!match) return key;
        var modNum = match[1];
        var type = match[2].charAt(0).toUpperCase() + match[2].slice(1);
        var num = match[3];
        return 'Module ' + modNum + ' \u2014 ' + type + ' ' + num;
    }

    /** Return a human-readable relative-date string for a nextReview ISO date */
    function dueStatus(nextReview) {
        if (!nextReview) return '';
        var now = new Date();
        now.setHours(0, 0, 0, 0);
        var due = new Date(nextReview);
        due.setHours(0, 0, 0, 0);
        var diffMs = due.getTime() - now.getTime();
        var diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Due today';
        if (diffDays < 0) return 'Due ' + Math.abs(diffDays) + ' day' + (Math.abs(diffDays) === 1 ? '' : 's') + ' ago';
        return 'Due in ' + diffDays + ' day' + (diffDays === 1 ? '' : 's');
    }

    /** Map a strength label to a CSS color variable */
    function strengthColor(label) {
        switch (label) {
            case 'Strong':   return 'var(--green-bright)';
            case 'Good':     return 'var(--cyan)';
            case 'Moderate': return 'var(--orange)';
            case 'Weak':     return 'var(--red)';
            default:         return 'var(--text-dim)';
        }
    }

    /** Determine strength label from average ease factor */
    function strengthLabel(avgEase) {
        if (avgEase >= 2.5) return 'Strong';
        if (avgEase >= 2.0) return 'Good';
        if (avgEase >= 1.7) return 'Moderate';
        return 'Weak';
    }

    // ---------------------------------------------------------------------------
    // Data Building
    // ---------------------------------------------------------------------------

    function buildReport() {
        // 1. Load SRS data
        var srsData;
        if (window.SRS && typeof window.SRS.getAll === 'function') {
            srsData = window.SRS.getAll();
        } else {
            try {
                srsData = JSON.parse(localStorage.getItem('go-course-srs') || '{}');
            } catch (e) {
                srsData = {};
            }
        }

        // 2. Load exercise progress data
        var progressData;
        if (window.ExerciseProgress && typeof window.ExerciseProgress.loadAll === 'function') {
            progressData = window.ExerciseProgress.loadAll();
        } else {
            try {
                progressData = JSON.parse(localStorage.getItem('go-course-exercise-progress') || '{}');
            } catch (e) {
                progressData = {};
            }
        }

        var srsKeys = Object.keys(srsData);
        if (srsKeys.length === 0) {
            return null; // no data yet
        }

        // 3. Group SRS entries by module
        var moduleMap = {}; // moduleNum -> { totalEase, count, mastered, entries[] }

        for (var i = 0; i < srsKeys.length; i++) {
            var key = srsKeys[i];
            var entry = srsData[key];
            var modNum = extractModuleNum(key);
            if (modNum === null) continue;

            if (!moduleMap[modNum]) {
                moduleMap[modNum] = { totalEase: 0, count: 0, mastered: 0, entries: [] };
            }
            moduleMap[modNum].totalEase += entry.easeFactor;
            moduleMap[modNum].count++;
            if (entry.easeFactor > 2.5) {
                moduleMap[modNum].mastered++;
            }
            moduleMap[modNum].entries.push({ key: key, easeFactor: entry.easeFactor, nextReview: entry.nextReview });
        }

        // 4. Build module summaries
        var modules = [];
        var moduleNums = Object.keys(moduleMap);
        for (var j = 0; j < moduleNums.length; j++) {
            var num = parseInt(moduleNums[j], 10);
            var data = moduleMap[num];
            var avgEase = data.totalEase / data.count;
            var label = strengthLabel(avgEase);
            modules.push({
                num: num,
                name: MODULE_NAMES[num] || ('Module ' + num),
                avgEase: Math.round(avgEase * 10) / 10,
                count: data.count,
                mastered: data.mastered,
                label: label,
                color: strengthColor(label)
            });
        }

        // Sort by average ease ascending (weakest first)
        modules.sort(function(a, b) { return a.avgEase - b.avgEase; });

        // 5. Top 10 weakest individual exercises
        var allExercises = [];
        for (var k = 0; k < srsKeys.length; k++) {
            var exKey = srsKeys[k];
            allExercises.push({
                key: exKey,
                easeFactor: srsData[exKey].easeFactor,
                nextReview: srsData[exKey].nextReview
            });
        }
        allExercises.sort(function(a, b) { return a.easeFactor - b.easeFactor; });
        var weakest = allExercises.slice(0, 10);

        // 6. Rating breakdown from exercise progress
        var gotIt = 0;
        var struggled = 0;
        var peeked = 0;
        var progressKeys = Object.keys(progressData);
        for (var p = 0; p < progressKeys.length; p++) {
            var prog = progressData[progressKeys[p]];
            if (prog.selfRating === 1) gotIt++;
            else if (prog.selfRating === 2) struggled++;
            else if (prog.selfRating === 3) peeked++;
        }

        // 7. Global stats
        var totalTracked = srsKeys.length;
        var totalEaseSum = 0;
        var masteredCount = 0;
        var weakCount = 0;
        for (var t = 0; t < srsKeys.length; t++) {
            var ef = srsData[srsKeys[t]].easeFactor;
            totalEaseSum += ef;
            if (ef > 2.5) masteredCount++;
            if (ef < 1.7) weakCount++;
        }
        var avgEaseGlobal = Math.round((totalEaseSum / totalTracked) * 10) / 10;

        return {
            totalTracked: totalTracked,
            avgEase: avgEaseGlobal,
            masteredCount: masteredCount,
            weakCount: weakCount,
            modules: modules,
            weakest: weakest,
            ratings: { gotIt: gotIt, struggled: struggled, peeked: peeked }
        };
    }

    // ---------------------------------------------------------------------------
    // Rendering
    // ---------------------------------------------------------------------------

    function renderReport() {
        var report = buildReport();

        var emptyEl = document.getElementById('analytics-empty');
        var reportEl = document.getElementById('analytics-report');

        if (!report) {
            // No data — show empty state
            emptyEl.style.display = '';
            reportEl.style.display = 'none';
            return;
        }

        // Data exists — swap visibility
        emptyEl.style.display = 'none';
        reportEl.style.display = '';

        // ------ Summary stats ------
        var statsEl = document.getElementById('analytics-stats');
        statsEl.innerHTML =
            '<div class="stat-card">' +
                '<div class="stat-value">' + report.totalTracked + '</div>' +
                '<div class="stat-label">Exercises Tracked</div>' +
            '</div>' +
            '<div class="stat-card">' +
                '<div class="stat-value">' + report.avgEase + '</div>' +
                '<div class="stat-label">Avg Ease Factor</div>' +
            '</div>' +
            '<div class="stat-card">' +
                '<div class="stat-value" style="color: var(--green-bright);">' + report.masteredCount + '</div>' +
                '<div class="stat-label">Mastered</div>' +
            '</div>' +
            '<div class="stat-card">' +
                '<div class="stat-value" style="color: var(--red);">' + report.weakCount + '</div>' +
                '<div class="stat-label">Weak</div>' +
            '</div>';

        // ------ Module Rankings ------
        var rankingsEl = document.getElementById('module-rankings');
        var rankingsHTML = '';
        for (var i = 0; i < report.modules.length; i++) {
            var mod = report.modules[i];
            var pct = Math.min(100, Math.round((mod.avgEase / 3.0) * 100));
            rankingsHTML +=
                '<div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: var(--bg-card); border-radius: 6px; margin-bottom: 0.5rem; border-left: 3px solid ' + mod.color + ';">' +
                    '<span style="color: var(--text-dim); min-width: 2rem;">M' + mod.num + '</span>' +
                    '<span style="flex: 1;">' + mod.name + '</span>' +
                    '<div style="width: 120px; height: 8px; background: var(--bg-lighter); border-radius: 4px; overflow: hidden;">' +
                        '<div style="width: ' + pct + '%; height: 100%; background: ' + mod.color + '; border-radius: 4px;"></div>' +
                    '</div>' +
                    '<span style="color: var(--text-dim); font-size: 0.85rem; min-width: 4rem;">' + mod.avgEase + '</span>' +
                    '<span class="module-tag" style="background: ' + mod.color + '; font-size: 0.75rem;">' + mod.label + '</span>' +
                '</div>';
        }
        rankingsEl.innerHTML = rankingsHTML;

        // ------ Weakest Exercises ------
        var weakestEl = document.getElementById('weakest-exercises');
        var weakestHTML = '';
        for (var w = 0; w < report.weakest.length; w++) {
            var ex = report.weakest[w];
            var rank = w + 1;
            var status = dueStatus(ex.nextReview);
            weakestHTML +=
                '<div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: var(--bg-card); border-radius: 6px; margin-bottom: 0.5rem;">' +
                    '<span style="color: var(--red); font-weight: 700; min-width: 2rem;">#' + rank + '</span>' +
                    '<span style="flex: 1;">' + prettifyKey(ex.key) + '</span>' +
                    '<span style="color: var(--text-dim);">Ease: ' + ex.easeFactor + '</span>' +
                    '<span style="color: var(--orange);">' + status + '</span>' +
                '</div>';
        }
        weakestEl.innerHTML = weakestHTML;

        // ------ Rating Breakdown ------
        var ratingEl = document.getElementById('rating-breakdown');
        var totalRatings = report.ratings.gotIt + report.ratings.struggled + report.ratings.peeked;
        var pctGot = totalRatings > 0 ? Math.round((report.ratings.gotIt / totalRatings) * 100) : 0;
        var pctStr = totalRatings > 0 ? Math.round((report.ratings.struggled / totalRatings) * 100) : 0;
        var pctPeek = totalRatings > 0 ? Math.round((report.ratings.peeked / totalRatings) * 100) : 0;

        ratingEl.innerHTML =
            // Got it
            '<div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">' +
                '<span style="min-width: 6rem; color: var(--green-bright);">Got it</span>' +
                '<div style="flex: 1; height: 24px; background: var(--bg-lighter); border-radius: 4px; overflow: hidden;">' +
                    '<div style="width: ' + pctGot + '%; height: 100%; background: var(--green-bright); border-radius: 4px; display: flex; align-items: center; padding-left: 8px; color: var(--bg-dark); font-weight: 700; font-size: 0.8rem;">' + report.ratings.gotIt + '</div>' +
                '</div>' +
            '</div>' +
            // Struggled
            '<div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">' +
                '<span style="min-width: 6rem; color: var(--orange);">Struggled</span>' +
                '<div style="flex: 1; height: 24px; background: var(--bg-lighter); border-radius: 4px; overflow: hidden;">' +
                    '<div style="width: ' + pctStr + '%; height: 100%; background: var(--orange); border-radius: 4px; display: flex; align-items: center; padding-left: 8px; color: var(--bg-dark); font-weight: 700; font-size: 0.8rem;">' + report.ratings.struggled + '</div>' +
                '</div>' +
            '</div>' +
            // Had to peek
            '<div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">' +
                '<span style="min-width: 6rem; color: var(--red);">Had to peek</span>' +
                '<div style="flex: 1; height: 24px; background: var(--bg-lighter); border-radius: 4px; overflow: hidden;">' +
                    '<div style="width: ' + pctPeek + '%; height: 100%; background: var(--red); border-radius: 4px; display: flex; align-items: center; padding-left: 8px; color: var(--bg-dark); font-weight: 700; font-size: 0.8rem;">' + report.ratings.peeked + '</div>' +
                '</div>' +
            '</div>';
    }

    // ---------------------------------------------------------------------------
    // Init
    // ---------------------------------------------------------------------------

    document.addEventListener('DOMContentLoaded', function() {
        renderReport();
    });
})();
