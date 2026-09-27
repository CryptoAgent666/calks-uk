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

  // HMRC approved mileage allowance for a car: 55p a mile for the first 10,000 business miles
  // in the tax year (from 6 April 2026), 25p after that. Assumes this is the first business trip of the year.
  const hmrcAllowance = Math.min(distanceMiles, 10_000) * 0.55 + Math.max(0, distanceMiles - 10_000) * 0.25
  const allowanceMinusFuel = hmrcAllowance - cost

  return { cost, litresNeeded, costPerMile, distanceMiles, distanceKm, hmrcAllowance, allowanceMinusFuel }
}

// UK average pump prices, DESNZ weekly road fuel prices, week commencing 21 September 2026
// (ULSP 172.01p, ULSD 195.53p per litre). Volatile: users should enter what they paid.
const PETROL_P = 172
const DIESEL_P = 196

export default function FuelCostCalculator() {
  const [distance, setDistance] = useState('100')
  const [distanceUnit, setDistanceUnit] = useState<Unit>('miles')
  const [fuelPrice, setFuelPrice] = useState(String(PETROL_P))
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
            <input type="number" min="0" value={distance} onChange={(e) => setDistance(e.target.value)} className="flex-1 rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Distance" />
            <select value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value as Unit)} className="rounded-xl border border-input bg-background px-3 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="miles">Miles</option>
              <option value="km">Km</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Fuel Price (pence per litre)</label>
          <div className="relative">
            <input type="text" inputMode="decimal" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Fuel Price (pence per litre)" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">p/litre</span>
          </div>
          <div className="flex gap-2 mt-2">
            {[{ l: 'Petrol', v: PETROL_P }, { l: 'Diesel', v: DIESEL_P }].map(o => (
              <button key={o.l} onClick={() => setFuelPrice(String(o.v))} className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border ${fp === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{o.l} {o.v}p</button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">UK averages, week commencing 21 September 2026 (DESNZ)</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Fuel Efficiency</label>
          <div className="flex gap-2">
            <input type="number" min="0" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} className="flex-1 rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Fuel Efficiency" />
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
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">HMRC Mileage Allowance</p><p className="text-lg font-bold">{formatCurrency(result.hmrcAllowance)}</p><p className="text-xs text-muted-foreground">55p/mile, first 10,000 business miles</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Allowance Minus Fuel</p><p className="text-lg font-bold">{formatCurrency(result.allowanceMinusFuel)}</p><p className="text-xs text-muted-foreground">left for wear, insurance and depreciation</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
