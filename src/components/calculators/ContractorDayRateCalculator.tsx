import { useState, useMemo } from 'react'
import { formatCurrency, ukIncomeTax, ukPersonalAllowance, ukCorporationTax, ukDividendTax } from '@/utils'

const LTD_SALARY = 12_570
const NI_SECONDARY_THRESHOLD = 5_000
const EMPLOYER_NI_RATE = 0.15
const APPRENTICESHIP_LEVY_RATE = 0.005

function employeeNI(income: number) {
  if (income <= 12_570) return 0
  if (income <= 50_270) return (income - 12_570) * 0.08
  return (50_270 - 12_570) * 0.08 + (income - 50_270) * 0.02
}

// Outside IR35: a limited company pays the usual £12,570 salary and the rest of
// its post-tax profit as dividends. Employer NI on the salary is a company cost
// (a one-director company cannot claim the Employment Allowance). The salary is
// taxed too once dividends push total income past £100,000 and the Personal
// Allowance tapers away.
function ltdTakeHome(revenue: number, businessCosts: number) {
  const employerNI = Math.max(0, (LTD_SALARY - NI_SECONDARY_THRESHOLD) * EMPLOYER_NI_RATE)
  const profit = Math.max(0, revenue - LTD_SALARY - employerNI - businessCosts)
  const corpTax = ukCorporationTax(profit)
  const dividends = profit - corpTax
  const salaryTax = ukIncomeTax(LTD_SALARY, ukPersonalAllowance(LTD_SALARY + dividends))
  const divTax = ukDividendTax(dividends, LTD_SALARY)
  return { revenue, employerNI, corpTax, salaryTax, divTax, takeHome: LTD_SALARY - salaryTax + dividends - divTax }
}

// Inside IR35 through an umbrella company: out of the assignment revenue the
// umbrella keeps its margin and pays employer NI (15% above £5,000) and, where
// passed on, the 0.5% Apprenticeship Levy, both on the salary it pays. The rest
// is gross salary taxed through PAYE. Employer pension and expenses are left out.
function umbrellaTakeHome(revenue: number, marginPerYear: number, levy: boolean) {
  const levyRate = levy ? APPRENTICESHIP_LEVY_RATE : 0
  const salary = Math.max(0, (revenue - marginPerYear + NI_SECONDARY_THRESHOLD * EMPLOYER_NI_RATE) / (1 + EMPLOYER_NI_RATE + levyRate))
  const employerNI = Math.max(0, (salary - NI_SECONDARY_THRESHOLD) * EMPLOYER_NI_RATE)
  const incomeTax = ukIncomeTax(salary)
  const ni = employeeNI(salary)
  return { revenue, salary, employerNI, levy: salary * levyRate, margin: marginPerYear, incomeTax, ni, takeHome: salary - incomeTax - ni }
}

// Take-home rises with revenue, so bisect for the revenue that delivers the
// target, then round the day rate up to the next £5.
function solveRevenue(target: number, takeHomeAt: (revenue: number) => number) {
  let lo = 0
  let hi = Math.max(target * 5, 10_000)
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (takeHomeAt(mid) < target) lo = mid
    else hi = mid
  }
  return hi
}

function calculate(targetTakeHome: number, workingDays: number, insideIR35: boolean, umbrellaMarginPerWeek = 25, apprenticeshipLevy = true, businessCosts = 0) {
  if (insideIR35) {
    // Margin is charged for each week worked
    const marginPerYear = umbrellaMarginPerWeek * (workingDays / 5)
    const exact = solveRevenue(targetTakeHome, (r) => umbrellaTakeHome(r, marginPerYear, apprenticeshipLevy).takeHome)
    const dayRate = Math.ceil(exact / workingDays / 5) * 5
    const out = umbrellaTakeHome(dayRate * workingDays, marginPerYear, apprenticeshipLevy)
    return { dayRate, annualGross: out.revenue, takeHome: out.takeHome, inside: out, outside: null }
  }
  const exact = solveRevenue(targetTakeHome, (r) => ltdTakeHome(r, businessCosts).takeHome)
  const dayRate = Math.ceil(exact / workingDays / 5) * 5
  const out = ltdTakeHome(dayRate * workingDays, businessCosts)
  return { dayRate, annualGross: out.revenue, takeHome: out.takeHome, inside: null, outside: out }
}

export default function ContractorDayRateCalculator() {
  const [target, setTarget] = useState('60000')
  const [days, setDays] = useState('220')
  const [ir35, setIr35] = useState(false)
  const [margin, setMargin] = useState('25')
  const [levy, setLevy] = useState(true)
  const [costs, setCosts] = useState('0')

  const t = parseFloat(target.replace(/,/g, '')) || 0
  const d = parseInt(days) || 220
  const mg = Math.max(0, parseFloat(margin) || 0)
  const bc = Math.max(0, parseFloat(costs.replace(/,/g, '')) || 0)
  const result = useMemo(() => calculate(t, d, ir35, mg, levy, bc), [t, d, ir35, mg, levy, bc])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Target Annual Take-Home</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="60,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Target Annual Take-Home" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Working Days/Year</label>
          <input type="number" min="100" max="260" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Working Days/Year" /></div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={ir35} onChange={(e) => setIr35(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">Inside IR35 (paid through an umbrella company)</span>
      </label>

      {ir35 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">Umbrella Margin (£/week)</label>
            <input type="number" min="0" max="200" value={margin} onChange={(e) => setMargin(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Umbrella Margin (£/week)" /></div>
          <label className="flex items-center gap-3 cursor-pointer sm:mt-8">
            <input type="checkbox" checked={levy} onChange={(e) => setLevy(e.target.checked)} className="h-5 w-5 rounded border-border" />
            <span className="text-sm">Umbrella passes on the 0.5% Apprenticeship Levy</span>
          </label>
        </div>
      ) : (
        <div><label className="block text-sm font-medium mb-2">Business Costs (£/year)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={costs} onChange={(e) => setCosts(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Business Costs (£/year)" /></div>
          <p className="text-xs text-muted-foreground mt-1">Accountancy, insurance and other company costs, which are not otherwise included</p></div>
      )}

      {t > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Minimum Day Rate Needed</p>
            <p className="text-4xl font-bold text-primary mt-1">£{result.dayRate}</p>
            <p className="text-sm text-muted-foreground mt-1">{ir35 ? 'Inside IR35 (umbrella company)' : 'Outside IR35 (Ltd company)'}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Revenue</p><p className="text-lg font-bold">{formatCurrency(result.annualGross)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Take-Home</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.takeHome)}</p></div>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {result.outside && (
                <>
                  <tr className="border-b border-border/50"><td className="py-2">Director's salary</td><td className="text-right tabular-nums">{formatCurrency(LTD_SALARY)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 text-destructive">Employer NI on salary</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.outside.employerNI)}</td></tr>
                  {bc > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Business costs</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(bc)}</td></tr>}
                  <tr className="border-b border-border/50"><td className="py-2 text-destructive">Corporation Tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.outside.corpTax)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 text-destructive">Dividend tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.outside.divTax)}</td></tr>
                  {result.outside.salaryTax > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income tax on salary (allowance tapered)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.outside.salaryTax)}</td></tr>}
                </>
              )}
              {result.inside && (
                <>
                  <tr className="border-b border-border/50"><td className="py-2 text-destructive">Umbrella margin</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.inside.margin)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 text-destructive">Employer NI (15% above £5,000)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.inside.employerNI)}</td></tr>
                  {result.inside.levy > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Apprenticeship Levy (0.5%)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.inside.levy)}</td></tr>}
                  <tr className="border-b border-border/50"><td className="py-2">Gross salary</td><td className="text-right tabular-nums">{formatCurrency(result.inside.salary)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.inside.incomeTax)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 text-destructive">Employee NI</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.inside.ni)}</td></tr>
                </>
              )}
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground">
            {ir35
              ? 'Assumes an umbrella company taking its weekly margin for each week worked, employer NI and (if ticked) the Apprenticeship Levy from the assignment rate before paying your salary. Pension contributions and expenses are not included.'
              : 'Assumes a limited company paying a £12,570 salary and the rest of its profit as dividends after Corporation Tax. Pension contributions are not included, and business costs only as entered above.'}
          </p>
        </div>
      )}
    </div>
  )
}
