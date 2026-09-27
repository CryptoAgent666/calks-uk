import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const LUMP_SUM_ALLOWANCE = 268_275 // cap on tax-free cash across all pensions
const MAX_MONTHS = 600 // project up to 50 years

function taxFreeLumpSum(pot: number) {
  return Math.min(pot * 0.25, LUMP_SUM_ALLOWANCE)
}

function calculate(pot: number, annualWithdrawal: number, growthRate: number, taxFreeLump: boolean) {
  const lumpSum = taxFreeLump ? taxFreeLumpSum(pot) : 0
  let remaining = pot - lumpSum
  const drawdownFund = remaining
  const monthlyWithdrawal = annualWithdrawal / 12
  const monthlyGrowth = growthRate / 100 / 12
  // Growth on the starting fund covers every withdrawal, so the pot never falls
  const sustainable = drawdownFund > 0 && drawdownFund * monthlyGrowth >= monthlyWithdrawal
  let months = 0
  const schedule: { year: number; withdrawal: number; growth: number; balance: number }[] = []
  let yearlyWithdrawal = 0
  let yearlyGrowth = 0

  while (remaining > 0 && months < MAX_MONTHS) {
    const growth = remaining * monthlyGrowth
    yearlyGrowth += growth
    remaining += growth
    const withdrawal = Math.min(monthlyWithdrawal, remaining)
    yearlyWithdrawal += withdrawal
    remaining -= withdrawal
    months++

    // Close the year at each 12th month, and also for the final part-year in
    // which the pot runs out, so the table adds up to the whole projection
    if (months % 12 === 0 || remaining <= 0) {
      schedule.push({ year: Math.ceil(months / 12), withdrawal: yearlyWithdrawal, growth: yearlyGrowth, balance: Math.max(remaining, 0) })
      yearlyWithdrawal = 0
      yearlyGrowth = 0
    }
  }

  const runsOut = remaining <= 0
  return { lumpSum, drawdownFund, runsOut, sustainable, lastingYears: Math.floor(months / 12), lastingMonths: months % 12, schedule }
}

export default function PensionDrawdownCalculator() {
  const [pot, setPot] = useState('300000')
  const [withdrawal, setWithdrawal] = useState('15000')
  const [growth, setGrowth] = useState('4.5')
  const [lump, setLump] = useState(true)

  const p = parseFloat(pot.replace(/,/g,'')) || 0
  const w = parseFloat(withdrawal.replace(/,/g,'')) || 0
  const g = parseFloat(growth) || 0
  const result = useMemo(() => calculate(p, w, g, lump), [p, w, g, lump])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Pension Pot</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={pot} onChange={(e) => setPot(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Pension Pot" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Annual Withdrawal</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={withdrawal} onChange={(e) => setWithdrawal(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Withdrawal" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Growth Rate (%)</label><input type="number" min="0" max="10" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Growth Rate (%)" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={lump} onChange={(e) => setLump(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Take 25% tax-free lump sum ({formatCurrency(taxFreeLumpSum(p))}{p * 0.25 > LUMP_SUM_ALLOWANCE ? ', capped at the £268,275 Lump Sum Allowance' : ''})</span></label>

      {p > 0 && w > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Your Pot Will Last</p>
            <p className="text-3xl font-bold text-primary mt-1">
              {result.runsOut
                ? `${result.lastingYears} years${result.lastingMonths > 0 ? ` ${result.lastingMonths} month${result.lastingMonths === 1 ? '' : 's'}` : ''}`
                : result.sustainable ? 'Does not run out' : `${MAX_MONTHS / 12}+ years`}
            </p>
            {!result.runsOut && (
              <p className="text-sm text-muted-foreground mt-1">
                {result.sustainable
                  ? 'Growth covers your withdrawals, so the pot is not drawn down'
                  : `Still ${formatCurrency(result.schedule[result.schedule.length - 1]?.balance ?? 0)} left after ${MAX_MONTHS / 12} years`}
              </p>
            )}
            {lump && <p className="text-sm text-muted-foreground mt-1">After {formatCurrency(result.lumpSum)} tax-free lump sum</p>}
          </div>
          {result.schedule.length > 0 && (
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background"><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Year</th><th className="text-right py-2 font-medium text-muted-foreground">Withdrawn</th><th className="text-right py-2 font-medium text-muted-foreground">Growth</th><th className="text-right py-2 font-medium text-muted-foreground">Balance</th></tr></thead>
                <tbody>{result.schedule.map(r => (
                  <tr key={r.year} className="border-b border-border/50"><td className="py-1.5">{r.year}</td><td className="text-right tabular-nums text-destructive">{formatCurrency(r.withdrawal)}</td><td className="text-right tabular-nums text-green-600">{formatCurrency(r.growth)}</td><td className="text-right tabular-nums font-medium">{formatCurrency(r.balance)}</td></tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
