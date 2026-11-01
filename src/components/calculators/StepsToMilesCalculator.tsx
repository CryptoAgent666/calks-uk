import { useState, useMemo } from 'react'

const MIN_HEIGHT_CM = 100
const MAX_HEIGHT_CM = 220

function calculate(steps: number, heightCm: number, gender: string) {
  // Step length: rule-of-thumb 41.5% of height for men, 41.3% for women
  const stepLengthCm = gender === 'male' ? heightCm * 0.415 : heightCm * 0.413
  const distanceKm = (steps * stepLengthCm) / 100000
  const distanceMiles = distanceKm * 0.621371
  const calories = steps * (gender === 'male' ? 0.045 : 0.04) // rough average per step, not adjusted for weight
  const minutesWalking = steps / 100 // ~100 steps/minute average

  return { distanceKm, distanceMiles, stepLengthCm, calories, minutesWalking }
}

// Accepts 10000, 10,000 and 10 000. Anything else counts as no valid entry.
function parseSteps(raw: string) {
  const cleaned = raw.replace(/[,\s]/g, '')
  return /^\d+$/.test(cleaned) ? parseInt(cleaned, 10) : 0
}

function parseHeight(raw: string) {
  const value = parseFloat(raw)
  return value >= MIN_HEIGHT_CM && value <= MAX_HEIGHT_CM ? value : 0
}

export default function StepsToMilesCalculator() {
  const [steps, setSteps] = useState('10000')
  const [height, setHeight] = useState('170')
  const [gender, setGender] = useState('male')

  const s = parseSteps(steps)
  const h = parseHeight(height)
  const result = useMemo(() => calculate(s, h, gender), [s, h, gender])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Steps</label><input type="text" inputMode="numeric" value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="10,000" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Steps" />
          <div className="flex gap-2 mt-2">{[5000, 8000, 10000, 15000, 20000].map(v => <button key={v} onClick={() => setSteps(v.toString())} className="px-2 py-1 rounded-lg bg-muted text-xs font-medium hover:bg-accent">{(v/1000).toFixed(0)}K</button>)}</div></div>
        <div><label className="block text-sm font-medium mb-2">Height (cm)</label><input type="number" min={MIN_HEIGHT_CM} max={MAX_HEIGHT_CM} value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Height (cm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Gender</label><div className="grid grid-cols-2 gap-2"><button onClick={() => setGender('male')} className={`px-4 py-3 rounded-xl text-sm font-medium border ${gender === 'male' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Male</button><button onClick={() => setGender('female')} className={`px-4 py-3 rounded-xl text-sm font-medium border ${gender === 'female' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Female</button></div></div>
      </div>

      {h === 0 && <p className="text-sm text-destructive">Enter a height between {MIN_HEIGHT_CM} and {MAX_HEIGHT_CM} cm.</p>}
      {h > 0 && steps.trim() !== '' && s === 0 && <p className="text-sm text-destructive">Enter your steps as a whole number above 0.</p>}

      {s > 0 && h > 0 && (
        <div className="space-y-3 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Miles</p><p className="text-xl font-bold text-primary">{result.distanceMiles.toFixed(2)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Kilometres</p><p className="text-lg font-bold">{result.distanceKm.toFixed(2)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Calories (rough average)</p><p className="text-lg font-bold">{Math.round(result.calories)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Walking Time</p><p className="text-lg font-bold">{Math.round(result.minutesWalking)} min</p></div>
          </div>
          <p className="text-xs text-muted-foreground">Step length {result.stepLengthCm.toFixed(1)} cm. Calories use a flat rate per step and do not change with your weight or pace. Walking time assumes 100 steps a minute.</p>
        </div>
      )}
    </div>
  )
}
