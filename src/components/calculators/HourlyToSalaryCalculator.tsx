import { useState, useMemo } from 'react'
import { formatCurrency, ukIncomeTax } from '@/utils'

// Employee Class 1 NI 2026/27 on an annual basis: 8% between the £12,570
// primary threshold and the £50,270 upper earnings limit, 2% above
function employeeNI(annual: number) {
  if (annual <= 12_570) return 0
  if (annual <= 50_270) return (annual - 12_570) * 0.08
  return (50_270 - 12_570) * 0.08 + (annual - 50_270) * 0.02
}

function calculate(hourlyRate: number, hoursPerWeek: number, weeksPerYear: number) {
  const annual = hourlyRate * hoursPerWeek * weeksPerYear
  const monthly = annual / 12
  const weekly = hourlyRate * hoursPerWeek
  const daily = weekly / 5

  // Take-home 2026/27, England, Wales and Northern Ireland tax bands, no pension or student loan
  const tax = ukIncomeTax(annual)
  const ni = employeeNI(annual)
  const takeHome = annual - tax - ni

  return { hourlyRate, annual, monthly, weekly, daily, tax, ni, takeHome, monthlyTakeHome: takeHome / 12 }
}

function reverseCalc(annual: number, hoursPerWeek: number, weeksPerYear: number) {
  const hourly = annual / (hoursPerWeek * weeksPerYear)
  return hourly
}

export default function HourlyToSalaryCalculator() {
  const [mode, setMode] = useState<'hourly' | 'annual'>('hourly')
  const [hourly, setHourly] = useState('')
  const [annual, setAnnual] = useState('')
  const [hours, setHours] = useState('37.5')
  const [weeks, setWeeks] = useState('52')

  const h = parseFloat(hourly) || 0
  const a = parseFloat(annual.replace(/,/g, '')) || 0
  const hw = parseFloat(hours) || 37.5
  const wk = parseFloat(weeks) || 52

  const result = useMemo(() => {
    if (mode === 'hourly' && h > 0) return calculate(h, hw, wk)
    if (mode === 'annual' && a > 0) {
      const rate = reverseCalc(a, hw, wk)
      return calculate(rate, hw, wk)
    }
    return null
  }, [mode, h, a, hw, wk])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setMode('hourly')} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${mode === 'hourly' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Hourly → Annual</button>
        <button onClick={() => setMode('annual')} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${mode === 'annual' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Annual → Hourly</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <input type="number" min="1" max="80" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours per Week" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Weeks per Year</label>
          <input type="number" min="1" max="52" value={weeks} onChange={(e) => setWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weeks per Year" />
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Hourly</p><p className="text-xl font-bold text-primary">{formatCurrency(result.hourlyRate)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Daily</p><p className="text-lg font-bold">{formatCurrency(result.daily)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly</p><p className="text-lg font-bold">{formatCurrency(result.monthly)}</p></div>
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Annual</p><p className="text-xl font-bold text-primary">{formatCurrency(result.annual)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Income Tax</p><p className="text-lg font-bold">{formatCurrency(result.tax)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">National Insurance</p><p className="text-lg font-bold">{formatCurrency(result.ni)}</p></div>
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly Take-Home</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.monthlyTakeHome)}</p></div>
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Take-Home</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.takeHome)}</p></div>
          <p className="col-span-2 sm:col-span-4 text-xs text-muted-foreground">Take-home uses 2026/27 income tax (England, Wales and Northern Ireland) and employee National Insurance, with no pension or student loan deductions. Reduce the weeks per year for any unpaid weeks off.</p>
        </div>
      )}
    </div>
  )
}
