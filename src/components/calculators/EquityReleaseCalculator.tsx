import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Lifetime mortgages start at 55
const MIN_AGE = 55
// Indicative maximum loan-to-value (%) by age for a lifetime mortgage: midpoints
// of typical broker ranges (55: 25-30%, 60: 30-35%, 65: 35-40%, 70: 40-45%,
// 75: 45-50%, 80+: 50%+). Individual lenders, health and property type vary.
const MAX_LTV_BY_AGE: [number, number][] = [[55, 27.5], [60, 32.5], [65, 37.5], [70, 42.5], [75, 47.5], [80, 50], [85, 55]]
const PROJECTION_YEARS = 25

function maxLtvFor(age: number) {
  let ltv = 0
  for (const [a, pct] of MAX_LTV_BY_AGE) { if (age >= a) ltv = pct }
  return ltv
}

type Projection = { year: number; owed: number; equity: number; propertyVal: number; capped: boolean }

function calculate(propertyValue: number, age: number, mortgageOutstanding: number, interestRate: number, houseGrowth = 2, requested = 0) {
  const maxLtv = maxLtvFor(age)
  const maxLoan = propertyValue * (maxLtv / 100)
  // Any existing mortgage has to be cleared from the loan first
  const maxRelease = maxLoan - mortgageOutstanding
  const base = { maxLtv, maxLoan, maxRelease: Math.max(0, maxRelease), release: 0, loan: 0, overMax: false, projections: [] as Projection[], firstCappedYear: 0 }

  if (age < MIN_AGE) return { ...base, status: 'underAge' as const }
  if (maxRelease <= 0) return { ...base, status: 'mortgageTooLarge' as const }

  const release = requested > 0 ? Math.min(requested, maxRelease) : maxRelease
  const loan = release + mortgageOutstanding

  // Compound interest rolls up with no repayments; the no-negative-equity
  // guarantee means the estate never repays more than the sale value, so
  // remaining equity is floored at £0.
  const all: Projection[] = []
  let owed = loan
  let propVal = propertyValue
  for (let y = 1; y <= PROJECTION_YEARS; y++) {
    owed *= (1 + interestRate / 100)
    propVal *= (1 + houseGrowth / 100)
    all.push({ year: y, owed, equity: Math.max(0, propVal - owed), propertyVal: propVal, capped: owed > propVal })
  }
  const firstCappedYear = all.find((p) => p.capped)?.year || 0

  return {
    ...base,
    status: 'ok' as const,
    release,
    loan,
    overMax: requested > maxRelease,
    projections: all.filter((p) => p.year === 1 || p.year % 5 === 0),
    firstCappedYear,
  }
}

export default function EquityReleaseCalculator() {
  const [value, setValue] = useState('350000')
  const [age, setAge] = useState('68')
  const [mortgage, setMortgage] = useState('0')
  const [amount, setAmount] = useState('80000')
  const [rate, setRate] = useState('7.25')
  const [growth, setGrowth] = useState('2')

  const v = parseFloat(value.replace(/,/g, '')) || 0
  const a = parseInt(age) || 0
  const m = parseFloat(mortgage.replace(/,/g, '')) || 0
  const req = parseFloat(amount.replace(/,/g, '')) || 0
  const r = parseFloat(rate) || 0
  const g = parseFloat(growth) || 0
  const result = useMemo(() => calculate(v, a, m, r, g, req), [v, a, m, r, g, req])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Property Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Property Value" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Your Age</label><input type="number" min="55" max="90" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Age" /></div>
        <div><label className="block text-sm font-medium mb-2">Outstanding Mortgage</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={mortgage} onChange={(e) => setMortgage(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Outstanding Mortgage" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Amount to Release</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Maximum" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Amount to Release" /></div><p className="text-xs text-muted-foreground mt-1">Leave blank for the maximum.</p></div>
        <div><label className="block text-sm font-medium mb-2">Interest Rate (%)</label><input type="number" min="3" max="10" step="0.05" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Interest Rate (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">House Price Growth (%/yr)</label><input type="number" min="-5" max="10" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="House Price Growth (%/yr)" /></div>
      </div>

      {v > 0 && result.status === 'underAge' && (
        <div className="rounded-2xl bg-muted/50 p-6 text-center animate-fade-in-up">
          <p className="text-lg font-bold">Lifetime mortgages are available from age 55</p>
          <p className="text-sm text-muted-foreground mt-1">Home reversion plans usually start at 65. Enter an age of 55 or over to see an estimate.</p>
        </div>
      )}

      {v > 0 && result.status === 'mortgageTooLarge' && (
        <div className="rounded-2xl bg-destructive/10 p-6 text-center animate-fade-in-up">
          <p className="text-lg font-bold text-destructive">Mortgage too large to clear</p>
          <p className="text-sm text-muted-foreground mt-1">At age {a} the indicative maximum lifetime mortgage is {formatCurrency(result.maxLoan)} ({result.maxLtv}% of the property value), which would not repay your {formatCurrency(m)} mortgage. A lifetime mortgage has to clear any existing mortgage first, so you would need to reduce the balance, wait until you are older or look at a retirement interest-only mortgage or downsizing.</p>
        </div>
      )}

      {v > 0 && result.status === 'ok' && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Indicative Maximum Tax-Free Release</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.maxRelease)}</p>
            <p className="text-sm text-muted-foreground mt-1">Up to {result.maxLtv}% of the property value at age {a}{m > 0 ? `, after clearing your ${formatCurrency(m)} mortgage` : ''}</p>
            {req > 0 && <p className="text-sm mt-2">Projection below: releasing <span className="font-medium">{formatCurrency(result.release)}</span>{result.overMax ? ' (capped at the indicative maximum)' : ''}{m > 0 ? `, a total loan of ${formatCurrency(result.loan)}` : ''}</p>}
          </div>
          {result.projections.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Year</th><th className="text-right py-2 font-medium text-muted-foreground">Amount Owed</th><th className="text-right py-2 font-medium text-muted-foreground">Property Value</th><th className="text-right py-2 font-medium text-muted-foreground">Remaining Equity</th></tr></thead>
                <tbody>{result.projections.map(p => (
                  <tr key={p.year} className="border-b border-border/50"><td className="py-2">{p.year}</td><td className="text-right tabular-nums text-destructive">{formatCurrency(p.owed)}{p.capped ? '*' : ''}</td><td className="text-right tabular-nums">{formatCurrency(p.propertyVal)}</td><td className={`text-right tabular-nums font-medium ${p.equity > 0 ? 'text-green-600' : 'text-destructive'}`}>{formatCurrency(p.equity)}</td></tr>
                ))}</tbody>
              </table>
            </div>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            {result.firstCappedYear > 0 && <p>* From year {result.firstCappedYear} the debt would exceed the home&apos;s value. Under the no-negative-equity guarantee the estate never repays more than the sale value, so remaining equity is shown as £0.</p>}
            <p>Equity release is a lifetime mortgage. Interest rolls up, so the amount owed grows over time. The maximum shown is indicative: lenders set their own limits by age, health and property. Always seek independent financial advice. Assumes {g}% annual house price growth.</p>
          </div>
        </div>
      )}
    </div>
  )
}
