import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(balance: number, apr: number, monthlyPayment: number) {
  if (balance <= 0 || apr <= 0 || monthlyPayment <= 0) return null
  const monthlyRate = apr / 100 / 12
  const minPayment = balance * monthlyRate

  if (monthlyPayment <= minPayment) return { error: 'Payment must exceed monthly interest of ' + formatCurrency(minPayment) }

  let remaining = balance
  let months = 0
  let totalInterest = 0
  const maxMonths = 600

  while (remaining > 0 && months < maxMonths) {
    const interest = remaining * monthlyRate
    totalInterest += interest
    remaining = remaining + interest - monthlyPayment
    months++
    if (remaining < 0) remaining = 0
  }

  return { months, years: Math.floor(months / 12), remainingMonths: months % 12, totalInterest, totalPaid: balance + totalInterest }
}

export default function CreditCardRepaymentCalculator() {
  const [balance, setBalance] = useState('3000')
  const [apr, setApr] = useState('22.9')
  const [payment, setPayment] = useState('100')

  const b = parseFloat(balance.replace(/,/g, '')) || 0
  const a = parseFloat(apr) || 0
  const p = parseFloat(payment.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(b, a, p), [b, a, p])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Outstanding Balance</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">APR (%)</label>
          <input type="number" min="0" max="60" step="0.1" value={apr} onChange={(e) => setApr(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Monthly Payment</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={payment} onChange={(e) => setPayment(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
      </div>

      {result && !('error' in result) && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Debt-Free In</p>
            <p className="text-3xl font-bold text-primary mt-1">{result.years > 0 ? `${result.years} year${result.years !== 1 ? 's' : ''} ` : ''}{result.remainingMonths} month{result.remainingMonths !== 1 ? 's' : ''}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Balance</p><p className="text-lg font-bold">{formatCurrency(b)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total Interest</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.totalInterest)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Paid</p><p className="text-lg font-bold">{formatCurrency(result.totalPaid)}</p></div>
          </div>
        </div>
      )}
      {result && 'error' in result && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{result.error}</div>
      )}
    </div>
  )
}
