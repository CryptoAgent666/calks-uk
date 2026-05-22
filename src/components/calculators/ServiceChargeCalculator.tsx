import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const ITEMS = [
  { id: 'building_ins', name: 'Building Insurance', avg: 300 },
  { id: 'maintenance', name: 'General Maintenance', avg: 500 },
  { id: 'cleaning', name: 'Cleaning / Communal Areas', avg: 400 },
  { id: 'gardening', name: 'Gardening / Grounds', avg: 200 },
  { id: 'lighting', name: 'Communal Lighting', avg: 150 },
  { id: 'lift', name: 'Lift Maintenance', avg: 300 },
  { id: 'managing', name: 'Managing Agent Fee', avg: 500 },
  { id: 'reserve', name: 'Reserve / Sinking Fund', avg: 300 },
  { id: 'other', name: 'Other (CCTV, intercom, etc.)', avg: 150 },
]

export default function ServiceChargeCalculator() {
  const [costs, setCosts] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    ITEMS.forEach(i => { init[i.id] = i.avg })
    return init
  })
  const [units, setUnits] = useState('12')
  const [yourShare, setYourShare] = useState('100')

  const totalBuilding = Object.values(costs).reduce((s, v) => s + v, 0)
  const u = parseInt(units) || 1
  const share = parseFloat(yourShare) || 100
  const yourAnnual = (totalBuilding / (share === 100 ? 1 : u)) * (share / 100)
  const yourMonthly = yourAnnual / 12

  const update = (id: string, value: number) => setCosts(prev => ({ ...prev, [id]: value }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Total Units in Block</label><input type="number" min="1" max="200" value={units} onChange={(e) => setUnits(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Total Units in Block" /></div>
        <div><label className="block text-sm font-medium mb-2">Your Share (%)</label><input type="number" min="1" max="100" value={yourShare} onChange={(e) => setYourShare(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Share (%)" /><p className="text-xs text-muted-foreground mt-1">100% = you pay total. Equal split = set units.</p></div>
      </div>
      <h3 className="text-sm font-semibold">Annual Building Costs</h3>
      <div className="space-y-2">
        {ITEMS.map(item => (
          <div key={item.id} className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-44 shrink-0">{item.name}</span>
            <div className="relative flex-1"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input type="number" min="0" value={costs[item.id] || ''} onChange={(e) => update(item.id, parseFloat(e.target.value) || 0)} className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-primary/10 p-6 text-center animate-fade-in-up">
        <p className="text-sm text-muted-foreground">Your Annual Service Charge</p>
        <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(yourAnnual)}</p>
        <p className="text-sm text-muted-foreground mt-1">{formatCurrency(yourMonthly)}/month &middot; Building total: {formatCurrency(totalBuilding)}</p>
      </div>
    </div>
  )
}
