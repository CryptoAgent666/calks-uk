import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(monthlyDeposit: number, annualRate: number, termMonths: number) {
  const monthlyRate = annualRate / 100 / 12
  let balance = 0
  let totalDeposited = 0
  const schedule: { month: number; deposited: number; interest: number; balance: number }[] = []

  for (let m = 1; m <= termMonths; m++) {
    balance += monthlyDeposit
    totalDeposited += monthlyDeposit
    const interest = balance * monthlyRate
    balance += interest

    if (m % (termMonths <= 12 ? 1 : 3) === 0 || m === termMonths) {
      schedule.push({ month: m, deposited: totalDeposited, interest: balance - totalDeposited, balance })
    }
  }

  const totalInterest = balance - totalDeposited
  const effectiveRate = totalDeposited > 0 ? (totalInterest / totalDeposited) * 100 : 0

  return { balance, totalDeposited, totalInterest, effectiveRate, schedule }
}

export default function RegularSavingsCalculator() {
  const [monthly, setMonthly] = useState('200')
  const [rate, setRate] = useState('5')
  const [term, setTerm] = useState('12')

  const m = parseFloat(monthly.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 0
  const t = parseInt(term) || 12
  const result = useMemo(() => calculate(m, r, t), [m, r, t])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Monthly Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Interest Rate (AER %)</label><input type="number" min="0" max="10" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Term (months)</label><select value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"><option value="6">6 months</option><option value="12">12 months</option><option value="24">24 months</option><option value="36">36 months</option><option value="60">60 months</option></select></div>
      </div>

      {m > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Final Balance after {t} months</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.balance)}</p>
            <p className="text-sm text-muted-foreground mt-1">Interest earned: {formatCurrency(result.totalInterest)}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Total Deposited</p><p className="text-lg font-bold">{formatCurrency(result.totalDeposited)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Interest Earned</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalInterest)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Effective Return</p><p className="text-lg font-bold">{result.effectiveRate.toFixed(2)}%</p></div>
          </div>

          {result.schedule.length > 0 && (
            <div className="overflow-x-auto max-h-48 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background"><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Month</th><th className="text-right py-2 font-medium text-muted-foreground">Deposited</th><th className="text-right py-2 font-medium text-muted-foreground">Interest</th><th className="text-right py-2 font-medium text-muted-foreground">Balance</th></tr></thead>
                <tbody>{result.schedule.map(r => (
                  <tr key={r.month} className="border-b border-border/50"><td className="py-1.5">{r.month}</td><td className="text-right tabular-nums">{formatCurrency(r.deposited)}</td><td className="text-right tabular-nums text-green-600">{formatCurrency(r.interest)}</td><td className="text-right tabular-nums font-medium">{formatCurrency(r.balance)}</td></tr>
                ))}</tbody>
              </table>
            </div>
          )}

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Note: regular saver accounts typically have a 12-month term with a fixed monthly deposit limit (often £25-£500). The effective return on a 12-month regular saver at {r}% AER is roughly half the headline rate because you only earn interest on the average balance.</p>
          </div>
        </div>
      )}
    </div>
  )
}
