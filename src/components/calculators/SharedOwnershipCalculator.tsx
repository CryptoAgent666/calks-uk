import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(fullPrice: number, sharePct: number, deposit: number, mortgageRate: number, mortgageTerm: number, rentPct: number) {
  const shareValue = fullPrice * (sharePct / 100)
  const unsoldShare = fullPrice - shareValue
  const mortgage = shareValue - deposit
  const monthlyRate = mortgageRate / 100 / 12
  const payments = mortgageTerm * 12

  const monthlyMortgage = monthlyRate > 0
    ? mortgage * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1)
    : mortgage / payments

  // Rent on unsold share (typically 2.75% of unsold share per year)
  const annualRent = unsoldShare * (rentPct / 100)
  const monthlyRent = annualRent / 12

  const totalMonthly = monthlyMortgage + monthlyRent

  return { shareValue, unsoldShare, mortgage, monthlyMortgage, monthlyRent, totalMonthly, annualRent, deposit }
}

export default function SharedOwnershipCalculator() {
  const [price, setPrice] = useState('300000')
  const [share, setShare] = useState('25')
  const [deposit, setDeposit] = useState('7500')
  const [rate, setRate] = useState('4.5')
  const [term, setTerm] = useState('25')
  const [rent, setRent] = useState('2.75')

  const p = parseFloat(price.replace(/,/g,'')) || 0
  const s = parseFloat(share) || 0
  const d = parseFloat(deposit.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(p, s, d, parseFloat(rate)||0, parseInt(term)||25, parseFloat(rent)||2.75), [p, s, d, rate, term, rent])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Full Property Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Your Share (%)</label><input type="number" min="10" max="75" step="5" value={share} onChange={(e) => setShare(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          <div className="flex gap-2 mt-2">{[25, 30, 40, 50, 75].map(v => <button key={v} onClick={() => setShare(v.toString())} className={`px-2 py-1 rounded-lg text-xs font-medium ${parseInt(share)===v ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`}>{v}%</button>)}</div></div>
        <div><label className="block text-sm font-medium mb-2">Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Mortgage Rate (%)</label><input type="number" min="0" max="10" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Term (years)</label><input type="number" min="5" max="40" value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Rent on Unsold (%/yr)</label><input type="number" min="0" max="5" step="0.25" value={rent} onChange={(e) => setRent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Monthly Cost</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalMonthly)}</p>
            <p className="text-sm text-muted-foreground mt-1">Mortgage: {formatCurrency(result.monthlyMortgage)} + Rent: {formatCurrency(result.monthlyRent)}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Your Share ({s}%)</p><p className="text-lg font-bold">{formatCurrency(result.shareValue)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Mortgage</p><p className="text-lg font-bold">{formatCurrency(result.mortgage)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Unsold Share</p><p className="text-lg font-bold">{formatCurrency(result.unsoldShare)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Rent</p><p className="text-lg font-bold">{formatCurrency(result.annualRent)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
