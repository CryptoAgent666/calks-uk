import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type BusinessType = 'office' | 'retail' | 'construction' | 'manufacturing' | 'hospitality'

const BASE_RATES: Record<BusinessType, number> = {
  office: 3.5, retail: 6, construction: 25, manufacturing: 15, hospitality: 8,
}

function calculate(employees: number, annualWages: number, businessType: BusinessType) {
  const ratePerThousand = BASE_RATES[businessType]
  const premium = (annualWages / 1000) * ratePerThousand
  const premiumPerEmployee = employees > 0 ? premium / employees : 0
  const minCover = 5_000_000 // legal minimum £5M

  return { premium, premiumPerEmployee, ratePerThousand, minCover, monthlyPremium: premium / 12 }
}

export default function EmployersLiabilityCalculator() {
  const [employees, setEmployees] = useState('5')
  const [wages, setWages] = useState('150000')
  const [type, setType] = useState<BusinessType>('office')

  const e = parseInt(employees) || 0
  const w = parseFloat(wages.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(e, w, type), [e, w, type])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Number of Employees</label><input type="number" min="1" max="1000" value={employees} onChange={(ev) => setEmployees(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Total Annual Wages</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={wages} onChange={(ev) => setWages(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Business Type</label><select value={type} onChange={(ev) => setType(ev.target.value as BusinessType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"><option value="office">Office / Professional</option><option value="retail">Retail</option><option value="hospitality">Hospitality</option><option value="manufacturing">Manufacturing</option><option value="construction">Construction</option></select></div>
      </div>

      {e > 0 && w > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Annual Premium</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.premium)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyPremium)}/month &middot; {formatCurrency(result.premiumPerEmployee)}/employee</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Rate</p><p className="text-lg font-bold">£{result.ratePerThousand}/£1K wages</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Min Cover Required</p><p className="text-lg font-bold">£{(result.minCover/1e6).toFixed(0)}M</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Per Employee</p><p className="text-lg font-bold">{formatCurrency(result.premiumPerEmployee)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Employers' Liability Insurance is a legal requirement for most UK businesses with employees. Minimum cover: £5 million. Fine for non-compliance: up to £2,500 per day. Rates vary by industry risk and claims history.</p>
          </div>
        </div>
      )}
    </div>
  )
}
