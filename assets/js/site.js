const menuToggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
  });
}

const themeButton = document.querySelector('[data-theme-toggle]');
if (themeButton) {
  themeButton.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

const searchModal = document.querySelector('[data-search-modal]');
const searchOpen = document.querySelector('[data-search-open]');
const searchClose = document.querySelector('[data-search-close]');
const searchInput = document.querySelector('[data-search-input]');

function toggleSearch(open) {
  if (!searchModal) return;
  searchModal.hidden = !open;
  if (open && searchInput) searchInput.focus();
}

if (searchOpen) searchOpen.addEventListener('click', () => toggleSearch(true));
if (searchClose) searchClose.addEventListener('click', () => toggleSearch(false));
if (searchModal) {
  searchModal.addEventListener('click', (event) => {
    if (event.target === searchModal) toggleSearch(false);
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') toggleSearch(false);
});

const tagsFilter = document.querySelector('[data-tags-filter]');
const tagResults = document.querySelector('[data-tag-results]');

if (tagsFilter && tagResults) {
  const buttons = [...tagsFilter.querySelectorAll('[data-tag]')];
  const cards = [...tagResults.querySelectorAll('[data-tags]')];

  function activate(button) {
    buttons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  }

  function filterBy(tag) {
    cards.forEach((card) => {
      if (tag === 'all') {
        card.hidden = false;
        return;
      }
      const tags = card.dataset.tags || '';
      card.hidden = !tags.includes(tag);
    });
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const tag = button.dataset.tag;
      activate(button);
      filterBy(tag);
    });
  });

  if (location.hash) {
    const slug = location.hash.slice(1).toLowerCase().replace(/-/g, ' ');
    const matched = buttons.find((item) => item.dataset.tag === slug);
    if (matched) {
      activate(matched);
      filterBy(matched.dataset.tag);
    }
  }
}
