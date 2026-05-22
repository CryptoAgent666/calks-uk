import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

function calculate(investmentAmount: number, dividendYield: number, growthRate: number, years: number, reinvest: boolean) {
  let balance = investmentAmount
  let totalDividends = 0
  const schedule: { year: number; balance: number; dividend: number; totalDivs: number }[] = []

  for (let y = 1; y <= years; y++) {
    const dividend = balance * (dividendYield / 100)
    totalDividends += dividend
    if (reinvest) balance += dividend
    balance *= (1 + growthRate / 100)
    schedule.push({ year: y, balance, dividend, totalDivs: totalDividends })
  }

  const annualDividend = investmentAmount * (dividendYield / 100)
  const monthlyDividend = annualDividend / 12

  // Tax on dividends (simplified)
  const taxFreeDividend = 500
  const taxableDividend = Math.max(0, annualDividend - taxFreeDividend)
  const dividendTax = taxableDividend * 0.0875 // basic rate

  return { balance, totalDividends, annualDividend, monthlyDividend, dividendTax, schedule: schedule.filter((_, i) => (i + 1) % 5 === 0 || i === 0 || i === years - 1) }
}

export default function DividendIncomeCalculator() {
  const [amount, setAmount] = useState('100000')
  const [divYield, setDivYield] = useState('4')
  const [growth, setGrowth] = useState('3')
  const [years, setYears] = useState('10')
  const [reinvest, setReinvest] = useState(true)

  const a = parseFloat(amount.replace(/,/g,'')) || 0
  const d = parseFloat(divYield) || 0
  const g = parseFloat(growth) || 0
  const y = parseInt(years) || 0
  const result = useMemo(() => calculate(a, d, g, y, reinvest), [a, d, g, y, reinvest])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Investment Amount</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Investment Amount" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Dividend Yield (%)</label><input type="number" min="0" max="15" step="0.1" value={divYield} onChange={(e) => setDivYield(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Dividend Yield (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Capital Growth (%)</label><input type="number" min="-5" max="15" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Capital Growth (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Years</label><input type="number" min="1" max="30" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={reinvest} onChange={(e) => setReinvest(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Reinvest dividends (DRIP)</span></label>

      {a > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-primary/10 p-5 text-center"><p className="text-sm text-muted-foreground">Annual Dividend Income</p><p className="text-2xl font-bold text-primary mt-1">{formatCurrency(result.annualDividend)}</p><p className="text-xs text-muted-foreground">{formatCurrency(result.monthlyDividend)}/month</p></div>
            <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-5 text-center"><p className="text-sm text-muted-foreground">Portfolio in {y} Years</p><p className="text-2xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.balance)}</p><p className="text-xs text-muted-foreground">Total dividends: {formatCurrency(result.totalDividends)}</p></div>
          </div>
          {result.dividendTax > 0 && <div className="rounded-xl bg-muted/50 p-3 text-center text-sm">Estimated dividend tax (basic rate, outside ISA): {formatCurrency(result.dividendTax)}/year &middot; First £500 tax-free</div>}

          {result.schedule.length > 0 && (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Year</th><th className="text-right py-2 font-medium text-muted-foreground">Dividend</th><th className="text-right py-2 font-medium text-muted-foreground">Total Divs</th><th className="text-right py-2 font-medium text-muted-foreground">Portfolio</th></tr></thead>
              <tbody>{result.schedule.map(r => (
                <tr key={r.year} className="border-b border-border/50"><td className="py-1.5">{r.year}</td><td className="text-right tabular-nums">{formatCurrency(r.dividend)}</td><td className="text-right tabular-nums text-green-600">{formatCurrency(r.totalDivs)}</td><td className="text-right tabular-nums font-medium">{formatCurrency(r.balance)}</td></tr>
              ))}</tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
