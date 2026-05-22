import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

function calculate(propertyPrice: number, deposit: number, interestRate: number, monthlyRent: number, term: number) {
  const mortgage = propertyPrice - deposit
  const ltv = propertyPrice > 0 ? (mortgage / propertyPrice) * 100 : 0

  // Interest-only (most common for BTL)
  const monthlyInterestOnly = (mortgage * interestRate / 100) / 12
  // Repayment
  const monthlyRate = interestRate / 100 / 12
  const payments = term * 12
  const monthlyRepayment = monthlyRate > 0 ? mortgage * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1) : mortgage / payments

  // Rental coverage (lenders typically require 125-145%)
  const rentalCoverageIO = monthlyRent > 0 ? (monthlyRent / monthlyInterestOnly) * 100 : 0
  const meetsStressTest = rentalCoverageIO >= 125

  const monthlyProfit = monthlyRent - monthlyInterestOnly
  const annualProfit = monthlyProfit * 12

  return { mortgage, ltv, monthlyInterestOnly, monthlyRepayment, rentalCoverageIO, meetsStressTest, monthlyProfit, annualProfit }
}

export default function BuyToLetMortgageCalculator() {
  const [price, setPrice] = useState('250000')
  const [deposit, setDeposit] = useState('62500')
  const [rate, setRate] = useState('5.5')
  const [rent, setRent] = useState('1100')
  const [term, setTerm] = useState('25')

  const p = parseFloat(price.replace(/,/g,'')) || 0
  const d = parseFloat(deposit.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 0
  const re = parseFloat(rent.replace(/,/g,'')) || 0
  const t = parseInt(term) || 25
  const result = useMemo(() => calculate(p, d, r, re, t), [p, d, r, re, t])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Property Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Property Price" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Deposit (25%+)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Deposit (25%+)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Interest Rate (%)</label><input type="number" min="1" max="10" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Interest Rate (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Monthly Rent</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Rent" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Term (years)</label><input type="number" min="5" max="35" value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Term (years)" /></div>
      </div>

      {p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Interest Only</p><p className="text-xl font-bold text-primary">{formatCurrency(result.monthlyInterestOnly)}/month</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Repayment</p><p className="text-xl font-bold">{formatCurrency(result.monthlyRepayment)}/month</p></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">LTV</p><p className="text-lg font-bold">{formatPercent(result.ltv)}</p></div>
            <div className={`rounded-xl p-3 text-center ${result.meetsStressTest ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Rental Coverage</p><p className={`text-lg font-bold ${result.meetsStressTest ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatPercent(result.rentalCoverageIO)}</p><p className="text-xs text-muted-foreground">{result.meetsStressTest ? 'Meets 125%' : 'Below 125%'}</p></div>
            <div className={`rounded-xl p-3 text-center ${result.monthlyProfit > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Monthly Cashflow</p><p className={`text-lg font-bold ${result.monthlyProfit > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(result.monthlyProfit)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Mortgage</p><p className="text-lg font-bold">{formatCurrency(result.mortgage)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>BTL mortgages typically require 25%+ deposit. Lenders stress-test at 125-145% rental coverage on interest-only. Additional property SDLT surcharge (5%) applies.</p>
          </div>
        </div>
      )}
    </div>
  )
}
