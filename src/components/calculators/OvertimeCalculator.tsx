import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(annualSalary: number, hoursPerWeek: number, overtimeHours: number, overtimeRate: number) {
  const hourlyRate = annualSalary / (hoursPerWeek * 52)
  const overtimeHourlyRate = hourlyRate * overtimeRate
  const weeklyOvertime = overtimeHours * overtimeHourlyRate
  const monthlyOvertime = weeklyOvertime * 52 / 12
  const annualOvertime = weeklyOvertime * 52
  const totalAnnual = annualSalary + annualOvertime

  return { hourlyRate, overtimeHourlyRate, weeklyOvertime, monthlyOvertime, annualOvertime, totalAnnual }
}

export default function OvertimeCalculator() {
  const [salary, setSalary] = useState('30000')
  const [hours, setHours] = useState('37.5')
  const [otHours, setOtHours] = useState('5')
  const [otRate, setOtRate] = useState('1.5')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const h = parseFloat(hours) || 37.5
  const oh = parseFloat(otHours) || 0
  const or_ = parseFloat(otRate) || 1
  const result = useMemo(() => calculate(s, h, oh, or_), [s, h, oh, or_])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Standard Hours/Week</label><input type="number" min="1" max="60" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Standard Hours/Week" /></div>
        <div><label className="block text-sm font-medium mb-2">Overtime Hours/Week</label><input type="number" min="0" max="40" step="0.5" value={otHours} onChange={(e) => setOtHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Overtime Hours/Week" /></div>
        <div><label className="block text-sm font-medium mb-2">Overtime Rate</label><select value={otRate} onChange={(e) => setOtRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Overtime Rate"><option value="1">1x (standard)</option><option value="1.25">1.25x</option><option value="1.5">1.5x (time and a half)</option><option value="2">2x (double time)</option></select></div>
      </div>

      {s > 0 && oh > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Standard Rate</p><p className="text-lg font-bold">{formatCurrency(result.hourlyRate)}/hr</p></div>
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Overtime Rate</p><p className="text-lg font-bold text-primary">{formatCurrency(result.overtimeHourlyRate)}/hr</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Weekly Overtime</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.weeklyOvertime)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Extra</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.annualOvertime)}</p></div>
          </div>
          <div className="rounded-xl bg-primary/10 p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Annual Earnings (salary + overtime)</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(result.totalAnnual)}</p>
          </div>
        </div>
      )}
    </div>
  )
}
