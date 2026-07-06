import { useState, useMemo, useEffect } from 'react'
import { formatCurrency, formatPercent } from '@/utils'
import ShareRow from '@/components/ShareRow'

// 2026/27 rates
const PERSONAL_ALLOWANCE = 12_570
const BASIC_LIMIT = 50_270
const HIGHER_LIMIT = 125_140
const PA_TAPER = 100_000

// Scottish Income Tax 2026/27 (non-savings income)
const SCOTTISH_BANDS = [
  { rate: 0.19, from: 12_570, to: 16_537 },
  { rate: 0.20, from: 16_537, to: 29_526 },
  { rate: 0.21, from: 29_526, to: 43_662 },
  { rate: 0.42, from: 43_662, to: 75_000 },
  { rate: 0.45, from: 75_000, to: 125_140 },
  { rate: 0.48, from: 125_140, to: Infinity },
]

const NI_PT = 12_570
const NI_UEL = 50_270
const NI_MAIN = 0.08
const NI_ADDITIONAL = 0.02

const STUDENT_LOAN_PLANS: Record<string, { threshold: number; rate: number }> = {
  none: { threshold: 0, rate: 0 },
  plan1: { threshold: 26_900, rate: 0.09 },
  plan2: { threshold: 29_385, rate: 0.09 },
  plan4: { threshold: 33_795, rate: 0.09 },
  plan5: { threshold: 25_000, rate: 0.09 },
  postgrad: { threshold: 21_000, rate: 0.06 },
}

type Region = 'ruk' | 'scotland'

function taperedPA(income: number): number {
  if (income <= PA_TAPER) return PERSONAL_ALLOWANCE
  return Math.max(0, PERSONAL_ALLOWANCE - Math.floor((income - PA_TAPER) / 2))
}

function rukTax(taxBase: number): number {
  const pa = taperedPA(taxBase)
  if (taxBase <= pa) return 0
  if (taxBase <= BASIC_LIMIT) return (taxBase - pa) * 0.20
  if (taxBase <= HIGHER_LIMIT) return (BASIC_LIMIT - pa) * 0.20 + (taxBase - BASIC_LIMIT) * 0.40
  return (BASIC_LIMIT - pa) * 0.20 + (HIGHER_LIMIT - BASIC_LIMIT) * 0.40 + (taxBase - HIGHER_LIMIT) * 0.45
}

function scottishTax(taxBase: number): number {
  const pa = taperedPA(taxBase)
  let tax = 0
  for (const band of SCOTTISH_BANDS) {
    const from = Math.max(band.from <= PERSONAL_ALLOWANCE ? pa : band.from, pa)
    if (taxBase <= from) continue
    const to = Math.min(taxBase, band.to)
    if (to > from) tax += (to - from) * band.rate
  }
  return tax
}

interface Inputs {
  salary: number
  bonus: number
  region: Region
  pensionPct: number
  sacrifice: boolean
  studentLoan: string
  overSPA: boolean
}

function calculate(i: Inputs) {
  const gross = i.salary + i.bonus
  const pension = gross * (i.pensionPct / 100)

  // Salary sacrifice reduces the base for tax, NI AND student loan.
  // Net-pay pension reduces taxable pay only (NI and SL stay on full gross).
  const taxBase = Math.max(0, gross - pension)
  const niBase = i.sacrifice ? taxBase : gross
  const slBase = i.sacrifice ? taxBase : gross

  const tax = i.region === 'scotland' ? scottishTax(taxBase) : rukTax(taxBase)

  let ni = 0
  if (!i.overSPA && niBase > NI_PT) {
    ni = niBase <= NI_UEL
      ? (niBase - NI_PT) * NI_MAIN
      : (NI_UEL - NI_PT) * NI_MAIN + (niBase - NI_UEL) * NI_ADDITIONAL
  }

  const plan = STUDENT_LOAN_PLANS[i.studentLoan]
  const studentLoanRepayment = plan && slBase > plan.threshold ? (slBase - plan.threshold) * plan.rate : 0

  const totalDeductions = tax + ni + pension + studentLoanRepayment
  const takeHome = gross - totalDeductions

  return {
    gross, tax, ni, pension, studentLoanRepayment, totalDeductions, takeHome,
    effectiveRate: gross > 0 ? (totalDeductions / gross) * 100 : 0,
  }
}

// Net-to-gross: find the salary whose take-home hits the target (monotonic → bisect)
function requiredGross(targetTakeHome: number, base: Omit<Inputs, 'salary'>): number {
  let lo = targetTakeHome
  let hi = targetTakeHome * 3 + 50_000
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2
    if (calculate({ ...base, salary: mid }).takeHome < targetTakeHome) lo = mid
    else hi = mid
  }
  return Math.round(hi)
}

export default function TakeHomePayCalculator() {
  const [mode, setMode] = useState('gross')
  const [income, setIncome] = useState('')
  const [target, setTarget] = useState('')
  const [bonus, setBonus] = useState('')
  const [region, setRegion] = useState<Region>('ruk')
  const [pensionPct, setPensionPct] = useState('5')
  const [sacrifice, setSacrifice] = useState(false)
  const [studentLoan, setStudentLoan] = useState('none')
  const [overSPA, setOverSPA] = useState(false)

  // Restore a shared calculation from the query string. Applied after mount so
  // the first client render matches the SSR HTML (no hydration mismatch).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const g = (k: string) => { const v = q.get(k); return v === null ? null : v.slice(0, 40) }
    if (g('mode') === 'net') setMode('net')
    const s = g('salary'); if (s) setIncome(s)
    const t = g('target'); if (t) setTarget(t)
    const b = g('bonus'); if (b) setBonus(b)
    if (g('region') === 'scotland') setRegion('scotland')
    const p = g('pension'); if (p) setPensionPct(p)
    if (g('sac') === '1') setSacrifice(true)
    const sl = g('sl'); if (sl && sl in STUDENT_LOAN_PLANS) setStudentLoan(sl)
    if (g('spa') === '1') setOverSPA(true)
  }, [])

  const salary = parseFloat(income.replace(/,/g, '')) || 0
  const bon = parseFloat(bonus.replace(/,/g, '')) || 0
  const tgt = parseFloat(target.replace(/,/g, '')) || 0
  const pct = Math.min(Math.max(parseFloat(pensionPct) || 0, 0), 100)

  const base = { bonus: bon, region, pensionPct: pct, sacrifice, studentLoan, overSPA }

  const result = useMemo(() => {
    if (mode === 'net') {
      if (tgt <= 0) return null
      const g = requiredGross(tgt, base)
      return { need: g, ...calculate({ ...base, salary: g }) }
    }
    if (salary <= 0) return null
    return { need: 0, ...calculate({ ...base, salary }) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, salary, tgt, bon, region, pct, sacrifice, studentLoan, overSPA])

  const shareParams: Record<string, string> = {
    mode, region, pension: pensionPct, sl: studentLoan,
    ...(mode === 'net' ? { target } : { salary: income }),
    ...(bonus ? { bonus } : {}),
    ...(sacrifice ? { sac: '1' } : {}),
    ...(overSPA ? { spa: '1' } : {}),
  }

  return (
    <div className="space-y-6">
      {/* Mode */}
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setMode('gross')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${mode !== 'net' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Salary → Take-home</button>
        <button onClick={() => setMode('net')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${mode === 'net' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Take-home → Required salary</button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mode !== 'net' ? (
          <div className="sm:col-span-2">
            <label htmlFor="thp-income" className="block text-sm font-medium mb-2">Annual Gross Salary</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
              <input
                id="thp-income" type="text" inputMode="numeric" value={income}
                onChange={(e) => setIncome(e.target.value)} placeholder="35,000"
                className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Annual Gross Salary" />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {[25_000, 30_000, 35_000, 45_000, 55_000, 75_000].map((a) => (
                <button key={a} onClick={() => setIncome(a.toLocaleString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">
                  £{(a / 1000)}K
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="sm:col-span-2">
            <label htmlFor="thp-target" className="block text-sm font-medium mb-2">Desired Annual Take-Home Pay</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
              <input
                id="thp-target" type="text" inputMode="numeric" value={target}
                onChange={(e) => setTarget(e.target.value)} placeholder="30,000"
                className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Desired Annual Take-Home Pay" />
            </div>
            {tgt > 0 && <p className="text-xs text-muted-foreground mt-1">That's {formatCurrency(tgt / 12)}/month in your pocket</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Where do you pay tax?</label>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setRegion('ruk')} className={`px-3 py-3 rounded-xl text-sm font-medium border ${region === 'ruk' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>England, Wales &amp; NI</button>
            <button onClick={() => setRegion('scotland')} className={`px-3 py-3 rounded-xl text-sm font-medium border ${region === 'scotland' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Scotland</button>
          </div>
        </div>

        <div>
          <label htmlFor="thp-bonus" className="block text-sm font-medium mb-2">Annual Bonus (optional)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input
              id="thp-bonus" type="text" inputMode="numeric" value={bonus}
              onChange={(e) => setBonus(e.target.value)} placeholder="0"
              className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Annual Bonus" />
          </div>
        </div>

        <div>
          <label htmlFor="pension-pct" className="block text-sm font-medium mb-2">Pension Contribution (%)</label>
          <input
            id="pension-pct" type="number" min="0" max="100" step="0.5" value={pensionPct}
            onChange={(e) => setPensionPct(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Pension Contribution (%)" />
          <label className="flex items-center gap-2 mt-2 cursor-pointer text-sm">
            <input type="checkbox" checked={sacrifice} onChange={(e) => setSacrifice(e.target.checked)} className="h-4 w-4 rounded border-border" />
            <span>Via salary sacrifice <span className="text-muted-foreground">(also saves NI)</span></span>
          </label>
        </div>

        <div>
          <label htmlFor="student-loan" className="block text-sm font-medium mb-2">Student Loan</label>
          <select
            id="student-loan" value={studentLoan} onChange={(e) => setStudentLoan(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Student Loan">
            <option value="none">None</option>
            <option value="plan1">Plan 1 (pre-2012)</option>
            <option value="plan2">Plan 2 (post-2012)</option>
            <option value="plan4">Plan 4 (Scotland)</option>
            <option value="plan5">Plan 5 (post-2023)</option>
            <option value="postgrad">Postgraduate</option>
          </select>
          <label className="flex items-center gap-2 mt-2 cursor-pointer text-sm">
            <input type="checkbox" checked={overSPA} onChange={(e) => setOverSPA(e.target.checked)} className="h-4 w-4 rounded border-border" />
            <span>Over State Pension age <span className="text-muted-foreground">(no employee NI)</span></span>
          </label>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in-up">
          {mode === 'net' && (
            <div className="rounded-2xl bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">Required Gross Salary</p>
              <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.need)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                to take home {formatCurrency(tgt)}/year ({formatCurrency(tgt / 12)}/month)
                {bon > 0 ? ' including your bonus' : ''}
              </p>
            </div>
          )}

          <div className={`rounded-2xl p-6 text-center ${mode === 'net' ? 'bg-muted/50 border border-border' : 'bg-primary/10'}`}>
            <p className="text-sm text-muted-foreground">Annual Take-Home Pay</p>
            <p className={`text-3xl font-bold mt-1 ${mode === 'net' ? '' : 'text-primary'}`}>{formatCurrency(result.takeHome)}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {formatCurrency(result.takeHome / 12)}/month &middot; {formatCurrency(result.takeHome / 52)}/week
              {region === 'scotland' ? ' · Scottish rates' : ''}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground">Deduction</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Annual</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Monthly</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 font-medium">Gross{bon > 0 ? ` (incl. ${formatCurrency(bon)} bonus)` : ''}</td>
                  <td className="text-right py-2.5 tabular-nums">{formatCurrency(result.gross)}</td>
                  <td className="text-right py-2.5 tabular-nums">{formatCurrency(result.gross / 12)}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 text-destructive">Income Tax{region === 'scotland' ? ' (Scotland)' : ''}</td>
                  <td className="text-right py-2.5 tabular-nums text-destructive">-{formatCurrency(result.tax)}</td>
                  <td className="text-right py-2.5 tabular-nums text-destructive">-{formatCurrency(result.tax / 12)}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 text-destructive">National Insurance{overSPA ? ' (exempt)' : ''}</td>
                  <td className="text-right py-2.5 tabular-nums text-destructive">-{formatCurrency(result.ni)}</td>
                  <td className="text-right py-2.5 tabular-nums text-destructive">-{formatCurrency(result.ni / 12)}</td>
                </tr>
                {result.pension > 0 && (
                  <tr className="border-b border-border/50">
                    <td className="py-2.5 text-muted-foreground">Pension ({pct}%{sacrifice ? ', salary sacrifice' : ''})</td>
                    <td className="text-right py-2.5 tabular-nums">-{formatCurrency(result.pension)}</td>
                    <td className="text-right py-2.5 tabular-nums">-{formatCurrency(result.pension / 12)}</td>
                  </tr>
                )}
                {result.studentLoanRepayment > 0 && (
                  <tr className="border-b border-border/50">
                    <td className="py-2.5 text-muted-foreground">Student Loan</td>
                    <td className="text-right py-2.5 tabular-nums">-{formatCurrency(result.studentLoanRepayment)}</td>
                    <td className="text-right py-2.5 tabular-nums">-{formatCurrency(result.studentLoanRepayment / 12)}</td>
                  </tr>
                )}
                <tr className="font-semibold">
                  <td className="py-2.5 text-primary">Take-Home Pay</td>
                  <td className="text-right py-2.5 tabular-nums text-primary">{formatCurrency(result.takeHome)}</td>
                  <td className="text-right py-2.5 tabular-nums text-primary">{formatCurrency(result.takeHome / 12)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Total deductions: {formatPercent(result.effectiveRate)} of gross salary
          </p>

          <ShareRow params={shareParams} />
        </div>
      )}
    </div>
  )
}
