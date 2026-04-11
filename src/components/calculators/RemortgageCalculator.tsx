import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(balance: number, currentRate: number, newRate: number, remainingYears: number, ercPct: number, arrangementFee: number, valuationFee: number, legalFee: number) {
  const monthlyRateCurrent = currentRate / 100 / 12
  const monthlyRateNew = newRate / 100 / 12
  const payments = remainingYears * 12

  const calcMonthly = (bal: number, rate: number) => rate > 0 ? bal * (rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1) : bal / payments

  const currentMonthly = calcMonthly(balance, monthlyRateCurrent)
  const newMonthly = calcMonthly(balance, monthlyRateNew)
  const monthlySaving = currentMonthly - newMonthly
  const annualSaving = monthlySaving * 12

  const erc = balance * (ercPct / 100)
  const totalFees = erc + arrangementFee + valuationFee + legalFee
  const netSavingYear1 = annualSaving - totalFees
  const breakEvenMonths = monthlySaving > 0 ? Math.ceil(totalFees / monthlySaving) : 0

  const totalCurrentCost = currentMonthly * payments
  const totalNewCost = newMonthly * payments + totalFees

  return { currentMonthly, newMonthly, monthlySaving, annualSaving, erc, totalFees, netSavingYear1, breakEvenMonths, totalCurrentCost, totalNewCost, totalSaving: totalCurrentCost - totalNewCost }
}

export default function RemortgageCalculator() {
  const [balance, setBalance] = useState('200000')
  const [currentRate, setCurrentRate] = useState('5.5')
  const [newRate, setNewRate] = useState('4.2')
  const [years, setYears] = useState('20')
  const [erc, setErc] = useState('0')
  const [arrangement, setArrangement] = useState('999')
  const [valuation, setValuation] = useState('0')
  const [legal, setLegal] = useState('500')

  const b = parseFloat(balance.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(b, parseFloat(currentRate)||0, parseFloat(newRate)||0, parseInt(years)||20, parseFloat(erc)||0, parseFloat(arrangement)||0, parseFloat(valuation)||0, parseFloat(legal)||0), [b, currentRate, newRate, years, erc, arrangement, valuation, legal])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Mortgage Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Current Rate (%)</label><input type="number" min="0" max="15" step="0.1" value={currentRate} onChange={(e) => setCurrentRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">New Rate (%)</label><input type="number" min="0" max="15" step="0.1" value={newRate} onChange={(e) => setNewRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Remaining Term (yrs)</label><input type="number" min="1" max="40" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">ERC (%)</label><input type="number" min="0" max="5" step="0.5" value={erc} onChange={(e) => setErc(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Arrangement Fee</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={arrangement} onChange={(e) => setArrangement(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Legal Fee</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={legal} onChange={(e) => setLegal(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>

      {b > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Current Monthly</p><p className="text-lg font-bold">{formatCurrency(result.currentMonthly)}</p></div>
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">New Monthly</p><p className="text-lg font-bold text-primary">{formatCurrency(result.newMonthly)}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.monthlySaving > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Monthly Saving</p><p className={`text-lg font-bold ${result.monthlySaving > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(result.monthlySaving)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Break-Even</p><p className="text-lg font-bold">{result.breakEvenMonths} months</p></div>
          </div>
          {result.totalFees > 0 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Remortgage Costs</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.totalFees)}</p></div>
              <div className={`rounded-xl p-4 text-center ${result.totalSaving > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Total Saving (over term)</p><p className={`text-lg font-bold ${result.totalSaving > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(result.totalSaving)}</p></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
