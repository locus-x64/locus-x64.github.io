import { useState, useEffect } from 'react'
import { LandingPage } from '@/components/LandingPage'
import { Header } from '@/components/Header'
import { BlogListing } from '@/components/BlogListing'
import { PostDetail } from '@/components/PostDetail'
import { author } from '@/lib/blogData'
import { loadAllPosts, loadPost } from '@/lib/postLoader'
import { BlogPost } from '@/types/blog'
import { Toaster } from '@/components/ui/sonner'

type View = 'landing' | 'blog' | 'post'

function App() {
  const [currentView, setCurrentView] = useState<View>('landing')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAllPosts().then(posts => {
      setBlogPosts(posts)
      setIsLoading(false)
    })
  }, [])

  const handleEnterBlog = () => {
    setCurrentView('blog')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePostClick = async (post: BlogPost) => {
    const fullPost = await loadPost(post.slug)
    if (fullPost) {
      setSelectedPost(fullPost)
      setCurrentView('post')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setSelectedPost(null)
    setCurrentView('blog')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogoClick = () => {
    setCurrentView('landing')
    setSelectedPost(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-primary text-lg">Loading posts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {currentView === 'landing' ? (
        <LandingPage author={author} onEnterBlog={handleEnterBlog} />
      ) : (
        <>
          <Header author={author} onLogoClick={handleLogoClick} />
          
          {currentView === 'post' && selectedPost ? (
            <PostDetail 
              post={selectedPost} 
              onBack={handleBack} 
            />
          ) : (
            <BlogListing 
              posts={blogPosts} 
              onPostClick={handlePostClick} 
            />
          )}
        </>
      )}

      <Toaster />
    </div>
  )
}

export default App