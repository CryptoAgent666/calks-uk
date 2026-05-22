import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(fixedCosts: number, pricePerUnit: number, variableCostPerUnit: number) {
  if (pricePerUnit <= variableCostPerUnit) return null
  const contributionMargin = pricePerUnit - variableCostPerUnit
  const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin)
  const breakEvenRevenue = breakEvenUnits * pricePerUnit
  const marginPct = (contributionMargin / pricePerUnit) * 100

  return { breakEvenUnits, breakEvenRevenue, contributionMargin, marginPct }
}

export default function BreakEvenCalculator() {
  const [fixed, setFixed] = useState('5000')
  const [price, setPrice] = useState('25')
  const [variable, setVariable] = useState('10')

  const f = parseFloat(fixed.replace(/,/g,'')) || 0
  const p = parseFloat(price) || 0
  const v = parseFloat(variable) || 0
  const result = useMemo(() => calculate(f, p, v), [f, p, v])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Fixed Costs (monthly)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={fixed} onChange={(e) => setFixed(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Fixed Costs (monthly)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Price per Unit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Price per Unit" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Variable Cost per Unit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" step="0.01" value={variable} onChange={(e) => setVariable(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Variable Cost per Unit" /></div></div>
      </div>

      {result ? (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Break-Even Point</p>
            <p className="text-3xl font-bold text-primary mt-1">{result.breakEvenUnits.toLocaleString()} units</p>
            <p className="text-sm text-muted-foreground mt-1">Revenue: {formatCurrency(result.breakEvenRevenue)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Contribution Margin</p><p className="text-lg font-bold">{formatCurrency(result.contributionMargin)}/unit</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Margin %</p><p className="text-lg font-bold">{result.marginPct.toFixed(1)}%</p></div>
          </div>
        </div>
      ) : p > 0 && v >= p && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">Price per unit must exceed variable cost per unit to break even.</div>
      )}
    </div>
  )
}
