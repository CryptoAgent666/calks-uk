import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(coverAmount: number, age: number, termYears: number, isSmoker: boolean) {
  // Indicative monthly premiums per £100K cover
  const basePer100k: Record<string, number> = {
    '25': 8, '30': 12, '35': 18, '40': 30, '45': 50, '50': 85, '55': 140,
  }

  const ageKey = String(Math.min(Math.max(Math.round(age / 5) * 5, 25), 55))
  const base = basePer100k[ageKey] || 30
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
        <div><label className="block text-sm font-medium mb-2">Your Age</label><input type="number" min="18" max="60" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Age" /></div>
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
          </div>
        </div>
      )}
    </div>
  )
}
