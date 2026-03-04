import fs from 'node:fs/promises'
import path from 'node:path'

const projectRoot = process.cwd()
const postsIndexPath = path.join(projectRoot, 'public', 'posts', 'index.json')
const outputRoot = path.join(projectRoot, 'public', 'blog')
const siteUrl = process.env.SITE_URL || 'https://locus-x64.github.io'
const defaultImage = `${siteUrl}/logo512.png`

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderPostPage(post) {
  const slug = String(post.slug).trim()
  const title = escapeHtml(String(post.title).trim())
  const description = escapeHtml(String(post.excerpt).trim())
  const publishedDate = escapeHtml(String(post.date).trim())
  const postPath = `/blog/${slug}`
  const canonicalUrl = `${siteUrl}${postPath}`

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonicalUrl}" />

    <meta property="og:type" content="article" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${defaultImage}" />
    <meta property="article:published_time" content="${publishedDate}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${defaultImage}" />

    <script>
      (function () {
        window.location.replace('${postPath}' + window.location.search + window.location.hash)
      })();
    </script>
  </head>
  <body></body>
</html>
`
}

async function main() {
  const raw = await fs.readFile(postsIndexPath, 'utf8')
  const posts = JSON.parse(raw)

  await fs.mkdir(outputRoot, { recursive: true })

  for (const post of posts) {
    if (!post.slug || !post.title || !post.excerpt || !post.date) {
      continue
    }

    const postDir = path.join(outputRoot, String(post.slug).trim())
    await fs.mkdir(postDir, { recursive: true })
    const filePath = path.join(postDir, 'index.html')
    await fs.writeFile(filePath, renderPostPage(post), 'utf8')
  }

  console.log(`Generated share pages for ${posts.length} posts`)
}

main().catch((error) => {
  console.error('Failed to generate share pages:', error)
  process.exit(1)
})
