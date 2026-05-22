import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type Purpose = 'new' | 'overseed' | 'repair'
const RATES: Record<Purpose, number> = { new: 35, overseed: 20, repair: 25 } // g/m²

function calculate(length: number, width: number, purpose: Purpose, pricePerKg: number) {
  const area = length * width
  const rate = RATES[purpose]
  const seedGrams = area * rate
  const seedKg = seedGrams / 1000
  const bags1kg = Math.ceil(seedKg)
  const cost = seedKg * pricePerKg

  return { area, rate, seedKg, bags1kg, cost }
}

export default function LawnSeedCalculator() {
  const [length, setLength] = useState('10')
  const [width, setWidth] = useState('8')
  const [purpose, setPurpose] = useState<Purpose>('new')
  const [price, setPrice] = useState('15')

  const l = parseFloat(length) || 0
  const w = parseFloat(width) || 0
  const p = parseFloat(price) || 0
  const result = useMemo(() => calculate(l, w, purpose, p), [l, w, purpose, p])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Purpose</label>
        <div className="grid grid-cols-3 gap-2">
          {([{ v: 'new' as Purpose, l: 'New Lawn', d: `${RATES.new}g/m²` }, { v: 'overseed' as Purpose, l: 'Overseed', d: `${RATES.overseed}g/m²` }, { v: 'repair' as Purpose, l: 'Repair Patches', d: `${RATES.repair}g/m²` }]).map(o => (
            <button key={o.v} onClick={() => setPurpose(o.v)} className={`px-4 py-3 rounded-xl text-sm text-left transition-colors border ${purpose === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
              <div className="font-medium">{o.l}</div>
              <div className={`text-xs ${purpose === o.v ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{o.d}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Length (m)</label><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Length (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Width (m)</label><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Width (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Seed Price (£/kg)</label><input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Seed Price (£/kg)" /></div>
      </div>

      {l > 0 && w > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Seed Needed</p><p className="text-xl font-bold text-primary">{result.seedKg.toFixed(1)} kg</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">1kg Bags</p><p className="text-lg font-bold">{result.bags1kg}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Lawn Area</p><p className="text-lg font-bold">{result.area.toFixed(0)} m²</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Est. Cost</p><p className="text-lg font-bold">{formatCurrency(result.cost)}</p></div>
        </div>
      )}
    </div>
  )
}
