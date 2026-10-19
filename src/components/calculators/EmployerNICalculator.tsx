import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// Employer (secondary) Class 1 NI, 2026/27 (gov.uk rates and thresholds for employers 2026 to 2027).
// Payroll works it out each pay period, so the monthly thresholds are used:
// Secondary Threshold £417 a month (£5,000 a year); Upper Secondary Threshold for
// under-21s, apprentices under 25 and veterans £4,189 a month (£50,270 a year);
// Freeport / Investment Zone Upper Secondary Threshold £2,083 a month (£25,000 a year).
const EMPLOYER_NI_RATE = 0.15 // 15%
const EMPLOYMENT_ALLOWANCE = 10_500

type Category = 'standard' | 'young' | 'freeport'

const CATEGORIES: Record<Category, { label: string; monthly: number; annual: number }> = {
  standard: { label: 'Standard (15% above £5,000)', monthly: 417, annual: 5_000 },
  young: { label: 'Under 21, apprentice under 25, or veteran in first 12 months of civilian work (0% up to £50,270)', monthly: 4_189, annual: 50_270 },
  freeport: { label: 'New freeport or investment zone employee (0% up to £25,000)', monthly: 2_083, annual: 25_000 },
}

// NI is worked out to the penny; HMRC rounds 0.5p or less down and anything above up.
function roundNI(amount: number): number {
  return Math.max(0, Math.ceil(amount * 100 - 0.5 - 1e-9)) / 100
}

function monthlyNI(salary: number, category: Category): number {
  const monthlyPay = salary / 12
  return roundNI(Math.max(0, monthlyPay - CATEGORIES[category].monthly) * EMPLOYER_NI_RATE)
}

function calculate(salary: number, numEmployees: number, claimEA: boolean, category: Category) {
  const monthlyPerEmployee = monthlyNI(salary, category)
  const niPerEmployee = Math.round(monthlyPerEmployee * 12 * 100) / 100
  const standardPerEmployee = Math.round(monthlyNI(salary, 'standard') * 12 * 100) / 100
  const reliefPerEmployee = standardPerEmployee - niPerEmployee
  const totalNI = niPerEmployee * numEmployees
  const allowance = claimEA ? Math.min(EMPLOYMENT_ALLOWANCE, totalNI) : 0
  const netNI = totalNI - allowance

  return {
    niPerEmployee, totalNI, allowance, netNI, monthlyPerEmployee, reliefPerEmployee,
    totalCostPerEmployee: salary + niPerEmployee,
    effectiveRate: salary > 0 ? (niPerEmployee / salary) * 100 : 0,
  }
}

export default function EmployerNICalculator() {
  const [salary, setSalary] = useState('')
  const [employees, setEmployees] = useState('1')
  const [claimEA, setClaimEA] = useState(false)
  const [category, setCategory] = useState<Category>('standard')

  const sal = Math.max(0, parseFloat(salary.replace(/,/g, '')) || 0)
  const num = Math.max(1, Math.floor(parseFloat(employees) || 1))
  const result = useMemo(() => calculate(sal, num, claimEA, category), [sal, num, claimEA, category])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="emp-salary" className="block text-sm font-medium mb-2">Employee Annual Salary</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
            <input id="emp-salary" type="text" inputMode="decimal" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="30,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Employee Annual Salary" />
          </div>
        </div>
        <div>
          <label htmlFor="emp-count" className="block text-sm font-medium mb-2">Number of Employees</label>
          <input id="emp-count" type="number" min="1" max="10000" step="1" value={employees} onChange={(e) => setEmployees(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number of Employees" />
        </div>
      </div>

      <div>
        <label htmlFor="emp-category" className="block text-sm font-medium mb-2">Employee category</label>
        <select id="emp-category" value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring">
          {(Object.keys(CATEGORIES) as Category[]).map((c) => (
            <option key={c} value={c}>{CATEGORIES[c].label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={claimEA} onChange={(e) => setClaimEA(e.target.checked)} className="h-5 w-5 rounded border-border" />
          <span className="text-sm">Claim Employment Allowance (£10,500)</span>
        </label>
        <p className="mt-1 ml-8 text-xs text-muted-foreground">Not available if the only employee paid above £5,000 is a sole director.</p>
      </div>

      {sal > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-destructive/10 p-4">
              <p className="text-xs text-muted-foreground">Employer NI a year (per employee)</p>
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

          {(num > 1 || claimEA || category !== 'standard') && (
            <div className="grid grid-cols-2 gap-3">
              {num > 1 && (
                <div className="rounded-xl border border-border p-4">
                  <p className="text-xs text-muted-foreground">Total NI ({num} employees)</p>
                  <p className="text-lg font-bold text-destructive">{formatCurrency(result.totalNI)}</p>
                </div>
              )}
              {category !== 'standard' && (
                <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4">
                  <p className="text-xs text-muted-foreground">Saved by the relief a year (per employee)</p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.reliefPerEmployee)}</p>
                </div>
              )}
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
            <p><span className="font-medium text-foreground">Rate:</span> 15% above £{CATEGORIES.standard.monthly} a month (the £{CATEGORIES.standard.annual.toLocaleString()} Secondary Threshold), worked out each pay period as payroll does. A year is 12 times the monthly figure.</p>
            <p><span className="font-medium text-foreground">Reliefs:</span> 0% up to £{CATEGORIES.young.monthly.toLocaleString()} a month (£{CATEGORIES.young.annual.toLocaleString()}) for employees under 21 (category M), apprentices under 25 (H) and veterans in their first 12 months of civilian work (V); 0% up to £{CATEGORIES.freeport.monthly.toLocaleString()} a month (£{CATEGORIES.freeport.annual.toLocaleString()}) for new freeport or investment zone employees for their first 36 months. 15% applies above those limits.</p>
            <p><span className="font-medium text-foreground">Employment Allowance:</span> Up to £10,500 off your total employer NI bill for eligible employers. Claim it each tax year through your Employer Payment Summary.</p>
            <p><span className="font-medium text-foreground">Directors:</span> a director has an annual earnings period, so their NI is worked out on the year&apos;s pay against the £{CATEGORIES.standard.annual.toLocaleString()} annual threshold.</p>
          </div>
        </div>
      )}
    </div>
  )
}
