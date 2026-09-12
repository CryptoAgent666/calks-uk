import { useState, useMemo } from 'react'

// Indefinite Leave to Remain, Immigration Rules as at September 2026.
// Qualifying periods: Skilled Worker 5 years (SW 21.1), partner and parent 5 years,
// long residence 10 years. Continuous residence (Appendix Continuous Residence CR 3.1):
// no more than 180 days outside the UK in any 12-month period. The old long residence
// limits (548 days in total, 184 in one go) apply only where the 548 days were reached,
// or the absence began, before 11 April 2024.
const ILR_FEE = 3_226 // Home Office fee from 8 April 2026
const MAX_ABSENCE_12M = 180

type Route = 'work' | 'spouse' | 'parent' | 'longres'
const ROUTES: Record<Route, { name: string; yearsRequired: number; description: string }> = {
  work: { name: 'Skilled Worker', yearsRequired: 5, description: '5 years of continuous residence on the Skilled Worker route. There is no shorter salary-based route to settlement.' },
  spouse: { name: 'Spouse / Partner', yearsRequired: 5, description: '5 years of continuous residence as a partner on the family route.' },
  parent: { name: 'Parent', yearsRequired: 5, description: '5 years on the parent route' },
  longres: { name: 'Long Residence (10 years)', yearsRequired: 10, description: '10 years of continuous lawful residence in the UK, with no gaps in valid leave.' },
}

function calculate(route: Route, entryDate: string, maxAbsence: number) {
  if (!entryDate) return null
  const entry = new Date(entryDate)
  const now = new Date()
  const info = ROUTES[route]

  const yearsInUK = (now.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  const yearsRemaining = Math.max(0, info.yearsRequired - yearsInUK)

  // Absences within the limit do not delay the date; one over it breaks continuity.
  const eligibleDate = new Date(entry)
  eligibleDate.setFullYear(eligibleDate.getFullYear() + info.yearsRequired)
  const absenceOk = maxAbsence <= MAX_ABSENCE_12M
  const eligible = now >= eligibleDate && absenceOk

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return { eligible, yearsInUK, yearsRemaining, eligibleDate: fmt(eligibleDate), absenceOk, info }
}

export default function ILRCalculator() {
  const [route, setRoute] = useState<Route>('work')
  const [entry, setEntry] = useState('')
  const [absence, setAbsence] = useState('30')

  const absenceDays = parseInt(absence) || 0
  const result = useMemo(() => calculate(route, entry, absenceDays), [route, entry, absenceDays])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">ILR Route</label><select value={route} onChange={(e) => setRoute(e.target.value as Route)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="ILR Route">{Object.entries(ROUTES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">UK Entry Date</label><input type="date" value={entry} onChange={(e) => setEntry(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="UK Entry Date" /></div>
        <div><label className="block text-sm font-medium mb-2">Most Days Absent in Any 12 Months</label><input type="number" min="0" max="366" value={absence} onChange={(e) => setAbsence(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Most Days Absent in Any 12 Months" /></div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.eligible ? 'bg-green-100 dark:bg-green-950' : 'bg-primary/10'}`}>
            {result.eligible ? (
              <><p className="text-lg font-bold text-green-700 dark:text-green-400">You may be eligible for ILR!</p><p className="text-sm text-muted-foreground mt-1">{result.yearsInUK.toFixed(1)} years in the UK</p></>
            ) : (
              <><p className="text-sm text-muted-foreground">Earliest ILR Eligible Date</p><p className="text-2xl font-bold text-primary mt-1">{result.eligibleDate}</p><p className="text-sm text-muted-foreground mt-1">{result.yearsRemaining.toFixed(1)} years remaining</p></>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Required</p><p className="text-lg font-bold">{result.info.yearsRequired} years</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">ILR Fee</p><p className="text-lg font-bold">£{ILR_FEE.toLocaleString()}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.absenceOk ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Absence Limit (any 12 months)</p><p className={`text-lg font-bold ${result.absenceOk ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{absenceDays}/{MAX_ABSENCE_12M} days</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>{result.info.description}</p>
            {!result.absenceOk && <p className="mt-1 text-destructive">More than {MAX_ABSENCE_12M} days outside the UK in a 12-month period normally breaks continuous residence, which restarts the qualifying period.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
