import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// SMP 2025/26
const SMP_RATE = 187.18 // per week (statutory rate)
const SMP_HIGHER_WEEKS = 6
const SMP_LOWER_WEEKS = 33
const SMP_HIGHER_RATE = 0.90 // 90% of average weekly earnings

function calculate(weeklyPay: number) {
  const higherWeeklyRate = weeklyPay * SMP_HIGHER_RATE
  const lowerWeeklyRate = Math.min(weeklyPay * SMP_HIGHER_RATE, SMP_RATE)
  const actualLowerRate = Math.min(weeklyPay, SMP_RATE)

  const first6Weeks = higherWeeklyRate * SMP_HIGHER_WEEKS
  const next33Weeks = actualLowerRate * SMP_LOWER_WEEKS
  const totalSMP = first6Weeks + next33Weeks

  return {
    weeklyPay, higherWeeklyRate, lowerWeeklyRate: actualLowerRate,
    first6Weeks, next33Weeks, totalSMP,
    unpaidWeeks: 13, // 13 weeks unpaid
    totalWeeksLeave: 52,
  }
}

export default function MaternityPayCalculator() {
  const [weeklyPay, setWeeklyPay] = useState('')

  const w = parseFloat(weeklyPay.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(w), [w])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Average Weekly Earnings (gross)</label>
        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <input type="text" inputMode="numeric" value={weeklyPay} onChange={(e) => setWeeklyPay(e.target.value)} placeholder="600" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <p className="text-xs text-muted-foreground mt-1">Based on your average earnings over the 8 weeks before the qualifying week</p>
      </div>

      {w > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Statutory Maternity Pay (39 weeks)</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalSMP)}</p>
          </div>

          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Period</th><th className="text-right py-2 font-medium text-muted-foreground">Weekly</th><th className="text-right py-2 font-medium text-muted-foreground">Total</th></tr></thead>
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2.5">Weeks 1-6 (90% of pay)</td><td className="text-right tabular-nums">{formatCurrency(result.higherWeeklyRate)}</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.first6Weeks)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5">Weeks 7-39 (statutory or 90%)</td><td className="text-right tabular-nums">{formatCurrency(result.lowerWeeklyRate)}</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.next33Weeks)}</td></tr>
              <tr className="border-b border-border/50 text-muted-foreground"><td className="py-2.5">Weeks 40-52 (unpaid)</td><td className="text-right tabular-nums">£0.00</td><td className="text-right tabular-nums">£0.00</td></tr>
              <tr className="font-semibold"><td className="py-2.5">Total SMP</td><td className="text-right"></td><td className="text-right tabular-nums text-primary">{formatCurrency(result.totalSMP)}</td></tr>
            </tbody>
          </table>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Key facts:</p>
            <p>SMP is paid for up to 39 weeks.</p>
            <p>First 6 weeks: 90% of your average weekly earnings.</p>
            <p>Remaining 33 weeks: £{SMP_RATE}/week or 90% of AWE (whichever is lower).</p>
            <p>You can take up to 52 weeks maternity leave (last 13 weeks unpaid).</p>
          </div>
        </div>
      )}
    </div>
  )
}
