import { useState, useMemo } from 'react'

type Gender = 'male' | 'female'
type Unit = 'cm' | 'ftin'
type Background = 'standard' | 'lower'

// Top of the healthy BMI band: 24.9, or 22.9 for people of South Asian, Chinese, other Asian,
// Middle Eastern, Black African or African-Caribbean family background (NICE NG246 1.9.11).
const HEALTHY_TOP: Record<Background, number> = { standard: 24.9, lower: 22.9 }
const FIVE_FEET_CM = 152.4

function calculate(heightCm: number, gender: Gender, background: Background) {
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
  const bmiTop = HEALTHY_TOP[background]
  const bmiMin = 18.5 * heightM * heightM
  const bmiMax = bmiTop * heightM * heightM

  return {
    robinson, miller, devine, hamwi,
    average: (robinson + miller + devine + hamwi) / 4,
    bmiMin, bmiMax, bmiTop,
    underFiveFeet: heightCm < FIVE_FEET_CM,
  }
}

const toggleCls = (on: boolean) => `px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${on ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`
const inputCls = 'w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function IdealWeightCalculator() {
  const [unit, setUnit] = useState<Unit>('cm')
  const [height, setHeight] = useState('175')
  const [feet, setFeet] = useState('5')
  const [inches, setInches] = useState('9')
  const [gender, setGender] = useState<Gender>('male')
  const [background, setBackground] = useState<Background>('standard')

  const h = unit === 'cm'
    ? parseFloat(height) || 0
    : ((parseFloat(feet) || 0) * 12 + (parseFloat(inches) || 0)) * 2.54
  const result = useMemo(() => calculate(h, gender, background), [h, gender, background])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        {(['male', 'female'] as Gender[]).map(g => (
          <button key={g} type="button" onClick={() => setGender(g)} className={toggleCls(gender === g)}>{g === 'male' ? 'Male' : 'Female'}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {(['cm', 'ftin'] as Unit[]).map(u => (
          <button key={u} type="button" onClick={() => setUnit(u)} className={toggleCls(unit === u)}>{u === 'cm' ? 'Height in cm' : 'Height in ft and in'}</button>
        ))}
      </div>
      {unit === 'cm' ? (
        <div>
          <label className="block text-sm font-medium mb-2">Height (cm)</label>
          <input type="number" min="100" max="250" value={height} onChange={(e) => setHeight(e.target.value)} className={inputCls} aria-label="Height (cm)" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Feet</label>
            <input type="number" min="3" max="8" value={feet} onChange={(e) => setFeet(e.target.value)} className={inputCls} aria-label="Height (feet)" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Inches</label>
            <input type="number" min="0" max="11" value={inches} onChange={(e) => setInches(e.target.value)} className={inputCls} aria-label="Height (inches)" />
          </div>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-2">Family background (for the BMI range)</label>
        <select value={background} onChange={(e) => setBackground(e.target.value as Background)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Family background">
          <option value="standard">White or other</option>
          <option value="lower">South Asian, Chinese, other Asian, Middle Eastern, Black African or African-Caribbean</option>
        </select>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up" aria-live="polite">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Average of the four formulas</p>
            <p className="text-3xl font-bold text-primary mt-1">{result.average.toFixed(1)} kg</p>
            <p className="text-sm text-muted-foreground mt-1">Healthy weight from BMI 18.5 – {result.bmiTop.toFixed(1)}: {result.bmiMin.toFixed(1)} – {result.bmiMax.toFixed(1)} kg</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Robinson</p><p className="text-lg font-bold">{result.robinson.toFixed(1)} kg</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Miller</p><p className="text-lg font-bold">{result.miller.toFixed(1)} kg</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Devine</p><p className="text-lg font-bold">{result.devine.toFixed(1)} kg</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Hamwi</p><p className="text-lg font-bold">{result.hamwi.toFixed(1)} kg</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
            {result.underFiveFeet && (
              <p className="font-medium text-foreground">The four formulas start at 5ft (152 cm) and do not adjust below it, so for shorter heights use the BMI range instead.</p>
            )}
            <p>The formulas were written for drug dosing, not as health targets, and take no account of build or muscle. The BMI range is the one the NHS uses for adults aged 18 and over.</p>
          </div>
        </div>
      )}
    </div>
  )
}
