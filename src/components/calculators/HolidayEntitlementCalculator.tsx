import { useState, useMemo } from 'react'

const STATUTORY_WEEKS = 5.6
const MAX_STATUTORY_DAYS = 28
const IRREGULAR_ACCRUAL = 0.1207 // 5.6 / 46.4 weeks worked, for leave years from 1 April 2024
const FULL_YEAR_WEEKS_WORKED = 52 - STATUTORY_WEEKS // 46.4

type WorkPattern = 'full-time' | 'part-time' | 'irregular'

function calculate(pattern: WorkPattern, daysPerWeek: number, hoursPerWeek: number, weeksWorked = FULL_YEAR_WEEKS_WORKED, monthsRemaining = 12) {
  const hoursPerDay = daysPerWeek > 0 ? hoursPerWeek / daysPerWeek : 0
  if (pattern === 'irregular') {
    // Accrues at 12.07% of hours actually worked, capped at 5.6 weeks of the average working week
    const hoursWorked = hoursPerWeek * Math.min(Math.max(weeksWorked, 0), 52)
    const hours = Math.min(hoursWorked * IRREGULAR_ACCRUAL, STATUTORY_WEEKS * hoursPerWeek)
    const days = hoursPerDay > 0 ? hours / hoursPerDay : 0
    return { days, hours, weeks: hoursPerWeek > 0 ? hours / hoursPerWeek : 0, fullYearDays: days, roundedDays: days, hoursWorked, fraction: 1 }
  }
  // Full-time and part-time with a regular pattern: 5.6 weeks of the working week, capped at 28 days
  const fullYearDays = Math.min(daysPerWeek * STATUTORY_WEEKS, MAX_STATUTORY_DAYS)
  const fraction = Math.min(Math.max(monthsRemaining, 0), 12) / 12
  const days = fullYearDays * fraction
  const hours = days * hoursPerDay
  const roundedDays = Math.ceil(days * 2 - 1e-9) / 2 // rounded up to the nearest half day
  return { days, hours, weeks: daysPerWeek > 0 ? days / daysPerWeek : 0, fullYearDays, roundedDays, hoursWorked: 0, fraction }
}

export default function HolidayEntitlementCalculator() {
  const [pattern, setPattern] = useState<WorkPattern>('full-time')
  const [days, setDays] = useState('5')
  const [hours, setHours] = useState('37.5')
  const [weeksWorked, setWeeksWorked] = useState('46.4')
  const [months, setMonths] = useState('12')

  const d = parseFloat(days) || 5
  const h = parseFloat(hours) || 37.5
  const ww = parseFloat(weeksWorked) || 0
  const m = parseInt(months) || 12
  const result = useMemo(() => calculate(pattern, d, h, ww, m), [pattern, d, h, ww, m])
  const partYear = pattern !== 'irregular' && m < 12

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Work Pattern</label>
        <div className="grid grid-cols-3 gap-2">
          {([
            { v: 'full-time' as WorkPattern, l: 'Full-Time' },
            { v: 'part-time' as WorkPattern, l: 'Part-Time' },
            { v: 'irregular' as WorkPattern, l: 'Irregular Hours' },
          ]).map((o) => (
            <button key={o.v} onClick={() => setPattern(o.v)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${pattern === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{o.l}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="hol-days" className="block text-sm font-medium mb-2">Days Per Week</label>
          <input id="hol-days" type="number" min="1" max="7" step="0.5" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Days Per Week" />
        </div>
        <div>
          <label htmlFor="hol-hours" className="block text-sm font-medium mb-2">{pattern === 'irregular' ? 'Average Hours Per Week Worked' : 'Hours Per Week'}</label>
          <input id="hol-hours" type="number" min="1" max="80" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label={pattern === 'irregular' ? 'Average Hours Per Week Worked' : 'Hours Per Week'} />
        </div>
        {pattern === 'irregular' ? (
          <div className="col-span-2">
            <label htmlFor="hol-weeks" className="block text-sm font-medium mb-2">Weeks Worked in the Leave Year</label>
            <input id="hol-weeks" type="number" min="1" max="52" step="0.1" value={weeksWorked} onChange={(e) => setWeeksWorked(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weeks Worked in the Leave Year" />
            <p className="text-xs text-muted-foreground mt-1">A worker who takes all 5.6 weeks of holiday works 46.4 weeks a year.</p>
          </div>
        ) : (
          <div className="col-span-2">
            <label htmlFor="hol-months" className="block text-sm font-medium mb-2">Leave Year Worked</label>
            <select id="hol-months" value={months} onChange={(e) => setMonths(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Leave Year Worked">
              <option value="12">Whole leave year</option>
              {[11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>Started with {n} month{n === 1 ? '' : 's'} left</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">{partYear ? 'Holiday Entitlement for the Rest of the Leave Year' : 'Annual Holiday Entitlement'}</p>
          <p className="text-3xl font-bold text-primary mt-1">{result.days.toFixed(1)} days</p>
          <p className="text-sm text-muted-foreground mt-1">{result.hours.toFixed(1)} hours &middot; {result.weeks.toFixed(1)} weeks</p>
        </div>

        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">UK Statutory Minimum:</p>
          <p>All workers are entitled to {STATUTORY_WEEKS} weeks' paid holiday per year, capped at {MAX_STATUTORY_DAYS} days.</p>
          {pattern === 'irregular' ? (
            <p>Holiday accrues at 12.07% of hours worked: {result.hoursWorked.toFixed(1)} hours worked &times; 12.07% = <span className="font-medium text-foreground">{result.hours.toFixed(1)} hours</span>, capped at 5.6 weeks of your average week.</p>
          ) : (
            <p>For a {d}-day week, the full-year figure is <span className="font-medium text-foreground">{result.fullYearDays.toFixed(1)} days</span> (max {MAX_STATUTORY_DAYS} days).</p>
          )}
          {partYear && <p>Starting with {m} of 12 months left: {result.fullYearDays.toFixed(1)} &times; {m}/12 = {result.days.toFixed(1)} days, or {result.roundedDays.toFixed(1)} days rounded up to the nearest half day.</p>}
          <p>This includes bank holidays. Employers can require you to use holiday for bank holidays.</p>
        </div>
      </div>
    </div>
  )
}
