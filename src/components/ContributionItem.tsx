import { Contribution, ContributionType, Severity } from '@/types/contribution'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  ShieldWarning,
  GitPullRequest,
  GitCommit,
  Bug,
  Megaphone,
  ArrowSquareOut,
  Copy,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

interface ContributionItemProps {
  item: Contribution
  /** Compact = landing page strip variant */
  compact?: boolean
}

const TYPE_META: Record<
  ContributionType,
  { label: string; Icon: typeof Bug; iconClass: string }
> = {
  advisory: { label: 'Advisory', Icon: ShieldWarning, iconClass: 'text-destructive' },
  patch: { label: 'Merged PR', Icon: GitPullRequest, iconClass: 'text-primary' },
  commit: { label: 'Commit', Icon: GitCommit, iconClass: 'text-accent' },
  report: { label: 'Vuln Report', Icon: Bug, iconClass: 'text-accent' },
  disclosure: { label: 'Disclosure', Icon: Megaphone, iconClass: 'text-primary' },
}

const SEVERITY_META: Record<Severity, { label: string; rail: string; pill: string }> = {
  critical: {
    label: 'CRITICAL',
    rail: 'bg-gradient-to-b from-destructive via-destructive/80 to-destructive/20',
    pill: 'bg-destructive/15 text-destructive border-destructive/40',
  },
  high: {
    label: 'HIGH',
    rail: 'bg-gradient-to-b from-primary via-primary/70 to-primary/10',
    pill: 'bg-primary/15 text-primary border-primary/40',
  },
  medium: {
    label: 'MEDIUM',
    rail: 'bg-gradient-to-b from-accent via-accent/70 to-accent/10',
    pill: 'bg-accent/15 text-accent border-accent/40',
  },
  low: {
    label: 'LOW',
    rail: 'bg-gradient-to-b from-muted-foreground/60 to-muted-foreground/10',
    pill: 'bg-muted text-muted-foreground border-border',
  },
  unknown: {
    label: '—',
    rail: 'bg-gradient-to-b from-border via-border/70 to-transparent',
    pill: 'bg-muted text-muted-foreground border-border',
  },
}

function copyToClipboard(value: string, label: string) {
  navigator.clipboard
    ?.writeText(value)
    .then(() => toast.success(`${label} copied`, { description: value }))
    .catch(() => toast.error('Copy failed'))
}

export function ContributionItem({ item, compact = false }: ContributionItemProps) {
  const meta = TYPE_META[item.type]
  const sev = SEVERITY_META[item.severity ?? 'unknown']
  const Icon = meta.Icon
  const dateLabel = new Date(item.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <motion.div
      whileHover={{ x: compact ? 0 : 4, y: compact ? -4 : 0 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative h-full"
    >
      <Card
        className={`relative h-full overflow-hidden border-border/80 hover:border-primary/70 transition-all duration-250 bg-card/90 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 group ${
          compact ? 'p-5' : 'p-6 pl-7'
        }`}
      >
        {/* Severity rail */}
        {!compact && (
          <div
            className={`absolute left-0 top-0 bottom-0 w-1 ${sev.rail}`}
            aria-hidden
          />
        )}

        {/* Hover sheen */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative flex flex-col gap-3 h-full">
          {/* Header row: type icon + repo + date */}
          <div className="flex items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-2 min-w-0">
              <Icon size={16} weight="duotone" className={`shrink-0 ${meta.iconClass}`} />
              <span className="uppercase tracking-widest text-[10px] font-semibold">
                {meta.label}
              </span>
              <span className="text-muted-foreground/60">·</span>
              <a
                href={`https://github.com/${item.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {item.repo}
              </a>
            </div>
            <span className="shrink-0">{dateLabel}</span>
          </div>

          {/* Title */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group/title"
          >
            <h3
              className={`font-semibold text-foreground group-hover/title:text-primary transition-colors duration-250 leading-tight font-mono ${
                compact ? 'text-base line-clamp-2' : 'text-lg md:text-xl line-clamp-2'
              }`}
            >
              {item.title}
              <ArrowSquareOut
                size={14}
                weight="bold"
                className="inline-block ml-1.5 -mt-0.5 opacity-0 group-hover/title:opacity-70 transition-opacity"
              />
            </h3>
          </a>

          {/* Summary */}
          {item.summary && !compact && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {item.summary}
            </p>
          )}

          {/* IDs row (CVE / GHSA / CVSS) */}
          {(item.cveId || item.ghsaId || item.cvss != null) && (
            <div className="flex flex-wrap items-center gap-1.5">
              {item.cveId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    copyToClipboard(item.cveId!, 'CVE')
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded border bg-card/60 font-mono text-[11px] text-foreground/90 border-border/60 hover:border-primary/60 hover:text-primary transition-colors"
                  title="Copy CVE ID"
                >
                  {item.cveId}
                  <Copy size={10} weight="bold" className="opacity-50" />
                </button>
              )}
              {item.ghsaId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    copyToClipboard(item.ghsaId!, 'GHSA')
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded border bg-card/60 font-mono text-[11px] text-muted-foreground border-border/60 hover:border-accent/60 hover:text-accent transition-colors"
                  title="Copy GHSA ID"
                >
                  {item.ghsaId}
                  <Copy size={10} weight="bold" className="opacity-50" />
                </button>
              )}
              {item.severity && item.severity !== 'unknown' && (
                <span
                  className={`px-2 py-0.5 rounded border font-mono text-[10px] font-semibold tracking-wider ${sev.pill}`}
                >
                  {sev.label}
                  {item.cvss != null ? ` · ${item.cvss.toFixed(1)}` : ''}
                </span>
              )}
            </div>
          )}

          {/* Tags + related post */}
          {!compact && (
            <div className="flex flex-wrap items-center gap-1.5 mt-auto pt-2 border-t border-border/50">
              {item.tags.slice(0, 4).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px] uppercase tracking-wide bg-secondary/70 border border-border/60 hover:bg-primary/15 hover:text-primary hover:border-primary/60 transition-all duration-200 font-mono backdrop-blur-sm px-2 py-0"
                >
                  {tag}
                </Badge>
              ))}
              {item.relatedPostSlug && (
                <Link
                  to={`/blog/${item.relatedPostSlug}`}
                  className="ml-auto text-[11px] font-mono text-primary hover:text-accent transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  read writeup →
                </Link>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
