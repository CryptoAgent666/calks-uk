import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// VAT rate on the invoice: standard 20%, reduced 5%, zero-rated 0%, or no VAT if not registered
const VAT_OPTIONS = [
  { value: '20', label: '20% (standard rate)' },
  { value: '5', label: '5% (reduced rate)' },
  { value: '0', label: '0% (zero-rated)' },
  { value: 'none', label: 'Not VAT registered' },
]

function calculate(revenue: number, materials: number, labour: number, overhead: number, vatRate: number) {
  const totalCosts = materials + labour + overhead
  const profit = revenue - totalCosts
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0
  const markup = totalCosts > 0 ? (profit / totalCosts) * 100 : 0

  const vat = revenue * vatRate / 100
  const invoiceTotal = revenue + vat

  return { totalCosts, profit, margin, markup, vat, invoiceTotal }
}

export default function InvoiceProfitCalculator() {
  const [revenue, setRevenue] = useState('4800')
  const [materials, setMaterials] = useState('1650')
  const [labour, setLabour] = useState('540')
  const [overhead, setOverhead] = useState('480')
  const [vat, setVat] = useState('20')

  const r = parseFloat(revenue.replace(/,/g,'')) || 0
  const m = parseFloat(materials.replace(/,/g,'')) || 0
  const l = parseFloat(labour.replace(/,/g,'')) || 0
  const o = parseFloat(overhead.replace(/,/g,'')) || 0
  const vatRate = vat === 'none' ? 0 : parseFloat(vat)
  const result = useMemo(() => calculate(r, m, l, o, vatRate), [r, m, l, o, vatRate])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Job Revenue (net)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={revenue} onChange={(e) => setRevenue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Job Revenue (net)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Materials</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={materials} onChange={(e) => setMaterials(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Materials" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Labour</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={labour} onChange={(e) => setLabour(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Labour" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Overheads</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={overhead} onChange={(e) => setOverhead(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Overheads" /></div></div>
      </div>
      <div className="sm:w-1/2"><label className="block text-sm font-medium mb-2">VAT on this invoice</label><select value={vat} onChange={(e) => setVat(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="VAT on this invoice">{VAT_OPTIONS.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}</select></div>

      {r > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`rounded-xl p-4 text-center ${result.profit > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Profit</p><p className={`text-xl font-bold ${result.profit > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(result.profit)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Margin</p><p className="text-xl font-bold">{formatPercent(result.margin)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Markup</p><p className="text-xl font-bold">{formatPercent(result.markup)}</p></div>
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Invoice Total</p><p className="text-xl font-bold text-primary">{formatCurrency(result.invoiceTotal)}</p><p className="text-xs text-muted-foreground mt-1">{vat === 'none' ? 'No VAT charged' : `incl. ${formatCurrency(result.vat)} VAT at ${vat}%`}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
