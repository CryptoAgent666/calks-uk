import { useState, useMemo } from 'react'

type RoomType = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'hallway'
type WindowType = 'single' | 'double' | 'triple'
type WaterTemp = 'dt50' | 'dt30' | 'dt25' | 'dt20'

const BASE_BTU_PER_M3: Record<RoomType, number> = {
  living: 153, bedroom: 133, kitchen: 153, bathroom: 170, hallway: 136,
}

const EXTERNAL_WALL_UPLIFT = 0.15 // +15% for each external wall
const MAX_EXTERNAL_WALLS = 4

// Output as a share of the ΔT50 rating, for a 20°C room: QS Supplies' Delta T 50
// correction table, which matches the n = 1.3 Zehnder assumes for most radiators.
const WATER_TEMPS: Record<WaterTemp, { label: string; deltaT: number; factor: number }> = {
  dt50: { label: 'ΔT50: mean water 70°C (80°C flow, 60°C return)', deltaT: 50, factor: 1 },
  dt30: { label: 'ΔT30: mean water 50°C (55°C flow, 45°C return)', deltaT: 30, factor: 0.51 },
  dt25: { label: 'ΔT25: mean water 45°C (50°C flow, 40°C return)', deltaT: 25, factor: 0.41 },
  dt20: { label: 'ΔT20: mean water 40°C (45°C flow, 35°C return)', deltaT: 20, factor: 0.3 },
}

function calculate(length: number, width: number, height: number, roomType: RoomType, windowType: WindowType, numExternalWalls: number, waterTemp: WaterTemp) {
  const volume = length * width * height
  let btu = volume * BASE_BTU_PER_M3[roomType]

  // Window adjustment
  if (windowType === 'single') btu *= 1.2
  else if (windowType === 'triple') btu *= 0.9

  // External walls
  const walls = Math.min(MAX_EXTERNAL_WALLS, Math.max(0, numExternalWalls))
  btu *= 1 + walls * EXTERNAL_WALL_UPLIFT

  const watts = btu * 0.293071
  const { factor, deltaT } = WATER_TEMPS[waterTemp]

  return {
    volume,
    btu: Math.round(btu),
    watts: Math.round(watts),
    deltaT,
    factor,
    ratedBtu: Math.round(btu / factor),
    ratedWatts: Math.round(watts / factor),
  }
}

export default function RadiatorBTUCalculator() {
  const [length, setLength] = useState('5')
  const [width, setWidth] = useState('4')
  const [height, setHeight] = useState('2.4')
  const [room, setRoom] = useState<RoomType>('living')
  const [windows, setWindows] = useState<WindowType>('double')
  const [extWalls, setExtWalls] = useState('2')
  const [waterTemp, setWaterTemp] = useState<WaterTemp>('dt50')

  const result = useMemo(() => calculate(parseFloat(length)||0, parseFloat(width)||0, parseFloat(height)||0, room, windows, parseInt(extWalls)||0, waterTemp), [length, width, height, room, windows, extWalls, waterTemp])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Length (m)</label><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Length (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Width (m)</label><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Width (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Ceiling Height (m)</label><input type="number" min="1" max="5" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Ceiling Height (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Room Type</label><select value={room} onChange={(e) => setRoom(e.target.value as RoomType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Room Type">
          <option value="living">Living Room</option><option value="bedroom">Bedroom</option><option value="kitchen">Kitchen</option><option value="bathroom">Bathroom</option><option value="hallway">Hallway</option>
        </select></div>
        <div><label className="block text-sm font-medium mb-2">Glazing</label><select value={windows} onChange={(e) => setWindows(e.target.value as WindowType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Glazing">
          <option value="single">Single Glazed</option><option value="double">Double Glazed</option><option value="triple">Triple Glazed</option>
        </select></div>
        <div><label className="block text-sm font-medium mb-2">External Walls</label><input type="number" min="0" max={MAX_EXTERNAL_WALLS} step="1" value={extWalls} onChange={(e) => setExtWalls(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="External Walls" /></div>
        <div className="col-span-2 sm:col-span-3"><label className="block text-sm font-medium mb-2">Radiator Water Temperature</label><select value={waterTemp} onChange={(e) => setWaterTemp(e.target.value as WaterTemp)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Radiator Water Temperature">
          {(Object.entries(WATER_TEMPS) as [WaterTemp, typeof WATER_TEMPS[WaterTemp]][]).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select></div>
      </div>

      {result.btu > 0 && (
        <div className="space-y-3 animate-fade-in-up">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">BTU Required</p><p className="text-xl font-bold text-primary">{result.btu.toLocaleString()}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Watts Required</p><p className="text-lg font-bold">{result.watts.toLocaleString()} W</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Room Volume</p><p className="text-lg font-bold">{result.volume.toFixed(1)} m³</p></div>
          </div>
          <p className="text-sm text-muted-foreground">
            {result.factor === 1
              ? 'Catalogue ratings are at ΔT50, so compare this figure with them directly. If your radiators run cooler than that, choose a lower water temperature above.'
              : `At ΔT${result.deltaT} a radiator gives about ${Math.round(result.factor * 100)}% of its ΔT50 rating, so look for a catalogue rating of about ${result.ratedBtu.toLocaleString()} BTU/h (${result.ratedWatts.toLocaleString()} W) at ΔT50.`}
          </p>
        </div>
      )}
    </div>
  )
}
