import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Indicative monthly premiums per £100,000 of level stand-alone critical illness cover, 25-year term, non-smoker.
// Ages 25-50: twice the £50,000 quotes published by iam insured (updated September 2026):
// https://iaminsured.co.uk/life-insurance/guides/average-cost-of-critical-illness-cover-uk/
// Age 55 is extrapolated at the same five-year rate of increase as 45 to 50 (x1.75).
const BASE_PER_100K: [number, number][] = [
  [25, 17.56], [30, 22.42], [35, 31.58], [40, 45.74], [45, 67.24], [50, 117.44], [55, 205.12],
]
const MIN_AGE = 25
const MAX_AGE = 55

function basePremium(age: number) {
  const a = Math.min(Math.max(age, MIN_AGE), MAX_AGE)
  for (let i = 1; i < BASE_PER_100K.length; i++) {
    const [a1, p1] = BASE_PER_100K[i]
    if (a <= a1) {
      const [a0, p0] = BASE_PER_100K[i - 1]
      // Premiums rise by a roughly constant percentage each year, so interpolate on a log scale
      return p0 * Math.pow(p1 / p0, (a - a0) / (a1 - a0))
    }
  }
  return BASE_PER_100K[BASE_PER_100K.length - 1][1]
}

function calculate(coverAmount: number, age: number, termYears: number, isSmoker: boolean) {
  const base = basePremium(age)
  // Smokers paid 40-78% more on the same quotes (ages 25-50)
  const smokerFactor = isSmoker ? 1.6 : 1
  const termFactor = termYears > 25 ? 1.2 : termYears > 15 ? 1.0 : 0.85

  const monthlyPremium = (coverAmount / 100_000) * base * smokerFactor * termFactor
  const annualPremium = monthlyPremium * 12
  const totalPremiums = annualPremium * termYears

  return { monthlyPremium, annualPremium, totalPremiums, coverAmount }
}

export default function CriticalIllnessCalculator() {
  const [cover, setCover] = useState('200000')
  const [age, setAge] = useState('35')
  const [term, setTerm] = useState('25')
  const [smoker, setSmoker] = useState(false)

  const c = parseFloat(cover.replace(/,/g,'')) || 0
  const a = parseInt(age) || 35
  const t = parseInt(term) || 25
  const result = useMemo(() => calculate(c, a, t, smoker), [c, a, t, smoker])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Cover Amount</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={cover} onChange={(e) => setCover(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Cover Amount" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Your Age</label><input type="number" min="18" max="55" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Age" /></div>
        <div><label className="block text-sm font-medium mb-2">Term (years)</label><input type="number" min="5" max="40" value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Term (years)" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={smoker} onChange={(e) => setSmoker(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Smoker (+60%)</span></label>

      {c > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Monthly Premium</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.monthlyPremium)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.annualPremium)}/year for {formatCurrency(c)} cover</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Total Premiums ({t} years)</p><p className="text-lg font-bold">{formatCurrency(result.totalPremiums)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Cover Amount</p><p className="text-lg font-bold">{formatCurrency(c)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Critical illness cover pays a lump sum if diagnosed with a specified condition (cancer, heart attack, stroke etc.). Premiums increase significantly with age and for smokers. Compare quotes from multiple providers.</p>
            <p className="mt-1">Estimates are based on published broker quotes for level cover (iam insured, September 2026). {a > 50 ? 'Rates above age 50 are extrapolated and ages over 55 use the age-55 rate, so treat this figure as rough.' : 'Your own quote depends on your health, occupation and the insurer.'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
