import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'
import { PRIZE_RATE, ODDS, MIN_HOLDING, MAX_HOLDING, AS_OF, prizeShare, premiumBondOdds } from '@/data/premium-bonds'

// Rate, odds and prize list live in one shared module, which also builds the
// odds table on the page, so the calculator and the table always agree.
// Tax-free prize rate expressed as the gross rate a taxable account would
// need to match it, once interest is already above the Personal Savings Allowance
const GROSS_EQUIVALENT = {
  basic: (PRIZE_RATE * 100) / 0.80,
  higher: (PRIZE_RATE * 100) / 0.60,
  additional: (PRIZE_RATE * 100) / 0.55,
}

function calculate(holding: number) {
  const o = premiumBondOdds(holding)
  return {
    expectedAnnual: o.expectedAnnual,
    expectedMonthly: o.expectedAnnual / 12,
    expectedPrizesPerYear: o.expectedPrizesPerYear,
    chanceOfWinning: o.chanceMonth * 100,
    chanceYear: o.chanceYear * 100,
    medianAnnual: o.medianAnnual,
    medianRate: o.medianRate * 100,
    jackpotYearOneIn: o.jackpotYearOneIn,
  }
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
          {[1_000, 5_000, 10_000, 20_000, 25_000, 30_000, 40_000, 50_000].map(a => (
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Typical (Median) Winnings a Year</p><p className="text-lg font-bold">{formatCurrency(result.medianAnnual)}</p><p className="text-xs text-muted-foreground">{result.medianRate.toFixed(2)}% of your holding</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Chance of a Prize in a Year</p><p className="text-lg font-bold">{result.chanceYear >= 99.95 ? '99.9%+' : `${result.chanceYear.toFixed(1)}%`}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">£1m Jackpot in a Year</p><p className="text-lg font-bold">1 in {(Math.round(result.jackpotYearOneIn / 1000) * 1000).toLocaleString('en-GB')}</p></div>
          </div>
          <p className="text-xs text-muted-foreground">Half of holders with £{clamped.toLocaleString('en-GB')} win more than the typical figure in a year and half win less. The average is higher because it includes rare large prizes. Figures use the {AS_OF} rate and odds.</p>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Prize fund rate: {(PRIZE_RATE * 100)}% (tax-free). Odds of winning per £1 bond per month: 1 in {ODDS.toLocaleString()}. The most common prizes are £50 and £100 (about {prizeShare(50).toFixed(0)}% of prizes each), then £25 (about {prizeShare(25).toFixed(0)}%).</p>
            <p className="mt-1">Prizes are tax-free and do not use your Personal Savings Allowance. If your savings interest already uses up that allowance, {(PRIZE_RATE * 100)}% tax-free matches {GROSS_EQUIVALENT.basic.toFixed(2)}% in a taxable account for a basic-rate taxpayer, {GROSS_EQUIVALENT.higher.toFixed(2)}% for a higher-rate taxpayer and {GROSS_EQUIVALENT.additional.toFixed(2)}% for an additional-rate taxpayer. Interest that still fits inside the allowance is tax-free anyway, so compare headline rates.</p>
          </div>
        </div>
      )}
    </div>
  )
}
