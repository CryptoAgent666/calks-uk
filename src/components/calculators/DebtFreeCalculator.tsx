import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(balance: number, apr: number, monthlyPayment: number) {
  if (balance <= 0 || monthlyPayment <= 0) return null
  const monthlyRate = apr / 100 / 12
  const minPayment = balance * monthlyRate

  if (monthlyPayment <= minPayment) return { error: true, minNeeded: minPayment }

  let remaining = balance
  let months = 0
  let totalInterest = 0

  while (remaining > 0.01 && months < 600) {
    const interest = remaining * monthlyRate
    totalInterest += interest
    remaining = remaining + interest - monthlyPayment
    months++
    if (remaining < 0) remaining = 0
  }

  const years = Math.floor(months / 12)
  const remMonths = months % 12

  return { error: false, months, years, remMonths, totalInterest, totalPaid: balance + totalInterest }
}

export default function DebtFreeCalculator() {
  const [balance, setBalance] = useState('')
  const [apr, setApr] = useState('18.9')
  const [payment, setPayment] = useState('')

  const b = parseFloat(balance.replace(/,/g,'')) || 0
  const a = parseFloat(apr) || 0
  const p = parseFloat(payment.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(b, a, p), [b, a, p])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Total Debt</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="5,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Total Debt" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Average APR (%)</label><input type="number" min="0" max="60" step="0.1" value={apr} onChange={(e) => setApr(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Average APR (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Monthly Payment</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={payment} onChange={(e) => setPayment(e.target.value)} placeholder="200" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Payment" /></div></div>
      </div>

      {result && !result.error && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Debt-Free In</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{result.years > 0 ? `${result.years} year${result.years !== 1 ? 's' : ''} ` : ''}{result.remMonths} month{result.remMonths !== 1 ? 's' : ''}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Debt</p><p className="text-lg font-bold">{formatCurrency(b)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total Interest</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.totalInterest)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Paid</p><p className="text-lg font-bold">{formatCurrency(result.totalPaid)}</p></div>
          </div>
        </div>
      )}
      {result && result.error && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
          Payment must exceed monthly interest of {formatCurrency(result.minNeeded)}. Increase your payment to make progress.
        </div>
      )}
    </div>
  )
}
