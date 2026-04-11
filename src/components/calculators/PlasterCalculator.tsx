import { useState, useMemo } from 'react'

type PlasterType = 'skim' | 'undercoat' | 'onecoat'
const COVERAGE: Record<PlasterType, { kgPerSqm: number; name: string; thickness: string }> = {
  skim: { kgPerSqm: 2.5, name: 'Multi-Finish (skim)', thickness: '2-3mm' },
  undercoat: { kgPerSqm: 8, name: 'Bonding / Browning', thickness: '8-11mm' },
  onecoat: { kgPerSqm: 10, name: 'One Coat', thickness: '13mm' },
}

function calculate(wallHeight: number, wallWidth: number, walls: number, doorsWindows: number, plasterType: PlasterType) {
  const totalArea = wallHeight * wallWidth * walls - doorsWindows
  const info = COVERAGE[plasterType]
  const kgNeeded = totalArea * info.kgPerSqm
  const bags25kg = Math.ceil(kgNeeded / 25)

  return { totalArea, kgNeeded, bags25kg, info }
}

export default function PlasterCalculator() {
  const [height, setHeight] = useState('2.4')
  const [width, setWidth] = useState('4')
  const [walls, setWalls] = useState('4')
  const [dw, setDw] = useState('4')
  const [type, setType] = useState<PlasterType>('skim')

  const result = useMemo(() => calculate(parseFloat(height)||0, parseFloat(width)||0, parseInt(walls)||0, parseFloat(dw)||0, type), [height, width, walls, dw, type])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {(Object.entries(COVERAGE) as [PlasterType, typeof COVERAGE[PlasterType]][]).map(([k, v]) => (
          <button key={k} onClick={() => setType(k)} className={`px-4 py-3 rounded-xl text-sm text-left border transition-colors ${type === k ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
            <div className="font-medium">{v.name}</div>
            <div className={`text-xs ${type === k ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{v.thickness} &middot; {v.kgPerSqm}kg/m²</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Wall Height (m)</label><input type="number" min="0" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Wall Width (m)</label><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Number of Walls</label><input type="number" min="1" max="20" value={walls} onChange={(e) => setWalls(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Doors/Windows (m²)</label><input type="number" min="0" step="0.1" value={dw} onChange={(e) => setDw(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {result.totalArea > 0 && (
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">25kg Bags</p><p className="text-xl font-bold text-primary">{result.bags25kg}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Weight</p><p className="text-lg font-bold">{result.kgNeeded.toFixed(0)} kg</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Wall Area</p><p className="text-lg font-bold">{result.totalArea.toFixed(1)} m²</p></div>
        </div>
      )}
    </div>
  )
}
