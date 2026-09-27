import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

const EMPLOYER_NI_RATE = 0.15
const EMPLOYER_NI_THRESHOLD = 5_000
const APPRENTICESHIP_LEVY_RATE = 0.005
const APPRENTICESHIP_LEVY_ALLOWANCE = 15_000
const APPRENTICESHIP_LEVY_THRESHOLD = 3_000_000 // Pay bill
// Auto-enrolment qualifying earnings band 2026/27 (frozen): minimum employer contribution is 3% of this band
const QE_LOWER = 6_240
const QE_UPPER = 50_270

type PensionBasis = 'qualifying' | 'whole'

function calculate(salary: number, pensionPct: number, payBillOver3m: boolean, pensionBasis: PensionBasis = 'qualifying') {
  const employerNI = salary > EMPLOYER_NI_THRESHOLD ? (salary - EMPLOYER_NI_THRESHOLD) * EMPLOYER_NI_RATE : 0
  const pensionablePay = pensionBasis === 'qualifying'
    ? Math.max(0, Math.min(salary, QE_UPPER) - QE_LOWER)
    : salary
  const employerPension = pensionablePay * (pensionPct / 100)
  const apprenticeshipLevy = payBillOver3m ? salary * APPRENTICESHIP_LEVY_RATE : 0
  const totalCost = salary + employerNI + employerPension + apprenticeshipLevy
  const overhead = totalCost - salary

  return { salary, employerNI, pensionablePay, employerPension, apprenticeshipLevy, totalCost, overhead, overheadPct: salary > 0 ? (overhead / salary) * 100 : 0 }
}

export default function EmployerCostCalculator() {
  const [salary, setSalary] = useState('35000')
  const [pension, setPension] = useState('3')
  const [pensionBasis, setPensionBasis] = useState<PensionBasis>('qualifying')
  const [levy, setLevy] = useState(false)

  const s = parseFloat(salary.replace(/,/g, '')) || 0
  const p = parseFloat(pension) || 0
  const result = useMemo(() => calculate(s, p, levy, pensionBasis), [s, p, levy, pensionBasis])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Employee Gross Salary</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="35,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Employee Gross Salary" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Employer Pension (%)</label>
          <input type="number" min="0" max="100" step="0.5" value={pension} onChange={(e) => setPension(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Employer Pension (%)" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-2">Pension Paid On</label>
          <select value={pensionBasis} onChange={(e) => setPensionBasis(e.target.value as PensionBasis)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Pension Paid On">
            <option value="qualifying">Qualifying earnings (£6,240–£50,270, auto-enrolment minimum)</option>
            <option value="whole">Whole salary</option>
          </select>
        </div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={levy} onChange={(e) => setLevy(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">Pay bill over £3M (Apprenticeship Levy applies)</span>
      </label>

      {s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Cost of Employment</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalCost)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.totalCost / 12)}/month</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2.5">Gross Salary</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.salary)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5 text-destructive">Employer NI (15%)</td><td className="text-right tabular-nums text-destructive">+{formatCurrency(result.employerNI)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5 text-destructive">Employer Pension ({pension}% of {pensionBasis === 'qualifying' ? `${formatCurrency(result.pensionablePay)} qualifying earnings` : 'salary'})</td><td className="text-right tabular-nums text-destructive">+{formatCurrency(result.employerPension)}</td></tr>
              {result.apprenticeshipLevy > 0 && <tr className="border-b border-border/50"><td className="py-2.5 text-destructive">Apprenticeship Levy (0.5%)</td><td className="text-right tabular-nums text-destructive">+{formatCurrency(result.apprenticeshipLevy)}</td></tr>}
              <tr className="font-semibold"><td className="py-2.5">Total Cost</td><td className="text-right tabular-nums">{formatCurrency(result.totalCost)}</td></tr>
              <tr><td className="py-2.5 text-muted-foreground">Overhead</td><td className="text-right tabular-nums text-muted-foreground">{formatCurrency(result.overhead)} ({formatPercent(result.overheadPct)})</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground">Not included: the £10,500 Employment Allowance, which reduces the whole business's employer NI bill, and the 0% employer NI rate on pay up to £50,270 for employees under 21 and apprentices under 25.</p>
        </div>
      )}
    </div>
  )
}
