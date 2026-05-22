import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const SHPP_RATE = 194.32

function calculate(salary: number, weeksOff: number) {
  const weeklyRate = Math.min(salary / 52 * 0.90, SHPP_RATE)
  const total = weeklyRate * weeksOff
  const salaryLoss = (salary / 52 - weeklyRate) * weeksOff

  return { weeklyRate, total, salaryLoss, monthlyEquiv: total / (weeksOff / 4.33) }
}

export default function SharedParentalPayCalculator() {
  const [salary, setSalary] = useState('35000')
  const [weeks, setWeeks] = useState('6')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const w = parseInt(weeks) || 0
  const result = useMemo(() => calculate(s, w), [s, w])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Weeks ShPL</label><input type="number" min="1" max="50" value={weeks} onChange={(e) => setWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weeks ShPL" /></div>
      </div>

      {s > 0 && w > 0 && (
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total ShPP</p><p className="text-xl font-bold text-primary">{formatCurrency(result.total)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Weekly Rate</p><p className="text-lg font-bold">{formatCurrency(result.weeklyRate)}</p></div>
          <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Salary Loss</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.salaryLoss)}</p></div>
        </div>
      )}
    </div>
  )
}
