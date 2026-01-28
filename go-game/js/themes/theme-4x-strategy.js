/**
 * Grand Strategy Theme
 * HOI4-inspired modern military/political strategy theme
 */
(function() {
    'use strict';

    var theme = {
        id: '4x-strategy',
        name: 'Grand Strategy',
        layoutClass: 'theme-4x',

        // Terminology mappings
        terms: {
            // Player/Command
            player: 'Command',
            playerName: 'Commander',
            level: 'Rank',
            levelAbbr: 'RNK',
            xp: 'Production',
            xpFull: 'Production Points',
            xpAbbr: 'PP',

            // Core concepts
            skill: 'Technology',
            skills: 'Technologies',
            exercise: 'Operation',
            exercises: 'Operations',
            training: 'Command Center',

            // Combat/War
            battle: 'Operation',
            fight: 'Execute',
            defeat: 'Complete',
            victory: 'Victory',
            complete: 'Mission Accomplished',
            war: 'War',
            wars: 'Wars',
            campaign: 'Campaign',
            front: 'Front Line',

            // Difficulty
            difficulty: 'Complexity',
            complexity: 'Complexity',

            // Hints/Intel
            hint: 'Intel Report',
            hints: 'Intel Reports',
            revealHint: 'Request Intel',

            // Timer
            timer: 'Planning Phase',
            planningPhase: 'Planning Phase',

            // Grades/Commendations
            grade: 'Commendation',
            gradeS: 'Distinguished Service',
            gradeA: 'Order of Merit',
            gradeB: 'Bronze Star',
            gradeC: 'Participation',
            gradeF: 'Court Martial',

            // Palace/Territory
            palace: 'Territory',
            palaces: 'Territories',
            infiltration: 'Conquest',
            progress: 'Control',
            boss: 'Annexation Battle',
            conquest: 'Conquest',
            annex: 'Annex',

            // Persona/General
            persona: 'General',
            personas: 'Generals',
            compendium: 'Hall of Generals',
            arcana: 'Military Branch',
            fusion: 'Combined Arms',

            // Confidant/Advisor
            confidant: 'Faction',
            confidants: 'Diplomatic Relations',
            rank: 'Relations',
            tip: 'Treaty',
            tips: 'Treaties',
            advisor: 'Ambassador',

            // Stats/National Power
            stats: 'National Power',
            knowledge: 'Research Output',
            proficiency: 'Industrial Capacity',
            guts: 'Military Strength',
            charm: 'Diplomatic Influence',
            kindness: 'National Unity',

            // Daily/War Council
            daily: 'War Council',
            dailyChallenge: 'Priority Directive',
            request: 'Directive',
            requests: 'Directives',
            skirmish: 'Border Skirmish',

            // Jobs/Programs
            job: 'Domestic Program',
            jobs: 'Domestic Programs',
            shift: 'Duty Rotation',

            // Calendar
            calendar: 'Campaign Timeline',
            streak: 'Supply Line',
            streakDays: 'Days Maintained',

            // Exams
            exam: 'Staff College Exam',
            exams: 'Staff College',
            decisiveBattle: 'Decisive Battle',

            // Misc
            velvetRoom: 'High Command',
            settings: 'Administration',
            projects: 'Strategic Initiatives',
            mastery: 'Campaign Excellence',
            embassy: 'Embassy',
            diplomacy: 'Diplomacy',

            // Navigation labels
            navCombat: 'WARFARE',
            navSkills: 'TECHNOLOGIES',
            navRequests: 'STRATEGIC',
            navPartTime: 'DOMESTIC',
            navStatus: 'ADMINISTRATION',
            navKnowledge: 'INTELLIGENCE',
            navConfidants: 'DIPLOMACY',
            navVelvetRoom: 'HIGH COMMAND',
            navSystem: 'SETTINGS',

            // Library/War College terms
            library: 'War College',
            librarySubtitle: 'Strategic Knowledge Database',
            fieldManual: 'Field Manual',
            fieldManuals: 'Field Manuals',
            doctrine: 'Doctrine',
            doctrines: 'Doctrines',
            clearanceLevel: 'Clearance Level',

            // Additional 4X terms
            territory: 'Territory',
            territories: 'Territories',
            conquestMap: 'Conquest Map',
            activeWars: 'Active Wars',
            warCouncil: 'War Council',
            frontLine: 'Front Line',
            casualties: 'Casualties',
            spoilsOfWar: 'Spoils of War',
            victoryImminent: 'Victory Imminent',
            conquered: 'Conquered',
            atWar: 'At War',
            neutral: 'Neutral',
            locked: 'Locked',

            // Diplomacy terms
            faction: 'Faction',
            factions: 'Allied Factions',
            treaty: 'Treaty',
            treaties: 'Treaties',
            influence: 'Influence',
            relations: 'Relations',
            allied: 'Allied',
            cordial: 'Cordial',
            noContact: 'No Contact',

            // General terms
            general: 'General',
            generals: 'Generals',
            recruit: 'Recruit',
            recruited: 'Recruited',
            promotion: 'Promotion',
            rank: 'Rank',
            campaigns: 'Campaigns',
            distinguished: 'Distinguished Service',
            combinedArms: 'Combined Arms'
        },

        // Grade labels (commendations)
        grades: {
            S: 'Distinguished Service Cross',
            A: 'Order of Merit',
            B: 'Bronze Star',
            C: 'Satisfactory',
            F: 'Failed Operation'
        },

        // Grade short labels
        gradeShort: {
            S: 'DSC',
            A: 'OM',
            B: 'BS',
            C: 'SAT',
            F: 'FAIL'
        },

        // Icons (military themed)
        icons: {
            skill: '🔬',
            exercise: '⚔️',
            xp: '🏭',
            palace: '🗺️',
            persona: '🎖️',
            confidant: '🤝',
            hint: '📋',
            timer: '⏱️',
            grade: '🎖️',
            streak: '📦',
            calendar: '📅',
            war: '⚔️',
            conquest: '🏴',
            territory: '🗺️',
            general: '👤',
            embassy: '🏛️',
            treaty: '📜',
            production: '🏭',
            research: '🔬',
            military: '⚔️',
            diplomacy: '🤝',
            unity: '🏠'
        },

        // Stats display (National Power)
        stats: {
            knowledge: 'Research Output',
            proficiency: 'Industrial Capacity',
            guts: 'Military Strength',
            charm: 'Diplomatic Influence',
            kindness: 'National Unity'
        },

        // Stat ranks (modern military rating)
        statRanks: ['Minimal', 'Basic', 'Operational', 'Advanced', 'Superior', 'Elite', 'World-Class'],

        // Military ranks for player and Generals
        ranks: [
            { id: 1,  minLevel: 1,  name: 'Second Lieutenant',   abbr: '2LT',    insignia: '⬧' },
            { id: 2,  minLevel: 5,  name: 'First Lieutenant',    abbr: '1LT',    insignia: '⬧⬧' },
            { id: 3,  minLevel: 10, name: 'Captain',             abbr: 'CPT',    insignia: '★' },
            { id: 4,  minLevel: 15, name: 'Major',               abbr: 'MAJ',    insignia: '★⬧' },
            { id: 5,  minLevel: 20, name: 'Lieutenant Colonel',  abbr: 'LTC',    insignia: '★★' },
            { id: 6,  minLevel: 25, name: 'Colonel',             abbr: 'COL',    insignia: '★★⬧' },
            { id: 7,  minLevel: 30, name: 'Brigadier General',   abbr: 'BG',     insignia: '★★★' },
            { id: 8,  minLevel: 40, name: 'Major General',       abbr: 'MG',     insignia: '★★★⬧' },
            { id: 9,  minLevel: 50, name: 'Lieutenant General',  abbr: 'LTG',    insignia: '★★★★' },
            { id: 10, minLevel: 99, name: 'General of the Army', abbr: 'GA',     insignia: '★★★★★' }
        ],

        // Territory theming (replaces palaces)
        palaces: {
            kamoshida: {
                name: 'The Frontier',
                theme: 'Basic Expansion',
                description: 'The untamed borderlands. Establish your first foothold with basic operations.',
                warName: 'The Frontier Campaign'
            },
            madarame: {
                name: 'Industrial Heartland',
                theme: 'Production Focus',
                description: 'Rich industrial zones ripe for conquest. Master collections to secure resources.',
                warName: 'The Industrial Wars'
            },
            kaneshiro: {
                name: 'Economic Zones',
                theme: 'Function Mastery',
                description: 'Strategic economic territories. Control functions to dominate trade routes.',
                warName: 'The Economic Campaign'
            },
            futaba: {
                name: 'Research Complex',
                theme: 'Algorithm Territory',
                description: 'Advanced research installations. Crack algorithms to capture technology.',
                warName: 'The Research Wars'
            },
            okumura: {
                name: 'Strategic Patterns',
                theme: 'Pattern Control',
                description: 'Key strategic positions. Master patterns to control the battlefield.',
                warName: 'The Pattern Campaign'
            },
            sae: {
                name: 'Data Fortress',
                theme: 'Data Structure Region',
                description: 'A heavily fortified data center. Structure your assault carefully.',
                warName: 'The Data Wars'
            },
            shido: {
                name: 'Imperial Core',
                theme: 'Type System Dominion',
                description: 'The enemy capital. Navigate the type system to topple the regime.',
                warName: 'The Imperial Campaign'
            },
            mementos_depths: {
                name: 'Final Frontier',
                theme: 'Polymorphism Mastery',
                description: 'The last unconquered territory. Master polymorphism for total victory.',
                warName: 'The Final Campaign'
            }
        },

        // Faction theming (replaces confidants)
        confidants: {
            morgana: {
                name: 'The Pragmatist League',
                title: 'Military Alliance',
                ambassador: 'Chief Strategist Morgan',
                description: 'A coalition focused on practical warfare and Go best practices.',
                specialty: 'General practices, idioms, conventions'
            },
            futaba: {
                name: 'Algorithmica Research Pact',
                title: 'Science Council',
                ambassador: 'Director of Sciences Futaba',
                description: 'A research-focused alliance advancing algorithmic warfare.',
                specialty: 'Advanced algorithms, optimization'
            },
            makoto: {
                name: 'The Type Consortium',
                title: 'Trade Federation',
                ambassador: 'Minister of Technology Makoto',
                description: 'A powerful consortium controlling type system expertise.',
                specialty: 'Type systems, interfaces, generics'
            }
        },

        // General info for skills (replaces personas)
        personas: {
            'variables':       { name: 'Gen. Viktor Von Assignen',  title: 'The Declarator',    branch: 'Logistics Corps',       bio: 'Master of supply chain fundamentals.' },
            'for-loops':       { name: 'Gen. Lucia Iterata',        title: 'The Repeater',      branch: 'Infantry Division',     bio: 'Expert in sustained operations.' },
            'conditionals':    { name: 'Gen. Branch Wellington',    title: 'The Decider',       branch: 'Intelligence Bureau',   bio: 'Specialist in tactical decision-making.' },
            'slices':          { name: 'Gen. Flex Windowsky',       title: 'The Adapter',       branch: 'Rapid Response Unit',   bio: 'Pioneer of dynamic deployment tactics.' },
            'maps':            { name: 'Gen. Keir Hashworth',       title: 'The Cartographer',  branch: 'Reconnaissance Brigade', bio: 'Legendary terrain mapping expert.' },
            'functions':       { name: 'Gen. Callisto Modular',     title: 'The Invoker',       branch: 'Special Operations',    bio: 'Creator of modular strike team doctrine.' },
            'strings':         { name: 'Gen. Tex Concatenov',       title: 'The Wordsmith',     branch: 'Communications Corps',  bio: 'Master of signal operations.' },
            'two-pointers':    { name: 'Gen. Duo Convergence',      title: 'The Pincer',        branch: 'Armored Division',      bio: 'Inventor of the dual-flank maneuver.' },
            'sliding-window':  { name: 'Gen. Vista Framesworth',    title: 'The Scanner',       branch: 'Reconnaissance Brigade', bio: 'Developer of rolling observation tactics.' },
            'map-tracking':    { name: 'Gen. Trace Recorder',       title: 'The Tracker',       branch: 'Intelligence Bureau',   bio: 'Pioneer of pattern recognition warfare.' },
            'recursion':       { name: 'Gen. Echo Stackwell',       title: 'The Recursive',     branch: 'Strategic Command',     bio: 'Master of self-replicating strategies.' },
            'binary-search':   { name: 'Gen. Bisect Halverson',     title: 'The Divider',       branch: 'Precision Strike Unit', bio: 'Expert in rapid target isolation.' },
            'stack':           { name: 'Gen. Lifo Stackhouse',      title: 'The Orderly',       branch: 'Logistics Corps',       bio: 'Pioneer of last-in-first-out tactics.' },
            'sorting':         { name: 'Gen. Order Arrangeworth',   title: 'The Organizer',     branch: 'General Staff',         bio: 'Master of battlefield organization.' },
            'linked-list':     { name: 'Gen. Node Chainsworth',     title: 'The Connector',     branch: 'Engineering Corps',     bio: 'Expert in supply chain architecture.' },
            'bit-manipulation':{ name: 'Gen. Binary Bitfield',      title: 'The Operator',      branch: 'Signals Intelligence',  bio: 'Master of low-level operations.' },
            'switch':          { name: 'Gen. Case Branchley',       title: 'The Selector',      branch: 'Command & Control',     bio: 'Expert in multi-path decision systems.' },
            'string-building': { name: 'Gen. Buffer Buildsworth',   title: 'The Assembler',     branch: 'Engineering Corps',     bio: 'Pioneer of efficient construction.' },
            'pointers':        { name: 'Gen. Dmitri Addresskov',    title: 'The Reference',     branch: 'Artillery Command',     bio: 'Legendary precision targeting expert.' },
            'structs':         { name: 'Gen. Archie Compositum',    title: 'The Architect',     branch: 'Engineering Corps',     bio: 'Master of fortification design.' },
            'methods':         { name: 'Gen. Receiver Bindwell',    title: 'The Attache',       branch: 'Liaison Office',        bio: 'Expert in unit coordination.' },
            'interfaces':      { name: 'Gen. Abigail Abstractus',   title: 'The Polymorphist',  branch: 'Strategic Command',     bio: 'Pioneer of adaptive warfare.' },
            'embedding':       { name: 'Gen. Inherit Composington', title: 'The Combiner',      branch: 'Joint Operations',      bio: 'Master of force multiplication.' }
        },

        // Skill display overrides
        skills: {
            'variables':       { label: 'Variable Declaration', techTier: 'I' },
            'for-loops':       { label: 'Iteration Protocols',  techTier: 'I' },
            'conditionals':    { label: 'Decision Systems',     techTier: 'I' },
            'slices':          { label: 'Dynamic Arrays',       techTier: 'II' },
            'maps':            { label: 'Hash Mapping',         techTier: 'II' },
            'functions':       { label: 'Modular Operations',   techTier: 'II' },
            'strings':         { label: 'Text Processing',      techTier: 'II' },
            'two-pointers':    { label: 'Dual Reference',       techTier: 'III' },
            'sliding-window':  { label: 'Frame Analysis',       techTier: 'III' },
            'map-tracking':    { label: 'Pattern Detection',    techTier: 'III' },
            'recursion':       { label: 'Self-Reference',       techTier: 'III' },
            'binary-search':   { label: 'Binary Division',      techTier: 'III' },
            'stack':           { label: 'LIFO Operations',      techTier: 'III' },
            'sorting':         { label: 'Order Protocols',      techTier: 'III' },
            'linked-list':     { label: 'Chain Structures',     techTier: 'IV' },
            'bit-manipulation':{ label: 'Binary Operations',    techTier: 'IV' },
            'switch':          { label: 'Multi-Branch',         techTier: 'II' },
            'string-building': { label: 'Text Assembly',        techTier: 'III' },
            'pointers':        { label: 'Memory Reference',     techTier: 'IV' },
            'structs':         { label: 'Composite Types',      techTier: 'IV' },
            'methods':         { label: 'Bound Functions',      techTier: 'IV' },
            'interfaces':      { label: 'Abstract Contracts',   techTier: 'V' },
            'embedding':       { label: 'Type Composition',     techTier: 'V' }
        },

        // Combined Arms operations (fusion equivalents)
        combinedArms: [
            {
                id: 'pointer-structs',
                name: 'Structured Reference',
                generals: ['pointers', 'structs'],
                result: 'Pointer to Structs',
                description: 'Combined operation requiring both reference and structure expertise.'
            },
            {
                id: 'interface-methods',
                name: 'Dynamic Dispatch',
                generals: ['interfaces', 'methods'],
                result: 'Interface Methods',
                description: 'Joint operation combining abstraction with bound functions.'
            },
            {
                id: 'map-slice',
                name: 'Collection Mastery',
                generals: ['maps', 'slices'],
                result: 'Advanced Collections',
                description: 'Combined expertise in dynamic data structures.'
            }
        ]
    };

    // Register theme
    if (window.ThemeRegistry) {
        window.ThemeRegistry.register(theme);
    } else {
        // Queue for registration when ThemeRegistry loads
        window._pendingThemes = window._pendingThemes || [];
        window._pendingThemes.push(theme);
    }

    window.Theme4X = theme;

})();
