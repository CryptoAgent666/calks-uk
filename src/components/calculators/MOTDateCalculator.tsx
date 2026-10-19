import { useState, useMemo } from 'react'

// Parse a yyyy-mm-dd date input as a LOCAL date. new Date('yyyy-mm-dd') is UTC midnight, which
// displays as the previous day for visitors west of UTC.
function parseLocalDate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return null
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

// Add whole years; 29 February becomes 28 February in a non-leap year (instead of rolling to 1 March)
function addYears(d: Date, years: number): Date {
  const y = d.getFullYear() + years
  const daysInMonth = new Date(y, d.getMonth() + 1, 0).getDate()
  return new Date(y, d.getMonth(), Math.min(d.getDate(), daysInMonth))
}

// gov.uk: you can get an MOT up to a month (minus a day) before it runs out and keep the same renewal
// date. Expiry 15 May -> earliest 16 April; month-end expiries clamp: 31 March -> 1 March.
function earliestKeepDate(due: Date): Date {
  const e = new Date(due)
  const day = e.getDate()
  e.setDate(1)
  e.setMonth(e.getMonth() - 1)
  const dim = new Date(e.getFullYear(), e.getMonth() + 1, 0).getDate()
  e.setDate(Math.min(day, dim) + 1)
  return e
}

function calculate(regDate: string, certExpiry: string) {
  const expiry = parseLocalDate(certExpiry)
  const reg = parseLocalDate(regDate)
  if (!expiry && !reg) return null

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // The expiry date printed on the current certificate IS the next due date. A car that has never
  // been tested needs its first MOT by the third anniversary of first registration (Great Britain).
  const nextMOT = expiry ? expiry : addYears(reg as Date, 3)

  const daysUntil = Math.round((nextMOT.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysUntil < 0
  const earliestBooking = earliestKeepDate(nextMOT)
  const canBookNow = today >= earliestBooking

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return { nextMOT: fmt(nextMOT), daysUntil: Math.abs(daysUntil), isOverdue, canBookNow, earliestBooking: fmt(earliestBooking) }
}

export default function MOTDateCalculator() {
  const [regDate, setRegDate] = useState('')
  const [certExpiry, setCertExpiry] = useState('')
  const [hasHadMOT, setHasHadMOT] = useState(true)

  const result = useMemo(() => calculate(hasHadMOT ? '' : regDate, hasHadMOT ? certExpiry : ''), [regDate, certExpiry, hasHadMOT])

  return (
    <div className="space-y-6">
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={hasHadMOT} onChange={(e) => setHasHadMOT(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">Car has had a previous MOT</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!hasHadMOT && (
          <div><label className="block text-sm font-medium mb-2">First Registration Date</label><input type="date" value={regDate} onChange={(e) => setRegDate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="First Registration Date" /><p className="text-xs text-muted-foreground mt-1">First MOT due by the third anniversary of registration (Great Britain)</p></div>
        )}
        {hasHadMOT && (
          <div><label className="block text-sm font-medium mb-2">Expiry date on your current MOT certificate</label><input type="date" value={certExpiry} onChange={(e) => setCertExpiry(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Expiry date on your current MOT certificate" /><p className="text-xs text-muted-foreground mt-1">Shown on the certificate or at gov.uk/check-mot-status</p></div>
        )}
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.isOverdue ? 'bg-destructive/10' : result.canBookNow ? 'bg-orange-100 dark:bg-orange-950' : 'bg-green-100 dark:bg-green-950'}`}>
            <p className="text-sm text-muted-foreground">{result.isOverdue ? 'MOT Overdue!' : 'Next MOT Due'}</p>
            <p className={`text-2xl font-bold mt-1 ${result.isOverdue ? 'text-destructive' : 'text-foreground'}`}>{result.nextMOT}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.isOverdue ? `${result.daysUntil} days overdue — do not drive!` : `${result.daysUntil} days away`}</p>
          </div>
          {!result.isOverdue && (
            <div className="rounded-xl bg-primary/10 p-4 text-center text-sm">Earliest MOT that keeps your renewal date: <span className="font-medium">{result.earliestBooking}</span>{result.canBookNow ? ' (that window is open now)' : ''}</div>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>You can get your MOT done up to a month minus a day before the due date without losing your renewal date.</p>
            <p className="mt-1">Driving without a valid MOT is illegal and can result in a £1,000 fine.</p>
          </div>
        </div>
      )}
    </div>
  )
}
