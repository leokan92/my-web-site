const navToggle = document.querySelector('.nav-toggle');
const siteMenu = document.querySelector('#site-menu');
const currentYearEl = document.querySelector('#current-year');

const publicationCards = document.querySelectorAll('.publication[data-preview]');
publicationCards.forEach((card) => {
    const preview = card.getAttribute('data-preview');
    if (preview) {
        card.style.setProperty('--preview', `url("../previews/${preview}")`);
    }
});

if (navToggle && siteMenu) {
    navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        siteMenu.setAttribute('aria-expanded', String(!expanded));
    });
}

if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

const links = document.querySelectorAll('a[href^="#"]');
const siteHeader = document.querySelector('.site-header');

const getHeaderOffset = () => {
    if (!siteHeader) {
        return 0;
    }

    const computedStyles = window.getComputedStyle(siteHeader);
    const marginBottom = parseFloat(computedStyles.marginBottom) || 0;

    return siteHeader.offsetHeight + marginBottom + 12;
};

links.forEach((link) => {
    link.addEventListener('click', (event) => {
        const href = link.getAttribute('href') || '';

        if (href === '#top') {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (href.startsWith('#') && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                event.preventDefault();
                const headerOffset = getHeaderOffset();
                const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                const targetScrollPosition = Math.max(elementPosition - headerOffset, 0);

                window.scrollTo({ top: targetScrollPosition, behavior: 'smooth' });
            }
        }

        if (navToggle && siteMenu && navToggle.getAttribute('aria-expanded') === 'true') {
            navToggle.setAttribute('aria-expanded', 'false');
            siteMenu.setAttribute('aria-expanded', 'false');
        }
    });
});

// Show-more / Load-more functionality for section grids
(function() {
    const defaultStep = 6;
    const buttons = document.querySelectorAll('.load-more');

    if (!buttons || buttons.length === 0) return;

    buttons.forEach((btn) => {
        const targetSelector = btn.getAttribute('data-target');
        const step = parseInt(btn.getAttribute('data-step'), 10) || defaultStep;
        const container = document.querySelector(targetSelector);

        if (!container) {
            // Nothing to control, hide the button
            btn.style.display = 'none';
            return;
        }

        let items = Array.from(container.children).filter((c) => {
            return c.classList.contains('publication') ||
                c.classList.contains('publication-featured') ||
                c.classList.contains('project-card') ||
                c.classList.contains('timeline-item') ||
                c.classList.contains('card');
        });

        if (items.length === 0) {
            // fallback to article children
            items = Array.from(container.querySelectorAll('article'));
        }

        if (items.length <= step) {
            // nothing to hide
            btn.style.display = 'none';
            return;
        }

        let visible = step;

        const update = () => {
            items.forEach((it, idx) => {
                if (idx < visible) {
                    it.style.display = '';
                } else {
                    it.style.display = 'none';
                }
            });

            if (visible >= items.length) {
                btn.style.display = 'none';
            } else {
                btn.style.display = '';
            }

            btn.setAttribute('aria-expanded', String(visible > step));
        };

        // initial state
        update();

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const prevVisible = visible;
            visible = Math.min(visible + step, items.length);
            update();

            // scroll to the first newly revealed item for context
            const firstNew = items[prevVisible];
            if (firstNew) {
                firstNew.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();

// Lightweight analytics helpers for GA4 events
(function() {
    const emitEvent = (eventName, params = {}) => {
        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, params);
        }
    };

    const getSectionName = (section) => {
        const labelledBy = section.getAttribute('aria-labelledby');
        if (labelledBy) {
            const heading = document.getElementById(labelledBy);
            if (heading) {
                return heading.textContent.trim();
            }
        }
        const heading = section.querySelector('h2');
        return heading ? heading.textContent.trim() : section.id;
    };

    const initButtonTracking = () => {
        const trackableButtons = document.querySelectorAll('button, .button, a.button');
        trackableButtons.forEach((btn) => {
            if (btn.dataset.analyticsBound === 'true') return;
            btn.dataset.analyticsBound = 'true';

            btn.addEventListener('click', () => {
                const label = (btn.getAttribute('aria-label') || btn.textContent || '').trim() || 'button';
                emitEvent('button_click', {
                    label,
                    element_id: btn.id || undefined,
                    element_classes: btn.className || undefined,
                });
            });
        });
    };

    const initSectionTracking = () => {
        const sections = document.querySelectorAll('section[id]');
        if (sections.length === 0) return;
        const seen = new Set();

        const markSeen = (section) => {
            const sectionId = section.id || 'unknown-section';
            if (seen.has(sectionId)) return;
            seen.add(sectionId);
            emitEvent('section_view', {
                section_id: sectionId,
                section_name: getSectionName(section),
            });
        };

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
                        markSeen(entry.target);
                    }
                });
            }, { threshold: [0.35] });

            sections.forEach((section) => observer.observe(section));
        } else {
            sections.forEach((section) => markSeen(section));
        }
    };

    const onReady = (callback) => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback, { once: true });
        } else {
            callback();
        }
    };

    onReady(() => {
        initButtonTracking();
        initSectionTracking();
    });
})();
