import { useState, useMemo } from 'react'
import { formatPercent } from '@/utils'

function calculate(loanAmount: number, totalRepaid: number, termMonths: number) {
  if (loanAmount <= 0 || totalRepaid <= 0 || termMonths <= 0) return null
  const monthlyPayment = totalRepaid / termMonths

  // Newton's method to find monthly rate
  let rate = 0.01
  for (let i = 0; i < 100; i++) {
    const f = loanAmount * rate * Math.pow(1 + rate, termMonths) / (Math.pow(1 + rate, termMonths) - 1) - monthlyPayment
    const df = loanAmount * (Math.pow(1 + rate, termMonths) * (1 + rate * termMonths / (1 + rate)) * (Math.pow(1 + rate, termMonths) - 1) - rate * Math.pow(1 + rate, termMonths) * termMonths * Math.pow(1 + rate, termMonths - 1)) / Math.pow(Math.pow(1 + rate, termMonths) - 1, 2)
    if (Math.abs(df) < 1e-12) break
    rate -= f / df
    if (rate < 0) rate = 0.0001
  }

  const apr = rate * 12 * 100
  const totalInterest = totalRepaid - loanAmount

  return { apr, monthlyPayment, totalInterest, monthlyRate: rate * 100 }
}

export default function APRCalculator() {
  const [amount, setAmount] = useState('5000')
  const [total, setTotal] = useState('5800')
  const [months, setMonths] = useState('24')

  const a = parseFloat(amount.replace(/,/g, '')) || 0
  const t = parseFloat(total.replace(/,/g, '')) || 0
  const m = parseInt(months) || 0
  const result = useMemo(() => calculate(a, t, m), [a, t, m])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Amount Borrowed</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Total Amount Repaid</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={total} onChange={(e) => setTotal(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Term (months)</label><input type="number" min="1" max="360" value={months} onChange={(e) => setMonths(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Annual Percentage Rate (APR)</p>
            <p className="text-4xl font-bold text-primary mt-1">{formatPercent(result.apr)}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly Payment</p><p className="text-lg font-bold">{`£${result.monthlyPayment.toFixed(2)}`}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total Interest</p><p className="text-lg font-bold text-destructive">{`£${result.totalInterest.toFixed(2)}`}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly Rate</p><p className="text-lg font-bold">{formatPercent(result.monthlyRate)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
