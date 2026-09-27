import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Working Tax Credit — scheme CLOSED to new claims 5 Apr 2025 (tax credits ended);
// values frozen at their final 2024/25 levels, kept for legacy reference only.
const WTC_BASIC = 2_435        // final WTC rate, frozen (scheme closed Apr 2025)
const WTC_COUPLES = 2_500      // couple and lone parent element — final WTC rate, frozen
const WTC_30HR = 1_015         // final WTC rate, frozen (scheme closed to new claims Apr 2025)
const WTC_DISABILITY = 3_935   // final WTC rate, frozen (scheme closed Apr 2025)
const WTC_CHILDCARE_70 = 0.70 // 70% of childcare costs
const WTC_CHILDCARE_MAX_1 = 175 * 52 // max weekly for 1 child
const WTC_CHILDCARE_MAX_2 = 300 * 52

const CTC_PER_CHILD = 3_455    // child element per child — final 2024/25 rate, frozen (scheme closed)
const CTC_FAMILY = 545         // family element — final 2024/25 rate, frozen (only if a child was born before 6 Apr 2017)

const INCOME_THRESHOLD = 7_955 // final 2024/25 threshold, frozen (no uprating after the scheme closed)
const CTC_ONLY_THRESHOLD = 19_995 // threshold when only Child Tax Credit is payable
const TAPER_RATE = 0.41

// Hours assume a claimant aged 25-59 without a disability. A couple is assumed to
// have both partners working 16+ hours (so a couple with children always meets the
// 24 combined hours rule and the combined 30 hours for the 30-hour element).
function calculate(hoursPerWeek: number, isCouple: boolean, children: number, income: number, weeklyChildcare: number, childrenBornBefore2017: number = children) {
  const bornBefore = Math.min(Math.max(0, childrenBornBefore2017), children)
  const wtcEligible = children > 0 ? (isCouple || hoursPerWeek >= 16) : hoursPerWeek >= 30

  let maxWTC = 0
  if (wtcEligible) {
    maxWTC = WTC_BASIC
    if (isCouple || children > 0) maxWTC += WTC_COUPLES // couple or lone parent element
    if (hoursPerWeek >= 30 || (isCouple && children > 0)) maxWTC += WTC_30HR
  }

  // Two-child limit: child element for the first two children, plus any others born before 6 April 2017
  const childElements = Math.max(Math.min(children, 2), bornBefore)
  let maxCTC = 0
  if (children > 0) {
    maxCTC = (bornBefore > 0 ? CTC_FAMILY : 0) + CTC_PER_CHILD * childElements
  }

  const childcareElement = wtcEligible && children > 0 ? Math.min(weeklyChildcare * 52, children > 1 ? WTC_CHILDCARE_MAX_2 : WTC_CHILDCARE_MAX_1) * WTC_CHILDCARE_70 : 0

  const maxTotal = maxWTC + maxCTC + childcareElement
  const threshold = wtcEligible ? INCOME_THRESHOLD : CTC_ONLY_THRESHOLD
  const excessIncome = Math.max(0, income - threshold)
  const taper = excessIncome * TAPER_RATE
  const award = Math.max(0, maxTotal - taper)

  return { wtcEligible, maxWTC, maxCTC, childElements, childcareElement, maxTotal, threshold, taper, award, monthly: award / 12, weekly: award / 52 }
}

export default function TaxWorkingCreditsCalculator() {
  const [hours, setHours] = useState('30')
  const [couple, setCouple] = useState(false)
  const [children, setChildren] = useState('2')
  const [income, setIncome] = useState('20000')
  const [childcare, setChildcare] = useState('100')
  const [bornBefore, setBornBefore] = useState('2')

  const h = parseInt(hours) || 0
  const c = parseInt(children) || 0
  const i = parseFloat(income.replace(/,/g,'')) || 0
  const cc = parseFloat(childcare) || 0
  const bb = parseInt(bornBefore) || 0
  const result = useMemo(() => calculate(h, couple, c, i, cc, bb), [h, couple, c, i, cc, bb])

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-sm text-orange-800 dark:text-orange-300"><strong>Tax Credits ended on 5 April 2025.</strong> You can no longer make or hold a Working/Child Tax Credit claim — all claimants have moved to Universal Credit (or Pension Credit). The figures below are the final 2024/25 rates, kept for reference and back-year checks only. For current support, use Universal Credit.</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Hours/Week</label><input type="number" min="0" max="60" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours/Week" /></div>
        <div><label className="block text-sm font-medium mb-2">Children</label><input type="number" min="0" max="10" value={children} onChange={(e) => setChildren(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Children" /></div>
        <div><label className="block text-sm font-medium mb-2">Born Before 6 Apr 2017</label><input type="number" min="0" max="10" value={bornBefore} onChange={(e) => setBornBefore(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Children born before 6 April 2017" /></div>
        <div><label className="block text-sm font-medium mb-2">Annual Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Weekly Childcare (£)</label><input type="number" min="0" max="500" value={childcare} onChange={(e) => setChildcare(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weekly Childcare (£)" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={couple} onChange={(e) => setCouple(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Couple (both working 16+ hours; hours above are the main earner's)</span></label>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Annual Award</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.award)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthly)}/month &middot; {formatCurrency(result.weekly)}/week</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2">Working Tax Credit{!result.wtcEligible && ' (hours too low)'}</td><td className="text-right tabular-nums">{formatCurrency(result.maxWTC)}</td></tr>
            {result.maxCTC > 0 && <tr className="border-b border-border/50"><td className="py-2">Child Tax Credit ({result.childElements} child element{result.childElements === 1 ? '' : 's'})</td><td className="text-right tabular-nums">{formatCurrency(result.maxCTC)}</td></tr>}
            {result.childcareElement > 0 && <tr className="border-b border-border/50"><td className="py-2">Childcare Element (70%)</td><td className="text-right tabular-nums">{formatCurrency(result.childcareElement)}</td></tr>}
            <tr className="border-b border-border font-medium"><td className="py-2">Maximum Award</td><td className="text-right tabular-nums">{formatCurrency(result.maxTotal)}</td></tr>
            {result.taper > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income Taper (41% above £{result.threshold.toLocaleString()})</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.taper)}</td></tr>}
            <tr className="font-semibold"><td className="py-2 text-primary">Your Award</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.award)}</td></tr>
          </tbody>
        </table>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Tax Credits were fully replaced by Universal Credit and closed on 5 April 2025. This tool now serves as a historical reference (final 2024/25 rates) — for current entitlement, check Universal Credit.</p>
          <p className="mt-2">Hours rules assume you are aged 25-59 without a disability: 30 hours a week without children, 16 as a lone parent, and 24 combined for a couple with children (one working 16+). The child element is paid for the first two children plus any born before 6 April 2017 (exceptions such as multiple births are not modelled), and the £545 family element only if a child was born before that date.</p>
        </div>
      </div>
    </div>
  )
}
