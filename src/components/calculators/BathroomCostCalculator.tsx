import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type BathroomType = 'budget' | 'mid' | 'premium'

// Totals with a shower are set to Checkatrade's March 2026 ballpark figures: £4,000 basic
// refresh, £7,000 average, £14,000+ luxury or complex (10 plus days). Its tasks anchor the
// mid-range lines: plumbing £1,500-£3,000, wall tiling £950-£1,250, electrical £900, shower
// fitting about £500. The rest of the split is our own estimate.
const TYPES: Record<BathroomType, { name: string; suiteCost: number; labourPerDay: number; days: number; tiling: number }> = {
  budget: { name: 'Budget', suiteCost: 500, labourPerDay: 200, days: 5, tiling: 700 },
  mid: { name: 'Mid-Range', suiteCost: 1500, labourPerDay: 250, days: 6, tiling: 1100 },
  premium: { name: 'Premium', suiteCost: 3000, labourPerDay: 300, days: 10, tiling: 2100 },
}

function calculate(type: BathroomType, hasShower: boolean, hasUnderfloor: boolean, isEnSuite: boolean) {
  const info = TYPES[type]
  const scale = isEnSuite ? 0.75 : 1 // en-suite smaller: every line comes down by the same 25%
  const suite = info.suiteCost * scale
  const labour = info.labourPerDay * info.days * scale
  const tiling = info.tiling * scale
  const plumbing = (type === 'budget' ? 900 : type === 'mid' ? 1500 : 3000) * scale
  const electrical = (type === 'budget' ? 500 : 900) * scale
  const shower = hasShower ? (type === 'budget' ? 400 : type === 'mid' ? 500 : 2000) * scale : 0
  const underfloor = hasUnderfloor ? 600 * scale : 0 // about 6 m² at Checkatrade's £100 per m²

  const total = suite + labour + tiling + plumbing + electrical + shower + underfloor

  return { suite, labour, tiling, plumbing, electrical, shower, underfloor, total, days: Math.round(info.days * scale), info }
}

export default function BathroomCostCalculator() {
  const [type, setType] = useState<BathroomType>('mid')
  const [shower, setShower] = useState(true)
  const [underfloor, setUnderfloor] = useState(false)
  const [enSuite, setEnSuite] = useState(false)

  const result = useMemo(() => calculate(type, shower, underfloor, enSuite), [type, shower, underfloor, enSuite])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {(Object.entries(TYPES) as [BathroomType, typeof TYPES[BathroomType]][]).map(([k, v]) => (
          <button key={k} onClick={() => setType(k)} className={`px-4 py-3 rounded-xl text-sm text-left border transition-colors ${type === k ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
            <div className="font-medium">{v.name}</div>
            <div className={`text-xs ${type === k ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>Suite ~{formatCurrency(v.suiteCost)}</div>
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={shower} onChange={(e) => setShower(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Walk-in shower or shower enclosure</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={underfloor} onChange={(e) => setUnderfloor(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Underfloor heating (+~£600 for about 6 m²)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={enSuite} onChange={(e) => setEnSuite(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">En-suite (smaller room, ~25% less on every line)</span></label>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Total Cost ({result.info.name})</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.total)}</p>
          <p className="text-sm text-muted-foreground mt-1">~{result.days} days work</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2">Bathroom Suite</td><td className="text-right tabular-nums">{formatCurrency(result.suite)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Labour ({result.days} days)</td><td className="text-right tabular-nums">{formatCurrency(result.labour)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Tiling</td><td className="text-right tabular-nums">{formatCurrency(result.tiling)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Plumbing</td><td className="text-right tabular-nums">{formatCurrency(result.plumbing)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Electrical</td><td className="text-right tabular-nums">{formatCurrency(result.electrical)}</td></tr>
            {result.shower > 0 && <tr className="border-b border-border/50"><td className="py-2">Shower</td><td className="text-right tabular-nums">{formatCurrency(result.shower)}</td></tr>}
            {result.underfloor > 0 && <tr className="border-b border-border/50"><td className="py-2">Underfloor Heating</td><td className="text-right tabular-nums">{formatCurrency(result.underfloor)}</td></tr>}
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground">Totals with a shower follow Checkatrade&rsquo;s March 2026 ballpark figures: about £4,000 for a basic refresh, £7,000 on average and £14,000 or more for a luxury job. The split across lines is our own estimate.</p>
      </div>
    </div>
  )
}
