import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Auto-enrolment minimums
const MIN_EMPLOYEE = 5
const MIN_EMPLOYER = 3
const MIN_TOTAL = 8
const QUALIFYING_LOWER = 6_240
const QUALIFYING_UPPER = 50_270

function calculate(salary: number, employeePct: number, employerPct: number) {
  const qualifyingEarnings = Math.max(0, Math.min(salary, QUALIFYING_UPPER) - QUALIFYING_LOWER)
  const employeeContrib = qualifyingEarnings * (employeePct / 100)
  const employerContrib = qualifyingEarnings * (employerPct / 100)
  const totalContrib = employeeContrib + employerContrib
  const taxRelief = employeeContrib * 0.25 // basic rate added by provider (relief at source)

  const monthlyEmployee = employeeContrib / 12
  const monthlyEmployer = employerContrib / 12
  const monthlyTotal = totalContrib / 12

  return { qualifyingEarnings, employeeContrib, employerContrib, totalContrib, taxRelief, monthlyEmployee, monthlyEmployer, monthlyTotal, grossInPension: totalContrib + taxRelief }
}

export default function EmployerPensionCalculator() {
  const [salary, setSalary] = useState('30000')
  const [empPct, setEmpPct] = useState('5')
  const [erPct, setErPct] = useState('3')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const ep = parseFloat(empPct) || 0
  const er = parseFloat(erPct) || 0
  const result = useMemo(() => calculate(s, ep, er), [s, ep, er])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Your Contribution (%)</label><input type="number" min="0" max="50" step="0.5" value={empPct} onChange={(e) => setEmpPct(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /><p className="text-xs text-muted-foreground mt-1">Min {MIN_EMPLOYEE}%</p></div>
        <div><label className="block text-sm font-medium mb-2">Employer Contribution (%)</label><input type="number" min="0" max="50" step="0.5" value={erPct} onChange={(e) => setErPct(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /><p className="text-xs text-muted-foreground mt-1">Min {MIN_EMPLOYER}%</p></div>
      </div>

      {s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Going Into Your Pension</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.grossInPension)}/year</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.grossInPension / 12)}/month</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Your contribution ({empPct}%)</td><td className="text-right tabular-nums">{formatCurrency(result.employeeContrib)}</td><td className="text-right tabular-nums text-muted-foreground">{formatCurrency(result.monthlyEmployee)}/mo</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-green-600">Employer contribution ({erPct}%)</td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.employerContrib)}</td><td className="text-right tabular-nums text-muted-foreground">{formatCurrency(result.monthlyEmployer)}/mo</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-green-600">Tax relief (20%)</td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.taxRelief)}</td><td></td></tr>
              <tr className="font-semibold"><td className="py-2">Total in pension</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.grossInPension)}</td><td></td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Auto-enrolment minimums: {MIN_EMPLOYEE}% employee + {MIN_EMPLOYER}% employer = {MIN_TOTAL}% total on qualifying earnings (£{QUALIFYING_LOWER.toLocaleString()} – £{QUALIFYING_UPPER.toLocaleString()}).</p>
          </div>
        </div>
      )}
    </div>
  )
}
