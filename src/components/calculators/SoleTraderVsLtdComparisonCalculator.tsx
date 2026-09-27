import { useState, useMemo } from 'react'
import { formatCurrency, ukIncomeTax, ukCorporationTax, ukDividendTax } from '@/utils'

// Simplified comparison at different profit levels
const ACCOUNTANCY = 1_200

function calculate() {
  const profits = [20_000, 30_000, 40_000, 50_000, 60_000, 75_000, 100_000]
  return profits.map(profit => {
    // Sole trader
    const stTax = ukIncomeTax(profit)
    let stNI = 0
    if (profit > 12_570) { if (profit <= 50_270) stNI = (profit - 12_570) * 0.06; else stNI = (50_270 - 12_570) * 0.06 + (profit - 50_270) * 0.02 }
    // Class 2 NI abolished from 6 April 2024 — no longer payable
    const stTotal = stTax + stNI

    // Ltd (salary £12,570 + dividends). Corporation tax needs marginal relief
    // across £50k–£250k, and the dividends drawn at these profit levels run well
    // past the basic band — charging a flat 25% and a flat 10.75% overstated the
    // tax bill at the low end and understated it at the high end, which is the
    // difference this whole table exists to show.
    // Accountancy is a company expense, so it comes off profit before
    // Corporation Tax rather than out of the director's post-tax dividends.
    const ltdSalary = 12_570
    const ltdErNI = Math.max(0, (ltdSalary - 5_000) * 0.15)
    const ltdProfit = profit - ltdSalary - ltdErNI - ACCOUNTANCY
    const ltdCorpTax = ukCorporationTax(ltdProfit)
    const ltdDividends = ltdProfit - ltdCorpTax
    const ltdDivTax = ukDividendTax(ltdDividends, ltdSalary)
    const ltdTotal = ltdCorpTax + ltdDivTax + ltdErNI + ACCOUNTANCY

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
        <p>Ltd assumes: £12,570 salary (£1,135.50 employer NI) with the rest drawn as dividends, and £1,200 accountancy deducted before Corporation Tax. Since Class 4 NI was cut to 6% (April 2024), a sole trader keeps more at every profit level in this table when all the profit is drawn out: £2,274 more at £50K and £4,668 more at £100K. A company pays off mainly when profit is left in it or paid into a pension. Always weigh IR35, mortgage implications and the extra admin, and check the figures against your own circumstances.</p>
      </div>
    </div>
  )
}
