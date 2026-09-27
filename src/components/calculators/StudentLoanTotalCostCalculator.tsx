import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// 2026/27 rules (gov.uk/repaying-your-student-loan/what-you-pay). Interest year 1 uses the RPI
// set for 1 Sep 2026 to 31 Aug 2027 (4.1%); later years use the assumed RPI.
const RPI_2026 = 4.1
// Plan 2 cap from 1 Sep 2026, confirmed to Aug 2027 only; the model assumes it continues.
const PLAN2_CAP = 6
const REPAYMENT_RATE = 0.09

type PlanId = 'plan1' | 'plan2' | 'plan4' | 'plan5'

// fixedYears = model years (year 1 = 2026/27) with the threshold held at its 2026/27 level.
// Plan 2 is frozen at £29,385 to April 2030 (Budget 2025), so four years; Plans 1, 4 and 5
// rise with RPI from April 2027. upper = Plan 2 income at which interest reaches the maximum.
const PLANS: Record<PlanId, { threshold: number; upper?: number; writeOff: number; fixedYears: number }> = {
  plan1: { threshold: 26_900, writeOff: 25, fixedYears: 1 },
  plan2: { threshold: 29_385, upper: 52_885, writeOff: 30, fixedYears: 4 },
  plan4: { threshold: 33_795, writeOff: 30, fixedYears: 1 },
  plan5: { threshold: 25_000, writeOff: 40, fixedYears: 1 },
}

function interestRate(plan: PlanId, rpi: number, salary: number, lower: number, upper: number) {
  if (plan !== 'plan2') return rpi
  const min = Math.min(rpi, PLAN2_CAP)
  const max = Math.min(rpi + 3, PLAN2_CAP)
  const share = Math.min(1, Math.max(0, (salary - lower) / (upper - lower)))
  return min + (max - min) * share
}

function calculate(startBalance: number, startSalary: number, salaryGrowth: number, planId: string, rpiAssumption = 3) {
  const plan: PlanId = planId in PLANS ? (planId as PlanId) : 'plan2'
  const p = PLANS[plan]
  let balance = startBalance
  let salary = startSalary
  let totalPaid = 0
  let totalInterest = 0
  let months = 0
  let firstYearRate = 0
  const maxMonths = p.writeOff * 12

  while (balance > 0 && months < maxMonths) {
    const year = Math.floor(months / 12) + 1
    const uprate = Math.pow(1 + rpiAssumption / 100, Math.max(0, year - p.fixedYears))
    const threshold = p.threshold * uprate
    const upper = (p.upper ?? p.threshold) * uprate
    const rpi = year === 1 ? RPI_2026 : rpiAssumption
    const rate = interestRate(plan, rpi, salary, threshold, upper)
    if (months === 0) firstYearRate = rate

    const interest = balance * (rate / 100 / 12)
    balance += interest
    totalInterest += interest
    const annualRepayment = Math.max(0, salary - threshold) * REPAYMENT_RATE
    const monthlyRepayment = Math.min(annualRepayment / 12, balance)
    balance -= monthlyRepayment
    totalPaid += monthlyRepayment
    months++
    if (months % 12 === 0) salary *= (1 + salaryGrowth / 100)
  }

  const writtenOff = balance > 0 ? balance : 0
  const repaidInFull = balance <= 0
  const yearsToRepay = repaidInFull ? Math.ceil(months / 12) : p.writeOff

  return { totalPaid, totalInterest, writtenOff, repaidInFull, yearsToRepay, writeOffYear: p.writeOff, firstYearRate }
}

export default function StudentLoanTotalCostCalculator() {
  const [balance, setBalance] = useState('50000')
  const [salary, setSalary] = useState('28000')
  const [growth, setGrowth] = useState('4')
  const [plan, setPlan] = useState('plan2')
  const [rpi, setRpi] = useState('3')

  const b = parseFloat(balance.replace(/,/g,'')) || 0
  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const g = parseFloat(growth) || 0
  const r = parseFloat(rpi) || 0
  const result = useMemo(() => calculate(b, s, g, plan, r), [b, s, g, plan, r])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Starting Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Starting Balance" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Starting Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Starting Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Salary Growth (%/yr)</label><input type="number" min="0" max="10" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Salary Growth (%/yr)" /></div>
        <div><label className="block text-sm font-medium mb-2">Plan</label><select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Plan"><option value="plan1">Plan 1 (pre-2012)</option><option value="plan2">Plan 2 (post-2012)</option><option value="plan4">Plan 4 (Scotland)</option><option value="plan5">Plan 5 (post-2023)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">RPI Assumption (%/yr)</label><input type="number" min="0" max="10" step="0.1" value={rpi} onChange={(e) => setRpi(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="RPI Assumption (%/yr)" /></div>
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
            <p>Interest added over the term: {formatCurrency(result.totalInterest)}. Rate in year 1: {result.firstYearRate.toFixed(2)}%.</p>
            <p className="mt-2">{result.repaidInFull
              ? 'You\'ll repay in full before the write-off date.'
              : result.totalPaid < b
                ? `${formatCurrency(result.writtenOff)} is written off, so you pay back only ${((result.totalPaid / b) * 100).toFixed(0)}% of what you borrowed. Think of it as a graduate tax, not a traditional loan.`
                : `${formatCurrency(result.writtenOff)} is written off, but interest means you still hand over ${formatCurrency(result.totalPaid)}, ${((result.totalPaid / b) * 100).toFixed(0)}% of what you borrowed, before that happens. Think of it as a graduate tax, not a traditional loan.`}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Assumptions: repayments start in 2026/27. Interest uses RPI of 4.1% for 2026/27 and your RPI assumption after that. Plan 2 interest runs from RPI at {formatCurrency(29385)} to the 6% cap at {formatCurrency(52885)}; the cap is confirmed only to August 2027 and is assumed to continue. The Plan 2 threshold stays at {formatCurrency(29385)} until April 2030 and then rises with RPI; Plan 1, 4 and 5 thresholds rise with RPI from April 2027. Figures are in cash terms, not adjusted for inflation.
          </p>
        </div>
      )}
    </div>
  )
}
