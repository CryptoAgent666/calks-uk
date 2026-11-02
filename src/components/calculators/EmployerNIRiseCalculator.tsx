import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Employer NI rise April 2025: 13.8% → 15%, threshold £9,100 → £5,000
function calculate(employees: number, avgSalary: number, canClaimAllowance: boolean) {
  // Old rates (pre-April 2025)
  const oldThreshold = 9_100
  const oldRate = 0.138
  const oldNIPerEmp = avgSalary > oldThreshold ? (avgSalary - oldThreshold) * oldRate : 0
  const oldTotal = oldNIPerEmp * employees

  // New rates (April 2025)
  const newThreshold = 5_000
  const newRate = 0.15
  const newNIPerEmp = avgSalary > newThreshold ? (avgSalary - newThreshold) * newRate : 0
  const newTotal = newNIPerEmp * employees

  const increasePerEmp = newNIPerEmp - oldNIPerEmp
  const totalIncrease = newTotal - oldTotal

  // Employment Allowance: £5,000 before April 2025 (only if the previous year's employer NI
  // bill was under £100,000), £10,500 since, with the £100k cap removed. Only the difference
  // offsets the rise for a firm that already claimed; the allowance cannot exceed the bill.
  // Ineligible employers (sole-director companies, mostly public sector work) get neither.
  const oldEA = canClaimAllowance && oldTotal < 100_000 ? 5_000 : 0
  const newEA = canClaimAllowance ? 10_500 : 0
  const oldNet = Math.max(0, oldTotal - oldEA)
  const newNet = Math.max(0, newTotal - newEA)
  const netIncreaseAfterEA = newNet - oldNet

  return { oldNIPerEmp, newNIPerEmp, increasePerEmp, oldTotal, newTotal, totalIncrease, netIncreaseAfterEA, monthlyIncrease: totalIncrease / 12 }
}

export default function EmployerNIRiseCalculator() {
  const [employees, setEmployees] = useState('10')
  const [salary, setSalary] = useState('30000')
  const [canClaim, setCanClaim] = useState(true)

  const e = parseInt(employees) || 0
  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(e, s, canClaim), [e, s, canClaim])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Number of Employees</label><input type="number" min="1" max="1000" value={employees} onChange={(ev) => setEmployees(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number of Employees" /></div>
        <div><label className="block text-sm font-medium mb-2">Average Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(ev) => setSalary(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Average Salary" /></div></div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={canClaim} onChange={(ev) => setCanClaim(ev.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">We can claim Employment Allowance (untick for a company whose sole director is its only employee, or a business doing more than half its work in the public sector)</span></label>

      {e > 0 && s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Extra Employer NI Cost (April 2025)</p>
            <p className="text-3xl font-bold text-destructive mt-1">+{formatCurrency(result.totalIncrease)}/year</p>
            <p className="text-sm text-muted-foreground mt-1">+{formatCurrency(result.monthlyIncrease)}/month &middot; +{formatCurrency(result.increasePerEmp)}/employee</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4 text-center"><p className="text-sm font-medium">Before (13.8%, £9,100 threshold)</p><p className="text-xl font-bold mt-1">{formatCurrency(result.oldTotal)}/yr</p><p className="text-xs text-muted-foreground">{formatCurrency(result.oldNIPerEmp)}/employee</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-sm font-medium">After (15%, £5,000 threshold)</p><p className="text-xl font-bold text-destructive mt-1">{formatCurrency(result.newTotal)}/yr</p><p className="text-xs text-muted-foreground">{formatCurrency(result.newNIPerEmp)}/employee</p></div>
          </div>
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center">
            <p className="text-xs text-muted-foreground">{canClaim ? 'After Employment Allowance (£5,000 then, £10,500 now)' : 'No Employment Allowance claimed'}</p>
            <p className="text-lg font-bold text-green-700 dark:text-green-400">Net increase: {formatCurrency(result.netIncreaseAfterEA)}/year</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>From April 2025: Employer NI rose from 13.8% to 15%. The threshold dropped from £9,100 to £5,000. Employment Allowance increased to £10,500 for most employers.</p>
            <p className="mt-2">This uses one average salary for everyone, so a payroll with staff near or below the threshold will differ. It also ignores the 0% rate on earnings up to £50,270 for under-21s and apprentices under 25.</p>
          </div>
        </div>
      )}
    </div>
  )
}
