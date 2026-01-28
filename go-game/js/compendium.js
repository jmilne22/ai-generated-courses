/**
 * Go Grind - Velvet Room (Persona Compendium & Fusion)
 * Themed as "Hall of Generals" for 4X Strategy mode
 */
(function() {
    'use strict';

    // Combined Arms operations (4X) / Fusion recipes (P5)
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
        var T = window.ThemeRegistry;

        // Labels
        var sectionTitle = 'Persona Fusion';
        var quote = '"Welcome to the Velvet Room... Shall we perform a fusion?"';
        var desc = 'Combine mastered skills (Level 3+) to unlock new challenge types.';

        var html = '<div class="velvet-section-title">' + sectionTitle + '</div>';
        html += '<div class="fusion-intro">';
        html += '<p class="fusion-quote">' + quote + '</p>';
        html += '<p class="fusion-desc">' + desc + '</p>';
        html += '</div>';

        // Fusion workspace
        html += '<div class="fusion-workspace">';

        // Ingredient slots
        html += '<div class="fusion-slots">';
        html += '<div class="fusion-slot" data-slot="0">';
        if (selectedIngredients[0]) {
            var def0 = skillDefs[selectedIngredients[0]];
            var skillInfo0 = T ? T.getSkillInfo(selectedIngredients[0]) : null;
            var label0 = skillInfo0 ? skillInfo0.label : (def0 ? def0.label : selectedIngredients[0]);

            html += '<div class="slot-content filled">';
            html += '<div class="slot-name">' + label0 + '</div>';
            html += '<button class="slot-remove" onclick="VelvetRoom.removeIngredient(0)">\u00D7</button>';
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
            var skillInfo1 = T ? T.getSkillInfo(selectedIngredients[1]) : null;
            var label1 = skillInfo1 ? skillInfo1.label : (def1 ? def1.label : selectedIngredients[1]);

            html += '<div class="slot-content filled">';
            html += '<div class="slot-name">' + label1 + '</div>';
            html += '<button class="slot-remove" onclick="VelvetRoom.removeIngredient(1)">\u00D7</button>';
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
        var skillsLabel = 'Available Skills';
        var levelLabel = 'LV';

        html += '<div class="fusion-skills">';
        html += '<div class="fusion-skills-label">' + skillsLabel + '</div>';
        html += '<div class="fusion-skills-grid">';

        var allSkillKeys = Object.keys(skillDefs).sort(function(a, b) {
            return skillDefs[a].label.localeCompare(skillDefs[b].label);
        });

        allSkillKeys.forEach(function(skillKey) {
            var def = skillDefs[skillKey];
            var skill = window.GameState.getSkill(skillKey);
            var mastered = skill && skill.level >= 3;
            var isSelected = selectedIngredients.indexOf(skillKey) !== -1;

            // Get themed skill label
            var skillInfo = T ? T.getSkillInfo(skillKey) : null;
            var skillLabel = skillInfo ? skillInfo.label : def.label;

            html += '<div class="fusion-skill ' + (mastered ? 'mastered' : 'not-mastered') + (isSelected ? ' selected' : '') + '" ';
            html += 'onclick="VelvetRoom.selectIngredient(\'' + skillKey + '\')">';
            html += '<div class="fusion-skill-name">' + skillLabel + '</div>';
            html += '<div class="fusion-skill-level">' + levelLabel + ' ' + skill.level + (mastered ? ' ✓' : '') + '</div>';
            html += '</div>';
        });

        html += '</div></div>'; // fusion-skills-grid, fusion-skills
        html += '</div>'; // fusion-workspace

        // Unlocked fusions
        var unlockedFusions = fusions.unlocked || [];
        var unlockedTitle = 'Unlocked Fusions';
        if (unlockedFusions.length > 0) {
            html += '<div class="velvet-section-title">' + unlockedTitle + '</div>';
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
        var recipesTitle = 'Fusion Recipes';
        var readyLabel = 'Ready to fuse!';
        var requiresLabel = 'Requires LV3 in both skills';

        html += '<div class="velvet-section-title">' + recipesTitle + '</div>';
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
                var skillInfo = T ? T.getSkillInfo(ing) : null;
                var ingLabel = skillInfo ? skillInfo.label : (def ? def.label : ing);
                var mastered = isSkillMastered(ing);
                html += '<span class="recipe-ing ' + (mastered ? 'mastered' : '') + '">' + ingLabel + '</span>';
                if (idx === 0) html += ' + ';
            });
            html += '</div>';
            if (unlocked) {
                html += '<div class="recipe-status">\u2713 Unlocked</div>';
            } else if (canMake) {
                html += '<div class="recipe-status available">' + readyLabel + '</div>';
            } else {
                html += '<div class="recipe-status">' + requiresLabel + '</div>';
            }
            html += '</div></div>';
        });
        html += '</div>';

        return html;
    }

    function renderVelvetRoom() {
        var view = document.getElementById('view-velvet');
        if (!view || !window.GameState) return;

        var T = window.ThemeRegistry;

        var personas = window.GameState.getPersonas();
        var personaDefs = window.GameState.getPersonaDefs();
        var skills = window.GameState.getSkills();
        var skillDefs = window.GameState.getSkillDefs();

        var discoveredCount = Object.keys(personas).length;
        var totalCount = Object.keys(personaDefs).length;
        var totalMasteryXP = 0;
        Object.keys(personas).forEach(function(k) {
            totalMasteryXP += personas[k].masteryXP || 0;
        });

        var html = '<div class="velvet-room-view">';

        // Header
        var pageTitle = 'Velvet Room';
        var pageSubtitle = 'Persona Compendium';

        html += '<div class="velvet-header">' +
            '<div class="velvet-title view-title">' + pageTitle + '</div>' +
            '<div class="velvet-subtitle">' + pageSubtitle + '</div>' +
        '</div>';

        // Stats
        var stat1Label = 'Discovered';
        var stat2Label = 'Completion';
        var stat3Label = 'Total Mastery XP';
        var stat3Value = totalMasteryXP;

        html += '<div class="compendium-stats">' +
            '<div class="compendium-stat"><div class="compendium-stat-value">' + discoveredCount + '/' + totalCount + '</div><div class="compendium-stat-label">' + stat1Label + '</div></div>' +
            '<div class="compendium-stat"><div class="compendium-stat-value">' + Math.round(discoveredCount / totalCount * 100) + '%</div><div class="compendium-stat-label">' + stat2Label + '</div></div>' +
            '<div class="compendium-stat"><div class="compendium-stat-value">' + stat3Value + '</div><div class="compendium-stat-label">' + stat3Label + '</div></div>' +
        '</div>';

        // Fusion section
        html += renderFusionSection();

        // Persona grid
        var gridTitle = 'Personas';
        html += '<div class="velvet-section-title">' + gridTitle + '</div>';
        html += '<div class="persona-grid">';

        // Sort: discovered first, then alphabetically
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
            var skillDef = skillDefs[key];
            var masteryPct = persona ? Math.min(100, Math.round((persona.masteryXP || 0) / 500 * 100)) : 0;

            // P5 Persona card
            var icons = {
                'Fool': '\u2606', 'Magician': '\u2605', 'Priestess': '\u263E',
                'Lovers': '\u2665', 'Chariot': '\u2694', 'Temperance': '\u2696',
                'Hanged Man': '\u2629', 'Death': '\u2620', 'Star': '\u2605',
                'Judgement': '\u2696', 'Tower': '\u26A1', 'Strength': '\u2694',
                'Empress': '\u2654', 'Hierophant': '\u2638', 'Fortune': '\u2740',
                'Hermit': '\u263C'
            };
            var icon = icons[def.arcana] || '\u2605';

            html += '<div class="persona-card ' + (discovered ? '' : 'locked') + '" data-skill="' + key + '">';
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

        var title = 'Fusion Complete!';
        var challengesLabel = 'New Challenges Unlocked:';
        var btnLabel = 'Excellent';

        var overlay = document.createElement('div');
        overlay.className = 'fusion-success-overlay';
        overlay.innerHTML = '<div class="fusion-success-modal">' +
            '<div class="fusion-success-icon">' + recipe.icon + '</div>' +
            '<div class="fusion-success-title">' + title + '</div>' +
            '<div class="fusion-success-name">' + recipe.name + '</div>' +
            '<div class="fusion-success-desc">' + recipe.description + '</div>' +
            '<div class="fusion-success-challenges">' +
            '<div class="challenges-label">' + challengesLabel + '</div>' +
            recipe.challenges.map(function(c) { return '<div class="challenge-item">' + c + '</div>'; }).join('') +
            '</div>' +
            '<button class="fusion-success-btn" onclick="this.closest(\'.fusion-success-overlay\').remove()">' + btnLabel + '</button>' +
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

    // Render detailed Persona profile
    function renderGeneralDossier(skillKey) {
        var personas = window.GameState.getPersonas();
        var personaDefs = window.GameState.getPersonaDefs();
        var skills = window.GameState.getSkills();
        var skillDefs = window.GameState.getSkillDefs();

        var def = personaDefs[skillKey];
        var persona = personas[skillKey];
        var skill = skills[skillKey] || { level: 1 };
        var skillDef = skillDefs[skillKey];

        if (!def || !persona) return;

        // Build dossier content
        var name = def.name;
        var title = def.title || '';
        var branch = def.arcana || '';
        var techLabel = skillDef ? skillDef.label : skillKey;
        var rankInsignia = '\u2605';
        var rankName = 'Level ' + skill.level;

        // Calculate stats from game state (approximate from available data)
        var masteryXP = persona.masteryXP || 0;
        var operations = Math.floor(masteryXP / 30); // Rough estimate
        var sRankCount = Math.floor(operations * 0.15); // Assume 15% S-rank
        var aRankCount = Math.floor(operations * 0.30);

        // Famous quotes (add some flavor)
        var quotes = {
            'variables': '"Every great strategy begins with a single declaration."',
            'for-loops': '"Victory belongs to the most persevering."',
            'conditionals': '"In war, the first decision is often the most crucial."',
            'functions': '"Divide your forces to conquer, unite them to defend."',
            'strings': '"Words are the ammunition of diplomacy."',
            'slices': '"Flexibility is the key to air power."',
            'maps': '"Know the terrain, know the victory."',
            'pointers': '"A nil pointer is not a mistake\u2014it is an opportunity for clarity."',
            'structs': '"Structure is the foundation of all great empires."',
            'methods': '"Attach your methods to your purpose, and you shall never fail."',
            'interfaces': '"Adaptability is the supreme virtue of a commander."'
        };
        var quote = quotes[skillKey] || '"Excellence is not a skill, it is an attitude."';

        // Build overlay HTML
        var html = '<div class="dossier-overlay" onclick="if(event.target===this)VelvetRoom.closeDossier()">';
        html += '<div class="dossier-modal">';

        // Header
        html += '<div class="dossier-header">';
        html += '<button class="dossier-close" onclick="VelvetRoom.closeDossier()">\u2715</button>';
        html += '<div class="dossier-title">\u{1F4DC} PERSONA PROFILE</div>';
        html += '</div>';

        // Main content
        html += '<div class="dossier-content">';

        // Portrait section
        html += '<div class="dossier-portrait-section">';
        html += '<div class="dossier-portrait">';
        html += '<div class="portrait-insignia">' + rankInsignia + '</div>';
        html += '<div class="portrait-icon">\u{1F464}</div>';
        html += '</div>';
        html += '<div class="dossier-basic-info">';
        html += '<div class="dossier-name">' + name + '</div>';
        html += '<div class="dossier-subtitle">"' + title + '"</div>';
        html += '<div class="dossier-branch">Arcana: ' + branch + '</div>';
        html += '<div class="dossier-rank">Level: <strong>' + rankName + '</strong></div>';
        html += '<div class="dossier-tech">Skill: ' + techLabel + '</div>';
        html += '</div>';
        html += '</div>';

        // Statistics
        html += '<div class="dossier-section">';
        html += '<div class="dossier-section-title">STATISTICS</div>';
        html += '<div class="dossier-stats-grid">';
        html += '<div class="dossier-stat"><span>Exercises</span><span>' + operations + '</span></div>';
        html += '<div class="dossier-stat"><span>S-Rank</span><span>' + sRankCount + '</span></div>';
        html += '<div class="dossier-stat"><span>A-Rank</span><span>' + aRankCount + '</span></div>';
        html += '<div class="dossier-stat"><span>Days Active</span><span>' + Math.max(1, Math.floor(masteryXP / 50)) + '</span></div>';
        html += '</div>';
        html += '</div>';

        // Active Abilities
        html += '<div class="dossier-section">';
        html += '<div class="dossier-section-title">UNLOCKED BONUSES</div>';
        html += '<div class="abilities-list">';
        [10, 20, 30, 40, 50].forEach(function(lvl) {
            var abilityNames = {
                10: 'Concept Tutorial',
                20: 'Reduced Hint Penalty',
                30: 'Timer Extended',
                40: 'XP Multiplier 1.1x',
                50: 'Persona Evolution'
            };
            var unlocked = skill.level >= lvl;
            var abilityName = abilityNames[lvl];
            html += '<div class="ability-item ' + (unlocked ? 'unlocked' : 'locked') + '">';
            html += '<span class="ability-check">' + (unlocked ? '\u2713' : '\u25CB') + '</span>';
            html += '<span class="ability-name">' + abilityName + '</span>';
            html += '<span class="ability-level">LV ' + lvl + '</span>';
            html += '</div>';
        });
        html += '</div>';
        html += '</div>';

        // Motto
        html += '<div class="dossier-section">';
        html += '<div class="dossier-section-title">MOTTO</div>';
        html += '<div class="dossier-quote">' + quote + '</div>';
        html += '</div>';

        html += '</div>'; // dossier-content

        // Footer
        html += '<div class="dossier-footer">';
        html += '<button class="dossier-btn" onclick="VelvetRoom.closeDossier();if(window.App)window.App.navigateTo(\'skill-' + skillKey + '\')">\u{1F3AF} Train This Skill</button>';
        html += '</div>';

        html += '</div>'; // dossier-modal
        html += '</div>'; // dossier-overlay

        // Create and append overlay
        var overlay = document.createElement('div');
        overlay.id = 'general-dossier-overlay';
        overlay.innerHTML = html;
        document.body.appendChild(overlay);

        // Add styles if not already present
        if (!document.getElementById('dossier-styles')) {
            var style = document.createElement('style');
            style.id = 'dossier-styles';
            style.textContent = '.dossier-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:9999}' +
                '.dossier-modal{background:var(--bg-card);border:2px solid var(--border-color);border-radius:12px;max-width:500px;width:90%;max-height:85vh;overflow-y:auto;position:relative}' +
                '.dossier-header{padding:1rem;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center}' +
                '.dossier-title{font-weight:bold;color:var(--gold)}' +
                '.dossier-close{background:none;border:none;color:var(--text-dim);font-size:1.5rem;cursor:pointer}' +
                '.dossier-content{padding:1.5rem}' +
                '.dossier-portrait-section{display:flex;gap:1rem;margin-bottom:1.5rem}' +
                '.dossier-portrait{width:80px;height:100px;background:var(--surface-color);border:2px solid var(--gold);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center}' +
                '.portrait-insignia{font-size:1.2rem;color:var(--gold)}' +
                '.portrait-icon{font-size:2rem}' +
                '.dossier-basic-info{flex:1}' +
                '.dossier-name{font-size:1.25rem;font-weight:bold;color:var(--text)}' +
                '.dossier-subtitle{font-size:0.9rem;color:var(--accent);font-style:italic}' +
                '.dossier-branch,.dossier-rank,.dossier-tech{font-size:0.8rem;color:var(--text-dim);margin-top:0.25rem}' +
                '.dossier-section{margin-top:1.25rem;padding-top:1rem;border-top:1px solid var(--border-color)}' +
                '.dossier-section-title{font-size:0.75rem;font-weight:bold;color:var(--text-dim);letter-spacing:1px;margin-bottom:0.75rem}' +
                '.dossier-stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem}' +
                '.dossier-stat{display:flex;justify-content:space-between;font-size:0.85rem;padding:0.5rem;background:var(--surface-color);border-radius:4px}' +
                '.dossier-stat span:last-child{color:var(--gold);font-family:var(--font-mono)}' +
                '.rank-progress{margin-bottom:1rem}' +
                '.rank-progress-bar{height:8px;background:var(--bg-dark);border-radius:4px;overflow:hidden}' +
                '.rank-progress-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--accent))}' +
                '.rank-progress-label{font-size:0.75rem;color:var(--text-dim);text-align:center;margin-top:0.25rem}' +
                '.rank-ladder{display:flex;align-items:center;justify-content:center;gap:0.25rem;flex-wrap:wrap;font-size:0.8rem}' +
                '.rank-step{color:var(--text-dim)}.rank-step.achieved{color:var(--gold)}.rank-step.current{color:var(--accent);font-weight:bold}' +
                '.rank-connector{color:var(--border-color)}.rank-connector.achieved{color:var(--gold)}' +
                '.abilities-list{display:flex;flex-direction:column;gap:0.5rem}' +
                '.ability-item{display:flex;align-items:center;gap:0.5rem;font-size:0.85rem;padding:0.5rem;background:var(--surface-color);border-radius:4px}' +
                '.ability-item.locked{opacity:0.5}' +
                '.ability-check{color:var(--success)}.ability-item.locked .ability-check{color:var(--text-dim)}' +
                '.ability-name{flex:1}' +
                '.ability-level{font-size:0.75rem;color:var(--text-dim)}' +
                '.dossier-bio{font-size:0.85rem;color:var(--text-secondary);line-height:1.5;font-style:italic}' +
                '.dossier-quote{font-size:0.9rem;color:var(--accent);font-style:italic;text-align:center;padding:1rem;background:var(--surface-color);border-radius:8px;border-left:3px solid var(--gold)}' +
                '.dossier-footer{padding:1rem;border-top:1px solid var(--border-color);text-align:center}' +
                '.dossier-btn{background:var(--accent);color:var(--bg-dark);border:none;padding:0.75rem 1.5rem;border-radius:8px;font-weight:bold;cursor:pointer}' +
                '.dossier-btn:hover{opacity:0.9}';
            document.head.appendChild(style);
        }
    }

    function closeDossier() {
        var overlay = document.getElementById('general-dossier-overlay');
        if (overlay) overlay.remove();
    }

    // Update persona card rendering to be clickable for dossier
    function makeCardsClickable() {
        document.querySelectorAll('.persona-card:not(.locked), .general-card:not(.locked)').forEach(function(card) {
            var skillKey = card.dataset.skill;
            if (skillKey) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', function() {
                    renderGeneralDossier(skillKey);
                });
            }
        });
    }

    // Export with generic name, keep alias for compatibility
    var api = {
        render: function() {
            renderVelvetRoom();
            // After rendering, make persona/general cards clickable
            setTimeout(makeCardsClickable, 0);
        },
        renderVelvetRoom: function() { // Alias for existing code
            this.render();
        },
        selectIngredient: selectIngredient,
        removeIngredient: removeIngredient,
        fuse: fuse,
        getFusionRecipes: function() { return FUSION_RECIPES; },
        isFusionUnlocked: isFusionUnlocked,
        canFuse: canFuse,
        renderDossier: renderGeneralDossier,
        renderGeneralDossier: renderGeneralDossier, // Alias
        closeDossier: closeDossier
    };

    // Generic name
    window.Compendium = api;
    // Legacy alias for backwards compatibility
    window.VelvetRoom = api;
})();
