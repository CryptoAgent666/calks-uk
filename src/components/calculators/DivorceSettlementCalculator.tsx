import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(property: number, mortgage: number, pensions1: number, pensions2: number, savings: number, debts: number, yearsMarried: number, hasChildren: boolean) {
  const equity = property - mortgage
  const totalAssets = equity + pensions1 + pensions2 + savings - debts
  const halfShare = totalAssets / 2

  // Needs-based adjustment (simplified)
  const childAdjustment = hasChildren ? totalAssets * 0.05 : 0 // primary carer gets slightly more
  const longerMarriageAdj = yearsMarried > 15 ? 0 : yearsMarried > 10 ? 0.02 : 0.05 // shorter = may not be 50/50

  const share1 = halfShare + childAdjustment
  const share2 = halfShare - childAdjustment

  return { totalAssets, equity, halfShare, share1, share2, childAdjustment }
}

export default function DivorceSettlementCalculator() {
  const [property, setProperty] = useState('350000')
  const [mortgage, setMortgage] = useState('150000')
  const [pensions1, setPensions1] = useState('50000')
  const [pensions2, setPensions2] = useState('20000')
  const [savings, setSavings] = useState('30000')
  const [debts, setDebts] = useState('5000')
  const [years, setYears] = useState('12')
  const [children, setChildren] = useState(true)

  const result = useMemo(() => calculate(parseFloat(property.replace(/,/g,''))||0, parseFloat(mortgage.replace(/,/g,''))||0, parseFloat(pensions1.replace(/,/g,''))||0, parseFloat(pensions2.replace(/,/g,''))||0, parseFloat(savings.replace(/,/g,''))||0, parseFloat(debts.replace(/,/g,''))||0, parseInt(years)||0, children), [property,mortgage,pensions1,pensions2,savings,debts,years,children])

  const Input = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div><label className="block text-sm font-medium mb-2">{label}</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Input label="Property Value" value={property} onChange={setProperty} />
        <Input label="Mortgage" value={mortgage} onChange={setMortgage} />
        <Input label="Pension (Person 1)" value={pensions1} onChange={setPensions1} />
        <Input label="Pension (Person 2)" value={pensions2} onChange={setPensions2} />
        <Input label="Savings / Investments" value={savings} onChange={setSavings} />
        <Input label="Debts" value={debts} onChange={setDebts} />
        <div><label className="block text-sm font-medium mb-2">Years Married</label><input type="number" min="0" max="50" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years Married" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={children} onChange={(e) => setChildren(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Dependent children (primary carer adjustment)</span></label>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Total Matrimonial Assets</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalAssets)}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-muted/50 p-5 text-center"><p className="text-sm font-medium">Person 1 (primary carer)</p><p className="text-2xl font-bold mt-1">{formatCurrency(result.share1)}</p></div>
          <div className="rounded-xl bg-muted/50 p-5 text-center"><p className="text-sm font-medium">Person 2</p><p className="text-2xl font-bold mt-1">{formatCurrency(result.share2)}</p></div>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2">Property Equity</td><td className="text-right tabular-nums">{formatCurrency(result.equity)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Pensions (combined)</td><td className="text-right tabular-nums">{formatCurrency((parseFloat(pensions1.replace(/,/g,''))||0) + (parseFloat(pensions2.replace(/,/g,''))||0))}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Savings</td><td className="text-right tabular-nums">{formatCurrency(parseFloat(savings.replace(/,/g,''))||0)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2 text-destructive">Debts</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(parseFloat(debts.replace(/,/g,''))||0)}</td></tr>
          </tbody>
        </table>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>England & Wales: the starting point is 50/50, but courts consider needs, contributions, earning capacity and welfare of children. This is a simplified guide — seek legal advice for your specific circumstances.</p>
        </div>
      </div>
    </div>
  )
}
