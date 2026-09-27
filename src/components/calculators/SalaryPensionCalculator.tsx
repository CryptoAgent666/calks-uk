import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// 2026/27 income tax bands as cumulative limits of TAXABLE income (after the Personal Allowance)
const RUK_BANDS = [
  { upTo: 37_700, rate: 0.20 },
  { upTo: 125_140, rate: 0.40 },
  { upTo: Infinity, rate: 0.45 },
]
// Scotland: starter 3,967 / basic 12,989 / intermediate 14,136 / higher 31,338 / advanced 62,710 wide
const SCOT_BANDS = [
  { upTo: 3_967, rate: 0.19 },
  { upTo: 16_956, rate: 0.20 },
  { upTo: 31_092, rate: 0.21 },
  { upTo: 62_430, rate: 0.42 },
  { upTo: 125_140, rate: 0.45 },
  { upTo: Infinity, rate: 0.48 },
]
const LOWER_EARNINGS_LIMIT = 6_708 // 2026/27, £129 a week
const NLW_HOURLY = 12.71 // National Living Wage, 21 and over, from 1 April 2026
const NLW_FULL_TIME = NLW_HOURLY * 37.5 * 52
const NI_FREE_SACRIFICE_2029 = 2_000 // NICs (Employer Pensions Contributions) Act 2026, from 6 April 2029
const ANNUAL_ALLOWANCE = 60_000

function personalAllowance(adjustedNetIncome: number) {
  if (adjustedNetIncome <= 100_000) return 12_570
  return Math.max(0, 12_570 - Math.floor((adjustedNetIncome - 100_000) / 2))
}

// Income tax. A relief-at-source contribution `gross` is taken off adjusted net income (restoring any
// tapered Personal Allowance) and extends every band limit above the lowest one (ITA 2007 s192).
function incomeTax(income: number, scotland: boolean, gross = 0) {
  const bands = scotland ? SCOT_BANDS : RUK_BANDS
  const taxable = Math.max(0, income - personalAllowance(income - gross))
  let tax = 0
  let lower = 0
  bands.forEach((b, i) => {
    const upper = i === 0 && scotland ? b.upTo : b.upTo + gross
    if (taxable > lower) tax += (Math.min(taxable, upper) - lower) * b.rate
    lower = upper
  })
  return tax
}

// Employee Class 1 NI 2026/27: 8% between £12,570 and £50,270, 2% above
function calcNI(income: number) {
  if (income <= 12_570) return 0
  if (income <= 50_270) return (income - 12_570) * 0.08
  return (50_270 - 12_570) * 0.08 + (income - 50_270) * 0.02
}

// Employer Class 1 NI: 15% above the £5,000 secondary threshold
function calcEmployerNI(income: number) {
  return income > 5_000 ? (income - 5_000) * 0.15 : 0
}

function calculate(salary: number, amount: number, pensionType: string, scotland = false) {
  const isSacrifice = pensionType === 'sacrifice'

  const taxBefore = incomeTax(salary, scotland)
  const niBefore = calcNI(salary)
  const takeHomeBefore = salary - taxBefore - niBefore

  let takeHomeAfter: number, taxSaving: number, niSaving = 0, employerNISaving = 0
  let reliefAtSource = 0, selfAssessmentRelief = 0
  let niSaving2029 = 0, employerNISaving2029 = 0
  let newGross = salary

  if (isSacrifice) {
    // Salary sacrifice: gross pay falls, so income tax and both kinds of NI fall with it
    newGross = salary - amount
    const taxAfter = incomeTax(newGross, scotland)
    const niAfter = calcNI(newGross)
    takeHomeAfter = newGross - taxAfter - niAfter
    taxSaving = taxBefore - taxAfter
    niSaving = niBefore - niAfter
    employerNISaving = calcEmployerNI(salary) - calcEmployerNI(newGross)
    // From 6 April 2029 only the first £2,000 a year stays free of NI (at today's NI rates)
    const niFree = Math.min(amount, NI_FREE_SACRIFICE_2029)
    niSaving2029 = niBefore - calcNI(salary - niFree)
    employerNISaving2029 = calcEmployerNI(salary) - calcEmployerNI(salary - niFree)
  } else {
    // Relief at source: you pay 80% from net pay and the provider adds 20% basic-rate relief.
    // Higher, advanced and additional rate relief is reclaimed through Self Assessment. No NI saving.
    reliefAtSource = amount * 0.20
    selfAssessmentRelief = Math.max(0, taxBefore - incomeTax(salary, scotland, amount))
    takeHomeAfter = takeHomeBefore - amount * 0.80 + selfAssessmentRelief
    taxSaving = reliefAtSource + selfAssessmentRelief
  }

  const takeHomeDrop = takeHomeBefore - takeHomeAfter
  const totalSaving = taxSaving + niSaving
  const effectiveCost = amount - totalSaving
  const reliefRate = amount > 0 ? (totalSaving / amount) * 100 : 0

  return {
    takeHomeBefore, takeHomeAfter, takeHomeDrop, taxSaving, niSaving, totalSaving, effectiveCost, reliefRate,
    pensionContrib: amount, employerNISaving, reliefAtSource, selfAssessmentRelief, niSaving2029, employerNISaving2029,
    newGross,
    belowLEL: isSacrifice && newGross < LOWER_EARNINGS_LIMIT,
    nearMinimumWage: isSacrifice && newGross < NLW_FULL_TIME,
    capFrom2029: isSacrifice && amount > NI_FREE_SACRIFICE_2029,
    overAllowance: amount > ANNUAL_ALLOWANCE,
  }
}

export default function SalaryPensionCalculator() {
  const [salary, setSalary] = useState('50000')
  const [amount, setAmount] = useState('5000')
  const [type, setType] = useState('sacrifice')
  const [scotland, setScotland] = useState(false)

  const s = parseFloat(salary.replace(/,/g, '')) || 0
  const a = parseFloat(amount.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(s, Math.min(a, s), type, scotland), [s, a, type, scotland])
  const isSacrifice = type === 'sacrifice'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Annual Pension Contribution (gross)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Pension Contribution (gross)" /></div></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setType('sacrifice')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${type === 'sacrifice' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Salary Sacrifice</button>
        <button onClick={() => setType('relief')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${type === 'relief' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Relief at Source</button>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={scotland} onChange={(e) => setScotland(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Scottish taxpayer (Scottish income tax bands)</span></label>

      {s > 0 && a > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">{isSacrifice ? 'Tax & NI Saving' : 'Tax Relief'}</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.totalSaving)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.pensionContrib)} into pension costs you {formatCurrency(result.effectiveCost)} in take-home pay ({result.reliefRate.toFixed(0)}% relief)</p>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground"></th><th className="text-right py-2 font-medium text-muted-foreground">Before</th><th className="text-right py-2 font-medium text-muted-foreground">After</th></tr></thead>
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Annual Take-Home</td><td className="text-right tabular-nums">{formatCurrency(result.takeHomeBefore)}</td><td className="text-right tabular-nums">{formatCurrency(result.takeHomeAfter)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Monthly Take-Home</td><td className="text-right tabular-nums">{formatCurrency(result.takeHomeBefore / 12)}</td><td className="text-right tabular-nums">{formatCurrency(result.takeHomeAfter / 12)}</td></tr>
              {isSacrifice ? (
                <>
                  <tr className="border-b border-border/50"><td className="py-2 text-green-600">Income Tax Saved</td><td></td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.taxSaving)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 text-green-600">NI Saved</td><td></td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.niSaving)}</td></tr>
                  {result.employerNISaving > 0 && <tr className="border-b border-border/50"><td className="py-2 text-green-600">Employer NI Saved</td><td></td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.employerNISaving)}</td></tr>}
                </>
              ) : (
                <>
                  <tr className="border-b border-border/50"><td className="py-2 text-green-600">Relief Added by Provider (20%)</td><td></td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.reliefAtSource)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 text-green-600">Extra Relief via Self Assessment</td><td></td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.selfAssessmentRelief)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2">NI Saved</td><td></td><td className="text-right tabular-nums">{formatCurrency(0)}</td></tr>
                </>
              )}
              <tr className="font-semibold"><td className="py-2">Into Pension</td><td></td><td className="text-right tabular-nums text-primary">{formatCurrency(result.pensionContrib)}</td></tr>
            </tbody>
          </table>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            {isSacrifice
              ? <p>From 6 April 2029 only the first £2,000 a year of sacrificed pay stays free of National Insurance (employee and employer). {result.capFrom2029 ? `At today's rates your NI saving would fall to ${formatCurrency(result.niSaving2029)} and your employer's to ${formatCurrency(result.employerNISaving2029)}. ` : ''}Income tax relief is unaffected.</p>
              : <p>You pay {formatCurrency(result.pensionContrib * 0.8)} from net pay. After-tax take-home includes the extra relief you reclaim through Self Assessment. Relief at source never saves National Insurance.</p>}
            {result.belowLEL && <p className="text-destructive">Pay after sacrifice ({formatCurrency(result.newGross)}) is below the lower earnings limit of £6,708, so the year would not count towards your State Pension and Statutory Maternity Pay or contribution-based benefits could be lost.</p>}
            {result.nearMinimumWage && <p>Sacrifice cannot take your pay below the National Minimum Wage (£12.71 an hour at 21 and over). For a 37.5-hour week that is {formatCurrency(Math.round(NLW_FULL_TIME))} a year, so check the reduced pay against your own hours.</p>}
            {result.overAllowance && <p>Pension input above the £60,000 annual allowance (less if tapered) is taxed back through the annual allowance charge, which this calculator does not model.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
