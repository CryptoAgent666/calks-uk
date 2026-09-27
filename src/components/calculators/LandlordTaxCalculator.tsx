import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent, ukIncomeTax, ukPersonalAllowance } from '@/utils'

type Region = 'ruk' | 'scotland'

/** Section 24 credit rate for 2026/27 (basic rate). Rises to 22% from 6 April 2027 in England, Wales and NI. */
const FINANCE_COST_CREDIT_RATE = 0.20

// Scottish Income Tax 2026/27 on non-savings income (which includes rental
// profit), as bands of TAXABLE income, i.e. after the Personal Allowance:
// starter 19% on the first £3,967, basic 20% to £16,956, intermediate 21% to
// £31,092, higher 42% to £62,430, advanced 45% to £125,140, top 48% above.
const SCOTTISH_TAXABLE_BANDS = [
  { rate: 0.19, to: 3_967 },
  { rate: 0.20, to: 16_956 },
  { rate: 0.21, to: 31_092 },
  { rate: 0.42, to: 62_430 },
  { rate: 0.45, to: 125_140 },
  { rate: 0.48, to: Infinity },
]

function scottishTax(gross: number): number {
  const taxable = Math.max(0, gross - ukPersonalAllowance(gross))
  let tax = 0
  let from = 0
  for (const band of SCOTTISH_TAXABLE_BANDS) {
    if (taxable > from) tax += (Math.min(taxable, band.to) - from) * band.rate
    from = band.to
  }
  return tax
}

function incomeTax(gross: number, region: Region): number {
  return region === 'scotland' ? scottishTax(gross) : ukIncomeTax(gross)
}

function calculate(rentalIncome: number, mortgageInterest: number, expenses: number, otherIncome: number, region: Region = 'ruk') {
  const profit = rentalIncome - expenses
  const taxableProfit = Math.max(0, profit)
  const totalIncome = otherIncome + taxableProfit

  // The tax the rent adds is the bill on everything less the bill on the other
  // income alone. Each figure uses its own Personal Allowance, so the taper
  // above £100k that the rent causes is charged to the rent.
  const totalTax = incomeTax(totalIncome, region)
  const taxWithout = incomeTax(otherIncome, region)
  const taxOnRental = totalTax - taxWithout

  // Section 24: a basic rate credit on the LOWEST of finance costs, property
  // profits and adjusted total income above the Personal Allowance. Finance
  // costs above that limit are carried forward to the next year.
  const incomeAbovePA = Math.max(0, totalIncome - ukPersonalAllowance(totalIncome))
  const relievedInterest = Math.min(Math.max(0, mortgageInterest), taxableProfit, incomeAbovePA)
  const carriedForward = Math.max(0, mortgageInterest - relievedInterest)
  const mortgageRelief = Math.min(relievedInterest * FINANCE_COST_CREDIT_RATE, totalTax)
  const netTaxOnRental = Math.max(0, taxOnRental - mortgageRelief)

  // What is left in cash: rent less expenses, mortgage interest and tax.
  const profitAfterInterest = profit - mortgageInterest
  const netProfit = profitAfterInterest - netTaxOnRental
  const effectiveRate = profitAfterInterest > 0 ? (netTaxOnRental / profitAfterInterest) * 100 : null

  return { rentalIncome, expenses, profit, mortgageInterest, profitAfterInterest, mortgageRelief, relievedInterest, carriedForward, taxOnRental, netTaxOnRental, netProfit, effectiveRate }
}

export default function LandlordTaxCalculator() {
  const [rental, setRental] = useState('')
  const [mortgage, setMortgage] = useState('6000')
  const [expenses, setExpenses] = useState('2000')
  const [other, setOther] = useState('35000')
  const [region, setRegion] = useState<Region>('ruk')

  const ri = parseFloat(rental.replace(/,/g,'')) || 0
  const mi = parseFloat(mortgage.replace(/,/g,'')) || 0
  const ex = parseFloat(expenses.replace(/,/g,'')) || 0
  const oi = parseFloat(other.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(ri, mi, ex, oi, region), [ri, mi, ex, oi, region])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Rental Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={rental} onChange={(e) => setRental(e.target.value)} placeholder="12,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Rental Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Mortgage Interest (annual)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={mortgage} onChange={(e) => setMortgage(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Mortgage Interest (annual)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Allowable Expenses</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={expenses} onChange={(e) => setExpenses(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Allowable Expenses" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Other Income (salary etc.)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={other} onChange={(e) => setOther(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Other Income (salary etc.)" /></div></div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Where do you pay tax?</label>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setRegion('ruk')} aria-pressed={region === 'ruk'} className={`px-3 py-3 rounded-xl text-sm font-medium border ${region === 'ruk' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>England, Wales &amp; NI</button>
          <button onClick={() => setRegion('scotland')} aria-pressed={region === 'scotland'} className={`px-3 py-3 rounded-xl text-sm font-medium border ${region === 'scotland' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Scotland</button>
        </div>
      </div>

      {ri > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Rental Profit After Interest and Tax</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.netProfit)}</p>
            {result.effectiveRate !== null && <p className="text-sm text-muted-foreground mt-1">Tax as a share of profit after interest: {formatPercent(result.effectiveRate)}</p>}
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Rental Income</td><td className="text-right tabular-nums">{formatCurrency(result.rentalIncome)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Expenses</td><td className="text-right tabular-nums">-{formatCurrency(result.expenses)}</td></tr>
              <tr className="border-b border-border font-medium"><td className="py-2">Taxable Rental Profit</td><td className="text-right tabular-nums">{formatCurrency(result.profit)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income Tax on Rental Profit{region === 'scotland' ? ' (Scottish rates)' : ''}</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.taxOnRental)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-green-600">Section 24 Credit (20% of {formatCurrency(result.relievedInterest)})</td><td className="text-right tabular-nums text-green-600">+{formatCurrency(result.mortgageRelief)}</td></tr>
              <tr className="border-b border-border/50 font-medium"><td className="py-2 text-destructive">Tax Due on Rental</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.netTaxOnRental)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Mortgage Interest Paid</td><td className="text-right tabular-nums">-{formatCurrency(result.mortgageInterest)}</td></tr>
              <tr className="font-semibold"><td className="py-2 text-primary">Profit After Interest and Tax</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.netProfit)}</td></tr>
              {result.carriedForward > 0 && <tr className="border-t border-border/50"><td className="py-2 text-muted-foreground">Unused interest carried forward to next year</td><td className="text-right tabular-nums text-muted-foreground">{formatCurrency(result.carriedForward)}</td></tr>}
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Under Section 24, mortgage interest is not deducted from rental profit. Instead you get a 20% tax credit, limited to the lower of the interest, your rental profit and your income above the Personal Allowance. Interest that misses out is carried forward. From 6 April 2027 property income in England, Wales and NI is taxed at 22%, 42% and 47%, and the credit rises to 22%. The figures above use 2026/27 rates.</p>
          </div>
        </div>
      )}
    </div>
  )
}
