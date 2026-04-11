import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(monthlyInvestment: number, returnRate: number, delayYears: number, totalYears: number) {
  const monthlyReturn = returnRate / 100 / 12

  // Start now
  let balanceNow = 0
  for (let m = 0; m < totalYears * 12; m++) {
    balanceNow = balanceNow * (1 + monthlyReturn) + monthlyInvestment
  }

  // Start after delay
  let balanceDelayed = 0
  const investingYears = totalYears - delayYears
  for (let m = 0; m < investingYears * 12; m++) {
    balanceDelayed = balanceDelayed * (1 + monthlyReturn) + monthlyInvestment
  }

  const costOfDelay = balanceNow - balanceDelayed
  const totalInvestedNow = monthlyInvestment * totalYears * 12
  const totalInvestedDelayed = monthlyInvestment * investingYears * 12
  const extraContributions = totalInvestedNow - totalInvestedDelayed
  const lostGrowth = costOfDelay - extraContributions

  return { balanceNow, balanceDelayed, costOfDelay, totalInvestedNow, totalInvestedDelayed, extraContributions, lostGrowth }
}

export default function CostOfDelayCalculator() {
  const [monthly, setMonthly] = useState('300')
  const [returnRate, setReturnRate] = useState('7')
  const [delay, setDelay] = useState('5')
  const [total, setTotal] = useState('30')

  const m = parseFloat(monthly.replace(/,/g,'')) || 0
  const r = parseFloat(returnRate) || 0
  const d = parseInt(delay) || 0
  const t = parseInt(total) || 0
  const result = useMemo(() => calculate(m, r, d, t), [m, r, d, t])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Monthly Investment</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Expected Return (%)</label><input type="number" min="1" max="15" step="0.5" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Delay (years)</label><input type="number" min="1" max="20" value={delay} onChange={(e) => setDelay(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Total Horizon (years)</label><input type="number" min="5" max="50" value={total} onChange={(e) => setTotal(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {m > 0 && t > d && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Cost of Waiting {d} Years</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.costOfDelay)}</p>
            <p className="text-sm text-muted-foreground mt-1">That's {formatCurrency(result.lostGrowth)} in lost compound growth alone</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-sm font-medium text-green-800 dark:text-green-300">Start Now</p><p className="text-2xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.balanceNow)}</p><p className="text-xs text-muted-foreground">Invested: {formatCurrency(result.totalInvestedNow)}</p></div>
            <div className="rounded-xl border border-border p-4 text-center"><p className="text-sm font-medium">Start in {d} Years</p><p className="text-2xl font-bold mt-1">{formatCurrency(result.balanceDelayed)}</p><p className="text-xs text-muted-foreground">Invested: {formatCurrency(result.totalInvestedDelayed)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
