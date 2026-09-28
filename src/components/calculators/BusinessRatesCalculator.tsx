import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Business rates 2026/27, after the 2026 revaluations (new lists from 1 April 2026).
// England: SI 2026/152 and HMT multiplier notices; Wales: Business Wales multipliers
// and relief pages; Scotland: SSI 2026/39 and 2026/68, finance circular 7/2026.

type Nation = 'england' | 'wales' | 'scotland'
type Use =
  | 'eng-rhl' | 'eng-pub' | 'eng-other'
  | 'wal-shop' | 'wal-po' | 'wal-food' | 'wal-other'
  | 'sco-licensed' | 'sco-rhl' | 'sco-other'
type Special = 'none' | 'charity' | 'rural-shop' | 'rural-pub'

const USES: Record<Nation, { v: Use; l: string }[]> = {
  england: [
    { v: 'eng-rhl', l: 'Shop, café, restaurant, salon, gym, hotel, holiday let or other retail, hospitality or leisure' },
    { v: 'eng-pub', l: 'Pub or live music venue' },
    { v: 'eng-other', l: 'Office, workshop, warehouse, bank, surgery, professional or other use' },
  ],
  wales: [
    { v: 'wal-shop', l: 'Shop, kiosk or pharmacy' },
    { v: 'wal-po', l: 'Post office' },
    { v: 'wal-food', l: 'Pub, restaurant, café, bar or live music venue' },
    { v: 'wal-other', l: 'Other (office, salon, hotel, gym, workshop, holiday let…)' },
  ],
  scotland: [
    { v: 'sco-licensed', l: 'Hotel, hostel, pub, restaurant, café, nightclub or music venue' },
    { v: 'sco-rhl', l: 'Shop, salon, gym, self-catering or other retail, hospitality or leisure' },
    { v: 'sco-other', l: 'Office, workshop, warehouse or other use' },
  ],
}

// England multipliers in £ per £1 of rateable value. RHL rates apply to occupied
// qualifying properties below £500,000; the small rates apply to every property
// below £51,000, whether or not it gets Small Business Rate Relief.
const ENG = { small: 0.432, standard: 0.48, high: 0.508, rhlSmall: 0.382, rhlStandard: 0.43, trs: 0.01 }
// Wales: retail multiplier for shops, kiosks, pharmacies and post offices below
// £51,000; higher multiplier above £100,000
const WAL = { retail: 0.35, standard: 0.502, higher: 0.515 }
// Scotland: basic property rate to £51,000, intermediate to £100,000, higher above
const SCO = { basic: 0.481, intermediate: 0.535, higher: 0.548 }

// England transitional relief caps on increases in 2026/27, by rateable value
// (London small band £28,000), used for the Supporting Small Business relief cap
const ENG_TR_CAP = (rv: number, london: boolean) => (rv <= (london ? 28_000 : 20_000) ? 0.05 : rv <= 100_000 ? 0.15 : 0.30)

function multiplierFor(nation: Nation, use: Use, rv: number): { rate: number; label: string } {
  if (nation === 'england') {
    const rhl = use === 'eng-rhl' || use === 'eng-pub'
    if (rv >= 500_000) return { rate: ENG.high, label: 'High-value multiplier' }
    if (rv < 51_000) return rhl ? { rate: ENG.rhlSmall, label: 'Small retail, hospitality and leisure multiplier' } : { rate: ENG.small, label: 'Small business multiplier' }
    return rhl ? { rate: ENG.rhlStandard, label: 'Standard retail, hospitality and leisure multiplier' } : { rate: ENG.standard, label: 'Standard multiplier' }
  }
  if (nation === 'wales') {
    if (rv > 100_000) return { rate: WAL.higher, label: 'Higher multiplier' }
    if (rv < 51_000 && (use === 'wal-shop' || use === 'wal-po')) return { rate: WAL.retail, label: 'Retail multiplier' }
    return { rate: WAL.standard, label: 'Standard multiplier' }
  }
  if (rv > 100_000) return { rate: SCO.higher, label: 'Higher property rate' }
  if (rv > 51_000) return { rate: SCO.intermediate, label: 'Intermediate property rate' }
  return { rate: SCO.basic, label: 'Basic property rate' }
}

// Small business relief as a share of the bill, for a ratepayer with one property
function smallBusinessRelief(nation: Nation, use: Use, rv: number): { pct: number; label: string } {
  if (nation === 'england') {
    const pct = rv <= 12_000 ? 1 : rv < 15_000 ? (15_000 - rv) / 3_000 : 0
    return { pct, label: 'Small Business Rate Relief' }
  }
  if (nation === 'wales') {
    if (use === 'wal-po') return { pct: rv <= 9_000 ? 1 : rv <= 12_000 ? 0.5 : 0, label: 'Small Business Rates Relief (post office)' }
    return { pct: rv <= 6_000 ? 1 : rv < 12_000 ? (12_000 - rv) / 6_000 : 0, label: 'Small Business Rates Relief' }
  }
  // Scotland: Small Business Bonus Scheme, single property
  let pct = 0
  if (rv <= 12_000) pct = 1
  else if (rv <= 15_000) pct = (100 - 75 * (1 - (15_000 - rv) / 3_000)) / 100
  else if (rv <= 20_000) pct = (25 * (20_000 - rv) / 5_000) / 100
  return { pct, label: 'Small Business Bonus Scheme' }
}

function calculate(opts: {
  nation: Nation; use: Use; rv: number; onlyProperty: boolean; special: Special
  existing: boolean; ssb: boolean; lastBill: number; london: boolean
}) {
  const { nation, use, rv, onlyProperty, special, existing, london } = opts
  const m = multiplierFor(nation, use, rv)
  const gross = rv * m.rate
  // England 2026/27 only: 1p Transitional Relief Supplement for properties already on
  // the list that get neither transitional relief nor Supporting Small Business relief
  const ssbApplies = nation === 'england' && opts.ssb && opts.lastBill > 0
  const trs = nation === 'england' && existing && !ssbApplies ? rv * ENG.trs : 0
  const chargeable = gross + trs

  const lines: { label: string; amount: number }[] = []
  let bill = chargeable

  // Mandatory reliefs do not stack: take the most valuable one that applies
  const options: { pct: number; label: string }[] = []
  if (onlyProperty && special !== 'charity') {
    const s = smallBusinessRelief(nation, use, rv)
    if (s.pct > 0) options.push(s)
  }
  if (special === 'charity') options.push({ pct: 0.8, label: 'Charitable rate relief (80% mandatory)' })
  if (nation === 'england' && special === 'rural-shop' && rv <= 8_500) options.push({ pct: 1, label: 'Rural rate relief' })
  if (nation === 'england' && special === 'rural-pub' && rv <= 12_500) options.push({ pct: 1, label: 'Rural rate relief' })
  const best = options.sort((a, b) => b.pct - a.pct)[0]
  if (best) {
    const amount = bill * best.pct
    lines.push({ label: best.label.includes('%') ? best.label : `${best.label} (${+(best.pct * 100).toFixed(1)}%)`, amount })
    bill -= amount
  }

  // Sector reliefs applied to what remains
  let sector: { pct: number; label: string } | null = null
  if (nation === 'england' && use === 'eng-pub' && rv < 500_000) sector = { pct: 0.15, label: 'Pubs and live music venues relief (15%)' }
  if (nation === 'wales' && use === 'wal-food') sector = { pct: 0.15, label: 'Food and drink hospitality relief (15%)' }
  if (nation === 'scotland' && rv <= 100_000 && use === 'sco-licensed') sector = { pct: 0.4, label: 'Licensed premises and music venue relief (40%)' }
  if (nation === 'scotland' && rv <= 100_000 && use === 'sco-rhl') sector = { pct: 0.15, label: 'Retail, hospitality and leisure relief (15%)' }
  if (sector && bill > 0) {
    const amount = bill * sector.pct
    lines.push({ label: sector.label, amount })
    bill -= amount
  }

  // England: Supporting Small Business relief caps the rise at the greater of £800 or
  // the transitional cap, measured against the 2025/26 bill after reliefs
  let ssbCap = 0
  if (ssbApplies) {
    ssbCap = opts.lastBill + Math.max(800, opts.lastBill * ENG_TR_CAP(rv, london))
    if (bill > ssbCap) {
      lines.push({ label: 'Supporting Small Business relief', amount: bill - ssbCap })
      bill = ssbCap
    }
  }

  const net = Math.max(0, bill)
  return {
    rv, multiplier: m.rate, multiplierLabel: m.label, gross, trs, chargeable, lines, net,
    tenInstalments: net / 10, twelveInstalments: net / 12,
    effectiveRate: rv > 0 ? net / rv : 0, ssbApplies, ssbCap,
    ruralTooHigh: nation === 'england' && ((special === 'rural-shop' && rv > 8_500) || (special === 'rural-pub' && rv > 12_500)),
  }
}

const inputCls = 'w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring'
const moneyCls = 'w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function BusinessRatesCalculator() {
  const [nation, setNation] = useState<Nation>('england')
  const [use, setUse] = useState<Use>('eng-rhl')
  const [rv, setRv] = useState('14000')
  const [unknownRv, setUnknownRv] = useState(false)
  const [rent, setRent] = useState('15000')
  const [onlyProperty, setOnlyProperty] = useState(true)
  const [special, setSpecial] = useState<Special>('none')
  const [existing, setExisting] = useState(true)
  const [ssb, setSsb] = useState(false)
  const [lastBill, setLastBill] = useState('')
  const [london, setLondon] = useState(false)

  const changeNation = (n: Nation) => {
    setNation(n)
    setUse(USES[n][0].v)
    if (n !== 'england' && special.startsWith('rural')) setSpecial('none')
  }

  const num = (s: string) => parseFloat(s.replace(/,/g, '')) || 0
  // Rateable value is broadly the open-market annual rent at the valuation date
  const v = unknownRv ? num(rent) : num(rv)
  const r = useMemo(() => calculate({ nation, use, rv: v, onlyProperty, special, existing, ssb, lastBill: num(lastBill), london }),
    [nation, use, v, onlyProperty, special, existing, ssb, lastBill, london])
  const valuationDate = nation === 'scotland' ? '1 April 2025' : '1 April 2024'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {(['england', 'wales', 'scotland'] as Nation[]).map((n) => (
          <button key={n} onClick={() => changeNation(n)} className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors ${nation === n ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{n[0].toUpperCase() + n.slice(1)}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="br-rv" className="block text-sm font-medium mb-2">{unknownRv ? 'Annual rent (used as an estimate)' : 'Rateable value'}</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            {unknownRv
              ? <input id="br-rv" type="text" inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} placeholder="15,000" className={moneyCls} aria-label="Annual rent" />
              : <input id="br-rv" type="text" inputMode="numeric" value={rv} onChange={(e) => setRv(e.target.value)} placeholder="14,000" className={moneyCls} aria-label="Rateable value" />}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {nation === 'scotland'
              ? <>Find it on the <a href="https://www.saa.gov.uk/" target="_blank" rel="noopener" className="text-primary hover:underline">Scottish Assessors</a> site.</>
              : <>Find it with the <a href="https://www.gov.uk/find-business-rates" target="_blank" rel="noopener" className="text-primary hover:underline">VOA business rates search</a>.</>}
          </p>
          <label className="flex items-center gap-2 mt-2 cursor-pointer"><input type="checkbox" checked={unknownRv} onChange={(e) => setUnknownRv(e.target.checked)} className="h-4 w-4 rounded border-border" /><span className="text-xs">I don&rsquo;t know it: estimate from my rent</span></label>
        </div>
        <div>
          <label htmlFor="br-use" className="block text-sm font-medium mb-2">What is the property used for?</label>
          <select id="br-use" value={use} onChange={(e) => setUse(e.target.value as Use)} className={inputCls}>
            {USES[nation].map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={onlyProperty} onChange={(e) => setOnlyProperty(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">This is my only business property</span></label>
        <div>
          <label htmlFor="br-special" className="sr-only">Other relief</label>
          <select id="br-special" value={special} onChange={(e) => setSpecial(e.target.value as Special)} className={inputCls}>
            <option value="none">No other relief</option>
            <option value="charity">Charity or community amateur sports club (80%)</option>
            {nation === 'england' && <option value="rural-shop">Only shop or post office in a village under 3,000 people</option>}
            {nation === 'england' && <option value="rural-pub">Only pub or petrol station in a village under 3,000 people</option>}
          </select>
        </div>
      </div>

      {nation === 'england' && (
        <div className="rounded-xl border border-border p-4 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={existing} onChange={(e) => setExisting(e.target.checked)} className="h-5 w-5 mt-0.5 rounded border-border" /><span className="text-sm">The property was already on the rating list before 1 April 2026 <span className="text-muted-foreground">(adds the 1p transitional supplement for 2026/27 unless your bill is capped)</span></span></label>
          <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={ssb} onChange={(e) => setSsb(e.target.checked)} className="h-5 w-5 mt-0.5 rounded border-border" /><span className="text-sm">I lost small business, rural or 40% retail, hospitality and leisure relief on 1 April 2026 <span className="text-muted-foreground">(Supporting Small Business relief)</span></span></label>
          {ssb && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
              <div>
                <label htmlFor="br-last" className="block text-xs font-medium mb-1">My 2025/26 bill after reliefs</label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input id="br-last" type="text" inputMode="numeric" value={lastBill} onChange={(e) => setLastBill(e.target.value)} placeholder="2,500" className={moneyCls} aria-label="2025/26 bill after reliefs" /></div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer self-end pb-3"><input type="checkbox" checked={london} onChange={(e) => setLondon(e.target.checked)} className="h-4 w-4 rounded border-border" /><span className="text-xs">Property is in London</span></label>
            </div>
          )}
        </div>
      )}

      {v > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Business rates for 2026/27</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(r.net)}</p>
            <p className="text-sm text-muted-foreground mt-1">10 monthly payments of {formatCurrency(r.tenInstalments)}, or 12 of {formatCurrency(r.twelveInstalments)} if you ask your council</p>
            {r.net === 0 && <p className="text-sm text-green-700 dark:text-green-400 mt-1">Your reliefs cover the whole bill.</p>}
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Rateable value{unknownRv ? ' (estimated from rent)' : ''}</td><td className="text-right tabular-nums">{formatCurrency(r.rv)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">{r.multiplierLabel}</td><td className="text-right tabular-nums">{(r.multiplier * 100).toFixed(1)}p in £1</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Gross rates</td><td className="text-right tabular-nums">{formatCurrency(r.gross)}</td></tr>
              {r.trs > 0 && <tr className="border-b border-border/50"><td className="py-2">Transitional supplement (1p)</td><td className="text-right tabular-nums">+{formatCurrency(r.trs)}</td></tr>}
              {r.lines.map((l) => <tr key={l.label} className="border-b border-border/50"><td className="py-2 text-green-700 dark:text-green-400">{l.label}</td><td className="text-right tabular-nums text-green-700 dark:text-green-400">-{formatCurrency(l.amount)}</td></tr>)}
              <tr className="font-semibold"><td className="py-2">You pay</td><td className="text-right tabular-nums text-primary">{formatCurrency(r.net)}</td></tr>
            </tbody>
          </table>
          {r.ruralTooHigh && <p className="text-xs text-muted-foreground">Rural rate relief needs a rateable value up to £8,500 for a shop or post office, or £12,500 for a pub or petrol station, so it does not apply here.</p>}
          {r.ssbApplies && <p className="text-xs text-muted-foreground">Supporting Small Business relief limits your 2026/27 bill to {formatCurrency(r.ssbCap)}: last year&rsquo;s bill plus the larger of £800 or the transitional cap.</p>}
          <p className="text-xs text-muted-foreground">
            {unknownRv && <>Rateable value is roughly the open-market yearly rent on {valuationDate}, so an estimate from today&rsquo;s rent can be out either way. </>}
            {nation === 'england' && 'If your rateable value rose at the 2026 revaluation, transitional relief can cap the increase (5%, 15% or 30% in 2026/27 depending on size); your council applies it automatically. '}
            {nation === 'wales' && 'If your bill rose by more than £300 at the revaluation, Welsh transitional relief means you pay a third of the increase in 2026/27. '}
            {nation === 'scotland' && 'Transitional relief caps increases from the 2026 revaluation (15%, 30% or 50% in 2026/27 depending on size), and councils apply reliefs in their own order, so check your bill. '}
            Small business relief assumes one property; businesses with more than one should check the rules for their nation.
          </p>
        </div>
      )}
    </div>
  )
}
