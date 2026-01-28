/**
 * Go Grind - Projects (Side Requests)
 * Real-world Go projects adapted from the course.
 */
(function() {
    'use strict';

    var PROJECTS = [
        {
            id: 'taskrunner',
            name: 'Task Runner',
            codename: 'Shadow Automaton',
            difficulty: 2,
            skills: ['functions', 'strings', 'recursion'],
            description: 'Build a simple task runner that reads YAML configs and executes commands.',
            goals: [
                'Read <code>tasks.yaml</code> from current directory',
                'List available tasks with <code>mytask list</code>',
                'Run a task with <code>mytask run build</code>',
                'Handle task dependencies (run deps first)',
                'Show real-time output while running'
            ],
            components: [
                { name: 'YAML parsing', desc: 'Read and decode YAML config files' },
                { name: 'File I/O', desc: 'Read config from disk' },
                { name: 'exec.Command', desc: 'Execute shell commands' },
                { name: 'Dependency graphs', desc: 'Resolve task dependencies recursively' }
            ],
            starterCode: 'func runTask(config *Config, taskName string, ran map[string]bool) error {\n    if ran[taskName] {\n        return nil  // Already ran\n    }\n    \n    task, ok := config.Tasks[taskName]\n    if !ok {\n        return fmt.Errorf("unknown task: %s", taskName)\n    }\n    \n    // Run dependencies first\n    for _, dep := range task.DependsOn {\n        if err := runTask(config, dep, ran); err != nil {\n            return err\n        }\n    }\n    \n    fmt.Printf("\\u25b6 Running: %s\\n", taskName)\n    cmd := exec.Command("bash", "-c", task.Command)\n    cmd.Stdout = os.Stdout\n    cmd.Stderr = os.Stderr\n    \n    if err := cmd.Run(); err != nil {\n        return fmt.Errorf("task %s failed: %w", taskName, err)\n    }\n    \n    ran[taskName] = true\n    return nil\n}',
            exampleConfig: 'name: my-project\nversion: "1.0"\n\ntasks:\n  build:\n    command: go build -o app .\n    description: Build the application\n  \n  test:\n    command: go test ./...\n    description: Run tests\n    depends_on:\n      - build\n  \n  clean:\n    command: rm -f app\n    description: Clean build artifacts',
            skillsSummary: 'YAML parsing, file I/O, exec.Command, dependency graphs, CLI design'
        },
        {
            id: 'filebrowser',
            name: 'File Browser TUI',
            codename: 'Cognitive Navigator',
            difficulty: 3,
            skills: ['functions', 'strings', 'slices'],
            description: 'Build an interactive terminal file browser using Bubble Tea.',
            goals: [
                'Navigate directories with arrow keys',
                'Enter to go into directory / open file info',
                'Backspace to go up a directory',
                'Show file sizes and permissions',
                'Syntax highlighting for different file types'
            ],
            components: [
                { name: 'bubbles/list', desc: 'Bubble Tea list component' },
                { name: 'lipgloss', desc: 'Terminal styling' },
                { name: 'os.ReadDir', desc: 'Read directory contents' }
            ],
            starterCode: 'type model struct {\n    currentDir  string\n    files       []os.DirEntry\n    cursor      int\n    selected    string\n    err         error\n}\n\nfunc (m model) Init() tea.Cmd {\n    return loadDir(m.currentDir)\n}\n\nfunc loadDir(path string) tea.Cmd {\n    return func() tea.Msg {\n        entries, err := os.ReadDir(path)\n        if err != nil {\n            return errMsg{err}\n        }\n        return dirLoadedMsg{entries}\n    }\n}',
            skillsSummary: 'Bubble Tea architecture, lipgloss styling, file system operations, keyboard handling'
        },
        {
            id: 'githubcli',
            name: 'GitHub CLI',
            codename: 'Digital Phantom',
            difficulty: 3,
            skills: ['maps', 'strings', 'functions'],
            description: 'Build a CLI tool that interacts with the GitHub API.',
            goals: [
                '<code>gh user &lt;username&gt;</code> \u2014 show user info',
                '<code>gh repos &lt;username&gt;</code> \u2014 list repositories',
                '<code>gh star &lt;owner/repo&gt;</code> \u2014 star a repo',
                '<code>gh issues &lt;owner/repo&gt;</code> \u2014 list open issues'
            ],
            components: [
                { name: 'cobra', desc: 'CLI framework' },
                { name: 'net/http', desc: 'HTTP client for API calls' },
                { name: 'lipgloss', desc: 'Pretty terminal output' }
            ],
            starterCode: '// User info\nGET https://api.github.com/users/{username}\n\n// User repos\nGET https://api.github.com/users/{username}/repos\n\n// Star a repo (requires auth)\nPUT https://api.github.com/user/starred/{owner}/{repo}\n\n// List issues\nGET https://api.github.com/repos/{owner}/{repo}/issues',
            exampleOutput: '$ gh user golang\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502  golang                             \u2502\n\u2502  The Go Programming Language        \u2502\n\u2502  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500   \u2502\n\u2502  Location: n/a                      \u2502\n\u2502  Followers: 23,456                  \u2502\n\u2502  Public repos: 42                   \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518',
            skillsSummary: 'HTTP clients, JSON decoding, Cobra CLI, environment variables, lipgloss styling'
        },
        {
            id: 'downloader',
            name: 'Parallel Downloader',
            codename: 'Shadow Swarm',
            difficulty: 4,
            skills: ['functions', 'slices', 'maps'],
            description: 'Build a concurrent file downloader with progress tracking.',
            goals: [
                'Accept list of URLs from file or stdin',
                'Download files in parallel (configurable workers)',
                'Show progress bar for each download',
                'Handle errors gracefully (retry failed downloads)',
                'Support cancellation with Ctrl+C'
            ],
            components: [
                { name: 'sync.WaitGroup', desc: 'Coordinate worker goroutines' },
                { name: 'context.Context', desc: 'Support cancellation' },
                { name: 'channels', desc: 'Progress updates between goroutines' },
                { name: 'semaphore pattern', desc: 'Limit concurrent downloads' }
            ],
            starterCode: 'func worker(ctx context.Context, urls chan string, results chan Result) {\n    for url := range urls {\n        select {\n        case <-ctx.Done():\n            return\n        default:\n            result := download(ctx, url)\n            results <- result\n        }\n    }\n}\n\nfunc download(ctx context.Context, url string) Result {\n    req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)\n    resp, err := http.DefaultClient.Do(req)\n    if err != nil {\n        return Result{URL: url, Err: err}\n    }\n    defer resp.Body.Close()\n    \n    // Download and track progress...\n    return Result{URL: url, Size: size}\n}',
            exampleOutput: '$ cat urls.txt | downloader -workers 5\nDownloading 10 files with 5 workers...\n[\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588] 100% file1.zip (15 MB)\n[\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591]  60% file2.tar.gz (8/13 MB)\n[\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591]  20% file3.iso (200/1000 MB)',
            skillsSummary: 'Goroutines, channels, WaitGroups, context cancellation, HTTP streaming, progress tracking'
        }
    ];

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getDifficultyStars(d) {
        return '\u2B50'.repeat(Math.min(Math.max(d || 1, 1), 5));
    }

    function renderProjectsView() {
        var view = document.getElementById('view-projects');
        if (!view) return;

        var html = '<div class="section-title" style="margin-top:0">Side Requests</div>';
        html += '<p style="color:var(--text-dim);font-size:0.85rem;margin-bottom:1.5rem">Real-world Go projects. Build these to level up your practical skills.</p>';
        html += '<div class="project-list">';

        PROJECTS.forEach(function(proj) {
            var skillDefs = window.GameState ? window.GameState.getSkillDefs() : {};
            var skillLabels = proj.skills.map(function(s) { return skillDefs[s] ? skillDefs[s].label : s; }).join(', ');

            html += '<div class="project-card" data-project="' + proj.id + '">';
            html += '<div class="project-card-header">';
            html += '<div class="project-card-name">' + proj.name + '</div>';
            html += '<div class="project-card-codename">' + proj.codename + '</div>';
            html += '</div>';
            html += '<div class="project-card-desc">' + proj.description + '</div>';
            html += '<div class="project-card-meta">';
            html += '<span class="project-card-difficulty">' + getDifficultyStars(proj.difficulty) + '</span>';
            html += '<span class="project-card-skills">' + skillLabels + '</span>';
            html += '</div>';
            html += '</div>';
        });

        html += '</div>';
        view.innerHTML = html;

        // Bind clicks
        view.querySelectorAll('.project-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var projId = card.dataset.project;
                var proj = PROJECTS.find(function(p) { return p.id === projId; });
                if (proj) {
                    renderProjectDetail(proj);
                    if (window.GameAudio) window.GameAudio.playMenuSelect();
                }
            });
        });
    }

    function renderProjectDetail(proj) {
        var view = document.getElementById('view-projects');
        if (!view) return;

        var html = '';

        // Back button
        html += '<button class="project-back-btn" id="project-back-btn">\u2190 Back to Projects</button>';

        // Header
        html += '<div class="project-detail-header">';
        html += '<div class="project-detail-codename">' + proj.codename + '</div>';
        html += '<div class="project-detail-name">' + proj.name + '</div>';
        html += '<div class="project-detail-difficulty">' + getDifficultyStars(proj.difficulty) + '</div>';
        html += '<div class="project-detail-desc">' + proj.description + '</div>';
        html += '</div>';

        // Goals
        html += '<div class="section-title">Mission Objectives</div>';
        html += '<div class="project-goals"><ol>';
        proj.goals.forEach(function(goal) {
            html += '<li>' + goal + '</li>';
        });
        html += '</ol></div>';

        // Components
        html += '<div class="section-title">Recommended Arsenal</div>';
        html += '<div class="project-components">';
        proj.components.forEach(function(c) {
            html += '<div class="project-component">';
            html += '<code class="project-component-name">' + escapeHtml(c.name) + '</code>';
            html += '<span class="project-component-desc">' + c.desc + '</span>';
            html += '</div>';
        });
        html += '</div>';

        // Starter code
        html += '<div class="section-title">Starter Code</div>';
        html += '<div class="project-code-block"><pre>' + escapeHtml(proj.starterCode) + '</pre></div>';

        // Example config or output
        if (proj.exampleConfig) {
            html += '<div class="section-title">Example Config</div>';
            html += '<div class="project-code-block"><pre>' + escapeHtml(proj.exampleConfig) + '</pre></div>';
        }
        if (proj.exampleOutput) {
            html += '<div class="section-title">Example Output</div>';
            html += '<div class="project-code-block terminal"><pre>' + escapeHtml(proj.exampleOutput) + '</pre></div>';
        }

        // Skills summary
        html += '<div class="project-skills-summary">';
        html += '<div class="project-skills-title">Skills Used</div>';
        html += '<div>' + proj.skillsSummary + '</div>';
        html += '</div>';

        view.innerHTML = html;

        // Back button
        document.getElementById('project-back-btn').addEventListener('click', function() {
            renderProjectsView();
            if (window.GameAudio) window.GameAudio.playMenuSelect();
        });
    }

    window.Projects = {
        renderProjectsView: renderProjectsView,
        PROJECTS: PROJECTS
    };
})();
