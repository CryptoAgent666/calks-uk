import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const RATES_2025: Record<string, { rate: number; name: string }> = {
  '21plus': { rate: 12.71, name: 'National Living Wage (21+)' },
  '18to20': { rate: 10.85, name: 'Age 18-20' },
  'under18': { rate: 8.00, name: 'Under 18' },
  'apprentice': { rate: 8.00, name: 'Apprentice' },
}

function calculate(ageGroup: string, hoursPerWeek: number) {
  const info = RATES_2025[ageGroup] || RATES_2025['21plus']
  const weekly = info.rate * hoursPerWeek
  const monthly = weekly * 52 / 12
  const annual = weekly * 52

  return { rate: info.rate, name: info.name, weekly, monthly, annual, dailyFT: info.rate * 8 }
}

// Optional check of the hourly rate actually paid against the minimum for the
// age group. Positive margins mean pay is above the legal floor; negative
// margins are the shortfall the employer owes.
function checkPay(ageGroup: string, hoursPerWeek: number, hourlyPay: number) {
  const { rate } = calculate(ageGroup, hoursPerWeek)
  const perHour = Math.round((hourlyPay - rate) * 100) / 100
  const weekly = perHour * hoursPerWeek
  return { meets: perHour >= 0, perHour, weekly, annual: weekly * 52 }
}

export default function MinimumWageCalculator() {
  const [age, setAge] = useState('21plus')
  const [hours, setHours] = useState('40')
  const [pay, setPay] = useState('')

  const h = parseFloat(hours) || 0
  const p = parseFloat(pay.replace(/[£,]/g, '')) || 0
  const result = useMemo(() => calculate(age, h), [age, h])
  const check = useMemo(() => (p > 0 ? checkPay(age, h, p) : null), [age, h, p])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Age Group</label><select value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Age Group">{Object.entries(RATES_2025).map(([k,v]) => <option key={k} value={k}>{v.name} (£{v.rate.toFixed(2)}/hr)</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Hours/Week</label><input type="number" min="1" max="60" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours/Week" /></div>
        <div><label className="block text-sm font-medium mb-2">Your Hourly Pay (optional)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="decimal" placeholder="e.g. 12.50" value={pay} onChange={(e) => setPay(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Your Hourly Pay (optional)" /></div></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
        <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Hourly</p><p className="text-xl font-bold text-primary">£{result.rate.toFixed(2)}</p></div>
        <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Weekly</p><p className="text-lg font-bold">{formatCurrency(result.weekly)}</p></div>
        <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly</p><p className="text-lg font-bold">{formatCurrency(result.monthly)}</p></div>
        <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annual</p><p className="text-lg font-bold">{formatCurrency(result.annual)}</p></div>
      </div>
      {check && (
        check.meets ? (
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-sm">
            <p className="font-medium text-green-800 dark:text-green-300">£{p.toFixed(2)}/hour meets the {result.name} rate of £{result.rate.toFixed(2)}</p>
            <p className="text-green-700 dark:text-green-400 mt-1">{check.perHour > 0 ? `That is £${check.perHour.toFixed(2)}/hour above the minimum: ${formatCurrency(check.weekly)} a week or ${formatCurrency(check.annual)} a year on ${h} hours.` : 'You are paid exactly the legal minimum for your age group.'}</p>
          </div>
        ) : (
          <div className="rounded-xl bg-destructive/10 p-4 text-sm">
            <p className="font-medium text-destructive">£{p.toFixed(2)}/hour is below the {result.name} rate of £{result.rate.toFixed(2)}</p>
            <p className="text-muted-foreground mt-1">Shortfall: £{(-check.perHour).toFixed(2)}/hour, which is {formatCurrency(-check.weekly)} a week or {formatCurrency(-check.annual)} a year on {h} hours. Check that every hour you work is counted, then raise it with your employer or report it to ACAS on 0300 123 1100.</p>
          </div>
        )
      )}
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">2026/27 National Minimum/Living Wage rates:</p>
        {Object.entries(RATES_2025).map(([,v]) => <p key={v.name}>{v.name}: <span className="font-medium text-foreground">£{v.rate.toFixed(2)}/hour</span></p>)}
      </div>
    </div>
  )
}
