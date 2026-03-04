import { useEffect } from 'react'
import { BlogPost } from '@/types/blog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Clock, CalendarBlank } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { CodeBlock } from '@/components/CodeBlock'
import { MermaidBlock } from '@/components/MermaidBlock'

interface PostDetailProps {
  post: BlogPost
  onBack: () => void
}

export function PostDetail({ post, onBack }: PostDetailProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [post.id])

  const renderInline = (text: string): React.ReactNode[] => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|!\[[^\]]*\]\([^)]+\))/)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-primary">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="bg-secondary/70 px-2.5 py-1 rounded-md text-primary font-mono text-sm border border-border/50">
            {part.slice(1, -1)}
          </code>
        )
      }
      const imgMatch = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
      if (imgMatch) {
        const [, alt, src] = imgMatch
        const resolvedSrc = src.startsWith('http') ? src : `${import.meta.env.BASE_URL}${src}`
        return (
          <img
            key={i}
            src={resolvedSrc}
            alt={alt}
            className="rounded-lg border border-border/50 my-6 max-w-full shadow-lg"
          />
        )
      }
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (linkMatch) {
        return (
          <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent underline underline-offset-4 transition-colors duration-200">
            {linkMatch[1]}
          </a>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  const renderContent = (content: string) => {
    const elements: React.ReactNode[] = []
    const lines = content.split('\n')
    let i = 0
    let elementIndex = 0

    while (i < lines.length) {
      const line = lines[i]

      // Empty line - skip
      if (!line.trim()) {
        i++
        continue
      }

      // Code block
      if (line.startsWith('```')) {
        const langMatch = line.match(/^```(\w*)/)
        const language = langMatch?.[1] || 'plaintext'
        const codeLines: string[] = []
        i++
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i])
          i++
        }
        i++ // skip closing ```
        const codeContent = codeLines.join('\n').trim()
        if (language === 'mermaid') {
          elements.push(<MermaidBlock key={elementIndex++} chart={codeContent} />)
        } else {
          elements.push(<CodeBlock key={elementIndex++} code={codeContent} language={language} />)
        }
        continue
      }

      // H1 heading
      if (line.match(/^# [^#]/) ) {
        elements.push(
          <h2 key={elementIndex++} className="text-2xl md:text-4xl font-bold text-foreground mt-12 mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text">
            {line.slice(2)}
          </h2>
        )
        i++
        continue
      }

      // H2 heading
      if (line.match(/^## [^#]/)) {
        elements.push(
          <h2 key={elementIndex++} className="text-2xl md:text-3xl font-semibold text-foreground mt-10 mb-5 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text">
            {line.slice(3)}
          </h2>
        )
        i++
        continue
      }

      // H3 heading
      if (line.match(/^### [^#]/)) {
        elements.push(
          <h3 key={elementIndex++} className="text-xl md:text-2xl font-medium text-foreground mt-8 mb-4">
            {line.slice(4)}
          </h3>
        )
        i++
        continue
      }

      // H4 heading
      if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={elementIndex++} className="text-lg md:text-xl font-medium text-foreground mt-6 mb-3">
            {line.slice(5)}
          </h4>
        )
        i++
        continue
      }

      // Image on its own line
      if (line.match(/^!\[.*?\]\(.*?\)\s*$/)) {
        const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
        if (imgMatch) {
          const [, alt, src] = imgMatch
          const resolvedSrc = src.startsWith('http') ? src : `${import.meta.env.BASE_URL}${src}`
          elements.push(
            <div key={elementIndex++} className="my-6">
              <img
                src={resolvedSrc}
                alt={alt}
                className="rounded-lg border border-border/50 max-w-full shadow-lg"
              />
              {alt && alt !== src && (
                <p className="text-xs text-muted-foreground mt-2 text-center italic">{alt}</p>
              )}
            </div>
          )
        }
        i++
        continue
      }

      // Blockquote
      if (line.startsWith('> ') || line === '>') {
        const quoteLines: string[] = []
        while (i < lines.length && (lines[i].startsWith('> ') || lines[i] === '>')) {
          quoteLines.push(lines[i].replace(/^>\s?/, ''))
          i++
        }
        const quoteText = quoteLines.join('\n')
        elements.push(
          <blockquote key={elementIndex++} className="border-l-4 border-primary/50 pl-5 py-3 my-6 bg-secondary/20 rounded-r-lg">
            <div className="text-foreground/80 leading-relaxed text-sm">
              {renderInline(quoteText)}
            </div>
          </blockquote>
        )
        continue
      }

      // Ordered list
      if (line.match(/^\d+\.\s/)) {
        const items: string[] = []
        while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
          items.push(lines[i].replace(/^\d+\.\s*/, ''))
          i++
        }
        elements.push(
          <ol key={elementIndex++} className="list-decimal list-inside space-y-3 my-5 text-foreground/90 leading-relaxed">
            {items.map((item, idx) => (
              <li key={idx} className="pl-2">{renderInline(item)}</li>
            ))}
          </ol>
        )
        continue
      }

      // Unordered list
      if (line.startsWith('- ')) {
        const items: string[] = []
        while (i < lines.length && lines[i].startsWith('- ')) {
          items.push(lines[i].replace(/^-\s+/, ''))
          i++
        }
        elements.push(
          <ul key={elementIndex++} className="space-y-3 my-5 text-foreground/90 leading-relaxed">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 pl-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                <span>{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        )
        continue
      }

      // Horizontal rule
      if (line.match(/^---+$/)) {
        elements.push(<Separator key={elementIndex++} className="my-8 bg-gradient-to-r from-transparent via-border to-transparent" />)
        i++
        continue
      }

      // Regular paragraph - collect consecutive lines that aren't block-level
      const paraLines: string[] = []
      while (
        i < lines.length &&
        lines[i].trim() &&
        !lines[i].startsWith('#') &&
        !lines[i].startsWith('```') &&
        !lines[i].startsWith('> ') &&
        !lines[i].match(/^!\[.*?\]\(.*?\)\s*$/) &&
        !lines[i].match(/^\d+\.\s/) &&
        !lines[i].startsWith('- ') &&
        !lines[i].match(/^---+$/)
      ) {
        paraLines.push(lines[i])
        i++
      }
      if (paraLines.length > 0) {
        elements.push(
          <p key={elementIndex++} className="text-foreground/90 mb-5 leading-relaxed text-base">
            {renderInline(paraLines.join(' '))}
          </p>
        )
      }
    }

    return elements
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10 md:py-16">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-10 text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-[-4px] group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:animate-pulse" />
          Back to posts
        </Button>

        <article className="prose">
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight tracking-tight bg-gradient-to-br from-foreground via-primary to-accent bg-clip-text">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground mb-7 font-mono">
              <div className="flex items-center gap-2.5">
                <CalendarBlank size={18} weight="regular" className="text-primary/70" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={18} weight="regular" className="text-accent/70" />
                <span>{post.readingTime} minute read</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 mb-10">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs uppercase tracking-wider bg-secondary/60 text-primary border border-border/50 font-medium px-3 py-1.5"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
          </motion.div>

          <motion.div 
            className="prose-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {renderContent(post.content)}
          </motion.div>
        </article>
      </div>
    </motion.div>
  )
}
