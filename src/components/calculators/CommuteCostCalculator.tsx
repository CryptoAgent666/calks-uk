import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(distanceMiles: number, daysPerWeek: number, weeksPerYear: number, mode: string, fuelPriceP: number, mpg: number, trainMonthly: number, busMonthly: number) {
  const annualMiles = distanceMiles * 2 * daysPerWeek * weeksPerYear

  // Car cost
  const gallons = annualMiles / mpg
  const litres = gallons * 4.54609
  const fuelCost = litres * (fuelPriceP / 100)
  const carOther = annualMiles * 0.15 // insurance, maintenance, depreciation ~15p/mile
  const carTotal = fuelCost + carOther

  // Train cost
  const trainTotal = trainMonthly * 12

  // Bus cost
  const busTotal = busMonthly * 12

  // Cycle/walk
  const cycleTotal = 200 // basic annual maintenance

  const costs: Record<string, number> = { car: carTotal, train: trainTotal, bus: busTotal, cycle: cycleTotal }
  const activeCost = costs[mode] || 0

  return { annualMiles, fuelCost, carTotal, trainTotal, busTotal, cycleTotal, activeCost, dailyCost: activeCost / (daysPerWeek * weeksPerYear), monthlyCost: activeCost / 12 }
}

export default function CommuteCostCalculator() {
  const [distance, setDistance] = useState('15')
  const [days, setDays] = useState('5')
  const [weeks, setWeeks] = useState('48')
  const [mode, setMode] = useState('car')
  const [fuel, setFuel] = useState('135')
  const [mpg, setMpg] = useState('40')
  const [train, setTrain] = useState('200')
  const [bus, setBus] = useState('70')

  const result = useMemo(() => calculate(parseFloat(distance)||0, parseInt(days)||5, parseInt(weeks)||48, mode, parseFloat(fuel)||135, parseFloat(mpg)||40, parseFloat(train)||0, parseFloat(bus)||0), [distance, days, weeks, mode, fuel, mpg, train, bus])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[{v:'car',l:'Car'},{v:'train',l:'Train'},{v:'bus',l:'Bus'},{v:'cycle',l:'Cycle/Walk'}].map(o => (
          <button key={o.v} onClick={() => setMode(o.v)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${mode === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{o.l}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Distance (miles, one way)</label><input type="number" min="0" step="0.1" value={distance} onChange={(e) => setDistance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Days/Week</label><input type="number" min="1" max="7" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Weeks/Year</label><input type="number" min="1" max="52" value={weeks} onChange={(e) => setWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        {mode === 'car' && <div><label className="block text-sm font-medium mb-2">Fuel (p/litre)</label><input type="number" min="0" value={fuel} onChange={(e) => setFuel(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>}
        {mode === 'car' && <div><label className="block text-sm font-medium mb-2">MPG</label><input type="number" min="10" max="100" value={mpg} onChange={(e) => setMpg(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>}
        {mode === 'train' && <div><label className="block text-sm font-medium mb-2">Monthly Pass (£)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={train} onChange={(e) => setTrain(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>}
        {mode === 'bus' && <div><label className="block text-sm font-medium mb-2">Monthly Pass (£)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={bus} onChange={(e) => setBus(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>}
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Annual Commute Cost ({mode})</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.activeCost)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyCost)}/month &middot; {formatCurrency(result.dailyCost)}/day</p>
        </div>

        <h3 className="text-sm font-semibold">Compare All Modes</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className={`rounded-xl p-4 text-center ${mode === 'car' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Car</p><p className="text-lg font-bold">{formatCurrency(result.carTotal)}/yr</p></div>
          <div className={`rounded-xl p-4 text-center ${mode === 'train' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Train</p><p className="text-lg font-bold">{formatCurrency(result.trainTotal)}/yr</p></div>
          <div className={`rounded-xl p-4 text-center ${mode === 'bus' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Bus</p><p className="text-lg font-bold">{formatCurrency(result.busTotal)}/yr</p></div>
          <div className={`rounded-xl p-4 text-center ${mode === 'cycle' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Cycle/Walk</p><p className="text-lg font-bold">{formatCurrency(result.cycleTotal)}/yr</p></div>
        </div>
      </div>
    </div>
  )
}
