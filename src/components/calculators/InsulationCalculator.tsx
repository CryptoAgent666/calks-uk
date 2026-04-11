import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type InsulationType = 'loft' | 'cavity' | 'solid' | 'floor'

const INSULATION: Record<InsulationType, { name: string; costPerSqm: number; savingPerYear: number; description: string }> = {
  loft: { name: 'Loft Insulation (270mm)', costPerSqm: 8, savingPerYear: 355, description: 'Top up from 100mm to 270mm' },
  cavity: { name: 'Cavity Wall Insulation', costPerSqm: 12, savingPerYear: 310, description: 'Fill empty cavity walls' },
  solid: { name: 'Solid Wall (internal)', costPerSqm: 100, savingPerYear: 460, description: 'Internal insulation boards' },
  floor: { name: 'Floor Insulation', costPerSqm: 25, savingPerYear: 110, description: 'Under suspended timber floor' },
}

function calculate(type: InsulationType, area: number) {
  const info = INSULATION[type]
  const cost = area * info.costPerSqm
  const annualSaving = info.savingPerYear
  const payback = annualSaving > 0 ? cost / annualSaving : 0
  const saving10yr = annualSaving * 10 - cost

  return { cost, annualSaving, payback, saving10yr, info }
}

export default function InsulationCalculator() {
  const [type, setType] = useState<InsulationType>('loft')
  const [area, setArea] = useState('50')

  const a = parseFloat(area) || 0
  const result = useMemo(() => calculate(type, a), [type, a])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Insulation Type</label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(INSULATION) as [InsulationType, typeof INSULATION[InsulationType]][]).map(([k, v]) => (
            <button key={k} onClick={() => setType(k)} className={`px-4 py-3 rounded-xl text-sm text-left border transition-colors ${type === k ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
              <div className="font-medium">{v.name}</div>
              <div className={`text-xs ${type === k ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>~£{v.costPerSqm}/m² &middot; saves ~£{v.savingPerYear}/yr</div>
            </button>
          ))}
        </div>
      </div>
      <div><label className="block text-sm font-medium mb-2">Area to Insulate (m²)</label><input type="number" min="0" max="500" value={area} onChange={(e) => setArea(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>

      {a > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Installation Cost</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.cost)}</p></div>
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Saving</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.annualSaving)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Payback</p><p className="text-lg font-bold">{result.payback.toFixed(1)} years</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">10yr Net Saving</p><p className={`text-lg font-bold ${result.saving10yr > 0 ? 'text-green-600' : 'text-destructive'}`}>{formatCurrency(result.saving10yr)}</p></div>
        </div>
      )}
    </div>
  )
}
