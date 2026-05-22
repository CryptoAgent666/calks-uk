import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

function calculate(rentalIncome: number, mortgageInterest: number, expenses: number, otherIncome: number) {
  const profit = rentalIncome - expenses
  const totalIncome = otherIncome + profit

  // Tax on total income
  let pa = 12_570
  if (totalIncome > 100_000) pa = Math.max(0, 12_570 - Math.floor((totalIncome - 100_000) / 2))

  let totalTax = 0
  if (totalIncome > pa) {
    if (totalIncome <= 50_270) totalTax = (totalIncome - pa) * 0.20
    else if (totalIncome <= 125_140) totalTax = (50_270 - pa) * 0.20 + (totalIncome - 50_270) * 0.40
    else totalTax = (50_270 - pa) * 0.20 + (125_140 - 50_270) * 0.40 + (totalIncome - 125_140) * 0.45
  }

  // Tax without rental
  let taxWithout = 0
  if (otherIncome > pa) {
    if (otherIncome <= 50_270) taxWithout = (otherIncome - pa) * 0.20
    else if (otherIncome <= 125_140) taxWithout = (50_270 - pa) * 0.20 + (otherIncome - 50_270) * 0.40
    else taxWithout = (50_270 - pa) * 0.20 + (125_140 - 50_270) * 0.40 + (otherIncome - 125_140) * 0.45
  }

  const taxOnRental = totalTax - taxWithout

  // Section 24 mortgage interest relief (20% tax credit)
  const mortgageRelief = mortgageInterest * 0.20
  const netTaxOnRental = taxOnRental - mortgageRelief

  const netProfit = profit - netTaxOnRental
  const effectiveRate = profit > 0 ? (netTaxOnRental / profit) * 100 : 0

  return { rentalIncome, expenses, profit, mortgageInterest, mortgageRelief, taxOnRental, netTaxOnRental, netProfit, effectiveRate }
}

export default function LandlordTaxCalculator() {
  const [rental, setRental] = useState('')
  const [mortgage, setMortgage] = useState('6000')
  const [expenses, setExpenses] = useState('2000')
  const [other, setOther] = useState('35000')

  const ri = parseFloat(rental.replace(/,/g,'')) || 0
  const mi = parseFloat(mortgage.replace(/,/g,'')) || 0
  const ex = parseFloat(expenses.replace(/,/g,'')) || 0
  const oi = parseFloat(other.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(ri, mi, ex, oi), [ri, mi, ex, oi])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Rental Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={rental} onChange={(e) => setRental(e.target.value)} placeholder="12,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Rental Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Mortgage Interest (annual)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={mortgage} onChange={(e) => setMortgage(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Mortgage Interest (annual)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Allowable Expenses</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={expenses} onChange={(e) => setExpenses(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Allowable Expenses" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Other Income (salary etc.)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={other} onChange={(e) => setOther(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Other Income (salary etc.)" /></div></div>
      </div>

      {ri > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Net Rental Profit (after tax)</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.netProfit)}</p>
            <p className="text-sm text-muted-foreground mt-1">Effective tax rate: {formatPercent(result.effectiveRate)}</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Rental Income</td><td className="text-right tabular-nums">{formatCurrency(result.rentalIncome)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Expenses</td><td className="text-right tabular-nums">-{formatCurrency(result.expenses)}</td></tr>
              <tr className="border-b border-border font-medium"><td className="py-2">Rental Profit</td><td className="text-right tabular-nums">{formatCurrency(result.profit)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Tax on Rental</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.taxOnRental)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-green-600">Section 24 Relief (20%)</td><td className="text-right tabular-nums text-green-600">+{formatCurrency(result.mortgageRelief)}</td></tr>
              <tr className="font-semibold"><td className="py-2 text-primary">Net Profit</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.netProfit)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Since Section 24, mortgage interest is no longer deductible. Instead, you get a 20% tax credit on interest paid.</p>
          </div>
        </div>
      )}
    </div>
  )
}
