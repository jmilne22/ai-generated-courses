/**
 * Go Grind - Tech Tree Visualization (4X Theme)
 * Visual representation of skill/technology dependencies and progression.
 */
(function() {
    'use strict';

    // Tech tree structure - skills organized by tier with dependencies
    // Based on existing techTier data from theme-4x-strategy.js
    var TECH_TREE = {
        tiers: [
            {
                id: 'I',
                name: 'Era I - Foundations',
                description: 'Basic programming concepts',
                skills: ['variables', 'for-loops', 'conditionals']
            },
            {
                id: 'II',
                name: 'Era II - Expansion',
                description: 'Data structures and control flow',
                skills: ['slices', 'maps', 'functions', 'strings', 'switch']
            },
            {
                id: 'III',
                name: 'Era III - Specialization',
                description: 'Algorithmic patterns',
                skills: ['two-pointers', 'sliding-window', 'map-tracking', 'recursion', 'binary-search', 'stack', 'sorting', 'string-building']
            },
            {
                id: 'IV',
                name: 'Era IV - Advanced',
                description: 'Complex data structures and memory',
                skills: ['linked-list', 'bit-manipulation', 'pointers', 'structs', 'methods']
            },
            {
                id: 'V',
                name: 'Era V - Mastery',
                description: 'Abstraction and polymorphism',
                skills: ['interfaces', 'embedding']
            }
        ],
        // Suggested dependencies (for visual connections)
        // These show logical learning paths, not hard requirements
        dependencies: {
            'slices': ['variables', 'for-loops'],
            'maps': ['variables', 'conditionals'],
            'functions': ['variables', 'conditionals'],
            'strings': ['variables', 'for-loops'],
            'switch': ['conditionals'],
            'two-pointers': ['slices', 'for-loops'],
            'sliding-window': ['slices', 'for-loops'],
            'map-tracking': ['maps'],
            'recursion': ['functions', 'conditionals'],
            'binary-search': ['slices', 'conditionals'],
            'stack': ['slices'],
            'sorting': ['slices', 'for-loops'],
            'string-building': ['strings', 'for-loops'],
            'linked-list': ['structs', 'pointers'],
            'bit-manipulation': ['variables', 'conditionals'],
            'pointers': ['variables', 'functions'],
            'structs': ['variables', 'maps'],
            'methods': ['structs', 'functions'],
            'interfaces': ['methods', 'structs'],
            'embedding': ['structs', 'methods']
        }
    };

    /**
     * Get skill status for tech tree display
     */
    function getSkillStatus(skillKey) {
        if (!window.GameState) return { level: 1, status: 'locked' };

        var skill = window.GameState.getSkill(skillKey);
        var level = skill.level || 1;

        // Status thresholds
        if (level >= 25) return { level: level, status: 'mastered' };
        if (level >= 10) return { level: level, status: 'advanced' };
        if (level >= 5) return { level: level, status: 'proficient' };
        if (level >= 2) return { level: level, status: 'learning' };
        return { level: level, status: 'discovered' };
    }

    /**
     * Get tier completion percentage
     */
    function getTierCompletion(tier) {
        var total = tier.skills.length;
        var completed = 0;
        var totalLevels = 0;

        tier.skills.forEach(function(skillKey) {
            var status = getSkillStatus(skillKey);
            totalLevels += status.level;
            if (status.level >= 10) completed++;
        });

        return {
            completed: completed,
            total: total,
            pct: Math.round(completed / total * 100),
            avgLevel: Math.round(totalLevels / total)
        };
    }

    /**
     * Render the tech tree
     */
    function renderTechTree() {
        var T = window.ThemeRegistry;
        var skillDefs = window.GameState ? window.GameState.getSkillDefs() : {};

        var html = '<div class="tech-tree">';

        // Header
        html += '<div class="tech-tree-header">';
        html += '<h2>Technology Research Tree</h2>';
        html += '<p class="tech-tree-subtitle">Master technologies to unlock strategic advantages</p>';
        html += '</div>';

        // Legend
        html += '<div class="tech-tree-legend">';
        html += '<span class="legend-item discovered"><span class="legend-dot"></span> Discovered</span>';
        html += '<span class="legend-item learning"><span class="legend-dot"></span> Learning (2+)</span>';
        html += '<span class="legend-item proficient"><span class="legend-dot"></span> Proficient (5+)</span>';
        html += '<span class="legend-item advanced"><span class="legend-dot"></span> Advanced (10+)</span>';
        html += '<span class="legend-item mastered"><span class="legend-dot"></span> Mastered (25+)</span>';
        html += '</div>';

        // Tiers
        TECH_TREE.tiers.forEach(function(tier, tierIdx) {
            var completion = getTierCompletion(tier);

            html += '<div class="tech-tier" data-tier="' + tier.id + '">';

            // Tier header
            html += '<div class="tech-tier-header">';
            html += '<div class="tier-name">' + tier.name + '</div>';
            html += '<div class="tier-meta">';
            html += '<span class="tier-desc">' + tier.description + '</span>';
            html += '<span class="tier-progress">' + completion.completed + '/' + completion.total + ' researched (Avg Rank ' + completion.avgLevel + ')</span>';
            html += '</div>';
            html += '</div>';

            // Skills in this tier
            html += '<div class="tech-tier-skills">';

            tier.skills.forEach(function(skillKey) {
                var status = getSkillStatus(skillKey);
                var skillInfo = T && T.getSkillInfo ? T.getSkillInfo(skillKey) : null;
                var skillDef = skillDefs[skillKey] || {};
                var label = skillInfo ? skillInfo.label : skillDef.label || skillKey;
                var personaInfo = T && T.getPersonaInfo ? T.getPersonaInfo(skillKey) : null;
                var generalName = personaInfo ? personaInfo.name : '';

                // Get dependencies for this skill
                var deps = TECH_TREE.dependencies[skillKey] || [];
                var depsStatus = deps.map(function(d) {
                    return getSkillStatus(d);
                });
                var allDepsAdvanced = depsStatus.every(function(d) { return d.level >= 5; });

                html += '<div class="tech-node ' + status.status + '" data-skill="' + skillKey + '">';

                // Connection indicators (simplified)
                if (deps.length > 0) {
                    html += '<div class="tech-deps">';
                    html += '<span class="deps-label">Requires: </span>';
                    html += deps.map(function(d) {
                        var dStatus = getSkillStatus(d);
                        var dInfo = T && T.getSkillInfo ? T.getSkillInfo(d) : null;
                        var dLabel = dInfo ? dInfo.label : (skillDefs[d] ? skillDefs[d].label : d);
                        return '<span class="dep-tag ' + dStatus.status + '">' + dLabel + '</span>';
                    }).join(' ');
                    html += '</div>';
                }

                html += '<div class="tech-node-content">';
                html += '<div class="tech-name">' + label + '</div>';
                html += '<div class="tech-level">Rank ' + status.level + '</div>';
                if (generalName) {
                    html += '<div class="tech-general">' + generalName + '</div>';
                }
                html += '</div>';

                // Progress bar within node
                var pctToNext = 0;
                if (window.GameState) {
                    var skill = window.GameState.getSkill(skillKey);
                    var xpNeeded = window.GameState.skillXPForLevel(skill.level);
                    pctToNext = Math.round((skill.xp / xpNeeded) * 100);
                }
                html += '<div class="tech-node-bar"><div class="tech-node-bar-fill" style="width:' + pctToNext + '%"></div></div>';

                html += '</div>'; // tech-node
            });

            html += '</div>'; // tech-tier-skills
            html += '</div>'; // tech-tier
        });

        html += '</div>'; // tech-tree

        return html;
    }

    /**
     * Render tech tree into a view
     */
    function renderIntoView(viewElement) {
        if (!viewElement) return;
        viewElement.innerHTML = renderTechTree();

        // Bind click events to navigate to skill pages
        viewElement.querySelectorAll('.tech-node').forEach(function(node) {
            node.addEventListener('click', function() {
                var skillKey = node.dataset.skill;
                if (skillKey && window.App) {
                    window.App.navigateTo('skill-' + skillKey);
                }
            });
        });
    }

    // Public API
    window.TechTree = {
        render: renderTechTree,
        renderIntoView: renderIntoView,
        getTierCompletion: getTierCompletion,
        getSkillStatus: getSkillStatus,
        TREE: TECH_TREE
    };

})();
