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
const ANNUAL_ALLOWANCE = 60_000
const NO_EARNINGS_LIMIT = 3_600 // gross relief available even with little or no earnings

function personalAllowance(adjustedNetIncome: number) {
  if (adjustedNetIncome <= 100_000) return 12_570
  return Math.max(0, 12_570 - Math.floor((adjustedNetIncome - 100_000) / 2))
}

// Income tax with a relief-at-source contribution `gross`: the gross contribution is taken
// off adjusted net income (restoring any tapered Personal Allowance) and extends every
// band limit above the lowest one (ITA 2007 s192; for Scotland the starter band stays put).
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

function calculate(contribution: number, salary: number, scotland = false) {
  // Relief at source: your net contribution is 80% of the gross, so the provider grosses it up
  // by ÷0.8 (i.e. adds 25% of the net = 20% of the gross). HMRC example: pay £80, get £100.
  const requestedGross = contribution / 0.80

  // Relief only on contributions up to 100% of relevant UK earnings (or £3,600 gross)
  const earningsCap = Math.max(salary, NO_EARNINGS_LIMIT)
  const relievableGross = Math.min(requestedGross, earningsCap)
  const basicRelief = relievableGross * 0.20
  const grossContribution = contribution + basicRelief

  // Above the £60,000 annual allowance the annual allowance charge takes the relief back
  const reliefBase = Math.min(relievableGross, ANNUAL_ALLOWANCE)
  const extraRelief = Math.max(0, incomeTax(salary, scotland) - incomeTax(salary, scotland, reliefBase))
  const totalRelief = reliefBase * 0.20 + extraRelief
  // What the pension costs you after all relief (and after any annual allowance clawback)
  const netCost = grossContribution - totalRelief
  const effectiveRate = reliefBase > 0 ? (totalRelief / reliefBase) * 100 : 0

  return {
    contribution, grossContribution, basicRelief, extraRelief, totalRelief, netCost, effectiveRate,
    overEarnings: requestedGross > earningsCap, overAllowance: relievableGross > ANNUAL_ALLOWANCE,
  }
}

export default function PensionTaxReliefCalculator() {
  const [contribution, setContribution] = useState('')
  const [salary, setSalary] = useState('50000')
  const [scotland, setScotland] = useState(false)

  const c = parseFloat(contribution.replace(/,/g, '')) || 0
  const s = parseFloat(salary.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(c, s, scotland), [c, s, scotland])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Personal Contribution (net)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={contribution} onChange={(e) => setContribution(e.target.value)} placeholder="5,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Personal Contribution (net)" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Annual Salary</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="50,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div>
        </div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={scotland} onChange={(e) => setScotland(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Scottish taxpayer (Scottish income tax bands)</span></label>

      {c > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Tax Relief</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.totalRelief)}</p>
            <p className="text-sm text-muted-foreground mt-1">Your {formatCurrency(c)} becomes {formatCurrency(result.grossContribution)} in your pension</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Basic Rate Relief (20%)</p><p className="text-lg font-bold text-green-600">{formatCurrency(result.basicRelief)}</p><p className="text-xs text-muted-foreground">Auto-added by provider</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Extra Relief</p><p className="text-lg font-bold text-green-600">{formatCurrency(result.extraRelief)}</p><p className="text-xs text-muted-foreground">Claim via Self Assessment</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Net Cost to You</p><p className="text-lg font-bold">{formatCurrency(result.netCost)}</p><p className="text-xs text-muted-foreground">{result.effectiveRate.toFixed(1)}% effective relief</p></div>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p>Extra relief covers higher, advanced and additional rate tax, plus any Personal Allowance restored when the gross contribution brings adjusted net income back towards £100,000.</p>
            {result.overEarnings && <p>Relief is limited to contributions of up to 100% of your UK earnings (or £3,600 gross if higher). The part above that gets no tax relief.</p>}
            {result.overAllowance && <p>Gross contributions above the £60,000 annual allowance are taxed back through the annual allowance charge, so relief is shown on the first £60,000 only. Employer contributions also count, unused allowance from the last three years can be carried forward, and adjusted income over £260,000 (with threshold income over £200,000) tapers the allowance to as little as £10,000.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
