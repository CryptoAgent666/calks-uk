import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(balance: number, rate: number, remainingYears: number, ercPct: number, ercYearsLeft: number) {
  const monthlyRate = rate / 100 / 12
  const payments = remainingYears * 12
  const monthly = monthlyRate > 0 ? balance * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1) : balance / payments
  const totalRemaining = monthly * payments
  const totalInterest = totalRemaining - balance
  const erc = ercYearsLeft > 0 ? balance * (ercPct / 100) : 0
  const totalToPayOff = balance + erc
  const saving = totalRemaining - totalToPayOff
  const worthIt = saving > erc

  return { monthly, totalRemaining, totalInterest, erc, totalToPayOff, saving, worthIt }
}

export default function MortgageEarlyRepaymentCalculator() {
  const [balance, setBalance] = useState('180000')
  const [rate, setRate] = useState('4.5')
  const [years, setYears] = useState('20')
  const [ercPct, setErcPct] = useState('2')
  const [ercYears, setErcYears] = useState('1')

  const b = parseFloat(balance.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 0
  const y = parseInt(years) || 0
  const ep = parseFloat(ercPct) || 0
  const ey = parseInt(ercYears) || 0
  const result = useMemo(() => calculate(b, r, y, ep, ey), [b, r, y, ep, ey])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Outstanding Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Interest Rate (%)</label><input type="number" min="0" max="10" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Remaining Term (years)</label><input type="number" min="1" max="35" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">ERC Rate (%)</label><input type="number" min="0" max="5" step="0.5" value={ercPct} onChange={(e) => setErcPct(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">ERC Years Left</label><input type="number" min="0" max="5" value={ercYears} onChange={(e) => setErcYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {b > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.worthIt ? 'bg-green-100 dark:bg-green-950' : 'bg-orange-100 dark:bg-orange-950'}`}>
            <p className="text-sm text-muted-foreground">{result.worthIt ? 'Paying off early saves money!' : result.erc > 0 ? 'ERC may make early repayment uneconomical' : 'Consider overpaying instead'}</p>
            <p className={`text-3xl font-bold mt-1 ${result.worthIt ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'}`}>{result.saving > 0 ? `Save ${formatCurrency(result.saving)}` : 'No saving'}</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Balance to repay</td><td className="text-right tabular-nums">{formatCurrency(b)}</td></tr>
              {result.erc > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Early Repayment Charge ({ercPct}%)</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.erc)}</td></tr>}
              <tr className="border-b border-border/50 font-medium"><td className="py-2">Total to pay off now</td><td className="text-right tabular-nums">{formatCurrency(result.totalToPayOff)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">vs keep paying ({y} years)</td><td className="text-right tabular-nums">{formatCurrency(result.totalRemaining)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-muted-foreground">Total interest remaining</td><td className="text-right tabular-nums text-muted-foreground">{formatCurrency(result.totalInterest)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
