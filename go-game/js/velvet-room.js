/**
 * Go Grind - Velvet Room (Persona Compendium)
 */
(function() {
    'use strict';

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

    window.VelvetRoom = {
        renderVelvetRoom: renderVelvetRoom
    };
})();
