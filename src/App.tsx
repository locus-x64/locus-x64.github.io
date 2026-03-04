import { useState, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LandingPage } from '@/components/LandingPage'
import { Header } from '@/components/Header'
import { BlogListing } from '@/components/BlogListing'
import { PostDetail } from '@/components/PostDetail'
import { author } from '@/lib/blogData'
import { loadAllPosts } from '@/lib/postLoader'
import { BlogPost } from '@/types/blog'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAllPosts().then(posts => {
      setBlogPosts(posts)
      setIsLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/" element={<LandingPage author={author} />} />
        <Route
          path="/blog"
          element={
            <>
              <Header author={author} />
              {isLoading ? (
                <div className="min-h-[70vh] bg-background text-foreground flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-pulse text-primary text-lg">Loading posts...</div>
                  </div>
                </div>
              ) : (
                <BlogListing posts={blogPosts} />
              )}
            </>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <>
              <Header author={author} />
              <PostDetail />
            </>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App