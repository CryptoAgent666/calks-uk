import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type BoilerType = 'combi' | 'system' | 'regular'
type OldEfficiency = 'old' | 'medium' | 'good'

const INSTALL_COSTS: Record<BoilerType, number> = { combi: 2800, system: 3500, regular: 3200 }
const EFFICIENCY: Record<OldEfficiency, number> = { old: 65, medium: 78, good: 85 }
const NEW_EFFICIENCY = 94

function calculate(boilerType: BoilerType, oldEff: OldEfficiency, annualGasBill: number, bedrooms: number) {
  const oldEffPct = EFFICIENCY[oldEff]
  const savingPct = (1 - oldEffPct / NEW_EFFICIENCY) * 100
  const annualSaving = annualGasBill * (savingPct / 100)
  const installCost = INSTALL_COSTS[boilerType] + (bedrooms > 4 ? 500 : 0)
  const payback = annualSaving > 0 ? installCost / annualSaving : 0
  const saving10yr = annualSaving * 10 - installCost

  return { oldEffPct, newEff: NEW_EFFICIENCY, savingPct, annualSaving, installCost, payback, saving10yr }
}

export default function BoilerReplacementCalculator() {
  const [type, setType] = useState<BoilerType>('combi')
  const [oldEff, setOldEff] = useState<OldEfficiency>('old')
  const [gasBill, setGasBill] = useState('800')
  const [beds, setBeds] = useState('3')

  const g = parseFloat(gasBill) || 0
  const b = parseInt(beds) || 3
  const result = useMemo(() => calculate(type, oldEff, g, b), [type, oldEff, g, b])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Boiler Type</label><select value={type} onChange={(e) => setType(e.target.value as BoilerType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Boiler Type"><option value="combi">Combi</option><option value="system">System</option><option value="regular">Regular</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Current Boiler</label><select value={oldEff} onChange={(e) => setOldEff(e.target.value as OldEfficiency)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Current Boiler"><option value="old">15+ years old (~65%)</option><option value="medium">10-15 years (~78%)</option><option value="good">5-10 years (~85%)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Annual Gas Bill</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={gasBill} onChange={(e) => setGasBill(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Gas Bill" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Bedrooms</label><input type="number" min="1" max="6" value={beds} onChange={(e) => setBeds(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Bedrooms" /></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Install Cost</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.installCost)}</p></div>
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Saving</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.annualSaving)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Payback</p><p className="text-lg font-bold">{result.payback.toFixed(1)} years</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">10yr Net Saving</p><p className={`text-lg font-bold ${result.saving10yr > 0 ? 'text-green-600' : 'text-destructive'}`}>{formatCurrency(result.saving10yr)}</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Old boiler: ~{result.oldEffPct}% efficient. New A-rated: ~{result.newEff}%. Efficiency improvement: ~{result.savingPct.toFixed(0)}%.</p>
        </div>
      </div>
    </div>
  )
}
