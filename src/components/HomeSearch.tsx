import { useState, useMemo } from 'react'

interface CalcItem {
  slug: string
  title: string
  description: string
  category: string
}

export default function HomeSearch({ calculators }: { calculators: CalcItem[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return calculators
      .filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
      .slice(0, 8)
  }, [query, calculators])

  return (
    <div className="relative">
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search calculators... (e.g. income tax, mortgage, BMI)"
          className="w-full rounded-2xl border border-border bg-card pl-12 pr-4 py-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>

      {/* Results Dropdown */}
      {filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-popover shadow-xl z-50 overflow-hidden">
          {filtered.map((calc) => (
            <a
              key={calc.slug}
              href={`/calculator/${calc.slug}/`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors border-b border-border/50 last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{calc.title}</p>
                <p className="text-xs text-muted-foreground truncate">{calc.description}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
