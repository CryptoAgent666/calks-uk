import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(higherIncome: number, lowerIncome: number, yearsMarried: number, hasChildren: boolean) {
  // No statutory formula in England/Wales — this is a rough guide
  const incomeDiff = Math.max(0, higherIncome - lowerIncome)

  // Rough guide: 20-33% of income difference
  const low = incomeDiff * 0.20
  const mid = incomeDiff * 0.25
  const high = incomeDiff * 0.33

  // Duration: typically half the length of marriage, or until youngest child finishes education
  const baseDuration = Math.ceil(yearsMarried / 2)
  const duration = hasChildren ? Math.max(baseDuration, 5) : baseDuration

  return { low, mid, high, duration, monthlyLow: low / 12, monthlyMid: mid / 12, monthlyHigh: high / 12, incomeDiff }
}

export default function SpousalMaintenanceCalculator() {
  const [higher, setHigher] = useState('60000')
  const [lower, setLower] = useState('20000')
  const [years, setYears] = useState('10')
  const [children, setChildren] = useState(true)

  const h = parseFloat(higher.replace(/,/g,'')) || 0
  const l = parseFloat(lower.replace(/,/g,'')) || 0
  const y = parseInt(years) || 0
  const result = useMemo(() => calculate(h, l, y, children), [h, l, y, children])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Higher Earner Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={higher} onChange={(e) => setHigher(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Lower Earner Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={lower} onChange={(e) => setLower(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years Married</label><input type="number" min="0" max="50" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={children} onChange={(e) => setChildren(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Dependent children</span></label>

      {h > 0 && l >= 0 && result.incomeDiff > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Indicative Monthly Range</p>
            <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(result.monthlyLow)} — {formatCurrency(result.monthlyHigh)}</p>
            <p className="text-sm text-muted-foreground mt-1">For approximately {result.duration} years</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border p-4 text-center"><p className="text-xs text-muted-foreground">Low (20%)</p><p className="text-lg font-bold">{formatCurrency(result.low)}/yr</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Mid (25%)</p><p className="text-lg font-bold">{formatCurrency(result.mid)}/yr</p></div>
            <div className="rounded-xl border border-border p-4 text-center"><p className="text-xs text-muted-foreground">High (33%)</p><p className="text-lg font-bold">{formatCurrency(result.high)}/yr</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>England & Wales has no fixed formula for spousal maintenance. Courts consider: income gap, length of marriage, standard of living, ages, earning capacity, and childcare responsibilities. This is a rough guide only — seek legal advice.</p>
          </div>
        </div>
      )}
    </div>
  )
}
