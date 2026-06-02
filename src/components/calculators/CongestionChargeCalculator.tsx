import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const CC_DAILY = 18.00 // standard daily charge (advance/same-day), from 2 January 2026
const CC_DAILY_EV_AUTOPAY = 13.50 // EV Cleaner Vehicle Discount on Auto Pay (the 100% EV exemption ended 25 December 2025)

function calculate(daysPerWeek: number, weeksPerYear: number, hasAutoPay: boolean, isEV: boolean, isDisabled: boolean) {
  if (isDisabled) return { annualCost: 0, dailyRate: 0, exempt: true, reason: 'Disabled person\'s exemption (Blue Badge)' }

  // Auto Pay is billed at the standard £18/day; EVs on Auto Pay get the discounted Cleaner Vehicle rate
  const dailyRate = (isEV && hasAutoPay) ? CC_DAILY_EV_AUTOPAY : CC_DAILY
  const annualDays = daysPerWeek * weeksPerYear
  const annualCost = annualDays * dailyRate
  const monthlyCost = annualCost / 12

  return { annualCost, monthlyCost, dailyRate, annualDays, exempt: false }
}

export default function CongestionChargeCalculator() {
  const [days, setDays] = useState('5')
  const [weeks, setWeeks] = useState('48')
  const [autopay, setAutopay] = useState(true)
  const [ev, setEv] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const d = parseInt(days) || 0
  const w = parseInt(weeks) || 48
  const result = useMemo(() => calculate(d, w, autopay, ev, disabled), [d, w, autopay, ev, disabled])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Days/Week in Zone</label><input type="number" min="0" max="7" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Days/Week in Zone" /></div>
        <div><label className="block text-sm font-medium mb-2">Weeks/Year</label><input type="number" min="1" max="52" value={weeks} onChange={(e) => setWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weeks/Year" /></div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={autopay} onChange={(e) => setAutopay(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Auto Pay registered</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={ev} onChange={(e) => setEv(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Electric vehicle (no longer exempt — CVD ended Dec 2025)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Blue Badge holder</span></label>
      </div>

      <div className={`rounded-2xl p-6 text-center ${result.exempt ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
        {result.exempt ? (
          <><p className="text-lg font-bold text-green-700 dark:text-green-400">Exempt!</p><p className="text-sm text-muted-foreground mt-1">{'reason' in result ? result.reason : ''}</p></>
        ) : (
          <><p className="text-sm text-muted-foreground">Annual Congestion Charge</p><p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.annualCost)}</p><p className="text-sm text-muted-foreground mt-1">{formatCurrency('monthlyCost' in result ? result.monthlyCost : 0)}/month &middot; £{result.dailyRate}/day</p></>
        )}
      </div>
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>London Congestion Charge: £{CC_DAILY}/day, Mon-Fri 7am-6pm and Sat-Sun/bank holidays 12pm-6pm (excl. Christmas Day to New Year's Day). Auto Pay saves vs daily payment. Zone: central London (roughly within the Inner Ring Road).</p>
      </div>
    </div>
  )
}
