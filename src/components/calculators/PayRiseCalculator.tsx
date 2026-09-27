import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent, ukIncomeTax } from '@/utils'

// 2026/27 student loan thresholds (annual) and repayment rates.
const STUDENT_LOANS: Record<string, { threshold: number; rate: number; label: string }> = {
  none: { threshold: Infinity, rate: 0, label: 'None' },
  plan1: { threshold: 26_900, rate: 0.09, label: 'Plan 1' },
  plan2: { threshold: 29_385, rate: 0.09, label: 'Plan 2' },
  plan4: { threshold: 33_795, rate: 0.09, label: 'Plan 4' },
  plan5: { threshold: 25_000, rate: 0.09, label: 'Plan 5' },
  postgrad: { threshold: 21_000, rate: 0.06, label: 'Postgraduate' },
}

// Employee Class 1 NI 2026/27: 8% between £12,570 and £50,270, 2% above.
function employeeNI(pay: number) {
  if (pay <= 12_570) return 0
  if (pay <= 50_270) return (pay - 12_570) * 0.08
  return (50_270 - 12_570) * 0.08 + (pay - 50_270) * 0.02
}

// Take-home for England, Wales and Northern Ireland. The pension is a % of
// salary taken before tax: under a net pay arrangement it saves income tax
// only; by salary sacrifice it also lowers the pay NI and student loan use.
function takeHome(salary: number, pensionPct: number, sacrifice: boolean, loan: string) {
  const pension = salary * (pensionPct / 100)
  const taxable = salary - pension
  const niPay = sacrifice ? salary - pension : salary
  const sl = STUDENT_LOANS[loan] ?? STUDENT_LOANS.none
  const tax = ukIncomeTax(taxable)
  const ni = employeeNI(niPay)
  const studentLoan = Math.max(0, niPay - sl.threshold) * sl.rate
  return { pension, tax, ni, studentLoan, net: salary - pension - tax - ni - studentLoan }
}

function calculate(currentSalary: number, newSalary: number, inflationRate: number, pensionPct = 0, sacrifice = false, loan = 'none') {
  const increase = newSalary - currentSalary
  const pctIncrease = currentSalary > 0 ? (increase / currentSalary) * 100 : 0
  // Real change is a ratio, not a subtraction: (1 + rise) / (1 + inflation) - 1.
  const realIncrease = ((1 + pctIncrease / 100) / (1 + inflationRate / 100) - 1) * 100

  const before = takeHome(currentSalary, pensionPct, sacrifice, loan)
  const after = takeHome(newSalary, pensionPct, sacrifice, loan)
  const netIncrease = after.net - before.net
  const keptPct = increase !== 0 ? (netIncrease / increase) * 100 : 0
  const marginalRate = increase !== 0 ? 100 - keptPct : 0
  // New take-home expressed in today's money, compared with take-home now.
  const realNetChange = after.net / (1 + inflationRate / 100) - before.net

  return {
    increase, pctIncrease, realIncrease,
    netBefore: before.net, netAfter: after.net, netIncrease, keptPct, marginalRate, realNetChange,
    extraTax: after.tax - before.tax, extraNI: after.ni - before.ni,
    extraPension: after.pension - before.pension, extraLoan: after.studentLoan - before.studentLoan,
    monthlyBefore: before.net / 12, monthlyAfter: after.net / 12, monthlyIncrease: netIncrease / 12,
  }
}

export default function PayRiseCalculator() {
  const [current, setCurrent] = useState('')
  const [newSal, setNewSal] = useState('')
  const [inflation, setInflation] = useState('3.1')
  const [pension, setPension] = useState('5')
  const [sacrifice, setSacrifice] = useState(false)
  const [loan, setLoan] = useState('none')

  const c = parseFloat(current.replace(/,/g,'')) || 0
  const n = parseFloat(newSal.replace(/,/g,'')) || 0
  const i = parseFloat(inflation) || 0
  const p = parseFloat(pension) || 0
  const result = useMemo(() => calculate(c, n, i, p, sacrifice, loan), [c, n, i, p, sacrifice, loan])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Current Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="35,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">New Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={newSal} onChange={(e) => setNewSal(e.target.value)} placeholder="37,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="New Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Inflation Rate (%)</label><input type="number" min="0" max="20" step="0.1" value={inflation} onChange={(e) => setInflation(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Inflation Rate (%)" /><p className="text-xs text-muted-foreground mt-1">Default 3.1%: CPI, 12 months to August 2026 (ONS)</p></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Your Pension (% of salary)</label><input type="number" min="0" max="40" step="0.5" value={pension} onChange={(e) => setPension(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Pension (% of salary)" /></div>
        <div><label className="block text-sm font-medium mb-2">Student Loan</label><select value={loan} onChange={(e) => setLoan(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Student Loan">{Object.entries(STUDENT_LOANS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
        <label className="flex items-center gap-3 cursor-pointer sm:pt-7"><input type="checkbox" checked={sacrifice} onChange={(e) => setSacrifice(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label="Pension by salary sacrifice" /><span className="text-sm">Pension by salary sacrifice (also saves NI)</span></label>
      </div>

      {c > 0 && n > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl p-4 text-center ${result.pctIncrease >= 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
              <p className="text-xs text-muted-foreground">Pay Rise</p>
              <p className={`text-xl font-bold ${result.pctIncrease >= 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatPercent(result.pctIncrease)}</p>
              <p className="text-sm text-muted-foreground">{formatCurrency(result.increase)}/year gross</p>
            </div>
            <div className={`rounded-xl p-4 text-center ${result.realIncrease >= 0 ? 'bg-primary/10' : 'bg-destructive/10'}`}>
              <p className="text-xs text-muted-foreground">Real Terms (after inflation)</p>
              <p className={`text-xl font-bold ${result.realIncrease >= 0 ? 'text-primary' : 'text-destructive'}`}>{result.realIncrease >= 0 ? '+' : ''}{formatPercent(result.realIncrease)}</p>
              <p className="text-sm text-muted-foreground">{result.realIncrease >= 0 ? 'Real pay rise' : 'Real pay cut'}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Extra Take-Home Pay</p>
            <p className={`text-3xl font-bold mt-1 ${result.netIncrease >= 0 ? 'text-primary' : 'text-destructive'}`}>{formatCurrency(result.netIncrease)}/year</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyIncrease)}/month &middot; you keep {formatPercent(result.keptPct)} of the rise &middot; marginal deduction rate {formatPercent(result.marginalRate)}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Take-Home Before</p><p className="text-lg font-bold">{formatCurrency(result.netBefore)}</p><p className="text-xs text-muted-foreground">{formatCurrency(result.monthlyBefore)}/month</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Take-Home After</p><p className="text-lg font-bold">{formatCurrency(result.netAfter)}</p><p className="text-xs text-muted-foreground">{formatCurrency(result.monthlyAfter)}/month</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Real Take-Home Change</p><p className={`text-lg font-bold ${result.realNetChange >= 0 ? 'text-green-600' : 'text-destructive'}`}>{formatCurrency(result.realNetChange)}</p><p className="text-xs text-muted-foreground">a year, in today&apos;s money</p></div>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Gross increase</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.increase)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Extra income tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.extraTax)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Extra employee NI</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.extraNI)}</td></tr>
              {result.extraPension !== 0 && <tr className="border-b border-border/50"><td className="py-2">Extra pension ({p}%{sacrifice ? ', salary sacrifice' : ', before tax'})</td><td className="text-right tabular-nums">-{formatCurrency(result.extraPension)}</td></tr>}
              {result.extraLoan !== 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Extra student loan repayment</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.extraLoan)}</td></tr>}
              <tr className="font-semibold"><td className="py-2 text-primary">Extra take-home</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.netIncrease)}</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground">2026/27 income tax and NI for England, Wales and Northern Ireland, including the Personal Allowance taper above £100,000. The High Income Child Benefit Charge is not included.</p>
        </div>
      )}
    </div>
  )
}
