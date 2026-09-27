import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// 2026/27 rules (gov.uk/repaying-your-student-loan/what-you-pay). Interest in year 1 uses the RPI
// set for 1 Sep 2026 to 31 Aug 2027 (4.1%); later years use the assumed RPI. Same model as the
// student-loan-total-cost calculator.
const RPI_2026 = 4.1
// Plan 2 cap from 1 Sep 2026, confirmed to Aug 2027 only; the model assumes it continues.
const PLAN2_CAP = 6
const REPAYMENT_RATE = 0.09

type PlanId = 'plan1' | 'plan2' | 'plan4' | 'plan5'

// writeOff = years after the April you were first due to repay (gov.uk/repaying-your-student-loan/
// when-your-student-loan-gets-written-off-or-cancelled). Plan 1 loans first taken before 1 Sep 2006
// are written off at 65 instead, which is not modelled. fixedYears = model years (year 1 = 2026/27)
// with the threshold held at its 2026/27 level: Plan 2 is frozen at £29,385 to April 2030, Plans 1,
// 4 and 5 rise with RPI from April 2027. upper = Plan 2 income at which interest reaches the maximum.
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

// Month-by-month repayments until the balance clears or the loan is written off.
function simulate(plan: PlanId, startBalance: number, startSalary: number, salaryGrowth: number, rpiAssumption: number, maxMonths: number) {
  const p = PLANS[plan]
  const payments: number[] = []
  let balance = startBalance
  let salary = startSalary
  let months = 0
  let totalPaid = 0
  while (balance > 0.005 && months < maxMonths) {
    const year = Math.floor(months / 12) + 1
    const uprate = Math.pow(1 + rpiAssumption / 100, Math.max(0, year - p.fixedYears))
    const threshold = p.threshold * uprate
    const upper = (p.upper ?? p.threshold) * uprate
    const rate = interestRate(plan, year === 1 ? RPI_2026 : rpiAssumption, salary, threshold, upper)
    balance += balance * (rate / 100 / 12)
    const payment = Math.min(Math.max(0, salary - threshold) * REPAYMENT_RATE / 12, balance)
    balance -= payment
    totalPaid += payment
    payments.push(payment)
    months++
    if (months % 12 === 0) salary *= 1 + salaryGrowth / 100
  }
  return { payments, totalPaid, months, writtenOff: balance > 0.005 ? balance : 0 }
}

function calculate(planId: string, balance: number, salary: number, lumpSum: number, salaryGrowth = 4, rpiAssumption = 3, investReturn = 5, yearsRepaid = 0) {
  const plan: PlanId = planId in PLANS ? (planId as PlanId) : 'plan2'
  const p = PLANS[plan]
  const maxMonths = Math.max(0, p.writeOff - yearsRepaid) * 12
  const lump = Math.min(Math.max(0, lumpSum), balance)
  const firstThreshold = p.threshold
  const firstYearRate = interestRate(plan, RPI_2026, salary, firstThreshold, p.upper ?? firstThreshold)
  const monthlyRepayment = Math.max(0, salary - firstThreshold) * REPAYMENT_RATE / 12

  const normal = simulate(plan, balance, salary, salaryGrowth, rpiAssumption, maxMonths)
  const withLump = simulate(plan, balance - lump, salary, salaryGrowth, rpiAssumption, maxMonths)
  const totalWithLump = lump + withLump.totalPaid
  const saving = normal.totalPaid - totalWithLump
  const worthIt = saving > 0

  // Alternative: keep the loan and invest the lump sum (e.g. in an ISA, no tax on growth). To compare
  // like with like, the repay route invests each month's repayment it no longer has to make.
  const horizon = Math.max(normal.months, withLump.months)
  const g = Math.pow(1 + investReturn / 100, 1 / 12) - 1
  const investedLump = lump * Math.pow(1 + g, horizon)
  let investedSavings = 0
  for (let m = 0; m < horizon; m++) {
    const saved = (normal.payments[m] ?? 0) - (withLump.payments[m] ?? 0)
    investedSavings += saved * Math.pow(1 + g, horizon - m - 1)
  }
  const investAdvantage = investedLump - investedSavings

  return {
    monthlyRepayment, firstYearRate,
    totalPaidNormal: normal.totalPaid, monthsNormal: normal.months, writtenOffNormal: normal.writtenOff,
    repaidLump: withLump.totalPaid, totalWithLump, monthsLump: withLump.months, writtenOffLump: withLump.writtenOff,
    saving, worthIt, lump, horizon, investedLump, investedSavings, investAdvantage,
  }
}

const moneyClass = 'w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'
const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'
const span = (months: number) => `${Math.floor(months / 12)}y ${months % 12}m`

export default function StudentLoanEarlyRepayCalculator() {
  const [plan, setPlan] = useState('plan2')
  const [balance, setBalance] = useState('45000')
  const [salary, setSalary] = useState('35000')
  const [lump, setLump] = useState('10000')
  const [growth, setGrowth] = useState('4')
  const [rpi, setRpi] = useState('3')
  const [invest, setInvest] = useState('5')
  const [repaid, setRepaid] = useState('0')

  const b = parseFloat(balance.replace(/,/g,'')) || 0
  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const l = parseFloat(lump.replace(/,/g,'')) || 0
  const g = parseFloat(growth) || 0
  const r = parseFloat(rpi) || 0
  const x = parseFloat(invest) || 0
  const yr = parseInt(repaid) || 0
  const result = useMemo(() => calculate(plan, b, s, l, g, r, x, yr), [plan, b, s, l, g, r, x, yr])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Loan Plan</label><select value={plan} onChange={(e) => setPlan(e.target.value)} className={inputClass} aria-label="Loan Plan"><option value="plan1">Plan 1</option><option value="plan2">Plan 2 (from Sept 2012)</option><option value="plan4">Plan 4 (Scotland)</option><option value="plan5">Plan 5 (England from Aug 2023)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Current Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className={moneyClass} aria-label="Current Balance" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className={moneyClass} aria-label="Annual Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Lump Sum to Repay</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={lump} onChange={(e) => setLump(e.target.value)} className={moneyClass} aria-label="Lump Sum to Repay" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Salary Growth (%/yr)</label><input type="number" min="0" max="10" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className={inputClass} aria-label="Salary Growth (%/yr)" /></div>
        <div><label className="block text-sm font-medium mb-2">RPI Assumption (%/yr)</label><input type="number" min="0" max="10" step="0.1" value={rpi} onChange={(e) => setRpi(e.target.value)} className={inputClass} aria-label="RPI Assumption (%/yr)" /></div>
        <div><label className="block text-sm font-medium mb-2">Investment Return (%/yr)</label><input type="number" min="0" max="12" step="0.5" value={invest} onChange={(e) => setInvest(e.target.value)} className={inputClass} aria-label="Investment Return (%/yr)" /></div>
        <div><label className="block text-sm font-medium mb-2">Years Already Repaying</label><input type="number" min="0" max="39" value={repaid} onChange={(e) => setRepaid(e.target.value)} className={inputClass} aria-label="Years Already Repaying" /></div>
      </div>

      {b > 0 && s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.worthIt ? 'bg-green-100 dark:bg-green-950' : 'bg-orange-100 dark:bg-orange-950'}`}>
            {result.worthIt ? (
              <p className="text-lg font-bold text-green-700 dark:text-green-400">Repaying {formatCurrency(result.lump)} early cuts what you pay in total by {formatCurrency(result.saving)}</p>
            ) : (
              <p className="text-lg font-bold text-orange-700 dark:text-orange-400">Repaying {formatCurrency(result.lump)} early means paying {formatCurrency(-result.saving)} more in total</p>
            )}
            <p className="text-sm text-muted-foreground mt-1">{result.writtenOffNormal > 0 ? `Without the lump sum, ${formatCurrency(result.writtenOffNormal)} would be written off.` : 'Without the lump sum, you would clear the loan before write-off.'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-border p-4">
              <p className="font-semibold mb-2">Without Lump Sum</p>
              <p>Repayment now: {formatCurrency(result.monthlyRepayment)}/month</p>
              <p>Total paid: {formatCurrency(result.totalPaidNormal)}</p>
              <p>Time: {span(result.monthsNormal)}</p>
              {result.writtenOffNormal > 0 && <p className="text-green-600">Written off: {formatCurrency(result.writtenOffNormal)}</p>}
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="font-semibold mb-2">With {formatCurrency(result.lump)} Lump Sum</p>
              <p>Repayment now: {formatCurrency(result.lump >= b ? 0 : result.monthlyRepayment)}/month</p>
              <p>Total paid: {formatCurrency(result.totalWithLump)} (lump sum + {formatCurrency(result.repaidLump)})</p>
              <p>Time: {span(result.monthsLump)}</p>
              {result.writtenOffLump > 0 && <p className="text-green-600">Written off: {formatCurrency(result.writtenOffLump)}</p>}
            </div>
          </div>

          {result.lump > 0 && result.horizon > 0 && (
            <div className="rounded-xl border border-border p-4 text-sm">
              <p className="font-semibold mb-1">Invest the lump sum instead?</p>
              <p className="text-muted-foreground">Invested at {x}% a year with no tax on growth (as in an ISA), {formatCurrency(result.lump)} grows to {formatCurrency(result.investedLump)} over {span(result.horizon)}. If you repay instead and invest each repayment you no longer have to make, you build {formatCurrency(result.investedSavings)} by the same date. {result.investAdvantage > 0 ? `Investing comes out ${formatCurrency(result.investAdvantage)} ahead.` : `Repaying comes out ${formatCurrency(-result.investAdvantage)} ahead.`}</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Rate in year 1: {result.firstYearRate.toFixed(2)}%. Plan 2 interest runs from RPI at {formatCurrency(29385)} to the 6% cap at {formatCurrency(52885)} (the cap is confirmed only to August 2027 and assumed to continue); Plans 1, 4 and 5 charge RPI (4.1% for 2026/27), using your RPI assumption after that. The Plan 2 threshold stays at {formatCurrency(29385)} until April 2030; the others rise with RPI from April 2027. Write-off: Plan 1 after 25 years (at 65 if your first loan was before September 2006), Plans 2 and 4 after 30 years, Plan 5 after 40 years, counted from the April you were first due to repay. Figures are in cash terms and ignore any investment charges.
          </p>
        </div>
      )}
    </div>
  )
}
