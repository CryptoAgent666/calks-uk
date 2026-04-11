import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const GAS_RATE = 6.76 // p/kWh price cap
const GAS_STANDING = 31.65 // p/day

function calculate(kwhPerYear: number, rate: number, standing: number) {
  const unitCost = kwhPerYear * (rate / 100)
  const standingCost = standing * 365 / 100
  const total = unitCost + standingCost
  return { unitCost, standingCost, total, monthly: total / 12, daily: total / 365, kwhPerDay: kwhPerYear / 365 }
}

export default function GasCostCalculator() {
  const [kwh, setKwh] = useState('11500')
  const [rate, setRate] = useState(GAS_RATE.toString())
  const [standing, setStanding] = useState(GAS_STANDING.toString())

  const k = parseFloat(kwh) || 0
  const r = parseFloat(rate) || 0
  const s = parseFloat(standing) || 0
  const result = useMemo(() => calculate(k, r, s), [k, r, s])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Gas Usage (kWh)</label><input type="number" min="0" max="50000" value={kwh} onChange={(e) => setKwh(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /><p className="text-xs text-muted-foreground mt-1">UK avg: 11,500 kWh</p></div>
        <div><label className="block text-sm font-medium mb-2">Unit Rate (p/kWh)</label><input type="number" min="0" max="20" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Standing Charge (p/day)</label><input type="number" min="0" max="100" step="0.01" value={standing} onChange={(e) => setStanding(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {k > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-blue-100 dark:bg-blue-950 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Gas Bill</p><p className="text-xl font-bold text-blue-700 dark:text-blue-400">{formatCurrency(result.total)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly</p><p className="text-lg font-bold">{formatCurrency(result.monthly)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Unit Cost</p><p className="text-lg font-bold">{formatCurrency(result.unitCost)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Standing Charge</p><p className="text-lg font-bold">{formatCurrency(result.standingCost)}/yr</p></div>
        </div>
      )}
    </div>
  )
}
