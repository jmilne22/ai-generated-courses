// Bionic Reading Mode - Bold first half of words for easier reading
(function() {
    'use strict';

    const STORAGE_KEY = 'bionic-mode';
    let isActive = localStorage.getItem(STORAGE_KEY) === 'true';
    let originalContent = null;

    function init() {
        createToggle();
        if (isActive) {
            // Small delay to ensure DOM is ready
            setTimeout(() => activate(), 100);
        }
    }

    function createToggle() {
        const btn = document.createElement('button');
        btn.className = 'bionic-toggle';
        btn.setAttribute('aria-label', 'Toggle bionic reading mode');
        btn.title = 'Bionic Reading - Bold word starts for easier tracking';
        btn.textContent = 'B';
        btn.addEventListener('click', toggle);
        updateButton(btn);
        document.body.appendChild(btn);
    }

    function updateButton(btn) {
        btn = btn || document.querySelector('.bionic-toggle');
        if (btn) {
            btn.classList.toggle('active', isActive);
        }
    }

    function toggle() {
        isActive = !isActive;
        localStorage.setItem(STORAGE_KEY, isActive);
        updateButton();
        
        if (isActive) {
            activate();
        } else {
            deactivate();
        }
    }

    function activate() {
        const main = document.querySelector('main');
        if (!main || main.dataset.bionicActive === 'true') return;
        
        // Store original HTML for clean restore
        originalContent = main.innerHTML;
        main.dataset.bionicActive = 'true';
        
        // Process text in readable elements only
        const selectors = 'p, li, blockquote, .callout p, td, th';
        main.querySelectorAll(selectors).forEach(el => {
            // Skip if contains code or already processed
            if (el.querySelector('code, pre') || el.dataset.bionic) return;
            el.dataset.bionic = 'true';
            processElement(el);
        });
    }

    function deactivate() {
        const main = document.querySelector('main');
        if (!main || !originalContent) return;
        
        main.innerHTML = originalContent;
        main.dataset.bionicActive = 'false';
        originalContent = null;
    }

    function processElement(el) {
        const walker = document.createTreeWalker(
            el,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Skip if parent is code, pre, script, style, or already a bionic span
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    const tag = parent.tagName.toLowerCase();
                    if (['code', 'pre', 'script', 'style', 'a'].includes(tag)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (parent.classList.contains('bionic-bold')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        textNodes.forEach(node => {
            const text = node.textContent;
            if (!text.trim()) return;
            
            const fragment = document.createDocumentFragment();
            // Split by word boundaries, keeping whitespace
            const parts = text.split(/(\s+)/);
            
            parts.forEach(part => {
                if (/^\s+$/.test(part)) {
                    // Whitespace - keep as is
                    fragment.appendChild(document.createTextNode(part));
                } else if (part.length > 0) {
                    // Word - bold first portion
                    const boldLen = Math.ceil(part.length * 0.4);
                    const boldPart = part.slice(0, boldLen);
                    const restPart = part.slice(boldLen);
                    
                    const span = document.createElement('span');
                    span.className = 'bionic-bold';
                    span.textContent = boldPart;
                    fragment.appendChild(span);
                    
                    if (restPart) {
                        fragment.appendChild(document.createTextNode(restPart));
                    }
                }
            });
            
            node.parentNode.replaceChild(fragment, node);
        });
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

