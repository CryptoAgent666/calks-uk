import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type PensionMethod = 'netpay' | 'ras' | 'sacrifice'

// 2026/27 annual figures. Income tax bands are widths of TAXABLE pay (pay after
// the tax-code allowance), so K codes and 0T move the 40% start down with them.
const RUK_BANDS = [
  { width: 37_700, rate: 0.20 },
  { width: 125_140 - 37_700, rate: 0.40 },
  { width: Infinity, rate: 0.45 },
]
// Scottish bands on taxable pay: starter to £3,967, basic to £16,956,
// intermediate to £31,092, higher to £62,430, advanced to £125,140, then top.
const SCOTTISH_BANDS = [
  { width: 3_967, rate: 0.19 },
  { width: 12_989, rate: 0.20 },
  { width: 14_136, rate: 0.21 },
  { width: 31_338, rate: 0.42 },
  { width: 62_710, rate: 0.45 },
  { width: Infinity, rate: 0.48 },
]
// Codes that tax all pay at a single rate, with no allowance
const FLAT_CODES: Record<string, number> = { BR: 0.20, D0: 0.40, D1: 0.45 }
const SCOTTISH_FLAT_CODES: Record<string, number> = { BR: 0.20, D0: 0.21, D1: 0.42, D2: 0.45, D3: 0.48 }

const NI_PRIMARY_THRESHOLD = 12_570
const NI_UPPER_EARNINGS_LIMIT = 50_270
const NI_SECONDARY_THRESHOLD = 5_000
// Auto-enrolment qualifying earnings band 2026/27
const QE_LOWER = 6_240
const QE_UPPER = 50_270
const EMPLOYER_MIN_PENSION = 0.03

const STUDENT_LOANS: Record<string, { label: string; threshold: number; rate: number }> = {
  none: { label: 'None', threshold: 0, rate: 0 },
  plan1: { label: 'Plan 1', threshold: 26_900, rate: 0.09 },
  plan2: { label: 'Plan 2', threshold: 29_385, rate: 0.09 },
  plan4: { label: 'Plan 4', threshold: 33_795, rate: 0.09 },
  plan5: { label: 'Plan 5', threshold: 25_000, rate: 0.09 },
}
const POSTGRAD_LOAN = { threshold: 21_000, rate: 0.06 }

interface ParsedTaxCode {
  valid: boolean
  scottish: boolean
  allowance: number // annual tax-free pay
  kAddition: number // annual amount a K code adds to taxable pay
  flatRate: number | null
  noTax: boolean
}

function parseTaxCode(raw: string): ParsedTaxCode {
  let code = raw.toUpperCase().replace(/\s+/g, '')
  // Emergency markers (W1, M1, X) make the code non-cumulative. For a single
  // month taken in isolation the deduction is the same, so they are dropped.
  code = code.replace(/(W1|M1|X)$/, '')
  let scottish = false
  if (code.startsWith('S')) {
    scottish = true
    code = code.slice(1)
  } else if (code.startsWith('C')) {
    // Welsh taxpayers currently pay the same rates as England and Northern Ireland
    code = code.slice(1)
  }
  const base: ParsedTaxCode = { valid: true, scottish, allowance: 0, kAddition: 0, flatRate: null, noTax: false }
  if (code === 'NT') return { ...base, noTax: true }
  const flat = (scottish ? SCOTTISH_FLAT_CODES : FLAT_CODES)[code]
  if (flat !== undefined) return { ...base, flatRate: flat }
  const allowanceCode = code.match(/^(\d{1,4})[LMNT]$/)
  if (allowanceCode) return { ...base, allowance: Number(allowanceCode[1]) * 10 }
  const kCode = code.match(/^K(\d{1,4})$/)
  if (kCode) return { ...base, kAddition: Number(kCode[1]) * 10 }
  // Unrecognised: fall back to the standard code, keeping any Scottish prefix
  return { ...base, valid: false, allowance: 12_570 }
}

function describeTaxCode(code: ParsedTaxCode): string {
  const region = code.scottish ? 'Scottish rates' : 'rUK rates'
  if (code.noTax) return 'NT: no tax deducted'
  if (code.flatRate !== null) return `All pay taxed at ${Math.round(code.flatRate * 100)}%, no allowance`
  if (code.kAddition > 0) return `K code: ${formatCurrency(code.kAddition)} a year added to taxable pay · ${region}`
  return `${formatCurrency(code.allowance)} a year tax-free · ${region}`
}

function bandTax(taxable: number, bands: { width: number; rate: number }[]): number {
  let remaining = Math.max(0, taxable)
  let tax = 0
  for (const band of bands) {
    const inBand = Math.min(remaining, band.width)
    tax += inBand * band.rate
    remaining -= inBand
    if (remaining <= 0) break
  }
  return tax
}

// Annual income tax on annualised taxable pay under a parsed tax code
function incomeTaxForCode(taxablePay: number, code: ParsedTaxCode): number {
  if (code.noTax) return 0
  if (code.flatRate !== null) return Math.max(0, taxablePay) * code.flatRate
  const taxable = taxablePay - code.allowance + code.kAddition
  const tax = bandTax(taxable, code.scottish ? SCOTTISH_BANDS : RUK_BANDS)
  // Overriding limit: tax under a K code cannot exceed half of the pay
  return code.kAddition > 0 ? Math.min(tax, Math.max(0, taxablePay) * 0.5) : tax
}

function employeeNI(pay: number): number {
  if (pay <= NI_PRIMARY_THRESHOLD) return 0
  return (Math.min(pay, NI_UPPER_EARNINGS_LIMIT) - NI_PRIMARY_THRESHOLD) * 0.08 + Math.max(0, pay - NI_UPPER_EARNINGS_LIMIT) * 0.02
}

function employerNI(pay: number): number {
  return Math.max(0, pay - NI_SECONDARY_THRESHOLD) * 0.15
}

const r2 = (x: number) => Math.round(x * 100) / 100

function calculate(grossSalary: number, taxCode: string, pensionPct: number, pensionMethod: PensionMethod, studentLoan: string, postgradLoan: boolean) {
  const code = parseTaxCode(taxCode)
  const gross = grossSalary / 12

  // Employee contribution as a % of gross pay
  const contribution = gross * (pensionPct / 100)
  // Salary sacrifice cuts pay before tax AND NI; a net pay arrangement cuts it
  // before tax only; relief at source comes out of net pay at 80%, and the
  // provider claims the other 20% from HMRC.
  const sacrifice = pensionMethod === 'sacrifice' ? contribution : 0
  const niPay = gross - sacrifice
  const taxablePay = niPay - (pensionMethod === 'netpay' ? contribution : 0)
  const pensionFromNet = pensionMethod === 'netpay' ? contribution : pensionMethod === 'ras' ? contribution * 0.8 : 0

  const monthlyTax = r2(incomeTaxForCode(taxablePay * 12, code) / 12)
  const monthlyNI = r2(employeeNI(niPay * 12) / 12)

  // Student and postgraduate loans: % of pay above the monthly threshold,
  // rounded down to the pound as payroll does
  const sl = STUDENT_LOANS[studentLoan] || STUDENT_LOANS.none
  const monthlySL = sl.rate > 0 ? Math.floor(Math.max(0, niPay - sl.threshold / 12) * sl.rate) : 0
  const monthlyPGL = postgradLoan ? Math.floor(Math.max(0, niPay - POSTGRAD_LOAN.threshold / 12) * POSTGRAD_LOAN.rate) : 0

  const monthlyGross = r2(gross)
  const monthlySacrifice = r2(sacrifice)
  const monthlyPension = r2(pensionFromNet)
  const monthlyNetPay = r2(monthlyGross - monthlySacrifice - monthlyTax - monthlyNI - monthlyPension - monthlySL - monthlyPGL)

  // Employer side. The minimum employer contribution is 3% of qualifying
  // earnings (£6,240 to £50,270 a year), worked out on the contractual salary.
  const monthlyErNI = r2(employerNI(niPay * 12) / 12)
  const monthlyErNISaving = sacrifice > 0 ? r2(employerNI(gross * 12) / 12 - monthlyErNI) : 0
  const monthlyErPension = r2((Math.max(0, Math.min(grossSalary, QE_UPPER) - QE_LOWER) / 12) * EMPLOYER_MIN_PENSION)
  // The sacrificed amount is still paid by the employer, into the pension
  const totalEmployerCost = r2(monthlyGross + monthlyErNI + monthlyErPension)

  return {
    code, monthlyGross, monthlySacrifice, monthlyTax, monthlyNI, monthlyContribution: r2(contribution), monthlyPension,
    monthlySL, monthlyPGL, monthlyNetPay, monthlyErNI, monthlyErNISaving, monthlyErPension, totalEmployerCost,
    annualGross: grossSalary, annualNet: monthlyNetPay * 12,
  }
}

export default function PayrollCalculator() {
  const [salary, setSalary] = useState('35000')
  const [taxCode, setTaxCode] = useState('1257L')
  const [pension, setPension] = useState('5')
  const [method, setMethod] = useState<PensionMethod>('netpay')
  const [sl, setSl] = useState('none')
  const [pgl, setPgl] = useState(false)

  const s = parseFloat(salary.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(s, taxCode, parseFloat(pension) || 0, method, sl, pgl), [s, taxCode, pension, method, sl, pgl])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Tax Code</label><input type="text" value={taxCode} onChange={(e) => setTaxCode(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium uppercase focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Tax Code" /><p className="text-xs text-muted-foreground mt-1">{describeTaxCode(result.code)}</p></div>
        <div><label className="block text-sm font-medium mb-2">Student Loan</label><select value={sl} onChange={(e) => setSl(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Student Loan">{Object.entries(STUDENT_LOANS).map(([v, p]) => <option key={v} value={v}>{p.label}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Employee Pension (% of gross pay)</label><input type="number" min="0" max="50" step="0.5" value={pension} onChange={(e) => setPension(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Employee Pension (% of gross pay)" /></div>
        <div className="col-span-2"><label className="block text-sm font-medium mb-2">Pension Method</label><select value={method} onChange={(e) => setMethod(e.target.value as PensionMethod)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Pension Method"><option value="netpay">Net pay arrangement (before tax)</option><option value="ras">Relief at source (from net pay)</option><option value="sacrifice">Salary sacrifice (before tax and NI)</option></select></div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={pgl} onChange={(e) => setPgl(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">Also repaying a Postgraduate Loan (6% above £21,000)</span>
      </label>

      {!result.code.valid && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">Tax code not recognised, so the standard 1257L allowance is used. Codes take forms such as 1257L, S1257L, C1257L, K475, BR, D0, 0T or NT.</div>
      )}

      {s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <h3 className="text-sm font-semibold">Monthly Payslip</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border font-medium"><td className="py-2.5">Gross Pay</td><td className="text-right tabular-nums">{formatCurrency(result.monthlyGross)}</td></tr>
              {result.monthlySacrifice > 0 && <tr className="border-b border-border/50"><td className="py-2">Salary sacrifice pension ({pension}%)</td><td className="text-right tabular-nums">-{formatCurrency(result.monthlySacrifice)}</td></tr>}
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income Tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.monthlyTax)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Employee NI</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.monthlyNI)}</td></tr>
              {method === 'netpay' && <tr className="border-b border-border/50"><td className="py-2">Pension ({pension}%, net pay arrangement)</td><td className="text-right tabular-nums">-{formatCurrency(result.monthlyPension)}</td></tr>}
              {method === 'ras' && <tr className="border-b border-border/50"><td className="py-2">Pension (80% of {formatCurrency(result.monthlyContribution)}, relief at source)</td><td className="text-right tabular-nums">-{formatCurrency(result.monthlyPension)}</td></tr>}
              {result.monthlySL > 0 && <tr className="border-b border-border/50"><td className="py-2">Student Loan ({STUDENT_LOANS[sl]?.label})</td><td className="text-right tabular-nums">-{formatCurrency(result.monthlySL)}</td></tr>}
              {result.monthlyPGL > 0 && <tr className="border-b border-border/50"><td className="py-2">Postgraduate Loan</td><td className="text-right tabular-nums">-{formatCurrency(result.monthlyPGL)}</td></tr>}
              <tr className="font-semibold text-primary"><td className="py-2.5">Net Pay</td><td className="text-right tabular-nums">{formatCurrency(result.monthlyNetPay)}</td></tr>
            </tbody>
          </table>
          {method === 'ras' && result.monthlyContribution > 0 && (
            <p className="text-xs text-muted-foreground">The pension provider claims the other 20% ({formatCurrency(result.monthlyContribution - result.monthlyPension)}) from HMRC. Higher and additional rate taxpayers claim further relief through Self Assessment.</p>
          )}

          <h3 className="text-sm font-semibold">Employer Costs (monthly)</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Employer NI (15%)</p><p className="text-lg font-bold">{formatCurrency(result.monthlyErNI)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Employer pension (3% of qualifying earnings)</p><p className="text-lg font-bold">{formatCurrency(result.monthlyErPension)}</p></div>
            <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">Total Employer Cost</p><p className="text-lg font-bold text-primary">{formatCurrency(result.totalEmployerCost)}</p></div>
          </div>
          {result.monthlySacrifice > 0 && (
            <p className="text-xs text-muted-foreground">Salary sacrifice saves the employer {formatCurrency(result.monthlyErNISaving)} a month in NI. The sacrificed {formatCurrency(result.monthlySacrifice)} is paid into the pension by the employer and is included in the total cost.</p>
          )}
        </div>
      )}
    </div>
  )
}
