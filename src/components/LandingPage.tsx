import { Author } from '@/types/blog'
import { Button } from '@/components/ui/button'
import { GithubLogo, TwitterLogo, LinkedinLogo, ArrowRight, Code, ShieldCheck, Bug } from '@phosphor-icons/react'
import { Logo } from '@/components/Logo'
import { Link } from 'react-router-dom'

interface LandingPageProps {
  author: Author
}

export function LandingPage({ author }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative max-w-4xl mx-auto text-center space-y-8 z-10">
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
            <div className="relative w-32 h-32 rounded-full border-2 border-primary/50 bg-card/50 backdrop-blur shadow-2xl flex items-center justify-center">
              <Logo size={80} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              {author.name}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-mono">
            {author.handle}
          </p>
        </div>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {author.bio}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-lg border border-border/50">
            <Bug size={20} className="text-accent" weight="duotone" />
            <span className="text-sm text-muted-foreground">Vuln Research</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-lg border border-border/50">
            <Code size={20} className="text-primary" weight="duotone" />
            <span className="text-sm text-muted-foreground">Exploit Dev</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-lg border border-border/50">
            <ShieldCheck size={20} className="text-primary" weight="duotone" />
            <span className="text-sm text-muted-foreground">Security</span>
          </div>
        </div>

        <div className="pt-8 space-y-4">
          <Button
            asChild
            size="lg"
            className="text-lg px-8 py-6 group shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link to="/blog">
              Explore Research
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <div className="flex items-center justify-center gap-3 pt-4">
            <Button
              variant="outline"
              size="icon"
              className="text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200 group"
              onClick={() => window.open(author.github, '_blank')}
            >
              <GithubLogo size={20} weight="regular" className="group-hover:scale-110 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-muted-foreground hover:text-accent hover:border-accent transition-all duration-200 group"
              onClick={() => window.open(author.twitter, '_blank')}
            >
              <TwitterLogo size={20} weight="regular" className="group-hover:scale-110 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200 group"
              onClick={() => window.open(author.linkedin, '_blank')}
            >
              <LinkedinLogo size={20} weight="regular" className="group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
