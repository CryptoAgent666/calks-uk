import { useState } from 'react'

const QUICK_RATES = [2, 3, 4, 5, 6, 7, 8, 10, 12, 15]

export default function Rule72Calculator() {
  const [rate, setRate] = useState('7')
  const [targetYears, setTargetYears] = useState('10')

  const r = parseFloat(rate) || 0
  const y = parseFloat(targetYears) || 0
  // At 0% or a negative rate money never doubles, so no figure is shown.
  const doubles = r > 0
  const doublingYears = doubles ? 72 / r : 0
  const exact = doubles ? Math.log(2) / Math.log(1 + r / 100) : 0
  const rateNeeded = y > 0 ? 72 / y : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Interest / Growth Rate (%)</label><input type="number" min="0.1" max="50" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Interest / Growth Rate (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Target Years to Double</label><input type="number" min="1" max="100" value={targetYears} onChange={(e) => setTargetYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Target Years to Double" /></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">At {r}%, your money doubles in</p>
            {doubles ? (
              <>
                <p className="text-3xl font-bold text-primary mt-1">{doublingYears.toFixed(1)} years</p>
                <p className="text-xs text-muted-foreground mt-1">Exact: {exact.toFixed(2)} years</p>
              </>
            ) : (
              <>
                <p className="text-3xl font-bold text-primary mt-1">Never</p>
                <p className="text-xs text-muted-foreground mt-1">At 0% or below, money does not grow</p>
              </>
            )}
          </div>
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">To double in {y > 0 ? y : '—'} years, you need</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{y > 0 ? `${rateNeeded.toFixed(1)}%` : '—'}</p>
            <p className="text-xs text-muted-foreground mt-1">annual return</p>
          </div>
        </div>

        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">The Rule of 72:</p>
          <p>Divide 72 by your annual return to estimate how long it takes to double your money. Between 4% and 12% the answer is within about 2% of the exact figure; outside that range it drifts further.</p>
          <p className="mt-2 font-medium text-foreground">Quick reference:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {QUICK_RATES.map(q => <span key={q} className="px-2 py-1 rounded bg-muted text-xs">{q}% = {(72 / q).toFixed(1)}yr</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}
