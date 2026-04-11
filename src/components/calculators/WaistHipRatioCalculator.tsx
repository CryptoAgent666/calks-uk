import { useState, useMemo } from 'react'

type Gender = 'male' | 'female'

function calculate(waist: number, hip: number, gender: Gender) {
  if (waist <= 0 || hip <= 0) return null
  const ratio = waist / hip

  let risk: string
  let color: string
  if (gender === 'male') {
    if (ratio < 0.90) { risk = 'Low risk'; color = 'text-green-700 dark:text-green-400' }
    else if (ratio < 1.0) { risk = 'Moderate risk'; color = 'text-orange-600' }
    else { risk = 'High risk'; color = 'text-destructive' }
  } else {
    if (ratio < 0.80) { risk = 'Low risk'; color = 'text-green-700 dark:text-green-400' }
    else if (ratio < 0.85) { risk = 'Moderate risk'; color = 'text-orange-600' }
    else { risk = 'High risk'; color = 'text-destructive' }
  }

  // Waist circumference risk
  let waistRisk: string
  if (gender === 'male') {
    if (waist < 94) waistRisk = 'Healthy'
    else if (waist < 102) waistRisk = 'Increased risk'
    else waistRisk = 'Substantially increased risk'
  } else {
    if (waist < 80) waistRisk = 'Healthy'
    else if (waist < 88) waistRisk = 'Increased risk'
    else waistRisk = 'Substantially increased risk'
  }

  return { ratio, risk, color, waistRisk }
}

export default function WaistHipRatioCalculator() {
  const [waist, setWaist] = useState('')
  const [hip, setHip] = useState('')
  const [gender, setGender] = useState<Gender>('male')

  const w = parseFloat(waist) || 0
  const h = parseFloat(hip) || 0
  const result = useMemo(() => calculate(w, h, gender), [w, h, gender])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        {(['male', 'female'] as Gender[]).map(g => (
          <button key={g} onClick={() => setGender(g)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${gender === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{g === 'male' ? 'Male' : 'Female'}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Waist (cm)</label><input type="number" min="40" max="200" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="85" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /><p className="text-xs text-muted-foreground mt-1">Measure at narrowest point</p></div>
        <div><label className="block text-sm font-medium mb-2">Hip (cm)</label><input type="number" min="50" max="200" value={hip} onChange={(e) => setHip(e.target.value)} placeholder="100" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /><p className="text-xs text-muted-foreground mt-1">Measure at widest point</p></div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Waist-to-Hip Ratio</p>
            <p className="text-4xl font-bold text-primary mt-1">{result.ratio.toFixed(2)}</p>
            <p className={`text-lg font-semibold mt-1 ${result.color}`}>{result.risk}</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">WHO Guidelines ({gender === 'male' ? 'Men' : 'Women'}):</p>
            <p>Low risk: {'<'} {gender === 'male' ? '0.90' : '0.80'} | Moderate: {gender === 'male' ? '0.90-0.99' : '0.80-0.84'} | High: {gender === 'male' ? '1.0+' : '0.85+'}</p>
            <p className="mt-2">Waist circumference ({w}cm): <span className="font-medium text-foreground">{result.waistRisk}</span></p>
          </div>
        </div>
      )}
    </div>
  )
}
