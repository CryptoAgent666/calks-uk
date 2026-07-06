import { useState, useEffect } from 'react'

/**
 * Star toggle on calculator pages + visit recorder. Both lists live in
 * localStorage only — no accounts, consistent with the privacy positioning.
 * The homepage RecentsRow island reads the same keys.
 */
const FAV_KEY = 'fav-calcs'
const RECENT_KEY = 'recent-calcs'
const RECENT_MAX = 8

function readList(key: string): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(v) ? v.filter((s) => typeof s === 'string') : []
  } catch {
    return []
  }
}

export default function FavoriteButton({ slug }: { slug: string }) {
  const [fav, setFav] = useState(false)

  useEffect(() => {
    try {
      setFav(readList(FAV_KEY).includes(slug))
      // Record the visit (most recent first, deduped)
      const recents = [slug, ...readList(RECENT_KEY).filter((s) => s !== slug)].slice(0, RECENT_MAX)
      localStorage.setItem(RECENT_KEY, JSON.stringify(recents))
    } catch { /* storage unavailable */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = () => {
    try {
      const favs = readList(FAV_KEY)
      const next = favs.includes(slug) ? favs.filter((s) => s !== slug) : [...favs, slug]
      localStorage.setItem(FAV_KEY, JSON.stringify(next))
      setFav(next.includes(slug))
    } catch { /* storage unavailable */ }
  }

  return (
    <button
      onClick={toggle}
      aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
      aria-pressed={fav}
      title={fav ? 'Remove from favourites' : 'Add to favourites'}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors print:hidden ${
        fav
          ? 'border-amber-300 bg-amber-100 text-amber-500 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-400'
          : 'border-border bg-muted text-muted-foreground hover:text-foreground hover:bg-accent'
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  )
}
