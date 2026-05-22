import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

function calculate(revenue: number, materials: number, labour: number, overhead: number, vatRegistered: boolean) {
  const totalCosts = materials + labour + overhead
  const profit = revenue - totalCosts
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0
  const markup = totalCosts > 0 ? (profit / totalCosts) * 100 : 0

  const vat = vatRegistered ? revenue * 0.20 : 0
  const invoiceTotal = revenue + vat

  return { totalCosts, profit, margin, markup, vat, invoiceTotal }
}

export default function InvoiceProfitCalculator() {
  const [revenue, setRevenue] = useState('5000')
  const [materials, setMaterials] = useState('1500')
  const [labour, setLabour] = useState('2000')
  const [overhead, setOverhead] = useState('500')
  const [vat, setVat] = useState(true)

  const r = parseFloat(revenue.replace(/,/g,'')) || 0
  const m = parseFloat(materials.replace(/,/g,'')) || 0
  const l = parseFloat(labour.replace(/,/g,'')) || 0
  const o = parseFloat(overhead.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(r, m, l, o, vat), [r, m, l, o, vat])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Job Revenue (net)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={revenue} onChange={(e) => setRevenue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Job Revenue (net)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Materials</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={materials} onChange={(e) => setMaterials(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Materials" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Labour</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={labour} onChange={(e) => setLabour(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Labour" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Overheads</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={overhead} onChange={(e) => setOverhead(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Overheads" /></div></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={vat} onChange={(e) => setVat(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">VAT registered (add 20%)</span></label>

      {r > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`rounded-xl p-4 text-center ${result.profit > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Profit</p><p className={`text-xl font-bold ${result.profit > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(result.profit)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Margin</p><p className="text-xl font-bold">{formatPercent(result.margin)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Markup</p><p className="text-xl font-bold">{formatPercent(result.markup)}</p></div>
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Invoice Total</p><p className="text-xl font-bold text-primary">{formatCurrency(result.invoiceTotal)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
