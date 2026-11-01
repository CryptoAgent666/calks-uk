import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type KitchenType = 'small' | 'average' | 'large'

// Checkatrade new kitchen cost guide, table last updated March 2026: low cost (small
// kitchen), average, and high cost (large kitchen). Plastering sits outside that table:
// Checkatrade gives about £1,100 for a small room and £1,900 for a large one, and the
// average here is the midpoint of the two.
const TYPES: Record<KitchenType, { name: string; units: number; worktop: number; appliances: number; labour: number; plumbing: number; electrical: number; flooring: number; plastering: number }> = {
  small: { name: 'Small, Budget', units: 1500, worktop: 100, appliances: 450, labour: 2200, plumbing: 200, electrical: 300, flooring: 500, plastering: 1100 },
  average: { name: 'Average', units: 3000, worktop: 1000, appliances: 2000, labour: 3000, plumbing: 300, electrical: 500, flooring: 750, plastering: 1500 },
  large: { name: 'Large, High Spec', units: 10000, worktop: 5000, appliances: 5200, labour: 4600, plumbing: 600, electrical: 1000, flooring: 2000, plastering: 1900 },
}
const PAINTING = 450 // Checkatrade: painting a room, about £450

const pounds = (n: number) => `£${n.toLocaleString('en-GB')}`

function calculate(type: KitchenType, needsPlumbing: boolean, needsElectrical: boolean, needsFlooring: boolean, needsPlastering: boolean, needsPainting: boolean) {
  const info = TYPES[type]
  const plumbing = needsPlumbing ? info.plumbing : 0
  const electrical = needsElectrical ? info.electrical : 0
  const flooring = needsFlooring ? info.flooring : 0
  const plastering = needsPlastering ? info.plastering : 0
  const painting = needsPainting ? PAINTING : 0
  const total = info.units + info.worktop + info.appliances + info.labour + plumbing + electrical + flooring + plastering + painting

  return { ...info, plumbing, electrical, flooring, plastering, painting, total }
}

export default function KitchenCostCalculator() {
  const [type, setType] = useState<KitchenType>('average')
  const [plumbing, setPlumbing] = useState(true)
  const [electrical, setElectrical] = useState(true)
  const [flooring, setFlooring] = useState(true)
  const [plastering, setPlastering] = useState(false)
  const [painting, setPainting] = useState(false)

  const result = useMemo(() => calculate(type, plumbing, electrical, flooring, plastering, painting), [type, plumbing, electrical, flooring, plastering, painting])
  const info = TYPES[type]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {(Object.entries(TYPES) as [KitchenType, typeof TYPES[KitchenType]][]).map(([k, v]) => (
          <button key={k} onClick={() => setType(k)} className={`px-4 py-3 rounded-xl text-sm text-left border transition-colors ${type === k ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
            <div className="font-medium">{v.name}</div>
            <div className={`text-xs ${type === k ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>Units ~{formatCurrency(v.units)}</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={plumbing} onChange={(e) => setPlumbing(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Plumbing (+~{pounds(info.plumbing)})</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={electrical} onChange={(e) => setElectrical(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Electrics (+~{pounds(info.electrical)})</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={flooring} onChange={(e) => setFlooring(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">New flooring (+~{pounds(info.flooring)})</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={plastering} onChange={(e) => setPlastering(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Plastering (+~{pounds(info.plastering)})</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={painting} onChange={(e) => setPainting(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Painting (+~{pounds(PAINTING)})</span></label>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Total ({result.name} Kitchen)</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.total)}</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2">Kitchen Units</td><td className="text-right tabular-nums">{formatCurrency(result.units)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Worktops</td><td className="text-right tabular-nums">{formatCurrency(result.worktop)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Appliances</td><td className="text-right tabular-nums">{formatCurrency(result.appliances)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Installation Labour</td><td className="text-right tabular-nums">{formatCurrency(result.labour)}</td></tr>
            {result.plumbing > 0 && <tr className="border-b border-border/50"><td className="py-2">Plumbing</td><td className="text-right tabular-nums">{formatCurrency(result.plumbing)}</td></tr>}
            {result.electrical > 0 && <tr className="border-b border-border/50"><td className="py-2">Electrics</td><td className="text-right tabular-nums">{formatCurrency(result.electrical)}</td></tr>}
            {result.flooring > 0 && <tr className="border-b border-border/50"><td className="py-2">Flooring</td><td className="text-right tabular-nums">{formatCurrency(result.flooring)}</td></tr>}
            {result.plastering > 0 && <tr className="border-b border-border/50"><td className="py-2">Plastering</td><td className="text-right tabular-nums">{formatCurrency(result.plastering)}</td></tr>}
            {result.painting > 0 && <tr className="border-b border-border/50"><td className="py-2">Painting</td><td className="text-right tabular-nums">{formatCurrency(result.painting)}</td></tr>}
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground">Ballpark figures from Checkatrade's new kitchen cost guide, March 2026. Plastering and painting are extras outside its total. The guide does not say whether VAT is included, so check that on every quote.</p>
      </div>
    </div>
  )
}
