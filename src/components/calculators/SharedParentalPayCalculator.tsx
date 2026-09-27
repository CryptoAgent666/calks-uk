import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// ShPP 2026/27 (from 6 April 2026)
const SHPP_RATE = 194.32 // per week, or 90% of AWE if lower
const LEL_WEEKLY = 129 // lower earnings limit: AWE below this = no ShPP
const PAY_WEEKS = 39 // SMP/MA pay period that can be converted
const LEAVE_WEEKS = 52 // maternity leave period that can be converted
const COMPULSORY_MATERNITY_WEEKS = 2 // mother must take at least 2 weeks after the birth

function calculate(salary: number, weeksOff: number, maternityWeeksUsed: number) {
  const weeklyPay = salary / 52
  const used = Math.min(Math.max(maternityWeeksUsed, COMPULSORY_MATERNITY_WEEKS), PAY_WEEKS)
  const paidPool = PAY_WEEKS - used // at most 37
  const leavePool = LEAVE_WEEKS - used // at most 50
  const leaveWeeks = Math.min(Math.max(weeksOff, 0), leavePool)
  const eligible = weeklyPay >= LEL_WEEKLY
  const weeklyRate = eligible ? Math.min(weeklyPay * 0.90, SHPP_RATE) : 0
  const paidWeeks = eligible ? Math.min(leaveWeeks, paidPool) : 0
  const unpaidWeeks = leaveWeeks - paidWeeks
  const total = weeklyRate * paidWeeks
  const salaryLoss = weeklyPay * leaveWeeks - total

  return { weeklyPay, weeklyRate, eligible, paidPool, leavePool, leaveWeeks, paidWeeks, unpaidWeeks, total, salaryLoss }
}

export default function SharedParentalPayCalculator() {
  const [salary, setSalary] = useState('35000')
  const [weeks, setWeeks] = useState('6')
  const [matWeeks, setMatWeeks] = useState('2')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const w = parseInt(weeks) || 0
  const m = parseInt(matWeeks) || 2
  const result = useMemo(() => calculate(s, w, m), [s, w, m])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Weeks ShPL</label><input type="number" min="1" max="50" value={weeks} onChange={(e) => setWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weeks ShPL" /></div>
        <div><label className="block text-sm font-medium mb-2">Maternity Weeks Used</label><input type="number" min="2" max="39" value={matWeeks} onChange={(e) => setMatWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Maternity Weeks Used" /></div>
      </div>

      {s > 0 && w > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total ShPP</p><p className="text-xl font-bold text-primary">{formatCurrency(result.total)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Weekly Rate</p><p className="text-lg font-bold">{formatCurrency(result.weeklyRate)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Salary Loss</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.salaryLoss)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p>Leave: <span className="font-medium text-foreground">{result.leaveWeeks} weeks</span> &middot; paid: <span className="font-medium text-foreground">{result.paidWeeks} weeks</span> &middot; unpaid: <span className="font-medium text-foreground">{result.unpaidWeeks} weeks</span></p>
            <p>After {Math.min(Math.max(m, 2), 39)} weeks of maternity leave and pay, up to {result.leavePool} weeks of leave and {result.paidPool} weeks of ShPP are left for both parents to share.</p>
            {w > result.leavePool && <p className="text-orange-600">Only {result.leavePool} weeks of shared leave are available, so the extra weeks are not counted.</p>}
            {!result.eligible && <p className="text-orange-600">Average weekly earnings of {formatCurrency(result.weeklyPay)} are below the £{LEL_WEEKLY} lower earnings limit, so no ShPP is payable (the leave itself can still be taken).</p>}
          </div>
        </div>
      )}
    </div>
  )
}
