import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(lengthM: number, widthMm: number, heightMm: number, quantity: number, pricePerM: number) {
  const volumePerPiece = (lengthM * (widthMm / 1000) * (heightMm / 1000))
  const totalVolume = volumePerPiece * quantity
  const totalLength = lengthM * quantity
  const totalCost = totalLength * pricePerM

  return { volumePerPiece, totalVolume, totalLength, totalCost }
}

export default function TimberCalculator() {
  const [length, setLength] = useState('2.4')
  const [width, setWidth] = useState('100')
  const [height, setHeight] = useState('50')
  const [qty, setQty] = useState('10')
  const [price, setPrice] = useState('3.50')

  const l = parseFloat(length) || 0
  const w = parseFloat(width) || 0
  const h = parseFloat(height) || 0
  const q = parseInt(qty) || 0
  const p = parseFloat(price) || 0
  const result = useMemo(() => calculate(l, w, h, q, p), [l, w, h, q, p])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Length (m)</label><input type="number" min="0" max="6" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Length (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Width (mm)</label><input type="number" min="10" max="300" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Width (mm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Thickness (mm)</label><input type="number" min="10" max="200" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Thickness (mm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Quantity</label><input type="number" min="1" max="200" value={qty} onChange={(e) => setQty(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Quantity" /></div>
        <div><label className="block text-sm font-medium mb-2">Price (£/m)</label><input type="number" min="0" step="0.1" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Price (£/m)" /></div>
      </div>
      <div className="flex flex-wrap gap-2">{[{l:'25x50mm',w:50,h:25},{l:'47x100mm',w:100,h:47},{l:'47x150mm',w:150,h:47},{l:'100x100mm',w:100,h:100}].map(s => <button key={s.l} onClick={() => {setWidth(s.w.toString());setHeight(s.h.toString())}} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent">{s.l}</button>)}</div>

      {q > 0 && l > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total Length</p><p className="text-xl font-bold text-primary">{result.totalLength.toFixed(1)}m</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Volume</p><p className="text-lg font-bold">{result.totalVolume.toFixed(3)} m³</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Per Piece</p><p className="text-lg font-bold">{result.volumePerPiece.toFixed(4)} m³</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Est. Cost</p><p className="text-lg font-bold">{formatCurrency(result.totalCost)}</p></div>
        </div>
      )}
    </div>
  )
}
