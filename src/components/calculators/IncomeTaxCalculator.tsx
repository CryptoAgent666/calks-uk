import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

const PERSONAL_ALLOWANCE = 12_570
const BASIC_RATE_LIMIT = 50_270
const HIGHER_RATE_LIMIT = 125_140
const PA_TAPER_START = 100_000

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

  const bands = [
    { name: 'Personal Allowance', rate: 0, from: 0, to: personalAllowance },
    { name: 'Basic Rate (20%)', rate: 0.20, from: personalAllowance, to: BASIC_RATE_LIMIT },
    { name: 'Higher Rate (40%)', rate: 0.40, from: BASIC_RATE_LIMIT, to: HIGHER_RATE_LIMIT },
    { name: 'Additional Rate (45%)', rate: 0.45, from: HIGHER_RATE_LIMIT, to: Infinity },
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

  return {
    gross,
    totalTax,
    netIncome: gross - totalTax,
    effectiveRate: gross > 0 ? (totalTax / gross) * 100 : 0,
    personalAllowance,
    breakdown,
  }
}

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState('')

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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Income Tax</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(result.totalTax)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Take Home</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(result.netIncome)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Effective Rate</p>
              <p className="text-lg font-bold">{formatPercent(result.effectiveRate)}</p>
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
              <p className="text-lg font-bold text-primary">{formatCurrency(result.netIncome / 12)}</p>
            </div>
            <div className="rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-muted-foreground">Weekly Take Home</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(result.netIncome / 52)}</p>
            </div>
            <div className="rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-muted-foreground">Daily Take Home</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(result.netIncome / 365)}</p>
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
                  <tr className="font-semibold">
                    <td className="py-2.5">Total</td>
                    <td className="text-right py-2.5 tabular-nums">{formatCurrency(gross)}</td>
                    <td className="text-right py-2.5 tabular-nums text-destructive">{formatCurrency(result.totalTax)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
