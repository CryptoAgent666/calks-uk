import { useState, useMemo } from 'react'

type Unit = 'metric' | 'imperial'
type Background = 'standard' | 'lower'

// NICE NG246 (Jan 2025) 1.9.10 and 1.9.11. People of South Asian, Chinese, other Asian,
// Middle Eastern, Black African or African-Caribbean family background: overweight 23 to 27.4,
// obesity 27.5 or above; obesity classes 2 and 3 usually set 2.5 lower than the standard 35 and 40.
const THRESHOLDS: Record<Background, { overweight: number; obese: number; class2: number; class3: number }> = {
  standard: { overweight: 25, obese: 30, class2: 35, class3: 40 },
  lower: { overweight: 23, obese: 27.5, class2: 32.5, class3: 37.5 },
}

const BACKGROUNDS: { value: Background; label: string }[] = [
  { value: 'standard', label: 'White or other' },
  { value: 'lower', label: 'South Asian, Chinese, other Asian, Middle Eastern, Black African or African-Caribbean' },
]

const UNDERWEIGHT_BELOW = 18.5

function getBmiCategory(bmi: number, bg: Background) {
  const t = THRESHOLDS[bg]
  if (bmi < UNDERWEIGHT_BELOW) return { label: 'Underweight', color: 'text-blue-600' }
  if (bmi < t.overweight) return { label: 'Healthy weight', color: 'text-green-600' }
  if (bmi < t.obese) return { label: 'Overweight', color: 'text-orange-600' }
  if (bmi < t.class2) return { label: 'Obesity (class 1)', color: 'text-red-600' }
  if (bmi < t.class3) return { label: 'Obesity (class 2)', color: 'text-red-600' }
  return { label: 'Severe obesity (class 3)', color: 'text-red-600' }
}

function fmtRange(lo: number, hi: number) {
  return `${lo.toFixed(1)} – ${hi.toFixed(1)}`
}

function toStLb(kg: number) {
  const totalLb = Math.round(kg / 0.453592)
  return `${Math.floor(totalLb / 14)} st ${totalLb % 14} lb`
}

const inputCls = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function BmiCalculator() {
  const [unit, setUnit] = useState<Unit>('metric')
  const [background, setBackground] = useState<Background>('standard')
  const [heightCm, setHeightCm] = useState('175')
  const [weightKg, setWeightKg] = useState('75')
  const [heightFt, setHeightFt] = useState('5')
  const [heightIn, setHeightIn] = useState('9')
  const [weightSt, setWeightSt] = useState('11')
  const [weightLb, setWeightLb] = useState('10')

  const result = useMemo(() => {
    let heightM: number
    let weightKgVal: number

    if (unit === 'metric') {
      heightM = (parseFloat(heightCm) || 0) / 100
      weightKgVal = parseFloat(weightKg) || 0
    } else {
      const totalInches = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0)
      heightM = totalInches * 0.0254
      weightKgVal = ((parseFloat(weightSt) || 0) * 14 + (parseFloat(weightLb) || 0)) * 0.453592
    }

    if (heightM <= 0 || weightKgVal <= 0) return null

    const bmi = weightKgVal / (heightM * heightM)
    const shown = Math.round(bmi * 10) / 10
    const category = getBmiCategory(shown, background)
    // Healthy BMI band: 18.5 up to 24.9 (standard) or 22.9 (lower-threshold groups)
    const healthyTop = Math.round((THRESHOLDS[background].overweight - 0.1) * 10) / 10
    const healthyMin = UNDERWEIGHT_BELOW * heightM * heightM
    const healthyMax = healthyTop * heightM * heightM

    return { bmi: shown, category, healthyTop, healthyMin, healthyMax }
  }, [unit, background, heightCm, weightKg, heightFt, heightIn, weightSt, weightLb])

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="grid grid-cols-2 gap-2">
        {(['metric', 'imperial'] as Unit[]).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUnit(u)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
              unit === u ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'
            }`}
          >
            {u === 'metric' ? 'Metric (cm / kg)' : 'Imperial (ft in / st lb)'}
          </button>
        ))}
      </div>

      {/* Inputs */}
      {unit === 'metric' ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Height (cm)</label>
            <input type="number" min="0" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="175" className={inputCls} aria-label="Height (cm)" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Weight (kg)</label>
            <input type="number" min="0" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="75" className={inputCls} aria-label="Weight (kg)" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Feet</label>
            <input type="number" min="0" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="5" className={inputCls} aria-label="Feet" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Inches</label>
            <input type="number" min="0" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="9" className={inputCls} aria-label="Inches" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stone</label>
            <input type="number" min="0" value={weightSt} onChange={(e) => setWeightSt(e.target.value)} placeholder="11" className={inputCls} aria-label="Stone" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Pounds</label>
            <input type="number" min="0" value={weightLb} onChange={(e) => setWeightLb(e.target.value)} placeholder="10" className={inputCls} aria-label="Pounds" />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Family background</label>
        <select value={background} onChange={(e) => setBackground(e.target.value as Background)} className={`${inputCls} text-sm`} aria-label="Family background">
          {BACKGROUNDS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
        </select>
        <p className="text-xs text-muted-foreground mt-1">NICE uses lower BMI thresholds for people from these backgrounds, because their health risks rise at a lower BMI.</p>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in-up" aria-live="polite">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Your BMI</p>
            <p className="text-4xl font-bold mt-1">{result.bmi.toFixed(1)}</p>
            <p className={`text-lg font-semibold mt-1 ${result.category.color}`}>{result.category.label}</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p>Healthy BMI range: <span className="font-medium text-foreground">18.5 – {result.healthyTop.toFixed(1)}</span></p>
            <p>Healthy weight for your height: <span className="font-medium text-foreground">{fmtRange(result.healthyMin, result.healthyMax)} kg</span>
              {unit === 'imperial' && <span className="font-medium text-foreground"> ({toStLb(result.healthyMin)} – {toStLb(result.healthyMax)})</span>}
            </p>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
        <p>For adults aged 18 and over. For under-18s use the <a href="/calculator/bmi-children-calculator/" className="text-primary underline">BMI calculator for children</a>, because adult categories do not apply while they are growing.</p>
        <p>BMI does not tell muscle from fat. NICE also suggests checking that your waist is less than half your height.</p>
      </div>
    </div>
  )
}
