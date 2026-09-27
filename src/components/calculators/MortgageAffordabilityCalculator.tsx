import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const AVG_RATE = 5.73 // Moneyfacts average 2-year fixed rate, 15 Sep 2026
const TERM_YEARS = 25
const MIN_DEPOSIT_PCT = 5 // most lenders stop at 95% loan-to-value

// Loan that a monthly payment of £1 services at `rate`% over `years` (repayment basis)
function annuityFactor(rate: number, years: number) {
  const r = rate / 100 / 12
  const n = years * 12
  return r > 0 ? (1 - Math.pow(1 + r, -n)) / r : n
}

function calculate(income1: number, income2: number, deposit: number, multiplier: number, commitments: number) {
  const totalIncome = income1 + income2
  const factor = annuityFactor(AVG_RATE, TERM_YEARS)
  const incomeBorrow = totalIncome * multiplier
  // Each £1 a month already committed is £1 a month less for the mortgage payment
  const commitmentCut = Math.min(Math.max(commitments, 0) * factor, incomeBorrow)
  const incomeLimit = incomeBorrow - commitmentCut
  const depositLimit = Math.max(deposit, 0) * (100 - MIN_DEPOSIT_PCT) / MIN_DEPOSIT_PCT
  const maxBorrow = Math.min(incomeLimit, depositLimit)
  const limitedBy: 'income' | 'deposit' = depositLimit < incomeLimit ? 'deposit' : 'income'
  const maxPropertyPrice = maxBorrow + Math.max(deposit, 0)
  const ltv = maxPropertyPrice > 0 ? ((maxBorrow / maxPropertyPrice) * 100) : 0
  const monthlyPayment = maxBorrow / factor

  return { totalIncome, incomeBorrow, commitmentCut, incomeLimit, depositLimit, maxBorrow, limitedBy, maxPropertyPrice, deposit, ltv, monthlyPayment }
}

export default function MortgageAffordabilityCalculator() {
  const [income1, setIncome1] = useState('')
  const [income2, setIncome2] = useState('')
  const [deposit, setDeposit] = useState('')
  const [multiplier, setMultiplier] = useState('4.5')
  const [commitments, setCommitments] = useState('0')

  const i1 = parseFloat(income1.replace(/,/g, '')) || 0
  const i2 = parseFloat(income2.replace(/,/g, '')) || 0
  const d = parseFloat(deposit.replace(/,/g, '')) || 0
  const m = parseFloat(multiplier) || 4.5
  const c = parseFloat(commitments.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(i1, i2, d, m, c), [i1, i2, d, m, c])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ma-income1" className="block text-sm font-medium mb-2">Your Annual Income</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input id="ma-income1" type="text" inputMode="numeric" value={income1} onChange={(e) => setIncome1(e.target.value)} placeholder="45,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Annual Income" />
          </div>
        </div>
        <div>
          <label htmlFor="ma-income2" className="block text-sm font-medium mb-2">Partner's Annual Income (optional)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input id="ma-income2" type="text" inputMode="numeric" value={income2} onChange={(e) => setIncome2(e.target.value)} placeholder="0" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Partner's Annual Income (optional)" />
          </div>
        </div>
        <div>
          <label htmlFor="ma-deposit" className="block text-sm font-medium mb-2">Deposit</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input id="ma-deposit" type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="30,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Deposit" />
          </div>
        </div>
        <div>
          <label htmlFor="ma-multi" className="block text-sm font-medium mb-2">Income Multiplier</label>
          <select id="ma-multi" value={multiplier} onChange={(e) => setMultiplier(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Income Multiplier">
            <option value="3.5">3.5x (conservative)</option>
            <option value="4">4x (typical)</option>
            <option value="4.5">4.5x (standard max)</option>
            <option value="5">5x (some lenders)</option>
            <option value="5.5">5.5x (high earners)</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ma-commit" className="block text-sm font-medium mb-2">Monthly Credit Commitments (loans, car finance, cards)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input id="ma-commit" type="text" inputMode="numeric" value={commitments} onChange={(e) => setCommitments(e.target.value)} placeholder="0" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Credit Commitments" />
          </div>
        </div>
      </div>

      {i1 > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Maximum Property Price</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.maxPropertyPrice)}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">You Could Borrow</p><p className="text-lg font-bold">{formatCurrency(result.maxBorrow)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Your Deposit</p><p className="text-lg font-bold">{formatCurrency(result.deposit)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">LTV Ratio</p><p className="text-lg font-bold">{result.ltv.toFixed(0)}%</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly Payment</p><p className="text-lg font-bold">{formatCurrency(result.monthlyPayment)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            {result.limitedBy === 'deposit' ? (
              <p><span className="font-medium text-foreground">Limited by your deposit.</span> Most lenders stop at {100 - MIN_DEPOSIT_PCT}% loan-to-value, so a {formatCurrency(d)} deposit supports a loan of up to {formatCurrency(result.depositLimit)}. Your income alone would allow {formatCurrency(result.incomeLimit)}.</p>
            ) : (
              <p><span className="font-medium text-foreground">Limited by your income.</span> {m}x combined income of {formatCurrency(result.totalIncome)} is {formatCurrency(result.incomeBorrow)}{result.commitmentCut > 0 ? `, less ${formatCurrency(result.commitmentCut)} for ${formatCurrency(c)} a month of commitments` : ''}, plus your {formatCurrency(d)} deposit.</p>
            )}
            <p className="mt-1">Monthly payment on a {TERM_YEARS}-year repayment mortgage at {AVG_RATE}%, the Moneyfacts average two-year fixed rate (15 Sep 2026). Commitments are deducted as the loan the same monthly sum would repay at that rate.</p>
            <p className="mt-1">Most UK lenders offer 4-4.5x income, and some high-street lenders go to 5-5.5x for higher earners. Each lender also runs its own affordability check, so real offers vary.</p>
          </div>
        </div>
      )}
    </div>
  )
}
