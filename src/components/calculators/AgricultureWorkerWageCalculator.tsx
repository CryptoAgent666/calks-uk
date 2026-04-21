import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Agricultural Wages (England) 2026/27
const MIN_WAGE = 12.21 // NMW age 21+
const AG_GRADE_1 = 12.21 // Initial grade
const AG_GRADE_2 = 12.77 // Standard
const AG_GRADE_3 = 13.57 // Lead worker
const AG_GRADE_4 = 14.78 // Craft grade
const AG_GRADE_5 = 16.29 // Supervisory
const AG_GRADE_6 = 18.13 // Farm management

const GRADES = [
  { grade: 1, name: 'Grade 1 — Initial', hourly: AG_GRADE_1 },
  { grade: 2, name: 'Grade 2 — Standard', hourly: AG_GRADE_2 },
  { grade: 3, name: 'Grade 3 — Lead Worker', hourly: AG_GRADE_3 },
  { grade: 4, name: 'Grade 4 — Craft', hourly: AG_GRADE_4 },
  { grade: 5, name: 'Grade 5 — Supervisory', hourly: AG_GRADE_5 },
  { grade: 6, name: 'Grade 6 — Farm Management', hourly: AG_GRADE_6 },
]

function calculate(gradeIdx: number, hoursPerWeek: number, overtimeHours: number) {
  const grade = GRADES[gradeIdx]
  const hourly = grade.hourly
  const overtimeRate = hourly * 1.5
  const weeklyPay = hourly * hoursPerWeek + overtimeRate * overtimeHours
  const annualPay = weeklyPay * 52
  const monthlyPay = annualPay / 12
  const holiday = 5.6 * hoursPerWeek // 5.6 weeks statutory

  return { hourly, overtimeRate, weeklyPay, monthlyPay, annualPay, holiday, grade }
}

export default function AgricultureWorkerWageCalculator() {
  const [gradeIdx, setGradeIdx] = useState(1)
  const [hours, setHours] = useState('39')
  const [overtime, setOvertime] = useState('5')

  const h = parseFloat(hours) || 0
  const o = parseFloat(overtime) || 0
  const result = useMemo(() => calculate(gradeIdx, h, o), [gradeIdx, h, o])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">AWO Grade</label><select value={gradeIdx} onChange={(e) => setGradeIdx(parseInt(e.target.value))} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring">{GRADES.map((g, i) => <option key={i} value={i}>{g.name} (£{g.hourly}/hr)</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Standard Hours/Week</label><input type="number" min="0" max="60" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Overtime Hours/Week</label><input type="number" min="0" max="30" value={overtime} onChange={(e) => setOvertime(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">{result.grade.name}</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.annualPay)}/year</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.weeklyPay)}/week &middot; {formatCurrency(result.monthlyPay)}/month</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Hourly Rate</p><p className="text-lg font-bold">{formatCurrency(result.hourly)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Overtime (1.5x)</p><p className="text-lg font-bold">{formatCurrency(result.overtimeRate)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Holiday Hours</p><p className="text-lg font-bold">{result.holiday.toFixed(0)} hrs/yr</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Agricultural Wages Order (England) 2026/27. Scotland and Wales have separate arrangements. Overtime at 1.5x applies to hours over the basic week. On-call and night work attract additional allowances.</p>
        </div>
      </div>
    </div>
  )
}
