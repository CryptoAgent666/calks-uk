import { useMemo, useState } from 'react'
import { formatCurrency } from '@/utils'
import ShareRow, { useUrlParam } from '@/components/ShareRow'
import {
  TAX_YEAR,
  FULL_NEW_STATE_PENSION_WEEKLY,
  QUALIFYING_YEARS_FULL,
  QUALIFYING_YEARS_MIN,
  BACKDATE_YEARS,
  EXTENDED_WINDOW_CLOSED,
  PER_YEAR_WEEKLY,
  PRIOR_YEAR_RATES,
  CLASS3_WEEKLY,
  CLASS2_WEEKLY,
  evaluateTopUp,
  weeklyRate,
  annualCost,
  type NiClass,
} from '@/data/voluntary-ni'

const inputCls = 'w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring'
const selectCls = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi)
const num = (s: string, fallback: number) => {
  const n = parseFloat(String(s).replace(/,/g, ''))
  return Number.isFinite(n) ? n : fallback
}
const years = (n: number) => (Number.isFinite(n) ? `${n.toFixed(1)} years` : 'never')

export default function VoluntaryNiCalculator() {
  const [gapYears, setGapYears] = useUrlParam('years', '3')
  const [niClass, setNiClass] = useUrlParam('class', '3')
  const [currentYears, setCurrentYears] = useUrlParam('have', '28')
  const [futureYears, setFutureYears] = useUrlParam('work', '4')
  const [taxRate, setTaxRate] = useUrlParam('tax', '20')
  const [currentAge, setCurrentAge] = useUrlParam('age', '58')
  const [pensionAge, setPensionAge] = useUrlParam('spa', '67')
  const [horizonAge, setHorizonAge] = useUrlParam('to', '85')
  const [contractedOut, setContractedOut] = useState(false)

  const cls: NiClass = niClass === '2' ? 2 : 3
  const gap = clamp(Math.round(num(gapYears, 0)), 0, 10)
  const have = clamp(Math.round(num(currentYears, 0)), 0, 50)
  const work = clamp(Math.round(num(futureYears, 0)), 0, 50)
  const tax = clamp(num(taxRate, 20), 0, 45) / 100
  const age = clamp(Math.round(num(currentAge, 58)), 16, 100)
  const spa = clamp(Math.round(num(pensionAge, 67)), 60, 75)
  const horizon = clamp(Math.round(num(horizonAge, 85)), 60, 110)

  const r = useMemo(
    () => evaluateTopUp({ gapYears: gap, niClass: cls, currentYears: have, futureYears: work, taxRate: tax, currentAge: age, pensionAge: spa, horizonAge: horizon }),
    [gap, cls, have, work, tax, age, spa, horizon],
  )

  const perYearRows = useMemo(
    () =>
      Array.from({ length: gap }, (_, k) => {
        const n = k + 1
        const res = evaluateTopUp({ gapYears: n, niClass: cls, currentYears: have, futureYears: work, taxRate: tax, currentAge: age, pensionAge: spa, horizonAge: horizon })
        return { n, cost: res.totalCost, weekly: res.extraWeekly, annual: res.extraAnnualGross, net: res.extraAnnualNet, payback: res.paybackYears }
      }),
    [gap, cls, have, work, tax, age, spa, horizon],
  )

  const preApril2016 = age - 16 > new Date().getFullYear() - 2016

  // Verdict
  let verdictTitle = 'Likely worth it'
  let verdictTone = 'border-green-500/40 bg-green-500/10'
  const reasons: string[] = []
  if (gap === 0) {
    verdictTitle = 'Enter the number of gap years to price'
    verdictTone = 'border-border bg-muted/50'
  } else if (r.onTrackWithoutPaying) {
    verdictTitle = 'Probably not worth it'
    verdictTone = 'border-amber-500/40 bg-amber-500/10'
    reasons.push(`With ${have} qualifying years already and ${work} more expected before State Pension age you reach ${QUALIFYING_YEARS_FULL} years without paying anything. Bought years above the cap add nothing.`)
  } else if (r.belowMinimumEvenAfter) {
    verdictTitle = 'Not worth it on its own'
    verdictTone = 'border-amber-500/40 bg-amber-500/10'
    reasons.push(`Even after buying ${gap} ${gap === 1 ? 'year' : 'years'} you would have ${r.withYears} qualifying years, below the ${QUALIFYING_YEARS_MIN}-year minimum, so no State Pension would be paid. You would need ${QUALIFYING_YEARS_MIN - r.baseYears} years in total to unlock any entitlement.`)
  } else if (r.beyondHorizon) {
    verdictTitle = 'Probably not worth it on these assumptions'
    verdictTone = 'border-amber-500/40 bg-amber-500/10'
    reasons.push(`The after-tax extra pension would not repay the ${formatCurrency(r.totalCost)} until age ${r.breakEvenAge.toFixed(1)}, beyond the ${horizon} horizon you chose.`)
  } else {
    reasons.push(`The ${formatCurrency(r.totalCost)} is repaid ${years(r.paybackYears)} after the pension starts at ${r.startAge}, and the extra ${formatCurrency(r.extraAnnualNet)} a year after tax then continues for life.`)
  }
  if (gap > 0 && r.wastedYears > 0 && !r.onTrackWithoutPaying) {
    reasons.push(`Only ${r.effectiveYears} of the ${gap} years would count: the rest would take you past the ${QUALIFYING_YEARS_FULL}-year cap. Buy ${r.effectiveYears} and keep ${formatCurrency(r.costPerYear * r.wastedYears)}.`)
  }
  if (gap > 0 && r.unlocksMinimum) {
    reasons.push(`These years lift the record from ${r.baseYears} to ${r.withYears} qualifying years, crossing the ${QUALIFYING_YEARS_MIN}-year floor, so the gain is the whole pension rather than 1/${QUALIFYING_YEARS_FULL} per year.`)
  }
  if (gap > 0 && work > 0 && !r.onTrackWithoutPaying && have + work + gap > QUALIFYING_YEARS_FULL) {
    reasons.push('Future working years and bought years both count towards the same cap, so check whether more years of work could fill the gap at no cost before you pay.')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="vni-years" className="block text-sm font-medium mb-2">Gap years to buy</label>
          <input id="vni-years" type="number" inputMode="numeric" min="0" max="10" value={gapYears} onChange={(e) => setGapYears(e.target.value)} className={inputCls} aria-label="Gap years to buy" />
          <p className="text-xs text-muted-foreground mt-1">You can normally pay for the past {BACKDATE_YEARS} tax years (deadline 5 April each year)</p>
        </div>
        <div>
          <label htmlFor="vni-class" className="block text-sm font-medium mb-2">Contribution class</label>
          <select id="vni-class" value={niClass} onChange={(e) => setNiClass(e.target.value)} className={selectCls} aria-label="Contribution class">
            <option value="3">Class 3 ({formatCurrency(CLASS3_WEEKLY)} a week)</option>
            <option value="2">Class 2 ({formatCurrency(CLASS2_WEEKLY)} a week, self-employed with low profits)</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">Class 2 is only open to the self-employed with small profits and a few specific jobs; most people pay Class 3</p>
        </div>
        <div>
          <label htmlFor="vni-have" className="block text-sm font-medium mb-2">Qualifying years already on your record</label>
          <input id="vni-have" type="number" inputMode="numeric" min="0" max="50" value={currentYears} onChange={(e) => setCurrentYears(e.target.value)} className={inputCls} aria-label="Qualifying years already on your record" />
          <p className="text-xs text-muted-foreground mt-1">From your forecast at gov.uk/check-state-pension</p>
        </div>
        <div>
          <label htmlFor="vni-work" className="block text-sm font-medium mb-2">Years you will still work or get credits</label>
          <input id="vni-work" type="number" inputMode="numeric" min="0" max="50" value={futureYears} onChange={(e) => setFutureYears(e.target.value)} className={inputCls} aria-label="Years you will still work or get credits before State Pension age" />
          <p className="text-xs text-muted-foreground mt-1">Each one adds a qualifying year for free</p>
        </div>
        <div>
          <label htmlFor="vni-age" className="block text-sm font-medium mb-2">Your age now</label>
          <input id="vni-age" type="number" inputMode="numeric" min="16" max="100" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} className={inputCls} aria-label="Your age now" />
        </div>
        <div>
          <label htmlFor="vni-spa" className="block text-sm font-medium mb-2">Your State Pension age</label>
          <select id="vni-spa" value={pensionAge} onChange={(e) => setPensionAge(e.target.value)} className={selectCls} aria-label="Your State Pension age">
            <option value="66">66</option>
            <option value="67">67</option>
            <option value="68">68</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Not sure? Use the <a href="/calculator/state-pension-age-calculator/" className="text-primary underline">State Pension age calculator</a>
          </p>
        </div>
        <div>
          <label htmlFor="vni-tax" className="block text-sm font-medium mb-2">Income tax rate in retirement</label>
          <select id="vni-tax" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className={selectCls} aria-label="Income tax rate in retirement">
            <option value="0">0% (income within the Personal Allowance)</option>
            <option value="20">20% basic rate</option>
            <option value="40">40% higher rate</option>
          </select>
        </div>
        <div>
          <label htmlFor="vni-to" className="block text-sm font-medium mb-2">Count the gain up to age</label>
          <input id="vni-to" type="number" inputMode="numeric" min="60" max="110" value={horizonAge} onChange={(e) => setHorizonAge(e.target.value)} className={inputCls} aria-label="Count the gain up to age" />
          <p className="text-xs text-muted-foreground mt-1">A life expectancy horizon; 85 is a reasonable planning figure</p>
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-border p-3 text-sm cursor-pointer">
        <input type="checkbox" checked={contractedOut} onChange={(e) => setContractedOut(e.target.checked)} className="mt-0.5 h-4 w-4" aria-label="My forecast shows a contracted-out deduction (COPE)" />
        <span>My State Pension forecast shows a contracted-out pension equivalent (COPE), or my employer scheme was contracted out before 2016</span>
      </label>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Extra State Pension from {gap} bought {gap === 1 ? 'year' : 'years'}</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(r.extraWeekly)}/week</p>
          <p className="text-sm text-muted-foreground mt-1">
            {formatCurrency(r.extraAnnualGross)} a year before tax &middot; {formatCurrency(r.extraAnnualNet)} after {Math.round(tax * 100)}% tax
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Cost per year</p><p className="text-lg font-bold">{formatCurrency(r.costPerYear)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total cost</p><p className="text-lg font-bold">{formatCurrency(r.totalCost)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Payback period</p><p className="text-lg font-bold">{Number.isFinite(r.paybackYears) ? `${r.paybackYears.toFixed(1)} yrs` : 'n/a'}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Break-even age</p><p className="text-lg font-bold">{Number.isFinite(r.breakEvenAge) ? r.breakEvenAge.toFixed(1) : 'n/a'}</p></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Pension without paying</p><p className="text-lg font-bold">{formatCurrency(r.pensionWithoutWeekly)}/wk</p><p className="text-xs text-muted-foreground">{r.baseYears} qualifying years</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Pension after paying</p><p className="text-lg font-bold">{formatCurrency(r.pensionWithWeekly)}/wk</p><p className="text-xs text-muted-foreground">{Math.min(r.withYears, QUALIFYING_YEARS_FULL)} of {QUALIFYING_YEARS_FULL} years</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Gain to age {horizon} (after tax)</p><p className={`text-lg font-bold ${r.lifetimeGain < 0 ? 'text-destructive' : ''}`}>{formatCurrency(r.lifetimeGain)}</p><p className="text-xs text-muted-foreground">{r.yearsInPayment} years in payment</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Return on outlay</p><p className="text-lg font-bold">{r.totalCost > 0 ? `${r.returnMultiple.toFixed(1)}x` : 'n/a'}</p><p className="text-xs text-muted-foreground">after-tax pension received / cost</p></div>
        </div>

        <div className={`rounded-xl border p-4 ${verdictTone}`}>
          <p className="font-semibold">{verdictTitle}</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc pl-5">
            {reasons.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>

        {perYearRows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Years bought</th>
                  <th className="py-2 pr-3 font-medium">Total cost</th>
                  <th className="py-2 pr-3 font-medium">Extra per week</th>
                  <th className="py-2 pr-3 font-medium">Extra per year</th>
                  <th className="py-2 pr-3 font-medium">After tax</th>
                  <th className="py-2 font-medium">Payback</th>
                </tr>
              </thead>
              <tbody>
                {perYearRows.map((row) => (
                  <tr key={row.n} className="border-b border-border/60">
                    <td className="py-2 pr-3 font-medium">{row.n}</td>
                    <td className="py-2 pr-3">{formatCurrency(row.cost)}</td>
                    <td className="py-2 pr-3">{formatCurrency(row.weekly)}</td>
                    <td className="py-2 pr-3">{formatCurrency(row.annual)}</td>
                    <td className="py-2 pr-3">{formatCurrency(row.net)}</td>
                    <td className="py-2">{Number.isFinite(row.payback) ? `${row.payback.toFixed(1)} yrs` : 'n/a'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
          <p className="font-medium text-foreground">Before you pay</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Get a State Pension forecast at gov.uk/check-state-pension first. GOV.UK says voluntary contributions "do not always increase your State Pension", and if you are under State Pension age it tells you to check the forecast or contact the Future Pension Centre before paying. Over State Pension age, ask the Pension Service.
            </li>
            {(contractedOut || preApril2016) && (
              <li className={contractedOut ? 'text-foreground font-medium' : ''}>
                {contractedOut
                  ? 'You were contracted out, so your starting amount in April 2016 carried a COPE deduction. Years before 2016 bought back may add less than 1/35 of the full rate or nothing at all. Only the forecast can tell you which years would help.'
                  : 'Your record includes years before April 2016. If you were ever in a contracted-out workplace scheme, buying pre-2016 years may add less than shown, so compare the forecast figures with and without the payment before deciding.'}
              </li>
            )}
            <li>
              Gaps for 2024/25 and 2025/26 are charged at the rates that applied then (Class 3 {formatCurrency(PRIOR_YEAR_RATES[0].class3)} and {formatCurrency(PRIOR_YEAR_RATES[1].class3)} a week; Class 2 {formatCurrency(PRIOR_YEAR_RATES[1].class2)} a week for 2025/26), so those years cost a little less than the {TAX_YEAR} figure used here. Older gaps are charged at {formatCurrency(weeklyRate(cls))} a week.
            </li>
            <li>
              The extended window for filling gaps back to April 2006 closed on {EXTENDED_WINDOW_CLOSED}. Only the past {BACKDATE_YEARS} tax years are now open.
            </li>
            {r.pastPensionAge && (
              <li>You are at or past State Pension age, so any increase starts as soon as the payment is processed. The figures above assume it starts now.</li>
            )}
          </ul>
          <p>
            Full new State Pension {TAX_YEAR}: <span className="font-medium text-foreground">{formatCurrency(FULL_NEW_STATE_PENSION_WEEKLY)} a week</span> after {QUALIFYING_YEARS_FULL} qualifying years; each year below the cap is worth {formatCurrency(PER_YEAR_WEEKLY)} a week. A Class 3 year costs {formatCurrency(annualCost(3))}, a Class 2 year {formatCurrency(annualCost(2))}. Related tools: <a href="/calculator/state-pension-calculator/" className="text-primary underline">State Pension calculator</a>, <a href="/calculator/national-insurance-calculator/" className="text-primary underline">National Insurance calculator</a>, <a href="/calculator/pension-calculator/" className="text-primary underline">workplace pension calculator</a>.
          </p>
        </div>

        <ShareRow params={{ years: gapYears, class: niClass, have: currentYears, work: futureYears, tax: taxRate, age: currentAge, spa: pensionAge, to: horizonAge }} />
      </div>
    </div>
  )
}
