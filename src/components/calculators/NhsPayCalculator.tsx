import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// NHS Agenda for Change pay bands 2026/27 (approximate, ~3.5% uplift from 2024/25)
// Verify exact figures at nhsemployers.org — pay award effective April 2025
const NHS_BANDS: Record<string, { min: number; max: number; description: string }> = {
  '1': { min: 24_442, max: 24_442, description: 'Support staff' },
  '2': { min: 24_442, max: 26_573, description: 'Healthcare assistants, porters' },
  '3': { min: 26_573, max: 29_401, description: 'Senior HCA, admin' },
  '4': { min: 27_459, max: 30_133, description: 'Associate practitioners' },
  '5': { min: 31_019, max: 37_760, description: 'Newly qualified nurses, therapists' },
  '6': { min: 38_645, max: 46_535, description: 'Senior nurses, specialists' },
  '7': { min: 47_763, max: 54_657, description: 'Advanced practitioners, team leaders' },
  '8a': { min: 55_637, max: 62_622, description: 'Consultant therapists, senior managers' },
  '8b': { min: 64_393, max: 74_823, description: 'Principal specialists' },
  '8c': { min: 76_890, max: 89_934, description: 'Senior managers' },
  '8d': { min: 91_254, max: 105_984, description: 'Director level' },
  '9': { min: 109_074, max: 125_515, description: 'Executive level' },
}

function calculate(band: string, point: number) {
  const info = NHS_BANDS[band]
  if (!info) return null
  const range = info.max - info.min
  const salary = info.min + range * (point / 100)
  const monthly = salary / 12
  const weekly = salary / 52
  const hourly = salary / (37.5 * 52)

  // After tax/NI (simplified)
  let tax = 0
  if (salary > 12_570) {
    if (salary <= 50_270) tax = (salary - 12_570) * 0.20
    else tax = (50_270 - 12_570) * 0.20 + (salary - 50_270) * 0.40
  }
  let ni = 0
  if (salary > 12_570) {
    if (salary <= 50_270) ni = (salary - 12_570) * 0.08
    else ni = (50_270 - 12_570) * 0.08 + (salary - 50_270) * 0.02
  }
  const takeHome = salary - tax - ni

  return { salary, monthly, weekly, hourly, takeHome, monthlyTakeHome: takeHome / 12, tax, ni, info }
}

export default function NhsPayCalculator() {
  const [band, setBand] = useState('5')
  const [point, setPoint] = useState('50')

  const result = useMemo(() => calculate(band, parseInt(point) || 50), [band, point])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">AFC Band</label><select value={band} onChange={(e) => setBand(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="AFC Band">
          {Object.entries(NHS_BANDS).map(([k, v]) => <option key={k} value={k}>Band {k} — {v.description}</option>)}
        </select></div>
        <div><label className="block text-sm font-medium mb-2">Pay Point (% through band)</label><input type="range" min="0" max="100" value={point} onChange={(e) => setPoint(e.target.value)} className="w-full mt-3"  aria-label="Pay Point (% through band)" /><div className="flex justify-between text-xs text-muted-foreground"><span>Bottom ({formatCurrency(NHS_BANDS[band]?.min || 0)})</span><span>Top ({formatCurrency(NHS_BANDS[band]?.max || 0)})</span></div></div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Band {band} Salary</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.salary)}</p>
            <p className="text-sm text-muted-foreground mt-1">Take home: {formatCurrency(result.monthlyTakeHome)}/month</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Monthly Gross</p><p className="text-lg font-bold">{formatCurrency(result.monthly)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Weekly</p><p className="text-lg font-bold">{formatCurrency(result.weekly)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Hourly</p><p className="text-lg font-bold">{formatCurrency(result.hourly)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Annual Take Home</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.takeHome)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
