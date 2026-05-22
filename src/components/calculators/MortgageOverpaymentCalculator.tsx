import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(balance: number, rate: number, termYears: number, monthlyOverpayment: number) {
  const monthlyRate = rate / 100 / 12
  const totalPayments = termYears * 12

  if (monthlyRate === 0 || balance <= 0) return null

  // Without overpayment
  const normalMonthly = balance * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1)
  const normalTotalPaid = normalMonthly * totalPayments
  const normalInterest = normalTotalPaid - balance

  // With overpayment
  let bal = balance
  let monthsPaid = 0
  let totalInterestWithOP = 0
  const totalMonthlyWithOP = normalMonthly + monthlyOverpayment

  while (bal > 0 && monthsPaid < totalPayments) {
    const interest = bal * monthlyRate
    totalInterestWithOP += interest
    const principalPayment = totalMonthlyWithOP - interest
    bal = Math.max(0, bal - principalPayment)
    monthsPaid++
  }

  const totalPaidWithOP = normalMonthly * monthsPaid + monthlyOverpayment * monthsPaid
  const interestSaved = normalInterest - totalInterestWithOP
  const timeSaved = totalPayments - monthsPaid

  return {
    normalMonthly, normalTotalPaid, normalInterest,
    monthsPaid, totalPaidWithOP, totalInterestWithOP,
    interestSaved, timeSaved,
    yearsSaved: Math.floor(timeSaved / 12),
    monthsSaved: timeSaved % 12,
  }
}

export default function MortgageOverpaymentCalculator() {
  const [balance, setBalance] = useState('200000')
  const [rate, setRate] = useState('4.5')
  const [term, setTerm] = useState('25')
  const [overpayment, setOverpayment] = useState('200')

  const b = parseFloat(balance.replace(/,/g, '')) || 0
  const r = parseFloat(rate) || 0
  const t = parseInt(term) || 0
  const o = parseFloat(overpayment.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(b, r, t, o), [b, r, t, o])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Outstanding Balance</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Outstanding Balance" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Interest Rate (%)</label>
          <input type="number" min="0" max="15" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Interest Rate (%)" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Remaining Term (years)</label>
          <input type="number" min="1" max="40" value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Remaining Term (years)" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Monthly Overpayment</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={overpayment} onChange={(e) => setOverpayment(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Overpayment" /></div>
        </div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center">
              <p className="text-xs text-muted-foreground">Interest Saved</p>
              <p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.interestSaved)}</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <p className="text-xs text-muted-foreground">Time Saved</p>
              <p className="text-xl font-bold text-primary">{result.yearsSaved}y {result.monthsSaved}m</p>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground"></th><th className="text-right py-2 font-medium text-muted-foreground">Without Overpay</th><th className="text-right py-2 font-medium text-muted-foreground">With Overpay</th></tr></thead>
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2.5">Monthly Payment</td><td className="text-right tabular-nums">{formatCurrency(result.normalMonthly)}</td><td className="text-right tabular-nums">{formatCurrency(result.normalMonthly + o)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5">Total Interest</td><td className="text-right tabular-nums">{formatCurrency(result.normalInterest)}</td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.totalInterestWithOP)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5">Mortgage Term</td><td className="text-right">{t} years</td><td className="text-right text-primary">{Math.floor(result.monthsPaid / 12)}y {result.monthsPaid % 12}m</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
