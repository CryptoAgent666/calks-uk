import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Statutory redundancy pay 2026/27 (effective 6 April 2026)
const WEEKLY_PAY_CAP = 751 // capped weekly pay (£751 from 6 April 2026, was £719 in 2025/26)
const MAX_YEARS = 20

function calculate(age: number, yearsService: number, weeklyPay: number) {
  const cappedPay = Math.min(weeklyPay, WEEKLY_PAY_CAP)
  const years = Math.min(yearsService, MAX_YEARS)

  let totalWeeks = 0

  for (let y = 0; y < years; y++) {
    const ageAtYear = age - (years - y - 1)
    if (ageAtYear < 22) totalWeeks += 0.5
    else if (ageAtYear < 41) totalWeeks += 1
    else totalWeeks += 1.5
  }

  const statutoryPay = totalWeeks * cappedPay

  return {
    totalWeeks, statutoryPay, cappedPay,
    isCapped: weeklyPay > WEEKLY_PAY_CAP,
    taxFreeAmount: Math.min(statutoryPay, 30_000),
  }
}

export default function RedundancyPayCalculator() {
  const [age, setAge] = useState('35')
  const [years, setYears] = useState('5')
  const [weeklyPay, setWeeklyPay] = useState('600')

  const a = parseInt(age) || 0
  const y = parseInt(years) || 0
  const w = parseFloat(weeklyPay) || 0
  const result = useMemo(() => calculate(a, y, w), [a, y, w])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="red-age" className="block text-sm font-medium mb-2">Your Age</label>
          <input id="red-age" type="number" min="16" max="75" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Age" />
        </div>
        <div>
          <label htmlFor="red-years" className="block text-sm font-medium mb-2">Years of Service</label>
          <input id="red-years" type="number" min="0" max="50" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years of Service" />
        </div>
        <div>
          <label htmlFor="red-pay" className="block text-sm font-medium mb-2">Weekly Pay (gross)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input id="red-pay" type="number" min="0" value={weeklyPay} onChange={(e) => setWeeklyPay(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weekly Pay (gross)" />
          </div>
        </div>
      </div>

      {a > 0 && y > 0 && w > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Statutory Redundancy Pay</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.statutoryPay)}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.totalWeeks} weeks' pay</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center">
              <p className="text-xs text-muted-foreground">Tax-Free (up to £30,000)</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.taxFreeAmount)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">Weekly Pay Used</p>
              <p className="text-lg font-bold">{formatCurrency(result.cappedPay)}{result.isCapped ? ' (capped)' : ''}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm space-y-1 text-muted-foreground">
            <p className="font-medium text-foreground">How it's calculated:</p>
            <p>Under 22: <span className="font-medium text-foreground">0.5 week</span> per year of service</p>
            <p>22 to 40: <span className="font-medium text-foreground">1 week</span> per year of service</p>
            <p>41 and over: <span className="font-medium text-foreground">1.5 weeks</span> per year of service</p>
            <p>Weekly pay capped at <span className="font-medium text-foreground">£{WEEKLY_PAY_CAP}</span>. Maximum <span className="font-medium text-foreground">{MAX_YEARS} years</span> counted.</p>
          </div>
        </div>
      )}
    </div>
  )
}
