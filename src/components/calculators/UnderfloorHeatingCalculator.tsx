import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type SystemType = 'water' | 'electric_mat' | 'electric_cable'

const SYSTEMS: Record<SystemType, { name: string; costPerSqm: number; runningCostPerSqm: number; description: string }> = {
  water: { name: 'Water (wet system)', costPerSqm: 50, runningCostPerSqm: 2.5, description: 'Connected to boiler/heat pump. Best for new builds or full renovations.' },
  electric_mat: { name: 'Electric Mat', costPerSqm: 35, runningCostPerSqm: 5, description: 'Thin mats under tiles. Easy retrofit, ideal for bathrooms.' },
  electric_cable: { name: 'Electric Cable', costPerSqm: 25, runningCostPerSqm: 5.5, description: 'Loose cable for irregular rooms. Cheapest to install.' },
}

function calculate(type: SystemType, area: number, hoursPerDay: number) {
  const info = SYSTEMS[type]
  const installCost = area * info.costPerSqm
  const annualRunning = area * info.runningCostPerSqm * (hoursPerDay / 8) // 8hrs as baseline
  const monthlyRunning = annualRunning / 12

  // vs radiators (approx)
  const radiatorAnnual = area * 3.5 * (hoursPerDay / 8)
  const savingVsRadiator = radiatorAnnual - annualRunning

  return { installCost, annualRunning, monthlyRunning, savingVsRadiator, info }
}

export default function UnderfloorHeatingCalculator() {
  const [type, setType] = useState<SystemType>('electric_mat')
  const [area, setArea] = useState('15')
  const [hours, setHours] = useState('8')

  const a = parseFloat(area) || 0
  const h = parseFloat(hours) || 0
  const result = useMemo(() => calculate(type, a, h), [type, a, h])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {(Object.entries(SYSTEMS) as [SystemType, typeof SYSTEMS[SystemType]][]).map(([k, v]) => (
          <button key={k} onClick={() => setType(k)} className={`px-3 py-3 rounded-xl text-sm text-left border transition-colors ${type === k ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
            <div className="font-medium">{v.name}</div>
            <div className={`text-xs ${type === k ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>~£{v.costPerSqm}/m²</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Floor Area (m²)</label><input type="number" min="1" max="200" value={area} onChange={(e) => setArea(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Floor Area (m²)" /></div>
        <div><label className="block text-sm font-medium mb-2">Hours/Day Heating</label><input type="number" min="1" max="24" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours/Day Heating" /></div>
      </div>

      {a > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Install Cost</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.installCost)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Running</p><p className="text-lg font-bold">{formatCurrency(result.annualRunning)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly Running</p><p className="text-lg font-bold">{formatCurrency(result.monthlyRunning)}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.savingVsRadiator > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-muted/50'}`}><p className="text-xs text-muted-foreground">vs Radiators</p><p className={`text-lg font-bold ${result.savingVsRadiator > 0 ? 'text-green-700 dark:text-green-400' : ''}`}>{result.savingVsRadiator > 0 ? `Save ${formatCurrency(result.savingVsRadiator)}/yr` : 'Similar cost'}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground"><p>{result.info.description}</p></div>
        </div>
      )}
    </div>
  )
}
