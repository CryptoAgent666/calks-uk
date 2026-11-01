import { useState, useMemo, useEffect } from 'react'

const ZONES = [
  { id: 'GMT', name: 'London (GMT/BST)', tz: 'Europe/London' },
  { id: 'CET', name: 'Paris / Berlin (CET/CEST)', tz: 'Europe/Paris' },
  { id: 'EET', name: 'Athens / Helsinki (EET/EEST)', tz: 'Europe/Athens' },
  { id: 'MSK', name: 'Moscow (MSK)', tz: 'Europe/Moscow' },
  { id: 'GST', name: 'Dubai (GST)', tz: 'Asia/Dubai' },
  { id: 'IST', name: 'Mumbai (IST)', tz: 'Asia/Kolkata' },
  { id: 'NPT', name: 'Kathmandu (NPT)', tz: 'Asia/Kathmandu' },
  { id: 'ICT', name: 'Bangkok (ICT)', tz: 'Asia/Bangkok' },
  { id: 'CST', name: 'Beijing / HK / Singapore', tz: 'Asia/Shanghai' },
  { id: 'JST', name: 'Tokyo (JST)', tz: 'Asia/Tokyo' },
  { id: 'ACT', name: 'Adelaide (ACST/ACDT)', tz: 'Australia/Adelaide' },
  { id: 'AET', name: 'Sydney (AEST/AEDT)', tz: 'Australia/Sydney' },
  { id: 'NZT', name: 'Auckland (NZST/NZDT)', tz: 'Pacific/Auckland' },
  { id: 'ET', name: 'New York (EST/EDT)', tz: 'America/New_York' },
  { id: 'CT', name: 'Chicago (CST/CDT)', tz: 'America/Chicago' },
  { id: 'MT', name: 'Denver (MST/MDT)', tz: 'America/Denver' },
  { id: 'PT', name: 'Los Angeles (PST/PDT)', tz: 'America/Los_Angeles' },
]

// The prerendered HTML and the first client render must match, so neither may read the
// clock. This fixed past date is replaced by today's UK date in useEffect after hydration.
const INITIAL_DATE = '2026-01-15'

const formatters = new Map<string, Intl.DateTimeFormat>()

function localParts(tz: string, ms: number) {
  let f = formatters.get(tz)
  if (!f) {
    f = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    formatters.set(tz, f)
  }
  const parts = f.formatToParts(ms)
  const get = (type: string) => Number(parts.find(p => p.type === type)?.value)
  return { year: get('year'), month: get('month'), day: get('day'), hour: get('hour') % 24, minute: get('minute'), second: get('second') }
}

function offsetMinutes(tz: string, ms: number) {
  const p = localParts(tz, ms)
  return (Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(ms / 1000) * 1000) / 60000
}

// Turns a wall-clock time in a zone into an instant. A clock change can skip that time
// or make it happen twice, so the status is reported along with the instant.
function toInstant(wall: number, tz: string): { ms: number; status: 'ok' | 'skipped' | 'twice' } {
  const before = offsetMinutes(tz, wall - 86400000)
  const after = offsetMinutes(tz, wall + 86400000)
  const matches = [...new Set([before, after])]
    .map(o => wall - o * 60000)
    .filter(t => wall - t === offsetMinutes(tz, t) * 60000)
    .sort((a, b) => a - b)
  if (matches.length === 0) return { ms: wall - before * 60000, status: 'skipped' }
  return { ms: matches[0], status: matches.length > 1 ? 'twice' : 'ok' }
}

function formatOffset(minutes: number) {
  const abs = Math.abs(minutes)
  const m = abs % 60
  return `UTC${minutes < 0 ? '−' : '+'}${Math.floor(abs / 60)}${m ? `:${m.toString().padStart(2, '0')}` : ''}`
}

function convert(date: string, time: string, fromId: string) {
  const from = ZONES.find(z => z.id === fromId)
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  const t = /^(\d{2}):(\d{2})/.exec(time)
  if (!from || !d || !t) return null
  const year = Number(d[1])
  if (year < 1970 || year > 2099) return null
  const dayStart = Date.UTC(year, Number(d[2]) - 1, Number(d[3]))
  const { ms, status } = toInstant(dayStart + (Number(t[1]) * 60 + Number(t[2])) * 60000, from.tz)

  const zones = ZONES.map(z => {
    const p = localParts(z.tz, ms)
    const dayDiff = Math.round((Date.UTC(p.year, p.month - 1, p.day) - dayStart) / 86400000)
    return {
      ...z,
      time: `${p.hour.toString().padStart(2, '0')}:${p.minute.toString().padStart(2, '0')}`,
      offset: formatOffset(offsetMinutes(z.tz, ms)),
      dayDiff,
    }
  })
  return { zones, status, fromZone: zones.find(z => z.id === fromId)! }
}

function todayInUK(now: Date) {
  const p = localParts('Europe/London', now.getTime())
  return `${p.year}-${p.month.toString().padStart(2, '0')}-${p.day.toString().padStart(2, '0')}`
}

export default function TimezoneConverter() {
  const [date, setDate] = useState(INITIAL_DATE)
  const [time, setTime] = useState('14:00')
  const [from, setFrom] = useState('GMT')

  useEffect(() => { setDate(todayInUK(new Date())) }, [])

  const results = useMemo(() => convert(date, time, from), [date, time, from])
  const offsets = new Map(results?.zones.map(z => [z.id, z.offset]))
  const fromCity = ZONES.find(z => z.id === from)?.name.split(' (')[0]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Date</label><input type="date" min="1970-01-01" max="2099-12-31" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Date" /></div>
        <div><label className="block text-sm font-medium mb-2">Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Time" /></div>
        <div><label className="block text-sm font-medium mb-2">From Timezone</label><select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="From Timezone">{ZONES.map(z => <option key={z.id} value={z.id}>{z.name}{offsets.has(z.id) ? ` (${offsets.get(z.id)})` : ''}</option>)}</select></div>
      </div>

      {!results && (
        <div role="alert" className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          Enter a time and a date between 1970 and 2099.
        </div>
      )}
      {results?.status === 'skipped' && (
        <div role="alert" className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-4 text-sm">
          {time} does not exist in {fromCity} on this date, because the clocks go forward at that point. The results show it as {results.fromZone.time}, the same moment on the new clock.
        </div>
      )}
      {results?.status === 'twice' && (
        <div role="alert" className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-4 text-sm">
          {time} happens twice in {fromCity} on this date, because the clocks go back at that point. The results use the first occurrence, before the change.
        </div>
      )}

      {results && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 animate-fade-in-up">
          {results.zones.map(z => (
            <div key={z.id} className={`rounded-xl p-3 text-center ${z.id === from ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}>
              <p className="text-xs text-muted-foreground">{z.name}</p>
              <p className="text-xl font-bold font-mono">{z.time}</p>
              <p className="text-xs text-muted-foreground">{z.offset}</p>
              {z.dayDiff > 0 && <p className="text-xs text-orange-600">+{z.dayDiff} day</p>}
              {z.dayDiff < 0 && <p className="text-xs text-orange-600">{z.dayDiff} day</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
