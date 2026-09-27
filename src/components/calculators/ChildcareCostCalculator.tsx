import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Tax-Free Childcare: for every £8 you pay, govt adds £2 (max £2,000/child/year)
// i.e. govt pays 20% of the provider's bill (25% on top of the parent's 80%)
const TFC_RATE = 0.20
const TFC_MAX_GOVT = 2_000

// Funded hours in England: 15 hours for every 3-4 year old; 30 hours for working parents from 9 months (since Sept 2025).
// Both are for 38 weeks a year (term time) or stretched over more weeks at fewer hours.
const FREE_WEEKS = 38

// Universal Credit childcare element 2026/27: up to 85% of costs, monthly caps
const UC_RATE = 0.85
const UC_CAP_ONE = 1_071.09
const UC_CAP_TWO_PLUS = 1_836.16

function calculate(weeklyCost: number, weeksPerYear: number, children: number, freeHoursPerWeek: number, useTFC: boolean, hoursPerWeek = 50) {
  const annualCost = weeklyCost * weeksPerYear * children

  let freeHoursValue = 0
  if (freeHoursPerWeek > 0 && hoursPerWeek > 0) {
    // Value funded hours at the setting's own hourly rate, for the weeks the child actually attends (max 38)
    const hourlyRate = weeklyCost / hoursPerWeek
    const fundedHours = Math.min(freeHoursPerWeek, hoursPerWeek) * Math.min(FREE_WEEKS, weeksPerYear)
    freeHoursValue = fundedHours * hourlyRate * children
  }

  const afterFreeHours = Math.max(0, annualCost - freeHoursValue)

  let tfcSaving = 0
  if (useTFC) {
    // TFC: govt pays 20% of the bill, capped at £2,000 per child
    tfcSaving = Math.min(afterFreeHours * TFC_RATE, TFC_MAX_GOVT * children)
  }

  const finalCost = afterFreeHours - tfcSaving
  const monthlyCost = finalCost / 12

  // Comparison only: the most the UC childcare element could repay on the same bill (cannot be claimed alongside TFC)
  const ucMonthlyCap = children >= 2 ? UC_CAP_TWO_PLUS : UC_CAP_ONE
  const ucMax = Math.min((afterFreeHours / 12) * UC_RATE, ucMonthlyCap) * 12

  return { annualCost, freeHoursValue, afterFreeHours, tfcSaving, finalCost, monthlyCost, totalSaving: annualCost - finalCost, ucMax, ucMonthlyCap }
}

export default function ChildcareCostCalculator() {
  const [weekly, setWeekly] = useState('250')
  const [hours, setHours] = useState('50')
  const [weeks, setWeeks] = useState('50')
  const [children, setChildren] = useState('1')
  const [freeHours, setFreeHours] = useState('0')
  const [tfc, setTfc] = useState(true)

  const w = parseFloat(weekly.replace(/,/g,'')) || 0
  const h = parseFloat(hours) || 50
  const wk = parseInt(weeks) || 50
  const c = parseInt(children) || 1
  const fh = parseInt(freeHours) || 0
  const result = useMemo(() => calculate(w, wk, c, fh, tfc, h), [w, wk, c, fh, tfc, h])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Weekly Childcare Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={weekly} onChange={(e) => setWeekly(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weekly Childcare Cost" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Hours/Week</label><input type="number" min="1" max="60" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours of childcare per week" /></div>
        <div><label className="block text-sm font-medium mb-2">Weeks/Year</label><input type="number" min="1" max="52" value={weeks} onChange={(e) => setWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weeks/Year" /></div>
        <div><label className="block text-sm font-medium mb-2">Number of Children</label><input type="number" min="1" max="5" value={children} onChange={(e) => setChildren(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number of Children" /></div>
      </div>
      <div className="space-y-2">
        <div>
          <label htmlFor="cc-free" className="block text-sm font-medium mb-2">Funded hours (England, 38 weeks a year)</label>
          <select id="cc-free" value={freeHours} onChange={(e) => setFreeHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Funded hours">
            <option value="0">None</option>
            <option value="15">15 hours (every 3 and 4-year-old)</option>
            <option value="30">30 hours (working parents, children from 9 months)</option>
          </select>
        </div>
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
              {result.freeHoursValue > 0 && <tr className="border-b border-border/50"><td className="py-2 text-green-600">{fh} funded hours ({formatCurrency(w / h)}/hour)</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(result.freeHoursValue)}</td></tr>}
              {result.tfcSaving > 0 && <tr className="border-b border-border/50"><td className="py-2 text-green-600">Tax-Free Childcare</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(result.tfcSaving)}</td></tr>}
              <tr className="font-semibold"><td className="py-2 text-primary">You Pay</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.finalCost)}</td></tr>
            </tbody>
          </table>
          {result.afterFreeHours > 0 && (
            <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
              <p>For comparison, the Universal Credit childcare element could repay up to <span className="font-medium text-foreground">{formatCurrency(result.ucMax)}/year</span> of the same bill (85% of costs, capped at {formatCurrency(result.ucMonthlyCap)} a month for {c >= 2 ? 'two or more children' : 'one child'}). You cannot get it and Tax-Free Childcare at the same time.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
