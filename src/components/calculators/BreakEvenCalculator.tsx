import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type Period = 'month' | 'year'

function calculate(fixedCosts: number, pricePerUnit: number, variableCostPerUnit: number) {
  if (pricePerUnit <= variableCostPerUnit) return null
  // Rounding the margin and the small tolerance stop binary float noise pushing an exact answer up
  // a unit: £5.10 - £2.10 comes out as 2.9999999999999996, which would turn 300 units into 301.
  const contributionMargin = Math.round((pricePerUnit - variableCostPerUnit) * 1e6) / 1e6
  const breakEvenUnits = Math.max(0, Math.ceil(fixedCosts / contributionMargin - 1e-9))
  const breakEvenRevenue = breakEvenUnits * pricePerUnit
  const marginPct = (contributionMargin / pricePerUnit) * 100

  return { breakEvenUnits, breakEvenRevenue, contributionMargin, marginPct }
}

function validationMessage(fixed: number, price: number, variable: number) {
  if (!Number.isFinite(fixed) || fixed < 0) return 'Enter fixed costs of zero or more.'
  if (!Number.isFinite(price) || price <= 0) return 'Enter a price per unit above zero.'
  if (!Number.isFinite(variable) || variable < 0) return 'Enter a variable cost per unit of zero or more.'
  if (variable >= price) return 'Price per unit must exceed variable cost per unit to break even.'
  return null
}

export default function BreakEvenCalculator() {
  const [fixed, setFixed] = useState('5000')
  const [period, setPeriod] = useState<Period>('month')
  const [price, setPrice] = useState('25')
  const [variable, setVariable] = useState('10')

  const f = parseFloat(fixed.replace(/[,£\s]/g, ''))
  const p = parseFloat(price)
  const v = parseFloat(variable)
  const message = validationMessage(f, p, v)
  const result = useMemo(() => (message ? null : calculate(f, p, v)), [message, f, p, v])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Fixed Costs</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={fixed} onChange={(e) => setFixed(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Fixed Costs" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Fixed Costs Period</label><select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Fixed Costs Period"><option value="month">Month</option><option value="year">Year</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Price per Unit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Price per Unit" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Variable Cost per Unit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" step="0.01" value={variable} onChange={(e) => setVariable(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Variable Cost per Unit" /></div></div>
      </div>
      <p className="text-xs text-muted-foreground">VAT-registered? Enter the price and costs without VAT, because the VAT you charge is not yours to keep.</p>

      {result ? (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Break-Even Point</p>
            <p className="text-3xl font-bold text-primary mt-1">{result.breakEvenUnits.toLocaleString()} units per {period}</p>
            <p className="text-sm text-muted-foreground mt-1">Revenue at that many whole units: {formatCurrency(result.breakEvenRevenue)} per {period}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Contribution Margin</p><p className="text-lg font-bold">{formatCurrency(result.contributionMargin)}/unit</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Margin %</p><p className="text-lg font-bold">{result.marginPct.toFixed(1)}%</p></div>
          </div>
        </div>
      ) : message && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{message}</div>
      )}
    </div>
  )
}
