import { useState, useMemo } from 'react'

const UNITS = [
  { id: 'ml', name: 'Millilitres (ml)', toMl: 1 },
  { id: 'l', name: 'Litres (L)', toMl: 1000 },
  { id: 'cl', name: 'Centilitres (cl)', toMl: 10 },
  { id: 'floz', name: 'Fluid Ounces (UK)', toMl: 28.4131 },
  { id: 'cup_us', name: 'Cups (US)', toMl: 236.588 },
  { id: 'pint_uk', name: 'Pints (UK)', toMl: 568.261 },
  { id: 'pint_us', name: 'Pints (US)', toMl: 473.176 },
  { id: 'gallon_uk', name: 'Gallons (UK)', toMl: 4546.09 },
  { id: 'gallon_us', name: 'Gallons (US)', toMl: 3785.41 },
  { id: 'tbsp', name: 'Tablespoons', toMl: 15 },
  { id: 'tsp', name: 'Teaspoons', toMl: 5 },
  { id: 'm3', name: 'Cubic Metres (m³)', toMl: 1000000 },
  { id: 'cm3', name: 'Cubic Centimetres (cm³)', toMl: 1 },
]

function convert(value: number, fromId: string) {
  const from = UNITS.find(u => u.id === fromId)
  if (!from) return []
  const ml = value * from.toMl
  return UNITS.map(u => ({ id: u.id, name: u.name, value: ml / u.toMl }))
}

export default function VolumeConverter() {
  const [value, setValue] = useState('1')
  const [from, setFrom] = useState('l')
  const v = parseFloat(value) || 0
  const results = useMemo(() => convert(v, from), [v, from])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Value</label><input type="number" min="0" step="any" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">From</label><select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring">{UNITS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
      </div>

      {v > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 animate-fade-in-up">
          {results.filter(r => r.id !== from).map(r => (
            <div key={r.id} className="rounded-xl border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground">{r.name}</p>
              <p className="text-sm font-bold">{r.value < 0.01 ? r.value.toExponential(2) : r.value < 100 ? r.value.toFixed(3) : r.value.toLocaleString('en-GB', { maximumFractionDigits: 2 })}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
