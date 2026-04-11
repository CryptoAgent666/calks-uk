import { useState, useMemo } from 'react'

type Unit = 'metric' | 'imperial'

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600' }
  if (bmi < 25) return { label: 'Healthy weight', color: 'text-green-600' }
  if (bmi < 30) return { label: 'Overweight', color: 'text-orange-600' }
  return { label: 'Obese', color: 'text-red-600' }
}

export default function BmiCalculator() {
  const [unit, setUnit] = useState<Unit>('metric')
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [weightSt, setWeightSt] = useState('')
  const [weightLb, setWeightLb] = useState('')

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
    const category = getBmiCategory(bmi)
    const healthyMin = 18.5 * heightM * heightM
    const healthyMax = 24.9 * heightM * heightM

    return { bmi, category, healthyMin, healthyMax }
  }, [unit, heightCm, weightKg, heightFt, heightIn, weightSt, weightLb])

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="grid grid-cols-2 gap-2">
        {(['metric', 'imperial'] as Unit[]).map((u) => (
          <button
            key={u}
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
            <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="175" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Weight (kg)</label>
            <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="75" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Feet</label>
            <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="5" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Inches</label>
            <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="9" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stone</label>
            <input type="number" value={weightSt} onChange={(e) => setWeightSt(e.target.value)} placeholder="11" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Pounds</label>
            <input type="number" value={weightLb} onChange={(e) => setWeightLb(e.target.value)} placeholder="10" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Your BMI</p>
            <p className="text-4xl font-bold mt-1">{result.bmi.toFixed(1)}</p>
            <p className={`text-lg font-semibold mt-1 ${result.category.color}`}>{result.category.label}</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Healthy BMI range: <span className="font-medium text-foreground">18.5 – 24.9</span></p>
            <p>Healthy weight for your height: <span className="font-medium text-foreground">{result.healthyMin.toFixed(1)} – {result.healthyMax.toFixed(1)} kg</span></p>
          </div>
        </div>
      )}
    </div>
  )
}
