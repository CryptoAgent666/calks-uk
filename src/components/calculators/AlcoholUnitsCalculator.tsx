import { useState, useMemo } from 'react'

const DRINKS = [
  { name: 'Pint of lager (4%)', ml: 568, abv: 4 },
  { name: 'Pint of strong lager (5.2%)', ml: 568, abv: 5.2 },
  { name: 'Small glass of wine (125ml, 12%)', ml: 125, abv: 12 },
  { name: 'Medium glass of wine (175ml, 12%)', ml: 175, abv: 12 },
  { name: 'Large glass of wine (250ml, 12%)', ml: 250, abv: 12 },
  { name: 'Single spirit (25ml, 40%)', ml: 25, abv: 40 },
  { name: 'Double spirit (50ml, 40%)', ml: 50, abv: 40 },
  { name: 'Bottle of beer (330ml, 5%)', ml: 330, abv: 5 },
  { name: 'Can of cider (440ml, 4.5%)', ml: 440, abv: 4.5 },
  { name: 'Alcopop (275ml, 4%)', ml: 275, abv: 4 },
]

const WEEKLY_LIMIT = 14

function calcUnits(ml: number, abv: number) {
  return (ml * abv) / 1000
}

export default function AlcoholUnitsCalculator() {
  const [customMl, setCustomMl] = useState('')
  const [customAbv, setCustomAbv] = useState('')
  const [quantities, setQuantities] = useState<Record<number, number>>({})

  const customUnits = useMemo(() => {
    const m = parseFloat(customMl) || 0
    const a = parseFloat(customAbv) || 0
    return calcUnits(m, a)
  }, [customMl, customAbv])

  const totalUnits = useMemo(() => {
    return Object.entries(quantities).reduce((sum, [idx, qty]) => {
      const drink = DRINKS[parseInt(idx)]
      return sum + calcUnits(drink.ml, drink.abv) * qty
    }, 0)
  }, [quantities])

  const updateQty = (idx: number, delta: number) => {
    setQuantities(prev => {
      const current = prev[idx] || 0
      const next = Math.max(0, current + delta)
      if (next === 0) { const { [idx]: _, ...rest } = prev; return rest }
      return { ...prev, [idx]: next }
    })
  }

  return (
    <div className="space-y-6">
      {/* Quick add drinks */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Add Drinks</h3>
        <div className="space-y-2">
          {DRINKS.map((drink, i) => {
            const units = calcUnits(drink.ml, drink.abv)
            const qty = quantities[i] || 0
            return (
              <div key={i} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <span className="text-sm font-medium">{drink.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{units.toFixed(1)} units</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(i, -1)} className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-lg hover:bg-accent">−</button>
                  <span className="w-6 text-center font-medium">{qty}</span>
                  <button onClick={() => updateQty(i, 1)} className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-lg hover:bg-accent">+</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Custom drink */}
      <div className="rounded-xl border border-border p-4 space-y-3">
        <h3 className="text-sm font-semibold">Custom Drink</h3>
        <div className="grid grid-cols-3 gap-3 items-end">
          <div><label className="block text-xs text-muted-foreground mb-1">Volume (ml)</label><input type="number" min="0" value={customMl} onChange={(e) => setCustomMl(e.target.value)} placeholder="500" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Volume (ml)" /></div>
          <div><label className="block text-xs text-muted-foreground mb-1">ABV (%)</label><input type="number" min="0" max="100" step="0.1" value={customAbv} onChange={(e) => setCustomAbv(e.target.value)} placeholder="5" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="ABV (%)" /></div>
          <div className="text-center"><span className="text-lg font-bold text-primary">{customUnits.toFixed(1)} units</span></div>
        </div>
      </div>

      {/* Total */}
      {totalUnits > 0 && (
        <div className={`rounded-2xl p-6 text-center ${totalUnits > WEEKLY_LIMIT ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}>
          <p className="text-sm text-muted-foreground">Total Units</p>
          <p className={`text-3xl font-bold mt-1 ${totalUnits > WEEKLY_LIMIT ? 'text-destructive' : 'text-green-700 dark:text-green-400'}`}>{totalUnits.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground mt-1">NHS guideline: max {WEEKLY_LIMIT} units per week</p>
        </div>
      )}
    </div>
  )
}
