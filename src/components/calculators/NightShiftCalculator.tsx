import { useState, useMemo } from 'react'
import { formatCurrency, ukIncomeTax } from '@/utils'

// 2026/27 employee Class 1 NI (8% main rate, 2% above £50,270).
function employeeNI(pay: number) {
  if (pay <= 12_570) return 0
  if (pay <= 50_270) return (pay - 12_570) * 0.08
  return (50_270 - 12_570) * 0.08 + (pay - 50_270) * 0.02
}

const netPay = (gross: number) => gross - ukIncomeTax(gross) - employeeNI(gross)

function calculate(baseSalary: number, nightShifts: number, nightHours: number, nightPremiumPct: number) {
  const hourlyBase = baseSalary / (37.5 * 52)
  const nightRate = hourlyBase * (1 + nightPremiumPct / 100)
  const nightPremium = (nightRate - hourlyBase) * nightHours * nightShifts * 52
  const totalAnnual = baseSalary + nightPremium
  const monthlyExtra = nightPremium / 12
  // What the premium adds to take-home once income tax and employee NI come off.
  const extraNet = netPay(totalAnnual) - netPay(baseSalary)

  return { hourlyBase, nightRate, nightPremium, totalAnnual, monthlyExtra, extraNet }
}

export default function NightShiftCalculator() {
  const [salary, setSalary] = useState('28000')
  const [shifts, setShifts] = useState('3')
  const [hours, setHours] = useState('8')
  const [premium, setPremium] = useState('25')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const sh = parseInt(shifts) || 0
  const h = parseFloat(hours) || 0
  const p = parseFloat(premium) || 0
  const result = useMemo(() => calculate(s, sh, h, p), [s, sh, h, p])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Base Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Base Annual Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Night Shifts/Week</label><input type="number" min="0" max="7" value={shifts} onChange={(e) => setShifts(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Night Shifts/Week" /></div>
        <div><label className="block text-sm font-medium mb-2">Hours/Night Shift</label><input type="number" min="1" max="12" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours/Night Shift" /></div>
        <div><label className="block text-sm font-medium mb-2">Night Premium (%)</label><select value={premium} onChange={(e) => setPremium(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Night Premium (%)"><option value="15">15% (low)</option><option value="25">25% (typical)</option><option value="33">33% (time + third)</option><option value="50">50% (time + half)</option><option value="100">100% (double time)</option></select></div>
      </div>

      {s > 0 && sh > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Night Shift Premium</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">+{formatCurrency(result.nightPremium)}/year</p>
            <p className="text-sm text-muted-foreground mt-1">+{formatCurrency(result.monthlyExtra)}/month gross &middot; about +{formatCurrency(result.extraNet / 12)}/month after income tax and NI</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Base Hourly</p><p className="text-lg font-bold">{formatCurrency(result.hourlyBase)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Night Hourly</p><p className="text-lg font-bold">{formatCurrency(result.nightRate)}</p></div>
            <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">Total Annual</p><p className="text-lg font-bold text-primary">{formatCurrency(result.totalAnnual)}</p></div>
          </div>
          <div className="rounded-xl bg-muted/50 p-3 text-center text-sm">Premium after income tax and employee NI: {formatCurrency(result.extraNet)}/year (2026/27 rates for England, Wales and Northern Ireland, before any pension or student loan)</div>
        </div>
      )}
    </div>
  )
}
