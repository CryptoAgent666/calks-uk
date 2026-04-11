import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// HMRC business mileage rates combined with fuel cost comparison
function calculate(annualMiles: number, fuelPriceP: number, mpg: number) {
  // HMRC allowance
  const hmrcFirst10k = Math.min(annualMiles, 10_000) * 0.45
  const hmrcOver10k = Math.max(0, annualMiles - 10_000) * 0.25
  const hmrcTotal = hmrcFirst10k + hmrcOver10k

  // Actual fuel cost
  const gallons = annualMiles / mpg
  const litres = gallons * 4.54609
  const fuelCost = litres * (fuelPriceP / 100)

  // Additional running costs (insurance, maintenance, depreciation)
  const otherCosts = annualMiles * 0.10 // ~10p/mile average
  const totalActual = fuelCost + otherCosts

  const profit = hmrcTotal - fuelCost
  const profitVsTotal = hmrcTotal - totalActual

  return { hmrcTotal, fuelCost, otherCosts, totalActual, profit, profitVsTotal, costPerMile: totalActual / annualMiles, hmrcPerMile: hmrcTotal / annualMiles }
}

export default function MileageCalculator() {
  const [miles, setMiles] = useState('8000')
  const [fuel, setFuel] = useState('135')
  const [mpg, setMpg] = useState('40')

  const m = parseFloat(miles.replace(/,/g,'')) || 0
  const f = parseFloat(fuel) || 0
  const g = parseFloat(mpg) || 0
  const result = useMemo(() => calculate(m, f, g), [m, f, g])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Business Miles</label><input type="text" inputMode="numeric" value={miles} onChange={(e) => setMiles(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Fuel Price (p/litre)</label><input type="number" min="100" max="200" value={fuel} onChange={(e) => setFuel(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Your MPG</label><input type="number" min="15" max="70" value={mpg} onChange={(e) => setMpg(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {m > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">HMRC Mileage Allowance</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.hmrcTotal)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Actual Fuel Cost</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.fuelCost)}</p></div>
          </div>
          <div className={`rounded-2xl p-6 text-center ${result.profit > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
            <p className="text-sm text-muted-foreground">{result.profit > 0 ? 'You profit from HMRC rates' : 'HMRC rates don\'t cover your costs'}</p>
            <p className={`text-2xl font-bold mt-1 ${result.profit > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{result.profit > 0 ? '+' : ''}{formatCurrency(result.profit)}/year vs fuel only</p>
            <p className="text-sm text-muted-foreground mt-1">{result.profitVsTotal > 0 ? '+' : ''}{formatCurrency(result.profitVsTotal)} vs total running costs</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">HMRC per Mile</p><p className="text-lg font-bold">{(result.hmrcPerMile * 100).toFixed(1)}p</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Your Cost per Mile</p><p className="text-lg font-bold">{(result.costPerMile * 100).toFixed(1)}p</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
