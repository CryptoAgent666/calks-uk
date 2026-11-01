import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Costs: Checkatrade loft conversion price guide, 30 m² loft, table last updated March 2026.
// Extras of 10-15% (drawings, structural calculations, finishes) are from the same guide.
// The value uplift is the reader's assumption: Checkatrade's estimate is 15-25%.
// Planning: GPDO 2015 Sch 2 Pt 1, Class B (roof enlargement) and Class C (roof lights), England.
type ConversionType = 'velux' | 'dormer' | 'hip_to_gable' | 'mansard'
const TYPES: Record<ConversionType, { name: string; typical: number; costRange: [number, number]; planningNeeded: boolean; planning: string }> = {
  velux: { name: 'Velux / Rooflight', typical: 27_500, costRange: [22_500, 30_000], planningNeeded: false, planning: 'Roof lights are usually Permitted Development: no more than 0.15 m proud of the roof slope, no higher than the original roof, and side-slope windows obscure-glazed and fixed unless the opening part is over 1.7 m above the floor.' },
  dormer: { name: 'Dormer', typical: 50_000, costRange: [40_000, 60_000], planningNeeded: false, planning: 'Usually Permitted Development, side dormers included, if the extra roof space is within 40 m³ (terrace) or 50 m³ (other houses), nothing goes beyond a front roof slope facing a highway and the house is not on Article 2(3) land such as a conservation area.' },
  hip_to_gable: { name: 'Hip-to-Gable + Dormer', typical: 60_000, costRange: [50_000, 70_000], planningNeeded: false, planning: 'Usually Permitted Development if the extra roof space is within 40 m³ (terrace) or 50 m³ (other houses), nothing goes beyond a front roof slope facing a highway and the house is not on Article 2(3) land such as a conservation area.' },
  mansard: { name: 'Mansard', typical: 65_000, costRange: [50_000, 80_000], planningNeeded: true, planning: 'Planning permission is usually required.' },
}
const EXTRAS_LOW = 0.10
const EXTRAS_HIGH = 0.15
const DEFAULT_UPLIFT = '20'

function calculate(type: ConversionType, propertyValue: number, upliftPct: number) {
  const info = TYPES[type]
  const budgetLow = info.typical * (1 + EXTRAS_LOW)
  const budgetHigh = info.typical * (1 + EXTRAS_HIGH)
  const valueAdded = propertyValue * (upliftPct / 100)
  // Measured against the top of the budget, so the return is not flattered by leaving extras out
  const roi = budgetHigh > 0 ? ((valueAdded - budgetHigh) / budgetHigh) * 100 : 0
  const profitable = valueAdded > budgetHigh

  return { info, budgetLow, budgetHigh, valueAdded, roi, profitable }
}

export default function LoftConversionCalculator() {
  const [type, setType] = useState<ConversionType>('dormer')
  const [value, setValue] = useState('350000')
  const [uplift, setUplift] = useState(DEFAULT_UPLIFT)

  const v = parseFloat(value.replace(/,/g,'')) || 0
  const u = Math.max(0, parseFloat(uplift) || 0)
  const result = useMemo(() => calculate(type, v, u), [type, v, u])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Conversion Type</label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(TYPES) as [ConversionType, typeof TYPES[ConversionType]][]).map(([k, v]) => (
            <button key={k} onClick={() => setType(k)} className={`px-4 py-3 rounded-xl text-sm text-left border transition-colors ${type === k ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
              <div className="font-medium">{v.name}</div>
              <div className={`text-xs ${type === k ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>£{(v.costRange[0]/1000).toFixed(1).replace('.0', '')}K–£{(v.costRange[1]/1000).toFixed(0)}K{v.planningNeeded ? ' • Planning usually req.' : ' • Permitted dev. within limits'}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Current Property Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current Property Value" /></div></div>
        <div>
          <label className="block text-sm font-medium mb-2">Value Uplift You Assume (%)</label>
          <input type="number" min="0" max="100" value={uplift} onChange={(e) => setUplift(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Value Uplift You Assume (%)" />
          <p className="text-xs text-muted-foreground mt-1">An assumption, not a valuation. Checkatrade estimates 15% to 25%; ask a local agent.</p>
        </div>
      </div>

      {v > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Typical Cost</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.info.typical)}</p><p className="text-xs text-muted-foreground">{formatCurrency(result.info.costRange[0])}–{formatCurrency(result.info.costRange[1])}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Value Added</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.valueAdded)}</p><p className="text-xs text-muted-foreground">+{u}% assumed</p></div>
            <div className={`rounded-xl p-4 text-center ${result.profitable ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">ROI</p><p className={`text-xl font-bold ${result.profitable ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{result.roi.toFixed(0)}%</p><p className="text-xs text-muted-foreground">after 15% extras</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">New Value</p><p className="text-lg font-bold">{formatCurrency(v + result.valueAdded)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
            <p>Budget with extras such as drawings, structural calculations and finishes, at 10% to 15%: {formatCurrency(result.budgetLow)} to {formatCurrency(result.budgetHigh)}. Costs are Checkatrade's averages for a 30 m² loft (March 2026).</p>
            <p>{result.info.planning} Rules are for England. Building Regulations approval always needed. Party Wall Act may apply for semi/terrace.</p>
          </div>
        </div>
      )}
    </div>
  )
}
