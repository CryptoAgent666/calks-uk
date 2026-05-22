import { useState } from 'react'

// BMI children — simplified percentile check
const PERCENTILES = {
  underweight: 2, healthy_low: 2, healthy_high: 91, overweight: 91, obese: 98
}

export default function NICEFIQCalculator() {
  const [age, setAge] = useState('8')
  const [gender, setGender] = useState('boy')
  const [height, setHeight] = useState('128')
  const [weight, setWeight] = useState('26')

  const h = parseFloat(height) || 0
  const w = parseFloat(weight) || 0
  const a = parseInt(age) || 0
  const bmi = h > 0 ? w / Math.pow(h / 100, 2) : 0

  // Simplified child BMI interpretation (actual requires centile charts)
  let category = 'Healthy weight'
  let color = 'text-green-700 dark:text-green-400'
  if (a >= 2 && a <= 18 && bmi > 0) {
    // Very rough approximation
    const healthyBmi = 14 + (a - 2) * 0.5
    if (bmi < healthyBmi * 0.85) { category = 'Underweight'; color = 'text-blue-600' }
    else if (bmi < healthyBmi * 1.15) { category = 'Healthy weight'; color = 'text-green-700 dark:text-green-400' }
    else if (bmi < healthyBmi * 1.3) { category = 'Overweight'; color = 'text-orange-600' }
    else { category = 'Very overweight (obese)'; color = 'text-red-600' }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Age (2-18)</label><input type="number" min="2" max="18" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Age (2-18)" /></div>
        <div><label className="block text-sm font-medium mb-2">Gender</label><select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Gender"><option value="boy">Boy</option><option value="girl">Girl</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Height (cm)</label><input type="number" min="50" max="200" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Height (cm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Weight (kg)</label><input type="number" min="5" max="150" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weight (kg)" /></div>
      </div>
      {bmi > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">BMI for age {a} {gender}</p>
            <p className="text-4xl font-bold text-primary mt-1">{bmi.toFixed(1)}</p>
            <p className={`text-lg font-semibold mt-1 ${color}`}>{category}</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Children's BMI is interpreted differently from adults — it's compared against growth charts for age and sex. This is an approximation. For accurate results, use the NHS child BMI centile tool or ask your GP/health visitor.</p>
          </div>
        </div>
      )}
    </div>
  )
}
