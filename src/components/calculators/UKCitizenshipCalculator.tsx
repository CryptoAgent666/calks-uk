import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const CITIZENSHIP_FEE = 1_709
const CEREMONY_FEE = 130
const LIFE_IN_UK_TEST = 50
const ENGLISH_TEST = 150 // approx B1 IELTS/Trinity

function calculate(hasILR: boolean, ilrDate: string, absenceDays: number, hasLifeInUK: boolean, hasEnglish: boolean) {
  const now = new Date()
  let eligible = false
  let eligibleDate = ''
  let daysUntil = 0

  if (hasILR && ilrDate) {
    const ilr = new Date(ilrDate)
    const eligDate = new Date(ilr)
    eligDate.setFullYear(eligDate.getFullYear() + 1) // 12 months after ILR

    eligible = now >= eligDate && absenceDays <= 270 // max 270 days absent in 3 years, max 90 in last 12 months
    eligibleDate = eligDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    daysUntil = Math.max(0, Math.ceil((eligDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  }

  const totalCost = CITIZENSHIP_FEE + CEREMONY_FEE + (hasLifeInUK ? 0 : LIFE_IN_UK_TEST) + (hasEnglish ? 0 : ENGLISH_TEST)
  const absenceOk = absenceDays <= 270

  return { eligible, eligibleDate, daysUntil, totalCost, absenceOk }
}

export default function UKCitizenshipCalculator() {
  const [hasILR, setHasILR] = useState(true)
  const [ilrDate, setIlrDate] = useState('')
  const [absence, setAbsence] = useState('30')
  const [lifeInUK, setLifeInUK] = useState(true)
  const [english, setEnglish] = useState(true)

  const result = useMemo(() => calculate(hasILR, ilrDate, parseInt(absence)||0, lifeInUK, english), [hasILR, ilrDate, absence, lifeInUK, english])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">ILR Granted Date</label><input type="date" value={ilrDate} onChange={(e) => setIlrDate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="ILR Granted Date" /></div>
        <div><label className="block text-sm font-medium mb-2">Days Absent (last 3 years)</label><input type="number" min="0" max="1095" value={absence} onChange={(e) => setAbsence(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Days Absent (last 3 years)" /><p className="text-xs text-muted-foreground mt-1">Max 270 days in 3 years, 90 in last 12 months</p></div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={lifeInUK} onChange={(e) => setLifeInUK(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Passed Life in the UK test</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={english} onChange={(e) => setEnglish(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Meet English language requirement (B1+)</span></label>
      </div>

      {ilrDate && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.eligible ? 'bg-green-100 dark:bg-green-950' : 'bg-primary/10'}`}>
            {result.eligible ? (
              <><p className="text-lg font-bold text-green-700 dark:text-green-400">You may be eligible to apply!</p><p className="text-sm text-muted-foreground mt-1">Eligible from: {result.eligibleDate}</p></>
            ) : (
              <><p className="text-sm text-muted-foreground">Earliest Eligible Date</p><p className="text-2xl font-bold text-primary mt-1">{result.eligibleDate}</p>{result.daysUntil > 0 && <p className="text-sm text-muted-foreground mt-1">{result.daysUntil} days remaining</p>}</>
            )}
          </div>

          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Cost</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.totalCost)}</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Citizenship Application</td><td className="text-right tabular-nums">{formatCurrency(CITIZENSHIP_FEE)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Citizenship Ceremony</td><td className="text-right tabular-nums">{formatCurrency(CEREMONY_FEE)}</td></tr>
              {!lifeInUK && <tr className="border-b border-border/50"><td className="py-2">Life in the UK Test</td><td className="text-right tabular-nums">{formatCurrency(LIFE_IN_UK_TEST)}</td></tr>}
              {!english && <tr className="border-b border-border/50"><td className="py-2">English Test (B1)</td><td className="text-right tabular-nums">{formatCurrency(ENGLISH_TEST)}</td></tr>}
            </tbody>
          </table>

          <div className={`rounded-xl p-3 text-center text-sm ${result.absenceOk ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400' : 'bg-destructive/10 text-destructive'}`}>
            Absence: {absence} / 270 days {result.absenceOk ? '(within limit)' : '(exceeds limit!)'}
          </div>
        </div>
      )}
    </div>
  )
}
