import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Deductions are shown for a basic-rate taxpayer whose weekly pay, overtime included, stays below
// the £967 upper earnings limit (2026/27): income tax 20%, employee Class 1 NI 8%.
const BASIC_RATE = 0.20
const NI_MAIN_RATE = 0.08
const WEEKLY_UEL = 967

function calculate(annualSalary: number, hoursPerWeek: number, overtimeHours: number, overtimeRate: number) {
  const hourlyRate = annualSalary / (hoursPerWeek * 52)
  const overtimeHourlyRate = hourlyRate * overtimeRate
  const weeklyOvertime = overtimeHours * overtimeHourlyRate
  const monthlyOvertime = weeklyOvertime * 52 / 12
  const annualOvertime = weeklyOvertime * 52
  const totalAnnual = annualSalary + annualOvertime

  const taxOnOvertime = weeklyOvertime * BASIC_RATE
  const niOnOvertime = weeklyOvertime * NI_MAIN_RATE
  const netWeeklyOvertime = weeklyOvertime - taxOnOvertime - niOnOvertime
  const weeklyPayWithOvertime = annualSalary / 52 + weeklyOvertime

  return {
    hourlyRate, overtimeHourlyRate, weeklyOvertime, monthlyOvertime, annualOvertime, totalAnnual,
    taxOnOvertime, niOnOvertime, netWeeklyOvertime,
    aboveUel: weeklyPayWithOvertime > WEEKLY_UEL,
  }
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function OvertimeCalculator() {
  const [salary, setSalary] = useState('30000')
  const [hours, setHours] = useState('37.5')
  const [otHours, setOtHours] = useState('5')
  const [otRate, setOtRate] = useState('1.5')
  const [customRate, setCustomRate] = useState('1.5')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const h = parseFloat(hours) || 37.5
  const oh = parseFloat(otHours) || 0
  const or_ = otRate === 'custom' ? (parseFloat(customRate) || 1) : (parseFloat(otRate) || 1)
  const result = useMemo(() => calculate(s, h, oh, or_), [s, h, oh, or_])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label htmlFor="ot-salary" className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input id="ot-salary" type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className={`${inputClass} px-8`} aria-label="Annual Salary" /></div></div>
        <div><label htmlFor="ot-hours" className="block text-sm font-medium mb-2">Standard Hours/Week</label><input id="ot-hours" type="number" min="1" max="60" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className={inputClass} aria-label="Standard Hours/Week" /></div>
        <div><label htmlFor="ot-othours" className="block text-sm font-medium mb-2">Overtime Hours/Week</label><input id="ot-othours" type="number" min="0" max="40" step="0.5" value={otHours} onChange={(e) => setOtHours(e.target.value)} className={inputClass} aria-label="Overtime Hours/Week" /></div>
        <div><label htmlFor="ot-rate" className="block text-sm font-medium mb-2">Overtime Rate</label><select id="ot-rate" value={otRate} onChange={(e) => setOtRate(e.target.value)} className={inputClass} aria-label="Overtime Rate"><option value="1">1x (standard)</option><option value="1.25">1.25x</option><option value="1.5">1.5x (time and a half)</option><option value="2">2x (double time)</option><option value="custom">Custom multiplier</option></select></div>
        {otRate === 'custom' && (
          <div><label htmlFor="ot-custom" className="block text-sm font-medium mb-2">Custom Multiplier (× hourly rate)</label><input id="ot-custom" type="number" min="1" max="5" step="0.05" value={customRate} onChange={(e) => setCustomRate(e.target.value)} className={inputClass} aria-label="Custom Multiplier" /></div>
        )}
      </div>

      {s > 0 && oh > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Standard Rate</p><p className="text-lg font-bold">{formatCurrency(result.hourlyRate)}/hr</p></div>
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Overtime Rate ({or_}x)</p><p className="text-lg font-bold text-primary">{formatCurrency(result.overtimeHourlyRate)}/hr</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Weekly Overtime (gross)</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.weeklyOvertime)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Extra (gross)</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.annualOvertime)}</p></div>
          </div>
          <div className="rounded-xl bg-primary/10 p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Annual Earnings (salary + overtime, gross)</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(result.totalAnnual)}</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Weekly overtime (gross)</td><td className="text-right tabular-nums">{formatCurrency(result.weeklyOvertime)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income tax at 20%</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.taxOnOvertime)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Employee NI at 8%</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.niOnOvertime)}</td></tr>
              <tr className="font-semibold"><td className="py-2 text-primary">Net overtime per week</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.netWeeklyOvertime)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Deductions assume a basic-rate taxpayer whose weekly pay, overtime included, stays below the £{WEEKLY_UEL} upper earnings limit, with no student loan or pension. {result.aboveUel ? 'Your weekly pay with overtime is above £967, so part of it would be taxed at 40% with NI at 2%; use the take-home pay calculator for the exact figure.' : 'Because PAYE is cumulative, a heavy month can be deducted at a higher rate on the payslip and settle back later in the tax year.'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
