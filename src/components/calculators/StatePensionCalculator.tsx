import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// 2026/27 (triple lock uprating)
const FULL_NEW_STATE_PENSION_WEEKLY = 241.30
const QUALIFYING_YEARS_FULL = 35
const QUALIFYING_YEARS_MIN = 10

function calculate(qualifyingYears: number, dob: string) {
  const years = Math.min(qualifyingYears, QUALIFYING_YEARS_FULL)
  const weeklyPension = years >= QUALIFYING_YEARS_MIN
    ? (years / QUALIFYING_YEARS_FULL) * FULL_NEW_STATE_PENSION_WEEKLY
    : 0
  const monthlyPension = weeklyPension * 52 / 12
  const annualPension = weeklyPension * 52

  // State Pension Age (simplified)
  let pensionAge = 67
  if (dob) {
    const birthYear = new Date(dob).getFullYear()
    if (birthYear >= 1978) pensionAge = 68
    else if (birthYear >= 1960) pensionAge = 67
    else pensionAge = 66
  }

  const yearsNeeded = QUALIFYING_YEARS_FULL - years

  return { weeklyPension, monthlyPension, annualPension, pensionAge, yearsNeeded, percentFull: (years / QUALIFYING_YEARS_FULL) * 100 }
}

export default function StatePensionCalculator() {
  const [years, setYears] = useState('25')
  const [dob, setDob] = useState('')

  const y = parseInt(years) || 0
  const result = useMemo(() => calculate(y, dob), [y, dob])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Qualifying NI Years</label>
          <input type="number" min="0" max="50" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Qualifying NI Years" />
          <p className="text-xs text-muted-foreground mt-1">Check your record at gov.uk/check-state-pension</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Date of Birth (for pension age)</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Date of Birth (for pension age)" />
        </div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Weekly State Pension</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.weeklyPension)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyPension)}/month &middot; {formatCurrency(result.annualPension)}/year</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">% of Full Pension</p><p className="text-lg font-bold">{result.percentFull.toFixed(0)}%</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Full Pension</p><p className="text-lg font-bold">{formatCurrency(FULL_NEW_STATE_PENSION_WEEKLY)}/wk</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Years Still Needed</p><p className="text-lg font-bold">{Math.max(0, result.yearsNeeded)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Pension Age</p><p className="text-lg font-bold">{result.pensionAge}</p></div>
        </div>

        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
          <p>Full new State Pension: <span className="font-medium text-foreground">£{FULL_NEW_STATE_PENSION_WEEKLY}/week</span> (35 qualifying years needed)</p>
          <p>Minimum: <span className="font-medium text-foreground">10 qualifying years</span> to get any State Pension</p>
          <p>You can buy voluntary NI contributions to fill gaps in your record.</p>
        </div>
      </div>
    </div>
  )
}
