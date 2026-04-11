import { useState, useMemo } from 'react'

type TileType = 'concrete' | 'clay' | 'slate'
const TILES_PER_SQM: Record<TileType, number> = { concrete: 10, clay: 15, slate: 20 }
const BATTEN_PER_SQM = 3.3 // linear metres

function calculate(length: number, width: number, pitch: number, tileType: TileType, wastePct: number) {
  // Roof area = floor area / cos(pitch)
  const pitchRad = (pitch * Math.PI) / 180
  const roofArea = (length * width) / Math.cos(pitchRad) * 2 // two sides
  const tilesPerSqm = TILES_PER_SQM[tileType]
  const tilesRaw = roofArea * tilesPerSqm
  const tilesNeeded = Math.ceil(tilesRaw * (1 + wastePct / 100))
  const ridgeTiles = Math.ceil(length / 0.33) // ~330mm per ridge tile
  const battenMetres = Math.ceil(roofArea * BATTEN_PER_SQM)
  const feltSqm = Math.ceil(roofArea * 1.1) // 10% overlap

  return { roofArea, tilesNeeded, ridgeTiles, battenMetres, feltSqm }
}

export default function RoofTilesCalculator() {
  const [length, setLength] = useState('10')
  const [width, setWidth] = useState('5')
  const [pitch, setPitch] = useState('35')
  const [tile, setTile] = useState<TileType>('concrete')
  const [waste, setWaste] = useState('10')

  const result = useMemo(() => calculate(parseFloat(length)||0, parseFloat(width)||0, parseFloat(pitch)||35, tile, parseFloat(waste)||10), [length, width, pitch, tile, waste])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Roof Length (m)</label><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Building Width (m)</label><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Roof Pitch (degrees)</label><input type="number" min="15" max="60" value={pitch} onChange={(e) => setPitch(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Tile Type</label><select value={tile} onChange={(e) => setTile(e.target.value as TileType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"><option value="concrete">Concrete (~10/m²)</option><option value="clay">Clay (~15/m²)</option><option value="slate">Slate (~20/m²)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Wastage (%)</label><input type="number" min="0" max="20" value={waste} onChange={(e) => setWaste(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {result.roofArea > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Tiles</p><p className="text-xl font-bold text-primary">{result.tilesNeeded.toLocaleString()}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Ridge Tiles</p><p className="text-lg font-bold">{result.ridgeTiles}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Batten</p><p className="text-lg font-bold">{result.battenMetres}m</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Felt</p><p className="text-lg font-bold">{result.feltSqm} m²</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Roof Area</p><p className="text-lg font-bold">{result.roofArea.toFixed(1)} m²</p></div>
        </div>
      )}
    </div>
  )
}
