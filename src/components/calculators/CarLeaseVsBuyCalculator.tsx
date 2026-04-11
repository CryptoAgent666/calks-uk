import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(carPrice: number, leaseMonthly: number, leaseTerm: number, leaseDeposit: number, buyDeposit: number, financeRate: number, financeTerm: number, depreciationPct: number) {
  // LEASE total cost
  const leaseTotal = leaseDeposit + leaseMonthly * leaseTerm
  const leaseMonthlyEff = leaseTotal / leaseTerm

  // BUY total cost
  const financeAmount = carPrice - buyDeposit
  const monthlyRate = financeRate / 100 / 12
  const buyMonthly = monthlyRate > 0 ? financeAmount * (monthlyRate * Math.pow(1 + monthlyRate, financeTerm)) / (Math.pow(1 + monthlyRate, financeTerm) - 1) : financeAmount / financeTerm
  const buyTotalPaid = buyDeposit + buyMonthly * financeTerm
  const buyInterest = buyTotalPaid - carPrice

  // Residual value after lease term equivalent
  const yearsOwned = leaseTerm / 12
  const residualValue = carPrice * Math.pow(1 - depreciationPct / 100, yearsOwned)
  const buyNetCost = buyTotalPaid - residualValue
  const buyMonthlyEff = buyNetCost / leaseTerm

  const leaseBetter = leaseTotal < buyNetCost

  return { leaseTotal, leaseMonthlyEff, buyTotalPaid, buyInterest, residualValue, buyNetCost, buyMonthlyEff, buyMonthly, leaseBetter, difference: Math.abs(leaseTotal - buyNetCost) }
}

export default function CarLeaseVsBuyCalculator() {
  const [price, setPrice] = useState('25000')
  const [leaseM, setLeaseM] = useState('280')
  const [leaseT, setLeaseT] = useState('36')
  const [leaseDep, setLeaseDep] = useState('1500')
  const [buyDep, setBuyDep] = useState('5000')
  const [rate, setRate] = useState('7.9')
  const [finTerm, setFinTerm] = useState('48')
  const [dep, setDep] = useState('15')

  const p = parseFloat(price.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(p, parseFloat(leaseM)||0, parseInt(leaseT)||36, parseFloat(leaseDep.replace(/,/g,''))||0, parseFloat(buyDep.replace(/,/g,''))||0, parseFloat(rate)||0, parseInt(finTerm)||48, parseFloat(dep)||15), [p, leaseM, leaseT, leaseDep, buyDep, rate, finTerm, dep])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-4"><label className="block text-sm font-medium mb-2">Car Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div className="sm:col-span-4 border-t border-border pt-4"><p className="text-sm font-semibold">Lease Option</p></div>
        <div><label className="block text-sm font-medium mb-2">Monthly</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={leaseM} onChange={(e) => setLeaseM(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Term (months)</label><input type="number" min="12" max="48" value={leaseT} onChange={(e) => setLeaseT(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Initial Payment</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={leaseDep} onChange={(e) => setLeaseDep(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div className="sm:col-span-4 border-t border-border pt-4"><p className="text-sm font-semibold">Buy Option (Finance)</p></div>
        <div><label className="block text-sm font-medium mb-2">Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={buyDep} onChange={(e) => setBuyDep(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">APR (%)</label><input type="number" min="0" max="20" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Depreciation (%/yr)</label><input type="number" min="5" max="30" value={dep} onChange={(e) => setDep(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-2xl p-5 text-center ${result.leaseBetter ? 'bg-green-100 dark:bg-green-950 border-2 border-green-300 dark:border-green-800' : 'border border-border'}`}>
              <p className="text-sm font-medium">Lease</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(result.leaseTotal)}</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(result.leaseMonthlyEff)}/month effective</p>
              {result.leaseBetter && <span className="inline-block mt-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Cheaper</span>}
            </div>
            <div className={`rounded-2xl p-5 text-center ${!result.leaseBetter ? 'bg-green-100 dark:bg-green-950 border-2 border-green-300 dark:border-green-800' : 'border border-border'}`}>
              <p className="text-sm font-medium">Buy (net of resale)</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(result.buyNetCost)}</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(result.buyMonthlyEff)}/month effective</p>
              {!result.leaseBetter && <span className="inline-block mt-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Cheaper</span>}
            </div>
          </div>
          <div className="rounded-xl bg-primary/10 p-4 text-center text-sm">
            {result.leaseBetter ? 'Leasing' : 'Buying'} saves you <span className="font-bold text-primary">{formatCurrency(result.difference)}</span> over {leaseT} months
          </div>
        </div>
      )}
    </div>
  )
}
