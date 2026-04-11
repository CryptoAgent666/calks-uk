import { useState, useMemo } from 'react'

type FertType = 'npk' | 'lawn' | 'tomato'
const RATES: Record<FertType, { name: string; gPerSqm: number }> = {
  npk: { name: 'General Purpose (NPK)', gPerSqm: 70 },
  lawn: { name: 'Lawn Feed', gPerSqm: 35 },
  tomato: { name: 'Tomato / Veg Feed', gPerSqm: 50 },
}

function calculate(length: number, width: number, fertType: FertType, applications: number) {
  const area = length * width
  const rate = RATES[fertType].gPerSqm
  const perApplication = area * rate / 1000 // kg
  const total = perApplication * applications
  const bags25kg = Math.ceil(total / 25)

  return { area, perApplication, total, bags25kg, rate }
}

export default function FertiliserCalculator() {
  const [length, setLength] = useState('10')
  const [width, setWidth] = useState('8')
  const [type, setType] = useState<FertType>('npk')
  const [apps, setApps] = useState('2')

  const result = useMemo(() => calculate(parseFloat(length)||0, parseFloat(width)||0, type, parseInt(apps)||1), [length, width, type, apps])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {(Object.entries(RATES) as [FertType, typeof RATES[FertType]][]).map(([k, v]) => (
          <button key={k} onClick={() => setType(k)} className={`px-4 py-3 rounded-xl text-sm text-left border transition-colors ${type === k ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
            <div className="font-medium">{v.name}</div>
            <div className={`text-xs ${type === k ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{v.gPerSqm}g/m²</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Length (m)</label><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Width (m)</label><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Applications/Year</label><input type="number" min="1" max="12" value={apps} onChange={(e) => setApps(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>
      {result.area > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Per Application</p><p className="text-xl font-bold text-primary">{result.perApplication.toFixed(1)} kg</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total ({apps}x)</p><p className="text-lg font-bold">{result.total.toFixed(1)} kg</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">25kg Bags</p><p className="text-lg font-bold">{result.bags25kg}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Area</p><p className="text-lg font-bold">{result.area.toFixed(0)} m²</p></div>
        </div>
      )}
    </div>
  )
}
