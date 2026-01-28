/**
 * Persona 5 Theme
 * The original JRPG-styled theme for Go Grind
 */
(function() {
    'use strict';

    var theme = {
        id: 'persona5',
        name: 'Persona 5',
        layoutClass: 'theme-persona5',

        // Terminology mappings
        terms: {
            // Player
            player: 'Phantom Thief',
            playerName: 'Joker',
            level: 'Level',
            levelAbbr: 'LV',
            xp: 'XP',
            xpFull: 'Experience Points',

            // Core concepts
            skill: 'Skill',
            skills: 'Skills',
            exercise: 'Shadow',
            exercises: 'Shadows',
            training: 'Training Ground',

            // Combat
            battle: 'Battle',
            fight: 'Fight',
            defeat: 'Defeat',
            victory: 'Victory',
            complete: 'Defeated',

            // Difficulty
            difficulty: 'Difficulty',
            complexity: 'Difficulty',

            // Hints
            hint: 'Hint',
            hints: 'Hints',
            revealHint: 'Reveal Hint',

            // Timer
            timer: 'Thinking Time',
            planningPhase: 'Thinking Time',

            // Grades
            grade: 'Grade',
            gradeS: 'S',
            gradeA: 'A',
            gradeB: 'B',
            gradeC: 'C',
            gradeF: 'F',

            // Palace/Territory
            palace: 'Palace',
            palaces: 'Palaces',
            infiltration: 'Infiltration',
            progress: 'Progress',
            boss: 'Boss',

            // Persona/General
            persona: 'Persona',
            personas: 'Personas',
            compendium: 'Compendium',
            arcana: 'Arcana',
            fusion: 'Fusion',

            // Confidant/Advisor
            confidant: 'Confidant',
            confidants: 'Confidants',
            rank: 'Rank',
            tip: 'Tip',
            tips: 'Tips',

            // Stats
            stats: 'Social Stats',
            knowledge: 'Knowledge',
            proficiency: 'Proficiency',
            guts: 'Guts',
            charm: 'Charm',
            kindness: 'Kindness',

            // Daily/Mementos
            daily: 'Mementos',
            dailyChallenge: 'Mementos Request',
            request: 'Request',
            requests: 'Requests',

            // Jobs
            job: 'Part-Time Job',
            jobs: 'Part-Time Jobs',
            shift: 'Shift',

            // Calendar
            calendar: 'Calendar',
            streak: 'Streak',

            // Exams
            exam: 'Exam',
            exams: 'Exams',

            // Misc
            velvetRoom: 'Velvet Room',
            settings: 'Settings',
            projects: 'Side Projects',
            mastery: 'Mastery',

            // Navigation labels
            navCombat: 'COMBAT',
            navSkills: 'SKILLS',
            navRequests: 'REQUESTS',
            navPartTime: 'PART-TIME',
            navStatus: 'STATUS',
            navKnowledge: 'KNOWLEDGE',
            navConfidants: 'CONFIDANTS',
            navVelvetRoom: 'VELVET ROOM',
            navSystem: 'SYSTEM',

            // Library terms
            library: 'Library',
            librarySubtitle: 'Phantom Knowledge Vault',
            document: 'Document',
            documents: 'Documents'
        },

        // Grade labels
        grades: {
            S: 'S',
            A: 'A',
            B: 'B',
            C: 'C',
            F: 'F'
        },

        // Icons
        icons: {
            skill: '',
            exercise: '',
            xp: '',
            palace: '',
            persona: '',
            confidant: '',
            hint: '',
            timer: '',
            grade: '',
            streak: '',
            calendar: ''
        },

        // Stats display
        stats: {
            knowledge: 'Knowledge',
            proficiency: 'Proficiency',
            guts: 'Guts',
            charm: 'Charm',
            kindness: 'Kindness'
        },

        // Stat ranks
        statRanks: ['Rough', 'Vague', 'Decent', 'Learned', 'Scholarly', 'Encyclopedic', 'Transcendent'],

        // Palace theming
        palaces: {
            kamoshida: {
                name: "Kamoshida's Castle",
                theme: 'Go Basics',
                description: 'The castle of distorted desires. Master the basics of Go to infiltrate.'
            },
            madarame: {
                name: "Madarame's Museum",
                theme: 'Collections',
                description: 'A museum of stolen works. Navigate collections to expose the fraud.'
            },
            kaneshiro: {
                name: "Kaneshiro's Bank",
                theme: 'Functions & Control',
                description: 'A bank built on exploitation. Control the flow to crack the vault.'
            },
            futaba: {
                name: "Futaba's Pyramid",
                theme: 'Algorithms',
                description: 'A tomb of isolation. Solve algorithmic puzzles to reach the treasure.'
            },
            okumura: {
                name: "Okumura's Spaceport",
                theme: 'Advanced Patterns',
                description: 'A corporate space station. Master patterns to escape the corporation.'
            },
            sae: {
                name: "Sae's Casino",
                theme: 'Data Structures',
                description: 'A rigged casino of justice. Structure your data to beat the house.'
            },
            shido: {
                name: "Shido's Cruiser",
                theme: 'Type System',
                description: 'A cruise of corruption. Navigate the type system to sink the ship.'
            },
            mementos_depths: {
                name: "Mementos Depths",
                theme: 'Polymorphism',
                description: 'The depths of the collective unconscious. Master polymorphism to reach the core.'
            }
        },

        // Confidant theming
        confidants: {
            morgana: {
                name: 'Morgana',
                title: 'The Magician',
                arcana: 'Magician',
                description: 'Your feline guide to Go best practices and idioms.'
            },
            futaba: {
                name: 'Futaba',
                title: 'The Priestess',
                arcana: 'Hermit',
                description: 'A genius hacker who teaches advanced algorithms and optimization.'
            },
            makoto: {
                name: 'Makoto',
                title: 'The Advisor',
                arcana: 'Priestess',
                description: 'Student council president with deep knowledge of type systems.'
            }
        },

        // Persona info for skills
        personas: {
            'variables':       { name: 'Arsene',        arcana: 'Fool',      title: 'The Rebellious Soul' },
            'for-loops':       { name: 'Pyro Jack',     arcana: 'Magician',  title: 'The Flame Dancer' },
            'conditionals':    { name: 'Pixie',         arcana: 'Lovers',    title: 'The Fairy Guide' },
            'slices':          { name: 'Jack Frost',    arcana: 'Magician',  title: 'The Ice Sprite' },
            'maps':            { name: 'Sandman',       arcana: 'Magician',  title: 'The Dream Weaver' },
            'functions':       { name: 'Hua Po',        arcana: 'Hanged Man', title: 'The Fire Spirit' },
            'strings':         { name: 'Silky',         arcana: 'Priestess', title: 'The Textile Ghost' },
            'two-pointers':    { name: 'Shiisaa',       arcana: 'Chariot',   title: 'The Guardian Lion' },
            'sliding-window':  { name: 'Makami',        arcana: 'Temperance', title: 'The Divine Wolf' },
            'map-tracking':    { name: 'Koppa Tengu',   arcana: 'Temperance', title: 'The Crow Demon' },
            'recursion':       { name: 'Mokoi',         arcana: 'Death',     title: 'The Night Spirit' },
            'binary-search':   { name: 'Kodama',        arcana: 'Star',      title: 'The Tree Spirit' },
            'stack':           { name: 'Nigi Mitama',   arcana: 'Temperance', title: 'The Gentle Soul' },
            'sorting':         { name: 'Anubis',        arcana: 'Judgement', title: 'The Judge of Dead' },
            'linked-list':     { name: 'Seth',          arcana: 'Tower',     title: 'The Desert Storm' },
            'bit-manipulation':{ name: 'Mot',           arcana: 'Death',     title: 'The Death God' },
            'switch':          { name: 'Inugami',       arcana: 'Hanged Man', title: 'The Dog Spirit' },
            'string-building': { name: 'Kelpie',        arcana: 'Strength',  title: 'The Water Horse' },
            'pointers':        { name: 'Orthrus',       arcana: 'Hanged Man', title: 'The Two-Headed Dog' },
            'structs':         { name: 'Eligor',        arcana: 'Emperor',   title: 'The Great Duke' },
            'methods':         { name: 'Berith',        arcana: 'Hierophant', title: 'The Bloody Duke' },
            'interfaces':      { name: 'Forneus',       arcana: 'Hierophant', title: 'The Sea Marquis' },
            'embedding':       { name: 'Hecatoncheires', arcana: 'Hanged Man', title: 'The Hundred-Handed' }
        }
    };

    // Register theme
    if (window.ThemeRegistry) {
        window.ThemeRegistry.register(theme);
    } else {
        // Queue for registration when ThemeRegistry loads
        window._pendingThemes = window._pendingThemes || [];
        window._pendingThemes.push(theme);
    }

    window.ThemePersona5 = theme;

})();
