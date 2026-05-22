import { useState, useMemo } from 'react'

function calculate(lastPeriod: string, cycleLength: number) {
  if (!lastPeriod) return null
  const lmp = new Date(lastPeriod)

  const ovulationDay = new Date(lmp)
  ovulationDay.setDate(ovulationDay.getDate() + cycleLength - 14)

  const fertileStart = new Date(ovulationDay)
  fertileStart.setDate(fertileStart.getDate() - 5)

  const fertileEnd = new Date(ovulationDay)
  fertileEnd.setDate(fertileEnd.getDate() + 1)

  const nextPeriod = new Date(lmp)
  nextPeriod.setDate(nextPeriod.getDate() + cycleLength)

  // Next 3 cycles
  const cycles: { ovulation: Date; fertileStart: Date; fertileEnd: Date; nextPeriod: Date }[] = []
  for (let i = 0; i < 3; i++) {
    const cycleStart = new Date(lmp)
    cycleStart.setDate(cycleStart.getDate() + cycleLength * i)
    const ov = new Date(cycleStart)
    ov.setDate(ov.getDate() + cycleLength - 14)
    const fs = new Date(ov); fs.setDate(fs.getDate() - 5)
    const fe = new Date(ov); fe.setDate(fe.getDate() + 1)
    const np = new Date(cycleStart); np.setDate(np.getDate() + cycleLength)
    cycles.push({ ovulation: ov, fertileStart: fs, fertileEnd: fe, nextPeriod: np })
  }

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const fmtLong = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })

  return { ovulationDay: fmtLong(ovulationDay), fertileWindow: `${fmt(fertileStart)} – ${fmt(fertileEnd)}`, nextPeriod: fmtLong(nextPeriod), cycles: cycles.map(c => ({ ovulation: fmt(c.ovulation), fertile: `${fmt(c.fertileStart)} – ${fmt(c.fertileEnd)}`, period: fmt(c.nextPeriod) })) }
}

export default function OvulationCalculator() {
  const [lmp, setLmp] = useState('')
  const [cycle, setCycle] = useState('28')

  const c = parseInt(cycle) || 28
  const result = useMemo(() => calculate(lmp, c), [lmp, c])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">First Day of Last Period</label><input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="First Day of Last Period" /></div>
        <div><label className="block text-sm font-medium mb-2">Average Cycle Length (days)</label><input type="number" min="21" max="40" value={cycle} onChange={(e) => setCycle(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Average Cycle Length (days)" />
          <div className="flex gap-2 mt-2">{[26, 28, 30, 32].map(v => <button key={v} onClick={() => setCycle(v.toString())} className={`px-3 py-1 rounded-lg text-xs font-medium ${parseInt(cycle)===v ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`}>{v}</button>)}</div></div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-pink-100 dark:bg-pink-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Ovulation</p>
            <p className="text-2xl font-bold text-pink-700 dark:text-pink-400 mt-1">{result.ovulationDay}</p>
            <p className="text-sm text-muted-foreground mt-1">Fertile window: {result.fertileWindow}</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <p className="text-xs text-muted-foreground">Next Period Expected</p>
            <p className="text-lg font-bold">{result.nextPeriod}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Next 3 Cycles</h3>
            <div className="space-y-2">
              {result.cycles.map((c, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div><span className="text-sm font-medium">Cycle {i + 1}</span><span className="text-xs text-muted-foreground ml-2">Fertile: {c.fertile}</span></div>
                  <div className="text-right"><span className="text-sm font-medium text-pink-700 dark:text-pink-400">{c.ovulation}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Ovulation typically occurs ~14 days before your next period. The fertile window is 5 days before and 1 day after ovulation. This is an estimate — actual ovulation varies.</p>
          </div>
        </div>
      )}
    </div>
  )
}
