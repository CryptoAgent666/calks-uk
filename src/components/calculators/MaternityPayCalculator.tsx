import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// SMP 2026/27
const SMP_RATE = 194.32 // per week (statutory rate)
const SMP_HIGHER_WEEKS = 6
const SMP_LOWER_WEEKS = 33
const SMP_HIGHER_RATE = 0.90 // 90% of average weekly earnings
const SMP_LEL = 129 // Lower Earnings Limit 2026/27: AWE below this means no SMP
// Maternity Allowance 2026/27 (employed or recently stopped work): lower of the standard
// rate or 90% of AWE for up to 39 weeks. The employed test is 26 of the 66 weeks before
// the due week, earning at least £30 a week in any 13 of them.
const MA_RATE = 194.32
const MA_WEEKS = 39
const MA_MIN_WEEKLY_EARNINGS = 30

function maternityAllowance(weeklyPay: number) {
  if (weeklyPay < MA_MIN_WEEKLY_EARNINGS) return { maWeekly: 0, maTotal: 0 }
  const maWeekly = Math.round(Math.min(MA_RATE, weeklyPay * SMP_HIGHER_RATE) * 100) / 100
  return { maWeekly, maTotal: Math.round(maWeekly * MA_WEEKS * 100) / 100 }
}

function calculate(weeklyPay: number) {
  const eligible = weeklyPay >= SMP_LEL
  if (!eligible) {
    return {
      eligible, weeklyPay, higherWeeklyRate: 0, lowerWeeklyRate: 0,
      first6Weeks: 0, next33Weeks: 0, totalSMP: 0,
      unpaidWeeks: 13, totalWeeksLeave: 52,
      ...maternityAllowance(weeklyPay),
    }
  }
  const higherWeeklyRate = weeklyPay * SMP_HIGHER_RATE
  const actualLowerRate = Math.min(weeklyPay * SMP_HIGHER_RATE, SMP_RATE) // 90% of AWE or SMP rate, whichever is lower

  const first6Weeks = higherWeeklyRate * SMP_HIGHER_WEEKS
  const next33Weeks = actualLowerRate * SMP_LOWER_WEEKS
  const totalSMP = first6Weeks + next33Weeks

  return {
    eligible, weeklyPay, higherWeeklyRate, lowerWeeklyRate: actualLowerRate,
    first6Weeks, next33Weeks, totalSMP,
    unpaidWeeks: 13, // 13 weeks unpaid
    totalWeeksLeave: 52,
    maWeekly: 0, maTotal: 0,
  }
}

export default function MaternityPayCalculator() {
  const [weeklyPay, setWeeklyPay] = useState('600')

  const w = parseFloat(weeklyPay.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(w), [w])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Average Weekly Earnings (gross)</label>
        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <input type="text" inputMode="numeric" value={weeklyPay} onChange={(e) => setWeeklyPay(e.target.value)} placeholder="600" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Average Weekly Earnings (gross)" /></div>
        <p className="text-xs text-muted-foreground mt-1">Based on your average earnings over the 8 weeks before the qualifying week</p>
      </div>

      {w > 0 && !result.eligible && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-orange-100 dark:bg-orange-950 p-6 text-center">
            <p className="text-lg font-bold text-orange-800 dark:text-orange-300">Not eligible for SMP</p>
            <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">Average weekly earnings of {formatCurrency(w)} are below the {formatCurrency(SMP_LEL)} Lower Earnings Limit, so Statutory Maternity Pay is £0. You may get Maternity Allowance instead.</p>
          </div>
          {result.maTotal > 0 ? (
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">Estimated Maternity Allowance ({MA_WEEKS} weeks)</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(result.maTotal)}</p>
              <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.maWeekly)}/week: the lower of {formatCurrency(MA_RATE)} or 90% of your average weekly earnings</p>
            </div>
          ) : (
            <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">Maternity Allowance for employees needs earnings of at least {formatCurrency(MA_MIN_WEEKLY_EARNINGS)} a week in 13 of the 66 weeks before the due week. Check gov.uk/maternity-allowance for the self-employed and other routes.</div>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>To get Maternity Allowance you must have been employed or self-employed for at least 26 of the 66 weeks before the week your baby is due, earning at least £30 a week in any 13 of those weeks. You claim it from Jobcentre Plus on form MA1.</p>
          </div>
        </div>
      )}

      {w > 0 && result.eligible && (
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
            <p>SMP is paid for up to 39 weeks if your average weekly earnings are at least {formatCurrency(SMP_LEL)}.</p>
            <p>First 6 weeks: 90% of your average weekly earnings.</p>
            <p>Remaining 33 weeks: £{SMP_RATE}/week or 90% of AWE (whichever is lower).</p>
            <p>You can take up to 52 weeks maternity leave (last 13 weeks unpaid).</p>
          </div>
        </div>
      )}
    </div>
  )
}
