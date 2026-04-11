import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(grossSalary: number, taxCode: string, pensionPct: number, studentLoan: string) {
  // Parse tax code (simplified 1257L style)
  const codeNum = parseInt(taxCode.replace(/[^\d]/g, '')) || 1257
  const pa = codeNum * 10

  // Monthly figures
  const monthlyGross = grossSalary / 12
  const monthlyPA = pa / 12

  // Income Tax (monthly)
  let monthlyTax = 0
  const monthlyTaxable = Math.max(0, monthlyGross - monthlyPA)
  const basicMonthly = (50_270 - pa) / 12
  if (monthlyTaxable <= basicMonthly) monthlyTax = monthlyTaxable * 0.20
  else if (monthlyTaxable <= (125_140 - pa) / 12) monthlyTax = basicMonthly * 0.20 + (monthlyTaxable - basicMonthly) * 0.40
  else monthlyTax = basicMonthly * 0.20 + ((125_140 - pa) / 12 - basicMonthly) * 0.40 + (monthlyTaxable - (125_140 - pa) / 12) * 0.45

  // Employee NI (monthly)
  const monthlyNIPT = 12_570 / 12
  const monthlyNIUEL = 50_270 / 12
  let monthlyNI = 0
  if (monthlyGross > monthlyNIPT) {
    if (monthlyGross <= monthlyNIUEL) monthlyNI = (monthlyGross - monthlyNIPT) * 0.08
    else monthlyNI = (monthlyNIUEL - monthlyNIPT) * 0.08 + (monthlyGross - monthlyNIUEL) * 0.02
  }

  // Employer NI (monthly)
  const monthlyErNI = monthlyGross > 5_000/12 ? (monthlyGross - 5_000/12) * 0.15 : 0

  // Pension
  const monthlyPension = monthlyGross * (pensionPct / 100)
  const monthlyErPension = monthlyGross * 0.03 // min employer 3%

  // Student Loan
  const plans: Record<string, { threshold: number; rate: number }> = {
    none: { threshold: 0, rate: 0 }, plan1: { threshold: 24_990, rate: 0.09 },
    plan2: { threshold: 27_295, rate: 0.09 }, plan4: { threshold: 31_395, rate: 0.09 },
  }
  const sl = plans[studentLoan] || plans.none
  const monthlySL = grossSalary > sl.threshold ? ((grossSalary - sl.threshold) * sl.rate) / 12 : 0

  const monthlyNetPay = monthlyGross - monthlyTax - monthlyNI - monthlyPension - monthlySL
  const totalEmployerCost = monthlyGross + monthlyErNI + monthlyErPension

  return {
    monthlyGross, monthlyTax, monthlyNI, monthlyPension, monthlySL, monthlyNetPay,
    monthlyErNI, monthlyErPension, totalEmployerCost,
    annualGross: grossSalary, annualNet: monthlyNetPay * 12,
  }
}

export default function PayrollCalculator() {
  const [salary, setSalary] = useState('35000')
  const [taxCode, setTaxCode] = useState('1257L')
  const [pension, setPension] = useState('5')
  const [sl, setSl] = useState('none')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(s, taxCode, parseFloat(pension)||0, sl), [s, taxCode, pension, sl])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Tax Code</label><input type="text" value={taxCode} onChange={(e) => setTaxCode(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium uppercase focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Employee Pension (%)</label><input type="number" min="0" max="50" step="0.5" value={pension} onChange={(e) => setPension(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Student Loan</label><select value={sl} onChange={(e) => setSl(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"><option value="none">None</option><option value="plan1">Plan 1</option><option value="plan2">Plan 2</option><option value="plan4">Plan 4</option></select></div>
      </div>

      {s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <h3 className="text-sm font-semibold">Monthly Payslip</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border font-medium"><td className="py-2.5">Gross Pay</td><td className="text-right tabular-nums">{formatCurrency(result.monthlyGross)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income Tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.monthlyTax)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Employee NI</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.monthlyNI)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Pension ({pension}%)</td><td className="text-right tabular-nums">-{formatCurrency(result.monthlyPension)}</td></tr>
              {result.monthlySL > 0 && <tr className="border-b border-border/50"><td className="py-2">Student Loan</td><td className="text-right tabular-nums">-{formatCurrency(result.monthlySL)}</td></tr>}
              <tr className="font-semibold text-primary"><td className="py-2.5">Net Pay</td><td className="text-right tabular-nums">{formatCurrency(result.monthlyNetPay)}</td></tr>
            </tbody>
          </table>

          <h3 className="text-sm font-semibold">Employer Costs (monthly)</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Employer NI (15%)</p><p className="text-lg font-bold">{formatCurrency(result.monthlyErNI)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Employer Pension (3%)</p><p className="text-lg font-bold">{formatCurrency(result.monthlyErPension)}</p></div>
            <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">Total Employer Cost</p><p className="text-lg font-bold text-primary">{formatCurrency(result.totalEmployerCost)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
