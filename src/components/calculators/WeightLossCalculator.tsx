import { useState, useMemo } from 'react'

const UNDERWEIGHT_BMI = 18.5
const HIGH_DEFICIT_KCAL = 1000
// NHS average daily use for women; only used to show what a very large deficit leaves
const NHS_AVERAGE_WOMAN_KCAL = 2000

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

export function assess(current: string, target: string, height: string, weeklyLoss: number) {
  const c = parseFloat(current) || 0
  const t = parseFloat(target) || 0
  const h = parseFloat(height) || 0
  const heightEntered = height.trim() !== ''
  const heightValid = h >= 100 && h <= 250
  const bmi = heightValid && t > 0 ? t / Math.pow(h / 100, 2) : null
  const underweight = bmi !== null && bmi < UNDERWEIGHT_BMI

  let error: string | null = null
  if (c < 30 || c > 300 || t < 30 || t > 300) error = 'Enter current and target weights between 30 and 300 kg.'
  else if (c <= t) error = 'Your target weight needs to be below your current weight.'
  else if (heightEntered && !heightValid) error = 'Enter your height in cm, between 100 and 250, or leave it blank.'

  const plan = !error && !underweight ? calculate(c, t, weeklyLoss) : null
  return {
    error,
    bmi,
    // rounded down so a value just under the line never displays as 18.5
    bmiShown: bmi === null ? null : (Math.floor(bmi * 10) / 10).toFixed(1),
    underweight: !error && underweight,
    highDeficit: !!plan && plan.dailyDeficit > HIGH_DEFICIT_KCAL,
    plan,
  }
}

export default function WeightLossCalculator() {
  const [current, setCurrent] = useState('85')
  const [target, setTarget] = useState('75')
  const [rate, setRate] = useState('0.5')
  const [height, setHeight] = useState('')

  const t = parseFloat(target) || 0
  const r = parseFloat(rate) || 0
  const a = useMemo(() => assess(current, target, height, r), [current, target, height, r])
  const result = a.plan

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Current Weight (kg)</label><input type="number" min="30" max="300" step="0.1" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current Weight (kg)" /></div>
        <div><label className="block text-sm font-medium mb-2">Target Weight (kg)</label><input type="number" min="30" max="300" step="0.1" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Target Weight (kg)" /></div>
        <div><label className="block text-sm font-medium mb-2">Weekly Loss Rate (kg)</label><select value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Weekly Loss Rate (kg)"><option value="0.25">0.25 kg/week (below the NHS range)</option><option value="0.5">0.5 kg/week (NHS range, lower end)</option><option value="0.75">0.75 kg/week (NHS range)</option><option value="1">1 kg/week (NHS range, upper end)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Height (cm, optional)</label><input type="number" min="100" max="250" step="1" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 170" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Height in cm, optional" /><p className="text-xs text-muted-foreground mt-1">Checks your target weight against the adult BMI bands</p></div>
      </div>

      {a.error && (
        <div role="alert" className="rounded-xl border border-border p-4 text-sm text-muted-foreground">{a.error}</div>
      )}

      {a.underweight && (
        <div role="alert" className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-4 text-sm space-y-2">
          <p className="font-semibold">A target of {t} kg at this height is a BMI of about {a.bmiShown}, which is underweight.</p>
          <p>An adult BMI under 18.5 counts as underweight, so this calculator does not show a date or calorie plan for that target. If you are worried about your weight or the way you eat, please speak to a GP.</p>
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">You'll Reach {t}kg By</p>
            <p className="text-2xl font-bold text-primary mt-1">{result.targetDate}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.weeks} weeks ({result.months} months) &middot; Lose {result.totalToLose.toFixed(1)}kg total</p>
            {a.bmi !== null && <p className="text-sm text-muted-foreground mt-1">BMI at target weight: {a.bmi.toFixed(1)}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Daily Calorie Deficit</p><p className="text-lg font-bold">{Math.round(result.dailyDeficit)} kcal</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Weekly Loss</p><p className="text-lg font-bold">{r} kg</p></div>
          </div>
          {a.highDeficit && (
            <div role="alert" className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-4 text-sm">
              <p>This rate needs a deficit of more than {HIGH_DEFICIT_KCAL.toLocaleString('en-GB')} kcal a day. On the NHS average of {NHS_AVERAGE_WOMAN_KCAL.toLocaleString('en-GB')} calories a day for women, that leaves about {(NHS_AVERAGE_WOMAN_KCAL - Math.round(result.dailyDeficit)).toLocaleString('en-GB')} kcal. The NHS describes diets under 800 or 1,200 calories as very low calorie and says they are not suitable or safe for everyone, so choose a slower rate or ask a GP first.</p>
            </div>
          )}
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
            <p>The NHS says to aim to lose 0.5 to 1kg a week and not to lose weight suddenly with diets.</p>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>For adults only. If you are under 18, pregnant, have or have had an eating disorder, or have a medical condition, talk to a GP before trying to lose weight. The NHS advises against trying to lose weight during pregnancy.</p>
      </div>
    </div>
  )
}
