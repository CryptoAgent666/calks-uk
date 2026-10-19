import { useState, useMemo, useEffect } from 'react'

const DAY_MS = 1000 * 60 * 60 * 24
const MAX_DAYS = 44 * 7 // dates more than 44 weeks back are almost certainly a typo
const MIN_CYCLE = 20
const MAX_CYCLE = 45

type Mode = 'lmp' | 'conception'

// Parse YYYY-MM-DD as a local calendar date (new Date('2026-02-01') would be UTC midnight)
function parseLocal(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return isNaN(d.getTime()) ? null : d
}

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
// Whole calendar days from a to b, immune to clock changes
const dayDiff = (a: Date, b: Date) => Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / DAY_MS)
const toIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

function calculate(mode: Mode, dateStr: string, cycle: number) {
  if (!dateStr) return null
  const entered = parseLocal(dateStr)
  if (!entered) return null
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (entered > today) return { ok: false as const, error: 'That date is in the future. Enter a date up to today.' }
  if (dayDiff(entered, today) > MAX_DAYS) return { ok: false as const, error: 'That date is more than 44 weeks ago, which is longer than a pregnancy normally lasts. Check the year.' }

  // Pregnancy is dated from a 28-day-cycle LMP: shift it by the extra (or missing) cycle days,
  // or count back 14 days from conception. The due date is that start + 280 days.
  const start = mode === 'lmp' ? addDays(entered, cycle - 28) : addDays(entered, -14)
  const dueDate = addDays(start, 280)
  const daysPregnant = Math.max(0, dayDiff(start, today))
  const weeks = Math.floor(daysPregnant / 7)
  const days = daysPregnant % 7
  // NHS: first trimester to the end of week 12, second weeks 13 to 27, third from week 28
  const trimester = weeks < 13 ? 1 : weeks < 28 ? 2 : 3
  const daysToDue = dayDiff(today, dueDate)

  const at = (w: number) => fmt(addDays(start, w * 7))
  return {
    ok: true as const,
    dueDate: fmt(dueDate), weeks, days, trimester, daysToDue,
    startNote: mode === 'lmp'
      ? (cycle === 28 ? '' : `Dated as if your period had started on ${fmt(start)} (a ${cycle}-day cycle moves the date ${Math.abs(cycle - 28)} ${Math.abs(cycle - 28) === 1 ? 'day' : 'days'} ${cycle > 28 ? 'later' : 'earlier'}).`)
      : `Conception date + 266 days. Weeks are counted from ${fmt(start)}, two weeks before conception, so they match weeks counted from a last period.`,
    milestones: [
      { week: 12, date: at(12), label: '12 weeks (dating scan is offered at 11 to 14 weeks)' },
      { week: 13, date: at(13), label: 'Second trimester starts' },
      { week: 20, date: at(20), label: '20-week scan (offered at 18 to 21 weeks)' },
      { week: 28, date: at(28), label: 'Third trimester starts' },
      { week: 37, date: at(37), label: 'Full term' },
      { week: 40, date: at(40), label: 'Estimated due date' },
    ],
  }
}

export default function PregnancyDueDateCalculator() {
  const [mode, setMode] = useState<Mode>('lmp')
  const [lmp, setLmp] = useState('')
  const [conception, setConception] = useState('')
  const [cycleInput, setCycleInput] = useState('28')
  // Date-picker limits depend on today's date, so set them after hydration rather than at build time
  const [limits, setLimits] = useState<{ min?: string; max?: string }>({})
  useEffect(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    setLimits({ min: toIso(addDays(today, -MAX_DAYS)), max: toIso(today) })
  }, [])

  const parsedCycle = parseInt(cycleInput, 10)
  const cycle = Number.isFinite(parsedCycle) ? Math.min(MAX_CYCLE, Math.max(MIN_CYCLE, parsedCycle)) : 28
  const cycleAdjusted = cycleInput.trim() !== '' && parsedCycle !== cycle

  const dateStr = mode === 'lmp' ? lmp : conception
  const result = useMemo(() => calculate(mode, dateStr, cycle), [mode, dateStr, cycle])

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-lg bg-muted p-0.5 text-sm font-medium" role="group" aria-label="Date to calculate from">
        <button type="button" onClick={() => setMode('lmp')} aria-pressed={mode === 'lmp'} className={`px-3 py-1.5 rounded-md transition-colors ${mode === 'lmp' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Last period</button>
        <button type="button" onClick={() => setMode('conception')} aria-pressed={mode === 'conception'} className={`px-3 py-1.5 rounded-md transition-colors ${mode === 'conception' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>I know my conception date</button>
      </div>

      {mode === 'lmp' ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="pdd-lmp" className="block text-sm font-medium mb-2">First day of your last period (LMP)</label>
            <input id="pdd-lmp" type="date" value={lmp} min={limits.min} max={limits.max} onChange={(e) => setLmp(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label htmlFor="pdd-cycle" className="block text-sm font-medium mb-2">Usual cycle length (days)</label>
            <input id="pdd-cycle" type="number" inputMode="numeric" min={MIN_CYCLE} max={MAX_CYCLE} step={1} value={cycleInput} onChange={(e) => setCycleInput(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
            <p className="text-xs text-muted-foreground mt-1">{cycleAdjusted ? `Using ${cycle} days (allowed range ${MIN_CYCLE} to ${MAX_CYCLE}).` : 'Leave at 28 if you are not sure.'}</p>
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor="pdd-conception" className="block text-sm font-medium mb-2">Conception date</label>
          <input id="pdd-conception" type="date" value={conception} min={limits.min} max={limits.max} onChange={(e) => setConception(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          <p className="text-xs text-muted-foreground mt-1">Use this if you know when you conceived, for example after IVF or a single known date.</p>
        </div>
      )}

      {result && !result.ok && (
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm" role="alert">{result.error}</p>
      )}

      {result && result.ok && (
        <div className="space-y-4 animate-fade-in-up" aria-live="polite">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated due date</p>
            <p className="text-2xl font-bold text-primary mt-1">{result.dueDate}</p>
            <p className="text-sm text-muted-foreground mt-2">{result.weeks} weeks and {result.days} {result.days === 1 ? 'day' : 'days'} pregnant &middot; Trimester {result.trimester}</p>
            <p className="text-sm text-muted-foreground">{result.daysToDue >= 0 ? `${result.daysToDue} ${result.daysToDue === 1 ? 'day' : 'days'} to go` : `${-result.daysToDue} ${result.daysToDue === -1 ? 'day' : 'days'} past the due date`}</p>
            {result.startNote && <p className="text-xs text-muted-foreground mt-2">{result.startNote}</p>}
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Key dates</h3>
            <div className="space-y-2">
              {result.milestones.map((m) => (
                <div key={m.week} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                  <div><span className="text-sm font-medium">{m.label}</span><span className="text-xs text-muted-foreground ml-2">Week {m.week}</span></div>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{m.date}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Due date = first day of last period + 280 days (40 weeks), adjusted for cycle length, or conception + 266 days. Your dating scan at 11 to 14 weeks gives the date the NHS will use.</p>
        </div>
      )}
    </div>
  )
}
