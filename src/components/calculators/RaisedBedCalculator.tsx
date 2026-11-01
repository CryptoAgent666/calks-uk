import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const SLEEPER_LENGTH_MM = 2400
const SLEEPER_HEIGHT_MM = 200

// Cuts each side from 2.4m sleepers, reusing offcuts only where the next piece fits
function countSleepers(lengthM: number, widthM: number, courses: number) {
  const pieces: number[] = []
  for (const side of [lengthM, lengthM, widthM, widthM]) {
    let remaining = Math.round(side * 1000)
    while (remaining > 0) {
      const piece = Math.min(remaining, SLEEPER_LENGTH_MM)
      for (let c = 0; c < courses; c++) pieces.push(piece)
      remaining -= piece
    }
  }
  pieces.sort((a, b) => b - a)

  const offcuts: number[] = []
  for (const piece of pieces) {
    const fit = offcuts.findIndex(left => left >= piece)
    if (fit >= 0) offcuts[fit] -= piece
    else offcuts.push(SLEEPER_LENGTH_MM - piece)
  }
  return offcuts.length
}

function calculate(length: number, width: number, depth: number, pricePerBag: number, bagLitres: number) {
  const volumeM3 = length * width * (depth / 1000)
  const litres = volumeM3 * 1000
  const bags = Math.ceil(Math.round(litres * 1000) / 1000 / bagLitres)
  const cost = bags * pricePerBag
  const courses = Math.ceil(depth / SLEEPER_HEIGHT_MM)
  const sleepers = length > 0 && width > 0 && courses > 0 ? countSleepers(length, width, courses) : 0
  // RHS mix for most beds: 7 parts topsoil, 3 organic matter, 2 sharp sand
  const mix = { topsoil: (litres * 7) / 12, organic: (litres * 3) / 12, sand: (litres * 2) / 12 }

  return { volumeM3, litres, bags, cost, courses, sleepers, mix }
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
  const p = Math.max(0, parseFloat(price) || 0)
  const bs = parseFloat(bagSize) || 50
  const result = useMemo(() => calculate(l, w, d, p, bs), [l, w, d, p, bs])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Length (m)</label><input type="number" min="0.5" max="10" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Length (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Width (m)</label><input type="number" min="0.5" max="5" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Width (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Depth (mm)</label><input type="number" min="100" max="600" step="50" value={depth} onChange={(e) => setDepth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Depth (mm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Bag Price (£)</label><input type="number" min="0" step="0.5" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Bag Price (£)" /></div>
        <div><label className="block text-sm font-medium mb-2">Bag Size (litres)</label><select value={bagSize} onChange={(e) => setBagSize(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Bag Size (litres)"><option value="40">40L</option><option value="50">50L</option><option value="60">60L</option><option value="100">100L</option></select></div>
      </div>

      {l > 0 && w > 0 && d > 0 && (
        <div className="space-y-3 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Soil Needed</p><p className="text-xl font-bold text-primary">{Math.round(result.litres).toLocaleString('en-GB')} litres</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">{bs}L Bags</p><p className="text-lg font-bold">{result.bags}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Soil Cost</p><p className="text-lg font-bold">{formatCurrency(result.cost)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Sleepers (2.4m)</p><p className="text-lg font-bold">{result.sleepers}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p>RHS mix for most beds (7:3:2): {Math.round(result.mix.topsoil).toLocaleString('en-GB')} L topsoil, {Math.round(result.mix.organic).toLocaleString('en-GB')} L organic matter, {Math.round(result.mix.sand).toLocaleString('en-GB')} L sharp sand.</p>
            <p>Sleepers are 200 by 100 mm, in {result.courses} {result.courses === 1 ? 'course' : 'courses'} ({(result.courses * SLEEPER_HEIGHT_MM).toLocaleString('en-GB')} mm high), with offcuts reused where they fit. Soil uses your length and width as inside measurements; the sleeper count uses the same figures, with nothing added for corners or saw cuts.</p>
            <p>The RHS says 300 mm is deep enough for dwarf bulbs, salad leaves and strawberries, and most other plants need 450 mm or more.</p>
          </div>
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
