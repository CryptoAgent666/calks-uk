import { useState, useMemo } from 'react'
import { formatCurrency, ukIncomeTax } from '@/utils'

// NHS Agenda for Change pay points 2026/27 (England), verified vs
// nhsemployers.org/articles/pay-scales-202627. AfC pays discrete step points,
// not a continuous range: entry, an intermediate point for Bands 5-9, and top.
type PayPoint = { label: string; salary: number }
const NHS_BANDS: Record<string, { points: PayPoint[]; description: string }> = {
  '1': { points: [{ label: 'Single point', salary: 25_272 }], description: 'Support staff (closed to new entrants)' },
  '2': { points: [{ label: 'Single point', salary: 25_272 }], description: 'Healthcare assistants, porters' },
  '3': { points: [{ label: 'Entry (0-2 years)', salary: 25_760 }, { label: 'Top (2+ years)', salary: 27_476 }], description: 'Senior HCA, admin' },
  '4': { points: [{ label: 'Entry (0-3 years)', salary: 28_392 }, { label: 'Top (3+ years)', salary: 31_157 }], description: 'Associate practitioners' },
  '5': { points: [{ label: 'Entry (0-2 years)', salary: 32_073 }, { label: 'Intermediate (2-4 years)', salary: 34_592 }, { label: 'Top (4+ years)', salary: 39_043 }], description: 'Newly qualified nurses, therapists' },
  '6': { points: [{ label: 'Entry (0-2 years)', salary: 39_959 }, { label: 'Intermediate (2-5 years)', salary: 42_170 }, { label: 'Top (5+ years)', salary: 48_117 }], description: 'Senior nurses, specialists' },
  '7': { points: [{ label: 'Entry (0-2 years)', salary: 49_387 }, { label: 'Intermediate (2-5 years)', salary: 51_932 }, { label: 'Top (5+ years)', salary: 56_515 }], description: 'Advanced practitioners, team leaders' },
  '8a': { points: [{ label: 'Entry (0-2 years)', salary: 57_528 }, { label: 'Intermediate (2-5 years)', salary: 60_417 }, { label: 'Top (5+ years)', salary: 64_750 }], description: 'Consultant therapists, senior managers' },
  '8b': { points: [{ label: 'Entry (0-2 years)', salary: 66_582 }, { label: 'Intermediate (2-5 years)', salary: 70_896 }, { label: 'Top (5+ years)', salary: 77_368 }], description: 'Principal specialists' },
  '8c': { points: [{ label: 'Entry (0-2 years)', salary: 79_504 }, { label: 'Intermediate (2-5 years)', salary: 84_346 }, { label: 'Top (5+ years)', salary: 91_609 }], description: 'Senior managers' },
  '8d': { points: [{ label: 'Entry (0-2 years)', salary: 94_356 }, { label: 'Intermediate (2-5 years)', salary: 100_140 }, { label: 'Top (5+ years)', salary: 108_814 }], description: 'Director level' },
  '9': { points: [{ label: 'Entry (0-2 years)', salary: 112_782 }, { label: 'Intermediate (2-5 years)', salary: 119_583 }, { label: 'Top (5+ years)', salary: 129_783 }], description: 'Executive level' },
}

// Explicit display order — object key iteration would put numeric '9' before string '8a'
const BAND_ORDER = ['1', '2', '3', '4', '5', '6', '7', '8a', '8b', '8c', '8d', '9']

// High Cost Area Supplements 2026/27: % of basic salary, with a minimum and maximum
const HCAS: Record<string, { label: string; rate: number; min: number; max: number }> = {
  none: { label: 'No supplement', rate: 0, min: 0, max: 0 },
  inner: { label: 'Inner London (20%)', rate: 0.20, min: 5_794, max: 8_746 },
  outer: { label: 'Outer London (15%)', rate: 0.15, min: 4_870, max: 6_137 },
  fringe: { label: 'Fringe (5%)', rate: 0.05, min: 1_346, max: 2_270 },
}

// NHS Pension employee contribution tiers from 1 April 2026 (NHSBSA). The tier
// rate applies to ALL pensionable pay, not just the slice inside the tier.
const PENSION_TIERS: { upTo: number; rate: number }[] = [
  { upTo: 13_259, rate: 0.052 },
  { upTo: 28_854, rate: 0.065 },
  { upTo: 35_155, rate: 0.083 },
  { upTo: 52_778, rate: 0.098 },
  { upTo: 67_668, rate: 0.107 },
  { upTo: Infinity, rate: 0.125 },
]

function pensionRate(pensionablePay: number) {
  const pay = Math.floor(pensionablePay)
  return PENSION_TIERS.find((t) => pay <= t.upTo)!.rate
}

function calculate(band: string, pointIndex: number, area: string, inPension: boolean) {
  const info = NHS_BANDS[band]
  if (!info) return null
  const point = info.points[Math.min(pointIndex, info.points.length - 1)]
  const basic = point.salary
  const zone = HCAS[area] || HCAS.none
  const hcas = zone.rate ? Math.min(zone.max, Math.max(zone.min, basic * zone.rate)) : 0
  const gross = basic + hcas

  // HCAS is pensionable, so the tier is set on basic + HCAS
  const rate = inPension ? pensionRate(gross) : 0
  const pension = gross * rate

  // Net pay arrangement: pension comes off before income tax, but not before NI
  const taxable = gross - pension
  const tax = ukIncomeTax(taxable)
  let ni = 0
  if (gross > 12_570) {
    if (gross <= 50_270) ni = (gross - 12_570) * 0.08
    else ni = (50_270 - 12_570) * 0.08 + (gross - 50_270) * 0.02
  }
  const takeHome = gross - pension - tax - ni

  // NHS Employers' hourly basis: annual basic ÷ 52.143 weeks ÷ 37.5 hours
  const hourly = basic / 52.143 / 37.5

  return { point, basic, hcas, gross, rate, pension, tax, ni, takeHome, monthly: gross / 12, monthlyTakeHome: takeHome / 12, hourly, info }
}

export default function NhsPayCalculator() {
  const [band, setBand] = useState('5')
  const [point, setPoint] = useState('0')
  const [area, setArea] = useState('none')
  const [inPension, setInPension] = useState(true)

  const points = NHS_BANDS[band]?.points || []
  const pointIndex = Math.min(parseInt(point) || 0, points.length - 1)
  const result = useMemo(() => calculate(band, pointIndex, area, inPension), [band, pointIndex, area, inPension])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">AfC Band</label><select value={band} onChange={(e) => { setBand(e.target.value); setPoint('0') }} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="AfC Band">
          {BAND_ORDER.map((k) => <option key={k} value={k}>Band {k} · {NHS_BANDS[k].description}</option>)}
        </select></div>
        <div><label className="block text-sm font-medium mb-2">Pay Point</label><select value={String(pointIndex)} onChange={(e) => setPoint(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Pay Point">
          {points.map((p, i) => <option key={p.label} value={i}>{p.label} · {formatCurrency(p.salary)}</option>)}
        </select></div>
        <div><label className="block text-sm font-medium mb-2">High Cost Area Supplement</label><select value={area} onChange={(e) => setArea(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="High Cost Area Supplement">
          {Object.entries(HCAS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select></div>
        <div className="flex items-end pb-3">
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={inPension} onChange={(e) => setInPension(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Member of the NHS Pension Scheme</span></label>
        </div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Band {band} Gross Pay{result.hcas > 0 ? ' incl. HCAS' : ''}</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.gross)}</p>
            <p className="text-sm text-muted-foreground mt-1">Take home: {formatCurrency(result.monthlyTakeHome)}/month</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Basic Pay</p><p className="text-lg font-bold">{formatCurrency(result.basic)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">HCAS</p><p className="text-lg font-bold">{formatCurrency(result.hcas)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Monthly Gross</p><p className="text-lg font-bold">{formatCurrency(result.monthly)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Hourly (basic)</p><p className="text-lg font-bold">{formatCurrency(result.hourly)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">NHS Pension ({(result.rate * 100).toFixed(1)}%)</p><p className="text-lg font-bold">{formatCurrency(result.pension)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Income Tax</p><p className="text-lg font-bold">{formatCurrency(result.tax)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">National Insurance</p><p className="text-lg font-bold">{formatCurrency(result.ni)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Annual Take Home</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.takeHome)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
