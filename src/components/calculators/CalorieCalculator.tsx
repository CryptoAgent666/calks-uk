import { useState, useMemo } from 'react'

type Gender = 'male' | 'female'
type Activity = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive'

const ACTIVITY_MULTIPLIERS: Record<Activity, number> = {
  sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9,
}

function calculate(gender: Gender, age: number, heightCm: number, weightKg: number, activity: Activity) {
  // Mifflin-St Jeor
  let bmr: number
  if (gender === 'male') bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
  else bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161

  const tdee = bmr * ACTIVITY_MULTIPLIERS[activity]

  return {
    bmr: Math.round(bmr), tdee: Math.round(tdee),
    loseSlow: Math.round(tdee - 250), loseFast: Math.round(tdee - 500),
    gain: Math.round(tdee + 500),
  }
}

export default function CalorieCalculator() {
  const [gender, setGender] = useState<Gender>('male')
  const [age, setAge] = useState('30')
  const [height, setHeight] = useState('175')
  const [weight, setWeight] = useState('75')
  const [activity, setActivity] = useState<Activity>('moderate')

  const a = parseInt(age) || 0
  const h = parseFloat(height) || 0
  const w = parseFloat(weight) || 0
  const result = useMemo(() => (a > 0 && h > 0 && w > 0) ? calculate(gender, a, h, w, activity) : null, [gender, a, h, w, activity])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        {(['male', 'female'] as Gender[]).map((g) => (
          <button key={g} onClick={() => setGender(g)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${gender === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{g === 'male' ? 'Male' : 'Female'}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Age</label><input type="number" min="1" max="120" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Age" /></div>
        <div><label className="block text-sm font-medium mb-2">Height (cm)</label><input type="number" min="50" max="250" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Height (cm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Weight (kg)</label><input type="number" min="20" max="300" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weight (kg)" /></div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Activity Level</label>
        <select value={activity} onChange={(e) => setActivity(e.target.value as Activity)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Activity Level">
          <option value="sedentary">Sedentary (office job, little exercise)</option>
          <option value="light">Lightly Active (1-3 days/week)</option>
          <option value="moderate">Moderately Active (3-5 days/week)</option>
          <option value="active">Very Active (6-7 days/week)</option>
          <option value="veryActive">Extra Active (athlete / physical job)</option>
        </select>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Daily Calories to Maintain Weight</p>
            <p className="text-3xl font-bold text-primary mt-1">{result.tdee.toLocaleString()} kcal</p>
            <p className="text-sm text-muted-foreground mt-1">BMR: {result.bmr.toLocaleString()} kcal</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Mild Loss (0.25kg/wk)</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{result.loseSlow}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Loss (0.5kg/wk)</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{result.loseFast}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Gain (0.5kg/wk)</p><p className="text-lg font-bold">{result.gain}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
