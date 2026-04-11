import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// SSP 2025/26
const SSP_RATE = 118.75 // per week
const SSP_WAITING_DAYS = 3
const SSP_MAX_WEEKS = 28
const SSP_LOWER_EARNINGS = 125 // weekly minimum to qualify

function calculate(weeklyPay: number, daysSick: number, daysPerWeek: number) {
  const qualifies = weeklyPay >= SSP_LOWER_EARNINGS && daysSick >= 4
  if (!qualifies) return { qualifies, reason: daysSick < 4 ? 'Must be sick for 4+ consecutive days (including non-working days)' : `Weekly earnings must be at least £${SSP_LOWER_EARNINGS}` }

  const sickWeeks = Math.min(Math.floor((daysSick - SSP_WAITING_DAYS) / 7), SSP_MAX_WEEKS)
  const remainingDays = Math.max(0, (daysSick - SSP_WAITING_DAYS) % 7)
  const dailyRate = SSP_RATE / daysPerWeek
  const totalSSP = sickWeeks * SSP_RATE + Math.min(remainingDays, daysPerWeek) * dailyRate

  return { qualifies, totalSSP, weeklyRate: SSP_RATE, dailyRate, sickWeeks, waitingDays: SSP_WAITING_DAYS }
}

export default function SickPayCalculator() {
  const [pay, setPay] = useState('500')
  const [days, setDays] = useState('14')
  const [daysPerWeek, setDaysPerWeek] = useState('5')

  const result = useMemo(() => calculate(parseFloat(pay)||0, parseInt(days)||0, parseInt(daysPerWeek)||5), [pay, days, daysPerWeek])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Weekly Pay (gross)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={pay} onChange={(e) => setPay(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Days Sick (consecutive)</label><input type="number" min="0" max="200" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Working Days/Week</label><input type="number" min="1" max="7" value={daysPerWeek} onChange={(e) => setDaysPerWeek(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {result.qualifies && 'totalSSP' in result ? (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Statutory Sick Pay</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalSSP)}</p>
            <p className="text-sm text-muted-foreground mt-1">£{SSP_RATE}/week for up to {SSP_MAX_WEEKS} weeks</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p>SSP is paid after {SSP_WAITING_DAYS} waiting days (not paid for first 3 qualifying days).</p>
            <p>Rate: <span className="font-medium text-foreground">£{SSP_RATE}/week</span> ({formatCurrency(result.dailyRate)}/day for {daysPerWeek}-day week)</p>
            <p>Maximum: {SSP_MAX_WEEKS} weeks ({SSP_MAX_WEEKS * 7} days).</p>
          </div>
        </div>
      ) : !result.qualifies && 'reason' in result && (
        <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-sm text-orange-800 dark:text-orange-300">{result.reason}</div>
      )}
    </div>
  )
}
