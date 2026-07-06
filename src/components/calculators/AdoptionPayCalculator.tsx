import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Statutory Adoption Pay 2026/27 — mirrors SMP:
// 6 weeks at 90% of average weekly earnings, then 33 weeks at the statutory
// rate (or 90% of AWE if lower). Adoption leave runs up to 52 weeks
// (the final 13 unpaid).
const SAP_RATE = 194.32
const HIGHER_WEEKS = 6
const LOWER_WEEKS = 33

function calculate(monthlyPay: number) {
  if (monthlyPay <= 0) return null
  const awe = (monthlyPay * 12) / 52

  const higherWeekly = awe * 0.9
  const lowerWeekly = Math.min(awe * 0.9, SAP_RATE)

  const first6 = higherWeekly * HIGHER_WEEKS
  const next33 = lowerWeekly * LOWER_WEEKS
  const total = first6 + next33

  return { awe, higherWeekly, lowerWeekly, first6, next33, total }
}

export default function AdoptionPayCalculator() {
  const [pay, setPay] = useState('2,600')

  const p = parseFloat(pay.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(p), [p])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Gross Monthly Pay</label>
        <div className="relative max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <input type="text" inputMode="numeric" value={pay} onChange={(e) => setPay(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Gross Monthly Pay" />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Average pay in the 8 weeks before the matching week</p>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Statutory Adoption Pay (39 weeks)</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.total)}</p>
            <p className="text-sm text-muted-foreground mt-1">before tax and National Insurance</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground">Period</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Weekly</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-2.5">Weeks 1–6 (90% of earnings)</td>
                  <td className="text-right py-2.5 tabular-nums">{formatCurrency(result.higherWeekly)}</td>
                  <td className="text-right py-2.5 tabular-nums font-medium">{formatCurrency(result.first6)}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5">Weeks 7–39 (statutory rate or 90%)</td>
                  <td className="text-right py-2.5 tabular-nums">{formatCurrency(result.lowerWeekly)}</td>
                  <td className="text-right py-2.5 tabular-nums font-medium">{formatCurrency(result.next33)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-muted-foreground">Weeks 40–52 (optional leave)</td>
                  <td className="text-right py-2.5 tabular-nums text-muted-foreground">Unpaid</td>
                  <td className="text-right py-2.5 tabular-nums text-muted-foreground">£0</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>
              To qualify: 26 weeks with your employer by the matching week (UK adoptions) and average earnings at or above the
              Lower Earnings Limit. Only one parent takes adoption leave — the other may qualify for{' '}
              <a href="/calculator/paternity-pay-calculator/" className="text-primary underline">paternity pay</a> or{' '}
              <a href="/calculator/shared-parental-pay-calculator/" className="text-primary underline">shared parental pay</a>.
              Fostering-to-adopt and overseas adoptions have their own timing rules.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
