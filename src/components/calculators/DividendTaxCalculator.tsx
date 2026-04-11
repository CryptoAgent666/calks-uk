import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

const DIVIDEND_ALLOWANCE = 500
const BASIC_LIMIT = 50_270
const HIGHER_LIMIT = 125_140
const RATES = { basic: 0.0875, higher: 0.3375, additional: 0.3935 }

function calculate(dividends: number, otherIncome: number) {
  const taxableDividends = Math.max(0, dividends - DIVIDEND_ALLOWANCE)
  if (taxableDividends <= 0) return { dividends, taxableDividends: 0, tax: 0, effectiveRate: 0, breakdown: [] }

  const totalIncome = otherIncome + dividends
  let remaining = taxableDividends
  let tax = 0
  const breakdown: { band: string; amount: number; rate: number; tax: number }[] = []

  // Where dividends fall in the bands (after other income)
  const basicRemaining = Math.max(0, BASIC_LIMIT - otherIncome - DIVIDEND_ALLOWANCE)
  const higherRemaining = Math.max(0, HIGHER_LIMIT - Math.max(otherIncome + DIVIDEND_ALLOWANCE, BASIC_LIMIT))

  if (basicRemaining > 0 && remaining > 0) {
    const amt = Math.min(remaining, basicRemaining)
    const t = amt * RATES.basic
    breakdown.push({ band: 'Basic Rate (8.75%)', amount: amt, rate: RATES.basic, tax: t })
    tax += t; remaining -= amt
  }

  if (higherRemaining > 0 && remaining > 0) {
    const amt = Math.min(remaining, higherRemaining)
    const t = amt * RATES.higher
    breakdown.push({ band: 'Higher Rate (33.75%)', amount: amt, rate: RATES.higher, tax: t })
    tax += t; remaining -= amt
  }

  if (remaining > 0) {
    const t = remaining * RATES.additional
    breakdown.push({ band: 'Additional Rate (39.35%)', amount: remaining, rate: RATES.additional, tax: t })
    tax += t
  }

  return { dividends, taxableDividends, tax, effectiveRate: dividends > 0 ? (tax / dividends) * 100 : 0, breakdown }
}

export default function DividendTaxCalculator() {
  const [dividends, setDividends] = useState('')
  const [otherIncome, setOtherIncome] = useState('12570')

  const d = parseFloat(dividends.replace(/,/g, '')) || 0
  const o = parseFloat(otherIncome.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(d, o), [d, o])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="div-amount" className="block text-sm font-medium mb-2">Total Dividends</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input id="div-amount" type="text" inputMode="numeric" value={dividends} onChange={(e) => setDividends(e.target.value)} placeholder="30,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
        <div>
          <label htmlFor="div-other" className="block text-sm font-medium mb-2">Other Income (salary, etc.)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input id="div-other" type="text" inputMode="numeric" value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} placeholder="12,570" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
      </div>

      {d > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Dividends</p><p className="text-lg font-bold">{formatCurrency(result.dividends)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Tax on Dividends</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.tax)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Effective Rate</p><p className="text-lg font-bold">{formatPercent(result.effectiveRate)}</p></div>
          </div>

          {result.breakdown.length > 0 && (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Band</th><th className="text-right py-2 font-medium text-muted-foreground">Amount</th><th className="text-right py-2 font-medium text-muted-foreground">Tax</th></tr></thead>
              <tbody>
                <tr className="border-b border-border/50"><td className="py-2.5 text-green-600">Dividend Allowance</td><td className="text-right tabular-nums">{formatCurrency(Math.min(d, DIVIDEND_ALLOWANCE))}</td><td className="text-right tabular-nums">{formatCurrency(0)}</td></tr>
                {result.breakdown.map((b) => (
                  <tr key={b.band} className="border-b border-border/50"><td className="py-2.5">{b.band}</td><td className="text-right tabular-nums">{formatCurrency(b.amount)}</td><td className="text-right tabular-nums font-medium">{formatCurrency(b.tax)}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
