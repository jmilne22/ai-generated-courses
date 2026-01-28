/* ============================================================
   Go Grind - Infiltration Timer (Pomodoro)
   Persona 5 themed study session timer
   ============================================================ */

(function() {
    const SESSION_KEY = 'go-grind-session';
    const SOUND_ENABLED_KEY = 'go-grind-timer-sound';
    let sessionInterval = null;
    let audioContext = null;

    // Lazy init audio context (needs user interaction)
    function getAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    }

    function playSound(type) {
        try {
            const soundEnabled = localStorage.getItem(SOUND_ENABLED_KEY) !== 'false';
            if (!soundEnabled) return;

            const ctx = getAudioContext();
            if (ctx.state === 'suspended') ctx.resume();

            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            if (type === 'break') {
                // Return to Reality - gentle descending tone
                oscillator.frequency.value = 523.25; // C5
                gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.8);
            } else {
                // Infiltration Start - sharp ascending P5-style
                oscillator.frequency.value = 659.25; // E5
                oscillator.type = 'square';
                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.4);
            }
        } catch (error) {
            console.log('Sound playback failed:', error);
        }
    }

    function formatCountdown(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function getSession() {
        try {
            const raw = localStorage.getItem(SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    function setSession(session) {
        try {
            if (session) {
                localStorage.setItem(SESSION_KEY, JSON.stringify(session));
            } else {
                localStorage.removeItem(SESSION_KEY);
            }
        } catch (e) {
            console.error('Failed to save session:', e);
        }
    }

    function normalizeSession(session) {
        if (!session) return null;

        return {
            status: session.status || 'paused',
            phase: session.phase || 'focus',
            focusMinutes: session.focusMinutes || 25,
            breakMinutes: session.breakMinutes || 5,
            longBreakMinutes: session.longBreakMinutes || 15,
            completedCycles: session.completedCycles || 0,
            cyclesBeforeLongBreak: session.cyclesBeforeLongBreak || 4,
            startAt: session.startAt || Date.now(),
            remainingSeconds: session.remainingSeconds || (session.focusMinutes || 25) * 60,
            hidden: session.hidden || false
        };
    }

    function getPhaseDuration(session) {
        if (session.phase === 'longBreak') return session.longBreakMinutes * 60;
        if (session.phase === 'break') return session.breakMinutes * 60;
        return session.focusMinutes * 60;
    }

    function getRemainingSeconds(session) {
        if (session.status === 'paused') {
            return Math.max(0, session.remainingSeconds || 0);
        }
        const elapsed = Math.floor((Date.now() - session.startAt) / 1000);
        return Math.max(0, getPhaseDuration(session) - elapsed);
    }

    function parseDuration(value) {
        if (typeof value === 'string' && value.includes('-')) {
            const [focus, short, long] = value.split('-').map(Number);
            return {
                focusMinutes: focus || 25,
                breakMinutes: short || 5,
                longBreakMinutes: long || 15
            };
        }
        return { focusMinutes: 25, breakMinutes: 5, longBreakMinutes: 15 };
    }

    // P5-themed phase labels
    function getPhaseLabel(session) {
        if (session.status === 'paused') return 'STANDBY';
        if (session.phase === 'longBreak') return 'LONG REST';
        if (session.phase === 'break') return 'RETURN TO REALITY';
        return 'INFILTRATING';
    }

    function getPhaseClass(session) {
        if (session.status === 'paused') return 'standby';
        if (session.phase === 'longBreak' || session.phase === 'break') return 'break';
        return 'infiltrating';
    }

    function createTimerHTML() {
        return `
            <div class="infiltration-timer" id="infiltration-timer">
                <div class="timer-header">
                    <span class="timer-phase" id="timer-phase">STANDBY</span>
                    <span class="timer-cycles" id="timer-cycles">0/4</span>
                </div>
                <div class="timer-display">
                    <span class="timer-countdown" id="timer-countdown">25:00</span>
                </div>
                <div class="timer-progress">
                    <div class="timer-progress-bar" id="timer-progress"></div>
                </div>
                <div class="timer-controls">
                    <button class="timer-btn primary" id="timer-toggle">BEGIN</button>
                    <button class="timer-btn" id="timer-reset">RESET</button>
                    <button class="timer-btn" id="timer-sound">🔔</button>
                </div>
                <div class="timer-duration">
                    <select id="timer-duration-select" class="timer-select">
                        <option value="25-5-15">25/5/15</option>
                        <option value="50-10-15">50/10/15</option>
                        <option value="90-20-30">90/20/30</option>
                    </select>
                </div>
            </div>
        `;
    }

    function renderTimer() {
        let session = normalizeSession(getSession());

        // Create default session if none exists
        if (!session) {
            session = normalizeSession({
                status: 'paused',
                phase: 'focus',
                focusMinutes: 25,
                breakMinutes: 5,
                longBreakMinutes: 15,
                remainingSeconds: 25 * 60
            });
            setSession(session);
        }

        const timer = document.getElementById('infiltration-timer');
        if (!timer) return;

        const remaining = getRemainingSeconds(session);
        const total = getPhaseDuration(session);
        const pct = Math.min(1, Math.max(0, 1 - remaining / total));

        // Update display
        const countdown = document.getElementById('timer-countdown');
        const progress = document.getElementById('timer-progress');
        const phase = document.getElementById('timer-phase');
        const cycles = document.getElementById('timer-cycles');
        const toggle = document.getElementById('timer-toggle');

        if (countdown) countdown.textContent = formatCountdown(remaining);
        if (progress) progress.style.width = `${Math.round(pct * 100)}%`;
        if (phase) phase.textContent = getPhaseLabel(session);
        if (cycles) cycles.textContent = `${session.completedCycles}/${session.cyclesBeforeLongBreak}`;
        if (toggle) toggle.textContent = session.status === 'paused' ? 'BEGIN' : 'PAUSE';

        // Update timer class for phase styling
        timer.className = `infiltration-timer ${getPhaseClass(session)}`;

        // Handle phase transitions
        if (session.status === 'running' && remaining <= 0) {
            handlePhaseComplete(session);
            return;
        }

        // Manage interval
        if (session.status === 'running') {
            if (!sessionInterval) {
                sessionInterval = setInterval(renderTimer, 1000);
            }
        } else if (sessionInterval) {
            clearInterval(sessionInterval);
            sessionInterval = null;
        }
    }

    function handlePhaseComplete(session) {
        if (session.phase === 'focus') {
            // Focus complete - start break
            const newCycles = session.completedCycles + 1;
            const needsLongBreak = newCycles % session.cyclesBeforeLongBreak === 0;

            playSound('break');
            showNotification('Time for a break!');

            setSession({
                ...session,
                status: 'running',
                phase: needsLongBreak ? 'longBreak' : 'break',
                completedCycles: newCycles,
                startAt: Date.now()
            });
        } else {
            // Break complete - start focus
            playSound('work');
            showNotification('Back to infiltration!');

            setSession({
                ...session,
                status: 'running',
                phase: 'focus',
                startAt: Date.now()
            });
        }
        renderTimer();
    }

    function showNotification(message) {
        // Flash timer
        const timer = document.getElementById('infiltration-timer');
        if (timer) {
            timer.classList.add('flash');
            setTimeout(() => timer.classList.remove('flash'), 1000);
        }

        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Go Grind', { body: message });
        }
    }

    function toggleSession() {
        const session = normalizeSession(getSession());
        if (!session) return;

        // Request notification permission on first start
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        if (session.status === 'paused') {
            // Resume/Start
            const total = getPhaseDuration(session);
            const remaining = session.remainingSeconds || total;
            const elapsed = total - remaining;

            setSession({
                ...session,
                status: 'running',
                startAt: Date.now() - elapsed * 1000
            });
        } else {
            // Pause
            const remaining = getRemainingSeconds(session);
            setSession({
                ...session,
                status: 'paused',
                remainingSeconds: remaining
            });
        }
        renderTimer();
    }

    function resetSession() {
        const session = normalizeSession(getSession());
        const focus = session?.focusMinutes || 25;
        const shortBreak = session?.breakMinutes || 5;
        const longBreak = session?.longBreakMinutes || 15;

        setSession({
            status: 'paused',
            phase: 'focus',
            focusMinutes: focus,
            breakMinutes: shortBreak,
            longBreakMinutes: longBreak,
            completedCycles: 0,
            cyclesBeforeLongBreak: 4,
            remainingSeconds: focus * 60
        });
        renderTimer();
    }

    function changeDuration(value) {
        const { focusMinutes, breakMinutes, longBreakMinutes } = parseDuration(value);
        setSession({
            status: 'paused',
            phase: 'focus',
            focusMinutes,
            breakMinutes,
            longBreakMinutes,
            completedCycles: 0,
            cyclesBeforeLongBreak: 4,
            remainingSeconds: focusMinutes * 60
        });
        renderTimer();
    }

    function toggleSound() {
        const current = localStorage.getItem(SOUND_ENABLED_KEY) !== 'false';
        localStorage.setItem(SOUND_ENABLED_KEY, String(!current));

        const btn = document.getElementById('timer-sound');
        if (btn) btn.textContent = !current ? '🔔' : '🔇';
    }

    function bindControls() {
        const toggle = document.getElementById('timer-toggle');
        const reset = document.getElementById('timer-reset');
        const sound = document.getElementById('timer-sound');
        const duration = document.getElementById('timer-duration-select');

        if (toggle) toggle.onclick = toggleSession;
        if (reset) reset.onclick = resetSession;
        if (sound) {
            sound.onclick = toggleSound;
            sound.textContent = localStorage.getItem(SOUND_ENABLED_KEY) !== 'false' ? '🔔' : '🔇';
        }
        if (duration) duration.onchange = () => changeDuration(duration.value);
    }

    // Initialize timer in a container
    function initTimer(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = createTimerHTML();
        bindControls();
        renderTimer();
    }

    // Export for global use
    window.GoGrindTimer = {
        init: initTimer,
        toggle: toggleSession,
        reset: resetSession,
        render: renderTimer
    };

    // Auto-init if container exists on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.getElementById('timer-container')) {
                initTimer('timer-container');
            }
        });
    } else {
        if (document.getElementById('timer-container')) {
            initTimer('timer-container');
        }
    }
})();
