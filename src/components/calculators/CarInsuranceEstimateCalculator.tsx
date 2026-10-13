import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'
import { estimatePremium, ABI_AVERAGE_PAID, ABI_AVERAGE_PAID_PERIOD, type AgeGroup, type CoverType } from '@/data/car-insurance-model'

export default function CarInsuranceEstimateCalculator() {
  const [age, setAge] = useState<AgeGroup>('30-39')
  const [cover, setCover] = useState<CoverType>('comprehensive')
  const [ncb, setNcb] = useState('5')
  const [group, setGroup] = useState('15')
  const [miles, setMiles] = useState('8000')

  const n = parseInt(ncb) || 0
  const g = parseInt(group) || 15
  const m = parseInt(miles) || 8000
  const result = useMemo(() => estimatePremium(age, cover, n, g, m), [age, cover, n, g, m])

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
          <p>Indicative estimate only, calibrated to the ABI average price paid (£{ABI_AVERAGE_PAID}, {ABI_AVERAGE_PAID_PERIOD}) and Confused.com average quotes by age (Q3 2026), including 12% Insurance Premium Tax. Actual premiums depend on your postcode, occupation, claims history, car modifications and many other factors. Always compare quotes from multiple providers.</p>
        </div>
      </div>
    </div>
  )
}
