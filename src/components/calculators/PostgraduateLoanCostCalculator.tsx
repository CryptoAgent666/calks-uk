import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Education: Postgraduate Loan Total Cost over lifetime
function calculate(balance: number, startSalary: number, salaryGrowth: number) {
  const threshold = 21_000; const rate = 0.06; const interest = 7.3; const writeOff = 30
  let bal = balance; let salary = startSalary; let totalPaid = 0; let months = 0

  while (bal > 0 && months < writeOff * 12) {
    bal += bal * (interest / 100 / 12)
    const repay = Math.min(Math.max(0, salary - threshold) * rate / 12, bal)
    bal -= repay; totalPaid += repay; months++
    if (months % 12 === 0) salary *= (1 + salaryGrowth / 100)
  }

  return { totalPaid, writtenOff: bal > 0 ? bal : 0, yearsToRepay: bal <= 0 ? Math.ceil(months / 12) : writeOff, paidInFull: bal <= 0 }
}

export default function PostgraduateLoanCostCalculator() {
  const [balance, setBalance] = useState('12000')
  const [salary, setSalary] = useState('28000')
  const [growth, setGrowth] = useState('3')

  const b = parseFloat(balance.replace(/,/g,'')) || 0; const s = parseFloat(salary.replace(/,/g,'')) || 0; const g = parseFloat(growth) || 0
  const result = useMemo(() => calculate(b, s, g), [b, s, g])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">PG Loan Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="PG Loan Balance" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Starting Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Starting Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Salary Growth (%/yr)</label><input type="number" min="0" max="10" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Salary Growth (%/yr)" /></div>
      </div>
      {b > 0 && s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total You'll Actually Repay</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalPaid)}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.paidInFull ? `Repaid in ${result.yearsToRepay} years` : `Written off after 30 years`}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Original</p><p className="text-lg font-bold">{formatCurrency(b)}</p></div>
            {result.writtenOff > 0 && <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Written Off</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.writtenOff)}</p></div>}
          </div>
        </div>
      )}
    </div>
  )
}
