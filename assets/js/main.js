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
