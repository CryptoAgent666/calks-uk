import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type CoverType = 'comprehensive' | 'tpft' | 'tpo'
type AgeGroup = '17-20' | '21-29' | '30-39' | '40-49' | '50-59' | '60-69' | '70+'

// Annual comprehensive premium before no-claims discount, for a group 15 car
// doing 6,000-10,000 miles, including 12% Insurance Premium Tax.
// Calibrated so that each age band, at a typical no-claims record for that age,
// lands near Confused.com's Q3 2026 average quote by age scaled to price paid
// (x0.79 = ABI Q2 2026 average paid £566 / Confused Q3 2026 average quote £713),
// and the default profile (30-39, 5 years NCB) matches the ABI average.
const BASE_PREMIUM: Record<AgeGroup, number> = {
  '17-20': 1500, '21-29': 1450, '30-39': 1400, '40-49': 1350, '50-59': 1075, '60-69': 900, '70+': 950,
}

// For the same driver, cover levels price closely. Third party only is often
// dearer than comprehensive because riskier drivers choose it (Uswitch, Feb-Apr 2026).
const COVER_FACTOR: Record<CoverType, number> = { comprehensive: 1.0, tpft: 0.95, tpo: 1.05 }

// No-claims discount by claim-free years, capped at 60% from year five.
const NCB_DISCOUNT: Record<number, number> = { 0: 0, 1: 0.25, 2: 0.35, 3: 0.45, 4: 0.52, 5: 0.60 }

function mileageFactor(miles: number) {
  if (miles < 6000) return 0.92
  if (miles <= 10000) return 1.0
  if (miles <= 15000) return 1.08
  return 1.15
}

function calculate(ageGroup: AgeGroup, cover: CoverType, ncbYears: number, carGroup: number, miles: number) {
  const base = BASE_PREMIUM[ageGroup] * COVER_FACTOR[cover]
  const groupFactor = 1 + (carGroup - 15) * 0.03 // group 1-50, base at 15
  const milesFactor = mileageFactor(miles)
  const ncbDiscount = NCB_DISCOUNT[Math.min(Math.max(ncbYears, 0), 5)] || 0

  const grossPremium = base * groupFactor * milesFactor
  const discount = grossPremium * ncbDiscount
  const netPremium = grossPremium - discount
  const monthlyPremium = netPremium / 12

  return { grossPremium, discount, netPremium, monthlyPremium, ncbPct: ncbDiscount * 100 }
}

export default function CarInsuranceEstimateCalculator() {
  const [age, setAge] = useState<AgeGroup>('30-39')
  const [cover, setCover] = useState<CoverType>('comprehensive')
  const [ncb, setNcb] = useState('5')
  const [group, setGroup] = useState('15')
  const [miles, setMiles] = useState('8000')

  const n = parseInt(ncb) || 0
  const g = parseInt(group) || 15
  const m = parseInt(miles) || 8000
  const result = useMemo(() => calculate(age, cover, n, g, m), [age, cover, n, g, m])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Age Group</label><select value={age} onChange={(e) => setAge(e.target.value as AgeGroup)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Age Group"><option value="17-20">17-20</option><option value="21-29">21-29</option><option value="30-39">30-39</option><option value="40-49">40-49</option><option value="50-59">50-59</option><option value="60-69">60-69</option><option value="70+">70+</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Cover Level</label><select value={cover} onChange={(e) => setCover(e.target.value as CoverType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Cover Level"><option value="comprehensive">Comprehensive</option><option value="tpft">Third Party Fire & Theft</option><option value="tpo">Third Party Only</option></select></div>
        <div><label className="block text-sm font-medium mb-2">No Claims Bonus (years)</label><input type="number" min="0" max="9" value={ncb} onChange={(e) => setNcb(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="No Claims Bonus (years)" /></div>
        <div><label className="block text-sm font-medium mb-2">Insurance Group (1-50)</label><input type="number" min="1" max="50" value={group} onChange={(e) => setGroup(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Insurance Group (1-50)" /></div>
        <div><label className="block text-sm font-medium mb-2">Annual Mileage</label><input type="number" min="1000" max="30000" step="1000" value={miles} onChange={(e) => setMiles(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Mileage" /></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Annual Premium</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.netPremium)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyPremium)}/month</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Before NCB</p><p className="text-lg font-bold">{formatCurrency(result.grossPremium)}</p></div>
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">NCB Discount ({result.ncbPct}%)</p><p className="text-lg font-bold text-green-700 dark:text-green-400">-{formatCurrency(result.discount)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Group</p><p className="text-lg font-bold">{group} of 50</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Indicative estimate only, calibrated to the ABI average price paid (£566, Q2 2026) and Confused.com average quotes by age (Q3 2026), including 12% Insurance Premium Tax. Actual premiums depend on your postcode, occupation, claims history, car modifications and many other factors. Always compare quotes from multiple providers.</p>
        </div>
      </div>
    </div>
  )
}
