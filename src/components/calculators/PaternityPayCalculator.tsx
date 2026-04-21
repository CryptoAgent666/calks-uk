import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// SPP 2026/27
const SPP_RATE = 194.32 // per week or 90% of AWE, whichever is lower
const SPP_WEEKS = 2

function calculate(weeklyPay: number) {
  const rate = Math.min(weeklyPay * 0.90, SPP_RATE)
  const total = rate * SPP_WEEKS

  return { rate, total, weeks: SPP_WEEKS, is90pct: weeklyPay * 0.90 < SPP_RATE }
}

export default function PaternityPayCalculator() {
  const [pay, setPay] = useState('')
  const w = parseFloat(pay) || 0
  const result = useMemo(() => calculate(w), [w])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Average Weekly Earnings (gross)</label>
        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <input type="number" min="0" value={pay} onChange={(e) => setPay(e.target.value)} placeholder="600" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {w > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Statutory Paternity Pay ({SPP_WEEKS} weeks)</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.total)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.rate)}/week</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p>SPP is paid for <span className="font-medium text-foreground">{SPP_WEEKS} weeks</span> (can be taken as 1 or 2 consecutive weeks).</p>
            <p>Rate: <span className="font-medium text-foreground">£{SPP_RATE}/week or 90% of AWE</span> (whichever is lower).</p>
            <p>You must earn at least £125/week and give 15 weeks' notice before the due date.</p>
            {result.is90pct && <p className="text-orange-600">Your 90% of AWE ({formatCurrency(w * 0.90)}/week) is lower than the statutory rate, so this applies.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
