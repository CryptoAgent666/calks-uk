import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const DOUBLING_PERIODS = [10, 15, 20, 25, 33]
// Housing Act 1988 Sch 1 paras 3A-3B: a long lease with a ground rent above these amounts can be
// an assured tenancy if the flat is the leaseholder's only or main home.
const ASSURED_RENT_LIMIT = 250
const ASSURED_RENT_LIMIT_LONDON = 1000
const MAX_TABLE_ROWS = 30

type Band = { from: number; to: number; startRent: number; endRent: number; total: number; cumulative: number }

function calculate(currentRent: number, escalation: string, escalationRate: number, doublingPeriod: number, yearsRemaining: number, london: boolean) {
  const years = Math.max(0, Math.floor(yearsRemaining))
  const limit = london ? ASSURED_RENT_LIMIT_LONDON : ASSURED_RENT_LIMIT
  // Rows group the years between rent changes (doubling), the whole term (fixed) or 10-year blocks
  const bandLength = escalation === 'doubling' ? doublingPeriod : escalation === 'fixed' ? Math.max(years, 1) : 10

  const bands: Band[] = []
  let rent = currentRent
  let cumulative = 0
  let firstYearOverLimit = 0
  let bandStart = 1
  let bandStartRent = rent
  let bandTotal = 0
  let finalRent = rent

  for (let y = 1; y <= years; y++) {
    if (!firstYearOverLimit && rent > limit) firstYearOverLimit = y
    bandTotal += rent
    cumulative += rent
    finalRent = rent
    if (y - bandStart + 1 === bandLength || y === years) {
      bands.push({ from: bandStart, to: y, startRent: bandStartRent, endRent: rent, total: bandTotal, cumulative })
    }
    // Escalation applies from the following year
    if (escalation === 'doubling' && y % doublingPeriod === 0) rent *= 2
    else if (escalation === 'rpi' || escalation === 'percentage') rent *= 1 + escalationRate / 100
    if (y - bandStart + 1 === bandLength) {
      bandStart = y + 1
      bandStartRent = rent
      bandTotal = 0
    }
  }

  const average = years > 0 ? cumulative / years : 0
  const overLimitNow = currentRent > limit
  const isDoubling = escalation === 'doubling'

  return { bands, total: cumulative, average, finalRent, years, limit, overLimitNow, firstYearOverLimit, isDoubling }
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function GroundRentCalculator() {
  const [rent, setRent] = useState('300')
  const [escalation, setEscalation] = useState('doubling')
  const [period, setPeriod] = useState('25')
  const [rate, setRate] = useState('3')
  const [years, setYears] = useState('90')
  const [london, setLondon] = useState(false)

  const r = parseFloat(rent) || 0
  const rt = parseFloat(rate) || 0
  const p = parseInt(period) || 25
  const y = Math.min(parseInt(years) || 0, 999)
  const result = useMemo(() => calculate(r, escalation, rt, p, y, london), [r, escalation, rt, p, y, london])
  const shownBands = result.bands.slice(0, MAX_TABLE_ROWS)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Current ground rent (£ a year)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={rent} onChange={(e) => setRent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Current ground rent (£ a year)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Escalation</label><select value={escalation} onChange={(e) => setEscalation(e.target.value)} className={inputClass} aria-label="Escalation"><option value="fixed">Fixed (no increase)</option><option value="doubling">Doubling</option><option value="rpi">RPI-linked (assumed rate)</option><option value="percentage">Fixed % increase a year</option></select></div>
        {escalation === 'doubling' && <div><label className="block text-sm font-medium mb-2">Doubles every</label><select value={period} onChange={(e) => setPeriod(e.target.value)} className={inputClass} aria-label="Doubling period (years)">{DOUBLING_PERIODS.map(d => <option key={d} value={d}>{d} years</option>)}</select></div>}
        {(escalation === 'rpi' || escalation === 'percentage') && <div><label className="block text-sm font-medium mb-2">{escalation === 'rpi' ? 'Assumed RPI (% a year)' : 'Annual increase (%)'}</label><input type="number" min="0" max="10" step="0.5" value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass} aria-label={escalation === 'rpi' ? 'Assumed RPI (% a year)' : 'Annual increase (%)'} /></div>}
        <div><label className="block text-sm font-medium mb-2">Years left on the lease</label><input type="number" min="1" max="999" value={years} onChange={(e) => setYears(e.target.value)} className={inputClass} aria-label="Years left on the lease" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={london} onChange={(e) => setLondon(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label="Flat is in Greater London" /><span className="text-sm">Flat is in Greater London (£1,000 assured tenancy limit instead of £250)</span></label>

      {(result.overLimitNow || result.firstYearOverLimit > 0 || result.isDoubling) && (
        <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-sm text-orange-800 dark:text-orange-300 space-y-1">
          {result.overLimitNow && <p>This ground rent is above {formatCurrency(result.limit)} a year{london ? ' (Greater London)' : ' (outside Greater London)'}. If the flat is your only or main home, the lease can count as an assured tenancy under the Housing Act 1988, which gives the freeholder stronger possession rights if the ground rent falls into arrears.</p>}
          {!result.overLimitNow && result.firstYearOverLimit > 0 && <p>On this escalation the rent passes {formatCurrency(result.limit)} a year in year {result.firstYearOverLimit}, the level at which the lease can count as an assured tenancy under the Housing Act 1988.</p>}
          {result.isDoubling && <p>Doubling clauses are the escalation most often treated as onerous by lenders and buyers, and can make a flat hard to mortgage or sell.</p>}
        </div>
      )}

      {result.years > 0 && result.bands.length > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total ground rent over the remaining {result.years} years</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(Math.round(result.total))}</p>
            <p className="text-sm text-muted-foreground mt-1">Average {formatCurrency(Math.round(result.average * 100) / 100)} a year &middot; {formatCurrency(Math.round(result.finalRent))} in the final year</p>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Years</th><th className="text-right py-2 font-medium text-muted-foreground">Annual rent</th><th className="text-right py-2 font-medium text-muted-foreground">Paid in period</th><th className="text-right py-2 font-medium text-muted-foreground">Cumulative</th></tr></thead>
            <tbody>{shownBands.map(b => (
              <tr key={b.from} className="border-b border-border/50"><td className="py-1.5">{b.from === b.to ? b.from : `${b.from}-${b.to}`}</td><td className="text-right tabular-nums">{Math.round(b.startRent) === Math.round(b.endRent) ? formatCurrency(Math.round(b.startRent)) : `${formatCurrency(Math.round(b.startRent))} → ${formatCurrency(Math.round(b.endRent))}`}</td><td className="text-right tabular-nums">{formatCurrency(Math.round(b.total))}</td><td className="text-right tabular-nums">{formatCurrency(Math.round(b.cumulative))}</td></tr>
            ))}</tbody>
          </table>
          {result.bands.length > MAX_TABLE_ROWS && <p className="text-xs text-muted-foreground">The table shows the first {MAX_TABLE_ROWS} periods; the total covers all {result.years} years.</p>}
        </div>
      )}
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>Since 30 June 2022 most new long residential leases in England and Wales must have a peppercorn (zero) ground rent under the Leasehold Reform (Ground Rent) Act 2022; for retirement homes the rule applied from 1 April 2023. Existing leases keep their ground rent. A statutory lease extension reduces the ground rent to a peppercorn. The government proposed in January 2026 to cap ground rent on existing leases at £250 a year, moving to a peppercorn after 40 years, but that cap is not yet law.</p>
      </div>
    </div>
  )
}
