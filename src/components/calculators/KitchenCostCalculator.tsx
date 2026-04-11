import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type KitchenType = 'budget' | 'mid' | 'premium' | 'luxury'

const TYPES: Record<KitchenType, { name: string; units: number; worktop: number; appliances: number; labour: number }> = {
  budget: { name: 'Budget', units: 2000, worktop: 400, appliances: 1000, labour: 2000 },
  mid: { name: 'Mid-Range', units: 5000, worktop: 1200, appliances: 2500, labour: 3500 },
  premium: { name: 'Premium', units: 10000, worktop: 3000, appliances: 5000, labour: 5000 },
  luxury: { name: 'Luxury', units: 20000, worktop: 6000, appliances: 10000, labour: 7000 },
}

function calculate(type: KitchenType, needsPlumbing: boolean, needsElectrical: boolean, needsFlooring: boolean, needsDecoration: boolean) {
  const info = TYPES[type]
  const plumbing = needsPlumbing ? 1200 : 0
  const electrical = needsElectrical ? 800 : 0
  const flooring = needsFlooring ? 600 : 0
  const decoration = needsDecoration ? 400 : 0
  const total = info.units + info.worktop + info.appliances + info.labour + plumbing + electrical + flooring + decoration

  return { ...info, plumbing, electrical, flooring, decoration, total }
}

export default function KitchenCostCalculator() {
  const [type, setType] = useState<KitchenType>('mid')
  const [plumbing, setPlumbing] = useState(true)
  const [electrical, setElectrical] = useState(true)
  const [flooring, setFlooring] = useState(true)
  const [decoration, setDecoration] = useState(true)

  const result = useMemo(() => calculate(type, plumbing, electrical, flooring, decoration), [type, plumbing, electrical, flooring, decoration])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.entries(TYPES) as [KitchenType, typeof TYPES[KitchenType]][]).map(([k, v]) => (
          <button key={k} onClick={() => setType(k)} className={`px-4 py-3 rounded-xl text-sm text-left border transition-colors ${type === k ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
            <div className="font-medium">{v.name}</div>
            <div className={`text-xs ${type === k ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>Units ~{formatCurrency(v.units)}</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={plumbing} onChange={(e) => setPlumbing(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Plumbing changes (+~£1,200)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={electrical} onChange={(e) => setElectrical(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Electrical work (+~£800)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={flooring} onChange={(e) => setFlooring(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">New flooring (+~£600)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={decoration} onChange={(e) => setDecoration(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Plastering & painting (+~£400)</span></label>
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
            {result.electrical > 0 && <tr className="border-b border-border/50"><td className="py-2">Electrical</td><td className="text-right tabular-nums">{formatCurrency(result.electrical)}</td></tr>}
            {result.flooring > 0 && <tr className="border-b border-border/50"><td className="py-2">Flooring</td><td className="text-right tabular-nums">{formatCurrency(result.flooring)}</td></tr>}
            {result.decoration > 0 && <tr className="border-b border-border/50"><td className="py-2">Decoration</td><td className="text-right tabular-nums">{formatCurrency(result.decoration)}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
