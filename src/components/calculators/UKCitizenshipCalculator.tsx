import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Naturalisation fees from 8 April 2026, unchanged on the 8 October 2026 table (Home Office
// fees table) and residence rules (gov.uk).
// Standard route: 5 years in the UK, ILR held for 12 months, no more than 450 days outside the
// UK in those 5 years and 90 in the last 12 months.
// Married to a British citizen: 3 years in the UK, ILR held (no 12-month wait), no more than 270
// days outside the UK in those 3 years and 90 in the last 12 months.
// Both routes also need the Life in the UK test and English at B1 or above, and presence in the
// UK exactly 5 (or 3) years before the Home Office receives the application. The Home Office decides.
const CITIZENSHIP_FEE = 1_709
const CEREMONY_FEE = 130
const LIFE_IN_UK_TEST = 50
// English test fees are set by each approved SELT provider, so none is added to the total.
const MAX_ABSENCE_LAST_12M = 90
const DAY_MS = 1000 * 60 * 60 * 24

type Route = 'standard' | 'spouse'
const ROUTES: Record<Route, { label: string; years: number; maxAbsence: number; ilrWaitMonths: number }> = {
  standard: { label: 'Standard (5 years, ILR for 12 months)', years: 5, maxAbsence: 450, ilrWaitMonths: 12 },
  spouse: { label: 'Married to a British citizen (3 years)', years: 3, maxAbsence: 270, ilrWaitMonths: 0 },
}

// Reads 'YYYY-MM-DD' as a local calendar date (new Date('YYYY-MM-DD') is UTC midnight, which
// shows the day before in time zones west of UTC).
export function parseLocalDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return null
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

export function calculate(route: Route, ilrDate: string, absenceDays: number, absenceLast12: number, hasLifeInUK: boolean, hasEnglish: boolean, today: Date = new Date()) {
  const rules = ROUTES[route]
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  let eligibleDate = ''
  let daysUntil = 0
  let waitOver = false

  const ilr = parseLocalDate(ilrDate)
  if (ilr) {
    const eligDate = new Date(ilr.getFullYear(), ilr.getMonth() + rules.ilrWaitMonths, ilr.getDate())
    waitOver = todayStart >= eligDate
    eligibleDate = eligDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    daysUntil = Math.max(0, Math.round((eligDate.getTime() - todayStart.getTime()) / DAY_MS))
  }

  const absenceOk = absenceDays <= rules.maxAbsence && absenceLast12 <= MAX_ABSENCE_LAST_12M
  const blockers: string[] = []
  if (!absenceOk) blockers.push('your absences are over a limit')
  if (!hasLifeInUK) blockers.push('you need to pass the Life in the UK test')
  if (!hasEnglish) blockers.push('you need to meet the English requirement (B1 or above)')
  const eligible = !!ilr && waitOver && blockers.length === 0
  const totalCost = CITIZENSHIP_FEE + CEREMONY_FEE + (hasLifeInUK ? 0 : LIFE_IN_UK_TEST)

  return { eligible, waitOver, eligibleDate, daysUntil, totalCost, absenceOk, blockers, rules }
}

export default function UKCitizenshipCalculator() {
  const [route, setRoute] = useState<Route>('standard')
  const [ilrDate, setIlrDate] = useState('')
  const [absence, setAbsence] = useState('30')
  const [absence12, setAbsence12] = useState('10')
  const [lifeInUK, setLifeInUK] = useState(true)
  const [english, setEnglish] = useState(true)

  const a = parseInt(absence) || 0
  const a12 = parseInt(absence12) || 0
  const result = useMemo(() => calculate(route, ilrDate, a, a12, lifeInUK, english), [route, ilrDate, a, a12, lifeInUK, english])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Route</label><select value={route} onChange={(e) => setRoute(e.target.value as Route)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Route">{Object.entries(ROUTES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">ILR Granted Date</label><input type="date" value={ilrDate} onChange={(e) => setIlrDate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="ILR Granted Date" /></div>
        <div><label className="block text-sm font-medium mb-2">Days Absent (last {result.rules.years} years)</label><input type="number" min="0" max="1825" value={absence} onChange={(e) => setAbsence(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Days Absent in Qualifying Period" /><p className="text-xs text-muted-foreground mt-1">Max {result.rules.maxAbsence} days in {result.rules.years} years</p></div>
        <div><label className="block text-sm font-medium mb-2">Days Absent (last 12 months)</label><input type="number" min="0" max="366" value={absence12} onChange={(e) => setAbsence12(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Days Absent in Last 12 Months" /><p className="text-xs text-muted-foreground mt-1">Max {MAX_ABSENCE_LAST_12M} days</p></div>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={lifeInUK} onChange={(e) => setLifeInUK(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Passed Life in the UK test</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={english} onChange={(e) => setEnglish(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Meet English language requirement (B1+)</span></label>
      </div>

      {ilrDate && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.eligible ? 'bg-green-100 dark:bg-green-950' : 'bg-primary/10'}`}>
            {result.eligible ? (
              <><p className="text-lg font-bold text-green-700 dark:text-green-400">You may be eligible to apply</p><p className="text-sm text-muted-foreground mt-1">On the ILR rule from: {result.eligibleDate}. The Home Office decides.</p></>
            ) : result.waitOver ? (
              <><p className="text-lg font-bold text-primary">Not yet eligible</p><p className="text-sm text-muted-foreground mt-1">The ILR wait is over, but {result.blockers.join(', and ')}.</p></>
            ) : (
              <><p className="text-sm text-muted-foreground">Earliest Date on the ILR Rule</p><p className="text-2xl font-bold text-primary mt-1">{result.eligibleDate}</p>{result.daysUntil > 0 && <p className="text-sm text-muted-foreground mt-1">{result.daysUntil} days remaining</p>}{result.blockers.length > 0 && <p className="text-sm text-muted-foreground mt-1">Before then, {result.blockers.join(', and ')}.</p>}</>
            )}
          </div>

          <div className="rounded-2xl bg-muted/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Cost</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(result.totalCost)}</p>
            {!english && <p className="text-sm text-muted-foreground mt-1">plus the English test fee, set by the test provider</p>}
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Citizenship Application</td><td className="text-right tabular-nums">{formatCurrency(CITIZENSHIP_FEE)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Citizenship Ceremony</td><td className="text-right tabular-nums">{formatCurrency(CEREMONY_FEE)}</td></tr>
              {!lifeInUK && <tr className="border-b border-border/50"><td className="py-2">Life in the UK Test</td><td className="text-right tabular-nums">{formatCurrency(LIFE_IN_UK_TEST)}</td></tr>}
              {!english && <tr className="border-b border-border/50"><td className="py-2">English Test (B1, approved SELT)</td><td className="text-right">set by provider</td></tr>}
            </tbody>
          </table>

          <div className={`rounded-xl p-3 text-center text-sm ${result.absenceOk ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400' : 'bg-destructive/10 text-destructive'}`}>
            Absence: {a} / {result.rules.maxAbsence} days in {result.rules.years} years, {a12} / {MAX_ABSENCE_LAST_12M} in the last 12 months {result.absenceOk ? '(within limits)' : '(exceeds a limit)'}
          </div>
          <p className="text-xs text-muted-foreground">You must also have been in the UK exactly {result.rules.years} years before the day the Home Office receives your application, and meet the good character rules. This calculator cannot check those; the Home Office decides.</p>
        </div>
      )}
    </div>
  )
}
