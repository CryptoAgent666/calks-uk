import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Tribunal limits 2026/27 (effective 6 April 2026)
const WEEKLY_PAY_CAP = 751 // £751/week from 6 April 2026
const BASIC_AWARD_MAX = WEEKLY_PAY_CAP * 30 // max 30 weeks x cap
const COMPENSATORY_AWARD_CAP = 123_543 // uprated for 2026/27 from 6 April 2026 (was £118,223 in 2025/26)

function calculate(weeklyPay: number, age: number, yearsService: number, weeksLostPay: number) {
  const cappedPay = Math.min(weeklyPay, WEEKLY_PAY_CAP)
  const years = Math.min(yearsService, 20)

  // Basic award (same as statutory redundancy)
  let basicWeeks = 0
  for (let y = 0; y < years; y++) {
    const ageAtYear = age - (years - y - 1)
    if (ageAtYear < 22) basicWeeks += 0.5
    else if (ageAtYear < 41) basicWeeks += 1
    else basicWeeks += 1.5
  }
  const basicAward = Math.min(basicWeeks * cappedPay, BASIC_AWARD_MAX)

  // Compensatory award (lost earnings)
  const lostEarnings = weeklyPay * weeksLostPay
  const compensatoryAward = Math.min(lostEarnings, COMPENSATORY_AWARD_CAP)

  const totalAward = basicAward + compensatoryAward

  return { basicAward, basicWeeks, compensatoryAward, totalAward, cappedPay }
}

export default function EmploymentTribunalCalculator() {
  const [pay, setPay] = useState('600')
  const [age, setAge] = useState('35')
  const [years, setYears] = useState('5')
  const [lostWeeks, setLostWeeks] = useState('26')

  const w = parseFloat(pay) || 0
  const a = parseInt(age) || 0
  const y = parseInt(years) || 0
  const lw = parseInt(lostWeeks) || 0
  const result = useMemo(() => calculate(w, a, y, lw), [w, a, y, lw])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Weekly Pay (gross)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={pay} onChange={(e) => setPay(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weekly Pay (gross)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Age</label><input type="number" min="16" max="75" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Age" /></div>
        <div><label className="block text-sm font-medium mb-2">Years of Service</label><input type="number" min="0" max="50" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years of Service" /></div>
        <div><label className="block text-sm font-medium mb-2">Weeks Lost Pay</label><input type="number" min="0" max="260" value={lostWeeks} onChange={(e) => setLostWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weeks Lost Pay" /></div>
      </div>

      {w > 0 && y > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Total Award</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalAward)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Basic Award</p><p className="text-lg font-bold">{formatCurrency(result.basicAward)}</p><p className="text-xs text-muted-foreground">{result.basicWeeks} weeks x {formatCurrency(result.cappedPay)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Compensatory Award</p><p className="text-lg font-bold">{formatCurrency(result.compensatoryAward)}</p><p className="text-xs text-muted-foreground">{lostWeeks} weeks lost earnings</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Basic award capped at £{WEEKLY_PAY_CAP}/week, max 20 years. Compensatory award capped at £{COMPENSATORY_AWARD_CAP.toLocaleString()} or 52 weeks' gross pay (whichever is lower for most claims). Discrimination claims are uncapped.</p>
          </div>
        </div>
      )}
    </div>
  )
}
