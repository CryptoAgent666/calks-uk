import { useState, useMemo } from 'react'
import { formatCurrency, ukIncomeTax, ukPersonalAllowance } from '@/utils'

const BPA = 3_250 // 2026/27 (gov.uk; 2025/26 was £3,130)
const PA = 12_570

function calculate(income: number, isRegistered: boolean) {
  // Blind Person's Allowance is added to the Personal Allowance, so it lifts the
  // whole band structure by £3,250 — the 40% rate starts at £53,520 instead of
  // £50,270. It does NOT shrink the £37,700 basic-rate band, which is what
  // capping the 20% band at (£50,270 − allowance) used to do: that handed back
  // only 20% of the allowance, halving the saving a higher-rate taxpayer sees.
  // The BPA itself is not income-restricted; only the Personal Allowance tapers.
  const basePA = ukPersonalAllowance(income)
  const totalAllowance = basePA + (isRegistered ? BPA : 0)
  const taxableIncome = Math.max(0, income - totalAllowance)

  const taxWithBPA = ukIncomeTax(income, totalAllowance)
  const taxWithout = ukIncomeTax(income, basePA)

  const saving = taxWithout - taxWithBPA

  return { totalAllowance, bpa: BPA, saving, taxWithBPA, taxWithout }
}

export default function BlindPersonsAllowanceCalculator() {
  const [income, setIncome] = useState('30000')
  const [registered, setRegistered] = useState(true)

  const i = parseFloat(income.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(i, registered), [i, registered])

  return (
    <div className="space-y-6">
      <div><label className="block text-sm font-medium mb-2">Annual Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Income" /></div></div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={registered} onChange={(e) => setRegistered(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Registered blind or severely sight impaired</span></label>

      {i > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Annual Tax Saving</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.saving)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Allowance</p><p className="text-lg font-bold">{formatCurrency(result.totalAllowance)}</p><p className="text-xs text-muted-foreground">PA £{PA.toLocaleString()} + BPA £{BPA.toLocaleString()}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Tax With BPA</p><p className="text-lg font-bold">{formatCurrency(result.taxWithBPA)}</p><p className="text-xs text-muted-foreground">vs {formatCurrency(result.taxWithout)} without</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Blind Person's Allowance (£{BPA.toLocaleString()}) is added to your Personal Allowance. You must be registered as blind/severely sight impaired with your local council. Unused BPA can be transferred to a spouse.</p>
          </div>
        </div>
      )}
    </div>
  )
}
