import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const MIN_PCT = 1 // minimum payment modelled as interest plus 1% of the balance...
const MIN_FLOOR = 25 // ...or £25 if that is more (or the whole balance if less)
const MAX_MONTHS = 600

// UK APR is an effective annual rate: monthly rate = (1 + APR)^(1/12) - 1
function monthlyRateFromApr(apr: number) {
  return Math.pow(1 + apr / 100, 1 / 12) - 1
}

function minimumPayment(balance: number, monthlyRate: number) {
  const interest = balance * monthlyRate
  return Math.min(Math.max(interest + balance * MIN_PCT / 100, MIN_FLOOR), balance + interest)
}

// payment: a fixed monthly amount, or null to pay only the minimum each month
function simulate(balance: number, monthlyRate: number, payment: number | null) {
  let remaining = balance
  let months = 0
  let totalInterest = 0
  let totalPaid = 0
  while (remaining > 0.005 && months < MAX_MONTHS) {
    const pay = payment === null ? minimumPayment(remaining, monthlyRate) : payment
    const interest = remaining * monthlyRate
    const paid = Math.min(pay, remaining + interest)
    totalInterest += interest
    totalPaid += paid
    remaining = remaining + interest - paid
    months++
  }
  if (remaining < 0.005) remaining = 0
  return { months, years: Math.floor(months / 12), remainingMonths: months % 12, totalInterest, totalPaid, remaining, cleared: remaining === 0 }
}

function calculate(balance: number, apr: number, monthlyPayment: number) {
  if (balance <= 0 || apr <= 0 || monthlyPayment <= 0) return null
  const monthlyRate = monthlyRateFromApr(apr)
  const firstInterest = balance * monthlyRate

  if (monthlyPayment <= firstInterest) return { error: 'Payment must exceed the first month\'s interest of ' + formatCurrency(firstInterest) + ', otherwise the balance never falls.' }

  const fixed = simulate(balance, monthlyRate, monthlyPayment)
  const minimum = simulate(balance, monthlyRate, null)
  const firstMinimum = minimumPayment(balance, monthlyRate)

  return { ...fixed, monthlyRate, firstInterest, firstMinimum, minimum, interestSaved: minimum.totalInterest - fixed.totalInterest }
}

const fmtTerm = (years: number, months: number) => `${years > 0 ? `${years} year${years !== 1 ? 's' : ''} ` : ''}${months} month${months !== 1 ? 's' : ''}`

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
            <input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Outstanding Balance" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">APR (%)</label>
          <input type="number" min="0" max="60" step="0.1" value={apr} onChange={(e) => setApr(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="APR (%)" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Monthly Payment</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={payment} onChange={(e) => setPayment(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Payment" /></div>
        </div>
      </div>

      {result && !('error' in result) && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            {result.cleared ? (
              <><p className="text-sm text-muted-foreground">Debt-Free In</p>
              <p className="text-3xl font-bold text-primary mt-1">{fmtTerm(result.years, result.remainingMonths)}</p></>
            ) : (
              <><p className="text-sm text-muted-foreground">Not repaid within {MAX_MONTHS / 12} years at this payment</p>
              <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.remaining)} left</p></>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Balance</p><p className="text-lg font-bold">{formatCurrency(b)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total Interest</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.totalInterest)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Paid</p><p className="text-lg font-bold">{formatCurrency(result.totalPaid)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p>Monthly interest rate: {(result.monthlyRate * 100).toFixed(3)}%, so month 1 interest is {formatCurrency(result.firstInterest)}.</p>
            <p>Paying only the minimum (interest plus {MIN_PCT}% of the balance, at least £{MIN_FLOOR}, starting at {formatCurrency(result.firstMinimum)}): {result.minimum.cleared ? fmtTerm(result.minimum.years, result.minimum.remainingMonths) : `not repaid within ${MAX_MONTHS / 12} years`} and <span className="font-medium text-foreground">{formatCurrency(result.minimum.totalInterest)}</span> of interest.</p>
            {p < result.firstMinimum ? (
              <p className="text-destructive">Your payment is below the likely month-1 minimum of {formatCurrency(result.firstMinimum)}.</p>
            ) : result.cleared && result.interestSaved > 0 ? (
              <p>Paying {formatCurrency(p)} a month instead saves <span className="font-medium text-foreground">{formatCurrency(result.interestSaved)}</span> of interest.</p>
            ) : null}
          </div>
        </div>
      )}
      {result && 'error' in result && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{result.error}</div>
      )}
    </div>
  )
}
