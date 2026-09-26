import { useState } from 'react'
import { BMI_LMS, BMI_LMS_FIRST_MONTH } from '@/data/uk-who-bmi-lms'

// BMI centile for children aged 2-18 against the UK-WHO / UK90 reference, with the UK clinical
// cut-offs used by the NHS and RCPCH: on or below the 2nd centile underweight, 91st or above
// overweight, 98th or above very overweight (obese).
const Z_2ND = -2.0537
const Z_91ST = 1.3408
const Z_98TH = 2.0537

// Abramowitz-Stegun approximation of the normal CDF (error < 1e-7)
function normalCdf(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp((-z * z) / 2)
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return z > 0 ? 1 - p : p
}

function bmiZ(sex: 'boy' | 'girl', ageMonths: number, bmi: number) {
  const rows = BMI_LMS[sex]
  const pos = Math.min(Math.max(ageMonths - BMI_LMS_FIRST_MONTH, 0), rows.length - 1)
  const i = Math.min(Math.floor(pos), rows.length - 2)
  const f = pos - i
  const [L, M, S] = rows[i].map((v, k) => v + (rows[i + 1][k] - v) * f)
  return L === 0 ? Math.log(bmi / M) / S : (Math.pow(bmi / M, L) - 1) / (L * S)
}

function formatCentile(c: number) {
  if (c < 0.4) return 'below the 0.4th'
  if (c > 99.6) return 'above the 99.6th'
  const n = Math.round(c)
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? 'th' : n % 10 === 1 ? 'st' : n % 10 === 2 ? 'nd' : n % 10 === 3 ? 'rd' : 'th'
  return `${n}${suffix}`
}

export default function NICEFIQCalculator() {
  const [age, setAge] = useState('8')
  const [months, setMonths] = useState('0')
  const [gender, setGender] = useState<'boy' | 'girl'>('boy')
  const [height, setHeight] = useState('128')
  const [weight, setWeight] = useState('26')

  const h = parseFloat(height) || 0
  const w = parseFloat(weight) || 0
  const a = parseInt(age) || 0
  const m = Math.min(11, Math.max(0, parseInt(months) || 0))
  const ageMonths = a * 12 + m
  const inRange = ageMonths >= 24 && ageMonths <= 216
  const bmi = h > 0 ? w / Math.pow(h / 100, 2) : 0

  let category = ''
  let color = 'text-green-700 dark:text-green-400'
  let centile = ''
  if (inRange && bmi > 0) {
    const z = bmiZ(gender, ageMonths, bmi)
    centile = formatCentile(normalCdf(z) * 100)
    if (z <= Z_2ND) { category = 'Underweight'; color = 'text-blue-600' }
    else if (z < Z_91ST) { category = 'Healthy weight'; color = 'text-green-700 dark:text-green-400' }
    else if (z < Z_98TH) { category = 'Overweight'; color = 'text-orange-600' }
    else { category = 'Very overweight (obese)'; color = 'text-red-600' }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div><label className="block text-sm font-medium mb-2">Age, years (2-18)</label><input type="number" min="2" max="18" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Age in years (2-18)" /></div>
        <div><label className="block text-sm font-medium mb-2">and months</label><input type="number" min="0" max="11" value={months} onChange={(e) => setMonths(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Additional months of age (0-11)" /></div>
        <div><label className="block text-sm font-medium mb-2">Sex</label><select value={gender} onChange={(e) => setGender(e.target.value as 'boy' | 'girl')} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Sex"><option value="boy">Boy</option><option value="girl">Girl</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Height (cm)</label><input type="number" min="50" max="200" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Height (cm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Weight (kg)</label><input type="number" min="5" max="150" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weight (kg)" /></div>
      </div>
      {bmi > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">BMI for a {gender} aged {a}{m > 0 ? ` years ${m} months` : ''}</p>
            <p className="text-4xl font-bold text-primary mt-1">{bmi.toFixed(1)}</p>
            {inRange ? (
              <>
                <p className={`text-lg font-semibold mt-1 ${color}`}>{category}</p>
                <p className="text-sm text-muted-foreground mt-1">{centile} centile on the UK growth reference</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">Enter an age between 2 and 18 years to see the centile.</p>
            )}
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
            <p>Centiles use the UK-WHO growth reference (WHO standard to age 4, UK90 from 4), with the NHS clinical cut-offs: on or below the 2nd centile underweight, 2nd to 91st healthy, 91st or above overweight, 98th or above very overweight.</p>
            <p>The National Child Measurement Programme uses lower population cut-offs (85th and 95th centiles), so school letters can use different labels. A single reading is a snapshot; ask your GP or health visitor to plot measurements over time.</p>
          </div>
        </div>
      )}
    </div>
  )
}
