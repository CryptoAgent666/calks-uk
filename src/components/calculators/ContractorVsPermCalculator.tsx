import { useState, useMemo } from 'react'
import { formatCurrency, ukIncomeTax, ukPersonalAllowance, ukCorporationTax, ukDividendTax } from '@/utils'

const LTD_SALARY = 12_570
const WEEKDAYS_PER_YEAR = 260
// Auto-enrolment qualifying earnings band 2026/27
const QE_LOWER = 6_240
const QE_UPPER = 50_270

function employeeNI(income: number) {
  if (income <= 12_570) return 0
  if (income <= 50_270) return (income - 12_570) * 0.08
  return (50_270 - 12_570) * 0.08 + (income - 50_270) * 0.02
}

// Minimum employer contribution: 3% of qualifying earnings
function employerMinPension(salary: number) {
  return Math.max(0, Math.min(salary, QE_UPPER) - QE_LOWER) * 0.03
}

// Outside IR35 limited company: £12,570 salary, the rest of the post-tax profit
// as dividends. Business costs and any company pension contribution are
// deducted before Corporation Tax.
function ltdTakeHome(revenue: number, businessCosts: number, companyPension = 0) {
  const employerNI = Math.max(0, (LTD_SALARY - 5_000) * 0.15)
  const profit = Math.max(0, revenue - LTD_SALARY - employerNI - businessCosts - companyPension)
  const corpTax = ukCorporationTax(profit)
  const dividends = profit - corpTax
  const salaryTax = ukIncomeTax(LTD_SALARY, ukPersonalAllowance(LTD_SALARY + dividends))
  const divTax = ukDividendTax(dividends, LTD_SALARY)
  return { employerNI, profit, corpTax, dividends, salaryTax, divTax, takeHome: LTD_SALARY - salaryTax + dividends - divTax }
}

function calculate(permSalary: number, contractDayRate: number, daysPerYear: number, businessCosts = 2_100, holidayDays = 28) {
  // Permanent: paid holiday and sick pay are already inside the salary, so the
  // annual package is salary plus the employer pension.
  const permPension = employerMinPension(permSalary)
  const permTotalPackage = permSalary + permPension
  const permTax = ukIncomeTax(permSalary)
  const permNI = employeeNI(permSalary)
  const permTakeHome = permSalary - permTax - permNI
  const permDaysWorked = Math.max(1, WEEKDAYS_PER_YEAR - holidayDays)
  const permDayRate = permTotalPackage / permDaysWorked // package per day actually worked

  // Contract, outside IR35 through a limited company
  const contractGross = contractDayRate * daysPerYear
  const ltd = ltdTakeHome(contractGross, businessCosts)
  const premiumPct = permTotalPackage > 0 ? (contractGross / permTotalPackage - 1) * 100 : 0
  const takeHomeGap = ltd.takeHome - permTakeHome

  // Break-even day rate: the company pays the same employer pension the perm
  // job would, and the contractor still takes home as much as the employee
  let lo = 0
  let hi = Math.max(permSalary * 3, 10_000)
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (ltdTakeHome(mid, businessCosts, permPension).takeHome < permTakeHome) lo = mid
    else hi = mid
  }
  const breakEvenDayRate = daysPerYear > 0 ? Math.ceil(hi / daysPerYear / 5) * 5 : 0

  return {
    permSalary, permPension, permTotalPackage, permTax, permNI, permTakeHome, permDaysWorked, permDayRate,
    contractGross, contractDayRate, businessCosts, ltd, premiumPct, takeHomeGap, breakEvenDayRate,
  }
}

export default function ContractorVsPermCalculator() {
  const [perm, setPerm] = useState('55000')
  const [rate, setRate] = useState('400')
  const [days, setDays] = useState('220')
  const [costs, setCosts] = useState('2100')
  const [holiday, setHoliday] = useState('28')

  const p = parseFloat(perm.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 0
  const d = parseInt(days) || 220
  const bc = Math.max(0, parseFloat(costs.replace(/,/g,'')) || 0)
  const hd = Math.min(100, Math.max(0, parseInt(holiday) || 0))
  const result = useMemo(() => calculate(p, r, d, bc, hd), [p, r, d, bc, hd])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Permanent Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={perm} onChange={(e) => setPerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Permanent Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Contract Day Rate</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="100" max="2000" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Contract Day Rate" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Days Billed/Year</label><input type="number" min="150" max="260" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Days Billed/Year" /></div>
        <div><label className="block text-sm font-medium mb-2">Contractor Business Costs (£/year)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={costs} onChange={(e) => setCosts(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Contractor Business Costs (£/year)" /></div><p className="text-xs text-muted-foreground mt-1">Accountant, insurance and similar</p></div>
        <div><label className="block text-sm font-medium mb-2">Perm Paid Holiday (days)</label><input type="number" min="0" max="60" value={holiday} onChange={(e) => setHoliday(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Perm Paid Holiday (days)" /><p className="text-xs text-muted-foreground mt-1">Statutory minimum 28, including bank holidays</p></div>
      </div>

      {p > 0 && r > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-5 text-center"><p className="text-sm font-medium">Permanent (salary + employer pension)</p><p className="text-2xl font-bold mt-1">{formatCurrency(result.permTotalPackage)}</p><p className="text-xs text-muted-foreground">{formatCurrency(result.permDayRate)} per day worked ({result.permDaysWorked} days)</p></div>
            <div className="rounded-xl bg-primary/10 p-5 text-center"><p className="text-sm font-medium">Contract (gross revenue)</p><p className="text-2xl font-bold text-primary mt-1">{formatCurrency(result.contractGross)}</p><p className="text-xs text-muted-foreground">£{r}/day x {d} days</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Perm take-home (after tax and NI)</p><p className="text-lg font-bold">{formatCurrency(result.permTakeHome)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Contract take-home (Ltd, outside IR35)</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.ltd.takeHome)}</p></div>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">Contract revenue vs perm package</p>
            <p className="text-xl font-bold">{result.premiumPct > 0 ? '+' : ''}{result.premiumPct.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Take-home difference {result.takeHomeGap >= 0 ? '+' : '-'}{formatCurrency(Math.abs(result.takeHomeGap))} a year. Break-even day rate outside IR35: £{result.breakEvenDayRate}, with the company also paying the {formatCurrency(result.permPension)} employer pension.</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Contract revenue</td><td className="text-right tabular-nums">{formatCurrency(result.contractGross)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Salary {formatCurrency(LTD_SALARY)} + employer NI</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(LTD_SALARY + result.ltd.employerNI)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Business costs</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.businessCosts)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Corporation Tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.ltd.corpTax)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Dividend tax{result.ltd.salaryTax > 0 ? ' and tax on salary' : ''}</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.ltd.divTax + result.ltd.salaryTax)}</td></tr>
              <tr className="font-semibold"><td className="py-2">Contract take-home</td><td className="text-right tabular-nums">{formatCurrency(result.ltd.takeHome)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>The perm package is salary plus the minimum employer pension of 3% of qualifying earnings ({formatCurrency(result.permPension)}). Paid holiday and sick pay are already part of the salary, so they show up in the per-day figure rather than being added on top. Contract figures assume outside IR35 through a limited company paying a £12,570 salary and dividends; inside IR35 the take-home is lower.</p>
          </div>
        </div>
      )}
    </div>
  )
}
