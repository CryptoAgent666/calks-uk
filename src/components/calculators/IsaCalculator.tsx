import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const ISA_ALLOWANCE = 20_000

// Tax the same interest would pay outside an ISA: savings rates for 2026/27, rising 2 points from
// 6 April 2027 (HMRC technical note, Budget 2025); the Personal Savings Allowance is unchanged.
const TAX_BANDS: Record<string, { label: string; now: number; from2027: number; psa: number }> = {
  basic: { label: 'Basic rate (20%)', now: 0.20, from2027: 0.22, psa: 1_000 },
  higher: { label: 'Higher rate (40%)', now: 0.40, from2027: 0.42, psa: 500 },
  additional: { label: 'Additional rate (45%)', now: 0.45, from2027: 0.47, psa: 0 },
}

function calculate(monthlyDeposit: number, annualRate: number, years: number, currentBalance: number, band: string) {
  const maxMonthly = ISA_ALLOWANCE / 12
  const effectiveMonthly = Math.min(monthlyDeposit, maxMonthly)
  const monthlyRate = annualRate / 100 / 12

  const tax = TAX_BANDS[band] ?? TAX_BANDS.basic

  let balance = currentBalance
  let totalDeposits = currentBalance
  let yearInterest = 0
  let taxSaved = 0

  for (let m = 1; m <= years * 12; m++) {
    const interest = balance * monthlyRate
    balance = balance + interest + effectiveMonthly
    totalDeposits += effectiveMonthly
    yearInterest += interest
    if (m % 12 === 0 || m === years * 12) {
      const rate = m <= 12 ? tax.now : tax.from2027
      taxSaved += Math.max(0, yearInterest - tax.psa) * rate
      yearInterest = 0
    }
  }

  const interestEarned = balance - totalDeposits

  return { balance, totalDeposits, interestEarned, taxSaved, annualDeposit: effectiveMonthly * 12 }
}

export default function IsaCalculator() {
  const [monthly, setMonthly] = useState('500')
  const [rate, setRate] = useState('4.5')
  const [years, setYears] = useState('10')
  const [current, setCurrent] = useState('0')
  const [band, setBand] = useState('basic')

  const m = parseFloat(monthly.replace(/,/g, '')) || 0
  const r = parseFloat(rate) || 0
  const y = parseInt(years) || 0
  const c = parseFloat(current.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(m, r, y, c, band), [m, r, y, c, band])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Monthly Contribution</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Contribution" /></div>
          <p className="text-xs text-muted-foreground mt-1">Max £{(ISA_ALLOWANCE / 12).toFixed(0)}/month (£{ISA_ALLOWANCE.toLocaleString()}/year). From 6 April 2027, under-65s can put at most £12,000 a year into cash ISAs.</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Annual Interest Rate (%)</label>
          <input type="number" min="0" max="20" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Interest Rate (%)" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Time Period (years)</label>
          <input type="number" min="1" max="50" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Time Period (years)" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Current ISA Balance</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current ISA Balance" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Your Tax Band</label>
          <select value={band} onChange={(e) => setBand(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Your Tax Band">
            {Object.entries(TAX_BANDS).map(([k, b]) => <option key={k} value={k}>{b.label}</option>)}
          </select>
        </div>
      </div>

      {y > 0 && (m > 0 || c > 0) && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">ISA Balance after {y} year{y === 1 ? '' : 's'}</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.balance)}</p>
            <p className="text-sm text-muted-foreground mt-1">All growth is tax-free</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Deposits</p><p className="text-lg font-bold">{formatCurrency(result.totalDeposits)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Tax-Free Interest</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.interestEarned)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Tax Saved (vs taxed account)</p><p className="text-lg font-bold">{formatCurrency(result.taxSaved)}</p></div>
          </div>
          <p className="text-xs text-muted-foreground">Tax saved assumes this is your only savings interest: each year's interest above your Personal Savings Allowance (£{TAX_BANDS[band].psa.toLocaleString()}) would be taxed at your savings rate, which rises by 2 points from 6 April 2027.</p>
        </div>
      )}
    </div>
  )
}
