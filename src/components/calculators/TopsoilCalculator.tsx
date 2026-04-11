import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(length: number, width: number, depth: number, pricePerTonne: number) {
  const volumeM3 = length * width * (depth / 1000)
  const tonnes = volumeM3 * 1.3 // topsoil ~1300 kg/m3
  const bags = Math.ceil(tonnes * 1000 / 25)
  const cost = tonnes * pricePerTonne

  return { volumeM3, tonnes, bags, cost }
}

export default function TopsoilCalculator() {
  const [length, setLength] = useState('5')
  const [width, setWidth] = useState('3')
  const [depth, setDepth] = useState('150')
  const [price, setPrice] = useState('35')

  const result = useMemo(() => calculate(parseFloat(length)||0, parseFloat(width)||0, parseFloat(depth)||0, parseFloat(price)||0), [length, width, depth, price])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Length (m)</label><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Width (m)</label><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Depth (mm)</label><input type="number" min="0" max="500" value={depth} onChange={(e) => setDepth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Price (£/tonne)</label><input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>
      {result.volumeM3 > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Volume</p><p className="text-xl font-bold text-primary">{result.volumeM3.toFixed(2)} m³</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Weight</p><p className="text-lg font-bold">{result.tonnes.toFixed(2)} tonnes</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">25kg Bags</p><p className="text-lg font-bold">{result.bags}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Est. Cost</p><p className="text-lg font-bold">{formatCurrency(result.cost)}</p></div>
        </div>
      )}
    </div>
  )
}
