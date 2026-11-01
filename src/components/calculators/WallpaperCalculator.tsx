import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const CUT_ALLOWANCE_CM = 10 // 5 cm at the top and bottom of each drop for trimming

function calculate(roomLength: number, roomWidth: number, roomHeight: number, doorsWindows: number, rollLength: number, rollWidth: number, patternRepeatCm: number, spareRolls: number, pricePerRoll: number) {
  const perimeter = 2 * (roomLength + roomWidth)
  const wallArea = Math.max(0, perimeter * roomHeight - doorsWindows)
  const cutCm = roomHeight * 100 + CUT_ALLOWANCE_CM
  // The small tolerances stop float noise changing a whole count (2.1 / 0.7 is 3.0000000000000004, not 3).
  const usableDropCm = patternRepeatCm > 0 ? Math.ceil(cutCm / patternRepeatCm - 1e-9) * patternRepeatCm : cutCm
  const dropsPerRoll = Math.floor((rollLength * 100) / usableDropCm + 1e-9)
  const totalDrops = Math.ceil(perimeter / (rollWidth / 100) - 1e-9)
  const hasWall = roomHeight > 0 && perimeter > 0
  // A cut longer than the roll gives 0 drops per roll: no roll count, not a division by zero.
  const rollsNeeded = hasWall && dropsPerRoll > 0 ? Math.ceil(totalDrops / dropsPerRoll - 1e-9) : 0
  const rollsToBuy = rollsNeeded > 0 ? rollsNeeded + spareRolls : 0
  const cost = rollsToBuy * pricePerRoll
  const cutTooLong = hasWall && dropsPerRoll < 1

  return { wallArea, totalDrops, usableDropCm, dropsPerRoll, rollsNeeded, rollsToBuy, cost, perimeter, cutTooLong }
}

export default function WallpaperCalculator() {
  const [length, setLength] = useState('5')
  const [width, setWidth] = useState('4')
  const [height, setHeight] = useState('2.4')
  const [dw, setDw] = useState('3.6')
  const [rollLen, setRollLen] = useState('10.05')
  const [rollW, setRollW] = useState('53')
  const [pattern, setPattern] = useState('0')
  const [spares, setSpares] = useState('1')
  const [price, setPrice] = useState('25')

  const patternCm = Math.max(0, parseFloat(pattern) || 0)
  const spareCount = Math.max(0, parseInt(spares) || 0)
  const pricePerRoll = Math.max(0, parseFloat(price) || 0)
  const result = useMemo(() => calculate(parseFloat(length)||0, parseFloat(width)||0, parseFloat(height)||0, parseFloat(dw)||0, parseFloat(rollLen)||10.05, parseFloat(rollW)||53, patternCm, spareCount, pricePerRoll), [length, width, height, dw, rollLen, rollW, patternCm, spareCount, pricePerRoll])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Room Length (m)</label><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Room Length (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Room Width (m)</label><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Room Width (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Wall Height (m)</label><input type="number" min="0" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Wall Height (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Doors/Windows (m²)</label><input type="number" min="0" step="0.1" value={dw} onChange={(e) => setDw(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Doors/Windows (m²)" /><p className="text-xs text-muted-foreground mt-1">Changes wall area only</p></div>
        <div><label className="block text-sm font-medium mb-2">Roll Length (m)</label><input type="number" min="1" step="0.01" value={rollLen} onChange={(e) => setRollLen(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Roll Length (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Roll Width (cm)</label><input type="number" min="1" value={rollW} onChange={(e) => setRollW(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Roll Width (cm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Pattern Repeat (cm)</label><input type="number" min="0" step="0.1" value={pattern} onChange={(e) => setPattern(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Pattern Repeat (cm)" /><p className="text-xs text-muted-foreground mt-1">{patternCm > 0 && patternCm < 5 ? 'In centimetres: enter 64 for 64 cm' : '0 = no pattern'}</p></div>
        <div><label className="block text-sm font-medium mb-2">Spare Rolls</label><input type="number" min="0" step="1" value={spares} onChange={(e) => setSpares(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Spare Rolls" /></div>
        <div><label className="block text-sm font-medium mb-2">Price per Roll (£)</label><input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Price per Roll (£)" /></div>
      </div>

      {result.cutTooLong && (
        <p className="rounded-xl bg-muted/50 p-4 text-sm">Each drop would be cut at {(result.usableDropCm / 100).toFixed(2)} m, which is longer than the roll. Check the wall height, the roll length and that the pattern repeat is in centimetres.</p>
      )}

      {result.rollsNeeded > 0 && (
        <div className="space-y-3 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Rolls Needed</p><p className="text-xl font-bold text-primary">{result.rollsNeeded}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Rolls with Spares</p><p className="text-lg font-bold">{result.rollsToBuy}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Est. Cost</p><p className="text-lg font-bold">{formatCurrency(result.cost)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Drops</p><p className="text-lg font-bold">{result.totalDrops}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Wall Area</p><p className="text-lg font-bold">{result.wallArea.toFixed(1)} m²</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Room Perimeter</p><p className="text-lg font-bold">{result.perimeter.toFixed(1)} m</p></div>
          </div>
          <p className="text-xs text-muted-foreground">Each drop is cut at {(result.usableDropCm / 100).toFixed(2)} m: wall height plus 10 cm for trimming, rounded up to whole pattern repeats, so {result.dropsPerRoll} per roll. Doors and windows are not taken off the roll count, because you still need paper above and below them.</p>
        </div>
      )}
    </div>
  )
}
