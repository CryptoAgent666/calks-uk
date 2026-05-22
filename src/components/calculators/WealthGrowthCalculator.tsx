import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(currentWealth: number, annualSavings: number, growthRate: number, years: number) {
  const monthlyGrowth = growthRate / 100 / 12
  const monthlySavings = annualSavings / 12

  let balance = currentWealth
  const milestones: { year: number; balance: number; invested: number; growth: number }[] = []
  let invested = currentWealth

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyGrowth) + monthlySavings
    }
    invested += annualSavings
    milestones.push({ year: y, balance, invested, growth: balance - invested })
  }

  // Find when each million is reached
  const millionYears: { amount: number; year: number }[] = []
  let target = currentWealth < 100_000 ? 100_000 : 1_000_000
  for (const m of milestones) {
    while (m.balance >= target && target <= 10_000_000) {
      millionYears.push({ amount: target, year: m.year })
      target = target < 1_000_000 ? target + 100_000 : target + 1_000_000
    }
  }

  return { finalBalance: balance, totalInvested: invested, totalGrowth: balance - invested, milestones: milestones.filter((_, i) => (i + 1) % 5 === 0 || i === 0 || i === years - 1), millionYears: millionYears.slice(0, 6) }
}

export default function WealthGrowthCalculator() {
  const [current, setCurrent] = useState('50000')
  const [annual, setAnnual] = useState('20000')
  const [growth, setGrowth] = useState('7')
  const [years, setYears] = useState('20')

  const c = parseFloat(current.replace(/,/g,'')) || 0
  const a = parseFloat(annual.replace(/,/g,'')) || 0
  const g = parseFloat(growth) || 0
  const y = parseInt(years) || 0
  const result = useMemo(() => calculate(c, a, g, y), [c, a, g, y])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Current Wealth</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current Wealth" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Annual Savings</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={annual} onChange={(e) => setAnnual(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Savings" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Growth Rate (%)</label><input type="number" min="0" max="15" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Growth Rate (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Years</label><input type="number" min="1" max="50" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years" /></div>
      </div>

      {y > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Projected Wealth in {y} Years</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.finalBalance)}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Total Invested</p><p className="text-lg font-bold">{formatCurrency(result.totalInvested)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Growth</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalGrowth)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Growth Multiple</p><p className="text-lg font-bold">{result.totalInvested > 0 ? (result.finalBalance / result.totalInvested).toFixed(1) : 0}x</p></div>
          </div>

          {result.millionYears.length > 0 && (
            <div><h3 className="text-sm font-semibold mb-2">Milestones</h3><div className="flex flex-wrap gap-2">{result.millionYears.map(m => <span key={m.amount} className="px-3 py-1.5 rounded-lg bg-primary/10 text-sm font-medium text-primary">{m.amount >= 1e6 ? `£${m.amount/1e6}M` : `£${m.amount/1e3}K`} in {m.year}yr</span>)}</div></div>
          )}

          <div className="overflow-x-auto max-h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background"><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Year</th><th className="text-right py-2 font-medium text-muted-foreground">Invested</th><th className="text-right py-2 font-medium text-muted-foreground">Growth</th><th className="text-right py-2 font-medium text-muted-foreground">Balance</th></tr></thead>
              <tbody>{result.milestones.map(m => (
                <tr key={m.year} className="border-b border-border/50"><td className="py-1.5">{m.year}</td><td className="text-right tabular-nums">{formatCurrency(m.invested)}</td><td className="text-right tabular-nums text-green-600">{formatCurrency(m.growth)}</td><td className="text-right tabular-nums font-medium">{formatCurrency(m.balance)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
