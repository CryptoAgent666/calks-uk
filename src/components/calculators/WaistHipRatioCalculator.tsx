import { useState, useMemo } from 'react'

type Gender = 'male' | 'female'

// WHO Expert Consultation 2008, Table A1: waist-hip ratio at or above these is
// "substantially increased" risk of metabolic complications. WHO gives one cut-off, no bands.
const WHO_WHR_CUTOFF: Record<Gender, number> = { male: 0.90, female: 0.85 }

const inRange = (value: number, min: number, max: number) => value >= min && value <= max
const twoDp = (value: number) => Math.round(value * 100) / 100

function calculate(waist: number, hip: number, gender: Gender, height: number) {
  if (!inRange(waist, 40, 200) || !inRange(hip, 50, 200)) return null
  const ratio = twoDp(waist / hip)
  const cutoff = WHO_WHR_CUTOFF[gender]
  const atOrAbove = ratio >= cutoff

  // Waist figures from the same WHO report, Table A1, which notes they came from a European sample
  const [waistIncreased, waistSubstantial] = gender === 'male' ? [94, 102] : [80, 88]
  let waistRisk = 'Not above the increased-risk figure'
  if (waist > waistSubstantial) waistRisk = 'Substantially increased risk'
  else if (waist > waistIncreased) waistRisk = 'Increased risk'

  // NICE NG246 recommendation 1.9.14: waist-to-height classes
  let whtr: number | null = null
  let whtrClass = ''
  if (inRange(height, 100, 250)) {
    whtr = twoDp(waist / height)
    if (whtr >= 0.6) whtrClass = 'High central adiposity'
    else if (whtr >= 0.5) whtrClass = 'Increased central adiposity'
    else if (whtr >= 0.4) whtrClass = 'Healthy central adiposity'
    else whtrClass = 'Below 0.4, outside the NICE classes'
  }

  return { ratio, cutoff, atOrAbove, waistRisk, whtr, whtrClass }
}

export default function WaistHipRatioCalculator() {
  const [waist, setWaist] = useState('')
  const [hip, setHip] = useState('')
  const [height, setHeight] = useState('')
  const [gender, setGender] = useState<Gender>('male')

  const w = parseFloat(waist) || 0
  const h = parseFloat(hip) || 0
  const ht = parseFloat(height) || 0
  const result = useMemo(() => calculate(w, h, gender, ht), [w, h, gender, ht])
  const measurementsOutOfRange = waist !== '' && hip !== '' && !result
  const heightOutOfRange = height !== '' && !inRange(ht, 100, 250)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        {(['male', 'female'] as Gender[]).map(g => (
          <button key={g} onClick={() => setGender(g)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${gender === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{g === 'male' ? 'Male' : 'Female'}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Waist (cm)</label><input type="number" min="40" max="200" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="85" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Waist (cm)" /><p className="text-xs text-muted-foreground mt-1">Midway between lowest rib and top of hip</p></div>
        <div><label className="block text-sm font-medium mb-2">Hip (cm)</label><input type="number" min="50" max="200" value={hip} onChange={(e) => setHip(e.target.value)} placeholder="100" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hip (cm)" /><p className="text-xs text-muted-foreground mt-1">Widest part of the buttocks</p></div>
        <div><label className="block text-sm font-medium mb-2">Height (cm, optional)</label><input type="number" min="100" max="250" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Height (cm, optional)" /><p className="text-xs text-muted-foreground mt-1">Adds the NICE waist-to-height class</p></div>
      </div>

      {measurementsOutOfRange && <p className="text-sm text-destructive" role="alert">Enter a waist from 40 to 200 cm and hips from 50 to 200 cm.</p>}
      {heightOutOfRange && <p className="text-sm text-destructive" role="alert">Enter a height from 100 to 250 cm, or leave it blank.</p>}

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Waist-to-Hip Ratio</p>
            <p className="text-4xl font-bold text-primary mt-1">{result.ratio.toFixed(2)}</p>
            <p className={`text-lg font-semibold mt-1 ${result.atOrAbove ? 'text-destructive' : 'text-green-700 dark:text-green-400'}`}>{result.atOrAbove ? 'At or above the WHO cut-off' : 'Below the WHO cut-off'}</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">WHO cut-off ({gender === 'male' ? 'Men' : 'Women'}): {result.cutoff.toFixed(2)}</p>
            <p>At or above it, WHO lists a substantially increased risk of metabolic complications.</p>
            <p className="mt-2">Waist circumference ({w}cm): <span className="font-medium text-foreground">{result.waistRisk}</span></p>
            {result.whtr !== null && (
              <p className="mt-2">Waist-to-height ratio {result.whtr.toFixed(2)} (NICE): <span className="font-medium text-foreground">{result.whtrClass}</span></p>
            )}
          </div>
        </div>
      )}
      <p className="text-xs text-muted-foreground">For adults. NICE and the NHS use waist-to-height ratio rather than this ratio. NICE says people with a South Asian, Chinese, other Asian, Middle Eastern, Black African or African-Caribbean background are prone to central adiposity, and these cut-offs are not adjusted for that. Not designed for use in pregnancy or with an eating disorder; talk to your GP.</p>
    </div>
  )
}
