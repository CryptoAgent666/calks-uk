import { useState, useMemo } from 'react'

type Goal = 'sedentary' | 'active' | 'muscle' | 'athlete'
// Sedentary floor = UK Reference Nutrient Intake (COMA): 0.75 g/kg/day.
const RATES: Record<Goal, { min: number; max: number; name: string }> = {
  sedentary: { min: 0.75, max: 1.0, name: 'Sedentary / General Health' },
  active: { min: 1.2, max: 1.6, name: 'Moderately Active' },
  muscle: { min: 1.6, max: 2.2, name: 'Muscle Building' },
  athlete: { min: 1.4, max: 2.0, name: 'Endurance Athlete' },
}

const MEAL_OPTIONS = [3, 4, 5]

function calculate(weightKg: number, goal: Goal, meals = 4) {
  const rate = RATES[goal]
  const minG = weightKg * rate.min
  const maxG = weightKg * rate.max
  const avgG = (minG + maxG) / 2
  const perMealMin = meals > 0 ? minG / meals : 0
  const perMealMax = meals > 0 ? maxG / meals : 0

  // Common protein sources
  const sources = [
    { name: 'Chicken Breast', gPer100g: 31, serving: '1 breast (150g)', gPerServing: 46 },
    { name: 'Eggs', gPer100g: 13, serving: '2 large eggs', gPerServing: 12 },
    { name: 'Greek Yoghurt', gPer100g: 10, serving: '200g pot', gPerServing: 20 },
    { name: 'Salmon', gPer100g: 20, serving: '1 fillet (125g)', gPerServing: 25 },
    { name: 'Lentils (cooked)', gPer100g: 9, serving: '200g', gPerServing: 18 },
    { name: 'Whey Protein', gPer100g: 80, serving: '1 scoop (30g)', gPerServing: 24 },
  ]

  return { minG, maxG, avgG, perMealMin, perMealMax, meals, rate, sources }
}

export default function ProteinIntakeCalculator() {
  const [weight, setWeight] = useState('75')
  const [goal, setGoal] = useState<Goal>('active')
  const [meals, setMeals] = useState('4')

  const w = parseFloat(weight) || 0
  const m = parseInt(meals) || 4
  const result = useMemo(() => calculate(w, goal, m), [w, goal, m])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Weight (kg)</label><input type="number" min="30" max="200" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weight (kg)" /></div>
        <div><label className="block text-sm font-medium mb-2">Activity / Goal</label><select value={goal} onChange={(e) => setGoal(e.target.value as Goal)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Activity / Goal">{Object.entries(RATES).map(([k, v]) => <option key={k} value={k}>{v.name} ({v.min}-{v.max}g/kg)</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Meals per Day</label><select value={meals} onChange={(e) => setMeals(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Meals per Day">{MEAL_OPTIONS.map((n) => <option key={n} value={n}>{n} meals</option>)}</select></div>
      </div>

      {w > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Daily Protein Target</p>
            <p className="text-3xl font-bold text-primary mt-1">{Math.round(result.minG)} – {Math.round(result.maxG)}g</p>
            <p className="text-sm text-muted-foreground mt-1">{result.rate.min}-{result.rate.max}g per kg body weight</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <p className="text-xs text-muted-foreground">Per Meal ({result.meals} meals)</p>
            <p className="text-xl font-bold">{Math.round(result.perMealMin)} – {Math.round(result.perMealMax)}g</p>
            <p className="text-xs text-muted-foreground mt-1">Spread evenly; 20 to 40g per meal suits most adults</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Protein Sources</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {result.sources.map(s => (
                <div key={s.name} className="rounded-xl border border-border p-3">
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-lg font-bold text-primary">{s.gPerServing}g</p>
                  <p className="text-xs text-muted-foreground">{s.serving}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
