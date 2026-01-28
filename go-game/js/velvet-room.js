/**
 * Go Grind - Velvet Room (Persona Compendium & Fusion)
 */
(function() {
    'use strict';

    // Fusion recipes - combine two skills to unlock hybrid challenges
    var FUSION_RECIPES = {
        'word-patterns': {
            name: 'Word Patterns',
            description: 'Pattern matching with strings and maps',
            ingredients: ['maps', 'strings'],
            icon: '📝',
            challenges: ['Anagram Detection', 'Word Pattern Match', 'Isomorphic Strings']
        },
        'frequency-analysis': {
            name: 'Frequency Analysis',
            description: 'Counting and grouping with collections',
            ingredients: ['slices', 'maps'],
            icon: '📊',
            challenges: ['Group Anagrams', 'Top K Frequent', 'Sort by Frequency']
        },
        'string-permutations': {
            name: 'String Permutations',
            description: 'Recursive string generation',
            ingredients: ['recursion', 'strings'],
            icon: '🔀',
            challenges: ['Generate Permutations', 'Letter Case Permutation', 'Palindrome Partitioning']
        },
        'subarray-mastery': {
            name: 'Subarray Mastery',
            description: 'Advanced subarray techniques',
            ingredients: ['two-pointers', 'slices'],
            icon: '🎯',
            challenges: ['Max Subarray Sum', 'Product of Array Except Self', 'Container With Most Water']
        },
        'search-sort': {
            name: 'Search & Sort',
            description: 'Optimized searching in sorted data',
            ingredients: ['binary-search', 'sorting'],
            icon: '🔍',
            challenges: ['Search in Rotated Array', 'Find Peak Element', 'Kth Largest Element']
        },
        'expression-parsing': {
            name: 'Expression Parsing',
            description: 'Stack-based string evaluation',
            ingredients: ['stack', 'strings'],
            icon: '🧮',
            challenges: ['Evaluate RPN', 'Basic Calculator', 'Decode String']
        },
        'higher-order': {
            name: 'Higher-Order Functions',
            description: 'Functions that operate on functions',
            ingredients: ['functions', 'recursion'],
            icon: '⚡',
            challenges: ['Memoization', 'Function Composition', 'Curry Implementation']
        },
        'intersection-points': {
            name: 'Intersection Points',
            description: 'Finding meeting points efficiently',
            ingredients: ['map-tracking', 'two-pointers'],
            icon: '🔗',
            challenges: ['Intersection of Arrays', 'Find Duplicate Number', 'Linked List Cycle Detection']
        },
        'substring-windows': {
            name: 'Substring Windows',
            description: 'Sliding window on strings',
            ingredients: ['sliding-window', 'strings'],
            icon: '🪟',
            challenges: ['Longest Substring Without Repeat', 'Minimum Window Substring', 'Find All Anagrams']
        },
        'tree-traversal': {
            name: 'Tree Traversal',
            description: 'Recursive tree operations',
            ingredients: ['recursion', 'stack'],
            icon: '🌳',
            challenges: ['Inorder Traversal', 'Level Order Traversal', 'Path Sum']
        },
        'bit-counting': {
            name: 'Bit Counting',
            description: 'Bit manipulation with maps',
            ingredients: ['bit-manipulation', 'maps'],
            icon: '🔢',
            challenges: ['Count Bits', 'Single Number', 'Hamming Distance']
        },
        'list-operations': {
            name: 'List Operations',
            description: 'Advanced linked list patterns',
            ingredients: ['linked-list', 'two-pointers'],
            icon: '📋',
            challenges: ['Reverse Linked List', 'Merge Two Lists', 'Remove Nth From End']
        }
    };

    var selectedIngredients = [];

    function getFusionState() {
        var state = window.GameState.getState();
        if (!state.fusions) {
            state.fusions = { unlocked: [], inProgress: null };
            window.GameState.save();
        }
        return state.fusions;
    }

    function isSkillMastered(skillKey) {
        var skill = window.GameState.getSkill(skillKey);
        return skill && skill.level >= 3;
    }

    function canFuse(recipeKey) {
        var recipe = FUSION_RECIPES[recipeKey];
        if (!recipe) return false;
        return recipe.ingredients.every(function(ing) {
            return isSkillMastered(ing);
        });
    }

    function isFusionUnlocked(recipeKey) {
        var fusions = getFusionState();
        return fusions.unlocked.indexOf(recipeKey) !== -1;
    }

    function performFusion(recipeKey) {
        if (!canFuse(recipeKey)) return false;
        if (isFusionUnlocked(recipeKey)) return false;

        var state = window.GameState.getState();
        if (!state.fusions) state.fusions = { unlocked: [], inProgress: null };
        state.fusions.unlocked.push(recipeKey);
        window.GameState.save();

        // Dispatch fusion event
        window.dispatchEvent(new CustomEvent('fusionComplete', {
            detail: { recipeKey: recipeKey, recipe: FUSION_RECIPES[recipeKey] }
        }));

        return true;
    }

    function findPossibleFusion(ing1, ing2) {
        for (var key in FUSION_RECIPES) {
            var recipe = FUSION_RECIPES[key];
            if ((recipe.ingredients[0] === ing1 && recipe.ingredients[1] === ing2) ||
                (recipe.ingredients[0] === ing2 && recipe.ingredients[1] === ing1)) {
                return { key: key, recipe: recipe };
            }
        }
        return null;
    }

    function renderFusionSection() {
        var skillDefs = window.GameState.getSkillDefs();
        var fusions = getFusionState();

        var html = '<div class="velvet-section-title">Persona Fusion</div>';
        html += '<div class="fusion-intro">';
        html += '<p class="fusion-quote">"Welcome to the Velvet Room... Shall we perform a fusion?"</p>';
        html += '<p class="fusion-desc">Combine mastered skills (Level 3+) to unlock new challenge types.</p>';
        html += '</div>';

        // Fusion workspace
        html += '<div class="fusion-workspace">';

        // Ingredient slots
        html += '<div class="fusion-slots">';
        html += '<div class="fusion-slot" data-slot="0">';
        if (selectedIngredients[0]) {
            var def0 = skillDefs[selectedIngredients[0]];
            html += '<div class="slot-content filled">';
            html += '<div class="slot-name">' + (def0 ? def0.label : selectedIngredients[0]) + '</div>';
            html += '<button class="slot-remove" onclick="VelvetRoom.removeIngredient(0)">×</button>';
            html += '</div>';
        } else {
            html += '<div class="slot-content empty">Select Skill</div>';
        }
        html += '</div>';

        // Plus sign
        html += '<div class="fusion-operator">+</div>';

        html += '<div class="fusion-slot" data-slot="1">';
        if (selectedIngredients[1]) {
            var def1 = skillDefs[selectedIngredients[1]];
            html += '<div class="slot-content filled">';
            html += '<div class="slot-name">' + (def1 ? def1.label : selectedIngredients[1]) + '</div>';
            html += '<button class="slot-remove" onclick="VelvetRoom.removeIngredient(1)">×</button>';
            html += '</div>';
        } else {
            html += '<div class="slot-content empty">Select Skill</div>';
        }
        html += '</div>';

        // Equals sign
        html += '<div class="fusion-operator">=</div>';

        // Result slot
        html += '<div class="fusion-result">';
        if (selectedIngredients.length === 2) {
            var result = findPossibleFusion(selectedIngredients[0], selectedIngredients[1]);
            if (result) {
                var alreadyUnlocked = isFusionUnlocked(result.key);
                var canPerform = canFuse(result.key);
                html += '<div class="result-content ' + (alreadyUnlocked ? 'unlocked' : canPerform ? 'available' : 'locked') + '">';
                html += '<div class="result-icon">' + result.recipe.icon + '</div>';
                html += '<div class="result-name">' + result.recipe.name + '</div>';
                if (alreadyUnlocked) {
                    html += '<div class="result-status unlocked">Already Unlocked</div>';
                } else if (canPerform) {
                    html += '<button class="fusion-btn" onclick="VelvetRoom.fuse(\'' + result.key + '\')">Fuse!</button>';
                } else {
                    html += '<div class="result-status locked">Skills not mastered</div>';
                }
                html += '</div>';
            } else {
                html += '<div class="result-content no-result">';
                html += '<div class="result-icon">?</div>';
                html += '<div class="result-name">No fusion available</div>';
                html += '</div>';
            }
        } else {
            html += '<div class="result-content empty">';
            html += '<div class="result-icon">?</div>';
            html += '<div class="result-name">Select two skills</div>';
            html += '</div>';
        }
        html += '</div>';
        html += '</div>'; // fusion-slots

        // Available skills to select
        html += '<div class="fusion-skills">';
        html += '<div class="fusion-skills-label">Available Skills</div>';
        html += '<div class="fusion-skills-grid">';

        var allSkillKeys = Object.keys(skillDefs).sort(function(a, b) {
            return skillDefs[a].label.localeCompare(skillDefs[b].label);
        });

        allSkillKeys.forEach(function(skillKey) {
            var def = skillDefs[skillKey];
            var skill = window.GameState.getSkill(skillKey);
            var mastered = skill && skill.level >= 3;
            var isSelected = selectedIngredients.indexOf(skillKey) !== -1;

            html += '<div class="fusion-skill ' + (mastered ? 'mastered' : 'not-mastered') + (isSelected ? ' selected' : '') + '" ';
            html += 'onclick="VelvetRoom.selectIngredient(\'' + skillKey + '\')">';
            html += '<div class="fusion-skill-name">' + def.label + '</div>';
            html += '<div class="fusion-skill-level">LV ' + skill.level + (mastered ? ' ✓' : '') + '</div>';
            html += '</div>';
        });

        html += '</div></div>'; // fusion-skills-grid, fusion-skills
        html += '</div>'; // fusion-workspace

        // Unlocked fusions
        var unlockedFusions = fusions.unlocked || [];
        if (unlockedFusions.length > 0) {
            html += '<div class="velvet-section-title">Unlocked Fusions</div>';
            html += '<div class="unlocked-fusions-grid">';
            unlockedFusions.forEach(function(key) {
                var recipe = FUSION_RECIPES[key];
                if (!recipe) return;
                html += '<div class="unlocked-fusion-card">';
                html += '<div class="unlocked-fusion-icon">' + recipe.icon + '</div>';
                html += '<div class="unlocked-fusion-info">';
                html += '<div class="unlocked-fusion-name">' + recipe.name + '</div>';
                html += '<div class="unlocked-fusion-desc">' + recipe.description + '</div>';
                html += '<div class="unlocked-fusion-challenges">';
                recipe.challenges.forEach(function(c) {
                    html += '<span class="challenge-tag">' + c + '</span>';
                });
                html += '</div></div></div>';
            });
            html += '</div>';
        }

        // Available recipes preview
        html += '<div class="velvet-section-title">Fusion Recipes</div>';
        html += '<div class="recipe-preview-grid">';
        Object.keys(FUSION_RECIPES).forEach(function(key) {
            var recipe = FUSION_RECIPES[key];
            var unlocked = isFusionUnlocked(key);
            var canMake = canFuse(key);

            html += '<div class="recipe-preview ' + (unlocked ? 'unlocked' : canMake ? 'available' : 'locked') + '">';
            html += '<div class="recipe-icon">' + (unlocked ? recipe.icon : '?') + '</div>';
            html += '<div class="recipe-info">';
            html += '<div class="recipe-name">' + (unlocked ? recipe.name : '???') + '</div>';
            html += '<div class="recipe-ingredients">';
            recipe.ingredients.forEach(function(ing, idx) {
                var def = skillDefs[ing];
                var mastered = isSkillMastered(ing);
                html += '<span class="recipe-ing ' + (mastered ? 'mastered' : '') + '">' + (def ? def.label : ing) + '</span>';
                if (idx === 0) html += ' + ';
            });
            html += '</div>';
            if (unlocked) {
                html += '<div class="recipe-status">✓ Unlocked</div>';
            } else if (canMake) {
                html += '<div class="recipe-status available">Ready to fuse!</div>';
            } else {
                html += '<div class="recipe-status">Requires LV3 in both skills</div>';
            }
            html += '</div></div>';
        });
        html += '</div>';

        return html;
    }

    function renderVelvetRoom() {
        var view = document.getElementById('view-velvet');
        if (!view || !window.GameState) return;

        var personas = window.GameState.getPersonas();
        var personaDefs = window.GameState.getPersonaDefs();
        var skills = window.GameState.getSkills();
        var skillDefs = window.GameState.getSkillDefs();

        var discoveredCount = Object.keys(personas).length;
        var totalCount = Object.keys(personaDefs).length;
        var totalMasteryXP = 0;
        Object.keys(personas).forEach(function(k) { totalMasteryXP += personas[k].masteryXP || 0; });

        var html = '<div class="velvet-room-view">';

        // Header
        html += '<div class="velvet-header">' +
            '<div class="velvet-title">Velvet Room</div>' +
            '<div class="velvet-subtitle">Persona Compendium</div>' +
        '</div>';

        // Stats
        html += '<div class="compendium-stats">' +
            '<div class="compendium-stat"><div class="compendium-stat-value">' + discoveredCount + '/' + totalCount + '</div><div class="compendium-stat-label">Discovered</div></div>' +
            '<div class="compendium-stat"><div class="compendium-stat-value">' + Math.round(discoveredCount / totalCount * 100) + '%</div><div class="compendium-stat-label">Completion</div></div>' +
            '<div class="compendium-stat"><div class="compendium-stat-value">' + totalMasteryXP + '</div><div class="compendium-stat-label">Total Mastery XP</div></div>' +
        '</div>';

        // Fusion section
        html += renderFusionSection();

        // Persona grid
        html += '<div class="velvet-section-title">Personas</div>';
        html += '<div class="persona-grid">';

        // Sort: discovered first, then alphabetical
        var allKeys = Object.keys(personaDefs).sort(function(a, b) {
            var aDisc = !!personas[a];
            var bDisc = !!personas[b];
            if (aDisc !== bDisc) return bDisc - aDisc;
            return (personaDefs[a].name || '').localeCompare(personaDefs[b].name || '');
        });

        allKeys.forEach(function(key) {
            var def = personaDefs[key];
            var persona = personas[key];
            var discovered = !!persona;
            var skill = skills[key] || { level: 1 };
            var skillDef = skillDefs[key];
            var masteryPct = persona ? Math.min(100, Math.round((persona.masteryXP || 0) / 500 * 100)) : 0;

            // Icon based on arcana
            var icons = {
                'Fool': '\u2606', 'Magician': '\u2605', 'Priestess': '\u263E',
                'Lovers': '\u2665', 'Chariot': '\u2694', 'Temperance': '\u2696',
                'Hanged Man': '\u2629', 'Death': '\u2620', 'Star': '\u2605',
                'Judgement': '\u2696', 'Tower': '\u26A1', 'Strength': '\u2694',
                'Empress': '\u2654', 'Hierophant': '\u2638', 'Fortune': '\u2740',
                'Hermit': '\u263C'
            };
            var icon = icons[def.arcana] || '\u2605';

            html += '<div class="persona-card ' + (discovered ? '' : 'locked') + '">';
            html += '<div class="persona-icon">' + icon + '</div>';
            html += '<div class="persona-name">' + (discovered ? def.name : '???') + '</div>';
            html += '<div class="persona-concept">' + (skillDef ? skillDef.label : key) + '</div>';
            html += '<div class="persona-arcana">' + def.arcana + '</div>';

            if (discovered) {
                html += '<div class="persona-level">LV ' + (persona.level || 1) + '</div>';
                html += '<div class="persona-mastery-bar"><div class="persona-mastery-fill" style="width:' + masteryPct + '%"></div></div>';
            } else {
                html += '<div class="persona-fusion-hint">Complete ' + (skillDef ? skillDef.label : key) + ' exercises</div>';
            }

            html += '</div>';
        });

        html += '</div>';
        html += '</div>';

        view.innerHTML = html;
    }

    function selectIngredient(skillKey) {
        if (selectedIngredients.indexOf(skillKey) !== -1) {
            // Already selected, remove it
            selectedIngredients = selectedIngredients.filter(function(k) { return k !== skillKey; });
        } else if (selectedIngredients.length < 2) {
            selectedIngredients.push(skillKey);
        } else {
            // Replace the first one
            selectedIngredients[0] = selectedIngredients[1];
            selectedIngredients[1] = skillKey;
        }
        renderVelvetRoom();
    }

    function removeIngredient(slotIndex) {
        selectedIngredients.splice(slotIndex, 1);
        renderVelvetRoom();
    }

    function fuse(recipeKey) {
        if (performFusion(recipeKey)) {
            selectedIngredients = [];
            renderVelvetRoom();
            // Show success notification
            showFusionSuccess(recipeKey);
        }
    }

    function showFusionSuccess(recipeKey) {
        var recipe = FUSION_RECIPES[recipeKey];
        if (!recipe) return;

        var overlay = document.createElement('div');
        overlay.className = 'fusion-success-overlay';
        overlay.innerHTML = '<div class="fusion-success-modal">' +
            '<div class="fusion-success-icon">' + recipe.icon + '</div>' +
            '<div class="fusion-success-title">Fusion Complete!</div>' +
            '<div class="fusion-success-name">' + recipe.name + '</div>' +
            '<div class="fusion-success-desc">' + recipe.description + '</div>' +
            '<div class="fusion-success-challenges">' +
            '<div class="challenges-label">New Challenges Unlocked:</div>' +
            recipe.challenges.map(function(c) { return '<div class="challenge-item">' + c + '</div>'; }).join('') +
            '</div>' +
            '<button class="fusion-success-btn" onclick="this.closest(\'.fusion-success-overlay\').remove()">Excellent</button>' +
            '</div>';
        document.body.appendChild(overlay);

        // Play sound if available
        if (window.Audio) {
            try {
                var audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+dlIZ8dXRzcnF1e4SMl6OnpZ6VjYWBgIOHi4+QjoqFgH18e3t8gIiQmZ+gnZaNhH55d3d3eHuAiZSfpaWgmI6FfXh2dnh6foWOmqOmpaCXjYR8d3V1dXh+ho+bpqqpm5KIfXZycnN2fISOm6mvrqiflot/eHRzdHd8g42Ypa2uqaGYjoV9d3V1dnh9houTnKKjoJuVj4qGhIOChIaJjI6PjYuIhYKBgYKEhoiJiYiGhIKBgYGChIWGhoWEgoGAgIGChIWFhYSDgYCAgIGChISEg4KBgICAgIGCg4ODgoGAgICAgIGCgoKCgYGAgICAgIGBgYGBgYCAgICAgIGBgYGBgICAgA==');
                audio.volume = 0.3;
                audio.play().catch(function() {});
            } catch (e) {}
        }
    }

    window.VelvetRoom = {
        renderVelvetRoom: renderVelvetRoom,
        selectIngredient: selectIngredient,
        removeIngredient: removeIngredient,
        fuse: fuse,
        getFusionRecipes: function() { return FUSION_RECIPES; },
        isFusionUnlocked: isFusionUnlocked,
        canFuse: canFuse
    };
})();
