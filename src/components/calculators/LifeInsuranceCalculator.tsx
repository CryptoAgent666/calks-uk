import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(annualIncome: number, yearsToReplace: number, mortgage: number, otherDebts: number, childrenCosts: number, funeralCosts: number, savings: number, existingCover: number) {
  const incomeReplacement = annualIncome * yearsToReplace
  const totalNeeds = incomeReplacement + mortgage + otherDebts + childrenCosts + funeralCosts
  const totalResources = savings + existingCover
  const coverNeeded = Math.max(0, totalNeeds - totalResources)

  return { incomeReplacement, totalNeeds, totalResources, coverNeeded, mortgage, otherDebts, childrenCosts, funeralCosts }
}

export default function LifeInsuranceCalculator() {
  const [income, setIncome] = useState('35000')
  const [years, setYears] = useState('15')
  const [mortgage, setMortgage] = useState('200000')
  const [debts, setDebts] = useState('0')
  const [children, setChildren] = useState('50000')
  const [funeral, setFuneral] = useState('5000')
  const [savings, setSavings] = useState('10000')
  const [existing, setExisting] = useState('0')

  const result = useMemo(() => calculate(
    parseFloat(income.replace(/,/g,''))||0, parseInt(years)||0,
    parseFloat(mortgage.replace(/,/g,''))||0, parseFloat(debts.replace(/,/g,''))||0,
    parseFloat(children.replace(/,/g,''))||0, parseFloat(funeral.replace(/,/g,''))||0,
    parseFloat(savings.replace(/,/g,''))||0, parseFloat(existing.replace(/,/g,''))||0
  ), [income, years, mortgage, debts, children, funeral, savings, existing])

  const Input = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
        <input type="text" inputMode="numeric" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input label="Annual Income" value={income} onChange={setIncome} />
        <div><label className="block text-sm font-medium mb-2">Years to Replace Income</label><input type="number" min="1" max="40" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <Input label="Outstanding Mortgage" value={mortgage} onChange={setMortgage} />
        <Input label="Other Debts" value={debts} onChange={setDebts} />
        <Input label="Children's Costs (education etc.)" value={children} onChange={setChildren} />
        <Input label="Funeral Costs" value={funeral} onChange={setFuneral} />
        <Input label="Existing Savings" value={savings} onChange={setSavings} />
        <Input label="Existing Life Cover" value={existing} onChange={setExisting} />
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Recommended Life Cover</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.coverNeeded)}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Total Needs</p><p className="text-lg font-bold">{formatCurrency(result.totalNeeds)}</p></div>
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4"><p className="text-xs text-muted-foreground">Already Covered</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalResources)}</p></div>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2">Income replacement ({years} years)</td><td className="text-right tabular-nums">{formatCurrency(result.incomeReplacement)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Mortgage</td><td className="text-right tabular-nums">{formatCurrency(result.mortgage)}</td></tr>
            {result.otherDebts > 0 && <tr className="border-b border-border/50"><td className="py-2">Other debts</td><td className="text-right tabular-nums">{formatCurrency(result.otherDebts)}</td></tr>}
            {result.childrenCosts > 0 && <tr className="border-b border-border/50"><td className="py-2">Children's costs</td><td className="text-right tabular-nums">{formatCurrency(result.childrenCosts)}</td></tr>}
            <tr className="border-b border-border/50"><td className="py-2">Funeral costs</td><td className="text-right tabular-nums">{formatCurrency(result.funeralCosts)}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
