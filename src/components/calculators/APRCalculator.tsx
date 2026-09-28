import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Present value of n equal monthly payments at monthly rate r
function presentValue(payment: number, rate: number, termMonths: number) {
  if (rate === 0) return payment * termMonths
  return payment * (1 - Math.pow(1 + rate, -termMonths)) / rate
}

// A UK APR is an annual effective rate (FCA CONC App 1.2): the monthly rate r that
// equates the amount actually received with the repayments, compounded as (1 + r)^12 - 1.
// Upfront fees reduce the amount actually received, so they raise the APR.
function calculate(loanAmount: number, totalRepaid: number, termMonths: number, upfrontFee = 0) {
  if (loanAmount <= 0 || totalRepaid <= 0 || termMonths <= 0) return null
  if (upfrontFee < 0 || upfrontFee >= loanAmount) return { error: 'fee' as const }
  if (totalRepaid < loanAmount) return { error: 'repaid' as const }

  const monthlyPayment = totalRepaid / termMonths
  const received = loanAmount - upfrontFee

  // Solve presentValue(r) = received by bisection (presentValue falls as r rises)
  let rate = 0
  if (totalRepaid > received) {
    let lo = 0
    let hi = 1
    while (presentValue(monthlyPayment, hi, termMonths) > received && hi < 1e6) hi *= 2
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2
      if (presentValue(monthlyPayment, mid, termMonths) > received) lo = mid
      else hi = mid
    }
    rate = (lo + hi) / 2
  }

  const apr = (Math.pow(1 + rate, 12) - 1) * 100
  const totalInterest = totalRepaid - loanAmount
  const totalCost = totalInterest + upfrontFee

  return { error: null, apr, monthlyPayment, totalInterest, totalCost, monthlyRate: rate * 100, nominalAnnual: rate * 12 * 100 }
}

function formatRate(value: number, decimals = 2) {
  return `${new Intl.NumberFormat('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value)}%`
}

export default function APRCalculator() {
  const [amount, setAmount] = useState('5000')
  const [total, setTotal] = useState('5750')
  const [months, setMonths] = useState('36')
  const [fee, setFee] = useState('0')

  const a = parseFloat(amount.replace(/,/g, '')) || 0
  const t = parseFloat(total.replace(/,/g, '')) || 0
  const m = parseInt(months) || 0
  const f = parseFloat(fee.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(a, t, m, f), [a, t, m, f])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Amount Borrowed</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Amount Borrowed" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Total of All Repayments</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={total} onChange={(e) => setTotal(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Total of All Repayments" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Term (months)</label><input type="number" min="1" max="360" value={months} onChange={(e) => setMonths(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Term (months)" /></div>
        <div><label className="block text-sm font-medium mb-2">Upfront Fees (optional)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={fee} onChange={(e) => setFee(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Upfront Fees (optional)" /></div></div>
      </div>
      <p className="text-xs text-muted-foreground">Repayments are assumed to be equal monthly instalments. An upfront fee is one you pay at the start or that is deducted from the money you receive, so it reduces the amount you actually get.</p>

      {result && result.error === 'repaid' && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
          The total repaid is less than the amount borrowed. Enter the sum of all your repayments, which should be at least the amount borrowed.
        </div>
      )}
      {result && result.error === 'fee' && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
          Upfront fees must be less than the amount borrowed.
        </div>
      )}
      {result && result.error === null && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Annual Percentage Rate (APR)</p>
            <p className="text-4xl font-bold text-primary mt-1">{formatRate(result.apr)}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly Payment</p><p className="text-lg font-bold">{formatCurrency(result.monthlyPayment)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Interest and Fees</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.totalCost)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly Rate</p><p className="text-lg font-bold">{formatRate(result.monthlyRate, 3)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>The APR compounds the monthly rate over a year: (1 + {formatRate(result.monthlyRate, 3)})¹² − 1 = {formatRate(result.apr)}. Twelve times the monthly rate, the nominal annual rate, would be {formatRate(result.nominalAnnual)}, which understates the true cost.</p>
          </div>
        </div>
      )}
    </div>
  )
}
