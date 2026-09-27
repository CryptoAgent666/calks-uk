import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Side-by-side 2025/26 vs 2026/27. rUK income tax and NI are frozen, so for
// most employees the change is nil — the real movers are the Scottish bands,
// student-loan thresholds (Plans 1/2/4 uprated with RPI) and the +2pp
// dividend rates from Budget 2025.
const PA = 12_570
const PA_TAPER = 100_000
const NI_PT = 12_570
const NI_UEL = 50_270

// Scottish bands are set on TAXABLE income (after the Personal Allowance), so
// they are stored here as upper limits of taxable income. When the allowance
// tapers above £100k every Scottish threshold moves down with it.
interface YearParams {
  label: string
  scotBands: { rate: number; upTo: number }[]
  slPlans: Record<string, { threshold: number; rate: number }>
  divBasic: number
  divHigher: number
  divAdditional: number
}

const Y2526: YearParams = {
  label: '2025/26',
  // starter to £2,827, basic to £14,921 (= £15,397 / £27,491 of gross pay)
  scotBands: [
    { rate: 0.19, upTo: 2_827 },
    { rate: 0.20, upTo: 14_921 },
    { rate: 0.21, upTo: 31_092 },
    { rate: 0.42, upTo: 62_430 },
    { rate: 0.45, upTo: 125_140 },
    { rate: 0.48, upTo: Infinity },
  ],
  slPlans: {
    none: { threshold: 0, rate: 0 },
    plan1: { threshold: 26_065, rate: 0.09 },
    plan2: { threshold: 28_470, rate: 0.09 },
    plan4: { threshold: 32_745, rate: 0.09 },
    plan5: { threshold: 25_000, rate: 0.09 },
    postgrad: { threshold: 21_000, rate: 0.06 },
  },
  divBasic: 0.0875,
  divHigher: 0.3375,
  divAdditional: 0.3935,
}

const Y2627: YearParams = {
  label: '2026/27',
  // starter to £3,967, basic to £16,956 (= £16,537 / £29,526 of gross pay)
  scotBands: [
    { rate: 0.19, upTo: 3_967 },
    { rate: 0.20, upTo: 16_956 },
    { rate: 0.21, upTo: 31_092 },
    { rate: 0.42, upTo: 62_430 },
    { rate: 0.45, upTo: 125_140 },
    { rate: 0.48, upTo: Infinity },
  ],
  slPlans: {
    none: { threshold: 0, rate: 0 },
    plan1: { threshold: 26_900, rate: 0.09 },
    plan2: { threshold: 29_385, rate: 0.09 },
    plan4: { threshold: 33_795, rate: 0.09 },
    plan5: { threshold: 25_000, rate: 0.09 },
    postgrad: { threshold: 21_000, rate: 0.06 },
  },
  divBasic: 0.1075,
  divHigher: 0.3575,
  divAdditional: 0.3935,
}

type Region = 'ruk' | 'scotland'

// UK basic-rate band and additional-rate threshold, both in taxable income.
// Dividends use these UK bands for Scottish taxpayers too.
const BASIC_BAND = 37_700
const ADDITIONAL_THRESHOLD = 125_140
const DIVIDEND_ALLOWANCE = 500

// The taper is based on adjusted net income, which includes dividends.
function taperedPA(totalIncome: number): number {
  if (totalIncome <= PA_TAPER) return PA
  return Math.max(0, PA - Math.floor((totalIncome - PA_TAPER) / 2))
}

function rukTax(taxable: number): number {
  return (
    Math.min(taxable, BASIC_BAND) * 0.20 +
    Math.max(0, Math.min(taxable, ADDITIONAL_THRESHOLD) - BASIC_BAND) * 0.40 +
    Math.max(0, taxable - ADDITIONAL_THRESHOLD) * 0.45
  )
}

function scotTax(taxable: number, bands: YearParams['scotBands']): number {
  let tax = 0
  let lower = 0
  for (const b of bands) {
    if (taxable <= lower) break
    tax += (Math.min(taxable, b.upTo) - lower) * b.rate
    lower = b.upTo
  }
  return tax
}

function ni(gross: number): number {
  if (gross <= NI_PT) return 0
  if (gross <= NI_UEL) return (gross - NI_PT) * 0.08
  return (NI_UEL - NI_PT) * 0.08 + (gross - NI_UEL) * 0.02
}

// Dividends sit on top of salary. The £500 allowance is taxed at 0% but still
// uses up band space, so it counts towards the position before rates apply.
function divTax(taxableSalary: number, dividendsAfterPA: number, y: YearParams): number {
  const taxableDiv = Math.max(0, dividendsAfterPA - DIVIDEND_ALLOWANCE)
  if (taxableDiv <= 0) return 0
  const used = taxableSalary + Math.min(DIVIDEND_ALLOWANCE, dividendsAfterPA)
  const inBasic = Math.min(taxableDiv, Math.max(0, BASIC_BAND - used))
  const inHigher = Math.min(taxableDiv - inBasic, Math.max(0, ADDITIONAL_THRESHOLD - Math.max(used, BASIC_BAND)))
  const inAdditional = taxableDiv - inBasic - inHigher
  return inBasic * y.divBasic + inHigher * y.divHigher + inAdditional * y.divAdditional
}

function yearResult(salary: number, dividends: number, region: Region, plan: string, y: YearParams) {
  const pa = taperedPA(salary + dividends)
  const taxableSalary = Math.max(0, salary - pa)
  const dividendsAfterPA = Math.max(0, dividends - Math.max(0, pa - salary))
  const tax = region === 'scotland' ? scotTax(taxableSalary, y.scotBands) : rukTax(taxableSalary)
  const nic = ni(salary)
  const sl = y.slPlans[plan] && salary > y.slPlans[plan].threshold
    ? (salary - y.slPlans[plan].threshold) * y.slPlans[plan].rate
    : 0
  const dv = divTax(taxableSalary, dividendsAfterPA, y)
  const takeHome = salary + dividends - tax - nic - sl - dv
  return { tax, nic, sl, dv, takeHome }
}

export default function TaxYearComparisonCalculator() {
  const [income, setIncome] = useState('40,000')
  const [dividends, setDividends] = useState('')
  const [region, setRegion] = useState<Region>('ruk')
  const [plan, setPlan] = useState('none')

  const salary = parseFloat(income.replace(/,/g, '')) || 0
  const divs = parseFloat(dividends.replace(/,/g, '')) || 0

  const result = useMemo(() => {
    if (salary <= 0 && divs <= 0) return null
    const a = yearResult(salary, divs, region, plan, Y2526)
    const b = yearResult(salary, divs, region, plan, Y2627)
    return { a, b, delta: b.takeHome - a.takeHome }
  }, [salary, divs, region, plan])

  const Row = ({ label, a, b, negative }: { label: string; a: number; b: number; negative?: boolean }) => (
    <tr className="border-b border-border/50">
      <td className="py-2.5">{label}</td>
      <td className="text-right py-2.5 tabular-nums">{negative && a > 0 ? '-' : ''}{formatCurrency(a)}</td>
      <td className="text-right py-2.5 tabular-nums">{negative && b > 0 ? '-' : ''}{formatCurrency(b)}</td>
      <td className={`text-right py-2.5 tabular-nums font-medium ${Math.abs(b - a) < 0.005 ? 'text-muted-foreground' : (negative ? b - a : a - b) > 0 ? 'text-destructive' : 'text-green-700 dark:text-green-400'}`}>
        {Math.abs(b - a) < 0.005 ? '—' : `${b - a > 0 ? '+' : '−'}${formatCurrency(Math.abs(b - a))}`}
      </td>
    </tr>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Annual Gross Salary</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Annual Gross Salary" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Dividend Income (optional)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={dividends} onChange={(e) => setDividends(e.target.value)} placeholder="0" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Dividend Income" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setRegion('ruk')} className={`px-3 py-2.5 rounded-xl text-sm font-medium border ${region === 'ruk' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>England, Wales &amp; NI</button>
          <button onClick={() => setRegion('scotland')} className={`px-3 py-2.5 rounded-xl text-sm font-medium border ${region === 'scotland' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Scotland</button>
        </div>
        <select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Student Loan">
          <option value="none">No student loan</option>
          <option value="plan1">Plan 1 (pre-2012)</option>
          <option value="plan2">Plan 2 (post-2012)</option>
          <option value="plan4">Plan 4 (Scotland)</option>
          <option value="plan5">Plan 5 (post-2023)</option>
          <option value="postgrad">Postgraduate</option>
        </select>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.delta >= 0 ? 'bg-green-100/60 dark:bg-green-950/60' : 'bg-destructive/10'}`}>
            <p className="text-sm text-muted-foreground">Take-home change in 2026/27 vs 2025/26</p>
            <p className={`text-3xl font-bold mt-1 ${result.delta >= 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>
              {result.delta >= 0 ? '+' : '−'}{formatCurrency(Math.abs(result.delta))}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {Math.abs(result.delta) < 0.01
                ? 'No change: rUK thresholds are frozen until April 2031'
                : `${formatCurrency(Math.abs(result.delta) / 12)}/month ${result.delta >= 0 ? 'better' : 'worse'} off`}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground"></th>
                  <th className="text-right py-2 font-medium text-muted-foreground">2025/26</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">2026/27</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Change</th>
                </tr>
              </thead>
              <tbody>
                <Row label={region === 'scotland' ? 'Income Tax (Scotland)' : 'Income Tax'} a={result.a.tax} b={result.b.tax} negative />
                <Row label="National Insurance" a={result.a.nic} b={result.b.nic} negative />
                {plan !== 'none' && <Row label="Student Loan" a={result.a.sl} b={result.b.sl} negative />}
                {divs > 0 && <Row label="Dividend Tax" a={result.a.dv} b={result.b.dv} negative />}
                <tr className="font-semibold">
                  <td className="py-2.5 text-primary">Take-Home</td>
                  <td className="text-right py-2.5 tabular-nums text-primary">{formatCurrency(result.a.takeHome)}</td>
                  <td className="text-right py-2.5 tabular-nums text-primary">{formatCurrency(result.b.takeHome)}</td>
                  <td className={`text-right py-2.5 tabular-nums ${result.delta >= 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>
                    {Math.abs(result.delta) < 0.005 ? '—' : `${result.delta > 0 ? '+' : '−'}${formatCurrency(Math.abs(result.delta))}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">What actually changed in April 2026:</p>
            <p>• rUK income tax and NI thresholds frozen until April 2031, so inflation quietly raises your real tax burden ("fiscal drag")</p>
            <p>• Scottish starter and basic bands raised: £1,140 more taxed at 19% instead of 20% and £2,035 more at 20% instead of 21%, worth up to £31.75 a year</p>
            <p>• Student loan thresholds up: Plan 1 → £26,900, Plan 2 → £29,385, Plan 4 → £33,795 (repayments fall slightly)</p>
            <p>• Dividend tax +2pp: basic 10.75%, higher 35.75% (Budget 2025)</p>
            <p>• National Living Wage £12.21 → £12.71/hour</p>
          </div>
        </div>
      )}
    </div>
  )
}
