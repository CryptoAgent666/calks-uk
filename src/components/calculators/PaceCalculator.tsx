import { useState, useMemo } from 'react'

type Mode = 'pace' | 'time' | 'distance'

function calculate(mode: Mode, distanceKm: number, hours: number, minutes: number, seconds: number, paceMin: number, paceSec: number) {
  const totalSeconds = hours * 3600 + minutes * 60 + seconds
  const paceSeconds = paceMin * 60 + paceSec

  if (mode === 'pace' && distanceKm > 0 && totalSeconds > 0) {
    const pacePerKm = totalSeconds / distanceKm
    const pacePerMile = pacePerKm * 1.60934
    const speedKmh = (distanceKm / totalSeconds) * 3600
    return { pacePerKm, pacePerMile, speedKmh, totalSeconds, distanceKm }
  }
  if (mode === 'time' && distanceKm > 0 && paceSeconds > 0) {
    const total = distanceKm * paceSeconds
    const speedKmh = (distanceKm / total) * 3600
    return { pacePerKm: paceSeconds, pacePerMile: paceSeconds * 1.60934, speedKmh, totalSeconds: total, distanceKm }
  }
  if (mode === 'distance' && totalSeconds > 0 && paceSeconds > 0) {
    const dist = totalSeconds / paceSeconds
    return { pacePerKm: paceSeconds, pacePerMile: paceSeconds * 1.60934, speedKmh: (dist / totalSeconds) * 3600, totalSeconds, distanceKm: dist }
  }
  return null
}

const fmtTime = (secs: number) => {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = Math.floor(secs % 60)
  return h > 0 ? `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}` : `${m}:${s.toString().padStart(2,'0')}`
}

const PRESETS = [{l:'5K',v:5},{l:'10K',v:10},{l:'Half Marathon',v:21.0975},{l:'Marathon',v:42.195}]

export default function PaceCalculator() {
  const [mode, setMode] = useState<Mode>('pace')
  const [dist, setDist] = useState('10')
  const [h, setH] = useState('0')
  const [m, setM] = useState('50')
  const [s, setS] = useState('0')
  const [pm, setPm] = useState('5')
  const [ps, setPs] = useState('0')

  const result = useMemo(() => calculate(mode, parseFloat(dist)||0, parseInt(h)||0, parseInt(m)||0, parseInt(s)||0, parseInt(pm)||0, parseInt(ps)||0), [mode, dist, h, m, s, pm, ps])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {([{v:'pace' as Mode,l:'Calculate Pace'},{v:'time' as Mode,l:'Calculate Time'},{v:'distance' as Mode,l:'Calculate Distance'}]).map(o => (
          <button key={o.v} onClick={() => setMode(o.v)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${mode === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{o.l}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mode !== 'distance' && (
          <div>
            <label className="block text-sm font-medium mb-2">Distance (km)</label>
            <input type="number" min="0" step="0.01" value={dist} onChange={(e) => setDist(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Distance (km)" />
            <div className="flex gap-2 mt-2">{PRESETS.map(p => <button key={p.l} onClick={() => setDist(p.v.toString())} className="px-2 py-1 rounded-lg bg-muted text-xs font-medium hover:bg-accent transition-colors">{p.l}</button>)}</div>
          </div>
        )}
        {mode !== 'time' && (
          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <div className="grid grid-cols-3 gap-2">
              <div><label className="block text-xs text-muted-foreground mb-1">Hours</label><input type="number" min="0" max="24" value={h} onChange={(e) => setH(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 font-medium text-center focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours" /></div>
              <div><label className="block text-xs text-muted-foreground mb-1">Minutes</label><input type="number" min="0" max="59" value={m} onChange={(e) => setM(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 font-medium text-center focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Minutes" /></div>
              <div><label className="block text-xs text-muted-foreground mb-1">Seconds</label><input type="number" min="0" max="59" value={s} onChange={(e) => setS(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 font-medium text-center focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Seconds" /></div>
            </div>
          </div>
        )}
        {mode !== 'pace' && (
          <div>
            <label className="block text-sm font-medium mb-2">Pace (per km)</label>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="block text-xs text-muted-foreground mb-1">Minutes</label><input type="number" min="0" max="30" value={pm} onChange={(e) => setPm(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 font-medium text-center focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Minutes" /></div>
              <div><label className="block text-xs text-muted-foreground mb-1">Seconds</label><input type="number" min="0" max="59" value={ps} onChange={(e) => setPs(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 font-medium text-center focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Seconds" /></div>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Pace /km</p><p className="text-xl font-bold text-primary">{fmtTime(result.pacePerKm)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Pace /mile</p><p className="text-lg font-bold">{fmtTime(result.pacePerMile)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Time</p><p className="text-lg font-bold">{fmtTime(result.totalSeconds)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Speed</p><p className="text-lg font-bold">{result.speedKmh.toFixed(1)} km/h</p></div>
        </div>
      )}
    </div>
  )
}
