import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Business rates 2025/26
const STANDARD_MULTIPLIER = 0.555 // 55.5p in the pound (2024/25 was 54.6p, uprated 1.7% CPI)
const SMALL_MULTIPLIER = 0.499 // 49.9p for small businesses (frozen at 2024/25 level)
const SMALL_RELIEF_THRESHOLD = 15_000
const FULL_RELIEF_THRESHOLD = 12_000

function calculate(rateableValue: number, isSmall: boolean) {
  const multiplier = isSmall ? SMALL_MULTIPLIER : STANDARD_MULTIPLIER
  const grossRates = rateableValue * multiplier

  // Small business rate relief
  let relief = 0
  if (isSmall) {
    if (rateableValue <= FULL_RELIEF_THRESHOLD) relief = grossRates // 100% relief
    else if (rateableValue <= SMALL_RELIEF_THRESHOLD) {
      const reliefPct = ((SMALL_RELIEF_THRESHOLD - rateableValue) / (SMALL_RELIEF_THRESHOLD - FULL_RELIEF_THRESHOLD)) * 100
      relief = grossRates * (reliefPct / 100)
    }
  }

  const netRates = grossRates - relief
  const monthlyRates = netRates / 12

  return { rateableValue, grossRates, relief, netRates, monthlyRates, multiplier }
}

export default function BusinessRatesCalculator() {
  const [rv, setRv] = useState('10000')
  const [small, setSmall] = useState(true)

  const v = parseFloat(rv.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(v, small), [v, small])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Rateable Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={rv} onChange={(e) => setRv(e.target.value)} placeholder="10,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div><p className="text-xs text-muted-foreground mt-1">Find on the VOA website</p></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={small} onChange={(e) => setSmall(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Small business (only property, RV under £15,000)</span></label>

      {v > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Annual Business Rates</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.netRates)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyRates)}/month</p>
          </div>
          {result.relief > 0 && (
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center">
              <p className="text-xs text-muted-foreground">Small Business Rate Relief</p>
              <p className="text-xl font-bold text-green-700 dark:text-green-400">-{formatCurrency(result.relief)}</p>
              {v <= FULL_RELIEF_THRESHOLD && <p className="text-xs text-green-600 mt-1">100% relief — you pay nothing!</p>}
            </div>
          )}
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Rateable Value</td><td className="text-right tabular-nums">{formatCurrency(v)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Multiplier</td><td className="text-right tabular-nums">{(result.multiplier * 100).toFixed(1)}p in £</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Gross Rates</td><td className="text-right tabular-nums">{formatCurrency(result.grossRates)}</td></tr>
              {result.relief > 0 && <tr className="border-b border-border/50"><td className="py-2 text-green-600">SBRR Relief</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(result.relief)}</td></tr>}
              <tr className="font-semibold"><td className="py-2">You Pay</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.netRates)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
