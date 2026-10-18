import { useState, useMemo } from 'react'
import { formatCurrency, ukIncomeTax } from '@/utils'

// 2026/27: employee Class 1 NI 8% between £12,570 and £50,270, 2% above. Auto-enrolment minimum
// employee contribution 5% of qualifying earnings between £6,240 and £50,270 (frozen for 2026/27).
const NI_PT = 12_570
const NI_UEL = 50_270
const AE_LOWER = 6_240
const AE_UPPER = 50_270
const AE_EMPLOYEE_RATE = 0.05

function calculate(chargeRate: number, hoursPerWeek: number, weeksPerYear: number, agencyMarginPct: number, comparatorRate: number) {
  const weeklyCharge = chargeRate * hoursPerWeek
  const annualCharge = weeklyCharge * weeksPerYear
  const agencyMargin = annualCharge * (agencyMarginPct / 100)
  const grossPay = annualCharge - agencyMargin
  const grossHourly = chargeRate * (1 - agencyMarginPct / 100)

  // PAYE deductions
  const tax = ukIncomeTax(grossPay)
  let ni = 0
  if (grossPay > NI_PT) ni = (Math.min(grossPay, NI_UEL) - NI_PT) * 0.08 + Math.max(0, grossPay - NI_UEL) * 0.02
  const pension = AE_EMPLOYEE_RATE * Math.max(0, Math.min(grossPay, AE_UPPER) - AE_LOWER)
  const takeHome = grossPay - tax - ni - pension

  const effectiveHourly = takeHome / (hoursPerWeek * weeksPerYear)

  // Equal treatment after 12 weeks (Agency Workers Regulations 2010 reg 5): the weekly uplift if a
  // directly recruited colleague's hourly rate is above your gross hourly rate
  const upliftPerHour = comparatorRate > 0 ? Math.max(0, comparatorRate - grossHourly) : 0
  const upliftPerWeek = upliftPerHour * hoursPerWeek

  return {
    annualCharge, agencyMargin, grossPay, grossHourly, tax, ni, pension, takeHome, effectiveHourly,
    weeklyTakeHome: takeHome / weeksPerYear,
    upliftPerHour, upliftPerWeek, upliftPerYear: upliftPerWeek * weeksPerYear,
  }
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function AgencyWorkerCalculator() {
  const [rate, setRate] = useState('18')
  const [hours, setHours] = useState('37.5')
  const [weeks, setWeeks] = useState('48')
  const [margin, setMargin] = useState('20')
  const [comparator, setComparator] = useState('')

  const r = parseFloat(rate) || 0
  const h = parseFloat(hours) || 0
  const w = parseInt(weeks) || 0
  const m = parseFloat(margin) || 0
  const cmp = parseFloat(comparator) || 0
  const result = useMemo(() => calculate(r, h, w, m, cmp), [r, h, w, m, cmp])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label htmlFor="aw-rate" className="block text-sm font-medium mb-2">Charge Rate (£/hr)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input id="aw-rate" type="number" min="0" step="0.5" value={rate} onChange={(e) => setRate(e.target.value)} className={`${inputClass} px-8 text-lg`} aria-label="Charge Rate (£/hr)" /></div></div>
        <div><label htmlFor="aw-hours" className="block text-sm font-medium mb-2">Hours/Week</label><input id="aw-hours" type="number" min="1" max="60" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className={inputClass} aria-label="Hours/Week" /></div>
        <div><label htmlFor="aw-weeks" className="block text-sm font-medium mb-2">Weeks/Year</label><input id="aw-weeks" type="number" min="1" max="52" value={weeks} onChange={(e) => setWeeks(e.target.value)} className={inputClass} aria-label="Weeks/Year" /></div>
        <div><label htmlFor="aw-margin" className="block text-sm font-medium mb-2">Agency Margin (%)</label><input id="aw-margin" type="number" min="0" max="40" value={margin} onChange={(e) => setMargin(e.target.value)} className={inputClass} aria-label="Agency Margin (%)" /></div>
        <div className="col-span-2"><label htmlFor="aw-comparator" className="block text-sm font-medium mb-2">Comparable permanent hourly rate after 12 weeks (optional)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input id="aw-comparator" type="number" min="0" step="0.5" value={comparator} onChange={(e) => setComparator(e.target.value)} placeholder="e.g. 14.50" className={`${inputClass} px-8`} aria-label="Comparable permanent hourly rate after 12 weeks" /></div></div>
      </div>

      {r > 0 && h > 0 && w > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Annual Take-Home</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.takeHome)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.weeklyTakeHome)}/week &middot; Effective: {formatCurrency(result.effectiveHourly)}/hr</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Client pays (charge rate)</td><td className="text-right tabular-nums">{formatCurrency(result.annualCharge)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Agency margin ({m}%)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.agencyMargin)}</td></tr>
              <tr className="border-b border-border font-medium"><td className="py-2">Your Gross Pay</td><td className="text-right tabular-nums">{formatCurrency(result.grossPay)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Your gross hourly rate</td><td className="text-right tabular-nums">{formatCurrency(result.grossHourly)}/hr</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income Tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.tax)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">NI</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.ni)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Pension (5% of qualifying earnings)</td><td className="text-right tabular-nums">-{formatCurrency(result.pension)}</td></tr>
              <tr className="font-semibold"><td className="py-2 text-primary">Take-Home</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.takeHome)}</td></tr>
            </tbody>
          </table>
          {cmp > 0 && (
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center">
              {result.upliftPerWeek > 0 ? (
                <>
                  <p className="text-xs text-muted-foreground">Equal-pay uplift after 12 weeks</p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.upliftPerWeek)}/week</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatCurrency(cmp)}/hr for a directly recruited colleague against your {formatCurrency(result.grossHourly)}/hr gross, × {h} hours; {formatCurrency(result.upliftPerYear)} over {w} weeks</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Your gross rate of {formatCurrency(result.grossHourly)}/hr already matches or beats the comparable permanent rate of {formatCurrency(cmp)}/hr, so the 12-week equal-pay rule adds nothing.</p>
              )}
            </div>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>After 12 weeks in the same role with the same hirer you are entitled to the same basic pay, overtime rates, holiday and rest breaks as someone recruited directly (Agency Workers Regulations 2010). Pension is the 5% auto-enrolment minimum employee contribution on qualifying earnings between £6,240 and £50,270; your scheme may differ, and you can opt out.</p>
          </div>
        </div>
      )}
    </div>
  )
}
