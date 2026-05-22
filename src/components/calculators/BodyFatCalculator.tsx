import { useState, useMemo } from 'react'

type Gender = 'male' | 'female'

// US Navy method
function calculate(gender: Gender, waist: number, neck: number, height: number, hip: number) {
  let bf: number
  if (gender === 'male') {
    bf = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76
  } else {
    bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387
  }
  bf = Math.max(2, Math.min(60, bf))

  const category = bf < (gender === 'male' ? 6 : 14) ? 'Essential Fat'
    : bf < (gender === 'male' ? 14 : 21) ? 'Athletes'
    : bf < (gender === 'male' ? 18 : 25) ? 'Fitness'
    : bf < (gender === 'male' ? 25 : 32) ? 'Average'
    : 'Obese'

  return { bf, category }
}

export default function BodyFatCalculator() {
  const [gender, setGender] = useState<Gender>('male')
  const [waist, setWaist] = useState('')
  const [neck, setNeck] = useState('')
  const [height, setHeight] = useState('')
  const [hip, setHip] = useState('')

  const w = parseFloat(waist) || 0
  const n = parseFloat(neck) || 0
  const h = parseFloat(height) || 0
  const hp = parseFloat(hip) || 0
  const valid = w > 0 && n > 0 && h > 0 && (gender === 'male' || hp > 0) && w > n
  const result = useMemo(() => valid ? calculate(gender, w, n, h, hp) : null, [gender, w, n, h, hp, valid])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        {(['male', 'female'] as Gender[]).map((g) => (
          <button key={g} onClick={() => setGender(g)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${gender === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{g === 'male' ? 'Male' : 'Female'}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Height (cm)</label><input type="number" min="100" max="250" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Height (cm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Waist (cm)</label><input type="number" min="40" max="200" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="85" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Waist (cm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Neck (cm)</label><input type="number" min="20" max="60" value={neck} onChange={(e) => setNeck(e.target.value)} placeholder="38" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Neck (cm)" /></div>
        {gender === 'female' && (
          <div><label className="block text-sm font-medium mb-2">Hip (cm)</label><input type="number" min="50" max="200" value={hip} onChange={(e) => setHip(e.target.value)} placeholder="95" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hip (cm)" /></div>
        )}
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Body Fat</p>
            <p className="text-4xl font-bold text-primary mt-1">{result.bf.toFixed(1)}%</p>
            <p className="text-lg font-semibold mt-1">{result.category}</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{gender === 'male' ? 'Male' : 'Female'} body fat ranges:</p>
            <p>Essential: {gender === 'male' ? '2-5%' : '10-13%'} | Athletes: {gender === 'male' ? '6-13%' : '14-20%'} | Fitness: {gender === 'male' ? '14-17%' : '21-24%'} | Average: {gender === 'male' ? '18-24%' : '25-31%'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
