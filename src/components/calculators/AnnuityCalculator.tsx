import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Approximate annuity rates by age (indicative 2025)
const ANNUITY_RATES: Record<number, number> = {
  55: 4.8, 57: 5.0, 60: 5.4, 62: 5.7, 65: 6.2, 67: 6.6, 70: 7.2, 75: 8.5,
}

function getRate(age: number): number {
  const ages = Object.keys(ANNUITY_RATES).map(Number).sort((a, b) => a - b)
  if (age <= ages[0]) return ANNUITY_RATES[ages[0]]
  if (age >= ages[ages.length - 1]) return ANNUITY_RATES[ages[ages.length - 1]]
  for (let i = 0; i < ages.length - 1; i++) {
    if (age >= ages[i] && age < ages[i + 1]) {
      const ratio = (age - ages[i]) / (ages[i + 1] - ages[i])
      return ANNUITY_RATES[ages[i]] + ratio * (ANNUITY_RATES[ages[i + 1]] - ANNUITY_RATES[ages[i]])
    }
  }
  return 5.5
}

function calculate(pot: number, age: number, takeLumpSum: boolean, jointLife: boolean) {
  const lumpSum = takeLumpSum ? pot * 0.25 : 0
  const annuityPot = pot - lumpSum
  let rate = getRate(age)
  if (jointLife) rate *= 0.85 // ~15% reduction for joint life
  const annualIncome = annuityPot * (rate / 100)
  const monthlyIncome = annualIncome / 12

  return { lumpSum, annuityPot, rate, annualIncome, monthlyIncome }
}

export default function AnnuityCalculator() {
  const [pot, setPot] = useState('200000')
  const [age, setAge] = useState('65')
  const [lump, setLump] = useState(true)
  const [joint, setJoint] = useState(false)

  const p = parseFloat(pot.replace(/,/g,'')) || 0
  const a = parseInt(age) || 65
  const result = useMemo(() => calculate(p, a, lump, joint), [p, a, lump, joint])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Pension Pot</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={pot} onChange={(e) => setPot(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Age at Purchase</label><input type="number" min="55" max="85" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={lump} onChange={(e) => setLump(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Take 25% tax-free lump sum</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={joint} onChange={(e) => setJoint(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Joint life annuity (continues paying spouse)</span></label>
      </div>

      {p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Annual Income</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.annualIncome)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyIncome)}/month &middot; {result.rate.toFixed(1)}% annuity rate</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {lump && <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Tax-Free Lump Sum</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.lumpSum)}</p></div>}
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annuity Purchase</p><p className="text-lg font-bold">{formatCurrency(result.annuityPot)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Type</p><p className="text-lg font-bold">{joint ? 'Joint Life' : 'Single Life'}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Indicative rates only. Actual annuity rates vary by provider, health and features. Shop around using the Open Market Option.</p>
          </div>
        </div>
      )}
    </div>
  )
}
