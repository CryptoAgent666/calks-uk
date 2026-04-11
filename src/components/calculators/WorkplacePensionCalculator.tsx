import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(salary: number, employeePct: number, employerPct: number, currentPot: number, yearsToRetirement: number, growthRate: number) {
  const monthlyEmployee = (salary * employeePct / 100) / 12
  const monthlyEmployer = (salary * employerPct / 100) / 12
  const monthlyTotal = monthlyEmployee + monthlyEmployer
  const monthlyGrowth = growthRate / 100 / 12

  let pot = currentPot
  const yearlyData: { year: number; contributions: number; growth: number; total: number }[] = []
  let totalContributions = currentPot

  for (let y = 1; y <= yearsToRetirement; y++) {
    for (let m = 0; m < 12; m++) {
      pot = pot * (1 + monthlyGrowth) + monthlyTotal
    }
    totalContributions += monthlyTotal * 12
    yearlyData.push({ year: y, contributions: totalContributions, growth: pot - totalContributions, total: pot })
  }

  const annualEmployee = salary * employeePct / 100
  const annualEmployer = salary * employerPct / 100
  const taxRelief = annualEmployee * 0.20 // Basic rate relief at source

  return {
    pot, totalContributions, totalGrowth: pot - totalContributions,
    annualEmployee, annualEmployer, annualTotal: annualEmployee + annualEmployer,
    monthlyEmployee, monthlyEmployer, monthlyTotal, taxRelief, yearlyData,
  }
}

export default function WorkplacePensionCalculator() {
  const [salary, setSalary] = useState('35000')
  const [employeePct, setEmployeePct] = useState('5')
  const [employerPct, setEmployerPct] = useState('3')
  const [currentPot, setCurrentPot] = useState('0')
  const [years, setYears] = useState('30')
  const [growth, setGrowth] = useState('5')

  const s = parseFloat(salary.replace(/,/g, '')) || 0
  const ep = parseFloat(employeePct) || 0
  const erp = parseFloat(employerPct) || 0
  const cp = parseFloat(currentPot.replace(/,/g, '')) || 0
  const y = parseInt(years) || 0
  const g = parseFloat(growth) || 0
  const result = useMemo(() => calculate(s, ep, erp, cp, y, g), [s, ep, erp, cp, y, g])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Annual Salary</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Your Contribution (%)</label>
          <input type="number" min="0" max="100" step="0.5" value={employeePct} onChange={(e) => setEmployeePct(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Employer Contribution (%)</label>
          <input type="number" min="0" max="100" step="0.5" value={employerPct} onChange={(e) => setEmployerPct(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Current Pension Pot</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={currentPot} onChange={(e) => setCurrentPot(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Years to Retirement</label>
          <input type="number" min="1" max="50" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Expected Growth (%)</label>
          <input type="number" min="0" max="15" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      {s > 0 && y > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Projected Pension Pot at Retirement</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.pot)}</p>
            <p className="text-sm text-muted-foreground mt-1">25% tax-free lump sum: {formatCurrency(result.pot * 0.25)}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Your Monthly</p><p className="text-lg font-bold">{formatCurrency(result.monthlyEmployee)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Employer Monthly</p><p className="text-lg font-bold">{formatCurrency(result.monthlyEmployer)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Investment Growth</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalGrowth)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Tax Relief (basic)</p><p className="text-lg font-bold">{formatCurrency(result.taxRelief)}/yr</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
