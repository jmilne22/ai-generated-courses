/**
 * Go Grind - Part-Time Jobs System
 * P5R-inspired jobs for grinding specific skills with bonuses.
 */
(function() {
    'use strict';

    // Job definitions - each focuses on specific skills
    var JOBS = {
        'convenience-store': {
            name: 'Convenience Store',
            location: 'Shibuya',
            icon: '🏪',
            description: 'Quick inventory tasks. Good for basics practice.',
            skills: ['variables', 'conditionals', 'for-loops'],
            wage: 15, // base XP per shift
            statBoost: 'kindness',
            unlockLevel: 1,
            flavor: [
                'The manager nods approvingly at your work.',
                'A customer thanks you for the quick service.',
                'Quiet shift. Good time to practice.',
                'Rush hour! But you handled it well.'
            ]
        },
        'beef-bowl-shop': {
            name: 'Beef Bowl Shop',
            location: 'Shibuya',
            icon: '🍜',
            description: 'Fast-paced order processing. Slices and maps.',
            skills: ['slices', 'maps', 'strings'],
            wage: 20,
            statBoost: 'proficiency',
            unlockLevel: 3,
            flavor: [
                'Orders flying in! You keep up perfectly.',
                'The chef gives you a free bowl after shift.',
                'Lunch rush was intense but you crushed it.',
                'Regular customers remember your face now.'
            ]
        },
        'flower-shop': {
            name: 'Flower Shop',
            location: 'Underground Mall',
            icon: '💐',
            description: 'Arrange bouquets. Struct composition practice.',
            skills: ['structs', 'methods', 'embedding'],
            wage: 25,
            statBoost: 'charm',
            unlockLevel: 5,
            flavor: [
                'You created a beautiful arrangement today.',
                'A couple bought your recommended bouquet.',
                'The owner teaches you about flower meanings.',
                'Peaceful work among the flowers.'
            ]
        },
        'crossroads-bar': {
            name: 'Crossroads Bar',
            location: 'Shinjuku',
            icon: '🍸',
            description: 'Night shifts. Interface with different types.',
            skills: ['interfaces', 'pointers', 'methods'],
            wage: 30,
            statBoost: 'charm',
            unlockLevel: 7,
            flavor: [
                'Interesting conversations tonight.',
                'A regular shares coding war stories.',
                'Quiet night. Time to think deeply.',
                'The owner says you have potential.'
            ]
        },
        'triple-seven': {
            name: 'Triple Seven',
            location: 'Shibuya',
            icon: '🎰',
            description: 'Late night stocking. Algorithmic thinking.',
            skills: ['binary-search', 'sorting', 'two-pointers'],
            wage: 25,
            statBoost: 'guts',
            unlockLevel: 4,
            flavor: [
                'Organized the entire snack aisle efficiently.',
                'Found the optimal stocking pattern.',
                'Night owls appreciate your service.',
                'Manager impressed by your speed.'
            ]
        },
        'rafflesia': {
            name: 'Rafflesia',
            location: 'Underground Mall',
            icon: '🌺',
            description: 'High-end flower arrangements. Advanced composition.',
            skills: ['interfaces', 'embedding', 'structs'],
            wage: 35,
            statBoost: 'proficiency',
            unlockLevel: 10,
            flavor: [
                'Your arrangements are getting noticed.',
                'A celebrity ordered your custom piece.',
                'The art of composition becomes clearer.',
                'Master-level work today.'
            ]
        },
        'syndicate': {
            name: 'Untouchable',
            location: 'Yongen-Jaya',
            icon: '🔧',
            description: 'Iwai\'s shop. Debug and fix things.',
            skills: ['pointers', 'stack', 'recursion'],
            wage: 30,
            statBoost: 'guts',
            unlockLevel: 6,
            flavor: [
                'Fixed a tricky mechanism today.',
                'Iwai nods silently. High praise from him.',
                'Learned some interesting techniques.',
                'The work requires precision and patience.'
            ]
        },
        'maid-cafe': {
            name: 'Maid Café',
            location: 'Akihabara',
            icon: '☕',
            description: 'Customer service. String handling and formatting.',
            skills: ['strings', 'string-building', 'maps'],
            wage: 20,
            statBoost: 'charm',
            unlockLevel: 3,
            flavor: [
                'Welcome home, Master! ...That was embarrassing.',
                'Regulars request you specifically now.',
                'The other maids appreciate your help.',
                'Surprisingly good practice for formatting.'
            ]
        }
    };

    // Quick exercises for each skill (used during shifts)
    var SHIFT_EXERCISES = {
        'variables': [
            { q: 'Declare x as 5 using short syntax', a: 'x := 5' },
            { q: 'What\'s the zero value of bool?', a: 'false' },
            { q: 'Declare multiple: a=1, b=2', a: 'a, b := 1, 2' }
        ],
        'conditionals': [
            { q: 'Check if x > 10', a: 'if x > 10 { }' },
            { q: 'Write if-else for x == 0', a: 'if x == 0 { } else { }' },
            { q: 'Ternary equivalent for max(a,b)?', a: 'Go has no ternary - use if/else' }
        ],
        'for-loops': [
            { q: 'Loop 0 to 9', a: 'for i := 0; i < 10; i++ { }' },
            { q: 'Infinite loop syntax', a: 'for { }' },
            { q: 'While-style loop for x > 0', a: 'for x > 0 { }' }
        ],
        'slices': [
            { q: 'Append 5 to nums', a: 'nums = append(nums, 5)' },
            { q: 'Get slice length', a: 'len(slice)' },
            { q: 'Create slice with make, len 10', a: 'make([]int, 10)' }
        ],
        'maps': [
            { q: 'Create empty map string->int', a: 'make(map[string]int)' },
            { q: 'Check if key exists', a: 'val, ok := m[key]' },
            { q: 'Delete key from map', a: 'delete(m, key)' }
        ],
        'strings': [
            { q: 'Split "a,b,c" by comma', a: 'strings.Split(s, ",")' },
            { q: 'Convert string to runes', a: '[]rune(s)' },
            { q: 'Check if string contains "go"', a: 'strings.Contains(s, "go")' }
        ],
        'structs': [
            { q: 'Define Point with X, Y int', a: 'type Point struct { X, Y int }' },
            { q: 'Create Point at 3,4', a: 'Point{X: 3, Y: 4}' },
            { q: 'Access field X of point p', a: 'p.X' }
        ],
        'methods': [
            { q: 'Add method Area to Rectangle', a: 'func (r Rectangle) Area() int' },
            { q: 'Pointer receiver for Counter', a: 'func (c *Counter) Inc()' },
            { q: 'What method makes type printable?', a: 'String() string' }
        ],
        'interfaces': [
            { q: 'Define Speaker with Speak()', a: 'type Speaker interface { Speak() string }' },
            { q: 'Type assertion for string', a: 's := v.(string)' },
            { q: 'Safe type assertion syntax', a: 's, ok := v.(string)' }
        ],
        'pointers': [
            { q: 'Get address of x', a: '&x' },
            { q: 'Dereference pointer p', a: '*p' },
            { q: 'Check for nil pointer', a: 'if p == nil { }' }
        ],
        'embedding': [
            { q: 'Embed Person in Employee', a: 'type Employee struct { Person }' },
            { q: 'Access embedded field Name', a: 'e.Name (promoted)' },
            { q: 'Call shadowed parent method', a: 'e.Person.Method()' }
        ],
        'binary-search': [
            { q: 'Binary search complexity?', a: 'O(log n)' },
            { q: 'Mid calculation avoiding overflow', a: 'mid := left + (right-left)/2' },
            { q: 'Requirement for binary search', a: 'Sorted input' }
        ],
        'sorting': [
            { q: 'Sort int slice', a: 'sort.Ints(nums)' },
            { q: 'Sort strings', a: 'sort.Strings(strs)' },
            { q: 'Custom sort interface methods', a: 'Len, Less, Swap' }
        ],
        'two-pointers': [
            { q: 'Initialize two pointers at ends', a: 'left, right := 0, len(s)-1' },
            { q: 'Move pointers toward center', a: 'left++; right--' },
            { q: 'Two pointer complexity?', a: 'O(n)' }
        ],
        'stack': [
            { q: 'Push to stack (slice)', a: 'stack = append(stack, val)' },
            { q: 'Pop from stack', a: 'val = stack[len-1]; stack = stack[:len-1]' },
            { q: 'Stack order?', a: 'LIFO - Last In First Out' }
        ],
        'recursion': [
            { q: 'What must recursion have?', a: 'Base case' },
            { q: 'Factorial base case', a: 'if n <= 1 { return 1 }' },
            { q: 'Risk without base case?', a: 'Stack overflow' }
        ],
        'string-building': [
            { q: 'Efficient string concatenation', a: 'strings.Builder' },
            { q: 'Builder write method', a: 'b.WriteString(s)' },
            { q: 'Get result from Builder', a: 'b.String()' }
        ],
        'map-tracking': [
            { q: 'Track seen elements', a: 'seen := make(map[int]bool)' },
            { q: 'Mark as seen', a: 'seen[val] = true' },
            { q: 'Check if seen', a: 'if seen[val] { }' }
        ]
    };

    function getJobState() {
        var state = window.GameState.getState();
        if (!state.jobs) {
            state.jobs = {};
            Object.keys(JOBS).forEach(function(id) {
                state.jobs[id] = { shiftsWorked: 0, rank: 1, totalXP: 0 };
            });
            window.GameState.save();
        }
        return state.jobs;
    }

    function isJobUnlocked(jobId) {
        if (!window.GameState) return false;
        var job = JOBS[jobId];
        var playerLevel = window.GameState.getPlayer().level;
        return playerLevel >= job.unlockLevel;
    }

    function getJobRank(shiftsWorked) {
        if (shiftsWorked >= 50) return { rank: 5, title: 'Veteran', bonus: 2.0 };
        if (shiftsWorked >= 30) return { rank: 4, title: 'Skilled', bonus: 1.75 };
        if (shiftsWorked >= 15) return { rank: 3, title: 'Regular', bonus: 1.5 };
        if (shiftsWorked >= 5) return { rank: 2, title: 'Known', bonus: 1.25 };
        return { rank: 1, title: 'Newbie', bonus: 1.0 };
    }

    function startShift(jobId) {
        var job = JOBS[jobId];
        if (!job || !isJobUnlocked(jobId)) return;

        var jobState = getJobState()[jobId];
        var rankInfo = getJobRank(jobState.shiftsWorked);

        // Pick a random skill from the job's skills
        var skillKey = job.skills[Math.floor(Math.random() * job.skills.length)];
        var exercises = SHIFT_EXERCISES[skillKey] || SHIFT_EXERCISES['variables'];
        var exercise = exercises[Math.floor(Math.random() * exercises.length)];

        if (window.GameAudio) window.GameAudio.playMenuSelect();

        var overlay = document.createElement('div');
        overlay.className = 'job-shift-overlay';
        overlay.innerHTML = '<div class="job-shift-modal">' +
            '<div class="job-shift-header">' +
                '<span class="job-shift-icon">' + job.icon + '</span>' +
                '<span class="job-shift-name">' + job.name + '</span>' +
                '<span class="job-shift-rank">' + rankInfo.title + '</span>' +
            '</div>' +
            '<div class="job-shift-location">' + job.location + '</div>' +
            '<div class="job-shift-task">' +
                '<div class="job-task-label">Quick Task</div>' +
                '<div class="job-task-skill">' + skillKey.replace('-', ' ') + '</div>' +
                '<div class="job-task-question">' + exercise.q + '</div>' +
            '</div>' +
            '<div class="job-shift-input-area">' +
                '<input type="text" class="job-shift-input" placeholder="Your answer..." autocomplete="off" autocapitalize="off" spellcheck="false">' +
                '<button class="job-shift-submit">Submit</button>' +
            '</div>' +
            '<div class="job-shift-hint" style="display:none">' +
                '<span class="hint-label">Answer:</span> <code>' + exercise.a + '</code>' +
            '</div>' +
            '<div class="job-shift-actions">' +
                '<button class="job-shift-skip">Skip (No XP)</button>' +
                '<button class="job-shift-show-hint">Show Answer</button>' +
            '</div>' +
        '</div>';

        document.body.appendChild(overlay);

        var input = overlay.querySelector('.job-shift-input');
        var submitBtn = overlay.querySelector('.job-shift-submit');
        var skipBtn = overlay.querySelector('.job-shift-skip');
        var hintBtn = overlay.querySelector('.job-shift-show-hint');
        var hintDiv = overlay.querySelector('.job-shift-hint');
        var usedHint = false;

        input.focus();

        function normalizeAnswer(s) {
            return s.toLowerCase().replace(/\s+/g, ' ').replace(/[{}\[\]();]/g, '').trim();
        }

        function completeShift(gotIt, skipped) {
            var xpEarned = 0;
            var flavorText = '';

            if (!skipped) {
                var baseXP = job.wage;
                var multiplier = rankInfo.bonus;
                if (usedHint) multiplier *= 0.5;
                if (!gotIt) multiplier *= 0.25;
                xpEarned = Math.floor(baseXP * multiplier);

                // Update job state
                jobState.shiftsWorked++;
                jobState.totalXP += xpEarned;
                window.GameState.save();

                // Award skill XP
                var state = window.GameState.getState();
                if (state.skills[skillKey]) {
                    state.skills[skillKey].xp += xpEarned;
                }

                // Award stat boost
                if (job.statBoost) {
                    state.player.stats[job.statBoost] = (state.player.stats[job.statBoost] || 0) + (gotIt ? 1 : 0);
                }

                // Add to player XP
                state.player.totalXP += xpEarned;
                window.GameState.save();

                flavorText = job.flavor[Math.floor(Math.random() * job.flavor.length)];
            }

            // Show result
            var modal = overlay.querySelector('.job-shift-modal');
            var newRankInfo = getJobRank(jobState.shiftsWorked);
            var rankUp = newRankInfo.rank > rankInfo.rank;

            modal.innerHTML = '<div class="job-shift-result ' + (gotIt ? 'success' : skipped ? 'skipped' : 'partial') + '">' +
                '<div class="job-result-icon">' + (gotIt ? '✓' : skipped ? '—' : '~') + '</div>' +
                '<div class="job-result-title">' + (gotIt ? 'Good Work!' : skipped ? 'Shift Skipped' : 'Partial Credit') + '</div>' +
                (flavorText ? '<div class="job-result-flavor">"' + flavorText + '"</div>' : '') +
                '<div class="job-result-xp">+' + xpEarned + ' XP</div>' +
                (gotIt && job.statBoost ? '<div class="job-result-stat">' + job.statBoost + ' +1</div>' : '') +
                (rankUp ? '<div class="job-result-rankup">Rank Up! ' + newRankInfo.title + '</div>' : '') +
                '<div class="job-result-total">Total shifts: ' + jobState.shiftsWorked + '</div>' +
                '<button class="job-result-close">Done</button>' +
            '</div>';

            modal.querySelector('.job-result-close').addEventListener('click', function() {
                overlay.remove();
                renderJobsView();
                if (window.App) window.App.updatePlayerCard();
            });

            if (gotIt && window.GameAudio) window.GameAudio.playMenuSelect();
        }

        function checkAnswer() {
            var userAnswer = normalizeAnswer(input.value);
            var correctAnswer = normalizeAnswer(exercise.a);
            // Flexible matching - check if user answer contains key parts
            var gotIt = userAnswer === correctAnswer ||
                       correctAnswer.includes(userAnswer) ||
                       userAnswer.includes(correctAnswer.split(' ')[0]);
            completeShift(gotIt, false);
        }

        submitBtn.addEventListener('click', checkAnswer);
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') checkAnswer();
        });

        skipBtn.addEventListener('click', function() {
            completeShift(false, true);
        });

        hintBtn.addEventListener('click', function() {
            usedHint = true;
            hintDiv.style.display = 'block';
            hintBtn.style.display = 'none';
        });
    }

    function renderJobsView() {
        var view = document.getElementById('view-jobs');
        if (!view || !window.GameState) return;

        // Theme detection
        var T = window.ThemeRegistry;
        var is4X = T && T.getThemeId() === '4x-strategy';

        // Themed labels
        var headerTitle = is4X ? 'Domestic Programs' : 'Part-Time Jobs';
        var headerSubtitle = is4X ? 'Run programs to earn Production and boost National Power' : 'Work shifts to earn XP and stat boosts';
        var xpLabel = is4X ? 'PP' : 'XP';
        var shiftLabel = is4X ? 'Rotations' : 'Shifts';
        var workBtnLabel = is4X ? 'Run Program' : 'Work Shift';
        var reqLabel = is4X ? 'Requires Era' : 'Requires Level';

        var jobs = getJobState();
        var playerLevel = window.GameState.getPlayer().level;

        var html = '<div class="jobs-header">' +
            '<div class="jobs-title">' + headerTitle + '</div>' +
            '<div class="jobs-subtitle">' + headerSubtitle + '</div>' +
        '</div>';

        html += '<div class="jobs-grid">';

        Object.keys(JOBS).forEach(function(jobId) {
            var job = JOBS[jobId];
            var jobState = jobs[jobId] || { shiftsWorked: 0, rank: 1, totalXP: 0 };
            var unlocked = playerLevel >= job.unlockLevel;
            var rankInfo = getJobRank(jobState.shiftsWorked);

            // Themed rank titles for 4X
            var rankTitle = rankInfo.title;
            if (is4X) {
                var rankTitles4X = { 'Newbie': 'Initiated', 'Known': 'Operational', 'Regular': 'Established', 'Skilled': 'Advanced', 'Veteran': 'Exemplary' };
                rankTitle = rankTitles4X[rankInfo.title] || rankInfo.title;
            }

            html += '<div class="job-card ' + (unlocked ? '' : 'locked') + '" data-job="' + jobId + '">';
            html += '<div class="job-card-header">';
            html += '<span class="job-icon">' + job.icon + '</span>';
            html += '<div class="job-info">';
            html += '<div class="job-name">' + job.name + '</div>';
            html += '<div class="job-location">' + job.location + '</div>';
            html += '</div>';
            if (unlocked) {
                html += '<div class="job-rank-badge">' + rankTitle + '</div>';
            }
            html += '</div>';

            if (unlocked) {
                html += '<div class="job-description">' + job.description + '</div>';
                html += '<div class="job-skills">';
                job.skills.forEach(function(skill) {
                    var skillLabel = skill.replace('-', ' ');
                    if (is4X && T.getSkillInfo) {
                        var themeSkill = T.getSkillInfo(skill);
                        if (themeSkill) skillLabel = themeSkill.label;
                    }
                    html += '<span class="job-skill-tag">' + skillLabel + '</span>';
                });
                html += '</div>';
                html += '<div class="job-stats">';
                html += '<span class="job-wage">' + job.wage + ' ' + xpLabel + ' base</span>';
                var statLabel = job.statBoost;
                if (is4X && T.getStatLabel) {
                    statLabel = T.getStatLabel(job.statBoost);
                }
                html += '<span class="job-stat-boost">+' + statLabel + '</span>';
                html += '</div>';
                html += '<div class="job-progress">';
                html += '<span>' + shiftLabel + ': ' + jobState.shiftsWorked + '</span>';
                html += '<span>Total ' + xpLabel + ': ' + jobState.totalXP + '</span>';
                html += '</div>';
                html += '<button class="job-work-btn">' + workBtnLabel + '</button>';
            } else {
                html += '<div class="job-locked-info">';
                html += '<div class="job-lock-icon">🔒</div>';
                html += '<div class="job-unlock-req">' + reqLabel + ' ' + job.unlockLevel + '</div>';
                html += '</div>';
            }

            html += '</div>';
        });

        html += '</div>';
        view.innerHTML = html;

        // Bind work buttons
        view.querySelectorAll('.job-work-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var jobId = this.closest('.job-card').dataset.job;
                startShift(jobId);
            });
        });
    }

    window.Jobs = {
        renderJobsView: renderJobsView,
        startShift: startShift,
        JOBS: JOBS,
        getJobState: getJobState,
        isJobUnlocked: isJobUnlocked
    };
})();
