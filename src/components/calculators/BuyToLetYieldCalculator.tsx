import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

function calculate(propertyPrice: number, monthlyRent: number, deposit: number, mortgageRate: number, managementPct: number, insurance: number, maintenance: number, voidWeeks: number) {
  const annualRent = monthlyRent * (52 - voidWeeks) / 52 * 12
  const grossYield = propertyPrice > 0 ? (monthlyRent * 12 / propertyPrice) * 100 : 0

  const mortgage = propertyPrice - deposit
  const annualMortgage = mortgage * (mortgageRate / 100)
  const managementFee = annualRent * (managementPct / 100)
  const totalExpenses = annualMortgage + managementFee + insurance + maintenance

  const netProfit = annualRent - totalExpenses
  const netYield = propertyPrice > 0 ? (netProfit / propertyPrice) * 100 : 0
  const returnOnDeposit = deposit > 0 ? (netProfit / deposit) * 100 : 0
  const monthlyCashflow = netProfit / 12

  return { annualRent, grossYield, totalExpenses, netProfit, netYield, returnOnDeposit, monthlyCashflow, annualMortgage, managementFee }
}

export default function BuyToLetYieldCalculator() {
  const [price, setPrice] = useState('250000')
  const [rent, setRent] = useState('1100')
  const [deposit, setDeposit] = useState('62500')
  const [rate, setRate] = useState('5.5')
  const [mgmt, setMgmt] = useState('10')
  const [ins, setIns] = useState('300')
  const [maint, setMaint] = useState('1200')
  const [voids, setVoids] = useState('2')

  const p = parseFloat(price.replace(/,/g,'')) || 0
  const r = parseFloat(rent.replace(/,/g,'')) || 0
  const d = parseFloat(deposit.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(p, r, d, parseFloat(rate)||0, parseFloat(mgmt)||0, parseFloat(ins)||0, parseFloat(maint)||0, parseInt(voids)||0), [p, r, d, rate, mgmt, ins, maint, voids])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Property Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Monthly Rent</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Deposit (25%)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Mortgage Rate (%)</label><input type="number" min="0" max="10" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Management (%)</label><input type="number" min="0" max="20" value={mgmt} onChange={(e) => setMgmt(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Insurance (£/yr)</label><input type="number" min="0" value={ins} onChange={(e) => setIns(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Maintenance (£/yr)</label><input type="number" min="0" value={maint} onChange={(e) => setMaint(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Void Weeks/Year</label><input type="number" min="0" max="12" value={voids} onChange={(e) => setVoids(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {p > 0 && r > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Gross Yield</p><p className="text-xl font-bold text-primary">{formatPercent(result.grossYield)}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.netProfit > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Net Yield</p><p className={`text-xl font-bold ${result.netProfit > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatPercent(result.netYield)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Return on Deposit</p><p className="text-lg font-bold">{formatPercent(result.returnOnDeposit)}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.monthlyCashflow > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Monthly Cashflow</p><p className={`text-lg font-bold ${result.monthlyCashflow > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(result.monthlyCashflow)}</p></div>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Annual Rent</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.annualRent)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Mortgage Interest</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.annualMortgage)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Management ({mgmt}%)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.managementFee)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Insurance + Maintenance</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(parseFloat(ins) + parseFloat(maint))}</td></tr>
              <tr className={`font-semibold ${result.netProfit > 0 ? '' : 'text-destructive'}`}><td className="py-2">Net Annual Profit</td><td className="text-right tabular-nums">{formatCurrency(result.netProfit)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
