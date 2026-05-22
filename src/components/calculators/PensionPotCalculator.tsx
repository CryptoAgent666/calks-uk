import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(targetIncome: number, yearsInRetirement: number, statePension: number, growthInRetirement: number) {
  const annualShortfall = targetIncome - statePension * 52
  if (annualShortfall <= 0) return { potNeeded: 0, using4pct: 0, usingAnnuity: 0, annualShortfall: 0 }

  // 4% rule
  const potFor4pct = annualShortfall / 0.04

  // Annuity-based (roughly 5% income rate at 67)
  const potForAnnuity = annualShortfall / 0.055

  // Drawdown with growth
  const monthlyNeed = annualShortfall / 12
  const monthlyGrowth = growthInRetirement / 100 / 12
  const months = yearsInRetirement * 12
  let potDrawdown: number
  if (monthlyGrowth > 0) {
    potDrawdown = monthlyNeed * (1 - Math.pow(1 + monthlyGrowth, -months)) / monthlyGrowth
  } else {
    potDrawdown = monthlyNeed * months
  }

  return { annualShortfall, potFor4pct, potForAnnuity, potDrawdown, monthlyNeed }
}

export default function PensionPotCalculator() {
  const [target, setTarget] = useState('25000')
  const [years, setYears] = useState('25')
  const [sp, setSp] = useState('230.25')
  const [growth, setGrowth] = useState('3')

  const t = parseFloat(target.replace(/,/g,'')) || 0
  const y = parseInt(years) || 25
  const s = parseFloat(sp) || 0
  const g = parseFloat(growth) || 0
  const result = useMemo(() => calculate(t, y, s, g), [t, y, s, g])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Target Annual Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Target Annual Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years in Retirement</label><input type="number" min="10" max="40" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years in Retirement" /></div>
        <div><label className="block text-sm font-medium mb-2">State Pension (£/wk)</label><input type="number" min="0" max="300" step="0.01" value={sp} onChange={(e) => setSp(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="State Pension (£/wk)" /></div>
        <div><label className="block text-sm font-medium mb-2">Growth in Retirement (%)</label><input type="number" min="0" max="8" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Growth in Retirement (%)" /></div>
      </div>

      {t > 0 && result.annualShortfall > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Pension Pot Needed (drawdown)</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.potDrawdown)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyNeed)}/month shortfall after State Pension</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Drawdown ({g}% growth)</p><p className="text-lg font-bold">{formatCurrency(result.potDrawdown)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">4% Rule</p><p className="text-lg font-bold">{formatCurrency(result.potFor4pct)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annuity (~5.5%)</p><p className="text-lg font-bold">{formatCurrency(result.potForAnnuity)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>3 methods: Drawdown (invest and withdraw), 4% Rule (safe withdrawal rate), Annuity (guaranteed income for life). State Pension provides {formatCurrency(s * 52)}/yr — the rest must come from your pot.</p>
          </div>
        </div>
      )}
      {result.annualShortfall <= 0 && t > 0 && (
        <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center"><p className="text-lg font-bold text-green-700 dark:text-green-400">State Pension covers your target income!</p></div>
      )}
    </div>
  )
}
