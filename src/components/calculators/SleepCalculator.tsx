import { useState, useMemo } from 'react'

const SLEEP_CYCLE = 90 // minutes
const FALL_ASLEEP = 15 // minutes average

function calculateBedtimes(wakeTime: string) {
  if (!wakeTime) return []
  const [h, m] = wakeTime.split(':').map(Number)
  const wakeMinutes = h * 60 + m

  const bedtimes = []
  for (let cycles = 6; cycles >= 3; cycles--) {
    const sleepNeeded = cycles * SLEEP_CYCLE + FALL_ASLEEP
    let bedMinutes = wakeMinutes - sleepNeeded
    if (bedMinutes < 0) bedMinutes += 24 * 60
    const hours = Math.floor(bedMinutes / 60) % 24
    const mins = bedMinutes % 60
    const sleepHours = (cycles * SLEEP_CYCLE) / 60
    bedtimes.push({
      time: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`,
      cycles,
      sleepHours,
      quality: cycles >= 5 ? 'Ideal' : cycles >= 4 ? 'Good' : 'Minimum',
    })
  }
  return bedtimes
}

function calculateWakeTimes(bedTime: string) {
  if (!bedTime) return []
  const [h, m] = bedTime.split(':').map(Number)
  const bedMinutes = h * 60 + m + FALL_ASLEEP

  const wakeTimes = []
  for (let cycles = 3; cycles <= 6; cycles++) {
    const sleepDuration = cycles * SLEEP_CYCLE
    let wakeMinutes = bedMinutes + sleepDuration
    if (wakeMinutes >= 24 * 60) wakeMinutes -= 24 * 60
    const hours = Math.floor(wakeMinutes / 60) % 24
    const mins = wakeMinutes % 60
    wakeTimes.push({
      time: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`,
      cycles,
      sleepHours: sleepDuration / 60,
      quality: cycles >= 5 ? 'Ideal' : cycles >= 4 ? 'Good' : 'Minimum',
    })
  }
  return wakeTimes
}

export default function SleepCalculator() {
  const [mode, setMode] = useState<'wake' | 'bed'>('wake')
  const [wakeTime, setWakeTime] = useState('07:00')
  const [bedTime, setBedTime] = useState('23:00')

  const bedtimes = useMemo(() => calculateBedtimes(wakeTime), [wakeTime])
  const wakeTimes = useMemo(() => calculateWakeTimes(bedTime), [bedTime])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setMode('wake')} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${mode === 'wake' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>I need to wake up at...</button>
        <button onClick={() => setMode('bed')} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${mode === 'bed' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>I'm going to bed at...</button>
      </div>

      {mode === 'wake' ? (
        <div>
          <label className="block text-sm font-medium mb-2">Wake-up Time</label>
          <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-2">Bedtime</label>
          <input type="time" value={bedTime} onChange={(e) => setBedTime(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      )}

      <div className="space-y-3 animate-fade-in-up">
        <h3 className="text-sm font-semibold">{mode === 'wake' ? 'Go to bed at:' : 'Set your alarm for:'}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(mode === 'wake' ? bedtimes : wakeTimes).map((t) => (
            <div key={t.cycles} className={`rounded-xl p-4 text-center ${t.quality === 'Ideal' ? 'bg-green-100 dark:bg-green-950 border-2 border-green-300 dark:border-green-800' : 'border border-border'}`}>
              <p className="text-2xl font-bold">{t.time}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.sleepHours}h &middot; {t.cycles} cycles</p>
              <p className={`text-xs font-medium mt-1 ${t.quality === 'Ideal' ? 'text-green-700 dark:text-green-400' : t.quality === 'Good' ? 'text-primary' : 'text-muted-foreground'}`}>{t.quality}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">Based on 90-minute sleep cycles. Includes {FALL_ASLEEP} minutes to fall asleep.</p>
      </div>
    </div>
  )
}
