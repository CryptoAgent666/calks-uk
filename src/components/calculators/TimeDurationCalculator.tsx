import { useState, useMemo } from 'react'

function calculate(hours1: number, mins1: number, hours2: number, mins2: number) {
  const total1 = hours1 * 60 + mins1
  const total2 = hours2 * 60 + mins2
  let diff = total2 - total1
  if (diff < 0) diff += 24 * 60 // wrap around midnight

  const h = Math.floor(diff / 60)
  const m = diff % 60
  const decimal = diff / 60

  return { hours: h, minutes: m, totalMinutes: diff, decimal }
}

export default function TimeDurationCalculator() {
  const [h1, setH1] = useState('09')
  const [m1, setM1] = useState('00')
  const [h2, setH2] = useState('17')
  const [m2, setM2] = useState('30')

  const result = useMemo(() => calculate(parseInt(h1)||0, parseInt(m1)||0, parseInt(h2)||0, parseInt(m2)||0), [h1, m1, h2, m2])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 justify-center flex-wrap">
        <div className="text-center"><p className="text-xs text-muted-foreground mb-1">Start Time</p><div className="flex items-center gap-1"><input type="number" min="0" max="23" value={h1} onChange={(e) => setH1(e.target.value)} className="w-14 rounded-lg border border-input bg-background px-2 py-2 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-ring" /><span className="text-xl font-bold">:</span><input type="number" min="0" max="59" value={m1} onChange={(e) => setM1(e.target.value)} className="w-14 rounded-lg border border-input bg-background px-2 py-2 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <span className="text-2xl text-muted-foreground">→</span>
        <div className="text-center"><p className="text-xs text-muted-foreground mb-1">End Time</p><div className="flex items-center gap-1"><input type="number" min="0" max="23" value={h2} onChange={(e) => setH2(e.target.value)} className="w-14 rounded-lg border border-input bg-background px-2 py-2 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-ring" /><span className="text-xl font-bold">:</span><input type="number" min="0" max="59" value={m2} onChange={(e) => setM2(e.target.value)} className="w-14 rounded-lg border border-input bg-background px-2 py-2 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>

      <div className="rounded-2xl bg-primary/10 p-6 text-center animate-fade-in-up">
        <p className="text-sm text-muted-foreground">Duration</p>
        <p className="text-3xl font-bold text-primary mt-1">{result.hours}h {result.minutes}m</p>
        <p className="text-sm text-muted-foreground mt-1">{result.totalMinutes} minutes &middot; {result.decimal.toFixed(2)} decimal hours</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {[{l:'9-5',h1:'09',m1:'00',h2:'17',m2:'00'},{l:'9-5:30',h1:'09',m1:'00',h2:'17',m2:'30'},{l:'8-4',h1:'08',m1:'00',h2:'16',m2:'00'},{l:'Night 22-6',h1:'22',m1:'00',h2:'06',m2:'00'}].map(p => (
          <button key={p.l} onClick={() => {setH1(p.h1);setM1(p.m1);setH2(p.h2);setM2(p.m2)}} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent">{p.l}</button>
        ))}
      </div>
    </div>
  )
}
