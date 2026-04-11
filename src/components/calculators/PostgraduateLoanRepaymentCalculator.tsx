import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Plan 4 Scotland specific
const PLAN4_THRESHOLD = 31_395
const PLAN4_RATE = 0.09

function calculate(salary: number, balance: number) {
  const annual = salary > PLAN4_THRESHOLD ? (salary - PLAN4_THRESHOLD) * PLAN4_RATE : 0
  const monthly = annual / 12
  const yearsToRepay = annual > 0 ? Math.ceil(balance / annual) : 0

  return { annual, monthly, yearsToRepay, threshold: PLAN4_THRESHOLD }
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
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Loan Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>

      <div className="rounded-2xl bg-primary/10 p-6 text-center animate-fade-in-up">
        <p className="text-sm text-muted-foreground">Monthly Repayment (Plan 4 Scotland)</p>
        <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.monthly)}</p>
        <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.annual)}/year &middot; 9% above £{PLAN4_THRESHOLD.toLocaleString()}</p>
        {result.yearsToRepay > 0 && <p className="text-sm text-muted-foreground">~{result.yearsToRepay} years to repay (without interest)</p>}
      </div>
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>Plan 4 (Scotland): 9% of income above £{PLAN4_THRESHOLD.toLocaleString()}. Written off 30 years after first repayment due. If you also have a Plan 2 loan, you repay both simultaneously.</p>
      </div>
    </div>
  )
}
