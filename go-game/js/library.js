/**
 * Go Grind - Library / Reference Section
 * Concept-based reference material, not tutorials
 */
(function() {
    'use strict';

    var libraryData = null;
    var currentCategory = 'all';
    var currentArticle = null;

    // Labels
    function getLabels() {
        return {
            title: 'Thieves\' Archive',
            subtitle: 'Phantom Knowledge Vault',
            categories: 'Categories',
            allCategory: 'All',
            articles: 'Articles',
            readTime: 'Read time',
            relatedOps: 'Related Exercises',
            backToList: '\u2190 Back',
            noArticles: 'No articles found.',
            searchPlaceholder: 'Search...',
            conceptLabel: 'Concept',
            difficulty: 'Level',
            // Category names
            catNames: {
                'fundamentals': 'Fundamentals',
                'data-structures': 'Data Structures',
                'concurrency': 'Concurrency',
                'patterns': 'Patterns',
                'idioms': 'Go Idioms',
                'stdlib': 'Standard Library',
                'testing': 'Testing',
                'performance': 'Performance'
            }
        };
    }

    // Get icon for category
    function getCategoryIcon(category) {
        var icons = {
            'fundamentals': '\u{1F4D6}',
            'data-structures': '\u{1F5C2}',
            'concurrency': '\u{1F504}',
            'patterns': '\u{1F9E9}',
            'idioms': '\u{1F4A1}',
            'stdlib': '\u{1F4DA}',
            'testing': '\u{1F9EA}',
            'performance': '\u{1F680}'
        };
        return icons[category] || '\u{1F4C4}';
    }

    // Load library data
    function loadLibrary() {
        // Check if we have cached data
        if (libraryData) {
            renderLibrary();
            return;
        }

        // Try to load from library.json
        fetch('data/library.json')
            .then(function(res) {
                if (!res.ok) throw new Error('Library not found');
                return res.json();
            })
            .then(function(data) {
                libraryData = data;
                renderLibrary();
            })
            .catch(function() {
                // No library data yet - show placeholder
                renderEmptyLibrary();
            });
    }

    function renderEmptyLibrary() {
        var view = document.getElementById('view-library');
        if (!view) return;

        var L = getLabels();

        var html = '<div class="library-container">';
        html += '<div class="library-header">';
        html += '<h2 class="view-title">' + L.title + '</h2>';
        html += '<p class="library-subtitle">' + L.subtitle + '</p>';
        html += '</div>';

        html += '<div class="library-empty">';
        html += '<div class="empty-icon">\u{1F4D6}</div>';
        html += '<p>The archive is being prepared...</p>';
        html += '<p style="color:var(--text-dim);font-size:0.85rem">' +
            'Add reference content to <code>data/library.json</code></p>';
        html += '</div>';
        html += '</div>';

        view.innerHTML = html;
    }

    function renderLibrary() {
        var view = document.getElementById('view-library');
        if (!view || !libraryData) return;

        // If viewing an article, render that instead
        if (currentArticle) {
            renderArticle(currentArticle);
            return;
        }

        var L = getLabels();

        var html = '<div class="library-container">';

        // Header
        html += '<div class="library-header">';
        html += '<h2 class="view-title">' + L.title + '</h2>';
        html += '<p class="library-subtitle">' + L.subtitle + '</p>';
        html += '</div>';

        // Search bar
        html += '<div class="library-search">';
        html += '<input type="text" id="library-search-input" placeholder="' + L.searchPlaceholder + '" />';
        html += '</div>';

        // Category filter
        var categories = getCategories();
        html += '<div class="library-categories">';
        html += '<span class="category-label">' + L.categories + ':</span>';
        html += '<div class="category-buttons">';
        html += '<button class="category-btn' + (currentCategory === 'all' ? ' active' : '') + '" data-category="all">' + L.allCategory + '</button>';
        categories.forEach(function(cat) {
            var catName = L.catNames[cat] || cat;
            var icon = getCategoryIcon(cat);
            html += '<button class="category-btn' + (currentCategory === cat ? ' active' : '') + '" data-category="' + cat + '">' +
                icon + ' ' + catName + '</button>';
        });
        html += '</div></div>';

        // Articles grid
        var articles = getFilteredArticles();
        html += '<div class="library-articles">';

        if (articles.length === 0) {
            html += '<p class="no-articles">' + L.noArticles + '</p>';
        } else {
            articles.forEach(function(article) {
                html += renderArticleCard(article);
            });
        }

        html += '</div>';
        html += '</div>';

        view.innerHTML = html;
        bindLibraryEvents();
    }

    function getCategories() {
        if (!libraryData || !libraryData.articles) return [];
        var cats = {};
        libraryData.articles.forEach(function(a) {
            if (a.category) cats[a.category] = true;
        });
        return Object.keys(cats).sort();
    }

    function getFilteredArticles(searchTerm) {
        if (!libraryData || !libraryData.articles) return [];

        var articles = libraryData.articles;

        // Filter by category
        if (currentCategory !== 'all') {
            articles = articles.filter(function(a) {
                return a.category === currentCategory;
            });
        }

        // Filter by search term
        if (searchTerm) {
            var term = searchTerm.toLowerCase();
            articles = articles.filter(function(a) {
                return (a.title && a.title.toLowerCase().indexOf(term) !== -1) ||
                       (a.summary && a.summary.toLowerCase().indexOf(term) !== -1) ||
                       (a.tags && a.tags.some(function(t) { return t.toLowerCase().indexOf(term) !== -1; }));
            });
        }

        // Sort by skill level then alphabetically
        articles.sort(function(a, b) {
            var levelOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
            var aLevel = levelOrder[a.level] || 2;
            var bLevel = levelOrder[b.level] || 2;
            if (aLevel !== bLevel) return aLevel - bLevel;
            return (a.title || '').localeCompare(b.title || '');
        });

        return articles;
    }

    function renderArticleCard(article) {
        var L = getLabels();

        var icon = getCategoryIcon(article.category);
        var catName = L.catNames[article.category] || article.category;

        // Level styling - capitalize the level name
        var levelClass = 'level-' + (article.level || 'intermediate');
        var levelLabel = (article.level || 'intermediate');
        levelLabel = levelLabel.charAt(0).toUpperCase() + levelLabel.slice(1);

        var html = '<div class="library-card" data-article-id="' + article.id + '">';

        // Card header
        html += '<div class="library-card-header">';
        html += '<span class="library-card-category">' + icon + ' ' + catName + '</span>';
        html += '<span class="library-card-level ' + levelClass + '">' + levelLabel + '</span>';
        html += '</div>';

        // Card body
        html += '<h3 class="library-card-title">' + escapeHtml(article.title) + '</h3>';
        if (article.summary) {
            html += '<p class="library-card-summary">' + escapeHtml(article.summary) + '</p>';
        }

        // Card footer
        html += '<div class="library-card-footer">';
        if (article.readTime) {
            html += '<span class="library-card-time">' + L.readTime + ': ' + article.readTime + '</span>';
        }
        if (article.skill) {
            html += '<span class="library-card-skill">' + L.conceptLabel + ': ' + article.skill + '</span>';
        }
        html += '</div>';

        // Tags
        if (article.tags && article.tags.length > 0) {
            html += '<div class="library-card-tags">';
            article.tags.slice(0, 4).forEach(function(tag) {
                html += '<span class="library-tag">' + escapeHtml(tag) + '</span>';
            });
            html += '</div>';
        }

        html += '</div>';
        return html;
    }

    function renderArticle(articleId) {
        var view = document.getElementById('view-library');
        if (!view || !libraryData) return;

        var article = libraryData.articles.find(function(a) { return a.id === articleId; });
        if (!article) {
            currentArticle = null;
            renderLibrary();
            return;
        }

        var L = getLabels();

        var icon = getCategoryIcon(article.category);
        var catName = L.catNames[article.category] || article.category;

        var html = '<div class="library-article-view">';

        // Back button
        html += '<button class="library-back-btn">' + L.backToList + '</button>';

        // Article header
        html += '<div class="library-article-header">';
        html += '<span class="library-article-category">' + icon + ' ' + catName + '</span>';
        html += '<h1 class="library-article-title">' + escapeHtml(article.title) + '</h1>';
        if (article.summary) {
            html += '<p class="library-article-summary">' + escapeHtml(article.summary) + '</p>';
        }

        // Meta info
        html += '<div class="library-article-meta">';
        if (article.readTime) {
            html += '<span>' + L.readTime + ': ' + article.readTime + '</span>';
        }
        if (article.skill) {
            html += '<span>' + L.conceptLabel + ': ' + article.skill + '</span>';
        }
        if (article.level) {
            var levelLabel = article.level.charAt(0).toUpperCase() + article.level.slice(1);
            html += '<span>' + L.difficulty + ': ' + levelLabel + '</span>';
        }
        html += '</div>';

        // Study button
        var studyLabel = 'Start Study Session';
        var studyIcon = '\u{1F4D6}';
        html += '<button class="library-study-btn" data-article-id="' + article.id + '">';
        html += '<span class="study-icon">' + studyIcon + '</span>';
        html += '<span>' + studyLabel + '</span>';
        html += '</button>';

        html += '</div>';

        // Article content
        html += '<div class="library-article-content">';
        if (article.content) {
            // Parse markdown content
            html += parseMarkdown(article.content);
        } else if (article.sections) {
            // Render structured sections
            article.sections.forEach(function(section) {
                html += '<div class="library-section">';
                if (section.title) {
                    html += '<h2>' + escapeHtml(section.title) + '</h2>';
                }
                if (section.content) {
                    html += parseMarkdown(section.content);
                }
                if (section.code) {
                    html += '<pre><code>' + escapeHtml(section.code) + '</code></pre>';
                }
                html += '</div>';
            });
        }
        html += '</div>';

        // Related concepts - link to training with concept filter
        if (article.relatedConcepts && article.relatedConcepts.length > 0) {
            html += '<div class="library-related">';
            html += '<h3>' + L.relatedOps + '</h3>';
            html += '<div class="library-related-list">';
            article.relatedConcepts.forEach(function(concept) {
                html += '<a href="#" class="library-related-link" data-concept="' + concept + '">' + concept + '</a>';
            });
            html += '</div></div>';
        }

        // Tags
        if (article.tags && article.tags.length > 0) {
            html += '<div class="library-article-tags">';
            article.tags.forEach(function(tag) {
                html += '<span class="library-tag">' + escapeHtml(tag) + '</span>';
            });
            html += '</div>';
        }

        html += '</div>';

        view.innerHTML = html;
        bindArticleEvents();
    }

    // Simple markdown parser
    function parseMarkdown(text) {
        if (!text) return '';

        // Escape HTML first
        var html = escapeHtml(text);

        // Code blocks (```)
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, function(match, lang, code) {
            return '<pre><code class="language-' + lang + '">' + code.trim() + '</code></pre>';
        });

        // Inline code (`)
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Headers
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

        // Bold
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        // Unordered lists
        html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

        // Ordered lists
        html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

        // Paragraphs (double newlines)
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';

        // Clean up empty paragraphs
        html = html.replace(/<p>\s*<\/p>/g, '');
        html = html.replace(/<p>\s*(<h[1-3]>)/g, '$1');
        html = html.replace(/(<\/h[1-3]>)\s*<\/p>/g, '$1');
        html = html.replace(/<p>\s*(<pre>)/g, '$1');
        html = html.replace(/(<\/pre>)\s*<\/p>/g, '$1');
        html = html.replace(/<p>\s*(<ul>)/g, '$1');
        html = html.replace(/(<\/ul>)\s*<\/p>/g, '$1');

        return html;
    }

    function escapeHtml(text) {
        if (!text) return '';
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function bindLibraryEvents() {
        // Category buttons
        document.querySelectorAll('.category-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                currentCategory = this.dataset.category;
                if (window.GameAudio) window.GameAudio.playMenuSelect();
                renderLibrary();
            });
        });

        // Article cards
        document.querySelectorAll('.library-card').forEach(function(card) {
            card.addEventListener('click', function() {
                currentArticle = this.dataset.articleId;
                if (window.GameAudio) window.GameAudio.playMenuSelect();
                renderLibrary();
            });
        });

        // Search input
        var searchInput = document.getElementById('library-search-input');
        if (searchInput) {
            var debounceTimer;
            searchInput.addEventListener('input', function() {
                var term = this.value;
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(function() {
                    var articles = getFilteredArticles(term);
                    var container = document.querySelector('.library-articles');
                    if (container) {
                        var L = getLabels();
                        if (articles.length === 0) {
                            container.innerHTML = '<p class="no-articles">' + L.noArticles + '</p>';
                        } else {
                            container.innerHTML = articles.map(renderArticleCard).join('');
                            // Rebind card events
                            container.querySelectorAll('.library-card').forEach(function(card) {
                                card.addEventListener('click', function() {
                                    currentArticle = this.dataset.articleId;
                                    if (window.GameAudio) window.GameAudio.playMenuSelect();
                                    renderLibrary();
                                });
                            });
                        }
                    }
                }, 200);
            });
        }
    }

    function bindArticleEvents() {
        // Back button
        var backBtn = document.querySelector('.library-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                currentArticle = null;
                if (window.GameAudio) window.GameAudio.playMenuSelect();
                renderLibrary();
            });
        }

        // Study button
        var studyBtn = document.querySelector('.library-study-btn');
        if (studyBtn && window.Study) {
            studyBtn.addEventListener('click', function() {
                var articleId = this.dataset.articleId;
                var article = libraryData.articles.find(function(a) { return a.id === articleId; });
                if (article) {
                    if (window.GameAudio) window.GameAudio.playMenuSelect();
                    window.Study.startSession(article);
                }
            });
        }

        // Related exercise links - navigate and filter to concept
        document.querySelectorAll('.library-related-link').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                var concept = this.dataset.concept;

                // Navigate to training ground
                if (window.App) window.App.navigateTo('training');

                // Set the filter after a short delay to let the view render
                setTimeout(function() {
                    if (concept && window.Combat) {
                        window.Combat.setConceptFilter(concept);

                        // Update UI to show active filter
                        var btns = document.querySelectorAll('#challenge-concept-filter .concept-btn');
                        btns.forEach(function(b) {
                            b.classList.remove('active');
                            if (b.dataset.concept === concept) b.classList.add('active');
                        });

                        // Also set warmup filter
                        var warmupBtns = document.querySelectorAll('#warmup-concept-filter .concept-btn');
                        warmupBtns.forEach(function(b) {
                            b.classList.remove('active');
                            if (b.dataset.concept === concept) b.classList.add('active');
                        });

                        // Scroll to challenges section
                        var challengesSection = document.querySelector('#challenges-container');
                        if (challengesSection) {
                            challengesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                }, 150);
            });
        });
    }

    // Public API
    window.Library = {
        load: loadLibrary,
        render: renderLibrary,
        setCategory: function(cat) {
            currentCategory = cat;
            currentArticle = null;
            renderLibrary();
        },
        viewArticle: function(id) {
            currentArticle = id;
            renderLibrary();
        },
        backToList: function() {
            currentArticle = null;
            renderLibrary();
        }
    };
})();
