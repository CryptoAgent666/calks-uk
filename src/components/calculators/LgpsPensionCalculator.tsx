import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Local Government Pension Scheme 2014 (England & Wales, career average):
// each year banks 1/49 of pensionable pay (1/98 in the 50/50 section),
// revalued with CPI. Normal Pension Age = State Pension age.
const ACCRUAL_FULL = 1 / 49
const ACCRUAL_5050 = 1 / 98
const REVALUATION = 0.02 // CPI

// Main-section member contribution bands (England & Wales) from 1 April 2026:
// 2025/26 thresholds uprated by September 2025 CPI (3.8%), rounded down to £100
const CONTRIBUTION_RATES = [
  { upTo: 18_400, rate: 5.5 },
  { upTo: 29_000, rate: 5.8 },
  { upTo: 47_300, rate: 6.5 },
  { upTo: 59_800, rate: 6.8 },
  { upTo: 84_000, rate: 8.5 },
  { upTo: 119_100, rate: 9.9 },
  { upTo: 140_400, rate: 10.5 },
  { upTo: 210_700, rate: 11.4 },
  { upTo: Infinity, rate: 12.5 },
]
const LUMP_SUM_ALLOWANCE = 268_275

function calculate(salary: number, yearsService: number, yearsToRetirement: number, fiftyFifty: boolean) {
  if (salary <= 0) return null

  let contribRate = 5.5
  for (const band of CONTRIBUTION_RATES) {
    if (salary <= band.upTo) { contribRate = band.rate; break }
  }
  if (fiftyFifty) contribRate = contribRate / 2

  const accrual = fiftyFifty ? ACCRUAL_5050 : ACCRUAL_FULL
  const annualContrib = salary * (contribRate / 100)
  const monthlyContrib = annualContrib / 12
  const thisYearPension = salary * accrual

  // Past service assumed banked in the main section
  let totalPension = salary * ACCRUAL_FULL * Math.max(yearsService, 0)
  for (let y = 0; y < Math.max(yearsToRetirement, 0); y++) {
    totalPension *= 1 + REVALUATION
    totalPension += thisYearPension
  }

  // £12 of lump sum per £1 of pension given up. HMRC caps the lump sum at 25% of
  // the capital value (20 x the reduced pension + the lump sum), which works out
  // at 30/7 of the full pension, and at the £268,275 Lump Sum Allowance.
  const maxLumpSum = Math.min(totalPension * 30 / 7, LUMP_SUM_ALLOWANCE)
  const reducedPension = totalPension - maxLumpSum / 12

  return { contribRate, annualContrib, monthlyContrib, thisYearPension, totalPension, monthlyPension: totalPension / 12, maxLumpSum, reducedPension }
}

export default function LgpsPensionCalculator() {
  const [salary, setSalary] = useState('30,000')
  const [years, setYears] = useState('8')
  const [toGo, setToGo] = useState('25')
  const [fiftyFifty, setFiftyFifty] = useState(false)

  const s = parseFloat(salary.replace(/,/g, '')) || 0
  const ys = parseFloat(years) || 0
  const yr = parseFloat(toGo) || 0
  const result = useMemo(() => calculate(s, ys, yr, fiftyFifty), [s, ys, yr, fiftyFifty])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Pensionable Pay</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Pensionable Pay" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Years Already in LGPS</label>
          <input type="number" min="0" max="45" step="0.5" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Years Already in LGPS" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Years Until Retirement</label>
          <input type="number" min="0" max="50" step="0.5" value={toGo} onChange={(e) => setToGo(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Years Until Retirement" />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={fiftyFifty} onChange={(e) => setFiftyFifty(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">50/50 section from now on <span className="text-muted-foreground">(half contributions, half pension build-up)</span></span>
      </label>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Projected Annual LGPS Pension</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalPension)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatCurrency(result.monthlyPension)}/month from State Pension age, for life, CPI-protected
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
              <strong className="text-foreground">Optional tax-free lump sum:</strong> exchange £1 of pension for £12 lump sum —
              up to {formatCurrency(result.maxLumpSum)} with a reduced pension of {formatCurrency(result.reducedPension)}/year.
            </p>
            <p className="mt-1">
              *Estimate assumes current pay continues and CPI revaluation; past service is assumed in the main section.
              Taking payment before State Pension age reduces it. Your fund's annual statement gives the exact figure.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
