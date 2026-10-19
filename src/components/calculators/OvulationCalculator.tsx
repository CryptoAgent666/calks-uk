import { useState, useMemo } from 'react'

const MIN_CYCLE = 21
const MAX_CYCLE = 45
// Ovulation is estimated 14 days before the next expected period (NHS: usually 10 to 16 days before)
const LUTEAL_DAYS = 14
// Fertile window: the 5 days before ovulation plus ovulation day itself
const DAYS_BEFORE_OVULATION = 5

// Parse 'YYYY-MM-DD' as a local calendar date. new Date('YYYY-MM-DD') is read as UTC midnight,
// which shows the previous day for anyone west of UTC.
function parseLocalDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return isNaN(d.getTime()) ? null : d
}

function addDays(d: Date, days: number) {
  const out = new Date(d)
  out.setDate(out.getDate() + days)
  return out
}

function calculate(lastPeriod: string, cycleLength: number) {
  const lmp = parseLocalDate(lastPeriod)
  if (!lmp) return null

  const cycles = [0, 1, 2].map((i) => {
    const cycleStart = addDays(lmp, cycleLength * i)
    const nextPeriod = addDays(cycleStart, cycleLength)
    const ovulation = addDays(nextPeriod, -LUTEAL_DAYS)
    const fertileStart = addDays(ovulation, -DAYS_BEFORE_OVULATION)
    return { cycleStart, ovulation, fertileStart, fertileEnd: ovulation, nextPeriod }
  })

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const fmtLong = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })
  const first = cycles[0]

  return {
    ovulationDay: fmtLong(first.ovulation),
    cycleDay: cycleLength - LUTEAL_DAYS + 1,
    fertileWindow: `${fmt(first.fertileStart)} – ${fmt(first.fertileEnd)}`,
    nextPeriod: fmtLong(first.nextPeriod),
    cycles: cycles.map(c => ({ start: fmt(c.cycleStart), ovulation: fmt(c.ovulation), fertile: `${fmt(c.fertileStart)} – ${fmt(c.fertileEnd)}` })),
  }
}

export default function OvulationCalculator() {
  const [lmp, setLmp] = useState('')
  const [cycle, setCycle] = useState('28')

  const parsed = parseInt(cycle)
  const c = Number.isFinite(parsed) ? parsed : 28
  const cycleOk = c >= MIN_CYCLE && c <= MAX_CYCLE
  const result = useMemo(() => (cycleOk ? calculate(lmp, c) : null), [lmp, c, cycleOk])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">First Day of Last Period</label><input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="First Day of Last Period" /></div>
        <div><label className="block text-sm font-medium mb-2">Average Cycle Length (days)</label><input type="number" min={MIN_CYCLE} max={MAX_CYCLE} value={cycle} onChange={(e) => setCycle(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Average Cycle Length (days)" />
          <div className="flex gap-2 mt-2">{[26, 28, 30, 32].map(v => <button key={v} type="button" onClick={() => setCycle(v.toString())} className={`px-3 py-1 rounded-lg text-xs font-medium ${parseInt(cycle)===v ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`}>{v}</button>)}</div>
          {!cycleOk && <p className="text-sm text-destructive mt-2" role="alert">Enter an average cycle length between {MIN_CYCLE} and {MAX_CYCLE} days. This calendar method cannot estimate ovulation for cycles outside that range.</p>}
        </div>
      </div>

      {!lmp && cycleOk && (
        <p className="text-sm text-muted-foreground">Enter the first day of your last period to see your estimated ovulation date and fertile window.</p>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in-up" aria-live="polite">
          <div className="rounded-2xl bg-pink-100 dark:bg-pink-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Ovulation</p>
            <p className="text-2xl font-bold text-pink-700 dark:text-pink-400 mt-1">{result.ovulationDay}</p>
            <p className="text-sm text-muted-foreground mt-1">Day {result.cycleDay} of your cycle · Fertile window: {result.fertileWindow}</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <p className="text-xs text-muted-foreground">Next Period Expected</p>
            <p className="text-lg font-bold">{result.nextPeriod}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">This cycle and the next two</h3>
            <div className="space-y-2">
              {result.cycles.map((cy, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div><span className="text-sm font-medium">Cycle from {cy.start}</span><span className="text-xs text-muted-foreground ml-2">Fertile: {cy.fertile}</span></div>
                  <div className="text-right"><span className="text-xs text-muted-foreground mr-1">Ovulation</span><span className="text-sm font-medium text-pink-700 dark:text-pink-400">{cy.ovulation}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
        <p>Ovulation usually happens 10 to 16 days before the next period (NHS). This estimate uses 14 days, and the fertile window shown is the 5 days before ovulation plus ovulation day. Sperm can survive for up to 7 days, and actual ovulation varies from cycle to cycle.</p>
        <p>NICE says that having sex every 2 to 3 days optimises the chance of pregnancy.</p>
        <p className="font-medium text-foreground">Do not use this calendar estimate as contraception.</p>
      </div>
    </div>
  )
}
