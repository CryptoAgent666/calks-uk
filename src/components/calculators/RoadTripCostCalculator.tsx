import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(distanceMiles: number, mpg: number, fuelPriceP: number, passengers: number, tolls: number, parking: number) {
  const gallons = distanceMiles / mpg
  const litres = gallons * 4.54609
  const fuelCost = litres * (fuelPriceP / 100)
  const totalCost = fuelCost + tolls + parking
  const costPerPerson = passengers > 0 ? totalCost / passengers : totalCost
  const costPerMile = distanceMiles > 0 ? fuelCost / distanceMiles : 0

  // Driving time estimate (average 50mph including stops)
  const drivingHours = distanceMiles / 50
  const hours = Math.floor(drivingHours)
  const mins = Math.round((drivingHours - hours) * 60)

  return { fuelCost, totalCost, costPerPerson, costPerMile, litres, hours, mins }
}

export default function RoadTripCostCalculator() {
  const [distance, setDistance] = useState('300')
  const [mpg, setMpg] = useState('40')
  const [fuel, setFuel] = useState('135')
  const [passengers, setPassengers] = useState('2')
  const [tolls, setTolls] = useState('0')
  const [parking, setParking] = useState('10')

  const d = parseFloat(distance) || 0
  const m = parseFloat(mpg) || 40
  const f = parseFloat(fuel) || 135
  const p = parseInt(passengers) || 1
  const t = parseFloat(tolls) || 0
  const pk = parseFloat(parking) || 0
  const result = useMemo(() => calculate(d, m, f, p, t, pk), [d, m, f, p, t, pk])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Distance (miles)</label><input type="number" min="1" max="2000" value={distance} onChange={(e) => setDistance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Your MPG</label><input type="number" min="10" max="70" value={mpg} onChange={(e) => setMpg(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Fuel Price (p/litre)</label><input type="number" min="100" max="200" value={fuel} onChange={(e) => setFuel(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">People in Car</label><input type="number" min="1" max="8" value={passengers} onChange={(e) => setPassengers(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Tolls (£)</label><input type="number" min="0" value={tolls} onChange={(e) => setTolls(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Parking (£)</label><input type="number" min="0" value={parking} onChange={(e) => setParking(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {d > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">{p > 1 ? 'Cost Per Person' : 'Total Trip Cost'}</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.costPerPerson)}</p>
            {p > 1 && <p className="text-sm text-muted-foreground mt-1">Total: {formatCurrency(result.totalCost)} split {p} ways</p>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Fuel Cost</p><p className="text-lg font-bold">{formatCurrency(result.fuelCost)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Fuel Needed</p><p className="text-lg font-bold">{result.litres.toFixed(1)}L</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Cost/Mile</p><p className="text-lg font-bold">{(result.costPerMile * 100).toFixed(1)}p</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Drive Time</p><p className="text-lg font-bold">{result.hours}h {result.mins}m</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
