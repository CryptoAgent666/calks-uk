import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// HMRC Approved Mileage Allowance Payments (AMAP) 2026/27
const CAR_FIRST_10K = 0.45 // 45p/mile
const CAR_OVER_10K = 0.25 // 25p/mile
const MOTORCYCLE = 0.24 // 24p/mile
const BICYCLE = 0.20 // 20p/mile
const PASSENGER = 0.05 // 5p/mile per passenger

type Vehicle = 'car' | 'motorcycle' | 'bicycle'

function calculate(miles: number, vehicle: Vehicle, passengers: number) {
  let mileagePayment: number

  if (vehicle === 'car') {
    if (miles <= 10_000) {
      mileagePayment = miles * CAR_FIRST_10K
    } else {
      mileagePayment = 10_000 * CAR_FIRST_10K + (miles - 10_000) * CAR_OVER_10K
    }
  } else if (vehicle === 'motorcycle') {
    mileagePayment = miles * MOTORCYCLE
  } else {
    mileagePayment = miles * BICYCLE
  }

  const passengerPayment = vehicle === 'car' ? miles * PASSENGER * passengers : 0
  const total = mileagePayment + passengerPayment

  return { miles, mileagePayment, passengerPayment, total, monthly: total / 12 }
}

export default function MileageAllowanceCalculator() {
  const [miles, setMiles] = useState('')
  const [vehicle, setVehicle] = useState<Vehicle>('car')
  const [passengers, setPassengers] = useState('0')

  const m = parseFloat(miles.replace(/,/g, '')) || 0
  const p = parseInt(passengers) || 0
  const result = useMemo(() => calculate(m, vehicle, p), [m, vehicle, p])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {([{v:'car' as Vehicle,l:'Car/Van',r:'45p/25p'},{v:'motorcycle' as Vehicle,l:'Motorcycle',r:'24p'},{v:'bicycle' as Vehicle,l:'Bicycle',r:'20p'}]).map(o => (
          <button key={o.v} onClick={() => setVehicle(o.v)} className={`px-4 py-3 rounded-xl text-sm text-left transition-colors border ${vehicle === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
            <div className="font-medium">{o.l}</div>
            <div className={`text-xs ${vehicle === o.v ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{o.r}/mile</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Annual Business Miles</label>
          <input type="text" inputMode="numeric" value={miles} onChange={(e) => setMiles(e.target.value)} placeholder="8,000" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        {vehicle === 'car' && (
          <div>
            <label className="block text-sm font-medium mb-2">Passengers Carried</label>
            <input type="number" min="0" max="4" value={passengers} onChange={(e) => setPassengers(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        )}
      </div>

      {m > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Mileage Allowance</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.total)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthly)}/month</p>
          </div>

          {vehicle === 'car' && m > 0 && (
            <div className="rounded-xl border border-border p-4 text-sm space-y-1">
              {m <= 10_000 ? (
                <p>{m.toLocaleString()} miles x 45p = {formatCurrency(result.mileagePayment)}</p>
              ) : (
                <>
                  <p>First 10,000 miles x 45p = {formatCurrency(10_000 * CAR_FIRST_10K)}</p>
                  <p>Remaining {(m - 10_000).toLocaleString()} miles x 25p = {formatCurrency((m - 10_000) * CAR_OVER_10K)}</p>
                </>
              )}
              {result.passengerPayment > 0 && <p>Passenger allowance: {m.toLocaleString()} miles x {p} passengers x 5p = {formatCurrency(result.passengerPayment)}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
