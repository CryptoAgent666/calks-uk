import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// SSP 2026/27 — reformed from 6 April 2026 (Employment Rights Act 2025):
// the Lower Earnings Limit is removed (all employees qualify) and the 3 waiting
// days are abolished, so SSP is paid from the first qualifying day.
const SSP_RATE = 123.25 // flat weekly rate (2026/27)
const SSP_WAITING_DAYS = 0 // waiting days abolished from 6 April 2026
const SSP_MAX_WEEKS = 28

// daysOffSick = qualifying days (days you would normally have worked) missed through
// sickness. SSP is paid per qualifying day at the weekly rate divided by the number of
// qualifying days in the week, for up to 28 weeks' worth of qualifying days.
function calculate(weeklyPay: number, daysOffSick: number, daysPerWeek: number) {
  const qualifies = daysOffSick >= 1
  if (!qualifies) return { qualifies, reason: 'Enter at least 1 working day off sick' }

  // No Lower Earnings Limit from 6 April 2026. Low earners receive the lower of the
  // flat rate or 80% of average weekly earnings; everyone else gets the flat rate.
  const weeklyRate = Math.min(SSP_RATE, 0.80 * weeklyPay)
  const dpw = Math.min(Math.max(daysPerWeek, 1), 7)
  const maxPaidDays = SSP_MAX_WEEKS * dpw
  const paidDays = Math.min(Math.max(0, daysOffSick - SSP_WAITING_DAYS), maxPaidDays)
  const dailyRate = weeklyRate / dpw
  const totalSSP = Math.round(paidDays * dailyRate * 100) / 100
  const sickWeeks = Math.floor(paidDays / dpw)
  // Shortfall against normal pay for the same working days
  const normalDailyPay = weeklyPay / dpw
  const normalPay = Math.round(daysOffSick * normalDailyPay * 100) / 100
  const shortfall = Math.max(0, Math.round((normalPay - totalSSP) * 100) / 100)

  return { qualifies, totalSSP, weeklyRate, dailyRate, paidDays, sickWeeks, waitingDays: SSP_WAITING_DAYS, normalPay, shortfall }
}

export default function SickPayCalculator() {
  const [pay, setPay] = useState('500')
  const [days, setDays] = useState('10')
  const [daysPerWeek, setDaysPerWeek] = useState('5')

  const result = useMemo(() => calculate(parseFloat(pay)||0, parseInt(days)||0, parseInt(daysPerWeek)||5), [pay, days, daysPerWeek])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Weekly Pay (gross)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={pay} onChange={(e) => setPay(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weekly Pay (gross)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Working Days Off Sick</label><input type="number" min="0" max="200" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Working days off sick" /><p className="text-xs text-muted-foreground mt-1">Days you would normally have worked, not calendar days</p></div>
        <div><label className="block text-sm font-medium mb-2">Working Days/Week</label><input type="number" min="1" max="7" value={daysPerWeek} onChange={(e) => setDaysPerWeek(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Working Days/Week" /></div>
      </div>

      {result.qualifies && 'totalSSP' in result ? (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Statutory Sick Pay</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalSSP)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.weeklyRate)}/week for up to {SSP_MAX_WEEKS} weeks</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p>SSP is paid from the first qualifying day — the 3 waiting days were abolished on 6 April 2026.</p>
            <p>Rate: <span className="font-medium text-foreground">{formatCurrency(result.weeklyRate)}/week</span> ({formatCurrency(result.dailyRate)}/day for {daysPerWeek}-day week)</p>
            <p>Paid for {result.paidDays} qualifying {result.paidDays === 1 ? 'day' : 'days'}. Maximum: {SSP_MAX_WEEKS} weeks ({SSP_MAX_WEEKS * (parseInt(daysPerWeek) || 5)} qualifying days on this pattern).</p>
            <p>Normal pay for these days: <span className="font-medium text-foreground">{formatCurrency(result.normalPay)}</span> &middot; shortfall compared with SSP: <span className="font-medium text-destructive">{formatCurrency(result.shortfall)}</span></p>
          </div>
        </div>
      ) : !result.qualifies && 'reason' in result && (
        <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-sm text-orange-800 dark:text-orange-300">{result.reason}</div>
      )}
    </div>
  )
}
