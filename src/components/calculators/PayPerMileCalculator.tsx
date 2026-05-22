import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// EV pay-per-mile road pricing — future calculator
function calculate(annualMiles: number, ratePerMile: number, currentVED: number, currentFuelDuty: number, mpg: number) {
  const payPerMileCost = annualMiles * (ratePerMile / 100)
  const currentFuelCost = (annualMiles / mpg) * 4.54609 * 1.35 // petrol
  const currentFuelDutyPaid = currentFuelCost * 0.45 // ~45% of pump price is duty+VAT on duty
  const currentVEDPaid = currentVED

  const currentTotal = currentFuelDutyPaid + currentVEDPaid
  const difference = payPerMileCost - currentTotal

  return { payPerMileCost, currentFuelDutyPaid, currentVEDPaid, currentTotal, difference, monthlyPPM: payPerMileCost / 12 }
}

export default function PayPerMileCalculator() {
  const [miles, setMiles] = useState('8000')
  const [rate, setRate] = useState('5')
  const [ved, setVed] = useState('190')
  const [mpg, setMpg] = useState('40')

  const m = parseFloat(miles.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 0
  const v = parseFloat(ved) || 0
  const g = parseFloat(mpg) || 40
  const result = useMemo(() => calculate(m, r, v, 0, g), [m, r, v, g])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Miles</label><input type="text" inputMode="numeric" value={miles} onChange={(e) => setMiles(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Miles" /></div>
        <div><label className="block text-sm font-medium mb-2">Rate (p/mile)</label><input type="number" min="1" max="20" step="0.5" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Rate (p/mile)" /><p className="text-xs text-muted-foreground mt-1">Estimated: 4-8p/mile</p></div>
        <div><label className="block text-sm font-medium mb-2">Current VED (£/yr)</label><input type="number" min="0" max="2000" value={ved} onChange={(e) => setVed(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current VED (£/yr)" /></div>
        <div><label className="block text-sm font-medium mb-2">Your MPG</label><input type="number" min="10" max="70" value={mpg} onChange={(e) => setMpg(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your MPG" /></div>
      </div>

      {m > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/50 p-5 text-center"><p className="text-sm font-medium">Current System</p><p className="text-2xl font-bold mt-1">{formatCurrency(result.currentTotal)}/yr</p><p className="text-xs text-muted-foreground">VED + fuel duty</p></div>
            <div className={`rounded-xl p-5 text-center ${result.difference > 0 ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}><p className="text-sm font-medium">Pay-Per-Mile ({r}p/mi)</p><p className="text-2xl font-bold mt-1">{formatCurrency(result.payPerMileCost)}/yr</p><p className="text-xs text-muted-foreground">{formatCurrency(result.monthlyPPM)}/month</p></div>
          </div>
          <div className={`rounded-xl p-4 text-center ${result.difference > 0 ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}>
            <p className="text-sm text-muted-foreground">Pay-per-mile would cost you</p>
            <p className={`text-xl font-bold ${result.difference > 0 ? 'text-destructive' : 'text-green-700 dark:text-green-400'}`}>{result.difference > 0 ? '+' : ''}{formatCurrency(result.difference)}/year {result.difference > 0 ? 'more' : 'less'}</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">What is pay-per-mile?</p>
            <p>As EVs pay no fuel duty, the government is expected to introduce road pricing. Low-mileage drivers would pay less than now; high-mileage drivers more. No firm date yet, but widely expected by 2030.</p>
          </div>
        </div>
      )}
    </div>
  )
}
