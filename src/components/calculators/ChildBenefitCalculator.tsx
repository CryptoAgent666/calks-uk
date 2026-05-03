import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// 2026/27 rates
const FIRST_CHILD_WEEKLY = 27.05
const ADDITIONAL_CHILD_WEEKLY = 17.90
const HICBC_START = 60_000
const HICBC_END = 80_000

function calculate(children: number, higherIncome: number) {
  const weeklyBenefit = (children >= 1 ? FIRST_CHILD_WEEKLY : 0) + Math.max(0, children - 1) * ADDITIONAL_CHILD_WEEKLY
  const annualBenefit = weeklyBenefit * 52

  let hicbcRate = 0
  if (higherIncome > HICBC_START && higherIncome < HICBC_END) {
    hicbcRate = ((higherIncome - HICBC_START) / (HICBC_END - HICBC_START)) * 100
  } else if (higherIncome >= HICBC_END) {
    hicbcRate = 100
  }

  const hicbcCharge = annualBenefit * (hicbcRate / 100)
  const netBenefit = annualBenefit - hicbcCharge

  return { weeklyBenefit, annualBenefit, hicbcRate, hicbcCharge, netBenefit }
}

export default function ChildBenefitCalculator() {
  const [children, setChildren] = useState('2')
  const [income, setIncome] = useState('')

  const c = parseInt(children) || 0
  const i = parseFloat(income.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(c, i), [c, i])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Number of Children</label>
          <input type="number" min="1" max="20" value={children} onChange={(e) => setChildren(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Higher Earner's Income (for HICBC)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="50,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
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
              <p className="text-orange-700 dark:text-orange-400 mt-1">You'll repay {result.hicbcRate.toFixed(0)}% of child benefit ({formatCurrency(result.hicbcCharge)}/year) through self-assessment.</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Weekly</p><p className="text-lg font-bold">{formatCurrency(result.weeklyBenefit)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annual</p><p className="text-lg font-bold">{formatCurrency(result.annualBenefit)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">HICBC Charge</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.hicbcCharge)}</p></div>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p>First child: <span className="font-medium text-foreground">£{FIRST_CHILD_WEEKLY}/week</span></p>
            <p>Each additional child: <span className="font-medium text-foreground">£{ADDITIONAL_CHILD_WEEKLY}/week</span></p>
            <p>HICBC: 1% clawback per £200 income between £{HICBC_START.toLocaleString()} and £{HICBC_END.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  )
}
