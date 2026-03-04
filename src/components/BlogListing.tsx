import { useState, useMemo, useEffect } from 'react'
import { BlogPost } from '@/types/blog'
import { PostCard } from './PostCard'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MagnifyingGlass, X, Tag, CaretDown, CaretUp } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface BlogListingProps {
  posts: BlogPost[]
  onPostClick: (post: BlogPost) => void
}

export function BlogListing({ posts, onPostClick }: BlogListingProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTags, setShowTags] = useState(false)

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    posts.forEach(post => post.tags.forEach(tag => tags.add(tag)))
    return Array.from(tags).sort()
  }, [posts])

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => post.tags.includes(tag))
      
      return matchesSearch && matchesTags
    })
  }, [posts, searchQuery, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTags([])
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-16">
      <div className="mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-5 tracking-tight bg-gradient-to-br from-foreground via-primary to-accent bg-clip-text text-transparent">
            Security Research
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Vulnerability analysis, exploit development, and security insights from the cutting edge of cyber defense.
          </p>
        </motion.div>
      </div>

      <div className="mb-10 space-y-7">
        <div className="relative group">
          <MagnifyingGlass 
            size={20} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-primary" 
          />
          <Input
            type="text"
            placeholder="Search posts by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-14 bg-card/60 border-border focus:border-primary/60 transition-all duration-200 text-base placeholder:text-muted-foreground/60 focus:shadow-[0_0_20px_oklch(0.75_0.21_340_/_0.15)] backdrop-blur-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTags(!showTags)}
              className="text-xs font-semibold text-muted-foreground hover:text-primary uppercase tracking-widest flex items-center gap-2.5 px-3 h-9 transition-all duration-200 hover:bg-primary/5"
            >
              <Tag size={16} className="text-primary" weight="bold" />
              <span>Filter by Tags</span>
              {showTags ? <CaretUp size={14} /> : <CaretDown size={14} />}
              {selectedTags.length > 0 && (
                <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full bg-primary">
                  {selectedTags.length}
                </Badge>
              )}
            </Button>
            {(selectedTags.length > 0 || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-xs font-medium text-primary hover:text-accent transition-colors duration-200 uppercase tracking-wide"
              >
                Clear all
              </button>
            )}
          </div>
          <AnimatePresence>
            {showTags && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2.5 pb-1">
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? 'default' : 'secondary'}
                      className={`
                        cursor-pointer text-xs font-medium uppercase tracking-wider transition-all duration-200 px-4 py-2
                        ${selectedTags.includes(tag) 
                          ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg tag-glow border-primary/50' 
                          : 'bg-secondary/70 hover:bg-accent hover:text-accent-foreground hover:accent-glow border-border/50 backdrop-blur-sm'
                        }
                      `}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {filteredPosts.length > 0 && (
          <p className="text-sm text-muted-foreground font-mono">
            <span className="text-primary font-semibold">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'post' : 'posts'} found
          </p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {filteredPosts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-24"
          >
            <div className="max-w-md mx-auto">
              <div className="mb-6 text-6xl opacity-20">🔍</div>
              <p className="text-2xl font-semibold text-foreground mb-3">No posts found</p>
              <p className="text-base text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-7"
          >
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <PostCard
                  post={post}
                  onClick={() => onPostClick(post)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
