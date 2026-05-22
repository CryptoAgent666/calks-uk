import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(mortgage: number, savings: number, rate: number, term: number) {
  const effectiveMortgage = mortgage - savings
  const monthlyRate = rate / 100 / 12
  const payments = term * 12

  const normalMonthly = monthlyRate > 0 ? mortgage * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1) : mortgage / payments
  const offsetMonthly = monthlyRate > 0 ? effectiveMortgage * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1) : effectiveMortgage / payments

  const normalTotal = normalMonthly * payments
  const offsetTotal = offsetMonthly * payments
  const interestSaved = normalTotal - offsetTotal
  const monthlySaving = normalMonthly - offsetMonthly

  // Equivalent savings rate (tax-free)
  const equivalentRate = savings > 0 ? (interestSaved / term / savings) * 100 : 0

  return { normalMonthly, offsetMonthly, interestSaved, monthlySaving, equivalentRate, effectiveMortgage }
}

export default function OffsetMortgageCalculator() {
  const [mortgage, setMortgage] = useState('250000')
  const [savings, setSavings] = useState('30000')
  const [rate, setRate] = useState('4.5')
  const [term, setTerm] = useState('25')

  const m = parseFloat(mortgage.replace(/,/g,'')) || 0
  const s = parseFloat(savings.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 0
  const t = parseInt(term) || 25
  const result = useMemo(() => calculate(m, s, r, t), [m, s, r, t])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Mortgage</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={mortgage} onChange={(e) => setMortgage(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Mortgage" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Savings to Offset</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={savings} onChange={(e) => setSavings(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Savings to Offset" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Rate (%)</label><input type="number" min="1" max="10" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Rate (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Term (years)</label><input type="number" min="5" max="35" value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Term (years)" /></div>
      </div>
      {m > 0 && s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Interest Saved by Offsetting</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.interestSaved)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlySaving)}/month saving &middot; Equivalent to {result.equivalentRate.toFixed(1)}% tax-free savings rate</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Normal Monthly</p><p className="text-lg font-bold">{formatCurrency(result.normalMonthly)}</p></div>
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Offset Monthly</p><p className="text-lg font-bold text-primary">{formatCurrency(result.offsetMonthly)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
