import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const MAX_MONTHLY = 50
const BONUS_PCT = 0.50
const TERM_YEARS = 4

function calculate(monthly: number) {
  const effective = Math.min(monthly, MAX_MONTHLY)
  const totalSaved = effective * 12 * TERM_YEARS
  const bonus = totalSaved * BONUS_PCT
  const total = totalSaved + bonus
  return { monthly: effective, totalSaved, bonus, total, yearlyDeposit: effective * 12 }
}

export default function HelpToSaveCalculator() {
  const [monthly, setMonthly] = useState('50')
  const m = parseFloat(monthly) || 0
  const result = useMemo(() => calculate(m), [m])

  return (
    <div className="space-y-6">
      <div><label className="block text-sm font-medium mb-2">Monthly Deposit (max £50)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="1" max="50" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Deposit (max £50)" /></div></div>
      <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center animate-fade-in-up">
        <p className="text-sm text-muted-foreground">After 4 Years</p>
        <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.total)}</p>
        <p className="text-sm text-muted-foreground mt-1">You save {formatCurrency(result.totalSaved)} + 50% govt bonus {formatCurrency(result.bonus)}</p>
      </div>
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>Help to Save: 50% government bonus on savings up to £50/month for 4 years. From April 2025 it is open to any working Universal Credit claimant earning at least the equivalent of 16 hours/week at the National Living Wage (the older Working Tax Credit route closed with the migration to UC). Max bonus: £1,200.</p>
      </div>
    </div>
  )
}
