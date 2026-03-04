# locus-x64 | Security Researcher Blog

A modern blog website for security researcher **@locus-x64**, specializing in vulnerability discovery, exploit development, and reverse engineering.

## Features

- Modern, clean design with dark theme
- Syntax-highlighted code blocks
- Smooth page transitions
- Responsive layout
- Landing page with author introduction
- Blog listing with tag filtering
- Individual post detail pages

## Adding New Blog Posts

Blog posts are stored as individual markdown files in `/public/posts/`.

1. Create a new `.md` file in `/public/posts/` (e.g., `my-new-post.md`)
2. Add frontmatter with post metadata
3. Write your content in markdown
4. Update `/public/posts/index.json` with the post metadata

### Example Post Structure

```markdown
---
id: "6"
slug: "my-new-post"
title: "My New Security Research"
excerpt: "Brief description of the post"
date: "2024-01-25"
readingTime: 10
tags: ["security", "research"]
---

## Introduction

Your content here...
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploying to GitHub Pages

This repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to `main`.

1. Go to **Settings** → **Pages** in your repository
2. Under **Source**, select **GitHub Actions**
3. Push to the `main` branch — the workflow handles the rest

Your site will be available at: `https://locus-x64.github.io/`

## License

MIT
