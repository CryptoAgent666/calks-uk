import { useState, useMemo, useEffect } from 'react'
import { formatCurrency, formatPercent } from '@/utils'
import ShareRow, { useUrlParam } from '@/components/ShareRow'

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
// Non-UK resident surcharge: 2 percentage points on top of every residential
// rate (standard, first-time buyer and higher rates) since 1 April 2021
const NON_RESIDENT_SURCHARGE = 0.02
// Neither surcharge applies to a property bought for less than £40,000 (gov.uk)
const SURCHARGE_MIN_PRICE = 40_000

function calculateSdlt(price: number, buyerType: BuyerType, nonResident = false) {
  // First-time buyers: relief only available up to £500,000
  const baseResult = buyerType === 'ftb' && price <= 500_000
    ? calculateBands(price, FTB_BANDS)
    : calculateBands(price, STANDARD_BANDS)

  // Both surcharges fall on the whole price, which is the same as adding the
  // percentage points to every band
  const surchargeApplies = price >= SURCHARGE_MIN_PRICE
  const surcharge = buyerType === 'additional' && surchargeApplies ? price * ADDITIONAL_SURCHARGE : 0
  const nonResidentSurcharge = nonResident && surchargeApplies ? price * NON_RESIDENT_SURCHARGE : 0
  const totalTax = baseResult.totalTax + surcharge + nonResidentSurcharge

  return {
    ...baseResult,
    surcharge,
    nonResidentSurcharge,
    totalTax,
    effectiveRate: price > 0 ? (totalTax / price) * 100 : 0,
  }
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
  const [price, setPrice] = useUrlParam('price', '350,000')
  const [buyerType, setBuyerType] = useState<BuyerType>('standard')
  const [nonResident, setNonResident] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const b = params.get('buyer')
    if (b === 'ftb' || b === 'additional') setBuyerType(b)
    if (params.get('nonres') === '1') setNonResident(true)
  }, [])

  const value = parseFloat(price.replace(/,/g, '')) || 0
  const result = useMemo(() => calculateSdlt(value, buyerType, nonResident), [value, buyerType, nonResident])

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
        <label className="flex items-center gap-3 cursor-pointer mt-3"><input type="checkbox" checked={nonResident} onChange={(e) => setNonResident(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Non-UK resident buyer (+2% surcharge)</span></label>
        <p className="text-xs text-muted-foreground mt-1">For SDLT you are non-resident if you were in the UK for fewer than 183 days in the 12 months before buying.</p>
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
           aria-label="Property Price" />
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
            {result.surcharge > 0 && (
              <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4">
                <p className="text-xs text-muted-foreground">5% Surcharge</p>
                <p className="text-xl font-bold text-orange-700 dark:text-orange-400">{formatCurrency(result.surcharge)}</p>
              </div>
            )}
            {result.nonResidentSurcharge > 0 && (
              <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4">
                <p className="text-xs text-muted-foreground">2% Non-Resident Surcharge</p>
                <p className="text-xl font-bold text-orange-700 dark:text-orange-400">{formatCurrency(result.nonResidentSurcharge)}</p>
              </div>
            )}
          </div>

          {value < 40_000 && (buyerType === 'additional' || nonResident) && (
            <p className="text-sm text-muted-foreground">No surcharge is charged on a property bought for less than £40,000.</p>
          )}

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
                  {result.surcharge > 0 && (
                    <tr className="border-b border-border/50">
                      <td className="py-2.5">Additional-property surcharge</td>
                      <td className="text-right py-2.5">5%</td>
                      <td className="text-right py-2.5 tabular-nums">{formatCurrency(value)}</td>
                      <td className="text-right py-2.5 tabular-nums font-medium">{formatCurrency(result.surcharge)}</td>
                    </tr>
                  )}
                  {result.nonResidentSurcharge > 0 && (
                    <tr className="border-b border-border/50">
                      <td className="py-2.5">Non-resident surcharge</td>
                      <td className="text-right py-2.5">2%</td>
                      <td className="text-right py-2.5 tabular-nums">{formatCurrency(value)}</td>
                      <td className="text-right py-2.5 tabular-nums font-medium">{formatCurrency(result.nonResidentSurcharge)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <ShareRow params={{ price, buyer: buyerType, nonres: nonResident ? '1' : '' }} />
        </div>
      )}
    </div>
  )
}
