import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// Employer NI from April 2025
const SECONDARY_THRESHOLD = 5_000
const EMPLOYER_NI_RATE = 0.15 // 15%
const EMPLOYMENT_ALLOWANCE = 10_500

function calculate(salary: number, numEmployees: number, claimEA: boolean) {
  const niPerEmployee = salary > SECONDARY_THRESHOLD ? (salary - SECONDARY_THRESHOLD) * EMPLOYER_NI_RATE : 0
  const totalNI = niPerEmployee * numEmployees
  const allowance = claimEA ? Math.min(EMPLOYMENT_ALLOWANCE, totalNI) : 0
  const netNI = totalNI - allowance

  return {
    niPerEmployee, totalNI, allowance, netNI,
    monthlyPerEmployee: niPerEmployee / 12,
    totalCostPerEmployee: salary + niPerEmployee,
    effectiveRate: salary > 0 ? (niPerEmployee / salary) * 100 : 0,
  }
}

export default function EmployerNICalculator() {
  const [salary, setSalary] = useState('')
  const [employees, setEmployees] = useState('1')
  const [claimEA, setClaimEA] = useState(false)

  const sal = parseFloat(salary.replace(/,/g, '')) || 0
  const num = parseInt(employees) || 1
  const result = useMemo(() => calculate(sal, num, claimEA), [sal, num, claimEA])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="emp-salary" className="block text-sm font-medium mb-2">Employee Annual Salary</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
            <input id="emp-salary" type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="30,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Employee Annual Salary" />
          </div>
        </div>
        <div>
          <label htmlFor="emp-count" className="block text-sm font-medium mb-2">Number of Employees</label>
          <input id="emp-count" type="number" min="1" max="10000" value={employees} onChange={(e) => setEmployees(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number of Employees" />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={claimEA} onChange={(e) => setClaimEA(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">Claim Employment Allowance (£10,500)</span>
      </label>

      {sal > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-destructive/10 p-4">
              <p className="text-xs text-muted-foreground">Employer NI (per employee)</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(result.niPerEmployee)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Monthly NI (per employee)</p>
              <p className="text-lg font-bold">{formatCurrency(result.monthlyPerEmployee)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Total Cost per Employee</p>
              <p className="text-lg font-bold">{formatCurrency(result.totalCostPerEmployee)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Effective Rate</p>
              <p className="text-lg font-bold">{formatPercent(result.effectiveRate)}</p>
            </div>
          </div>

          {num > 1 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground">Total NI ({num} employees)</p>
                <p className="text-lg font-bold text-destructive">{formatCurrency(result.totalNI)}</p>
              </div>
              {claimEA && (
                <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4">
                  <p className="text-xs text-muted-foreground">Employment Allowance Saving</p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-400">-{formatCurrency(result.allowance)}</p>
                </div>
              )}
            </div>
          )}

          {claimEA && (
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <p className="text-sm text-muted-foreground">Net Employer NI to Pay</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(result.netNI)}</p>
            </div>
          )}

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p><span className="font-medium text-foreground">Rate:</span> 15% above £{SECONDARY_THRESHOLD.toLocaleString()} (Secondary Threshold)</p>
            <p><span className="font-medium text-foreground">Employment Allowance:</span> Up to £10,500 off your employer NI bill (eligible small businesses)</p>
          </div>
        </div>
      )}
    </div>
  )
}
