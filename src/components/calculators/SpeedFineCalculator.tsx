import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Sentencing Council speeding guideline (revised 2017): the band depends on the RECORDED speed
// for each limit, not a flat % over. Values = first recorded speed in Band A, B and C.
const BANDS: Record<number, [number, number, number]> = {
  20: [21, 31, 41],
  30: [31, 41, 51],
  40: [41, 56, 66],
  50: [51, 66, 76],
  60: [61, 81, 91],
  70: [71, 91, 101],
}

// Fines as a share of relevant weekly income (net of tax and NI): starting point and range.
const FINE_BANDS = {
  A: { start: 0.5, min: 0.25, max: 0.75, points: '3 points' },
  B: { start: 1.0, min: 0.75, max: 1.25, points: '4 to 6 points or a 7 to 28 day ban' },
  C: { start: 1.5, min: 1.25, max: 1.75, points: '6 points or a 7 to 56 day ban' },
}
type FineBand = keyof typeof FINE_BANDS

// NPCC Guidance on the Enforcement and Disposal of Speeding Offences (2025), section 5.6:
// enforcement (fixed penalty) from, speed awareness course window, summons from.
const NPCC: Record<number, { fpnFrom: number; courseFrom: number; courseTo: number; summonsFrom: number }> = {
  20: { fpnFrom: 24, courseFrom: 24, courseTo: 31, summonsFrom: 35 },
  30: { fpnFrom: 35, courseFrom: 35, courseTo: 42, summonsFrom: 50 },
  40: { fpnFrom: 46, courseFrom: 46, courseTo: 53, summonsFrom: 66 },
  50: { fpnFrom: 57, courseFrom: 57, courseTo: 64, summonsFrom: 76 },
  60: { fpnFrom: 68, courseFrom: 68, courseTo: 75, summonsFrom: 86 },
  70: { fpnFrom: 79, courseFrom: 79, courseTo: 86, summonsFrom: 96 },
}

const FIXED_PENALTY = 100 // plus 3 points (gov.uk/speeding-penalties)
const LOW_INCOME_WEEKLY = 120 // relevant weekly income deemed £120 at or below this, or on benefits
const CAP_ROAD = 1000 // level 3 fine
const CAP_MOTORWAY = 2500 // level 4 fine

function calculate(speedLimit: number, actualSpeed: number, weeklyNetIncome: number, motorway = false) {
  const over = actualSpeed - speedLimit
  const pctOver = speedLimit > 0 ? (over / speedLimit) * 100 : 0
  const bands = BANDS[speedLimit]
  const npcc = NPCC[speedLimit]

  if (over <= 0 || !bands || !npcc) {
    return { band: null, fine: 0, rangeMin: 0, rangeMax: 0, points: '', over, pctOver, relevantIncome: 0, route: 'none' as const, npcc, cap: 0 }
  }

  const band: FineBand = actualSpeed >= bands[2] ? 'C' : actualSpeed >= bands[1] ? 'B' : 'A'
  const f = FINE_BANDS[band]
  const relevantIncome = Math.max(weeklyNetIncome, LOW_INCOME_WEEKLY)
  const cap = motorway ? CAP_MOTORWAY : CAP_ROAD
  const fine = Math.min(relevantIncome * f.start, cap)
  const rangeMin = Math.min(relevantIncome * f.min, cap)
  const rangeMax = Math.min(relevantIncome * f.max, cap)

  const route = actualSpeed >= npcc.summonsFrom
    ? ('summons' as const)
    : actualSpeed < npcc.fpnFrom
      ? ('below' as const)
      : actualSpeed <= npcc.courseTo
        ? ('course' as const)
        : ('fixed' as const)

  return { band, fine, rangeMin, rangeMax, points: f.points, over, pctOver, relevantIncome, route, npcc, cap }
}

export default function SpeedFineCalculator() {
  const [limit, setLimit] = useState('30')
  const [speed, setSpeed] = useState('40')
  const [income, setIncome] = useState('500')
  const [motorway, setMotorway] = useState(false)

  const l = parseInt(limit) || 0
  const s = parseInt(speed) || 0
  const i = parseFloat(income.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(l, s, i, motorway), [l, s, i, motorway])

  const routeText = (() => {
    const n = result.npcc
    if (!n || !result.band) return null
    switch (result.route) {
      case 'course':
        return {
          title: 'Speed awareness course or fixed penalty',
          detail: `Police guidance offers a speed awareness course from ${n.courseFrom} to ${n.courseTo} mph in a ${l} limit, with no points, if you have not attended one in the last 3 years. Otherwise the usual outcome is a fixed penalty of ${formatCurrency(FIXED_PENALTY)} and 3 points. The court fine above applies only if you contest it or are summonsed.`,
        }
      case 'fixed':
        return {
          title: 'Fixed penalty likely',
          detail: `Above ${n.courseTo} mph in a ${l} limit a course is not normally offered. The usual outcome is a fixed penalty of ${formatCurrency(FIXED_PENALTY)} and 3 points. The court fine above applies only if you contest it or are summonsed.`,
        }
      case 'summons':
        return {
          title: 'Court summons',
          detail: `From ${n.summonsFrom} mph in a ${l} limit, police guidance is to summons you to court rather than offer a fixed penalty or course. Expect the court fine above plus a victim surcharge of 40% of the fine and prosecution costs.`,
        }
      default:
        return {
          title: 'Below the usual enforcement threshold',
          detail: `Police guidance normally starts enforcement at ${n.fpnFrom} mph in a ${l} limit, but a force can still prosecute below it. If it did, the court fine above would apply.`,
        }
    }
  })()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Speed Limit (mph)</label>
          <select value={limit} onChange={(e) => setLimit(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Speed Limit (mph)">
            {[20, 30, 40, 50, 60, 70].map(l => <option key={l} value={l}>{l} mph</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Recorded Speed (mph)</label>
          <input type="number" min="0" max="200" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Recorded Speed (mph)" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Weekly Income (after tax and NI)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weekly Income (after tax and NI)" /></div>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={motorway} onChange={(e) => setMotorway(e.target.checked)} className="h-4 w-4 rounded border-input" aria-label="Offence on a motorway" />
        Offence on a motorway (court fine cap {formatCurrency(CAP_MOTORWAY)} instead of {formatCurrency(CAP_ROAD)})
      </label>

      {s > 0 && l > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.band ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}>
            {result.band ? (
              <>
                <p className="text-sm font-semibold">Band {result.band} court fine (starting point)</p>
                <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.fine)}</p>
                <p className="text-sm text-muted-foreground mt-1">{result.points}</p>
                <p className="text-xs text-muted-foreground mt-1">Range {formatCurrency(result.rangeMin)} to {formatCurrency(result.rangeMax)}, capped at {formatCurrency(result.cap)}</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold">No offence</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-400 mt-1">Within the speed limit</p>
              </>
            )}
          </div>
          {routeText && (
            <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">{routeText.title}</p>
              <p className="mt-1">{routeText.detail}</p>
            </div>
          )}
          {result.band && (
            <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
              <p>{result.over} mph over the limit ({result.pctOver.toFixed(0)}% above). Band {result.band} starting point: {FINE_BANDS[result.band].start * 100}% of relevant weekly income (range {FINE_BANDS[result.band].min * 100} to {FINE_BANDS[result.band].max * 100}%).</p>
              <p className="mt-1">Relevant weekly income is take-home pay after tax and NI. Courts treat anything at or below {formatCurrency(LOW_INCOME_WEEKLY)} a week, or income mainly from benefits, as {formatCurrency(LOW_INCOME_WEEKLY)}, and assume {formatCurrency(440)} if you give no information. Income used: {formatCurrency(result.relevantIncome)} a week.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
