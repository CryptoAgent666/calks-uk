import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(length: number, width: number, wastePct: number, pricePerSqm: number) {
  const area = length * width
  const withWaste = area * (1 + wastePct / 100)
  const packsNeeded = Math.ceil(withWaste / 2.2) // typical pack covers 2.2 sqm
  const cost = withWaste * pricePerSqm

  return { area, withWaste, packsNeeded, cost }
}

export default function FlooringCalculator() {
  const [length, setLength] = useState('5')
  const [width, setWidth] = useState('4')
  const [waste, setWaste] = useState('10')
  const [price, setPrice] = useState('25')

  const l = parseFloat(length) || 0
  const w = parseFloat(width) || 0
  const wa = parseFloat(waste) || 0
  const p = parseFloat(price) || 0
  const result = useMemo(() => calculate(l, w, wa, p), [l, w, wa, p])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Room Length (m)</label><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Room Width (m)</label><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Wastage (%)</label><input type="number" min="0" max="30" value={waste} onChange={(e) => setWaste(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Price (£/m²)</label><input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {l > 0 && w > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Area Needed</p><p className="text-xl font-bold text-primary">{result.withWaste.toFixed(1)} m²</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Room Area</p><p className="text-lg font-bold">{result.area.toFixed(1)} m²</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Packs (2.2m²)</p><p className="text-lg font-bold">{result.packsNeeded}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Est. Cost</p><p className="text-lg font-bold">{formatCurrency(result.cost)}</p></div>
        </div>
      )}
    </div>
  )
}
