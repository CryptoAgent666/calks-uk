import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(salary: number, sacrificeAmount: number) {
  const PA = 12_570
  const BASIC = 50_270

  const calcDeductions = (gross: number) => {
    let pa = PA
    if (gross > 100_000) pa = Math.max(0, PA - Math.floor((gross - 100_000) / 2))
    let tax = 0
    if (gross > pa) {
      if (gross <= BASIC) tax = (gross - pa) * 0.20
      else if (gross <= 125_140) tax = (BASIC - pa) * 0.20 + (gross - BASIC) * 0.40
      else tax = (BASIC - pa) * 0.20 + (125_140 - BASIC) * 0.40 + (gross - 125_140) * 0.45
    }
    let ni = 0
    if (gross > 12_570) {
      if (gross <= 50_270) ni = (gross - 12_570) * 0.08
      else ni = (50_270 - 12_570) * 0.08 + (gross - 50_270) * 0.02
    }
    return { tax, ni, takeHome: gross - tax - ni }
  }

  const before = calcDeductions(salary)
  const after = calcDeductions(salary - sacrificeAmount)

  const taxSaved = before.tax - after.tax
  const niSaved = before.ni - after.ni
  const totalSaved = taxSaved + niSaved
  const netCost = sacrificeAmount - totalSaved

  return {
    salary, sacrificeAmount, before, after, taxSaved, niSaved, totalSaved, netCost,
    effectiveCost: sacrificeAmount > 0 ? (netCost / sacrificeAmount) * 100 : 0,
  }
}

export default function SalarySacrificeCalculator() {
  const [salary, setSalary] = useState('40000')
  const [sacrifice, setSacrifice] = useState('5000')

  const s = parseFloat(salary.replace(/,/g, '')) || 0
  const sc = parseFloat(sacrifice.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(s, Math.min(sc, s)), [s, sc])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Annual Gross Salary</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="40,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Annual Sacrifice Amount</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={sacrifice} onChange={(e) => setSacrifice(e.target.value)} placeholder="5,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
      </div>

      {s > 0 && sc > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Tax & NI Saved</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.totalSaved)}</p>
            <p className="text-sm text-muted-foreground mt-1">Net cost to you: {formatCurrency(result.netCost)} ({result.effectiveCost.toFixed(0)}% of sacrifice)</p>
          </div>

          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground"></th><th className="text-right py-2 font-medium text-muted-foreground">Before Sacrifice</th><th className="text-right py-2 font-medium text-muted-foreground">After Sacrifice</th><th className="text-right py-2 font-medium text-muted-foreground">Saving</th></tr></thead>
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2.5">Gross Salary</td><td className="text-right tabular-nums">{formatCurrency(s)}</td><td className="text-right tabular-nums">{formatCurrency(s - sc)}</td><td></td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5">Income Tax</td><td className="text-right tabular-nums">{formatCurrency(result.before.tax)}</td><td className="text-right tabular-nums">{formatCurrency(result.after.tax)}</td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.taxSaved)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5">National Insurance</td><td className="text-right tabular-nums">{formatCurrency(result.before.ni)}</td><td className="text-right tabular-nums">{formatCurrency(result.after.ni)}</td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.niSaved)}</td></tr>
              <tr className="font-semibold"><td className="py-2.5">Take-Home Pay</td><td className="text-right tabular-nums">{formatCurrency(result.before.takeHome)}</td><td className="text-right tabular-nums">{formatCurrency(result.after.takeHome)}</td><td></td></tr>
            </tbody>
          </table>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>By sacrificing {formatCurrency(sc)}, your take-home pay drops by only {formatCurrency(result.before.takeHome - result.after.takeHome)} — a saving of {formatCurrency(result.totalSaved)} in tax and NI.</p>
          </div>
        </div>
      )}
    </div>
  )
}
