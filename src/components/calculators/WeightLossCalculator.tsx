import { useState, useMemo } from 'react'

function calculate(currentWeight: number, targetWeight: number, weeklyLoss: number) {
  if (currentWeight <= targetWeight || weeklyLoss <= 0) return null
  const totalToLose = currentWeight - targetWeight
  const weeks = Math.ceil(totalToLose / weeklyLoss)
  const months = (weeks / 4.33).toFixed(1)
  const dailyDeficit = weeklyLoss * 7700 / 7 // ~7700 cal per kg

  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + weeks * 7)
  const fmt = targetDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  // Milestones
  const milestones: { pct: number; weight: number; week: number }[] = []
  for (const pct of [25, 50, 75, 100]) {
    const lost = totalToLose * (pct / 100)
    milestones.push({ pct, weight: currentWeight - lost, week: Math.ceil(lost / weeklyLoss) })
  }

  return { totalToLose, weeks, months, dailyDeficit, targetDate: fmt, milestones }
}

export default function WeightLossCalculator() {
  const [current, setCurrent] = useState('85')
  const [target, setTarget] = useState('75')
  const [rate, setRate] = useState('0.5')

  const c = parseFloat(current) || 0
  const t = parseFloat(target) || 0
  const r = parseFloat(rate) || 0
  const result = useMemo(() => calculate(c, t, r), [c, t, r])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Current Weight (kg)</label><input type="number" min="30" max="300" step="0.1" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current Weight (kg)" /></div>
        <div><label className="block text-sm font-medium mb-2">Target Weight (kg)</label><input type="number" min="30" max="300" step="0.1" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Target Weight (kg)" /></div>
        <div><label className="block text-sm font-medium mb-2">Weekly Loss Rate (kg)</label><select value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Weekly Loss Rate (kg)"><option value="0.25">0.25 kg/week (gentle)</option><option value="0.5">0.5 kg/week (recommended)</option><option value="0.75">0.75 kg/week (fast)</option><option value="1">1 kg/week (aggressive)</option></select></div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">You'll Reach {t}kg By</p>
            <p className="text-2xl font-bold text-primary mt-1">{result.targetDate}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.weeks} weeks ({result.months} months) &middot; Lose {result.totalToLose.toFixed(1)}kg total</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Daily Calorie Deficit</p><p className="text-lg font-bold">{Math.round(result.dailyDeficit)} kcal</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Weekly Loss</p><p className="text-lg font-bold">{r} kg</p></div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Milestones</h3>
            <div className="grid grid-cols-4 gap-2">
              {result.milestones.map(m => (
                <div key={m.pct} className="rounded-xl border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">{m.pct}% done</p>
                  <p className="text-sm font-bold">{m.weight.toFixed(1)} kg</p>
                  <p className="text-xs text-muted-foreground">Week {m.week}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>NHS recommends 0.5-1kg per week for safe, sustainable weight loss. Faster rates may lead to muscle loss and are harder to maintain.</p>
          </div>
        </div>
      )}
    </div>
  )
}
