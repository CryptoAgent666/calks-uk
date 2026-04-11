import { useState, useMemo } from 'react'

const ZODIAC = [
  { sign: 'Capricorn', start: [12,22], end: [1,19], emoji: '' },
  { sign: 'Aquarius', start: [1,20], end: [2,18], emoji: '' },
  { sign: 'Pisces', start: [2,19], end: [3,20], emoji: '' },
  { sign: 'Aries', start: [3,21], end: [4,19], emoji: '' },
  { sign: 'Taurus', start: [4,20], end: [5,20], emoji: '' },
  { sign: 'Gemini', start: [5,21], end: [6,20], emoji: '' },
  { sign: 'Cancer', start: [6,21], end: [7,22], emoji: '' },
  { sign: 'Leo', start: [7,23], end: [8,22], emoji: '' },
  { sign: 'Virgo', start: [8,23], end: [9,22], emoji: '' },
  { sign: 'Libra', start: [9,23], end: [10,22], emoji: '' },
  { sign: 'Scorpio', start: [10,23], end: [11,21], emoji: '' },
  { sign: 'Sagittarius', start: [11,22], end: [12,21], emoji: '' },
]

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const CHINESE_ANIMALS = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig']

function calculate(dob: string) {
  if (!dob) return null
  const birth = new Date(dob)
  const now = new Date()
  if (isNaN(birth.getTime()) || birth > now) return null

  const dayOfWeek = DAYS[birth.getDay()]
  const month = birth.getMonth() + 1
  const day = birth.getDate()
  const year = birth.getFullYear()

  // Zodiac
  let zodiac = 'Capricorn'
  for (const z of ZODIAC) {
    if ((month === z.start[0] && day >= z.start[1]) || (month === z.end[0] && day <= z.end[1])) {
      zodiac = z.sign; break
    }
  }

  // Chinese zodiac
  const chineseAnimal = CHINESE_ANIMALS[(year - 4) % 12]

  // Age
  let age = now.getFullYear() - year
  if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < day)) age--

  // Days alive
  const daysAlive = Math.floor((now.getTime() - birth.getTime()) / (1000*60*60*24))

  // Next birthday
  const nextBday = new Date(now.getFullYear(), birth.getMonth(), day)
  if (nextBday <= now) nextBday.setFullYear(nextBday.getFullYear() + 1)
  const daysUntil = Math.ceil((nextBday.getTime() - now.getTime()) / (1000*60*60*24))
  const nextAge = age + 1
  const nextDayOfWeek = DAYS[nextBday.getDay()]

  // Milestone birthdays
  const milestones = [18,21,30,40,50,60,65,70,75,80,90,100].filter(m => m > age).slice(0,4).map(m => ({
    age: m, year: year + m, daysUntil: Math.ceil((new Date(year + m, birth.getMonth(), day).getTime() - now.getTime()) / (1000*60*60*24))
  }))

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return { age, dayOfWeek, zodiac, chineseAnimal, daysAlive, daysUntil, nextAge, nextDayOfWeek, nextBday: fmt(nextBday), milestones, birthDate: fmt(birth) }
}

export default function BirthdayCalculator() {
  const [dob, setDob] = useState('')
  const result = useMemo(() => calculate(dob), [dob])

  return (
    <div className="space-y-6">
      <div><label className="block text-sm font-medium mb-2">Date of Birth</label><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">You are</p>
            <p className="text-4xl font-bold text-primary mt-1">{result.age} years old</p>
            <p className="text-sm text-muted-foreground mt-1">{result.daysAlive.toLocaleString()} days alive</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Born On</p><p className="text-sm font-bold">{result.dayOfWeek}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Star Sign</p><p className="text-sm font-bold">{result.zodiac}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Chinese Zodiac</p><p className="text-sm font-bold">{result.chineseAnimal}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Next Birthday</p><p className="text-sm font-bold">{result.daysUntil} days</p></div>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm">
            <p className="text-muted-foreground">Next birthday ({result.nextAge}th): <span className="font-medium text-foreground">{result.nextBday}</span></p>
          </div>

          {result.milestones.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Upcoming Milestones</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {result.milestones.map(m => (
                  <div key={m.age} className="rounded-xl border border-border p-3 text-center"><p className="text-lg font-bold text-primary">{m.age}</p><p className="text-xs text-muted-foreground">{m.year} &middot; {Math.ceil(m.daysUntil/365)}yr</p></div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
