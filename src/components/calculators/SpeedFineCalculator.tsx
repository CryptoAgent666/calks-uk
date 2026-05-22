import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// UK speeding fine bands 2025
function calculate(speedLimit: number, actualSpeed: number, weeklyIncome: number) {
  const over = actualSpeed - speedLimit
  const pctOver = (over / speedLimit) * 100

  if (over <= 0) return { band: 'No offence', fine: 0, points: 0, description: 'You were within the speed limit.' }

  let band: string
  let finePct: number
  let points: string
  let description: string

  if (pctOver <= 10 || over <= 5) {
    // May not be prosecuted (threshold typically limit + 10% + 2mph)
    band = 'Below prosecution threshold'
    finePct = 0
    points = '0'
    description = 'Most forces do not prosecute until speed exceeds limit + 10% + 2mph.'
  } else if (pctOver <= 30) {
    band = 'Band A'
    finePct = 0.25 // 25-75% of weekly income, starting point 50%
    points = '3'
    description = 'Starting point: 50% of weekly income. Range: 25-75%. 3 points.'
  } else if (pctOver <= 50) {
    band = 'Band B'
    finePct = 0.75 // 75-125%, starting 100%
    points = '4-6 or 7-28 day ban'
    description = 'Starting point: 100% of weekly income. Range: 75-125%. 4-6 points or 7-28 day ban.'
  } else {
    band = 'Band C'
    finePct = 1.25 // 125-175%, starting 150%
    points = '6 or 7-56 day ban'
    description = 'Starting point: 150% of weekly income. Range: 125-175%. 6 points or 7-56 day ban.'
  }

  const fine = Math.max(finePct > 0 ? Math.min(weeklyIncome * finePct, 1000) : 0, finePct > 0 ? 100 : 0) // min £100, max £1000 for magistrates

  return { band, fine, points, description, over, pctOver }
}

export default function SpeedFineCalculator() {
  const [limit, setLimit] = useState('30')
  const [speed, setSpeed] = useState('40')
  const [income, setIncome] = useState('500')

  const l = parseInt(limit) || 0
  const s = parseInt(speed) || 0
  const i = parseFloat(income) || 0
  const result = useMemo(() => calculate(l, s, i), [l, s, i])

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
          <label className="block text-sm font-medium mb-2">Your Speed (mph)</label>
          <input type="number" min="0" max="200" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Speed (mph)" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Weekly Income (gross)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="number" min="0" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weekly Income (gross)" /></div>
        </div>
      </div>

      {s > 0 && l > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.fine > 0 ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}>
            <p className="text-sm font-semibold">{result.band}</p>
            {result.fine > 0 ? (
              <>
                <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.fine)}</p>
                <p className="text-sm text-muted-foreground mt-1">{result.points} penalty points</p>
              </>
            ) : (
              <p className="text-xl font-bold text-green-700 dark:text-green-400 mt-1">No fine expected</p>
            )}
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>{result.description}</p>
            {'over' in result && result.over > 0 && <p className="mt-1">{result.over} mph over the limit ({result.pctOver.toFixed(0)}% above).</p>}
          </div>
        </div>
      )}
    </div>
  )
}
