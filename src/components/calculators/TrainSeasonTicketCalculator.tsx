import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(singleFare: number, daysPerWeek: number, weeksPerYear: number) {
  const dailyCost = singleFare * 2 // return
  // There is no national daily-to-weekly formula: a 7-day season is typically 3 to 4 times the Anytime Day
  // Return (TfL Zones 1-6 2026: £81.60 / £23.60 = 3.46; London Terminals-Brighton Oct 2026: £154.10 / £42.70 = 3.61)
  const weeklyTicket = dailyCost * 3.6
  const monthlyTicket = weeklyTicket * 3.84 // industry convention: monthly = 3.84 x weekly (TfL 2026: £313.40 / £81.60)
  const annualTicket = weeklyTicket * 40 // annual = 40 x weekly (TfL 2026: £81.60 x 40 = £3,264)

  const payAsYouGo = dailyCost * daysPerWeek * weeksPerYear
  const weeklyCost = weeklyTicket * weeksPerYear
  const monthlyCost = monthlyTicket * 12
  const annualCost = annualTicket

  const options = [
    { name: 'Pay as You Go', cost: payAsYouGo, daily: payAsYouGo / (daysPerWeek * weeksPerYear) },
    { name: 'Weekly Season', cost: weeklyCost, daily: weeklyCost / (daysPerWeek * weeksPerYear) },
    { name: 'Monthly Season', cost: monthlyCost, daily: monthlyCost / (daysPerWeek * weeksPerYear) },
    { name: 'Annual Season', cost: annualCost, daily: annualCost / (daysPerWeek * weeksPerYear) },
  ].sort((a, b) => a.cost - b.cost)

  return { options, cheapest: options[0], mostExpensive: options[options.length - 1], saving: options[options.length - 1].cost - options[0].cost }
}

export default function TrainSeasonTicketCalculator() {
  const [fare, setFare] = useState('15')
  const [days, setDays] = useState('5')
  const [weeks, setWeeks] = useState('48')

  const f = parseFloat(fare) || 0
  const d = parseInt(days) || 5
  const w = parseInt(weeks) || 48
  const result = useMemo(() => calculate(f, d, w), [f, d, w])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Single Fare</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" step="0.10" value={fare} onChange={(e) => setFare(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Single Fare" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Days per Week</label><input type="number" min="1" max="7" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Days per Week" /></div>
        <div><label className="block text-sm font-medium mb-2">Weeks per Year</label><input type="number" min="1" max="52" value={weeks} onChange={(e) => setWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weeks per Year" /></div>
      </div>

      {f > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="space-y-2">
            {result.options.map((opt, i) => (
              <div key={opt.name} className={`rounded-xl p-4 flex items-center justify-between ${i === 0 ? 'bg-green-100 dark:bg-green-950 border-2 border-green-300 dark:border-green-800' : 'border border-border'}`}>
                <div>
                  <p className="font-semibold text-sm">{opt.name}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(opt.daily)}/day</p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${i === 0 ? 'text-green-700 dark:text-green-400' : ''}`}>{formatCurrency(opt.cost)}/yr</p>
                  {i === 0 && <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Best value</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-primary/10 p-4 text-center text-sm">
            <p>Best option saves you <span className="font-bold text-primary">{formatCurrency(result.saving)}/year</span> vs worst option</p>
          </div>
          <p className="text-xs text-muted-foreground text-center">Estimates based on typical season-ticket ratios (weekly 3.6 × the day return, monthly 3.84 × weekly, annual 40 × weekly); check the National Rail season ticket calculator for your route.</p>
        </div>
      )}
    </div>
  )
}
