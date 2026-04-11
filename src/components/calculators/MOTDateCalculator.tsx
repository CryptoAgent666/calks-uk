import { useState, useMemo } from 'react'

function calculate(regDate: string, lastMOT: string) {
  if (!regDate && !lastMOT) return null

  const now = new Date()
  let nextMOT: Date

  if (lastMOT) {
    nextMOT = new Date(lastMOT)
    nextMOT.setFullYear(nextMOT.getFullYear() + 1)
  } else {
    // First MOT is 3 years after registration
    nextMOT = new Date(regDate)
    nextMOT.setFullYear(nextMOT.getFullYear() + 3)
  }

  const daysUntil = Math.ceil((nextMOT.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysUntil < 0
  // You can get MOT up to 1 month before
  const earliestBooking = new Date(nextMOT)
  earliestBooking.setMonth(earliestBooking.getMonth() - 1)
  const canBookNow = now >= earliestBooking

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return { nextMOT: fmt(nextMOT), daysUntil: Math.abs(daysUntil), isOverdue, canBookNow, earliestBooking: fmt(earliestBooking) }
}

export default function MOTDateCalculator() {
  const [regDate, setRegDate] = useState('')
  const [lastMOT, setLastMOT] = useState('')
  const [hasHadMOT, setHasHadMOT] = useState(true)

  const result = useMemo(() => calculate(regDate, hasHadMOT ? lastMOT : ''), [regDate, lastMOT, hasHadMOT])

  return (
    <div className="space-y-6">
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={hasHadMOT} onChange={(e) => setHasHadMOT(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">Car has had a previous MOT</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!hasHadMOT && (
          <div><label className="block text-sm font-medium mb-2">First Registration Date</label><input type="date" value={regDate} onChange={(e) => setRegDate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /><p className="text-xs text-muted-foreground mt-1">First MOT due 3 years after registration</p></div>
        )}
        {hasHadMOT && (
          <div><label className="block text-sm font-medium mb-2">Last MOT Date</label><input type="date" value={lastMOT} onChange={(e) => setLastMOT(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /><p className="text-xs text-muted-foreground mt-1">Check your V5C or MOT certificate</p></div>
        )}
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.isOverdue ? 'bg-destructive/10' : result.canBookNow ? 'bg-orange-100 dark:bg-orange-950' : 'bg-green-100 dark:bg-green-950'}`}>
            <p className="text-sm text-muted-foreground">{result.isOverdue ? 'MOT Overdue!' : 'Next MOT Due'}</p>
            <p className={`text-2xl font-bold mt-1 ${result.isOverdue ? 'text-destructive' : 'text-foreground'}`}>{result.nextMOT}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.isOverdue ? `${result.daysUntil} days overdue — do not drive!` : `${result.daysUntil} days away`}</p>
          </div>
          {result.canBookNow && !result.isOverdue && (
            <div className="rounded-xl bg-primary/10 p-4 text-center text-sm">You can book your MOT now — earliest date: <span className="font-medium">{result.earliestBooking}</span></div>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>You can get your MOT done up to 1 month before the due date without losing your renewal date.</p>
            <p className="mt-1">Driving without a valid MOT is illegal and can result in a £1,000 fine.</p>
          </div>
        </div>
      )}
    </div>
  )
}
