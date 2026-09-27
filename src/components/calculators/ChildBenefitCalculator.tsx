import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// 2026/27 rates
const FIRST_CHILD_WEEKLY = 27.05
const ADDITIONAL_CHILD_WEEKLY = 17.90
const HICBC_START = 60_000
const HICBC_END = 80_000
const HICBC_STEP = 200 // 1% of the benefit for every whole £200 over £60,000

function calculate(children: number, higherIncome: number) {
  const weeklyBenefit = (children >= 1 ? FIRST_CHILD_WEEKLY : 0) + Math.max(0, children - 1) * ADDITIONAL_CHILD_WEEKLY
  const annualBenefit = weeklyBenefit * 52

  // ITEPA 2003 s681C: 1% for every whole £200 of adjusted net income over £60,000,
  // capped at 100%. The percentage, the benefit total and the charge are each rounded
  // down to a whole number (s681C(3)).
  let hicbcRate = 0
  if (higherIncome > HICBC_START) {
    hicbcRate = Math.min(100, Math.floor((higherIncome - HICBC_START) / HICBC_STEP))
  }

  const hicbcCharge = Math.floor(Math.floor(annualBenefit) * hicbcRate / 100)
  const netBenefit = annualBenefit - hicbcCharge

  return { weeklyBenefit, annualBenefit, hicbcRate, hicbcCharge, netBenefit }
}

export default function ChildBenefitCalculator() {
  const [children, setChildren] = useState('2')
  const [income, setIncome] = useState('70,000')

  const c = parseInt(children) || 0
  const i = parseFloat(income.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(c, i), [c, i])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Number of Children</label>
          <input type="number" min="1" max="20" value={children} onChange={(e) => setChildren(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number of Children" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Higher Earner's Income (for HICBC)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="50,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Higher Earner's Income (for HICBC)" /></div>
        </div>
      </div>

      {c > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Annual Child Benefit (net)</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.netBenefit)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.weeklyBenefit)}/week &middot; {formatCurrency(result.annualBenefit / 12)}/month</p>
          </div>

          {result.hicbcRate > 0 && (
            <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-sm">
              <p className="font-medium text-orange-800 dark:text-orange-300">High Income Child Benefit Charge applies</p>
              <p className="text-orange-700 dark:text-orange-400 mt-1">You'll repay {result.hicbcRate}% of Child Benefit ({formatCurrency(result.hicbcCharge)}/year) through Self Assessment or, for employed people, through your tax code.</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Weekly</p><p className="text-lg font-bold">{formatCurrency(result.weeklyBenefit)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annual</p><p className="text-lg font-bold">{formatCurrency(result.annualBenefit)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">HICBC Charge</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.hicbcCharge)}</p></div>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p>First child: <span className="font-medium text-foreground">{formatCurrency(FIRST_CHILD_WEEKLY)}/week</span></p>
            <p>Each additional child: <span className="font-medium text-foreground">{formatCurrency(ADDITIONAL_CHILD_WEEKLY)}/week</span></p>
            <p>HICBC: 1% of the benefit for every whole £{HICBC_STEP} of adjusted net income over £{HICBC_START.toLocaleString('en-GB')}, so all of it at £{HICBC_END.toLocaleString('en-GB')} or more. The percentage and the charge are rounded down.</p>
          </div>
        </div>
      )}
    </div>
  )
}
