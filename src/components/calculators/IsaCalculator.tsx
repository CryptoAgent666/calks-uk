import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const ISA_ALLOWANCE = 20_000

function calculate(monthlyDeposit: number, annualRate: number, years: number, currentBalance: number) {
  const maxMonthly = ISA_ALLOWANCE / 12
  const effectiveMonthly = Math.min(monthlyDeposit, maxMonthly)
  const monthlyRate = annualRate / 100 / 12

  let balance = currentBalance
  let totalDeposits = currentBalance

  for (let m = 1; m <= years * 12; m++) {
    balance = balance * (1 + monthlyRate) + effectiveMonthly
    totalDeposits += effectiveMonthly
  }

  const interestEarned = balance - totalDeposits
  const taxSaved = interestEarned * 0.20 // Basic rate tax saved

  return { balance, totalDeposits, interestEarned, taxSaved, annualDeposit: effectiveMonthly * 12 }
}

export default function IsaCalculator() {
  const [monthly, setMonthly] = useState('500')
  const [rate, setRate] = useState('4.5')
  const [years, setYears] = useState('10')
  const [current, setCurrent] = useState('0')

  const m = parseFloat(monthly.replace(/,/g, '')) || 0
  const r = parseFloat(rate) || 0
  const y = parseInt(years) || 0
  const c = parseFloat(current.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(m, r, y, c), [m, r, y, c])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Monthly Contribution</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Contribution" /></div>
          <p className="text-xs text-muted-foreground mt-1">Max £{(ISA_ALLOWANCE / 12).toFixed(0)}/month (£{ISA_ALLOWANCE.toLocaleString()}/year)</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Annual Interest Rate (%)</label>
          <input type="number" min="0" max="20" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Interest Rate (%)" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Time Period (years)</label>
          <input type="number" min="1" max="50" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Time Period (years)" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Current ISA Balance</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current ISA Balance" /></div>
        </div>
      </div>

      {y > 0 && m > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">ISA Balance after {y} years</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.balance)}</p>
            <p className="text-sm text-muted-foreground mt-1">All growth is tax-free</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Deposits</p><p className="text-lg font-bold">{formatCurrency(result.totalDeposits)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Tax-Free Interest</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.interestEarned)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Tax Saved (vs taxed account)</p><p className="text-lg font-bold">{formatCurrency(result.taxSaved)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
