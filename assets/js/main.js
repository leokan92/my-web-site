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
links.forEach((link) => {
    link.addEventListener('click', () => {
        if (navToggle && siteMenu && navToggle.getAttribute('aria-expanded') === 'true') {
            navToggle.setAttribute('aria-expanded', 'false');
            siteMenu.setAttribute('aria-expanded', 'false');
        }
    });
});
