import { useState, useMemo } from 'react'

function calculate(dob: string) {
  if (!dob) return null
  const birth = new Date(dob)
  const now = new Date()
  if (isNaN(birth.getTime()) || birth > now) return null

  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  let days = now.getDate() - birth.getDate()

  if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate() }
  if (months < 0) { years--; months += 12 }

  const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
  const totalWeeks = Math.floor(totalDays / 7)
  const totalMonths = years * 12 + months

  // Next birthday
  const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
  if (nextBirthday <= now) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return { years, months, days, totalDays, totalWeeks, totalMonths, daysUntilBirthday, nextAge: years + 1 }
}

export default function AgeCalculator() {
  const [dob, setDob] = useState('')
  const result = useMemo(() => calculate(dob), [dob])

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="age-dob" className="block text-sm font-medium mb-2">Date of Birth</label>
        <input id="age-dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Date of Birth" />
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Your Age</p>
            <p className="text-3xl font-bold text-primary mt-1">{result.years} years, {result.months} months, {result.days} days</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Days</p><p className="text-lg font-bold">{result.totalDays.toLocaleString()}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Weeks</p><p className="text-lg font-bold">{result.totalWeeks.toLocaleString()}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Months</p><p className="text-lg font-bold">{result.totalMonths.toLocaleString()}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Next Birthday</p><p className="text-lg font-bold">{result.daysUntilBirthday} days</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
