import { useState, useMemo } from 'react'

function calculate(steps: number, heightCm: number, gender: string) {
  // Stride length: ~41% of height for men, ~413% for women
  const strideCm = gender === 'male' ? heightCm * 0.415 : heightCm * 0.413
  const distanceKm = (steps * strideCm) / 100000
  const distanceMiles = distanceKm * 0.621371
  const calories = steps * (gender === 'male' ? 0.045 : 0.04) // rough cal/step
  const minutesWalking = steps / 100 // ~100 steps/minute average

  return { distanceKm, distanceMiles, strideCm, calories, minutesWalking }
}

export default function StepsToMilesCalculator() {
  const [steps, setSteps] = useState('10000')
  const [height, setHeight] = useState('170')
  const [gender, setGender] = useState('male')

  const s = parseInt(steps.replace(/,/g, '')) || 0
  const h = parseFloat(height) || 170
  const result = useMemo(() => calculate(s, h, gender), [s, h, gender])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Steps</label><input type="text" inputMode="numeric" value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="10,000" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          <div className="flex gap-2 mt-2">{[5000, 8000, 10000, 15000, 20000].map(v => <button key={v} onClick={() => setSteps(v.toString())} className="px-2 py-1 rounded-lg bg-muted text-xs font-medium hover:bg-accent">{(v/1000).toFixed(0)}K</button>)}</div></div>
        <div><label className="block text-sm font-medium mb-2">Height (cm)</label><input type="number" min="100" max="220" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Gender</label><div className="grid grid-cols-2 gap-2"><button onClick={() => setGender('male')} className={`px-4 py-3 rounded-xl text-sm font-medium border ${gender === 'male' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Male</button><button onClick={() => setGender('female')} className={`px-4 py-3 rounded-xl text-sm font-medium border ${gender === 'female' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Female</button></div></div>
      </div>

      {s > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Miles</p><p className="text-xl font-bold text-primary">{result.distanceMiles.toFixed(2)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Kilometres</p><p className="text-lg font-bold">{result.distanceKm.toFixed(2)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Calories</p><p className="text-lg font-bold">{Math.round(result.calories)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Walking Time</p><p className="text-lg font-bold">{Math.round(result.minutesWalking)} min</p></div>
        </div>
      )}
    </div>
  )
}
