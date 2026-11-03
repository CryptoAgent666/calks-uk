import { useState, useMemo, useEffect } from 'react'
import { formatCurrency } from '@/utils'

const MILEAGE_THRESHOLD = 10_000 // per tax year
const STORAGE_KEY = 'calks-business-mileage-log'

type Trip = { date: string; from: string; to: string; purpose: string; miles: number; return_trip: boolean }

// Today in the reader's own time zone: toISOString would give yesterday's date just after midnight in BST
const todayLocal = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

// A blank box is 0 miles; a negative figure is rejected and the previous value stays
const parseMiles = (value: string, previous: number) => {
  const miles = parseFloat(value)
  if (Number.isNaN(miles)) return 0
  return miles < 0 ? previous : miles
}

const tripMiles = (t: { miles: number; return_trip: boolean }) => t.return_trip ? t.miles * 2 : t.miles

// Quotes every field, and stops a spreadsheet treating typed text as a formula
const csvField = (value: string | number) => {
  const text = String(value)
  const safe = typeof value === 'string' && /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
  return `"${safe.replace(/"/g, '""')}"`
}

const tripsToCsv = (trips: Trip[]) => {
  const rows: (string | number)[][] = [['Date', 'From', 'To', 'Business purpose', 'Miles each way', 'Return trip', 'Business miles']]
  for (const t of trips) rows.push([t.date, t.from, t.to, t.purpose, t.miles, t.return_trip ? 'Yes' : 'No', tripMiles(t)])
  return rows.map((row) => row.map(csvField).join(',')).join('\r\n')
}

const readStoredTrips = (): Trip[] | null => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (!Array.isArray(stored)) return null
    return stored.map((t) => ({ date: String(t.date ?? ''), from: String(t.from ?? ''), to: String(t.to ?? ''), purpose: String(t.purpose ?? ''), miles: Math.max(0, Number(t.miles) || 0), return_trip: t.return_trip !== false }))
  } catch {
    return null
  }
}

// Tax year an ISO date falls in, named by the calendar year it starts in (6 April boundary)
const taxYearOf = (date: string) => {
  const [y, m, d] = date.split('-').map(Number)
  return m > 4 || (m === 4 && d >= 6) ? y : y - 1
}

// Car/van AMAP in pence: 55p replaced 45p on 6 Apr 2026, 35p replaces 25p on 6 Apr 2027 (Budget 2026)
const amapPence = (taxYear: number) => ({
  first: taxYear >= 2026 ? 55 : 45,
  over: taxYear >= 2027 ? 35 : 25,
})

const taxYearLabel = (taxYear: number) => `${taxYear}/${String((taxYear + 1) % 100).padStart(2, '0')}`

// Simple mileage log with HMRC rates
export default function BusinessMileageRecordCalculator() {
  const [trips, setTrips] = useState<Trip[]>([
    { date: '2026-04-10', from: 'Home', to: 'Client Office', purpose: 'Client meeting', miles: 25, return_trip: true },
    { date: '2026-04-12', from: 'Home', to: 'Supplier', purpose: 'Collect supplies', miles: 15, return_trip: true },
  ])
  const [storageReady, setStorageReady] = useState(false)
  const [storageWorks, setStorageWorks] = useState(false)

  // Read after mount so the server and first browser render match, and only then start saving
  useEffect(() => {
    const stored = readStoredTrips()
    if (stored) setTrips(stored)
    setStorageReady(true)
  }, [])
  useEffect(() => {
    if (!storageReady) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
      setStorageWorks(true)
    } catch {
      setStorageWorks(false)
    }
  }, [trips, storageReady])

  const addTrip = () => setTrips([...trips, { date: todayLocal(), from: '', to: '', purpose: '', miles: 0, return_trip: true }])
  const removeTrip = (i: number) => setTrips(trips.filter((_, idx) => idx !== i))
  const updateTrip = (i: number, field: string, value: any) => setTrips(trips.map((t, idx) => idx === i ? { ...t, [field]: value } : t))
  const downloadCsv = () => {
    const url = URL.createObjectURL(new Blob([tripsToCsv(trips)], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'business-mileage-log.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const totalMiles = trips.reduce((s, t) => s + tripMiles(t), 0)
  const undatedTrips = trips.filter((t) => !t.date).length

  // HMRC claim: the rates and the 10,000-mile threshold apply separately to each tax year
  const years = useMemo(() => {
    const milesByYear = new Map<number, number>()
    for (const t of trips) {
      if (!t.date) continue
      const year = taxYearOf(t.date)
      milesByYear.set(year, (milesByYear.get(year) ?? 0) + tripMiles(t))
    }
    return [...milesByYear.entries()].sort(([a], [b]) => a - b).map(([year, miles]) => {
      const rates = amapPence(year)
      const firstMiles = Math.min(miles, MILEAGE_THRESHOLD)
      const overMiles = Math.max(0, miles - MILEAGE_THRESHOLD)
      return { year, rates, firstMiles, overMiles, claim: (firstMiles * rates.first + overMiles * rates.over) / 100 }
    })
  }, [trips])
  const totalClaim = years.reduce((s, y) => s + y.claim, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap"><h3 className="text-sm font-semibold">Mileage Log</h3><div className="flex items-center gap-2"><button onClick={downloadCsv} disabled={trips.length === 0} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium disabled:opacity-50">Download CSV</button><button onClick={addTrip} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">+ Add Trip</button></div></div>
      <div className="space-y-2">
        {trips.map((trip, i) => (
          <div key={i} className="flex items-center gap-2 flex-wrap">
            <input type="date" value={trip.date} onChange={(e) => updateTrip(i, 'date', e.target.value)} className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input type="text" value={trip.from} onChange={(e) => updateTrip(i, 'from', e.target.value)} placeholder="From postcode" aria-label="Start postcode" className="w-28 rounded-lg border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <span className="text-xs">→</span>
            <input type="text" value={trip.to} onChange={(e) => updateTrip(i, 'to', e.target.value)} placeholder="To postcode" aria-label="End postcode" className="w-28 rounded-lg border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input type="text" value={trip.purpose} onChange={(e) => updateTrip(i, 'purpose', e.target.value)} placeholder="Business purpose" aria-label="Business purpose" className="w-40 rounded-lg border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input type="number" min="0" value={trip.miles || ''} onChange={(e) => updateTrip(i, 'miles', parseMiles(e.target.value, trip.miles))} placeholder="Mi" aria-label="Miles each way" className="w-16 rounded-lg border border-input bg-background px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring" />
            <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={trip.return_trip} onChange={(e) => updateTrip(i, 'return_trip', e.target.checked)} className="h-4 w-4 rounded" />Return</label>
            <button onClick={() => removeTrip(i)} className="px-1.5 py-1.5 rounded-lg bg-muted hover:bg-destructive/10 text-xs">x</button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in-up">
        <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total Miles</p><p className="text-xl font-bold text-primary">{totalMiles.toLocaleString()}</p></div>
        <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">HMRC Claim</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(totalClaim)}</p></div>
        <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Trips Logged</p><p className="text-xl font-bold">{trips.length}</p></div>
      </div>
      {undatedTrips > 0 && <p className="text-sm text-muted-foreground">{undatedTrips === 1 ? '1 trip has' : `${undatedTrips} trips have`} no date, so the miles are in the total but not in the claim. Add a date to apply the right rate.</p>}
      {years.length > 0 && (
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Tax year</th><th className="text-right py-2 font-medium text-muted-foreground">First 10,000</th><th className="text-right py-2 font-medium text-muted-foreground">Above 10,000</th><th className="text-right py-2 font-medium text-muted-foreground">Claim</th></tr></thead>
          <tbody>{years.map((y) => (
            <tr key={y.year} className="border-b border-border/50"><td className="py-1.5">{taxYearLabel(y.year)}</td><td className="text-right tabular-nums">{y.firstMiles.toLocaleString()} at {y.rates.first}p</td><td className="text-right tabular-nums">{y.overMiles.toLocaleString()} at {y.rates.over}p</td><td className="text-right tabular-nums">{formatCurrency(y.claim)}</td></tr>
          ))}</tbody>
        </table>
      )}
      <p className="text-sm text-muted-foreground">{storageWorks ? 'Your entries are kept only in this browser on this device, and clearing its data removes them. Download a CSV to keep your own copy for your tax records.' : 'Your entries are not saved in this browser, so they will be lost when you leave. Download a CSV to keep them.'}</p>
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>Keep a log of all business trips for tax purposes. Each trip is claimed at the rates for its date, and the 10,000-mile threshold starts again each tax year on 6 April. HMRC car and van rates: 45p then 25p before 6 April 2026, 55p then 25p for 2026/27, and 55p then 35p from 6 April 2027. This log is for a car or van. Don't include commuting (home to regular workplace).</p>
      </div>
    </div>
  )
}
