import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Premium Bonds prize fund rate 4.35% and odds 21,000 to 1, from the September
// 2026 draw (NS&I PR260818, 18 Aug 2026 — up from 3.80% / 22,000 in July 2026).
const PRIZE_RATE = 0.0435
const ODDS = 21_000
const MIN_HOLDING = 25
const MAX_HOLDING = 50_000

// Number of prizes of each value in the September 2026 draw
// (nsandi.com, "How we share out Premium Bonds prizes").
const PRIZES = [
  { amount: 1_000_000, count: 2, label: '£1,000,000' },
  { amount: 100_000, count: 95, label: '£100,000' },
  { amount: 50_000, count: 192, label: '£50,000' },
  { amount: 25_000, count: 381, label: '£25,000' },
  { amount: 10_000, count: 954, label: '£10,000' },
  { amount: 5_000, count: 1_909, label: '£5,000' },
  { amount: 1_000, count: 19_882, label: '£1,000' },
  { amount: 500, count: 59_646, label: '£500' },
  { amount: 100, count: 2_365_010, label: '£100' },
  { amount: 50, count: 2_365_010, label: '£50' },
  { amount: 25, count: 1_716_787, label: '£25' },
]
const TOTAL_PRIZES = PRIZES.reduce((sum, p) => sum + p.count, 0)
// Share of all prizes, in %, for a given prize value
const prizeShare = (amount: number) => ((PRIZES.find((p) => p.amount === amount)?.count || 0) / TOTAL_PRIZES) * 100

// Tax-free prize rate expressed as the gross rate a taxable account would
// need to match it, once interest is already above the Personal Savings Allowance
const GROSS_EQUIVALENT = {
  basic: (PRIZE_RATE * 100) / 0.80,
  higher: (PRIZE_RATE * 100) / 0.60,
  additional: (PRIZE_RATE * 100) / 0.55,
}

function calculate(holding: number) {
  const bonds = holding // each £1 = 1 bond
  // Average expected return based on prize fund rate
  const expectedAnnual = holding * PRIZE_RATE
  const expectedMonthly = expectedAnnual / 12

  // Odds of winning any prize per month (1 in 21,000 per bond)
  const oddsPerBondPerMonth = 1 / ODDS
  const expectedPrizesPerMonth = bonds * oddsPerBondPerMonth
  const expectedPrizesPerYear = expectedPrizesPerMonth * 12

  // Chance of winning at least one prize per month
  const chanceOfWinning = 1 - Math.pow(1 - oddsPerBondPerMonth, bonds)

  return { expectedAnnual, expectedMonthly, expectedPrizesPerYear, chanceOfWinning: chanceOfWinning * 100, bonds }
}

export default function PremiumBondsCalculator() {
  const [holding, setHolding] = useState('10000')

  const h = parseFloat(holding.replace(/,/g,'')) || 0
  const clamped = Math.min(Math.max(h, 0), MAX_HOLDING)
  const result = useMemo(() => calculate(clamped), [clamped])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">How Much Do You Hold?</label>
        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <input type="text" inputMode="numeric" value={holding} onChange={(e) => setHolding(e.target.value)} placeholder="10,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="How Much Do You Hold?" /></div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[1_000, 5_000, 10_000, 25_000, 50_000].map(a => (
            <button key={a} onClick={() => setHolding(a.toLocaleString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">£{a >= 1000 ? `${a/1000}K` : a}</button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Min £{MIN_HOLDING}, Max £{MAX_HOLDING.toLocaleString()}</p>
      </div>

      {clamped > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Expected Annual Return</p><p className="text-xl font-bold text-primary">{formatCurrency(result.expectedAnnual)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Expected Monthly</p><p className="text-lg font-bold">{formatCurrency(result.expectedMonthly)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Expected Prizes/Year</p><p className="text-lg font-bold">{result.expectedPrizesPerYear.toFixed(1)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly Win Chance</p><p className="text-lg font-bold">{result.chanceOfWinning.toFixed(1)}%</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Prize fund rate: {(PRIZE_RATE * 100)}% (tax-free). Odds of winning per £1 bond per month: 1 in {ODDS.toLocaleString()}. The most common prizes are £50 and £100 (about {prizeShare(50).toFixed(0)}% of prizes each), then £25 (about {prizeShare(25).toFixed(0)}%).</p>
            <p className="mt-1">Prizes are tax-free and do not use your Personal Savings Allowance. If your savings interest already uses up that allowance, {(PRIZE_RATE * 100)}% tax-free matches {GROSS_EQUIVALENT.basic.toFixed(2)}% in a taxable account for a basic-rate taxpayer, {GROSS_EQUIVALENT.higher.toFixed(2)}% for a higher-rate taxpayer and {GROSS_EQUIVALENT.additional.toFixed(2)}% for an additional-rate taxpayer. Interest that still fits inside the allowance is tax-free anyway, so compare headline rates.</p>
          </div>
        </div>
      )}
    </div>
  )
}
