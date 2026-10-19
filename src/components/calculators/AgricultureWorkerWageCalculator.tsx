import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Farm worker minimum pay 2026/27.
// England: no Agricultural Wages Order since 1 October 2013 (ERRA 2013 s.72). Workers get the
// National Minimum/Living Wage, plus any Agricultural Minimum Wage terms written into a
// contract that began before then. No statutory overtime premium. Holiday: 5.6 weeks, capped
// at 28 days (Working Time Regulations 1998 regs 13 and 13A).
// Wales: Agricultural Wages (Wales) Order 2025 (SI 2025/293), rates from 1 April 2026 with the
// lower grades raised to the NMW. "Basic hours" are at most 39 a week; overtime (hours beyond
// basic hours and on a public holiday) is at least 1.5x the basic hourly rate (art 12). Annual
// leave by days worked a week, Schedule 2; public holidays not worked come out of it (art 36).
// Scotland: Agricultural Wages (Scotland) (No. 73) Order 2026, from 1 April 2026. Overtime is
// M x 1.5, where M is the art 5/6 minimum rate only; the art 7 qualification sum is not paid on
// overtime hours (arts 8(2), 9(2)). Overtime = over 8 hours a day or over 39 a week after 26
// weeks' service (48 a week before). Holiday: Table 3 (art 10) plus Christmas Day and New
// Year's Day (art 11).
// Northern Ireland: Agricultural Wages Board for NI, Order No 106, from the first pay period
// starting on or after 1 April 2026 (DAERA, 19 March 2026). Overtime at the normal hourly
// rate; accommodation offset £60.00 a week. Holiday shown is the statutory 5.6 weeks / 28 days
// (Working Time Regulations (NI) 1998).
type Nation = 'england' | 'wales' | 'scotland' | 'ni'

interface Grade { name: string; hourly: number; overtimeBase?: number }

const RATES: Record<Nation, Grade[]> = {
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
    { name: 'Apprentice, year 2+, age 16-17', hourly: 8.00 },
    { name: 'Apprentice, year 2+, age 18-20', hourly: 10.85 },
    { name: 'Apprentice, year 2+, age 21+', hourly: 12.71 },
  ],
  scotland: [
    { name: 'All workers', hourly: 12.71 },
    // Art 7 additional sum of £1.91 on normal hours only; overtime is 1.5 x £12.71.
    { name: 'SCQF 6/7 or higher qualification (+£1.91)', hourly: 14.62, overtimeBase: 12.71 },
    { name: 'Apprentice, first 18 months', hourly: 8.00 },
  ],
  ni: [
    { name: 'Grade 1 — Trainee, under 18', hourly: 8.00 },
    { name: 'Grade 1 — Trainee, age 18-20', hourly: 10.85 },
    { name: 'Grade 1 — Trainee, age 21+', hourly: 12.71 },
    { name: 'Grade 2 — Agricultural Worker', hourly: 13.30 },
    { name: 'Grade 3 — Lead Skilled Worker', hourly: 13.66 },
    { name: 'Grade 4 — Multi-skilled Worker', hourly: 13.89 },
    { name: 'Grade 5 — Agricultural Manager', hourly: 14.44 },
  ],
}

const NATIONS: Record<Nation, { label: string; overtime: number; note: string }> = {
  england: { label: 'England', overtime: 1, note: 'England has had no Agricultural Wages Order since October 2013, so the National Minimum Wage applies and there is no statutory overtime premium. Workers employed before 1 October 2013 keep any Agricultural Minimum Wage terms written into their contract. Holiday is the statutory 5.6 weeks, capped at 28 days.' },
  wales: { label: 'Wales', overtime: 1.5, note: 'Agricultural Wages (Wales) Order 2025, rates from 1 April 2026. Overtime is at least 1.5x the basic rate for hours beyond the contracted basic hours, which cannot exceed 39 a week, and for work on a public holiday. On top of pay come a dog allowance of £11.18 a week per dog, £2.12 an hour for night work, and an on-call allowance of 3 times the hourly rate for each on-call period of up to 24 hours. Annual leave follows the Order\'s table by days worked a week, and public holidays not worked are taken out of it.' },
  scotland: { label: 'Scotland', overtime: 1.5, note: 'Agricultural Wages (Scotland) (No. 73) Order 2026, from 1 April 2026. Overtime is 1.5x the minimum rate (£19.07 an hour on £12.71) and the qualification premium is not added to overtime hours. After 26 weeks with the employer, overtime is any hour over 8 in a day or 39 in a week (48 a week before that); this tool assumes more than 26 weeks and hours spread evenly over the days worked. Holiday follows the Order\'s Table 3 by days worked a week, plus Christmas Day and New Year\'s Day.' },
  ni: { label: 'Northern Ireland', overtime: 1, note: 'Agricultural Wages Board for Northern Ireland, Order No 106, from the first pay period starting on or after 1 April 2026. Overtime is paid at the normal hourly rate unless the contract gives more, and the accommodation offset is £60.00 a week. Holiday shown is the statutory 5.6 weeks, capped at 28 days.' },
}

// Wales: AWO 2025 Schedule 2 (days of annual leave by days worked each week).
function walesLeaveDays(days: number): number {
  if (days > 6) return 38
  if (days > 5) return 35
  if (days > 4) return 31
  if (days > 3) return 25
  if (days > 2) return 20
  if (days > 1) return 13
  return 7.5
}

// Scotland: AWSO No. 73 Table 3 (art 10), days rounded to the nearest whole number, half up.
const SCOTLAND_TABLE_3 = [8, 13, 18, 23, 28, 33, 38]
const SCOTLAND_SPECIAL_HOLIDAYS = 2 // Christmas Day and New Year's Day (art 11)

function leaveDays(nation: Nation, days: number): { days: number; detail: string } {
  if (nation === 'wales') {
    const d = walesLeaveDays(days)
    return { days: d, detail: 'Wales Order table, incl. public holidays' }
  }
  if (nation === 'scotland') {
    const whole = Math.min(7, Math.max(1, Math.floor(days + 0.5)))
    const base = SCOTLAND_TABLE_3[whole - 1]
    return { days: base + SCOTLAND_SPECIAL_HOLIDAYS, detail: `${base} + Christmas and New Year's Day` }
  }
  const d = Math.min(28, 5.6 * days)
  return { days: d, detail: '5.6 weeks, max 28 days' }
}

function calculate(nation: Nation, gradeIdx: number, standardHours: number, overtimeHours: number, daysPerWeek: number) {
  const grades = RATES[nation]
  const grade = grades[Math.min(gradeIdx, grades.length - 1)]
  const hourly = grade.hourly
  const multiplier = NATIONS[nation].overtime
  const overtimeRate = (grade.overtimeBase ?? hourly) * multiplier

  // Wales: basic hours are at most 39 a week. Scotland: overtime over 39 a week or 8 a day.
  let basicCap = Infinity
  if (nation === 'wales') basicCap = 39
  if (nation === 'scotland') basicCap = Math.min(39, 8 * daysPerWeek)
  const basicHours = Math.min(standardHours, basicCap)
  const movedToOvertime = standardHours - basicHours
  const totalOvertime = overtimeHours + movedToOvertime

  const weeklyPay = hourly * basicHours + overtimeRate * totalOvertime
  const annualPay = weeklyPay * 52
  const monthlyPay = annualPay / 12

  const leave = leaveDays(nation, daysPerWeek)
  const holidayHours = leave.days * (basicHours / daysPerWeek)

  return { hourly, overtimeRate, multiplier, basicHours, movedToOvertime, totalOvertime, weeklyPay, monthlyPay, annualPay, leave, holidayHours, grade }
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function AgricultureWorkerWageCalculator() {
  const [nation, setNation] = useState<Nation>('england')
  const [gradeIdx, setGradeIdx] = useState(0)
  const [hours, setHours] = useState('39')
  const [overtime, setOvertime] = useState('5')
  const [days, setDays] = useState('5')

  const h = Math.max(0, parseFloat(hours) || 0)
  const o = Math.max(0, parseFloat(overtime) || 0)
  const d = Math.min(7, Math.max(0.5, parseFloat(days) || 5))
  const result = useMemo(() => calculate(nation, gradeIdx, h, o, d), [nation, gradeIdx, h, o, d])

  const movedNote = result.movedToOvertime > 0
    ? nation === 'wales'
      ? `Basic hours in Wales are capped at 39 a week, so ${result.movedToOvertime.toFixed(1).replace(/\.0$/, '')} of your standard hours are paid as overtime (${result.totalOvertime.toFixed(1).replace(/\.0$/, '')} overtime hours in total).`
      : `In Scotland hours over 39 a week or 8 a day are overtime, so ${result.movedToOvertime.toFixed(1).replace(/\.0$/, '')} of your standard hours are paid as overtime (${result.totalOvertime.toFixed(1).replace(/\.0$/, '')} overtime hours in total).`
    : null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Nation</label><select value={nation} onChange={(e) => { setNation(e.target.value as Nation); setGradeIdx(0) }} className={inputClass} aria-label="Nation">{Object.entries(NATIONS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Grade or Age Band</label><select value={gradeIdx} onChange={(e) => setGradeIdx(parseInt(e.target.value))} className={inputClass} aria-label="Grade or Age Band">{RATES[nation].map((g, i) => <option key={i} value={i}>{g.name} (£{g.hourly.toFixed(2)}/hr)</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Standard Hours/Week</label><input type="number" min="0" max="60" value={hours} onChange={(e) => setHours(e.target.value)} className={inputClass} aria-label="Standard Hours/Week" /></div>
        <div><label className="block text-sm font-medium mb-2">Overtime Hours/Week</label><input type="number" min="0" max="30" value={overtime} onChange={(e) => setOvertime(e.target.value)} className={inputClass} aria-label="Overtime Hours/Week" /></div>
        <div><label className="block text-sm font-medium mb-2">Days Worked/Week</label><input type="number" min="0.5" max="7" step="0.5" value={days} onChange={(e) => setDays(e.target.value)} className={inputClass} aria-label="Days Worked/Week" /></div>
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
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Holiday</p><p className="text-lg font-bold">{result.leave.days % 1 === 0 ? result.leave.days.toFixed(0) : result.leave.days.toFixed(1)} days</p><p className="text-xs text-muted-foreground">{result.holidayHours.toFixed(0)} hrs/yr</p></div>
        </div>
        <p className="text-xs text-muted-foreground text-center">Holiday: {result.leave.detail}. Hours use your basic hours spread over the days you work.</p>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
          {movedNote && <p className="font-medium text-foreground">{movedNote}</p>}
          <p>{NATIONS[nation].note}</p>
        </div>
      </div>
    </div>
  )
}
