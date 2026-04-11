import { useState, useMemo } from 'react'

function calculate(date1: string, date2: string) {
  if (!date1 || !date2) return null
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null

  const earlier = d1 < d2 ? d1 : d2
  const later = d1 < d2 ? d2 : d1

  const diffMs = later.getTime() - earlier.getTime()
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const totalWeeks = Math.floor(totalDays / 7)
  const remainingDays = totalDays % 7
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
  const totalMinutes = Math.floor(diffMs / (1000 * 60))

  let years = later.getFullYear() - earlier.getFullYear()
  let months = later.getMonth() - earlier.getMonth()
  let days = later.getDate() - earlier.getDate()
  if (days < 0) { months--; days += new Date(later.getFullYear(), later.getMonth(), 0).getDate() }
  if (months < 0) { years--; months += 12 }

  // Working days (Mon-Fri)
  let workDays = 0
  const temp = new Date(earlier)
  while (temp < later) {
    const day = temp.getDay()
    if (day !== 0 && day !== 6) workDays++
    temp.setDate(temp.getDate() + 1)
  }

  return { totalDays, totalWeeks, remainingDays, totalHours, totalMinutes, years, months, days, workDays }
}

function addDays(date: string, daysToAdd: number) {
  if (!date) return ''
  const d = new Date(date)
  d.setDate(d.getDate() + daysToAdd)
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function DateCalculator() {
  const [date1, setDate1] = useState('')
  const [date2, setDate2] = useState('')
  const [addDate, setAddDate] = useState('')
  const [addNum, setAddNum] = useState('')

  const result = useMemo(() => calculate(date1, date2), [date1, date2])
  const addResult = useMemo(() => addDays(addDate, parseInt(addNum) || 0), [addDate, addNum])

  return (
    <div className="space-y-8">
      {/* Days between dates */}
      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Days Between Two Dates</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">Start Date</label><input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div><label className="block text-sm font-medium mb-2">End Date</label><input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
        {result && (
          <div className="space-y-3 animate-fade-in-up">
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <p className="text-3xl font-bold text-primary">{result.totalDays} days</p>
              <p className="text-sm text-muted-foreground mt-1">{result.years > 0 ? `${result.years}y ` : ''}{result.months > 0 ? `${result.months}m ` : ''}{result.days}d</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Weeks</p><p className="text-lg font-bold">{result.totalWeeks}w {result.remainingDays}d</p></div>
              <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Working Days</p><p className="text-lg font-bold">{result.workDays}</p></div>
              <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Hours</p><p className="text-lg font-bold">{result.totalHours.toLocaleString()}</p></div>
              <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Minutes</p><p className="text-lg font-bold">{result.totalMinutes.toLocaleString()}</p></div>
            </div>
          </div>
        )}
      </div>

      {/* Add/subtract days */}
      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Add or Subtract Days</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">Start Date</label><input type="date" value={addDate} onChange={(e) => setAddDate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div><label className="block text-sm font-medium mb-2">Days to Add (negative to subtract)</label><input type="number" value={addNum} onChange={(e) => setAddNum(e.target.value)} placeholder="30" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
        {addDate && addNum && (
          <div className="rounded-xl bg-primary/10 p-4 text-center animate-fade-in-up">
            <p className="text-sm text-muted-foreground">Result</p>
            <p className="text-xl font-bold text-primary mt-1">{addResult}</p>
          </div>
        )}
      </div>
    </div>
  )
}
