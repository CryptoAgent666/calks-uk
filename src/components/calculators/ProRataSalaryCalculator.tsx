import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Pro-rata pay from a full-time-equivalent (FTE) salary.
// Part-time: salary scales by the hours ratio.
// Term-time-only (TTO): scales by hours ratio AND paid weeks. Statutory
// holiday accrues at 5.6/46.4 of weeks worked; most employers (and local
// authorities for school staff) annualise over 52.14 weeks (365 ÷ 7).
// The weekly and hourly figures use 52 weeks, the same basis as the
// hourly-to-salary calculator, so a full-time salary at the National Living
// Wage (£12.71 × 37.5 × 52 = £24,784.50) shows as £12.71 an hour.
const HOLIDAY_ACCRUAL = 5.6 / 46.4
const YEAR_WEEKS = 52.14
const PAY_WEEKS = 52
const MAX_WEEKS_WORKED = 48

// National Minimum Wage rates from 1 April 2026 (gov.uk/national-minimum-wage-rates)
const NLW_21_PLUS = 12.71
const NMW_18_20 = 10.85
const NMW_UNDER_18_APPRENTICE = 8.0

type Mode = 'part-time' | 'term-time'

function calculate(fte: number, ftHours: number, hours: number, weeksWorked: number, mode: Mode) {
  if (fte <= 0 || ftHours <= 0 || hours <= 0) return { error: 'Enter a full-time salary, full-time weekly hours and your weekly hours, all above zero.', result: null }
  if (mode === 'term-time' && (weeksWorked <= 0 || weeksWorked > MAX_WEEKS_WORKED)) {
    return { error: `Enter between 1 and ${MAX_WEEKS_WORKED} weeks worked a year. A school year is typically 38 to 39 weeks.`, result: null }
  }
  const hoursRatio = Math.min(hours / ftHours, 2)

  let annual: number
  let paidWeeks = YEAR_WEEKS
  let holidayWeeks = 0
  if (mode === 'term-time') {
    holidayWeeks = weeksWorked * HOLIDAY_ACCRUAL
    paidWeeks = weeksWorked + holidayWeeks
    annual = fte * hoursRatio * (paidWeeks / YEAR_WEEKS)
  } else {
    annual = fte * hoursRatio
  }

  const monthly = annual / 12
  const weekly = annual / PAY_WEEKS
  const hourly = fte / (ftHours * PAY_WEEKS)
  const fteFraction = annual / fte
  // Statutory minimum holiday for part-time staff, expressed in hours
  const holidayHours = 5.6 * hours
  // Compare in whole pence so £24,784.50 on 37.5 hours (exactly £12.71) is not flagged by float rounding
  const pence = Math.round(hourly * 100)
  const belowNLW = pence < Math.round(NLW_21_PLUS * 100)
  const belowAllNMW = pence < Math.round(NMW_UNDER_18_APPRENTICE * 100)

  return { error: null, result: { annual, monthly, weekly, hourly, fteFraction, paidWeeks, holidayWeeks, holidayHours, belowNLW, belowAllNMW } }
}

export default function ProRataSalaryCalculator() {
  const [mode, setMode] = useState<Mode>('part-time')
  const [fte, setFte] = useState('35,000')
  const [ftHours, setFtHours] = useState('37.5')
  const [hours, setHours] = useState('22.5')
  const [weeks, setWeeks] = useState('39')

  const f = parseFloat(fte.replace(/,/g, '')) || 0
  const fh = parseFloat(ftHours) || 0
  const h = parseFloat(hours) || 0
  const w = parseFloat(weeks) || 0
  const { result, error } = useMemo(() => calculate(f, fh, h, w, mode), [f, fh, h, w, mode])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setMode('part-time')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${mode === 'part-time' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Part-time</button>
        <button onClick={() => setMode('term-time')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${mode === 'term-time' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Term-time only</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full-Time Salary (FTE)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={fte} onChange={(e) => setFte(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Full-Time Salary (FTE)" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Full-Time Hours/Week</label>
          <input type="number" min="1" max="60" step="0.5" value={ftHours} onChange={(e) => setFtHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Full-Time Hours per Week" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Your Hours/Week</label>
          <input type="number" min="1" max="60" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Your Hours per Week" />
        </div>
        {mode === 'term-time' && (
          <div>
            <label className="block text-sm font-medium mb-2">Weeks Worked/Year</label>
            <input type="number" min="1" max={MAX_WEEKS_WORKED} step="0.5" value={weeks} onChange={(e) => setWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Weeks Worked per Year" />
            <p className="text-xs text-muted-foreground mt-1">School year is typically 38–39 weeks</p>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-orange-300 bg-orange-50 dark:bg-orange-950/40 dark:border-orange-900 p-4 text-sm text-orange-800 dark:text-orange-300" role="alert">{error}</div>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Your Pro-Rata Salary</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.annual)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {(result.fteFraction * 100).toFixed(1)}% of full-time · {formatCurrency(result.monthly)}/month paid across 12 months
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Monthly</p><p className="text-lg font-bold">{formatCurrency(result.monthly)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Weekly (÷ 52)</p><p className="text-lg font-bold">{formatCurrency(result.weekly)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Hourly</p><p className="text-lg font-bold">{`£${result.hourly.toFixed(2)}`}</p></div>
          </div>
          <p className="text-xs text-muted-foreground">Hourly rate = full-time salary ÷ (full-time hours × 52 weeks). It is the same for part-time and full-time staff in the role.</p>

          {result.belowNLW && (
            <div className="rounded-xl border border-orange-300 bg-orange-50 dark:bg-orange-950/40 dark:border-orange-900 p-4 text-sm text-orange-800 dark:text-orange-300" role="alert">
              {result.belowAllNMW
                ? <>£{result.hourly.toFixed(2)} an hour is below every National Minimum Wage rate, including the £{NMW_UNDER_18_APPRENTICE.toFixed(2)} apprentice and under-18 rate. Check the salary and hours you entered.</>
                : <>£{result.hourly.toFixed(2)} an hour is below the National Living Wage of £{NLW_21_PLUS.toFixed(2)} for workers aged 21 and over (from 1 April 2026). Lower minimums apply at 18 to 20 (£{NMW_18_20.toFixed(2)}) and for under-18s and apprentices (£{NMW_UNDER_18_APPRENTICE.toFixed(2)}).</>}
            </div>
          )}

          {mode === 'term-time' ? (
            <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
              <p>
                Paid for <strong className="text-foreground">{result.paidWeeks.toFixed(1)} weeks</strong>: {w} weeks worked + {result.holidayWeeks.toFixed(1)} weeks statutory holiday
                (accrued at 5.6 ÷ 46.4 of worked weeks, taken during school holidays).
              </p>
              <p className="mt-1">Formula: FTE × (your hours ÷ full-time hours) × (paid weeks ÷ 52.14). Some employers use slightly different divisors, and contracts with more than the statutory 5.6 weeks of leave pay more, so check your contract.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
              <p>
                Statutory minimum holiday: <strong className="text-foreground">{result.holidayHours.toFixed(0)} hours</strong> per year
                (5.6 weeks × {h} hours) — the same 5.6-week entitlement as full-time staff, pro-rated by your hours.
              </p>
              <p className="mt-1">This is gross pay. See your net pay with the <a href="/calculator/take-home-pay-calculator/" className="text-primary underline">take-home pay calculator</a>.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
