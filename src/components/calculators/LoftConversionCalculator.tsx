import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type ConversionType = 'velux' | 'dormer' | 'hip_to_gable' | 'mansard'
const TYPES: Record<ConversionType, { name: string; costRange: [number, number]; valueAdd: number; planningNeeded: boolean }> = {
  velux: { name: 'Velux / Rooflight', costRange: [20_000, 35_000], valueAdd: 0.15, planningNeeded: false },
  dormer: { name: 'Dormer', costRange: [35_000, 55_000], valueAdd: 0.20, planningNeeded: false },
  hip_to_gable: { name: 'Hip-to-Gable + Dormer', costRange: [45_000, 65_000], valueAdd: 0.20, planningNeeded: true },
  mansard: { name: 'Mansard', costRange: [55_000, 80_000], valueAdd: 0.25, planningNeeded: true },
}

function calculate(type: ConversionType, propertyValue: number) {
  const info = TYPES[type]
  const avgCost = (info.costRange[0] + info.costRange[1]) / 2
  const valueAdded = propertyValue * info.valueAdd
  const roi = avgCost > 0 ? ((valueAdded - avgCost) / avgCost) * 100 : 0
  const profitable = valueAdded > avgCost

  return { info, avgCost, valueAdded, roi, profitable }
}

export default function LoftConversionCalculator() {
  const [type, setType] = useState<ConversionType>('dormer')
  const [value, setValue] = useState('350000')

  const v = parseFloat(value.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(type, v), [type, v])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Conversion Type</label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(TYPES) as [ConversionType, typeof TYPES[ConversionType]][]).map(([k, v]) => (
            <button key={k} onClick={() => setType(k)} className={`px-4 py-3 rounded-xl text-sm text-left border transition-colors ${type === k ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
              <div className="font-medium">{v.name}</div>
              <div className={`text-xs ${type === k ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>£{(v.costRange[0]/1000).toFixed(0)}K–£{(v.costRange[1]/1000).toFixed(0)}K{v.planningNeeded ? ' • Planning req.' : ' • Permitted dev.'}</div>
            </button>
          ))}
        </div>
      </div>
      <div><label className="block text-sm font-medium mb-2">Current Property Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>

      {v > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Est. Cost</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.avgCost)}</p><p className="text-xs text-muted-foreground">{formatCurrency(result.info.costRange[0])}–{formatCurrency(result.info.costRange[1])}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Value Added</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.valueAdded)}</p><p className="text-xs text-muted-foreground">+{(result.info.valueAdd*100).toFixed(0)}% of property</p></div>
            <div className={`rounded-xl p-4 text-center ${result.profitable ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">ROI</p><p className={`text-xl font-bold ${result.profitable ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{result.roi.toFixed(0)}%</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">New Value</p><p className="text-lg font-bold">{formatCurrency(v + result.valueAdded)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>{result.info.planningNeeded ? 'Planning permission likely required.' : 'Usually falls under Permitted Development.'} Building Regulations approval always needed. Party Wall Act may apply for semi/terrace.</p>
          </div>
        </div>
      )}
    </div>
  )
}
