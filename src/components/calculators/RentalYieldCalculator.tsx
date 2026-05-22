import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

function calculate(propertyValue: number, monthlyRent: number, monthlyExpenses: number) {
  const annualRent = monthlyRent * 12
  const annualExpenses = monthlyExpenses * 12
  const grossYield = propertyValue > 0 ? (annualRent / propertyValue) * 100 : 0
  const netYield = propertyValue > 0 ? ((annualRent - annualExpenses) / propertyValue) * 100 : 0
  const annualProfit = annualRent - annualExpenses

  return { annualRent, annualExpenses, annualProfit, grossYield, netYield }
}

export default function RentalYieldCalculator() {
  const [value, setValue] = useState('')
  const [rent, setRent] = useState('')
  const [expenses, setExpenses] = useState('200')

  const v = parseFloat(value.replace(/,/g, '')) || 0
  const r = parseFloat(rent.replace(/,/g, '')) || 0
  const e = parseFloat(expenses.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(v, r, e), [v, r, e])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Property Value</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} placeholder="250,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Property Value" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Monthly Rent</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} placeholder="1,200" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Rent" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Monthly Expenses</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={expenses} onChange={(e) => setExpenses(e.target.value)} placeholder="200" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Expenses" /></div>
        </div>
      </div>

      {v > 0 && r > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">Gross Yield</p>
              <p className="text-3xl font-bold text-primary">{formatPercent(result.grossYield)}</p>
            </div>
            <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
              <p className="text-sm text-muted-foreground">Net Yield</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">{formatPercent(result.netYield)}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Rent</p><p className="text-lg font-bold">{formatCurrency(result.annualRent)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Expenses</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.annualExpenses)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Profit</p><p className="text-lg font-bold text-green-600">{formatCurrency(result.annualProfit)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
