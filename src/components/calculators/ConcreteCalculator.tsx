import { useState, useMemo } from 'react'

type Shape = 'slab' | 'column' | 'footing'

// Wickes: "One 20kg bag will typically produce around 0.01m3 of fresh concrete".
// The same rate per kilo gives 0.0125 m³ for a 25 kg bag.
const M3_PER_KG = 0.01 / 20
const bagsFor = (volumeM3: number, kg: number) => Math.ceil(volumeM3 / (kg * M3_PER_KG) - 1e-9)

function calculate(shape: Shape, length: number, width: number, depth: number, diameter: number, height: number, wastagePct: number) {
  let volumeM3: number

  switch (shape) {
    case 'slab':
      volumeM3 = (length * width * depth) / 1_000_000_000 // mm to m3
      break
    case 'column':
      const radiusM = (diameter / 2) / 1000
      volumeM3 = Math.PI * radiusM * radiusM * (height / 1000)
      break
    case 'footing':
      volumeM3 = (length * width * depth) / 1_000_000_000
      break
    default:
      volumeM3 = 0
  }

  const orderM3 = volumeM3 * (1 + Math.max(0, wastagePct) / 100)
  const bags25kg = bagsFor(orderM3, 25)
  const bags20kg = bagsFor(orderM3, 20)
  const tonnes = orderM3 * 2.4 // concrete density ~2400 kg/m3

  return { volumeM3, orderM3, bags25kg, bags20kg, tonnes }
}

// Post holes are far smaller than 0.1 m³, so two decimals would round them to nothing
const fmtVolume = (m3: number) => (m3 < 0.0005 ? '<0.001' : m3 < 0.1 ? m3.toFixed(3) : m3.toFixed(2))
const fmtWeight = (tonnes: number) => (tonnes < 0.1 ? `${Math.max(1, Math.round(tonnes * 1000))} kg` : `${tonnes.toFixed(2)} tonnes`)

export default function ConcreteCalculator() {
  const [shape, setShape] = useState<Shape>('slab')
  const [length, setLength] = useState('3000')
  const [width, setWidth] = useState('3000')
  const [depth, setDepth] = useState('100')
  const [diameter, setDiameter] = useState('300')
  const [height, setHeight] = useState('1000')
  const [wastage, setWastage] = useState('10')

  const l = parseFloat(length) || 0
  const w = parseFloat(width) || 0
  const d = parseFloat(depth) || 0
  const dia = parseFloat(diameter) || 0
  const h = parseFloat(height) || 0
  const waste = parseFloat(wastage) || 0
  const result = useMemo(() => calculate(shape, l, w, d, dia, h, waste), [shape, l, w, d, dia, h, waste])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Shape</label>
        <div className="grid grid-cols-3 gap-2">
          {([{ v: 'slab' as Shape, l: 'Slab / Path' }, { v: 'column' as Shape, l: 'Column / Post' }, { v: 'footing' as Shape, l: 'Footing / Strip' }]).map((o) => (
            <button key={o.v} onClick={() => setShape(o.v)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${shape === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{o.l}</button>
          ))}
        </div>
      </div>

      {shape !== 'column' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div><label className="block text-sm font-medium mb-2">Length (mm)</label><input type="number" min="0" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Length (mm)" /></div>
          <div><label className="block text-sm font-medium mb-2">Width (mm)</label><input type="number" min="0" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Width (mm)" /></div>
          <div><label className="block text-sm font-medium mb-2">Depth (mm)</label><input type="number" min="0" value={depth} onChange={(e) => setDepth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Depth (mm)" /></div>
          <div><label className="block text-sm font-medium mb-2">Wastage (%)</label><input type="number" min="0" max="50" value={wastage} onChange={(e) => setWastage(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Wastage (%)" /></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-2">Diameter (mm)</label><input type="number" min="0" value={diameter} onChange={(e) => setDiameter(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Diameter (mm)" /></div>
          <div><label className="block text-sm font-medium mb-2">Height (mm)</label><input type="number" min="0" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Height (mm)" /></div>
          <div><label className="block text-sm font-medium mb-2">Wastage (%)</label><input type="number" min="0" max="50" value={wastage} onChange={(e) => setWastage(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Wastage (%)" /></div>
        </div>
      )}

      {result.volumeM3 > 0 && (
        <div className="space-y-3 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Volume</p><p className="text-xl font-bold text-primary">{fmtVolume(result.volumeM3)} m³</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">With Wastage</p><p className="text-lg font-bold">{fmtVolume(result.orderM3)} m³</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Weight</p><p className="text-lg font-bold">{fmtWeight(result.tonnes)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">25kg Bags</p><p className="text-lg font-bold">{result.bags25kg}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">20kg Bags</p><p className="text-lg font-bold">{result.bags20kg}</p></div>
          </div>
          <p className="text-xs text-muted-foreground">Weight and bags include wastage. Bags assume about 0.01 m³ from a 20 kg bag (Wickes) and the same rate for 25 kg, so 0.0125 m³. Check the yield on the bag you buy.</p>
        </div>
      )}
    </div>
  )
}
