import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Teachers' Pension Scheme (career average, 1/57th accrual)
const ACCRUAL_RATE = 1 / 57
const REVALUATION = 0.032 // CPI + 1.6% for active members

const CONTRIBUTION_RATES = [
  { upTo: 32_947, rate: 7.4 },
  { upTo: 46_525, rate: 8.6 },
  { upTo: 57_790, rate: 9.6 },
  { upTo: 79_573, rate: 10.2 },
  { upTo: Infinity, rate: 11.3 },
]

function calculate(salary: number, yearsService: number, yearsToRetirement: number) {
  // Employee contribution rate
  let contribRate = 7.4
  for (const band of CONTRIBUTION_RATES) {
    if (salary <= band.upTo) { contribRate = band.rate; break }
  }

  const monthlyContrib = salary * (contribRate / 100) / 12
  const annualContrib = salary * (contribRate / 100)

  // Annual pension earned this year
  const thisYearPension = salary * ACCRUAL_RATE

  // Projected pension (simplified: assume same salary, career average with revaluation)
  let totalPension = thisYearPension * yearsService
  // Future years
  for (let y = 0; y < yearsToRetirement; y++) {
    totalPension *= (1 + REVALUATION)
    totalPension += thisYearPension
  }

  const monthlyPension = totalPension / 12
  const lumpSum = totalPension * 3 // can commute up to 25% for 3:1 lump sum

  return { contribRate, monthlyContrib, annualContrib, thisYearPension, totalPension, monthlyPension, lumpSum }
}

export default function TeachersPensionCalculator() {
  const [salary, setSalary] = useState('40000')
  const [years, setYears] = useState('15')
  const [toRetire, setToRetire] = useState('20')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const y = parseInt(years) || 0
  const tr = parseInt(toRetire) || 0
  const result = useMemo(() => calculate(s, y, tr), [s, y, tr])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Current Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years Service So Far</label><input type="number" min="0" max="40" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years Service So Far" /></div>
        <div><label className="block text-sm font-medium mb-2">Years to Retirement</label><input type="number" min="0" max="40" value={toRetire} onChange={(e) => setToRetire(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years to Retirement" /></div>
      </div>

      {s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Projected Annual Pension at Retirement</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalPension)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyPension)}/month</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">This Year's Accrual</p><p className="text-lg font-bold">{formatCurrency(result.thisYearPension)}/yr</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Contribution Rate</p><p className="text-lg font-bold">{result.contribRate}%</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly Contribution</p><p className="text-lg font-bold">{formatCurrency(result.monthlyContrib)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Max Lump Sum (optional)</p><p className="text-lg font-bold">{formatCurrency(result.lumpSum)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Career average scheme: 1/57th of pensionable salary accrued each year, revalued annually by CPI + 1.6%. Normal pension age is linked to State Pension age. This is a simplified projection.</p>
          </div>
        </div>
      )}
    </div>
  )
}
