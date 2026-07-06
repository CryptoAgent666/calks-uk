import { useState, useEffect, useRef, useCallback } from 'react'

interface CalcIndexItem {
  slug: string
  title: string
  keywords: string[]
  category: string
}

// The calculator index is imported only when the user opens search, so this
// island adds ~1 KB to every page and the index chunk is fetched once on demand.
let INDEX: CalcIndexItem[] | null = null
async function loadIndex(): Promise<CalcIndexItem[]> {
  if (INDEX) return INDEX
  const mod = await import('@/data/calculators')
  INDEX = mod.CALCULATORS.map((c) => ({
    slug: c.slug,
    title: c.title,
    keywords: c.keywords,
    category: c.category,
  }))
  return INDEX
}

export default function HeaderSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<CalcIndexItem[]>([])
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const openSearch = useCallback(() => {
    setOpen(true)
    loadIndex().then(setItems)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActive(0)
  }, [])

  // Focus the input as soon as the panel renders
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Esc closes; Cmd/Ctrl+K toggles from anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        open ? close() : openSearch()
      } else if (e.key === 'Escape' && open) {
        close()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close, openSearch])

  // Click outside closes
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open, close])

  const q = query.trim().toLowerCase()
  const results = q
    ? items
        .map((c) => {
          const title = c.title.toLowerCase()
          // Rank: title prefix > title substring > keyword match
          let score = 0
          if (title.startsWith(q)) score = 3
          else if (title.includes(q)) score = 2
          else if (c.keywords.some((k) => k.toLowerCase().includes(q))) score = 1
          return { c, score }
        })
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map((r) => r.c)
    : []

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && results[active]) {
      window.location.href = `/calculator/${results[active].slug}/`
    }
  }

  return (
    <div ref={panelRef}>
      <button
        onClick={() => (open ? close() : openSearch())}
        aria-label="Search calculators"
        aria-expanded={open}
        className="inline-flex items-center gap-2 h-11 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <span className="hidden md:inline">Search</span>
        <kbd className="hidden lg:inline text-[10px] font-mono border border-border rounded px-1.5 py-0.5 text-muted-foreground/70">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed left-0 right-0 top-16 z-50 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-popover shadow-2xl shadow-black/20 overflow-hidden">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActive(0) }}
                onKeyDown={onInputKey}
                placeholder="Search 335 calculators… (e.g. take-home pay, stamp duty)"
                aria-label="Search calculators"
                className="w-full bg-transparent pl-11 pr-4 py-3.5 text-base focus:outline-none border-b border-border"
              />
            </div>
            {results.length > 0 && (
              <ul role="listbox" aria-label="Search results">
                {results.map((c, i) => (
                  <li key={c.slug} role="option" aria-selected={i === active}>
                    <a
                      href={`/calculator/${c.slug}/`}
                      className={`block px-4 py-2.5 text-sm transition-colors ${i === active ? 'bg-accent' : 'hover:bg-accent'}`}
                      onMouseEnter={() => setActive(i)}
                    >
                      <span className="font-medium">{c.title}</span>
                      <span className="ml-2 text-xs text-muted-foreground capitalize">{c.category}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {q && results.length === 0 && items.length > 0 && (
              <p className="px-4 py-3 text-sm text-muted-foreground">
                Nothing found — try the <a href="/calculators/" className="text-primary underline">full A–Z list</a>.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
