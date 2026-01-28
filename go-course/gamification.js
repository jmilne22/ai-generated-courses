/**
 * Gamification System for Go Course
 * Persona 5 + Yakuza 0 inspired mechanics
 *
 * Systems: Gopher Bucks, Combo, Stat Pentagon, Achievements,
 *          Personal Leaderboard, Calendar+Energy, Confidant/Social Links,
 *          Concept Fusion, Calling Cards, Study Music Radio
 */
(function() {
    'use strict';

    // ============================================
    // Storage helpers
    // ============================================
    const KEYS = {
        currency: 'go-course-gopher-bucks',
        combo: 'go-course-combo',
        stats: 'go-course-social-stats',
        achievements: 'go-course-achievements',
        leaderboard: 'go-course-leaderboard',
        calendar: 'go-course-calendar',
        energy: 'go-course-energy',
        confidants: 'go-course-confidants',
        fusions: 'go-course-fusions',
        callingCards: 'go-course-calling-cards',
        exerciseLog: 'go-course-exercise-log',
        shopUnlocks: 'go-course-shop-unlocks',
        musicStation: 'go-course-music-station',
        exams: 'go-course-exams',
        tutorialSeen: 'go-course-tutorial-seen',
    };

    function load(key, fallback) {
        try {
            const v = localStorage.getItem(key);
            return v ? JSON.parse(v) : fallback;
        } catch { return fallback; }
    }

    function save(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
    }

    // ============================================
    // Sound effects (Persona 5 style)
    // ============================================
    let audioCtx = null;
    function getAudioCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtx;
    }

    function playTone(freq, duration, type = 'sine', vol = 0.15) {
        try {
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            osc.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(vol, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
        } catch {}
    }

    function playCoinSound() {
        playTone(988, 0.1, 'square', 0.08);
        setTimeout(() => playTone(1319, 0.15, 'square', 0.08), 80);
    }

    function playComboSound(combo) {
        const baseFreq = 440 + (combo * 60);
        playTone(baseFreq, 0.1, 'sawtooth', 0.06);
        setTimeout(() => playTone(baseFreq * 1.5, 0.15, 'sawtooth', 0.06), 60);
    }

    function playAllOutAttack() {
        [523, 659, 784, 1047].forEach((f, i) => {
            setTimeout(() => playTone(f, 0.2, 'square', 0.1), i * 100);
        });
    }

    function playLevelUp() {
        [440, 554, 659, 880].forEach((f, i) => {
            setTimeout(() => playTone(f, 0.25, 'triangle', 0.1), i * 120);
        });
    }

    function playAchievement() {
        [659, 784, 988, 1319, 1568].forEach((f, i) => {
            setTimeout(() => playTone(f, 0.3, 'sine', 0.08), i * 80);
        });
    }

    function playFusion() {
        [220, 330, 440, 660, 880].forEach((f, i) => {
            setTimeout(() => playTone(f, 0.4, 'sine', 0.1), i * 150);
        });
    }

    // ============================================
    // 1. GOPHER BUCKS ECONOMY
    // ============================================
    function getBucks() { return load(KEYS.currency, 0); }
    function setBucks(amount) { save(KEYS.currency, Math.max(0, amount)); updateBucksDisplay(); }

    function earnBucks(amount, reason) {
        const combo = getCombo();
        const multiplier = combo.current >= 5 ? 3 : combo.current >= 3 ? 2 : 1;
        const total = amount * multiplier;
        setBucks(getBucks() + total);
        playCoinSound();
        showFloatingText(`+${total} Bucks${multiplier > 1 ? ` (x${multiplier})` : ''}`, 'bucks');
        return total;
    }

    function spendBucks(amount) {
        const current = getBucks();
        if (current < amount) return false;
        setBucks(current - amount);
        return true;
    }

    function updateBucksDisplay() {
        const els = document.querySelectorAll('.gopher-bucks-value');
        els.forEach(el => {
            el.textContent = getBucks().toLocaleString();
        });
    }

    // Reward amounts by difficulty
    const BUCKS_REWARDS = { 1: 100, 2: 250, 3: 500, 4: 750 };

    // ============================================
    // 2. COMBO SYSTEM
    // ============================================
    function getCombo() { return load(KEYS.combo, { current: 0, best: 0, total: 0 }); }

    function incrementCombo() {
        const combo = getCombo();
        combo.current++;
        combo.total++;
        if (combo.current > combo.best) combo.best = combo.current;
        save(KEYS.combo, combo);

        playComboSound(combo.current);

        if (combo.current === 5) {
            showAllOutAttack();
        }

        updateComboDisplay();
        return combo;
    }

    function breakCombo() {
        const combo = getCombo();
        combo.current = 0;
        save(KEYS.combo, combo);
        updateComboDisplay();
    }

    function updateComboDisplay() {
        const combo = getCombo();
        const el = document.getElementById('combo-counter');
        if (!el) return;

        if (combo.current === 0) {
            el.style.display = 'none';
            return;
        }

        el.style.display = 'flex';
        const multiplier = combo.current >= 5 ? 3 : combo.current >= 3 ? 2 : 1;
        el.innerHTML = `
            <span class="combo-count">${combo.current}</span>
            <span class="combo-label">COMBO${multiplier > 1 ? ` x${multiplier}` : ''}</span>
        `;
        el.classList.remove('combo-pulse');
        void el.offsetWidth;
        el.classList.add('combo-pulse');
    }

    function showAllOutAttack() {
        playAllOutAttack();
        const overlay = document.createElement('div');
        overlay.className = 'all-out-attack-overlay';
        overlay.innerHTML = `
            <div class="all-out-attack-text">
                <div class="aoa-line1">ALL-OUT</div>
                <div class="aoa-line2">ATTACK!</div>
                <div class="aoa-sub">x3 MULTIPLIER ACTIVE</div>
            </div>
        `;
        document.body.appendChild(overlay);
        setTimeout(() => {
            overlay.classList.add('aoa-fade');
            setTimeout(() => overlay.remove(), 500);
        }, 1800);
    }

    // ============================================
    // 3. STAT PENTAGON (Social Stats)
    // ============================================
    const STAT_NAMES = ['Syntax', 'Concurrency', 'Safety', 'Design', 'Performance'];
    const STAT_ICONS = ['crosshair', 'zap', 'shield', 'palette', 'settings'];

    // Stat XP required per level (cumulative)
    function xpForLevel(level) { return level * 100; }

    function getStats() {
        return load(KEYS.stats, {
            Syntax: { xp: 0, level: 1 },
            Concurrency: { xp: 0, level: 1 },
            Safety: { xp: 0, level: 1 },
            Design: { xp: 0, level: 1 },
            Performance: { xp: 0, level: 1 },
        });
    }

    function addStatXP(statName, amount) {
        const stats = getStats();
        if (!stats[statName]) return;

        stats[statName].xp += amount;
        let leveledUp = false;

        // Check for level ups
        while (stats[statName].xp >= xpForLevel(stats[statName].level)) {
            stats[statName].xp -= xpForLevel(stats[statName].level);
            stats[statName].level++;
            leveledUp = true;
        }

        save(KEYS.stats, stats);

        if (leveledUp) {
            playLevelUp();
            showFloatingText(`${statName} Level ${stats[statName].level}!`, 'level-up');
        } else {
            showFloatingText(`+${amount} ${statName} XP`, 'stat-xp');
        }

        return leveledUp;
    }

    // Map concepts/modules to stats
    const CONCEPT_STAT_MAP = {
        'Variables': 'Syntax', 'Types': 'Syntax', 'Functions': 'Syntax',
        'Loops': 'Syntax', 'Conditionals': 'Syntax', 'Strings': 'Syntax',
        'Maps': 'Syntax', 'Slices': 'Syntax', 'Arrays': 'Syntax',
        'For Loops': 'Syntax', 'Switch': 'Syntax', 'Range': 'Syntax',
        'Basics': 'Syntax',
        'Goroutines': 'Concurrency', 'Channels': 'Concurrency',
        'WaitGroup': 'Concurrency', 'Select': 'Concurrency',
        'Mutex': 'Concurrency', 'Context': 'Concurrency',
        'Worker Pool': 'Concurrency',
        'Error Handling': 'Safety', 'Testing': 'Safety',
        'Unit Testing': 'Safety', 'Integration Testing': 'Safety',
        'Validation': 'Safety',
        'Interfaces': 'Design', 'Structs': 'Design', 'Embedding': 'Design',
        'Composition': 'Design', 'Patterns': 'Design', 'Design Patterns': 'Design',
        'Methods': 'Design', 'Polymorphism': 'Design',
        'Pointers': 'Performance', 'Memory': 'Performance',
        'Optimization': 'Performance', 'Profiling': 'Performance',
        'Benchmarking': 'Performance',
        // Module-level mappings
        '1': 'Syntax', '2': 'Performance', '3': 'Design', '4': 'Design',
        '5': 'Syntax', '6': 'Syntax', '7': 'Syntax', '8': 'Design',
        '9': 'Safety', '10': 'Design', '11': 'Design', '12': 'Concurrency',
        '13': 'Design', '14': 'Syntax', '15': 'Syntax',
        '16': 'Safety', '17': 'Safety',
        // Pattern types from challenges
        'Hash Map': 'Syntax', 'Two Pointer': 'Performance',
        'Sliding Window': 'Performance', 'Frequency Counter': 'Syntax',
        'Stack': 'Syntax', 'Prefix Sum': 'Performance',
        'Binary Search': 'Performance', 'Greedy': 'Performance',
        'Sorting': 'Performance',
    };

    function getStatForConcept(concept) {
        return CONCEPT_STAT_MAP[concept] || 'Syntax';
    }

    function renderStatPentagon(container) {
        const stats = getStats();
        const size = 200;
        const cx = size / 2, cy = size / 2;
        const r = 75;
        const levels = 5;

        let svg = `<svg viewBox="0 0 ${size} ${size}" class="stat-pentagon-svg">`;

        // Draw grid pentagons
        for (let l = 1; l <= levels; l++) {
            const lr = r * (l / levels);
            let points = '';
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
                points += `${cx + lr * Math.cos(angle)},${cy + lr * Math.sin(angle)} `;
            }
            svg += `<polygon points="${points}" class="stat-grid-polygon" />`;
        }

        // Draw axis lines
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
            svg += `<line x1="${cx}" y1="${cy}" x2="${cx + r * Math.cos(angle)}" y2="${cy + r * Math.sin(angle)}" class="stat-grid-line" />`;
        }

        // Draw stat polygon
        const maxLevel = 50;
        let statPoints = '';
        STAT_NAMES.forEach((name, i) => {
            const level = Math.min(stats[name].level, maxLevel);
            const pct = level / maxLevel;
            const sr = r * Math.max(pct, 0.05);
            const angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
            statPoints += `${cx + sr * Math.cos(angle)},${cy + sr * Math.sin(angle)} `;
        });
        svg += `<polygon points="${statPoints}" class="stat-fill-polygon" />`;

        // Draw stat points and labels
        STAT_NAMES.forEach((name, i) => {
            const angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
            const level = Math.min(stats[name].level, maxLevel);
            const pct = level / maxLevel;
            const sr = r * Math.max(pct, 0.05);

            // Point dot
            svg += `<circle cx="${cx + sr * Math.cos(angle)}" cy="${cy + sr * Math.sin(angle)}" r="3" class="stat-point" />`;

            // Label
            const labelR = r + 22;
            const lx = cx + labelR * Math.cos(angle);
            const ly = cy + labelR * Math.sin(angle);
            svg += `<text x="${lx}" y="${ly}" class="stat-label-text" text-anchor="middle" dominant-baseline="middle">${name}</text>`;
            svg += `<text x="${lx}" y="${ly + 12}" class="stat-level-text" text-anchor="middle">Lv.${stats[name].level}</text>`;
        });

        svg += '</svg>';
        container.innerHTML = svg;
    }

    // ============================================
    // 4. ACHIEVEMENTS / BADGES
    // ============================================
    const ACHIEVEMENTS = [
        { id: 'first_blood', name: 'First Blood', desc: 'Complete your first exercise', icon: 'sword', check: (log) => log.totalCompleted >= 1 },
        { id: 'combo_3', name: 'Getting Warmed Up', desc: 'Reach a 3x combo', icon: 'fire', check: (log, combo) => combo.best >= 3 },
        { id: 'combo_5', name: 'ALL-OUT ATTACK!', desc: 'Reach a 5x combo', icon: 'explosion', check: (log, combo) => combo.best >= 5 },
        { id: 'combo_10', name: 'Unstoppable', desc: 'Reach a 10x combo', icon: 'star', check: (log, combo) => combo.best >= 10 },
        { id: 'exercises_10', name: 'Getting Started', desc: 'Complete 10 exercises', icon: 'check', check: (log) => log.totalCompleted >= 10 },
        { id: 'exercises_50', name: 'Dedicated', desc: 'Complete 50 exercises', icon: 'medal', check: (log) => log.totalCompleted >= 50 },
        { id: 'exercises_100', name: 'Centurion', desc: 'Complete 100 exercises', icon: 'trophy', check: (log) => log.totalCompleted >= 100 },
        { id: 'speed_demon', name: 'Speed Demon', desc: 'Complete an exercise in under 30 seconds', icon: 'lightning', check: (log) => log.fastestTime && log.fastestTime < 30 },
        { id: 'bucks_1000', name: 'Gopher Hundredaire', desc: 'Earn 1,000 Gopher Bucks', icon: 'coin', check: () => getBucks() >= 1000 },
        { id: 'bucks_10000', name: 'Gopher Thousandaire', desc: 'Earn 10,000 Gopher Bucks', icon: 'money', check: () => getBucks() >= 10000 },
        { id: 'streak_7', name: 'Weekly Warrior', desc: 'Study 7 days in a row', icon: 'calendar', check: (log) => log.bestStreak >= 7 },
        { id: 'streak_30', name: 'Monthly Master', desc: 'Study 30 days in a row', icon: 'crown', check: (log) => log.bestStreak >= 30 },
        { id: 'no_hints', name: 'No Hints Needed', desc: 'Complete 5 exercises without hints in a row', icon: 'brain', check: (log, combo) => combo.best >= 5 },
        { id: 'all_stats_5', name: 'Well Rounded', desc: 'Get all stats to level 5', icon: 'pentagon', check: () => { const s = getStats(); return STAT_NAMES.every(n => s[n].level >= 5); } },
        { id: 'all_stats_10', name: 'Renaissance Gopher', desc: 'Get all stats to level 10', icon: 'gem', check: () => { const s = getStats(); return STAT_NAMES.every(n => s[n].level >= 10); } },
        { id: 'first_fusion', name: 'Fusion Novice', desc: 'Unlock your first concept fusion', icon: 'merge', check: () => getUnlockedFusions().length >= 1 },
        { id: 'all_fusions', name: 'Fusion Master', desc: 'Unlock all concept fusions', icon: 'infinity', check: () => getUnlockedFusions().length >= FUSION_RECIPES.length },
        { id: 'confidant_max', name: 'True Bond', desc: 'Max out a Confidant to Rank 10', icon: 'heart', check: () => { const c = getConfidants(); return Object.values(c).some(v => v.rank >= 10); } },
        { id: 'calling_card_win', name: 'Promise Keeper', desc: 'Complete a Calling Card challenge', icon: 'card', check: () => { const cc = load(KEYS.callingCards, []); return cc.some(c => c.completed); } },
        { id: 'morning_person', name: 'Morning Person', desc: 'Study before 8am', icon: 'sunrise', check: (log) => log.earlyBird },
        { id: 'night_owl', name: 'Night Owl', desc: 'Study after 10pm', icon: 'moon', check: (log) => log.nightOwl },
        { id: 'perfect_exam', name: 'Perfect Score', desc: 'Get an S rank on an exam', icon: 'star', check: () => { const e = getExamState(); return Object.values(e).some(v => v.grade === 'S' || v.bestGrade === 'S'); } },
    ];

    function getUnlockedAchievements() { return load(KEYS.achievements, []); }

    function checkAchievements() {
        const unlocked = getUnlockedAchievements();
        const log = getExerciseLog();
        const combo = getCombo();
        let newlyUnlocked = [];

        ACHIEVEMENTS.forEach(ach => {
            if (unlocked.includes(ach.id)) return;
            try {
                if (ach.check(log, combo)) {
                    unlocked.push(ach.id);
                    newlyUnlocked.push(ach);
                }
            } catch {}
        });

        if (newlyUnlocked.length > 0) {
            save(KEYS.achievements, unlocked);
            newlyUnlocked.forEach(ach => {
                playAchievement();
                showAchievementUnlock(ach);
            });
        }
    }

    function showAchievementUnlock(ach) {
        const modal = document.createElement('div');
        modal.className = 'achievement-unlock-overlay';
        modal.innerHTML = `
            <div class="achievement-unlock-card">
                <div class="achievement-unlock-header">ACHIEVEMENT UNLOCKED</div>
                <div class="achievement-unlock-icon">${getAchievementIcon(ach.icon)}</div>
                <div class="achievement-unlock-name">${ach.name}</div>
                <div class="achievement-unlock-desc">${ach.desc}</div>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => {
            modal.classList.add('achievement-fade');
            setTimeout(() => modal.remove(), 600);
        }, 2500);
    }

    function getAchievementIcon(iconName) {
        const icons = {
            sword: '\u2694\uFE0F', fire: '\uD83D\uDD25', explosion: '\uD83D\uDCA5',
            star: '\u2B50', check: '\u2705', medal: '\uD83C\uDFC5',
            trophy: '\uD83C\uDFC6', lightning: '\u26A1', coin: '\uD83E\uDE99',
            money: '\uD83D\uDCB0', calendar: '\uD83D\uDCC5', crown: '\uD83D\uDC51',
            brain: '\uD83E\uDDE0', pentagon: '\u2B1F', gem: '\uD83D\uDC8E',
            merge: '\uD83D\uDD00', infinity: '\u267E\uFE0F', heart: '\u2764\uFE0F',
            card: '\uD83C\uDCCF', sunrise: '\uD83C\uDF05', moon: '\uD83C\uDF19',
        };
        return icons[iconName] || '\uD83C\uDFC6';
    }

    // ============================================
    // 5. PERSONAL LEADERBOARD
    // ============================================
    function getLeaderboard() {
        return load(KEYS.leaderboard, {
            fastestExercise: null,
            longestCombo: 0,
            mostInSession: 0,
            currentSessionCount: 0,
            sessionDate: null,
            totalBucksEarned: 0,
        });
    }

    function updateLeaderboard(field, value) {
        const lb = getLeaderboard();
        if (field === 'fastestExercise') {
            if (!lb.fastestExercise || value < lb.fastestExercise) {
                lb.fastestExercise = value;
                showFloatingText(`New PB! ${value.toFixed(1)}s`, 'record');
            }
        } else if (field === 'longestCombo') {
            if (value > lb.longestCombo) lb.longestCombo = value;
        } else if (field === 'sessionExercise') {
            const today = new Date().toDateString();
            if (lb.sessionDate !== today) {
                lb.sessionDate = today;
                lb.currentSessionCount = 0;
            }
            lb.currentSessionCount++;
            if (lb.currentSessionCount > lb.mostInSession) {
                lb.mostInSession = lb.currentSessionCount;
            }
        } else if (field === 'bucksEarned') {
            lb.totalBucksEarned += value;
        }
        save(KEYS.leaderboard, lb);
    }

    // ============================================
    // 6. CALENDAR + ENERGY
    // ============================================
    const MAX_ENERGY = 5;

    function getCalendar() { return load(KEYS.calendar, {}); }

    function getEnergy() {
        const data = load(KEYS.energy, { amount: MAX_ENERGY, date: new Date().toDateString() });
        // Reset energy at midnight
        const today = new Date().toDateString();
        if (data.date !== today) {
            data.amount = MAX_ENERGY;
            data.date = today;
            save(KEYS.energy, data);
        }
        return data;
    }

    function useEnergy() {
        const data = getEnergy();
        if (data.amount <= 0) return false;
        data.amount--;
        save(KEYS.energy, data);
        updateEnergyDisplay();
        return true;
    }

    function restoreEnergy(amount) {
        const data = getEnergy();
        data.amount = Math.min(MAX_ENERGY, data.amount + amount);
        save(KEYS.energy, data);
        updateEnergyDisplay();
    }

    function recordStudyDay() {
        const cal = getCalendar();
        const today = new Date().toISOString().split('T')[0];
        if (!cal[today]) {
            cal[today] = { exercises: 0, firstVisit: Date.now() };
        }
        cal[today].exercises++;
        cal[today].lastVisit = Date.now();
        save(KEYS.calendar, cal);
    }

    function getStudyStreak() {
        const cal = getCalendar();
        const dates = Object.keys(cal).sort().reverse();
        if (dates.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            if (cal[key]) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }
        return streak;
    }

    function updateEnergyDisplay() {
        const data = getEnergy();
        const el = document.getElementById('energy-display');
        if (!el) return;
        let hearts = '';
        for (let i = 0; i < MAX_ENERGY; i++) {
            hearts += i < data.amount ? '\u2764\uFE0F' : '\uD83D\uDDA4';
        }
        el.innerHTML = hearts;
    }

    // ============================================
    // 7. CONFIDANT / SOCIAL LINKS
    // ============================================
    const CONFIDANTS = {
        'Syntax': { name: 'Gopher Greg', title: 'The Fundamentalist', maxRank: 10 },
        'Concurrency': { name: 'Channel Chan', title: 'The Parallel Thinker', maxRank: 10 },
        'Safety': { name: 'Error Elena', title: 'The Guardian', maxRank: 10 },
        'Design': { name: 'Interface Iko', title: 'The Architect', maxRank: 10 },
        'Performance': { name: 'Pointer Pete', title: 'The Optimizer', maxRank: 10 },
    };

    const RANK_NAMES = ['', 'Stranger', 'Acquaintance', 'Familiar', 'Associate', 'Friend', 'Close Friend', 'Trusted Ally', 'Best Friend', 'Soul Partner', 'MAX'];
    const RANK_XP = [0, 0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000];

    function getConfidants() {
        return load(KEYS.confidants, {
            Syntax: { rank: 1, xp: 0, totalXP: 0 },
            Concurrency: { rank: 1, xp: 0, totalXP: 0 },
            Safety: { rank: 1, xp: 0, totalXP: 0 },
            Design: { rank: 1, xp: 0, totalXP: 0 },
            Performance: { rank: 1, xp: 0, totalXP: 0 },
        });
    }

    function addConfidantXP(statName, amount) {
        const confidants = getConfidants();
        if (!confidants[statName]) return;
        const conf = confidants[statName];
        if (conf.rank >= 10) return; // maxed out

        conf.xp += amount;
        conf.totalXP += amount;
        let rankedUp = false;

        while (conf.rank < 10 && conf.xp >= RANK_XP[conf.rank + 1]) {
            conf.xp -= RANK_XP[conf.rank + 1];
            conf.rank++;
            rankedUp = true;
        }

        save(KEYS.confidants, confidants);

        if (rankedUp) {
            const info = CONFIDANTS[statName];
            showConfidantRankUp(statName, conf.rank, info);
        }
    }

    function showConfidantRankUp(statName, rank, info) {
        playLevelUp();
        const overlay = document.createElement('div');
        overlay.className = 'confidant-rankup-overlay';
        overlay.innerHTML = `
            <div class="confidant-rankup-card">
                <div class="confidant-rankup-header">CONFIDANT RANK UP</div>
                <div class="confidant-rankup-name">${info.name}</div>
                <div class="confidant-rankup-title">${info.title}</div>
                <div class="confidant-rankup-rank">Rank ${rank}: ${RANK_NAMES[rank]}</div>
                ${rank >= 10 ? '<div class="confidant-rankup-max">MAX RANK ACHIEVED!</div>' : ''}
            </div>
        `;
        document.body.appendChild(overlay);
        setTimeout(() => {
            overlay.classList.add('confidant-fade');
            setTimeout(() => overlay.remove(), 600);
        }, 3000);
    }

    // ============================================
    // 8. CONCEPT FUSION
    // ============================================
    const FUSION_RECIPES = [
        { a: 'Goroutines', b: 'Interfaces', result: 'Concurrent Worker Pool', desc: 'Interface-based workers running in goroutines', reqStats: { Concurrency: 5, Design: 5 } },
        { a: 'Channels', b: 'Error Handling', result: 'Error Channel Pattern', desc: 'Propagate errors through channels safely', reqStats: { Concurrency: 4, Safety: 4 } },
        { a: 'Maps', b: 'Mutex', result: 'Thread-Safe Cache', desc: 'Concurrent-safe map with mutex protection', reqStats: { Syntax: 4, Concurrency: 4 } },
        { a: 'Interfaces', b: 'Structs', result: 'Composition Pattern', desc: 'Embed interfaces in structs for flexibility', reqStats: { Design: 6 } },
        { a: 'Context', b: 'HTTP', result: 'Request Lifecycle', desc: 'Manage request timeouts and cancellation', reqStats: { Concurrency: 5, Design: 4 } },
        { a: 'Testing', b: 'Interfaces', result: 'Mock Pattern', desc: 'Use interfaces to create test mocks', reqStats: { Safety: 5, Design: 5 } },
        { a: 'Goroutines', b: 'Channels', result: 'Fan-Out/Fan-In', desc: 'Distribute work and collect results', reqStats: { Concurrency: 7 } },
        { a: 'Error Handling', b: 'Testing', result: 'Table-Driven Tests', desc: 'Test error cases systematically', reqStats: { Safety: 6 } },
        { a: 'Pointers', b: 'Structs', result: 'Builder Pattern', desc: 'Chain methods with pointer receivers', reqStats: { Performance: 4, Design: 5 } },
        { a: 'Slices', b: 'Goroutines', result: 'Parallel Map/Filter', desc: 'Process slices concurrently', reqStats: { Syntax: 5, Concurrency: 5 } },
    ];

    function getUnlockedFusions() { return load(KEYS.fusions, []); }

    function checkFusions() {
        const stats = getStats();
        const unlocked = getUnlockedFusions();
        let newFusions = [];

        FUSION_RECIPES.forEach(recipe => {
            if (unlocked.includes(recipe.result)) return;

            const meets = Object.entries(recipe.reqStats).every(([stat, req]) =>
                stats[stat] && stats[stat].level >= req
            );

            if (meets) {
                unlocked.push(recipe.result);
                newFusions.push(recipe);
            }
        });

        if (newFusions.length > 0) {
            save(KEYS.fusions, unlocked);
            newFusions.forEach(recipe => showFusionUnlock(recipe));
        }
    }

    function showFusionUnlock(recipe) {
        playFusion();
        const overlay = document.createElement('div');
        overlay.className = 'fusion-overlay';
        overlay.innerHTML = `
            <div class="fusion-card">
                <div class="fusion-header">CONCEPT FUSION</div>
                <div class="fusion-ingredients">
                    <span class="fusion-ingredient">${recipe.a}</span>
                    <span class="fusion-plus">+</span>
                    <span class="fusion-ingredient">${recipe.b}</span>
                </div>
                <div class="fusion-arrow">\u2193</div>
                <div class="fusion-result">${recipe.result}</div>
                <div class="fusion-desc">${recipe.desc}</div>
            </div>
        `;
        document.body.appendChild(overlay);
        setTimeout(() => {
            overlay.classList.add('fusion-fade');
            setTimeout(() => overlay.remove(), 600);
        }, 3500);
    }

    // ============================================
    // 9. CALLING CARDS
    // ============================================
    function getCallingCards() { return load(KEYS.callingCards, []); }

    function createCallingCard(moduleNum, moduleName, deadlineDays) {
        const cards = getCallingCards();
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + deadlineDays);

        cards.push({
            id: Date.now(),
            module: moduleNum,
            moduleName,
            created: Date.now(),
            deadline: deadline.getTime(),
            completed: false,
            reward: deadlineDays <= 3 ? 1000 : deadlineDays <= 7 ? 500 : 250,
        });

        save(KEYS.callingCards, cards);
        showFloatingText('Calling Card sent!', 'calling-card');
        return cards[cards.length - 1];
    }

    function completeCallingCard(cardId) {
        const cards = getCallingCards();
        const card = cards.find(c => c.id === cardId);
        if (!card || card.completed) return;

        card.completed = true;
        card.completedAt = Date.now();
        const onTime = Date.now() <= card.deadline;

        if (onTime) {
            earnBucks(card.reward, 'Calling Card completed on time');
            showFloatingText(`Calling Card complete! +${card.reward}`, 'calling-card');
        } else {
            showFloatingText('Calling Card complete (late)', 'calling-card');
        }

        save(KEYS.callingCards, cards);
        checkAchievements();
    }

    function getActiveCallingCards() {
        return getCallingCards().filter(c => !c.completed && Date.now() <= c.deadline);
    }

    function getExpiredCallingCards() {
        return getCallingCards().filter(c => !c.completed && Date.now() > c.deadline);
    }

    // ============================================
    // 10. EXERCISE LOG & COMPLETION
    // ============================================
    function getExerciseLog() {
        return load(KEYS.exerciseLog, {
            totalCompleted: 0,
            fastestTime: null,
            bestStreak: 0,
            earlyBird: false,
            nightOwl: false,
            completedExercises: {},
            lastCompletionTime: null,
        });
    }

    function completeExercise(exerciseId, difficulty, concept, timeTaken, usedHint) {
        const log = getExerciseLog();
        const hour = new Date().getHours();

        // Update log
        log.totalCompleted++;
        if (timeTaken && (!log.fastestTime || timeTaken < log.fastestTime)) {
            log.fastestTime = timeTaken;
        }
        if (hour < 8) log.earlyBird = true;
        if (hour >= 22) log.nightOwl = true;
        log.completedExercises[exerciseId] = {
            completedAt: Date.now(),
            difficulty,
            timeTaken,
        };
        log.lastCompletionTime = Date.now();

        // Update streak
        const streak = getStudyStreak();
        if (streak > log.bestStreak) log.bestStreak = streak;

        save(KEYS.exerciseLog, log);

        // Record study day
        recordStudyDay();

        // Combo
        if (usedHint) {
            breakCombo();
        } else {
            incrementCombo();
        }

        // Bucks
        const bucks = BUCKS_REWARDS[difficulty] || 100;
        const earned = earnBucks(bucks, `Exercise ${exerciseId}`);
        updateLeaderboard('bucksEarned', earned);

        // Stats
        const stat = getStatForConcept(concept || '');
        addStatXP(stat, difficulty * 25);

        // Confidant
        addConfidantXP(stat, difficulty * 15);

        // Leaderboard
        if (timeTaken) updateLeaderboard('fastestExercise', timeTaken);
        updateLeaderboard('longestCombo', getCombo().best);
        updateLeaderboard('sessionExercise', 1);

        // Check for fusions
        checkFusions();

        // Check achievements
        checkAchievements();

        // First-time tutorial
        if (log.totalCompleted === 1) {
            setTimeout(showTutorialTooltip, 1500);
        }

        // Update displays
        updateAllDisplays();
    }

    // ============================================
    // 11. SHOP
    // ============================================
    const SHOP_ITEMS = [
        { id: 'theme_persona5', name: 'Persona 5 Theme', cost: 0, type: 'theme', desc: 'Free with gamification' },
        { id: 'energy_drink', name: 'Energy Drink', cost: 500, type: 'consumable', desc: 'Restore 1 energy point', action: () => restoreEnergy(1) },
        { id: 'energy_pack', name: 'Energy Pack', cost: 1200, type: 'consumable', desc: 'Restore all energy', action: () => restoreEnergy(MAX_ENERGY) },
        { id: 'streak_insurance', name: 'Streak Insurance', cost: 1500, type: 'consumable', desc: 'Save your streak if you miss a day' },
        { id: 'hint_discount', name: 'Hint Discount', cost: 2000, type: 'perk', desc: 'Hints no longer break your combo' },
        { id: 'stats_dashboard', name: 'Advanced Stats', cost: 3000, type: 'perk', desc: 'Unlock detailed stats dashboard' },
    ];

    function getShopUnlocks() { return load(KEYS.shopUnlocks, []); }

    function buyShopItem(itemId) {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item) return false;

        if (item.cost > 0 && !spendBucks(item.cost)) {
            showFloatingText('Not enough Gopher Bucks!', 'error');
            return false;
        }

        if (item.type === 'consumable' && item.action) {
            item.action();
        } else {
            const unlocks = getShopUnlocks();
            if (!unlocks.includes(itemId)) {
                unlocks.push(itemId);
                save(KEYS.shopUnlocks, unlocks);
            }
        }

        showFloatingText(`Purchased: ${item.name}`, 'purchase');
        return true;
    }

    // ============================================
    // 12. STUDY MUSIC RADIO
    // ============================================
    const MUSIC_STATIONS = [
        { id: 'persona_lofi', name: 'Persona Lofi', desc: 'Persona 5 study beats', url: 'https://www.youtube.com/watch?v=QOfygTDyITY', cost: 0 },
        { id: 'persona_ost', name: 'Persona OST', desc: 'Persona 5 original soundtrack', url: 'https://www.youtube.com/watch?v=brTT4cmTRTY', cost: 0 },
        { id: 'yakuza_battle', name: 'Yakuza Battle', desc: 'Yakuza 0 battle themes', url: 'https://www.youtube.com/watch?v=g3jCAyPai2Y', cost: 500 },
        { id: 'lofi_coding', name: 'Lofi Coding', desc: 'Lofi hip hop for coding', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', cost: 0 },
        { id: 'synthwave', name: 'Synthwave', desc: 'Retro synthwave focus', url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY', cost: 1000 },
    ];

    function getMusicStation() { return load(KEYS.musicStation, null); }
    function setMusicStation(stationId) { save(KEYS.musicStation, stationId); }

    // ============================================
    // 13. EXAM SYSTEM
    // ============================================
    const EXAM_DATA = [
        {
            id: 'midterm1',
            name: 'Midterm Exam 1',
            subtitle: 'Fundamentals',
            afterModules: '1-5',
            timeLimit: 600,
            relevantStats: ['Syntax', 'Performance', 'Design'],
            questions: [
                {
                    q: 'What is the zero value of a string in Go?',
                    choices: ['""  (empty string)', 'nil', '"null"', '0'],
                    correct: 0,
                },
                {
                    q: 'What does the := operator do?',
                    choices: ['Short variable declaration with type inference', 'Assigns a constant', 'Compares two values', 'Declares a global variable'],
                    correct: 0,
                },
                {
                    q: 'What will fmt.Println(len("Hello")) output?',
                    choices: ['5', '6', '4', 'Error'],
                    correct: 0,
                },
                {
                    q: 'Which of these is NOT a valid way to declare a slice?',
                    choices: ['var s [5]string{}', 's := []int{1, 2, 3}', 's := make([]int, 5)', 'var s []int'],
                    correct: 0,
                },
                {
                    q: 'What does a pointer receiver on a method allow?',
                    choices: ['Modifying the original struct', 'Returning multiple values', 'Making the method public', 'Creating goroutines'],
                    correct: 0,
                },
            ],
        },
        {
            id: 'midterm2',
            name: 'Midterm Exam 2',
            subtitle: 'CLI & Tools',
            afterModules: '6-8',
            timeLimit: 600,
            relevantStats: ['Syntax', 'Design'],
            questions: [
                {
                    q: 'What package does Cobra use for CLI flag parsing?',
                    choices: ['pflag', 'flag', 'os.Args', 'flagset'],
                    correct: 0,
                },
                {
                    q: 'How do you read an entire file into a byte slice in Go?',
                    choices: ['os.ReadFile("path")', 'io.ReadAll("path")', 'file.Read("path")', 'bufio.ReadFile("path")'],
                    correct: 0,
                },
                {
                    q: 'What does yaml.Unmarshal do?',
                    choices: ['Parses YAML bytes into a Go struct', 'Converts a struct to YAML', 'Validates YAML syntax', 'Creates a YAML file'],
                    correct: 0,
                },
                {
                    q: 'In Bubble Tea (bubbletea), what does the Update function return?',
                    choices: ['(Model, Cmd)', 'error', 'View', '(string, error)'],
                    correct: 0,
                },
                {
                    q: 'What is the correct way to handle os.Args in Go?',
                    choices: ['os.Args[0] is the program name, os.Args[1:] are arguments', 'os.Args starts at index 1', 'os.Args only contains flags', 'os.Args must be parsed with flag package'],
                    correct: 0,
                },
            ],
        },
        {
            id: 'final1',
            name: 'Final Exam 1',
            subtitle: 'Production Code',
            afterModules: '9-11',
            timeLimit: 600,
            relevantStats: ['Safety', 'Design'],
            questions: [
                {
                    q: 'What does fmt.Errorf with %w do?',
                    choices: ['Wraps an error for unwrapping with errors.Is/As', 'Formats a warning message', 'Creates a new error type', 'Writes error to stderr'],
                    correct: 0,
                },
                {
                    q: 'Which design pattern uses an interface to decouple creation from usage?',
                    choices: ['Factory pattern', 'Singleton pattern', 'Observer pattern', 'Builder pattern'],
                    correct: 0,
                },
                {
                    q: 'What is the correct way to set up an HTTP handler in Go?',
                    choices: ['http.HandleFunc("/path", handler)', 'http.Route("/path", handler)', 'http.Get("/path", handler)', 'http.Listen("/path", handler)'],
                    correct: 0,
                },
                {
                    q: 'What does errors.As() do?',
                    choices: ['Checks if an error can be converted to a specific type', 'Creates an error alias', 'Compares two error strings', 'Asserts an error is nil'],
                    correct: 0,
                },
                {
                    q: 'What does http.ListenAndServe(":8080", nil) use as the handler?',
                    choices: ['The DefaultServeMux', 'No handler (returns 404)', 'A random handler', 'The first registered handler only'],
                    correct: 0,
                },
            ],
        },
        {
            id: 'final2',
            name: 'Final Exam 2',
            subtitle: 'Concurrency',
            afterModules: '12',
            timeLimit: 600,
            relevantStats: ['Concurrency'],
            questions: [
                {
                    q: 'What happens if you send to an unbuffered channel with no receiver?',
                    choices: ['The goroutine blocks (deadlock if no other goroutines)', 'The value is dropped', 'It panics immediately', 'The value is queued'],
                    correct: 0,
                },
                {
                    q: 'What does sync.WaitGroup.Add(n) do?',
                    choices: ['Increments the counter by n', 'Creates n goroutines', 'Waits for n seconds', 'Adds n to a mutex lock'],
                    correct: 0,
                },
                {
                    q: 'What does the select statement do with multiple ready channels?',
                    choices: ['Picks one at random', 'Picks the first one declared', 'Executes all of them', 'Returns an error'],
                    correct: 0,
                },
                {
                    q: 'What is a buffered channel created with make(chan int, 5)?',
                    choices: ['A channel that can hold 5 values before blocking', 'A channel that runs 5 goroutines', 'A channel with 5 receivers', 'A channel that times out after 5 seconds'],
                    correct: 0,
                },
                {
                    q: 'What happens when you close a channel that still has values?',
                    choices: ['Receivers can still read remaining values', 'Remaining values are lost', 'It panics', 'The channel stays open until drained'],
                    correct: 0,
                },
            ],
        },
        {
            id: 'final3',
            name: 'Final Exam 3',
            subtitle: 'Real-World & Testing',
            afterModules: '13-17',
            timeLimit: 600,
            relevantStats: ['Design', 'Safety'],
            questions: [
                {
                    q: 'What is the standard Go project layout for a CLI application?',
                    choices: ['cmd/ for entrypoints, internal/ for private packages', 'src/ for all code, bin/ for output', 'app/ for code, lib/ for packages', 'main/ for entrypoints, pkg/ only'],
                    correct: 0,
                },
                {
                    q: 'What does t.Run() do in Go testing?',
                    choices: ['Creates a named subtest', 'Runs the test in parallel', 'Restarts the test', 'Runs the test with a timeout'],
                    correct: 0,
                },
                {
                    q: 'How do you run only tests matching a pattern?',
                    choices: ['go test -run "Pattern"', 'go test -filter "Pattern"', 'go test -match "Pattern"', 'go test -only "Pattern"'],
                    correct: 0,
                },
                {
                    q: 'What does os/exec.Command() return?',
                    choices: ['A *Cmd struct that can be run', 'The output of the command', 'An error', 'A process ID'],
                    correct: 0,
                },
                {
                    q: 'What is table-driven testing in Go?',
                    choices: ['Using a slice of test cases in a loop with t.Run()', 'Testing database tables', 'Using HTML tables for test output', 'A framework for integration tests'],
                    correct: 0,
                },
            ],
        },
    ];

    const EXAM_GRADES = { 5: 'S', 4: 'A', 3: 'B', 2: 'C', 1: 'F', 0: 'F' };
    const EXAM_REWARDS = {
        S: { bucks: 3000, xp: 500 },
        A: { bucks: 2000, xp: 300 },
        B: { bucks: 1000, xp: 100 },
        C: { bucks: 500, xp: 0 },
        F: { bucks: 0, xp: 0 },
    };

    function getExamState() {
        return load(KEYS.exams, {});
    }

    function saveExamState(state) {
        save(KEYS.exams, state);
    }

    function getExamGrade(score) {
        return EXAM_GRADES[score] || 'F';
    }

    function canTakeExam(examId) {
        const state = getExamState();
        const examRecord = state[examId];
        if (!examRecord) return true;
        if (examRecord.grade === 'F' && examRecord.cooldownUntil) {
            return Date.now() >= examRecord.cooldownUntil;
        }
        return true; // Can always retake
    }

    function getCooldownRemaining(examId) {
        const state = getExamState();
        const examRecord = state[examId];
        if (!examRecord || !examRecord.cooldownUntil) return 0;
        return Math.max(0, examRecord.cooldownUntil - Date.now());
    }

    function startExam(examId) {
        const exam = EXAM_DATA.find(e => e.id === examId);
        if (!exam) return;

        if (!canTakeExam(examId)) {
            const remaining = getCooldownRemaining(examId);
            const minutes = Math.ceil(remaining / 60000);
            showFloatingText(`Cooldown: ${minutes}m remaining`, 'error');
            return;
        }

        // Exam state
        const examState = {
            examId,
            currentQuestion: 0,
            answers: [],
            score: 0,
            startTime: Date.now(),
            timeLimit: exam.timeLimit * 1000,
        };

        showExamModal(exam, examState);
    }

    function showExamModal(exam, examState) {
        const existing = document.getElementById('exam-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'exam-modal';
        modal.className = 'exam-modal';

        function renderQuestion() {
            const q = exam.questions[examState.currentQuestion];
            const elapsed = Date.now() - examState.startTime;
            const remaining = Math.max(0, examState.timeLimit - elapsed);

            if (remaining <= 0) {
                finishExam(exam, examState);
                return;
            }

            modal.innerHTML = `
                <div class="exam-backdrop"></div>
                <div class="exam-content">
                    <div class="exam-header">
                        <div class="exam-title">${exam.name}</div>
                        <div class="exam-subtitle">${exam.subtitle}</div>
                        <div class="exam-timer" id="exam-timer">${formatTime(remaining)}</div>
                    </div>
                    <div class="exam-progress">
                        <div class="exam-question-counter">Question ${examState.currentQuestion + 1} / ${exam.questions.length}</div>
                        <div class="exam-progress-bar">
                            <div class="exam-progress-fill" style="width:${((examState.currentQuestion) / exam.questions.length) * 100}%"></div>
                        </div>
                    </div>
                    <div class="exam-question">
                        <div class="exam-question-text">${q.q}</div>
                        <div class="exam-choices">
                            ${q.choices.map((choice, i) => `
                                <button class="exam-choice-btn" data-index="${i}">${choice}</button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="exam-score-display">Score: ${examState.score} / ${examState.currentQuestion}</div>
                </div>
            `;

            // Timer update
            const timerEl = modal.querySelector('#exam-timer');
            const timerInterval = setInterval(() => {
                const elapsed = Date.now() - examState.startTime;
                const rem = Math.max(0, examState.timeLimit - elapsed);
                if (timerEl) timerEl.textContent = formatTime(rem);
                if (rem <= 0) {
                    clearInterval(timerInterval);
                    finishExam(exam, examState);
                }
            }, 1000);

            // Choice handlers
            modal.querySelectorAll('.exam-choice-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    clearInterval(timerInterval);
                    const chosen = parseInt(this.dataset.index);
                    const correct = q.correct;
                    const isCorrect = chosen === correct;

                    if (isCorrect) {
                        examState.score++;
                        this.classList.add('correct');
                        playTone(880, 0.15, 'sine', 0.1);
                    } else {
                        this.classList.add('wrong');
                        modal.querySelectorAll('.exam-choice-btn')[correct].classList.add('correct');
                        playTone(220, 0.3, 'sawtooth', 0.08);
                    }

                    examState.answers.push({ chosen, correct: isCorrect });

                    // Disable all buttons
                    modal.querySelectorAll('.exam-choice-btn').forEach(b => b.disabled = true);

                    // Next question or finish
                    setTimeout(() => {
                        examState.currentQuestion++;
                        if (examState.currentQuestion >= exam.questions.length) {
                            finishExam(exam, examState);
                        } else {
                            renderQuestion();
                        }
                    }, 1200);
                });
            });
        }

        document.body.appendChild(modal);
        renderQuestion();
    }

    function formatTime(ms) {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }

    function finishExam(exam, examState) {
        const grade = getExamGrade(examState.score);
        const rewards = EXAM_REWARDS[grade];
        const timeTaken = Date.now() - examState.startTime;

        // Save exam result
        const state = getExamState();
        const isRetake = !!state[exam.id];
        state[exam.id] = {
            grade,
            score: examState.score,
            total: exam.questions.length,
            completedAt: Date.now(),
            timeTaken,
            bestGrade: state[exam.id]?.bestGrade
                ? (EXAM_GRADES_ORDER.indexOf(grade) < EXAM_GRADES_ORDER.indexOf(state[exam.id].bestGrade) ? grade : state[exam.id].bestGrade)
                : grade,
        };

        if (grade === 'F') {
            state[exam.id].cooldownUntil = Date.now() + (60 * 60 * 1000); // 1 hour
        }

        saveExamState(state);

        // Award rewards
        if (rewards.bucks > 0) {
            earnBucks(rewards.bucks, `${exam.name} - Grade ${grade}`);
        }

        if (rewards.xp > 0) {
            exam.relevantStats.forEach(stat => {
                addStatXP(stat, rewards.xp);
                addConfidantXP(stat, Math.floor(rewards.xp / 2));
            });
        }

        // Perfect score achievement
        if (grade === 'S') {
            const unlocked = getUnlockedAchievements();
            if (!unlocked.includes('perfect_exam')) {
                unlocked.push('perfect_exam');
                save(KEYS.achievements, unlocked);
                showAchievementUnlock({ name: 'Perfect Score', desc: 'Get an S rank on an exam', icon: 'star' });
            }
        }

        // Show results
        showExamResults(exam, examState, grade, rewards);
    }

    const EXAM_GRADES_ORDER = ['S', 'A', 'B', 'C', 'F'];

    function showExamResults(exam, examState, grade, rewards) {
        const modal = document.getElementById('exam-modal');
        if (!modal) return;

        const gradeColors = { S: '#ffcc00', A: '#00ff9d', B: '#00ccff', C: '#ff9900', F: '#ff0044' };

        playTone(grade === 'S' || grade === 'A' ? 880 : 440, 0.3, 'sine', 0.1);
        if (grade === 'S') playAchievement();

        modal.innerHTML = `
            <div class="exam-backdrop"></div>
            <div class="exam-content exam-results">
                <div class="exam-results-header">EXAM RESULTS</div>
                <div class="exam-results-name">${exam.name}</div>
                <div class="exam-grade" style="color: ${gradeColors[grade]}">${grade}</div>
                <div class="exam-results-score">${examState.score} / ${exam.questions.length} correct</div>
                <div class="exam-results-rewards">
                    ${rewards.bucks > 0 ? `<div class="exam-reward-item">+${rewards.bucks} Gopher Bucks</div>` : ''}
                    ${rewards.xp > 0 ? `<div class="exam-reward-item">+${rewards.xp} XP to ${exam.relevantStats.join(', ')}</div>` : ''}
                    ${grade === 'S' ? '<div class="exam-reward-item exam-reward-special">Perfect Score Achievement!</div>' : ''}
                    ${grade === 'F' ? '<div class="exam-reward-item exam-reward-fail">Retake available in 1 hour</div>' : ''}
                </div>
                <button class="exam-close-btn" onclick="document.getElementById('exam-modal').remove()">Close</button>
            </div>
        `;
    }

    function playExamSound() {
        [440, 554, 659].forEach((f, i) => {
            setTimeout(() => playTone(f, 0.2, 'square', 0.08), i * 100);
        });
    }

    // ============================================
    // 14. FIRST-VISIT TUTORIAL TOOLTIP
    // ============================================
    function showTutorialTooltip() {
        const seen = load(KEYS.tutorialSeen, false);
        if (seen) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'tutorial-tooltip';
        tooltip.innerHTML = `
            <div class="tutorial-tooltip-content">
                <div class="tutorial-tooltip-header">Welcome to the Phantom Thieves!</div>
                <div class="tutorial-tooltip-body">
                    You earned <strong>Gopher Bucks</strong>! Your stats went up!
                    Open the <strong>HQ panel</strong> (star button, top right) to see your progress.
                </div>
                <button class="tutorial-tooltip-btn" onclick="this.closest('.tutorial-tooltip').remove()">Got it!</button>
            </div>
        `;
        document.body.appendChild(tooltip);
        save(KEYS.tutorialSeen, true);

        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.classList.add('tutorial-fade');
                setTimeout(() => tooltip.remove(), 600);
            }
        }, 10000);
    }

    // ============================================
    // FLOATING TEXT ANIMATIONS
    // ============================================
    function showFloatingText(text, type) {
        const el = document.createElement('div');
        el.className = `floating-text floating-${type}`;
        el.textContent = text;
        document.body.appendChild(el);

        // Position near the gamification bar
        const bar = document.getElementById('gamification-bar');
        if (bar) {
            const rect = bar.getBoundingClientRect();
            el.style.top = (rect.bottom + 10) + 'px';
            el.style.right = '20px';
        } else {
            el.style.top = '80px';
            el.style.right = '20px';
        }

        setTimeout(() => {
            el.classList.add('float-up');
            setTimeout(() => el.remove(), 800);
        }, 50);
    }

    // ============================================
    // GAMIFICATION BAR (top of every page)
    // ============================================
    function createGamificationBar() {
        const bar = document.createElement('div');
        bar.id = 'gamification-bar';
        bar.className = 'gamification-bar';

        const combo = getCombo();
        const energy = getEnergy();
        const streak = getStudyStreak();

        bar.innerHTML = `
            <div class="gbar-left">
                <div class="gbar-bucks" title="Gopher Bucks">
                    <span class="gbar-bucks-icon">\uD83E\uDE99</span>
                    <span class="gopher-bucks-value">${getBucks().toLocaleString()}</span>
                </div>
                <div class="gbar-streak" title="Study streak">
                    <span class="gbar-streak-icon">\uD83D\uDD25</span>
                    <span class="gbar-streak-value">${streak}</span>
                </div>
                <div class="gbar-energy" title="Energy">
                    <span id="energy-display"></span>
                </div>
            </div>
            <div class="gbar-right">
                <div id="combo-counter" class="combo-counter" style="display:${combo.current > 0 ? 'flex' : 'none'}">
                    <span class="combo-count">${combo.current}</span>
                    <span class="combo-label">COMBO</span>
                </div>
                <button class="gbar-btn" onclick="window.GamificationUI.openPanel()" title="Gamification Panel">\u2605</button>
            </div>
        `;

        document.body.insertBefore(bar, document.body.firstChild);
        updateEnergyDisplay();
    }

    // ============================================
    // EXERCISE COMPLETION BUTTONS
    // ============================================
    function addCompletionButtons() {
        // Add "Complete" buttons to all exercises
        const exercises = document.querySelectorAll('.exercise');
        exercises.forEach((ex, idx) => {
            if (ex.querySelector('.exercise-complete-btn')) return;

            const challengeId = ex.dataset.challengeId || `exercise-${idx}`;

            // Detect difficulty from stars
            const starEl = ex.querySelector('.variant-difficulty');
            let difficulty = 2;
            if (starEl) {
                const stars = (starEl.textContent.match(/\u2B50/g) || []).length;
                difficulty = stars || 2;
            }

            // Detect concept from heading or nearest concept filter
            let concept = '';
            const heading = ex.querySelector('h4');
            if (heading) {
                const conceptLink = heading.querySelector('.concept-link');
                if (conceptLink) {
                    const match = conceptLink.textContent.match(/\((.+?)\s/);
                    if (match) concept = match[1];
                }
            }

            // Check if already completed
            const log = getExerciseLog();
            const isCompleted = log.completedExercises && log.completedExercises[challengeId];

            const wrapper = document.createElement('div');
            wrapper.className = 'exercise-complete-wrapper';
            wrapper.innerHTML = `
                <button class="exercise-complete-btn ${isCompleted ? 'completed' : ''}"
                        data-exercise-id="${challengeId}"
                        data-difficulty="${difficulty}"
                        data-concept="${concept}"
                        ${isCompleted ? 'disabled' : ''}>
                    ${isCompleted ? '\u2705 Completed' : '\u2714 Mark Complete'}
                </button>
                ${isCompleted ? '' : `
                    <label class="hint-checkbox-label">
                        <input type="checkbox" class="hint-used-checkbox"> Used hints
                    </label>
                `}
            `;

            ex.appendChild(wrapper);

            if (!isCompleted) {
                const btn = wrapper.querySelector('.exercise-complete-btn');
                btn._startTime = Date.now();

                btn.addEventListener('click', function() {
                    const timeTaken = (Date.now() - this._startTime) / 1000;
                    const hintCheckbox = wrapper.querySelector('.hint-used-checkbox');
                    const usedHint = hintCheckbox ? hintCheckbox.checked : false;

                    completeExercise(
                        this.dataset.exerciseId,
                        parseInt(this.dataset.difficulty),
                        this.dataset.concept,
                        timeTaken,
                        usedHint
                    );

                    this.textContent = '\u2705 Completed';
                    this.classList.add('completed');
                    this.disabled = true;
                    const label = wrapper.querySelector('.hint-checkbox-label');
                    if (label) label.remove();
                });
            }
        });
    }

    // ============================================
    // GAMIFICATION PANEL (full modal)
    // ============================================
    function openPanel() {
        const existing = document.getElementById('gamification-panel');
        if (existing) { existing.remove(); return; }

        const panel = document.createElement('div');
        panel.id = 'gamification-panel';
        panel.className = 'gamification-panel';

        const stats = getStats();
        const log = getExerciseLog();
        const combo = getCombo();
        const lb = getLeaderboard();
        const confidants = getConfidants();
        const unlockedAch = getUnlockedAchievements();
        const unlockedFusions = getUnlockedFusions();
        const activeCards = getActiveCallingCards();
        const streak = getStudyStreak();
        const energy = getEnergy();

        panel.innerHTML = `
            <div class="gpanel-backdrop" onclick="window.GamificationUI.closePanel()"></div>
            <div class="gpanel-content">
                <div class="gpanel-header">
                    <h2>Phantom Thieves HQ</h2>
                    <button class="gpanel-close" onclick="window.GamificationUI.closePanel()">\u2715</button>
                </div>

                <div class="gpanel-tabs">
                    <button class="gpanel-tab active" data-tab="stats">Stats</button>
                    <button class="gpanel-tab" data-tab="confidants">Confidants</button>
                    <button class="gpanel-tab" data-tab="achievements">Badges</button>
                    <button class="gpanel-tab" data-tab="fusions">Fusion</button>
                    <button class="gpanel-tab" data-tab="exams">Exams</button>
                    <button class="gpanel-tab" data-tab="records">Records</button>
                    <button class="gpanel-tab" data-tab="calendar">Calendar</button>
                    <button class="gpanel-tab" data-tab="cards">Cards</button>
                    <button class="gpanel-tab" data-tab="shop">Shop</button>
                </div>

                <div class="gpanel-body">
                    <!-- STATS TAB -->
                    <div class="gpanel-tab-content active" id="gtab-stats">
                        <div class="gpanel-stats-row">
                            <div class="stat-pentagon-container" id="stat-pentagon"></div>
                            <div class="stat-details">
                                ${STAT_NAMES.map(name => {
                                    const s = stats[name];
                                    const pct = Math.round((s.xp / xpForLevel(s.level)) * 100);
                                    return `
                                        <div class="stat-detail-row">
                                            <span class="stat-detail-name">${name}</span>
                                            <span class="stat-detail-level">Lv.${s.level}</span>
                                            <div class="stat-detail-bar"><div class="stat-detail-fill" style="width:${pct}%"></div></div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                        <div class="gpanel-quick-stats">
                            <div class="gqs-item"><span class="gqs-value">${log.totalCompleted}</span><span class="gqs-label">Exercises</span></div>
                            <div class="gqs-item"><span class="gqs-value">${streak}</span><span class="gqs-label">Day Streak</span></div>
                            <div class="gqs-item"><span class="gqs-value">${combo.best}</span><span class="gqs-label">Best Combo</span></div>
                            <div class="gqs-item"><span class="gqs-value">${getBucks().toLocaleString()}</span><span class="gqs-label">Bucks</span></div>
                        </div>
                    </div>

                    <!-- CONFIDANTS TAB -->
                    <div class="gpanel-tab-content" id="gtab-confidants">
                        <div class="confidant-grid">
                            ${Object.entries(CONFIDANTS).map(([statName, info]) => {
                                const c = confidants[statName];
                                const nextXP = c.rank < 10 ? RANK_XP[c.rank + 1] : 0;
                                const pct = c.rank >= 10 ? 100 : (nextXP > 0 ? Math.round((c.xp / nextXP) * 100) : 0);
                                return `
                                    <div class="confidant-card ${c.rank >= 10 ? 'maxed' : ''}">
                                        <div class="confidant-name">${info.name}</div>
                                        <div class="confidant-title">${info.title}</div>
                                        <div class="confidant-rank">Rank ${c.rank}: ${RANK_NAMES[c.rank]}</div>
                                        <div class="confidant-bar"><div class="confidant-bar-fill" style="width:${pct}%"></div></div>
                                        ${c.rank < 10 ? `<div class="confidant-xp">${c.xp} / ${nextXP} XP</div>` : '<div class="confidant-xp">MAX</div>'}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- ACHIEVEMENTS TAB -->
                    <div class="gpanel-tab-content" id="gtab-achievements">
                        <div class="achievement-grid">
                            ${ACHIEVEMENTS.map(ach => {
                                const unlocked = unlockedAch.includes(ach.id);
                                return `
                                    <div class="achievement-item ${unlocked ? 'unlocked' : 'locked'}">
                                        <div class="achievement-icon">${unlocked ? getAchievementIcon(ach.icon) : '\uD83D\uDD12'}</div>
                                        <div class="achievement-info">
                                            <div class="achievement-name">${unlocked ? ach.name : '???'}</div>
                                            <div class="achievement-desc">${ach.desc}</div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="achievement-count">${unlockedAch.length} / ${ACHIEVEMENTS.length} Unlocked</div>
                    </div>

                    <!-- FUSIONS TAB -->
                    <div class="gpanel-tab-content" id="gtab-fusions">
                        <div class="fusion-grid">
                            ${FUSION_RECIPES.map(recipe => {
                                const unlocked = unlockedFusions.includes(recipe.result);
                                return `
                                    <div class="fusion-item ${unlocked ? 'unlocked' : 'locked'}">
                                        <div class="fusion-item-ingredients">${unlocked ? recipe.a : '???'} + ${unlocked ? recipe.b : '???'}</div>
                                        <div class="fusion-item-result">${unlocked ? recipe.result : '???'}</div>
                                        ${unlocked ? `<div class="fusion-item-desc">${recipe.desc}</div>` : `<div class="fusion-item-req">${Object.entries(recipe.reqStats).map(([s,l]) => `${s} Lv.${l}`).join(', ')}</div>`}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="achievement-count">${unlockedFusions.length} / ${FUSION_RECIPES.length} Discovered</div>
                    </div>

                    <!-- EXAMS TAB -->
                    <div class="gpanel-tab-content" id="gtab-exams">
                        <div class="exam-grades-grid">
                            ${EXAM_DATA.map(exam => {
                                const examState = getExamState();
                                const record = examState[exam.id];
                                const gradeColors = { S: '#ffcc00', A: '#00ff9d', B: '#00ccff', C: '#ff9900', F: '#ff0044' };
                                return `
                                    <div class="exam-grade-card ${record ? 'taken' : ''}">
                                        <div class="exam-grade-name">${exam.name}</div>
                                        <div class="exam-grade-sub">${exam.subtitle} (Modules ${exam.afterModules})</div>
                                        ${record ? `
                                            <div class="exam-grade-letter" style="color: ${gradeColors[record.bestGrade || record.grade]}">${record.bestGrade || record.grade}</div>
                                            <div class="exam-grade-score">${record.score}/${record.total}</div>
                                        ` : `
                                            <div class="exam-grade-letter exam-not-taken">-</div>
                                            <div class="exam-grade-score">Not taken</div>
                                        `}
                                        <button class="exam-take-btn" onclick="window.GamificationUI.startExam('${exam.id}')">
                                            ${record ? 'Retake' : 'Take Exam'}
                                        </button>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- RECORDS TAB -->
                    <div class="gpanel-tab-content" id="gtab-records">
                        <div class="records-grid">
                            <div class="record-item">
                                <div class="record-label">Fastest Exercise</div>
                                <div class="record-value">${lb.fastestExercise ? lb.fastestExercise.toFixed(1) + 's' : '-'}</div>
                            </div>
                            <div class="record-item">
                                <div class="record-label">Longest Combo</div>
                                <div class="record-value">${lb.longestCombo || '-'}</div>
                            </div>
                            <div class="record-item">
                                <div class="record-label">Most in One Session</div>
                                <div class="record-value">${lb.mostInSession || '-'}</div>
                            </div>
                            <div class="record-item">
                                <div class="record-label">Total Bucks Earned</div>
                                <div class="record-value">${(lb.totalBucksEarned || 0).toLocaleString()}</div>
                            </div>
                            <div class="record-item">
                                <div class="record-label">Total Exercises</div>
                                <div class="record-value">${log.totalCompleted}</div>
                            </div>
                            <div class="record-item">
                                <div class="record-label">Best Streak</div>
                                <div class="record-value">${log.bestStreak} days</div>
                            </div>
                        </div>
                    </div>

                    <!-- CALENDAR TAB -->
                    <div class="gpanel-tab-content" id="gtab-calendar">
                        <div class="calendar-header-row">
                            <div class="calendar-streak">\uD83D\uDD25 ${streak} day streak</div>
                            <div class="calendar-energy">Energy: <span id="energy-display-panel"></span></div>
                        </div>
                        <div class="calendar-grid" id="calendar-grid"></div>
                    </div>

                    <!-- CALLING CARDS TAB -->
                    <div class="gpanel-tab-content" id="gtab-cards">
                        <div class="calling-cards-section">
                            <button class="calling-card-create-btn" onclick="window.GamificationUI.createCallingCardUI()">Send Calling Card</button>
                            <div class="calling-cards-list" id="calling-cards-list"></div>
                        </div>
                    </div>

                    <!-- SHOP TAB -->
                    <div class="gpanel-tab-content" id="gtab-shop">
                        <div class="shop-balance">Balance: <span class="gopher-bucks-value">${getBucks().toLocaleString()}</span> \uD83E\uDE99</div>
                        <div class="shop-grid">
                            ${SHOP_ITEMS.map(item => {
                                const owned = getShopUnlocks().includes(item.id);
                                return `
                                    <div class="shop-item ${owned ? 'owned' : ''}">
                                        <div class="shop-item-name">${item.name}</div>
                                        <div class="shop-item-desc">${item.desc}</div>
                                        <div class="shop-item-cost">${item.cost > 0 ? item.cost + ' \uD83E\uDE99' : 'FREE'}</div>
                                        <button class="shop-buy-btn" ${owned && item.type !== 'consumable' ? 'disabled' : ''} onclick="window.GamificationUI.buyItem('${item.id}')">
                                            ${owned && item.type !== 'consumable' ? 'Owned' : 'Buy'}
                                        </button>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Render pentagon
        const pentagonContainer = document.getElementById('stat-pentagon');
        if (pentagonContainer) renderStatPentagon(pentagonContainer);

        // Render calendar
        renderCalendar();

        // Render calling cards
        renderCallingCards();

        // Tab switching
        panel.querySelectorAll('.gpanel-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                panel.querySelectorAll('.gpanel-tab').forEach(t => t.classList.remove('active'));
                panel.querySelectorAll('.gpanel-tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                const target = document.getElementById('gtab-' + tab.dataset.tab);
                if (target) target.classList.add('active');
            });
        });

        // Update energy in panel
        const energyPanel = document.getElementById('energy-display-panel');
        if (energyPanel) {
            const e = getEnergy();
            let hearts = '';
            for (let i = 0; i < MAX_ENERGY; i++) hearts += i < e.amount ? '\u2764\uFE0F' : '\uD83D\uDDA4';
            energyPanel.innerHTML = hearts;
        }
    }

    function closePanel() {
        const panel = document.getElementById('gamification-panel');
        if (panel) panel.remove();
    }

    function renderCalendar() {
        const grid = document.getElementById('calendar-grid');
        if (!grid) return;

        const cal = getCalendar();
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        let html = `<div class="calendar-month-title">${monthNames[month]} ${year}</div>`;
        html += '<div class="calendar-days-header">';
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(d => {
            html += `<div class="calendar-day-header">${d}</div>`;
        });
        html += '</div><div class="calendar-days">';

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const entry = cal[dateStr];
            const isToday = d === today.getDate();
            let cls = 'calendar-day';
            if (isToday) cls += ' today';
            if (entry) cls += ' studied';

            html += `<div class="${cls}" title="${entry ? entry.exercises + ' exercises' : 'No activity'}">
                <span class="calendar-day-num">${d}</span>
                ${entry ? `<span class="calendar-day-count">${entry.exercises}</span>` : ''}
            </div>`;
        }

        html += '</div>';
        grid.innerHTML = html;
    }

    function renderCallingCards() {
        const list = document.getElementById('calling-cards-list');
        if (!list) return;

        const cards = getCallingCards();
        if (cards.length === 0) {
            list.innerHTML = '<p class="no-cards">No calling cards yet. Send one to challenge yourself!</p>';
            return;
        }

        list.innerHTML = cards.map(card => {
            const deadline = new Date(card.deadline);
            const now = Date.now();
            const expired = now > card.deadline && !card.completed;
            const daysLeft = Math.max(0, Math.ceil((card.deadline - now) / (1000 * 60 * 60 * 24)));

            let statusClass = card.completed ? 'completed' : expired ? 'expired' : 'active';

            return `
                <div class="calling-card-item ${statusClass}">
                    <div class="calling-card-target">Module ${card.module}: ${card.moduleName}</div>
                    <div class="calling-card-deadline">
                        ${card.completed ? '\u2705 Completed' : expired ? '\u274C Expired' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
                    </div>
                    <div class="calling-card-reward">${card.reward} \uD83E\uDE99</div>
                    ${!card.completed && !expired ? `<button class="calling-card-complete-btn" onclick="window.GamificationUI.completeCard(${card.id})">Complete</button>` : ''}
                </div>
            `;
        }).join('');
    }

    function createCallingCardUI() {
        const moduleNum = document.body.dataset.module;
        const moduleName = document.title.replace(/Module \d+:\s*/, '').replace(/\s*\|.*/, '') || 'Unknown';

        if (!moduleNum) {
            // On dashboard, let them pick
            const num = prompt('Which module number? (1-17)');
            if (!num || isNaN(num)) return;
            const days = prompt('Deadline in days? (3, 7, or 14)', '7');
            if (!days || isNaN(days)) return;
            createCallingCard(num, `Module ${num}`, parseInt(days));
        } else {
            const days = prompt('Deadline in days? (3, 7, or 14)', '7');
            if (!days || isNaN(days)) return;
            createCallingCard(moduleNum, moduleName, parseInt(days));
        }

        renderCallingCards();
    }

    // ============================================
    // UPDATE ALL DISPLAYS
    // ============================================
    function updateAllDisplays() {
        updateBucksDisplay();
        updateComboDisplay();
        updateEnergyDisplay();
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        createGamificationBar();
        updateAllDisplays();

        // Add completion buttons after exercises render
        // Exercises may load asynchronously via course.js, so we observe
        const observer = new MutationObserver(() => {
            addCompletionButtons();
        });

        const containers = ['warmups-container', 'challenges-container'];
        containers.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el, { childList: true, subtree: true });
        });

        // Also try immediately in case exercises are already rendered
        setTimeout(addCompletionButtons, 500);
        setTimeout(addCompletionButtons, 2000);

        // Check for expired calling cards
        const expired = getExpiredCallingCards();
        if (expired.length > 0) {
            showFloatingText(`${expired.length} calling card(s) expired!`, 'error');
        }
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ============================================
    // PUBLIC API
    // ============================================
    window.GamificationUI = {
        openPanel,
        closePanel,
        buyItem: buyShopItem,
        completeCard: completeCallingCard,
        createCallingCardUI,
        completeExercise,
        getBucks,
        getStats,
        getCombo,
        startExam,
        getExamState,
    };
})();
