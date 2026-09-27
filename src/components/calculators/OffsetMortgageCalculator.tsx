import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Savings income tax rates 2026/27 and the Personal Savings Allowance for each band
const TAX_BANDS: Record<string, { rate: number; psa: number; label: string }> = {
  basic: { rate: 0.20, psa: 1_000, label: 'Basic rate (20%)' },
  higher: { rate: 0.40, psa: 500, label: 'Higher rate (40%)' },
  additional: { rate: 0.45, psa: 0, label: 'Additional rate (45%)' },
}

function payment(principal: number, monthlyRate: number, months: number) {
  if (principal <= 0) return 0
  if (monthlyRate <= 0) return principal / months
  const f = Math.pow(1 + monthlyRate, months)
  return principal * (monthlyRate * f) / (f - 1)
}

// Keep paying the full standard payment with the savings left in the offset account:
// interest is charged only on (balance - savings), so the loan clears early.
function payOffWithOffset(mortgage: number, savings: number, monthlyRate: number, monthlyPayment: number) {
  let balance = mortgage
  let months = 0
  let interest = 0
  while (balance > 0.005 && months < 1200) {
    const charge = Math.max(0, balance - savings) * monthlyRate
    interest += charge
    balance += charge
    // the last month only needs part of a payment
    months += Math.min(1, balance / monthlyPayment)
    balance -= Math.min(balance, monthlyPayment)
  }
  return { months, interest }
}

function calculate(mortgage: number, savings: number, rate: number, term: number, taxBand = 'higher') {
  const offset = Math.min(savings, mortgage)
  const monthlyRate = rate / 100 / 12
  const payments = term * 12

  const normalMonthly = payment(mortgage, monthlyRate, payments)
  const normalInterest = normalMonthly * payments - mortgage

  // Option 1: lower payments. The payment is worked out on the net balance (mortgage - savings);
  // at the end of the term the savings clear the balance they were offsetting.
  const offsetMonthly = payment(mortgage - offset, monthlyRate, payments)
  const offsetInterest = offsetMonthly * payments - (mortgage - offset)
  const interestSaved = normalInterest - offsetInterest
  const monthlySaving = normalMonthly - offsetMonthly

  // Option 2: same payments, shorter term (savings kept intact throughout)
  const shorter = payOffWithOffset(mortgage, offset, monthlyRate, normalMonthly)
  const monthsSaved = Math.max(0, Math.floor(payments - shorter.months + 1e-9))
  const interestSavedShorter = normalInterest - shorter.interest

  // Offsetting earns the mortgage rate tax-free. First-year saving is roughly savings x rate.
  const firstYearSaving = offset * rate / 100
  const band = TAX_BANDS[taxBand] ?? TAX_BANDS.higher
  const grossEquivalent = rate / (1 - band.rate)
  // If the Personal Savings Allowance is otherwise unused, interest up to it would be tax-free
  const grossEquivalentWithPSA = offset <= 0 ? rate
    : firstYearSaving <= band.psa ? rate
    : ((firstYearSaving - band.rate * band.psa) / (offset * (1 - band.rate))) * 100

  return {
    normalMonthly, offsetMonthly, monthlySaving, normalInterest, offsetInterest, interestSaved,
    averageYearlySaving: term > 0 ? interestSaved / term : 0,
    monthsSaved, interestSavedShorter, firstYearSaving, grossEquivalent, grossEquivalentWithPSA,
    effectiveMortgage: mortgage - offset,
  }
}

function yearsMonths(months: number) {
  const y = Math.floor(months / 12)
  const m = months % 12
  return `${y} year${y === 1 ? '' : 's'} ${m} month${m === 1 ? '' : 's'}`
}

export default function OffsetMortgageCalculator() {
  const [mortgage, setMortgage] = useState('250000')
  const [savings, setSavings] = useState('30000')
  const [rate, setRate] = useState('4.5')
  const [term, setTerm] = useState('25')
  const [taxBand, setTaxBand] = useState('higher')

  const m = parseFloat(mortgage.replace(/,/g,'')) || 0
  const s = parseFloat(savings.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 0
  const t = parseInt(term) || 25
  const result = useMemo(() => calculate(m, s, r, t, taxBand), [m, s, r, t, taxBand])
  const band = TAX_BANDS[taxBand]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Mortgage</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={mortgage} onChange={(e) => setMortgage(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Mortgage" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Savings to Offset</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={savings} onChange={(e) => setSavings(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Savings to Offset" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Rate (%)</label><input type="number" min="1" max="10" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Rate (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Term (years)</label><input type="number" min="5" max="35" value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Term (years)" /></div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Your Income Tax Band</label>
        <select value={taxBand} onChange={(e) => setTaxBand(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Your Income Tax Band">
          {Object.entries(TAX_BANDS).map(([k, b]) => <option key={k} value={k}>{b.label}</option>)}
        </select>
      </div>
      {m > 0 && s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Interest Saved by Offsetting (lower payments)</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.interestSaved)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlySaving)}/month lower payment &middot; about {formatCurrency(result.firstYearSaving)} of interest saved in the first year, {formatCurrency(result.averageYearlySaving)} a year on average</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Normal Monthly</p><p className="text-lg font-bold">{formatCurrency(result.normalMonthly)}</p></div>
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Offset Monthly</p><p className="text-lg font-bold text-primary">{formatCurrency(result.offsetMonthly)}</p></div>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <p className="text-xs text-muted-foreground">Or keep paying {formatCurrency(result.normalMonthly)} a month</p>
            <p className="text-lg font-bold">Mortgage cleared {yearsMonths(result.monthsSaved)} sooner</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(result.interestSavedShorter)} less interest, with your savings still intact</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Tax-free return on offset savings</p><p className="text-lg font-bold">{r.toFixed(2)}%</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Gross savings rate needed to match ({(band.rate * 100).toFixed(0)}% tax)</p><p className="text-lg font-bold">{result.grossEquivalent.toFixed(2)}%</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>{band.psa > 0
              ? `If your £${band.psa.toLocaleString('en-GB')} Personal Savings Allowance is otherwise unused, a savings account would need ${result.grossEquivalentWithPSA.toFixed(2)}% gross on this balance to match the offset.`
              : 'Additional-rate taxpayers have no Personal Savings Allowance, so all savings interest is taxed.'} Figures assume the savings balance stays the same for the whole term and the rate does not change. With lower payments, the balance left at the end of the term equals your savings, which clear it.</p>
          </div>
        </div>
      )}
    </div>
  )
}
