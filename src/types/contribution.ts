export type ContributionType =
  | 'advisory'
  | 'patch'
  | 'report'
  | 'commit'
  | 'disclosure'

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'unknown'

export interface Contribution {
  /** Stable unique id (e.g. "pr:owner/repo#123" or "ghsa:GHSA-xxxx") */
  id: string
  type: ContributionType
  title: string
  summary: string
  /** "owner/name" */
  repo: string
  /** Canonical link (PR url, GHSA url, commit url) */
  url: string
  /** ISO 8601 date */
  date: string
  cveId?: string
  ghsaId?: string
  severity?: Severity
  cvss?: number
  state?: 'merged' | 'open' | 'closed' | 'published' | 'withdrawn'
  tags: string[]
  /** Slug of an internal blog post writing this up */
  relatedPostSlug?: string
}

export interface ContributionsIndex {
  generatedAt: string
  username: string
  items: Contribution[]
}
