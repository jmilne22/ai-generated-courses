/**
 * Theme Registry - Central theme management system
 * Handles theme switching, terminology lookups, and theme state
 */
(function() {
    'use strict';

    var themes = {};
    var activeTheme = null;
    var THEME_STORAGE_KEY = 'go-game-theme';

    /**
     * Register a theme with the registry
     */
    function register(theme) {
        if (!theme || !theme.id) {
            console.error('ThemeRegistry: Invalid theme - missing id');
            return;
        }
        themes[theme.id] = theme;
        console.log('ThemeRegistry: Registered theme', theme.id);
    }

    /**
     * Get list of all registered themes
     */
    function getThemes() {
        return Object.keys(themes).map(function(id) {
            return { id: id, name: themes[id].name };
        });
    }

    /**
     * Set the active theme
     */
    function setTheme(themeId, skipTransition) {
        if (!themes[themeId]) {
            console.error('ThemeRegistry: Theme not found:', themeId);
            return false;
        }

        var previousTheme = activeTheme;
        activeTheme = themes[themeId];

        // Add transition class for smooth switching (unless skipped)
        if (!skipTransition && previousTheme && previousTheme.id !== themeId) {
            document.documentElement.classList.add('theme-transitioning');

            // Remove transition class after animation completes
            setTimeout(function() {
                document.documentElement.classList.remove('theme-transitioning');
            }, 350);
        }

        // Update root class for CSS theming
        document.documentElement.className = activeTheme.layoutClass || '';

        // Re-add transition class if it was set (className replacement removes it)
        if (!skipTransition && previousTheme && previousTheme.id !== themeId) {
            document.documentElement.classList.add('theme-transitioning');
            setTimeout(function() {
                document.documentElement.classList.remove('theme-transitioning');
            }, 350);
        }

        // Persist selection
        try {
            localStorage.setItem(THEME_STORAGE_KEY, themeId);
        } catch (e) {
            console.warn('ThemeRegistry: Could not save theme preference');
        }

        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { themeId: themeId, theme: activeTheme, previousThemeId: previousTheme ? previousTheme.id : null }
        }));

        console.log('ThemeRegistry: Theme set to', themeId);
        return true;
    }

    /**
     * Get the active theme object
     */
    function getTheme() {
        return activeTheme;
    }

    /**
     * Get the active theme ID
     */
    function getThemeId() {
        return activeTheme ? activeTheme.id : null;
    }

    /**
     * Get a term from the active theme
     */
    function getTerm(key, fallback) {
        if (!activeTheme || !activeTheme.terms) {
            return fallback || key;
        }
        return activeTheme.terms[key] || fallback || key;
    }

    /**
     * Get a grade label from the active theme
     */
    function getGradeLabel(grade) {
        if (!activeTheme || !activeTheme.grades) {
            return grade;
        }
        return activeTheme.grades[grade] || grade;
    }

    /**
     * Get an icon from the active theme
     */
    function getIcon(key, fallback) {
        if (!activeTheme || !activeTheme.icons) {
            return fallback || '';
        }
        return activeTheme.icons[key] || fallback || '';
    }

    /**
     * Get a color from the active theme
     */
    function getColor(key) {
        if (!activeTheme || !activeTheme.colors) {
            return null;
        }
        return activeTheme.colors[key] || null;
    }

    /**
     * Get stat label from the active theme
     */
    function getStatLabel(statKey) {
        if (!activeTheme || !activeTheme.stats) {
            return statKey;
        }
        return activeTheme.stats[statKey] || statKey;
    }

    /**
     * Get palace/territory info from the active theme
     */
    function getPalaceInfo(palaceKey) {
        if (!activeTheme || !activeTheme.palaces) {
            return null;
        }
        return activeTheme.palaces[palaceKey] || null;
    }

    /**
     * Get confidant/advisor info from the active theme
     */
    function getConfidantInfo(confidantKey) {
        if (!activeTheme || !activeTheme.confidants) {
            return null;
        }
        return activeTheme.confidants[confidantKey] || null;
    }

    /**
     * Get persona/general info for a skill from the active theme
     */
    function getPersonaInfo(skillKey) {
        if (!activeTheme || !activeTheme.personas) {
            return null;
        }
        return activeTheme.personas[skillKey] || null;
    }

    /**
     * Get skill display info from the active theme
     */
    function getSkillInfo(skillKey) {
        if (!activeTheme || !activeTheme.skills) {
            return null;
        }
        return activeTheme.skills[skillKey] || null;
    }

    /**
     * Get military rank for a level (4X theme)
     */
    function getRankForLevel(level) {
        if (!activeTheme || !activeTheme.ranks) {
            return null;
        }
        // Find the highest rank that the level qualifies for
        var rank = null;
        for (var i = 0; i < activeTheme.ranks.length; i++) {
            if (level >= activeTheme.ranks[i].minLevel) {
                rank = activeTheme.ranks[i];
            }
        }
        return rank;
    }

    /**
     * Get era info for a level (4X theme)
     */
    function getEraForLevel(level) {
        if (!activeTheme || !activeTheme.eras) {
            return null;
        }
        var era = null;
        for (var i = 0; i < activeTheme.eras.length; i++) {
            if (level >= activeTheme.eras[i].minLevel) {
                era = activeTheme.eras[i];
            }
        }
        return era;
    }

    /**
     * Initialize theme from localStorage or default
     */
    function init() {
        var savedTheme = null;
        try {
            savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        } catch (e) {}

        // Try to set saved theme, fall back to persona5
        if (savedTheme && themes[savedTheme]) {
            setTheme(savedTheme);
        } else if (themes['persona5']) {
            setTheme('persona5');
        } else {
            // Set first available theme
            var firstTheme = Object.keys(themes)[0];
            if (firstTheme) {
                setTheme(firstTheme);
            }
        }
    }

    // Public API
    window.ThemeRegistry = {
        register: register,
        getThemes: getThemes,
        setTheme: setTheme,
        getTheme: getTheme,
        getThemeId: getThemeId,
        getTerm: getTerm,
        getGradeLabel: getGradeLabel,
        getIcon: getIcon,
        getColor: getColor,
        getStatLabel: getStatLabel,
        getPalaceInfo: getPalaceInfo,
        getConfidantInfo: getConfidantInfo,
        getPersonaInfo: getPersonaInfo,
        getSkillInfo: getSkillInfo,
        getRankForLevel: getRankForLevel,
        getEraForLevel: getEraForLevel,
        init: init
    };

    // Process any themes that were queued before ThemeRegistry loaded
    if (window._pendingThemes && window._pendingThemes.length > 0) {
        window._pendingThemes.forEach(function(theme) {
            register(theme);
        });
        delete window._pendingThemes;
    }

})();
