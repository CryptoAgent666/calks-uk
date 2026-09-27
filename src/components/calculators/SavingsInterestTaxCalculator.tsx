import { useState, useMemo } from 'react'
import { formatCurrency, ukPersonalAllowance, ukIncomeTax, UK_BASIC_BAND, UK_ADDITIONAL_THRESHOLD } from '@/utils'

// Personal Savings Allowance 2026/27
const PSA_BASIC = 1_000
const PSA_HIGHER = 500
const PSA_ADDITIONAL = 0
// Starting rate for savings: up to £5,000 at 0%, reduced £1 for £1 by
// non-savings taxable income (gov.uk/apply-tax-free-interest-on-savings)
const STARTING_RATE_BAND = 5_000
// Savings income rates 2026/27 (rise to 22/42/47% from April 2027, Budget 2025)
const BASIC_RATE = 0.20
const HIGHER_RATE = 0.40
const ADDITIONAL_RATE = 0.45

type Band = 'basic' | 'higher' | 'additional'

// Portion of the slice [from, to] of taxable income that falls inside [lo, hi]
function overlap(from: number, to: number, lo: number, hi: number) {
  return Math.max(0, Math.min(to, hi) - Math.max(from, lo))
}

// Tax on savings interest, with salary treated as non-savings income.
// HMRC order: non-savings income uses the Personal Allowance first, unused
// allowance covers interest, then the starting rate for savings, then the
// Personal Savings Allowance (0% but it still uses up band), and whatever is
// left is taxed as the top slice at 20% / 40% / 45%.
function taxOnInterest(interest: number, salary: number) {
  const pa = ukPersonalAllowance(salary + interest)
  const nonSavingsTaxable = Math.max(0, salary - pa)
  const totalTaxable = Math.max(0, salary + interest - pa)

  // PSA depends on the band of total taxable income, interest included
  const band: Band = totalTaxable > UK_ADDITIONAL_THRESHOLD ? 'additional' : totalTaxable > UK_BASIC_BAND ? 'higher' : 'basic'
  const psa = band === 'basic' ? PSA_BASIC : band === 'higher' ? PSA_HIGHER : PSA_ADDITIONAL

  const coveredByPa = Math.min(interest, Math.max(0, pa - salary))
  let remaining = interest - coveredByPa
  let position = nonSavingsTaxable

  const startingBand = Math.max(0, STARTING_RATE_BAND - nonSavingsTaxable)
  const coveredByStarting = Math.min(remaining, startingBand)
  remaining -= coveredByStarting
  position += coveredByStarting

  const coveredByPsa = Math.min(remaining, psa)
  remaining -= coveredByPsa
  position += coveredByPsa

  const end = position + remaining
  const atBasic = overlap(position, end, 0, UK_BASIC_BAND)
  const atHigher = overlap(position, end, UK_BASIC_BAND, UK_ADDITIONAL_THRESHOLD)
  const atAdditional = overlap(position, end, UK_ADDITIONAL_THRESHOLD, Infinity)
  const tax = atBasic * BASIC_RATE + atHigher * HIGHER_RATE + atAdditional * ADDITIONAL_RATE

  return { pa, band, psa, coveredByPa, startingBand, coveredByStarting, coveredByPsa, atBasic, atHigher, atAdditional, tax }
}

// Largest amount of interest that stays tax-free for this salary. Tax on
// interest never falls as interest rises, so a bisection finds the edge.
function maxTaxFreeInterest(salary: number) {
  if (taxOnInterest(1_000_000, salary).tax === 0) return 1_000_000
  let lo = 0
  let hi = 1_000_000
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (taxOnInterest(mid, salary).tax > 0) hi = mid
    else lo = mid
  }
  return Math.round(lo * 100) / 100
}

function calculate(savingsBalance: number, interestRate: number, salary: number) {
  const annualInterest = savingsBalance * (interestRate / 100)
  const t = taxOnInterest(annualInterest, salary)
  const taxFree = t.coveredByPa + t.coveredByStarting + t.coveredByPsa
  const netInterest = annualInterest - t.tax
  const effectiveRate = savingsBalance > 0 ? (netInterest / savingsBalance) * 100 : 0

  // Interest also counts towards the £100,000 Personal Allowance taper, which
  // raises the tax on the salary itself. Reported separately from the tax on
  // the interest slice.
  const taperCost = Math.max(0, ukIncomeTax(salary, t.pa) - ukIncomeTax(salary))

  const maxInterest = maxTaxFreeInterest(salary)
  const maxTaxFree = interestRate > 0 ? maxInterest / (interestRate / 100) : 0

  return { annualInterest, ...t, taxFree, netInterest, effectiveRate, maxInterest, maxTaxFree, taperCost }
}

export default function SavingsInterestTaxCalculator() {
  const [balance, setBalance] = useState('70000')
  const [rate, setRate] = useState('4')
  const [salary, setSalary] = useState('55000')

  const b = parseFloat(balance.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 0
  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(b, r, s), [b, r, s])
  const bandLabel = result.band === 'basic' ? 'basic-rate' : result.band === 'higher' ? 'higher-rate' : 'additional-rate'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Savings Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Savings Balance" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Interest Rate (%)</label><input type="number" min="0" max="10" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Interest Rate (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Annual Salary (or other non-savings income)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div></div>
      </div>

      {b > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Interest</p><p className="text-lg font-bold">{formatCurrency(result.annualInterest)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Tax-Free Interest</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.taxFree)}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.tax > 0 ? 'bg-destructive/10' : 'bg-muted/50'}`}><p className="text-xs text-muted-foreground">Tax on Interest</p><p className={`text-lg font-bold ${result.tax > 0 ? 'text-destructive' : ''}`}>{result.tax > 0 ? formatCurrency(result.tax) : 'None'}</p></div>
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Net Interest</p><p className="text-lg font-bold text-primary">{formatCurrency(result.netInterest)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">How your interest is taxed</p>
            {result.coveredByPa > 0 && <p>Covered by unused Personal Allowance: <span className="font-medium text-foreground">{formatCurrency(result.coveredByPa)}</span></p>}
            {result.coveredByStarting > 0 && <p>Starting rate for savings at 0% (band {formatCurrency(result.startingBand)}): <span className="font-medium text-foreground">{formatCurrency(result.coveredByStarting)}</span></p>}
            <p>Personal Savings Allowance at 0% ({formatCurrency(result.psa)} as a {bandLabel} taxpayer): <span className="font-medium text-foreground">{formatCurrency(result.coveredByPsa)}</span></p>
            {result.atBasic > 0 && <p>Taxed at 20%: {formatCurrency(result.atBasic)} = <span className="font-medium text-foreground">{formatCurrency(result.atBasic * BASIC_RATE)}</span></p>}
            {result.atHigher > 0 && <p>Taxed at 40%: {formatCurrency(result.atHigher)} = <span className="font-medium text-foreground">{formatCurrency(result.atHigher * HIGHER_RATE)}</span></p>}
            {result.atAdditional > 0 && <p>Taxed at 45%: {formatCurrency(result.atAdditional)} = <span className="font-medium text-foreground">{formatCurrency(result.atAdditional * ADDITIONAL_RATE)}</span></p>}
            {result.taperCost > 0 && <p>Your interest also takes total income over £100,000, which reduces your Personal Allowance and adds about {formatCurrency(result.taperCost)} of tax on your salary.</p>}
            <p className="pt-1">Interest you can earn tax-free on this salary: <span className="font-medium text-foreground">{formatCurrency(result.maxInterest)}</span>{r > 0 && <> (a balance of about <span className="font-medium text-foreground">{formatCurrency(result.maxTaxFree)}</span> at {r}%)</>}</p>
            {result.tax > 0 && <p>HMRC usually collects this through your tax code or a Simple Assessment; you need Self Assessment only if your interest is over £10,000 or you already file a return.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
