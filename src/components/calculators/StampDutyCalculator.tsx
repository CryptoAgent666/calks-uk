import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

type BuyerType = 'standard' | 'ftb' | 'additional'

// SDLT rates from April 2025 (England & Northern Ireland)
const STANDARD_BANDS = [
  { from: 0, to: 125_000, rate: 0 },
  { from: 125_000, to: 250_000, rate: 0.02 },
  { from: 250_000, to: 925_000, rate: 0.05 },
  { from: 925_000, to: 1_500_000, rate: 0.10 },
  { from: 1_500_000, to: Infinity, rate: 0.12 },
]

// First-time buyer rates from April 2025
const FTB_BANDS = [
  { from: 0, to: 300_000, rate: 0 },
  { from: 300_000, to: 500_000, rate: 0.05 },
  // If over £500,000, FTB relief not available — use standard rates
]

const ADDITIONAL_SURCHARGE = 0.05 // 5% from October 2024

function calculateSdlt(price: number, buyerType: BuyerType) {
  // First-time buyers: relief only available up to £500,000
  if (buyerType === 'ftb' && price <= 500_000) {
    return calculateBands(price, FTB_BANDS)
  }

  const baseResult = calculateBands(price, STANDARD_BANDS)

  if (buyerType === 'additional') {
    const surcharge = price * ADDITIONAL_SURCHARGE
    return {
      ...baseResult,
      surcharge,
      totalTax: baseResult.totalTax + surcharge,
      effectiveRate: price > 0 ? ((baseResult.totalTax + surcharge) / price) * 100 : 0,
    }
  }

  return { ...baseResult, surcharge: 0 }
}

function calculateBands(price: number, bands: { from: number; to: number; rate: number }[]) {
  let totalTax = 0
  const breakdown: { from: number; to: number; taxable: number; rate: number; tax: number }[] = []

  for (const band of bands) {
    if (price <= band.from) break
    const taxable = Math.min(price, band.to) - band.from
    const tax = taxable * band.rate
    totalTax += tax
    breakdown.push({ from: band.from, to: Math.min(price, band.to), taxable, rate: band.rate, tax })
  }

  return {
    price,
    totalTax,
    effectiveRate: price > 0 ? (totalTax / price) * 100 : 0,
    breakdown,
  }
}

export default function StampDutyCalculator() {
  const [price, setPrice] = useState('')
  const [buyerType, setBuyerType] = useState<BuyerType>('standard')

  const value = parseFloat(price.replace(/,/g, '')) || 0
  const result = useMemo(() => calculateSdlt(value, buyerType), [value, buyerType])

  return (
    <div className="space-y-6">
      {/* Buyer Type */}
      <div>
        <label className="block text-sm font-medium mb-2">Buyer Type</label>
        <div className="grid grid-cols-3 gap-2">
          {([
            { value: 'standard' as BuyerType, label: 'Standard' },
            { value: 'ftb' as BuyerType, label: 'First-Time Buyer' },
            { value: 'additional' as BuyerType, label: 'Additional Property' },
          ]).map((option) => (
            <button
              key={option.value}
              onClick={() => setBuyerType(option.value)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                buyerType === option.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted border-border hover:bg-accent'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Input */}
      <div>
        <label htmlFor="property-price" className="block text-sm font-medium mb-2">
          Property Price
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
          <input
            id="property-price"
            type="text"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="350,000"
            className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[200_000, 300_000, 400_000, 500_000, 750_000, 1_000_000].map((amount) => (
            <button
              key={amount}
              onClick={() => setPrice(amount.toLocaleString())}
              className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors"
            >
              £{(amount / 1000)}K
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {value > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-destructive/10 p-4">
              <p className="text-xs text-muted-foreground">Stamp Duty</p>
              <p className="text-xl font-bold text-destructive">{formatCurrency(result.totalTax)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Effective Rate</p>
              <p className="text-xl font-bold">{formatPercent(result.effectiveRate)}</p>
            </div>
            {'surcharge' in result && result.surcharge > 0 && (
              <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4">
                <p className="text-xs text-muted-foreground">5% Surcharge</p>
                <p className="text-xl font-bold text-orange-700 dark:text-orange-400">{formatCurrency(result.surcharge)}</p>
              </div>
            )}
          </div>

          {/* Band Breakdown */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Band Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">Band</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Rate</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Taxable</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">SDLT</th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((band, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2.5">{formatCurrency(band.from)} – {band.to === Infinity ? '∞' : formatCurrency(band.to)}</td>
                      <td className="text-right py-2.5">{(band.rate * 100)}%</td>
                      <td className="text-right py-2.5 tabular-nums">{formatCurrency(band.taxable)}</td>
                      <td className="text-right py-2.5 tabular-nums font-medium">{formatCurrency(band.tax)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
