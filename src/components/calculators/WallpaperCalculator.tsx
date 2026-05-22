import { useState, useMemo } from 'react'

function calculate(roomLength: number, roomWidth: number, roomHeight: number, doorsWindows: number, rollLength: number, rollWidth: number, patternRepeat: number) {
  const perimeter = 2 * (roomLength + roomWidth)
  const wallArea = perimeter * roomHeight - doorsWindows
  const usableDropLength = patternRepeat > 0 ? Math.ceil(roomHeight / patternRepeat) * patternRepeat : roomHeight
  const dropsPerRoll = Math.floor((rollLength * 100) / (usableDropLength * 100)) // avoid float issues
  const widthM = rollWidth / 100
  const totalDrops = Math.ceil(perimeter / widthM)
  const rollsNeeded = Math.ceil(totalDrops / dropsPerRoll)

  return { wallArea, totalDrops, rollsNeeded, perimeter }
}

export default function WallpaperCalculator() {
  const [length, setLength] = useState('5')
  const [width, setWidth] = useState('4')
  const [height, setHeight] = useState('2.4')
  const [dw, setDw] = useState('3.6')
  const [rollLen, setRollLen] = useState('10')
  const [rollW, setRollW] = useState('53')
  const [pattern, setPattern] = useState('0')

  const result = useMemo(() => calculate(parseFloat(length)||0, parseFloat(width)||0, parseFloat(height)||0, parseFloat(dw)||0, parseFloat(rollLen)||10, parseFloat(rollW)||53, parseFloat(pattern)||0), [length, width, height, dw, rollLen, rollW, pattern])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Room Length (m)</label><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Room Length (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Room Width (m)</label><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Room Width (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Wall Height (m)</label><input type="number" min="0" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Wall Height (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Doors/Windows (m²)</label><input type="number" min="0" step="0.1" value={dw} onChange={(e) => setDw(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Doors/Windows (m²)" /></div>
        <div><label className="block text-sm font-medium mb-2">Roll Length (m)</label><input type="number" min="1" value={rollLen} onChange={(e) => setRollLen(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Roll Length (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Roll Width (cm)</label><input type="number" min="1" value={rollW} onChange={(e) => setRollW(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Roll Width (cm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Pattern Repeat (m)</label><input type="number" min="0" step="0.01" value={pattern} onChange={(e) => setPattern(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Pattern Repeat (m)" /><p className="text-xs text-muted-foreground mt-1">0 = no pattern</p></div>
      </div>

      {result.rollsNeeded > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Rolls Needed</p><p className="text-xl font-bold text-primary">{result.rollsNeeded}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Wall Area</p><p className="text-lg font-bold">{result.wallArea.toFixed(1)} m²</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Drops</p><p className="text-lg font-bold">{result.totalDrops}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Room Perimeter</p><p className="text-lg font-bold">{result.perimeter.toFixed(1)} m</p></div>
        </div>
      )}
    </div>
  )
}
