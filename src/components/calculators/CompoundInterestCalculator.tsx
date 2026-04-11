import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(principal: number, monthlyDeposit: number, annualRate: number, years: number) {
  const monthlyRate = annualRate / 100 / 12
  const months = years * 12
  let balance = principal
  let totalDeposits = principal

  const data: { year: number; balance: number; deposits: number; interest: number }[] = []

  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + monthlyRate) + monthlyDeposit
    totalDeposits += monthlyDeposit

    if (m % 12 === 0) {
      data.push({
        year: m / 12,
        balance,
        deposits: totalDeposits,
        interest: balance - totalDeposits,
      })
    }
  }

  return {
    finalBalance: balance,
    totalDeposits,
    totalInterest: balance - totalDeposits,
    yearlyData: data,
  }
}

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('10000')
  const [monthly, setMonthly] = useState('200')
  const [rate, setRate] = useState('5')
  const [years, setYears] = useState('10')

  const p = parseFloat(principal.replace(/,/g, '')) || 0
  const m = parseFloat(monthly.replace(/,/g, '')) || 0
  const r = parseFloat(rate) || 0
  const y = parseInt(years) || 0

  const result = useMemo(() => calculate(p, m, r, y), [p, m, r, y])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Initial Deposit</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Monthly Contribution</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Annual Interest Rate (%)</label>
          <input type="number" min="0" max="50" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Time Period (years)</label>
          <input type="number" min="1" max="50" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      {y > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Final Balance after {y} years</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.finalBalance)}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">Total Deposits</p>
              <p className="text-lg font-bold">{formatCurrency(result.totalDeposits)}</p>
            </div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center">
              <p className="text-xs text-muted-foreground">Interest Earned</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalInterest)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">Growth</p>
              <p className="text-lg font-bold">{result.totalDeposits > 0 ? ((result.totalInterest / result.totalDeposits) * 100).toFixed(1) : 0}%</p>
            </div>
          </div>

          {/* Year by year table */}
          {result.yearlyData.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">Year</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Deposits</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Interest</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyData.map((row) => (
                    <tr key={row.year} className="border-b border-border/50">
                      <td className="py-2">{row.year}</td>
                      <td className="text-right py-2 tabular-nums">{formatCurrency(row.deposits)}</td>
                      <td className="text-right py-2 tabular-nums text-green-600">{formatCurrency(row.interest)}</td>
                      <td className="text-right py-2 tabular-nums font-medium">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
