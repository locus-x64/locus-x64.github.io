export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  readingTime: number
  tags: string[]
  slug: string
}

export interface Author {
  name: string
  handle: string
  bio: string
  avatar: string
  github: string
  twitter: string
  linkedin: string
}
