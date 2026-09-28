import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const PG_THRESHOLD = 21_000
const PG_RATE = 0.06
const PG_INTEREST = 6

// Undergraduate plans repaid alongside the postgraduate loan, 2026/27 thresholds (9% above each)
type UgPlan = 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5'
const UG_PLANS: Record<Exclude<UgPlan, 'none'>, { name: string; threshold: number; rate: number }> = {
  plan1: { name: 'Plan 1', threshold: 26_900, rate: 0.09 },
  plan2: { name: 'Plan 2', threshold: 29_385, rate: 0.09 },
  plan4: { name: 'Plan 4', threshold: 33_795, rate: 0.09 },
  plan5: { name: 'Plan 5', threshold: 25_000, rate: 0.09 },
}

function calculate(balance: number, salary: number, ugPlan: UgPlan = 'none') {
  const annualRepayment = salary > PG_THRESHOLD ? (salary - PG_THRESHOLD) * PG_RATE : 0
  const monthlyRepayment = annualRepayment / 12
  const annualInterest = balance * (PG_INTEREST / 100)
  const monthlyInterest = annualInterest / 12
  const netReduction = annualRepayment - annualInterest
  const growingBalance = netReduction < 0

  // The undergraduate deduction is taken in addition to the postgraduate one, not instead of it
  const ug = ugPlan === 'none' ? null : UG_PLANS[ugPlan]
  const ugAnnualRepayment = ug && salary > ug.threshold ? (salary - ug.threshold) * ug.rate : 0
  const ugMonthlyRepayment = ugAnnualRepayment / 12
  const combinedMonthly = monthlyRepayment + ugMonthlyRepayment

  // Time to repay from now, at this salary and interest rate (simplified)
  let months = 0
  let bal = balance
  while (bal > 0 && months < 360) {
    bal += bal * (PG_INTEREST / 100 / 12)
    bal -= monthlyRepayment
    months++
  }
  const yearsToRepay = bal <= 0 ? Math.ceil(months / 12) : 0
  const writtenOff = bal > 0

  return { annualRepayment, monthlyRepayment, annualInterest, monthlyInterest, netReduction, growingBalance, yearsToRepay, writtenOff, ugAnnualRepayment, ugMonthlyRepayment, combinedMonthly }
}

export default function PostgraduateLoanCalculator() {
  const [balance, setBalance] = useState('12000')
  const [salary, setSalary] = useState('35000')
  const [ugPlan, setUgPlan] = useState<UgPlan>('none')

  const b = parseFloat(balance.replace(/,/g,'')) || 0
  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(b, s, ugPlan), [b, s, ugPlan])
  const ug = ugPlan === 'none' ? null : UG_PLANS[ugPlan]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Postgraduate Loan Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Postgraduate Loan Balance" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Undergraduate Loan</label><select value={ugPlan} onChange={(e) => setUgPlan(e.target.value as UgPlan)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Undergraduate loan"><option value="none">None</option><option value="plan1">Plan 1 (9% over £26,900)</option><option value="plan2">Plan 2 (9% over £29,385)</option><option value="plan4">Plan 4 (9% over £33,795)</option><option value="plan5">Plan 5 (9% over £25,000)</option></select></div>
      </div>

      {b > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Monthly Repayment</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.monthlyRepayment)}</p>
            <p className="text-sm text-muted-foreground mt-1">6% of income above £{PG_THRESHOLD.toLocaleString()}</p>
          </div>
          {ug && (
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Postgraduate loan</p><p className="text-lg font-bold">{formatCurrency(result.monthlyRepayment)}/mo</p></div>
              <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">{ug.name} (9% over £{ug.threshold.toLocaleString()})</p><p className="text-lg font-bold">{formatCurrency(result.ugMonthlyRepayment)}/mo</p></div>
              <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">Total student loan deductions</p><p className="text-lg font-bold text-primary">{formatCurrency(result.combinedMonthly)}/mo</p></div>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Annual Repayment</p><p className="text-lg font-bold">{formatCurrency(result.annualRepayment)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-3 text-center"><p className="text-xs text-muted-foreground">Annual Interest</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.annualInterest)}</p></div>
            <div className={`rounded-xl p-3 text-center ${result.growingBalance ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}><p className="text-xs text-muted-foreground">Net Balance Change</p><p className={`text-lg font-bold ${result.growingBalance ? 'text-destructive' : 'text-green-700 dark:text-green-400'}`}>{result.netReduction > 0 ? '-' : '+'}{formatCurrency(Math.abs(result.netReduction))}/yr</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">{result.writtenOff ? 'Not repaid within 30 years' : 'Repaid in (from now)'}</p><p className="text-lg font-bold">{result.writtenOff ? 'Written off' : `${result.yearsToRepay} years`}</p></div>
          </div>
          {result.growingBalance && <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-sm text-orange-800 dark:text-orange-300 text-center">Your balance is growing — interest ({formatCurrency(result.annualInterest)}/yr) exceeds repayments ({formatCurrency(result.annualRepayment)}/yr)</div>}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Postgraduate loan: 6% above £{PG_THRESHOLD.toLocaleString()}, interest at RPI + 3% ({PG_INTEREST}%). Any balance left is written off 30 years after repayments start, which is the April after you finish or leave the course; the repayment time above assumes repayments start now at this salary. Repaid alongside Plan 1/2/4/5 (not instead of). Covers Student Finance England loans.</p>
          </div>
        </div>
      )}
    </div>
  )
}
