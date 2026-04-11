import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(price: number, deposit: number, isFirstTimeBuyer: boolean, rate: number, term: number) {
  const mortgage = price - deposit

  // SDLT
  let sdlt = 0
  if (isFirstTimeBuyer && price <= 500_000) { if (price > 300_000) sdlt = (price - 300_000) * 0.05 }
  else { if (price > 125_000) sdlt += Math.min(price - 125_000, 125_000) * 0.02; if (price > 250_000) sdlt += Math.min(price - 250_000, 675_000) * 0.05; if (price > 925_000) sdlt += Math.min(price - 925_000, 575_000) * 0.10; if (price > 1_500_000) sdlt += (price - 1_500_000) * 0.12 }

  const solicitor = price < 250_000 ? 1200 : price < 500_000 ? 1500 : 2000
  const survey = price < 250_000 ? 400 : 600
  const searches = 300
  const landRegistry = price < 200_000 ? 100 : 150
  const mortgageFee = 999
  const removals = 800
  const totalUpfront = deposit + sdlt + solicitor + survey + searches + landRegistry + mortgageFee + removals

  const monthlyRate = rate / 100 / 12
  const payments = term * 12
  const monthlyMortgage = monthlyRate > 0 ? mortgage * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1) : mortgage / payments

  return { sdlt, solicitor, survey, searches, landRegistry, mortgageFee, removals, totalUpfront, monthlyMortgage, mortgage }
}

export default function HomeBuyingTotalCostCalculator() {
  const [price, setPrice] = useState('350000')
  const [deposit, setDeposit] = useState('35000')
  const [ftb, setFtb] = useState(false)
  const [rate, setRate] = useState('4.5')
  const [term, setTerm] = useState('25')

  const p = parseFloat(price.replace(/,/g,'')) || 0
  const d = parseFloat(deposit.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 0
  const t = parseInt(term) || 25
  const result = useMemo(() => calculate(p, d, ftb, r, t), [p, d, ftb, r, t])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Property Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Rate (%)</label><input type="number" min="1" max="8" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={ftb} onChange={(e) => setFtb(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">First-time buyer</span></label>

      {p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-destructive/10 p-5 text-center"><p className="text-sm text-muted-foreground">Total Cash Needed</p><p className="text-2xl font-bold text-destructive">{formatCurrency(result.totalUpfront)}</p></div>
            <div className="rounded-2xl bg-primary/10 p-5 text-center"><p className="text-sm text-muted-foreground">Monthly Mortgage</p><p className="text-2xl font-bold text-primary">{formatCurrency(result.monthlyMortgage)}</p></div>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Deposit</td><td className="text-right tabular-nums">{formatCurrency(d)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Stamp Duty</td><td className="text-right tabular-nums">{formatCurrency(result.sdlt)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Solicitor</td><td className="text-right tabular-nums">{formatCurrency(result.solicitor)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Survey</td><td className="text-right tabular-nums">{formatCurrency(result.survey)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Searches</td><td className="text-right tabular-nums">{formatCurrency(result.searches)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Land Registry</td><td className="text-right tabular-nums">{formatCurrency(result.landRegistry)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Mortgage Fee</td><td className="text-right tabular-nums">{formatCurrency(result.mortgageFee)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Removals</td><td className="text-right tabular-nums">{formatCurrency(result.removals)}</td></tr>
              <tr className="font-semibold"><td className="py-2">Total</td><td className="text-right tabular-nums">{formatCurrency(result.totalUpfront)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
