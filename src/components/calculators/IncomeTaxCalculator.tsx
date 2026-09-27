import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'
import ShareRow, { useUrlParam } from '@/components/ShareRow'

const PERSONAL_ALLOWANCE = 12_570
const BASIC_RATE_LIMIT = 50_270      // gross income where 40% starts on a full allowance
const BASIC_RATE_BAND = 37_700       // width of the 20% band in taxable income
const HIGHER_RATE_LIMIT = 125_140    // taxable income where 45% starts
const PA_TAPER_START = 100_000

// Employee Class 1 National Insurance 2026/27 (annualised)
const NI_PRIMARY_THRESHOLD = 12_570
const NI_UPPER_EARNINGS_LIMIT = 50_270
const NI_MAIN_RATE = 0.08
const NI_ADDITIONAL_RATE = 0.02

function calculateEmployeeNI(gross: number) {
  if (gross <= NI_PRIMARY_THRESHOLD) return 0
  const main = Math.min(gross, NI_UPPER_EARNINGS_LIMIT) - NI_PRIMARY_THRESHOLD
  const additional = Math.max(0, gross - NI_UPPER_EARNINGS_LIMIT)
  return main * NI_MAIN_RATE + additional * NI_ADDITIONAL_RATE
}

const TAX_BANDS = [
  { name: 'Personal Allowance', rate: 0, from: 0, to: PERSONAL_ALLOWANCE },
  { name: 'Basic Rate', rate: 0.20, from: PERSONAL_ALLOWANCE, to: BASIC_RATE_LIMIT },
  { name: 'Higher Rate', rate: 0.40, from: BASIC_RATE_LIMIT, to: HIGHER_RATE_LIMIT },
  { name: 'Additional Rate', rate: 0.45, from: HIGHER_RATE_LIMIT, to: Infinity },
]

function calculateIncomeTax(gross: number) {
  // Personal Allowance taper: reduced by £1 for every £2 over £100,000
  let personalAllowance = PERSONAL_ALLOWANCE
  if (gross > PA_TAPER_START) {
    const reduction = Math.floor((gross - PA_TAPER_START) / 2)
    personalAllowance = Math.max(0, PERSONAL_ALLOWANCE - reduction)
  }

  // The basic-rate band is a fixed WIDTH of taxable income (£37,700), not a fixed
  // upper limit. When the Personal Allowance is tapered away the band moves down
  // with it, so the 40% rate starts earlier in gross terms. Keeping the upper
  // bound pinned at £50,270 would widen the 20% band and understate the tax for
  // everyone over £100,000 (and hide the 60% effective marginal rate in the
  // taper zone). Anyone at or above £125,140 has no allowance left, so the 45%
  // threshold stays at £125,140 of taxable income.
  const basicBandTop = personalAllowance + BASIC_RATE_BAND
  const bands = [
    { name: 'Personal Allowance', rate: 0, from: 0, to: personalAllowance },
    { name: 'Basic Rate (20%)', rate: 0.20, from: personalAllowance, to: basicBandTop },
    { name: 'Higher Rate (40%)', rate: 0.40, from: basicBandTop, to: personalAllowance + HIGHER_RATE_LIMIT },
    { name: 'Additional Rate (45%)', rate: 0.45, from: personalAllowance + HIGHER_RATE_LIMIT, to: Infinity },
  ]

  let totalTax = 0
  const breakdown: { name: string; taxable: number; tax: number; rate: number }[] = []

  for (const band of bands) {
    if (gross <= band.from) {
      breakdown.push({ name: band.name, taxable: 0, tax: 0, rate: band.rate })
      continue
    }
    const taxableInBand = Math.min(gross, band.to) - band.from
    const tax = taxableInBand * band.rate
    totalTax += tax
    breakdown.push({ name: band.name, taxable: taxableInBand, tax, rate: band.rate })
  }

  const employeeNI = calculateEmployeeNI(gross)
  const takeHome = gross - totalTax - employeeNI

  return {
    gross,
    totalTax,
    employeeNI,
    takeHome,
    effectiveRate: gross > 0 ? (totalTax / gross) * 100 : 0,
    combinedRate: gross > 0 ? ((totalTax + employeeNI) / gross) * 100 : 0,
    personalAllowance,
    breakdown,
  }
}

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useUrlParam('salary', '45000')

  const gross = parseFloat(income.replace(/,/g, '')) || 0
  const result = useMemo(() => calculateIncomeTax(gross), [gross])

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label htmlFor="income" className="block text-sm font-medium mb-2">
          Annual Gross Income
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
          <input
            id="income"
            type="text"
            inputMode="numeric"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="50,000"
            className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
           aria-label="Annual Gross Income" />
        </div>
        {/* Quick amounts */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[25_000, 35_000, 50_000, 75_000, 100_000, 150_000].map((amount) => (
            <button
              key={amount}
              onClick={() => setIncome(amount.toLocaleString())}
              className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors"
            >
              £{(amount / 1000)}K
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {gross > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Income Tax</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(result.totalTax)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">National Insurance</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(result.employeeNI)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Take Home (after tax and NI)</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(result.takeHome)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Effective Tax Rate</p>
              <p className="text-lg font-bold">{formatPercent(result.effectiveRate)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Tax + NI Rate</p>
              <p className="text-lg font-bold">{formatPercent(result.combinedRate)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Personal Allowance</p>
              <p className="text-lg font-bold">{formatCurrency(result.personalAllowance)}</p>
            </div>
          </div>

          {/* Monthly / Weekly */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-muted-foreground">Monthly Take Home</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(result.takeHome / 12)}</p>
            </div>
            <div className="rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-muted-foreground">Weekly Take Home</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(result.takeHome / 52)}</p>
            </div>
            <div className="rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-muted-foreground">Daily Take Home</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(result.takeHome / 365)}</p>
            </div>
          </div>

          {/* Tax Breakdown Table */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Tax Band Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">Band</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Taxable</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((band) => (
                    <tr key={band.name} className="border-b border-border/50">
                      <td className="py-2.5">{band.name}</td>
                      <td className="text-right py-2.5 tabular-nums">{formatCurrency(band.taxable)}</td>
                      <td className="text-right py-2.5 tabular-nums font-medium">{formatCurrency(band.tax)}</td>
                    </tr>
                  ))}
                  <tr className="border-b border-border font-semibold">
                    <td className="py-2.5">Total income tax</td>
                    <td className="text-right py-2.5 tabular-nums">{formatCurrency(gross)}</td>
                    <td className="text-right py-2.5 tabular-nums text-destructive">{formatCurrency(result.totalTax)}</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2.5">Employee NI (8% / 2%)</td>
                    <td className="text-right py-2.5 tabular-nums">{formatCurrency(Math.max(0, gross - NI_PRIMARY_THRESHOLD))}</td>
                    <td className="text-right py-2.5 tabular-nums font-medium">{formatCurrency(result.employeeNI)}</td>
                  </tr>
                  <tr className="font-semibold">
                    <td className="py-2.5 text-primary">Take home</td>
                    <td className="text-right py-2.5 tabular-nums"></td>
                    <td className="text-right py-2.5 tabular-nums text-primary">{formatCurrency(result.takeHome)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              National Insurance assumes the income is employment pay (Class 1: 8% on {formatCurrency(NI_PRIMARY_THRESHOLD)} to {formatCurrency(NI_UPPER_EARNINGS_LIMIT)}, 2% above) and that you are under State Pension age. Pension contributions, student loans and other deductions are not included.
            </p>
          </div>

          <ShareRow params={{ salary: income }} />
        </div>
      )}
    </div>
  )
}
