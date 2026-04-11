import { useState, useMemo } from 'react'

const STATUTORY_WEEKS = 5.6
const MAX_STATUTORY_DAYS = 28

type WorkPattern = 'full-time' | 'part-time' | 'irregular'

function calculate(pattern: WorkPattern, daysPerWeek: number, hoursPerWeek: number) {
  if (pattern === 'full-time') {
    return { days: MAX_STATUTORY_DAYS, weeks: STATUTORY_WEEKS, hours: MAX_STATUTORY_DAYS * (hoursPerWeek / daysPerWeek) }
  }
  if (pattern === 'part-time') {
    const days = Math.min(daysPerWeek * STATUTORY_WEEKS, MAX_STATUTORY_DAYS)
    return { days, weeks: STATUTORY_WEEKS, hours: days * (hoursPerWeek / daysPerWeek) }
  }
  // Irregular hours — use 12.07% of hours worked
  const annualHours = hoursPerWeek * 52
  const holidayHours = annualHours * 0.1207
  return { days: holidayHours / (hoursPerWeek / daysPerWeek || 8), weeks: STATUTORY_WEEKS, hours: holidayHours }
}

export default function HolidayEntitlementCalculator() {
  const [pattern, setPattern] = useState<WorkPattern>('full-time')
  const [days, setDays] = useState('5')
  const [hours, setHours] = useState('37.5')

  const d = parseFloat(days) || 5
  const h = parseFloat(hours) || 37.5
  const result = useMemo(() => calculate(pattern, d, h), [pattern, d, h])

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
          <input id="hol-days" type="number" min="1" max="7" step="0.5" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label htmlFor="hol-hours" className="block text-sm font-medium mb-2">Hours Per Week</label>
          <input id="hol-hours" type="number" min="1" max="80" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Annual Holiday Entitlement</p>
          <p className="text-3xl font-bold text-primary mt-1">{result.days.toFixed(1)} days</p>
          <p className="text-sm text-muted-foreground mt-1">{result.hours.toFixed(1)} hours &middot; {STATUTORY_WEEKS} weeks</p>
        </div>

        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">UK Statutory Minimum:</p>
          <p>All workers are entitled to {STATUTORY_WEEKS} weeks' paid holiday per year.</p>
          <p>For a {d}-day week, this equals <span className="font-medium text-foreground">{result.days.toFixed(1)} days</span> (max {MAX_STATUTORY_DAYS} days).</p>
          <p>This includes bank holidays — employers can require you to use holiday for bank holidays.</p>
        </div>
      </div>
    </div>
  )
}
