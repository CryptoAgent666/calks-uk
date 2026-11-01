import { useState, useMemo } from 'react'

type Goal = 'lose' | 'maintain' | 'gain'
type Gender = 'male' | 'female'
type Activity = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'

const ACTIVITY_MULT: Record<Activity, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 }
const GOAL_ADJ: Record<Goal, number> = { lose: -500, maintain: 0, gain: 500 }

// Protein set by bodyweight. Working figures between the 0.75 g/kg UK RNI and the 1.6 g/kg
// where Morton et al. (2018) found muscle gains level off; not official targets.
const PROTEIN_PER_KG: Record<Goal, number> = { lose: 1.2, maintain: 1.2, gain: 1.6 }
const SEDENTARY_MAINTAIN_PROTEIN_PER_KG = 1.0
// Department of Health advice: avoid more than twice the 0.75 g/kg RNI (British Nutrition Foundation)
const HIGH_PROTEIN_PER_KG = 1.5
const FAT_SHARE = 0.30
// NHS: a very low calorie diet is "under 800 or 1200 calories" and not suitable or safe for everyone
const VERY_LOW_CALORIES = 1200
// NICE NG246: healthy weight starts at BMI 18.5
const LOWEST_HEALTHY_BMI = 18.5

function calculate(gender: Gender, age: number, height: number, weight: number, activity: Activity, goal: Goal) {
  // Mifflin-St Jeor (1990)
  let bmr: number
  if (gender === 'male') bmr = 10 * weight + 6.25 * height - 5 * age + 5
  else bmr = 10 * weight + 6.25 * height - 5 * age - 161

  const tdee = bmr * ACTIVITY_MULT[activity]
  const targetCals = Math.round(tdee + GOAL_ADJ[goal])
  const bmi = weight / (height / 100) ** 2

  const proteinPerKg = goal === 'maintain' && activity === 'sedentary' ? SEDENTARY_MAINTAIN_PROTEIN_PER_KG : PROTEIN_PER_KG[goal]
  const proteinCals = weight * proteinPerKg * 4
  const fatCals = targetCals * FAT_SHARE
  const carbsCals = targetCals - proteinCals - fatCals
  const pct = (cals: number) => Math.round((cals / targetCals) * 100)

  return {
    bmr: Math.round(bmr), tdee: Math.round(tdee), targetCals, proteinPerKg,
    veryLowTarget: targetCals < VERY_LOW_CALORIES,
    underweightLosing: goal === 'lose' && bmi < LOWEST_HEALTHY_BMI,
    highProtein: proteinPerKg > HIGH_PROTEIN_PER_KG,
    protein: { grams: Math.round(proteinCals / 4), cals: Math.round(proteinCals), pct: pct(proteinCals) },
    carbs: { grams: Math.round(carbsCals / 4), cals: Math.round(carbsCals), pct: pct(carbsCals) },
    fat: { grams: Math.round(fatCals / 9), cals: Math.round(fatCals), pct: pct(fatCals) },
  }
}

const inRange = (value: number, min: number, max: number) => value >= min && value <= max

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
  const valid = inRange(a, 18, 90) && inRange(h, 100, 250) && inRange(w, 30, 250)
  const result = useMemo(() => valid ? calculate(gender, a, h, w, activity, goal) : null, [valid, gender, a, h, w, activity, goal])
  const noPlan = result && (result.veryLowTarget || result.underweightLosing)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        {(['male', 'female'] as Gender[]).map(g => (
          <button key={g} onClick={() => setGender(g)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${gender === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{g === 'male' ? 'Male' : 'Female'}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Age</label><input type="number" min="18" max="90" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Age" /></div>
        <div><label className="block text-sm font-medium mb-2">Height (cm)</label><input type="number" min="100" max="250" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Height (cm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Weight (kg)</label><input type="number" min="30" max="250" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weight (kg)" /></div>
        <div><label className="block text-sm font-medium mb-2">Activity</label><select value={activity} onChange={(e) => setActivity(e.target.value as Activity)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Activity"><option value="sedentary">Sedentary</option><option value="light">Light (1-3x/wk)</option><option value="moderate">Moderate (3-5x/wk)</option><option value="active">Active (6-7x/wk)</option><option value="very_active">Very Active</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Goal</label><select value={goal} onChange={(e) => setGoal(e.target.value as Goal)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Goal"><option value="lose">Lose Weight (-500 cal)</option><option value="maintain">Maintain Weight</option><option value="gain">Gain Weight (+500 cal)</option></select></div>
      </div>

      {!valid && (
        <p className="text-sm text-destructive" role="alert">This calculator is for adults. Enter an age from 18 to 90, a height from 100 to 250 cm and a weight from 30 to 250 kg.</p>
      )}

      {noPlan && result && (
        <div className="rounded-2xl border border-destructive p-6 text-sm animate-fade-in-up" role="alert">
          <p className="font-semibold text-foreground">We can&apos;t suggest a plan from these numbers. Please speak to a GP.</p>
          {result.underweightLosing && <p className="mt-2 text-muted-foreground">Your BMI is below {LOWEST_HEALTHY_BMI}, the bottom of the NICE healthy weight range, so we don&apos;t set a weight loss target.</p>}
          {result.veryLowTarget && <p className="mt-2 text-muted-foreground">This would fall under {VERY_LOW_CALORIES.toLocaleString('en-GB')} kcal a day. The NHS describes diets under 800 or 1,200 calories as very low calorie diets, which are not suitable or safe for everyone.</p>}
        </div>
      )}

      {result && !noPlan && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Daily Target</p>
            <p className="text-3xl font-bold text-primary mt-1">{result.targetCals} kcal</p>
            <p className="text-sm text-muted-foreground mt-1">TDEE: {result.tdee} &middot; BMR: {result.bmr}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-red-100 dark:bg-red-950 p-4 text-center"><p className="text-xs text-muted-foreground">Protein ({result.protein.pct}%)</p><p className="text-2xl font-bold text-red-700 dark:text-red-400">{result.protein.grams}g</p><p className="text-xs text-muted-foreground">{result.proteinPerKg} g/kg &middot; {result.protein.cals} kcal</p></div>
            <div className="rounded-xl bg-amber-100 dark:bg-amber-950 p-4 text-center"><p className="text-xs text-muted-foreground">Carbs ({result.carbs.pct}%)</p><p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{result.carbs.grams}g</p><p className="text-xs text-muted-foreground">{result.carbs.cals} kcal</p></div>
            <div className="rounded-xl bg-blue-100 dark:bg-blue-950 p-4 text-center"><p className="text-xs text-muted-foreground">Fat ({result.fat.pct}%)</p><p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{result.fat.grams}g</p><p className="text-xs text-muted-foreground">{result.fat.cals} kcal</p></div>
          </div>
          {result.highProtein && (
            <p className="text-sm text-destructive" role="alert">{result.proteinPerKg} g/kg is above {HIGH_PROTEIN_PER_KG} g/kg, twice the UK reference intake. The Department of Health advised adults to avoid going above that level, although no upper limit has been set.</p>
          )}
        </div>
      )}
      <p className="text-xs text-muted-foreground">Calories use the Mifflin-St Jeor equation. Protein is set by bodyweight at 1.0 to 1.6 g/kg, a working figure rather than an official target; fat is 30% of calories and carbohydrate takes the rest. If you have kidney disease or an eating disorder, or are pregnant or breastfeeding, talk to your GP or midwife first.</p>
    </div>
  )
}
