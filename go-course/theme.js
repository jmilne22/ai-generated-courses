// Theme toggle functionality for Go Course
(function() {
    // Check for saved theme preference or default to dark
    function getPreferredTheme() {
        const saved = localStorage.getItem('go-course-theme');
        if (saved) {
            return saved;
        }
        // Default to dark mode (the original theme)
        return 'dark';
    }

    // Apply theme to document
    function setTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('go-course-theme', theme);
        updateToggleIcon();
    }

    // Update toggle button icon
    function updateToggleIcon() {
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            toggle.innerHTML = isLight ? '🌙' : '☀️';
            toggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
        }
    }

    // Initialize theme immediately to prevent flash
    setTheme(getPreferredTheme());

    // Create and inject toggle button when DOM is ready
    function createToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Toggle light mode');
        
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        toggle.innerHTML = isLight ? '🌙' : '☀️';
        
        toggle.addEventListener('click', function() {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'light' ? 'dark' : 'light');
        });
        
        document.body.appendChild(toggle);
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggle);
    } else {
        createToggle();
    }

    // Listen for system theme changes (only if no saved preference)
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
        if (!localStorage.getItem('go-course-theme')) {
            setTheme(e.matches ? 'light' : 'dark');
        }
    });
})();

