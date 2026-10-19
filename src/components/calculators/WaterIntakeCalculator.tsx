import { useState, useMemo } from 'react'

type Activity = 'sedentary' | 'light' | 'moderate' | 'heavy' | 'athlete'
const MULTIPLIERS: Record<Activity, number> = { sedentary: 1, light: 1.1, moderate: 1.2, heavy: 1.35, athlete: 1.5 }

const ML_PER_KG = 33
const HOT_WEATHER_UPLIFT = 0.1
// About 20% of total water intake comes from food (EFSA assumption, British Nutrition Foundation)
const FROM_FOOD_SHARE = 0.2
const GLASS_ML = 250
const MIN_ADULT_WEIGHT_KG = 40

function calculate(weightKg: number, activity: Activity, climate: boolean) {
  // Base: ~33ml per kg body weight
  const base = weightKg * ML_PER_KG
  const withActivity = base * MULTIPLIERS[activity]
  const total = climate ? withActivity * (1 + HOT_WEATHER_UPLIFT) : withActivity
  const drinks = total * (1 - FROM_FOOD_SHARE)
  const glasses = Math.ceil(drinks / GLASS_ML)

  return { ml: Math.round(total), litres: total / 1000, drinksMl: Math.round(drinks), drinksLitres: drinks / 1000, glasses }
}

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState('75')
  const [activity, setActivity] = useState<Activity>('moderate')
  const [hot, setHot] = useState(false)

  const w = parseFloat(weight) || 0
  const result = useMemo(() => calculate(w, activity, hot), [w, activity, hot])
  const adult = w >= MIN_ADULT_WEIGHT_KG

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Weight (kg)</label><input type="number" min={MIN_ADULT_WEIGHT_KG} max="200" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weight (kg)" /></div>
        <div><label className="block text-sm font-medium mb-2">Activity Level</label><select value={activity} onChange={(e) => setActivity(e.target.value as Activity)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Activity Level">
          <option value="sedentary">Sedentary (desk job)</option><option value="light">Light exercise</option><option value="moderate">Moderate exercise</option><option value="heavy">Heavy exercise</option><option value="athlete">Athlete / physical job</option>
        </select></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={hot} onChange={(e) => setHot(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Hot climate / summer (+10%)</span></label>

      {w > 0 && !adult && (
        <div className="rounded-xl border border-border p-4 text-sm space-y-2" aria-live="polite">
          <p className="font-medium">This rule of thumb is for adults (40 kg and over). It badly underestimates what children need.</p>
          <p className="text-muted-foreground">For children, the European Food Safety Authority&rsquo;s adequate intake of total water (food and drinks) is 1.6 litres a day at ages 4 to 8, and 1.9 litres for girls and 2.1 litres for boys aged 9 to 13. The British Nutrition Foundation says children should aim for about 6 to 8 glasses of fluid a day.</p>
        </div>
      )}

      {adult && (
        <div className="space-y-3 animate-fade-in-up" aria-live="polite">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-blue-100 dark:bg-blue-950 p-4 text-center"><p className="text-xs text-muted-foreground">Total water a day, including about 20% from food</p><p className="text-xl font-bold text-blue-700 dark:text-blue-400">{result.litres.toFixed(1)} litres</p><p className="text-xs text-muted-foreground">{result.ml.toLocaleString('en-GB')} ml</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">From drinks (about 80%)</p><p className="text-lg font-bold">{result.drinksLitres.toFixed(1)} litres</p><p className="text-xs text-muted-foreground">{result.drinksMl.toLocaleString('en-GB')} ml</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Drinks in 250 ml glasses</p><p className="text-lg font-bold">{result.glasses}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
            <p>For comparison, the NHS suggests aiming for 6 to 8 cups or glasses of fluid a day, which the British Nutrition Foundation puts at about 1.2 litres of drinks (150 to 200 ml glasses). The European Food Safety Authority&rsquo;s adequate intake is 2.0 litres of total water a day for women and 2.5 litres for men, including food.</p>
            <p>This is a weight-based estimate for adults. It does not add extra for pregnancy, breastfeeding, a fever or long exercise sessions, and people with heart or kidney conditions may be told to limit fluids, so follow medical advice.</p>
          </div>
        </div>
      )}
    </div>
  )
}
