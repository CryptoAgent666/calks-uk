import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

function calculateOutside(dayRate: number, daysPerYear: number, expenses: number) {
  const revenue = dayRate * daysPerYear
  const profit = revenue - expenses
  const optimalSalary = 12_570
  const dividends = Math.max(0, profit - optimalSalary - profit * 0.25) // rough: corp tax then dividends

  const corpTax = profit <= 50_000 ? profit * 0.19 : profit * 0.25
  const afterCorpTax = profit - corpTax
  const salaryTax = 0 // within PA
  const salaryNI = 0
  const dividendIncome = afterCorpTax - optimalSalary
  const dividendTax = Math.max(0, dividendIncome - 500) * 0.0875 // basic rate

  const takeHome = optimalSalary + dividendIncome - dividendTax

  return { revenue, profit, corpTax, takeHome, effectiveRate: revenue > 0 ? ((revenue - takeHome) / revenue) * 100 : 0 }
}

function calculateInside(dayRate: number, daysPerYear: number) {
  const gross = dayRate * daysPerYear
  let pa = 12_570
  if (gross > 100_000) pa = Math.max(0, 12_570 - Math.floor((gross - 100_000) / 2))
  let tax = 0
  if (gross > pa) {
    if (gross <= 50_270) tax = (gross - pa) * 0.20
    else if (gross <= 125_140) tax = (50_270 - pa) * 0.20 + (gross - 50_270) * 0.40
    else tax = (50_270 - pa) * 0.20 + (125_140 - 50_270) * 0.40 + (gross - 125_140) * 0.45
  }
  let ni = 0
  if (gross > 12_570) {
    if (gross <= 50_270) ni = (gross - 12_570) * 0.08
    else ni = (50_270 - 12_570) * 0.08 + (gross - 50_270) * 0.02
  }
  const employerNI = gross > 5_000 ? (gross - 5_000) * 0.15 : 0
  const takeHome = gross - tax - ni
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
            <input type="number" min="0" value={dayRate} onChange={(e) => setDayRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Working Days/Year</label>
          <input type="number" min="1" max="365" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Annual Expenses (outside IR35)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={expenses} onChange={(e) => setExpenses(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
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
            <p className="text-2xl font-bold text-primary">{formatCurrency(outside.takeHome - inside.takeHome)}</p>
            <p className="text-xs text-muted-foreground">more per year outside IR35</p>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Note:</p>
            <p>Outside IR35: salary + dividends via Ltd company (optimal split).</p>
            <p>Inside IR35: taxed as employment (PAYE + employee NI + employer NI).</p>
            <p>This is a simplified estimate. Actual figures depend on individual circumstances.</p>
          </div>
        </div>
      )}
    </div>
  )
}
