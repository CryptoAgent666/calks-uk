import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(goal: number, currentSavings: number, monthlyDeposit: number, annualRate: number) {
  if (goal <= currentSavings) return { months: 0, years: 0, remMonths: 0, totalDeposited: 0, interestEarned: 0 }
  const monthlyRate = annualRate / 100 / 12
  let balance = currentSavings
  let months = 0
  let totalDeposited = currentSavings

  while (balance < goal && months < 1200) {
    balance = balance * (1 + monthlyRate) + monthlyDeposit
    totalDeposited += monthlyDeposit
    months++
  }

  return {
    months, years: Math.floor(months / 12), remMonths: months % 12,
    totalDeposited, interestEarned: balance - totalDeposited,
    finalBalance: balance,
  }
}

function calcMonthlyNeeded(goal: number, currentSavings: number, annualRate: number, targetMonths: number) {
  if (targetMonths <= 0) return 0
  const monthlyRate = annualRate / 100 / 12
  if (monthlyRate === 0) return (goal - currentSavings) / targetMonths
  const fv = goal
  const pv = currentSavings
  const n = targetMonths
  const r = monthlyRate
  return (fv - pv * Math.pow(1 + r, n)) / ((Math.pow(1 + r, n) - 1) / r)
}

export default function SavingsGoalCalculator() {
  const [goal, setGoal] = useState('')
  const [current, setCurrent] = useState('0')
  const [monthly, setMonthly] = useState('500')
  const [rate, setRate] = useState('4.5')
  const [targetYears, setTargetYears] = useState('5')

  const g = parseFloat(goal.replace(/,/g,'')) || 0
  const c = parseFloat(current.replace(/,/g,'')) || 0
  const m = parseFloat(monthly.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 0
  const ty = parseInt(targetYears) || 0

  const result = useMemo(() => calculate(g, c, m, r), [g, c, m, r])
  const needed = useMemo(() => calcMonthlyNeeded(g, c, r, ty * 12), [g, c, r, ty])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Savings Goal</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="20,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Savings Goal" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Current Savings</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current Savings" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Monthly Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Deposit" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Interest Rate (%)</label><input type="number" min="0" max="15" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Interest Rate (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Target Time (years)</label><input type="number" min="1" max="40" value={targetYears} onChange={(e) => setTargetYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Target Time (years)" /></div>
      </div>

      {g > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          {m > 0 && (
            <div className="rounded-2xl bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">At {formatCurrency(m)}/month you'll reach {formatCurrency(g)} in</p>
              <p className="text-3xl font-bold text-primary mt-1">{result.years > 0 ? `${result.years}y ` : ''}{result.remMonths}m</p>
            </div>
          )}

          {ty > 0 && (
            <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
              <p className="text-sm text-muted-foreground">To reach {formatCurrency(g)} in {ty} years, save</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(Math.max(0, needed))}/month</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
