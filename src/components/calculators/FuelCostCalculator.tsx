import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type Unit = 'miles' | 'km'
type Efficiency = 'mpg' | 'lper100km'

function calculate(distance: number, distanceUnit: Unit, fuelPrice: number, efficiency: number, efficiencyUnit: Efficiency) {
  const distanceMiles = distanceUnit === 'km' ? distance * 0.621371 : distance
  const distanceKm = distanceUnit === 'miles' ? distance * 1.60934 : distance

  let litresNeeded: number
  if (efficiencyUnit === 'mpg') {
    const gallons = distanceMiles / efficiency
    litresNeeded = gallons * 4.54609
  } else {
    litresNeeded = (distanceKm / 100) * efficiency
  }

  const cost = litresNeeded * (fuelPrice / 100) // fuelPrice in pence
  const costPerMile = distanceMiles > 0 ? cost / distanceMiles : 0

  return { cost, litresNeeded, costPerMile, distanceMiles, distanceKm }
}

export default function FuelCostCalculator() {
  const [distance, setDistance] = useState('100')
  const [distanceUnit, setDistanceUnit] = useState<Unit>('miles')
  const [fuelPrice, setFuelPrice] = useState('135')
  const [efficiency, setEfficiency] = useState('40')
  const [efficiencyUnit, setEfficiencyUnit] = useState<Efficiency>('mpg')

  const d = parseFloat(distance) || 0
  const fp = parseFloat(fuelPrice) || 0
  const eff = parseFloat(efficiency) || 0
  const result = useMemo(() => calculate(d, distanceUnit, fp, eff, efficiencyUnit), [d, distanceUnit, fp, eff, efficiencyUnit])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Distance</label>
          <div className="flex gap-2">
            <input type="number" min="0" value={distance} onChange={(e) => setDistance(e.target.value)} className="flex-1 rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
            <select value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value as Unit)} className="rounded-xl border border-input bg-background px-3 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="miles">Miles</option>
              <option value="km">Km</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Fuel Price (pence per litre)</label>
          <div className="relative">
            <input type="number" min="0" max="500" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">p/litre</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Fuel Efficiency</label>
          <div className="flex gap-2">
            <input type="number" min="0" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} className="flex-1 rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
            <select value={efficiencyUnit} onChange={(e) => setEfficiencyUnit(e.target.value as Efficiency)} className="rounded-xl border border-input bg-background px-3 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="mpg">MPG</option>
              <option value="lper100km">L/100km</option>
            </select>
          </div>
        </div>
      </div>

      {d > 0 && eff > 0 && fp > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Fuel Cost</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.cost)}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Litres Needed</p><p className="text-lg font-bold">{result.litresNeeded.toFixed(1)}L</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Cost per Mile</p><p className="text-lg font-bold">{(result.costPerMile * 100).toFixed(1)}p</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Distance</p><p className="text-lg font-bold">{result.distanceMiles.toFixed(0)} mi</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
