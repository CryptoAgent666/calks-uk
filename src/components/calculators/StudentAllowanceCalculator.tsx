import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Special Support Grant / Disabled Students' Allowance info
const BURSARIES: Record<string, { name: string; maxAmount: number; incomeLimit: number }> = {
  nhs: { name: 'NHS Bursary (nursing etc.)', maxAmount: 5_612, incomeLimit: 0 },
  teacher: { name: 'Teacher Training Bursary', maxAmount: 29_000, incomeLimit: 0 },
  social: { name: 'Social Work Bursary', maxAmount: 4_862, incomeLimit: 0 },
  dsa: { name: "Disabled Students' Allowance", maxAmount: 27_783, incomeLimit: 0 },
  care: { name: 'Care Leavers Bursary', maxAmount: 2_000, incomeLimit: 0 },
}

function calculate(householdIncome: number, selectedBursaries: string[], maintenanceLoan: number) {
  const bursaryTotal = selectedBursaries.reduce((sum, id) => sum + (BURSARIES[id]?.maxAmount || 0), 0)
  const totalSupport = maintenanceLoan + bursaryTotal
  const monthlySinceGrant = totalSupport / 9 // 9 months academic year
  const weeklySinceGrant = totalSupport / 39

  return { bursaryTotal, totalSupport, monthlySinceGrant, weeklySinceGrant, maintenanceLoan }
}

export default function StudentAllowanceCalculator() {
  const [income, setIncome] = useState('30000')
  const [loan, setLoan] = useState('10000')
  const [selected, setSelected] = useState<string[]>([])

  const i = parseFloat(income.replace(/,/g,'')) || 0
  const l = parseFloat(loan.replace(/,/g,'')) || 0

  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])

  const result = useMemo(() => calculate(i, selected, l), [i, selected, l])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Maintenance Loan (annual)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={loan} onChange={(e) => setLoan(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Maintenance Loan (annual)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Household Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Household Income" /></div></div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Additional Support (select all that apply)</h3>
        <div className="space-y-2">
          {Object.entries(BURSARIES).map(([id, info]) => (
            <label key={id} className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-colors ${selected.includes(id) ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent'}`}>
              <div className="flex items-center gap-3"><input type="checkbox" checked={selected.includes(id)} onChange={() => toggle(id)} className="h-5 w-5 rounded border-border" /><span className="text-sm font-medium">{info.name}</span></div>
              <span className="text-sm font-bold text-primary">up to {formatCurrency(info.maxAmount)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Total Annual Support</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalSupport)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlySinceGrant)}/month &middot; {formatCurrency(result.weeklySinceGrant)}/week (term time)</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Maintenance Loan</p><p className="text-lg font-bold">{formatCurrency(l)}</p></div>
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Bursaries / Grants</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.bursaryTotal)}</p></div>
        </div>
      </div>
    </div>
  )
}
