import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

const BIKS = [
  { id: 'car', name: 'Company Car', description: 'Based on P11D value x BiK rate' },
  { id: 'fuel', name: 'Fuel Benefit', description: 'Car fuel for private use' },
  { id: 'medical', name: 'Private Medical Insurance', description: 'Premium paid by employer' },
  { id: 'gym', name: 'Gym Membership', description: 'If paid directly by employer' },
  { id: 'phone', name: 'Personal Phone Use', description: 'If employer pays your phone bill' },
  { id: 'accommodation', name: 'Living Accommodation', description: 'Annual value of accommodation' },
  { id: 'loans', name: 'Beneficial Loans', description: 'Interest-free/low-interest loans over £10K' },
  { id: 'other', name: 'Other Benefits', description: 'Vouchers, subscriptions, etc.' },
]

function calculate(benefits: Record<string, number>, salary: number) {
  const totalBiK = Object.values(benefits).reduce((s, v) => s + v, 0)
  const taxRate = salary > 125_140 ? 0.45 : salary > 50_270 ? 0.40 : 0.20
  const taxOnBiK = totalBiK * taxRate
  const niOnBiK = totalBiK * 0.15 // Class 1A employer NI (15% from April 2025)
  const monthlyTax = taxOnBiK / 12

  return { totalBiK, taxRate: taxRate * 100, taxOnBiK, niOnBiK, monthlyTax }
}

export default function BenefitsInKindCalculator() {
  const [benefits, setBenefits] = useState<Record<string, number>>({ medical: 800 })
  const [salary, setSalary] = useState('45000')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(benefits, s), [benefits, s])

  const updateBenefit = (id: string, value: number) => setBenefits(prev => {
    const next = { ...prev }
    if (value > 0) next[id] = value
    else delete next[id]
    return next
  })

  return (
    <div className="space-y-6">
      <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div></div>

      <h3 className="text-sm font-semibold">Benefits in Kind (annual value)</h3>
      <div className="space-y-2">
        {BIKS.map(bik => (
          <div key={bik.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
            <div className="flex-1"><p className="text-sm font-medium">{bik.name}</p><p className="text-xs text-muted-foreground">{bik.description}</p></div>
            <div className="relative w-28"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input type="number" min="0" value={benefits[bik.id] || ''} onChange={(e) => updateBenefit(bik.id, parseFloat(e.target.value) || 0)} placeholder="0" className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm text-right font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          </div>
        ))}
      </div>

      {result.totalBiK > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Tax on Your Benefits</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.taxOnBiK)}/year</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyTax)}/month (collected via tax code)</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Total BiK Value</p><p className="text-lg font-bold">{formatCurrency(result.totalBiK)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Your Tax Rate</p><p className="text-lg font-bold">{formatPercent(result.taxRate)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Employer Class 1A NI</p><p className="text-lg font-bold">{formatCurrency(result.niOnBiK)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>BiK tax is collected by adjusting your tax code (reducing your Personal Allowance). Your employer reports benefits on form P11D by 6 July after the tax year.</p>
          </div>
        </div>
      )}
    </div>
  )
}
