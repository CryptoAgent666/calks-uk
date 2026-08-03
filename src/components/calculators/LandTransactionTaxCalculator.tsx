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

// LTT Wales — main residential rates, effective 10 October 2022. Confirmed
// unchanged for 2026-27 by the Welsh Government (Draft Budget 2026-27, 14 Oct 2025).
const LTT_BANDS = [
  { from: 0, to: 225_000, rate: 0 },
  { from: 225_000, to: 400_000, rate: 0.06 },
  { from: 400_000, to: 750_000, rate: 0.075 },
  { from: 750_000, to: 1_500_000, rate: 0.10 },
  { from: 1_500_000, to: Infinity, rate: 0.12 },
]

// Higher residential rates (additional dwellings), effective 11 December 2024.
// Wales does NOT use a flat supplement like Scotland's ADS: this is a separate
// band table charged from the first pound, with no nil-rate band. Its break
// points (£180k/£250k) deliberately differ from the main-rate break (£225k).
const LTT_HIGHER_BANDS = [
  { from: 0, to: 180_000, rate: 0.05 },
  { from: 180_000, to: 250_000, rate: 0.085 },
  { from: 250_000, to: 400_000, rate: 0.10 },
  { from: 400_000, to: 750_000, rate: 0.125 },
  { from: 750_000, to: 1_500_000, rate: 0.15 },
  { from: 1_500_000, to: Infinity, rate: 0.17 },
]
// Higher rates only bite once the price reaches £40,000; below that the main
// rates apply (and are 0% at that level).
const LTT_HIGHER_ENTRY = 40_000

// Non-residential / mixed-use freehold or lease premium, effective 22 Dec 2020.
const LTT_NONRES_BANDS = [
  { from: 0, to: 225_000, rate: 0 },
  { from: 225_000, to: 250_000, rate: 0.01 },
  { from: 250_000, to: 1_000_000, rate: 0.05 },
  { from: 1_000_000, to: Infinity, rate: 0.06 },
]

// Non-residential lease rent, charged on the net present value, from 22 Dec 2020.
const LTT_NPV_BANDS = [
  { from: 0, to: 225_000, rate: 0 },
  { from: 225_000, to: 2_000_000, rate: 0.01 },
  { from: 2_000_000, to: Infinity, rate: 0.02 },
]

type Country = 'scotland' | 'wales'
type TxType = 'residential' | 'higher' | 'nonres' | 'npv'

const TX_LABELS: Record<TxType, string> = {
  residential: 'Residential (main rates)',
  higher: 'Additional dwelling (higher rates)',
  nonres: 'Non-residential or mixed use',
  npv: 'Non-residential lease (rent NPV)',
}

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
  const [txType, setTxType] = useState<TxType>('residential')

  const val = parseFloat(price.replace(/,/g, '')) || 0
  // Transaction types other than the main residential rates are Welsh-only here.
  const effectiveTx: TxType = country === 'wales' ? txType : 'residential'
  const bands = country === 'scotland'
    ? LBTT_BANDS
    : effectiveTx === 'higher' ? LTT_HIGHER_BANDS
    : effectiveTx === 'nonres' ? LTT_NONRES_BANDS
    : effectiveTx === 'npv' ? LTT_NPV_BANDS
    : LTT_BANDS
  // Higher rates only apply once the consideration reaches £40,000.
  const chargeable = effectiveTx === 'higher' && val < LTT_HIGHER_ENTRY ? 0 : val
  const result = useMemo(() => calcBands(chargeable, bands), [chargeable, bands])
  const taxName = country === 'scotland' ? 'LBTT' : 'LTT'
  const amountLabel = effectiveTx === 'npv' ? 'Net Present Value of Rent' : 'Property Price'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setCountry('scotland')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${country === 'scotland' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Scotland (LBTT)</button>
        <button onClick={() => setCountry('wales')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${country === 'wales' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Wales (LTT)</button>
      </div>
      {country === 'wales' && (
        <div>
          <label className="block text-sm font-medium mb-2">Transaction type</label>
          <select value={txType} onChange={(e) => setTxType(e.target.value as TxType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Transaction type">
            {(Object.keys(TX_LABELS) as TxType[]).map(k => <option key={k} value={k}>{TX_LABELS[k]}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-2">{amountLabel}</label>
        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="300,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label={amountLabel} /></div>
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

          {effectiveTx === 'higher' && (
            <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
              <p>Higher rates apply when you buy a dwelling for £40,000 or more and already own one. Unlike Scotland's Additional Dwelling Supplement, this is not a flat supplement on top: it is a separate band table charged from the first pound, with no nil-rate band. If you sell your previous main home within 3 years you can usually claim back the difference from the main rates.</p>
            </div>
          )}
          {effectiveTx === 'npv' && (
            <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
              <p>Rent under a non-residential lease is taxed on the net present value of the rent over the lease term, not the yearly rent. Any premium paid for the lease is taxed separately under the non-residential rates. Where the annual rent reaches £13,500, the 0% band is not available on the premium.</p>
            </div>
          )}
          {country === 'scotland' && (
            <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
              <p>Main residential LBTT only. Scotland also charges an Additional Dwelling Supplement on second homes and has first-time buyer relief, and non-residential purchases use their own bands; none of those are included in this figure.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
