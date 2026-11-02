import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Carer's Allowance 2026/27 (from 6 April 2026)
const CA_WEEKLY = 86.45 // was £83.30 in 2025/26, uprated 3.8% CPI
const EARNINGS_LIMIT = 204 // weekly net earnings limit 2026/27 (was £196 in 2025/26)
const SCOTTISH_SUPPLEMENT = 11.70 // Scottish Carer Supplement, paid on top of Carer Support Payment
const SCOTTISH_ADDITIONAL_PERSON = 10.40 // Carer Additional Person Payment

// gov.uk/carers-allowance/eligibility
const BENEFITS = [
  { label: 'PIP daily living component (either rate)', qualifies: true },
  { label: 'DLA care component, middle or highest rate', qualifies: true },
  { label: 'Attendance Allowance', qualifies: true },
  { label: 'Armed Forces Independence Payment', qualifies: true },
  { label: 'Constant Attendance Allowance (Industrial Injuries at or above the normal maximum rate, or War Pension at the basic full day rate)', qualifies: true },
  { label: 'Pension Age Disability Payment', qualifies: true },
  { label: 'Adult Disability Payment daily living component (standard or enhanced)', qualifies: true },
  { label: 'Child Disability Payment care component, middle or highest rate', qualifies: true },
  { label: 'Scottish Adult DLA care, middle or highest rate', qualifies: true },
  { label: 'DLA lowest care rate or mobility only', qualifies: false },
  { label: 'PIP mobility component only', qualifies: false },
  { label: 'None of these', qualifies: false },
]

function calculate(hoursPerWeek: number, weeklyEarnings: number, benefitIndex: number, studying: boolean, statePension: number, inScotland: boolean) {
  const personCaredFor = BENEFITS[benefitIndex].qualifies
  // Scotland has its own study rules for Carer Support Payment, so the 21-hour test here is for England and Wales
  const studyBar = studying && !inScotland
  const qualifies = hoursPerWeek >= 35 && personCaredFor && !studyBar && weeklyEarnings <= EARNINGS_LIMIT

  // Overlapping benefits: a State Pension of the same amount or more leaves no cash payment
  const weeklyCA = Math.max(0, CA_WEEKLY - statePension)
  const annualCA = weeklyCA * 52
  const monthlyCA = annualCA / 12

  let reason = ''
  if (!personCaredFor) reason = 'The person you care for must receive a qualifying disability benefit at the right rate. DLA at the lowest care rate or mobility only, or PIP mobility only, does not count'
  else if (hoursPerWeek < 35) reason = 'You must care for at least 35 hours per week'
  else if (studyBar) reason = 'You cannot get Carer\'s Allowance in full-time education, or if you study for 21 hours a week or more'
  else if (weeklyEarnings > EARNINGS_LIMIT) reason = `Your net weekly earnings (£${weeklyEarnings}) exceed the £${EARNINGS_LIMIT}/week limit`

  return { qualifies, weeklyCA, annualCA, monthlyCA, reason }
}

export default function CarerAllowanceCalculator() {
  const [hours, setHours] = useState('40')
  const [earnings, setEarnings] = useState('120')
  const [benefit, setBenefit] = useState(0)
  const [studying, setStudying] = useState(false)
  const [pension, setPension] = useState('0')
  const [scotland, setScotland] = useState(false)

  const h = Math.min(168, Math.max(0, parseInt(hours) || 0)) // a week has 168 hours
  const e = parseFloat(earnings) || 0
  const p = Math.max(0, parseFloat(pension) || 0)
  const result = useMemo(() => calculate(h, e, benefit, studying, p, scotland), [h, e, benefit, studying, p, scotland])
  const benefitName = scotland ? 'Carer Support Payment' : "Carer's Allowance"

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Hours Caring per Week</label><input type="number" min="0" max="168" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours Caring per Week" /></div>
        <div><label className="block text-sm font-medium mb-2">Your Net Weekly Earnings</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={earnings} onChange={(e) => setEarnings(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Net Weekly Earnings" /></div><p className="text-xs text-muted-foreground mt-1">Limit: £{EARNINGS_LIMIT}/week after deductions</p></div>
        <div><label className="block text-sm font-medium mb-2">Your Weekly State Pension</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={pension} onChange={(e) => setPension(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Weekly State Pension" /></div><p className="text-xs text-muted-foreground mt-1">Enter 0 if you do not get one</p></div>
      </div>
      <div><label className="block text-sm font-medium mb-2">What does the person you care for get?</label><select value={benefit} onChange={(e) => setBenefit(parseInt(e.target.value))} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="What does the person you care for get?">{BENEFITS.map((b, idx) => <option key={b.label} value={idx}>{b.label}</option>)}</select></div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={studying} onChange={(e) => setStudying(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">I am in full-time education, or study 21 hours a week or more</span></label>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={scotland} onChange={(e) => setScotland(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">I live in Scotland</span></label>

      <div className={`rounded-2xl p-6 text-center ${result.qualifies ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
        {result.qualifies ? (
          result.weeklyCA > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">You may qualify for {benefitName}</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.weeklyCA)}/week</p>
              <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyCA)}/month &middot; {formatCurrency(result.annualCA)}/year</p>
              {p > 0 && <p className="text-sm text-muted-foreground mt-1">Paid to make up the difference between your State Pension and £{CA_WEEKLY}</p>}
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">No cash payment, but still worth checking</p>
              <p className="text-sm text-muted-foreground mt-1">Your State Pension is £{CA_WEEKLY} a week or more, so no {benefitName} is paid. If you get Pension Credit, your payments will increase instead.</p>
            </>
          )
        ) : (
          <>
            <p className="text-lg font-bold text-destructive">Not Eligible</p>
            <p className="text-sm text-muted-foreground mt-1">{result.reason}</p>
          </>
        )}
      </div>

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
        {scotland && <p>In Scotland you apply for <span className="font-medium text-foreground">Carer Support Payment</span> from Social Security Scotland instead: up to £{CA_WEEKLY}/week, plus the Scottish Carer Supplement of £{SCOTTISH_SUPPLEMENT.toFixed(2)}/week and £{SCOTTISH_ADDITIONAL_PERSON.toFixed(2)}/week for each additional person you care for. Its study rules differ, and take-home pay can be averaged against the £{EARNINGS_LIMIT} limit.</p>}
        <p>Carer's Allowance: <span className="font-medium text-foreground">£{CA_WEEKLY}/week</span> (2026/27)</p>
        <p>Must care for someone 35+ hours/week who gets a qualifying disability benefit.</p>
        <p>Earnings limit: £{EARNINGS_LIMIT}/week net (after tax, NI, half of pension contributions and some care costs).</p>
        <p>You get Class 1 National Insurance credits automatically for each week you are paid Carer's Allowance.</p>
        <p>Universal Credit is reduced by the amount of Carer's Allowance you get. The UC carer's element can be added whether or not you get Carer's Allowance.</p>
        <p>The person you care for will usually stop getting a severe disability premium or the extra amount for severe disability in Pension Credit, and might lose reduced Council Tax.</p>
      </div>
    </div>
  )
}
