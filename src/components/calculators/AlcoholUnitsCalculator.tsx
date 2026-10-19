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
const MAX_ML = 5000

type CustomDrink = { ml: string; abv: string; qty: number }

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

// Units = ml x ABV% / 1,000. ml x ABV is rounded to whole hundredths first so that
// binary floating point does not turn 1.65 into 1.6 (330 ml of 5% beer is 1.7 units).
function calcUnits(ml: number, abv: number) {
  return Math.round(ml * abv * 100) / 100000
}

function fmtUnits(units: number) {
  return (Math.round(units * 10 + 1e-9) / 10).toFixed(1)
}

function customUnits(d: CustomDrink) {
  const ml = clamp(parseFloat(d.ml) || 0, 0, MAX_ML)
  const abv = clamp(parseFloat(d.abv) || 0, 0, 100)
  return calcUnits(ml, abv)
}

const btn = 'h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-lg hover:bg-accent'
const inputCls = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring'

export default function AlcoholUnitsCalculator() {
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [custom, setCustom] = useState<CustomDrink[]>([{ ml: '', abv: '', qty: 1 }])

  const totalUnits = useMemo(() => {
    const preset = Object.entries(quantities).reduce((sum, [idx, qty]) => {
      const drink = DRINKS[parseInt(idx)]
      return sum + calcUnits(drink.ml, drink.abv) * qty
    }, 0)
    const own = custom.reduce((sum, d) => sum + customUnits(d) * d.qty, 0)
    return preset + own
  }, [quantities, custom])

  const updateQty = (idx: number, delta: number) => {
    setQuantities(prev => {
      const current = prev[idx] || 0
      const next = Math.max(0, current + delta)
      if (next === 0) { const { [idx]: _, ...rest } = prev; return rest }
      return { ...prev, [idx]: next }
    })
  }

  const updateCustom = (i: number, patch: Partial<CustomDrink>) => {
    setCustom(prev => prev.map((d, j) => (j === i ? { ...d, ...patch } : d)))
  }

  const over = totalUnits > WEEKLY_LIMIT
  const shown = Number(fmtUnits(totalUnits))
  const pct = Math.round((totalUnits / WEEKLY_LIMIT) * 100)

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
                  <span className="text-xs text-muted-foreground ml-2">{fmtUnits(units)} units</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => updateQty(i, -1)} className={btn} aria-label={`Remove one ${drink.name}`}>−</button>
                  <span className="w-6 text-center font-medium">{qty}</span>
                  <button type="button" onClick={() => updateQty(i, 1)} className={btn} aria-label={`Add one ${drink.name}`}>+</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Custom drinks */}
      <div className="rounded-xl border border-border p-4 space-y-3">
        <h3 className="text-sm font-semibold">Custom Drinks</h3>
        <p className="text-xs text-muted-foreground">Enter the volume and strength (ABV) from the label. Each custom drink is added to the total.</p>
        {custom.map((d, i) => {
          const units = customUnits(d)
          return (
            <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
              <div><label className="block text-xs text-muted-foreground mb-1">Volume (ml)</label><input type="number" min="0" max={MAX_ML} value={d.ml} onChange={(e) => updateCustom(i, { ml: e.target.value })} placeholder="568" className={inputCls} aria-label={`Custom drink ${i + 1} volume (ml)`} /></div>
              <div><label className="block text-xs text-muted-foreground mb-1">ABV (%)</label><input type="number" min="0" max="100" step="0.1" value={d.abv} onChange={(e) => updateCustom(i, { abv: e.target.value })} placeholder="5" className={inputCls} aria-label={`Custom drink ${i + 1} ABV (%)`} /></div>
              <div>
                <span className="block text-xs text-muted-foreground mb-1">How many</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => updateCustom(i, { qty: Math.max(0, d.qty - 1) })} className={btn} aria-label={`Fewer of custom drink ${i + 1}`}>−</button>
                  <span className="w-6 text-center font-medium">{d.qty}</span>
                  <button type="button" onClick={() => updateCustom(i, { qty: d.qty + 1 })} className={btn} aria-label={`More of custom drink ${i + 1}`}>+</button>
                </div>
              </div>
              <div className="text-center">
                <span className="text-lg font-bold text-primary">{fmtUnits(units * d.qty)} units</span>
                {d.qty > 1 && <span className="block text-xs text-muted-foreground">{fmtUnits(units)} each</span>}
              </div>
            </div>
          )
        })}
        <div className="flex gap-3">
          <button type="button" onClick={() => setCustom(prev => [...prev, { ml: '', abv: '', qty: 1 }])} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-accent">+ Add another custom drink</button>
          {custom.length > 1 && (
            <button type="button" onClick={() => setCustom(prev => prev.slice(0, -1))} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-accent">Remove last</button>
          )}
        </div>
      </div>

      {/* Total */}
      <div className={`rounded-2xl p-6 text-center ${over ? 'bg-destructive/10' : shown > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-muted/50'}`} aria-live="polite">
        <p className="text-sm text-muted-foreground">Total Units</p>
        <p className={`text-3xl font-bold mt-1 ${over ? 'text-destructive' : shown > 0 ? 'text-green-700 dark:text-green-400' : ''}`}>{fmtUnits(totalUnits)}</p>
        <p className="text-sm text-muted-foreground mt-1">
          UK Chief Medical Officers&rsquo; guideline: no more than {WEEKLY_LIMIT} units a week on a regular basis
          {shown > 0 && <> ({pct}% of {WEEKLY_LIMIT})</>}
        </p>
      </div>

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
        <p>If you regularly drink as much as {WEEKLY_LIMIT} units a week, the NHS advises spreading it over 3 or more days and having several drink-free days each week.</p>
        {totalUnits > 6 && (
          <p className="font-medium text-foreground">More than 8 units in a single session for men, or more than 6 units for women, counts as binge drinking (NHS).</p>
        )}
        <p>No one can say how many units keep you under the drink-drive limit. If you are driving, do not drink.</p>
      </div>
    </div>
  )
}
