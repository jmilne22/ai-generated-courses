/**
 * Go Grind - Game State Manager
 * Handles player state, skills, mastery, XP, grades, personas, palaces.
 * All game localStorage goes through window.GameState.
 */
(function() {
    'use strict';

    var STORAGE_KEY = 'go-game-state';
    var VERSION = 1;

    // Concept -> Skill mapping
    var SKILL_DEFS = {
        'variables':       { label: 'Variables & Types', icon: 'x' },
        'for-loops':       { label: 'For Loops', icon: 'o' },
        'conditionals':    { label: 'Conditionals', icon: '?' },
        'slices':          { label: 'Slices', icon: '[' },
        'maps':            { label: 'Maps', icon: '{' },
        'functions':       { label: 'Functions', icon: 'f' },
        'strings':         { label: 'Strings', icon: '"' },
        'recursion':       { label: 'Recursion', icon: 'R' },
        'switch':          { label: 'Switch', icon: '~' },
        'two-pointers':    { label: 'Two Pointers', icon: '<>' },
        'sliding-window':  { label: 'Sliding Window', icon: '[]' },
        'binary-search':   { label: 'Binary Search', icon: '/' },
        'stack':           { label: 'Stack Pattern', icon: '|' },
        'map-tracking':    { label: 'Map Tracking', icon: '#' },
        'sorting':         { label: 'Sorting', icon: '^' },
        'linked-list':     { label: 'Linked List', icon: '->' },
        'bit-manipulation':{ label: 'Bit Manipulation', icon: '&' },
        'string-building': { label: 'String Building', icon: '+' }
    };

    // Concept name (from JSON) -> skill key mapping
    var CONCEPT_TO_SKILL = {
        'Variables': 'variables',
        'Variables & Types': 'variables',
        'For Loops': 'for-loops',
        'Conditionals': 'conditionals',
        'If/Else': 'conditionals',
        'Slices': 'slices',
        'Slices & Range': 'slices',
        'Building Slices': 'slices',
        'Maps': 'maps',
        'Map Tracking': 'map-tracking',
        'Comma-Ok Pattern': 'maps',
        'Functions': 'functions',
        'Basic Functions': 'functions',
        'Strings': 'strings',
        'String Building': 'string-building',
        'String Manipulation': 'strings',
        'String Processing': 'strings',
        'Recursion': 'recursion',
        'Switch': 'switch',
        'Two Pointers': 'two-pointers',
        'Sliding Window': 'sliding-window',
        'Binary Search': 'binary-search',
        'Stack Pattern': 'stack',
        'Stack': 'stack',
        'Sorting': 'sorting',
        'Linked List': 'linked-list',
        'Bit Manipulation': 'bit-manipulation',
        'FizzBuzz': 'for-loops',
        'Array Sum': 'slices',
        'Reverse String': 'strings',
        'Two Sum': 'map-tracking',
        'Valid Brackets': 'stack',
        'Palindrome Check': 'two-pointers',
        'Slice Operations': 'slices',
        'Map Counting': 'maps'
    };

    // Palace definitions (concept-based)
    var PALACES = {
        kamoshida: {
            name: "Kamoshida's Castle",
            concepts: ['variables', 'for-loops', 'conditionals'],
            theme: 'Go Basics',
            boss: 'CLI Calculator'
        },
        madarame: {
            name: "Madarame's Museum",
            concepts: ['slices', 'maps', 'strings'],
            theme: 'Collections',
            boss: 'Word Frequency Counter'
        },
        kaneshiro: {
            name: "Kaneshiro's Bank",
            concepts: ['functions', 'recursion', 'switch'],
            theme: 'Functions & Control',
            boss: 'Bank Account System'
        },
        futaba: {
            name: "Futaba's Pyramid",
            concepts: ['recursion', 'binary-search', 'stack'],
            theme: 'Algorithms',
            boss: '3 Algorithm Challenges'
        },
        okumura: {
            name: "Okumura's Spaceport",
            concepts: ['two-pointers', 'sliding-window', 'sorting'],
            theme: 'Advanced Patterns',
            boss: 'Pattern Challenge Gauntlet'
        },
        sae: {
            name: "Sae's Casino",
            concepts: ['map-tracking', 'linked-list', 'bit-manipulation'],
            theme: 'Data Structures',
            boss: 'Data Structure Challenge'
        }
    };

    // Stat mapping (concept-based)
    var STAT_MAP = {
        knowledge:   ['recursion', 'binary-search', 'stack', 'sorting'],
        proficiency: ['slices', 'maps', 'strings', 'string-building'],
        guts:        ['two-pointers', 'sliding-window', 'linked-list', 'bit-manipulation'],
        charm:       [],  // earned from streaks and perfect grades
        kindness:    ['variables', 'for-loops', 'conditionals', 'functions', 'switch']
    };

    // Stat rank labels
    var STAT_RANKS = ['Rough', 'Vague', 'Decent', 'Learned', 'Scholarly', 'Encyclopedic', 'Transcendent'];

    // Persona definitions
    var PERSONA_DEFS = {
        'for-loops':       { name: 'Pyro Jack',    arcana: 'Magician' },
        'conditionals':    { name: 'Pixie',         arcana: 'Lovers' },
        'slices':          { name: 'Jack Frost',    arcana: 'Magician' },
        'maps':            { name: 'Sandman',       arcana: 'Magician' },
        'functions':       { name: 'Hua Po',        arcana: 'Hanged Man' },
        'variables':       { name: 'Arsene',        arcana: 'Fool' },
        'strings':         { name: 'Silky',         arcana: 'Priestess' },
        'two-pointers':    { name: 'Shiisaa',       arcana: 'Chariot' },
        'sliding-window':  { name: 'Makami',        arcana: 'Temperance' },
        'map-tracking':    { name: 'Koppa Tengu',   arcana: 'Temperance' },
        'recursion':       { name: 'Mokoi',         arcana: 'Death' },
        'binary-search':   { name: 'Kodama',        arcana: 'Star' },
        'stack':           { name: 'Nigi Mitama',   arcana: 'Temperance' },
        'sorting':         { name: 'Anubis',        arcana: 'Judgement' },
        'linked-list':     { name: 'Seth',          arcana: 'Tower' },
        'bit-manipulation':{ name: 'Mot',           arcana: 'Death' },
        'switch':          { name: 'Inugami',       arcana: 'Hanged Man' },
        'string-building': { name: 'Kelpie',        arcana: 'Strength' }
    };

    function createDefaultState() {
        var skills = {};
        Object.keys(SKILL_DEFS).forEach(function(key) {
            skills[key] = { level: 1, xp: 0 };
        });

        var palaces = {};
        Object.keys(PALACES).forEach(function(key) {
            palaces[key] = { unlocked: false, defeated: false, progress: 0 };
        });

        return {
            version: VERSION,
            player: {
                name: 'Joker',
                level: 1,
                totalXP: 0,
                stats: { knowledge: 0, proficiency: 0, guts: 0, charm: 0, kindness: 0 }
            },
            skills: skills,
            mastery: {},
            completedExercises: {},
            calendar: {},
            streaks: { current: 0, longest: 0, lastActiveDate: null },
            personas: {},
            palaces: palaces,
            exams: {},
            mementos: { lastDate: null, completed: [] },
            settings: { sound: true, timerSeconds: 45 }
        };
    }

    function load() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                var state = JSON.parse(raw);
                if (state.version === VERSION) {
                    // Ensure all skills exist (in case new ones were added)
                    if (!state.skills) state.skills = {};
                    Object.keys(SKILL_DEFS).forEach(function(key) {
                        if (!state.skills[key]) state.skills[key] = { level: 1, xp: 0 };
                    });
                    if (!state.mastery) state.mastery = {};
                    if (!state.settings) state.settings = { sound: true, timerSeconds: 45 };
                    return state;
                }
            }
        } catch (e) {
            console.warn('GameState: failed to load', e);
        }
        return createDefaultState();
    }

    function save(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('GameState: failed to save', e);
        }
    }

    var state = load();

    // XP & Grade calculations
    function calcGrade(hintsUsed, timeSeconds, difficulty, thinkingTimerSeconds) {
        thinkingTimerSeconds = thinkingTimerSeconds || 45;
        if (hintsUsed === 0 && timeSeconds <= thinkingTimerSeconds && difficulty >= 2) return 'S';
        if (hintsUsed <= 1 && timeSeconds <= thinkingTimerSeconds * 2) return 'A';
        if (hintsUsed <= 2 || timeSeconds <= 300) return 'B';
        return 'C';
    }

    function calcXP(difficulty, hintsUsed, timeSeconds, grade, thinkingTimerSeconds) {
        thinkingTimerSeconds = thinkingTimerSeconds || 45;
        var baseXP = (difficulty || 1) * 20;
        var hintPenalty = (hintsUsed || 0) * 10;
        var timeBonus = timeSeconds <= thinkingTimerSeconds ? 20 :
                        timeSeconds <= thinkingTimerSeconds * 2 ? 10 : 0;
        var gradeMultiplier = { S: 1.5, A: 1.2, B: 1.0, C: 0.8 }[grade] || 1.0;
        return Math.max(10, Math.floor((baseXP - hintPenalty + timeBonus) * gradeMultiplier));
    }

    // Skill XP curve: floor(50 * 1.15^(level-1))
    function skillXPForLevel(level) {
        return Math.floor(50 * Math.pow(1.15, level - 1));
    }

    // Player XP for level: floor(100 * 1.3^(level-1))
    function xpForLevel(level) {
        return Math.floor(100 * Math.pow(1.3, level - 1));
    }

    function getPlayerXPProgress() {
        var prevLevelXP = 0;
        for (var i = 1; i < state.player.level; i++) {
            prevLevelXP += xpForLevel(i);
        }
        var currentLevelXP = state.player.totalXP - prevLevelXP;
        var xpNeeded = xpForLevel(state.player.level);
        return { current: currentLevelXP, needed: xpNeeded, pct: Math.min(100, Math.round(currentLevelXP / xpNeeded * 100)) };
    }

    function getStatRank(value) {
        var idx = Math.min(Math.floor(value / 3), STAT_RANKS.length - 1);
        return STAT_RANKS[idx] || '';
    }

    function getStatForConcept(skillKey) {
        for (var stat in STAT_MAP) {
            if (STAT_MAP[stat].indexOf(skillKey) !== -1) return stat;
        }
        return 'knowledge';
    }

    function conceptToSkillKey(concept) {
        return CONCEPT_TO_SKILL[concept] || concept.toLowerCase().replace(/[\s\/&]+/g, '-');
    }

    function updateStreaks() {
        var today = new Date().toISOString().split('T')[0];
        if (state.streaks.lastActiveDate === today) return;

        var yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (state.streaks.lastActiveDate === yesterday) {
            state.streaks.current++;
        } else if (state.streaks.lastActiveDate !== today) {
            state.streaks.current = 1;
        }
        state.streaks.longest = Math.max(state.streaks.longest, state.streaks.current);
        state.streaks.lastActiveDate = today;
    }

    function updateCalendar(xpEarned) {
        var today = new Date().toISOString().split('T')[0];
        if (!state.calendar[today]) {
            state.calendar[today] = { exercisesCompleted: 0, xpEarned: 0 };
        }
        var day = state.calendar[today];
        day.exercisesCompleted++;
        day.xpEarned += xpEarned;
    }

    function updateSkill(skillKey, xpEarned) {
        if (!state.skills[skillKey]) {
            state.skills[skillKey] = { level: 1, xp: 0 };
        }
        var skill = state.skills[skillKey];
        skill.xp += xpEarned;

        var levelsGained = 0;
        while (skill.xp >= skillXPForLevel(skill.level) && skill.level < 99) {
            skill.xp -= skillXPForLevel(skill.level);
            skill.level++;
            levelsGained++;
        }

        return levelsGained;
    }

    function updateMastery(exerciseKey, xpEarned) {
        if (!state.mastery[exerciseKey]) {
            state.mastery[exerciseKey] = { xp: 0, completions: 0, bestGrade: null };
        }
        var m = state.mastery[exerciseKey];
        m.completions++;

        // Diminishing returns
        var multiplier = m.completions === 1 ? 1.0 : m.completions === 2 ? 0.5 : 0.25;
        m.xp += Math.floor(xpEarned * multiplier);

        return m;
    }

    function updatePersona(skillKey, xpEarned) {
        var def = PERSONA_DEFS[skillKey];
        if (!def) return;

        if (!state.personas[skillKey]) {
            state.personas[skillKey] = {
                name: def.name,
                arcana: def.arcana,
                concept: skillKey,
                level: 1,
                masteryXP: 0,
                discovered: true
            };
        }
        var persona = state.personas[skillKey];
        persona.masteryXP += xpEarned;
        var newLevel = Math.floor(persona.masteryXP / 100) + 1;
        if (newLevel > persona.level) {
            persona.level = newLevel;
        }
    }

    function updatePalaceProgress(skillKey) {
        Object.keys(PALACES).forEach(function(palaceKey) {
            var palace = PALACES[palaceKey];
            if (palace.concepts.indexOf(skillKey) === -1) return;

            // Count completed exercises for this palace's concepts
            var total = 0;
            var completed = 0;
            Object.keys(state.completedExercises).forEach(function(key) {
                var data = state.completedExercises[key];
                if (data.skillKey && palace.concepts.indexOf(data.skillKey) !== -1) {
                    total++;
                    if (data.grade && data.grade !== 'F') completed++;
                }
            });

            var estimatedTotal = palace.concepts.length * 30;
            var progress = Math.min(1, total / estimatedTotal);
            state.palaces[palaceKey].progress = Math.round(progress * 100) / 100;

            if (progress >= 0.8) {
                state.palaces[palaceKey].unlocked = true;
            }
        });
    }

    // Main exercise completion handler
    function completeExercise(detail) {
        var exerciseId = detail.exerciseId;
        var variantId = detail.variantId;
        var difficulty = detail.difficulty || 1;
        var hintsUsed = detail.hintsUsed || 0;
        var timeSpent = detail.timeSpent || 0;
        var concept = detail.concept;
        var exerciseKey = exerciseId + '_' + variantId;

        // Don't re-award XP for already completed
        if (state.completedExercises[exerciseKey]) return null;

        var grade = calcGrade(hintsUsed, timeSpent, difficulty, state.settings.timerSeconds);
        var xpEarned = calcXP(difficulty, hintsUsed, timeSpent, grade, state.settings.timerSeconds);
        var skillKey = concept ? conceptToSkillKey(concept) : null;

        // Store completion
        state.completedExercises[exerciseKey] = {
            grade: grade,
            xpEarned: xpEarned,
            hintsUsed: hintsUsed,
            timeSeconds: timeSpent,
            difficulty: difficulty,
            skillKey: skillKey,
            completedAt: new Date().toISOString()
        };

        // Add XP
        state.player.totalXP += xpEarned;

        // Check level up
        var leveledUp = false;
        var statIncreases = {};
        var xpToNext = xpForLevel(state.player.level);
        var prevLevelXP = 0;
        for (var i = 1; i < state.player.level; i++) prevLevelXP += xpForLevel(i);

        while (state.player.totalXP - prevLevelXP >= xpToNext) {
            prevLevelXP += xpToNext;
            state.player.level++;
            xpToNext = xpForLevel(state.player.level);
            leveledUp = true;

            // Increase stat for this concept's track
            if (skillKey) {
                var stat = getStatForConcept(skillKey);
                state.player.stats[stat] = (state.player.stats[stat] || 0) + 1;
                statIncreases[stat] = (statIncreases[stat] || 0) + 1;
            }
        }

        // Charm bonus for S grades
        if (grade === 'S') {
            state.player.stats.charm = (state.player.stats.charm || 0) + 1;
        }
        // Kindness bonus for no-hint completions
        if (hintsUsed === 0 && difficulty <= 2) {
            state.player.stats.kindness = (state.player.stats.kindness || 0) + 1;
        }

        // Update skill
        var skillLevelsGained = 0;
        if (skillKey) {
            skillLevelsGained = updateSkill(skillKey, xpEarned);
        }

        // Update mastery
        updateMastery(exerciseKey, xpEarned);

        // Update streaks & calendar
        updateStreaks();
        updateCalendar(xpEarned);

        // Update persona
        if (skillKey) {
            updatePersona(skillKey, xpEarned);
            updatePalaceProgress(skillKey);
        }

        // Save
        save(state);

        // Dispatch events
        var xpProgress = getPlayerXPProgress();

        window.dispatchEvent(new CustomEvent('gradeCalculated', {
            detail: {
                grade: grade,
                xpEarned: xpEarned,
                totalXP: state.player.totalXP,
                level: state.player.level,
                xpProgress: xpProgress,
                exerciseKey: exerciseKey
            }
        }));

        if (leveledUp) {
            window.dispatchEvent(new CustomEvent('levelUp', {
                detail: {
                    newLevel: state.player.level,
                    statIncreases: statIncreases,
                    totalXP: state.player.totalXP
                }
            }));
        }

        if (skillLevelsGained > 0 && skillKey) {
            window.dispatchEvent(new CustomEvent('skillLevelUp', {
                detail: {
                    skillKey: skillKey,
                    skillName: SKILL_DEFS[skillKey] ? SKILL_DEFS[skillKey].label : skillKey,
                    newLevel: state.skills[skillKey].level
                }
            }));
        }

        return { grade: grade, xpEarned: xpEarned, exerciseKey: exerciseKey };
    }

    // Listen for exerciseCompleted
    window.addEventListener('exerciseCompleted', function(e) {
        completeExercise(e.detail);
    });

    // Get mastery % for a skill
    function getSkillMasteryPct(skillKey, exerciseData) {
        if (!exerciseData) return 0;
        var totalVariants = 0;
        var masteredVariants = 0;

        var allExercises = (exerciseData.warmups || []).concat(exerciseData.challenges || []);
        allExercises.forEach(function(ex) {
            var exConcept = ex.concept ? conceptToSkillKey(ex.concept) : null;
            if (exConcept !== skillKey) return;
            (ex.variants || []).forEach(function(v) {
                totalVariants++;
                var key = ex.id + '_' + v.id;
                if (state.mastery[key] && state.mastery[key].completions > 0) {
                    masteredVariants++;
                }
            });
        });

        return totalVariants > 0 ? Math.round(masteredVariants / totalVariants * 100) : 0;
    }

    // Public API
    window.GameState = {
        getState: function() { return state; },
        getPlayer: function() { return state.player; },
        getSkills: function() { return state.skills; },
        getSkill: function(key) { return state.skills[key] || { level: 1, xp: 0 }; },
        getSkillDefs: function() { return SKILL_DEFS; },
        getMastery: function() { return state.mastery; },
        getCalendar: function() { return state.calendar; },
        getStreaks: function() { return state.streaks; },
        getPersonas: function() { return state.personas; },
        getPersonaDefs: function() { return PERSONA_DEFS; },
        getPalaces: function() { return state.palaces; },
        getPalaceDefs: function() { return PALACES; },
        getCompletedExercises: function() { return state.completedExercises; },
        getCompletedCount: function() { return Object.keys(state.completedExercises).length; },
        getSettings: function() { return state.settings; },
        getExams: function() { return state.exams; },
        isExerciseCompleted: function(exerciseId, variantId) {
            return !!state.completedExercises[exerciseId + '_' + variantId];
        },
        getPlayerXPProgress: getPlayerXPProgress,
        getStatRank: getStatRank,
        getStatMap: function() { return STAT_MAP; },
        getStatRanks: function() { return STAT_RANKS; },
        getSkillMasteryPct: getSkillMasteryPct,
        skillXPForLevel: skillXPForLevel,
        xpForLevel: xpForLevel,
        conceptToSkillKey: conceptToSkillKey,
        completeExercise: completeExercise,
        saveExamResult: function(examId, result) {
            state.exams[examId] = result;
            save(state);
        },
        updateSetting: function(key, value) {
            state.settings[key] = value;
            save(state);
        },
        save: function() { save(state); },
        resetState: function() {
            state = createDefaultState();
            save(state);
        },
        reload: function() {
            state = load();
        }
    };
})();
