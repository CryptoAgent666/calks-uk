import { useState, useMemo } from 'react'

function calculate(miles: number, litres: number) {
  if (miles <= 0 || litres <= 0) return null
  const gallons = litres / 4.54609
  const mpg = miles / gallons
  const lPer100km = (litres / (miles * 1.60934)) * 100
  const kmPerLitre = (miles * 1.60934) / litres
  const costPerMile = litres > 0 ? (litres * 1.35) / miles : 0 // assume ~135p/litre

  return { mpg, lPer100km, kmPerLitre, gallons, costPerMile }
}

export default function MilesPerGallonCalculator() {
  const [miles, setMiles] = useState('')
  const [litres, setLitres] = useState('')

  const m = parseFloat(miles) || 0
  const l = parseFloat(litres) || 0
  const result = useMemo(() => calculate(m, l), [m, l])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Distance Driven (miles)</label><input type="number" min="0" step="1" value={miles} onChange={(e) => setMiles(e.target.value)} placeholder="300" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Distance Driven (miles)" /></div>
        <div><label className="block text-sm font-medium mb-2">Fuel Used (litres)</label><input type="number" min="0" step="0.1" value={litres} onChange={(e) => setLitres(e.target.value)} placeholder="35" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Fuel Used (litres)" /></div>
      </div>

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">MPG (UK)</p><p className="text-2xl font-bold text-primary">{result.mpg.toFixed(1)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">L/100km</p><p className="text-lg font-bold">{result.lPer100km.toFixed(1)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">km/L</p><p className="text-lg font-bold">{result.kmPerLitre.toFixed(1)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Cost/Mile</p><p className="text-lg font-bold">{(result.costPerMile * 100).toFixed(1)}p</p></div>
        </div>
      )}

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Typical MPG by vehicle type:</p>
        <p>Small car: 45-60 MPG | Family car: 35-50 MPG | SUV: 25-40 MPG | Van: 25-35 MPG</p>
      </div>
    </div>
  )
}
