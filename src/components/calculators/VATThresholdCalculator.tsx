import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const VAT_THRESHOLD = 90_000 // from April 2024

function calculate(monthlyRevenue: number[]) {
  const rolling12 = monthlyRevenue.reduce((s, v) => s + v, 0)
  const avgMonthly = rolling12 / Math.max(monthlyRevenue.filter(v => v > 0).length, 1)
  const projectedAnnual = avgMonthly * 12
  const headroom = VAT_THRESHOLD - rolling12
  const mustRegister = rolling12 >= VAT_THRESHOLD
  const monthsToThreshold = headroom > 0 && avgMonthly > 0 ? Math.ceil(headroom / avgMonthly) : 0

  return { rolling12, projectedAnnual, headroom, mustRegister, monthsToThreshold, avgMonthly, pctOfThreshold: (rolling12 / VAT_THRESHOLD) * 100 }
}

export default function VATThresholdCalculator() {
  const [revenues, setRevenues] = useState<number[]>(Array(12).fill(0))
  const [simpleMode, setSimpleMode] = useState(true)
  const [simpleMonthly, setSimpleMonthly] = useState('6000')

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const effectiveRevenues = simpleMode ? Array(12).fill(parseFloat(simpleMonthly.replace(/,/g,'')) || 0) : revenues
  const result = useMemo(() => calculate(effectiveRevenues), [effectiveRevenues])

  const updateMonth = (i: number, val: number) => {
    const next = [...revenues]
    next[i] = val
    setRevenues(next)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setSimpleMode(true)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${simpleMode ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Simple (avg monthly)</button>
        <button onClick={() => setSimpleMode(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${!simpleMode ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Month by Month</button>
      </div>

      {simpleMode ? (
        <div><label className="block text-sm font-medium mb-2">Average Monthly Revenue</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={simpleMonthly} onChange={(e) => setSimpleMonthly(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Average Monthly Revenue" /></div></div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {monthNames.map((m, i) => (
            <div key={m}><label className="block text-xs text-muted-foreground mb-1">{m}</label><div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input type="number" min="0" value={revenues[i] || ''} onChange={(e) => updateMonth(i, parseFloat(e.target.value) || 0)} className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
          ))}
        </div>
      )}

      <div className="space-y-4 animate-fade-in-up">
        <div className={`rounded-2xl p-6 text-center ${result.mustRegister ? 'bg-destructive/10' : result.pctOfThreshold > 80 ? 'bg-orange-100 dark:bg-orange-950' : 'bg-green-100 dark:bg-green-950'}`}>
          {result.mustRegister ? (
            <><p className="text-lg font-bold text-destructive">You must register for VAT!</p><p className="text-sm text-muted-foreground mt-1">Your rolling 12-month turnover ({formatCurrency(result.rolling12)}) exceeds the £{VAT_THRESHOLD.toLocaleString()} threshold.</p></>
          ) : (
            <><p className="text-sm text-muted-foreground">Rolling 12-Month Turnover</p><p className="text-3xl font-bold mt-1">{formatCurrency(result.rolling12)}</p><p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.headroom)} headroom before VAT registration</p></>
          )}
        </div>

        <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
          <div className={`h-4 rounded-full transition-all ${result.pctOfThreshold >= 100 ? 'bg-red-500' : result.pctOfThreshold > 80 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${Math.min(result.pctOfThreshold, 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground"><span>£0</span><span className="font-medium">£{VAT_THRESHOLD.toLocaleString()} threshold</span></div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">% of Threshold</p><p className="text-lg font-bold">{result.pctOfThreshold.toFixed(0)}%</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Avg Monthly</p><p className="text-lg font-bold">{formatCurrency(result.avgMonthly)}</p></div>
          {!result.mustRegister && result.monthsToThreshold > 0 && <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Months to Threshold</p><p className="text-lg font-bold">{result.monthsToThreshold}</p></div>}
        </div>
      </div>
    </div>
  )
}
