import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// SDLT Additional Property rates from April 2025 (standard + 5% surcharge)
const BANDS = [
  { from: 0, to: 125_000, baseRate: 0, surcharge: 0.05 },
  { from: 125_000, to: 250_000, baseRate: 0.02, surcharge: 0.05 },
  { from: 250_000, to: 925_000, baseRate: 0.05, surcharge: 0.05 },
  { from: 925_000, to: 1_500_000, baseRate: 0.10, surcharge: 0.05 },
  { from: 1_500_000, to: Infinity, baseRate: 0.12, surcharge: 0.05 },
]

function calculate(price: number) {
  let standardSDLT = 0
  let additionalSDLT = 0
  const breakdown: { from: number; to: number; standardRate: number; additionalRate: number; standardTax: number; additionalTax: number }[] = []

  for (const b of BANDS) {
    if (price <= b.from) break
    const taxable = Math.min(price, b.to) - b.from
    const stdTax = taxable * b.baseRate
    const addTax = taxable * (b.baseRate + b.surcharge)
    standardSDLT += stdTax
    additionalSDLT += addTax
    breakdown.push({ from: b.from, to: Math.min(price, b.to), standardRate: b.baseRate, additionalRate: b.baseRate + b.surcharge, standardTax: stdTax, additionalTax: addTax })
  }

  const surchargeAmount = additionalSDLT - standardSDLT
  return { standardSDLT, additionalSDLT, surchargeAmount, breakdown, effectiveRate: price > 0 ? (additionalSDLT / price) * 100 : 0 }
}

export default function StampDutyAdditionalCalculator() {
  const [price, setPrice] = useState('')
  const val = parseFloat(price.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(val), [val])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Property Price</label>
        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="300,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[200_000, 300_000, 500_000, 750_000, 1_000_000].map(a => (
            <button key={a} onClick={() => setPrice(a.toLocaleString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">£{a >= 1e6 ? `${a/1e6}M` : `${a/1000}K`}</button>
          ))}
        </div>
      </div>

      {val > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Additional Property SDLT</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.additionalSDLT)}</p></div>
            <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-center"><p className="text-xs text-muted-foreground">5% Surcharge</p><p className="text-xl font-bold text-orange-700 dark:text-orange-400">{formatCurrency(result.surchargeAmount)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Standard SDLT</p><p className="text-xl font-bold">{formatCurrency(result.standardSDLT)}</p></div>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Band</th><th className="text-right py-2 font-medium text-muted-foreground">Standard</th><th className="text-right py-2 font-medium text-muted-foreground">Additional</th></tr></thead>
            <tbody>
              {result.breakdown.map((b, i) => (
                <tr key={i} className="border-b border-border/50"><td className="py-2">{formatCurrency(b.from)} – {formatCurrency(b.to)}</td><td className="text-right tabular-nums">{(b.standardRate*100)}% = {formatCurrency(b.standardTax)}</td><td className="text-right tabular-nums font-medium">{(b.additionalRate*100)}% = {formatCurrency(b.additionalTax)}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>5% surcharge applies to buy-to-let, second homes and additional properties from October 2024. Effective rate: {formatPercent(result.effectiveRate)}.</p>
          </div>
        </div>
      )}
    </div>
  )
}
