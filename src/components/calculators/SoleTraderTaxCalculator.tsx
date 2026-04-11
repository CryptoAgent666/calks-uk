import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

const PA = 12_570
const BASIC_LIMIT = 50_270
const HIGHER_LIMIT = 125_140

function calculate(revenue: number, expenses: number) {
  const profit = Math.max(0, revenue - expenses)
  let pa = PA
  if (profit > 100_000) pa = Math.max(0, PA - Math.floor((profit - 100_000) / 2))

  // Income Tax
  let incomeTax = 0
  if (profit > pa) {
    if (profit <= BASIC_LIMIT) incomeTax = (profit - pa) * 0.20
    else if (profit <= HIGHER_LIMIT) incomeTax = (BASIC_LIMIT - pa) * 0.20 + (profit - BASIC_LIMIT) * 0.40
    else incomeTax = (BASIC_LIMIT - pa) * 0.20 + (HIGHER_LIMIT - BASIC_LIMIT) * 0.40 + (profit - HIGHER_LIMIT) * 0.45
  }

  // Class 2 NI: £3.45/week if profit >= £12,570
  const class2 = profit >= 12_570 ? 3.45 * 52 : 0

  // Class 4 NI
  let class4 = 0
  if (profit > 12_570) {
    if (profit <= 50_270) class4 = (profit - 12_570) * 0.06
    else class4 = (50_270 - 12_570) * 0.06 + (profit - 50_270) * 0.02
  }

  const totalTax = incomeTax + class2 + class4
  const takeHome = profit - totalTax

  return { revenue, expenses, profit, incomeTax, class2, class4, totalTax, takeHome, effectiveRate: profit > 0 ? (totalTax / profit) * 100 : 0 }
}

export default function SoleTraderTaxCalculator() {
  const [revenue, setRevenue] = useState('')
  const [expenses, setExpenses] = useState('')

  const r = parseFloat(revenue.replace(/,/g, '')) || 0
  const e = parseFloat(expenses.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(r, e), [r, e])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Total Revenue / Turnover</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={revenue} onChange={(ev) => setRevenue(ev.target.value)} placeholder="60,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Allowable Expenses</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={expenses} onChange={(ev) => setExpenses(ev.target.value)} placeholder="10,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
      </div>

      {r > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Take-Home Pay</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.takeHome)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.takeHome / 12)}/month &middot; Effective rate: {formatPercent(result.effectiveRate)}</p>
          </div>

          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2.5">Revenue</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.revenue)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5">Expenses</td><td className="text-right tabular-nums">-{formatCurrency(result.expenses)}</td></tr>
              <tr className="border-b border-border font-medium"><td className="py-2.5">Taxable Profit</td><td className="text-right tabular-nums">{formatCurrency(result.profit)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5 text-destructive">Income Tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.incomeTax)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5 text-destructive">Class 2 NI</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.class2)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5 text-destructive">Class 4 NI</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.class4)}</td></tr>
              <tr className="font-semibold"><td className="py-2.5 text-primary">Take Home</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.takeHome)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
