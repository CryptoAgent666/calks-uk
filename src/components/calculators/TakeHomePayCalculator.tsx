import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// 2026/27 rates
const PERSONAL_ALLOWANCE = 12_570
const BASIC_LIMIT = 50_270
const HIGHER_LIMIT = 125_140
const PA_TAPER = 100_000

const NI_PT = 12_570
const NI_UEL = 50_270
const NI_MAIN = 0.08
const NI_ADDITIONAL = 0.02

const STUDENT_LOAN_PLANS: Record<string, { threshold: number; rate: number }> = {
  none: { threshold: 0, rate: 0 },
  plan1: { threshold: 26_900, rate: 0.09 },
  plan2: { threshold: 29_385, rate: 0.09 },
  plan4: { threshold: 33_795, rate: 0.09 },
  plan5: { threshold: 25_000, rate: 0.09 },
  postgrad: { threshold: 21_000, rate: 0.06 },
}

function calculate(gross: number, pensionPct: number, studentLoan: string) {
  // Personal Allowance with taper
  let pa = PERSONAL_ALLOWANCE
  if (gross > PA_TAPER) {
    pa = Math.max(0, PERSONAL_ALLOWANCE - Math.floor((gross - PA_TAPER) / 2))
  }

  // Income Tax
  let tax = 0
  if (gross > pa) {
    const taxable = gross - pa
    if (taxable <= BASIC_LIMIT - PERSONAL_ALLOWANCE) {
      tax = taxable * 0.20
    } else if (gross <= HIGHER_LIMIT) {
      tax = (BASIC_LIMIT - pa) * 0.20 + (gross - BASIC_LIMIT) * 0.40
    } else {
      tax = (BASIC_LIMIT - pa) * 0.20 + (HIGHER_LIMIT - BASIC_LIMIT) * 0.40 + (gross - HIGHER_LIMIT) * 0.45
    }
  }

  // National Insurance
  let ni = 0
  if (gross > NI_PT) {
    if (gross <= NI_UEL) {
      ni = (gross - NI_PT) * NI_MAIN
    } else {
      ni = (NI_UEL - NI_PT) * NI_MAIN + (gross - NI_UEL) * NI_ADDITIONAL
    }
  }

  // Pension
  const pension = gross * (pensionPct / 100)

  // Student Loan
  const plan = STUDENT_LOAN_PLANS[studentLoan]
  let studentLoanRepayment = 0
  if (plan && gross > plan.threshold) {
    studentLoanRepayment = (gross - plan.threshold) * plan.rate
  }

  const totalDeductions = tax + ni + pension + studentLoanRepayment
  const takeHome = gross - totalDeductions

  return {
    gross, tax, ni, pension, studentLoanRepayment, totalDeductions, takeHome,
    effectiveRate: gross > 0 ? (totalDeductions / gross) * 100 : 0,
  }
}

export default function TakeHomePayCalculator() {
  const [income, setIncome] = useState('')
  const [pensionPct, setPensionPct] = useState('5')
  const [studentLoan, setStudentLoan] = useState('none')

  const gross = parseFloat(income.replace(/,/g, '')) || 0
  const pension = parseFloat(pensionPct) || 0
  const result = useMemo(() => calculate(gross, pension, studentLoan), [gross, pension, studentLoan])

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="thp-income" className="block text-sm font-medium mb-2">Annual Gross Salary</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
            <input
              id="thp-income"
              type="text"
              inputMode="numeric"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="35,000"
              className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {[25_000, 30_000, 35_000, 45_000, 55_000, 75_000].map((a) => (
              <button key={a} onClick={() => setIncome(a.toLocaleString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">
                £{(a / 1000)}K
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="pension-pct" className="block text-sm font-medium mb-2">Pension Contribution (%)</label>
          <input
            id="pension-pct"
            type="number"
            min="0" max="100" step="0.5"
            value={pensionPct}
            onChange={(e) => setPensionPct(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="student-loan" className="block text-sm font-medium mb-2">Student Loan</label>
          <select
            id="student-loan"
            value={studentLoan}
            onChange={(e) => setStudentLoan(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="none">None</option>
            <option value="plan1">Plan 1 (pre-2012)</option>
            <option value="plan2">Plan 2 (post-2012)</option>
            <option value="plan4">Plan 4 (Scotland)</option>
            <option value="plan5">Plan 5 (post-2023)</option>
            <option value="postgrad">Postgraduate</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {gross > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Take Home Summary */}
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Annual Take-Home Pay</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.takeHome)}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {formatCurrency(result.takeHome / 12)}/month &middot; {formatCurrency(result.takeHome / 52)}/week
            </p>
          </div>

          {/* Deductions Breakdown */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground">Deduction</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Annual</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Monthly</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 font-medium">Gross Salary</td>
                  <td className="text-right py-2.5 tabular-nums">{formatCurrency(result.gross)}</td>
                  <td className="text-right py-2.5 tabular-nums">{formatCurrency(result.gross / 12)}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 text-destructive">Income Tax</td>
                  <td className="text-right py-2.5 tabular-nums text-destructive">-{formatCurrency(result.tax)}</td>
                  <td className="text-right py-2.5 tabular-nums text-destructive">-{formatCurrency(result.tax / 12)}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 text-destructive">National Insurance</td>
                  <td className="text-right py-2.5 tabular-nums text-destructive">-{formatCurrency(result.ni)}</td>
                  <td className="text-right py-2.5 tabular-nums text-destructive">-{formatCurrency(result.ni / 12)}</td>
                </tr>
                {result.pension > 0 && (
                  <tr className="border-b border-border/50">
                    <td className="py-2.5 text-muted-foreground">Pension ({pensionPct}%)</td>
                    <td className="text-right py-2.5 tabular-nums">-{formatCurrency(result.pension)}</td>
                    <td className="text-right py-2.5 tabular-nums">-{formatCurrency(result.pension / 12)}</td>
                  </tr>
                )}
                {result.studentLoanRepayment > 0 && (
                  <tr className="border-b border-border/50">
                    <td className="py-2.5 text-muted-foreground">Student Loan</td>
                    <td className="text-right py-2.5 tabular-nums">-{formatCurrency(result.studentLoanRepayment)}</td>
                    <td className="text-right py-2.5 tabular-nums">-{formatCurrency(result.studentLoanRepayment / 12)}</td>
                  </tr>
                )}
                <tr className="font-semibold">
                  <td className="py-2.5 text-primary">Take-Home Pay</td>
                  <td className="text-right py-2.5 tabular-nums text-primary">{formatCurrency(result.takeHome)}</td>
                  <td className="text-right py-2.5 tabular-nums text-primary">{formatCurrency(result.takeHome / 12)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Total deductions: {formatPercent(result.effectiveRate)} of gross salary
          </p>
        </div>
      )}
    </div>
  )
}
