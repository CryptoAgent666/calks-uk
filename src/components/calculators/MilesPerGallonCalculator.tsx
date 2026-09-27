import { useState, useMemo } from 'react'

// UK average pump prices, DESNZ weekly road fuel prices, week commencing 21 September 2026
// (ULSP 172.01p, ULSD 195.53p per litre). Volatile: users should enter what they paid.
const PETROL_P = 172
const DIESEL_P = 196

function calculate(miles: number, litres: number, pencePerLitre: number) {
  if (miles <= 0 || litres <= 0) return null
  const gallons = litres / 4.54609
  const mpg = miles / gallons
  const lPer100km = (litres / (miles * 1.60934)) * 100
  const kmPerLitre = (miles * 1.60934) / litres
  const fuelCost = litres * (pencePerLitre / 100)
  const costPerMile = fuelCost / miles

  return { mpg, lPer100km, kmPerLitre, gallons, fuelCost, costPerMile }
}

export default function MilesPerGallonCalculator() {
  const [miles, setMiles] = useState('')
  const [litres, setLitres] = useState('')
  const [price, setPrice] = useState(String(PETROL_P))

  const m = parseFloat(miles) || 0
  const l = parseFloat(litres) || 0
  const p = parseFloat(price) || 0
  const result = useMemo(() => calculate(m, l, p), [m, l, p])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Distance Driven (miles)</label><input type="number" min="0" step="1" value={miles} onChange={(e) => setMiles(e.target.value)} placeholder="300" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Distance Driven (miles)" /></div>
        <div><label className="block text-sm font-medium mb-2">Fuel Used (litres)</label><input type="number" min="0" step="0.1" value={litres} onChange={(e) => setLitres(e.target.value)} placeholder="35" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Fuel Used (litres)" /></div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium mb-2">Fuel Price (p/litre)</label>
          <input type="text" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Fuel Price (pence per litre)" />
          <div className="flex gap-2 mt-2">
            {[{ l: 'Petrol', v: PETROL_P }, { l: 'Diesel', v: DIESEL_P }].map(o => (
              <button key={o.l} onClick={() => setPrice(String(o.v))} className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border ${p === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{o.l} {o.v}p</button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">MPG (UK)</p><p className="text-2xl font-bold text-primary">{result.mpg.toFixed(1)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">L/100km</p><p className="text-lg font-bold">{result.lPer100km.toFixed(1)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">km/L</p><p className="text-lg font-bold">{result.kmPerLitre.toFixed(1)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Cost/Mile</p><p className="text-lg font-bold">{p > 0 ? `${(result.costPerMile * 100).toFixed(1)}p` : 'n/a'}</p></div>
        </div>
      )}

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Typical MPG by vehicle type:</p>
        <p>Small car: 45-60 MPG | Family car: 35-50 MPG | SUV: 25-40 MPG | Van: 25-35 MPG</p>
        <p className="mt-2">Petrol and diesel buttons use the UK average pump prices for the week commencing 21 September 2026 (DESNZ weekly road fuel prices: 172.01p and 195.53p a litre). Prices change weekly, so enter what you paid for the most accurate cost per mile.</p>
      </div>
    </div>
  )
}
