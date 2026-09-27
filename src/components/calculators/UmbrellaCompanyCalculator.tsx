import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent, ukIncomeTax } from '@/utils'

// 2026/27 rates. Annual method: the umbrella runs PAYE each pay period, but for
// steady pay across the year the annual figures come out the same or very close.
const SECONDARY_THRESHOLD = 5_000
const EMPLOYER_NI = 0.15
const LEVY_RATE = 0.005
const QE_LOWER = 6_240
const QE_UPPER = 50_270
const EMPLOYER_PENSION = 0.03

// Payroll rounds each deduction to the penny, so the payslip lines add up.
const pennies = (n: number) => Math.round(n * 100 + 1e-6) / 100

function employeeNI(pay: number) {
  if (pay <= 12_570) return 0
  if (pay <= 50_270) return (pay - 12_570) * 0.08
  return (50_270 - 12_570) * 0.08 + (pay - 50_270) * 0.02
}

// Costs the assignment income has to cover for a contractual gross salary S.
// The employee pension goes in by salary sacrifice, so employer NI, the levy,
// income tax and employee NI are all worked out on salary after the sacrifice.
function employmentCosts(salary: number, pensionPct: number, payLevy: boolean) {
  const qualifying = Math.min(Math.max(salary - QE_LOWER, 0), QE_UPPER - QE_LOWER)
  const employeePension = qualifying * (pensionPct / 100)
  const employerPension = pensionPct > 0 ? qualifying * EMPLOYER_PENSION : 0
  const taxablePay = salary - employeePension
  const employerNI = Math.max(0, taxablePay - SECONDARY_THRESHOLD) * EMPLOYER_NI
  const levy = payLevy ? taxablePay * LEVY_RATE : 0
  return { employeePension, employerPension, taxablePay, employerNI, levy, total: salary + employerPension + employerNI + levy }
}

function calculate(dayRate: number, daysPerYear: number, marginPerWeek: number, pensionPct: number, payLevy: boolean) {
  const grossRevenue = dayRate * daysPerYear
  const weeksWorked = daysPerYear / 5
  const umbrellaFee = marginPerWeek * weeksWorked
  const available = Math.max(0, grossRevenue - umbrellaFee)

  // Solve for the gross salary that uses up exactly what is left after the margin.
  let lo = 0
  let hi = available
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2
    if (employmentCosts(mid, pensionPct, payLevy).total > available) hi = mid
    else lo = mid
  }
  const grossSalary = lo
  const c = employmentCosts(grossSalary, pensionPct, payLevy)

  const tax = pennies(ukIncomeTax(c.taxablePay))
  const ni = pennies(employeeNI(c.taxablePay))
  const takeHome = c.taxablePay - tax - ni
  const pensionTotal = c.employeePension + c.employerPension
  const takeHomePct = grossRevenue > 0 ? (takeHome / grossRevenue) * 100 : 0

  return {
    grossRevenue, weeksWorked, umbrellaFee,
    employerNI: c.employerNI, levy: c.levy, employerPension: c.employerPension,
    grossSalary, employeePension: c.employeePension, taxablePay: c.taxablePay,
    tax, ni, takeHome, pensionTotal, takeHomePct,
  }
}

export default function UmbrellaCompanyCalculator() {
  const [rate, setRate] = useState('400')
  const [days, setDays] = useState('220')
  const [margin, setMargin] = useState('25')
  const [pensionPct, setPensionPct] = useState('5')
  const [levy, setLevy] = useState(true)

  const r = parseFloat(rate.replace(/,/g, '')) || 0
  const d = parseInt(days) || 220
  const m = parseFloat(margin.replace(/,/g, '')) || 0
  const p = parseFloat(pensionPct) || 0
  const result = useMemo(() => calculate(r, d, m, p, levy), [r, d, m, p, levy])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Day Rate</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Day Rate" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Days/Year</label><input type="number" min="100" max="260" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Days/Year" /></div>
        <div><label className="block text-sm font-medium mb-2">Umbrella Margin (£/wk)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={margin} onChange={(e) => setMargin(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Umbrella Margin (£/wk)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Your Pension (%)</label><input type="number" min="0" max="20" step="0.5" value={pensionPct} onChange={(e) => setPensionPct(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Pension (%)" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={levy} onChange={(e) => setLevy(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label="Umbrella pays the Apprenticeship Levy" /><span className="text-sm">Umbrella pays the Apprenticeship Levy (0.5%, pay bill over £3m, true of almost all umbrellas)</span></label>

      {r > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Annual Take-Home Pay</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.takeHome)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.takeHome / 12)}/month &middot; {formatPercent(result.takeHomePct)} of assignment income &middot; plus {formatCurrency(result.pensionTotal)} into your pension</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Assignment income ({d} days x £{r})</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.grossRevenue)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Umbrella margin ({formatCurrency(m)} x {result.weeksWorked.toFixed(1)} weeks)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.umbrellaFee)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Employer NI (15% above £5,000)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.employerNI)}</td></tr>
              {levy && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Apprenticeship Levy (0.5%)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.levy)}</td></tr>}
              <tr className="border-b border-border/50"><td className="py-2">Employer pension (3% of qualifying earnings)</td><td className="text-right tabular-nums">-{formatCurrency(result.employerPension)}</td></tr>
              <tr className="border-b border-border font-medium"><td className="py-2">Gross Salary</td><td className="text-right tabular-nums">{formatCurrency(result.grossSalary)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Your pension by salary sacrifice ({p}% of qualifying earnings)</td><td className="text-right tabular-nums">-{formatCurrency(result.employeePension)}</td></tr>
              <tr className="border-b border-border font-medium"><td className="py-2">Taxable Pay</td><td className="text-right tabular-nums">{formatCurrency(result.taxablePay)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income Tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.tax)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Employee NI</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.ni)}</td></tr>
              <tr className="font-semibold"><td className="py-2 text-primary">Take-Home</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.takeHome)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>2026/27 annual estimate for England, Wales and Northern Ireland, with no student loan. Qualifying earnings are pay between £6,240 and £50,270; setting your pension to 0% treats you as opted out, so the employer 3% stops too. Holiday pay is funded from the same assignment income, so these annual figures include it whether it is rolled up (12.07%) or banked.</p>
          </div>
        </div>
      )}
    </div>
  )
}
