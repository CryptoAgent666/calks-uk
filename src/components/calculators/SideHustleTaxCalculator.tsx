import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

const TRADING_ALLOWANCE = 1_000

// rUK income tax 2026/27: PA £12,570 tapered by £1 per £2 over £100k; 20% on the first £37,700
// of taxable income, 40% to £125,140, 45% above
// Scottish income tax 2026/27: band widths on TAXABLE income, so the total-income thresholds move
// down when the Personal Allowance tapers. Same values as ScottishIncomeTaxCalculator.tsx.
const SCOTTISH_BANDS = [
  { rate: 0.19, width: 3_967 },
  { rate: 0.20, width: 12_989 },
  { rate: 0.21, width: 14_136 },
  { rate: 0.42, width: 31_338 },
  { rate: 0.45, width: 62_710 },
  { rate: 0.48, width: Infinity },
]

function incomeTax(income: number, scottish: boolean) {
  const pa = income > 100_000 ? Math.max(0, 12_570 - Math.floor((income - 100_000) / 2)) : 12_570
  const taxable = Math.max(0, income - pa)
  if (scottish) {
    let remaining = taxable
    let tax = 0
    for (const band of SCOTTISH_BANDS) {
      const inBand = Math.min(remaining, band.width)
      tax += inBand * band.rate
      remaining -= inBand
    }
    return tax
  }
  const basic = Math.min(taxable, 37_700)
  const higher = Math.min(Math.max(0, taxable - 37_700), 125_140 - 37_700)
  const additional = Math.max(0, taxable - 125_140)
  return basic * 0.20 + higher * 0.40 + additional * 0.45
}

function calculate(income: number, employmentIncome: number, expenses: number, useAllowance: boolean, scottish: boolean) {
  const taxFree = useAllowance ? TRADING_ALLOWANCE : expenses
  // Gross trading income of £1,000 or less is fully relieved whichever option is picked
  const withinAllowance = income <= TRADING_ALLOWANCE
  const taxableProfit = withinAllowance ? 0 : Math.max(0, income - taxFree)
  const totalIncome = employmentIncome + taxableProfit

  // Tax on salary alone vs salary + side profit, each with its own Personal Allowance taper,
  // so side income that pushes you into £100k-£125,140 shows the real 60% marginal rate.
  const empTax = incomeTax(employmentIncome, scottish)
  const totalTax = incomeTax(totalIncome, scottish)

  const extraTax = totalTax - empTax

  // Class 4 NI on side hustle profit (if over threshold)
  let class4 = 0
  if (taxableProfit > 12_570) {
    if (taxableProfit <= 50_270) class4 = (taxableProfit - 12_570) * 0.06
    else class4 = (50_270 - 12_570) * 0.06 + (taxableProfit - 50_270) * 0.02
  }

  const totalOwed = extraTax + class4
  // Money actually spent comes out whichever option sets the taxable profit; the allowance itself is not a cost
  const keepFromSideHustle = income - expenses - totalOwed

  // The reporting test looks at gross income, before any expenses
  return { income, taxableProfit, extraTax, class4, totalOwed, keepFromSideHustle, taxFree, withinAllowance, needsSelfAssessment: !withinAllowance, effectiveRate: income > 0 ? (totalOwed / income) * 100 : 0 }
}

export default function SideHustleTaxCalculator() {
  const [income, setIncome] = useState('')
  const [empIncome, setEmpIncome] = useState('35000')
  const [expenses, setExpenses] = useState('200')
  const [useAllowance, setUseAllowance] = useState(true)
  const [scotland, setScotland] = useState(false)

  const i = parseFloat(income.replace(/,/g, '')) || 0
  const e = parseFloat(empIncome.replace(/,/g, '')) || 0
  const ex = parseFloat(expenses.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(i, e, ex, useAllowance, scotland), [i, e, ex, useAllowance, scotland])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Side Hustle Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="5,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Side Hustle Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Employment Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={empIncome} onChange={(e) => setEmpIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Employment Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Actual Expenses</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={expenses} onChange={(e) => setExpenses(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Actual Expenses" /></div></div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setUseAllowance(true)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${useAllowance ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>£1,000 Trading Allowance</button>
        <button onClick={() => setUseAllowance(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${!useAllowance ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Claim Actual Expenses</button>
      </div>

      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={scotland} onChange={(e) => setScotland(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">I pay Scottish Income Tax (Class 4 NI is the same across the UK)</span></label>

      {i > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          {result.withinAllowance ? (
            <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
              <p className="text-lg font-bold text-green-700 dark:text-green-400">No Tax to Pay!</p>
              <p className="text-sm text-muted-foreground mt-1">Gross side hustle income of £1,000 or less is covered by the trading allowance, so normally there is nothing to report.</p>
            </div>
          ) : (
            <>
              <div className="rounded-2xl bg-primary/10 p-6 text-center">
                <p className="text-sm text-muted-foreground">You Keep</p>
                <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.keepFromSideHustle)}</p>
                <p className="text-sm text-muted-foreground mt-1">of {formatCurrency(i)} &middot; Tax rate: {formatPercent(result.effectiveRate)}</p>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border/50"><td className="py-2">Side hustle income</td><td className="text-right tabular-nums">{formatCurrency(i)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 text-muted-foreground">Taxable profit (after {useAllowance ? 'Trading Allowance' : 'expenses'})</td><td className="text-right tabular-nums text-muted-foreground">{formatCurrency(result.taxableProfit)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 text-destructive">Expenses you paid</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(ex)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 text-destructive">Extra Income Tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.extraTax)}</td></tr>
                  {result.class4 > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Class 4 NI</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.class4)}</td></tr>}
                  <tr className="font-semibold"><td className="py-2 text-primary">You Keep</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.keepFromSideHustle)}</td></tr>
                </tbody>
              </table>
              {result.needsSelfAssessment && <p className="text-xs text-orange-600">Your gross income is over £1,000, so you'll need to file a self-assessment tax return, even if expenses wipe out the profit.</p>}
            </>
          )}
        </div>
      )}

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>This calculator uses the 2026/27 Trading Allowance of £1,000. At Budget 2026 the government announced that the allowance rises to £3,000 from 6 April 2027, and that the Self Assessment trading income reporting threshold rises to £3,000 with it. The £1,000 property allowance is not changing.</p>
      </div>
    </div>
  )
}
