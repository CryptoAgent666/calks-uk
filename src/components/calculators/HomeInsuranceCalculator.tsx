import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type PropertyType = 'detached' | 'semi' | 'terrace' | 'flat'
type CoverType = 'buildings' | 'contents' | 'combined'

const BASE: Record<PropertyType, Record<CoverType, number>> = {
  detached: { buildings: 180, contents: 90, combined: 240 },
  semi: { buildings: 140, contents: 80, combined: 195 },
  terrace: { buildings: 120, contents: 75, combined: 170 },
  flat: { buildings: 80, contents: 70, combined: 130 },
}

function calculate(propType: PropertyType, cover: CoverType, bedrooms: number, rebuildCost: number, contentsCover: number, hasAlarm: boolean, claims: number) {
  const base = BASE[propType][cover]
  const bedroomFactor = 1 + (bedrooms - 3) * 0.08
  const alarmDiscount = hasAlarm ? 0.9 : 1
  const claimsFactor = 1 + claims * 0.25
  const rebuildFactor = cover !== 'contents' ? Math.max(1, rebuildCost / 250_000) : 1
  const contentsFactor = cover !== 'buildings' ? Math.max(1, contentsCover / 50_000) : 1

  const premium = base * bedroomFactor * alarmDiscount * claimsFactor * rebuildFactor * contentsFactor
  return { premium, monthly: premium / 12 }
}

export default function HomeInsuranceCalculator() {
  const [prop, setProp] = useState<PropertyType>('semi')
  const [cover, setCover] = useState<CoverType>('combined')
  const [beds, setBeds] = useState('3')
  const [rebuild, setRebuild] = useState('250000')
  const [contents, setContents] = useState('50000')
  const [alarm, setAlarm] = useState(true)
  const [claims, setClaims] = useState('0')

  const result = useMemo(() => calculate(prop, cover, parseInt(beds)||3, parseFloat(rebuild.replace(/,/g,''))||250000, parseFloat(contents.replace(/,/g,''))||50000, alarm, parseInt(claims)||0), [prop, cover, beds, rebuild, contents, alarm, claims])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Property Type</label><select value={prop} onChange={(e) => setProp(e.target.value as PropertyType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"><option value="detached">Detached</option><option value="semi">Semi</option><option value="terrace">Terrace</option><option value="flat">Flat</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Cover</label><select value={cover} onChange={(e) => setCover(e.target.value as CoverType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"><option value="combined">Buildings + Contents</option><option value="buildings">Buildings Only</option><option value="contents">Contents Only</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Bedrooms</label><input type="number" min="1" max="6" value={beds} onChange={(e) => setBeds(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Claims (5 years)</label><input type="number" min="0" max="5" value={claims} onChange={(e) => setClaims(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={alarm} onChange={(e) => setAlarm(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Burglar alarm (-10%)</span></label>

      <div className="rounded-2xl bg-primary/10 p-6 text-center animate-fade-in-up">
        <p className="text-sm text-muted-foreground">Estimated Annual Premium</p>
        <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.premium)}</p>
        <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthly)}/month</p>
      </div>
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>Indicative estimate. Actual premiums depend on postcode, flood risk, security, building age and provider. Always compare quotes.</p>
      </div>
    </div>
  )
}
