import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(pot: number, lumpSumPct: number) {
  const maxTaxFree = pot * 0.25
  const lumpSum = pot * (lumpSumPct / 100)
  const taxFree = Math.min(lumpSum, maxTaxFree)
  const taxable = Math.max(0, lumpSum - maxTaxFree)

  // Tax on taxable portion (at marginal rate, assume basic)
  const tax = taxable * 0.20
  const netLumpSum = lumpSum - tax

  const remainingPot = pot - lumpSum
  const annualDrawdown4pct = remainingPot * 0.04
  const monthlyDrawdown = annualDrawdown4pct / 12

  // Commutation: £1 of pension = £12 lump sum (typical DB scheme factor)
  const annuityEquivalent = lumpSum / 12

  return { lumpSum, taxFree, taxable, tax, netLumpSum, remainingPot, annualDrawdown4pct, monthlyDrawdown, annuityEquivalent }
}

export default function PensionLumpSumCalculator() {
  const [pot, setPot] = useState('300000')
  const [pct, setPct] = useState('25')

  const p = parseFloat(pot.replace(/,/g,'')) || 0
  const pc = parseFloat(pct) || 25
  const result = useMemo(() => calculate(p, pc), [p, pc])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Pension Pot</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={pot} onChange={(e) => setPot(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Lump Sum (%)</label><input type="range" min="0" max="100" value={pct} onChange={(e) => setPct(e.target.value)} className="w-full mt-3" /><div className="flex justify-between text-xs text-muted-foreground"><span>0% (no lump sum)</span><span className="font-bold text-foreground">{pct}%</span><span>100% (all cash)</span></div></div>
      </div>

      {p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-5 text-center"><p className="text-sm text-muted-foreground">Lump Sum (net)</p><p className="text-2xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.netLumpSum)}</p><p className="text-xs text-muted-foreground">{formatCurrency(result.taxFree)} tax-free{result.tax > 0 ? ` + ${formatCurrency(result.taxable - result.tax)} after tax` : ''}</p></div>
            <div className="rounded-2xl bg-primary/10 p-5 text-center"><p className="text-sm text-muted-foreground">Remaining Pot</p><p className="text-2xl font-bold text-primary">{formatCurrency(result.remainingPot)}</p><p className="text-xs text-muted-foreground">{formatCurrency(result.monthlyDrawdown)}/month (4% rule)</p></div>
          </div>
          {result.tax > 0 && (
            <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-center text-sm text-orange-800 dark:text-orange-300">
              Taking more than 25% — {formatCurrency(result.taxable)} is taxable. Tax: {formatCurrency(result.tax)} (at 20%). Taking large sums can push you into a higher tax bracket.
            </div>
          )}
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Total Lump Sum ({pct}%)</td><td className="text-right tabular-nums">{formatCurrency(result.lumpSum)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-green-600">Tax-Free (25% of pot)</td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.taxFree)}</td></tr>
              {result.taxable > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Taxable Amount</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.taxable)}</td></tr>}
              {result.tax > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.tax)}</td></tr>}
              <tr className="font-semibold"><td className="py-2">Net Lump Sum</td><td className="text-right tabular-nums">{formatCurrency(result.netLumpSum)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
