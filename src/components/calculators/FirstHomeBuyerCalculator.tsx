import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(price: number, deposit: number, salary: number, partnerSalary: number) {
  const totalIncome = salary + partnerSalary
  const maxBorrow = totalIncome * 4.5
  const maxProperty = maxBorrow + deposit
  const ltv = price > 0 ? ((price - deposit) / price) * 100 : 0
  const depositPct = price > 0 ? (deposit / price) * 100 : 0
  const canAfford = price <= maxProperty

  // SDLT FTB relief (April 2025)
  let sdlt = 0
  if (price <= 500_000) {
    if (price > 300_000) sdlt = (price - 300_000) * 0.05
  } else {
    if (price > 125_000) sdlt += Math.min(price - 125_000, 125_000) * 0.02
    if (price > 250_000) sdlt += Math.min(price - 250_000, 675_000) * 0.05
    if (price > 925_000) sdlt += Math.min(price - 925_000, 575_000) * 0.10
    if (price > 1_500_000) sdlt += (price - 1_500_000) * 0.12
  }

  // Other costs
  const solicitor = 1500
  const survey = 500
  const mortgageFee = 999
  const totalUpfront = deposit + sdlt + solicitor + survey + mortgageFee

  // Monthly mortgage (4.5% rate, 30yr)
  const mortgage = price - deposit
  const monthlyRate = 0.045 / 12
  const payments = 30 * 12
  const monthlyMortgage = monthlyRate > 0 ? mortgage * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1) : mortgage / payments

  return { maxBorrow, maxProperty, canAfford, ltv, depositPct, sdlt, solicitor, survey, mortgageFee, totalUpfront, monthlyMortgage, mortgage }
}

export default function FirstHomeBuyerCalculator() {
  const [price, setPrice] = useState('300000')
  const [deposit, setDeposit] = useState('30000')
  const [salary, setSalary] = useState('35000')
  const [partner, setPartner] = useState('30000')

  const p = parseFloat(price.replace(/,/g,'')) || 0
  const d = parseFloat(deposit.replace(/,/g,'')) || 0
  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const ps = parseFloat(partner.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(p, d, s, ps), [p, d, s, ps])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Property Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Property Price" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Deposit" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Your Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Partner Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={partner} onChange={(e) => setPartner(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Partner Salary" /></div></div>
      </div>

      {p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-xl p-3 text-center text-sm font-medium ${result.canAfford ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400' : 'bg-destructive/10 text-destructive'}`}>
            {result.canAfford ? `You can afford this! Max borrowing: ${formatCurrency(result.maxBorrow)}` : `Over budget — max property: ${formatCurrency(result.maxProperty)} (at 4.5x income)`}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly Mortgage</p><p className="text-xl font-bold text-primary">{formatCurrency(result.monthlyMortgage)}</p><p className="text-xs text-muted-foreground">at 4.5%, 30yr</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total Upfront</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.totalUpfront)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">LTV</p><p className="text-lg font-bold">{result.ltv.toFixed(0)}%</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Deposit</p><p className="text-lg font-bold">{result.depositPct.toFixed(0)}%</p></div>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Deposit</td><td className="text-right tabular-nums">{formatCurrency(d)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Stamp Duty (FTB relief)</td><td className="text-right tabular-nums">{formatCurrency(result.sdlt)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Solicitor</td><td className="text-right tabular-nums">{formatCurrency(result.solicitor)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Survey</td><td className="text-right tabular-nums">{formatCurrency(result.survey)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Mortgage Fee</td><td className="text-right tabular-nums">{formatCurrency(result.mortgageFee)}</td></tr>
              <tr className="font-semibold"><td className="py-2">Total Cash Needed</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.totalUpfront)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
