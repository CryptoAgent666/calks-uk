import { useState, useMemo } from 'react'

type Mode = 'speed' | 'distance' | 'time'

function calculate(mode: Mode, speed: number, distance: number, hours: number, minutes: number) {
  const timeHours = hours + minutes / 60

  if (mode === 'speed' && distance > 0 && timeHours > 0) {
    const s = distance / timeHours
    return { speed: s, distance, timeHours, speedMph: s, speedKmh: s * 1.60934 }
  }
  if (mode === 'distance' && speed > 0 && timeHours > 0) {
    const d = speed * timeHours
    return { speed, distance: d, timeHours, speedMph: speed, speedKmh: speed * 1.60934 }
  }
  if (mode === 'time' && speed > 0 && distance > 0) {
    const t = distance / speed
    return { speed, distance, timeHours: t, speedMph: speed, speedKmh: speed * 1.60934 }
  }
  return null
}

// Says why there is no answer, using only the inputs the current mode shows
function inputProblem(mode: Mode, speed: number, distance: number, hours: number, minutes: number) {
  const usesSpeed = mode !== 'speed'
  const usesDistance = mode !== 'distance'
  const usesTime = mode !== 'time'
  if ((usesSpeed && speed < 0) || (usesDistance && distance < 0) || (usesTime && (hours < 0 || minutes < 0))) {
    return 'Speed, distance and time cannot be negative.'
  }
  if (usesSpeed && speed === 0) return 'Enter a speed above 0 mph.'
  if (usesDistance && distance === 0) return 'Enter a distance above 0 miles.'
  if (usesTime && hours + minutes / 60 === 0) return 'Enter a time above zero, in hours, minutes or both.'
  return null
}

// Rounds to the whole minute first, so 2.995 hours reads 3h 0m and never 2h 60m
function formatTime(timeHours: number) {
  const totalMinutes = Math.round(timeHours * 60)
  if (totalMinutes === 0) return `${Math.round(timeHours * 3600)}s`
  return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
}

export default function SpeedDistanceTimeCalculator() {
  const [mode, setMode] = useState<Mode>('speed')
  const [speed, setSpeed] = useState('60')
  const [distance, setDistance] = useState('150')
  const [hours, setHours] = useState('2')
  const [mins, setMins] = useState('30')

  const s = parseFloat(speed) || 0
  const d = parseFloat(distance) || 0
  const h = parseFloat(hours) || 0
  const m = parseFloat(mins) || 0
  const problem = inputProblem(mode, s, d, h, m)
  const result = useMemo(() => problem ? null : calculate(mode, s, d, h, m), [problem, mode, s, d, h, m])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {([{v:'speed' as Mode,l:'Calculate Speed'},{v:'distance' as Mode,l:'Calculate Distance'},{v:'time' as Mode,l:'Calculate Time'}]).map(o => (
          <button key={o.v} onClick={() => setMode(o.v)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${mode === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{o.l}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {mode !== 'speed' && <div><label className="block text-sm font-medium mb-2">Speed (mph)</label><input type="number" min="0" step="1" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Speed (mph)" /></div>}
        {mode !== 'distance' && <div><label className="block text-sm font-medium mb-2">Distance (miles)</label><input type="number" min="0" step="1" value={distance} onChange={(e) => setDistance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Distance (miles)" /></div>}
        {mode !== 'time' && <div><label className="block text-sm font-medium mb-2">Time</label><div className="flex gap-2"><div className="flex items-center gap-1"><input type="number" min="0" max="99" step="any" value={hours} onChange={(e) => setHours(e.target.value)} className="w-16 rounded-lg border border-input bg-background px-2 py-3 text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Time" /><span className="text-sm">h</span></div><div className="flex items-center gap-1"><input type="number" min="0" step="any" value={mins} onChange={(e) => setMins(e.target.value)} className="w-16 rounded-lg border border-input bg-background px-2 py-3 text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" /><span className="text-sm">m</span></div></div></div>}
      </div>

      {problem && (
        <div role="alert" className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          {problem}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
          <div className={`rounded-xl p-4 text-center ${mode === 'speed' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Speed</p><p className="text-xl font-bold">{result.speed.toFixed(1)} mph</p><p className="text-xs text-muted-foreground">{result.speedKmh.toFixed(1)} km/h</p></div>
          <div className={`rounded-xl p-4 text-center ${mode === 'distance' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Distance</p><p className="text-xl font-bold">{result.distance.toFixed(1)} miles</p><p className="text-xs text-muted-foreground">{(result.distance * 1.60934).toFixed(1)} km</p></div>
          <div className={`rounded-xl p-4 text-center ${mode === 'time' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Time</p><p className="text-xl font-bold">{formatTime(result.timeHours)}</p><p className="text-xs text-muted-foreground">{result.timeHours.toFixed(2)} decimal hrs</p></div>
        </div>
      )}

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground text-center">
        Speed = Distance ÷ Time &middot; Distance = Speed × Time &middot; Time = Distance ÷ Speed
      </div>
    </div>
  )
}
