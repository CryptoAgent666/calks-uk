import { useState, useMemo } from 'react'
import { formatCurrency, ukIncomeTax } from '@/utils'

// NHS Pension Scheme 2015 (career average / CARE):
// each year you bank 1/54 of pensionable pay, revalued while active at
// CPI + 1.5%. Payable in full from State Pension age. Estimates only —
// the definitive figure is your Total Reward Statement.
const ACCRUAL_RATE = 1 / 54
// The projection is in today's money: pay is assumed to rise with CPI (flat in
// real terms), so only the 1.5% of revaluation above CPI is real growth.
const REAL_REVALUATION = 0.015
const COMMUTATION_FACTOR = 12 // £12 lump sum for each £1 a year of pension given up
const LUMP_SUM_ALLOWANCE = 268_275 // HMRC cap on tax-free lump sums across all pensions

// Member contribution tiers 2026/27 (England, on actual pensionable pay). The
// tier rate applies to all pensionable pay, not just the slice in the tier.
const CONTRIBUTION_RATES = [
  { upTo: 13_259, rate: 5.2 },
  { upTo: 28_854, rate: 6.5 },
  { upTo: 35_155, rate: 8.3 },
  { upTo: 52_778, rate: 9.8 },
  { upTo: 67_668, rate: 10.7 },
  { upTo: Infinity, rate: 12.5 },
]

function contributionRate(salary: number) {
  const pay = Math.floor(salary)
  return CONTRIBUTION_RATES.find((band) => pay <= band.upTo)!.rate
}

// HMRC limits the lump sum to 25% of the capital value after commutation,
// where capital value = 20 × reduced pension + lump sum. With £12 per £1 given
// up: L = 0.25 × (20 × (P − L/12) + L), so L = 30P/7 (about 4.29 × pension),
// and never more than the Lump Sum Allowance.
function maxLumpSum(pension: number) {
  const uncapped = (0.25 * 20 * pension) / (1 + (0.25 * 20) / COMMUTATION_FACTOR - 0.25)
  return Math.min(uncapped, LUMP_SUM_ALLOWANCE)
}

function calculate(salary: number, yearsService: number, yearsToRetirement: number) {
  if (salary <= 0) return null

  const contribRate = contributionRate(salary)
  const annualContrib = salary * (contribRate / 100)
  const monthlyContrib = annualContrib / 12
  // Contributions are taken before tax (net pay arrangement): relief is the
  // income tax saved at rUK rates, including the 60% effective rate in the
  // £100,000–£125,140 taper zone. Scottish rates differ.
  const taxRelief = ukIncomeTax(salary) - ukIncomeTax(salary - annualContrib)
  const monthlyNetCost = (annualContrib - taxRelief) / 12

  const thisYearPension = salary * ACCRUAL_RATE

  // Pension already banked, then future years accrue and the whole pot revalues
  let totalPension = thisYearPension * Math.max(yearsService, 0)
  for (let y = 0; y < Math.max(yearsToRetirement, 0); y++) {
    totalPension *= 1 + REAL_REVALUATION
    totalPension += thisYearPension
  }

  // Optional commutation: give up £1 of pension for £12 of lump sum
  const lumpSum = maxLumpSum(totalPension)
  const lumpSumCapped = lumpSum >= LUMP_SUM_ALLOWANCE
  const reducedPension = totalPension - lumpSum / COMMUTATION_FACTOR

  return { contribRate, annualContrib, monthlyContrib, taxRelief, monthlyNetCost, thisYearPension, totalPension, monthlyPension: totalPension / 12, maxLumpSum: lumpSum, lumpSumCapped, reducedPension }
}

export default function NhsPensionCalculator() {
  const [salary, setSalary] = useState('39,959')
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
            <p className="text-sm text-muted-foreground">Projected Annual NHS Pension (today's money)</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalPension)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatCurrency(result.monthlyPension)}/month from State Pension age in today's money, then rising with CPI for life
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Banked This Year</p><p className="text-lg font-bold">{formatCurrency(result.thisYearPension)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Your Contribution</p><p className="text-lg font-bold">{result.contribRate}%</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Cost/Month (gross)</p><p className="text-lg font-bold">{formatCurrency(result.monthlyContrib)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">After Tax Relief*</p><p className="text-lg font-bold">{formatCurrency(result.monthlyNetCost)}</p></div>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Optional tax-free lump sum:</strong> exchange pension at £12 lump sum per £1 given up —
              up to {formatCurrency(result.maxLumpSum)} lump sum with a reduced pension of {formatCurrency(result.reducedPension)}/year.
              {result.lumpSumCapped
                ? ' This is capped by the £268,275 Lump Sum Allowance.'
                : ' That is the HMRC maximum: 25% of the capital value (20 × the reduced pension plus the lump sum).'}
            </p>
            <p className="mt-1">
              *Contributions come out before tax, so the net cost is after income tax relief at rUK rates (England, Wales and NI; Scottish rates differ).
              Figures are in today's money: the estimate assumes your pay keeps pace with CPI and revaluation of CPI + 1.5% (2015 scheme only —
              1995/2008 legacy and McCloud remedy service is on top). Check your Total Reward Statement for exact figures.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
