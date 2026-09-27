import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Benefit cap 2026/27 (uprated 3.8% CPI for general benefits; cap itself frozen at 2023/24 rates)
// 2023/24 rates were: couple London £25,323, single London £16,967, couple outside £22,020, single outside £14,753
const CAPS = {
  single_london: 1_413.92 * 12, // £16,967/year
  couple_london: 2_110.25 * 12, // £25,323/year
  single_outside: 1_229.42 * 12, // £14,753/year
  couple_outside: 1_835.00 * 12, // £22,020/year
}

// For Universal Credit the whole award is reduced by the excess over the cap, less any
// childcare costs element (UC Regs 2013 reg 81), because the cap does not apply to help
// with childcare.
function calculate(isLondon: boolean, isSingle: boolean, monthlyBenefits: number, isExempt: boolean, childcareElement = 0) {
  const key = `${isSingle ? 'single' : 'couple'}_${isLondon ? 'london' : 'outside'}` as keyof typeof CAPS
  const annualCap = CAPS[key]
  const monthlyCap = annualCap / 12

  if (isExempt) return { capped: false, monthlyCap, annualCap, excess: 0, reduction: 0, reason: 'Exempt from the benefit cap (earnings of £881+ a month, or a qualifying disability or carer benefit)' }

  const excess = Math.max(0, Math.round((monthlyBenefits - monthlyCap) * 100) / 100)
  const reduction = Math.max(0, Math.round((excess - Math.max(0, childcareElement)) * 100) / 100)
  const annualReduction = reduction * 12
  const reason = excess > 0 && reduction === 0
    ? 'Over the cap, but your UC childcare costs element covers the excess'
    : undefined

  return { capped: reduction > 0, monthlyCap, annualCap, excess, reduction, annualReduction, monthlyAfterCap: monthlyBenefits - reduction, reason }
}

export default function BenefitCapCalculator() {
  const [london, setLondon] = useState(false)
  const [single, setSingle] = useState(false)
  const [benefits, setBenefits] = useState('2100')
  const [childcare, setChildcare] = useState('')
  const [exempt, setExempt] = useState(false)

  const b = parseFloat(benefits) || 0
  const cc = parseFloat(childcare) || 0
  const result = useMemo(() => calculate(london, single, b, exempt, cc), [london, single, b, exempt, cc])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Total Monthly Benefits</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={benefits} onChange={(e) => setBenefits(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Total Monthly Benefits" /></div><p className="text-xs text-muted-foreground mt-1">Include UC (with any housing and childcare elements), Child Benefit and other counted benefits</p></div>
        <div><label className="block text-sm font-medium mb-2">UC childcare costs element (optional)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={childcare} onChange={(e) => setChildcare(e.target.value)} placeholder="0" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="UC childcare costs element (per month)" /></div><p className="text-xs text-muted-foreground mt-1">Per month. The cap is not applied to this element, so it is taken off the reduction</p></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setLondon(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${!london ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Outside London</button>
        <button onClick={() => setLondon(true)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${london ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>London</button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setSingle(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${!single ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Couple / Family</button>
        <button onClick={() => setSingle(true)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${single ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Single (no children)</button>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={exempt} onChange={(e) => setExempt(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Exempt (earning £881+ a month after tax and NI, or someone in the household gets a disability or carer benefit such as PIP, DLA or Carer's Allowance, the UC health or carer element, or Guardian's Allowance)</span></label>

      <div className={`rounded-2xl p-6 text-center ${result.capped ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}>
        {result.capped ? (
          <><p className="text-lg font-bold text-destructive">Benefits Capped</p><p className="text-sm text-muted-foreground mt-1">Reduced by {formatCurrency(result.reduction)}/month ({formatCurrency(result.annualReduction || 0)}/year)</p>{cc > 0 && <p className="text-sm text-muted-foreground">Excess over the cap {formatCurrency(result.excess)} less childcare costs element {formatCurrency(cc)}</p>}<p className="text-sm text-muted-foreground">You'll receive {formatCurrency(result.monthlyAfterCap || 0)}/month instead of {formatCurrency(b)}/month</p></>
        ) : (
          <><p className="text-lg font-bold text-green-700 dark:text-green-400">{result.reason || 'Under the benefit cap'}</p><p className="text-sm text-muted-foreground mt-1">Your cap: {formatCurrency(result.monthlyCap)}/month</p></>
        )}
      </div>

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Benefit Cap (2026/27):</p>
        <p>Couple or lone parent: {formatCurrency(CAPS.couple_outside / 12)}/month (outside London) / {formatCurrency(CAPS.couple_london / 12)}/month (London)</p>
        <p>Single, no children: {formatCurrency(CAPS.single_outside / 12)}/month (outside London) / {formatCurrency(CAPS.single_london / 12)}/month (London)</p>
        <p className="mt-2">For Universal Credit the whole award is reduced by the excess, less any childcare costs element.</p>
      </div>
    </div>
  )
}
