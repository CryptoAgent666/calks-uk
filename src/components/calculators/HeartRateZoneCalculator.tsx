import { useState, useMemo } from 'react'

function calculate(age: number, restingHR: number) {
  const maxHR = 220 - age
  const hrReserve = maxHR - restingHR

  const zones = [
    { name: 'Zone 1 — Recovery', min: 0.50, max: 0.60, color: 'bg-blue-100 dark:bg-blue-950', textColor: 'text-blue-700 dark:text-blue-400', benefit: 'Active recovery, warm-up' },
    { name: 'Zone 2 — Aerobic', min: 0.60, max: 0.70, color: 'bg-green-100 dark:bg-green-950', textColor: 'text-green-700 dark:text-green-400', benefit: 'Fat burning, endurance base' },
    { name: 'Zone 3 — Tempo', min: 0.70, max: 0.80, color: 'bg-yellow-100 dark:bg-yellow-950', textColor: 'text-yellow-700 dark:text-yellow-400', benefit: 'Aerobic fitness improvement' },
    { name: 'Zone 4 — Threshold', min: 0.80, max: 0.90, color: 'bg-orange-100 dark:bg-orange-950', textColor: 'text-orange-700 dark:text-orange-400', benefit: 'Speed endurance, lactate threshold' },
    { name: 'Zone 5 — Maximum', min: 0.90, max: 1.00, color: 'bg-red-100 dark:bg-red-950', textColor: 'text-red-700 dark:text-red-400', benefit: 'Maximum effort, sprinting' },
  ].map(z => ({
    ...z,
    hrMin: Math.round(restingHR + hrReserve * z.min),
    hrMax: Math.round(restingHR + hrReserve * z.max),
  }))

  return { maxHR, hrReserve, zones }
}

export default function HeartRateZoneCalculator() {
  const [age, setAge] = useState('30')
  const [resting, setResting] = useState('65')

  const a = parseInt(age) || 0
  const r = parseInt(resting) || 0
  const result = useMemo(() => a > 0 ? calculate(a, r) : null, [a, r])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Age</label><input type="number" min="10" max="90" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Age" /></div>
        <div><label className="block text-sm font-medium mb-2">Resting Heart Rate (BPM)</label><input type="number" min="30" max="120" value={resting} onChange={(e) => setResting(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Resting Heart Rate (BPM)" /><p className="text-xs text-muted-foreground mt-1">Measure first thing in the morning</p></div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Max Heart Rate</p><p className="text-2xl font-bold text-primary">{result.maxHR} BPM</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Heart Rate Reserve</p><p className="text-2xl font-bold">{result.hrReserve} BPM</p></div>
          </div>
          <div className="space-y-2">
            {result.zones.map(z => (
              <div key={z.name} className={`rounded-xl ${z.color} p-4 flex items-center justify-between`}>
                <div><p className={`text-sm font-semibold ${z.textColor}`}>{z.name}</p><p className="text-xs text-muted-foreground">{z.benefit}</p></div>
                <p className={`text-xl font-bold font-mono ${z.textColor}`}>{z.hrMin}–{z.hrMax}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">Using Karvonen formula (heart rate reserve method) for more accurate zones.</div>
        </div>
      )}
    </div>
  )
}
