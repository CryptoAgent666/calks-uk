import { useState, useMemo } from 'react'

type Shape = 'slab' | 'column' | 'footing'

function calculate(shape: Shape, length: number, width: number, depth: number, diameter: number, height: number) {
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

  const bags25kg = Math.ceil(volumeM3 / 0.012) // ~0.012 m3 per 25kg bag
  const bags20kg = Math.ceil(volumeM3 / 0.01)
  const tonnes = volumeM3 * 2.4 // concrete density ~2400 kg/m3

  return { volumeM3, bags25kg, bags20kg, tonnes }
}

export default function ConcreteCalculator() {
  const [shape, setShape] = useState<Shape>('slab')
  const [length, setLength] = useState('3000')
  const [width, setWidth] = useState('3000')
  const [depth, setDepth] = useState('100')
  const [diameter, setDiameter] = useState('300')
  const [height, setHeight] = useState('1000')

  const l = parseFloat(length) || 0
  const w = parseFloat(width) || 0
  const d = parseFloat(depth) || 0
  const dia = parseFloat(diameter) || 0
  const h = parseFloat(height) || 0
  const result = useMemo(() => calculate(shape, l, w, d, dia, h), [shape, l, w, d, dia, h])

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
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-2">Length (mm)</label><input type="number" min="0" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div><label className="block text-sm font-medium mb-2">Width (mm)</label><input type="number" min="0" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div><label className="block text-sm font-medium mb-2">Depth (mm)</label><input type="number" min="0" value={depth} onChange={(e) => setDepth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">Diameter (mm)</label><input type="number" min="0" value={diameter} onChange={(e) => setDiameter(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div><label className="block text-sm font-medium mb-2">Height (mm)</label><input type="number" min="0" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
      )}

      {result.volumeM3 > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Volume</p><p className="text-xl font-bold text-primary">{result.volumeM3.toFixed(2)} m³</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Weight</p><p className="text-lg font-bold">{result.tonnes.toFixed(2)} tonnes</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">25kg Bags</p><p className="text-lg font-bold">{result.bags25kg}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">20kg Bags</p><p className="text-lg font-bold">{result.bags20kg}</p></div>
        </div>
      )}
    </div>
  )
}
