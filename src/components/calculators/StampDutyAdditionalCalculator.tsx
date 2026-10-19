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
// Non-UK resident surcharge: 2% on top of every other residential rate, including the higher rates
const NON_RESIDENT_SURCHARGE = 0.02
// Companies buying a dwelling for more than £500,000 pay 17% of the whole price unless a relief applies
// (e.g. property rental business, property developer or trader) — gov.uk SDLT for corporate bodies
const CORPORATE_FLAT_RATE = 0.17
const CORPORATE_FLAT_THRESHOLD = 500_000

type Buyer = 'individual' | 'company-relief' | 'company'

const BUYERS: Record<Buyer, string> = {
  individual: 'Individual who will own another home',
  'company-relief': 'Company with a relief (e.g. property rental business)',
  company: 'Company with no relief',
}

// SDLT is worked out in whole pounds: HMRC's calculator and the SDLT return drop the pence
const wholePounds = (amount: number) => Math.floor(amount + 1e-6)
// Avoids floating-point output such as 7.000000000000001%
const pct = (rate: number) => `${Math.round(rate * 1000) / 10}%`

function calculate(price: number, buyer: Buyer, nonResident: boolean) {
  // The higher rates do not apply to a property bought for less than £40,000 (gov.uk)
  const surchargeApplies = price >= 40_000
  const nonRes = nonResident ? NON_RESIDENT_SURCHARGE : 0
  const flatRate = buyer === 'company' && price > CORPORATE_FLAT_THRESHOLD
  let standardSDLT = 0
  let higherSDLT = 0
  const breakdown: { from: number; to: number; standardRate: number; additionalRate: number; standardTax: number; additionalTax: number }[] = []

  for (const b of BANDS) {
    if (price <= b.from) break
    const taxable = Math.min(price, b.to) - b.from
    const stdTax = taxable * b.baseRate
    const addRate = b.baseRate + (surchargeApplies ? b.surcharge : 0) + nonRes
    const addTax = taxable * addRate
    standardSDLT += stdTax
    higherSDLT += addTax
    breakdown.push({ from: b.from, to: Math.min(price, b.to), standardRate: b.baseRate, additionalRate: addRate, standardTax: stdTax, additionalTax: addTax })
  }

  const flatTotalRate = CORPORATE_FLAT_RATE + nonRes
  const total = wholePounds(flatRate ? price * flatTotalRate : higherSDLT)
  const standard = wholePounds(standardSDLT)
  return {
    total, standard, extra: total - standard, flatRate, flatTotalRate, breakdown,
    nonResAmount: wholePounds(price * nonRes),
    effectiveRate: price > 0 ? (total / price) * 100 : 0,
  }
}

export default function StampDutyAdditionalCalculator() {
  const [price, setPrice] = useState('')
  const [buyer, setBuyer] = useState<Buyer>('individual')
  const [nonResident, setNonResident] = useState(false)
  const val = Math.max(0, parseFloat(price.replace(/,/g,'')) || 0)
  const result = useMemo(() => calculate(val, buyer, nonResident), [val, buyer, nonResident])

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="sdlt-add-price" className="block text-sm font-medium mb-2">Property Price</label>
        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <input id="sdlt-add-price" type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="300,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Property Price" /></div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[200_000, 300_000, 500_000, 750_000, 1_000_000].map(a => (
            <button key={a} onClick={() => setPrice(a.toLocaleString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">£{a >= 1e6 ? `${a/1e6}M` : `${a/1000}K`}</button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="sdlt-add-buyer" className="block text-sm font-medium mb-2">Who is buying?</label>
        <select id="sdlt-add-buyer" value={buyer} onChange={(e) => setBuyer(e.target.value as Buyer)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring">
          {(Object.keys(BUYERS) as Buyer[]).map((b) => (
            <option key={b} value={b}>{BUYERS[b]}</option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={nonResident} onChange={(e) => setNonResident(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">Non-UK resident (adds 2% on top of the higher rates)</span>
      </label>

      {val > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total SDLT</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.total)}</p></div>
            <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-center"><p className="text-xs text-muted-foreground">Extra over standard rates</p><p className="text-xl font-bold text-orange-700 dark:text-orange-400">{formatCurrency(result.extra)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Standard SDLT</p><p className="text-xl font-bold">{formatCurrency(result.standard)}</p></div>
          </div>
          {result.flatRate ? (
            <p className="rounded-xl bg-muted/50 p-4 text-sm">A company with no relief buying a dwelling for over £500,000 pays {pct(result.flatTotalRate)} of the whole price: {formatCurrency(val)} × {pct(result.flatTotalRate)} = {formatCurrency(result.total)}.</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Band</th><th className="text-right py-2 font-medium text-muted-foreground">Standard</th><th className="text-right py-2 font-medium text-muted-foreground">Additional</th></tr></thead>
              <tbody>
                {result.breakdown.map((b, i) => (
                  <tr key={i} className="border-b border-border/50"><td className="py-2">{formatCurrency(b.from)} – {formatCurrency(b.to)}</td><td className="text-right tabular-nums">{pct(b.standardRate)} = {formatCurrency(b.standardTax)}</td><td className="text-right tabular-nums font-medium">{pct(b.additionalRate)} = {formatCurrency(b.additionalTax)}</td></tr>
                ))}
              </tbody>
            </table>
          )}
          {nonResident && (
            <p className="text-sm text-muted-foreground">Includes the non-resident surcharge of {formatCurrency(result.nonResAmount)} (2% of {formatCurrency(val)}).</p>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p>5% surcharge applies to buy-to-let, second homes and additional properties from October 2024, on purchases of £40,000 or more. Effective rate: {formatPercent(result.effectiveRate)}. SDLT is rounded down to the whole pound.</p>
            <p>Companies pay the higher rates on any dwelling from £40,000. A company buying a dwelling for over £500,000 pays a flat 17% of the whole price unless a relief applies, for example for a property rental business. Non-UK residents pay 2% on top of all these rates.</p>
          </div>
        </div>
      )}
    </div>
  )
}
