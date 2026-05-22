import { useState, useMemo } from 'react'

const UNITS = [
  { id: 'kg', name: 'Kilograms (kg)', toKg: 1 },
  { id: 'g', name: 'Grams (g)', toKg: 0.001 },
  { id: 'lb', name: 'Pounds (lb)', toKg: 0.453592 },
  { id: 'oz', name: 'Ounces (oz)', toKg: 0.0283495 },
  { id: 'st', name: 'Stone (st)', toKg: 6.35029 },
  { id: 'st_lb', name: 'Stone & Pounds', toKg: 1 }, // special
  { id: 'mg', name: 'Milligrams (mg)', toKg: 0.000001 },
  { id: 'tonne', name: 'Tonnes (t)', toKg: 1000 },
  { id: 'us_ton', name: 'US Tons', toKg: 907.185 },
  { id: 'uk_ton', name: 'Imperial Tons', toKg: 1016.05 },
]

function convert(value: number, fromId: string) {
  const from = UNITS.find(u => u.id === fromId)
  if (!from || value === 0) return []
  const kg = value * from.toKg
  return UNITS.filter(u => u.id !== 'st_lb').map(u => ({
    id: u.id, name: u.name, value: kg / u.toKg,
  }))
}

export default function UnitConverterWeight() {
  const [value, setValue] = useState('75')
  const [from, setFrom] = useState('kg')

  const v = parseFloat(value) || 0
  const results = useMemo(() => convert(v, from), [v, from])

  // Stone & pounds special display
  const kg = v * (UNITS.find(u => u.id === from)?.toKg || 1)
  const totalLbs = kg / 0.453592
  const stone = Math.floor(totalLbs / 14)
  const lbs = (totalLbs % 14).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Value</label>
          <input type="number" min="0" step="any" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Value" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="From">
            {UNITS.filter(u => u.id !== 'st_lb').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
      </div>

      {v > 0 && (
        <div className="space-y-3 animate-fade-in-up">
          {/* Special: stone & pounds */}
          <div className="rounded-xl bg-primary/10 p-4 text-center">
            <p className="text-sm text-muted-foreground">Stone & Pounds</p>
            <p className="text-2xl font-bold text-primary">{stone} st {lbs} lb</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {results.filter(r => r.id !== from).map(r => (
              <div key={r.id} className="rounded-xl border border-border p-3 text-center">
                <p className="text-xs text-muted-foreground">{r.name}</p>
                <p className="text-sm font-bold">{r.value < 0.01 ? r.value.toExponential(2) : r.value < 100 ? r.value.toFixed(2) : r.value.toLocaleString('en-GB', { maximumFractionDigits: 2 })}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
