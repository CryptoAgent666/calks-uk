import { useState, useMemo } from 'react'
import { formatCurrency, ukIncomeTax } from '@/utils'

// Prefilled monthly figures. Rent, council tax, energy and water are dated official averages; the rest are
// illustrative round figures for the user to overwrite.
const AVERAGES: Record<string, { label: string; avg: number }> = {
  rent: { label: 'Rent / Mortgage', avg: 1406 }, // ONS average UK private rent, September 2026
  council_tax: { label: 'Council Tax', avg: 199 }, // England average Band D 2026/27 £2,392 / 12
  energy: { label: 'Energy (gas + electric)', avg: 144 }, // Ofgem cap 1 Oct to 31 Dec 2026, £1,723 / 12
  water: { label: 'Water', avg: 53 }, // Water UK 2026/27 average bill £639 / 12
  broadband: { label: 'Broadband + Phone', avg: 45 },
  food: { label: 'Food & Groceries', avg: 350 },
  transport: { label: 'Transport / Car', avg: 250 },
  insurance: { label: 'Insurance (car, home, life)', avg: 120 },
  subscriptions: { label: 'Subscriptions (streaming etc.)', avg: 35 },
  clothing: { label: 'Clothing', avg: 50 },
  personal: { label: 'Personal Care', avg: 30 },
  social: { label: 'Social / Eating Out', avg: 150 },
  savings: { label: 'Savings / Investments', avg: 200 },
  other: { label: 'Other', avg: 100 },
}

export default function CostOfLivingCalculator() {
  // Held as typed text, so a 0 and part-typed decimals such as "0." stay in the field.
  const [costs, setCosts] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    Object.entries(AVERAGES).forEach(([k, v]) => { init[k] = String(v.avg) })
    return init
  })
  const [salary, setSalary] = useState('35000')

  const totalMonthly = Object.values(costs).reduce((s, v) => s + Math.max(0, parseFloat(v) || 0), 0)
  const totalAnnual = totalMonthly * 12

  const s = parseFloat(salary.replace(/,/g, '')) || 0
  // After tax take-home (simplified)
  const tax = ukIncomeTax(s)
  let ni = 0
  if (s > 12_570) { if (s <= 50_270) ni = (s - 12_570) * 0.08; else ni = (50_270 - 12_570) * 0.08 + (s - 50_270) * 0.02 }
  const monthlyTakeHome = (s - tax - ni) / 12
  const surplus = monthlyTakeHome - totalMonthly

  const update = (key: string, value: string) => setCosts(prev => ({ ...prev, [key]: value }))

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Annual Gross Salary</label>
        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Gross Salary" /></div>
      </div>

      <h3 className="text-sm font-semibold">Monthly Expenses</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(AVERAGES).map(([key, info]) => (
          <div key={key} className="flex items-center gap-2">
            <label htmlFor={`col-${key}`} className="text-sm text-muted-foreground w-40 shrink-0">{info.label}</label>
            <div className="relative flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span>
              <input id={`col-${key}`} type="number" min="0" step="any" value={costs[key]} onChange={(e) => update(key, e.target.value)} className="w-full rounded-lg border border-input bg-background pl-7 pr-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label={`${info.label} (monthly £)`} /></div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Prefilled for a whole household, so overwrite them with your own bills. Rent: ONS UK average, September 2026 (£1,406). Council Tax: England average Band D, 2026/27 (£2,392 a year). Energy: Ofgem cap, October to December 2026 (£1,723 a year). Water: Water UK average, 2026/27 (£639 a year). The other lines are illustrative round figures.</p>

      <div className="space-y-4 animate-fade-in-up">
        <div className={`rounded-2xl p-6 text-center ${surplus >= 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
          <p className="text-sm text-muted-foreground">Monthly {surplus >= 0 ? 'Surplus' : 'Shortfall'}</p>
          <p className={`text-3xl font-bold mt-1 ${surplus >= 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(Math.abs(surplus))}</p>
          <p className="text-sm text-muted-foreground mt-1">Take-home: {formatCurrency(monthlyTakeHome)}/month &middot; Expenses: {formatCurrency(totalMonthly)}/month</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Monthly Costs</p><p className="text-lg font-bold">{formatCurrency(totalMonthly)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Annual Costs</p><p className="text-lg font-bold">{formatCurrency(totalAnnual)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">% of Take-Home</p><p className="text-lg font-bold">{monthlyTakeHome > 0 ? ((totalMonthly / monthlyTakeHome) * 100).toFixed(0) : 0}%</p></div>
        </div>
      </div>
    </div>
  )
}
