import { useState, useMemo } from 'react'

type FertType = 'npk' | 'lawn' | 'tomato'
const RATES: Record<FertType, { name: string; gPerSqm: number }> = {
  npk: { name: 'General Purpose (NPK)', gPerSqm: 70 },
  lawn: { name: 'Lawn Feed', gPerSqm: 35 },
  tomato: { name: 'Tomato / Veg Feed', gPerSqm: 50 },
}

function calculate(length: number, width: number, rate: number, applications: number, packKg: number) {
  const area = length * width
  const perApplication = area * rate / 1000 // kg
  const total = perApplication * applications
  const packs = packKg > 0 ? Math.ceil(total / packKg - 1e-9) : 0
  const coveragePerPack = rate > 0 ? packKg * 1000 / rate : 0 // m² per pack at this rate

  return { area, perApplication, total, packs, coveragePerPack }
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function FertiliserCalculator() {
  const [length, setLength] = useState('10')
  const [width, setWidth] = useState('8')
  const [rate, setRate] = useState(String(RATES.npk.gPerSqm))
  const [apps, setApps] = useState('2')
  const [pack, setPack] = useState('20')

  const l = Math.max(0, parseFloat(length) || 0)
  const w = Math.max(0, parseFloat(width) || 0)
  const g = Math.max(0, parseFloat(rate) || 0)
  const n = Math.min(12, Math.max(1, parseInt(apps) || 1))
  const pk = Math.max(0, parseFloat(pack) || 0)

  const result = useMemo(() => calculate(l, w, g, n, pk), [l, w, g, n, pk])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {(Object.entries(RATES) as [FertType, typeof RATES[FertType]][]).map(([k, v]) => {
          const active = g === v.gPerSqm
          return (
            <button key={k} type="button" aria-pressed={active} onClick={() => setRate(String(v.gPerSqm))} className={`px-4 py-3 rounded-xl text-sm text-left border transition-colors ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
              <div className="font-medium">{v.name}</div>
              <div className={`text-xs ${active ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{v.gPerSqm}g/m²</div>
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div><label className="block text-sm font-medium mb-2">Length (m)</label><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className={inputClass} aria-label="Length (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Width (m)</label><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className={inputClass} aria-label="Width (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Rate (g/m²)</label><input type="number" min="0" step="1" value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass} aria-label="Application rate (grams per square metre)" /><p className="text-xs text-muted-foreground mt-1">= {(g * 10).toFixed(0)} kg/ha</p></div>
        <div><label className="block text-sm font-medium mb-2">Applications/Year</label><input type="number" min="1" max="12" value={apps} onChange={(e) => setApps(e.target.value)} className={inputClass} aria-label="Applications/Year" /></div>
        <div><label className="block text-sm font-medium mb-2">Pack Size (kg)</label><input type="number" min="0.1" step="0.1" value={pack} onChange={(e) => setPack(e.target.value)} className={inputClass} aria-label="Pack size (kg)" /></div>
      </div>
      {result.area > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Per Application</p><p className="text-xl font-bold text-primary">{result.perApplication.toFixed(1)} kg</p><p className="text-xs text-muted-foreground">{result.area.toFixed(0)} m² at {g} g/m²</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total ({n}x)</p><p className="text-lg font-bold">{result.total.toFixed(1)} kg</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">{pk > 0 ? `${pk} kg Packs` : 'Packs'}</p><p className="text-lg font-bold">{result.packs}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Coverage per Pack</p><p className="text-lg font-bold">{result.coveragePerPack.toFixed(0)} m²</p></div>
        </div>
      )}
      <p className="text-xs text-muted-foreground">For granular and powder feeds. Check the rate on your product label; for liquid feeds, follow the dilution on the bottle.</p>
    </div>
  )
}
