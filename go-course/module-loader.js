// Generic module data loader
// Loads module-specific data and sets window globals for course.js
// Works with file:// protocol by loading generated JS files

(function() {
    // Bump this when changing course JS/JSON schema to avoid stale file:// caches
    const CACHE_BUST = '20260125';

    // Determine which module we're on
    const moduleNum = document.body?.dataset?.module ||
                      window.location.pathname.match(/module(\d+)/)?.[1] ||
                      '1';

    // Load the generated JS file
    const script = document.createElement('script');
    script.src = `data/module${moduleNum}-variants.js?v=${CACHE_BUST}`;
    script.onload = function() {
        if (window.moduleData) {
            window.conceptLinks = window.moduleData.conceptLinks || {};
            window.sharedContent = window.moduleData.sharedContent || {};
            // Keep variants as the primary payload, but also expose module-level metadata
            // (e.g., ordering, block labels) without coupling course.js to the full moduleData shape.
            window.variantsDataEmbedded = Object.assign({}, window.moduleData.variants || {}, {
                meta: window.moduleData.meta || {}
            });
            window.dispatchEvent(new CustomEvent('moduleDataLoaded'));
        } else {
            console.error('Module data not found after loading script');
        }
    };
    script.onerror = function() {
        console.error(`Failed to load data/module${moduleNum}-variants.js`);
        console.error('Run: node build.js');
    };
    document.head.appendChild(script);
})();
