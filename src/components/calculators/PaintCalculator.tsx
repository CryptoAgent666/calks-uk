import { useState, useMemo } from 'react'

function calculate(wallHeight: number, wallWidth: number, numWalls: number, coats: number, doorsWindows: number, coveragePerLitre: number) {
  const totalArea = wallHeight * wallWidth * numWalls
  const netArea = Math.max(0, totalArea - doorsWindows)
  const totalCoverage = netArea * coats
  const litresNeeded = totalCoverage / coveragePerLitre
  const tins25 = Math.ceil(litresNeeded / 2.5)
  const tins5 = Math.ceil(litresNeeded / 5)

  return { totalArea, netArea, totalCoverage, litresNeeded, tins25, tins5 }
}

export default function PaintCalculator() {
  const [height, setHeight] = useState('2.4')
  const [width, setWidth] = useState('4')
  const [walls, setWalls] = useState('4')
  const [coats, setCoats] = useState('2')
  const [doors, setDoors] = useState('3.6')
  const [coverage, setCoverage] = useState('12')

  const h = parseFloat(height) || 0
  const w = parseFloat(width) || 0
  const n = parseInt(walls) || 0
  const c = parseInt(coats) || 0
  const d = parseFloat(doors) || 0
  const cv = parseFloat(coverage) || 12
  const result = useMemo(() => calculate(h, w, n, c, d, cv), [h, w, n, c, d, cv])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Wall Height (m)</label><input type="number" min="0" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Wall Width (m)</label><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Number of Walls</label><input type="number" min="1" max="20" value={walls} onChange={(e) => setWalls(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Number of Coats</label><input type="number" min="1" max="5" value={coats} onChange={(e) => setCoats(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Doors/Windows (m²)</label><input type="number" min="0" step="0.1" value={doors} onChange={(e) => setDoors(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Coverage (m²/litre)</label><input type="number" min="1" max="20" value={coverage} onChange={(e) => setCoverage(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {result.litresNeeded > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Paint Needed</p><p className="text-xl font-bold text-primary">{result.litresNeeded.toFixed(1)}L</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">2.5L Tins</p><p className="text-lg font-bold">{result.tins25}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">5L Tins</p><p className="text-lg font-bold">{result.tins5}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Wall Area</p><p className="text-lg font-bold">{result.netArea.toFixed(1)} m²</p></div>
        </div>
      )}
    </div>
  )
}
