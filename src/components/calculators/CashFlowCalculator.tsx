import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(openingBalance: number, months: { income: number; expenses: number }[]) {
  let balance = openingBalance
  const schedule: { month: number; income: number; expenses: number; net: number; balance: number }[] = []
  let lowestBalance = openingBalance
  let lowestMonth = 0

  months.forEach((m, i) => {
    const net = m.income - m.expenses
    balance += net
    if (balance < lowestBalance) { lowestBalance = balance; lowestMonth = i + 1 }
    schedule.push({ month: i + 1, income: m.income, expenses: m.expenses, net, balance })
  })

  const totalIncome = months.reduce((s, m) => s + m.income, 0)
  const totalExpenses = months.reduce((s, m) => s + m.expenses, 0)

  return { schedule, closingBalance: balance, lowestBalance, lowestMonth, totalIncome, totalExpenses }
}

export default function CashFlowCalculator() {
  const [opening, setOpening] = useState('5000')
  const [monthlyIncome, setMonthlyIncome] = useState('8000')
  const [monthlyExpenses, setMonthlyExpenses] = useState('7000')
  const [numMonths, setNumMonths] = useState('12')

  const o = parseFloat(opening.replace(/,/g,'')) || 0
  const mi = parseFloat(monthlyIncome.replace(/,/g,'')) || 0
  const me = parseFloat(monthlyExpenses.replace(/,/g,'')) || 0
  const nm = parseInt(numMonths) || 12

  const months = Array(nm).fill(null).map(() => ({ income: mi, expenses: me }))
  const result = useMemo(() => calculate(o, months), [o, mi, me, nm])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Opening Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={opening} onChange={(e) => setOpening(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Monthly Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Monthly Expenses</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Months</label><input type="number" min="1" max="24" value={numMonths} onChange={(e) => setNumMonths(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className={`rounded-xl p-4 text-center ${result.closingBalance >= 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Closing Balance</p><p className={`text-xl font-bold ${result.closingBalance >= 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(result.closingBalance)}</p></div>
          <div className={`rounded-xl p-4 text-center ${result.lowestBalance >= 0 ? 'bg-muted/50' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Lowest Balance</p><p className={`text-lg font-bold ${result.lowestBalance < 0 ? 'text-destructive' : ''}`}>{formatCurrency(result.lowestBalance)}</p><p className="text-xs text-muted-foreground">Month {result.lowestMonth}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Income</p><p className="text-lg font-bold">{formatCurrency(result.totalIncome)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Expenses</p><p className="text-lg font-bold">{formatCurrency(result.totalExpenses)}</p></div>
        </div>
        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background"><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Month</th><th className="text-right py-2 font-medium text-muted-foreground">In</th><th className="text-right py-2 font-medium text-muted-foreground">Out</th><th className="text-right py-2 font-medium text-muted-foreground">Net</th><th className="text-right py-2 font-medium text-muted-foreground">Balance</th></tr></thead>
            <tbody>
              <tr className="border-b border-border/50"><td className="py-1.5">Opening</td><td></td><td></td><td></td><td className="text-right tabular-nums font-medium">{formatCurrency(o)}</td></tr>
              {result.schedule.map(r => (
                <tr key={r.month} className="border-b border-border/50"><td className="py-1.5">{r.month}</td><td className="text-right tabular-nums text-green-600">{formatCurrency(r.income)}</td><td className="text-right tabular-nums text-destructive">{formatCurrency(r.expenses)}</td><td className={`text-right tabular-nums ${r.net >= 0 ? 'text-green-600' : 'text-destructive'}`}>{formatCurrency(r.net)}</td><td className={`text-right tabular-nums font-medium ${r.balance < 0 ? 'text-destructive' : ''}`}>{formatCurrency(r.balance)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
