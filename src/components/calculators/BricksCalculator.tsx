import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type BrickSize = 'standard' | 'engineering' | 'modular'
const SIZES: Record<BrickSize, { w: number; h: number; name: string }> = {
  standard: { w: 215, h: 65, name: 'Standard (215x102x65mm)' },
  engineering: { w: 215, h: 65, name: 'Engineering (215x102x65mm)' },
  modular: { w: 190, h: 90, name: 'Modular (190x90x90mm)' },
}

function calculate(wallLength: number, wallHeight: number, openings: number, brickSize: BrickSize, mortar: number, wastePct: number, pricePerBrick: number) {
  const brick = SIZES[brickSize]
  const wallArea = wallLength * wallHeight - openings
  // Standard: ~60 bricks per m² for half-brick wall
  const brickW = (brick.w + mortar) / 1000
  const brickH = (brick.h + mortar) / 1000
  const bricksPerM2 = 1 / (brickW * brickH)
  const bricksRaw = wallArea * bricksPerM2
  const bricksNeeded = Math.ceil(bricksRaw * (1 + wastePct / 100))
  const cost = bricksNeeded * pricePerBrick
  // Mortar: ~0.03m³ per m² for half-brick
  const mortarM3 = wallArea * 0.03
  const sandKg = Math.ceil(mortarM3 * 1500)
  const cementBags = Math.ceil(mortarM3 * 300 / 25) // ~300kg cement per m³, 25kg bags

  return { wallArea, bricksPerM2: Math.round(bricksPerM2), bricksNeeded, cost, sandKg, cementBags }
}

export default function BricksCalculator() {
  const [length, setLength] = useState('5')
  const [height, setHeight] = useState('2.4')
  const [openings, setOpenings] = useState('3.6')
  const [size, setSize] = useState<BrickSize>('standard')
  const [mortar, setMortar] = useState('10')
  const [waste, setWaste] = useState('5')
  const [price, setPrice] = useState('0.50')

  const result = useMemo(() => calculate(parseFloat(length)||0, parseFloat(height)||0, parseFloat(openings)||0, size, parseFloat(mortar)||10, parseFloat(waste)||5, parseFloat(price)||0), [length, height, openings, size, mortar, waste, price])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Wall Length (m)</label><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Wall Height (m)</label><input type="number" min="0" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Openings Area (m²)</label><input type="number" min="0" step="0.1" value={openings} onChange={(e) => setOpenings(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Brick Type</label><select value={size} onChange={(e) => setSize(e.target.value as BrickSize)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring">{Object.entries(SIZES).map(([k,v]) => <option key={k} value={k}>{v.name}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Wastage (%)</label><input type="number" min="0" max="20" value={waste} onChange={(e) => setWaste(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Price/Brick (£)</label><input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {result.bricksNeeded > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Bricks Needed</p><p className="text-xl font-bold text-primary">{result.bricksNeeded.toLocaleString()}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Brick Cost</p><p className="text-lg font-bold">{formatCurrency(result.cost)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Wall Area</p><p className="text-lg font-bold">{result.wallArea.toFixed(1)} m²</p></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Sand</p><p className="text-lg font-bold">{result.sandKg} kg</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Cement (25kg bags)</p><p className="text-lg font-bold">{result.cementBags}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
