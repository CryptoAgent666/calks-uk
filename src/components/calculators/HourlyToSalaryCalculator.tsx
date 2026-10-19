import { useState, useMemo } from 'react'
import { formatCurrency, ukIncomeTax, ukPersonalAllowance } from '@/utils'

// Employee Class 1 NI 2026/27 on an annual basis: 8% between the £12,570
// primary threshold and the £50,270 upper earnings limit, 2% above
function employeeNI(annual: number) {
  if (annual <= 12_570) return 0
  if (annual <= 50_270) return (annual - 12_570) * 0.08
  return (50_270 - 12_570) * 0.08 + (annual - 50_270) * 0.02
}

// Scottish Income Tax 2026/27 (non-savings income), same bands as the take-home pay calculator.
// Limits are gross pay for someone with the full £12,570 allowance.
const PERSONAL_ALLOWANCE = 12_570
const TOP_RATE_START = 125_140
const SCOTTISH_BANDS = [
  { rate: 0.19, from: 12_570, to: 16_537 },
  { rate: 0.20, from: 16_537, to: 29_526 },
  { rate: 0.21, from: 29_526, to: 43_662 },
  { rate: 0.42, from: 43_662, to: 75_000 },
  { rate: 0.45, from: 75_000, to: 125_140 },
  { rate: 0.48, from: 125_140, to: Infinity },
]

function scottishTax(gross: number): number {
  // Scottish bands apply to taxable income (after the Personal Allowance), so when the
  // allowance tapers above £100k every threshold moves down with it. £125,140 needs no
  // conversion: the allowance is nil there, so gross and taxable income coincide.
  const toTaxable = (limit: number) => (limit >= TOP_RATE_START ? limit : limit - PERSONAL_ALLOWANCE)
  const taxable = Math.max(0, gross - ukPersonalAllowance(gross))
  let tax = 0
  for (const band of SCOTTISH_BANDS) {
    const from = toTaxable(band.from)
    const to = toTaxable(band.to)
    if (taxable > from) tax += (Math.min(taxable, to) - from) * band.rate
  }
  return tax
}

// National Minimum Wage rates from 1 April 2026 (gov.uk/national-minimum-wage-rates)
const NLW_21_PLUS = 12.71
const NMW_18_20 = 10.85
const NMW_UNDER_18_APPRENTICE = 8.0

const MAX_HOURS = 80
const MAX_WEEKS = 52.14 // 365 ÷ 7

type Region = 'ruk' | 'scotland'

function calculate(hourlyRate: number, hoursPerWeek: number, weeksPerYear: number, daysPerWeek: number, region: Region) {
  const annual = hourlyRate * hoursPerWeek * weeksPerYear
  const monthly = annual / 12
  const weekly = hourlyRate * hoursPerWeek
  const daily = weekly / daysPerWeek

  // Take-home 2026/27, no pension or student loan
  const tax = region === 'scotland' ? scottishTax(annual) : ukIncomeTax(annual)
  const ni = employeeNI(annual)
  const takeHome = annual - tax - ni

  // Compare in whole pence so an exact £12.71 is not flagged by float rounding
  const pence = Math.round(hourlyRate * 100)
  const belowNLW = pence < Math.round(NLW_21_PLUS * 100)
  const belowAllNMW = pence < Math.round(NMW_UNDER_18_APPRENTICE * 100)

  return { hourlyRate, annual, monthly, weekly, daily, tax, ni, takeHome, monthlyTakeHome: takeHome / 12, belowNLW, belowAllNMW }
}

function reverseCalc(annual: number, hoursPerWeek: number, weeksPerYear: number) {
  const hourly = annual / (hoursPerWeek * weeksPerYear)
  return hourly
}

export default function HourlyToSalaryCalculator() {
  const [mode, setMode] = useState<'hourly' | 'annual'>('hourly')
  const [region, setRegion] = useState<Region>('ruk')
  const [hourly, setHourly] = useState('')
  const [annual, setAnnual] = useState('')
  const [hours, setHours] = useState('37.5')
  const [days, setDays] = useState('5')
  const [weeks, setWeeks] = useState('52')

  const h = parseFloat(hourly) || 0
  const a = parseFloat(annual.replace(/,/g, '')) || 0
  const hw = parseFloat(hours) || 0
  const dw = parseFloat(days) || 0
  const wk = parseFloat(weeks) || 0

  // Validate rather than silently swapping in defaults
  const error =
    hw <= 0 || hw > MAX_HOURS ? `Enter hours per week between 1 and ${MAX_HOURS}.`
    : dw <= 0 || dw > 7 ? 'Enter days per week between 1 and 7.'
    : wk <= 0 || wk > MAX_WEEKS ? `Enter paid weeks per year between 1 and ${MAX_WEEKS} (365 days ÷ 7).`
    : null

  const result = useMemo(() => {
    if (error) return null
    if (mode === 'hourly' && h > 0) return calculate(h, hw, wk, dw, region)
    if (mode === 'annual' && a > 0) {
      const rate = reverseCalc(a, hw, wk)
      return calculate(rate, hw, wk, dw, region)
    }
    return null
  }, [mode, h, a, hw, wk, dw, region, error])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setMode('hourly')} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${mode === 'hourly' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Hourly → Annual</button>
        <button onClick={() => setMode('annual')} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${mode === 'annual' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Annual → Hourly</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mode === 'hourly' ? (
          <div>
            <label className="block text-sm font-medium mb-2">Hourly Rate</label>
            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
              <input type="number" min="0" step="0.01" value={hourly} onChange={(e) => setHourly(e.target.value)} placeholder="15.00" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hourly Rate" /></div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">Annual Salary</label>
            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
              <input type="text" inputMode="numeric" value={annual} onChange={(e) => setAnnual(e.target.value)} placeholder="35,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2">Hours per Week</label>
          <input type="number" min="1" max={MAX_HOURS} step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours per Week" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Days per Week</label>
          <input type="number" min="1" max="7" step="0.5" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Days per Week" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Paid Weeks per Year</label>
          <input type="number" min="1" max={MAX_WEEKS} step="any" value={weeks} onChange={(e) => setWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Paid Weeks per Year" />
        </div>
      </div>

      <div>
        <p className="block text-sm font-medium mb-2">Income tax rates</p>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Income tax rates">
          <button type="button" onClick={() => setRegion('ruk')} aria-pressed={region === 'ruk'} className={`px-3 py-2.5 rounded-xl text-sm font-medium border ${region === 'ruk' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>England, Wales &amp; NI</button>
          <button type="button" onClick={() => setRegion('scotland')} aria-pressed={region === 'scotland'} className={`px-3 py-2.5 rounded-xl text-sm font-medium border ${region === 'scotland' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Scotland</button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-orange-300 bg-orange-50 dark:bg-orange-950/40 dark:border-orange-900 p-4 text-sm text-orange-800 dark:text-orange-300" role="alert">{error}</div>
      )}

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Hourly</p><p className="text-xl font-bold text-primary">{formatCurrency(result.hourlyRate)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Daily ({dw}-day week)</p><p className="text-lg font-bold">{formatCurrency(result.daily)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly</p><p className="text-lg font-bold">{formatCurrency(result.monthly)}</p></div>
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Annual</p><p className="text-xl font-bold text-primary">{formatCurrency(result.annual)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Income Tax{region === 'scotland' ? ' (Scotland)' : ''}</p><p className="text-lg font-bold">{formatCurrency(result.tax)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">National Insurance</p><p className="text-lg font-bold">{formatCurrency(result.ni)}</p></div>
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly Take-Home</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.monthlyTakeHome)}</p></div>
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Take-Home</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.takeHome)}</p></div>
          {result.belowNLW && (
            <div className="col-span-2 sm:col-span-4 rounded-xl border border-orange-300 bg-orange-50 dark:bg-orange-950/40 dark:border-orange-900 p-4 text-sm text-orange-800 dark:text-orange-300" role="alert">
              {result.belowAllNMW
                ? <>£{result.hourlyRate.toFixed(2)} an hour is below every National Minimum Wage rate, including the £{NMW_UNDER_18_APPRENTICE.toFixed(2)} apprentice and under-18 rate.</>
                : <>£{result.hourlyRate.toFixed(2)} an hour is below the National Living Wage of £{NLW_21_PLUS.toFixed(2)} for workers aged 21 and over (from 1 April 2026). Lower minimums apply at 18 to 20 (£{NMW_18_20.toFixed(2)}) and for under-18s and apprentices (£{NMW_UNDER_18_APPRENTICE.toFixed(2)}).</>}
            </div>
          )}
          <p className="col-span-2 sm:col-span-4 text-xs text-muted-foreground">Take-home uses 2026/27 income tax ({region === 'scotland' ? 'Scottish rates' : 'England, Wales and Northern Ireland'}) and employee National Insurance, with no pension or student loan deductions. Reduce the weeks per year for any unpaid weeks off.</p>
        </div>
      )}
    </div>
  )
}
