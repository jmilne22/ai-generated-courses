// Service Worker for Go Course — offline support
// Cache-first strategy for static assets

var CACHE_NAME = 'go-course-v3';

var ASSETS = [
    'index.html',
    'style.css',
    'course.js',
    'progress.js',
    'srs.js',
    'streaks.js',
    'data-backup.js',
    'analytics.js',
    'analytics.html',
    'flashcards.js',
    'flashcards.html',
    'daily-practice.js',
    'daily-practice.html',
    'exercise-renderer.js',
    'module-loader.js',
    'theme.js',
    'sidebar.js',
    'module0.html',
    'module1.html',
    'module2.html',
    'module3.html',
    'module4.html',
    'module5.html',
    'module6.html',
    'module7.html',
    'module8.html',
    'module9.html',
    'module10.html',
    'module11.html',
    'module12.html',
    'module13.html',
    'module14.html',
    'module15.html',
    'module16.html',
    'module17.html',
    'project-taskrunner.html',
    'project-filebrowser.html',
    'project-githubcli.html',
    'project-downloader.html',
    'data/module1-variants.js',
    'data/module2-variants.js',
    'data/module3-variants.js',
    'data/module4-variants.js',
    'data/module5-variants.js',
    'data/module6-variants.js',
    'data/module9-variants.js',
    'data/module10-variants.js',
    'data/module12-variants.js',
    'data/module14-variants.js',
    'data/module15-variants.js',
    'data/module16-variants.js',
    'data/module17-variants.js'
];

// Install: cache all assets
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(ASSETS);
        })
    );
});

// Fetch: cache-first, fall back to network
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(cached) {
            return cached || fetch(event.request).then(function(response) {
                // Cache new successful responses
                if (response.ok) {
                    var clone = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            });
        })
    );
});

// Activate: clean old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(names) {
            return Promise.all(
                names.filter(function(name) {
                    return name !== CACHE_NAME;
                }).map(function(name) {
                    return caches.delete(name);
                })
            );
        })
    );
});
