import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

function calculate(chargeRate: number, hoursPerWeek: number, weeksPerYear: number, agencyMarginPct: number, isLtd: boolean) {
  const weeklyCharge = chargeRate * hoursPerWeek
  const annualCharge = weeklyCharge * weeksPerYear
  const agencyMargin = annualCharge * (agencyMarginPct / 100)
  const grossPay = annualCharge - agencyMargin

  // PAYE deductions
  let tax = 0
  if (grossPay > 12_570) {
    if (grossPay <= 50_270) tax = (grossPay - 12_570) * 0.20
    else tax = (50_270 - 12_570) * 0.20 + (grossPay - 50_270) * 0.40
  }
  let ni = 0
  if (grossPay > 12_570) {
    if (grossPay <= 50_270) ni = (grossPay - 12_570) * 0.08
    else ni = (50_270 - 12_570) * 0.08 + (grossPay - 50_270) * 0.02
  }
  const pension = grossPay * 0.05
  const takeHome = grossPay - tax - ni - pension

  const effectiveHourly = takeHome / (hoursPerWeek * weeksPerYear)

  return { annualCharge, agencyMargin, grossPay, tax, ni, pension, takeHome, effectiveHourly, weeklyTakeHome: takeHome / weeksPerYear }
}

export default function AgencyWorkerCalculator() {
  const [rate, setRate] = useState('18')
  const [hours, setHours] = useState('37.5')
  const [weeks, setWeeks] = useState('48')
  const [margin, setMargin] = useState('20')

  const r = parseFloat(rate) || 0
  const h = parseFloat(hours) || 0
  const w = parseInt(weeks) || 48
  const m = parseFloat(margin) || 0
  const result = useMemo(() => calculate(r, h, w, m, false), [r, h, w, m])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Charge Rate (£/hr)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" step="0.5" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Charge Rate (£/hr)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Hours/Week</label><input type="number" min="1" max="60" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours/Week" /></div>
        <div><label className="block text-sm font-medium mb-2">Weeks/Year</label><input type="number" min="1" max="52" value={weeks} onChange={(e) => setWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weeks/Year" /></div>
        <div><label className="block text-sm font-medium mb-2">Agency Margin (%)</label><input type="number" min="5" max="40" value={margin} onChange={(e) => setMargin(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Agency Margin (%)" /></div>
      </div>

      {r > 0 && h > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Annual Take-Home</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.takeHome)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.weeklyTakeHome)}/week &middot; Effective: {formatCurrency(result.effectiveHourly)}/hr</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Client pays (charge rate)</td><td className="text-right tabular-nums">{formatCurrency(result.annualCharge)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Agency margin ({margin}%)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.agencyMargin)}</td></tr>
              <tr className="border-b border-border font-medium"><td className="py-2">Your Gross Pay</td><td className="text-right tabular-nums">{formatCurrency(result.grossPay)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income Tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.tax)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">NI</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.ni)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Pension (5%)</td><td className="text-right tabular-nums">-{formatCurrency(result.pension)}</td></tr>
              <tr className="font-semibold"><td className="py-2 text-primary">Take-Home</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.takeHome)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>After 12 weeks in the same role, you have the right to equal pay and conditions as permanent staff (Agency Workers Regulations 2010).</p>
          </div>
        </div>
      )}
    </div>
  )
}
