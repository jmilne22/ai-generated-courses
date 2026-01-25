// Sidebar navigation for Go Course
(function() {
    // All pages in order - projects appear after their parent module
    const pages = [
        { num: '00', title: 'How to Learn Go', file: 'module0.html' },
        { num: '01', title: 'Go Fundamentals', file: 'module1.html' },
        { num: '02', title: 'Pointers & Structs', file: 'module2.html' },
        { num: '03', title: 'Interfaces', file: 'module3.html' },
        { num: '04', title: 'Error Handling', file: 'module4.html' },
        { num: '05', title: 'Data Structures', file: 'module5.html' },
        { num: '06', title: 'Concurrency', file: 'module6.html' },
        { num: '07', title: 'Files, YAML & Shell', file: 'module7.html' },
        { num: 'P1', title: 'Task Runner', file: 'project-taskrunner.html', isProject: true },
        { num: '08', title: 'Building TUIs', file: 'module8.html' },
        { num: 'P2', title: 'File Browser', file: 'project-filebrowser.html', isProject: true },
        { num: '09', title: 'CLI with Cobra', file: 'module9.html' },
        { num: '10', title: 'Error Handling II', file: 'module10.html' },
        { num: '11', title: 'HTTP & REST APIs', file: 'module11.html' },
        { num: 'P3', title: 'GitHub CLI', file: 'project-githubcli.html', isProject: true },
        { num: '12', title: 'Concurrency Patterns', file: 'module12.html' },
        { num: 'P4', title: 'Parallel Downloader', file: 'project-downloader.html', isProject: true },
        { num: '13', title: 'Auth & Middleware', file: 'module13.html' },
        { num: '14', title: 'Design Patterns', file: 'module14.html' },
        { num: '15', title: 'Project Structure', file: 'module15.html' },
        { num: '16', title: 'Production Ready', file: 'module16.html' },
        { num: '17', title: 'Integration Testing', file: 'module17.html' }
    ];

    // Get current page
    function getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page;
    }

    // Check if sidebar should be open by default (desktop only)
    function shouldBeOpen() {
        if (window.innerWidth <= 900) return false;
        const saved = localStorage.getItem('go-course-sidebar');
        return saved === 'open';
    }

    // Get sections from current page (h2 elements inside .lesson)
    function getPageSections() {
        const sections = [];
        const headings = document.querySelectorAll('.lesson h2');
        headings.forEach((h2, index) => {
            // Create an ID if it doesn't have one
            if (!h2.id) {
                h2.id = 'section-' + index;
            }
            sections.push({
                id: h2.id,
                title: h2.textContent.replace(/^#\s*/, '').trim()
            });
        });
        return sections;
    }

    // Create sidebar HTML
    function createSidebar() {
        const currentPage = getCurrentPage();
        const sections = getPageSections();

        // Hide the old nav element
        const oldNav = document.querySelector('.container > nav');
        if (oldNav) {
            oldNav.style.display = 'none';
        }

        // Create backdrop for mobile
        const backdrop = document.createElement('div');
        backdrop.className = 'sidebar-backdrop';
        backdrop.addEventListener('click', toggleSidebar);
        document.body.appendChild(backdrop);

        // Create sidebar
        const sidebar = document.createElement('aside');
        sidebar.className = 'sidebar';
        if (shouldBeOpen()) {
            sidebar.classList.add('open');
            document.body.classList.add('sidebar-open');
        }

        // Header with home link (padded to avoid toggle overlap)
        let html = `
            <div class="sidebar-header">
                <a href="index.html">← Course Home</a>
            </div>
            <div class="sidebar-content">
        `;

        // All pages - with sections nested under active page
        pages.forEach(page => {
            const isActive = currentPage === page.file;
            const linkClass = page.isProject ? 'sidebar-link sidebar-project-link' : 'sidebar-link';

            html += `
                <a href="${page.file}" class="${linkClass}${isActive ? ' active' : ''}">
                    <span class="sidebar-module-num">${page.num}</span>
                    ${page.title}
                </a>
            `;

            // If this page is active, show its sections
            if (isActive && sections.length > 0) {
                html += `<div class="sidebar-sections">`;
                sections.forEach(section => {
                    html += `
                        <a href="#${section.id}" class="sidebar-section-link">
                            ${section.title}
                        </a>
                    `;
                });
                html += `</div>`;
            }
        });

        html += `</div>`; // close sidebar-content

        sidebar.innerHTML = html;
        document.body.appendChild(sidebar);

        // Create toggle button (inside sidebar when open)
        const toggle = document.createElement('button');
        toggle.className = 'sidebar-toggle';
        toggle.setAttribute('aria-label', 'Toggle navigation');
        toggle.innerHTML = '☰';
        toggle.addEventListener('click', toggleSidebar);
        document.body.appendChild(toggle);
    }

    // Toggle sidebar
    function toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const isOpen = sidebar.classList.toggle('open');
        document.body.classList.toggle('sidebar-open', isOpen);

        // Save state (desktop only)
        if (window.innerWidth > 900) {
            localStorage.setItem('go-course-sidebar', isOpen ? 'open' : 'closed');
        }
    }

    // Track scroll position to highlight current section
    function setupScrollTracking() {
        const sectionLinks = document.querySelectorAll('.sidebar-section-link');
        if (sectionLinks.length === 0) return;

        const headings = [];
        sectionLinks.forEach(link => {
            const id = link.getAttribute('href').slice(1);
            const el = document.getElementById(id);
            if (el) headings.push({ id, el, link });
        });

        function updateActiveSection() {
            const scrollPos = window.scrollY + 100; // offset for header
            let current = null;

            for (const h of headings) {
                if (h.el.offsetTop <= scrollPos) {
                    current = h;
                }
            }

            sectionLinks.forEach(link => link.classList.remove('active'));
            if (current) {
                current.link.classList.add('active');
            }
        }

        window.addEventListener('scroll', updateActiveSection, { passive: true });
        updateActiveSection(); // Initial call
    }

    // Initialize
    function init() {
        // Don't add sidebar to index page
        const currentPage = getCurrentPage();
        if (currentPage === 'index.html' || currentPage === '') {
            return;
        }
        // Add class to body to indicate sidebar is available (for CSS padding)
        document.body.classList.add('has-sidebar');
        createSidebar();
        setupScrollTracking();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && window.innerWidth <= 900) {
                // Close sidebar on mobile by default
                sidebar.classList.remove('open');
                document.body.classList.remove('sidebar-open');
            }
        }, 250);
    });
})();

