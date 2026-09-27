import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// UK overdraft rates are quoted as an EAR, which already includes the effect of
// interest being charged monthly. The cost over d days is therefore
// amount × ((1 + EAR)^(d/365) − 1). Treating the EAR as a simple rate
// (EAR ÷ 365 × days) overstates a 30-day cost by about 17%.
function calculate(amount: number, ear: number, days: number) {
  const r = ear / 100
  const growth = (d: number) => Math.pow(1 + r, d / 365) - 1
  const dailyRate = growth(1)
  const interest = days > 0 ? amount * growth(days) : 0
  const eac = amount * r // a full year at the EAR
  return { interest, dailyRate, eac, dailyCost: amount * dailyRate, monthlyCost: amount * growth(365 / 12) }
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
        <div><label className="block text-sm font-medium mb-2">Overdraft Amount</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Overdraft Amount" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Overdraft Rate, EAR (%)</label><input type="number" min="0" max="80" step="0.1" value={apr} onChange={(e) => setApr(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Overdraft rate, EAR (%)" /><p className="text-xs text-muted-foreground mt-1">Many UK banks: 39.9% EAR</p></div>
        <div><label className="block text-sm font-medium mb-2">Number of Days</label><input type="number" min="1" max="365" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number of Days" /></div>
      </div>

      {a > 0 && d > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Interest for {d} days</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.interest)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.dailyCost)}/day &middot; ~{formatCurrency(result.monthlyCost)}/month</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>At {r}% EAR, borrowing {formatCurrency(a)} for a full year costs {formatCurrency(result.eac)}. Daily rate: {(result.dailyRate * 100).toFixed(4)}%.</p>
            <p className="mt-1">Since April 2020, UK banks charge a single annual interest rate on overdrafts, quoted as an EAR that includes monthly compounding. Deduct any interest-free buffer from the amount first.</p>
          </div>
        </div>
      )}
    </div>
  )
}
