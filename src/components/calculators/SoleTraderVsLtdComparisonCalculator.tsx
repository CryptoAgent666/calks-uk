import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Simplified comparison at different profit levels
function calculate() {
  const profits = [20_000, 30_000, 40_000, 50_000, 60_000, 75_000, 100_000]
  return profits.map(profit => {
    // Sole trader
    let stPA = 12_570; if (profit > 100_000) stPA = Math.max(0, 12_570 - Math.floor((profit - 100_000) / 2))
    let stTax = 0
    if (profit > stPA) { if (profit <= 50_270) stTax = (profit - stPA) * 0.20; else stTax = (50_270 - stPA) * 0.20 + (profit - 50_270) * 0.40 }
    let stNI = 0
    if (profit > 12_570) { if (profit <= 50_270) stNI = (profit - 12_570) * 0.06; else stNI = (50_270 - 12_570) * 0.06 + (profit - 50_270) * 0.02 }
    const stClass2 = profit >= 12_570 ? 182.00 : 0 // £3.50/week × 52 (2026/27)
    const stTotal = stTax + stNI + stClass2

    // Ltd (salary £12,570 + dividends)
    const ltdSalary = 12_570
    const ltdErNI = Math.max(0, (ltdSalary - 5_000) * 0.15)
    const ltdProfit = profit - ltdSalary - ltdErNI
    const ltdCorpTax = ltdProfit <= 50_000 ? ltdProfit * 0.19 : ltdProfit * 0.25
    const ltdDividends = ltdProfit - ltdCorpTax
    const ltdDivTax = Math.max(0, ltdDividends - 500) * 0.0875
    const ltdTotal = ltdCorpTax + ltdDivTax + ltdErNI + 1200 // +accountancy

    return { profit, stTakeHome: profit - stTotal, ltdTakeHome: profit - ltdTotal, stTotal, ltdTotal, saving: (profit - ltdTotal) - (profit - stTotal) }
  })
}

export default function SoleTraderVsLtdComparisonCalculator() {
  const results = useMemo(() => calculate(), [])

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Side-by-side comparison at different profit levels (2026/27 rates)</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Profit</th><th className="text-right py-2 font-medium text-muted-foreground">Sole Trader</th><th className="text-right py-2 font-medium text-muted-foreground">Ltd Company</th><th className="text-right py-2 font-medium text-muted-foreground">Saving</th></tr></thead>
          <tbody>{results.map(r => (
            <tr key={r.profit} className="border-b border-border/50">
              <td className="py-2.5 font-medium">{formatCurrency(r.profit)}</td>
              <td className="text-right tabular-nums">{formatCurrency(r.stTakeHome)}</td>
              <td className="text-right tabular-nums">{formatCurrency(r.ltdTakeHome)}</td>
              <td className={`text-right tabular-nums font-medium ${r.saving > 0 ? 'text-green-700 dark:text-green-400' : r.saving < 0 ? 'text-destructive' : ''}`}>{r.saving > 0 ? '+' : ''}{formatCurrency(r.saving)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>Ltd assumes: £12,570 salary + dividends, ~£1,200 accountancy. Below ~£35K sole trader is simpler. Above ~£50K Ltd usually saves significantly. Consider IR35, mortgage implications and admin burden.</p>
      </div>
    </div>
  )
}
