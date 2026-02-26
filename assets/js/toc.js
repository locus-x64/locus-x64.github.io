const tocContainer = document.querySelector('[data-toc]');
const postContent = document.querySelector('[data-post-content]');
const tocWrap = document.querySelector('[data-toc-wrap]');

if (tocContainer && postContent) {
  const headings = [...postContent.querySelectorAll('h2, h3')];

  if (!headings.length) {
    if (tocWrap) tocWrap.hidden = true;
  } else {
    tocContainer.innerHTML = headings
      .map((heading, index) => {
        if (!heading.id) heading.id = `section-${index + 1}`;
        return `<a href="#${heading.id}" class="toc-${heading.tagName.toLowerCase()}">${heading.textContent}</a>`;
      })
      .join('');

    const tocLinks = [...tocContainer.querySelectorAll('a')];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('id');
          tocLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0.1 }
    );

    headings.forEach((heading) => observer.observe(heading));
  }
}
