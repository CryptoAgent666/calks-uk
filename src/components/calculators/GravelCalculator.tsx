import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const DENSITY_T_PER_M3 = 1.6 // an 800 kg bulk bag covers about 10 m² at 50 mm (Stone Warehouse): 0.8 t / 0.5 m³
const BULK_BAG_M3 = 0.5
const BULK_BAG_TONNES = 0.8

function calculate(length: number, width: number, depth: number, pricePerTonne: number) {
  const volumeM3 = length * width * (depth / 1000) // depth in mm
  const tonnes = volumeM3 * DENSITY_T_PER_M3
  // Whole bags only. The small tolerance stops float noise adding a bag (4 x 3 m x 50 mm is 0.6000000000000001 m³, not 0.6).
  const bags = Math.ceil((tonnes * 1000) / 25 - 1e-9) // 25kg bags
  const bulkBags = Math.ceil(volumeM3 / BULK_BAG_M3 - 1e-9)
  const cost = tonnes * pricePerTonne
  const bulkBagsCost = bulkBags * BULK_BAG_TONNES * pricePerTonne

  return { volumeM3, tonnes, bags, bulkBags, cost, bulkBagsCost }
}

export default function GravelCalculator() {
  const [length, setLength] = useState('5')
  const [width, setWidth] = useState('3')
  const [depth, setDepth] = useState('50')
  const [price, setPrice] = useState('95')

  const l = parseFloat(length) || 0
  const w = parseFloat(width) || 0
  const d = parseFloat(depth) || 0
  const p = parseFloat(price) || 0
  const result = useMemo(() => calculate(l, w, d, p), [l, w, d, p])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Length (m)</label><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Length (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Width (m)</label><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Width (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Depth (mm)</label><input type="number" min="0" max="500" value={depth} onChange={(e) => setDepth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Depth (mm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Price (£/tonne)</label><input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Price (£/tonne)" /></div>
      </div>

      {l > 0 && w > 0 && d > 0 && (
        <div className="space-y-3 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Volume</p><p className="text-xl font-bold text-primary">{result.volumeM3.toFixed(2)} m³</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Weight</p><p className="text-lg font-bold">{result.tonnes.toFixed(2)} tonnes</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Bulk Bags (800kg)</p><p className="text-lg font-bold">{result.bulkBags}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">25kg Bags</p><p className="text-lg font-bold">{result.bags}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Est. Cost</p><p className="text-lg font-bold">{formatCurrency(result.cost)}</p></div>
          </div>
          <p className="text-xs text-muted-foreground">Cost is for the weight needed at 1.6 t/m³. {result.bulkBags} whole bulk bag{result.bulkBags === 1 ? '' : 's'} at this price would be {formatCurrency(result.bulkBagsCost)}. Delivery may be extra.</p>
        </div>
      )}
    </div>
  )
}
