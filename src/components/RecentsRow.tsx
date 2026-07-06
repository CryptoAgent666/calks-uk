import { useState, useEffect } from 'react'

/**
 * Homepage strip: the visitor's favourite and recently used calculators.
 * Renders nothing on a first visit — zero layout cost until there is history.
 * Titles are resolved from the calculator index, loaded lazily only when
 * localStorage actually has entries.
 */
const FAV_KEY = 'fav-calcs'
const RECENT_KEY = 'recent-calcs'

interface Chip {
  slug: string
  title: string
}

function readList(key: string): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(v) ? v.filter((s) => typeof s === 'string') : []
  } catch {
    return []
  }
}

export default function RecentsRow() {
  const [favs, setFavs] = useState<Chip[]>([])
  const [recents, setRecents] = useState<Chip[]>([])

  useEffect(() => {
    const favSlugs = readList(FAV_KEY)
    const recentSlugs = readList(RECENT_KEY).filter((s) => !favSlugs.includes(s)).slice(0, 6)
    if (favSlugs.length === 0 && recentSlugs.length === 0) return

    import('@/data/calculators').then(({ CALCULATORS }) => {
      const titleOf = (slug: string) => CALCULATORS.find((c) => c.slug === slug)?.title
      const resolve = (slugs: string[]) =>
        slugs.flatMap((slug) => {
          const title = titleOf(slug)
          return title ? [{ slug, title }] : []
        })
      setFavs(resolve(favSlugs))
      setRecents(resolve(recentSlugs))
    })
  }, [])

  if (favs.length === 0 && recents.length === 0) return null

  const Section = ({ label, chips, star }: { label: string; chips: Chip[]; star?: boolean }) =>
    chips.length === 0 ? null : (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        {chips.map((c) => (
          <a
            key={c.slug}
            href={`/calculator/${c.slug}/`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-primary transition-colors"
          >
            {star && (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            )}
            {c.title}
          </a>
        ))}
      </div>
    )

  return (
    <div className="mt-6 space-y-3 animate-fade-in-up">
      <Section label="Favourites" chips={favs} star />
      <Section label="Recent" chips={recents} />
    </div>
  )
}
