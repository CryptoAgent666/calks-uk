import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// FTB Stamp Duty from April 2025
const FTB_BANDS = [
  { from: 0, to: 300_000, rate: 0 },
  { from: 300_000, to: 500_000, rate: 0.05 },
]
const STANDARD_BANDS = [
  { from: 0, to: 125_000, rate: 0 },
  { from: 125_000, to: 250_000, rate: 0.02 },
  { from: 250_000, to: 925_000, rate: 0.05 },
  { from: 925_000, to: 1_500_000, rate: 0.10 },
  { from: 1_500_000, to: Infinity, rate: 0.12 },
]
// Non-UK resident surcharge (from 1 April 2021): 2% on the whole price, on top of the other rates
const NON_RESIDENT_SURCHARGE = 0.02

function calcBands(price: number, bands: { from: number; to: number; rate: number }[]) {
  let total = 0
  for (const b of bands) {
    if (price <= b.from) break
    total += (Math.min(price, b.to) - b.from) * b.rate
  }
  return total
}

// SDLT is worked out in whole pounds: HMRC's calculator and the SDLT return drop the pence
const wholePounds = (amount: number) => Math.floor(amount + 1e-6)

function calculate(price: number, nonResident: boolean) {
  const ftbEligible = price <= 500_000
  const surcharge = nonResident ? price * NON_RESIDENT_SURCHARGE : 0
  const ftbTax = wholePounds((ftbEligible ? calcBands(price, FTB_BANDS) : calcBands(price, STANDARD_BANDS)) + surcharge)
  const standardTax = wholePounds(calcBands(price, STANDARD_BANDS) + surcharge)
  const saving = standardTax - ftbTax

  return {
    price, ftbEligible, ftbTax, standardTax, saving,
    surcharge: wholePounds(surcharge),
    effectiveRate: price > 0 ? (ftbTax / price) * 100 : 0,
  }
}

export default function StampDutyFTBCalculator() {
  const [price, setPrice] = useState('')
  const [nonResident, setNonResident] = useState(false)
  const val = Math.max(0, parseFloat(price.replace(/,/g, '')) || 0)
  const result = useMemo(() => calculate(val, nonResident), [val, nonResident])

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="ftb-price" className="block text-sm font-medium mb-2">Property Price</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
          <input id="ftb-price" type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="350,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Property Price" />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[200_000, 300_000, 350_000, 425_000, 500_000, 600_000].map((a) => (
            <button key={a} onClick={() => setPrice(a.toLocaleString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">£{a / 1000}K</button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={nonResident} onChange={(e) => setNonResident(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">Non-UK resident (adds 2% of the whole price)</span>
      </label>

      {val > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          {!result.ftbEligible && (
            <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-sm text-orange-800 dark:text-orange-300">
              First-time buyer relief is not available for properties over £500,000. Standard rates apply.
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <p className="text-xs text-muted-foreground">Your SDLT (FTB)</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(result.ftbTax)}</p>
              <p className="text-xs text-muted-foreground">Effective rate {formatPercent(result.effectiveRate)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">Standard Rate SDLT</p>
              <p className="text-xl font-bold">{formatCurrency(result.standardTax)}</p>
            </div>
            {result.saving > 0 && (
              <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center">
                <p className="text-xs text-muted-foreground">Your Saving</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.saving)}</p>
              </div>
            )}
          </div>

          {nonResident && (
            <p className="text-sm text-muted-foreground">Both figures include the non-resident surcharge of {formatCurrency(result.surcharge)} (2% of {formatCurrency(val)}).</p>
          )}

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">First-time buyer rates (April 2025):</p>
            <p>0% on the first £300,000</p>
            <p>5% on £300,001 to £500,000</p>
            <p>Properties over £500,000 pay standard rates.</p>
            <p>Non-UK residents pay an extra 2% on the whole price on top of these rates. SDLT is rounded down to the whole pound.</p>
          </div>
        </div>
      )}
    </div>
  )
}
