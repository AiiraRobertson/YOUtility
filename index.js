// index.js - Page-specific scripts for index.html

// Navigate based on a simple action map
const INDEX_ACTIONS = {
  login: 'login.html',
  signup: 'login.html#signup',
  home: 'index.html',
  services: 'services.html',
  providers: 'providers.html',
};

function navigateTo(href) {
    if (!href) return;
    window.location.href = href;
}

function initIndexButtonHandlers() {
    // CTA button: Get Started or Sign In intent
    const cta = document.querySelector('.cta-button');
    if (cta) {
        cta.addEventListener('click', (e) => {
            e.preventDefault();
            const target = cta.getAttribute('href') || INDEX_ACTIONS.login;
            navigateTo(target);
        });
    }

    // Action buttons by data-action attribute
    document.querySelectorAll('button[data-action], a[data-action]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const key = el.dataset.action;
            if (key && INDEX_ACTIONS[key]) {
                navigateTo(INDEX_ACTIONS[key]);
            }
        });
    });

    // Service cards: quick look to providers with query
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3')?.textContent?.trim() || 'service';
            const query = encodeURIComponent(title.replace('&', 'and'));
            navigateTo(`providers.html?service=${query}`);
        });
    });
}

// Page initialization
document.addEventListener('DOMContentLoaded', () => {
    initIndexButtonHandlers();
});
