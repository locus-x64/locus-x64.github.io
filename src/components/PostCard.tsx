import { BlogPost } from '@/types/blog'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CalendarBlank, Terminal } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface PostCardProps {
  post: BlogPost
}

export function PostCard({ post }: PostCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="h-full"
    >
      <Card
        className="relative h-full p-6 cursor-pointer border-border/80 hover:border-primary/80 transition-all duration-250 bg-card/90 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex flex-col gap-4 h-full">
          <div className="flex items-start gap-2">
            <Terminal size={20} className="text-primary mt-1 flex-shrink-0" weight="bold" />
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-250 line-clamp-2 leading-tight font-mono">
                {post.title}
              </h2>
              <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs uppercase tracking-wide bg-secondary/80 border border-border/60 hover:bg-primary/15 hover:text-primary hover:border-primary/60 transition-all duration-200 font-mono backdrop-blur-sm px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono mt-auto pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <CalendarBlank size={14} weight="regular" className="text-primary/70" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} weight="regular" className="text-accent/70" />
              <span>{post.readingTime}m</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
