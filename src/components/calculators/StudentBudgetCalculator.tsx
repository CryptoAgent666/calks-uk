import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const DEFAULT_INCOME = [
  { id: 'loan', label: 'Maintenance Loan', amount: 10544 }, // 2025/26 England, away from home
  { id: 'grant', label: 'Grant / Bursary', amount: 0 },
  { id: 'parents', label: 'Family Support', amount: 0 },
  { id: 'job', label: 'Part-Time Job', amount: 0 },
  { id: 'savings', label: 'Savings', amount: 0 },
]

const DEFAULT_EXPENSES = [
  { id: 'rent', label: 'Rent', amount: 550, period: 'monthly' as const },
  { id: 'food', label: 'Food & Groceries', amount: 160, period: 'monthly' as const },
  { id: 'bills', label: 'Bills (if not included)', amount: 50, period: 'monthly' as const },
  { id: 'transport', label: 'Transport', amount: 60, period: 'monthly' as const },
  { id: 'phone', label: 'Phone', amount: 20, period: 'monthly' as const },
  { id: 'social', label: 'Social / Going Out', amount: 80, period: 'monthly' as const },
  { id: 'clothes', label: 'Clothes', amount: 30, period: 'monthly' as const },
  { id: 'course', label: 'Course Materials', amount: 15, period: 'monthly' as const },
  { id: 'gym', label: 'Gym / Subscriptions', amount: 25, period: 'monthly' as const },
  { id: 'other', label: 'Other', amount: 0, period: 'monthly' as const },
]

export default function StudentBudgetCalculator() {
  const [income, setIncome] = useState(DEFAULT_INCOME.map(i => ({ ...i })))
  const [expenses, setExpenses] = useState(DEFAULT_EXPENSES.map(e => ({ ...e })))
  const [termWeeks, setTermWeeks] = useState('39')

  const tw = parseInt(termWeeks) || 39
  const termMonths = tw / 4.33

  const totalIncome = income.reduce((s, i) => s + i.amount, 0)
  const monthlyExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const annualExpenses = monthlyExpenses * termMonths
  const surplus = totalIncome - annualExpenses
  const weeklyBudget = surplus > 0 ? surplus / tw : 0

  const updateIncome = (idx: number, amount: number) => setIncome(prev => prev.map((i, j) => j === idx ? { ...i, amount } : i))
  const updateExpense = (idx: number, amount: number) => setExpenses(prev => prev.map((e, j) => j === idx ? { ...e, amount } : e))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold mb-3 text-green-700 dark:text-green-400">Annual Income</h3>
          <div className="space-y-2">
            {income.map((item, i) => (
              <div key={item.id} className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-32 shrink-0">{item.label}</span>
                <div className="relative flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">£</span>
                  <input type="number" min="0" value={item.amount || ''} onChange={(e) => updateIncome(i, parseFloat(e.target.value) || 0)} className="w-full rounded-lg border border-input bg-background px-7 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-border font-semibold text-sm">
              <span>Total Income</span><span className="text-green-700 dark:text-green-400">{formatCurrency(totalIncome)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 text-destructive">Monthly Expenses</h3>
          <div className="space-y-2">
            {expenses.map((item, i) => (
              <div key={item.id} className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-32 shrink-0">{item.label}</span>
                <div className="relative flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">£</span>
                  <input type="number" min="0" value={item.amount || ''} onChange={(e) => updateExpense(i, parseFloat(e.target.value) || 0)} className="w-full rounded-lg border border-input bg-background px-7 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-border font-semibold text-sm">
              <span>Monthly Total</span><span className="text-destructive">{formatCurrency(monthlyExpenses)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl p-6 text-center ${surplus >= 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
        <p className="text-sm text-muted-foreground">Annual {surplus >= 0 ? 'Surplus' : 'Shortfall'}</p>
        <p className={`text-3xl font-bold mt-1 ${surplus >= 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(Math.abs(surplus))}</p>
        <p className="text-sm text-muted-foreground mt-1">Weekly spending budget: {formatCurrency(Math.max(0, weeklyBudget))}</p>
      </div>
    </div>
  )
}
