import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// SDLT residential bands from April 2025 (England & Northern Ireland)
const SDLT_BANDS = [
  { from: 0, to: 125_000, rate: 0 },
  { from: 125_000, to: 250_000, rate: 0.02 },
  { from: 250_000, to: 925_000, rate: 0.05 },
  { from: 925_000, to: 1_500_000, rate: 0.10 },
  { from: 1_500_000, to: Infinity, rate: 0.12 },
]
const ADDITIONAL_SURCHARGE = 0.05 // higher rates for additional dwellings, 5% since 31 October 2024
const SURCHARGE_MIN_PRICE = 40_000 // the surcharge does not apply below £40,000

function stampDuty(price: number, additionalProperty: boolean) {
  let tax = 0
  for (const band of SDLT_BANDS) {
    if (price <= band.from) break
    tax += (Math.min(price, band.to) - band.from) * band.rate
  }
  if (additionalProperty && price >= SURCHARGE_MIN_PRICE) tax += price * ADDITIONAL_SURCHARGE
  return tax
}

function calculate(propertyPrice: number, monthlyRent: number, depositPct: number, mortgageRate: number, managementPct: number, insurance: number, maintenance: number, voidWeeks: number, purchaseFees = 0, additionalProperty = true) {
  const annualRentFull = monthlyRent * 12
  const annualRent = annualRentFull * (52 - voidWeeks) / 52
  const grossYield = propertyPrice > 0 ? (annualRentFull / propertyPrice) * 100 : 0

  // Net yield: rent after voids less running costs, before mortgage interest
  const managementFee = annualRent * (managementPct / 100)
  const runningCosts = managementFee + insurance + maintenance
  const netOperatingIncome = annualRent - runningCosts
  const netYield = propertyPrice > 0 ? (netOperatingIncome / propertyPrice) * 100 : 0

  // Financing: interest-only mortgage on the balance after the deposit
  const deposit = propertyPrice * Math.min(Math.max(depositPct, 0), 100) / 100
  const mortgage = propertyPrice - deposit
  const annualMortgage = mortgage * (mortgageRate / 100)
  const annualCashflow = netOperatingIncome - annualMortgage
  const monthlyCashflow = annualCashflow / 12

  // Cash invested: deposit + Stamp Duty + purchase fees
  const sdlt = stampDuty(propertyPrice, additionalProperty)
  const cashInvested = deposit + sdlt + purchaseFees
  const returnOnCash = cashInvested > 0 ? (annualCashflow / cashInvested) * 100 : 0

  return { annualRentFull, annualRent, grossYield, managementFee, runningCosts, netOperatingIncome, netYield, deposit, mortgage, annualMortgage, annualCashflow, monthlyCashflow, sdlt, cashInvested, returnOnCash }
}

const num = (v: string) => parseFloat(v.replace(/,/g, '')) || 0

export default function BuyToLetYieldCalculator() {
  const [price, setPrice] = useState('250000')
  const [rent, setRent] = useState('1100')
  const [depositPct, setDepositPct] = useState('25')
  const [rate, setRate] = useState('5.5')
  const [mgmt, setMgmt] = useState('10')
  const [ins, setIns] = useState('300')
  const [maint, setMaint] = useState('1200')
  const [voids, setVoids] = useState('2')
  const [fees, setFees] = useState('2000')
  const [additional, setAdditional] = useState(true)

  const p = num(price)
  const r = num(rent)
  const dp = num(depositPct)
  const rt = num(rate)
  const mg = num(mgmt)
  const insurance = num(ins)
  const maintenance = num(maint)
  const v = Math.min(Math.max(num(voids), 0), 52)
  const f = num(fees)
  const result = useMemo(() => calculate(p, r, dp, rt, mg, insurance, maintenance, v, f, additional), [p, r, dp, rt, mg, insurance, maintenance, v, f, additional])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Property Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Property Price" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Monthly Rent</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Rent" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Deposit (%)</label><input type="number" min="0" max="100" value={depositPct} onChange={(e) => setDepositPct(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Deposit (%)" /><p className="text-xs text-muted-foreground mt-1">{formatCurrency(result.deposit)}</p></div>
        <div><label className="block text-sm font-medium mb-2">Mortgage Rate (%)</label><input type="number" min="0" max="10" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Mortgage Rate (%)" /><p className="text-xs text-muted-foreground mt-1">Interest-only</p></div>
        <div><label className="block text-sm font-medium mb-2">Management (%)</label><input type="number" min="0" max="20" value={mgmt} onChange={(e) => setMgmt(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Management (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Insurance (£/yr)</label><input type="number" min="0" value={ins} onChange={(e) => setIns(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Insurance (£/yr)" /></div>
        <div><label className="block text-sm font-medium mb-2">Maintenance (£/yr)</label><input type="number" min="0" value={maint} onChange={(e) => setMaint(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Maintenance (£/yr)" /></div>
        <div><label className="block text-sm font-medium mb-2">Void Weeks/Year</label><input type="number" min="0" max="12" value={voids} onChange={(e) => setVoids(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Void Weeks/Year" /></div>
        <div><label className="block text-sm font-medium mb-2">Purchase Fees (£)</label><input type="number" min="0" value={fees} onChange={(e) => setFees(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Purchase fees: legal, survey and broker (£)" /><p className="text-xs text-muted-foreground mt-1">Legal, survey, broker</p></div>
        <div className="col-span-2 sm:col-span-3 flex items-center"><label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={additional} onChange={(e) => setAdditional(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Additional property (5% Stamp Duty surcharge)</span></label></div>
      </div>

      {p > 0 && r > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Gross Yield</p><p className="text-xl font-bold text-primary">{formatPercent(result.grossYield)}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.netOperatingIncome > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Net Yield (before mortgage)</p><p className={`text-xl font-bold ${result.netOperatingIncome > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatPercent(result.netYield)}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.monthlyCashflow > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Monthly Cash Flow (after interest)</p><p className={`text-lg font-bold ${result.monthlyCashflow > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(result.monthlyCashflow)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Return on Cash Invested</p><p className="text-lg font-bold">{formatPercent(result.returnOnCash)}</p></div>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Annual Rent (after {v} void weeks)</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.annualRent)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Management ({mg}%)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.managementFee)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Insurance + Maintenance</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(insurance + maintenance)}</td></tr>
              <tr className="border-b border-border/50 font-semibold"><td className="py-2">Net Operating Income (net yield)</td><td className="text-right tabular-nums">{formatCurrency(result.netOperatingIncome)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Mortgage Interest ({formatCurrency(result.mortgage)} at {rt}%)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.annualMortgage)}</td></tr>
              <tr className={`font-semibold ${result.annualCashflow > 0 ? '' : 'text-destructive'}`}><td className="py-2">Annual Cash Flow Before Tax</td><td className="text-right tabular-nums">{formatCurrency(result.annualCashflow)}</td></tr>
            </tbody>
          </table>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Deposit ({dp}%)</td><td className="text-right tabular-nums">{formatCurrency(result.deposit)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Stamp Duty ({additional ? 'additional-property rates' : 'standard rates'})</td><td className="text-right tabular-nums">{formatCurrency(result.sdlt)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Purchase Fees</td><td className="text-right tabular-nums">{formatCurrency(f)}</td></tr>
              <tr className="font-semibold"><td className="py-2">Cash Invested</td><td className="text-right tabular-nums">{formatCurrency(result.cashInvested)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
            <p>Figures are before tax and leave out capital growth. Stamp Duty uses the England and Northern Ireland rates; Scotland (LBTT) and Wales (LTT) differ.</p>
            <p>For 2026/27, rental profit is taxed at 20%, 40% or 45% with a 20% credit for mortgage interest. From 6 April 2027 landlords outside Scotland will pay separate property rates of 22%, 42% and 47%, with the credit given at 22% (Budget 2025).</p>
          </div>
        </div>
      )}
    </div>
  )
}
