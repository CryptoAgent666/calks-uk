import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

function calculate(income: number) {
  let pa = 12_570
  if (income > 100_000) pa = Math.max(0, 12_570 - Math.floor((income - 100_000) / 2))

  const bands = [
    { name: 'Personal Allowance', from: 0, to: pa, rate: 0, color: 'bg-green-500' },
    { name: 'Basic Rate (20%)', from: pa, to: 50_270, rate: 20, color: 'bg-blue-500' },
    { name: 'Higher Rate (40%)', from: 50_270, to: 125_140, rate: 40, color: 'bg-orange-500' },
    { name: 'Additional Rate (45%)', from: 125_140, to: Infinity, rate: 45, color: 'bg-red-500' },
  ]

  // 60% trap
  const in60pctTrap = income > 100_000 && income < 125_140
  const marginalRate = income <= pa ? 0 : income <= 50_270 ? 20 : income <= 100_000 ? 40 : income <= 125_140 ? 60 : 45

  const breakdown = bands.map(b => {
    if (income <= b.from) return { ...b, taxable: 0, tax: 0 }
    const taxable = Math.min(income, b.to) - b.from
    return { ...b, taxable: Math.max(0, taxable), tax: Math.max(0, taxable) * b.rate / 100 }
  }).filter(b => b.taxable > 0)

  const totalTax = breakdown.reduce((s, b) => s + b.tax, 0)
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0

  return { breakdown, totalTax, effectiveRate, marginalRate, in60pctTrap, pa }
}

export default function TaxBracketVisualizerCalculator() {
  const [income, setIncome] = useState('55000')

  const i = parseFloat(income.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(i), [i])

  return (
    <div className="space-y-6">
      <div><label className="block text-sm font-medium mb-2">Annual Gross Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-2xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Gross Income" /></div></div>

      {i > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Visual bar */}
          <div className="flex rounded-full h-8 overflow-hidden">
            {result.breakdown.map(b => (
              <div key={b.name} className={`${b.color} relative`} style={{ width: `${(b.taxable / i) * 100}%` }} title={`${b.name}: ${formatCurrency(b.taxable)}`}>
                {(b.taxable / i) > 0.1 && <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">{b.rate}%</span>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total Tax</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.totalTax)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Effective Rate</p><p className="text-xl font-bold">{formatPercent(result.effectiveRate)}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.marginalRate >= 60 ? 'bg-red-100 dark:bg-red-950' : 'bg-muted/50'}`}><p className="text-xs text-muted-foreground">Marginal Rate</p><p className={`text-xl font-bold ${result.marginalRate >= 60 ? 'text-red-700 dark:text-red-400' : ''}`}>{result.marginalRate}%</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Personal Allowance</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.pa)}</p></div>
          </div>

          {result.in60pctTrap && (
            <div className="rounded-xl bg-red-100 dark:bg-red-950 p-4 text-sm text-red-800 dark:text-red-300 text-center">
              <p className="font-bold">60% Tax Trap!</p>
              <p>Between £100K-£125,140, you lose £1 of Personal Allowance for every £2 earned — effective marginal rate is 60%. Consider pension contributions to reduce income below £100K.</p>
            </div>
          )}

          <div className="space-y-2">
            {result.breakdown.map(b => (
              <div key={b.name} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${b.color} shrink-0`} />
                <span className="text-sm flex-1">{b.name}</span>
                <span className="text-sm text-muted-foreground">{formatCurrency(b.taxable)}</span>
                <span className="text-sm font-bold w-20 text-right">{formatCurrency(b.tax)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
