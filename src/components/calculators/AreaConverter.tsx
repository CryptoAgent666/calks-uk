import { useState, useMemo } from 'react'

const UNITS = [
  { id: 'sqm', name: 'Square Metres (m²)', toSqm: 1 },
  { id: 'sqft', name: 'Square Feet (ft²)', toSqm: 0.092903 },
  { id: 'sqyd', name: 'Square Yards (yd²)', toSqm: 0.836127 },
  { id: 'acre', name: 'Acres', toSqm: 4046.86 },
  { id: 'hectare', name: 'Hectares', toSqm: 10000 },
  { id: 'sqkm', name: 'Square Kilometres (km²)', toSqm: 1000000 },
  { id: 'sqmi', name: 'Square Miles (mi²)', toSqm: 2589988 },
  { id: 'sqcm', name: 'Square Centimetres (cm²)', toSqm: 0.0001 },
]

function convert(value: number, fromId: string) {
  const from = UNITS.find(u => u.id === fromId)
  if (!from) return []
  const sqm = value * from.toSqm
  return UNITS.map(u => ({ id: u.id, name: u.name, value: sqm / u.toSqm }))
}

export default function AreaConverter() {
  const [value, setValue] = useState('100')
  const [from, setFrom] = useState('sqm')
  const v = parseFloat(value) || 0
  const results = useMemo(() => convert(v, from), [v, from])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Value</label><input type="number" min="0" step="any" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Value" /></div>
        <div><label className="block text-sm font-medium mb-2">From</label><select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="From">{UNITS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
      </div>

      {v > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 animate-fade-in-up">
          {results.filter(r => r.id !== from).map(r => (
            <div key={r.id} className="rounded-xl border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground">{r.name}</p>
              <p className="text-sm font-bold">{r.value < 0.01 ? r.value.toExponential(2) : r.value < 100 ? r.value.toFixed(4) : r.value.toLocaleString('en-GB', { maximumFractionDigits: 2 })}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
