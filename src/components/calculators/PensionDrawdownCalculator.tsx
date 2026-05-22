import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(pot: number, annualWithdrawal: number, growthRate: number, taxFreeLump: boolean) {
  const lumpSum = taxFreeLump ? pot * 0.25 : 0
  let remaining = pot - lumpSum
  const monthlyWithdrawal = annualWithdrawal / 12
  const monthlyGrowth = growthRate / 100 / 12
  let months = 0
  const schedule: { year: number; withdrawal: number; growth: number; balance: number }[] = []
  let yearlyWithdrawal = 0
  let yearlyGrowth = 0

  while (remaining > 0 && months < 600) {
    const growth = remaining * monthlyGrowth
    yearlyGrowth += growth
    remaining += growth
    const withdrawal = Math.min(monthlyWithdrawal, remaining)
    yearlyWithdrawal += withdrawal
    remaining -= withdrawal
    months++

    if (months % 12 === 0) {
      schedule.push({ year: months / 12, withdrawal: yearlyWithdrawal, growth: yearlyGrowth, balance: remaining })
      yearlyWithdrawal = 0
      yearlyGrowth = 0
    }
  }

  return { lumpSum, lastingYears: Math.floor(months / 12), lastingMonths: months % 12, schedule: schedule.slice(0, 30) }
}

export default function PensionDrawdownCalculator() {
  const [pot, setPot] = useState('250000')
  const [withdrawal, setWithdrawal] = useState('15000')
  const [growth, setGrowth] = useState('4')
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
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={lump} onChange={(e) => setLump(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Take 25% tax-free lump sum ({formatCurrency(p * 0.25)})</span></label>

      {p > 0 && w > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Your Pot Will Last</p>
            <p className="text-3xl font-bold text-primary mt-1">{result.lastingYears} years{result.lastingMonths > 0 ? ` ${result.lastingMonths} months` : ''}</p>
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
