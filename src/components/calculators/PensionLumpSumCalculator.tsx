import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// 2026/27 income tax bands as cumulative limits of TAXABLE income (after the Personal Allowance)
const RUK_BANDS = [
  { upTo: 37_700, rate: 0.20 },
  { upTo: 125_140, rate: 0.40 },
  { upTo: Infinity, rate: 0.45 },
]
const SCOT_BANDS = [
  { upTo: 3_967, rate: 0.19 },
  { upTo: 16_956, rate: 0.20 },
  { upTo: 31_092, rate: 0.21 },
  { upTo: 62_430, rate: 0.42 },
  { upTo: 125_140, rate: 0.45 },
  { upTo: Infinity, rate: 0.48 },
]

// Income tax with the £100k Personal Allowance taper
function incomeTax(income: number, scotland: boolean) {
  const pa = income > 100_000 ? Math.max(0, 12_570 - Math.floor((income - 100_000) / 2)) : 12_570
  const taxable = Math.max(0, income - pa)
  let tax = 0
  let lower = 0
  for (const b of scotland ? SCOT_BANDS : RUK_BANDS) {
    if (taxable > lower) tax += (Math.min(taxable, b.upTo) - lower) * b.rate
    lower = b.upTo
  }
  return tax
}

const LUMP_SUM_ALLOWANCE = 268_275

function calculate(pot: number, lumpSumPct: number, otherIncome: number, scotland: boolean) {
  const maxTaxFree = Math.min(pot * 0.25, LUMP_SUM_ALLOWANCE)
  const lumpSum = pot * (lumpSumPct / 100)
  const taxFree = Math.min(lumpSum, maxTaxFree)
  const taxable = Math.max(0, lumpSum - maxTaxFree)

  // The taxable part is added to your other income for the year and taxed through the bands
  const tax = incomeTax(otherIncome + taxable, scotland) - incomeTax(otherIncome, scotland)
  const netLumpSum = lumpSum - tax

  const remainingPot = pot - lumpSum
  const annualDrawdown4pct = remainingPot * 0.04
  const monthlyDrawdown = annualDrawdown4pct / 12

  return { lumpSum, maxTaxFree, taxFree, taxable, tax, netLumpSum, remainingPot, annualDrawdown4pct, monthlyDrawdown }
}

export default function PensionLumpSumCalculator() {
  const [pot, setPot] = useState('300000')
  const [pct, setPct] = useState('25')
  const [other, setOther] = useState('0')
  const [region, setRegion] = useState('ruk')

  const p = parseFloat(pot.replace(/,/g,'')) || 0
  const pc = Number.isNaN(parseFloat(pct)) ? 25 : parseFloat(pct)
  const o = parseFloat(other.replace(/,/g,'')) || 0
  const scotland = region === 'scotland'
  const result = useMemo(() => calculate(p, pc, o, scotland), [p, pc, o, scotland])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Pension Pot</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={pot} onChange={(e) => setPot(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Pension Pot" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Lump Sum (%)</label><input type="range" min="0" max="100" value={pct} onChange={(e) => setPct(e.target.value)} className="w-full mt-3"  aria-label="Lump Sum (%)" /><div className="flex justify-between text-xs text-muted-foreground"><span>0% (no lump sum)</span><span className="font-bold text-foreground">{pct}%</span><span>100% (all cash)</span></div></div>
        <div><label className="block text-sm font-medium mb-2">Other Taxable Income This Year</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={other} onChange={(e) => setOther(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Other Taxable Income This Year" /></div><p className="text-xs text-muted-foreground mt-1">Salary, State Pension, other pensions</p></div>
        <div><label className="block text-sm font-medium mb-2">Where You Pay Income Tax</label><select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Where You Pay Income Tax"><option value="ruk">England, Wales or NI</option><option value="scotland">Scotland</option></select></div>
      </div>

      {p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-5 text-center"><p className="text-sm text-muted-foreground">Lump Sum (net)</p><p className="text-2xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.netLumpSum)}</p><p className="text-xs text-muted-foreground">{formatCurrency(result.taxFree)} tax-free{result.tax > 0 ? ` + ${formatCurrency(result.taxable - result.tax)} after tax` : ''}</p></div>
            <div className="rounded-2xl bg-primary/10 p-5 text-center"><p className="text-sm text-muted-foreground">Remaining Pot</p><p className="text-2xl font-bold text-primary">{formatCurrency(result.remainingPot)}</p><p className="text-xs text-muted-foreground">{formatCurrency(result.monthlyDrawdown)}/month before tax (4% rule)</p></div>
          </div>
          {result.taxable > 0 && (
            <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-center text-sm text-orange-800 dark:text-orange-300">
              This is above your tax-free amount of {formatCurrency(result.maxTaxFree)} (25% of the pot, capped at £268,275), so {formatCurrency(result.taxable)} is taxable. Tax: {formatCurrency(result.tax)}, worked out on top of your other income through the 2026/27 {scotland ? 'Scottish ' : ''}bands. The first flexible withdrawal is often taxed on an emergency code; reclaim any overpayment with form P55, P50Z or P53Z. Taking taxable cash from flexi-access drawdown, or a UFPLS, also cuts your annual allowance for money purchase pensions to £10,000.
            </div>
          )}
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Total Lump Sum ({pct}%)</td><td className="text-right tabular-nums">{formatCurrency(result.lumpSum)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-green-600">Tax-Free (25% of pot, max £268,275)</td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.taxFree)}</td></tr>
              {result.taxable > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Taxable Amount</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.taxable)}</td></tr>}
              {result.tax > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.tax)}</td></tr>}
              <tr className="font-semibold"><td className="py-2">Net Lump Sum</td><td className="text-right tabular-nums">{formatCurrency(result.netLumpSum)}</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground">Paying a tax-free lump sum back into a pension to gain extra tax relief can count as recycling, which HMRC treats as an unauthorised payment.</p>
        </div>
      )}
    </div>
  )
}
