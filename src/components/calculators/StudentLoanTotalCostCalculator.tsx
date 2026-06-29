import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(startBalance: number, startSalary: number, salaryGrowth: number, plan: string) {
  const plans: Record<string, { threshold: number; rate: number; interest: number; writeOff: number }> = {
    plan1: { threshold: 26_900, rate: 0.09, interest: 4.1, writeOff: 25 },
    plan2: { threshold: 29_385, rate: 0.09, interest: 6.0, writeOff: 30 },
    plan5: { threshold: 25_000, rate: 0.09, interest: 4.1, writeOff: 40 },
  }

  const p = plans[plan] || plans.plan2
  let balance = startBalance
  let salary = startSalary
  let totalPaid = 0
  let months = 0
  const maxMonths = p.writeOff * 12

  while (balance > 0 && months < maxMonths) {
    const monthlyInterest = balance * (p.interest / 100 / 12)
    balance += monthlyInterest
    const annualRepayment = Math.max(0, salary - p.threshold) * p.rate
    const monthlyRepayment = Math.min(annualRepayment / 12, balance)
    balance -= monthlyRepayment
    totalPaid += monthlyRepayment
    months++
    if (months % 12 === 0) salary *= (1 + salaryGrowth / 100)
  }

  const writtenOff = balance > 0 ? balance : 0
  const repaidInFull = balance <= 0
  const yearsToRepay = repaidInFull ? Math.ceil(months / 12) : p.writeOff

  return { totalPaid, writtenOff, repaidInFull, yearsToRepay, writeOffYear: p.writeOff }
}

export default function StudentLoanTotalCostCalculator() {
  const [balance, setBalance] = useState('50000')
  const [salary, setSalary] = useState('28000')
  const [growth, setGrowth] = useState('3')
  const [plan, setPlan] = useState('plan2')

  const b = parseFloat(balance.replace(/,/g,'')) || 0
  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const g = parseFloat(growth) || 0
  const result = useMemo(() => calculate(b, s, g, plan), [b, s, g, plan])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Starting Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Starting Balance" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Starting Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Starting Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Salary Growth (%/yr)</label><input type="number" min="0" max="10" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Salary Growth (%/yr)" /></div>
        <div><label className="block text-sm font-medium mb-2">Plan</label><select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Plan"><option value="plan1">Plan 1 (pre-2012)</option><option value="plan2">Plan 2 (post-2012)</option><option value="plan5">Plan 5 (post-2023)</option></select></div>
      </div>

      {b > 0 && s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total You'll Actually Pay</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalPaid)}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.repaidInFull ? `Repaid in ${result.yearsToRepay} years` : `Written off after ${result.writeOffYear} years`}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Original Debt</p><p className="text-lg font-bold">{formatCurrency(b)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Total Repaid</p><p className="text-lg font-bold">{formatCurrency(result.totalPaid)}</p></div>
            {result.writtenOff > 0 && <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Written Off</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.writtenOff)}</p></div>}
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>{result.repaidInFull ? 'You\'ll repay in full before the write-off date.' : `Most of your loan will be written off — you'll only pay ${((result.totalPaid / b) * 100).toFixed(0)}% of the original amount. Think of it as a graduate tax, not a traditional loan.`}</p>
          </div>
        </div>
      )}
    </div>
  )
}
