import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Carer's Allowance 2026/27 (from April 2025)
const CA_WEEKLY = 83.30 // was £81.90 in 2024/25, uprated 1.7% CPI
const EARNINGS_LIMIT = 196 // raised from £151/week to £196/week from April 2025 (Autumn Budget 2024)

function calculate(hoursPerWeek: number, weeklyEarnings: number, personCaredFor: boolean) {
  const qualifies = hoursPerWeek >= 35 && personCaredFor && weeklyEarnings <= EARNINGS_LIMIT
  const annualCA = CA_WEEKLY * 52
  const monthlyCA = annualCA / 12

  let reason = ''
  if (!personCaredFor) reason = 'The person you care for must receive a qualifying disability benefit (PIP daily living, DLA middle/higher, AA)'
  else if (hoursPerWeek < 35) reason = 'You must care for at least 35 hours per week'
  else if (weeklyEarnings > EARNINGS_LIMIT) reason = `Your net weekly earnings (£${weeklyEarnings}) exceed the £${EARNINGS_LIMIT}/week limit`

  return { qualifies, weeklyCA: CA_WEEKLY, annualCA, monthlyCA, reason }
}

export default function CarerAllowanceCalculator() {
  const [hours, setHours] = useState('40')
  const [earnings, setEarnings] = useState('120')
  const [qualifying, setQualifying] = useState(true)

  const h = parseInt(hours) || 0
  const e = parseFloat(earnings) || 0
  const result = useMemo(() => calculate(h, e, qualifying), [h, e, qualifying])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Hours Caring per Week</label><input type="number" min="0" max="168" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours Caring per Week" /></div>
        <div><label className="block text-sm font-medium mb-2">Your Net Weekly Earnings</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={earnings} onChange={(e) => setEarnings(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Net Weekly Earnings" /></div><p className="text-xs text-muted-foreground mt-1">Limit: £{EARNINGS_LIMIT}/week after deductions</p></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={qualifying} onChange={(e) => setQualifying(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Person cared for receives PIP/DLA/Attendance Allowance</span></label>

      <div className={`rounded-2xl p-6 text-center ${result.qualifies ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
        {result.qualifies ? (
          <>
            <p className="text-sm text-muted-foreground">You may qualify for Carer's Allowance</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.weeklyCA)}/week</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyCA)}/month &middot; {formatCurrency(result.annualCA)}/year</p>
          </>
        ) : (
          <>
            <p className="text-lg font-bold text-destructive">Not Eligible</p>
            <p className="text-sm text-muted-foreground mt-1">{result.reason}</p>
          </>
        )}
      </div>

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
        <p>Carer's Allowance: <span className="font-medium text-foreground">£{CA_WEEKLY}/week</span> (2026/27)</p>
        <p>Must care for someone 35+ hours/week who gets a qualifying disability benefit.</p>
        <p>Earnings limit: £{EARNINGS_LIMIT}/week net (after tax, NI, pension, and care costs).</p>
        <p>CA counts as taxable income and may affect other benefits (Universal Credit, Pension Credit).</p>
      </div>
    </div>
  )
}
