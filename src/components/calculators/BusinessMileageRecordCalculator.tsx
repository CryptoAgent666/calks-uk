import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Simple mileage log with HMRC rates
export default function BusinessMileageRecordCalculator() {
  const [trips, setTrips] = useState([
    { date: '2026-04-10', from: 'Home', to: 'Client Office', miles: 25, return_trip: true },
    { date: '2026-04-12', from: 'Home', to: 'Supplier', miles: 15, return_trip: true },
  ])

  const addTrip = () => setTrips([...trips, { date: new Date().toISOString().split('T')[0], from: '', to: '', miles: 0, return_trip: true }])
  const removeTrip = (i: number) => setTrips(trips.filter((_, idx) => idx !== i))
  const updateTrip = (i: number, field: string, value: any) => setTrips(trips.map((t, idx) => idx === i ? { ...t, [field]: value } : t))

  const totalMiles = trips.reduce((s, t) => s + (t.return_trip ? t.miles * 2 : t.miles), 0)
  const annualProjected = totalMiles * (52 / Math.max(trips.length / 2, 1))

  // HMRC claim
  const first10k = Math.min(totalMiles, 10_000) * 0.45
  const over10k = Math.max(0, totalMiles - 10_000) * 0.25
  const totalClaim = first10k + over10k

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Mileage Log</h3><button onClick={addTrip} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">+ Add Trip</button></div>
      <div className="space-y-2">
        {trips.map((trip, i) => (
          <div key={i} className="flex items-center gap-2 flex-wrap">
            <input type="date" value={trip.date} onChange={(e) => updateTrip(i, 'date', e.target.value)} className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input type="text" value={trip.from} onChange={(e) => updateTrip(i, 'from', e.target.value)} placeholder="From" className="w-24 rounded-lg border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <span className="text-xs">→</span>
            <input type="text" value={trip.to} onChange={(e) => updateTrip(i, 'to', e.target.value)} placeholder="To" className="w-24 rounded-lg border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input type="number" min="0" value={trip.miles || ''} onChange={(e) => updateTrip(i, 'miles', parseFloat(e.target.value) || 0)} placeholder="Mi" className="w-16 rounded-lg border border-input bg-background px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring" />
            <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={trip.return_trip} onChange={(e) => updateTrip(i, 'return_trip', e.target.checked)} className="h-4 w-4 rounded" />Return</label>
            <button onClick={() => removeTrip(i)} className="px-1.5 py-1.5 rounded-lg bg-muted hover:bg-destructive/10 text-xs">x</button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
        <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total Miles</p><p className="text-xl font-bold text-primary">{totalMiles.toLocaleString()}</p></div>
        <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">HMRC Claim</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(totalClaim)}</p></div>
        <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Trips Logged</p><p className="text-xl font-bold">{trips.length}</p></div>
      </div>
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>Keep a log of all business trips for tax purposes. HMRC rates: 45p/mile first 10,000 miles, 25p thereafter. Don't include commuting (home to regular workplace).</p>
      </div>
    </div>
  )
}
