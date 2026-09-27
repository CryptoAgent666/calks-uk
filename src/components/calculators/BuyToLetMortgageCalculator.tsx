import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// PRA SS13/16 paras 2.12-2.14: unless the rate is fixed for 5+ years, test affordability at the
// higher of the pay rate + 2 percentage points and 5.5%. Minimum ICR 125% is the industry standard
// (para 2.7); lenders apply 145% to higher and additional-rate individuals because of the tax cost.
const MIN_STRESS_RATE = 5.5
const STRESS_BUFFER = 2
const BORROWERS: Record<string, { icr: number; label: string }> = {
  company: { icr: 125, label: 'Limited company' },
  basic: { icr: 125, label: 'Individual, basic-rate taxpayer' },
  higher: { icr: 145, label: 'Individual, higher or additional-rate taxpayer' },
}

function calculate(propertyPrice: number, deposit: number, interestRate: number, monthlyRent: number, term: number, fixFiveYears = false, borrower = 'higher') {
  const mortgage = Math.max(0, propertyPrice - deposit)
  const ltv = propertyPrice > 0 ? (mortgage / propertyPrice) * 100 : 0

  // Interest-only (most common for BTL)
  const monthlyInterestOnly = (mortgage * interestRate / 100) / 12
  // Repayment
  const monthlyRate = interestRate / 100 / 12
  const payments = term * 12
  const monthlyRepayment = monthlyRate > 0 ? mortgage * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1) : mortgage / payments

  // Interest cover ratio at the stressed rate, as lenders test it
  const stressRate = fixFiveYears ? interestRate : Math.max(interestRate + STRESS_BUFFER, MIN_STRESS_RATE)
  const requiredICR = (BORROWERS[borrower] ?? BORROWERS.higher).icr
  const stressedInterest = (mortgage * stressRate / 100) / 12
  const stressedICR = stressedInterest > 0 ? (monthlyRent / stressedInterest) * 100 : 0
  const meetsStressTest = stressedInterest > 0 && stressedICR >= requiredICR
  const rentNeeded = stressedInterest * requiredICR / 100
  const maxLoanFromRent = stressRate > 0 ? (monthlyRent * 12) / (requiredICR / 100) / (stressRate / 100) : 0

  // Cover at the rate you actually pay, for comparison
  const payRateCover = monthlyInterestOnly > 0 ? (monthlyRent / monthlyInterestOnly) * 100 : 0

  const monthlyProfit = monthlyRent - monthlyInterestOnly
  const annualProfit = monthlyProfit * 12

  return { mortgage, ltv, monthlyInterestOnly, monthlyRepayment, stressRate, requiredICR, stressedInterest, stressedICR, meetsStressTest, rentNeeded, maxLoanFromRent, payRateCover, monthlyProfit, annualProfit }
}

export default function BuyToLetMortgageCalculator() {
  const [price, setPrice] = useState('250000')
  const [deposit, setDeposit] = useState('62500')
  const [rate, setRate] = useState('5.5')
  const [rent, setRent] = useState('1100')
  const [term, setTerm] = useState('25')
  const [fix, setFix] = useState('short')
  const [borrower, setBorrower] = useState('higher')

  const p = parseFloat(price.replace(/,/g,'')) || 0
  const d = parseFloat(deposit.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 0
  const re = parseFloat(rent.replace(/,/g,'')) || 0
  const t = parseInt(term) || 25
  const result = useMemo(() => calculate(p, d, r, re, t, fix === 'five', borrower), [p, d, r, re, t, fix, borrower])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Property Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Property Price" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Deposit (25%+)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Deposit (25%+)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Interest Rate (%)</label><input type="number" min="1" max="10" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Interest Rate (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Monthly Rent</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Rent" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Term (years)</label><input type="number" min="5" max="35" value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Term (years)" /></div>
        <div><label className="block text-sm font-medium mb-2">Rate Fixed For</label><select value={fix} onChange={(e) => setFix(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Rate Fixed For"><option value="short">Under 5 years / tracker</option><option value="five">5 years or more</option></select></div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Borrower</label>
        <select value={borrower} onChange={(e) => setBorrower(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Borrower">
          {Object.entries(BORROWERS).map(([k, b]) => <option key={k} value={k}>{b.label} ({b.icr}% cover)</option>)}
        </select>
      </div>

      {p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Interest Only</p><p className="text-xl font-bold text-primary">{formatCurrency(result.monthlyInterestOnly)}/month</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Repayment</p><p className="text-xl font-bold">{formatCurrency(result.monthlyRepayment)}/month</p></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">LTV</p><p className="text-lg font-bold">{formatPercent(result.ltv)}</p></div>
            <div className={`rounded-xl p-3 text-center ${result.meetsStressTest ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Rental Cover at {result.stressRate.toFixed(2)}%</p><p className={`text-lg font-bold ${result.meetsStressTest ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatPercent(result.stressedICR)}</p><p className="text-xs text-muted-foreground">{result.meetsStressTest ? 'Meets' : 'Below'} {result.requiredICR}%</p></div>
            <div className={`rounded-xl p-3 text-center ${result.monthlyProfit > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Monthly Cashflow</p><p className={`text-lg font-bold ${result.monthlyProfit > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(result.monthlyProfit)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Mortgage</p><p className="text-lg font-bold">{formatCurrency(result.mortgage)}</p></div>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Stressed interest ({result.stressRate.toFixed(2)}%)</td><td className="text-right tabular-nums">{formatCurrency(result.stressedInterest)}/month</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Rent needed for {result.requiredICR}% cover</td><td className="text-right tabular-nums">{formatCurrency(result.rentNeeded)}/month</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Maximum loan the rent supports</td><td className="text-right tabular-nums font-semibold">{formatCurrency(result.maxLoanFromRent)}</td></tr>
              <tr><td className="py-2">Cover at your pay rate ({r.toFixed(2)}%)</td><td className="text-right tabular-nums">{formatPercent(result.payRateCover)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>PRA rules (SS13/16) make lenders test the rent at the higher of your pay rate plus 2 points or 5.5%, unless the rate is fixed for 5 years or more, when the pay rate can be used. 125% cover is the usual minimum for limited companies and basic-rate taxpayers, 145% for higher and additional-rate taxpayers. Individual lenders set their own stress rates and may allow top-slicing from personal income. Additional-property SDLT surcharge (5%) applies.</p>
          </div>
        </div>
      )}
    </div>
  )
}
