import { BlogPost } from '@/types/blog'

interface PostMetadata {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  readingTime: number
  tags: string[]
}

export async function loadPostsIndex(): Promise<PostMetadata[]> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}posts/index.json`)
    if (!response.ok) {
      throw new Error('Failed to load posts index')
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading posts index:', error)
    return []
  }
}

export async function loadPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}posts/${slug}.md`)
    if (!response.ok) {
      throw new Error(`Failed to load post: ${slug}`)
    }
    const markdown = await response.text()
    return parseMarkdownPost(markdown)
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error)
    return null
  }
}

function parseMarkdownPost(markdown: string): BlogPost {
  const frontmatterRegex = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/
  const match = markdown.match(frontmatterRegex)
  
  if (!match) {
    throw new Error('Invalid markdown format: missing frontmatter')
  }
  
  const [, frontmatterText, content] = match
  const frontmatter: Record<string, any> = {}
  
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) return
    
    const key = line.substring(0, colonIndex).trim()
    let value: any = line.substring(colonIndex + 1).trim()
    
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    } else if (value.startsWith('[') && value.endsWith(']')) {
      value = JSON.parse(value)
    } else if (!isNaN(Number(value))) {
      value = Number(value)
    }
    
    frontmatter[key] = value
  })
  
  return {
    id: frontmatter.id,
    slug: frontmatter.slug,
    title: frontmatter.title,
    excerpt: frontmatter.excerpt,
    date: frontmatter.date,
    readingTime: frontmatter.readingTime,
    tags: frontmatter.tags,
    content: content.trim()
  }
}

export async function loadAllPosts(): Promise<BlogPost[]> {
  const index = await loadPostsIndex()
  const posts = await Promise.all(
    index.map(meta => loadPost(meta.slug))
  )
  return posts.filter((post): post is BlogPost => post !== null)
}
