import { useState, useMemo } from 'react'

// UC work-search and conditionality earnings thresholds (2026/27), per the Universal Credit
// Regulations 2013 regs 90 and 99. Working Tax Credit ended on 5 April 2025, so all thresholds
// below are UC-based.
type RateBand = 'adult' | 'young' | 'under18' | 'apprentice'

const NLW = 12.71
const NMW_BY_BAND: Record<RateBand, number> = { adult: NLW, young: 10.85, under18: 8.00, apprentice: 8.00 }
const BAND_OPTIONS: { value: RateBand; label: string }[] = [
  { value: 'adult', label: '21 or over (£12.71)' },
  { value: 'young', label: '18 to 20 (£10.85)' },
  { value: 'under18', label: 'Under 18 (£8.00)' },
  { value: 'apprentice', label: 'Apprentice (£8.00)' },
]

const toMonthly = (hoursPerWeek: number, hourlyRate: number) => hoursPerWeek * hourlyRate * 52 / 12

// Reg 90(2): pay at the NMW rate for the claimant's age for the expected hours.
// Reg 90(4): apprentices, 30 hours or the expected hours if less, at the apprentice rate.
function individualThreshold(band: RateBand, expectedHours: number) {
  const hours = band === 'apprentice' ? Math.min(30, expectedHours) : expectedHours
  return toMonthly(hours, NMW_BY_BAND[band])
}

function calculate(hoursPerWeek: number, hourlyRate: number, isSingle: boolean, band: RateBand, expectedHours: number, partnerMonthly: number, partnerBand: RateBand, partnerExpectedHours: number) {
  const weeklyPay = hoursPerWeek * hourlyRate
  const annualPay = weeklyPay * 52
  const monthlyPay = toMonthly(hoursPerWeek, hourlyRate)
  const combinedPay = isSingle ? monthlyPay : monthlyPay + partnerMonthly

  // Reg 99(6): at the NLW whatever the claimant's age
  const aetOwnMonthly = toMonthly(18, NLW) // your own employed earnings, 18 hours
  const aetCoupleMonthly = toMonthly(29, NLW) // a couple's combined employed earnings, 29 hours
  const aetMet = monthlyPay >= aetOwnMonthly || (!isSingle && combinedPay >= aetCoupleMonthly)

  // Reg 90(1) and (3): a couple's threshold is the sum of their individual thresholds
  const ownThreshold = individualThreshold(band, expectedHours)
  const partnerThreshold = isSingle ? 0 : individualThreshold(partnerBand, partnerExpectedHours)
  const cetMonthly = ownThreshold + partnerThreshold
  const cetMet = combinedPay >= cetMonthly

  const meetsNMW = hourlyRate >= NMW_BY_BAND[band]

  // UC work conditionality
  let conditionality = ''
  if (cetMet) conditionality = 'No additional conditions — earning enough'
  else if (aetMet) conditionality = 'Light touch — may be asked to increase hours/pay'
  else if (combinedPay === 0) conditionality = 'Intensive work search — full job-seeking commitments'
  else conditionality = 'Intensive work search — earnings below AET'

  const pounds = (n: number) => `£${Math.round(n).toLocaleString('en-GB')}`
  const thresholds = [
    { label: `AET (your own earnings, 18 hrs × NLW): ${pounds(aetOwnMonthly)}/mo — escapes intensive work search`, met: monthlyPay >= aetOwnMonthly },
    ...(isSingle ? [] : [{ label: `AET (couple's combined earnings, 29 hrs × NLW): ${pounds(aetCoupleMonthly)}/mo — escapes intensive work search`, met: combinedPay >= aetCoupleMonthly }]),
    {
      label: isSingle
        ? `CET (your expected hours × the minimum for your age): ${pounds(cetMonthly)}/mo — no work-related conditions`
        : `CET (your ${pounds(ownThreshold)} + partner's ${pounds(partnerThreshold)}): ${pounds(cetMonthly)}/mo combined — no work-related conditions`,
      met: cetMet,
    },
  ]

  return { weeklyPay, annualPay, monthlyPay, meetsNMW, conditionality, thresholds }
}

const parseExpectedHours = (value: string) => {
  const n = parseFloat(value)
  return Number.isNaN(n) ? 35 : Math.min(35, Math.max(1, n)) // 35 unless a lesser number applies (reg 88)
}

export default function WorkingTaxCreditHoursCalculator() {
  const [hours, setHours] = useState('20')
  const [rate, setRate] = useState('12.71')
  const [single, setSingle] = useState(true)
  const [band, setBand] = useState<RateBand>('adult')
  const [expected, setExpected] = useState('35')
  const [partnerPay, setPartnerPay] = useState('0')
  const [partnerBand, setPartnerBand] = useState<RateBand>('adult')
  const [partnerExpected, setPartnerExpected] = useState('35')

  const h = parseFloat(hours) || 0
  const r = parseFloat(rate) || 0
  const e = parseExpectedHours(expected)
  const pp = parseFloat(partnerPay) || 0
  const pe = parseExpectedHours(partnerExpected)
  const result = useMemo(() => calculate(h, r, single, band, e, pp, partnerBand, pe), [h, r, single, band, e, pp, partnerBand, pe])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setSingle(true)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${single ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Single</button>
        <button onClick={() => setSingle(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${!single ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Couple</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Hours/Week</label><input type="number" min="0" max="60" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours/Week" /></div>
        <div><label className="block text-sm font-medium mb-2">Hourly Rate</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hourly Rate" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Your Age or Rate</label><select value={band} onChange={(e) => setBand(e.target.value as RateBand)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Your Age or Rate">{BAND_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Expected Hours</label><input type="number" min="1" max="35" step="0.5" value={expected} onChange={(e) => setExpected(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Expected Hours" /></div>
      </div>
      {!single && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div><label className="block text-sm font-medium mb-2">Partner's Monthly Pay</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={partnerPay} onChange={(e) => setPartnerPay(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Partner's Monthly Pay" /></div></div>
          <div><label className="block text-sm font-medium mb-2">Partner's Age or Rate</label><select value={partnerBand} onChange={(e) => setPartnerBand(e.target.value as RateBand)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Partner's Age or Rate">{BAND_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-2">Partner's Expected Hours</label><input type="number" min="1" max="35" step="0.5" value={partnerExpected} onChange={(e) => setPartnerExpected(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Partner's Expected Hours" /></div>
        </div>
      )}

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-xl bg-primary/10 p-4 text-center">
          <p className="text-sm text-muted-foreground">UC Conditionality</p>
          <p className="text-lg font-bold text-primary">{result.conditionality}</p>
        </div>

        <div className="space-y-2">
          {result.thresholds.map(t => (
            <div key={t.label} className={`flex items-center justify-between rounded-xl border p-3 ${t.met ? 'border-green-300 dark:border-green-800 bg-green-100/50 dark:bg-green-950/50' : 'border-border'}`}>
              <span className="text-sm">{t.label}</span>
              <span className={`text-sm font-bold ${t.met ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}`}>{t.met ? 'Met' : 'Not met'}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Weekly Pay</p><p className="text-lg font-bold">{`£${result.weeklyPay.toFixed(2)}`}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Annual Pay</p><p className="text-lg font-bold">{`£${result.annualPay.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p></div>
        </div>

        {!result.meetsNMW && <p className="text-sm text-destructive">This hourly rate is below the 2026/27 minimum for the age or rate you chose.</p>}

        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
          <p>This is a guide. Your work coach decides your expected hours: 35 is the default, and it can be lower if you care for a child or for someone else. People who only have to attend interviews or prepare for work use a 16-hour threshold instead.</p>
          <p>The AET counts employed earnings only, before tax and NI. Working Tax Credit ended on 5 April 2025, so its 16 and 30 hour rules no longer apply.</p>
        </div>
      </div>
    </div>
  )
}
