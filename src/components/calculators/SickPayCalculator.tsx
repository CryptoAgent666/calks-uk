import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// SSP 2026/27 — reformed from 6 April 2026 (Employment Rights Act 2025):
// the Lower Earnings Limit is removed (all employees qualify) and the 3 waiting
// days are abolished, so SSP is paid from the first qualifying day.
const SSP_RATE = 123.25 // flat weekly rate (2026/27)
const SSP_WAITING_DAYS = 0 // waiting days abolished from 6 April 2026
const SSP_MAX_WEEKS = 28

function calculate(weeklyPay: number, daysSick: number, daysPerWeek: number) {
  const qualifies = daysSick >= 1
  if (!qualifies) return { qualifies, reason: 'Enter at least 1 day of sickness' }

  // No Lower Earnings Limit from 6 April 2026. Low earners receive the lower of the
  // flat rate or 80% of average weekly earnings; everyone else gets the flat rate.
  const weeklyRate = Math.min(SSP_RATE, 0.80 * weeklyPay)
  // The input is consecutive *calendar* days, so convert to working days first.
  const dpw = Math.min(Math.max(daysPerWeek, 1), 7)
  const workingDaysSick = Math.round(daysSick * dpw / 7)
  const maxPaidDays = SSP_MAX_WEEKS * dpw
  const paidDays = Math.min(Math.max(0, workingDaysSick - SSP_WAITING_DAYS), maxPaidDays)
  const dailyRate = weeklyRate / dpw
  const totalSSP = paidDays * dailyRate
  const sickWeeks = Math.floor(paidDays / dpw)

  return { qualifies, totalSSP, weeklyRate, dailyRate, paidDays, sickWeeks, waitingDays: SSP_WAITING_DAYS }
}

export default function SickPayCalculator() {
  const [pay, setPay] = useState('500')
  const [days, setDays] = useState('14')
  const [daysPerWeek, setDaysPerWeek] = useState('5')

  const result = useMemo(() => calculate(parseFloat(pay)||0, parseInt(days)||0, parseInt(daysPerWeek)||5), [pay, days, daysPerWeek])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Weekly Pay (gross)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={pay} onChange={(e) => setPay(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weekly Pay (gross)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Days Sick (consecutive)</label><input type="number" min="0" max="200" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Days Sick (consecutive)" /></div>
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
            <p>Maximum: {SSP_MAX_WEEKS} weeks ({SSP_MAX_WEEKS * 7} days).</p>
          </div>
        </div>
      ) : !result.qualifies && 'reason' in result && (
        <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-sm text-orange-800 dark:text-orange-300">{result.reason}</div>
      )}
    </div>
  )
}
