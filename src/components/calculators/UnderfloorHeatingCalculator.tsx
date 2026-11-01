import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type SystemType = 'water' | 'electric_mat' | 'electric_cable'
type ProjectType = 'renovation' | 'new_build'

// Install rates: Checkatrade underfloor heating price guide, June 2026. It gives one electric rate
// for mats and cables, and leaves out floor finishes, screed or levelling and insulation boards.
const ELECTRIC_RATES: Record<ProjectType, [number, number]> = { renovation: [60, 85], new_build: [50, 75] }
const WET_RATES: Record<ProjectType, [number, number]> = { renovation: [95, 110], new_build: [85, 100] }

const SYSTEMS: Record<SystemType, { name: string; electric: boolean; rates: Record<ProjectType, [number, number]>; description: string }> = {
  water: { name: 'Water (wet system)', electric: false, rates: WET_RATES, description: 'Connected to a boiler or heat pump; running cost shown on a gas boiler. Best for new builds or full renovations.' },
  electric_mat: { name: 'Electric Mat', electric: true, rates: ELECTRIC_RATES, description: 'Thin mats under tiles. Easy retrofit, ideal for bathrooms.' },
  electric_cable: { name: 'Electric Cable', electric: true, rates: ELECTRIC_RATES, description: 'Loose cable for irregular rooms. Same heat and running cost as a mat.' },
}

// Heat-demand method: the same heat is delivered whatever the system
const HEAT_W_PER_SQM = 100
const HEATING_DAYS = 180
const ELECTRICITY_P_PER_KWH = 26.32 // Ofgem price cap, 1 October to 31 December 2026
const GAS_P_PER_KWH = 7.97 // Ofgem price cap, 1 October to 31 December 2026
const BOILER_EFFICIENCY = 0.9

function calculate(type: SystemType, area: number, hoursPerDay: number, project: ProjectType) {
  const info = SYSTEMS[type]
  const [rateLow, rateHigh] = info.rates[project]
  const installLow = area * rateLow
  const installHigh = area * rateHigh
  const heatKwh = (area * HEAT_W_PER_SQM / 1000) * hoursPerDay * HEATING_DAYS
  const gasBoilerCost = (heatKwh / BOILER_EFFICIENCY) * GAS_P_PER_KWH / 100
  const annualRunning = info.electric ? heatKwh * ELECTRICITY_P_PER_KWH / 100 : gasBoilerCost
  const monthlyRunning = annualRunning / 12
  // Radiators on the same gas boiler deliver the same heat, so wet UFH comes out about level
  const extraVsRadiator = annualRunning - gasBoilerCost

  return { installLow, installHigh, heatKwh, annualRunning, monthlyRunning, extraVsRadiator, info }
}

export default function UnderfloorHeatingCalculator() {
  const [type, setType] = useState<SystemType>('electric_mat')
  const [project, setProject] = useState<ProjectType>('renovation')
  const [area, setArea] = useState('15')
  const [hours, setHours] = useState('8')

  const a = parseFloat(area) || 0
  const h = parseFloat(hours) || 0
  const result = useMemo(() => calculate(type, a, h, project), [type, a, h, project])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {(Object.entries(SYSTEMS) as [SystemType, typeof SYSTEMS[SystemType]][]).map(([k, v]) => (
          <button key={k} onClick={() => setType(k)} className={`px-3 py-3 rounded-xl text-sm text-left border transition-colors ${type === k ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
            <div className="font-medium">{v.name}</div>
            <div className={`text-xs ${type === k ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>£{v.rates[project][0]}–£{v.rates[project][1]}/m²</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Project</label><select value={project} onChange={(e) => setProject(e.target.value as ProjectType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Project"><option value="renovation">Renovation / retrofit</option><option value="new_build">New build</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Floor Area (m²)</label><input type="number" min="1" max="200" value={area} onChange={(e) => setArea(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Floor Area (m²)" /></div>
        <div><label className="block text-sm font-medium mb-2">Hours/Day Heating</label><input type="number" min="1" max="24" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours/Day Heating" /></div>
      </div>

      {a > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Install Cost</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.installLow)}–{formatCurrency(result.installHigh)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Running</p><p className="text-lg font-bold">{formatCurrency(result.annualRunning)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly Running</p><p className="text-lg font-bold">{formatCurrency(result.monthlyRunning)}</p><p className="text-xs text-muted-foreground">averaged over 12 months</p></div>
            <div className={`rounded-xl p-4 text-center ${result.extraVsRadiator > 0 ? 'bg-destructive/10' : 'bg-muted/50'}`}><p className="text-xs text-muted-foreground">vs Gas Radiators</p><p className={`text-lg font-bold ${result.extraVsRadiator > 0 ? 'text-destructive' : ''}`}>{result.extraVsRadiator > 0 ? `${formatCurrency(result.extraVsRadiator)}/yr dearer` : 'About the same'}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
            <p>{result.info.description}</p>
            <p>Running cost assumes {HEAT_W_PER_SQM} W/m² of heat for the hours you enter on {HEATING_DAYS} days a year ({Math.round(result.heatKwh).toLocaleString('en-GB')} kWh), at the October to December 2026 price cap: {ELECTRICITY_P_PER_KWH}p/kWh electricity, or {GAS_P_PER_KWH}p/kWh gas through a {BOILER_EFFICIENCY * 100}% efficient boiler. Standing charges are left out. Your home's heat loss may differ.</p>
            <p>Install rates are Checkatrade's (June 2026) and leave out floor finishes, screed or levelling, and insulation boards.</p>
          </div>
        </div>
      )}
    </div>
  )
}
