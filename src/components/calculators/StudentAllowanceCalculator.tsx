import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Student Finance England, new full-time students, 2026/27 full-year rates ("How you're
// assessed and paid 2026 to 2027"). The loan falls by £1 for every £X of household income
// over £25,000 until only the basic rate is left (max minus the largest income assessment).
type Living = 'home' | 'away' | 'london'
export const MAINTENANCE_LOAN_2026_27: Record<Living, { label: string; max: number; incomePerPound: number; maxAssessment: number }> = {
  home: { label: 'Living with parents', max: 9_118, incomePerPound: 6.54, maxAssessment: 5_105 }, // basic rate £4,013
  away: { label: 'Away from home, outside London', max: 10_830, incomePerPound: 6.47, maxAssessment: 5_782 }, // basic £5,048
  london: { label: 'Away from home, in London', max: 14_135, incomePerPound: 6.36, maxAssessment: 7_096 }, // basic £7,039
}
const INCOME_THRESHOLD = 25_000
const TUITION_FEE_LOAN = 9_790 // up to, 2026/27, paid to the university

// Grants and bursaries on top of the loan
const BURSARIES: Record<string, { name: string; maxAmount: number }> = {
  nhs: { name: 'NHS Learning Support Fund training grant (nursing, midwifery, AHP)', maxAmount: 5_000 },
  nhs_bursary: { name: 'NHS Bursary (medicine or dentistry, later years, London)', maxAmount: 4_528 },
  teacher: { name: 'Teacher Training Bursary', maxAmount: 29_000 },
  social: { name: 'Social Work Bursary', maxAmount: 4_862 },
  dsa: { name: "Disabled Students' Allowance", maxAmount: 27_783 },
  // Children Act 1989 (Higher Education Bursary) (England) Regulations 2009, reg 2
  care: { name: 'Care leaver higher education bursary (local authority, England)', maxAmount: 2_000 },
}

export function maintenanceLoan(householdIncome: number, living: Living, careLeaver: boolean) {
  const rates = MAINTENANCE_LOAN_2026_27[living]
  // From 2026/27 a care leaver's household income is not used, so the maximum can be borrowed
  if (careLeaver) return rates.max
  const assessment = Math.min(Math.floor(Math.max(0, householdIncome - INCOME_THRESHOLD) / rates.incomePerPound), rates.maxAssessment)
  return rates.max - assessment
}

export function calculate(householdIncome: number, living: Living, careLeaver: boolean, selectedBursaries: string[]) {
  const loan = maintenanceLoan(householdIncome, living, careLeaver)
  const bursaryTotal = selectedBursaries.reduce((sum, id) => sum + (BURSARIES[id]?.maxAmount || 0), 0)
  const totalSupport = loan + bursaryTotal // paid to the student
  const totalPackage = totalSupport + TUITION_FEE_LOAN
  const monthlySinceGrant = totalSupport / 9 // 9 months academic year
  const weeklySinceGrant = totalSupport / 39

  return { loan, bursaryTotal, totalSupport, totalPackage, monthlySinceGrant, weeklySinceGrant }
}

export default function StudentAllowanceCalculator() {
  const [income, setIncome] = useState('30000')
  const [living, setLiving] = useState<Living>('away')
  const [careLeaver, setCareLeaver] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  const i = parseFloat(income.replace(/,/g,'')) || 0

  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])

  const result = useMemo(() => calculate(i, living, careLeaver, selected), [i, living, careLeaver, selected])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Household Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Household Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Where you will live</label><select value={living} onChange={(e) => setLiving(e.target.value as Living)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Where you will live">{Object.entries(MAINTENANCE_LOAN_2026_27).map(([k, r]) => <option key={k} value={k}>{r.label}</option>)}</select></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={careLeaver} onChange={(e) => setCareLeaver(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label="Care leaver" /><span className="text-sm">I'm a care leaver (household income is not used, so you can borrow the maximum)</span></label>
      <p className="text-xs text-muted-foreground">Maintenance Loan figures are Student Finance England full-year rates for new students in 2026/27 (the final year pays less). Students from Wales, Scotland and Northern Ireland apply to their own funding body.</p>

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
          <p className="text-sm text-muted-foreground">Total Annual Support Paid to You</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalSupport)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlySinceGrant)}/month &middot; {formatCurrency(result.weeklySinceGrant)}/week (term time)</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Maintenance Loan (repayable)</p><p className="text-lg font-bold">{formatCurrency(result.loan)}</p></div>
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Bursaries / Grants (not repaid)</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.bursaryTotal)}</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
          <p>Tuition Fee Loan, paid straight to your university: up to {formatCurrency(TUITION_FEE_LOAN)}. Total package including it: {formatCurrency(result.totalPackage)}.</p>
          {selected.includes('nhs_bursary') && <p>With an NHS Bursary that depends on household income, Student Finance England gives a reduced-rate Maintenance Loan that does not depend on household income, so your loan will be lower than shown.</p>}
        </div>
      </div>
    </div>
  )
}
