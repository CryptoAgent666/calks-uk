import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Relief at source: the provider claims basic-rate relief at 20% and adds it to the pot,
// so a £80 payment becomes £100 (gov.uk/tax-on-your-private-pension, "relief at source").
const BASIC_RATE_RELIEF = 0.20

function calculate(targetIncome: number, yearsInRetirement: number, statePension: number, growthInRetirement: number, incomeRise = 0) {
  const annualShortfall = targetIncome - statePension * 52
  if (annualShortfall <= 0) return { potNeeded: 0, using4pct: 0, usingAnnuity: 0, annualShortfall: 0 }

  // 4% rule
  const potFor4pct = annualShortfall / 0.04

  // Annuity-based: 5.5% is a cautious starting rate for an income that rises each
  // year. MoneyHelper via Which? (21 Sep 2026), healthy 65-year-old, £100k: best
  // joint-life annuity rising 3% a year ~5.7%; best level single-life ~8.2%.
  const potForAnnuity = annualShortfall / 0.055

  // Drawdown: present value of a monthly income that runs the pot to nil after
  // `yearsInRetirement`. With incomeRise = 0 the income is level and never keeps up
  // with prices; a positive incomeRise grows it by that much a year (paid monthly).
  const monthlyNeed = annualShortfall / 12
  const monthlyGrowth = growthInRetirement / 100 / 12
  const monthlyRise = Math.pow(1 + incomeRise / 100, 1 / 12) - 1
  const months = yearsInRetirement * 12
  let potDrawdown: number
  if (Math.abs(monthlyGrowth - monthlyRise) > 1e-12) {
    potDrawdown = monthlyNeed * (1 - Math.pow((1 + monthlyRise) / (1 + monthlyGrowth), months)) / (monthlyGrowth - monthlyRise)
  } else {
    potDrawdown = monthlyNeed * months / (1 + monthlyGrowth)
  }

  return { annualShortfall, potFor4pct, potForAnnuity, potDrawdown, monthlyNeed }
}

// Saving towards the 4% rule target: today's pot and a monthly payment grow at the
// pre-retirement rate (after charges), compounded monthly, payments at each month end.
function accumulate(currentPot: number, yearsToRetirement: number, monthlyYouPay: number, growthBefore: number, targetPot: number) {
  const months = Math.round(yearsToRetirement * 12)
  if (months <= 0) return null
  const i = growthBefore / 100 / 12
  const growthFactor = Math.pow(1 + i, months)
  const contributionFactor = i > 0 ? (growthFactor - 1) / i : months
  const monthlyIntoPot = monthlyYouPay / (1 - BASIC_RATE_RELIEF)
  const potGrown = currentPot * growthFactor
  const contributionsGrown = monthlyIntoPot * contributionFactor
  const projectedPot = potGrown + contributionsGrown
  const stillToBuild = Math.max(0, targetPot - potGrown)
  const neededIntoPot = stillToBuild / contributionFactor
  const neededYouPay = neededIntoPot * (1 - BASIC_RATE_RELIEF)
  return { months, monthlyIntoPot, potGrown, contributionsGrown, projectedPot, stillToBuild, neededIntoPot, neededYouPay, gap: projectedPot - targetPot }
}

export default function PensionPotCalculator() {
  const [target, setTarget] = useState('25000')
  const [years, setYears] = useState('25')
  const [sp, setSp] = useState('241.30')
  const [growth, setGrowth] = useState('3')
  const [rise, setRise] = useState('0')
  const [pot, setPot] = useState('25000')
  const [yearsToGo, setYearsToGo] = useState('30')
  const [monthly, setMonthly] = useState('200')
  const [growthBefore, setGrowthBefore] = useState('4.5')

  const t = parseFloat(target.replace(/,/g,'')) || 0
  const y = parseInt(years) || 25
  const s = parseFloat(sp) || 0
  const g = parseFloat(growth) || 0
  const r = parseFloat(rise) || 0
  const cp = parseFloat(pot.replace(/,/g,'')) || 0
  const ytg = parseFloat(yearsToGo) || 0
  const m = parseFloat(monthly.replace(/,/g,'')) || 0
  const gb = parseFloat(growthBefore) || 0
  const result = useMemo(() => calculate(t, y, s, g, r), [t, y, s, g, r])
  const saving = useMemo(() => (result.annualShortfall > 0 && result.potFor4pct ? accumulate(cp, ytg, m, gb, result.potFor4pct) : null), [cp, ytg, m, gb, result])

  const inputCls = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'
  const moneyCls = 'w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div><label className="block text-sm font-medium mb-2">Target Annual Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={target} onChange={(e) => setTarget(e.target.value)} className={moneyCls}  aria-label="Target Annual Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years in Retirement</label><input type="number" min="10" max="40" value={years} onChange={(e) => setYears(e.target.value)} className={inputCls}  aria-label="Years in Retirement" /></div>
        <div><label className="block text-sm font-medium mb-2">State Pension (£/wk)</label><input type="number" min="0" max="300" step="0.01" value={sp} onChange={(e) => setSp(e.target.value)} className={inputCls}  aria-label="State Pension (£/wk)" /></div>
        <div><label className="block text-sm font-medium mb-2">Growth in Retirement (%)</label><input type="number" min="0" max="8" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className={inputCls}  aria-label="Growth in Retirement (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Income Rise a Year (%)</label><input type="number" min="0" max="5" step="0.5" value={rise} onChange={(e) => setRise(e.target.value)} className={inputCls}  aria-label="Income Rise a Year (%)" /><p className="text-xs text-muted-foreground mt-1">0 = level income</p></div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Saving towards it</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div><label className="block text-sm font-medium mb-2">Current Pension Pot</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={pot} onChange={(e) => setPot(e.target.value)} className={moneyCls}  aria-label="Current Pension Pot" /></div></div>
          <div><label className="block text-sm font-medium mb-2">Years to Retirement</label><input type="number" min="1" max="50" value={yearsToGo} onChange={(e) => setYearsToGo(e.target.value)} className={inputCls}  aria-label="Years to Retirement" /></div>
          <div><label className="block text-sm font-medium mb-2">You Pay Each Month</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={monthly} onChange={(e) => setMonthly(e.target.value)} className={moneyCls}  aria-label="You Pay Each Month" /></div><p className="text-xs text-muted-foreground mt-1">Before 20% relief is added</p></div>
          <div><label className="block text-sm font-medium mb-2">Growth Before Retirement (%)</label><input type="number" min="0" max="10" step="0.5" value={growthBefore} onChange={(e) => setGrowthBefore(e.target.value)} className={inputCls}  aria-label="Growth Before Retirement (%)" /><p className="text-xs text-muted-foreground mt-1">After charges</p></div>
        </div>
      </div>

      {t > 0 && result.annualShortfall > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Pension Pot Needed (drawdown, {r > 0 ? `income rising ${r}% a year` : 'level income'})</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.potDrawdown)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyNeed)}/month shortfall after State Pension{r > 0 ? ' in the first year' : ''}, paid for {y} years</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Drawdown ({g}% growth)</p><p className="text-lg font-bold">{formatCurrency(result.potDrawdown)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">4% Rule</p><p className="text-lg font-bold">{formatCurrency(result.potFor4pct)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Rising Annuity (~5.5%)</p><p className="text-lg font-bold">{formatCurrency(result.potForAnnuity)}</p></div>
          </div>
          {saving && (
            <div className="rounded-xl bg-muted/50 p-4 text-sm">
              <p className="font-medium">Projected pot in {ytg} years: {formatCurrency(saving.projectedPot)}</p>
              <p className="text-muted-foreground mt-1">Your {formatCurrency(cp)} grows to {formatCurrency(saving.potGrown)}, and {formatCurrency(m)} a month from you ({formatCurrency(saving.monthlyIntoPot)} with basic-rate relief) adds {formatCurrency(saving.contributionsGrown)}.</p>
              <p className="text-muted-foreground mt-1">
                {saving.stillToBuild > 0
                  ? <>To reach the 4% rule target of {formatCurrency(result.potFor4pct)} you need {formatCurrency(saving.neededIntoPot)} a month going in, which is {formatCurrency(saving.neededYouPay)} a month from you after 20% relief.</>
                  : <>Your current pot alone grows past the 4% rule target of {formatCurrency(result.potFor4pct)}.</>}
              </p>
            </div>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>3 methods: Drawdown (invest and withdraw until the pot runs out after the years you set; with a 0% income rise the income stays level and loses value to inflation), 4% Rule (safe withdrawal rate, rising with inflation), Annuity (guaranteed income for life, at a 5.5% starting rate for income that rises each year; a level annuity pays more at first but never rises). State Pension provides {formatCurrency(s * 52)}/yr — the rest must come from your pot. The saving projection uses relief at source, where your provider adds 20% basic-rate relief to what you pay.</p>
          </div>
        </div>
      )}
      {result.annualShortfall <= 0 && t > 0 && (
        <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center"><p className="text-lg font-bold text-green-700 dark:text-green-400">State Pension covers your target income!</p></div>
      )}
    </div>
  )
}
