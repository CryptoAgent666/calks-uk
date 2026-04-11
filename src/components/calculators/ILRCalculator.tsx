import { useState, useMemo } from 'react'

type Route = 'work' | 'spouse' | 'parent' | 'longres'
const ROUTES: Record<Route, { name: string; yearsRequired: number; fee: number; description: string }> = {
  work: { name: 'Skilled Worker', yearsRequired: 5, fee: 2885, description: '5 years on Skilled Worker visa (or 3 years if earning £45,300+)' },
  spouse: { name: 'Spouse / Partner', yearsRequired: 5, fee: 2885, description: '5 years as spouse/partner (or 2 years if partner is settled)' },
  parent: { name: 'Parent', yearsRequired: 5, fee: 2885, description: '5 years on parent route' },
  longres: { name: 'Long Residence (10 years)', yearsRequired: 10, fee: 2885, description: '10 years continuous lawful residence in the UK' },
}

function calculate(route: Route, entryDate: string, absenceDays: number) {
  if (!entryDate) return null
  const entry = new Date(entryDate)
  const now = new Date()
  const info = ROUTES[route]

  const daysInUK = Math.floor((now.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24)) - absenceDays
  const yearsInUK = daysInUK / 365.25
  const yearsRemaining = Math.max(0, info.yearsRequired - yearsInUK)
  const eligible = yearsRemaining <= 0

  const eligibleDate = new Date(entry)
  eligibleDate.setDate(eligibleDate.getDate() + info.yearsRequired * 365 + absenceDays)

  const maxAbsence = route === 'longres' ? 548 : 450 // 18 months for 10yr, ~15 months for 5yr
  const absenceOk = absenceDays <= maxAbsence

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return { eligible, yearsInUK, yearsRemaining, eligibleDate: fmt(eligibleDate), fee: info.fee, absenceOk, maxAbsence, info }
}

export default function ILRCalculator() {
  const [route, setRoute] = useState<Route>('work')
  const [entry, setEntry] = useState('')
  const [absence, setAbsence] = useState('30')

  const result = useMemo(() => calculate(route, entry, parseInt(absence) || 0), [route, entry, absence])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">ILR Route</label><select value={route} onChange={(e) => setRoute(e.target.value as Route)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring">{Object.entries(ROUTES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">UK Entry Date</label><input type="date" value={entry} onChange={(e) => setEntry(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Total Days Absent</label><input type="number" min="0" max="1000" value={absence} onChange={(e) => setAbsence(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
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
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">ILR Fee</p><p className="text-lg font-bold">£{result.fee.toLocaleString()}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.absenceOk ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Absence Limit</p><p className={`text-lg font-bold ${result.absenceOk ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{parseInt(absence)}/{result.maxAbsence} days</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground"><p>{result.info.description}</p></div>
        </div>
      )}
    </div>
  )
}
