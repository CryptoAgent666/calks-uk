import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(hourlyRate: number, avgHoursWeek: number, weeksPerYear: number) {
  const weeklyPay = hourlyRate * avgHoursWeek
  const annualPay = weeklyPay * weeksPerYear
  const monthlyPay = annualPay / 12
  const holidayPay = annualPay * 0.1207 // 12.07% accrued holiday

  // NMW check
  const nmw = 12.21
  const meetsNMW = hourlyRate >= nmw

  // Tax & NI (simplified)
  let tax = 0
  if (annualPay > 12_570) {
    if (annualPay <= 50_270) tax = (annualPay - 12_570) * 0.20
    else tax = (50_270 - 12_570) * 0.20 + (annualPay - 50_270) * 0.40
  }
  let ni = 0
  if (annualPay > 12_570) {
    if (annualPay <= 50_270) ni = (annualPay - 12_570) * 0.08
    else ni = (50_270 - 12_570) * 0.08 + (annualPay - 50_270) * 0.02
  }
  const takeHome = annualPay - tax - ni

  return { weeklyPay, monthlyPay, annualPay, holidayPay, meetsNMW, nmw, tax, ni, takeHome }
}

export default function ZeroHoursCalculator() {
  const [rate, setRate] = useState('12.21')
  const [hours, setHours] = useState('20')
  const [weeks, setWeeks] = useState('48')

  const r = parseFloat(rate) || 0
  const h = parseFloat(hours) || 0
  const w = parseInt(weeks) || 48
  const result = useMemo(() => calculate(r, h, w), [r, h, w])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Hourly Rate</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>{!result.meetsNMW && r > 0 && <p className="text-xs text-destructive mt-1">Below NMW (£{result.nmw}/hr)</p>}</div>
        <div><label className="block text-sm font-medium mb-2">Average Hours/Week</label><input type="number" min="0" max="60" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Weeks Worked/Year</label><input type="number" min="1" max="52" value={weeks} onChange={(e) => setWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {r > 0 && h > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Annual Take-Home</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.takeHome)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.takeHome / 12)}/month &middot; {formatCurrency(result.weeklyPay)}/week gross</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Annual Gross</p><p className="text-lg font-bold">{formatCurrency(result.annualPay)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-3 text-center"><p className="text-xs text-muted-foreground">Income Tax</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.tax)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-3 text-center"><p className="text-xs text-muted-foreground">NI</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.ni)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Holiday Pay (12.07%)</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.holidayPay)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Zero-hours workers are entitled to: NMW (£{result.nmw}/hr for 21+), 5.6 weeks holiday (accrued at 12.07%), rest breaks, protection from discrimination. Employer cannot require exclusivity.</p>
          </div>
        </div>
      )}
    </div>
  )
}
