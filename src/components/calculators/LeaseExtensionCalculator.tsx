import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Statutory lease extension for a flat under the Leasehold Reform, Housing and Urban
// Development Act 1993, Schedule 13: 90 years added to the unexpired term at a peppercorn rent.
// The Leasehold and Freehold Reform Act 2024 valuation changes (no marriage value, prescribed
// rates, 990-year extensions) are not yet in force, so the current method applies.
const EXTENSION_YEARS = 90
// Long-lease (share-of-freehold) value taken as 99% of the freehold vacant possession value
const LONG_LEASE_TO_FREEHOLD = 0.99
// Marriage value is disregarded only when the unexpired term EXCEEDS 80 years (Sch 13 para 4(2A))
const MARRIAGE_VALUE_YEARS = 80

// Typical relativity (existing lease value as % of freehold vacant possession value), approximate
// points averaged from published relativity graphs such as Savills 2015 (unenfranchisable) and
// Gerald Eve 2016. Linear interpolation between points.
const RELATIVITY_POINTS: [number, number][] = [
  [0, 0], [10, 22], [20, 38], [30, 52], [40, 63], [50, 72], [55, 76], [60, 80],
  [65, 84], [70, 87], [75, 90], [80, 92.5], [85, 94], [90, 96],
]

function typicalRelativity(years: number) {
  if (years <= 0) return 0
  for (let i = 1; i < RELATIVITY_POINTS.length; i++) {
    const [y1, r1] = RELATIVITY_POINTS[i]
    if (years <= y1) {
      const [y0, r0] = RELATIVITY_POINTS[i - 1]
      return r0 + (r1 - r0) * (years - y0) / (y1 - y0)
    }
  }
  return RELATIVITY_POINTS[RELATIVITY_POINTS.length - 1][1]
}

function calculate(
  longLeaseValue: number,
  years: number,
  groundRent: number,
  defermentPct: number,
  capitalisationPct: number,
  relativityPct: number,
  valuerFee: number,
  legalFee: number,
  landlordCosts: number,
) {
  const d = defermentPct / 100
  const c = capitalisationPct / 100
  // Each line is rounded to the nearest pound, as in a valuer's report, so the breakdown adds up
  const freeholdValue = Math.round(longLeaseValue / LONG_LEASE_TO_FREEHOLD)

  // Term: the ground rent the freeholder gives up for the rest of the current lease
  const term = Math.round(c > 0 ? groundRent * (1 - Math.pow(1 + c, -years)) / c : groundRent * years)
  // Reversion: the flat's freehold value deferred to the end of the lease, now and after the extension
  const reversionNow = Math.round(freeholdValue * Math.pow(1 + d, -years))
  const reversionAfter = Math.round(freeholdValue * Math.pow(1 + d, -(years + EXTENSION_YEARS)))
  const diminution = term + reversionNow - reversionAfter

  const hasMV = years <= MARRIAGE_VALUE_YEARS
  const existingLeaseValue = Math.round(freeholdValue * relativityPct / 100)
  let marriageValue = 0
  if (hasMV) {
    const valuesAfter = longLeaseValue + reversionAfter
    const valuesBefore = existingLeaseValue + term + reversionNow
    marriageValue = Math.round(Math.max(0, 0.5 * (valuesAfter - valuesBefore)))
  }

  const premium = diminution + marriageValue
  const fees = valuerFee + legalFee + landlordCosts
  const totalCost = premium + fees
  const valueUplift = longLeaseValue - existingLeaseValue

  return { freeholdValue, term, reversionNow, reversionAfter, diminution, hasMV, existingLeaseValue, marriageValue, premium, valuerFee, legalFee, landlordCosts, fees, totalCost, valueUplift }
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'
const moneyInputClass = 'w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function LeaseExtensionCalculator() {
  const [value, setValue] = useState('350000')
  const [lease, setLease] = useState('75')
  const [rent, setRent] = useState('200')
  const [deferment, setDeferment] = useState('5')
  const [capRate, setCapRate] = useState('7')
  const [relOverride, setRelOverride] = useState<string | null>(null)
  const [valuer, setValuer] = useState('1500')
  const [legal, setLegal] = useState('1500')
  const [landlord, setLandlord] = useState('2500')

  const v = parseFloat(value.replace(/,/g, '')) || 0
  const l = Math.min(Math.max(parseFloat(lease) || 0, 0), 999)
  const r = parseFloat(rent) || 0
  const dr = parseFloat(deferment) || 0
  const cr = parseFloat(capRate) || 0
  const defaultRel = typicalRelativity(l)
  const rel = relOverride !== null ? Math.min(Math.max(parseFloat(relOverride) || 0, 0), 100) : defaultRel
  const vf = parseFloat(valuer.replace(/,/g, '')) || 0
  const lf = parseFloat(legal.replace(/,/g, '')) || 0
  const lc = parseFloat(landlord.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(v, l, r, dr, cr, rel, vf, lf, lc), [v, l, r, dr, cr, rel, vf, lf, lc])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Flat value with a long lease</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className={`${moneyInputClass} text-lg`} aria-label="Flat value with a long lease (share-of-freehold value)" /></div><p className="text-xs text-muted-foreground mt-1">What the flat would sell for with a very long lease or a share of the freehold.</p></div>
        <div><label className="block text-sm font-medium mb-2">Unexpired lease term (years)</label><input type="number" min="1" max="999" value={lease} onChange={(e) => setLease(e.target.value)} className={`${inputClass} text-lg`} aria-label="Unexpired lease term (years)" />{l > 0 && l <= MARRIAGE_VALUE_YEARS && <p className="text-xs text-orange-600 mt-1">80 years or less: marriage value is payable.</p>}</div>
        <div><label className="block text-sm font-medium mb-2">Current ground rent (£ a year)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={rent} onChange={(e) => setRent(e.target.value)} className={moneyInputClass} aria-label="Current ground rent (£ a year)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Deferment rate (%)</label><input type="number" min="0" max="15" step="0.25" value={deferment} onChange={(e) => setDeferment(e.target.value)} className={inputClass} aria-label="Deferment rate (%)" /><p className="text-xs text-muted-foreground mt-1">5% is the usual rate for flats (Sportelli).</p></div>
        <div><label className="block text-sm font-medium mb-2">Capitalisation rate (%)</label><input type="number" min="0" max="15" step="0.25" value={capRate} onChange={(e) => setCapRate(e.target.value)} className={inputClass} aria-label="Capitalisation rate (%)" /><p className="text-xs text-muted-foreground mt-1">Usually 6-8%, depending on the ground rent.</p></div>
        {l > 0 && l <= MARRIAGE_VALUE_YEARS && (
          <div><label className="block text-sm font-medium mb-2">Relativity (%)</label><input type="number" min="0" max="100" step="0.5" value={relOverride ?? String(Math.round(defaultRel * 10) / 10)} onChange={(e) => setRelOverride(e.target.value)} className={inputClass} aria-label="Relativity (%): existing lease value as a percentage of freehold value" /><p className="text-xs text-muted-foreground mt-1">Typical relativity (estimate) for {Math.round(l * 10) / 10} years: {(Math.round(defaultRel * 10) / 10).toFixed(1)}%.{relOverride !== null && <> <button type="button" onClick={() => setRelOverride(null)} className="underline">Use typical</button></>}</p></div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Professional fees you pay</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-2">Your valuer</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={valuer} onChange={(e) => setValuer(e.target.value)} className={moneyInputClass} aria-label="Your valuer's fee" /></div></div>
          <div><label className="block text-sm font-medium mb-2">Your solicitor</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={legal} onChange={(e) => setLegal(e.target.value)} className={moneyInputClass} aria-label="Your solicitor's fee" /></div></div>
          <div><label className="block text-sm font-medium mb-2">Freeholder's valuation and legal costs</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={landlord} onChange={(e) => setLandlord(e.target.value)} className={moneyInputClass} aria-label="Freeholder's reasonable valuation and legal costs" /></div></div>
        </div>
      </div>

      {v > 0 && l > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated total cost of a 90-year extension</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(Math.round(result.totalCost))}</p>
            <p className="text-sm text-muted-foreground mt-1">Premium: {formatCurrency(Math.round(result.premium))} + fees: {formatCurrency(result.fees)}</p>
          </div>
          {result.hasMV && result.valueUplift > 0 && (
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center">
              <p className="text-xs text-muted-foreground">Estimated value gain from the extension</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">+{formatCurrency(Math.round(result.valueUplift))}</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(Math.round(result.existingLeaseValue))} with the current lease ({(Math.round(rel * 10) / 10).toFixed(1)}% relativity) → {formatCurrency(v)} with the extended lease</p>
            </div>
          )}
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Term: ground rent given up ({Math.round(l * 10) / 10} years at {cr}%)</td><td className="text-right tabular-nums">{formatCurrency(Math.round(result.term))}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Reversion now (freehold value {formatCurrency(Math.round(result.freeholdValue))} deferred {Math.round(l * 10) / 10} years at {dr}%)</td><td className="text-right tabular-nums">{formatCurrency(Math.round(result.reversionNow))}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Less reversion after extension (deferred {Math.round((l + EXTENSION_YEARS) * 10) / 10} years)</td><td className="text-right tabular-nums">−{formatCurrency(Math.round(result.reversionAfter))}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Diminution in the freeholder's interest</td><td className="text-right tabular-nums">{formatCurrency(Math.round(result.diminution))}</td></tr>
              <tr className="border-b border-border/50"><td className={`py-2 ${result.hasMV ? 'text-orange-600' : ''}`}>Marriage value (freeholder's 50% share)</td><td className={`text-right tabular-nums ${result.hasMV ? 'text-orange-600' : ''}`}>{result.hasMV ? formatCurrency(Math.round(result.marriageValue)) : 'Nil (over 80 years)'}</td></tr>
              <tr className="border-b border-border/50 font-medium"><td className="py-2">Premium</td><td className="text-right tabular-nums">{formatCurrency(Math.round(result.premium))}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Your valuer</td><td className="text-right tabular-nums">{formatCurrency(result.valuerFee)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Your solicitor</td><td className="text-right tabular-nums">{formatCurrency(result.legalFee)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Freeholder's valuation and legal costs</td><td className="text-right tabular-nums">{formatCurrency(result.landlordCosts)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
            <p>{result.hasMV ? 'With 80 years or less left, the freeholder is entitled to half of the marriage value, which is why the premium jumps once a lease reaches 80 years.' : 'With more than 80 years left, marriage value is disregarded, so the premium is only the loss of ground rent and reversion.'} The premium uses the current method under the Leasehold Reform, Housing and Urban Development Act 1993 and assumes the ground rent stays at today's level for the rest of the term. The typical relativity is an approximate average of published graphs (such as Savills 2015 and Gerald Eve 2016); your valuer's figure may differ.</p>
            <p>The Leasehold and Freehold Reform Act 2024 would remove marriage value and set the rates by regulation, but those valuation changes are not yet in force. Get a RICS valuer's report before serving a Section 42 notice, because the notice must state the premium you propose.</p>
          </div>
        </div>
      )}
    </div>
  )
}
