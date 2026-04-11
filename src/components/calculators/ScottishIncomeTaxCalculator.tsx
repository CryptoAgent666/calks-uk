import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// Scottish Income Tax 2025/26
const PERSONAL_ALLOWANCE = 12_570
const PA_TAPER_START = 100_000

const SCOTTISH_BANDS = [
  { name: 'Personal Allowance (0%)', rate: 0 },
  { name: 'Starter Rate (19%)', rate: 0.19, from: 12_570, to: 14_876 },
  { name: 'Basic Rate (20%)', rate: 0.20, from: 14_876, to: 26_561 },
  { name: 'Intermediate Rate (21%)', rate: 0.21, from: 26_561, to: 43_662 },
  { name: 'Higher Rate (42%)', rate: 0.42, from: 43_662, to: 75_000 },
  { name: 'Advanced Rate (45%)', rate: 0.45, from: 75_000, to: 125_140 },
  { name: 'Top Rate (48%)', rate: 0.48, from: 125_140, to: Infinity },
]

function calculate(gross: number) {
  let pa = PERSONAL_ALLOWANCE
  if (gross > PA_TAPER_START) {
    pa = Math.max(0, PERSONAL_ALLOWANCE - Math.floor((gross - PA_TAPER_START) / 2))
  }

  let totalTax = 0
  const breakdown: { name: string; taxable: number; tax: number; rate: number }[] = []

  // Personal Allowance band
  breakdown.push({ name: 'Personal Allowance (0%)', taxable: Math.min(gross, pa), tax: 0, rate: 0 })

  for (const band of SCOTTISH_BANDS) {
    if (band.rate === 0) continue
    const adjustedFrom = band.from < PERSONAL_ALLOWANCE ? pa : band.from
    if (gross <= adjustedFrom) {
      breakdown.push({ name: band.name, taxable: 0, tax: 0, rate: band.rate })
      continue
    }
    const to = band.to === Infinity ? gross : Math.min(gross, band.to)
    const taxable = to - adjustedFrom
    if (taxable <= 0) {
      breakdown.push({ name: band.name, taxable: 0, tax: 0, rate: band.rate })
      continue
    }
    const tax = taxable * band.rate
    totalTax += tax
    breakdown.push({ name: band.name, taxable, tax, rate: band.rate })
  }

  return {
    gross, totalTax, netIncome: gross - totalTax,
    effectiveRate: gross > 0 ? (totalTax / gross) * 100 : 0,
    personalAllowance: pa, breakdown,
  }
}

export default function ScottishIncomeTaxCalculator() {
  const [income, setIncome] = useState('')
  const gross = parseFloat(income.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(gross), [gross])

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="scot-income" className="block text-sm font-medium mb-2">Annual Gross Income</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
          <input id="scot-income" type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="50,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[25_000, 35_000, 50_000, 75_000, 100_000, 150_000].map((a) => (
            <button key={a} onClick={() => setIncome(a.toLocaleString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">£{a / 1000}K</button>
          ))}
        </div>
      </div>

      {gross > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Scottish Income Tax</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(result.totalTax)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Take Home</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(result.netIncome)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Effective Rate</p>
              <p className="text-lg font-bold">{formatPercent(result.effectiveRate)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Monthly Take Home</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(result.netIncome / 12)}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Tax Band Breakdown</h3>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Band</th><th className="text-right py-2 font-medium text-muted-foreground">Taxable</th><th className="text-right py-2 font-medium text-muted-foreground">Tax</th></tr></thead>
              <tbody>
                {result.breakdown.map((b) => (
                  <tr key={b.name} className="border-b border-border/50">
                    <td className="py-2.5">{b.name}</td>
                    <td className="text-right py-2.5 tabular-nums">{formatCurrency(b.taxable)}</td>
                    <td className="text-right py-2.5 tabular-nums font-medium">{formatCurrency(b.tax)}</td>
                  </tr>
                ))}
                <tr className="font-semibold"><td className="py-2.5">Total</td><td className="text-right py-2.5 tabular-nums">{formatCurrency(gross)}</td><td className="text-right py-2.5 tabular-nums text-destructive">{formatCurrency(result.totalTax)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
