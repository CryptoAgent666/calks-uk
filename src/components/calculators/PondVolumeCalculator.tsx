import { useState, useMemo } from 'react'

type Shape = 'rectangle' | 'circle' | 'oval'

function calculate(shape: Shape, length: number, width: number, depth: number) {
  let volumeM3: number
  switch (shape) {
    case 'rectangle': volumeM3 = length * width * depth; break
    case 'circle': volumeM3 = Math.PI * Math.pow(length / 2, 2) * depth; break // length = diameter
    case 'oval': volumeM3 = Math.PI * (length / 2) * (width / 2) * depth; break
  }

  const litres = volumeM3 * 1000
  const gallons = litres * 0.219969
  const pumpLph = litres // pump should circulate full volume per hour
  const linerLength = length + 2 * depth + 0.6 // 30cm overlap each side
  const linerWidth = (shape === 'circle' ? length : width) + 2 * depth + 0.6

  return { volumeM3, litres, gallons, pumpLph, linerLength, linerWidth, linerArea: linerLength * linerWidth }
}

export default function PondVolumeCalculator() {
  const [shape, setShape] = useState<Shape>('rectangle')
  const [length, setLength] = useState('3')
  const [width, setWidth] = useState('2')
  const [depth, setDepth] = useState('0.6')

  const l = parseFloat(length) || 0
  const w = parseFloat(width) || 0
  const d = parseFloat(depth) || 0
  const result = useMemo(() => calculate(shape, l, w, d), [shape, l, w, d])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {([{v:'rectangle' as Shape,l:'Rectangle'},{v:'circle' as Shape,l:'Circle'},{v:'oval' as Shape,l:'Oval'}]).map(o => (
          <button key={o.v} onClick={() => setShape(o.v)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${shape === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{o.l}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">{shape === 'circle' ? 'Diameter (m)' : 'Length (m)'}</label><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        {shape !== 'circle' && <div><label className="block text-sm font-medium mb-2">Width (m)</label><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>}
        <div><label className="block text-sm font-medium mb-2">Depth (m)</label><input type="number" min="0" max="3" step="0.1" value={depth} onChange={(e) => setDepth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {result.litres > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-blue-100 dark:bg-blue-950 p-4 text-center"><p className="text-xs text-muted-foreground">Volume</p><p className="text-xl font-bold text-blue-700 dark:text-blue-400">{result.litres.toFixed(0)} litres</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Gallons</p><p className="text-lg font-bold">{result.gallons.toFixed(0)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Pump Size</p><p className="text-lg font-bold">{result.pumpLph.toFixed(0)} LPH</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Liner Size</p><p className="text-lg font-bold">{result.linerLength.toFixed(1)} x {result.linerWidth.toFixed(1)}m</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
