import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// UC rates 2026/27 (monthly, from April 2025, uprated by 1.7% CPI)
const STANDARD_SINGLE_UNDER25 = 316.98
const STANDARD_SINGLE_25PLUS = 400.14
const STANDARD_COUPLE_UNDER25 = 497.55
const STANDARD_COUPLE_25PLUS = 628.15
const CHILD_FIRST = 339.00       // was £333.33 in 2024/25
const CHILD_ADDITIONAL = 292.81  // was £287.92 in 2024/25
const HOUSING_ELEMENT_MAX = 1200 // placeholder, varies by LHA area
const TAPER_RATE = 0.55
const WORK_ALLOWANCE_HOUSING = 411   // was £404 in 2024/25
const WORK_ALLOWANCE_NO_HOUSING = 684 // was £673 in 2024/25

type Status = 'single_under25' | 'single_25plus' | 'couple_under25' | 'couple_25plus'

function calculate(status: Status, children: number, earnings: number, rent: number, hasHousingCosts: boolean) {
  const standardRates: Record<Status, number> = {
    single_under25: STANDARD_SINGLE_UNDER25, single_25plus: STANDARD_SINGLE_25PLUS,
    couple_under25: STANDARD_COUPLE_UNDER25, couple_25plus: STANDARD_COUPLE_25PLUS,
  }

  let maxUC = standardRates[status]
  // Child element
  if (children >= 1) maxUC += CHILD_FIRST
  if (children >= 2) maxUC += CHILD_ADDITIONAL * (children - 1)
  // Housing element
  const housingElement = hasHousingCosts ? Math.min(rent, HOUSING_ELEMENT_MAX) : 0
  maxUC += housingElement

  // Work allowance & taper
  const workAllowance = hasHousingCosts ? WORK_ALLOWANCE_HOUSING : (children > 0 ? WORK_ALLOWANCE_NO_HOUSING : 0)
  const excessEarnings = Math.max(0, earnings - workAllowance)
  const deduction = excessEarnings * TAPER_RATE

  const ucPayment = Math.max(0, maxUC - deduction)

  return { maxUC, workAllowance, deduction, ucPayment, housingElement, annualUC: ucPayment * 12 }
}

export default function UniversalCreditCalculator() {
  const [status, setStatus] = useState<Status>('single_25plus')
  const [children, setChildren] = useState('0')
  const [earnings, setEarnings] = useState('')
  const [rent, setRent] = useState('800')
  const [housing, setHousing] = useState(true)

  const e = parseFloat(earnings.replace(/,/g, '')) || 0
  const r = parseFloat(rent.replace(/,/g, '')) || 0
  const c = parseInt(children) || 0
  const result = useMemo(() => calculate(status, c, e, r, housing), [status, c, e, r, housing])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Your Situation</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="single_under25">Single, under 25</option>
            <option value="single_25plus">Single, 25 or over</option>
            <option value="couple_under25">Couple, both under 25</option>
            <option value="couple_25plus">Couple, either 25+</option>
          </select></div>
        <div><label className="block text-sm font-medium mb-2">Number of Children</label>
          <input type="number" min="0" max="10" value={children} onChange={(e) => setChildren(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Monthly Net Earnings</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={earnings} onChange={(e) => setEarnings(e.target.value)} placeholder="0" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Monthly Rent</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={housing} onChange={(e) => setHousing(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">Include housing costs element</span>
      </label>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Monthly Universal Credit</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.ucPayment)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.annualUC)}/year</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2">Maximum UC entitlement</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.maxUC)}</td></tr>
            {result.housingElement > 0 && <tr className="border-b border-border/50"><td className="py-2 text-muted-foreground">(includes housing element)</td><td className="text-right tabular-nums text-muted-foreground">{formatCurrency(result.housingElement)}</td></tr>}
            {e > 0 && <tr className="border-b border-border/50"><td className="py-2">Work allowance</td><td className="text-right tabular-nums">{formatCurrency(result.workAllowance)}</td></tr>}
            {result.deduction > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Earnings deduction (55%)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.deduction)}</td></tr>}
            <tr className="font-semibold"><td className="py-2 text-primary">UC Payment</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.ucPayment)}</td></tr>
          </tbody>
        </table>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>This is a simplified estimate. Actual UC depends on your full circumstances including savings, disability, caring responsibilities and local housing allowance rates.</p>
        </div>
      </div>
    </div>
  )
}
