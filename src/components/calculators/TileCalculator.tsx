import { useState, useMemo } from 'react'

function calculate(areaWidth: number, areaHeight: number, tileWidth: number, tileHeight: number, groutGap: number, wastePct: number) {
  const areaSqm = areaWidth * areaHeight
  const tileSqm = ((tileWidth + groutGap) * (tileHeight + groutGap)) / 10000 // cm to m
  const tilesNeeded = tileSqm > 0 ? Math.ceil((areaSqm / tileSqm) * (1 + wastePct / 100)) : 0
  const boxesNeeded = Math.ceil(tilesNeeded / 10) // typical 10 per box

  return { areaSqm, tilesNeeded, boxesNeeded }
}

export default function TileCalculator() {
  const [aw, setAw] = useState('3')
  const [ah, setAh] = useState('2.4')
  const [tw, setTw] = useState('30')
  const [th, setTh] = useState('60')
  const [grout, setGrout] = useState('0.3')
  const [waste, setWaste] = useState('10')

  const result = useMemo(() => calculate(parseFloat(aw)||0, parseFloat(ah)||0, parseFloat(tw)||0, parseFloat(th)||0, parseFloat(grout)||0, parseFloat(waste)||0), [aw,ah,tw,th,grout,waste])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Area Width (m)</label><input type="number" min="0" step="0.1" value={aw} onChange={(e) => setAw(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Area Width (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Area Height (m)</label><input type="number" min="0" step="0.1" value={ah} onChange={(e) => setAh(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Area Height (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Tile Width (cm)</label><input type="number" min="1" max="120" value={tw} onChange={(e) => setTw(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Tile Width (cm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Tile Height (cm)</label><input type="number" min="1" max="120" value={th} onChange={(e) => setTh(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Tile Height (cm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Grout Gap (cm)</label><input type="number" min="0" max="2" step="0.1" value={grout} onChange={(e) => setGrout(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Grout Gap (cm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Wastage (%)</label><input type="number" min="0" max="30" value={waste} onChange={(e) => setWaste(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Wastage (%)" /></div>
      </div>

      {result.tilesNeeded > 0 && (
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Tiles Needed</p><p className="text-xl font-bold text-primary">{result.tilesNeeded}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Boxes (10/box)</p><p className="text-lg font-bold">{result.boxesNeeded}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Area</p><p className="text-lg font-bold">{result.areaSqm.toFixed(1)} m²</p></div>
        </div>
      )}
    </div>
  )
}
