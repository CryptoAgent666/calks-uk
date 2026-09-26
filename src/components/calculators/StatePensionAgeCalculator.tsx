import { useState, useMemo } from 'react'

// State Pension age: Pensions Act 1995 Sch 4 Pt I as amended by the Pensions Acts 2007, 2011
// and 2014 (legislation.gov.uk, checked 26 Sep 2026). Each band runs from the 6th of one month to
// the 5th of the next, so a row [y, m, ...] covers births from 6 m/y to 5 (m+1)/y.

// Women born 6 Apr 1950 – 5 Dec 1953: day State Pension age is reached [birth y, m, SPA y, m] (6th)
const WOMEN_1950_1953: [number, number, number, number][] = [
  [1950, 4, 2010, 5], [1950, 5, 2010, 7], [1950, 6, 2010, 9], [1950, 7, 2010, 11], [1950, 8, 2011, 1], [1950, 9, 2011, 3],
  [1950, 10, 2011, 5], [1950, 11, 2011, 7], [1950, 12, 2011, 9], [1951, 1, 2011, 11], [1951, 2, 2012, 1], [1951, 3, 2012, 3],
  [1951, 4, 2012, 5], [1951, 5, 2012, 7], [1951, 6, 2012, 9], [1951, 7, 2012, 11], [1951, 8, 2013, 1], [1951, 9, 2013, 3],
  [1951, 10, 2013, 5], [1951, 11, 2013, 7], [1951, 12, 2013, 9], [1952, 1, 2013, 11], [1952, 2, 2014, 1], [1952, 3, 2014, 3],
  [1952, 4, 2014, 5], [1952, 5, 2014, 7], [1952, 6, 2014, 9], [1952, 7, 2014, 11], [1952, 8, 2015, 1], [1952, 9, 2015, 3],
  [1952, 10, 2015, 5], [1952, 11, 2015, 7], [1952, 12, 2015, 9], [1953, 1, 2015, 11], [1953, 2, 2016, 1], [1953, 3, 2016, 3],
  [1953, 4, 2016, 7], [1953, 5, 2016, 11], [1953, 6, 2017, 3], [1953, 7, 2017, 7], [1953, 8, 2017, 11], [1953, 9, 2018, 3],
  [1953, 10, 2018, 7], [1953, 11, 2018, 11],
]
// Everyone born 6 Dec 1953 – 5 Oct 1954 (the move to 66)
const BOTH_1953_1954: [number, number, number, number][] = [
  [1953, 12, 2019, 3], [1954, 1, 2019, 5], [1954, 2, 2019, 7], [1954, 3, 2019, 9], [1954, 4, 2019, 11],
  [1954, 5, 2020, 1], [1954, 6, 2020, 3], [1954, 7, 2020, 5], [1954, 8, 2020, 7], [1954, 9, 2020, 9],
]
// Born 6 Apr 1960 – 5 Mar 1961: 66 years plus this many months (Pensions Act 2014 s26)
const MONTHS_OVER_66: [number, number, number][] = [
  [1960, 4, 1], [1960, 5, 2], [1960, 6, 3], [1960, 7, 4], [1960, 8, 5], [1960, 9, 6],
  [1960, 10, 7], [1960, 11, 8], [1960, 12, 9], [1961, 1, 10], [1961, 2, 11],
]
// Born 6 Apr 1977 – 5 Apr 1978: day State Pension age is reached (the move to 68, Pensions Act 2007)
const BOTH_1977_1978: [number, number, number, number][] = [
  [1977, 4, 2044, 5], [1977, 5, 2044, 7], [1977, 6, 2044, 9], [1977, 7, 2044, 11], [1977, 8, 2045, 1], [1977, 9, 2045, 3],
  [1977, 10, 2045, 5], [1977, 11, 2045, 7], [1977, 12, 2045, 9], [1978, 1, 2045, 11], [1978, 2, 2046, 1], [1978, 3, 2046, 3],
]

const key = (y: number, m: number, d: number) => y * 10000 + m * 100 + d

// The band a birthday falls in: bands start on the 6th, so the 1st–5th belong to the previous month's band
function band<T extends number[]>(rows: T[], y: number, m: number, d: number): T | undefined {
  const [by, bm] = d >= 6 ? [y, m] : m === 1 ? [y - 1, 12] : [y, m - 1]
  return rows.find(r => r[0] === by && r[1] === bm)
}

// Birthday plus whole years and months; a day that doesn't exist in the target month becomes its last day
function addYearsMonths(y: number, m: number, d: number, years: number, months: number) {
  const total = (y + years) * 12 + (m - 1) + months
  const ty = Math.floor(total / 12), tm = total % 12
  const last = new Date(Date.UTC(ty, tm + 1, 0)).getUTCDate()
  return new Date(Date.UTC(ty, tm, Math.min(d, last)))
}

function calculate(dob: string, gender: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob)
  if (!m) return null
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const k = key(y, mo, d)

  let spaDate: Date
  let ageLabel: string
  if (k < key(1953, 12, 6) && (gender === 'male' || k < key(1950, 4, 6))) {
    const years = gender === 'male' ? 65 : 60
    spaDate = addYearsMonths(y, mo, d, years, 0); ageLabel = String(years)
  } else if (k < key(1953, 12, 6)) {
    const r = band(WOMEN_1950_1953, y, mo, d)!
    spaDate = new Date(Date.UTC(r[2], r[3] - 1, 6)); ageLabel = ''
  } else if (k < key(1954, 10, 6)) {
    const r = band(BOTH_1953_1954, y, mo, d)!
    spaDate = new Date(Date.UTC(r[2], r[3] - 1, 6)); ageLabel = ''
  } else if (k < key(1960, 4, 6)) {
    spaDate = addYearsMonths(y, mo, d, 66, 0); ageLabel = '66'
  } else if (k < key(1961, 3, 6)) {
    const extra = band(MONTHS_OVER_66, y, mo, d)![2]
    spaDate = addYearsMonths(y, mo, d, 66, extra); ageLabel = `66 years ${extra} month${extra > 1 ? 's' : ''}`
  } else if (k < key(1977, 4, 6)) {
    spaDate = addYearsMonths(y, mo, d, 67, 0); ageLabel = '67'
  } else if (k < key(1978, 4, 6)) {
    const r = band(BOTH_1977_1978, y, mo, d)!
    spaDate = new Date(Date.UTC(r[2], r[3] - 1, 6)); ageLabel = ''
  } else {
    spaDate = addYearsMonths(y, mo, d, 68, 0); ageLabel = '68'
  }

  // Age on the SPA date, for the rows set by a fixed date rather than an age
  if (!ageLabel) {
    let months = (spaDate.getUTCFullYear() - y) * 12 + (spaDate.getUTCMonth() + 1 - mo)
    if (spaDate.getUTCDate() < d) months -= 1
    const yrs = Math.floor(months / 12), mths = months % 12
    ageLabel = mths ? `${yrs} years ${mths} month${mths > 1 ? 's' : ''}` : String(yrs)
  }

  const now = new Date()
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const daysUntil = Math.max(0, Math.round((spaDate.getTime() - today) / 86_400_000))
  const yearsUntil = (daysUntil / 365.25).toFixed(1)
  const reached = today >= spaDate.getTime()

  const fmt = (dt: Date) => dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

  return { spaAge: ageLabel, spaDate: fmt(spaDate), daysUntil, yearsUntil, reached }
}

export default function StatePensionAgeCalculator() {
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('male')
  const result = useMemo(() => calculate(dob, gender), [dob, gender])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Date of Birth</label><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Date of Birth" /></div>
        <div><label className="block text-sm font-medium mb-2">Gender <span className="font-normal text-muted-foreground">(only matters if born before 6 Dec 1953)</span></label><div className="grid grid-cols-2 gap-2"><button onClick={() => setGender('male')} className={`px-4 py-3 rounded-xl text-sm font-medium border ${gender === 'male' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Male</button><button onClick={() => setGender('female')} className={`px-4 py-3 rounded-xl text-sm font-medium border ${gender === 'female' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Female</button></div></div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.reached ? 'bg-green-100 dark:bg-green-950' : 'bg-primary/10'}`}>
            {result.reached ? (
              <><p className="text-lg font-bold text-green-700 dark:text-green-400">You've reached State Pension age!</p><p className="text-sm text-muted-foreground mt-1">You reached it on {result.spaDate}, at {result.spaAge}</p></>
            ) : (
              <><p className="text-sm text-muted-foreground">Your State Pension Age</p><p className="text-4xl font-bold text-primary mt-1">{result.spaAge}</p><p className="text-sm text-muted-foreground mt-1">{result.spaDate}</p><p className="text-sm text-muted-foreground">{result.daysUntil.toLocaleString()} days ({result.yearsUntil} years) to go</p></>
            )}
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Current UK State Pension ages:</p>
            <p>Born 6 October 1954 – 5 April 1960: <span className="font-medium text-foreground">66</span></p>
            <p>Born 6 April 1960 – 5 March 1961: <span className="font-medium text-foreground">66 plus 1 to 11 months</span> (reached from May 2026)</p>
            <p>Born 6 March 1961 – 5 April 1977: <span className="font-medium text-foreground">67</span></p>
            <p>Born 6 April 1977 – 5 April 1978: <span className="font-medium text-foreground">between 67 and 68</span> (2044 to 2046)</p>
            <p>Born after 5 April 1978: <span className="font-medium text-foreground">68</span> (the timing is under review)</p>
            <p className="mt-1">Check your exact date at gov.uk/state-pension-age</p>
          </div>
        </div>
      )}
    </div>
  )
}
