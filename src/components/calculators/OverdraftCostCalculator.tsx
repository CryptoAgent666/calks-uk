import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(amount: number, apr: number, days: number) {
  const dailyRate = apr / 100 / 365
  const interest = amount * dailyRate * days
  const eac = amount * (apr / 100) // equivalent annual cost
  return { interest, dailyRate, eac, dailyCost: interest / days, monthlyCost: interest / days * 30.44 }
}

export default function OverdraftCostCalculator() {
  const [amount, setAmount] = useState('500')
  const [apr, setApr] = useState('39.9')
  const [days, setDays] = useState('30')

  const a = parseFloat(amount.replace(/,/g,'')) || 0
  const r = parseFloat(apr) || 0
  const d = parseInt(days) || 0
  const result = useMemo(() => calculate(a, r, d), [a, r, d])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Overdraft Amount</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">APR (%)</label><input type="number" min="0" max="80" step="0.1" value={apr} onChange={(e) => setApr(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /><p className="text-xs text-muted-foreground mt-1">Most UK banks: ~39.9% EAR</p></div>
        <div><label className="block text-sm font-medium mb-2">Number of Days</label><input type="number" min="1" max="365" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {a > 0 && d > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Interest for {d} days</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.interest)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.dailyCost)}/day &middot; ~{formatCurrency(result.monthlyCost)}/month</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>At {r}% APR, borrowing {formatCurrency(a)} for a full year costs {formatCurrency(result.eac)}.</p>
            <p className="mt-1">Since 2020, most UK banks charge a single simple interest rate on overdrafts (typically ~39.9% EAR).</p>
          </div>
        </div>
      )}
    </div>
  )
}
