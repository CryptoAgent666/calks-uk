import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const VAT_THRESHOLD = 90_000 // from April 2024; you must register once the rolling 12-month total goes OVER this

// window: taxable turnover for the last 12 complete months, oldest first (0 = not trading yet)
// runRate: expected turnover for each future month
function calculate(window: number[], runRate: number) {
  const rolling12 = window.reduce((s, v) => s + v, 0)
  const firstTrading = window.findIndex(v => v > 0)
  const monthsTrading = firstTrading === -1 ? 0 : window.length - firstTrading
  const avgMonthly = monthsTrading > 0 ? rolling12 / monthsTrading : 0
  const headroom = VAT_THRESHOLD - rolling12
  const mustRegister = rolling12 > VAT_THRESHOLD
  // Forward-look test: sales in the next 30 days alone expected to go over £90,000
  const forwardLook = runRate > VAT_THRESHOLD

  // Roll the 12-month window forward one month at a time at the run-rate.
  // After 12 months the window holds only projected months, so if it has not gone over by then it never will.
  let monthsToThreshold: number | null = null
  if (!mustRegister && runRate > 0) {
    const w = [...window]
    for (let k = 1; k <= 12; k++) {
      w.shift()
      w.push(runRate)
      if (w.reduce((s, v) => s + v, 0) > VAT_THRESHOLD) { monthsToThreshold = k; break }
    }
  }

  return { rolling12, headroom, mustRegister, forwardLook, monthsToThreshold, avgMonthly, monthsTrading, pctOfThreshold: (rolling12 / VAT_THRESHOLD) * 100 }
}

// Simple mode: a steady monthly figure, trading for `monthsTrading` months (12 = a year or more)
function simpleWindow(monthly: number, monthsTrading: number) {
  const m = Math.min(Math.max(Math.floor(monthsTrading), 0), 12)
  return [...Array(12 - m).fill(0), ...Array(m).fill(monthly)]
}

export default function VATThresholdCalculator() {
  const [revenues, setRevenues] = useState<string[]>(Array(12).fill(''))
  const [simpleMode, setSimpleMode] = useState(true)
  const [simpleMonthly, setSimpleMonthly] = useState('6000')
  const [monthsTrading, setMonthsTrading] = useState('12')

  const parse = (s: string) => parseFloat(s.replace(/,/g, '')) || 0
  const sm = parse(simpleMonthly)
  const mt = parseInt(monthsTrading) || 0
  const monthly = revenues.map(parse)
  const key = simpleMode ? `s|${sm}|${mt}` : `m|${monthly.join(',')}`

  const result = useMemo(() => {
    if (simpleMode) return calculate(simpleWindow(sm, mt), sm)
    const base = calculate(monthly, 0)
    return calculate(monthly, base.avgMonthly)
  }, [simpleMode, key])

  const updateMonth = (i: number, val: string) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">Average Monthly Taxable Turnover</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={simpleMonthly} onChange={(e) => setSimpleMonthly(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Average Monthly Taxable Turnover" /></div></div>
          <div><label className="block text-sm font-medium mb-2">Trading History</label><select value={monthsTrading} onChange={(e) => setMonthsTrading(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Trading History"><option value="12">12 months or more</option>{Array.from({ length: 11 }, (_, i) => 11 - i).map(n => <option key={n} value={String(n)}>{n} month{n !== 1 ? 's' : ''}</option>)}<option value="0">Just starting</option></select></div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Taxable turnover for your last 12 complete months, oldest first (M12 is the month just ended). Leave months before you started trading blank.</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {revenues.map((v, i) => (
              <div key={i}><label className="block text-xs text-muted-foreground mb-1">M{i + 1}{i === 11 ? ' (latest)' : ''}</label><div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input type="text" inputMode="numeric" value={v} onChange={(e) => updateMonth(i, e.target.value)} className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label={`Month ${i + 1} turnover${i === 11 ? ' (latest)' : ''}`} /></div></div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 animate-fade-in-up">
        <div className={`rounded-2xl p-6 text-center ${result.mustRegister || result.forwardLook ? 'bg-destructive/10' : result.pctOfThreshold > 80 ? 'bg-orange-100 dark:bg-orange-950' : 'bg-green-100 dark:bg-green-950'}`}>
          {result.mustRegister ? (
            <><p className="text-lg font-bold text-destructive">You must register for VAT</p><p className="text-sm text-muted-foreground mt-1">Your rolling 12-month turnover ({formatCurrency(result.rolling12)}) is over the £{VAT_THRESHOLD.toLocaleString()} threshold. Register within 30 days of the end of the month you went over; VAT applies from the first day of the second month after it.</p></>
          ) : result.forwardLook ? (
            <><p className="text-lg font-bold text-destructive">Register now: forward-look test</p><p className="text-sm text-muted-foreground mt-1">You expect more than £{VAT_THRESHOLD.toLocaleString()} of taxable sales in the next 30 days alone. Register by the end of that 30-day period; VAT applies from the date you realised.</p></>
          ) : (
            <><p className="text-sm text-muted-foreground">Rolling 12-Month Turnover</p><p className="text-3xl font-bold mt-1">{formatCurrency(result.rolling12)}</p><p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.headroom)} headroom before VAT registration</p></>
          )}
        </div>

        <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
          <div className={`h-4 rounded-full transition-all ${result.mustRegister ? 'bg-red-500' : result.pctOfThreshold > 80 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${Math.min(result.pctOfThreshold, 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground"><span>£0</span><span className="font-medium">£{VAT_THRESHOLD.toLocaleString()} threshold</span></div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">% of Threshold</p><p className="text-lg font-bold">{result.pctOfThreshold.toFixed(0)}%</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Avg Monthly</p><p className="text-lg font-bold">{formatCurrency(simpleMode ? sm : result.avgMonthly)}</p></div>
          {!result.mustRegister && (
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Goes Over Threshold</p><p className="text-lg font-bold">{result.monthsToThreshold === null ? 'Never at this run-rate' : `In ${result.monthsToThreshold} month${result.monthsToThreshold !== 1 ? 's' : ''}`}</p></div>
          )}
        </div>
        {!result.mustRegister && (
          <p className="text-xs text-muted-foreground">
            Projection assumes each future month brings in {formatCurrency(simpleMode ? sm : result.avgMonthly)}{simpleMode ? '' : ', your average since you started trading'}. The rolling total is always the latest 12 months, so a steady business only goes over if it averages more than £{(VAT_THRESHOLD / 12).toLocaleString()} a month.
          </p>
        )}
      </div>
    </div>
  )
}
