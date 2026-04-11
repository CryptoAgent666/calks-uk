import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Tax-Free Childcare: for every £8 you pay, govt adds £2 (max £2,000/child/year)
const TFC_RATIO = 0.25 // govt pays 25% of total (20% of parent contribution)
const TFC_MAX_GOVT = 2_000
const TFC_MAX_DISABLED = 4_000

// 30 hours free childcare (3-4 year olds, 38 weeks term time or stretched to fewer hrs over more weeks)
const FREE_HOURS_PER_WEEK = 30
const FREE_WEEKS = 38
const FREE_TOTAL_HOURS = FREE_HOURS_PER_WEEK * FREE_WEEKS // 1140 hours/year

function calculate(weeklyCost: number, weeksPerYear: number, children: number, use30hrs: boolean, useTFC: boolean) {
  const annualCost = weeklyCost * weeksPerYear * children

  let freeHoursValue = 0
  if (use30hrs) {
    // Estimate hourly rate and deduct free hours
    const hourlyRate = weeklyCost / 30 // assuming 30hrs/week childcare
    freeHoursValue = FREE_TOTAL_HOURS * hourlyRate * children
  }

  const afterFreeHours = Math.max(0, annualCost - freeHoursValue)

  let tfcSaving = 0
  if (useTFC) {
    // TFC: govt pays 20% of what you pay, capped at £2000/child
    tfcSaving = Math.min(afterFreeHours * 0.20, TFC_MAX_GOVT * children)
  }

  const finalCost = afterFreeHours - tfcSaving
  const monthlyCost = finalCost / 12

  return { annualCost, freeHoursValue, afterFreeHours, tfcSaving, finalCost, monthlyCost, totalSaving: annualCost - finalCost }
}

export default function ChildcareCostCalculator() {
  const [weekly, setWeekly] = useState('250')
  const [weeks, setWeeks] = useState('50')
  const [children, setChildren] = useState('1')
  const [free30, setFree30] = useState(false)
  const [tfc, setTfc] = useState(true)

  const w = parseFloat(weekly.replace(/,/g,'')) || 0
  const wk = parseInt(weeks) || 50
  const c = parseInt(children) || 1
  const result = useMemo(() => calculate(w, wk, c, free30, tfc), [w, wk, c, free30, tfc])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Weekly Childcare Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={weekly} onChange={(e) => setWeekly(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Weeks/Year</label><input type="number" min="1" max="52" value={weeks} onChange={(e) => setWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Number of Children</label><input type="number" min="1" max="5" value={children} onChange={(e) => setChildren(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={free30} onChange={(e) => setFree30(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">30 hours free childcare (3-4 year olds, eligible parents)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={tfc} onChange={(e) => setTfc(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Tax-Free Childcare (up to £2,000/child/year from govt)</span></label>
      </div>

      {w > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Your Annual Childcare Cost</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.finalCost)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyCost)}/month</p>
          </div>
          {result.totalSaving > 0 && (
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center">
              <p className="text-xs text-muted-foreground">Total Saving from Govt Support</p>
              <p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalSaving)}/year</p>
            </div>
          )}
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Gross Annual Cost</td><td className="text-right tabular-nums">{formatCurrency(result.annualCost)}</td></tr>
              {result.freeHoursValue > 0 && <tr className="border-b border-border/50"><td className="py-2 text-green-600">30 hours free childcare</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(result.freeHoursValue)}</td></tr>}
              {result.tfcSaving > 0 && <tr className="border-b border-border/50"><td className="py-2 text-green-600">Tax-Free Childcare</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(result.tfcSaving)}</td></tr>}
              <tr className="font-semibold"><td className="py-2 text-primary">You Pay</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.finalCost)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
