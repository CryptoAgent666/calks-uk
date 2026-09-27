import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// SPP 2026/27
const SPP_RATE = 194.32 // per week or 90% of AWE, whichever is lower
const SPP_WEEKS = 2
const LEL_WEEKLY = 129 // lower earnings limit 2026/27: AWE below this = no SPP

function calculate(weeklyPay: number) {
  const eligible = weeklyPay >= LEL_WEEKLY
  const rate = eligible ? Math.min(weeklyPay * 0.90, SPP_RATE) : 0
  const total = rate * SPP_WEEKS
  const weeklyDrop = Math.max(0, weeklyPay - rate)

  return { rate, total, weeks: SPP_WEEKS, eligible, is90pct: eligible && weeklyPay * 0.90 < SPP_RATE, weeklyDrop, totalDrop: weeklyDrop * SPP_WEEKS }
}

export default function PaternityPayCalculator() {
  const [pay, setPay] = useState('')
  const w = parseFloat(pay.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(w), [w])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Average Weekly Earnings (gross)</label>
        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <input type="text" inputMode="numeric" value={pay} onChange={(e) => setPay(e.target.value)} placeholder="600" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Average Weekly Earnings (gross)" /></div>
      </div>

      {w > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Statutory Paternity Pay ({SPP_WEEKS} weeks)</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.total)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.rate)}/week</p>
          </div>
          {result.eligible && (
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-border/50"><td className="py-2">Normal weekly pay (gross)</td><td className="text-right tabular-nums">{formatCurrency(w)}</td></tr>
                <tr className="border-b border-border/50"><td className="py-2">SPP per week (gross)</td><td className="text-right tabular-nums">{formatCurrency(result.rate)}</td></tr>
                <tr className="font-semibold"><td className="py-2 text-destructive">Drop in gross pay over {SPP_WEEKS} weeks</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.totalDrop)}</td></tr>
              </tbody>
            </table>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            {!result.eligible && <p className="text-orange-600">Average weekly earnings below £{LEL_WEEKLY} do not qualify for SPP. You can still take the 2 weeks of paternity leave, unpaid unless your employer pays more.</p>}
            <p>SPP is paid for <span className="font-medium text-foreground">{SPP_WEEKS} weeks</span>, taken as one block of 2 weeks or two separate 1-week blocks, at any time within 52 weeks of the birth.</p>
            <p>Rate: <span className="font-medium text-foreground">£{SPP_RATE}/week or 90% of AWE</span> (whichever is lower).</p>
            <p>You must earn at least £{LEL_WEEKLY}/week and have 26 weeks' continuous employment by the 15th week before the due week. Tell your employer at least 15 weeks before the due date.</p>
            {result.is90pct && <p className="text-orange-600">Your 90% of AWE ({formatCurrency(w * 0.90)}/week) is lower than the statutory rate, so this applies.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
