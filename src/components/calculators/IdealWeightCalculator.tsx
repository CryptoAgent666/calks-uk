import { useState, useMemo } from 'react'

type Gender = 'male' | 'female'

function calculate(heightCm: number, gender: Gender) {
  if (heightCm <= 0) return null
  const heightIn = heightCm / 2.54
  const heightOver5ft = Math.max(0, heightIn - 60)

  // Multiple formulas
  const robinson = gender === 'male'
    ? 52 + 1.9 * heightOver5ft
    : 49 + 1.7 * heightOver5ft

  const miller = gender === 'male'
    ? 56.2 + 1.41 * heightOver5ft
    : 53.1 + 1.36 * heightOver5ft

  const devine = gender === 'male'
    ? 50 + 2.3 * heightOver5ft
    : 45.5 + 2.3 * heightOver5ft

  const hamwi = gender === 'male'
    ? 48 + 2.7 * heightOver5ft
    : 45.5 + 2.2 * heightOver5ft

  // BMI-based healthy range
  const heightM = heightCm / 100
  const bmiMin = 18.5 * heightM * heightM
  const bmiMax = 24.9 * heightM * heightM

  return {
    robinson, miller, devine, hamwi,
    average: (robinson + miller + devine + hamwi) / 4,
    bmiMin, bmiMax,
  }
}

export default function IdealWeightCalculator() {
  const [height, setHeight] = useState('175')
  const [gender, setGender] = useState<Gender>('male')
  const h = parseFloat(height) || 0
  const result = useMemo(() => calculate(h, gender), [h, gender])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        {(['male', 'female'] as Gender[]).map(g => (
          <button key={g} onClick={() => setGender(g)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${gender === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{g === 'male' ? 'Male' : 'Female'}</button>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Height (cm)</label>
        <input type="number" min="100" max="250" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Height (cm)" />
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Average Ideal Weight</p>
            <p className="text-3xl font-bold text-primary mt-1">{result.average.toFixed(1)} kg</p>
            <p className="text-sm text-muted-foreground mt-1">Healthy BMI range: {result.bmiMin.toFixed(1)} – {result.bmiMax.toFixed(1)} kg</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Robinson</p><p className="text-lg font-bold">{result.robinson.toFixed(1)} kg</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Miller</p><p className="text-lg font-bold">{result.miller.toFixed(1)} kg</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Devine</p><p className="text-lg font-bold">{result.devine.toFixed(1)} kg</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Hamwi</p><p className="text-lg font-bold">{result.hamwi.toFixed(1)} kg</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
