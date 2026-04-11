import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type ExtType = 'single_rear' | 'double_rear' | 'side' | 'wrap_around'
const EXT_TYPES: Record<ExtType, { name: string; costPerSqm: number; description: string }> = {
  single_rear: { name: 'Single-Storey Rear', costPerSqm: 2200, description: 'Kitchen/dining extension' },
  double_rear: { name: 'Double-Storey Rear', costPerSqm: 1800, description: 'Ground + first floor' },
  side: { name: 'Side Return', costPerSqm: 2500, description: 'Infill side passage' },
  wrap_around: { name: 'Wrap-Around', costPerSqm: 2400, description: 'Side + rear combined' },
}

function calculate(type: ExtType, sqm: number, propertyValue: number, hasKitchen: boolean, hasBathroom: boolean) {
  const info = EXT_TYPES[type]
  const baseCost = sqm * info.costPerSqm
  const kitchenCost = hasKitchen ? 15_000 : 0
  const bathroomCost = hasBathroom ? 8_000 : 0
  const professionalFees = baseCost * 0.12 // architect, structural engineer, building regs
  const totalCost = baseCost + kitchenCost + bathroomCost + professionalFees

  const valueAdded = propertyValue * (sqm > 20 ? 0.20 : 0.15)
  const roi = totalCost > 0 ? ((valueAdded - totalCost) / totalCost) * 100 : 0

  return { baseCost, kitchenCost, bathroomCost, professionalFees, totalCost, valueAdded, roi, info }
}

export default function ExtensionCostCalculator() {
  const [type, setType] = useState<ExtType>('single_rear')
  const [sqm, setSqm] = useState('20')
  const [value, setValue] = useState('350000')
  const [kitchen, setKitchen] = useState(true)
  const [bathroom, setBathroom] = useState(false)

  const s = parseFloat(sqm) || 0
  const v = parseFloat(value.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(type, s, v, kitchen, bathroom), [type, s, v, kitchen, bathroom])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        {(Object.entries(EXT_TYPES) as [ExtType, typeof EXT_TYPES[ExtType]][]).map(([k, v]) => (
          <button key={k} onClick={() => setType(k)} className={`px-4 py-3 rounded-xl text-sm text-left border transition-colors ${type === k ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
            <div className="font-medium">{v.name}</div>
            <div className={`text-xs ${type === k ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{v.description} • ~£{v.costPerSqm}/m²</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Floor Area (m²)</label><input type="number" min="5" max="60" value={sqm} onChange={(e) => setSqm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Current Property Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={kitchen} onChange={(e) => setKitchen(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">New kitchen (+~£15K)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={bathroom} onChange={(e) => setBathroom(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">New bathroom (+~£8K)</span></label>
      </div>

      {s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Total Cost</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.totalCost)}</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Build ({s}m² x £{result.info.costPerSqm})</td><td className="text-right tabular-nums">{formatCurrency(result.baseCost)}</td></tr>
              {result.kitchenCost > 0 && <tr className="border-b border-border/50"><td className="py-2">Kitchen</td><td className="text-right tabular-nums">{formatCurrency(result.kitchenCost)}</td></tr>}
              {result.bathroomCost > 0 && <tr className="border-b border-border/50"><td className="py-2">Bathroom</td><td className="text-right tabular-nums">{formatCurrency(result.bathroomCost)}</td></tr>}
              <tr className="border-b border-border/50"><td className="py-2">Professional Fees (~12%)</td><td className="text-right tabular-nums">{formatCurrency(result.professionalFees)}</td></tr>
              <tr className="font-semibold"><td className="py-2">Total</td><td className="text-right tabular-nums">{formatCurrency(result.totalCost)}</td></tr>
            </tbody>
          </table>
          {v > 0 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Value Added</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.valueAdded)}</p></div>
              <div className={`rounded-xl p-4 text-center ${result.roi > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">ROI</p><p className={`text-lg font-bold ${result.roi > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{result.roi.toFixed(0)}%</p></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
