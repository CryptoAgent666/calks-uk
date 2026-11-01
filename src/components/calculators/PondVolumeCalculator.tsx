import { useState, useMemo } from 'react'

type Shape = 'rectangle' | 'circle' | 'oval'

function calculate(shape: Shape, length: number, width: number, depth: number, maxDepth: number) {
  let volumeM3: number
  switch (shape) {
    case 'rectangle': volumeM3 = length * width * depth; break
    case 'circle': volumeM3 = Math.PI * Math.pow(length / 2, 2) * depth; break // length = diameter
    case 'oval': volumeM3 = Math.PI * (length / 2) * (width / 2) * depth; break
  }

  const litres = volumeM3 * 1000
  const gallons = litres * 0.219969
  const pumpLph = litres // pump should circulate full volume per hour
  const linerLength = length + 2 * maxDepth + 0.6 // 30cm overlap each side
  const linerWidth = (shape === 'circle' ? length : width) + 2 * maxDepth + 0.6

  return { volumeM3, litres, gallons, pumpLph, linerLength, linerWidth, linerArea: linerLength * linerWidth }
}

export function assess(shape: Shape, length: string, width: string, depth: string, deepest: string) {
  const l = parseFloat(length) || 0
  const w = parseFloat(width) || 0
  const d = parseFloat(depth) || 0
  const m = parseFloat(deepest) || 0
  const deepestEntered = deepest.trim() !== ''

  let error: string | null = null
  if (l <= 0 || d <= 0 || (shape !== 'circle' && w <= 0)) error = 'Enter each measurement as a number above zero.'
  else if (deepestEntered && m < d) error = 'The deepest point cannot be shallower than the average depth.'

  return { error, result: error ? null : calculate(shape, l, w, d, deepestEntered ? m : d) }
}

export default function PondVolumeCalculator() {
  const [shape, setShape] = useState<Shape>('rectangle')
  const [length, setLength] = useState('3')
  const [width, setWidth] = useState('2')
  const [depth, setDepth] = useState('0.6')
  const [deepest, setDeepest] = useState('')

  const { error, result } = useMemo(() => assess(shape, length, width, depth, deepest), [shape, length, width, depth, deepest])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {([{v:'rectangle' as Shape,l:'Rectangle'},{v:'circle' as Shape,l:'Circle'},{v:'oval' as Shape,l:'Oval'}]).map(o => (
          <button key={o.v} onClick={() => setShape(o.v)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${shape === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{o.l}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">{shape === 'circle' ? 'Diameter (m)' : 'Length (m)'}</label><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        {shape !== 'circle' && <div><label className="block text-sm font-medium mb-2">Width (m)</label><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Width (m)" /></div>}
        <div><label className="block text-sm font-medium mb-2">Average Depth (m)</label><input type="number" min="0" max="3" step="0.1" value={depth} onChange={(e) => setDepth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Average Depth (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Deepest Point (m, optional)</label><input type="number" min="0" max="3" step="0.1" value={deepest} onChange={(e) => setDeepest(e.target.value)} placeholder="for the liner" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Deepest Point (m, optional)" /></div>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-border p-4 text-sm text-muted-foreground">{error}</div>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-blue-100 dark:bg-blue-950 p-4 text-center"><p className="text-xs text-muted-foreground">Volume</p><p className="text-xl font-bold text-blue-700 dark:text-blue-400">{Math.round(result.litres).toLocaleString('en-GB')} litres</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Imperial Gallons</p><p className="text-lg font-bold">{Math.round(result.gallons).toLocaleString('en-GB')}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Pump Size (1 hour turnover)</p><p className="text-lg font-bold">{Math.round(result.pumpLph).toLocaleString('en-GB')} LPH</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Liner Size</p><p className="text-lg font-bold">{result.linerLength.toFixed(1)} x {result.linerWidth.toFixed(1)}m</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">The liner adds twice the deepest point (or the average depth, if you leave that blank) plus 30 cm of overlap each side. Check the overlap your supplier advises before ordering.</div>
        </div>
      )}
    </div>
  )
}
