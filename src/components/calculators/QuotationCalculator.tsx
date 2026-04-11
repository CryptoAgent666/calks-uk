import { useState } from 'react'
import { formatCurrency } from '@/utils'

export default function QuotationCalculator() {
  const [items, setItems] = useState([
    { description: 'Labour', quantity: 8, unit: 'hours', rate: 45 },
    { description: 'Materials', quantity: 1, unit: 'lot', rate: 500 },
  ])
  const [marginPct, setMarginPct] = useState('20')
  const [addVat, setAddVat] = useState(true)

  const addItem = () => setItems([...items, { description: '', quantity: 1, unit: 'each', rate: 0 }])
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i))
  const update = (i: number, field: string, value: any) => setItems(items.map((item, idx) => idx === i ? { ...item, [field]: value } : item))

  const subtotal = items.reduce((s, i) => s + i.quantity * i.rate, 0)
  const margin = subtotal * (parseFloat(marginPct) || 0) / 100
  const netTotal = subtotal + margin
  const vat = addVat ? netTotal * 0.20 : 0
  const grandTotal = netTotal + vat

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Line Items</h3><button onClick={addItem} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">+ Add Item</button></div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 flex-wrap">
            <input type="text" value={item.description} onChange={(e) => update(i, 'description', e.target.value)} placeholder="Description" className="flex-1 min-w-[120px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input type="number" min="0" step="0.5" value={item.quantity} onChange={(e) => update(i, 'quantity', parseFloat(e.target.value)||0)} className="w-16 rounded-lg border border-input bg-background px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring" />
            <select value={item.unit} onChange={(e) => update(i, 'unit', e.target.value)} className="w-20 rounded-lg border border-input bg-background px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"><option value="hours">hours</option><option value="days">days</option><option value="each">each</option><option value="m²">m²</option><option value="metres">metres</option><option value="lot">lot</option></select>
            <div className="relative w-20"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input type="number" min="0" step="0.01" value={item.rate} onChange={(e) => update(i, 'rate', parseFloat(e.target.value)||0)} className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <span className="text-sm font-medium w-16 text-right">{formatCurrency(item.quantity * item.rate)}</span>
            <button onClick={() => removeItem(i)} className="px-1.5 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-xs">x</button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Profit Margin (%)</label><input type="number" min="0" max="100" value={marginPct} onChange={(e) => setMarginPct(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div className="flex items-end pb-1"><label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={addVat} onChange={(e) => setAddVat(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Add VAT (20%)</span></label></div>
      </div>

      <div className="rounded-xl border border-border p-4 space-y-2 animate-fade-in-up">
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">{formatCurrency(subtotal)}</span></div>
        {margin > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Margin ({marginPct}%)</span><span className="tabular-nums">{formatCurrency(margin)}</span></div>}
        <div className="flex justify-between text-sm font-medium"><span>Net Total</span><span className="tabular-nums">{formatCurrency(netTotal)}</span></div>
        {addVat && <div className="flex justify-between text-sm"><span className="text-muted-foreground">VAT (20%)</span><span className="tabular-nums">{formatCurrency(vat)}</span></div>}
        <div className="flex justify-between text-lg font-bold border-t border-border pt-2"><span>Grand Total</span><span className="text-primary tabular-nums">{formatCurrency(grandTotal)}</span></div>
      </div>
    </div>
  )
}
