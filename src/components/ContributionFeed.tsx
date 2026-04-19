import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loadContributions } from '@/lib/contributionLoader'
import { Contribution, Severity } from '@/types/contribution'
import { ContributionItem } from './ContributionItem'
import { Badge } from '@/components/ui/badge'
import {
  ShieldCheck,
  ShieldWarning,
  GitPullRequest,
  ArrowsClockwise,
} from '@phosphor-icons/react'

type View = 'advisories' | 'contributions'

const SEVERITY_ORDER: Severity[] = ['critical', 'high', 'medium', 'low']

export function ContributionFeed() {
  const [items, setItems] = useState<Contribution[]>([])
  const [generatedAt, setGeneratedAt] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('advisories')
  const [activeSeverities, setActiveSeverities] = useState<Set<Severity>>(new Set())

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    loadContributions().then((data) => {
      setItems(data.items)
      setGeneratedAt(data.generatedAt)
      setLoading(false)
    })
  }, [])

  const advisories = useMemo(
    () => items.filter((i) => i.type === 'advisory'),
    [items],
  )
  const patches = useMemo(
    () => items.filter((i) => i.type !== 'advisory'),
    [items],
  )

  const severities = useMemo(
    () =>
      SEVERITY_ORDER.filter((s) =>
        advisories.some((i) => (i.severity ?? 'unknown') === s),
      ),
    [advisories],
  )

  const sevCounts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const it of advisories) {
      const s = it.severity ?? 'unknown'
      c[s] = (c[s] ?? 0) + 1
    }
    return c
  }, [advisories])

  const visibleItems = useMemo(() => {
    if (view === 'contributions') return patches
    if (!activeSeverities.size) return advisories
    return advisories.filter((i) => activeSeverities.has(i.severity ?? 'unknown'))
  }, [view, advisories, patches, activeSeverities])

  function toggleSeverity(value: Severity) {
    const next = new Set(activeSeverities)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    setActiveSeverities(next)
  }

  const generatedLabel = generatedAt
    ? new Date(generatedAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  const VIEW_META: Record<View, { Icon: typeof ShieldWarning; label: string; count: number }> = {
    advisories: { Icon: ShieldWarning, label: 'Advisories', count: advisories.length },
    contributions: { Icon: GitPullRequest, label: 'Contributions', count: patches.length },
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-16">
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight bg-gradient-to-br from-foreground via-primary to-accent bg-clip-text text-transparent">
            Open Source Contributions
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Security advisories I've been credited on, alongside merged patches and
            other community contributions. Auto-synced from GitHub on every deploy.
          </p>
          {generatedLabel && (
            <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-muted-foreground/70">
              <ArrowsClockwise size={12} weight="bold" className="text-primary/70" />
              <span>last synced {generatedLabel}</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Segmented view toggle */}
      {!loading && items.length > 0 && (
        <div className="mb-8">
          <div
            role="tablist"
            aria-label="Contribution view"
            className="inline-flex items-center gap-1 p-1 rounded-lg border border-border/60 bg-card/60 backdrop-blur-sm"
          >
            {(['advisories', 'contributions'] as View[]).map((v) => {
              const meta = VIEW_META[v]
              const Icon = meta.Icon
              const active = view === v
              return (
                <button
                  key={v}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setView(v)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-md text-xs font-mono uppercase tracking-widest transition-all duration-200 ${
                    active
                      ? 'text-primary-foreground bg-gradient-to-r from-primary to-primary/80 shadow-md'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <Icon
                    size={14}
                    weight={active ? 'fill' : 'duotone'}
                    className={active ? '' : 'text-primary'}
                  />
                  <span>{meta.label}</span>
                  <Badge
                    variant="secondary"
                    className={`h-5 px-1.5 text-[10px] font-mono ${
                      active
                        ? 'bg-background/20 text-primary-foreground border-transparent'
                        : 'bg-secondary/80'
                    }`}
                  >
                    {meta.count}
                  </Badge>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Severity filter — advisories view only */}
      {!loading && view === 'advisories' && severities.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70 mr-1">
            Severity
          </span>
          {severities.map((s) => {
            const active = activeSeverities.has(s)
            return (
              <Badge
                key={s}
                variant={active ? 'default' : 'secondary'}
                onClick={() => toggleSeverity(s)}
                className={`cursor-pointer text-xs font-medium uppercase tracking-wider px-3 py-1 transition-all duration-200 font-mono ${
                  active
                    ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg border-primary/50'
                    : 'bg-secondary/70 hover:bg-accent hover:text-accent-foreground border-border/50'
                }`}
              >
                {s}
                <span className="ml-1.5 opacity-60">{sevCounts[s]}</span>
              </Badge>
            )
          })}
          {activeSeverities.size > 0 && (
            <button
              onClick={() => setActiveSeverities(new Set())}
              className="ml-2 text-[11px] font-medium text-primary hover:text-accent transition-colors uppercase tracking-wide"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Body */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="animate-pulse text-primary text-lg">Loading…</div>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Feed warming up"
          message="Contributions will appear here after the next build sync."
        />
      ) : visibleItems.length === 0 ? (
        <EmptyState
          title={view === 'advisories' ? 'No advisories match' : 'No contributions yet'}
          message={
            view === 'advisories'
              ? 'Try clearing the severity filter.'
              : 'Recent merged patches will appear here.'
          }
        />
      ) : (
        <div className="relative">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-accent/30 to-transparent hidden md:block" />
          <AnimatePresence mode="popLayout">
            <motion.ul layout className="space-y-4 md:pl-10">
              {visibleItems.map((item, idx) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.3) }}
                  className="relative"
                >
                  <span
                    aria-hidden
                    className="hidden md:block absolute -left-[34px] top-7 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_oklch(0.75_0.21_340_/_0.7)]"
                  />
                  <ContributionItem item={item} />
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="text-center py-24">
      <div className="max-w-md mx-auto">
        <ShieldCheck size={56} weight="duotone" className="mx-auto text-primary/40 mb-6" />
        <p className="text-2xl font-semibold text-foreground mb-3">{title}</p>
        <p className="text-base text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
