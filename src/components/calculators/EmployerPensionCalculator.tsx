import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Auto-enrolment minimums
const MIN_EMPLOYEE = 5
const MIN_EMPLOYER = 3
const MIN_TOTAL = 8
const QUALIFYING_LOWER = 6_240
const QUALIFYING_UPPER = 50_270
const AUTO_ENROL_TRIGGER = 10_000

type Basis = 'qualifying' | 'all'

function calculate(salary: number, employeePct: number, employerPct: number, basis: Basis = 'qualifying') {
  const qualifyingEarnings = Math.max(0, Math.min(salary, QUALIFYING_UPPER) - QUALIFYING_LOWER)
  const pensionablePay = basis === 'all' ? salary : qualifyingEarnings
  // The employee % is the gross contribution — under auto-enrolment it already includes basic-rate
  // tax relief. We split it into the part funded from take-home pay and the relief portion, rather
  // than adding relief on top (which would overstate the pot and break the 5%+3%=8% statement).
  const employeeContrib = pensionablePay * (employeePct / 100)
  const employerContrib = pensionablePay * (employerPct / 100)
  const totalContrib = employeeContrib + employerContrib
  const taxRelief = employeeContrib * 0.20 // basic-rate relief contained within the gross employee contribution
  const employeeNet = employeeContrib - taxRelief // what actually leaves your take-home pay

  const monthlyEmployee = employeeContrib / 12
  const monthlyEmployer = employerContrib / 12
  const monthlyTotal = totalContrib / 12

  return { qualifyingEarnings, pensionablePay, employeeContrib, employerContrib, totalContrib, taxRelief, employeeNet, monthlyEmployee, monthlyEmployer, monthlyTotal, grossInPension: totalContrib }
}

export default function EmployerPensionCalculator() {
  const [salary, setSalary] = useState('30000')
  const [empPct, setEmpPct] = useState('5')
  const [erPct, setErPct] = useState('3')
  const [basis, setBasis] = useState<Basis>('qualifying')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const ep = parseFloat(empPct) || 0
  const er = parseFloat(erPct) || 0
  const result = useMemo(() => calculate(s, ep, er, basis), [s, ep, er, basis])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Your Contribution (%)</label><input type="number" min="0" max="50" step="0.5" value={empPct} onChange={(e) => setEmpPct(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Contribution (%)" /><p className="text-xs text-muted-foreground mt-1">Usually {MIN_EMPLOYEE}%; can be less if your employer pays more than {MIN_EMPLOYER}%</p></div>
        <div><label className="block text-sm font-medium mb-2">Employer Contribution (%)</label><input type="number" min="0" max="50" step="0.5" value={erPct} onChange={(e) => setErPct(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Employer Contribution (%)" /><p className="text-xs text-muted-foreground mt-1">Min {MIN_EMPLOYER}%</p></div>
      </div>
      <div className="sm:w-1/2"><label className="block text-sm font-medium mb-2">Contributions Worked Out On</label><select value={basis} onChange={(e) => setBasis(e.target.value as Basis)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Contributions Worked Out On"><option value="qualifying">Qualifying earnings (£{QUALIFYING_LOWER.toLocaleString()} to £{QUALIFYING_UPPER.toLocaleString()})</option><option value="all">All pay</option></select><p className="text-xs text-muted-foreground mt-1">It depends on your scheme, so check with your employer</p></div>

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
              <tr className="border-b border-border/50 text-muted-foreground"><td className="py-1.5 pl-4 text-xs">— from your take-home pay</td><td className="text-right tabular-nums text-xs">{formatCurrency(result.employeeNet)}</td><td></td></tr>
              <tr className="border-b border-border/50 text-muted-foreground"><td className="py-1.5 pl-4 text-xs">— basic-rate tax relief (20%)</td><td className="text-right tabular-nums text-xs text-green-600">{formatCurrency(result.taxRelief)}</td><td></td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-green-600">Employer contribution ({erPct}%)</td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.employerContrib)}</td><td className="text-right tabular-nums text-muted-foreground">{formatCurrency(result.monthlyEmployer)}/mo</td></tr>
              <tr className="font-semibold"><td className="py-2">Total in pension</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.grossInPension)}</td><td></td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Auto-enrolment minimum: {MIN_TOTAL}% in total on qualifying earnings (£{QUALIFYING_LOWER.toLocaleString()} – £{QUALIFYING_UPPER.toLocaleString()}), with at least {MIN_EMPLOYER}% from your employer. You pay {MIN_EMPLOYEE}% where your employer pays {MIN_EMPLOYER}%, and can pay less where your employer pays more.</p>
            {basis === 'all' && <p className="mt-1">A scheme using all pay can be certified at a lower minimum: at least 7% in total, with at least {MIN_EMPLOYER}% from your employer.</p>}
            {s < AUTO_ENROL_TRIGGER && <p className="mt-1 font-medium text-foreground">Below £{AUTO_ENROL_TRIGGER.toLocaleString()} a year you are not automatically enrolled, though you can still choose to join. {s > QUALIFYING_LOWER ? `Your employer must then contribute, because you earn more than £${QUALIFYING_LOWER.toLocaleString()}.` : `Your employer does not have to contribute at £${QUALIFYING_LOWER.toLocaleString()} or less.`}</p>}
            <p className="mt-1">Automatic enrolment applies from age 22 to State Pension age.</p>
            <p className="mt-1">Shows basic-rate relief at source; higher-rate taxpayers reclaim more through Self Assessment (or get it automatically in a net-pay scheme).</p>
          </div>
        </div>
      )}
    </div>
  )
}
