import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(labourDays: number, dayRate: number, materialsCost: number, overheadPct: number, contingencyPct: number) {
  const labourCost = labourDays * dayRate
  const overhead = (labourCost + materialsCost) * (overheadPct / 100)
  const subtotal = labourCost + materialsCost + overhead
  const contingency = subtotal * (contingencyPct / 100)
  const totalExVat = subtotal + contingency
  const vat = totalExVat * 0.20
  const totalIncVat = totalExVat + vat

  return { labourCost, overhead, subtotal, contingency, totalExVat, vat, totalIncVat }
}

export default function ProjectCostCalculator() {
  const [days, setDays] = useState('20')
  const [rate, setRate] = useState('350')
  const [materials, setMaterials] = useState('5000')
  const [overhead, setOverhead] = useState('15')
  const [contingency, setContingency] = useState('10')

  const d = parseInt(days) || 0
  const r = parseFloat(rate) || 0
  const m = parseFloat(materials.replace(/,/g,'')) || 0
  const o = parseFloat(overhead) || 0
  const c = parseFloat(contingency) || 0
  const result = useMemo(() => calculate(d, r, m, o, c), [d, r, m, o, c])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Labour Days</label><input type="number" min="1" max="500" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Day Rate</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Materials</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={materials} onChange={(e) => setMaterials(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Overhead (%)</label><input type="number" min="0" max="50" value={overhead} onChange={(e) => setOverhead(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Contingency (%)</label><input type="number" min="0" max="30" value={contingency} onChange={(e) => setContingency(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {d > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Project Total (inc. VAT)</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalIncVat)}</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Labour ({d} days x £{r})</td><td className="text-right tabular-nums">{formatCurrency(result.labourCost)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Materials</td><td className="text-right tabular-nums">{formatCurrency(m)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Overhead ({overhead}%)</td><td className="text-right tabular-nums">{formatCurrency(result.overhead)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Contingency ({contingency}%)</td><td className="text-right tabular-nums">{formatCurrency(result.contingency)}</td></tr>
              <tr className="border-b border-border font-medium"><td className="py-2">Total (ex VAT)</td><td className="text-right tabular-nums">{formatCurrency(result.totalExVat)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">VAT (20%)</td><td className="text-right tabular-nums">{formatCurrency(result.vat)}</td></tr>
              <tr className="font-semibold"><td className="py-2">Total (inc VAT)</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.totalIncVat)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
