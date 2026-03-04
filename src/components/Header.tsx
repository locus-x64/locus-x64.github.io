import { Author } from '@/types/blog'
import { Button } from '@/components/ui/button'
import { GithubLogo, TwitterLogo, LinkedinLogo } from '@phosphor-icons/react'
import { Logo } from '@/components/Logo'
import { Link } from 'react-router-dom'

interface HeaderProps {
  author: Author
}

export function Header({ author }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur-md">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-accent/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-4 md:py-5">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 md:gap-4 cursor-pointer group"
          >
            <div className="relative transition-all duration-200 group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative w-10 h-10 rounded-full border-2 border-primary/50 bg-card/50 backdrop-blur flex items-center justify-center">
                <Logo size={24} />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base md:text-lg font-bold text-foreground tracking-tight font-mono group-hover:text-primary transition-colors">
                {author.name}
              </h1>
              <p className="text-xs text-muted-foreground font-mono">{author.handle}</p>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-primary transition-all duration-200 hover:bg-primary/10 group"
              onClick={() => window.open(author.github, '_blank')}
            >
              <GithubLogo size={20} weight="regular" className="group-hover:scale-110 transition-transform" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-accent transition-all duration-200 hover:bg-accent/10 group"
              onClick={() => window.open(author.twitter, '_blank')}
            >
              <TwitterLogo size={20} weight="regular" className="group-hover:scale-110 transition-transform" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-primary transition-all duration-200 hover:bg-primary/10 group"
              onClick={() => window.open(author.linkedin, '_blank')}
            >
              <LinkedinLogo size={20} weight="regular" className="group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
