import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Average UK CPI inflation rates by decade (simplified)
const AVG_INFLATION = 3.5 // long-term UK average %

function calculate(amount: number, yearFrom: number, yearTo: number, rate: number) {
  const years = Math.abs(yearTo - yearFrom)
  const factor = Math.pow(1 + rate / 100, years)

  if (yearTo > yearFrom) {
    // Past to present: how much would £X be worth today
    return { original: amount, adjusted: amount * factor, years, direction: 'forward' as const, factor }
  } else {
    // Present to past: what was today's £X worth in the past
    return { original: amount, adjusted: amount / factor, years, direction: 'backward' as const, factor }
  }
}

export default function InflationCalculator() {
  const [amount, setAmount] = useState('100')
  const [yearFrom, setYearFrom] = useState('2000')
  const [yearTo, setYearTo] = useState('2025')
  const [rate, setRate] = useState(AVG_INFLATION.toString())

  const a = parseFloat(amount.replace(/,/g, '')) || 0
  const yf = parseInt(yearFrom) || 2000
  const yt = parseInt(yearTo) || 2025
  const r = parseFloat(rate) || AVG_INFLATION
  const result = useMemo(() => calculate(a, yf, yt, r), [a, yf, yt, r])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Amount" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">From Year</label>
          <input type="number" min="1900" max="2026" value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="From Year" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">To Year</label>
          <input type="number" min="1900" max="2050" value={yearTo} onChange={(e) => setYearTo(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="To Year" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Average Inflation (%)</label>
          <input type="number" min="0" max="20" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Average Inflation (%)" />
        </div>
      </div>

      {a > 0 && result.years > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">{formatCurrency(a)} in {yf} is equivalent to</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.adjusted)}</p>
            <p className="text-sm text-muted-foreground mt-1">in {yt} ({result.years} years, {r}% avg inflation)</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Purchasing Power Change</p><p className="text-lg font-bold text-destructive">{((1 - 1 / result.factor) * 100).toFixed(1)}% lost</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Cumulative Inflation</p><p className="text-lg font-bold">{((result.factor - 1) * 100).toFixed(1)}%</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Price Multiplier</p><p className="text-lg font-bold">{result.factor.toFixed(2)}x</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
