/**
 * Go Grind - Mementos Requests
 * Story-driven daily challenges with shadow NPCs.
 */
(function() {
    'use strict';

    // Shadow NPCs who post requests
    var SHADOW_CLIENTS = [
        { name: 'The Forgetful Archivist', icon: '📚' },
        { name: 'The Impatient Courier', icon: '📮' },
        { name: 'The Obsessive Counter', icon: '🔢' },
        { name: 'The Lost Wanderer', icon: '🗺️' },
        { name: 'The Perfectionist', icon: '✨' },
        { name: 'The Speed Demon', icon: '⚡' },
        { name: 'The Silent Coder', icon: '🤫' },
        { name: 'The Determined Novice', icon: '🌱' }
    ];

    // Request templates with narrative framing
    var REQUEST_TEMPLATES = [
        {
            title: 'The Repetitive Task',
            client: 0, // Forgetful Archivist
            dialog: "I keep doing the same thing over and over... surely there must be a pattern I can follow?",
            task: 'Complete 3 exercises',
            key: 'exercises',
            goal: 3,
            reward: 60
        },
        {
            title: 'The Growing Collection',
            client: 0,
            dialog: "My collection grows ever larger. I need someone who can handle volume...",
            task: 'Complete 5 exercises',
            key: 'exercises',
            goal: 5,
            reward: 100
        },
        {
            title: 'The Quick Delivery',
            client: 1, // Impatient Courier
            dialog: "Time is shadows! I need these deliveries done FAST. No dawdling!",
            task: 'Earn 100 XP',
            key: 'xp',
            goal: 100,
            reward: 75
        },
        {
            title: 'The Urgent Package',
            client: 1,
            dialog: "This package is EXTREMELY urgent! I need serious XP gains, NOW!",
            task: 'Earn 200 XP',
            key: 'xp',
            goal: 200,
            reward: 120
        },
        {
            title: 'The Flawless Execution',
            client: 4, // Perfectionist
            dialog: "I demand perfection. Nothing less than an S-rank will satisfy me.",
            task: 'Get an S grade',
            key: 'sgrade',
            goal: 1,
            reward: 100
        },
        {
            title: 'The Quality Standard',
            client: 4,
            dialog: "Acceptable work requires at least an A. Twice. Prove your worth.",
            task: 'Get 2 A grades or better',
            key: 'agrade',
            goal: 2,
            reward: 80
        },
        {
            title: 'The Silent Solution',
            client: 6, // Silent Coder
            dialog: "... (solve it without asking for help) ...",
            task: 'Complete a challenge without hints',
            key: 'nohints',
            goal: 1,
            reward: 90
        },
        {
            title: 'The Speed Trial',
            client: 5, // Speed Demon
            dialog: "FAST FAST FAST! Three problems, two minutes each, GO GO GO!",
            task: 'Complete 3 exercises in under 2 minutes each',
            key: 'fast',
            goal: 3,
            reward: 110
        },
        {
            title: 'The First Steps',
            client: 7, // Determined Novice
            dialog: "I'm just starting out... can you show me it's possible to complete even one?",
            task: 'Complete 1 exercise',
            key: 'exercises',
            goal: 1,
            reward: 40
        },
        {
            title: 'The Counting Game',
            client: 2, // Obsessive Counter
            dialog: "One, two, three... I must count everything! Help me reach 150 XP exactly... or more!",
            task: 'Earn 150 XP',
            key: 'xp',
            goal: 150,
            reward: 90
        },
        {
            title: 'The Marathon',
            client: 3, // Lost Wanderer
            dialog: "I've been wandering these depths for so long... accompany me through 7 challenges?",
            task: 'Complete 7 exercises',
            key: 'exercises',
            goal: 7,
            reward: 150
        },
        {
            title: 'The Double Silence',
            client: 6,
            dialog: "... (two problems, no hints, pure skill) ...",
            task: 'Complete 2 challenges without hints',
            key: 'nohints',
            goal: 2,
            reward: 130
        }
    ];

    // Motivational messages based on progress
    var PROGRESS_MESSAGES = {
        none: [
            "The shadows await your arrival...",
            "Mementos grows restless.",
            "Requests pile up in the depths."
        ],
        partial: [
            "You're making progress. The shadows take notice.",
            "Keep pushing. Victory is within reach.",
            "The Phantom Thieves don't give up halfway."
        ],
        complete: [
            "Target eliminated. Well done, Joker.",
            "All requests fulfilled. The shadows are grateful.",
            "Mission complete. Return to reality."
        ]
    };

    function seededRandom(seed) {
        var x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    function getDailySeed() {
        var today = new Date().toISOString().split('T')[0];
        var seed = 0;
        for (var i = 0; i < today.length; i++) {
            seed += today.charCodeAt(i) * (i + 1);
        }
        return seed;
    }

    function getMementosRequests() {
        var today = new Date().toISOString().split('T')[0];
        var seed = getDailySeed();

        // Pick 3-4 requests for today based on seed
        var numRequests = 3 + (seed % 2); // 3 or 4 requests
        var picked = [];
        var pool = REQUEST_TEMPLATES.slice();

        for (var i = 0; i < numRequests && pool.length > 0; i++) {
            var idx = Math.floor(seededRandom(seed + i * 17) * pool.length);
            var request = pool.splice(idx, 1)[0];

            // Add variation to rewards based on day
            var rewardVariation = Math.floor(seededRandom(seed + i * 31) * 20) - 10;
            request = Object.assign({}, request, {
                reward: Math.max(30, request.reward + rewardVariation),
                id: i
            });

            picked.push(request);
        }

        return {
            date: today,
            requests: picked,
            bonusReward: 50 + (seed % 100) // Bonus for completing all
        };
    }

    function checkProgress(mementosData) {
        if (!window.GameState) return mementosData;

        var calendar = window.GameState.getCalendar();
        var todayData = calendar[mementosData.date] || {
            exercisesCompleted: 0,
            xpEarned: 0,
            sGrades: 0,
            aGrades: 0,
            noHintCompletions: 0,
            fastCompletions: 0
        };

        mementosData.requests.forEach(function(req) {
            switch (req.key) {
                case 'exercises':
                    req.current = todayData.exercisesCompleted || 0;
                    break;
                case 'xp':
                    req.current = todayData.xpEarned || 0;
                    break;
                case 'sgrade':
                    req.current = todayData.sGrades || 0;
                    break;
                case 'agrade':
                    req.current = (todayData.sGrades || 0) + (todayData.aGrades || 0);
                    break;
                case 'nohints':
                    req.current = todayData.noHintCompletions || 0;
                    break;
                case 'fast':
                    req.current = todayData.fastCompletions || 0;
                    break;
                default:
                    req.current = 0;
            }
            req.done = req.current >= req.goal;
        });

        mementosData.completedCount = mementosData.requests.filter(function(r) { return r.done; }).length;
        mementosData.allDone = mementosData.completedCount === mementosData.requests.length;

        return mementosData;
    }

    function getStreakMultiplier() {
        if (!window.GameState) return 1;
        var streak = window.GameState.getStreaks().current || 0;
        if (streak >= 30) return 3;
        if (streak >= 10) return 2;
        if (streak >= 5) return 1.5;
        return 1;
    }

    function getProgressMessage(mementosData) {
        var messages;
        if (mementosData.allDone) {
            messages = PROGRESS_MESSAGES.complete;
        } else if (mementosData.completedCount > 0) {
            messages = PROGRESS_MESSAGES.partial;
        } else {
            messages = PROGRESS_MESSAGES.none;
        }
        var seed = getDailySeed();
        return messages[seed % messages.length];
    }

    function renderMementosView() {
        var view = document.getElementById('view-mementos');
        if (!view || !window.GameState) return;

        var mementosData = getMementosRequests();
        mementosData = checkProgress(mementosData);
        var streaks = window.GameState.getStreaks();
        var multiplier = getStreakMultiplier();

        var html = '';

        // Header
        html += '<div class="section-header">';
        html += '<h2>MEMENTOS</h2>';
        html += '<div class="section-subtitle">The depths of the collective unconscious</div>';
        html += '</div>';

        // Streak display
        html += '<div class="mementos-streak-card">';
        html += '<div class="streak-flames">🔥</div>';
        html += '<div class="streak-info">';
        html += '<div class="streak-count">' + (streaks.current || 0) + '</div>';
        html += '<div class="streak-label">DAY STREAK</div>';
        html += '</div>';
        html += '<div class="streak-meta">';
        html += '<div>Best: ' + (streaks.longest || 0) + ' days</div>';
        if (multiplier > 1) {
            html += '<div class="streak-multiplier">' + multiplier + 'x XP</div>';
        }
        html += '</div>';
        html += '</div>';

        // Progress message
        html += '<div class="mementos-message">"' + getProgressMessage(mementosData) + '"</div>';

        // Requests
        html += '<div class="requests-header">';
        html += '<span>TODAY\'S REQUESTS</span>';
        html += '<span class="requests-date">' + mementosData.date + '</span>';
        html += '</div>';

        html += '<div class="requests-list">';
        mementosData.requests.forEach(function(req, idx) {
            var client = SHADOW_CLIENTS[req.client];
            var statusClass = req.done ? 'complete' : '';

            html += '<div class="request-card ' + statusClass + '">';

            // Request header
            html += '<div class="request-header">';
            html += '<span class="request-icon">' + client.icon + '</span>';
            html += '<div class="request-title-area">';
            html += '<div class="request-title">' + req.title + '</div>';
            html += '<div class="request-client">From: ' + client.name + '</div>';
            html += '</div>';
            html += '<div class="request-reward">+' + req.reward + ' XP</div>';
            html += '</div>';

            // Dialog
            html += '<div class="request-dialog">"' + req.dialog + '"</div>';

            // Task and progress
            html += '<div class="request-task">';
            html += '<div class="request-task-text">';
            if (req.done) {
                html += '<span class="request-check">✓</span> ';
            }
            html += req.task;
            html += '</div>';
            if (!req.done) {
                html += '<div class="request-progress">' + (req.current || 0) + '/' + req.goal + '</div>';
            }
            html += '</div>';

            // Progress bar
            var pct = Math.min(100, Math.floor((req.current / req.goal) * 100));
            html += '<div class="request-progress-bar">';
            html += '<div class="request-progress-fill" style="width:' + pct + '%"></div>';
            html += '</div>';

            html += '</div>'; // request-card
        });
        html += '</div>'; // requests-list

        // Bonus reward for all complete
        html += '<div class="mementos-bonus' + (mementosData.allDone ? ' earned' : '') + '">';
        html += '<div class="bonus-label">COMPLETION BONUS</div>';
        html += '<div class="bonus-amount">+' + mementosData.bonusReward + ' XP</div>';
        if (mementosData.allDone) {
            html += '<div class="bonus-status">CLAIMED</div>';
        } else {
            html += '<div class="bonus-status">' + mementosData.completedCount + '/' + mementosData.requests.length + ' requests</div>';
        }
        html += '</div>';

        // Action button
        if (!mementosData.allDone) {
            html += '<div class="mementos-action">';
            html += '<button class="mementos-btn" id="mementos-train-btn">INFILTRATE</button>';
            html += '</div>';
        } else {
            html += '<div class="mementos-complete">';
            html += '<div class="complete-icon">🎭</div>';
            html += '<div class="complete-text">ALL REQUESTS FULFILLED</div>';
            html += '<div class="complete-sub">Return tomorrow for new targets</div>';
            html += '</div>';
        }

        view.innerHTML = html;

        // Bind button
        var trainBtn = document.getElementById('mementos-train-btn');
        if (trainBtn) {
            trainBtn.addEventListener('click', function() {
                if (window.App) window.App.navigateTo('training');
            });
        }
    }

    window.Mementos = {
        getMementosRequests: getMementosRequests,
        checkProgress: checkProgress,
        getStreakMultiplier: getStreakMultiplier,
        renderMementosView: renderMementosView,
        SHADOW_CLIENTS: SHADOW_CLIENTS
    };
})();
