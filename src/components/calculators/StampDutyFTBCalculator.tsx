import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// FTB Stamp Duty from April 2025
const FTB_BANDS = [
  { from: 0, to: 300_000, rate: 0 },
  { from: 300_000, to: 500_000, rate: 0.05 },
]
const STANDARD_BANDS = [
  { from: 0, to: 125_000, rate: 0 },
  { from: 125_000, to: 250_000, rate: 0.02 },
  { from: 250_000, to: 925_000, rate: 0.05 },
  { from: 925_000, to: 1_500_000, rate: 0.10 },
  { from: 1_500_000, to: Infinity, rate: 0.12 },
]

function calcBands(price: number, bands: { from: number; to: number; rate: number }[]) {
  let total = 0
  const breakdown: { from: number; to: number; rate: number; tax: number }[] = []
  for (const b of bands) {
    if (price <= b.from) break
    const taxable = Math.min(price, b.to) - b.from
    const tax = taxable * b.rate
    total += tax
    breakdown.push({ from: b.from, to: Math.min(price, b.to), rate: b.rate, tax })
  }
  return { total, breakdown }
}

function calculate(price: number) {
  const ftbEligible = price <= 500_000
  const ftb = ftbEligible ? calcBands(price, FTB_BANDS) : calcBands(price, STANDARD_BANDS)
  const standard = calcBands(price, STANDARD_BANDS)
  const saving = standard.total - ftb.total

  return { price, ftbEligible, ftbTax: ftb.total, standardTax: standard.total, saving, breakdown: ftb.breakdown }
}

export default function StampDutyFTBCalculator() {
  const [price, setPrice] = useState('')
  const val = parseFloat(price.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(val), [val])

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="ftb-price" className="block text-sm font-medium mb-2">Property Price</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
          <input id="ftb-price" type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="350,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Property Price" />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[200_000, 300_000, 350_000, 425_000, 500_000, 600_000].map((a) => (
            <button key={a} onClick={() => setPrice(a.toLocaleString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">£{a / 1000}K</button>
          ))}
        </div>
      </div>

      {val > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          {!result.ftbEligible && (
            <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-sm text-orange-800 dark:text-orange-300">
              First-time buyer relief is not available for properties over £500,000. Standard rates apply.
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <p className="text-xs text-muted-foreground">Your SDLT (FTB)</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(result.ftbTax)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">Standard Rate SDLT</p>
              <p className="text-xl font-bold">{formatCurrency(result.standardTax)}</p>
            </div>
            {result.saving > 0 && (
              <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center">
                <p className="text-xs text-muted-foreground">Your Saving</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.saving)}</p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">First-time buyer rates (April 2025):</p>
            <p>0% on the first £300,000</p>
            <p>5% on £300,001 to £500,000</p>
            <p>Properties over £500,000 pay standard rates.</p>
          </div>
        </div>
      )}
    </div>
  )
}
