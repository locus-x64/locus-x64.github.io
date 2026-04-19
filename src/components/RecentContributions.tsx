import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldWarning } from '@phosphor-icons/react'
import { loadContributions, featuredContributions } from '@/lib/contributionLoader'
import { Contribution } from '@/types/contribution'
import { ContributionItem } from './ContributionItem'

export function RecentContributions() {
  const [items, setItems] = useState<Contribution[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadContributions().then((data) => {
      setItems(featuredContributions(data.items, 4))
      setLoaded(true)
    })
  }, [])

  if (!loaded || items.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative max-w-5xl mx-auto w-full mt-16 z-10"
    >
      <div className="flex items-end justify-between mb-5 px-1">
        <div className="flex items-center gap-2.5">
          <ShieldWarning size={18} weight="duotone" className="text-primary" />
          <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground">
            Recent Advisories
          </h2>
        </div>
        <Link
          to="/contributions"
          className="text-xs font-mono uppercase tracking-wider text-primary hover:text-accent transition-colors flex items-center gap-1.5 group"
        >
          View all
          <ArrowRight
            size={12}
            weight="bold"
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <ContributionItem key={item.id} item={item} compact />
        ))}
      </div>
    </motion.section>
  )
}
