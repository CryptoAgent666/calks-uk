import { useState } from 'react'
import { formatCurrency } from '@/utils'

const DEFAULT_INCOME = [
  { id: 'loan', label: 'Maintenance Loan', amount: 10830 }, // 2026/27 England, away from home outside London (maximum)
  { id: 'grant', label: 'Grant / Bursary', amount: 0 },
  { id: 'parents', label: 'Family Support', amount: 0 },
  { id: 'job', label: 'Part-Time Job', amount: 0 },
  { id: 'savings', label: 'Savings', amount: 0 },
]

const DEFAULT_EXPENSES = [
  { id: 'rent', label: 'Rent', amount: 550 },
  { id: 'food', label: 'Food & Groceries', amount: 160 },
  { id: 'bills', label: 'Bills (if not included)', amount: 50 },
  { id: 'transport', label: 'Transport', amount: 60 },
  { id: 'phone', label: 'Phone', amount: 20 },
  { id: 'social', label: 'Social / Going Out', amount: 80 },
  { id: 'clothes', label: 'Clothes', amount: 30 },
  { id: 'course', label: 'Course Materials', amount: 15 },
  { id: 'gym', label: 'Gym / Subscriptions', amount: 25 },
  { id: 'other', label: 'Other', amount: 0 },
]

const NLW_21_PLUS = 12.71 // National Living Wage (21 and over) from April 2026
const NMW_18_20 = 10.85 // National Minimum Wage (18 to 20) from April 2026
const NI_WEEKLY_PT = 242 // Employee NI primary threshold, weekly (8% above it)
const WEEKS_PER_MONTH = 52 / 12

const DEFAULT_RENT_WEEKS = 51
const DEFAULT_TERM_WEEKS = 39

// Whole number of weeks in [min, 52]; a blank or non-numeric entry falls back to the default
function clampWeeks(raw: string, min: number, fallback: number) {
  const n = parseInt(raw, 10)
  return Number.isFinite(n) ? Math.min(52, Math.max(min, n)) : fallback
}

function calculate(totalIncome: number, monthlyRent: number, monthlyOther: number, rentWeeks: number, termWeeks: number) {
  // Monthly amounts become weekly at 12 months / 52 weeks, then run for the weeks each cost is actually paid
  const rentCost = (monthlyRent / WEEKS_PER_MONTH) * rentWeeks
  const otherCost = (monthlyOther / WEEKS_PER_MONTH) * termWeeks
  const annualExpenses = rentCost + otherCost
  const surplus = totalIncome - annualExpenses
  const weeklyBudget = surplus > 0 ? surplus / termWeeks : 0
  // Part-time earnings needed in term to close a shortfall
  const shortfall = surplus < 0 ? -surplus : 0
  const weeklyEarningsNeeded = shortfall / termWeeks
  return {
    rentCost, otherCost, annualExpenses, surplus, weeklyBudget, shortfall, weeklyEarningsNeeded,
    hours21: weeklyEarningsNeeded / NLW_21_PLUS,
    hours18: weeklyEarningsNeeded / NMW_18_20,
  }
}

export default function StudentBudgetCalculator() {
  const [income, setIncome] = useState(DEFAULT_INCOME.map(i => ({ ...i })))
  const [expenses, setExpenses] = useState(DEFAULT_EXPENSES.map(e => ({ ...e })))
  const [rentWeeksInput, setRentWeeksInput] = useState(String(DEFAULT_RENT_WEEKS))
  const [termWeeksInput, setTermWeeksInput] = useState(String(DEFAULT_TERM_WEEKS))

  const rentWeeks = clampWeeks(rentWeeksInput, 0, DEFAULT_RENT_WEEKS)
  const termWeeks = clampWeeks(termWeeksInput, 1, DEFAULT_TERM_WEEKS)
  const rentWeeksAdjusted = rentWeeksInput.trim() !== '' && parseInt(rentWeeksInput, 10) !== rentWeeks
  const termWeeksAdjusted = termWeeksInput.trim() !== '' && parseInt(termWeeksInput, 10) !== termWeeks

  const totalIncome = income.reduce((s, i) => s + i.amount, 0)
  const monthlyRent = expenses.find(e => e.id === 'rent')?.amount ?? 0
  const monthlyExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const monthlyOther = monthlyExpenses - monthlyRent
  const { rentCost, otherCost, annualExpenses, surplus, weeklyBudget, shortfall, weeklyEarningsNeeded, hours21, hours18 } =
    calculate(totalIncome, monthlyRent, monthlyOther, rentWeeks, termWeeks)

  // Amounts cannot go below zero
  const toAmount = (v: string) => Math.max(0, parseFloat(v) || 0)
  const updateIncome = (idx: number, amount: number) => setIncome(prev => prev.map((i, j) => j === idx ? { ...i, amount } : i))
  const updateExpense = (idx: number, amount: number) => setExpenses(prev => prev.map((e, j) => j === idx ? { ...e, amount } : e))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold mb-3 text-green-700 dark:text-green-400">Income for the academic year</h3>
          <div className="space-y-2">
            {income.map((item, i) => (
              <div key={item.id} className="flex items-center gap-2">
                <label htmlFor={`sb-in-${item.id}`} className="text-sm text-muted-foreground w-32 shrink-0">{item.label}</label>
                <div className="relative flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">£</span>
                  <input id={`sb-in-${item.id}`} type="number" min="0" value={item.amount || ''} onChange={(e) => updateIncome(i, toAmount(e.target.value))} className="w-full rounded-lg border border-input bg-background px-7 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-border font-semibold text-sm">
              <span>Total income</span><span className="text-green-700 dark:text-green-400">{formatCurrency(totalIncome)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 text-destructive">Monthly costs</h3>
          <div className="space-y-2">
            {expenses.map((item, i) => (
              <div key={item.id} className="flex items-center gap-2">
                <label htmlFor={`sb-ex-${item.id}`} className="text-sm text-muted-foreground w-32 shrink-0">{item.label}</label>
                <div className="relative flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">£</span>
                  <input id={`sb-ex-${item.id}`} type="number" min="0" value={item.amount || ''} onChange={(e) => updateExpense(i, toAmount(e.target.value))} className="w-full rounded-lg border border-input bg-background px-7 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-border font-semibold text-sm">
              <span>Monthly total</span><span className="text-destructive">{formatCurrency(monthlyExpenses)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sb-rent-weeks" className="block text-sm font-medium mb-1">Rent paid for (weeks)</label>
          <input id="sb-rent-weeks" type="number" inputMode="numeric" min={0} max={52} step={1} value={rentWeeksInput} onChange={(e) => setRentWeeksInput(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          <p className="text-xs text-muted-foreground mt-1">{rentWeeksAdjusted ? `Using ${rentWeeks} weeks (0 to 52). ` : ''}The length of your tenancy: halls contracts often run 40 to 51 weeks, private lets usually 52.</p>
        </div>
        <div>
          <label htmlFor="sb-term-weeks" className="block text-sm font-medium mb-1">Weeks at university (all other costs)</label>
          <input id="sb-term-weeks" type="number" inputMode="numeric" min={1} max={52} step={1} value={termWeeksInput} onChange={(e) => setTermWeeksInput(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          <p className="text-xs text-muted-foreground mt-1">{termWeeksAdjusted ? `Using ${termWeeks} weeks (1 to 52). ` : ''}Food, bills and other costs are counted for these weeks. Use 52 if you stay all year.</p>
        </div>
      </div>

      <div className={`rounded-2xl p-6 text-center ${surplus >= 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`} aria-live="polite">
        <p className="text-sm text-muted-foreground">{surplus >= 0 ? 'Surplus' : 'Shortfall'} for the year</p>
        <p className={`text-3xl font-bold mt-1 ${surplus >= 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(Math.abs(surplus))}</p>
        <p className="text-sm text-muted-foreground mt-1">Left over per week at university: {formatCurrency(Math.max(0, weeklyBudget))}</p>
        {shortfall > 0 && <p className="text-sm text-muted-foreground mt-1">To close the gap from part-time work: {formatCurrency(weeklyEarningsNeeded)} a week over {termWeeks} weeks, about {hours21.toFixed(1)} hours a week at the £{NLW_21_PLUS.toFixed(2)} National Living Wage (21 and over) or {hours18.toFixed(1)} hours at the £{NMW_18_20.toFixed(2)} rate for 18 to 20 year olds. These are gross pay; employee National Insurance of 8% applies to pay above £{NI_WEEKLY_PT} a week.</p>}
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="p-3">Rent: {formatCurrency(monthlyRent)} a month for {rentWeeks} weeks</td><td className="p-3 text-right tabular-nums font-medium">{formatCurrency(rentCost)}</td></tr>
            <tr className="border-b border-border/50"><td className="p-3">Other costs: {formatCurrency(monthlyOther)} a month for {termWeeks} weeks</td><td className="p-3 text-right tabular-nums font-medium">{formatCurrency(otherCost)}</td></tr>
            <tr className="bg-muted/30"><td className="p-3 font-semibold">Total costs for the year</td><td className="p-3 text-right tabular-nums font-bold">{formatCurrency(annualExpenses)}</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">Monthly amounts are turned into weekly ones at 12 months to 52 weeks, so 52 weeks is exactly 12 months of rent.</p>
    </div>
  )
}
