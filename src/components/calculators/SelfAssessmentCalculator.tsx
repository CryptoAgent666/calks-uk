import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

const PA = 12_570
const BASIC_LIMIT = 50_270
const HIGHER_LIMIT = 125_140
const PA_TAPER = 100_000

// Class 2 NI
const CLASS2_RATE = 3.45 * 52 // £3.45/week
const CLASS2_THRESHOLD = 12_570

// Class 4 NI
const CLASS4_LOWER = 12_570
const CLASS4_UPPER = 50_270
const CLASS4_MAIN_RATE = 0.06 // 6%
const CLASS4_ADDITIONAL_RATE = 0.02 // 2%

function calculate(profit: number) {
  let pa = PA
  if (profit > PA_TAPER) pa = Math.max(0, PA - Math.floor((profit - PA_TAPER) / 2))

  // Income Tax
  let incomeTax = 0
  if (profit > pa) {
    if (profit <= BASIC_LIMIT) incomeTax = (profit - pa) * 0.20
    else if (profit <= HIGHER_LIMIT) incomeTax = (BASIC_LIMIT - pa) * 0.20 + (profit - BASIC_LIMIT) * 0.40
    else incomeTax = (BASIC_LIMIT - pa) * 0.20 + (HIGHER_LIMIT - BASIC_LIMIT) * 0.40 + (profit - HIGHER_LIMIT) * 0.45
  }

  // Class 2 NI
  const class2 = profit >= CLASS2_THRESHOLD ? CLASS2_RATE : 0

  // Class 4 NI
  let class4 = 0
  if (profit > CLASS4_LOWER) {
    if (profit <= CLASS4_UPPER) class4 = (profit - CLASS4_LOWER) * CLASS4_MAIN_RATE
    else class4 = (CLASS4_UPPER - CLASS4_LOWER) * CLASS4_MAIN_RATE + (profit - CLASS4_UPPER) * CLASS4_ADDITIONAL_RATE
  }

  const totalTax = incomeTax + class2 + class4
  return {
    profit, incomeTax, class2, class4, totalTax,
    takeHome: profit - totalTax,
    effectiveRate: profit > 0 ? (totalTax / profit) * 100 : 0,
  }
}

export default function SelfAssessmentCalculator() {
  const [profit, setProfit] = useState('')
  const val = parseFloat(profit.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(val), [val])

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="sa-profit" className="block text-sm font-medium mb-2">Annual Net Profit (self-employed income)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
          <input id="sa-profit" type="text" inputMode="numeric" value={profit} onChange={(e) => setProfit(e.target.value)} placeholder="40,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[20_000, 30_000, 50_000, 75_000, 100_000].map((a) => (
            <button key={a} onClick={() => setProfit(a.toLocaleString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">£{a / 1000}K</button>
          ))}
        </div>
      </div>

      {val > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Take-Home Pay</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.takeHome)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.takeHome / 12)}/month</p>
          </div>

          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Item</th><th className="text-right py-2 font-medium text-muted-foreground">Annual</th><th className="text-right py-2 font-medium text-muted-foreground">Monthly</th></tr></thead>
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2.5 font-medium">Net Profit</td><td className="text-right tabular-nums">{formatCurrency(result.profit)}</td><td className="text-right tabular-nums">{formatCurrency(result.profit / 12)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5 text-destructive">Income Tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.incomeTax)}</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.incomeTax / 12)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5 text-destructive">Class 2 NI</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.class2)}</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.class2 / 12)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5 text-destructive">Class 4 NI</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.class4)}</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.class4 / 12)}</td></tr>
              <tr className="font-semibold border-t border-border"><td className="py-2.5 text-primary">Take Home</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.takeHome)}</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.takeHome / 12)}</td></tr>
            </tbody>
          </table>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">Total Tax Bill</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(result.totalTax)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">Effective Rate</p>
              <p className="text-lg font-bold">{formatPercent(result.effectiveRate)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
