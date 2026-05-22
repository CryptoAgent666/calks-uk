import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Maintenance loan 2026/27 (England)
const RATES = {
  home_parents: { min: 4_767, max: 8_490 },
  home_away: { min: 4_767, max: 10_544 },
  london: { min: 4_767, max: 13_762 },
}

type LivingSituation = 'home_parents' | 'home_away' | 'london'

function calculate(householdIncome: number, living: LivingSituation) {
  const { min, max } = RATES[living]

  // Simplified taper: full loan up to £25,000, reduces to min at ~£62,000+
  let loan: number
  if (householdIncome <= 25_000) loan = max
  else if (householdIncome >= 62_875) loan = min
  else {
    const taper = (householdIncome - 25_000) * ((max - min) / (62_875 - 25_000))
    loan = max - taper
  }

  const termlyLoan = loan / 3
  const weeklyLoan = loan / 39 // ~39 weeks

  return { loan, termlyLoan, weeklyLoan, min, max }
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
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Minimum Loan</p><p className="text-lg font-bold">{formatCurrency(result.min)}</p><p className="text-xs text-muted-foreground">Income over £62K</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>England rates 2026/27. Scotland, Wales and NI have different rates. Loan reduces as household income rises above £25,000. Apply via Student Finance England.</p>
        </div>
      </div>
    </div>
  )
}
