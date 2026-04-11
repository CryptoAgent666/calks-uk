import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(balance: number, term: number, rates: number[]) {
  return rates.map(rate => {
    const monthlyRate = rate / 100 / 12
    const payments = term * 12
    const monthly = monthlyRate > 0 ? balance * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1) : balance / payments
    const totalPaid = monthly * payments
    const totalInterest = totalPaid - balance
    return { rate, monthly, totalPaid, totalInterest }
  })
}

export default function MortgageInterestRateCalculator() {
  const [balance, setBalance] = useState('250000')
  const [term, setTerm] = useState('25')
  const b = parseFloat(balance.replace(/,/g,'')) || 0
  const t = parseInt(term) || 25
  const rates = [3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0]
  const results = useMemo(() => calculate(b, t, rates), [b, t])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Mortgage Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Term (years)</label><input type="number" min="5" max="40" value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>
      {b > 0 && (
        <div className="overflow-x-auto animate-fade-in-up">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Rate</th><th className="text-right py-2 font-medium text-muted-foreground">Monthly</th><th className="text-right py-2 font-medium text-muted-foreground">Total Interest</th><th className="text-right py-2 font-medium text-muted-foreground">Total Paid</th></tr></thead>
            <tbody>{results.map(r => (
              <tr key={r.rate} className="border-b border-border/50 hover:bg-accent/50"><td className="py-2.5 font-medium">{r.rate}%</td><td className="text-right tabular-nums">{formatCurrency(r.monthly)}</td><td className="text-right tabular-nums text-destructive">{formatCurrency(r.totalInterest)}</td><td className="text-right tabular-nums">{formatCurrency(r.totalPaid)}</td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
