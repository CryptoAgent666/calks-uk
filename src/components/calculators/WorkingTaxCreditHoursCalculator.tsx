import { useState, useMemo } from 'react'

// UC work allowance / conditionality thresholds (2026/27)
// Working Tax Credit closed to new claims and existing claimants were migrated to Universal Credit by April 2025,
// so all thresholds below are UC-based.
function calculate(hoursPerWeek: number, hourlyRate: number, isSingle: boolean, hasChildren: boolean) {
  const weeklyPay = hoursPerWeek * hourlyRate
  const annualPay = weeklyPay * 52
  const monthlyPay = annualPay / 12
  const nmw = 12.71

  // 2026/27 UC earnings thresholds (uprated proportionally with NLW)
  const aetSingleMonthly = 1_009 // Administrative Earnings Threshold, single (£952 in 2025/26)
  const aetCoupleMonthly = 1_617 // Administrative Earnings Threshold, couple (£1,524 in 2025/26)
  const cetMonthly = nmw * 35 * 52 / 12 // Conditionality Earnings Threshold = 35h × NLW

  const aetThreshold = isSingle ? aetSingleMonthly : aetCoupleMonthly

  const meetsNMW = hourlyRate >= nmw
  const isFullTime = hoursPerWeek >= 35

  // UC work conditionality (post-migration rules)
  let conditionality = ''
  if (monthlyPay === 0) conditionality = 'Intensive work search — full job-seeking commitments'
  else if (monthlyPay < aetThreshold) conditionality = 'Intensive work search — earnings below AET'
  else if (monthlyPay < cetMonthly) conditionality = 'Light touch — may be asked to increase hours/pay'
  else conditionality = 'No additional conditions — working enough'

  // Key UC earnings/hours thresholds (current rules, not legacy WTC)
  const thresholds = [
    { hours: Math.ceil(aetSingleMonthly * 12 / 52 / nmw), label: `AET (single): £${aetSingleMonthly}/mo — escapes intensive work search`, met: monthlyPay >= aetSingleMonthly },
    { hours: Math.ceil(aetCoupleMonthly * 12 / 52 / nmw), label: `AET (couple): £${aetCoupleMonthly}/mo joint — escapes intensive work search`, met: monthlyPay >= aetCoupleMonthly },
    { hours: 35, label: '35 hrs × NLW: CET — no work-related conditions', met: monthlyPay >= cetMonthly },
    { hours: 16, label: '16 hrs: legacy WTC threshold (closed to new claims April 2025)', met: hoursPerWeek >= 16 },
  ]

  return { weeklyPay, annualPay, meetsNMW, isFullTime, conditionality, thresholds }
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
        <div><label className="block text-sm font-medium mb-2">Hours/Week</label><input type="number" min="0" max="60" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours/Week" /></div>
        <div><label className="block text-sm font-medium mb-2">Hourly Rate</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hourly Rate" /></div></div>
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
