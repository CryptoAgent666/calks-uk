import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(systemSize: number, installCost: number, elecRate: number, exportRate: number, selfConsumption: number) {
  const annualGeneration = systemSize * 850 // ~850 kWh per kWp in UK
  const selfUsed = annualGeneration * (selfConsumption / 100)
  const exported = annualGeneration - selfUsed
  const savingsFromSelfUse = selfUsed * (elecRate / 100)
  const exportIncome = exported * (exportRate / 100)
  const annualBenefit = savingsFromSelfUse + exportIncome
  const paybackYears = annualBenefit > 0 ? installCost / annualBenefit : 0
  const return25yr = annualBenefit * 25 - installCost

  return { annualGeneration, selfUsed, exported, savingsFromSelfUse, exportIncome, annualBenefit, paybackYears, return25yr }
}

export default function SolarPanelCalculator() {
  const [size, setSize] = useState('4')
  const [cost, setCost] = useState('6000')
  const [elecRate, setElecRate] = useState('26.11')
  const [exportRate, setExportRate] = useState('15')
  const [selfUse, setSelfUse] = useState('50')

  const sz = parseFloat(size) || 0
  const c = parseFloat(cost.replace(/,/g, '')) || 0
  const er = parseFloat(elecRate) || 0
  const xr = parseFloat(exportRate) || 0
  const su = parseFloat(selfUse) || 0
  const result = useMemo(() => calculate(sz, c, er, xr, su), [sz, c, er, xr, su])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">System Size (kWp)</label><input type="number" min="0" max="20" step="0.5" value={size} onChange={(e) => setSize(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="System Size (kWp)" /></div>
        <div><label className="block text-sm font-medium mb-2">Installation Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Installation Cost" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Electricity Rate (p/kWh)</label><input type="number" min="0" max="60" step="0.1" value={elecRate} onChange={(e) => setElecRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Electricity Rate (p/kWh)" /></div>
        <div><label className="block text-sm font-medium mb-2">Export Rate (p/kWh)</label><input type="number" min="0" max="30" step="0.1" value={exportRate} onChange={(e) => setExportRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Export Rate (p/kWh)" /></div>
        <div><label className="block text-sm font-medium mb-2">Self-Consumption (%)</label><input type="number" min="0" max="100" value={selfUse} onChange={(e) => setSelfUse(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Self-Consumption (%)" /></div>
      </div>

      {sz > 0 && c > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Saving</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.annualBenefit)}</p></div>
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Payback Period</p><p className="text-lg font-bold text-primary">{result.paybackYears.toFixed(1)} years</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Generation</p><p className="text-lg font-bold">{result.annualGeneration.toLocaleString()} kWh</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">25yr Return</p><p className="text-lg font-bold">{formatCurrency(result.return25yr)}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border p-4 text-center"><p className="text-xs text-muted-foreground">Bill Savings (self-use)</p><p className="text-lg font-bold">{formatCurrency(result.savingsFromSelfUse)}/yr</p></div>
            <div className="rounded-xl border border-border p-4 text-center"><p className="text-xs text-muted-foreground">Export Income</p><p className="text-lg font-bold">{formatCurrency(result.exportIncome)}/yr</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
