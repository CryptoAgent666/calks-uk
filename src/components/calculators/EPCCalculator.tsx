import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type WallType = 'cavity_insulated' | 'cavity_uninsulated' | 'solid_insulated' | 'solid_uninsulated'
type GlazingType = 'single' | 'double' | 'triple'
type HeatingType = 'gas_new' | 'gas_old' | 'oil' | 'electric' | 'heat_pump'

const WALL_SCORES: Record<WallType, number> = { cavity_insulated: 90, cavity_uninsulated: 55, solid_insulated: 80, solid_uninsulated: 30 }
const GLAZING_SCORES: Record<GlazingType, number> = { single: 30, double: 70, triple: 90 }
const HEATING_SCORES: Record<HeatingType, number> = { gas_new: 80, gas_old: 55, oil: 45, electric: 35, heat_pump: 95 }

const UPGRADES = [
  { name: 'Loft insulation (270mm)', points: 8, cost: 400, saving: 355 },
  { name: 'Cavity wall insulation', points: 12, cost: 700, saving: 310 },
  { name: 'Double glazing', points: 10, cost: 5000, saving: 120 },
  { name: 'Smart thermostat', points: 3, cost: 200, saving: 75 },
  { name: 'LED lighting', points: 2, cost: 100, saving: 40 },
  { name: 'Solar panels (4kWp)', points: 15, cost: 6000, saving: 500 },
]

function calculate(walls: WallType, glazing: GlazingType, heating: HeatingType, hasLoftInsulation: boolean, hasSolar: boolean) {
  let score = (WALL_SCORES[walls] * 0.3 + GLAZING_SCORES[glazing] * 0.2 + HEATING_SCORES[heating] * 0.35 + (hasLoftInsulation ? 90 : 40) * 0.1 + (hasSolar ? 95 : 50) * 0.05)

  let band: string
  if (score >= 92) band = 'A'
  else if (score >= 81) band = 'B'
  else if (score >= 69) band = 'C'
  else if (score >= 55) band = 'D'
  else if (score >= 39) band = 'E'
  else if (score >= 21) band = 'F'
  else band = 'G'

  const bandColors: Record<string, string> = { A: 'bg-green-600', B: 'bg-green-500', C: 'bg-lime-500', D: 'bg-yellow-500', E: 'bg-orange-500', F: 'bg-orange-600', G: 'bg-red-600' }

  return { score: Math.round(score), band, color: bandColors[band] || 'bg-gray-500' }
}

export default function EPCCalculator() {
  const [walls, setWalls] = useState<WallType>('cavity_uninsulated')
  const [glazing, setGlazing] = useState<GlazingType>('double')
  const [heating, setHeating] = useState<HeatingType>('gas_old')
  const [loft, setLoft] = useState(false)
  const [solar, setSolar] = useState(false)

  const result = useMemo(() => calculate(walls, glazing, heating, loft, solar), [walls, glazing, heating, loft, solar])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Walls</label><select value={walls} onChange={(e) => setWalls(e.target.value as WallType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Walls"><option value="cavity_insulated">Cavity — insulated</option><option value="cavity_uninsulated">Cavity — uninsulated</option><option value="solid_insulated">Solid — insulated</option><option value="solid_uninsulated">Solid — uninsulated</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Glazing</label><select value={glazing} onChange={(e) => setGlazing(e.target.value as GlazingType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Glazing"><option value="single">Single glazed</option><option value="double">Double glazed</option><option value="triple">Triple glazed</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Heating</label><select value={heating} onChange={(e) => setHeating(e.target.value as HeatingType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Heating"><option value="gas_new">Gas boiler (new, A-rated)</option><option value="gas_old">Gas boiler (old)</option><option value="oil">Oil boiler</option><option value="electric">Electric heating</option><option value="heat_pump">Heat pump</option></select></div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={loft} onChange={(e) => setLoft(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Loft insulated (270mm+)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={solar} onChange={(e) => setSolar(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Solar panels installed</span></label>
      </div>

      <div className="rounded-2xl bg-muted/50 p-6 text-center animate-fade-in-up">
        <p className="text-sm text-muted-foreground">Estimated EPC Rating</p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className={`${result.color} text-white text-4xl font-bold w-16 h-16 rounded-xl flex items-center justify-center`}>{result.band}</div>
          <p className="text-3xl font-bold">{result.score}</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Potential Upgrades</h3>
        <div className="space-y-2">
          {UPGRADES.map(u => (
            <div key={u.name} className="flex items-center justify-between rounded-xl border border-border p-3">
              <div><p className="text-sm font-medium">{u.name}</p><p className="text-xs text-muted-foreground">+{u.points} EPC points &middot; Saves ~{formatCurrency(u.saving)}/yr</p></div>
              <p className="text-sm font-bold">{formatCurrency(u.cost)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>Simplified estimate — actual EPC depends on property size, age, floor area and surveyor assessment. Minimum EPC for rental properties: Band E (rising to Band C from 1 October 2030 for all tenancies).</p>
      </div>
    </div>
  )
}
