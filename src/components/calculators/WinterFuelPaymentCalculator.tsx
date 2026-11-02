import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Winter Fuel Payment 2026/27 (England, Wales & NI; Scotland pays the
// Pension Age Winter Heating Payment at its own amounts, with HMRC recovery over £35,000).
// Qualifying week: 21–27 September 2026 — you must have reached State Pension
// age by then. Since April 2026 SPA is phasing 66 → 67 (Pensions Act 2014):
// born 6 Apr 1960 – 5 Mar 1961 → SPA = 66 years + 1..11 months.
// Dates are compared as year-month-day numbers, so the result never depends on the browser timezone.
const QUALIFYING_WEEK_END = new Date(2026, 8, 27)
const AGE_80_LAST_BIRTH_DATE = 19460927 // 80 or over during the qualifying week: born before 28 September 1946
const INCOME_LIMIT = 35_000

// gov.uk/winter-fuel-payment/how-much-youll-get; mygov.scot/pension-age-winter-heating-payment/how-much-you-might-be-paid
const RATES = {
  uk: { under80: 200, over80: 300, shareUnder80: 100, shareOver80: 150, olderShare: 200, youngerShare: 100, homeUnder80: 100, homeOver80: 150 },
  scotland: { under80: 211.15, over80: 316.70, shareUnder80: 105.55, shareOver80: 158.35, olderShare: 211.15, youngerShare: 105.55, homeUnder80: 105.55, homeOver80: 158.35 },
}

function spaDate(y: number, m: number, d: number): Date {
  const birth = y * 10000 + (m + 1) * 100 + d
  if (birth < 19600406) return new Date(y + 66, m, d)
  if (birth < 19610306) {
    // months elapsed since the 6 Apr 1960 band start → SPA = 66y + (band+1) months
    const monthsIn = (y - 1960) * 12 + (m - 3) - (d < 6 ? 1 : 0)
    return new Date(y + 66, m + monthsIn + 1, d)
  }
  return new Date(y + 67, m, d)
}

type Household = 'alone' | 'couple' | 'pension-credit'

function calculate(dobStr: string, household: Household, income: number, partner80: boolean, inScotland: boolean, careHome: boolean, inHomeSinceJune: boolean) {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dobStr)
  if (!parts) return null
  const y = Number(parts[1])
  const m = Number(parts[2]) - 1
  const d = Number(parts[3])

  const spa = spaDate(y, m, d)
  const eligible = spa <= QUALIFYING_WEEK_END
  const is80 = y * 10000 + (m + 1) * 100 + d <= AGE_80_LAST_BIRTH_DATE
  const rates = inScotland ? RATES.scotland : RATES.uk

  // Care home with Pension Credit, Universal Credit or income-related ESA, in the home since 29 June: nothing is due
  const careHomeBar = careHome && inHomeSinceJune && household === 'pension-credit'
  // In Scotland the care home amount is for those who went in before 29 June 2026; later arrivals follow their earlier situation
  const careHomeRate = careHome && !careHomeBar && (!inScotland || inHomeSinceJune)

  const anyone80 = is80 || (household !== 'alone' && partner80)
  let yourShare = anyone80 ? rates.over80 : rates.under80
  let partnerShare = 0

  // Not on Pension Credit and both partners qualify: each gets their own share.
  // Both under 80: £100 each. Both 80+: £150 each. Mixed ages: the partner born
  // before 28 Sep 1946 gets £200 and the younger one £100 (gov.uk, 2026/27).
  if (household === 'couple') {
    yourShare = is80 ? (partner80 ? rates.shareOver80 : rates.olderShare) : (partner80 ? rates.youngerShare : rates.shareUnder80)
    partnerShare = partner80 ? (is80 ? rates.shareOver80 : rates.olderShare) : (is80 ? rates.youngerShare : rates.shareUnder80)
  }
  if (careHomeRate) {
    yourShare = is80 ? rates.homeOver80 : rates.homeUnder80
    partnerShare = 0
  }

  // The £35,000 test is per person, on your own total income — no taper.
  const recovered = income > INCOME_LIMIT
  return { eligible, spa, is80, careHomeBar, careHomeRate, yourShare, partnerShare, recovered }
}

export default function WinterFuelPaymentCalculator() {
  const [dob, setDob] = useState('1957-06-15')
  const [household, setHousehold] = useState<Household>('alone')
  const [income, setIncome] = useState('18,000')
  const [partner80, setPartner80] = useState(false)
  const [scotland, setScotland] = useState(false)
  const [careHome, setCareHome] = useState(false)
  const [inHomeSinceJune, setInHomeSinceJune] = useState(false)

  const inc = parseFloat(income.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(dob, household, inc, partner80, scotland, careHome, inHomeSinceJune), [dob, household, inc, partner80, scotland, careHome, inHomeSinceJune])
  const paymentName = scotland ? 'Pension Age Winter Heating Payment' : 'Winter Fuel Payment'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setScotland(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${!scotland ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>England, Wales or NI</button>
        <button onClick={() => setScotland(true)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${scotland ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Scotland</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Date of Birth</label>
          <input type="date" value={dob} max="1965-12-31" min="1920-01-01" onChange={(e) => setDob(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Date of Birth" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Your Total Income (per year)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Your Total Income" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">The total you expect to receive in the tax year, before any deductions. Your partner's income does not count.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button onClick={() => setHousehold('alone')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${household === 'alone' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Only I qualify</button>
        <button onClick={() => setHousehold('couple')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${household === 'couple' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Partner qualifies too</button>
        <button onClick={() => setHousehold('pension-credit')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${household === 'pension-credit' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>We get Pension Credit, UC or income-related ESA</button>
      </div>
      {household !== 'alone' && (
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={partner80} onChange={(e) => setPartner80(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">My partner was born before 28 September 1946 (80 or over)</span></label>
      )}
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={careHome} onChange={(e) => setCareHome(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">I lived in a care home during the qualifying week</span></label>
      {careHome && (
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={inHomeSinceJune} onChange={(e) => setInHomeSinceJune(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">{scotland ? 'I went into care before 29 June 2026' : 'I had lived there the whole time from 29 June 2026 or earlier'}</span></label>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          {!result.eligible ? (
            <div className="rounded-2xl bg-muted/50 border border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">Not eligible for winter 2026/27</p>
              <p className="text-lg font-bold mt-1">
                You reach State Pension age on {result.spa.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You must reach State Pension age by the end of the qualifying week (27 September 2026). Your first payment will be the first winter after that date.
              </p>
            </div>
          ) : result.careHomeBar ? (
            <div className="rounded-2xl bg-muted/50 border border-border p-6 text-center">
              <p className="text-lg font-bold">Not eligible for winter 2026/27</p>
              <p className="text-sm text-muted-foreground mt-1">
                No payment is due if you get one of these benefits and were already living in the care home by the June date above.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-2xl bg-primary/10 p-6 text-center">
                <p className="text-sm text-muted-foreground">Your {paymentName} 2026/27</p>
                <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.yourShare)}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.careHomeRate
                    ? 'Care home rate'
                    : household === 'pension-credit'
                      ? 'Paid as a single amount if you claim jointly'
                      : household === 'couple'
                        ? `Your own share; your partner gets ${formatCurrency(result.partnerShare)}`
                        : `Full household payment${result.is80 ? ' (higher rate, 80+)' : ''}`}
                  {!scotland && ' · most people are paid in November–December 2026'}
                </p>
              </div>

              {result.recovered ? (
                <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-sm text-orange-800 dark:text-orange-300">
                  <p className="font-semibold">HMRC will take it back — your income is over {formatCurrency(INCOME_LIMIT)}</p>
                  <p className="mt-1">
                    There is no taper: even £1 over the limit means the whole {formatCurrency(result.yourShare)} is recovered, usually through your tax code, or through your tax bill if you complete a Self Assessment return.
                    {!scotland && ' If HMRC is already collecting your 2025 payment, your tax code changes in January 2027 to start collecting the 2026 payment, and again in April 2027, when it also starts collecting the 2027 payment in advance.'}
                  </p>
                  <p className="mt-1">
                    {scotland
                      ? 'You can opt out by calling Social Security Scotland. If a decision has already been made on your award, you can cancel it and return the payment instead.'
                      : <>It is too late to opt out for winter 2026/27. Opting out for 2027/28 opens on <strong>21 December 2026</strong>.</>}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-green-100/60 dark:bg-green-950/60 p-4 text-sm text-green-800 dark:text-green-300">
                  <p className="font-semibold">You keep it — your income is at or below {formatCurrency(INCOME_LIMIT)}</p>
                  <p className="mt-1">
                    The £35,000 test applies to each person separately{household === 'couple' ? ' — your partner’s share is assessed against their own income' : ''}. Most people are paid automatically and do not need to claim.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
