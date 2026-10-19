import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type HouseType = 'detached' | 'semi' | 'terrace' | 'flat'
const WINDOWS: Record<HouseType, number> = { detached: 12, semi: 8, terrace: 6, flat: 5 }
// 8 windows x £600 = £4,800, EST's typical cost for a set of A-rated windows on a semi (Oct 2026)
const COST_PER_WINDOW = 600
// EST 2026: £85/yr for an entirely single-glazed semi (GB); other types scaled by floor area/exposure
const SAVING_PER_YEAR: Record<HouseType, number> = { detached: 130, semi: 85, terrace: 65, flat: 45 }

function calculate(houseType: HouseType, numWindows: number, customCost: number) {
  const cost = numWindows * (customCost || COST_PER_WINDOW)
  // Full saving assumes the whole house was single-glazed; replacing fewer windows saves pro rata
  const share = Math.min(1, numWindows / WINDOWS[houseType])
  const annualSaving = SAVING_PER_YEAR[houseType] * share
  const payback = annualSaving > 0 ? cost / annualSaving : 0
  const saving20yr = annualSaving * 20 - cost
  return { cost, annualSaving, payback, saving20yr, numWindows }
}

export default function DoubleGlazingCalculator() {
  const [house, setHouse] = useState<HouseType>('semi')
  const [windows, setWindows] = useState('')
  const [costPer, setCostPer] = useState('600')

  const h = house
  const w = parseInt(windows) || WINDOWS[h]
  const c = parseFloat(costPer) || COST_PER_WINDOW
  const result = useMemo(() => calculate(h, w, c), [h, w, c])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">House Type</label><select value={house} onChange={(e) => setHouse(e.target.value as HouseType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="House Type"><option value="detached">Detached</option><option value="semi">Semi-Detached</option><option value="terrace">Terraced</option><option value="flat">Flat</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Number of Windows</label><input type="number" min="1" max="30" value={windows} placeholder={String(WINDOWS[house])} onChange={(e) => setWindows(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number of Windows" /></div>
        <div><label className="block text-sm font-medium mb-2">Cost per Window (£)</label><input type="number" min="100" max="2000" value={costPer} onChange={(e) => setCostPer(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Cost per Window (£)" /></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
        <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total Cost</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.cost)}</p></div>
        <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Saving</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.annualSaving)}</p></div>
        <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Payback</p><p className="text-lg font-bold">{result.payback.toFixed(1)} years</p></div>
        <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">20yr Net Saving</p><p className={`text-lg font-bold ${result.saving20yr > 0 ? 'text-green-600' : 'text-destructive'}`}>{formatCurrency(result.saving20yr)}</p></div>
      </div>
      <p className="text-xs text-muted-foreground">Assumes the house was fully single-glazed; replacing some windows saves pro rata. The semi-detached saving is the Energy Saving Trust&rsquo;s £85 a year (Great Britain); other house types are scaled from it.</p>
    </div>
  )
}
