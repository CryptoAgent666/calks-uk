import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const JISA_LIMIT = 9_000 // annual limit 2025/26

function calculate(monthlyDeposit: number, childAge: number, currentBalance: number, growthRate: number) {
  const yearlyDeposit = Math.min(monthlyDeposit * 12, JISA_LIMIT)
  const yearsRemaining = Math.max(0, 18 - childAge)
  const monthlyGrowth = growthRate / 100 / 12

  let balance = currentBalance
  let totalDeposits = currentBalance

  for (let m = 0; m < yearsRemaining * 12; m++) {
    balance = balance * (1 + monthlyGrowth) + Math.min(monthlyDeposit, JISA_LIMIT / 12)
    totalDeposits += Math.min(monthlyDeposit, JISA_LIMIT / 12)
  }

  const growth = balance - totalDeposits

  return { balance, totalDeposits, growth, yearsRemaining, yearlyDeposit }
}

export default function JuniorIsaCalculator() {
  const [monthly, setMonthly] = useState('100')
  const [age, setAge] = useState('2')
  const [current, setCurrent] = useState('0')
  const [growth, setGrowth] = useState('5')

  const m = parseFloat(monthly.replace(/,/g,'')) || 0
  const a = parseInt(age) || 0
  const c = parseFloat(current.replace(/,/g,'')) || 0
  const g = parseFloat(growth) || 0
  const result = useMemo(() => calculate(m, a, c, g), [m, a, c, g])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Monthly Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div><p className="text-xs text-muted-foreground mt-1">Max £{JISA_LIMIT.toLocaleString()}/year</p></div>
        <div><label className="block text-sm font-medium mb-2">Child's Age</label><input type="number" min="0" max="17" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Current Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Growth Rate (%)</label><input type="number" min="0" max="10" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {m > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Value at Age 18</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.balance)}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.yearsRemaining} years of deposits remaining</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Deposited</p><p className="text-lg font-bold">{formatCurrency(result.totalDeposits)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Tax-Free Growth</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.growth)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Deposit</p><p className="text-lg font-bold">{formatCurrency(result.yearlyDeposit)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Junior ISA: tax-free savings for under 18s. £{JISA_LIMIT.toLocaleString()}/year limit. Child gains access at 18. Available as Cash or Stocks & Shares JISA. Cannot be withdrawn before 18 (except terminal illness).</p>
          </div>
        </div>
      )}
    </div>
  )
}
