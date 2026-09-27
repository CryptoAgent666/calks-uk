import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

const DIVIDEND_ALLOWANCE = 500
const PERSONAL_ALLOWANCE = 12_570
const TAPER_THRESHOLD = 100_000
const BASIC_BAND = 37_700 // taxable income
const HIGHER_LIMIT = 125_140 // taxable income
const RATES = { basic: 0.1075, higher: 0.3575, additional: 0.3935 }
const SALARY_RATES = { basic: 0.20, higher: 0.40, additional: 0.45 }

function personalAllowance(totalIncome: number) {
  return Math.max(0, PERSONAL_ALLOWANCE - Math.floor(Math.max(0, totalIncome - TAPER_THRESHOLD) / 2))
}

// Tax on a slice of taxable income [from, to) at the given band rates
function sliceTax(from: number, to: number, r: { basic: number; higher: number; additional: number }) {
  const part = (lo: number, hi: number) => Math.max(0, Math.min(to, hi) - Math.max(from, lo))
  return { basic: part(0, BASIC_BAND), higher: part(BASIC_BAND, HIGHER_LIMIT), additional: part(HIGHER_LIMIT, Infinity), tax: part(0, BASIC_BAND) * r.basic + part(BASIC_BAND, HIGHER_LIMIT) * r.higher + part(HIGHER_LIMIT, Infinity) * r.additional }
}

function calculate(dividends: number, otherIncome: number) {
  // Personal Allowance goes to other (non-savings) income first, then to dividends; tapered on total income
  const pa = personalAllowance(otherIncome + dividends)
  const coveredByPA = Math.min(dividends, Math.max(0, pa - otherIncome))
  const taxableOther = Math.max(0, otherIncome - pa)
  const afterPA = dividends - coveredByPA
  const allowanceUsed = Math.min(afterPA, DIVIDEND_ALLOWANCE)
  const taxableDividends = afterPA - allowanceUsed

  // Dividends sit on top of other income; the £500 allowance still uses up band space
  const start = taxableOther + allowanceUsed
  const bands = sliceTax(start, start + taxableDividends, RATES)
  const breakdown: { band: string; amount: number; rate: number; tax: number }[] = []
  if (bands.basic > 0) breakdown.push({ band: 'Basic Rate (10.75%)', amount: bands.basic, rate: RATES.basic, tax: bands.basic * RATES.basic })
  if (bands.higher > 0) breakdown.push({ band: 'Higher Rate (35.75%)', amount: bands.higher, rate: RATES.higher, tax: bands.higher * RATES.higher })
  if (bands.additional > 0) breakdown.push({ band: 'Additional Rate (39.35%)', amount: bands.additional, rate: RATES.additional, tax: bands.additional * RATES.additional })

  // Personal Allowance lost to the taper raises the tax on the other income too (rUK rates)
  const paWithout = personalAllowance(otherIncome)
  const otherTaxWithout = sliceTax(0, Math.max(0, otherIncome - paWithout), SALARY_RATES).tax
  const otherTaxWith = sliceTax(0, taxableOther, SALARY_RATES).tax
  const taperCost = Math.max(0, otherTaxWith - otherTaxWithout)

  const tax = bands.tax
  return { dividends, coveredByPA, allowanceUsed, taxableDividends, tax, taperCost, effectiveRate: dividends > 0 ? ((tax + taperCost) / dividends) * 100 : 0, breakdown }
}

export default function DividendTaxCalculator() {
  const [dividends, setDividends] = useState('')
  const [otherIncome, setOtherIncome] = useState('12570')

  const d = parseFloat(dividends.replace(/,/g, '')) || 0
  const o = parseFloat(otherIncome.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(d, o), [d, o])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="div-amount" className="block text-sm font-medium mb-2">Total Dividends</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input id="div-amount" type="text" inputMode="numeric" value={dividends} onChange={(e) => setDividends(e.target.value)} placeholder="30,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Total Dividends" />
          </div>
        </div>
        <div>
          <label htmlFor="div-other" className="block text-sm font-medium mb-2">Other Income (salary, etc.)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input id="div-other" type="text" inputMode="numeric" value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} placeholder="12,570" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Other Income (salary, etc.)" />
          </div>
        </div>
      </div>

      {d > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Dividends</p><p className="text-lg font-bold">{formatCurrency(result.dividends)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">{result.taperCost > 0 ? 'Tax due to dividends' : 'Tax on Dividends'}</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.tax + result.taperCost)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Effective Rate</p><p className="text-lg font-bold">{formatPercent(result.effectiveRate)}</p></div>
          </div>

          {(result.breakdown.length > 0 || result.coveredByPA > 0) && (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Band</th><th className="text-right py-2 font-medium text-muted-foreground">Amount</th><th className="text-right py-2 font-medium text-muted-foreground">Tax</th></tr></thead>
              <tbody>
                {result.coveredByPA > 0 && <tr className="border-b border-border/50"><td className="py-2.5 text-green-600">Unused Personal Allowance</td><td className="text-right tabular-nums">{formatCurrency(result.coveredByPA)}</td><td className="text-right tabular-nums">{formatCurrency(0)}</td></tr>}
                <tr className="border-b border-border/50"><td className="py-2.5 text-green-600">Dividend Allowance</td><td className="text-right tabular-nums">{formatCurrency(result.allowanceUsed)}</td><td className="text-right tabular-nums">{formatCurrency(0)}</td></tr>
                {result.breakdown.map((b) => (
                  <tr key={b.band} className="border-b border-border/50"><td className="py-2.5">{b.band}</td><td className="text-right tabular-nums">{formatCurrency(b.amount)}</td><td className="text-right tabular-nums font-medium">{formatCurrency(b.tax)}</td></tr>
                ))}
                {result.taperCost > 0 && <tr className="border-b border-border/50"><td className="py-2.5">Extra tax on other income (Personal Allowance taper)</td><td className="text-right tabular-nums"></td><td className="text-right tabular-nums font-medium">{formatCurrency(result.taperCost)}</td></tr>}
              </tbody>
            </table>
          )}
          {result.taperCost > 0 && <p className="text-xs text-muted-foreground">Total income is over £100,000, so the Personal Allowance shrinks by £1 for every £2 above it. The extra tax falls on your other income (shown at England, Wales and NI rates) and is included in the effective rate.</p>}
        </div>
      )}
    </div>
  )
}
