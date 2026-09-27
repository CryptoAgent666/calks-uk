import { useState, useMemo } from 'react'
import { formatCurrency, ukCorporationTax, ukDividendTax, ukIncomeTax } from '@/utils'

// 2026/27
const EMPLOYER_NI = 0.15
const SECONDARY_THRESHOLD = 5_000
const QE_LOWER = 6_240 // auto-enrolment qualifying earnings band (frozen for 2026/27)
const QE_UPPER = 50_270
const EMPLOYER_PENSION = 0.03 // auto-enrolment minimum
const EMPLOYEE_PENSION = 0.05 // auto-enrolment minimum (gross, including tax relief)
const ACCOUNTANCY = 1_200 // contractor's annual accountancy fee, a company expense
const WORKING_DAYS = 220

function qualifyingEarnings(salary: number) {
  return Math.max(0, Math.min(salary, QE_UPPER) - QE_LOWER)
}

function employerCost(salary: number) {
  return salary + Math.max(0, salary - SECONDARY_THRESHOLD) * EMPLOYER_NI + qualifyingEarnings(salary) * EMPLOYER_PENSION
}

function employeeNI(i: number) {
  if (i <= 12_570) return 0
  if (i <= 50_270) return (i - 12_570) * 0.08
  return (50_270 - 12_570) * 0.08 + (i - 50_270) * 0.02
}

function calculate(annualCost: number) {
  // As employee: find the salary whose total cost (salary + employer NI + employer pension) uses the whole budget
  let lo = 0
  let hi = Math.max(0, annualCost)
  for (let n = 0; n < 100; n++) {
    const mid = (lo + hi) / 2
    if (employerCost(mid) > annualCost) hi = mid
    else lo = mid
  }
  const empSalary = lo
  const empNI = Math.max(0, empSalary - SECONDARY_THRESHOLD) * EMPLOYER_NI
  const empPension = qualifyingEarnings(empSalary) * EMPLOYER_PENSION
  const empTotal = empSalary + empNI + empPension
  const empOwnPension = qualifyingEarnings(empSalary) * EMPLOYEE_PENSION
  // Pension contribution gets income tax relief (net pay arrangement; relief at source gives the same net cost)
  const empIncomeTax = ukIncomeTax(empSalary - empOwnPension)
  const empEmployeeNI = employeeNI(empSalary)
  const empTakeHome = empSalary - empIncomeTax - empEmployeeNI - empOwnPension

  // As contractor through a limited company outside IR35: £12,570 salary, rest as dividends
  const dayRate = annualCost / WORKING_DAYS
  // Salary of £12,570, or less if the budget cannot cover it plus employer NI and the accountancy fee
  const available = Math.max(0, annualCost - ACCOUNTANCY)
  const contrSalary = Math.min(12_570, available <= SECONDARY_THRESHOLD ? available : (available + SECONDARY_THRESHOLD * EMPLOYER_NI) / (1 + EMPLOYER_NI))
  const contrEmployerNI = Math.max(0, contrSalary - SECONDARY_THRESHOLD) * EMPLOYER_NI
  const contrCorpProfit = Math.max(0, annualCost - contrSalary - contrEmployerNI - ACCOUNTANCY)
  const contrCorpTax = ukCorporationTax(contrCorpProfit)
  const contrDividends = contrCorpProfit - contrCorpTax
  const contrDivTax = ukDividendTax(contrDividends, contrSalary)
  const contrTakeHome = contrSalary + contrDividends - contrDivTax

  return {
    empSalary, empNI, empPension, empTotal, empIncomeTax, empEmployeeNI, empOwnPension, empTakeHome,
    empPensionPot: empPension + empOwnPension,
    dayRate, contrCorpTax, contrDividends, contrDivTax, contrTakeHome,
    saving: contrTakeHome - empTakeHome,
  }
}

export default function EmployeeVsContractorCalculator() {
  const [cost, setCost] = useState('60000')
  const c = parseFloat(cost.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(c), [c])

  return (
    <div className="space-y-6">
      <div><label className="block text-sm font-medium mb-2">Total Budget (what the company pays)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Total Budget (what the company pays)" /></div></div>

      {c > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-5 text-center"><p className="text-sm font-medium">As Employee</p><p className="text-xl font-bold mt-1">{formatCurrency(result.empTakeHome)}</p><p className="text-xs text-muted-foreground">Salary: {formatCurrency(result.empSalary)}</p><p className="text-xs text-muted-foreground">Plus {formatCurrency(result.empPensionPot)} a year into pension</p></div>
            <div className={`rounded-xl p-5 text-center ${result.saving > 0 ? 'bg-green-100 dark:bg-green-950 border-2 border-green-300 dark:border-green-800' : 'border border-border'}`}><p className="text-sm font-medium">As Contractor (Ltd)</p><p className="text-xl font-bold mt-1">{formatCurrency(result.contrTakeHome)}</p><p className="text-xs text-muted-foreground">Day rate: {formatCurrency(result.dayRate)}</p><p className="text-xs text-muted-foreground">After {formatCurrency(ACCOUNTANCY)} a year accountancy</p>{result.saving > 0 && <span className="inline-block mt-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">+{formatCurrency(result.saving)}</span>}</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Employer NI</p><p className="text-lg font-bold">{formatCurrency(result.empNI)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Employer Pension (3%)</p><p className="text-lg font-bold">{formatCurrency(result.empPension)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Employee Tax + NI</p><p className="text-lg font-bold">{formatCurrency(result.empIncomeTax + result.empEmployeeNI)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Contractor Corp + Div Tax</p><p className="text-lg font-bold">{formatCurrency(result.contrCorpTax + result.contrDivTax)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Same cost to the hiring company ({formatCurrency(c)}). The employee's salary is what is left after 15% employer NI above £5,000 and a 3% employer pension on qualifying earnings (£6,240 to £50,270); take-home is after income tax, NI and a 5% employee pension contribution with tax relief. The contractor takes a £12,570 salary and the rest as dividends after Corporation Tax. {result.saving > 0 ? 'The contractor keeps more because company profits pay Corporation Tax and dividend tax rather than PAYE and NI.' : 'At this budget the employee keeps more.'} But a contractor gets no sick pay, holiday pay, employer pension or employment rights, and inside IR35 the dividend route is not available.</p>
          </div>
        </div>
      )}
    </div>
  )
}
