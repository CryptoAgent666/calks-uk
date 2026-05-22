import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(price: number, sqft: number) {
  if (sqft <= 0 || price <= 0) return null
  const pricePerSqft = price / sqft
  const sqm = sqft * 0.092903
  const pricePerSqm = price / sqm

  // UK averages for comparison
  const ukAvg = 350 // ~£350/sqft national average
  const londonAvg = 700
  const comparison = pricePerSqft < ukAvg * 0.8 ? 'Below UK average — good value' : pricePerSqft < ukAvg * 1.2 ? 'Around UK average' : pricePerSqft < londonAvg ? 'Above average' : 'London-level pricing'

  return { pricePerSqft, pricePerSqm, sqm, comparison }
}

export default function HousePriceSqFtCalculator() {
  const [price, setPrice] = useState('')
  const [sqft, setSqft] = useState('')

  const p = parseFloat(price.replace(/,/g,'')) || 0
  const s = parseFloat(sqft.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(p, s), [p, s])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Property Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="350,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Property Price" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Floor Area (sq ft)</label><input type="text" inputMode="numeric" value={sqft} onChange={(e) => setSqft(e.target.value)} placeholder="1,200" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Floor Area (sq ft)" /><p className="text-xs text-muted-foreground mt-1">Find on the EPC or estate agent listing</p></div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Price per Square Foot</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.pricePerSqft)}/sq ft</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.pricePerSqm)}/m² &middot; {result.sqm.toFixed(0)} m²</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground text-center">
            <p className="font-medium text-foreground">{result.comparison}</p>
            <p className="mt-1">UK average: ~£350/sq ft | London: ~£700/sq ft | North: ~£200/sq ft</p>
          </div>
        </div>
      )}
    </div>
  )
}
