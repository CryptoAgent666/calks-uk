import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(amount: number, rate: number, termMonths: number) {
  if (amount <= 0 || rate <= 0 || termMonths <= 0) return null
  const monthlyRate = rate / 100 / 12
  const monthly = amount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
  const totalRepaid = monthly * termMonths
  const totalInterest = totalRepaid - amount

  return { monthly, totalRepaid, totalInterest, amount, rate, termMonths }
}

export default function PersonalLoanCalculator() {
  const [amount, setAmount] = useState('10000')
  const [rate, setRate] = useState('6.9')
  const [term, setTerm] = useState('36')

  const a = parseFloat(amount.replace(/,/g, '')) || 0
  const r = parseFloat(rate) || 0
  const t = parseInt(term) || 0
  const result = useMemo(() => calculate(a, r, t), [a, r, t])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Loan Amount</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">APR (%)</label>
          <input type="number" min="0" max="50" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Term (months)</label>
          <input type="number" min="1" max="120" value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Monthly Repayment</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.monthly)}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Borrowed</p><p className="text-lg font-bold">{formatCurrency(result.amount)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total Interest</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.totalInterest)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Repaid</p><p className="text-lg font-bold">{formatCurrency(result.totalRepaid)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
