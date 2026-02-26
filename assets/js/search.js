const searchResults = document.querySelector('[data-search-results]');
const searchField = document.querySelector('[data-search-input]');

if (searchResults && searchField) {
  fetch('/search.json')
    .then((response) => response.json())
    .then((posts) => {
      const render = (items) => {
        if (!items.length) {
          searchResults.innerHTML = '<p class="muted">No matching posts.</p>';
          return;
        }

        searchResults.innerHTML = items
          .slice(0, 15)
          .map(
            (item) => `
            <article class="search-result-item">
              <a href="${item.url}">${item.title}</a>
              <p class="muted">${item.date} · ${item.tags.join(', ')}</p>
            </article>
          `
          )
          .join('');
      };

      searchField.addEventListener('input', () => {
        const query = searchField.value.trim().toLowerCase();
        if (!query) {
          searchResults.innerHTML = '<p class="muted">Type to search.</p>';
          return;
        }

        const filtered = posts.filter((post) => {
          const haystack = `${post.title} ${post.content} ${post.tags.join(' ')}`.toLowerCase();
          return haystack.includes(query);
        });

        render(filtered);
      });
    })
    .catch(() => {
      searchResults.innerHTML = '<p class="muted">Search index unavailable.</p>';
    });
}
