import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(length: number, width: number, depth: number, pricePerBag: number) {
  const volumeM3 = length * width * (depth / 1000) // depth in mm
  const litres = volumeM3 * 1000
  const bags50L = Math.ceil(litres / 50)
  const bags100L = Math.ceil(litres / 100)
  const cost50 = bags50L * pricePerBag
  return { volumeM3, litres, bags50L, bags100L, cost50 }
}

export default function MulchCalculator() {
  const [length, setLength] = useState('6')
  const [width, setWidth] = useState('2')
  const [depth, setDepth] = useState('75')
  const [price, setPrice] = useState('5')
  const result = useMemo(() => calculate(parseFloat(length)||0, parseFloat(width)||0, parseFloat(depth)||0, parseFloat(price)||0), [length, width, depth, price])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Length (m)</label><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Length (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Width (m)</label><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Width (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Depth (mm)</label><input type="number" min="0" max="200" value={depth} onChange={(e) => setDepth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Depth (mm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Price/50L Bag (£)</label><input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Price/50L Bag (£)" /></div>
      </div>
      {result.volumeM3 > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Volume</p><p className="text-xl font-bold text-primary">{result.litres.toFixed(0)} litres</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">50L Bags</p><p className="text-lg font-bold">{result.bags50L}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">100L Bags</p><p className="text-lg font-bold">{result.bags100L}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Est. Cost</p><p className="text-lg font-bold">{formatCurrency(result.cost50)}</p></div>
        </div>
      )}
    </div>
  )
}
