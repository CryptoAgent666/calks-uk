import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Rates per m² of total floor area, before VAT. Checkatrade house extension cost guide, table last
// updated June 2026: £1,800-£3,000 per m² for single-storey and side extensions, and £108,000-£180,000
// for a 60 m² two-storey (so the double-storey rate here is at the low end). Wrap-around: BestBuilders
// wrap-around guide, 21 August 2026, £2,800-£3,500 per m². Kitchen and bathroom sit in Checkatrade's
// add-on ranges (£15k-£35k and £5.5k-£9k, June 2026).
// Fees and contingency: BestBuilders extension cost per m² guide, 2026: fees commonly 8-15% of build
// cost, contingency 10-15% for a straightforward extension.
// The value uplift is the reader's assumption: Checkatrade cites about 5-8% for a single-storey and up
// to about 12% for a double-storey.
const PROFESSIONAL_FEES = 0.12
const CONTINGENCY = 0.10
const VAT_RATE = 0.20
const DEFAULT_UPLIFT = '8'

type ExtType = 'single_rear' | 'double_rear' | 'side' | 'wrap_around'
const EXT_TYPES: Record<ExtType, { name: string; costPerSqm: number; description: string }> = {
  single_rear: { name: 'Single-Storey Rear', costPerSqm: 2200, description: 'Kitchen/dining extension' },
  double_rear: { name: 'Double-Storey Rear', costPerSqm: 1800, description: 'Ground + first floor' },
  side: { name: 'Side Return', costPerSqm: 2500, description: 'Infill side passage' },
  wrap_around: { name: 'Wrap-Around', costPerSqm: 3150, description: 'Side + rear combined' },
}

function calculate(type: ExtType, sqm: number, propertyValue: number, hasKitchen: boolean, hasBathroom: boolean, upliftPct: number, addVat: boolean) {
  const info = EXT_TYPES[type]
  const baseCost = sqm * info.costPerSqm
  const kitchenCost = hasKitchen ? 15_000 : 0
  const bathroomCost = hasBathroom ? 8_000 : 0
  const professionalFees = baseCost * PROFESSIONAL_FEES // architect, structural engineer, building regs
  const contingency = baseCost * CONTINGENCY
  const subtotal = baseCost + kitchenCost + bathroomCost + professionalFees + contingency
  const vat = addVat ? subtotal * VAT_RATE : 0
  const totalCost = subtotal + vat

  const valueAdded = propertyValue * (upliftPct / 100)
  const roi = totalCost > 0 ? ((valueAdded - totalCost) / totalCost) * 100 : 0

  return { baseCost, kitchenCost, bathroomCost, professionalFees, contingency, subtotal, vat, totalCost, valueAdded, roi, info }
}

export default function ExtensionCostCalculator() {
  const [type, setType] = useState<ExtType>('single_rear')
  const [sqm, setSqm] = useState('20')
  const [value, setValue] = useState('350000')
  const [kitchen, setKitchen] = useState(true)
  const [bathroom, setBathroom] = useState(false)
  const [uplift, setUplift] = useState(DEFAULT_UPLIFT)
  const [addVat, setAddVat] = useState(true)

  const s = parseFloat(sqm) || 0
  const v = parseFloat(value.replace(/,/g,'')) || 0
  const u = Math.max(0, parseFloat(uplift) || 0)
  const result = useMemo(() => calculate(type, s, v, kitchen, bathroom, u, addVat), [type, s, v, kitchen, bathroom, u, addVat])

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Total Floor Area (m²)</label><input type="number" min="5" max="60" value={sqm} onChange={(e) => setSqm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Total Floor Area (m²)" /><p className="text-xs text-muted-foreground mt-1">Add both storeys: a double-storey 4 m × 5 m is 40 m².</p></div>
        <div><label className="block text-sm font-medium mb-2">Current Property Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current Property Value" /></div></div>
        <div>
          <label className="block text-sm font-medium mb-2">Value Uplift You Assume (%)</label>
          <input type="number" min="0" max="100" value={uplift} onChange={(e) => setUplift(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Value uplift you assume (%)" />
          <p className="text-xs text-muted-foreground mt-1">An assumption, not a valuation. Checkatrade cites about 5-8% for a single-storey and up to about 12% for a double-storey; ask a local agent.</p>
        </div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={kitchen} onChange={(e) => setKitchen(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">New kitchen (+~£15K)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={bathroom} onChange={(e) => setBathroom(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">New bathroom (+~£8K)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={addVat} onChange={(e) => setAddVat(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Add VAT at 20% (untick if your builder is not VAT registered)</span></label>
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
              <tr className="border-b border-border/50"><td className="py-2">Professional Fees (~12% of build)</td><td className="text-right tabular-nums">{formatCurrency(result.professionalFees)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Contingency (10% of build)</td><td className="text-right tabular-nums">{formatCurrency(result.contingency)}</td></tr>
              {result.vat > 0 && <tr className="border-b border-border/50"><td className="py-2">VAT at 20%</td><td className="text-right tabular-nums">{formatCurrency(result.vat)}</td></tr>}
              <tr className="font-semibold"><td className="py-2">Total{result.vat > 0 ? ' including VAT' : ' before VAT'}</td><td className="text-right tabular-nums">{formatCurrency(result.totalCost)}</td></tr>
            </tbody>
          </table>
          {v > 0 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Value Added at {u}%</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.valueAdded)}</p></div>
              <div className={`rounded-xl p-4 text-center ${result.roi > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">ROI</p><p className={`text-lg font-bold ${result.roi > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{result.roi.toFixed(0)}%</p></div>
            </div>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Rates are mid-market guides before VAT, with no regional adjustment. Checkatrade's range is £1,800 to £3,000 per m² (June 2026), so the double-storey rate is at the low end; BestBuilders puts a wrap-around at £2,800 to £3,500 (August 2026). Get quotes before relying on these.</p>
          </div>
        </div>
      )}
    </div>
  )
}
