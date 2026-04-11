import { useState, useMemo } from 'react'

// Livestock units (UK standard)
const STOCK_TYPES = [
  { name: 'Dairy cow', su: 1.0, category: 'Cattle' },
  { name: 'Beef cow (suckler)', su: 0.75, category: 'Cattle' },
  { name: 'Beef store (1-2yr)', su: 0.6, category: 'Cattle' },
  { name: 'Calf (<1yr)', su: 0.4, category: 'Cattle' },
  { name: 'Bull', su: 0.65, category: 'Cattle' },
  { name: 'Breeding ewe', su: 0.08, category: 'Sheep' },
  { name: 'Ram', su: 0.1, category: 'Sheep' },
  { name: 'Store lamb', su: 0.04, category: 'Sheep' },
  { name: 'Sow (breeding)', su: 0.4, category: 'Pigs' },
  { name: 'Finishing pig', su: 0.12, category: 'Pigs' },
  { name: 'Horse', su: 1.0, category: 'Other' },
  { name: 'Pony', su: 0.5, category: 'Other' },
  { name: 'Goat (breeding)', su: 0.1, category: 'Other' },
]

export default function StockUnitCalculator() {
  const [counts, setCounts] = useState<Record<number, number>>({})

  const updateCount = (idx: number, count: number) => {
    setCounts(prev => {
      const next = { ...prev }
      if (count > 0) next[idx] = count
      else delete next[idx]
      return next
    })
  }

  const totalSU = Object.entries(counts).reduce((sum, [idx, count]) => sum + STOCK_TYPES[parseInt(idx)].su * count, 0)
  const totalHead = Object.values(counts).reduce((sum, count) => sum + count, 0)

  // Stocking rate guidance
  const hectaresNeeded = totalSU / 2 // rough: 2 livestock units per hectare for good grassland
  const acresNeeded = hectaresNeeded * 2.471

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {STOCK_TYPES.map((stock, i) => (
          <div key={stock.name} className="flex items-center gap-3 rounded-xl border border-border p-3">
            <span className="text-sm font-medium w-40 shrink-0">{stock.name}</span>
            <span className="text-xs text-muted-foreground w-16 shrink-0">{stock.su} SU</span>
            <input type="number" min="0" max="1000" value={counts[i] || ''} onChange={(e) => updateCount(i, parseInt(e.target.value) || 0)} placeholder="0" className="w-20 rounded-lg border border-input bg-background px-2 py-1.5 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
            {counts[i] > 0 && <span className="text-sm font-medium text-primary ml-auto">{(STOCK_TYPES[i].su * counts[i]).toFixed(1)} SU</span>}
          </div>
        ))}
      </div>

      {totalHead > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total Stock Units</p><p className="text-2xl font-bold text-primary">{totalSU.toFixed(1)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Head</p><p className="text-lg font-bold">{totalHead}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Land Needed (~2 SU/ha)</p><p className="text-lg font-bold">{hectaresNeeded.toFixed(1)} ha</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">In Acres</p><p className="text-lg font-bold">{acresNeeded.toFixed(1)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
