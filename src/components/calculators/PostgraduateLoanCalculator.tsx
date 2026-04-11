import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const PG_THRESHOLD = 21_000
const PG_RATE = 0.06
const PG_INTEREST = 7.3

function calculate(balance: number, salary: number) {
  const annualRepayment = salary > PG_THRESHOLD ? (salary - PG_THRESHOLD) * PG_RATE : 0
  const monthlyRepayment = annualRepayment / 12
  const annualInterest = balance * (PG_INTEREST / 100)
  const monthlyInterest = annualInterest / 12
  const netReduction = annualRepayment - annualInterest
  const growingBalance = netReduction < 0

  // Time to repay (simplified)
  let months = 0
  let bal = balance
  while (bal > 0 && months < 360) {
    bal += bal * (PG_INTEREST / 100 / 12)
    bal -= monthlyRepayment
    months++
  }
  const yearsToRepay = bal <= 0 ? Math.ceil(months / 12) : 0
  const writtenOff = bal > 0

  return { annualRepayment, monthlyRepayment, annualInterest, netReduction, growingBalance, yearsToRepay, writtenOff }
}

export default function PostgraduateLoanCalculator() {
  const [balance, setBalance] = useState('12000')
  const [salary, setSalary] = useState('30000')

  const b = parseFloat(balance.replace(/,/g,'')) || 0
  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(b, s), [b, s])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Postgraduate Loan Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>

      {b > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Monthly Repayment</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.monthlyRepayment)}</p>
            <p className="text-sm text-muted-foreground mt-1">6% of income above £{PG_THRESHOLD.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Annual Repayment</p><p className="text-lg font-bold">{formatCurrency(result.annualRepayment)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-3 text-center"><p className="text-xs text-muted-foreground">Annual Interest</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.annualInterest)}</p></div>
            <div className={`rounded-xl p-3 text-center ${result.growingBalance ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}><p className="text-xs text-muted-foreground">Net Balance Change</p><p className={`text-lg font-bold ${result.growingBalance ? 'text-destructive' : 'text-green-700 dark:text-green-400'}`}>{result.netReduction > 0 ? '-' : '+'}{formatCurrency(Math.abs(result.netReduction))}/yr</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">{result.writtenOff ? 'Written off in' : 'Repaid in'}</p><p className="text-lg font-bold">{result.writtenOff ? '30 years' : `${result.yearsToRepay} years`}</p></div>
          </div>
          {result.growingBalance && <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-sm text-orange-800 dark:text-orange-300 text-center">Your balance is growing — interest ({formatCurrency(result.annualInterest)}/yr) exceeds repayments ({formatCurrency(result.annualRepayment)}/yr)</div>}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Postgraduate loan: 6% above £{PG_THRESHOLD.toLocaleString()}, interest at RPI + 3% ({PG_INTEREST}%). Written off 30 years after the April you were first due to repay. Repaid alongside Plan 1/2/4/5 (not instead of).</p>
          </div>
        </div>
      )}
    </div>
  )
}
