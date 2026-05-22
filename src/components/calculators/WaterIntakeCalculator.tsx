import { useState, useMemo } from 'react'

type Activity = 'sedentary' | 'light' | 'moderate' | 'heavy' | 'athlete'
const MULTIPLIERS: Record<Activity, number> = { sedentary: 1, light: 1.1, moderate: 1.2, heavy: 1.35, athlete: 1.5 }

function calculate(weightKg: number, activity: Activity, climate: boolean) {
  // Base: ~33ml per kg body weight
  const base = weightKg * 33
  const withActivity = base * MULTIPLIERS[activity]
  const withClimate = climate ? withActivity * 1.1 : withActivity
  const litres = withClimate / 1000
  const glasses = Math.ceil(litres / 0.25) // 250ml glasses

  return { ml: Math.round(withClimate), litres, glasses }
}

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState('75')
  const [activity, setActivity] = useState<Activity>('moderate')
  const [hot, setHot] = useState(false)

  const w = parseFloat(weight) || 0
  const result = useMemo(() => calculate(w, activity, hot), [w, activity, hot])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Weight (kg)</label><input type="number" min="20" max="200" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weight (kg)" /></div>
        <div><label className="block text-sm font-medium mb-2">Activity Level</label><select value={activity} onChange={(e) => setActivity(e.target.value as Activity)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Activity Level">
          <option value="sedentary">Sedentary (desk job)</option><option value="light">Light exercise</option><option value="moderate">Moderate exercise</option><option value="heavy">Heavy exercise</option><option value="athlete">Athlete / physical job</option>
        </select></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={hot} onChange={(e) => setHot(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Hot climate / summer (+10%)</span></label>

      {w > 0 && (
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-blue-100 dark:bg-blue-950 p-4 text-center"><p className="text-xs text-muted-foreground">Daily Water</p><p className="text-xl font-bold text-blue-700 dark:text-blue-400">{result.litres.toFixed(1)} litres</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Millilitres</p><p className="text-lg font-bold">{result.ml.toLocaleString()} ml</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Glasses (250ml)</p><p className="text-lg font-bold">{result.glasses}</p></div>
        </div>
      )}
    </div>
  )
}
