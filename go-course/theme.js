// Theme toggle functionality for Go Course
(function() {
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
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('go-course-theme', theme);
        updateToggleIcon();
    }

    // Update toggle button icon
    function updateToggleIcon() {
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            toggle.innerHTML = isLight ? '🌙' : '☀️';
            toggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
        }
    }

    // Initialize theme immediately to prevent flash
    setTheme(getPreferredTheme());

    // Create and inject toggle button when DOM is ready
    function createToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Toggle light mode');
        
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        toggle.innerHTML = isLight ? '🌙' : '☀️';
        
        toggle.addEventListener('click', function() {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'light' ? 'dark' : 'light');
        });
        
        document.body.appendChild(toggle);
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggle);
    } else {
        createToggle();
    }

    // Listen for system theme changes (only if no saved preference)
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
        if (!localStorage.getItem('go-course-theme')) {
            setTheme(e.matches ? 'light' : 'dark');
        }
    });
})();

(function() {
    const SESSION_PARAM_START = 'sessionStart';
    const SESSION_PARAM_MINUTES = 'sessionMinutes';
    const SESSION_PARAM_PAUSED = 'sessionPaused';
    const SESSION_PARAM_REMAINING = 'sessionRemaining';
    let sessionInterval = null;

    function formatCountdown(ms) {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function getSessionParams() {
        return new URLSearchParams(window.location.search);
    }

    function writeSessionParams(params) {
        const url = new URL(window.location.href);
        url.search = params.toString();
        history.replaceState({}, '', url.toString());
    }

    function getSessionFromUrl() {
        const params = getSessionParams();
        const startParam = params.get(SESSION_PARAM_START);
        const minutesParam = params.get(SESSION_PARAM_MINUTES);

        if (!startParam || !minutesParam) return null;

        const startAt = Number(startParam);
        const minutes = Number(minutesParam);
        if (!Number.isFinite(startAt) || !Number.isFinite(minutes) || minutes <= 0) return null;

        const paused = params.get(SESSION_PARAM_PAUSED) === '1';
        const remainingParam = params.get(SESSION_PARAM_REMAINING);
        const remainingSeconds = remainingParam ? Number(remainingParam) : null;

        return {
            startAt,
            minutes,
            paused,
            remainingSeconds
        };
    }

    function setSessionInUrl(session) {
        const params = getSessionParams();
        if (!session) {
            params.delete(SESSION_PARAM_START);
            params.delete(SESSION_PARAM_MINUTES);
            params.delete(SESSION_PARAM_PAUSED);
            params.delete(SESSION_PARAM_REMAINING);
            writeSessionParams(params);
            return;
        }

        params.set(SESSION_PARAM_START, String(session.startAt));
        params.set(SESSION_PARAM_MINUTES, String(session.minutes));

        if (session.paused) {
            params.set(SESSION_PARAM_PAUSED, '1');
            if (Number.isFinite(session.remainingSeconds)) {
                params.set(SESSION_PARAM_REMAINING, String(session.remainingSeconds));
            } else {
                params.delete(SESSION_PARAM_REMAINING);
            }
        } else {
            params.delete(SESSION_PARAM_PAUSED);
            params.delete(SESSION_PARAM_REMAINING);
        }

        writeSessionParams(params);
    }

    function getRemainingSeconds(session) {
        if (session.paused) {
            if (Number.isFinite(session.remainingSeconds)) {
                return Math.max(0, Math.floor(session.remainingSeconds));
            }
            return session.minutes * 60;
        }

        const endAt = session.startAt + session.minutes * 60 * 1000;
        return Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
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
        toggleLabel
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
    }

    function bindTimerControls(root) {
        const toggle = root.querySelector('[data-session-action="toggle"]');
        const reset = root.querySelector('[data-session-action="reset"]');

        if (toggle) {
            toggle.onclick = () => togglePauseSession();
        }

        if (reset) {
            reset.onclick = () => resetSession();
        }
    }

    function resetSession() {
        const session = getSessionFromUrl();
        const minutes = session?.minutes || 25;
        setSessionInUrl({
            startAt: Date.now(),
            minutes,
            paused: true,
            remainingSeconds: minutes * 60
        });
        updateSessionTimer();
    }

    function togglePauseSession() {
        const session = getSessionFromUrl();
        if (!session) return;

        if (session.paused) {
            const totalSeconds = session.minutes * 60;
            const remainingSeconds = Number.isFinite(session.remainingSeconds)
                ? Math.max(0, session.remainingSeconds)
                : totalSeconds;
            const elapsedSeconds = Math.max(0, totalSeconds - remainingSeconds);
            const startAt = Date.now() - elapsedSeconds * 1000;
            setSessionInUrl({
                startAt,
                minutes: session.minutes,
                paused: false
            });
        } else {
            const remainingSeconds = getRemainingSeconds(session);
            setSessionInUrl({
                startAt: session.startAt,
                minutes: session.minutes,
                paused: true,
                remainingSeconds
            });
        }

        updateSessionTimer();
    }

    function updateSessionTimer() {
        const session = getSessionFromUrl();
        const dashboardTimer = document.getElementById('session-timer');
        const floatingTimer = document.getElementById('floating-session-timer');

        if (!session) {
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
        const countdownText = formatCountdown(remainingSeconds * 1000);
        const pct = Math.min(1, Math.max(0, 1 - remainingSeconds / totalSeconds));
        const progressWidth = `${Math.round(pct * 100)}%`;
        const statusLabel = session.paused ? 'Stopped' : 'Focus block';
        const labelText = `${statusLabel} • ${session.minutes} min`;
        const toggleLabel = session.paused ? 'Start' : 'Pause';

        renderTimer({
            countdownText,
            progressWidth,
            labelText,
            toggleLabel
        });

        if (!session.paused && remainingSeconds <= 0) {
            setSessionInUrl(null);
            updateSessionTimer();
            return;
        }

        if (!session.paused) {
            if (!sessionInterval) {
                sessionInterval = setInterval(updateSessionTimer, 1000);
            }
        } else if (sessionInterval) {
            clearInterval(sessionInterval);
            sessionInterval = null;
        }
    }

    function startSession(minutes) {
        const now = Date.now();
        setSessionInUrl({
            startAt: now,
            minutes,
            paused: false
        });
        updateSessionTimer();

        const lastModule = localStorage.getItem('go-course-last-module');
        const target = lastModule ? `module${lastModule}.html` : 'module0.html';
        const url = new URL(target, window.location.href);
        url.searchParams.set(SESSION_PARAM_START, String(now));
        url.searchParams.set(SESSION_PARAM_MINUTES, String(minutes));
        window.open(url.toString(), '_blank');
    }

    function updateSessionDuration(minutes) {
        const safeMinutes = Number(minutes);
        if (!Number.isFinite(safeMinutes) || safeMinutes <= 0) return;

        setSessionInUrl({
            startAt: Date.now(),
            minutes: safeMinutes,
            paused: true,
            remainingSeconds: safeMinutes * 60
        });
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
