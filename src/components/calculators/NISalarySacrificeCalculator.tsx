import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// NI on salary sacrifice pension contributions (proposed from April 2029)
function calculate(salary: number, sacrificeAmount: number) {
  // Current: salary sacrifice saves both tax AND NI
  const currentTax = calcTax(salary) - calcTax(salary - sacrificeAmount)
  const currentNI = calcNI(salary) - calcNI(salary - sacrificeAmount)
  const currentSaving = currentTax + currentNI

  // Proposed 2029: NI still charged on sacrificed amount
  const proposedSaving = currentTax // only tax saving, no NI saving
  const lostNISaving = currentNI

  const netCostCurrent = sacrificeAmount - currentSaving
  const netCostProposed = sacrificeAmount - proposedSaving

  return { currentSaving, proposedSaving, lostNISaving, netCostCurrent, netCostProposed, taxSaving: currentTax, niSaving: currentNI }
}

function calcTax(income: number) {
  let pa = 12_570
  if (income > 100_000) pa = Math.max(0, 12_570 - Math.floor((income - 100_000) / 2))
  let t = 0
  if (income > pa) {
    if (income <= 50_270) t = (income - pa) * 0.20
    else if (income <= 125_140) t = (50_270 - pa) * 0.20 + (income - 50_270) * 0.40
    else t = (50_270 - pa) * 0.20 + (125_140 - 50_270) * 0.40 + (income - 125_140) * 0.45
  }
  return t
}

function calcNI(income: number) {
  if (income <= 12_570) return 0
  if (income <= 50_270) return (income - 12_570) * 0.08
  return (50_270 - 12_570) * 0.08 + (income - 50_270) * 0.02
}

export default function NISalarySacrificeCalculator() {
  const [salary, setSalary] = useState('50000')
  const [sacrifice, setSacrifice] = useState('5000')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const sc = parseFloat(sacrifice.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(s, Math.min(sc, s)), [s, sc])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Annual Sacrifice to Pension</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={sacrifice} onChange={(e) => setSacrifice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Sacrifice to Pension" /></div></div>
      </div>

      {s > 0 && sc > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-5 text-center">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">Current Rules</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.currentSaving)}</p>
              <p className="text-xs text-muted-foreground">Tax: {formatCurrency(result.taxSaving)} + NI: {formatCurrency(result.niSaving)}</p>
              <p className="text-xs text-muted-foreground">Net cost: {formatCurrency(result.netCostCurrent)}</p>
            </div>
            <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-5 text-center">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-300">From April 2029</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-400 mt-1">{formatCurrency(result.proposedSaving)}</p>
              <p className="text-xs text-muted-foreground">Tax only: {formatCurrency(result.taxSaving)}</p>
              <p className="text-xs text-muted-foreground">Net cost: {formatCurrency(result.netCostProposed)}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">You'll Lose</p>
            <p className="text-2xl font-bold text-destructive mt-1">{formatCurrency(result.lostNISaving)}/year</p>
            <p className="text-sm text-muted-foreground mt-1">in NI savings from April 2029</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Proposed change (April 2029):</p>
            <p>Employee NI will be charged on salary sacrifice pension contributions. Currently you save both tax AND NI. After 2029 you'll only save tax. Salary sacrifice will still be better than relief at source, but the advantage shrinks significantly.</p>
          </div>
        </div>
      )}
    </div>
  )
}
