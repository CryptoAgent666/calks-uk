import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

const PLANS: Record<string, { name: string; baseRate: number; maxRate: number; incomeThresholdLow: number; incomeThresholdHigh: number }> = {
  plan1: { name: 'Plan 1', baseRate: 4.3, maxRate: 4.3, incomeThresholdLow: 0, incomeThresholdHigh: 0 },
  plan2: { name: 'Plan 2', baseRate: 4.3, maxRate: 7.3, incomeThresholdLow: 29_385, incomeThresholdHigh: 49_130 },
  plan4: { name: 'Plan 4', baseRate: 4.3, maxRate: 4.3, incomeThresholdLow: 0, incomeThresholdHigh: 0 },
  plan5: { name: 'Plan 5', baseRate: 4.3, maxRate: 7.3, incomeThresholdLow: 25_000, incomeThresholdHigh: 49_130 },
}

function calculate(planId: string, balance: number, salary: number) {
  const plan = PLANS[planId]
  let interestRate: number

  if (plan.incomeThresholdHigh > 0 && salary > plan.incomeThresholdLow) {
    if (salary >= plan.incomeThresholdHigh) interestRate = plan.maxRate
    else {
      const ratio = (salary - plan.incomeThresholdLow) / (plan.incomeThresholdHigh - plan.incomeThresholdLow)
      interestRate = plan.baseRate + ratio * (plan.maxRate - plan.baseRate)
    }
  } else {
    interestRate = plan.baseRate
  }

  const annualInterest = balance * (interestRate / 100)
  const monthlyInterest = annualInterest / 12
  const dailyInterest = annualInterest / 365

  // How balance grows over 5 years with no repayments
  const balanceIn5 = balance * Math.pow(1 + interestRate / 100, 5)

  return { interestRate, annualInterest, monthlyInterest, dailyInterest, balanceIn5, plan }
}

export default function StudentLoanInterestCalculator() {
  const [plan, setPlan] = useState('plan2')
  const [balance, setBalance] = useState('45000')
  const [salary, setSalary] = useState('35000')

  const b = parseFloat(balance.replace(/,/g,'')) || 0
  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(plan, b, s), [plan, b, s])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Loan Plan</label><select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring">{Object.entries(PLANS).map(([k,v]) => <option key={k} value={k}>{v.name}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Current Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>

      {b > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Your Interest Rate</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatPercent(result.interestRate)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.annualInterest)}/year &middot; {formatCurrency(result.monthlyInterest)}/month &middot; {formatCurrency(result.dailyInterest)}/day</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Current Balance</p><p className="text-lg font-bold">{formatCurrency(b)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Balance in 5 Years (no repayments)</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.balanceIn5)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{result.plan.name} interest:</p>
            {result.plan.incomeThresholdHigh > 0 ? (
              <><p>Below £{result.plan.incomeThresholdLow.toLocaleString()}: RPI ({result.plan.baseRate}%)</p><p>£{result.plan.incomeThresholdLow.toLocaleString()}–£{result.plan.incomeThresholdHigh.toLocaleString()}: RPI + up to 3%</p><p>Above £{result.plan.incomeThresholdHigh.toLocaleString()}: RPI + 3% ({result.plan.maxRate}%)</p></>
            ) : (
              <p>Fixed at RPI or Bank of England base rate + 1% (whichever is lower): {result.plan.baseRate}%</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
