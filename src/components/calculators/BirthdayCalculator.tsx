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

// Lunar new year as month*100+day, 1924 to 2043 (Hong Kong Observatory calendar tables).
// A table rather than Intl's Chinese calendar, which is a day out in 1954, 2027 and 2030.
const LUNAR_NEW_YEAR_FROM = 1924
const LUNAR_NEW_YEAR = [
  205, 124, 213, 202, 123, 210, 130, 217, 206, 126, 214, 204, 124, 211, 131, 219, 208, 127, 215, 205,
  125, 213, 202, 122, 210, 129, 217, 206, 127, 214, 203, 124, 212, 131, 218, 208, 128, 215, 205, 125,
  213, 202, 121, 209, 130, 217, 206, 127, 215, 203, 123, 211, 131, 218, 207, 128, 216, 205, 125, 213,
  202, 220, 209, 129, 217, 206, 127, 215, 204, 123, 210, 131, 219, 207, 128, 216, 205, 124, 212, 201,
  122, 209, 129, 218, 207, 126, 214, 203, 123, 210, 131, 219, 208, 128, 216, 205, 125, 212, 201, 122,
  210, 129, 217, 206, 126, 213, 203, 123, 211, 131, 219, 208, 128, 215, 204, 124, 212, 201, 122, 210,
]

const DAY_MS = 1000*60*60*24

// Whole days since 1 Jan 1970 for a calendar date, so time zones and clock changes cannot shift a count.
function dayNumber(year: number, month: number, day: number) {
  const d = new Date(0)
  d.setUTCFullYear(year, month - 1, day)
  return Math.floor(d.getTime() / DAY_MS)
}

// A 29 February birthday is counted on 1 March in other years.
function birthdayIn(year: number, month: number, day: number) {
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  return month === 2 && day === 29 && !isLeap ? dayNumber(year, 3, 1) : dayNumber(year, month, day)
}

function chineseAnimal(year: number, month: number, day: number) {
  const md = month * 100 + day
  let animalYear = year // the new year always falls between 21 Jan and 20 Feb
  if (md < 121) animalYear = year - 1
  else if (md <= 220) {
    const newYear = LUNAR_NEW_YEAR[year - LUNAR_NEW_YEAR_FROM]
    if (newYear === undefined) return null
    if (md < newYear) animalYear = year - 1
  }
  return CHINESE_ANIMALS[((animalYear - 4) % 12 + 12) % 12]
}

function ordinal(n: number) {
  const lastTwo = n % 100
  if (lastTwo >= 11 && lastTwo <= 13) return n + 'th'
  return n + (['th','st','nd','rd'][n % 10] || 'th')
}

function untilLabel(days: number) {
  return days < 365 ? `${days} day${days === 1 ? '' : 's'}` : `${Math.round(days / 365.25)}yr`
}

function calculate(dob: string) {
  const parts = dob.match(/^(\d+)-(\d{2})-(\d{2})$/)
  if (!parts) return null
  const year = Number(parts[1])
  const month = Number(parts[2])
  const day = Number(parts[3])
  const birthNumber = dayNumber(year, month, day)
  if (new Date(birthNumber * DAY_MS).getUTCDate() !== day) return null

  const now = new Date()
  const thisYear = now.getFullYear()
  const today = dayNumber(thisYear, now.getMonth() + 1, now.getDate())
  if (birthNumber > today) return null

  const dayOfWeek = DAYS[((birthNumber + 4) % 7 + 7) % 7]

  // Zodiac
  let zodiac = 'Capricorn'
  for (const z of ZODIAC) {
    if ((month === z.start[0] && day >= z.start[1]) || (month === z.end[0] && day <= z.end[1])) {
      zodiac = z.sign; break
    }
  }

  // Age
  const birthdayThisYear = birthdayIn(thisYear, month, day)
  const age = thisYear - year - (today < birthdayThisYear ? 1 : 0)

  // Days alive
  const daysAlive = today - birthNumber

  // Next birthday (today counts, except on the day of birth itself)
  const nextYear = birthdayThisYear < today || birthNumber === today ? thisYear + 1 : thisYear
  const nextBday = birthdayIn(nextYear, month, day)
  const daysUntil = nextBday - today
  const nextAge = nextYear - year

  // Milestone birthdays
  const milestones = [18,21,30,40,50,60,65,70,75,80,90,100].filter(m => m > age).slice(0,4).map(m => ({
    age: m, year: year + m, daysUntil: birthdayIn(year + m, month, day) - today
  }))

  const fmt = (n: number) => new Date(n * DAY_MS).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

  return { age, dayOfWeek, zodiac, chineseAnimal: chineseAnimal(year, month, day), daysAlive, daysUntil, nextAge, nextBday: fmt(nextBday), milestones, birthDate: fmt(birthNumber), leapDay: month === 2 && day === 29 }
}

export default function BirthdayCalculator() {
  const [dob, setDob] = useState('')
  const result = useMemo(() => calculate(dob), [dob])

  return (
    <div className="space-y-6">
      <div><label className="block text-sm font-medium mb-2">Date of Birth</label><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Date of Birth" /></div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">You are</p>
            <p className="text-4xl font-bold text-primary mt-1">{result.age} {result.age === 1 ? 'year' : 'years'} old</p>
            <p className="text-sm text-muted-foreground mt-1">{result.daysAlive.toLocaleString('en-GB')} days alive</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Born On</p><p className="text-sm font-bold">{result.dayOfWeek}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Star Sign</p><p className="text-sm font-bold">{result.zodiac}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Chinese Zodiac</p><p className="text-sm font-bold">{result.chineseAnimal ?? 'Not available for this date'}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Next Birthday</p><p className="text-sm font-bold">{result.daysUntil === 0 ? 'Today' : untilLabel(result.daysUntil)}</p></div>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm">
            <p className="text-muted-foreground">{result.daysUntil === 0 ? 'Birthday today' : 'Next birthday'} ({ordinal(result.nextAge)}): <span className="font-medium text-foreground">{result.nextBday}</span></p>
            {result.leapDay && <p className="text-xs text-muted-foreground mt-1">Born on 29 February: this calculator counts your birthday on 1 March in non-leap years.</p>}
          </div>

          {result.milestones.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Upcoming Milestones</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {result.milestones.map(m => (
                  <div key={m.age} className="rounded-xl border border-border p-3 text-center"><p className="text-lg font-bold text-primary">{m.age}</p><p className="text-xs text-muted-foreground">{m.year} &middot; {untilLabel(m.daysUntil)}</p></div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
