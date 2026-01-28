/**
 * Go Grind - Web Audio API Synthesizer
 * All sounds are oscillator-based, no external audio files.
 */
(function() {
    'use strict';

    var ctx = null;

    function getContext() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        return ctx;
    }

    function isSoundEnabled() {
        if (window.GameState) {
            return window.GameState.getSettings().sound !== false;
        }
        return true;
    }

    function playNote(freq, type, duration, gain, startDelay) {
        if (!isSoundEnabled()) return;
        var ac = getContext();
        var osc = ac.createOscillator();
        var g = ac.createGain();
        osc.connect(g);
        g.connect(ac.destination);
        osc.type = type || 'sine';
        osc.frequency.value = freq;
        var t = ac.currentTime + (startDelay || 0);
        g.gain.setValueAtTime(gain || 0.2, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + duration);
        osc.start(t);
        osc.stop(t + duration);
    }

    function playChord(freqs, type, duration, gain, startDelay) {
        freqs.forEach(function(f) {
            playNote(f, type, duration, (gain || 0.15) / freqs.length, startDelay);
        });
    }

    function playMenuSelect() {
        playNote(800, 'sine', 0.05, 0.25);
    }

    function playAllOutAttack() {
        if (!isSoundEnabled()) return;
        var notes = [523.25, 587.33, 659.25, 698.46, 783.99];
        notes.forEach(function(freq, i) {
            playNote(freq, 'triangle', 0.08, 0.2, i * 0.08);
        });
        playChord([523.25, 659.25, 783.99], 'sine', 0.5, 0.3, 0.4);
    }

    function playGradeS() {
        playNote(523.25, 'sawtooth', 0.12, 0.15, 0);
        playNote(783.99, 'sawtooth', 0.12, 0.15, 0.1);
        playNote(1046.5, 'sawtooth', 0.2, 0.18, 0.2);
    }

    function playGradeA() {
        playNote(523.25, 'sine', 0.12, 0.2, 0);
        playNote(659.25, 'sine', 0.15, 0.2, 0.1);
    }

    function playGradeB() {
        playNote(523.25, 'sine', 0.15, 0.2);
    }

    function playGradeC() {
        playNote(523.25, 'sine', 0.1, 0.15, 0);
        playNote(493.88, 'sine', 0.15, 0.15, 0.1);
    }

    function playGrade(grade) {
        switch (grade) {
            case 'S': playGradeS(); break;
            case 'A': playGradeA(); break;
            case 'B': playGradeB(); break;
            default: playGradeC(); break;
        }
    }

    function playLevelUp() {
        if (!isSoundEnabled()) return;
        var scale = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5];
        scale.forEach(function(freq, i) {
            playNote(freq, 'sine', 0.12, 0.1 + i * 0.02, i * 0.08);
        });
    }

    function playSkillUp() {
        if (!isSoundEnabled()) return;
        playChord([440, 523.25, 659.25], 'sine', 0.4, 0.25, 0);
        playChord([523.25, 659.25, 783.99], 'sine', 0.5, 0.25, 0.4);
    }

    function playHintOpen() {
        playNote(600, 'sine', 0.08, 0.1, 0);
        playNote(500, 'sine', 0.1, 0.1, 0.06);
    }

    function playMarkComplete() {
        playNote(700, 'sine', 0.06, 0.15);
    }

    window.GameAudio = {
        playMenuSelect: playMenuSelect,
        playAllOutAttack: playAllOutAttack,
        playGrade: playGrade,
        playLevelUp: playLevelUp,
        playSkillUp: playSkillUp,
        playHintOpen: playHintOpen,
        playMarkComplete: playMarkComplete
    };
})();
