import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(marketValue: number, discount: number, deposit: number, salary: number, partnerSalary: number) {
  const discountedPrice = marketValue * (1 - discount / 100)
  const mortgage = discountedPrice - deposit
  const totalIncome = salary + partnerSalary
  const maxBorrow = totalIncome * 4.5
  const canAfford = mortgage <= maxBorrow
  const saving = marketValue - discountedPrice

  const monthlyRate = 0.045 / 12 // assume 4.5%
  const payments = 25 * 12
  const monthlyMortgage = monthlyRate > 0 ? mortgage * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1) : mortgage / payments

  return { discountedPrice, mortgage, saving, canAfford, maxBorrow, monthlyMortgage }
}

export default function FirstHomesSchemeCalculator() {
  const [value, setValue] = useState('250000')
  const [discount, setDiscount] = useState('30')
  const [deposit, setDeposit] = useState('17500')
  const [salary, setSalary] = useState('30000')
  const [partner, setPartner] = useState('25000')

  const v = parseFloat(value.replace(/,/g,'')) || 0
  const d = parseFloat(discount) || 30
  const dp = parseFloat(deposit.replace(/,/g,'')) || 0
  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const ps = parseFloat(partner.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(v, d, dp, s, ps), [v, d, dp, s, ps])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Market Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Discount (%)</label><select value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"><option value="30">30% (minimum)</option><option value="40">40%</option><option value="50">50% (maximum)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Your Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Partner Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={partner} onChange={(e) => setPartner(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>

      {v > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Your Price ({d}% off)</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.discountedPrice)}</p>
            <p className="text-sm text-muted-foreground mt-1">Saving: {formatCurrency(result.saving)} vs market value</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Mortgage Needed</p><p className="text-lg font-bold">{formatCurrency(result.mortgage)}</p></div>
            <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">Monthly Payment</p><p className="text-lg font-bold text-primary">{formatCurrency(result.monthlyMortgage)}</p></div>
            <div className={`rounded-xl p-3 text-center ${result.canAfford ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">{result.canAfford ? 'Affordable!' : 'Over budget'}</p><p className="text-sm font-bold">{result.canAfford ? 'Yes' : `Max: ${formatCurrency(result.maxBorrow)}`}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>First Homes: 30-50% discount on new-build homes for first-time buyers. Max price: £250,000 (£420,000 London). Combined household income under £80,000 (£90,000 London). Discount locked in permanently.</p>
          </div>
        </div>
      )}
    </div>
  )
}
