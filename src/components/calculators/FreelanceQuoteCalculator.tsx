import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(hourlyRate: number, hours: number, materials: number, marginPct: number, vatRegistered: boolean) {
  const labourCost = hourlyRate * hours
  const subtotal = labourCost + materials
  const margin = subtotal * (marginPct / 100)
  const netQuote = subtotal + margin
  const vat = vatRegistered ? netQuote * 0.20 : 0
  const totalQuote = netQuote + vat
  const profit = margin
  const effectiveHourly = hours > 0 ? (netQuote - materials) / hours : 0

  return { labourCost, subtotal, margin, netQuote, vat, totalQuote, profit, effectiveHourly }
}

export default function FreelanceQuoteCalculator() {
  const [rate, setRate] = useState('35')
  const [hours, setHours] = useState('20')
  const [materials, setMaterials] = useState('200')
  const [margin, setMargin] = useState('20')
  const [vat, setVat] = useState(false)

  const r = parseFloat(rate) || 0
  const h = parseFloat(hours) || 0
  const m = parseFloat(materials.replace(/,/g,'')) || 0
  const mg = parseFloat(margin) || 0
  const result = useMemo(() => calculate(r, h, m, mg, vat), [r, h, m, mg, vat])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Hourly Rate</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" step="1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Estimated Hours</label><input type="number" min="0" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Materials</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={materials} onChange={(e) => setMaterials(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Profit Margin (%)</label><input type="number" min="0" max="100" value={margin} onChange={(e) => setMargin(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={vat} onChange={(e) => setVat(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Add VAT (20%)</span></label>

      {h > 0 && r > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Quote Total</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalQuote)}</p>
            {vat && <p className="text-sm text-muted-foreground mt-1">Net: {formatCurrency(result.netQuote)} + VAT: {formatCurrency(result.vat)}</p>}
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Labour ({h} hrs x £{r})</td><td className="text-right tabular-nums">{formatCurrency(result.labourCost)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Materials</td><td className="text-right tabular-nums">{formatCurrency(m)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-green-600">Margin ({mg}%)</td><td className="text-right tabular-nums text-green-600">+{formatCurrency(result.margin)}</td></tr>
              {vat && <tr className="border-b border-border/50"><td className="py-2">VAT (20%)</td><td className="text-right tabular-nums">{formatCurrency(result.vat)}</td></tr>}
              <tr className="font-semibold"><td className="py-2">Total</td><td className="text-right tabular-nums">{formatCurrency(result.totalQuote)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl bg-muted/50 p-3 text-center text-sm">Effective hourly rate: {formatCurrency(result.effectiveHourly)}/hr (including margin)</div>
        </div>
      )}
    </div>
  )
}
