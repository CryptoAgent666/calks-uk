import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const PLANS: Record<string, { threshold: number; rate: number; interestRate: number; writeOffYears: number }> = {
  plan1: { threshold: 26_900, rate: 0.09, interestRate: 4.3, writeOffYears: 25 },
  plan2: { threshold: 29_385, rate: 0.09, interestRate: 7.3, writeOffYears: 30 },
  plan4: { threshold: 33_795, rate: 0.09, interestRate: 4.3, writeOffYears: 30 },
  plan5: { threshold: 25_000, rate: 0.09, interestRate: 7.3, writeOffYears: 40 },
}

function calculate(planId: string, balance: number, salary: number, lumpSum: number) {
  const plan = PLANS[planId]
  const monthlyRepayment = salary > plan.threshold ? ((salary - plan.threshold) * plan.rate) / 12 : 0
  const monthlyInterest = (balance * plan.interestRate / 100) / 12

  // Without lump sum
  let balNormal = balance
  let monthsNormal = 0
  let totalPaidNormal = 0
  while (balNormal > 0 && monthsNormal < plan.writeOffYears * 12) {
    const interest = balNormal * (plan.interestRate / 100 / 12)
    balNormal += interest
    const payment = Math.min(monthlyRepayment, balNormal)
    balNormal -= payment
    totalPaidNormal += payment
    monthsNormal++
  }
  const writtenOffNormal = balNormal > 0 ? balNormal : 0

  // With lump sum
  let balLump = Math.max(0, balance - lumpSum)
  let monthsLump = 0
  let totalPaidLump = lumpSum
  while (balLump > 0 && monthsLump < plan.writeOffYears * 12) {
    const interest = balLump * (plan.interestRate / 100 / 12)
    balLump += interest
    const payment = Math.min(monthlyRepayment, balLump)
    balLump -= payment
    totalPaidLump += payment
    monthsLump++
  }
  const writtenOffLump = balLump > 0 ? balLump : 0

  const saving = totalPaidNormal - totalPaidLump + writtenOffNormal - writtenOffLump
  const worthIt = saving > 0 && writtenOffNormal === 0 // only worth if you'd actually repay in full

  return { monthlyRepayment, monthlyInterest, totalPaidNormal, monthsNormal, writtenOffNormal, totalPaidLump, monthsLump, writtenOffLump, saving, worthIt }
}

export default function StudentLoanEarlyRepayCalculator() {
  const [plan, setPlan] = useState('plan2')
  const [balance, setBalance] = useState('45000')
  const [salary, setSalary] = useState('35000')
  const [lump, setLump] = useState('10000')

  const b = parseFloat(balance.replace(/,/g,'')) || 0
  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const l = parseFloat(lump.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(plan, b, s, l), [plan, b, s, l])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Loan Plan</label><select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"><option value="plan1">Plan 1 (pre-2012)</option><option value="plan2">Plan 2 (post-2012)</option><option value="plan4">Plan 4 (Scotland)</option><option value="plan5">Plan 5 (post-2023)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Current Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Lump Sum to Repay</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={lump} onChange={(e) => setLump(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>

      {b > 0 && s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.worthIt ? 'bg-green-100 dark:bg-green-950' : 'bg-orange-100 dark:bg-orange-950'}`}>
            {result.worthIt ? (
              <><p className="text-lg font-bold text-green-700 dark:text-green-400">Early repayment saves you {formatCurrency(result.saving)}</p></>
            ) : (
              <><p className="text-lg font-bold text-orange-700 dark:text-orange-400">{result.writtenOffNormal > 0 ? 'Probably NOT worth repaying early' : `Saves ${formatCurrency(result.saving)}`}</p>{result.writtenOffNormal > 0 && <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.writtenOffNormal)} would be written off — don't overpay</p>}</>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-border p-4">
              <p className="font-semibold mb-2">Without Lump Sum</p>
              <p>Monthly repayment: {formatCurrency(result.monthlyRepayment)}</p>
              <p>Total paid: {formatCurrency(result.totalPaidNormal)}</p>
              <p>Time: {Math.floor(result.monthsNormal / 12)}y {result.monthsNormal % 12}m</p>
              {result.writtenOffNormal > 0 && <p className="text-green-600">Written off: {formatCurrency(result.writtenOffNormal)}</p>}
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="font-semibold mb-2">With {formatCurrency(l)} Lump Sum</p>
              <p>Monthly repayment: {formatCurrency(result.monthlyRepayment)}</p>
              <p>Total paid: {formatCurrency(result.totalPaidLump)}</p>
              <p>Time: {Math.floor(result.monthsLump / 12)}y {result.monthsLump % 12}m</p>
              {result.writtenOffLump > 0 && <p className="text-green-600">Written off: {formatCurrency(result.writtenOffLump)}</p>}
            </div>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>If your loan would be written off before you repay it (most Plan 2 borrowers on average salaries), early repayment is usually NOT worth it — you'd be paying off money that would have been forgiven.</p>
          </div>
        </div>
      )}
    </div>
  )
}
