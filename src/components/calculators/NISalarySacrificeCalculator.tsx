import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// NI on salary sacrifice pension contributions from 6 April 2029
// National Insurance Contributions (Employer Pensions Contributions) Act 2026 (c.15):
// from 2029/30 only the first £2,000 a year of pension salary sacrifice stays NI-free.
// The excess counts as earnings for Class 1 primary (employee) AND secondary (employer) NI.
// Income tax relief is unchanged. 2026/27 rates and thresholds are used as the assumption for 2029/30.
const NI_FREE_LIMIT = 2_000
const EMPLOYER_NI_RATE = 0.15
const SECONDARY_THRESHOLD = 5_000

function calculate(salary: number, sacrificeAmount: number) {
  const niFreeFrom2029 = Math.min(sacrificeAmount, NI_FREE_LIMIT)
  const excess = sacrificeAmount - niFreeFrom2029

  // Current: the whole sacrifice saves income tax, employee NI and employer NI
  const taxSaving = calcTax(salary) - calcTax(salary - sacrificeAmount)
  const niSaving = calcNI(salary) - calcNI(salary - sacrificeAmount)
  const currentSaving = taxSaving + niSaving

  // From April 2029: tax relief unchanged, NI saved only on the first £2,000
  const niSaving2029 = calcNI(salary) - calcNI(salary - niFreeFrom2029)
  const saving2029 = taxSaving + niSaving2029
  const lostNISaving = niSaving - niSaving2029

  const netCostCurrent = sacrificeAmount - currentSaving
  const netCost2029 = sacrificeAmount - saving2029

  const employerNICurrent = calcEmployerNI(salary - sacrificeAmount)
  const employerNI2029 = calcEmployerNI(salary - niFreeFrom2029)
  const employerExtraNI = employerNI2029 - employerNICurrent

  return {
    currentSaving, saving2029, lostNISaving, netCostCurrent, netCost2029,
    taxSaving, niSaving, niSaving2029, excess,
    employerNICurrent, employerNI2029, employerExtraNI,
  }
}

function calcTax(income: number) {
  let pa = 12_570
  if (income > 100_000) pa = Math.max(0, 12_570 - Math.floor((income - 100_000) / 2))
  let t = 0
  if (income > pa) {
    if (income <= 50_270) t = (income - pa) * 0.20
    else if (income <= 125_140) t = 37_700 * 0.20 + (income - pa - 37_700) * 0.40
    else t = 37_700 * 0.20 + (125_140 - 37_700) * 0.40 + (income - 125_140) * 0.45
  }
  return t
}

function calcNI(income: number) {
  if (income <= 12_570) return 0
  if (income <= 50_270) return (income - 12_570) * 0.08
  return (50_270 - 12_570) * 0.08 + (income - 50_270) * 0.02
}

function calcEmployerNI(pay: number) {
  return Math.max(0, pay - SECONDARY_THRESHOLD) * EMPLOYER_NI_RATE
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
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-400 mt-1">{formatCurrency(result.saving2029)}</p>
              <p className="text-xs text-muted-foreground">Tax: {formatCurrency(result.taxSaving)} + NI: {formatCurrency(result.niSaving2029)}</p>
              <p className="text-xs text-muted-foreground">Net cost: {formatCurrency(result.netCost2029)}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">You'll Lose</p>
            <p className="text-2xl font-bold text-destructive mt-1">{formatCurrency(result.lostNISaving)}/year</p>
            <p className="text-sm text-muted-foreground mt-1">
              {result.excess > 0
                ? `in NI savings from April 2029 (NI charged on the ${formatCurrency(result.excess)} above the £2,000 limit)`
                : 'Your sacrifice is within the £2,000 limit, so it stays NI-free after April 2029'}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Employer NI now</span><span className="font-medium">{formatCurrency(result.employerNICurrent)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Employer NI from April 2029</span><span className="font-medium">{formatCurrency(result.employerNI2029)}</span></div>
            <div className="flex justify-between border-t border-border pt-2 mt-2"><span className="text-muted-foreground">Extra employer NI per year</span><span className="font-bold">{formatCurrency(result.employerExtraNI)}</span></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">The law from 6 April 2029:</p>
            <p>The National Insurance Contributions (Employer Pensions Contributions) Act 2026 keeps the first £2,000 a year of pension salary sacrifice free of NI. Anything above £2,000 is treated as pay for both employee NI and employer NI (15%). Income tax relief does not change. Figures use 2026/27 tax and NI rates and thresholds as an assumption for 2029/30, and the £2,000 limit can be changed by regulations.</p>
          </div>
        </div>
      )}
    </div>
  )
}
