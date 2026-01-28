/**
 * Go Grind - Confidant System
 * Party members who teach advanced Go topics through relationship progression.
 */
(function() {
    'use strict';

    // Confidant definitions
    var CONFIDANTS = {
        morgana: {
            name: 'Morgana',
            arcana: 'Magician',
            icon: '🐱',
            title: 'The Wise Guide',
            domain: 'Go Idioms & Best Practices',
            description: 'A mysterious cat-like creature who knows the secrets of writing idiomatic Go code.',
            greeting: "I'm not a cat! But I AM an expert in Go best practices. Let me teach you!",
            // Tips unlocked at each rank
            tips: [
                {
                    id: 'naming',
                    rank: 1,
                    title: 'Naming Conventions',
                    content: 'In Go, use camelCase for private and PascalCase for exported names. Short names like `i`, `n`, `err` are idiomatic for small scopes.',
                    trigger: 'variables'
                },
                {
                    id: 'error-first',
                    rank: 1,
                    title: 'Handle Errors First',
                    content: 'Always check errors immediately after a function call. The happy path should flow down, not be nested.',
                    trigger: 'functions'
                },
                {
                    id: 'zero-values',
                    rank: 2,
                    title: 'Zero Values Are Useful',
                    content: 'Go initializes variables to zero values (0, "", nil, false). Use this! An empty slice works fine - no need to initialize it.',
                    trigger: 'slices'
                },
                {
                    id: 'comma-ok',
                    rank: 2,
                    title: 'The Comma-Ok Idiom',
                    content: 'When reading from maps or type assertions, always use `v, ok := map[key]` to check existence. Don\'t assume!',
                    trigger: 'maps'
                },
                {
                    id: 'defer-cleanup',
                    rank: 3,
                    title: 'Defer for Cleanup',
                    content: 'Use `defer` to ensure cleanup happens. Open a file? Immediately `defer f.Close()`. It runs when the function returns.',
                    trigger: 'functions'
                },
                {
                    id: 'range-copy',
                    rank: 3,
                    title: 'Range Creates Copies',
                    content: 'In `for i, v := range slice`, `v` is a COPY. To modify elements, use `slice[i]` directly.',
                    trigger: 'for-loops'
                },
                {
                    id: 'nil-slices',
                    rank: 4,
                    title: 'Nil vs Empty Slices',
                    content: 'A nil slice and empty slice both have length 0 and work with append(). Use nil unless you specifically need an empty slice.',
                    trigger: 'slices'
                },
                {
                    id: 'string-builder',
                    rank: 4,
                    title: 'Use strings.Builder',
                    content: 'Building strings with + in a loop is slow (creates new strings each time). Use strings.Builder for efficient concatenation.',
                    trigger: 'strings'
                },
                {
                    id: 'switch-no-break',
                    rank: 5,
                    title: 'Switch Doesn\'t Fall Through',
                    content: 'Unlike C/Java, Go\'s switch cases don\'t fall through by default. Use `fallthrough` if you need it (rare).',
                    trigger: 'switch'
                },
                {
                    id: 'make-vs-literal',
                    rank: 5,
                    title: 'make() vs Literals',
                    content: 'Use make() when you know the capacity upfront: `make([]int, 0, 100)`. Use literals for small, known data.',
                    trigger: 'slices'
                },
                {
                    id: 'interface-small',
                    rank: 6,
                    title: 'Small Interfaces',
                    content: 'Go favors small interfaces. The best ones have 1-2 methods. io.Reader has just Read(). Compose small interfaces into larger ones.',
                    trigger: 'functions'
                },
                {
                    id: 'pointer-receiver',
                    rank: 6,
                    title: 'Pointer Receivers',
                    content: 'Use pointer receivers when the method modifies the receiver, or when the struct is large. Be consistent within a type.',
                    trigger: 'functions'
                },
                {
                    id: 'init-order',
                    rank: 7,
                    title: 'Init Order Matters',
                    content: 'Package initialization: imports → const → var → init(). Dependencies are initialized first. Avoid complex init() logic.',
                    trigger: 'variables'
                },
                {
                    id: 'blank-identifier',
                    rank: 7,
                    title: 'The Blank Identifier',
                    content: 'Use _ to ignore values: `for _, v := range items`. Also useful for import side effects: `import _ "pkg"` runs pkg\'s init().',
                    trigger: 'for-loops'
                },
                {
                    id: 'error-wrapping',
                    rank: 8,
                    title: 'Wrap Errors with Context',
                    content: 'Use fmt.Errorf with %w to wrap errors: `fmt.Errorf("loading config: %w", err)`. Preserves the chain for errors.Is/As.',
                    trigger: 'functions'
                },
                {
                    id: 'map-concurrency',
                    rank: 8,
                    title: 'Maps Aren\'t Concurrent',
                    content: 'Never read and write a map from multiple goroutines without synchronization. Use sync.Map or a mutex.',
                    trigger: 'maps'
                },
                {
                    id: 'context-first',
                    rank: 9,
                    title: 'Context as First Param',
                    content: 'When a function takes context.Context, it should be the first parameter. Never store contexts in structs.',
                    trigger: 'functions'
                },
                {
                    id: 'table-tests',
                    rank: 10,
                    title: 'Table-Driven Tests',
                    content: 'Go\'s testing idiom: define test cases in a slice of structs, loop over them. Makes adding cases trivial.',
                    trigger: 'functions'
                }
            ],
            // Dialog for rank-up events
            rankDialog: [
                "Not bad for a beginner! There's much more to learn though.",
                "You're getting the hang of this. Keep practicing!",
                "Impressive progress! Your code is becoming more idiomatic.",
                "You're starting to think like a Go developer now.",
                "Excellent work! You've mastered the basics.",
                "Your code would make any Gopher proud.",
                "Now you're writing truly professional Go code.",
                "You've surpassed many developers. Keep going!",
                "Almost at the peak! One more step...",
                "MAX RANK! You've learned everything I can teach you!"
            ]
        },

        futaba: {
            name: 'Futaba',
            arcana: 'Hermit',
            icon: '🦊',
            title: 'The Oracle',
            domain: 'Concurrency & Performance',
            description: 'A genius hacker who can analyze any system. She\'ll teach you the secrets of goroutines and channels.',
            greeting: "Ooh, concurrent programming! This is where Go really shines. Let me show you the cool stuff!",
            unlockLevel: 5, // Player level required to unlock
            tips: [
                {
                    id: 'goroutine-basics',
                    rank: 1,
                    title: 'Goroutines Are Cheap',
                    content: 'Goroutines are lightweight - you can spawn thousands. Just add `go` before a function call: `go doWork()`. But remember: the main function won\'t wait for them!',
                    trigger: 'functions'
                },
                {
                    id: 'channel-intro',
                    rank: 1,
                    title: 'Channels for Communication',
                    content: 'Don\'t communicate by sharing memory; share memory by communicating. Channels let goroutines safely pass data: `ch := make(chan int)`',
                    trigger: 'functions'
                },
                {
                    id: 'waitgroup',
                    rank: 2,
                    title: 'WaitGroup for Coordination',
                    content: 'Use sync.WaitGroup to wait for goroutines: Add() before spawning, Done() when finished, Wait() to block until all complete.',
                    trigger: 'functions'
                },
                {
                    id: 'buffered-channels',
                    rank: 2,
                    title: 'Buffered vs Unbuffered',
                    content: 'Unbuffered channels block until both sender and receiver are ready. Buffered channels (`make(chan int, 10)`) only block when full/empty.',
                    trigger: 'slices'
                },
                {
                    id: 'select-statement',
                    rank: 3,
                    title: 'Select for Multiple Channels',
                    content: 'The `select` statement lets you wait on multiple channels. Add a `default` case for non-blocking operations.',
                    trigger: 'switch'
                },
                {
                    id: 'closure-goroutine',
                    rank: 3,
                    title: 'Closure Gotcha',
                    content: 'In loops with goroutines, capture the variable: `for _, v := range items { v := v; go process(v) }`. Otherwise all goroutines see the last value!',
                    trigger: 'for-loops'
                },
                {
                    id: 'mutex-basics',
                    rank: 4,
                    title: 'Mutex for Shared State',
                    content: 'When goroutines must share state, protect it with sync.Mutex. Lock() before access, Unlock() after. Use defer for safety!',
                    trigger: 'maps'
                },
                {
                    id: 'race-detector',
                    rank: 4,
                    title: 'The Race Detector',
                    content: 'Run `go test -race` or `go run -race` to detect data races. It\'s not 100% but catches most issues. Use it!',
                    trigger: 'functions'
                },
                {
                    id: 'context-cancellation',
                    rank: 5,
                    title: 'Context for Cancellation',
                    content: 'Use context.Context to cancel goroutines: `ctx, cancel := context.WithCancel(context.Background())`. Check `ctx.Done()` in your goroutine.',
                    trigger: 'functions'
                },
                {
                    id: 'worker-pool',
                    rank: 5,
                    title: 'Worker Pool Pattern',
                    content: 'Spawn N workers reading from a job channel, writing to a results channel. Controls concurrency and prevents resource exhaustion.',
                    trigger: 'for-loops'
                },
                {
                    id: 'atomic-operations',
                    rank: 6,
                    title: 'Atomic Operations',
                    content: 'For simple counters, sync/atomic is faster than mutex: `atomic.AddInt64(&counter, 1)`. But only for single operations!',
                    trigger: 'variables'
                },
                {
                    id: 'channel-close',
                    rank: 6,
                    title: 'Closing Channels',
                    content: 'Only the sender should close a channel. Receivers can detect closure: `v, ok := <-ch`. Closing signals "no more values coming".',
                    trigger: 'for-loops'
                },
                {
                    id: 'errgroup',
                    rank: 7,
                    title: 'errgroup for Error Handling',
                    content: 'golang.org/x/sync/errgroup combines WaitGroup with error handling. First error cancels all goroutines. Super useful!',
                    trigger: 'functions'
                },
                {
                    id: 'fan-out-fan-in',
                    rank: 8,
                    title: 'Fan-Out, Fan-In',
                    content: 'Fan-out: multiple goroutines read from one channel. Fan-in: multiple channels merged into one. Classic concurrent patterns.',
                    trigger: 'functions'
                },
                {
                    id: 'benchmark',
                    rank: 9,
                    title: 'Benchmarking',
                    content: 'Write benchmarks: `func BenchmarkX(b *testing.B) { for i := 0; i < b.N; i++ { ... } }`. Run with `go test -bench=.`',
                    trigger: 'functions'
                },
                {
                    id: 'pprof',
                    rank: 10,
                    title: 'Profiling with pprof',
                    content: 'Import net/http/pprof, run your server, then `go tool pprof http://localhost:6060/debug/pprof/profile`. Find your bottlenecks!',
                    trigger: 'functions'
                }
            ],
            rankDialog: [
                "Not bad! You're starting to understand concurrent thinking.",
                "Ooh, you're getting faster at this!",
                "Your goroutines are looking cleaner now.",
                "Nice! You're avoiding the common race condition traps.",
                "Level up! You understand channels pretty well now.",
                "Wow, you're writing production-quality concurrent code!",
                "Your performance intuition is really developing.",
                "Almost there! Just a few more advanced patterns to master.",
                "So close to max! You're practically a concurrency expert!",
                "MAX RANK! You've mastered Go concurrency! I'm impressed!"
            ]
        },

        makoto: {
            name: 'Makoto',
            arcana: 'Priestess',
            icon: '📚',
            title: 'The Strategist',
            domain: 'Testing & Error Handling',
            description: 'The student council president who plans everything meticulously. She\'ll teach you to write bulletproof code.',
            greeting: "A well-tested codebase is a reliable codebase. Let me show you proper testing and error handling techniques.",
            unlockLevel: 3, // Player level required to unlock
            tips: [
                {
                    id: 'test-file-naming',
                    rank: 1,
                    title: 'Test File Naming',
                    content: 'Test files end with _test.go and live next to the code they test. Test functions start with Test: `func TestAdd(t *testing.T)`',
                    trigger: 'functions'
                },
                {
                    id: 'error-is-value',
                    rank: 1,
                    title: 'Errors Are Values',
                    content: 'In Go, errors are just values that implement the error interface. Check them, handle them, don\'t ignore them!',
                    trigger: 'functions'
                },
                {
                    id: 't-error-vs-fatal',
                    rank: 2,
                    title: 't.Error vs t.Fatal',
                    content: 't.Error() marks test as failed but continues. t.Fatal() stops the test immediately. Use Fatal for setup failures, Error for assertions.',
                    trigger: 'functions'
                },
                {
                    id: 'custom-errors',
                    rank: 2,
                    title: 'Custom Error Types',
                    content: 'Create custom error types for specific failures: `type NotFoundError struct { ID string }`. Implement Error() string method.',
                    trigger: 'functions'
                },
                {
                    id: 'table-driven',
                    rank: 3,
                    title: 'Table-Driven Tests',
                    content: 'Define test cases in a slice of structs, loop with t.Run(): `for _, tc := range cases { t.Run(tc.name, func(t *testing.T) {...}) }`',
                    trigger: 'slices'
                },
                {
                    id: 'errors-is-as',
                    rank: 3,
                    title: 'errors.Is and errors.As',
                    content: 'Use errors.Is() to check for specific errors in a chain. Use errors.As() to extract a specific error type from the chain.',
                    trigger: 'functions'
                },
                {
                    id: 'test-helpers',
                    rank: 4,
                    title: 'Test Helpers',
                    content: 'Mark helper functions with t.Helper() so failures report the caller\'s line number, not the helper\'s.',
                    trigger: 'functions'
                },
                {
                    id: 'sentinel-errors',
                    rank: 4,
                    title: 'Sentinel Errors',
                    content: 'Package-level error variables: `var ErrNotFound = errors.New("not found")`. Callers can check with errors.Is().',
                    trigger: 'variables'
                },
                {
                    id: 'subtests',
                    rank: 5,
                    title: 'Subtests',
                    content: 't.Run() creates subtests that can be run individually: `go test -run TestFoo/case_name`. Great for debugging specific cases.',
                    trigger: 'functions'
                },
                {
                    id: 'error-wrapping',
                    rank: 5,
                    title: 'Error Wrapping',
                    content: 'Add context with fmt.Errorf and %w: `fmt.Errorf("loading user %d: %w", id, err)`. The original error is preserved for Is/As.',
                    trigger: 'functions'
                },
                {
                    id: 'testdata',
                    rank: 6,
                    title: 'testdata Directory',
                    content: 'Put test fixtures in a testdata/ directory. Go tooling ignores it during builds but it\'s available during tests.',
                    trigger: 'functions'
                },
                {
                    id: 'golden-files',
                    rank: 6,
                    title: 'Golden File Testing',
                    content: 'For complex output, compare against "golden" files. Run with -update flag to regenerate: `if *update { os.WriteFile(...) }`',
                    trigger: 'functions'
                },
                {
                    id: 'httptest',
                    rank: 7,
                    title: 'httptest Package',
                    content: 'Use httptest.NewServer() for integration tests, httptest.NewRecorder() for unit tests of handlers. No real network needed!',
                    trigger: 'functions'
                },
                {
                    id: 'test-coverage',
                    rank: 8,
                    title: 'Test Coverage',
                    content: 'Run `go test -cover` for coverage %. Use `-coverprofile=c.out` then `go tool cover -html=c.out` for visual report.',
                    trigger: 'functions'
                },
                {
                    id: 'fuzzing',
                    rank: 9,
                    title: 'Fuzz Testing',
                    content: 'Go 1.18+ has built-in fuzzing: `func FuzzX(f *testing.F) { f.Fuzz(func(t *testing.T, data []byte) {...}) }`. Finds edge cases!',
                    trigger: 'functions'
                },
                {
                    id: 'panic-recover',
                    rank: 10,
                    title: 'Panic and Recover',
                    content: 'panic() for truly unrecoverable errors. recover() in a defer to catch panics. Use sparingly - errors are usually better.',
                    trigger: 'functions'
                }
            ],
            rankDialog: [
                "Good start. Testing discipline takes practice.",
                "You're beginning to think about edge cases.",
                "Your error messages are becoming more helpful.",
                "Nice progress! Your tests are more comprehensive now.",
                "You're writing tests that actually catch bugs.",
                "Excellent! Your error handling is becoming robust.",
                "Your test coverage is impressive.",
                "You're thinking like a quality engineer now.",
                "Almost there! Your code is nearly bulletproof.",
                "MAX RANK! Your testing skills are exemplary!"
            ]
        }
    };

    // Get tips available for a concept based on confidant rank
    function getAvailableTips(confidantId, concept) {
        if (!window.GameState) return [];
        var conf = CONFIDANTS[confidantId];
        if (!conf) return [];

        var confState = window.GameState.getConfidant(confidantId);
        var currentRank = confState.rank || 1;

        return conf.tips.filter(function(tip) {
            return tip.trigger === concept && tip.rank <= currentRank;
        });
    }

    // Get a random tip for display (that hasn't been shown recently)
    function getRandomTip(confidantId, concept) {
        var tips = getAvailableTips(confidantId, concept);
        if (tips.length === 0) return null;

        // Prefer tips not yet unlocked/seen
        var unseenTips = tips.filter(function(tip) {
            return !window.GameState.isConfidantTipUnlocked(confidantId, tip.id);
        });

        var pool = unseenTips.length > 0 ? unseenTips : tips;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    // Points needed for next rank
    function pointsForNextRank(currentRank) {
        return currentRank * 10;
    }

    // Render confidant page
    function renderConfidantView(confidantId) {
        var view = document.getElementById('view-confidant');
        if (!view || !window.GameState) return;

        var conf = CONFIDANTS[confidantId];
        if (!conf) {
            view.innerHTML = '<div style="padding:2rem;color:var(--text-dim)">Confidant not found.</div>';
            return;
        }

        var confState = window.GameState.getConfidant(confidantId);
        var currentRank = confState.rank || 1;
        var currentPoints = confState.points || 0;
        var pointsNeeded = pointsForNextRank(currentRank);
        var pct = Math.min(100, Math.floor((currentPoints / pointsNeeded) * 100));

        // Labels
        var displayName = conf.name;
        var displayTitle = conf.title;
        var displayArcana = conf.arcana + ' Arcana';
        var displayIcon = conf.icon;
        var rankLabel = 'RANK';
        var progressLabel = 'Next Rank';
        var maxedLabel = 'MAX RANK ACHIEVED';
        var domainLabel = 'EXPERTISE';
        var tipsHeader = 'UNLOCKED WISDOM';
        var tipLabel = 'Rank';
        var tipTriggerLabel = 'Appears in';
        var tipLockedPrefix = 'Reach Rank';
        var howtoTitle = 'HOW TO RANK UP';

        var html = '';

        // Header
        html += '<div class="confidant-header">';
        html += '<div class="confidant-icon">' + displayIcon + '</div>';
        html += '<div class="confidant-info">';
        html += '<div class="confidant-name">' + displayName + '</div>';
        html += '<div class="confidant-arcana">' + displayArcana + '</div>';
        html += '<div class="confidant-title">' + displayTitle + '</div>';
        html += '</div>';
        html += '<div class="confidant-rank">';
        html += '<div class="rank-label">' + rankLabel + '</div>';
        html += '<div class="rank-value">' + currentRank + '</div>';
        html += '</div>';
        html += '</div>';

        // Relationship bar
        if (currentRank < 10) {
            html += '<div class="confidant-progress">';
            html += '<div class="progress-label">' + progressLabel + ': ' + currentPoints + '/' + pointsNeeded + '</div>';
            html += '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>';
            html += '</div>';
        } else {
            html += '<div class="confidant-maxed">' + maxedLabel + '</div>';
        }

        // Domain
        var domainValue = conf.domain;
        html += '<div class="confidant-domain">';
        html += '<div class="domain-label">' + domainLabel + '</div>';
        html += '<div class="domain-value">' + domainValue + '</div>';
        html += '</div>';

        // Description
        var descGreeting = '"' + conf.greeting + '"';
        var descText = conf.description;
        html += '<div class="confidant-desc">';
        html += '<div class="desc-greeting">' + descGreeting + '</div>';
        if (descText) {
            html += '<div class="desc-text">' + descText + '</div>';
        }
        html += '</div>';

        // Unlocked tips/treaties
        html += '<div class="confidant-tips">';
        html += '<div class="tips-header">' + tipsHeader + '</div>';
        html += '<div class="tips-list">';

        conf.tips.forEach(function(tip) {
            var isUnlocked = tip.rank <= currentRank;
            var statusClass = isUnlocked ? 'unlocked' : 'locked';

            html += '<div class="tip-card ' + statusClass + '">';
            html += '<div class="tip-header">';
            html += '<span class="tip-title">' + (isUnlocked ? tip.title : '???') + '</span>';
            html += '<span class="tip-rank">' + tipLabel + ' ' + tip.rank + '</span>';
            html += '</div>';
            if (isUnlocked) {
                html += '<div class="tip-content">' + tip.content + '</div>';
                html += '<div class="tip-trigger">' + tipTriggerLabel + ': ' + tip.trigger + ' exercises</div>';
            } else {
                html += '<div class="tip-locked">' + tipLockedPrefix + ' ' + tip.rank + ' to unlock</div>';
            }
            html += '</div>';
        });

        html += '</div>'; // tips-list
        html += '</div>'; // confidant-tips

        // How to rank up
        html += '<div class="confidant-howto">';
        html += '<div class="howto-title">' + howtoTitle + '</div>';
        html += '<div class="howto-text">Complete exercises to build your relationship with ' + conf.name + '. ';
        html += 'Each completion earns points. Tips will appear as hints during exercises!</div>';
        html += '</div>';

        view.innerHTML = html;
    }

    // Render confidant list (for menu)
    function renderConfidantsList() {
        var html = '';

        var rankWord = 'Rank';

        Object.keys(CONFIDANTS).forEach(function(id) {
            var conf = CONFIDANTS[id];
            var confState = window.GameState ? window.GameState.getConfidant(id) : { rank: 1, unlocked: false };

            if (!confState.unlocked) return;

            var displayName = conf.name;
            var displayArcana = conf.arcana;
            var displayIcon = conf.icon;

            html += '<div class="confidant-list-item" data-confidant="' + id + '">';
            html += '<span class="conf-icon">' + displayIcon + '</span>';
            html += '<div class="conf-details">';
            html += '<div class="conf-name">' + displayName + '</div>';
            html += '<div class="conf-arcana">' + displayArcana + '</div>';
            html += '</div>';
            html += '<div class="conf-rank">' + rankWord + ' ' + confState.rank + '</div>';
            html += '</div>';
        });

        return html;
    }

    // Check and unlock confidants based on player level
    function checkConfidantUnlocks() {
        if (!window.GameState) return;

        var player = window.GameState.getPlayer();
        var playerLevel = player.level || 1;
        var confidants = window.GameState.getConfidants();

        Object.keys(CONFIDANTS).forEach(function(id) {
            var conf = CONFIDANTS[id];
            var confState = confidants[id];

            // Skip if already unlocked or no unlock requirement
            if (confState && confState.unlocked) return;
            if (!conf.unlockLevel) return;

            // Unlock if player level is high enough
            if (playerLevel >= conf.unlockLevel) {
                if (window.GameState.getConfidants()[id]) {
                    window.GameState.getConfidants()[id].unlocked = true;
                    window.GameState.save();

                    // Dispatch unlock event
                    window.dispatchEvent(new CustomEvent('confidantUnlocked', {
                        detail: { confidantId: id, name: conf.name }
                    }));
                }
            }
        });
    }

    // Add confidant points when exercise completed
    function onExerciseComplete(skillKey) {
        if (!window.GameState) return;

        // Morgana always gets points
        window.GameState.addConfidantPoints('morgana', 1);

        // Makoto gets points for any exercise (testing applies to all code)
        var makotoState = window.GameState.getConfidant('makoto');
        if (makotoState.unlocked) {
            window.GameState.addConfidantPoints('makoto', 1);
        }

        // Futaba gets points for algorithm/advanced exercises
        var advancedSkills = ['recursion', 'binary-search', 'two-pointers', 'sliding-window', 'sorting'];
        var futabaState = window.GameState.getConfidant('futaba');
        if (futabaState.unlocked && advancedSkills.indexOf(skillKey) !== -1) {
            window.GameState.addConfidantPoints('futaba', 2); // Bonus for relevant exercises
        } else if (futabaState.unlocked) {
            window.GameState.addConfidantPoints('futaba', 1);
        }
    }

    // Listen for exercise completions
    window.addEventListener('gradeCalculated', function(e) {
        onExerciseComplete(e.detail.skillKey);
    });

    // Listen for level ups to check confidant unlocks
    window.addEventListener('levelUp', function(e) {
        checkConfidantUnlocks();
    });

    // Get a tip from any unlocked confidant (called by combat.js)
    function getConfidantTip(concept) {
        if (!window.GameState) return null;

        // Collect tips from all unlocked confidants
        var allTips = [];

        Object.keys(CONFIDANTS).forEach(function(id) {
            var confState = window.GameState.getConfidant(id);
            if (!confState.unlocked) return;

            var tips = getAvailableTips(id, concept);
            tips.forEach(function(tip) {
                allTips.push({ confidantId: id, tip: tip });
            });
        });

        if (allTips.length === 0) return null;

        // Prefer unseen tips
        var unseenTips = allTips.filter(function(item) {
            return !window.GameState.isConfidantTipUnlocked(item.confidantId, item.tip.id);
        });

        var pool = unseenTips.length > 0 ? unseenTips : allTips;
        var selected = pool[Math.floor(Math.random() * pool.length)];

        // Mark as seen
        window.GameState.unlockConfidantTip(selected.confidantId, selected.tip.id);

        var conf = CONFIDANTS[selected.confidantId];

        var displayName = conf.name;
        var displayIcon = conf.icon;
        var tipLabel = 'Tip';

        return {
            title: displayIcon + ' ' + displayName + '\'s ' + tipLabel + ': ' + selected.tip.title,
            content: selected.tip.content,
            member: displayName,
            confidantId: selected.confidantId
        };
    }

    // Legacy function for backward compatibility
    function getMorganaTip(concept) {
        return getConfidantTip(concept);
    }

    // Check unlocks on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkConfidantUnlocks);
    } else {
        setTimeout(checkConfidantUnlocks, 100);
    }

    // Export with generic name, keep alias for compatibility
    var api = {
        ADVISORS: CONFIDANTS,
        CONFIDANTS: CONFIDANTS, // Alias
        render: renderConfidantView,
        renderConfidantView: renderConfidantView, // Alias
        renderList: renderConfidantsList,
        renderConfidantsList: renderConfidantsList, // Alias
        getAvailableTips: getAvailableTips,
        getTip: getConfidantTip,
        getMorganaTip: getMorganaTip, // P5-specific
        getConfidantTip: getConfidantTip, // Alias
        checkUnlocks: checkConfidantUnlocks,
        checkConfidantUnlocks: checkConfidantUnlocks, // Alias
        pointsForNextRank: pointsForNextRank
    };

    // Generic name
    window.Advisors = api;
    // Legacy alias for backwards compatibility
    window.Confidants = api;
})();
