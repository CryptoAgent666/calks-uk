import { useState, useMemo } from 'react'

type RoomType = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'hallway'
type WindowType = 'single' | 'double' | 'triple'
type WallType = 'internal' | 'external_insulated' | 'external_uninsulated'

const BASE_BTU_PER_M3: Record<RoomType, number> = {
  living: 153, bedroom: 133, kitchen: 153, bathroom: 170, hallway: 136,
}

function calculate(length: number, width: number, height: number, roomType: RoomType, windowType: WindowType, wallType: WallType, numExternalWalls: number) {
  const volume = length * width * height
  let btu = volume * BASE_BTU_PER_M3[roomType]

  // Window adjustment
  if (windowType === 'single') btu *= 1.2
  else if (windowType === 'triple') btu *= 0.9

  // Wall adjustment
  if (wallType === 'external_uninsulated') btu *= 1.1 * (1 + numExternalWalls * 0.05)
  else if (wallType === 'internal') btu *= 0.85

  // North-facing add 15%
  const watts = btu * 0.293071

  return { volume, btu: Math.ceil(btu), watts: Math.ceil(watts) }
}

export default function RadiatorBTUCalculator() {
  const [length, setLength] = useState('5')
  const [width, setWidth] = useState('4')
  const [height, setHeight] = useState('2.4')
  const [room, setRoom] = useState<RoomType>('living')
  const [windows, setWindows] = useState<WindowType>('double')
  const [walls, setWalls] = useState<WallType>('external_insulated')
  const [extWalls, setExtWalls] = useState('2')

  const result = useMemo(() => calculate(parseFloat(length)||0, parseFloat(width)||0, parseFloat(height)||0, room, windows, walls, parseInt(extWalls)||0), [length, width, height, room, windows, walls, extWalls])

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
        <div><label className="block text-sm font-medium mb-2">External Walls</label><input type="number" min="0" max="4" value={extWalls} onChange={(e) => setExtWalls(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="External Walls" /></div>
      </div>

      {result.btu > 0 && (
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">BTU Required</p><p className="text-xl font-bold text-primary">{result.btu.toLocaleString()}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Watts Required</p><p className="text-lg font-bold">{result.watts.toLocaleString()} W</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Room Volume</p><p className="text-lg font-bold">{result.volume.toFixed(1)} m³</p></div>
        </div>
      )}
    </div>
  )
}
