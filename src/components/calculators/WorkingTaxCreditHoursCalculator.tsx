import { useState, useMemo } from 'react'

// UC work allowance / conditionality thresholds
function calculate(hoursPerWeek: number, hourlyRate: number, isSingle: boolean, hasChildren: boolean) {
  const weeklyPay = hoursPerWeek * hourlyRate
  const annualPay = weeklyPay * 52
  const nmw = 12.71

  const meetsNMW = hourlyRate >= nmw
  const isFullTime = hoursPerWeek >= 35
  const qualifiesWTC = (hasChildren && hoursPerWeek >= 16) || (!hasChildren && hoursPerWeek >= 30) || (isSingle && hasChildren && hoursPerWeek >= 16)

  // UC work conditionality
  let conditionality = ''
  if (hoursPerWeek === 0) conditionality = 'Intensive work search'
  else if (hoursPerWeek < 12) conditionality = 'Light touch — expected to increase hours'
  else if (hoursPerWeek < 35 && annualPay < nmw * 35 * 52) conditionality = 'Working — may be asked to increase hours/pay'
  else conditionality = 'No additional conditions — working enough'

  // Key benefit thresholds
  const thresholds = [
    { hours: 16, label: '16 hrs: WTC qualifying (with children)', met: hoursPerWeek >= 16 },
    { hours: 24, label: '24 hrs: Couple WTC minimum', met: hoursPerWeek >= 24 },
    { hours: 30, label: '30 hrs: WTC 30-hour element / single no children', met: hoursPerWeek >= 30 },
    { hours: 35, label: '35 hrs: UC full conditionality threshold', met: hoursPerWeek >= 35 },
  ]

  return { weeklyPay, annualPay, meetsNMW, isFullTime, qualifiesWTC, conditionality, thresholds }
}

export default function WorkingTaxCreditHoursCalculator() {
  const [hours, setHours] = useState('20')
  const [rate, setRate] = useState('12.71')
  const [single, setSingle] = useState(true)
  const [children, setChildren] = useState(true)

  const h = parseFloat(hours) || 0
  const r = parseFloat(rate) || 0
  const result = useMemo(() => calculate(h, r, single, children), [h, r, single, children])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Hours/Week</label><input type="number" min="0" max="60" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Hourly Rate</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setSingle(true)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${single ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Single</button>
        <button onClick={() => setSingle(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${!single ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Couple</button>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={children} onChange={(e) => setChildren(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Dependent children</span></label>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-xl bg-primary/10 p-4 text-center">
          <p className="text-sm text-muted-foreground">UC Conditionality</p>
          <p className="text-lg font-bold text-primary">{result.conditionality}</p>
        </div>

        <div className="space-y-2">
          {result.thresholds.map(t => (
            <div key={t.hours} className={`flex items-center justify-between rounded-xl border p-3 ${t.met ? 'border-green-300 dark:border-green-800 bg-green-100/50 dark:bg-green-950/50' : 'border-border'}`}>
              <span className="text-sm">{t.label}</span>
              <span className={`text-sm font-bold ${t.met ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}`}>{t.met ? 'Met' : 'Not met'}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Weekly Pay</p><p className="text-lg font-bold">{`£${result.weeklyPay.toFixed(2)}`}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Annual Pay</p><p className="text-lg font-bold">{`£${result.annualPay.toLocaleString()}`}</p></div>
        </div>
      </div>
    </div>
  )
}
