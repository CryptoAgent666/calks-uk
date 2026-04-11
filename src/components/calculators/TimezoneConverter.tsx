import { useState, useMemo } from 'react'

const ZONES = [
  { id: 'GMT', name: 'London (GMT/BST)', offset: 0 },
  { id: 'CET', name: 'Paris / Berlin (CET)', offset: 1 },
  { id: 'EET', name: 'Athens / Helsinki (EET)', offset: 2 },
  { id: 'MSK', name: 'Moscow (MSK)', offset: 3 },
  { id: 'GST', name: 'Dubai (GST)', offset: 4 },
  { id: 'IST', name: 'Mumbai (IST)', offset: 5.5 },
  { id: 'ICT', name: 'Bangkok (ICT)', offset: 7 },
  { id: 'CST', name: 'Beijing / HK (CST)', offset: 8 },
  { id: 'JST', name: 'Tokyo (JST)', offset: 9 },
  { id: 'AEST', name: 'Sydney (AEST)', offset: 10 },
  { id: 'NZST', name: 'Auckland (NZST)', offset: 12 },
  { id: 'ET', name: 'New York (ET)', offset: -5 },
  { id: 'CT', name: 'Chicago (CT)', offset: -6 },
  { id: 'MT', name: 'Denver (MT)', offset: -7 },
  { id: 'PT', name: 'Los Angeles (PT)', offset: -8 },
]

function convert(hours: number, minutes: number, fromId: string) {
  const from = ZONES.find(z => z.id === fromId)
  if (!from) return []
  const utcMinutes = hours * 60 + minutes - from.offset * 60

  return ZONES.map(z => {
    let totalMin = utcMinutes + z.offset * 60
    while (totalMin < 0) totalMin += 1440
    totalMin = totalMin % 1440
    const h = Math.floor(totalMin / 60)
    const m = totalMin % 60
    const nextDay = utcMinutes + z.offset * 60 >= 1440
    const prevDay = utcMinutes + z.offset * 60 < 0
    return { ...z, time: `${h.toString().padStart(2, '0')}:${Math.floor(m).toString().padStart(2, '0')}`, nextDay, prevDay }
  })
}

export default function TimezoneConverter() {
  const [time, setTime] = useState('14:00')
  const [from, setFrom] = useState('GMT')

  const [h, m] = time.split(':').map(Number)
  const results = useMemo(() => convert(h || 0, m || 0, from), [h, m, from])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">From Timezone</label><select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring">{ZONES.map(z => <option key={z.id} value={z.id}>{z.name} (UTC{z.offset >= 0 ? '+' : ''}{z.offset})</option>)}</select></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 animate-fade-in-up">
        {results.map(z => (
          <div key={z.id} className={`rounded-xl p-3 text-center ${z.id === from ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}>
            <p className="text-xs text-muted-foreground">{z.name}</p>
            <p className="text-xl font-bold font-mono">{z.time}</p>
            {z.nextDay && <p className="text-xs text-orange-600">+1 day</p>}
            {z.prevDay && <p className="text-xs text-orange-600">-1 day</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
