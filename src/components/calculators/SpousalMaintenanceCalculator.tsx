import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type Jurisdiction = 'ew' | 'scotland'

// Rules of thumb only. Neither England and Wales (Matrimonial Causes Act 1973
// s.25/25A) nor Scotland sets a formula for spousal maintenance: the shares of the
// income gap and the "half the marriage" term below are illustrative heuristics.
const SHARE_LOW = 0.20
const SHARE_MID = 0.25
const SHARE_HIGH = 0.33
// Family Law (Scotland) Act 1985 s.9(1)(d): support for a financially dependent
// spouse to adjust to the loss of support runs for no more than 3 years from divorce.
const SCOTLAND_DEPENDENCY_CAP = 3

const parseAmount = (v: string) => Math.max(0, parseFloat(v.replace(/[,£\s]/g, '')) || 0)

function calculate(higherIncome: number, lowerIncome: number, yearsMarried: number, jurisdiction: Jurisdiction, youngestAge: number | null) {
  const incomeDiff = Math.max(0, higherIncome - lowerIncome)
  const low = incomeDiff * SHARE_LOW
  const mid = incomeDiff * SHARE_MID
  const high = incomeDiff * SHARE_HIGH

  // Rule-of-thumb term: half the length of the marriage, rounded up. No rule in
  // law ties the term to the length of the marriage.
  const halfMarriage = Math.ceil(yearsMarried / 2)
  const capped = jurisdiction === 'scotland' && halfMarriage > SCOTLAND_DEPENDENCY_CAP
  const duration = jurisdiction === 'scotland' ? Math.min(halfMarriage, SCOTLAND_DEPENDENCY_CAP) : halfMarriage
  const yearsToYoungest18 = youngestAge === null ? null : Math.max(0, 18 - youngestAge)

  return { low, mid, high, duration, capped, yearsToYoungest18, monthlyLow: low / 12, monthlyMid: mid / 12, monthlyHigh: high / 12, incomeDiff }
}

export default function SpousalMaintenanceCalculator() {
  const [higher, setHigher] = useState('60000')
  const [lower, setLower] = useState('20000')
  const [years, setYears] = useState('10')
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('ew')
  const [children, setChildren] = useState(true)
  const [youngest, setYoungest] = useState('8')

  const h = parseAmount(higher)
  const l = parseAmount(lower)
  const y = Math.max(0, parseInt(years) || 0)
  const ya = youngest.trim() === '' ? null : Math.min(25, Math.max(0, parseInt(youngest) || 0))
  const result = useMemo(() => calculate(h, l, y, jurisdiction, children ? ya : null), [h, l, y, jurisdiction, children, ya])

  const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'
  const moneyClass = 'w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Higher Earner Net Income (a year)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={higher} onChange={(e) => setHigher(e.target.value)} className={moneyClass} aria-label="Higher Earner Net Income (a year)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Lower Earner Net Income (a year)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={lower} onChange={(e) => setLower(e.target.value)} className={moneyClass} aria-label="Lower Earner Net Income (a year)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years Married</label><input type="number" min="0" max="60" value={years} onChange={(e) => setYears(e.target.value)} className={inputClass} aria-label="Years Married" /></div>
        <div><label className="block text-sm font-medium mb-2">Where the divorce is</label><select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)} className={inputClass} aria-label="Where the divorce is"><option value="ew">England &amp; Wales</option><option value="scotland">Scotland</option></select></div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={children} onChange={(e) => setChildren(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Dependent children</span></label>
        {children && (
          <div className="flex items-center gap-2"><label htmlFor="sm-youngest" className="text-sm">Youngest child&apos;s age</label><input id="sm-youngest" type="number" min="0" max="25" value={youngest} onChange={(e) => setYoungest(e.target.value)} className="w-20 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">Use net income (after tax and National Insurance) if you can: courts look at what each of you actually has coming in, set against reasonable needs.</p>

      {h > 0 && l >= h && (
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">The lower earner&apos;s income is the same as or above the higher earner&apos;s, so there is no income gap to share. Swap the figures if they are the wrong way round.</div>
      )}

      {h > 0 && result.incomeDiff > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Rule-of-thumb monthly range (not a legal formula)</p>
            <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(result.monthlyLow)} to {formatCurrency(result.monthlyHigh)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {y > 0
                ? <>Rule-of-thumb term: about {result.duration} {result.duration === 1 ? 'year' : 'years'}{jurisdiction === 'scotland' ? (result.capped ? ' (capped at 3 years in Scotland)' : ' (3 years at most in Scotland)') : ' (half the length of the marriage)'}</>
                : 'Enter the length of the marriage to see a rule-of-thumb term'}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border p-4 text-center"><p className="text-xs text-muted-foreground">20% of the gap</p><p className="text-lg font-bold">{formatCurrency(result.low)}/yr</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">25% of the gap</p><p className="text-lg font-bold">{formatCurrency(result.mid)}/yr</p></div>
            <div className="rounded-xl border border-border p-4 text-center"><p className="text-xs text-muted-foreground">33% of the gap</p><p className="text-lg font-bold">{formatCurrency(result.high)}/yr</p></div>
          </div>
          {children && result.yearsToYoungest18 !== null && (
            <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
              <p>Child maintenance usually comes first, worked out by agreement or through the Child Maintenance Service, and spousal maintenance is considered from what is left.</p>
              <p>Your youngest child turns 18 in {result.yearsToYoungest18} {result.yearsToYoungest18 === 1 ? 'year' : 'years'}. Where caring for children limits the receiving parent&apos;s earning capacity, a court may set a longer term than the rule of thumb{jurisdiction === 'scotland' ? '; in Scotland the economic burden of caring for a child under 16 is a separate ground for support' : ''}.</p>
            </div>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>{jurisdiction === 'scotland'
              ? 'Scotland has no formula either. Under section 9(1)(d) of the Family Law (Scotland) Act 1985, support for a spouse who was financially dependent runs for no more than three years from divorce; longer awards need serious financial hardship.'
              : 'England & Wales has no formula for spousal maintenance. Under section 25 of the Matrimonial Causes Act 1973 courts weigh income and earning capacity, needs, the standard of living, ages, the length of the marriage and childcare, and must consider a clean break. There is no rule tying the term to the length of the marriage.'} The 20%, 25% and 33% shares of the income gap and the half-the-marriage term are rules of thumb, not law. This is a rough guide only, so seek legal advice.</p>
          </div>
        </div>
      )}
    </div>
  )
}
