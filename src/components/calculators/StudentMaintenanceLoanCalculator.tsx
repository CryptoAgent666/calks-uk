import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Maintenance loan 2026/27 (England), dependent full-year student not entitled
// to benefits. Source: gov.uk "Student finance: how you're assessed and paid
// 2026 to 2027". Above £25,000 the loan is cut by £1 for every `taperPer` of
// household income, until a fixed basic rate is left — that floor is a
// percentage of the maximum (49.8% London, 46.6% elsewhere, 44% at home) and
// is reached at a different income for each living situation.
const FULL_AWARD_CEILING = 25_000
const RATES = {
  home_parents: { max: 9_118, taperPer: 6.54, min: 4_013, minFrom: 58_347 },
  home_away: { max: 10_830, taperPer: 6.47, min: 5_048, minFrom: 62_410 },
  london: { max: 14_135, taperPer: 6.36, min: 7_039, minFrom: 70_131 },
}

type LivingSituation = 'home_parents' | 'home_away' | 'london'

function calculate(householdIncome: number, living: LivingSituation) {
  const { min, max, taperPer, minFrom } = RATES[living]

  // The published tables round the income assessment down to whole pounds;
  // doing the same here reproduces them exactly.
  let loan: number
  if (householdIncome <= FULL_AWARD_CEILING) loan = max
  else {
    const assessment = Math.floor((householdIncome - FULL_AWARD_CEILING) / taperPer)
    loan = Math.max(min, max - assessment)
  }

  const termlyLoan = loan / 3
  const weeklyLoan = loan / 39 // ~39 weeks

  return { loan, termlyLoan, weeklyLoan, min, max, minFrom }
}

export default function StudentMaintenanceLoanCalculator() {
  const [income, setIncome] = useState('40000')
  const [living, setLiving] = useState<LivingSituation>('home_away')

  const i = parseFloat(income.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(i, living), [i, living])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Household Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Household Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Living Situation</label><select value={living} onChange={(e) => setLiving(e.target.value as LivingSituation)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Living Situation"><option value="home_parents">Living with Parents</option><option value="home_away">Away from Home</option><option value="london">London</option></select></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Maintenance Loan</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.loan)}/year</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.termlyLoan)}/term &middot; {formatCurrency(result.weeklyLoan)}/week</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Maximum Loan</p><p className="text-lg font-bold">{formatCurrency(result.max)}</p><p className="text-xs text-muted-foreground">Income under £25K</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Minimum Loan</p><p className="text-lg font-bold">{formatCurrency(result.min)}</p><p className="text-xs text-muted-foreground">Income over {formatCurrency(result.minFrom)}</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>England rates 2026/27, for a dependent full-year student who is not entitled to benefits. Scotland, Wales and NI have different rates. Above £25,000 the loan falls by £1 for roughly every £6.36 to £6.54 of household income, then stops falling at the basic rate shown. Final-year students and students entitled to benefits are assessed on different figures. Apply via Student Finance England.</p>
        </div>
      </div>
    </div>
  )
}
