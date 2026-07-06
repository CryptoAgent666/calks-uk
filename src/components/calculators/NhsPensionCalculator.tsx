import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// NHS Pension Scheme 2015 (career average / CARE):
// each year you bank 1/54 of pensionable pay, revalued while active at
// CPI + 1.5%. Payable in full from State Pension age. Estimates only —
// the definitive figure is your Total Reward Statement.
const ACCRUAL_RATE = 1 / 54
const REVALUATION = 0.035 // CPI (~2%) + 1.5%

// Member contribution tiers (England, on actual pensionable pay)
const CONTRIBUTION_RATES = [
  { upTo: 13_259, rate: 5.2 },
  { upTo: 27_288, rate: 6.5 },
  { upTo: 33_247, rate: 8.3 },
  { upTo: 49_913, rate: 9.8 },
  { upTo: 63_994, rate: 10.7 },
  { upTo: Infinity, rate: 12.5 },
]

function calculate(salary: number, yearsService: number, yearsToRetirement: number) {
  if (salary <= 0) return null

  let contribRate = 5.2
  for (const band of CONTRIBUTION_RATES) {
    if (salary <= band.upTo) { contribRate = band.rate; break }
  }
  const annualContrib = salary * (contribRate / 100)
  const monthlyContrib = annualContrib / 12

  const thisYearPension = salary * ACCRUAL_RATE

  // Pension already banked, then future years accrue and the whole pot revalues
  let totalPension = thisYearPension * Math.max(yearsService, 0)
  for (let y = 0; y < Math.max(yearsToRetirement, 0); y++) {
    totalPension *= 1 + REVALUATION
    totalPension += thisYearPension
  }

  // Optional commutation: give up £1 pension for £12 lump sum, up to ~25%
  const maxLumpSum = totalPension * 0.25 * 12
  const reducedPension = totalPension * 0.75

  return { contribRate, annualContrib, monthlyContrib, thisYearPension, totalPension, monthlyPension: totalPension / 12, maxLumpSum, reducedPension }
}

export default function NhsPensionCalculator() {
  const [salary, setSalary] = useState('38,000')
  const [years, setYears] = useState('10')
  const [toGo, setToGo] = useState('20')

  const s = parseFloat(salary.replace(/,/g, '')) || 0
  const ys = parseFloat(years) || 0
  const yr = parseFloat(toGo) || 0
  const result = useMemo(() => calculate(s, ys, yr), [s, ys, yr])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Pensionable Pay</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Pensionable Pay" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Your Agenda for Change / medical basic pay</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Years Already in 2015 Scheme</label>
          <input type="number" min="0" max="45" step="0.5" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Years Already in 2015 Scheme" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Years Until Retirement</label>
          <input type="number" min="0" max="50" step="0.5" value={toGo} onChange={(e) => setToGo(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Years Until Retirement" />
        </div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Projected Annual NHS Pension</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalPension)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatCurrency(result.monthlyPension)}/month from State Pension age, for life, inflation-protected
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Banked This Year</p><p className="text-lg font-bold">{formatCurrency(result.thisYearPension)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Your Contribution</p><p className="text-lg font-bold">{result.contribRate}%</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Cost/Month (gross)</p><p className="text-lg font-bold">{formatCurrency(result.monthlyContrib)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">After Tax Relief*</p><p className="text-lg font-bold">{formatCurrency(result.monthlyContrib * (s > 50_270 ? 0.6 : 0.8))}</p></div>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Optional tax-free lump sum:</strong> exchange pension at £12 lump sum per £1 given up —
              up to {formatCurrency(result.maxLumpSum)} lump sum with a reduced pension of {formatCurrency(result.reducedPension)}/year.
            </p>
            <p className="mt-1">
              *Contributions come out before tax. Estimate assumes your current pay continues and CPI+1.5% revaluation (2015 scheme only —
              1995/2008 legacy and McCloud remedy service is on top). Check your Total Reward Statement for exact figures.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
