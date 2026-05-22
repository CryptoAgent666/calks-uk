import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// Corporation Tax 2026/27
const SMALL_PROFITS_RATE = 0.19
const SMALL_PROFITS_LIMIT = 50_000
const MAIN_RATE = 0.25
const UPPER_LIMIT = 250_000
const MARGINAL_FRACTION = 3 / 200 // 3/200ths

function calculate(profit: number) {
  let tax: number
  let effectiveRate: number

  if (profit <= SMALL_PROFITS_LIMIT) {
    tax = profit * SMALL_PROFITS_RATE
    effectiveRate = 19
  } else if (profit >= UPPER_LIMIT) {
    tax = profit * MAIN_RATE
    effectiveRate = 25
  } else {
    // Marginal relief
    const mainTax = profit * MAIN_RATE
    const marginalRelief = (UPPER_LIMIT - profit) * MARGINAL_FRACTION
    tax = mainTax - marginalRelief
    effectiveRate = profit > 0 ? (tax / profit) * 100 : 0
  }

  return { profit, tax, afterTax: profit - tax, effectiveRate }
}

export default function CorporationTaxCalculator() {
  const [profit, setProfit] = useState('')
  const val = parseFloat(profit.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(val), [val])

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="ct-profit" className="block text-sm font-medium mb-2">Annual Taxable Profit</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
          <input id="ct-profit" type="text" inputMode="numeric" value={profit} onChange={(e) => setProfit(e.target.value)} placeholder="100,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Taxable Profit" />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[30_000, 50_000, 100_000, 150_000, 250_000, 500_000].map((a) => (
            <button key={a} onClick={() => setProfit(a.toLocaleString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">£{a / 1000}K</button>
          ))}
        </div>
      </div>

      {val > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-destructive/10 p-4 text-center">
              <p className="text-xs text-muted-foreground">Corporation Tax</p>
              <p className="text-xl font-bold text-destructive">{formatCurrency(result.tax)}</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <p className="text-xs text-muted-foreground">After Tax Profit</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(result.afterTax)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">Effective Rate</p>
              <p className="text-xl font-bold">{formatPercent(result.effectiveRate)}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm space-y-2 text-muted-foreground">
            <p className="font-medium text-foreground">How Corporation Tax works:</p>
            <p>Profits up to £50,000 — <span className="font-medium text-foreground">19%</span> (small profits rate)</p>
            <p>Profits £50,001 to £249,999 — <span className="font-medium text-foreground">19% to 25%</span> (marginal relief applies)</p>
            <p>Profits £250,000+ — <span className="font-medium text-foreground">25%</span> (main rate)</p>
          </div>
        </div>
      )}
    </div>
  )
}
