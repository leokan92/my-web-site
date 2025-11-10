const navToggle = document.querySelector('.nav-toggle');
const siteMenu = document.querySelector('#site-menu');
const currentYearEl = document.querySelector('#current-year');

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
