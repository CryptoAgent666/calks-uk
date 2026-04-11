import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// Class 1 Employee NI rates 2025/26
const NI_PRIMARY_THRESHOLD = 12_570
const NI_UPPER_EARNINGS_LIMIT = 50_270
const NI_MAIN_RATE = 0.08 // 8%
const NI_ADDITIONAL_RATE = 0.02 // 2%

function calculateNI(gross: number) {
  let niContributions = 0

  if (gross <= NI_PRIMARY_THRESHOLD) {
    niContributions = 0
  } else if (gross <= NI_UPPER_EARNINGS_LIMIT) {
    niContributions = (gross - NI_PRIMARY_THRESHOLD) * NI_MAIN_RATE
  } else {
    niContributions = (NI_UPPER_EARNINGS_LIMIT - NI_PRIMARY_THRESHOLD) * NI_MAIN_RATE +
                      (gross - NI_UPPER_EARNINGS_LIMIT) * NI_ADDITIONAL_RATE
  }

  return {
    gross,
    niContributions,
    effectiveRate: gross > 0 ? (niContributions / gross) * 100 : 0,
    monthlyNI: niContributions / 12,
    weeklyNI: niContributions / 52,
  }
}

export default function NationalInsuranceCalculator() {
  const [income, setIncome] = useState('')

  const gross = parseFloat(income.replace(/,/g, '')) || 0
  const result = useMemo(() => calculateNI(gross), [gross])

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="ni-income" className="block text-sm font-medium mb-2">
          Annual Gross Income
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
          <input
            id="ni-income"
            type="text"
            inputMode="numeric"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="35,000"
            className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[25_000, 35_000, 50_000, 75_000, 100_000].map((amount) => (
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

      {gross > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Annual NI</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(result.niContributions)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Monthly NI</p>
              <p className="text-lg font-bold">{formatCurrency(result.monthlyNI)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Weekly NI</p>
              <p className="text-lg font-bold">{formatCurrency(result.weeklyNI)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Effective Rate</p>
              <p className="text-lg font-bold">{formatPercent(result.effectiveRate)}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4 space-y-2 text-sm">
            <h3 className="font-semibold">How it's calculated</h3>
            <p className="text-muted-foreground">
              No NI on the first {formatCurrency(NI_PRIMARY_THRESHOLD)} (Primary Threshold).
            </p>
            <p className="text-muted-foreground">
              8% on earnings between {formatCurrency(NI_PRIMARY_THRESHOLD)} and {formatCurrency(NI_UPPER_EARNINGS_LIMIT)}.
            </p>
            <p className="text-muted-foreground">
              2% on earnings above {formatCurrency(NI_UPPER_EARNINGS_LIMIT)} (Upper Earnings Limit).
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
