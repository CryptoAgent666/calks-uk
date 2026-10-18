import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Tribunal limits 2026/27 (effective 6 April 2026, Employment Rights (Increase of Limits) Order 2026, SI 2026/310)
const WEEKLY_PAY_CAP = 751 // £751/week from 6 April 2026
const BASIC_AWARD_MAX = WEEKLY_PAY_CAP * 30 // max 30 weeks x cap
const COMPENSATORY_AWARD_CAP = 123_543 // uprated for 2026/27 from 6 April 2026 (was £118,223 in 2025/26)
const COMPENSATORY_WEEKS_CAP = 52 // ERA 1996 s.124(1ZA): the award is capped at the lower of the money cap and 52 weeks' gross pay
const LOSS_OF_STATUTORY_RIGHTS = 500 // conventional sum for losing the protection that came with 2 years' service
const QUALIFYING_YEARS = 2 // ordinary unfair dismissal; 6 months for dismissals from 1 January 2027 (Employment Rights Act 2025, SI 2026/559)

type CapApplied = 'none' | 'weeks' | 'money'

function calculate(weeklyPay: number, age: number, yearsService: number, weeksLostPay: number) {
  const cappedPay = Math.min(weeklyPay, WEEKLY_PAY_CAP)
  const years = Math.min(yearsService, 20)

  // Basic award (same as statutory redundancy)
  let basicWeeks = 0
  for (let y = 0; y < years; y++) {
    // A year counts at the higher rate only if you were that age throughout it (ERA 1996 s162/s119),
    // so each year is judged by your age at its start
    const ageAtYear = age - (years - y)
    if (ageAtYear < 22) basicWeeks += 0.5
    else if (ageAtYear < 41) basicWeeks += 1
    else basicWeeks += 1.5
  }
  const basicAward = Math.min(basicWeeks * cappedPay, BASIC_AWARD_MAX)

  // Compensatory award: lost earnings plus loss of statutory rights, capped at the LOWER of
  // £123,543 and 52 weeks' gross pay (the weekly pay here is NOT capped at £751)
  const lostEarnings = weeklyPay * weeksLostPay
  const uncappedCompensatory = lostEarnings + LOSS_OF_STATUTORY_RIGHTS
  const weeksCap = COMPENSATORY_WEEKS_CAP * weeklyPay
  const compensatoryAward = Math.min(uncappedCompensatory, COMPENSATORY_AWARD_CAP, weeksCap)
  const capApplied: CapApplied =
    compensatoryAward >= uncappedCompensatory ? 'none' : weeksCap <= COMPENSATORY_AWARD_CAP ? 'weeks' : 'money'

  const totalAward = basicAward + compensatoryAward

  return { basicAward, basicWeeks, cappedPay, lostEarnings, uncappedCompensatory, weeksCap, compensatoryAward, capApplied, totalAward }
}

export default function EmploymentTribunalCalculator() {
  const [pay, setPay] = useState('600')
  const [age, setAge] = useState('35')
  const [years, setYears] = useState('6')
  const [lostWeeks, setLostWeeks] = useState('26')

  const w = Math.max(0, parseFloat(pay) || 0)
  const a = parseInt(age) || 0
  const y = Math.max(0, parseInt(years) || 0)
  const lw = Math.max(0, parseInt(lostWeeks) || 0)
  const result = useMemo(() => calculate(w, a, y, lw), [w, a, y, lw])
  const qualifies = y >= QUALIFYING_YEARS

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Weekly Pay (gross)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={pay} onChange={(e) => setPay(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weekly Pay (gross)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Age</label><input type="number" min="16" max="75" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Age" /></div>
        <div><label className="block text-sm font-medium mb-2">Years of Service</label><input type="number" min="0" max="50" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years of Service" /></div>
        <div><label className="block text-sm font-medium mb-2">Weeks Lost Pay</label><input type="number" min="0" max="260" value={lostWeeks} onChange={(e) => setLostWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weeks Lost Pay" /></div>
      </div>

      {w > 0 && !qualifies && (
        <div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4 text-sm animate-fade-in-up" role="status">
          <p className="font-medium">Ordinary unfair dismissal needs 2 years' continuous service</p>
          <p className="mt-1 text-muted-foreground">With {y} {y === 1 ? 'year' : 'years'} of service an ordinary unfair dismissal claim would fail before the merits are reached. The qualifying period falls to 6 months for dismissals on or after 1 January 2027 under the Employment Rights Act 2025. Automatically unfair reasons (whistleblowing, pregnancy, trade union activity, asserting a statutory right) and discrimination claims have no minimum service.</p>
        </div>
      )}

      {w > 0 && qualifies && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Total Award</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalAward)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Basic Award</p><p className="text-lg font-bold">{formatCurrency(result.basicAward)}</p><p className="text-xs text-muted-foreground">{result.basicWeeks} weeks x {formatCurrency(result.cappedPay)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Compensatory Award</p><p className="text-lg font-bold">{formatCurrency(result.compensatoryAward)}</p><p className="text-xs text-muted-foreground">{lw} weeks' lost pay {formatCurrency(result.lostEarnings)} + {formatCurrency(LOSS_OF_STATUTORY_RIGHTS)} loss of statutory rights</p></div>
          </div>
          {result.capApplied !== 'none' && (
            <p className="text-sm text-muted-foreground" role="status">
              {result.capApplied === 'weeks'
                ? `Compensatory award capped at 52 weeks' pay, ${formatCurrency(result.weeksCap)}`
                : `Compensatory award capped at the 2026/27 limit of ${formatCurrency(COMPENSATORY_AWARD_CAP)}`}
              {' '}(uncapped loss {formatCurrency(result.uncappedCompensatory)}).
            </p>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Basic award uses pay capped at £{WEEKLY_PAY_CAP}/week and at most 20 years' service, so it tops out at {formatCurrency(BASIC_AWARD_MAX)}. The compensatory award is capped at the lower of £{COMPENSATORY_AWARD_CAP.toLocaleString()} and 52 weeks' gross pay (2026/27). Discrimination claims and some automatically unfair dismissals are uncapped. A tribunal can cut the figure for contributory fault or a Polkey finding, and adjust it by up to 25% for an unreasonable failure to follow the Acas Code.</p>
          </div>
        </div>
      )}
    </div>
  )
}
