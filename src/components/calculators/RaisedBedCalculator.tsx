import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(length: number, width: number, depth: number, pricePerBag: number, bagLitres: number) {
  const volumeM3 = length * width * (depth / 1000)
  const litres = volumeM3 * 1000
  const bags = Math.ceil(litres / bagLitres)
  const cost = bags * pricePerBag
  const perimeterM = 2 * (length + width)
  // Timber: assuming sleepers 2.4m x 200mm x 100mm
  const sleeperLengthNeeded = perimeterM * Math.ceil(depth / 200)
  const sleepers = Math.ceil(sleeperLengthNeeded / 2.4)

  return { volumeM3, litres, bags, cost, perimeterM, sleepers }
}

export default function RaisedBedCalculator() {
  const [length, setLength] = useState('2.4')
  const [width, setWidth] = useState('1.2')
  const [depth, setDepth] = useState('300')
  const [price, setPrice] = useState('6')
  const [bagSize, setBagSize] = useState('50')

  const l = parseFloat(length) || 0
  const w = parseFloat(width) || 0
  const d = parseFloat(depth) || 0
  const p = parseFloat(price) || 0
  const bs = parseFloat(bagSize) || 50
  const result = useMemo(() => calculate(l, w, d, p, bs), [l, w, d, p, bs])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Length (m)</label><input type="number" min="0.5" max="10" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Length (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Width (m)</label><input type="number" min="0.5" max="5" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Width (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Depth (mm)</label><input type="number" min="100" max="600" step="50" value={depth} onChange={(e) => setDepth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Depth (mm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Bag Price (£)</label><input type="number" min="0" step="0.5" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Bag Price (£)" /></div>
        <div><label className="block text-sm font-medium mb-2">Bag Size (litres)</label><select value={bagSize} onChange={(e) => setBagSize(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Bag Size (litres)"><option value="40">40L</option><option value="50">50L</option><option value="60">60L</option><option value="100">100L (bulk bag)</option></select></div>
      </div>

      {l > 0 && w > 0 && d > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Soil Needed</p><p className="text-xl font-bold text-primary">{result.litres.toFixed(0)} litres</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">{bs}L Bags</p><p className="text-lg font-bold">{result.bags}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Soil Cost</p><p className="text-lg font-bold">{formatCurrency(result.cost)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Sleepers (2.4m)</p><p className="text-lg font-bold">{result.sleepers}</p></div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {[{l:'4x4ft',lm:1.2,wm:1.2},{l:'8x4ft',lm:2.4,wm:1.2},{l:'6x3ft',lm:1.8,wm:0.9},{l:'10x4ft',lm:3,wm:1.2}].map(p => (
          <button key={p.l} onClick={() => {setLength(p.lm.toString()); setWidth(p.wm.toString())}} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">{p.l}</button>
        ))}
      </div>
    </div>
  )
}
