/**
 * Go Grind - Goals & Victory Conditions
 * Tracks progress toward different victory conditions for both themes.
 */
(function() {
    'use strict';

    // Victory condition definitions
    var VICTORY_CONDITIONS = {
        // 4X Strategy Victory Conditions
        domination: {
            id: 'domination',
            name4X: 'Domination Victory',
            nameP5: 'Change All Hearts',
            icon4X: '\u{1F3F4}',
            iconP5: '\u{1F3AD}',
            description4X: 'Conquer all 8 Territories',
            descriptionP5: 'Change the hearts of all 8 Palace rulers',
            calculate: function(state) {
                var palaces = state.palaces || {};
                var total = Object.keys(palaces).length || 8;
                var defeated = 0;
                Object.keys(palaces).forEach(function(key) {
                    if (palaces[key].defeated) defeated++;
                });
                return { current: defeated, total: total, pct: Math.round(defeated / total * 100) };
            }
        },
        technology: {
            id: 'technology',
            name4X: 'Technology Victory',
            nameP5: 'Master All Skills',
            icon4X: '\u{1F52C}',
            iconP5: '\u{2B50}',
            description4X: 'Research all Technologies to Rank 10+',
            descriptionP5: 'Reach Level 10 in all skills',
            targetLevel: 10,
            calculate: function(state) {
                var skills = state.skills || {};
                var total = Object.keys(skills).length || 22;
                var maxed = 0;
                var targetLevel = VICTORY_CONDITIONS.technology.targetLevel;
                Object.keys(skills).forEach(function(key) {
                    if (skills[key].level >= targetLevel) maxed++;
                });
                return { current: maxed, total: total, pct: Math.round(maxed / total * 100) };
            }
        },
        diplomatic: {
            id: 'diplomatic',
            name4X: 'Diplomatic Victory',
            nameP5: 'Max All Confidants',
            icon4X: '\u{1F91D}',
            iconP5: '\u{2764}',
            description4X: 'Achieve Allied status with all Factions',
            descriptionP5: 'Reach Rank 10 with all Confidants',
            targetRank: 10,
            calculate: function(state) {
                var confidants = state.confidants || {};
                var total = Object.keys(confidants).length || 3;
                var maxed = 0;
                var targetRank = VICTORY_CONDITIONS.diplomatic.targetRank;
                Object.keys(confidants).forEach(function(key) {
                    if (confidants[key].rank >= targetRank) maxed++;
                });
                return { current: maxed, total: total, pct: Math.round(maxed / total * 100) };
            }
        },
        excellence: {
            id: 'excellence',
            name4X: 'Military Excellence',
            nameP5: 'Academic Excellence',
            icon4X: '\u{1F396}',
            iconP5: '\u{1F393}',
            description4X: 'Pass all Staff College Exams with Distinction (90%+)',
            descriptionP5: 'Pass all Exams with 90%+ score',
            targetScore: 90,
            totalExams: 6,
            calculate: function(state) {
                var exams = state.exams || {};
                var total = VICTORY_CONDITIONS.excellence.totalExams;
                var passed = 0;
                var targetPct = VICTORY_CONDITIONS.excellence.targetScore;
                Object.keys(exams).forEach(function(key) {
                    var exam = exams[key];
                    if (exam.score && exam.maxScore) {
                        var pct = Math.round(exam.score / exam.maxScore * 100);
                        if (pct >= targetPct) passed++;
                    }
                });
                return { current: passed, total: total, pct: Math.round(passed / total * 100) };
            }
        }
    };

    // Territory/Palace objectives - explicit requirements
    var TERRITORY_OBJECTIVES = {
        kamoshida: {
            name4X: 'The Frontier',
            nameP5: "Kamoshida's Castle",
            objectives: [
                { id: 'ops', description4X: 'Complete 15 Operations', descriptionP5: 'Defeat 15 Shadows', type: 'exercises', count: 15, concepts: ['variables', 'for-loops', 'conditionals'] },
                { id: 'tech1', description4X: 'Research Variables to Rank 5', descriptionP5: 'Reach Variables Level 5', type: 'skillLevel', skill: 'variables', level: 5 },
                { id: 'tech2', description4X: 'Research For Loops to Rank 5', descriptionP5: 'Reach For Loops Level 5', type: 'skillLevel', skill: 'for-loops', level: 5 },
                { id: 'distinction', description4X: 'Earn 3 Distinguished Service ratings', descriptionP5: 'Get 3 S-Ranks', type: 'sRanks', count: 3, concepts: ['variables', 'for-loops', 'conditionals'] },
                { id: 'boss', description4X: 'Complete Annexation Battle', descriptionP5: 'Defeat Shadow Kamoshida', type: 'boss' }
            ]
        },
        madarame: {
            name4X: 'Industrial Heartland',
            nameP5: "Madarame's Museum",
            objectives: [
                { id: 'ops', description4X: 'Complete 20 Operations', descriptionP5: 'Defeat 20 Shadows', type: 'exercises', count: 20, concepts: ['slices', 'maps', 'strings'] },
                { id: 'tech1', description4X: 'Research Slices to Rank 8', descriptionP5: 'Reach Slices Level 8', type: 'skillLevel', skill: 'slices', level: 8 },
                { id: 'tech2', description4X: 'Research Maps to Rank 8', descriptionP5: 'Reach Maps Level 8', type: 'skillLevel', skill: 'maps', level: 8 },
                { id: 'distinction', description4X: 'Earn 5 Distinguished Service ratings', descriptionP5: 'Get 5 S-Ranks', type: 'sRanks', count: 5, concepts: ['slices', 'maps', 'strings'] },
                { id: 'boss', description4X: 'Complete Annexation Battle', descriptionP5: 'Defeat Shadow Madarame', type: 'boss' }
            ]
        },
        kaneshiro: {
            name4X: 'Economic Zones',
            nameP5: "Kaneshiro's Bank",
            objectives: [
                { id: 'ops', description4X: 'Complete 20 Operations', descriptionP5: 'Defeat 20 Shadows', type: 'exercises', count: 20, concepts: ['functions', 'recursion', 'switch'] },
                { id: 'tech1', description4X: 'Research Functions to Rank 10', descriptionP5: 'Reach Functions Level 10', type: 'skillLevel', skill: 'functions', level: 10 },
                { id: 'tech2', description4X: 'Research Recursion to Rank 8', descriptionP5: 'Reach Recursion Level 8', type: 'skillLevel', skill: 'recursion', level: 8 },
                { id: 'distinction', description4X: 'Earn 5 Distinguished Service ratings', descriptionP5: 'Get 5 S-Ranks', type: 'sRanks', count: 5, concepts: ['functions', 'recursion', 'switch'] },
                { id: 'boss', description4X: 'Complete Annexation Battle', descriptionP5: 'Defeat Shadow Kaneshiro', type: 'boss' }
            ]
        },
        futaba: {
            name4X: 'Research Complex',
            nameP5: "Futaba's Pyramid",
            objectives: [
                { id: 'ops', description4X: 'Complete 25 Operations', descriptionP5: 'Defeat 25 Shadows', type: 'exercises', count: 25, concepts: ['recursion', 'binary-search', 'stack'] },
                { id: 'tech1', description4X: 'Research Binary Search to Rank 10', descriptionP5: 'Reach Binary Search Level 10', type: 'skillLevel', skill: 'binary-search', level: 10 },
                { id: 'tech2', description4X: 'Research Stack to Rank 10', descriptionP5: 'Reach Stack Level 10', type: 'skillLevel', skill: 'stack', level: 10 },
                { id: 'distinction', description4X: 'Earn 7 Distinguished Service ratings', descriptionP5: 'Get 7 S-Ranks', type: 'sRanks', count: 7, concepts: ['recursion', 'binary-search', 'stack'] },
                { id: 'boss', description4X: 'Complete Annexation Battle', descriptionP5: 'Defeat Cognitive Futaba', type: 'boss' }
            ]
        },
        okumura: {
            name4X: 'Strategic Patterns',
            nameP5: "Okumura's Spaceport",
            objectives: [
                { id: 'ops', description4X: 'Complete 25 Operations', descriptionP5: 'Defeat 25 Shadows', type: 'exercises', count: 25, concepts: ['two-pointers', 'sliding-window', 'sorting'] },
                { id: 'tech1', description4X: 'Research Two Pointers to Rank 12', descriptionP5: 'Reach Two Pointers Level 12', type: 'skillLevel', skill: 'two-pointers', level: 12 },
                { id: 'tech2', description4X: 'Research Sliding Window to Rank 12', descriptionP5: 'Reach Sliding Window Level 12', type: 'skillLevel', skill: 'sliding-window', level: 12 },
                { id: 'distinction', description4X: 'Earn 8 Distinguished Service ratings', descriptionP5: 'Get 8 S-Ranks', type: 'sRanks', count: 8, concepts: ['two-pointers', 'sliding-window', 'sorting'] },
                { id: 'boss', description4X: 'Complete Annexation Battle', descriptionP5: 'Defeat Shadow Okumura', type: 'boss' }
            ]
        },
        sae: {
            name4X: 'Data Fortress',
            nameP5: "Sae's Casino",
            objectives: [
                { id: 'ops', description4X: 'Complete 30 Operations', descriptionP5: 'Defeat 30 Shadows', type: 'exercises', count: 30, concepts: ['map-tracking', 'linked-list', 'bit-manipulation'] },
                { id: 'tech1', description4X: 'Research Map Tracking to Rank 15', descriptionP5: 'Reach Map Tracking Level 15', type: 'skillLevel', skill: 'map-tracking', level: 15 },
                { id: 'tech2', description4X: 'Research Linked List to Rank 12', descriptionP5: 'Reach Linked List Level 12', type: 'skillLevel', skill: 'linked-list', level: 12 },
                { id: 'distinction', description4X: 'Earn 10 Distinguished Service ratings', descriptionP5: 'Get 10 S-Ranks', type: 'sRanks', count: 10, concepts: ['map-tracking', 'linked-list', 'bit-manipulation'] },
                { id: 'boss', description4X: 'Complete Annexation Battle', descriptionP5: 'Defeat Shadow Sae', type: 'boss' }
            ]
        },
        shido: {
            name4X: 'Imperial Core',
            nameP5: "Shido's Cruiser",
            objectives: [
                { id: 'ops', description4X: 'Complete 30 Operations', descriptionP5: 'Defeat 30 Shadows', type: 'exercises', count: 30, concepts: ['pointers', 'structs', 'methods'] },
                { id: 'tech1', description4X: 'Research Pointers to Rank 15', descriptionP5: 'Reach Pointers Level 15', type: 'skillLevel', skill: 'pointers', level: 15 },
                { id: 'tech2', description4X: 'Research Structs to Rank 15', descriptionP5: 'Reach Structs Level 15', type: 'skillLevel', skill: 'structs', level: 15 },
                { id: 'distinction', description4X: 'Earn 12 Distinguished Service ratings', descriptionP5: 'Get 12 S-Ranks', type: 'sRanks', count: 12, concepts: ['pointers', 'structs', 'methods'] },
                { id: 'boss', description4X: 'Complete Annexation Battle', descriptionP5: 'Defeat Shadow Shido', type: 'boss' }
            ]
        },
        mementos_depths: {
            name4X: 'Final Frontier',
            nameP5: 'Mementos Depths',
            objectives: [
                { id: 'ops', description4X: 'Complete 35 Operations', descriptionP5: 'Defeat 35 Shadows', type: 'exercises', count: 35, concepts: ['interfaces', 'embedding'] },
                { id: 'tech1', description4X: 'Research Interfaces to Rank 20', descriptionP5: 'Reach Interfaces Level 20', type: 'skillLevel', skill: 'interfaces', level: 20 },
                { id: 'tech2', description4X: 'Research Embedding to Rank 15', descriptionP5: 'Reach Embedding Level 15', type: 'skillLevel', skill: 'embedding', level: 15 },
                { id: 'distinction', description4X: 'Earn 15 Distinguished Service ratings', descriptionP5: 'Get 15 S-Ranks', type: 'sRanks', count: 15, concepts: ['interfaces', 'embedding'] },
                { id: 'boss', description4X: 'Complete Final Battle', descriptionP5: 'Face the Final Challenge', type: 'boss' }
            ]
        }
    };

    /**
     * Calculate objective completion status
     */
    function calculateObjectiveStatus(objective, state, palaceKey) {
        var completed = state.completedExercises || {};
        var skills = state.skills || {};
        var palaces = state.palaces || {};

        switch (objective.type) {
            case 'exercises':
                var count = 0;
                Object.keys(completed).forEach(function(key) {
                    var ex = completed[key];
                    if (ex.skillKey && objective.concepts.indexOf(ex.skillKey) !== -1) {
                        count++;
                    }
                });
                return { current: count, target: objective.count, complete: count >= objective.count };

            case 'skillLevel':
                var skill = skills[objective.skill] || { level: 1 };
                return { current: skill.level, target: objective.level, complete: skill.level >= objective.level };

            case 'sRanks':
                var sCount = 0;
                Object.keys(completed).forEach(function(key) {
                    var ex = completed[key];
                    if (ex.grade === 'S' && ex.skillKey && objective.concepts.indexOf(ex.skillKey) !== -1) {
                        sCount++;
                    }
                });
                return { current: sCount, target: objective.count, complete: sCount >= objective.count };

            case 'boss':
                var palace = palaces[palaceKey] || {};
                return { current: palace.defeated ? 1 : 0, target: 1, complete: palace.defeated };

            default:
                return { current: 0, target: 1, complete: false };
        }
    }

    /**
     * Get all victory condition progress
     */
    function getVictoryProgress() {
        if (!window.GameState) return {};

        var state = window.GameState.getFullState();
        var progress = {};

        Object.keys(VICTORY_CONDITIONS).forEach(function(key) {
            var vc = VICTORY_CONDITIONS[key];
            progress[key] = vc.calculate(state);
        });

        return progress;
    }

    /**
     * Get territory/palace objectives with status
     */
    function getTerritoryObjectives(palaceKey) {
        if (!window.GameState) return null;

        var territory = TERRITORY_OBJECTIVES[palaceKey];
        if (!territory) return null;

        var state = window.GameState.getFullState();
        var objectives = territory.objectives.map(function(obj) {
            var status = calculateObjectiveStatus(obj, state, palaceKey);
            return {
                id: obj.id,
                description4X: obj.description4X,
                descriptionP5: obj.descriptionP5,
                type: obj.type,
                status: status
            };
        });

        var completedCount = objectives.filter(function(o) { return o.status.complete; }).length;
        var totalCount = objectives.length;

        return {
            name4X: territory.name4X,
            nameP5: territory.nameP5,
            objectives: objectives,
            completedCount: completedCount,
            totalCount: totalCount,
            pct: Math.round(completedCount / totalCount * 100)
        };
    }

    /**
     * Get all territories with progress
     */
    function getAllTerritoryProgress() {
        var progress = {};
        Object.keys(TERRITORY_OBJECTIVES).forEach(function(key) {
            progress[key] = getTerritoryObjectives(key);
        });
        return progress;
    }

    /**
     * Get the nearest achievable victory condition
     */
    function getNearestVictory() {
        var progress = getVictoryProgress();
        var nearest = null;
        var highestPct = -1;

        Object.keys(progress).forEach(function(key) {
            var p = progress[key];
            if (p.pct > highestPct && p.pct < 100) {
                highestPct = p.pct;
                nearest = { key: key, progress: p, condition: VICTORY_CONDITIONS[key] };
            }
        });

        return nearest;
    }

    /**
     * Get overall completion percentage
     */
    function getOverallCompletion() {
        var progress = getVictoryProgress();
        var totalPct = 0;
        var count = 0;

        Object.keys(progress).forEach(function(key) {
            totalPct += progress[key].pct;
            count++;
        });

        return count > 0 ? Math.round(totalPct / count) : 0;
    }

    /**
     * Get next recommended objective
     */
    function getNextObjective() {
        if (!window.GameState) return null;

        var territories = getAllTerritoryProgress();
        var state = window.GameState.getFullState();
        var palaces = state.palaces || {};

        // Find the first territory with incomplete objectives that isn't fully locked
        var territoryOrder = ['kamoshida', 'madarame', 'kaneshiro', 'futaba', 'okumura', 'sae', 'shido', 'mementos_depths'];

        for (var i = 0; i < territoryOrder.length; i++) {
            var key = territoryOrder[i];
            var territory = territories[key];
            var palace = palaces[key] || {};

            if (territory && territory.pct < 100) {
                // Find the first incomplete objective
                for (var j = 0; j < territory.objectives.length; j++) {
                    var obj = territory.objectives[j];
                    if (!obj.status.complete) {
                        return {
                            territory: key,
                            territoryName4X: territory.name4X,
                            territoryNameP5: territory.nameP5,
                            objective: obj
                        };
                    }
                }
            }
        }

        return null;
    }

    // Public API
    window.Goals = {
        getVictoryConditions: function() { return VICTORY_CONDITIONS; },
        getTerritoryObjectivesDefs: function() { return TERRITORY_OBJECTIVES; },
        getVictoryProgress: getVictoryProgress,
        getTerritoryObjectives: getTerritoryObjectives,
        getAllTerritoryProgress: getAllTerritoryProgress,
        getNearestVictory: getNearestVictory,
        getOverallCompletion: getOverallCompletion,
        getNextObjective: getNextObjective
    };

})();
