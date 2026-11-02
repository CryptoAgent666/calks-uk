import { useState, useMemo } from 'react'
import { formatCurrency, ukIncomeTax } from '@/utils'

type HolidayMode = 'rolled' | 'leave'

const HOLIDAY_RATE = 0.1207
const MAX_LEAVE_WEEKS = 5.6 // irregular-hours workers build up to 5.6 weeks of statutory leave
// Employee Class 1 NI 2026/27, per week
const NI_PT_WEEK = 242
const NI_UEL_WEEK = 967
// Auto-enrolment 2026/27, frozen (The Pensions Regulator)
const PENSION_TRIGGER = 10_000
const PENSION_BAND_LOWER = 6_240
const PENSION_BAND_UPPER = 50_270
const PENSION_EMPLOYEE_RATE = 0.05

function weeklyNi(pay: number) {
  if (pay <= NI_PT_WEEK) return 0
  return (Math.min(pay, NI_UEL_WEEK) - NI_PT_WEEK) * 0.08 + Math.max(0, pay - NI_UEL_WEEK) * 0.02
}

function calculate(hourlyRate: number, avgHoursWeek: number, weeksPerYear: number, mode: HolidayMode, pensionOn: boolean) {
  const weeklyPay = hourlyRate * avgHoursWeek
  const workPay = weeklyPay * weeksPerYear
  // 12.07% of what is worked, up to the 5.6 weeks a year the leave is capped at
  const leaveWeeks = Math.min(weeksPerYear * HOLIDAY_RATE, MAX_LEAVE_WEEKS)
  const holidayPay = leaveWeeks * weeklyPay
  const annualPay = workPay + holidayPay
  const monthlyPay = annualPay / 12

  // NMW check
  const nmw = 12.71
  const meetsNMW = hourlyRate >= nmw

  const tax = ukIncomeTax(annualPay)

  // NI is charged pay period by pay period, here on a typical week: rolled-up holiday
  // lifts each working week's pay, while leave taken adds further weeks at normal pay
  const ni = mode === 'rolled'
    ? weeklyNi(weeklyPay + holidayPay / (weeksPerYear || 1)) * weeksPerYear
    : weeklyNi(weeklyPay) * (weeksPerYear + leaveWeeks)

  const belowTrigger = annualPay < PENSION_TRIGGER
  const pension = pensionOn && !belowTrigger
    ? Math.max(0, Math.min(annualPay, PENSION_BAND_UPPER) - PENSION_BAND_LOWER) * PENSION_EMPLOYEE_RATE
    : 0

  const takeHome = annualPay - tax - ni - pension
  const overYear = mode === 'leave' && weeksPerYear + leaveWeeks > 52

  return { weeklyPay, workPay, monthlyPay, annualPay, holidayPay, leaveWeeks, meetsNMW, nmw, tax, ni, pension, belowTrigger, takeHome, overYear }
}

export default function ZeroHoursCalculator() {
  const [rate, setRate] = useState('12.71')
  const [hours, setHours] = useState('20')
  const [weeks, setWeeks] = useState('46')
  const [mode, setMode] = useState<HolidayMode>('rolled')
  const [pensionOn, setPensionOn] = useState(true)

  const r = parseFloat(rate) || 0
  const h = parseFloat(hours) || 0
  const w = parseInt(weeks) || 46
  const result = useMemo(() => calculate(r, h, w, mode, pensionOn), [r, h, w, mode, pensionOn])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Hourly Rate</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hourly Rate" /></div>{!result.meetsNMW && r > 0 && <p className="text-xs text-destructive mt-1">Below the £{result.nmw}/hr National Living Wage for ages 21+ (£10.85 at 18-20, £8.00 under 18 and apprentices)</p>}</div>
        <div><label className="block text-sm font-medium mb-2">Hours in a Week You Work</label><input type="number" min="0" max="60" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours in a week you work" /></div>
        <div><label className="block text-sm font-medium mb-2">Weeks Worked/Year</label><input type="number" min="1" max="52" value={weeks} onChange={(e) => setWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weeks Worked/Year" /><p className="text-xs text-muted-foreground mt-1">Uneven hours: the same yearly total in fewer, busier weeks costs more NI. Compare 40 hours × 23 weeks with 20 × 46.</p></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Holiday Pay</label><select value={mode} onChange={(e) => setMode(e.target.value as HolidayMode)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Holiday pay"><option value="rolled">Rolled up in each pay packet</option><option value="leave">Built up and paid when you take leave</option></select></div>
        <label className="flex items-center gap-3 cursor-pointer sm:mt-8"><input type="checkbox" checked={pensionOn} onChange={(e) => setPensionOn(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Auto-enrolled workplace pension (untick if under 22, over State Pension age or opted out)</span></label>
      </div>

      {r > 0 && h > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Annual Take-Home</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.takeHome)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.takeHome / 12)}/month &middot; {formatCurrency(result.weeklyPay)}/week gross before holiday pay</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Annual Gross incl. Holiday</p><p className="text-lg font-bold">{formatCurrency(result.annualPay)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">of which Holiday Pay</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.holidayPay)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-3 text-center"><p className="text-xs text-muted-foreground">Income Tax</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.tax)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-3 text-center"><p className="text-xs text-muted-foreground">NI</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.ni)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-3 text-center"><p className="text-xs text-muted-foreground">Pension (5%)</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.pension)}</p></div>
          </div>
          {result.overYear && <p className="text-sm text-destructive">Your working weeks plus {result.leaveWeeks.toFixed(1)} weeks of leave come to more than 52, so lower the weeks worked.</p>}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Zero-hours workers are entitled to: NMW (£{result.nmw}/hr for 21+), up to 5.6 weeks holiday (accrued at 12.07% of hours worked), rest breaks, protection from discrimination. Employer cannot require exclusivity.</p>
            <p className="mt-2">NI is worked out per week, as if every week you work has the same hours; income tax is on the yearly total. Rates are for England, Wales and Northern Ireland.</p>
            <p className="mt-2">{result.belowTrigger ? `Yearly pay under the £10,000 trigger, so no pension is deducted here. Your employer need not auto-enrol you unless pay in a pay period passes the trigger (£192 a week), and you can still ask to join.` : `Pension is 5% of yearly pay between £6,240 and £50,270, before any tax relief. Auto-enrolment applies from age 22 to State Pension age once pay reaches £10,000 a year (£192 a week), and you can opt out.`}</p>
          </div>
        </div>
      )}
    </div>
  )
}
