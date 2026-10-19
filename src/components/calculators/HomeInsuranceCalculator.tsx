import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type PropertyType = 'detached' | 'semi' | 'terrace' | 'flat'
type CoverType = 'buildings' | 'contents' | 'combined'

// Annual premiums including 12% Insurance Premium Tax. The semi row is the ABI
// Property Insurance Premium Tracker average premium paid in Q2 2026: buildings
// only £309, contents only £118, combined £383. Other property types are scaled
// from it (detached above, terrace and flat below) as an indicative assumption.
const BASE: Record<PropertyType, { buildings: number; contents: number }> = {
  detached: { buildings: 380, contents: 140 },
  semi: { buildings: 309, contents: 118 },
  terrace: { buildings: 280, contents: 110 },
  flat: { buildings: 220, contents: 100 },
}

// Combined cover costs less than the two bought separately: £383 against
// £309 + £118 = £427 in the ABI Q2 2026 averages.
const COMBINED_RATIO = 383 / (309 + 118)

// Reference sums insured. Half of each part of the premium is treated as fixed
// and half moves in line with the sum insured, up or down.
const REF_REBUILD = 250_000
const REF_CONTENTS = 50_000
const sumFactor = (sum: number, ref: number) => 0.5 + 0.5 * (sum / ref)

function calculate(propType: PropertyType, cover: CoverType, bedrooms: number, rebuildCost: number, contentsCover: number, hasAlarm: boolean, claims: number) {
  const base = BASE[propType]
  const buildingsPart = base.buildings * sumFactor(rebuildCost, REF_REBUILD)
  const contentsPart = base.contents * sumFactor(contentsCover, REF_CONTENTS)
  const core = cover === 'buildings' ? buildingsPart
    : cover === 'contents' ? contentsPart
    : (buildingsPart + contentsPart) * COMBINED_RATIO

  const bedroomFactor = 1 + (bedrooms - 3) * 0.08
  const alarmDiscount = hasAlarm ? 0.9 : 1
  const claimsFactor = 1 + claims * 0.25

  const premium = core * bedroomFactor * alarmDiscount * claimsFactor
  return { premium, monthly: premium / 12 }
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export default function HomeInsuranceCalculator() {
  const [prop, setProp] = useState<PropertyType>('semi')
  const [cover, setCover] = useState<CoverType>('combined')
  const [beds, setBeds] = useState('3')
  const [rebuild, setRebuild] = useState('250000')
  const [contents, setContents] = useState('50000')
  const [alarm, setAlarm] = useState(false)
  const [claims, setClaims] = useState('0')

  const b = clamp(parseInt(beds) || 3, 1, 6)
  const c = clamp(parseInt(claims) || 0, 0, 5)
  const rb = clamp(parseFloat(rebuild.replace(/,/g, '')) || REF_REBUILD, 50_000, 2_000_000)
  const ct = clamp(parseFloat(contents.replace(/,/g, '')) || REF_CONTENTS, 5_000, 500_000)

  const result = useMemo(() => calculate(prop, cover, b, rb, ct, alarm, c), [prop, cover, b, rb, ct, alarm, c])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Property Type</label><select value={prop} onChange={(e) => setProp(e.target.value as PropertyType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Property Type"><option value="detached">Detached</option><option value="semi">Semi</option><option value="terrace">Terrace</option><option value="flat">Flat</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Cover</label><select value={cover} onChange={(e) => setCover(e.target.value as CoverType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Cover"><option value="combined">Buildings + Contents</option><option value="buildings">Buildings Only</option><option value="contents">Contents Only</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Bedrooms</label><input type="number" min="1" max="6" value={beds} onChange={(e) => setBeds(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Bedrooms" /></div>
        <div><label className="block text-sm font-medium mb-2">Claims (5 years)</label><input type="number" min="0" max="5" value={claims} onChange={(e) => setClaims(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Claims (5 years)" /></div>
        {cover !== 'contents' && (
          <div className="col-span-2"><label className="block text-sm font-medium mb-2">Rebuild Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={rebuild} onChange={(e) => setRebuild(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Rebuild Cost" /></div></div>
        )}
        {cover !== 'buildings' && (
          <div className="col-span-2"><label className="block text-sm font-medium mb-2">Contents Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={contents} onChange={(e) => setContents(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Contents Value" /></div></div>
        )}
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={alarm} onChange={(e) => setAlarm(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Burglar alarm (-10%)</span></label>

      <div className="rounded-2xl bg-primary/10 p-6 text-center animate-fade-in-up">
        <p className="text-sm text-muted-foreground">Estimated Annual Premium</p>
        <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.premium)}</p>
        <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthly)}/month</p>
      </div>
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>Indicative estimate including 12% Insurance Premium Tax. A 3-bed semi at the reference sums insured (£250,000 rebuild, £50,000 contents), no claims and no alarm matches the ABI average premium paid in Q2 2026. Rebuild cost and contents value scale the price up or down from there. Actual premiums depend on postcode, flood risk, security, building age and provider. Always compare quotes.</p>
      </div>
    </div>
  )
}
