import { Contribution, ContributionsIndex } from '@/types/contribution'

let cache: ContributionsIndex | null = null

export async function loadContributions(): Promise<ContributionsIndex> {
  if (cache) return cache
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}contributions/index.json`, {
      cache: 'no-cache',
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as ContributionsIndex
    cache = {
      ...data,
      items: (data.items || []).slice().sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    }
    return cache
  } catch (err) {
    console.error('Failed to load contributions:', err)
    cache = { generatedAt: new Date(0).toISOString(), username: '', items: [] }
    return cache
  }
}

export function recentContributions(items: Contribution[], n = 4): Contribution[] {
  return items.slice(0, n)
}

/**
 * Pick the most recent items, prioritising advisories over patches.
 * Falls back to other items only if there aren't enough advisories.
 */
export function featuredContributions(items: Contribution[], n = 4): Contribution[] {
  const advisories = items.filter((i) => i.type === 'advisory')
  if (advisories.length >= n) return advisories.slice(0, n)
  const others = items.filter((i) => i.type !== 'advisory')
  return [...advisories, ...others].slice(0, n)
}
