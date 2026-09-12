import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Farm worker minimum pay 2026/27.
// England: no Agricultural Wages Order since 1 October 2013 (ERRA 2013 s.72). Workers get the
// National Minimum/Living Wage, plus any Agricultural Minimum Wage terms written into a
// contract that began before then. There is no statutory overtime premium.
// Wales: Agricultural Wages (Wales) Order 2025, rates from 1 April 2026; overtime at 1.5x for
// hours over 39 a week. Scotland: Agricultural Wages (Scotland) Order, 30th edition, from
// 1 April 2026; overtime at 1.5x.
type Nation = 'england' | 'wales' | 'scotland'

const RATES: Record<Nation, { name: string; hourly: number }[]> = {
  england: [
    { name: 'National Living Wage (21+)', hourly: 12.71 },
    { name: 'Minimum wage, age 18-20', hourly: 10.85 },
    { name: 'Minimum wage, under 18 or apprentice', hourly: 8.00 },
  ],
  wales: [
    { name: 'Grade A/B, age 21+', hourly: 12.71 },
    { name: 'Grade A/B, age 18-20', hourly: 10.85 },
    { name: 'Grade A/B, age 16-17', hourly: 8.00 },
    { name: 'Grade C — Advanced Worker', hourly: 13.48 },
    { name: 'Grade D — Senior Worker', hourly: 14.79 },
    { name: 'Grade E — Manager', hourly: 16.23 },
    { name: 'Apprentice, year 1', hourly: 8.00 },
  ],
  scotland: [
    { name: 'All workers', hourly: 12.71 },
    { name: 'SCQF 6/7 or higher qualification (+£1.91)', hourly: 14.62 },
    { name: 'Apprentice, first 18 months', hourly: 8.00 },
  ],
}

const NATIONS: Record<Nation, { label: string; overtime: number; note: string }> = {
  england: { label: 'England', overtime: 1, note: 'England has had no Agricultural Wages Order since October 2013, so the National Minimum Wage applies and there is no statutory overtime premium. Workers employed before 1 October 2013 keep any Agricultural Minimum Wage terms written into their contract.' },
  wales: { label: 'Wales', overtime: 1.5, note: 'Agricultural Wages (Wales) Order 2025, rates from 1 April 2026. Overtime is at least 1.5x the basic rate for hours over 39 a week, and dog, night work and birth allowances are paid on top.' },
  scotland: { label: 'Scotland', overtime: 1.5, note: 'Agricultural Wages (Scotland) Order, 30th edition, from 1 April 2026. Overtime is paid at 1.5x the hourly rate.' },
}

function calculate(nation: Nation, gradeIdx: number, hoursPerWeek: number, overtimeHours: number) {
  const grades = RATES[nation]
  const grade = grades[Math.min(gradeIdx, grades.length - 1)]
  const hourly = grade.hourly
  const multiplier = NATIONS[nation].overtime
  const overtimeRate = hourly * multiplier
  const weeklyPay = hourly * hoursPerWeek + overtimeRate * overtimeHours
  const annualPay = weeklyPay * 52
  const monthlyPay = annualPay / 12
  const holiday = 5.6 * hoursPerWeek // 5.6 weeks statutory

  return { hourly, overtimeRate, multiplier, weeklyPay, monthlyPay, annualPay, holiday, grade }
}

export default function AgricultureWorkerWageCalculator() {
  const [nation, setNation] = useState<Nation>('england')
  const [gradeIdx, setGradeIdx] = useState(0)
  const [hours, setHours] = useState('39')
  const [overtime, setOvertime] = useState('5')

  const h = parseFloat(hours) || 0
  const o = parseFloat(overtime) || 0
  const result = useMemo(() => calculate(nation, gradeIdx, h, o), [nation, gradeIdx, h, o])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Nation</label><select value={nation} onChange={(e) => { setNation(e.target.value as Nation); setGradeIdx(0) }} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Nation">{Object.entries(NATIONS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Grade or Age Band</label><select value={gradeIdx} onChange={(e) => setGradeIdx(parseInt(e.target.value))} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Grade or Age Band">{RATES[nation].map((g, i) => <option key={i} value={i}>{g.name} (£{g.hourly.toFixed(2)}/hr)</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Standard Hours/Week</label><input type="number" min="0" max="60" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Standard Hours/Week" /></div>
        <div><label className="block text-sm font-medium mb-2">Overtime Hours/Week</label><input type="number" min="0" max="30" value={overtime} onChange={(e) => setOvertime(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Overtime Hours/Week" /></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">{result.grade.name}</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.annualPay)}/year</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.weeklyPay)}/week &middot; {formatCurrency(result.monthlyPay)}/month</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Hourly Rate</p><p className="text-lg font-bold">{formatCurrency(result.hourly)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Overtime ({result.multiplier}x)</p><p className="text-lg font-bold">{formatCurrency(result.overtimeRate)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Holiday Hours</p><p className="text-lg font-bold">{result.holiday.toFixed(0)} hrs/yr</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>{NATIONS[nation].note}</p>
        </div>
      </div>
    </div>
  )
}
