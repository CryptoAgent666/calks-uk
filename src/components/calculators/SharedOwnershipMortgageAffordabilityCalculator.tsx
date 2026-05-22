import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(propertyValue: number, share: number, deposit: number, salary: number, partnerSalary: number, rate: number) {
  const shareValue = propertyValue * (share / 100)
  const mortgage = shareValue - deposit
  const totalIncome = salary + partnerSalary
  const maxBorrow = totalIncome * 4.5
  const canAfford = mortgage <= maxBorrow
  const unsoldShare = propertyValue - shareValue
  const monthlyRent = unsoldShare * 0.0275 / 12

  const monthlyRate = rate / 100 / 12
  const payments = 25 * 12
  const monthlyMortgage = monthlyRate > 0 ? mortgage * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1) : mortgage / payments
  const totalMonthly = monthlyMortgage + monthlyRent

  return { shareValue, mortgage, maxBorrow, canAfford, monthlyMortgage, monthlyRent, totalMonthly, unsoldShare }
}

export default function SharedOwnershipMortgageAffordabilityCalculator() {
  const [value, setValue] = useState('300000')
  const [share, setShare] = useState('25')
  const [deposit, setDeposit] = useState('7500')
  const [salary, setSalary] = useState('30000')
  const [partner, setPartner] = useState('0')
  const [rate, setRate] = useState('4.5')

  const v = parseFloat(value.replace(/,/g,'')) || 0
  const sh = parseInt(share) || 25
  const d = parseFloat(deposit.replace(/,/g,'')) || 0
  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const ps = parseFloat(partner.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 4.5
  const result = useMemo(() => calculate(v, sh, d, s, ps, r), [v, sh, d, s, ps, r])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Full Property Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Full Property Value" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Your Share (%)</label><select value={share} onChange={(e) => setShare(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Your Share (%)">{[10,15,20,25,30,40,50,75].map(s => <option key={s} value={s}>{s}%</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Deposit" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Your Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Partner Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={partner} onChange={(e) => setPartner(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Partner Salary" /></div></div>
      </div>

      {v > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-xl p-3 text-center text-sm font-medium ${result.canAfford ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400' : 'bg-destructive/10 text-destructive'}`}>
            {result.canAfford ? 'Affordable! Mortgage within 4.5x income' : `Mortgage ${formatCurrency(result.mortgage)} exceeds max ${formatCurrency(result.maxBorrow)}`}
          </div>
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Monthly Cost</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalMonthly)}</p>
            <p className="text-sm text-muted-foreground mt-1">Mortgage: {formatCurrency(result.monthlyMortgage)} + Rent: {formatCurrency(result.monthlyRent)}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Your Share</p><p className="text-lg font-bold">{formatCurrency(result.shareValue)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Mortgage</p><p className="text-lg font-bold">{formatCurrency(result.mortgage)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Unsold Share</p><p className="text-lg font-bold">{formatCurrency(result.unsoldShare)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Monthly Rent</p><p className="text-lg font-bold">{formatCurrency(result.monthlyRent)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
