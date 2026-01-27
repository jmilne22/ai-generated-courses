// Theme toggle functionality for Go Course
(function() {
    const memoryStore = {};

    function safeGet(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return Object.prototype.hasOwnProperty.call(memoryStore, key)
                ? memoryStore[key]
                : null;
        }
    }

    function safeSet(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            memoryStore[key] = value;
        }
    }

    function safeRemove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            delete memoryStore[key];
        }
    }

    const themeGroups = [
        {
            label: 'Default',
            options: [
                { value: 'dark', label: 'Dark' },
                { value: 'oled-dark', label: 'OLED' },
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
                { value: 'dracula-dark', label: 'Dark' }
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
        },
        {
            label: 'Pastel',
            options: [
                { value: 'pastel-light', label: 'Light' }
            ]
        }
    ];

    // Check for saved theme preference or default to dark
    function getPreferredTheme() {
        const saved = safeGet('go-course-theme');
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
        safeSet('go-course-theme', theme);
    }

    // Initialize theme immediately to prevent flash
    setTheme(getPreferredTheme());

    const focusStorageKey = 'go-course-focus-mode';

    function isFocusModeEnabled() {
        return safeGet(focusStorageKey) === 'on';
    }

    function setFocusMode(enabled) {
        document.body.classList.toggle('focus-mode', enabled);
        safeSet(focusStorageKey, enabled ? 'on' : 'off');
    }

    window.goCourseFocus = {
        isEnabled: isFocusModeEnabled,
        set: setFocusMode
    };

    function createFocusToggle(target) {
        if (!target || document.querySelector('.focus-toggle')) {
            return;
        }
        const button = document.createElement('button');
        button.className = 'focus-toggle';
        button.type = 'button';
        button.setAttribute('aria-label', 'Toggle focus mode');

        const updateLabel = () => {
            const enabled = isFocusModeEnabled();
            button.textContent = enabled ? 'Focus On' : 'Focus Off';
            button.classList.toggle('active', enabled);
        };

        updateLabel();

        button.addEventListener('click', () => {
            setFocusMode(!isFocusModeEnabled());
            updateLabel();
        });

        target.appendChild(button);
    }

    function createShowTimerToggle(target) {
        if (!target || document.querySelector('.show-timer-toggle')) {
            return;
        }
        const button = document.createElement('button');
        button.className = 'show-timer-toggle';
        button.type = 'button';
        button.textContent = 'Show timer';
        button.setAttribute('aria-label', 'Show session timer');
        button.addEventListener('click', () => {
            if (window.sessionShow) {
                window.sessionShow();
            }
        });
        target.appendChild(button);
    }

    function createFocusToggleFallback() {
        if (document.querySelector('.focus-toggle')) {
            return;
        }
        const wrapper = document.querySelector('.theme-actions');
        if (!wrapper) return;
        createFocusToggle(wrapper);
    }

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

        const actions = document.createElement('div');
        actions.className = 'theme-actions';

        createShowTimerToggle(actions);

        wrapper.appendChild(label);
        wrapper.appendChild(select);
        if (actions.childNodes.length > 0) {
            wrapper.appendChild(actions);
        }
        document.body.appendChild(wrapper);
        createFocusToggleFallback();
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
        document.addEventListener('DOMContentLoaded', () => {
            createThemePicker();
            createFocusToggle(document.getElementById('focus-toggle-slot'));
            setFocusMode(isFocusModeEnabled());
        });
    } else {
        createThemePicker();
        createFocusToggle(document.getElementById('focus-toggle-slot'));
        setFocusMode(isFocusModeEnabled());
    }

    // Listen for system theme changes (only if no saved preference)
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
        if (!safeGet('go-course-theme')) {
            setTheme(e.matches ? 'light' : 'dark');
        }
    });
})();

(function() {
    const SESSION_KEY = 'go-course-session';
    const memoryStore = {};
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
            return memoryStore[SESSION_KEY] || null;
        }
    }

    function setSession(session) {
        if (!session) {
            try {
                localStorage.removeItem(SESSION_KEY);
            } catch (error) {
                delete memoryStore[SESSION_KEY];
            }
            return;
        }
        try {
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } catch (error) {
            memoryStore[SESSION_KEY] = session;
        }
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

    function normalizeSession(session) {
        if (!session) return null;

        if (typeof session.focusMinutes !== 'number' && typeof session.minutes === 'number') {
            session.focusMinutes = session.minutes;
        }

        if (typeof session.breakMinutes !== 'number') {
            session.breakMinutes = 0;
        }

        if (typeof session.longBreakMinutes !== 'number') {
            session.longBreakMinutes = 15;
        }

        if (typeof session.completedCycles !== 'number') {
            session.completedCycles = 0;
        }

        if (typeof session.cyclesBeforeLongBreak !== 'number') {
            session.cyclesBeforeLongBreak = 4;
        }

        if (!session.phase) {
            session.phase = 'focus';
        }

        return session;
    }

    function getPhaseDurationSeconds(session) {
        if (session.phase === 'break') {
            return (session.breakMinutes || 0) * 60;
        }
        if (session.phase === 'longBreak') {
            return (session.longBreakMinutes || 15) * 60;
        }
        return (session.focusMinutes || 0) * 60;
    }

    function getRemainingSeconds(session) {
        if (session.status === 'paused') {
            return Math.max(0, Math.floor(session.remainingSeconds || 0));
        }
        const elapsedSeconds = Math.floor((Date.now() - session.startAt) / 1000);
        return Math.max(0, getPhaseDurationSeconds(session) - elapsedSeconds);
    }

    function parseDurationValue(value) {
        if (typeof value === 'number') {
            return { focusMinutes: value, breakMinutes: 0, longBreakMinutes: 15 };
        }

        const raw = String(value || '').trim();
        if (raw.includes('-')) {
            const parts = raw.split('-').map(Number);
            const focus = Number.isFinite(parts[0]) ? parts[0] : 25;
            const shortBreak = Number.isFinite(parts[1]) ? parts[1] : 5;
            const longBreak = Number.isFinite(parts[2]) ? parts[2] : 15;
            return {
                focusMinutes: focus,
                breakMinutes: shortBreak,
                longBreakMinutes: longBreak
            };
        }

        const minutes = Number(raw);
        return {
            focusMinutes: Number.isFinite(minutes) ? minutes : 25,
            breakMinutes: 0,
            longBreakMinutes: 15
        };
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
            <div class="session-duration-row">
                <label for="floating-session-duration">Duration</label>
                <select id="floating-session-duration" class="session-duration-select">
                    <option value="25-5-15">25/5/15</option>
                    <option value="50-10-15">50/10/15</option>
                    <option value="90-20-30">90/20/30</option>
                </select>
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
        const duration = root.querySelector('.session-duration-select');

        if (toggle) {
            toggle.onclick = () => togglePauseSession();
        }

        if (reset) {
            reset.onclick = () => resetSession();
        }

        if (hide) {
            hide.onclick = () => hideFloatingTimer();
        }

        if (duration) {
            duration.onchange = () => {
                if (window.updateSessionDuration) {
                    window.updateSessionDuration(duration.value);
                }
            };
        }

    }

    function seedPausedSession(minutes) {
        const { focusMinutes, breakMinutes, longBreakMinutes } = parseDurationValue(minutes);
        setSession({
            status: 'paused',
            phase: 'focus',
            focusMinutes,
            breakMinutes,
            longBreakMinutes,
            completedCycles: 0,
            cyclesBeforeLongBreak: 4,
            remainingSeconds: focusMinutes * 60,
            hidden: false
        });
    }

    function resetSession() {
        const session = normalizeSession(getSession());
        const focusMinutes = session?.focusMinutes || session?.minutes || 25;
        const breakMinutes = session?.breakMinutes || 0;
        const longBreakMinutes = session?.longBreakMinutes || 15;
        seedPausedSession(`${focusMinutes}-${breakMinutes}-${longBreakMinutes}`);
        updateSessionTimer();
    }

    function togglePauseSession() {
        const session = normalizeSession(getSession());
        if (!session) return;

        if (session.status === 'paused') {
            const totalSeconds = getPhaseDurationSeconds(session);
            const remainingSeconds = Math.max(0, session.remainingSeconds || totalSeconds);
            const elapsedSeconds = totalSeconds - remainingSeconds;
            setSession({
                status: 'running',
                phase: session.phase || 'focus',
                focusMinutes: session.focusMinutes || session.minutes,
                breakMinutes: session.breakMinutes || 0,
                longBreakMinutes: session.longBreakMinutes || 15,
                completedCycles: session.completedCycles || 0,
                cyclesBeforeLongBreak: session.cyclesBeforeLongBreak || 4,
                startAt: Date.now() - elapsedSeconds * 1000,
                hidden: false
            });
        } else {
            const remainingSeconds = getRemainingSeconds(session);
            setSession({
                status: 'paused',
                phase: session.phase || 'focus',
                focusMinutes: session.focusMinutes || session.minutes,
                breakMinutes: session.breakMinutes || 0,
                longBreakMinutes: session.longBreakMinutes || 15,
                completedCycles: session.completedCycles || 0,
                cyclesBeforeLongBreak: session.cyclesBeforeLongBreak || 4,
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
        updateSessionTimer();
    }

    function showFloatingTimer() {
        const session = getSession();
        if (!session) return;
        session.hidden = false;
        setSession(session);
        updateSessionTimer();
    }

    function updateSessionTimer() {
        migrateSessionFromUrl();
        const session = getSession();
        const dashboardTimer = document.getElementById('session-timer');
        const floatingTimer = document.getElementById('floating-session-timer');
        const showTimerToggle = document.querySelector('.show-timer-toggle');

        if (!session) {
            if (dashboardTimer) {
                const durationSelect = document.getElementById('session-duration');
                const minutes = durationSelect ? durationSelect.value : '25-5';
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
            if (showTimerToggle) {
                showTimerToggle.hidden = true;
            }
            return;
        }

        if (showTimerToggle) {
            const shouldShowToggle = session.hidden && !dashboardTimer;
            showTimerToggle.hidden = !shouldShowToggle;
            showTimerToggle.style.display = shouldShowToggle ? 'inline-flex' : 'none';
        }

        const remainingSeconds = getRemainingSeconds(session);
        const totalSeconds = getPhaseDurationSeconds(session);

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

        if (session.hidden) {
            session.hidden = false;
            setSession(session);
        }

        const countdownText = formatCountdown(remainingSeconds * 1000);
        const pct = Math.min(1, Math.max(0, 1 - remainingSeconds / totalSeconds));
        const progressWidth = `${Math.round(pct * 100)}%`;

        let statusLabel = 'Stopped';
        let labelMinutes = session.focusMinutes || 0;

        if (session.status !== 'paused') {
            if (session.phase === 'longBreak') {
                statusLabel = 'Long break';
                labelMinutes = session.longBreakMinutes || 15;
            } else if (session.phase === 'break') {
                statusLabel = 'Break';
                labelMinutes = session.breakMinutes || 0;
            } else {
                statusLabel = 'Focus block';
                labelMinutes = session.focusMinutes || 0;
            }
        }

        const cycleInfo = ` • ${session.completedCycles || 0}/${session.cyclesBeforeLongBreak || 4}`;
        const labelText = `${statusLabel} • ${labelMinutes} min${cycleInfo}`;
        const toggleLabel = session.status === 'paused' ? 'Start' : 'Pause';
        const showToggle = !(dashboardTimer && session.status === 'paused');

        renderTimer({
            countdownText,
            progressWidth,
            labelText,
            toggleLabel,
            showToggle
        });

        if (floatingTimer) {
            const duration = floatingTimer.querySelector('.session-duration-select');
            if (duration) {
                const longBreak = session.longBreakMinutes || 15;
                duration.value = `${session.focusMinutes || 25}-${session.breakMinutes || 0}-${longBreak}`;
            }
        }

        if (session.status === 'running' && remainingSeconds <= 0) {
            // Focus session completed - increment cycle and start break
            if (session.phase === 'focus' && session.breakMinutes > 0) {
                const newCompletedCycles = (session.completedCycles || 0) + 1;
                const needsLongBreak = newCompletedCycles % (session.cyclesBeforeLongBreak || 4) === 0;

                setSession({
                    status: 'running',
                    phase: needsLongBreak ? 'longBreak' : 'break',
                    focusMinutes: session.focusMinutes,
                    breakMinutes: session.breakMinutes,
                    longBreakMinutes: session.longBreakMinutes || 15,
                    completedCycles: newCompletedCycles,
                    cyclesBeforeLongBreak: session.cyclesBeforeLongBreak || 4,
                    startAt: Date.now(),
                    hidden: false
                });
                updateSessionTimer();
                return;
            }

            // Break completed - automatically start next focus session
            if ((session.phase === 'break' || session.phase === 'longBreak') && session.focusMinutes > 0) {
                setSession({
                    status: 'running',
                    phase: 'focus',
                    focusMinutes: session.focusMinutes,
                    breakMinutes: session.breakMinutes,
                    longBreakMinutes: session.longBreakMinutes || 15,
                    completedCycles: session.completedCycles || 0,
                    cyclesBeforeLongBreak: session.cyclesBeforeLongBreak || 4,
                    startAt: Date.now(),
                    hidden: false
                });
                updateSessionTimer();
                return;
            }

            // Fallback: if no break configured, pause at focus
            setSession({
                status: 'paused',
                phase: 'focus',
                focusMinutes: session.focusMinutes,
                breakMinutes: session.breakMinutes,
                longBreakMinutes: session.longBreakMinutes || 15,
                completedCycles: session.completedCycles || 0,
                cyclesBeforeLongBreak: session.cyclesBeforeLongBreak || 4,
                remainingSeconds: session.focusMinutes * 60,
                hidden: false
            });
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
        const { focusMinutes, breakMinutes, longBreakMinutes } = parseDurationValue(minutes);
        setSession({
            status: 'running',
            phase: 'focus',
            focusMinutes,
            breakMinutes,
            longBreakMinutes,
            completedCycles: 0,
            cyclesBeforeLongBreak: 4,
            startAt: Date.now(),
            hidden: false
        });
        updateSessionTimer();

        const lastModule = localStorage.getItem('go-course-last-module');
        const target = lastModule ? `module${lastModule}.html` : 'module0.html';
        window.open(target, '_blank');
    }

    function updateSessionDuration(minutes) {
        const { focusMinutes, breakMinutes, longBreakMinutes } = parseDurationValue(minutes);
        if (!Number.isFinite(focusMinutes) || focusMinutes <= 0) return;
        seedPausedSession(`${focusMinutes}-${breakMinutes}-${longBreakMinutes}`);
        updateSessionTimer();
    }

    window.startSession = startSession;
    window.updateSessionTimer = updateSessionTimer;
    window.updateSessionDuration = updateSessionDuration;
    window.sessionReset = resetSession;
    window.sessionToggle = togglePauseSession;
    window.sessionShow = showFloatingTimer;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateSessionTimer);
    } else {
        updateSessionTimer();
    }
})();
