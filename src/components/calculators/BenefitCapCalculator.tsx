import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Benefit cap 2026/27 (from April 2025, uprated 1.7% CPI from 2023/24 rates)
// 2023/24 rates were: couple London £25,323, single London £16,967, couple outside £22,020, single outside £14,753
const CAPS = {
  single_london: 1_437.84 * 12, // £17,254/year (was £1,284.17/month pre-2023 freeze)
  couple_london: 2_146.82 * 12, // £25,762/year
  single_outside: 1_250.82 * 12, // £15,010/year
  couple_outside: 1_866.15 * 12, // £22,394/year
}

function calculate(isLondon: boolean, isSingle: boolean, monthlyBenefits: number, isExempt: boolean) {
  const key = `${isSingle ? 'single' : 'couple'}_${isLondon ? 'london' : 'outside'}` as keyof typeof CAPS
  const annualCap = CAPS[key]
  const monthlyCap = annualCap / 12
  const annualBenefits = monthlyBenefits * 12

  if (isExempt) return { capped: false, monthlyCap, annualCap, reduction: 0, reason: 'You may be exempt from the benefit cap (working/disability/carer)' }

  const overcap = Math.max(0, monthlyBenefits - monthlyCap)
  const annualReduction = overcap * 12

  return { capped: overcap > 0, monthlyCap, annualCap, reduction: overcap, annualReduction, monthlyAfterCap: Math.min(monthlyBenefits, monthlyCap) }
}

export default function BenefitCapCalculator() {
  const [london, setLondon] = useState(false)
  const [single, setSingle] = useState(false)
  const [benefits, setBenefits] = useState('1800')
  const [exempt, setExempt] = useState(false)

  const b = parseFloat(benefits) || 0
  const result = useMemo(() => calculate(london, single, b, exempt), [london, single, b, exempt])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Total Monthly Benefits</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={benefits} onChange={(e) => setBenefits(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Total Monthly Benefits" /></div><p className="text-xs text-muted-foreground mt-1">Include UC, Child Benefit, housing element etc.</p></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setLondon(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${!london ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Outside London</button>
        <button onClick={() => setLondon(true)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${london ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>London</button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setSingle(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${!single ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Couple / Family</button>
        <button onClick={() => setSingle(true)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${single ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Single (no children)</button>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={exempt} onChange={(e) => setExempt(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Exempt (working 16+ hrs/wk, disability benefit, carer's allowance, or guardian's allowance)</span></label>

      <div className={`rounded-2xl p-6 text-center ${result.capped ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}>
        {result.capped ? (
          <><p className="text-lg font-bold text-destructive">Benefits Capped</p><p className="text-sm text-muted-foreground mt-1">Reduced by {formatCurrency(result.reduction)}/month ({formatCurrency(result.annualReduction || 0)}/year)</p><p className="text-sm text-muted-foreground">You'll receive {formatCurrency(result.monthlyAfterCap || 0)}/month instead of {formatCurrency(b)}/month</p></>
        ) : (
          <><p className="text-lg font-bold text-green-700 dark:text-green-400">{result.reason || 'Under the benefit cap'}</p><p className="text-sm text-muted-foreground mt-1">Your cap: {formatCurrency(result.monthlyCap)}/month</p></>
        )}
      </div>

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Benefit Cap (2026/27):</p>
        <p>Couple/family: £{(CAPS.couple_outside / 12).toFixed(0)}/month (outside London) / £{(CAPS.couple_london / 12).toFixed(0)}/month (London)</p>
        <p>Single: £{(CAPS.single_outside / 12).toFixed(0)}/month (outside London) / £{(CAPS.single_london / 12).toFixed(0)}/month (London)</p>
      </div>
    </div>
  )
}
