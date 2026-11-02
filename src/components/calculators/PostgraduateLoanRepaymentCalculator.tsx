import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Plan 4 Scotland specific
const PLAN4_THRESHOLD = 33_795
const PLAN4_RATE = 0.09
// Current Plan 4 interest (from 1 September 2026). The rate changes, usually each September.
const PLAN4_INTEREST = 0.041
// Plan 4 balances are cancelled 30 years after the April repayment first fell
// due, so a repayment term longer than that never actually happens.
const PLAN4_WRITE_OFF_YEARS = 30

function calculate(salary: number, balance: number) {
  const annual = salary > PLAN4_THRESHOLD ? (salary - PLAN4_THRESHOLD) * PLAN4_RATE : 0
  const monthly = annual / 12
  // Payroll rounds each deduction down to whole pounds
  const payslipMonthly = Math.floor(monthly)

  // Month-by-month projection: salary, threshold and interest rate all stay as they are today
  let remaining = balance
  let totalRepaid = 0
  let totalInterest = 0
  let months = 0
  while (remaining > 0.005 && months < PLAN4_WRITE_OFF_YEARS * 12) {
    const interest = remaining * (PLAN4_INTEREST / 12)
    totalInterest += interest
    remaining += interest
    const paid = Math.min(monthly, remaining)
    totalRepaid += paid
    remaining -= paid
    months += 1
  }
  const writtenOff = remaining > 0.005
  const amountWrittenOff = writtenOff ? remaining : 0
  const yearsToRepay = writtenOff ? 0 : Math.ceil(months / 12)

  return { annual, monthly, payslipMonthly, yearsToRepay, writtenOff, amountWrittenOff, totalRepaid, totalInterest, threshold: PLAN4_THRESHOLD }
}

export default function PostgraduateLoanRepaymentCalculator() {
  const [salary, setSalary] = useState('35000')
  const [balance, setBalance] = useState('15000')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const b = parseFloat(balance.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(s, b), [s, b])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Loan Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Loan Balance" /></div></div>
      </div>

      <div className="rounded-2xl bg-primary/10 p-6 text-center animate-fade-in-up">
        <p className="text-sm text-muted-foreground">Monthly Repayment (Plan 4 Scotland)</p>
        <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.monthly)}</p>
        <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.annual)}/year &middot; 9% above £{PLAN4_THRESHOLD.toLocaleString()} &middot; payroll rounds down to £{result.payslipMonthly} a month</p>
        {b > 0 && (result.writtenOff
          ? <p className="text-sm text-muted-foreground">At this salary the balance is not cleared: you repay {formatCurrency(result.totalRepaid)} over {PLAN4_WRITE_OFF_YEARS} years, and about {formatCurrency(result.amountWrittenOff)} is then written off</p>
          : <p className="text-sm text-muted-foreground">Cleared in about {result.yearsToRepay} years: {formatCurrency(result.totalRepaid)} repaid, including {formatCurrency(result.totalInterest)} interest</p>)}
      </div>
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>The projection holds your salary, the threshold and the {(PLAN4_INTEREST * 100).toFixed(1)}% interest rate fixed, and counts the full 30 years from today, so if you started repaying years ago your write-off comes sooner. In practice all three change.</p>
        <p className="mt-2">Plan 4 (Scotland): 9% of income above £{PLAN4_THRESHOLD.toLocaleString()}. Interest is the lower of RPI or the Bank of England base rate plus 1%, currently 4.1%. Written off 30 years after first repayment due. If you also have a Plan 1 or Plan 2 loan, you repay 9% of income over the lowest of your plan thresholds, not 9% for each. SAAS postgraduate loans are on Plan 4 too, so they add no separate deduction; only a Postgraduate Loan from Student Finance England or Wales is repaid separately, at 6% over £21,000.</p>
      </div>
    </div>
  )
}
