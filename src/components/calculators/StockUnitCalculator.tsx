import { useState } from 'react'

// Grazing livestock units (GLU) from the GOV.UK SFI26 action guidance (e.g. UPL3: Limited
// livestock grazing on moorland, updated 17 June 2026). Cattle ages are at the start of the
// agreement year. Lambs at foot have no separate GLU allocation; cattle of 6 months or under
// are not in the table, so they count as 0. Pigs and poultry are not grazing livestock and
// have no GLU value, so they are not listed.
const STOCK_TYPES = [
  { name: 'Dairy cow (over 2 years)', glu: 1.0 },
  { name: 'Suckler cow (over 2 years)', glu: 1.0 },
  { name: 'Bull (over 2 years)', glu: 1.0 },
  { name: 'Other cattle over 2 years', glu: 1.0 },
  { name: 'Cattle over 6 months to 2 years', glu: 0.6 },
  { name: 'Calf, 6 months or under (not counted)', glu: 0 },
  { name: 'Lowland ewe with lambs at foot', glu: 0.12 },
  { name: 'Ram', glu: 0.12 },
  { name: 'Hill ewe with lambs at foot', glu: 0.08 },
  { name: 'Hogg or teg', glu: 0.08 },
  { name: 'Store lamb', glu: 0.08 },
  { name: 'Goat', glu: 0.12 },
  { name: 'Horse', glu: 1.0 },
  { name: 'Pony or donkey', glu: 0.8 },
]

const MAX_HEAD = 100000

export default function StockUnitCalculator() {
  const [counts, setCounts] = useState<Record<number, number>>({})
  const [hectares, setHectares] = useState('')

  const updateCount = (idx: number, raw: string) => {
    const count = Math.min(MAX_HEAD, Math.max(0, parseInt(raw, 10) || 0))
    setCounts(prev => {
      const next = { ...prev }
      if (count > 0) next[idx] = count
      else delete next[idx]
      return next
    })
  }

  const totalGLU = Object.entries(counts).reduce((sum, [idx, count]) => sum + STOCK_TYPES[parseInt(idx, 10)].glu * count, 0)
  const totalHead = Object.values(counts).reduce((sum, count) => sum + count, 0)
  const ha = Math.max(0, parseFloat(hectares) || 0)
  const gluPerHa = ha > 0 ? totalGLU / ha : 0

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {STOCK_TYPES.map((stock, i) => (
          <div key={stock.name} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-border p-3">
            <span className="min-w-0 flex-1 basis-40 text-sm font-medium">{stock.name}</span>
            <span className="text-xs text-muted-foreground w-16 shrink-0">{stock.glu} GLU</span>
            <input type="number" min="0" max={MAX_HEAD} step="1" inputMode="numeric" value={counts[i] || ''} onChange={(e) => updateCount(i, e.target.value)} placeholder="0" aria-label={`Number of ${stock.name}`} className="w-20 shrink-0 rounded-lg border border-input bg-background px-2 py-1.5 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
            {counts[i] > 0 && <span className="ml-auto min-w-0 text-sm font-medium text-primary tabular-nums">{(stock.glu * counts[i]).toFixed(1)} GLU</span>}
          </div>
        ))}
      </div>

      <div className="max-w-xs">
        <label className="block text-sm font-medium mb-2">Forage Area (ha)</label>
        <input type="number" min="0" step="0.1" value={hectares} onChange={(e) => setHectares(e.target.value)} placeholder="e.g. 65" aria-label="Forage area in hectares" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      {totalHead > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total GLU</p><p className="text-2xl font-bold text-primary tabular-nums break-words">{totalGLU.toFixed(1)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Head</p><p className="text-lg font-bold tabular-nums break-words">{totalHead}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Forage Area</p><p className="text-lg font-bold tabular-nums break-words">{ha > 0 ? `${ha} ha` : '—'}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Stocking Rate</p><p className="text-lg font-bold tabular-nums break-words">{ha > 0 ? `${gluPerHa.toFixed(2)} GLU/ha` : 'Enter area'}</p></div>
          </div>
          <p className="text-xs text-muted-foreground">Compare the stocking rate with the limit in your scheme agreement. For example, the SFI26 action UPL3 (limited livestock grazing on moorland) allows no more than 0.04 GLU/ha at any time.</p>
        </div>
      )}
    </div>
  )
}
