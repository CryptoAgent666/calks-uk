import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Illustrative annual costs for the WHOLE building (a 12-flat block with a lift)
const ITEMS = [
  { id: 'building_ins', name: 'Buildings insurance', building: 4800 },
  { id: 'maintenance', name: 'Repairs and maintenance', building: 3600 },
  { id: 'cleaning', name: 'Cleaning of communal areas', building: 2400 },
  { id: 'gardening', name: 'Gardening and grounds', building: 1200 },
  { id: 'lighting', name: 'Communal electricity and lighting', building: 1200 },
  { id: 'lift', name: 'Lift maintenance', building: 1200 },
  { id: 'managing', name: 'Managing agent fee', building: 3000 },
  { id: 'reserve', name: 'Reserve or sinking fund', building: 3600 },
  { id: 'other', name: 'Other (fire safety, door entry, CCTV)', building: 1200 },
]

// Landlord and Tenant Act 1985 s20 consultation thresholds (per leaseholder)
const S20_WORKS = 250 // qualifying works: more than £250 for any one leaseholder
const S20_LTA = 100 // qualifying long-term agreements: more than £100 a year for any one leaseholder
const PROJECTION_YEARS = [5, 10, 20]

function calculate(costs: Record<string, number>, sharePct: number, increasePct: number) {
  const buildingTotal = Object.values(costs).reduce((s, v) => s + v, 0)
  const share = sharePct / 100
  const annual = buildingTotal * share
  const monthly = annual / 12
  const breakdown = ITEMS.map(i => ({ id: i.id, name: i.name, building: costs[i.id] || 0, yours: (costs[i.id] || 0) * share }))
  const growth = increasePct / 100
  const projections = PROJECTION_YEARS.map(years => {
    let total = 0
    for (let y = 0; y < years; y++) total += annual * Math.pow(1 + growth, y)
    return { years, total, finalYear: annual * Math.pow(1 + growth, years - 1) }
  })
  // Building-level cost at which your share passes the Section 20 thresholds
  const worksTrigger = share > 0 ? S20_WORKS / share : 0
  const ltaTrigger = share > 0 ? S20_LTA / share : 0
  return { buildingTotal, annual, monthly, breakdown, projections, worksTrigger, ltaTrigger }
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function ServiceChargeCalculator() {
  const [costs, setCosts] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    ITEMS.forEach(i => { init[i.id] = i.building })
    return init
  })
  const [units, setUnits] = useState('12')
  const [shareOverride, setShareOverride] = useState<string | null>(null)
  const [increase, setIncrease] = useState('4')

  const u = Math.max(parseInt(units) || 1, 1)
  const equalShare = 100 / u
  const share = shareOverride !== null ? Math.min(Math.max(parseFloat(shareOverride) || 0, 0), 100) : equalShare
  const inc = parseFloat(increase) || 0
  const result = useMemo(() => calculate(costs, share, inc), [costs, share, inc])

  const update = (id: string, value: number) => setCosts(prev => ({ ...prev, [id]: value }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Number of flats in the building</label><input type="number" min="1" max="500" value={units} onChange={(e) => setUnits(e.target.value)} className={inputClass} aria-label="Number of flats in the building" /></div>
        <div><label className="block text-sm font-medium mb-2">Your share (%)</label><input type="number" min="0" max="100" step="0.01" value={shareOverride ?? String(Math.round(equalShare * 100) / 100)} onChange={(e) => setShareOverride(e.target.value)} className={inputClass} aria-label="Your share of the service charge (%)" /><p className="text-xs text-muted-foreground mt-1">Check your lease. Equal share: {(Math.round(equalShare * 100) / 100).toFixed(2)}%.{shareOverride !== null && <> <button type="button" onClick={() => setShareOverride(null)} className="underline">Use equal share</button></>}</p></div>
        <div><label className="block text-sm font-medium mb-2">Assumed yearly increase (%)</label><input type="number" min="0" max="20" step="0.5" value={increase} onChange={(e) => setIncrease(e.target.value)} className={inputClass} aria-label="Assumed yearly increase in the service charge (%)" /></div>
      </div>
      <h3 className="text-sm font-semibold">Annual costs for the whole building</h3>
      <div className="space-y-2">
        {ITEMS.map(item => (
          <div key={item.id} className="flex items-center gap-3">
            <label htmlFor={`sc-${item.id}`} className="text-sm text-muted-foreground w-44 shrink-0">{item.name}</label>
            <div className="relative flex-1"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input id={`sc-${item.id}`} type="number" min="0" value={costs[item.id] || ''} onChange={(e) => update(item.id, parseFloat(e.target.value) || 0)} className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label={`${item.name}, annual cost for the building`} /></div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-primary/10 p-6 text-center animate-fade-in-up">
        <p className="text-sm text-muted-foreground">Your annual service charge</p>
        <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(Math.round(result.annual * 100) / 100)}</p>
        <p className="text-sm text-muted-foreground mt-1">{formatCurrency(Math.round(result.monthly * 100) / 100)}/month &middot; {(Math.round(share * 100) / 100).toFixed(2)}% of the building total of {formatCurrency(result.buildingTotal)}</p>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Cost</th><th className="text-right py-2 font-medium text-muted-foreground">Building</th><th className="text-right py-2 font-medium text-muted-foreground">Your share</th></tr></thead>
        <tbody>{result.breakdown.filter(b => b.building > 0).map(b => (
          <tr key={b.id} className="border-b border-border/50"><td className="py-1.5">{b.name}</td><td className="text-right tabular-nums">{formatCurrency(b.building)}</td><td className="text-right tabular-nums">{formatCurrency(Math.round(b.yours * 100) / 100)}</td></tr>
        ))}</tbody>
      </table>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {result.projections.map(p => (
          <div key={p.years} className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Total over {p.years} years</p><p className="text-lg font-bold">{formatCurrency(Math.round(p.total))}</p><p className="text-xs text-muted-foreground">{formatCurrency(Math.round(p.finalYear))} in year {p.years}</p></div>
        ))}
      </div>
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
        <p>Section 20 consultation (Landlord and Tenant Act 1985) is required before major works that would cost any one leaseholder more than £250, and before a long-term agreement (over 12 months) that would cost any one leaseholder more than £100 a year. At your share, your own contribution passes these limits when works cost the building more than {formatCurrency(Math.round(result.worksTrigger))}, or an agreement costs it more than {formatCurrency(Math.round(result.ltaTrigger))} a year (consultation starts sooner if another flat pays a bigger share).</p>
        <p>Projections assume every cost rises by the same percentage each year and leave out one-off major works charges.</p>
      </div>
    </div>
  )
}
