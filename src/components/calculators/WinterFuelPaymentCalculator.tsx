import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Winter Fuel Payment 2026/27 (England, Wales & NI; Scotland pays the
// equivalent Pension Age Winter Heating Payment under the same income rule).
// Qualifying week: 21–27 September 2026 — you must have reached State Pension
// age by then. Since April 2026 SPA is phasing 66 → 67 (Pensions Act 2014):
// born 6 Apr 1960 – 5 Mar 1961 → SPA = 66 years + 1..11 months.
const QUALIFYING_WEEK_END = new Date(2026, 8, 27)
const AGE_80_CUTOFF = new Date(1946, 8, 27) // 80 or over during the qualifying week
const INCOME_LIMIT = 35_000

function spaDate(dob: Date): Date {
  const y = dob.getFullYear()
  const m = dob.getMonth()
  const d = dob.getDate()
  if (dob < new Date(1960, 3, 6)) return new Date(y + 66, m, d)
  if (dob < new Date(1961, 2, 6)) {
    // months elapsed since the 6 Apr 1960 band start → SPA = 66y + (band+1) months
    const monthsIn = (y - 1960) * 12 + (m - 3) - (d < 6 ? 1 : 0)
    return new Date(y + 66, m + monthsIn + 1, d)
  }
  return new Date(y + 67, m, d)
}

type Household = 'alone' | 'couple' | 'pension-credit'

function calculate(dobStr: string, household: Household, income: number) {
  const dob = new Date(dobStr)
  if (isNaN(dob.getTime())) return null

  const spa = spaDate(dob)
  const eligible = spa <= QUALIFYING_WEEK_END
  const is80 = dob <= AGE_80_CUTOFF
  const householdAmount = is80 ? 300 : 200

  // Not on Pension Credit and both partners qualify → the payment is split.
  let yourShare = householdAmount
  if (household === 'couple') yourShare = is80 ? 150 : 100

  // The £35,000 test is per person, on your own taxable income — no taper.
  const recovered = household !== 'pension-credit' && income > INCOME_LIMIT
  const monthlyClawback = yourShare / 12

  return { eligible, spa, is80, householdAmount, yourShare, recovered, monthlyClawback }
}

export default function WinterFuelPaymentCalculator() {
  const [dob, setDob] = useState('1957-06-15')
  const [household, setHousehold] = useState<Household>('alone')
  const [income, setIncome] = useState('18,000')

  const inc = parseFloat(income.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(dob, household, inc), [dob, household, inc])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Date of Birth</label>
          <input type="date" value={dob} max="1965-12-31" min="1920-01-01" onChange={(e) => setDob(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Date of Birth" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Your Taxable Income (per year)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Your Taxable Income" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">State + private pensions, earnings, rental and savings interest. Assessed per person, not per couple.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button onClick={() => setHousehold('alone')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${household === 'alone' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Only I qualify</button>
        <button onClick={() => setHousehold('couple')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${household === 'couple' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Partner qualifies too</button>
        <button onClick={() => setHousehold('pension-credit')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${household === 'pension-credit' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>We get Pension Credit</button>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          {!result.eligible ? (
            <div className="rounded-2xl bg-muted/50 border border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">Not eligible for winter 2026/27</p>
              <p className="text-lg font-bold mt-1">
                You reach State Pension age on {result.spa.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You must reach State Pension age by the end of the qualifying week (27 September 2026). Your first Winter Fuel Payment will be the first winter after that date.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-2xl bg-primary/10 p-6 text-center">
                <p className="text-sm text-muted-foreground">Your Winter Fuel Payment 2026/27</p>
                <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.yourShare)}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {household === 'pension-credit'
                    ? `Paid in full to the household (${formatCurrency(result.householdAmount)}) with your Pension Credit`
                    : household === 'couple'
                      ? `Half of the ${formatCurrency(result.householdAmount)} household payment — your partner gets the other half`
                      : `Full household payment${result.is80 ? ' (higher rate, 80+)' : ''}`}
                  {' '}· paid automatically in November–December 2026
                </p>
              </div>

              {result.recovered ? (
                <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-sm text-orange-800 dark:text-orange-300">
                  <p className="font-semibold">HMRC will take it back — your income is over {formatCurrency(INCOME_LIMIT)}</p>
                  <p className="mt-1">
                    There is no taper: even £1 over the limit means the whole {formatCurrency(result.yourShare)} is recovered.
                    PAYE: your tax code collects roughly {formatCurrency(result.monthlyClawback)}/month over the following tax year.
                    Self Assessment: it is added to your return instead.
                  </p>
                  <p className="mt-1">
                    If you would rather not receive it at all, opt out before <strong>20 September 2026</strong> (or by phone on 0800 731 0160 by 18 September).
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-green-100/60 dark:bg-green-950/60 p-4 text-sm text-green-800 dark:text-green-300">
                  <p className="font-semibold">You keep it — your income is at or below {formatCurrency(INCOME_LIMIT)}</p>
                  <p className="mt-1">
                    The £35,000 test applies to each person separately{household === 'couple' ? ' — your partner’s half is assessed against their own income' : ''}. Nothing to claim: payment is automatic.
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
