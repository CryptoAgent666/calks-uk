import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent, ukIncomeTax, ukPersonalAllowance, ukCorporationTax, ukDividendTax } from '@/utils'

function calculateOutside(dayRate: number, daysPerYear: number, expenses: number) {
  const revenue = dayRate * daysPerYear
  const profit = revenue - expenses
  // The £12,570 salary and the employer NI on it are deductible expenses, so
  // corporation tax is charged on what is left, not on the full profit. It also
  // needs marginal relief between £50k and £250k, and the dividends drawn at a
  // typical contractor day rate run past the basic band into 35.75%.
  const optimalSalary = Math.min(12_570, Math.max(0, profit))
  const employerNI = Math.max(0, (optimalSalary - 5_000) * 0.15)
  const corpProfit = Math.max(0, profit - optimalSalary - employerNI)
  const corpTax = ukCorporationTax(corpProfit)
  const dividendIncome = corpProfit - corpTax
  const dividendTax = ukDividendTax(dividendIncome, optimalSalary)
  // The salary is only tax-free while the Personal Allowance covers it. Salary
  // plus dividends over £100,000 tapers the allowance (gone at £125,140), and
  // the uncovered part of the £12,570 salary is taxed at 20%: up to £2,514.
  const salaryTax = ukIncomeTax(optimalSalary, ukPersonalAllowance(optimalSalary + dividendIncome))

  const takeHome = optimalSalary - salaryTax + dividendIncome - dividendTax

  return { revenue, profit, corpTax, salaryTax, dividendTax, takeHome, effectiveRate: revenue > 0 ? ((revenue - takeHome) / revenue) * 100 : 0 }
}

function calculateInside(dayRate: number, daysPerYear: number) {
  const gross = dayRate * daysPerYear
  // Inside IR35 the fee-payer or umbrella settles employer NI out of the
  // assignment rate before paying the deemed salary, so it comes off the top:
  // salary + (salary − £5,000) × 15% = the rate. Computing employer NI but not
  // deducting it flattered the inside figure enough to make inside IR35 look
  // better paid than outside, which inverted the whole point of the page.
  const salary = gross > 0 ? Math.min(gross, (gross + 5_000 * 0.15) / 1.15) : 0
  const employerNI = Math.max(0, (salary - 5_000) * 0.15)
  const tax = ukIncomeTax(salary)
  let ni = 0
  if (salary > 12_570) {
    if (salary <= 50_270) ni = (salary - 12_570) * 0.08
    else ni = (50_270 - 12_570) * 0.08 + (salary - 50_270) * 0.02
  }
  const takeHome = salary - tax - ni
  return { gross, tax, ni, employerNI, takeHome, effectiveRate: gross > 0 ? ((gross - takeHome) / gross) * 100 : 0 }
}

export default function IR35Calculator() {
  const [dayRate, setDayRate] = useState('500')
  const [days, setDays] = useState('220')
  const [expenses, setExpenses] = useState('5000')

  const dr = parseFloat(dayRate) || 0
  const d = parseInt(days) || 0
  const ex = parseFloat(expenses.replace(/,/g, '')) || 0

  const outside = useMemo(() => calculateOutside(dr, d, ex), [dr, d, ex])
  const inside = useMemo(() => calculateInside(dr, d), [dr, d])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Day Rate</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="number" min="0" value={dayRate} onChange={(e) => setDayRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Day Rate" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Working Days/Year</label>
          <input type="number" min="1" max="365" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Working Days/Year" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Annual Expenses (outside IR35)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={expenses} onChange={(e) => setExpenses(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Expenses (outside IR35)" /></div>
        </div>
      </div>

      {dr > 0 && d > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">Outside IR35</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400 mt-2">{formatCurrency(outside.takeHome)}</p>
              <p className="text-xs text-muted-foreground mt-1">Effective rate: {formatPercent(outside.effectiveRate)}</p>
            </div>
            <div className="rounded-2xl bg-destructive/10 p-6 text-center">
              <p className="text-sm font-medium text-destructive">Inside IR35</p>
              <p className="text-2xl font-bold text-destructive mt-2">{formatCurrency(inside.takeHome)}</p>
              <p className="text-xs text-muted-foreground mt-1">Effective rate: {formatPercent(inside.effectiveRate)}</p>
            </div>
          </div>

          <div className="rounded-xl bg-primary/10 p-4 text-center">
            <p className="text-sm text-muted-foreground">Annual Difference</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(Math.abs(outside.takeHome - inside.takeHome))}</p>
            <p className="text-xs text-muted-foreground">more per year {outside.takeHome >= inside.takeHome ? 'outside' : 'inside'} IR35</p>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Note:</p>
            <p>Outside IR35: £12,570 salary plus all remaining profit paid out as dividends in the year, after Corporation Tax.</p>
            <p>Inside IR35: umbrella-style pay, where employer NI (15%) comes out of the day rate, then PAYE income tax and employee NI. Apprenticeship Levy and umbrella margin are not included.</p>
            <p>Leaving profit in the company or paying employer pension contributions would lower the tax outside IR35.</p>
            <p>This is a simplified estimate. Actual figures depend on individual circumstances.</p>
          </div>
        </div>
      )}
    </div>
  )
}
