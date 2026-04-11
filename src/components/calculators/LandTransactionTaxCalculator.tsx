import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// LBTT Scotland 2025
const LBTT_BANDS = [
  { from: 0, to: 145_000, rate: 0 },
  { from: 145_000, to: 250_000, rate: 0.02 },
  { from: 250_000, to: 325_000, rate: 0.05 },
  { from: 325_000, to: 750_000, rate: 0.10 },
  { from: 750_000, to: Infinity, rate: 0.12 },
]

// LTT Wales 2025
const LTT_BANDS = [
  { from: 0, to: 225_000, rate: 0 },
  { from: 225_000, to: 400_000, rate: 0.06 },
  { from: 400_000, to: 750_000, rate: 0.075 },
  { from: 750_000, to: 1_500_000, rate: 0.10 },
  { from: 1_500_000, to: Infinity, rate: 0.12 },
]

type Country = 'scotland' | 'wales'

function calcBands(price: number, bands: typeof LBTT_BANDS) {
  let total = 0
  const breakdown: { from: number; to: number; rate: number; tax: number }[] = []
  for (const b of bands) {
    if (price <= b.from) break
    const taxable = Math.min(price, b.to) - b.from
    const tax = taxable * b.rate
    total += tax
    breakdown.push({ from: b.from, to: Math.min(price, b.to), rate: b.rate, tax })
  }
  return { total, breakdown, effectiveRate: price > 0 ? (total / price) * 100 : 0 }
}

export default function LandTransactionTaxCalculator() {
  const [country, setCountry] = useState<Country>('scotland')
  const [price, setPrice] = useState('')

  const val = parseFloat(price.replace(/,/g, '')) || 0
  const bands = country === 'scotland' ? LBTT_BANDS : LTT_BANDS
  const result = useMemo(() => calcBands(val, bands), [val, bands])
  const taxName = country === 'scotland' ? 'LBTT' : 'LTT'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setCountry('scotland')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${country === 'scotland' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Scotland (LBTT)</button>
        <button onClick={() => setCountry('wales')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${country === 'wales' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Wales (LTT)</button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Property Price</label>
        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="300,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[200_000, 300_000, 400_000, 500_000, 750_000].map(a => (
            <button key={a} onClick={() => setPrice(a.toLocaleString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">£{a/1000}K</button>
          ))}
        </div>
      </div>

      {val > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">{taxName} to Pay</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.total)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Effective Rate</p><p className="text-xl font-bold">{formatPercent(result.effectiveRate)}</p></div>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Band</th><th className="text-right py-2 font-medium text-muted-foreground">Rate</th><th className="text-right py-2 font-medium text-muted-foreground">{taxName}</th></tr></thead>
            <tbody>
              {result.breakdown.map((b, i) => (
                <tr key={i} className="border-b border-border/50"><td className="py-2">{formatCurrency(b.from)} – {formatCurrency(b.to)}</td><td className="text-right">{(b.rate*100)}%</td><td className="text-right tabular-nums font-medium">{formatCurrency(b.tax)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
