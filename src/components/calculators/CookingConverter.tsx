import { useState, useMemo } from 'react'

type Unit = { id: string; name: string; factor: number }

// factor = base units per 1 of this unit (ml for volume, g for weight)
const CATEGORIES: Record<'volume' | 'weight' | 'temperature', { name: string; units: Unit[] }> = {
  volume: {
    name: 'Volume',
    units: [
      { id: 'ml', name: 'Millilitres (ml)', factor: 1 },
      { id: 'l', name: 'Litres (L)', factor: 1000 },
      { id: 'tsp', name: 'Teaspoons (tsp)', factor: 5 },
      { id: 'tbsp', name: 'Tablespoons (tbsp)', factor: 15 },
      { id: 'floz', name: 'Fluid Ounces (fl oz)', factor: 28.4131 },
      { id: 'cup_uk', name: 'Cups (UK)', factor: 284.131 },
      { id: 'cup_us', name: 'Cups (US)', factor: 236.588 },
      { id: 'pint', name: 'Pints (UK)', factor: 568.261 },
      { id: 'gill', name: 'Gills', factor: 142.065 },
    ],
  },
  weight: {
    name: 'Weight',
    units: [
      { id: 'g', name: 'Grams (g)', factor: 1 },
      { id: 'kg', name: 'Kilograms (kg)', factor: 1000 },
      { id: 'oz', name: 'Ounces (oz)', factor: 28.3495 },
      { id: 'lb', name: 'Pounds (lb)', factor: 453.592 },
    ],
  },
  temperature: {
    name: 'Oven Temperature',
    units: [],
  },
}

const GAS_MARKS = [
  { gas: '1/4', c: 110, f: 225 }, { gas: '1/2', c: 130, f: 250 },
  { gas: '1', c: 140, f: 275 }, { gas: '2', c: 150, f: 300 },
  { gas: '3', c: 160, f: 325 }, { gas: '4', c: 180, f: 350 },
  { gas: '5', c: 190, f: 375 }, { gas: '6', c: 200, f: 400 },
  { gas: '7', c: 220, f: 425 }, { gas: '8', c: 230, f: 450 },
  { gas: '9', c: 240, f: 475 },
]

export default function CookingConverter() {
  const [cat, setCat] = useState<'volume' | 'weight' | 'temperature'>('volume')
  const [value, setValue] = useState('250')
  const [from, setFrom] = useState('ml')

  const units = cat === 'volume' ? CATEGORIES.volume.units : CATEGORIES.weight.units
  const v = parseFloat(value) || 0

  const results = useMemo(() => {
    if (cat === 'temperature') return []
    const fromUnit = units.find(u => u.id === from)
    if (!fromUnit) return []
    const base = v * fromUnit.factor
    return units.map(u => ({
      id: u.id, name: u.name,
      value: base / (u.factor || 1),
    }))
  }, [cat, v, from, units])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {(['volume', 'weight', 'temperature'] as const).map(c => (
          <button key={c} onClick={() => { setCat(c); if (c === 'volume') setFrom('ml'); else if (c === 'weight') setFrom('g') }} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${cat === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{CATEGORIES[c].name}</button>
        ))}
      </div>

      {cat !== 'temperature' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-2">Value</label><input type="number" min="0" step="any" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Value" /></div>
            <div><label className="block text-sm font-medium mb-2">From</label><select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="From">{units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
          </div>
          {v > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 animate-fade-in-up">
              {results.filter(r => r.id !== from).map(r => (
                <div key={r.id} className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">{r.name}</p><p className="text-sm font-bold">{r.value < 1 ? r.value.toFixed(3) : r.value.toFixed(2)}</p></div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Gas Mark</th><th className="text-right py-2 font-medium text-muted-foreground">°C</th><th className="text-right py-2 font-medium text-muted-foreground">°F</th><th className="text-right py-2 font-medium text-muted-foreground">Fan °C</th></tr></thead>
            <tbody>{GAS_MARKS.map(g => (
              <tr key={g.gas} className="border-b border-border/50"><td className="py-2 font-medium">Gas {g.gas}</td><td className="text-right tabular-nums">{g.c}°C</td><td className="text-right tabular-nums">{g.f}°F</td><td className="text-right tabular-nums">{g.c - 20}°C</td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
