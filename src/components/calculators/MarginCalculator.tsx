import { useState } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

export default function MarginCalculator() {
  const [cost, setCost] = useState('')
  const [revenue, setRevenue] = useState('')
  const [markupCost, setMarkupCost] = useState('')
  const [markupPct, setMarkupPct] = useState('')

  const c = parseFloat(cost) || 0
  const r = parseFloat(revenue) || 0
  const mc = parseFloat(markupCost) || 0
  const mp = parseFloat(markupPct) || 0

  const profit = r - c
  const margin = r > 0 ? (profit / r) * 100 : 0
  const markup = c > 0 ? (profit / c) * 100 : 0

  const markupPrice = mc > 0 && mp > 0 ? mc * (1 + mp / 100) : 0
  const markupProfit = markupPrice - mc

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Profit Margin Calculator</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="10" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Cost" /></div></div>
          <div><label className="block text-sm font-medium mb-2">Revenue / Selling Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" step="0.01" value={revenue} onChange={(e) => setRevenue(e.target.value)} placeholder="25" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Revenue / Selling Price" /></div></div>
        </div>
        {c > 0 && r > 0 && (
          <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Profit</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(profit)}</p></div>
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Margin</p><p className="text-xl font-bold text-primary">{formatPercent(margin)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Markup</p><p className="text-xl font-bold">{formatPercent(markup)}</p></div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Markup Calculator</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" step="0.01" value={markupCost} onChange={(e) => setMarkupCost(e.target.value)} placeholder="10" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Cost" /></div></div>
          <div><label className="block text-sm font-medium mb-2">Markup (%)</label><input type="number" min="0" step="1" value={markupPct} onChange={(e) => setMarkupPct(e.target.value)} placeholder="50" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Markup (%)" /></div>
        </div>
        {mc > 0 && mp > 0 && (
          <div className="grid grid-cols-2 gap-3 animate-fade-in-up">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Selling Price</p><p className="text-xl font-bold text-primary">{formatCurrency(markupPrice)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Profit</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(markupProfit)}</p></div>
          </div>
        )}
      </div>
    </div>
  )
}
