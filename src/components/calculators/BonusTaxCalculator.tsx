import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

const PA = 12_570
const BASIC = 50_270
const HIGHER = 125_140

function calculate(salary: number, bonus: number) {
  const totalIncome = salary + bonus

  // Tax on salary only
  const taxOnSalary = calcTax(salary)
  // Tax on total
  const taxOnTotal = calcTax(totalIncome)
  // Tax on bonus = difference
  const taxOnBonus = taxOnTotal - taxOnSalary

  // NI on bonus
  const niOnSalary = calcNI(salary)
  const niOnTotal = calcNI(totalIncome)
  const niOnBonus = niOnTotal - niOnSalary

  const totalDeductions = taxOnBonus + niOnBonus
  const netBonus = bonus - totalDeductions

  return { bonus, taxOnBonus, niOnBonus, totalDeductions, netBonus, effectiveRate: bonus > 0 ? (totalDeductions / bonus) * 100 : 0 }
}

function calcTax(income: number) {
  let pa = PA
  if (income > 100_000) pa = Math.max(0, PA - Math.floor((income - 100_000) / 2))
  let tax = 0
  if (income > pa) {
    if (income <= BASIC) tax = (income - pa) * 0.20
    else if (income <= HIGHER) tax = (BASIC - pa) * 0.20 + (income - BASIC) * 0.40
    else tax = (BASIC - pa) * 0.20 + (HIGHER - BASIC) * 0.40 + (income - HIGHER) * 0.45
  }
  return tax
}

function calcNI(income: number) {
  if (income <= 12_570) return 0
  if (income <= 50_270) return (income - 12_570) * 0.08
  return (50_270 - 12_570) * 0.08 + (income - 50_270) * 0.02
}

export default function BonusTaxCalculator() {
  const [salary, setSalary] = useState('35000')
  const [bonus, setBonus] = useState('')

  const s = parseFloat(salary.replace(/,/g, '')) || 0
  const b = parseFloat(bonus.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(s, b), [s, b])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Annual Salary (before bonus)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="35,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary (before bonus)" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Bonus Amount</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={bonus} onChange={(e) => setBonus(e.target.value)} placeholder="5,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Bonus Amount" /></div>
        </div>
      </div>

      {b > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Bonus After Tax</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.netBonus)}</p>
            <p className="text-sm text-muted-foreground mt-1">of {formatCurrency(result.bonus)} bonus</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Gross Bonus</p><p className="text-lg font-bold">{formatCurrency(result.bonus)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Income Tax</p><p className="text-lg font-bold text-destructive">-{formatCurrency(result.taxOnBonus)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">National Insurance</p><p className="text-lg font-bold text-destructive">-{formatCurrency(result.niOnBonus)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Effective Rate</p><p className="text-lg font-bold">{formatPercent(result.effectiveRate)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
