import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type CoverType = 'comprehensive' | 'tpft' | 'tpo'
type AgeGroup = '17-20' | '21-25' | '26-30' | '31-40' | '41-50' | '51-65' | '66+'

const BASE_PREMIUMS: Record<CoverType, Record<AgeGroup, number>> = {
  comprehensive: { '17-20': 1800, '21-25': 900, '26-30': 550, '31-40': 450, '41-50': 400, '51-65': 380, '66+': 420 },
  tpft: { '17-20': 1500, '21-25': 750, '26-30': 450, '31-40': 350, '41-50': 320, '51-65': 300, '66+': 340 },
  tpo: { '17-20': 1400, '21-25': 700, '26-30': 400, '31-40': 300, '41-50': 280, '51-65': 270, '66+': 310 },
}

const NCB_DISCOUNT: Record<number, number> = { 0: 0, 1: 0.20, 2: 0.30, 3: 0.40, 4: 0.50, 5: 0.60 }

function calculate(ageGroup: AgeGroup, cover: CoverType, ncbYears: number, carGroup: number, miles: number) {
  const base = BASE_PREMIUMS[cover][ageGroup]
  const groupFactor = 1 + (carGroup - 15) * 0.03 // group 1-50, base at 15
  const milesFactor = miles > 12000 ? 1.1 : miles > 8000 ? 1.0 : 0.9
  const ncbDiscount = NCB_DISCOUNT[Math.min(ncbYears, 5)] || 0

  const grossPremium = base * groupFactor * milesFactor
  const discount = grossPremium * ncbDiscount
  const netPremium = grossPremium - discount
  const monthlyPremium = netPremium / 12

  return { grossPremium, discount, netPremium, monthlyPremium, ncbPct: ncbDiscount * 100 }
}

export default function CarInsuranceEstimateCalculator() {
  const [age, setAge] = useState<AgeGroup>('31-40')
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
        <div><label className="block text-sm font-medium mb-2">Age Group</label><select value={age} onChange={(e) => setAge(e.target.value as AgeGroup)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Age Group"><option value="17-20">17-20</option><option value="21-25">21-25</option><option value="26-30">26-30</option><option value="31-40">31-40</option><option value="41-50">41-50</option><option value="51-65">51-65</option><option value="66+">66+</option></select></div>
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
          <p>Indicative estimate only. Actual premiums depend on your postcode, occupation, claims history, car modifications and many other factors. Always compare quotes from multiple providers.</p>
        </div>
      </div>
    </div>
  )
}
