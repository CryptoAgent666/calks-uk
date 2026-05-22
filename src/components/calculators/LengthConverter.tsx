import { useState, useMemo } from 'react'

const UNITS = [
  { id: 'mm', name: 'Millimetres', toM: 0.001 },
  { id: 'cm', name: 'Centimetres', toM: 0.01 },
  { id: 'm', name: 'Metres', toM: 1 },
  { id: 'km', name: 'Kilometres', toM: 1000 },
  { id: 'in', name: 'Inches', toM: 0.0254 },
  { id: 'ft', name: 'Feet', toM: 0.3048 },
  { id: 'yd', name: 'Yards', toM: 0.9144 },
  { id: 'mi', name: 'Miles', toM: 1609.34 },
  { id: 'nmi', name: 'Nautical Miles', toM: 1852 },
]

function convert(value: number, fromId: string) {
  const from = UNITS.find(u => u.id === fromId)
  if (!from) return []
  const metres = value * from.toM
  return UNITS.map(u => ({ id: u.id, name: u.name, value: metres / u.toM }))
}

export default function LengthConverter() {
  const [value, setValue] = useState('100')
  const [from, setFrom] = useState('cm')
  const v = parseFloat(value) || 0
  const results = useMemo(() => convert(v, from), [v, from])

  // Feet and inches display
  const totalInches = v * (UNITS.find(u => u.id === from)?.toM || 0) / 0.0254
  const feet = Math.floor(totalInches / 12)
  const inches = (totalInches % 12).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Value</label><input type="number" min="0" step="any" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Value" /></div>
        <div><label className="block text-sm font-medium mb-2">From</label><select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="From">{UNITS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
      </div>

      {v > 0 && (
        <div className="space-y-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center">
            <p className="text-sm text-muted-foreground">Feet & Inches</p>
            <p className="text-2xl font-bold text-primary">{feet}' {inches}"</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
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
