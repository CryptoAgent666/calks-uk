import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Working Tax Credit 2026/27 (legacy - being replaced by UC but still exists for some)
// Uprated by 1.7% CPI from April 2025
const WTC_BASIC = 2_476        // was £2,435 in 2024/25
const WTC_COUPLES = 2_543      // was £2,500 in 2024/25
const WTC_30HR = 1_032         // was £1,015 in 2024/25
const WTC_DISABILITY = 4_124   // was £4,055 in 2024/25
const WTC_CHILDCARE_70 = 0.70 // 70% of childcare costs
const WTC_CHILDCARE_MAX_1 = 175 * 52 // max weekly for 1 child
const WTC_CHILDCARE_MAX_2 = 300 * 52

const CTC_PER_CHILD = 3_455    // child element per child (2026/27, uprated from 2024/25)
const CTC_FAMILY = 545         // family element (frozen)

const INCOME_THRESHOLD = 7_582 // was £7,455 in 2024/25
const TAPER_RATE = 0.41

function calculate(hoursPerWeek: number, isCouple: boolean, children: number, income: number, weeklyChildcare: number) {
  let maxWTC = WTC_BASIC
  if (isCouple) maxWTC += WTC_COUPLES
  if (hoursPerWeek >= 30) maxWTC += WTC_30HR

  let maxCTC = 0
  if (children > 0) {
    maxCTC = CTC_FAMILY + CTC_PER_CHILD * children
  }

  const childcareElement = Math.min(weeklyChildcare * 52, children > 1 ? WTC_CHILDCARE_MAX_2 : WTC_CHILDCARE_MAX_1) * WTC_CHILDCARE_70

  const maxTotal = maxWTC + maxCTC + childcareElement
  const excessIncome = Math.max(0, income - INCOME_THRESHOLD)
  const taper = excessIncome * TAPER_RATE
  const award = Math.max(0, maxTotal - taper)

  return { maxWTC, maxCTC, childcareElement, maxTotal, taper, award, monthly: award / 12, weekly: award / 52 }
}

export default function TaxWorkingCreditsCalculator() {
  const [hours, setHours] = useState('30')
  const [couple, setCouple] = useState(false)
  const [children, setChildren] = useState('2')
  const [income, setIncome] = useState('20000')
  const [childcare, setChildcare] = useState('100')

  const h = parseInt(hours) || 0
  const c = parseInt(children) || 0
  const i = parseFloat(income.replace(/,/g,'')) || 0
  const cc = parseFloat(childcare) || 0
  const result = useMemo(() => calculate(h, couple, c, i, cc), [h, couple, c, i, cc])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Hours/Week</label><input type="number" min="16" max="60" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours/Week" /></div>
        <div><label className="block text-sm font-medium mb-2">Children</label><input type="number" min="0" max="10" value={children} onChange={(e) => setChildren(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Children" /></div>
        <div><label className="block text-sm font-medium mb-2">Annual Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Weekly Childcare (£)</label><input type="number" min="0" max="500" value={childcare} onChange={(e) => setChildcare(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weekly Childcare (£)" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={couple} onChange={(e) => setCouple(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Couple (both working 16+ hours)</span></label>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Annual Award</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.award)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthly)}/month &middot; {formatCurrency(result.weekly)}/week</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2">Working Tax Credit</td><td className="text-right tabular-nums">{formatCurrency(result.maxWTC)}</td></tr>
            {result.maxCTC > 0 && <tr className="border-b border-border/50"><td className="py-2">Child Tax Credit</td><td className="text-right tabular-nums">{formatCurrency(result.maxCTC)}</td></tr>}
            {result.childcareElement > 0 && <tr className="border-b border-border/50"><td className="py-2">Childcare Element (70%)</td><td className="text-right tabular-nums">{formatCurrency(result.childcareElement)}</td></tr>}
            <tr className="border-b border-border font-medium"><td className="py-2">Maximum Award</td><td className="text-right tabular-nums">{formatCurrency(result.maxTotal)}</td></tr>
            {result.taper > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income Taper (41%)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.taper)}</td></tr>}
            <tr className="font-semibold"><td className="py-2 text-primary">Your Award</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.award)}</td></tr>
          </tbody>
        </table>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Tax Credits are being replaced by Universal Credit. You can't make a new claim — this is for existing claimants only. If your circumstances change, you'll be moved to UC.</p>
        </div>
      </div>
    </div>
  )
}
