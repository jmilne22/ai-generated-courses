// Theme toggle functionality for Go Course
(function() {
    const themeGroups = [
        {
            label: 'Default',
            options: [
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' }
            ]
        },
        {
            label: 'Catppuccin',
            options: [
                { value: 'catppuccin-dark', label: 'Dark' },
                { value: 'catppuccin-light', label: 'Light' }
            ]
        },
        {
            label: 'Gruvbox',
            options: [
                { value: 'gruvbox-dark', label: 'Dark' },
                { value: 'gruvbox-light', label: 'Light' }
            ]
        },
        {
            label: 'Tokyo Night',
            options: [
                { value: 'tokyonight-dark', label: 'Dark' },
                { value: 'tokyonight-light', label: 'Light' }
            ]
        },
        {
            label: 'Ayu',
            options: [
                { value: 'ayu-dark', label: 'Dark' },
                { value: 'ayu-light', label: 'Light' }
            ]
        },
        {
            label: 'Nord',
            options: [
                { value: 'nord-dark', label: 'Dark' },
                { value: 'nord-light', label: 'Light' }
            ]
        },
        {
            label: 'Dracula',
            options: [
                { value: 'dracula-dark', label: 'Dark' },
                { value: 'dracula-light', label: 'Light' }
            ]
        },
        {
            label: 'Solarized',
            options: [
                { value: 'solarized-dark', label: 'Dark' },
                { value: 'solarized-light', label: 'Light' }
            ]
        },
        {
            label: 'Everforest',
            options: [
                { value: 'everforest-dark', label: 'Dark' },
                { value: 'everforest-light', label: 'Light' }
            ]
        }
    ];

    // Check for saved theme preference or default to dark
    function getPreferredTheme() {
        const saved = localStorage.getItem('go-course-theme');
        if (saved) {
            return saved;
        }
        // Default to dark mode (the original theme)
        return 'dark';
    }

    // Apply theme to document
    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        localStorage.setItem('go-course-theme', theme);
    }

    // Initialize theme immediately to prevent flash
    setTheme(getPreferredTheme());

    // Create and inject theme picker when DOM is ready
    function createThemePicker() {
        const wrapper = document.createElement('div');
        wrapper.className = 'theme-picker';

        const label = document.createElement('div');
        label.className = 'theme-picker-label';
        label.textContent = 'Theme';

        const select = document.createElement('select');
        select.className = 'theme-select';
        select.setAttribute('aria-label', 'Select color theme');

        themeGroups.forEach(group => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = group.label;
            group.options.forEach(theme => {
                const option = document.createElement('option');
                option.value = theme.value;
                option.textContent = theme.label;
                optgroup.appendChild(option);
            });
            select.appendChild(optgroup);
        });

        select.value = getPreferredTheme();
        updateThemeLabel(select.value, label);
        select.addEventListener('change', () => {
            setTheme(select.value);
            updateThemeLabel(select.value, label);
        });

        wrapper.appendChild(label);
        wrapper.appendChild(select);
        document.body.appendChild(wrapper);
    }

    function updateThemeLabel(value, labelEl) {
        for (const group of themeGroups) {
            const match = group.options.find(option => option.value === value);
            if (match) {
                labelEl.textContent = `${group.label} • ${match.label}`;
                return;
            }
        }
        labelEl.textContent = 'Theme';
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createThemePicker);
    } else {
        createThemePicker();
    }

    // Listen for system theme changes (only if no saved preference)
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
        if (!localStorage.getItem('go-course-theme')) {
            setTheme(e.matches ? 'light' : 'dark');
        }
    });
})();

(function() {
    const SESSION_KEY = 'go-course-session';
    let sessionInterval = null;

    function formatCountdown(ms) {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function getSession() {
        try {
            const raw = localStorage.getItem(SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            return null;
        }
    }

    function setSession(session) {
        if (!session) {
            localStorage.removeItem(SESSION_KEY);
            return;
        }
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    function migrateSessionFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const startParam = params.get('sessionStart');
        const minutesParam = params.get('sessionMinutes');
        const pausedParam = params.get('sessionPaused');
        const remainingParam = params.get('sessionRemaining');

        if (!startParam && !minutesParam && !pausedParam && !remainingParam) return;

        const minutes = Number(minutesParam || 25);
        const startAt = Number(startParam || Date.now());
        const paused = pausedParam === '1';
        const remainingSeconds = remainingParam ? Number(remainingParam) : null;

        if (Number.isFinite(minutes) && minutes > 0) {
            if (paused) {
                setSession({
                    status: 'paused',
                    minutes,
                    remainingSeconds: Number.isFinite(remainingSeconds)
                        ? remainingSeconds
                        : minutes * 60
                });
            } else if (Number.isFinite(startAt)) {
                setSession({
                    status: 'running',
                    minutes,
                    startAt
                });
            }
        }

        ['sessionStart', 'sessionMinutes', 'sessionPaused', 'sessionRemaining']
            .forEach(key => params.delete(key));
        const url = new URL(window.location.href);
        url.search = params.toString();
        history.replaceState({}, '', url.toString());
    }

    function getRemainingSeconds(session) {
        if (session.status === 'paused') {
            return Math.max(0, Math.floor(session.remainingSeconds || 0));
        }
        const elapsedSeconds = Math.floor((Date.now() - session.startAt) / 1000);
        return Math.max(0, session.minutes * 60 - elapsedSeconds);
    }

    function ensureFloatingTimer() {
        let timer = document.getElementById('floating-session-timer');
        if (timer) return timer;

        timer = document.createElement('div');
        timer.id = 'floating-session-timer';
        timer.className = 'floating-session-timer';
        timer.innerHTML = `
            <div class="session-timer-header">
                <span class="session-title">Session</span>
                <span class="session-countdown" id="floating-session-countdown">25:00</span>
            </div>
            <div class="session-progress">
                <div class="session-progress-bar" id="floating-session-progress"></div>
            </div>
            <div class="session-meta" id="floating-session-label">Focus block</div>
            <div class="session-controls">
                <button class="session-control-btn" type="button" data-session-action="toggle">Pause</button>
                <button class="session-control-btn" type="button" data-session-action="reset">Reset</button>
                <button class="session-control-btn danger" type="button" data-session-action="hide">Hide</button>
            </div>
        `;

        document.body.appendChild(timer);
        bindTimerControls(timer);
        return timer;
    }

    function renderTimer({
        countdownText,
        progressWidth,
        labelText,
        toggleLabel,
        showToggle
    }) {
        const dashboardTimer = document.getElementById('session-timer');

        if (dashboardTimer) {
            const countdown = document.getElementById('session-countdown');
            const progress = document.getElementById('session-progress');
            const label = document.getElementById('session-label');
            const toggleBtn = dashboardTimer.querySelector('[data-session-action="toggle"]');

            dashboardTimer.hidden = false;
            if (countdown) countdown.textContent = countdownText;
            if (progress) progress.style.width = progressWidth;
            if (label) label.textContent = labelText;
            if (toggleBtn && toggleLabel) toggleBtn.textContent = toggleLabel;
            if (toggleBtn) toggleBtn.hidden = !showToggle;
            bindTimerControls(dashboardTimer);
            return;
        }

        const floating = ensureFloatingTimer();
        const countdown = floating.querySelector('#floating-session-countdown');
        const progress = floating.querySelector('#floating-session-progress');
        const label = floating.querySelector('#floating-session-label');
        const toggleBtn = floating.querySelector('[data-session-action="toggle"]');

        if (countdown) countdown.textContent = countdownText;
        if (progress) progress.style.width = progressWidth;
        if (label) label.textContent = labelText;
        if (toggleBtn && toggleLabel) toggleBtn.textContent = toggleLabel;
        if (toggleBtn) toggleBtn.hidden = !showToggle;
    }

    function bindTimerControls(root) {
        const toggle = root.querySelector('[data-session-action="toggle"]');
        const reset = root.querySelector('[data-session-action="reset"]');
        const hide = root.querySelector('[data-session-action="hide"]');

        if (toggle) {
            toggle.onclick = () => togglePauseSession();
        }

        if (reset) {
            reset.onclick = () => resetSession();
        }

        if (hide) {
            hide.onclick = () => hideFloatingTimer();
        }
    }

    function seedPausedSession(minutes) {
        setSession({
            status: 'paused',
            minutes,
            remainingSeconds: minutes * 60,
            hidden: false
        });
    }

    function resetSession() {
        const session = getSession();
        const minutes = session?.minutes || 25;
        seedPausedSession(minutes);
        updateSessionTimer();
    }

    function togglePauseSession() {
        const session = getSession();
        if (!session) return;

        if (session.status === 'paused') {
            const totalSeconds = session.minutes * 60;
            const remainingSeconds = Math.max(0, session.remainingSeconds || totalSeconds);
            const elapsedSeconds = totalSeconds - remainingSeconds;
            setSession({
                status: 'running',
                minutes: session.minutes,
                startAt: Date.now() - elapsedSeconds * 1000,
                hidden: false
            });
        } else {
            const remainingSeconds = getRemainingSeconds(session);
            setSession({
                status: 'paused',
                minutes: session.minutes,
                remainingSeconds,
                hidden: false
            });
        }

        updateSessionTimer();
    }

    function hideFloatingTimer() {
        const session = getSession();
        if (!session) return;
        session.hidden = true;
        setSession(session);
        const floating = document.getElementById('floating-session-timer');
        if (floating) floating.remove();
    }

    function updateSessionTimer() {
        migrateSessionFromUrl();
        const session = getSession();
        const dashboardTimer = document.getElementById('session-timer');
        const floatingTimer = document.getElementById('floating-session-timer');

        if (!session) {
            if (dashboardTimer) {
                const durationSelect = document.getElementById('session-duration');
                const minutes = durationSelect ? Number(durationSelect.value) || 25 : 25;
                seedPausedSession(minutes);
                updateSessionTimer();
                return;
            }
            if (dashboardTimer) dashboardTimer.hidden = true;
            if (floatingTimer) floatingTimer.remove();
            if (sessionInterval) {
                clearInterval(sessionInterval);
                sessionInterval = null;
            }
            return;
        }

        const remainingSeconds = getRemainingSeconds(session);
        const totalSeconds = session.minutes * 60;

        if (!dashboardTimer && session.hidden) {
            if (session.status === 'running') {
                if (remainingSeconds <= 0) {
                    setSession(null);
                }
                if (!sessionInterval) {
                    sessionInterval = setInterval(updateSessionTimer, 1000);
                }
            } else if (sessionInterval) {
                clearInterval(sessionInterval);
                sessionInterval = null;
            }
            return;
        }

        const countdownText = formatCountdown(remainingSeconds * 1000);
        const pct = Math.min(1, Math.max(0, 1 - remainingSeconds / totalSeconds));
        const progressWidth = `${Math.round(pct * 100)}%`;
        const statusLabel = session.status === 'paused' ? 'Stopped' : 'Focus block';
        const labelText = `${statusLabel} • ${session.minutes} min`;
        const toggleLabel = session.status === 'paused' ? 'Start' : 'Pause';
        const showToggle = !(dashboardTimer && session.status === 'paused');

        renderTimer({
            countdownText,
            progressWidth,
            labelText,
            toggleLabel,
            showToggle
        });

        if (session.status === 'running' && remainingSeconds <= 0) {
            setSession(null);
            updateSessionTimer();
            return;
        }

        if (session.status === 'running') {
            if (!sessionInterval) {
                sessionInterval = setInterval(updateSessionTimer, 1000);
            }
        } else if (sessionInterval) {
            clearInterval(sessionInterval);
            sessionInterval = null;
        }
    }

    function startSession(minutes) {
        setSession({
            status: 'running',
            minutes,
            startAt: Date.now(),
            hidden: false
        });
        updateSessionTimer();

        const lastModule = localStorage.getItem('go-course-last-module');
        const target = lastModule ? `module${lastModule}.html` : 'module0.html';
        window.open(target, '_blank');
    }

    function updateSessionDuration(minutes) {
        const safeMinutes = Number(minutes);
        if (!Number.isFinite(safeMinutes) || safeMinutes <= 0) return;
        seedPausedSession(safeMinutes);
        updateSessionTimer();
    }

    window.startSession = startSession;
    window.updateSessionTimer = updateSessionTimer;
    window.updateSessionDuration = updateSessionDuration;
    window.sessionReset = resetSession;
    window.sessionToggle = togglePauseSession;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateSessionTimer);
    } else {
        updateSessionTimer();
    }
})();
