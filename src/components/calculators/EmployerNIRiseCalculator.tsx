import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Employer NI rise April 2025: 13.8% → 15%, threshold £9,100 → £5,000
function calculate(employees: number, avgSalary: number) {
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

  // Employment Allowance (£10,500 from April 2025)
  const EA = 10_500
  const netIncreaseAfterEA = Math.max(0, totalIncrease - (EA > 0 ? EA : 0))

  return { oldNIPerEmp, newNIPerEmp, increasePerEmp, oldTotal, newTotal, totalIncrease, netIncreaseAfterEA, monthlyIncrease: totalIncrease / 12 }
}

export default function EmployerNIRiseCalculator() {
  const [employees, setEmployees] = useState('10')
  const [salary, setSalary] = useState('30000')

  const e = parseInt(employees) || 0
  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(e, s), [e, s])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Number of Employees</label><input type="number" min="1" max="1000" value={employees} onChange={(ev) => setEmployees(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number of Employees" /></div>
        <div><label className="block text-sm font-medium mb-2">Average Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(ev) => setSalary(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Average Salary" /></div></div>
      </div>

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
            <p className="text-xs text-muted-foreground">After Employment Allowance (£10,500)</p>
            <p className="text-lg font-bold text-green-700 dark:text-green-400">Net increase: {formatCurrency(result.netIncreaseAfterEA)}/year</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>From April 2025: Employer NI rises from 13.8% to 15%. Threshold drops from £9,100 to £5,000. Employment Allowance increased to £10,500 (most small businesses). This is the largest employer tax rise in decades.</p>
          </div>
        </div>
      )}
    </div>
  )
}
