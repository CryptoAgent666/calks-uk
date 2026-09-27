import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// Corporation Tax 2026/27
const SMALL_PROFITS_RATE = 0.19
const SMALL_PROFITS_LIMIT = 50_000
const MAIN_RATE = 0.25
const UPPER_LIMIT = 250_000
const MARGINAL_FRACTION = 3 / 200 // 3/200ths

// Both limits are divided by (1 + associated companies) and reduced in
// proportion for an accounting period shorter than 12 months (days / 365).
// Marginal relief uses the standard fraction; profits that include exempt
// distributions (augmented profits) need the longer formula and are ignored.
function limitsFor(associates: number, days: number) {
  const companies = 1 + Math.max(0, Math.floor(associates))
  const period = Math.min(Math.max(days, 1), 365) / 365
  return {
    lowerLimit: (SMALL_PROFITS_LIMIT / companies) * period,
    upperLimit: (UPPER_LIMIT / companies) * period,
  }
}

function calculate(profit: number, associates = 0, days = 365) {
  const { lowerLimit, upperLimit } = limitsFor(associates, days)
  let tax: number
  let effectiveRate: number
  let marginalRelief = 0

  if (profit <= lowerLimit) {
    tax = profit * SMALL_PROFITS_RATE
    effectiveRate = 19
  } else if (profit >= upperLimit) {
    tax = profit * MAIN_RATE
    effectiveRate = 25
  } else {
    // Marginal relief
    const mainTax = profit * MAIN_RATE
    marginalRelief = (upperLimit - profit) * MARGINAL_FRACTION
    tax = mainTax - marginalRelief
    effectiveRate = profit > 0 ? (tax / profit) * 100 : 0
  }

  return { profit, tax, afterTax: profit - tax, effectiveRate, lowerLimit, upperLimit, marginalRelief }
}

export default function CorporationTaxCalculator() {
  const [profit, setProfit] = useState('120,000')
  const [associates, setAssociates] = useState('0')
  const [days, setDays] = useState('365')
  const val = parseFloat(profit.replace(/,/g, '')) || 0
  const assoc = Math.max(0, parseInt(associates) || 0)
  const periodDays = Math.min(Math.max(parseInt(days) || 365, 1), 365)
  const result = useMemo(() => calculate(val, assoc, periodDays), [val, assoc, periodDays])

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ct-associates" className="block text-sm font-medium mb-2">Associated Companies</label>
          <input id="ct-associates" type="number" min="0" step="1" value={associates} onChange={(e) => setAssociates(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          <p className="text-xs text-muted-foreground mt-1">Other companies under common control. Enter 0 if none.</p>
        </div>
        <div>
          <label htmlFor="ct-days" className="block text-sm font-medium mb-2">Accounting Period (days)</label>
          <input id="ct-days" type="number" min="1" max="365" step="1" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          <p className="text-xs text-muted-foreground mt-1">365 for a full year. A shorter period reduces both limits in proportion.</p>
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
            <p className="font-medium text-foreground">How Corporation Tax works{assoc > 0 || periodDays < 365 ? ' for your company' : ''}:</p>
            <p>Profits up to {formatCurrency(result.lowerLimit)} — <span className="font-medium text-foreground">19%</span> (small profits rate)</p>
            <p>Profits between {formatCurrency(result.lowerLimit)} and {formatCurrency(result.upperLimit)} — <span className="font-medium text-foreground">19% to 25%</span> (marginal relief applies)</p>
            <p>Profits of {formatCurrency(result.upperLimit)} or more — <span className="font-medium text-foreground">25%</span> (main rate)</p>
            {result.marginalRelief > 0 && (
              <p>Your marginal relief: ({formatCurrency(result.upperLimit)} − {formatCurrency(val)}) × 3/200 = <span className="font-medium text-foreground">{formatCurrency(result.marginalRelief)}</span>, taken off {formatCurrency(val * MAIN_RATE)} at 25%.</p>
            )}
            {(assoc > 0 || periodDays < 365) && (
              <p>The £50,000 and £250,000 limits are divided by {1 + assoc} (your company plus {assoc} associated)
                {periodDays < 365 ? ` and scaled by ${periodDays}/365 for the short accounting period` : ''}.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
