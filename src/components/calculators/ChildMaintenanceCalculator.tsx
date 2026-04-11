import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// CMS rates 2025
function calculate(grossWeeklyIncome: number, children: number, nightsPerWeek: number, otherChildren: number) {
  let income = grossWeeklyIncome

  // Deduction for other children living with paying parent
  const otherChildReduction = otherChildren === 1 ? 0.11 : otherChildren === 2 ? 0.14 : otherChildren >= 3 ? 0.16 : 0
  income = income * (1 - otherChildReduction)

  // Basic rate based on number of children
  let rate: number
  if (children === 1) rate = 0.12
  else if (children === 2) rate = 0.16
  else rate = 0.19 // 3+

  let weeklyAmount = income * rate

  // Shared care reduction
  if (nightsPerWeek >= 1) {
    const reductions: Record<number, number> = { 1: 1/7, 2: 2/7, 3: 3/7 }
    const reduction = reductions[Math.min(nightsPerWeek, 3)] || 3/7
    weeklyAmount *= (1 - reduction)
  }

  // Income thresholds
  if (grossWeeklyIncome < 7) {
    weeklyAmount = 0 // nil rate
  } else if (grossWeeklyIncome < 100) {
    weeklyAmount = 7 // flat rate
  } else if (grossWeeklyIncome >= 800) {
    // Reduced rate on income over £800/week
    const basic = 800 * rate
    const excess = (income - 800) * rate * 0.5 // reduced rate on excess
    weeklyAmount = basic + excess
    if (nightsPerWeek >= 1) {
      const reduction = Math.min(nightsPerWeek, 3) / 7
      weeklyAmount *= (1 - reduction)
    }
  }

  return { weeklyAmount, monthlyAmount: weeklyAmount * 52 / 12, annualAmount: weeklyAmount * 52, rate: rate * 100 }
}

export default function ChildMaintenanceCalculator() {
  const [income, setIncome] = useState('600')
  const [children, setChildren] = useState('1')
  const [nights, setNights] = useState('0')
  const [otherChildren, setOtherChildren] = useState('0')

  const i = parseFloat(income) || 0
  const c = parseInt(children) || 1
  const n = parseInt(nights) || 0
  const oc = parseInt(otherChildren) || 0
  const result = useMemo(() => calculate(i, c, n, oc), [i, c, n, oc])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Gross Weekly Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" max="3000" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Children to Pay For</label><input type="number" min="1" max="10" value={children} onChange={(e) => setChildren(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Shared Care Nights/Week</label><select value={nights} onChange={(e) => setNights(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="0">0 nights (no reduction)</option><option value="1">1 night (1/7 reduction)</option><option value="2">2 nights (2/7 reduction)</option><option value="3">3+ nights (3/7 reduction)</option>
        </select></div>
        <div><label className="block text-sm font-medium mb-2">Other Children in Household</label><input type="number" min="0" max="10" value={otherChildren} onChange={(e) => setOtherChildren(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Weekly Child Maintenance</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.weeklyAmount)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyAmount)}/month &middot; {formatCurrency(result.annualAmount)}/year</p>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Based on CMS basic rate ({result.rate}% for {c} child{c > 1 ? 'ren' : ''}).</p>
          <p className="mt-1">Gross income under £7/week = nil rate. £7-£100 = flat rate (£7/week). Over £800/week = reduced rate on excess.</p>
        </div>
      </div>
    </div>
  )
}
