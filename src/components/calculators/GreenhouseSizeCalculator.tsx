import { useState, useMemo } from 'react'

const PLANTS: Record<string, { sqmPerPlant: number; name: string }> = {
  tomato: { sqmPerPlant: 0.25, name: 'Tomato Plants' },
  cucumber: { sqmPerPlant: 0.5, name: 'Cucumber Plants' },
  pepper: { sqmPerPlant: 0.2, name: 'Pepper Plants' },
  aubergine: { sqmPerPlant: 0.3, name: 'Aubergine Plants' },
  lettuce: { sqmPerPlant: 0.06, name: 'Lettuce' },
  herbs: { sqmPerPlant: 0.04, name: 'Herb Pots' },
  seedTrays: { sqmPerPlant: 0.1, name: 'Seed Trays' },
}

function calculate(length: number, width: number) {
  const totalArea = length * width
  const usableArea = totalArea * 0.70 // ~30% lost to paths/access
  const volume = totalArea * 2.2 // avg greenhouse height

  const plantCounts = Object.entries(PLANTS).map(([key, info]) => ({
    key, name: info.name, count: Math.floor(usableArea / info.sqmPerPlant),
  }))

  return { totalArea, usableArea, volume, plantCounts }
}

export default function GreenhouseSizeCalculator() {
  const [length, setLength] = useState('3')
  const [width, setWidth] = useState('2')

  const l = parseFloat(length) || 0
  const w = parseFloat(width) || 0
  const result = useMemo(() => calculate(l, w), [l, w])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Length (m)</label><input type="number" min="1" max="20" step="0.5" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Length (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Width (m)</label><input type="number" min="1" max="10" step="0.5" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Width (m)" /></div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[{l:'6x4ft',lm:1.8,wm:1.2},{l:'8x6ft',lm:2.4,wm:1.8},{l:'10x8ft',lm:3,wm:2.4},{l:'12x8ft',lm:3.6,wm:2.4}].map(p => (
          <button key={p.l} onClick={() => {setLength(p.lm.toString()); setWidth(p.wm.toString())}} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">{p.l}</button>
        ))}
      </div>

      {l > 0 && w > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Floor Area</p><p className="text-xl font-bold text-primary">{result.totalArea.toFixed(1)} m²</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Usable Growing</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{result.usableArea.toFixed(1)} m²</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Volume</p><p className="text-lg font-bold">{result.volume.toFixed(1)} m³</p></div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">How many plants will fit?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {result.plantCounts.map(p => (
                <div key={p.key} className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">{p.name}</p><p className="text-lg font-bold">{p.count}</p></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
