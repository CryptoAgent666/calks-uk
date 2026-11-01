import { useState, useMemo } from 'react'

type TileType = 'concrete' | 'clayPantile' | 'clayPlain' | 'slate'
// Tiles and batten per m² of slope. Concrete: Marley Modern at 75mm headlap (9.9/m², 2.9 m/m²).
// Pantile: Marley Lincoln at 75mm headlap. Plain: Marley Acme at 100mm gauge.
// Slate: 500x250mm at 100mm lap (Cupa 20/m²); gauge (500-100)/2 = 200mm gives 5 m/m².
const TILES: Record<TileType, { perSqm: number; battenPerSqm: number }> = {
  concrete: { perSqm: 10, battenPerSqm: 2.9 },
  clayPantile: { perSqm: 15.3, battenPerSqm: 3.4 },
  clayPlain: { perSqm: 60, battenPerSqm: 10 },
  slate: { perSqm: 20, battenPerSqm: 5 },
}
const RIDGE_TILE_M = 0.45 // 450mm ridge tile
const PITCH_MIN = 15
const PITCH_MAX = 60

function calculate(length: number, span: number, pitch: number, tileType: TileType, wastePct: number) {
  // Both slopes together: ridge length x full eaves-to-eaves span / cos(pitch)
  const pitchRad = (pitch * Math.PI) / 180
  const roofArea = (length * span) / Math.cos(pitchRad)
  const { perSqm, battenPerSqm } = TILES[tileType]
  const tilesRaw = roofArea * perSqm
  const tilesNeeded = Math.ceil(tilesRaw * (1 + wastePct / 100) - 1e-9)
  const ridgeTiles = Math.ceil(length / RIDGE_TILE_M)
  const battenMetres = Math.ceil(roofArea * battenPerSqm)
  const feltSqm = Math.ceil(roofArea * 1.1) // 10% overlap

  return { roofArea, tilesNeeded, ridgeTiles, battenMetres, feltSqm }
}

export default function RoofTilesCalculator() {
  const [length, setLength] = useState('10')
  const [width, setWidth] = useState('5')
  const [pitch, setPitch] = useState('35')
  const [tile, setTile] = useState<TileType>('concrete')
  const [waste, setWaste] = useState('10')

  const pitchValue = parseFloat(pitch)
  const pitchValid = pitchValue >= PITCH_MIN && pitchValue <= PITCH_MAX
  const result = useMemo(() => calculate(parseFloat(length)||0, parseFloat(width)||0, pitchValid ? pitchValue : 0, tile, parseFloat(waste)||0), [length, width, pitchValid, pitchValue, tile, waste])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Ridge Length (m)</label><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Ridge Length (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Full Span, Eaves to Eaves (m)</label><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Full Span, Eaves to Eaves (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Roof Pitch (degrees)</label><input type="number" min={PITCH_MIN} max={PITCH_MAX} value={pitch} onChange={(e) => setPitch(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Roof Pitch (degrees)" /></div>
        <div><label className="block text-sm font-medium mb-2">Tile Type</label><select value={tile} onChange={(e) => setTile(e.target.value as TileType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Tile Type"><option value="concrete">Concrete, large format (~10/m²)</option><option value="clayPantile">Clay pantile (~15/m²)</option><option value="clayPlain">Clay plain tile (60/m²)</option><option value="slate">Slate 500x250mm (~20/m²)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Wastage (%)</label><input type="number" min="0" max="20" value={waste} onChange={(e) => setWaste(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Wastage (%)" /></div>
      </div>

      {!pitchValid && (
        <p className="text-sm text-destructive" role="alert">Enter a roof pitch between {PITCH_MIN}° and {PITCH_MAX}°.</p>
      )}

      {pitchValid && result.roofArea > 0 && (
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
