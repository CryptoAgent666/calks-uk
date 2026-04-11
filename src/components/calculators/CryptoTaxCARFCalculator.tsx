import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Crypto Asset Reporting Framework — awareness tool
function calculate(trades: { buyPrice: number; sellPrice: number; quantity: number }[]) {
  let totalGains = 0
  let totalLosses = 0

  trades.forEach(t => {
    const gain = (t.sellPrice - t.buyPrice) * t.quantity
    if (gain > 0) totalGains += gain
    else totalLosses += Math.abs(gain)
  })

  const netGain = totalGains - totalLosses
  const allowance = 3_000
  const taxableGain = Math.max(0, netGain - allowance)
  const cgtBasic = taxableGain * 0.10
  const cgtHigher = taxableGain * 0.20

  return { totalGains, totalLosses, netGain, taxableGain, cgtBasic, cgtHigher, allowance }
}

export default function CryptoTaxCARFCalculator() {
  const [trades, setTrades] = useState([
    { buyPrice: 20000, sellPrice: 35000, quantity: 0.5 },
    { buyPrice: 1500, sellPrice: 2200, quantity: 3 },
  ])

  const addTrade = () => setTrades([...trades, { buyPrice: 0, sellPrice: 0, quantity: 0 }])
  const removeTrade = (i: number) => setTrades(trades.filter((_, idx) => idx !== i))
  const updateTrade = (i: number, field: string, value: number) => setTrades(trades.map((t, idx) => idx === i ? { ...t, [field]: value } : t))

  const result = useMemo(() => calculate(trades.filter(t => t.quantity > 0)), [trades])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Disposals</h3><button onClick={addTrade} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">+ Add</button></div>
      <div className="space-y-2">
        {trades.map((t, i) => (
          <div key={i} className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1"><span className="text-xs text-muted-foreground w-8">Buy</span><input type="number" min="0" step="0.01" value={t.buyPrice || ''} onChange={(e) => updateTrade(i, 'buyPrice', parseFloat(e.target.value)||0)} placeholder="£" className="w-24 rounded-lg border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <div className="flex items-center gap-1"><span className="text-xs text-muted-foreground w-8">Sell</span><input type="number" min="0" step="0.01" value={t.sellPrice || ''} onChange={(e) => updateTrade(i, 'sellPrice', parseFloat(e.target.value)||0)} placeholder="£" className="w-24 rounded-lg border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <div className="flex items-center gap-1"><span className="text-xs text-muted-foreground w-8">Qty</span><input type="number" min="0" step="0.001" value={t.quantity || ''} onChange={(e) => updateTrade(i, 'quantity', parseFloat(e.target.value)||0)} className="w-20 rounded-lg border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <span className={`text-sm font-medium w-20 text-right ${(t.sellPrice - t.buyPrice) * t.quantity >= 0 ? 'text-green-600' : 'text-destructive'}`}>{formatCurrency((t.sellPrice - t.buyPrice) * t.quantity)}</span>
            <button onClick={() => removeTrade(i)} className="px-1.5 py-1.5 rounded-lg bg-muted hover:bg-destructive/10 text-xs">x</button>
          </div>
        ))}
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Total Gains</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalGains)}</p></div>
          <div className="rounded-xl bg-destructive/10 p-3 text-center"><p className="text-xs text-muted-foreground">Total Losses</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.totalLosses)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Net Gain</p><p className="text-lg font-bold">{formatCurrency(result.netGain)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Taxable (after £{result.allowance.toLocaleString()})</p><p className="text-lg font-bold">{formatCurrency(result.taxableGain)}</p></div>
        </div>
        {result.taxableGain > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">CGT (basic 10%)</p><p className="text-lg font-bold">{formatCurrency(result.cgtBasic)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">CGT (higher 20%)</p><p className="text-lg font-bold">{formatCurrency(result.cgtHigher)}</p></div>
          </div>
        )}
        <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-sm text-orange-800 dark:text-orange-300">
          <p className="font-medium">CARF Reporting (from 2026):</p>
          <p>UK exchanges will automatically report your crypto transactions to HMRC under the Crypto Asset Reporting Framework. Ensure all disposals are declared.</p>
        </div>
      </div>
    </div>
  )
}
