import { useState, useMemo } from 'react'

type Goal = 'lose' | 'maintain' | 'gain'
type Gender = 'male' | 'female'
type Activity = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'

const ACTIVITY_MULT: Record<Activity, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 }
const GOAL_ADJ: Record<Goal, number> = { lose: -500, maintain: 0, gain: 500 }

function calculate(gender: Gender, age: number, height: number, weight: number, activity: Activity, goal: Goal) {
  let bmr: number
  if (gender === 'male') bmr = 10 * weight + 6.25 * height - 5 * age + 5
  else bmr = 10 * weight + 6.25 * height - 5 * age - 161

  const tdee = bmr * ACTIVITY_MULT[activity]
  const targetCals = Math.round(tdee + GOAL_ADJ[goal])

  // Macro splits
  const ratios: Record<Goal, { protein: number; carbs: number; fat: number }> = {
    lose: { protein: 0.35, carbs: 0.35, fat: 0.30 },
    maintain: { protein: 0.30, carbs: 0.40, fat: 0.30 },
    gain: { protein: 0.30, carbs: 0.45, fat: 0.25 },
  }

  const r = ratios[goal]
  const proteinCals = targetCals * r.protein
  const carbsCals = targetCals * r.carbs
  const fatCals = targetCals * r.fat

  return {
    bmr: Math.round(bmr), tdee: Math.round(tdee), targetCals,
    protein: { grams: Math.round(proteinCals / 4), cals: Math.round(proteinCals), pct: r.protein * 100 },
    carbs: { grams: Math.round(carbsCals / 4), cals: Math.round(carbsCals), pct: r.carbs * 100 },
    fat: { grams: Math.round(fatCals / 9), cals: Math.round(fatCals), pct: r.fat * 100 },
  }
}

export default function MacroCalculator() {
  const [gender, setGender] = useState<Gender>('male')
  const [age, setAge] = useState('30')
  const [height, setHeight] = useState('175')
  const [weight, setWeight] = useState('80')
  const [activity, setActivity] = useState<Activity>('moderate')
  const [goal, setGoal] = useState<Goal>('maintain')

  const a = parseInt(age) || 0
  const h = parseFloat(height) || 0
  const w = parseFloat(weight) || 0
  const result = useMemo(() => (a > 0 && h > 0 && w > 0) ? calculate(gender, a, h, w, activity, goal) : null, [gender, a, h, w, activity, goal])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        {(['male', 'female'] as Gender[]).map(g => (
          <button key={g} onClick={() => setGender(g)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${gender === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{g === 'male' ? 'Male' : 'Female'}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Age</label><input type="number" min="10" max="90" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Age" /></div>
        <div><label className="block text-sm font-medium mb-2">Height (cm)</label><input type="number" min="100" max="250" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Height (cm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Weight (kg)</label><input type="number" min="30" max="250" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weight (kg)" /></div>
        <div><label className="block text-sm font-medium mb-2">Activity</label><select value={activity} onChange={(e) => setActivity(e.target.value as Activity)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Activity"><option value="sedentary">Sedentary</option><option value="light">Light (1-3x/wk)</option><option value="moderate">Moderate (3-5x/wk)</option><option value="active">Active (6-7x/wk)</option><option value="very_active">Very Active</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Goal</label><select value={goal} onChange={(e) => setGoal(e.target.value as Goal)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Goal"><option value="lose">Lose Weight (-500 cal)</option><option value="maintain">Maintain Weight</option><option value="gain">Gain Weight (+500 cal)</option></select></div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Daily Target</p>
            <p className="text-3xl font-bold text-primary mt-1">{result.targetCals} kcal</p>
            <p className="text-sm text-muted-foreground mt-1">TDEE: {result.tdee} &middot; BMR: {result.bmr}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-red-100 dark:bg-red-950 p-4 text-center"><p className="text-xs text-muted-foreground">Protein ({result.protein.pct}%)</p><p className="text-2xl font-bold text-red-700 dark:text-red-400">{result.protein.grams}g</p><p className="text-xs text-muted-foreground">{result.protein.cals} kcal</p></div>
            <div className="rounded-xl bg-amber-100 dark:bg-amber-950 p-4 text-center"><p className="text-xs text-muted-foreground">Carbs ({result.carbs.pct}%)</p><p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{result.carbs.grams}g</p><p className="text-xs text-muted-foreground">{result.carbs.cals} kcal</p></div>
            <div className="rounded-xl bg-blue-100 dark:bg-blue-950 p-4 text-center"><p className="text-xs text-muted-foreground">Fat ({result.fat.pct}%)</p><p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{result.fat.grams}g</p><p className="text-xs text-muted-foreground">{result.fat.cals} kcal</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
