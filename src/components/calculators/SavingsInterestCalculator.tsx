import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(principal: number, rate: number, compounding: string, years: number) {
  const n = compounding === 'daily' ? 365 : compounding === 'monthly' ? 12 : compounding === 'quarterly' ? 4 : 1
  const finalBalance = principal * Math.pow(1 + rate / 100 / n, n * years)
  const totalInterest = finalBalance - principal
  const aer = (Math.pow(1 + rate / 100 / n, n) - 1) * 100

  return { finalBalance, totalInterest, aer }
}

export default function SavingsInterestCalculator() {
  const [principal, setPrincipal] = useState('10000')
  const [rate, setRate] = useState('4.5')
  const [compound, setCompound] = useState('monthly')
  const [years, setYears] = useState('3')

  const p = parseFloat(principal.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 0
  const y = parseInt(years) || 0
  const result = useMemo(() => calculate(p, r, compound, y), [p, r, compound, y])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Deposit" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Interest Rate (%)</label><input type="number" min="0" max="10" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Interest Rate (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Compounding</label><select value={compound} onChange={(e) => setCompound(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Compounding"><option value="daily">Daily</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="annual">Annual</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Years</label><input type="number" min="1" max="30" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years" /></div>
      </div>
      {p > 0 && (
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Final Balance</p><p className="text-xl font-bold text-primary">{formatCurrency(result.finalBalance)}</p></div>
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Interest Earned</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalInterest)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">AER</p><p className="text-xl font-bold">{result.aer.toFixed(2)}%</p></div>
        </div>
      )}
    </div>
  )
}
