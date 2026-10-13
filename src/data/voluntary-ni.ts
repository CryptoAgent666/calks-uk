/**
 * Voluntary National Insurance (Class 2 and Class 3) top-up figures shared by the
 * Voluntary NI calculator, its page prose and its rate table, so the three can never
 * disagree. Update the constants here and nowhere else.
 *
 * Verified against GOV.UK on 13 October 2026:
 *  - gov.uk/voluntary-national-insurance-contributions/rates (page updated 30 Sep 2026):
 *    "The rates for the 2026 to 2027 tax year are: £3.65 a week for Class 2,
 *    £18.40 a week for Class 3". Class 2 for the previous tax year and Class 3 for the
 *    previous 2 tax years are charged at the original rate for those years; earlier
 *    years are charged at the 2026 to 2027 rate.
 *  - gov.uk/government/publications/rates-and-allowances-national-insurance-contributions:
 *    Class 3 £17.45 (2024 to 2025), £17.75 (2025 to 2026); Class 2 £3.45, £3.50.
 *  - gov.uk/new-state-pension/what-youll-get: "The full rate of new State Pension is
 *    £241.30 a week"; a record that started after April 2016 needs 35 qualifying years
 *    for the full rate; people contracted out before 2016 "will usually need more than
 *    35 qualifying years".
 *  - gov.uk/new-state-pension/eligibility: "You'll need 10 qualifying years on your
 *    National Insurance record to get any new State Pension."
 *  - gov.uk/voluntary-national-insurance-contributions/deadlines: "You can only pay
 *    voluntary contributions for the past 6 years. The deadline is 5 April each year."
 *  - gov.uk/government/news/deadline-for-voluntary-national-insurance-contributions-
 *    extended-to-april-2025 (12 Jun 2023): gaps from April 2006 could be filled
 *    "until 5 April 2025"; that extended window has now closed.
 *
 * The State Pension figures (241.30 / 35 / 10) are the same values hard-coded in
 * StatePensionCalculator.tsx and recorded in the ledger under full_new_state_pension_weekly,
 * state_pension_qualifying_years_full and state_pension_qualifying_years_min. The NI
 * rates match class3_voluntary_ni_weekly and ni_class2_weekly_rate.
 */

export const TAX_YEAR = '2026/27'
export const CLASS3_WEEKLY = 18.40
export const CLASS2_WEEKLY = 3.65
export const FULL_NEW_STATE_PENSION_WEEKLY = 241.30
export const QUALIFYING_YEARS_FULL = 35
export const QUALIFYING_YEARS_MIN = 10
export const BACKDATE_YEARS = 6
export const EXTENDED_WINDOW_CLOSED = '5 April 2025'
export const WEEKS_PER_YEAR = 52

/** Rates that still apply to the two most recent gap years (Class 3) or the most recent one (Class 2). */
export const PRIOR_YEAR_RATES = [
  { year: '2024/25', class3: 17.45, class2: 3.45 },
  { year: '2025/26', class3: 17.75, class2: 3.50 },
]

/** Weekly State Pension added by one extra qualifying year below the 35-year cap. */
export const PER_YEAR_WEEKLY = FULL_NEW_STATE_PENSION_WEEKLY / QUALIFYING_YEARS_FULL
export const PER_YEAR_ANNUAL = PER_YEAR_WEEKLY * WEEKS_PER_YEAR
export const FULL_NEW_STATE_PENSION_ANNUAL = FULL_NEW_STATE_PENSION_WEEKLY * WEEKS_PER_YEAR

export type NiClass = 2 | 3

export const weeklyRate = (niClass: NiClass): number => (niClass === 2 ? CLASS2_WEEKLY : CLASS3_WEEKLY)
export const annualCost = (niClass: NiClass): number => weeklyRate(niClass) * WEEKS_PER_YEAR

/** New State Pension a week for a given number of qualifying years (nothing below 10, capped at 35). */
export function statePensionWeekly(years: number): number {
  const y = Math.min(Math.max(0, years), QUALIFYING_YEARS_FULL)
  return y >= QUALIFYING_YEARS_MIN ? (y / QUALIFYING_YEARS_FULL) * FULL_NEW_STATE_PENSION_WEEKLY : 0
}

/** Years to recover the outlay from the after-tax extra pension, once it is in payment. */
export function paybackYears(niClass: NiClass, taxRate: number): number {
  return annualCost(niClass) / (PER_YEAR_ANNUAL * (1 - taxRate))
}

export interface TopUpInputs {
  /** Gap years you are considering buying */
  gapYears: number
  niClass: NiClass
  /** Qualifying years already on the record */
  currentYears: number
  /** Further qualifying years you expect to add by working or credits before State Pension age */
  futureYears: number
  /** Marginal income tax rate in retirement as a fraction: 0, 0.2 or 0.4 */
  taxRate: number
  currentAge: number
  pensionAge: number
  /** Age to which the lifetime figures are counted */
  horizonAge: number
}

export interface TopUpResult {
  costPerYear: number
  totalCost: number
  baseYears: number
  withYears: number
  /** Bought years that add to the pension (the rest fall above the 35-year cap) */
  effectiveYears: number
  wastedYears: number
  pensionWithoutWeekly: number
  pensionWithWeekly: number
  extraWeekly: number
  extraAnnualGross: number
  extraAnnualNet: number
  /** Years after the pension starts until the after-tax extra pension has repaid the cost */
  paybackYears: number
  /** Age at which the extra pension starts: State Pension age, or now if already past it */
  startAge: number
  breakEvenAge: number
  yearsInPayment: number
  lifetimeGross: number
  lifetimeNet: number
  lifetimeGain: number
  returnMultiple: number
  onTrackWithoutPaying: boolean
  belowMinimumEvenAfter: boolean
  unlocksMinimum: boolean
  beyondHorizon: boolean
  pastPensionAge: boolean
}

export function evaluateTopUp(i: TopUpInputs): TopUpResult {
  const gapYears = Math.max(0, Math.floor(i.gapYears))
  const currentYears = Math.max(0, Math.floor(i.currentYears))
  const futureYears = Math.max(0, Math.floor(i.futureYears))
  const taxRate = Math.min(Math.max(0, i.taxRate), 0.99)

  const baseYears = currentYears + futureYears
  const withYears = baseYears + gapYears
  const pensionWithoutWeekly = statePensionWeekly(baseYears)
  const pensionWithWeekly = statePensionWeekly(withYears)
  const extraWeekly = Math.max(0, pensionWithWeekly - pensionWithoutWeekly)
  const extraAnnualGross = extraWeekly * WEEKS_PER_YEAR
  const extraAnnualNet = extraAnnualGross * (1 - taxRate)

  const costPerYear = annualCost(i.niClass)
  const totalCost = costPerYear * gapYears
  const effectiveYears = Math.max(0, Math.min(gapYears, QUALIFYING_YEARS_FULL - baseYears))
  const wastedYears = gapYears - effectiveYears

  const payback = extraAnnualNet > 0 ? totalCost / extraAnnualNet : Infinity
  const pastPensionAge = i.currentAge >= i.pensionAge
  const startAge = pastPensionAge ? i.currentAge : i.pensionAge
  const breakEvenAge = startAge + payback
  const yearsInPayment = Math.max(0, i.horizonAge - startAge)
  const lifetimeGross = extraAnnualGross * yearsInPayment
  const lifetimeNet = extraAnnualNet * yearsInPayment
  const lifetimeGain = lifetimeNet - totalCost

  return {
    costPerYear,
    totalCost,
    baseYears,
    withYears,
    effectiveYears,
    wastedYears,
    pensionWithoutWeekly,
    pensionWithWeekly,
    extraWeekly,
    extraAnnualGross,
    extraAnnualNet,
    paybackYears: payback,
    startAge,
    breakEvenAge,
    yearsInPayment,
    lifetimeGross,
    lifetimeNet,
    lifetimeGain,
    returnMultiple: totalCost > 0 ? lifetimeNet / totalCost : 0,
    onTrackWithoutPaying: baseYears >= QUALIFYING_YEARS_FULL,
    belowMinimumEvenAfter: withYears < QUALIFYING_YEARS_MIN,
    unlocksMinimum: baseYears < QUALIFYING_YEARS_MIN && withYears >= QUALIFYING_YEARS_MIN,
    beyondHorizon: Number.isFinite(payback) ? breakEvenAge > i.horizonAge : true,
    pastPensionAge,
  }
}

const gbp = (n: number, dp = 2) =>
  '£' + n.toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp })

export const fmtGbp = gbp

/** Rate table for the calculator page, generated from the constants above. */
export function voluntaryNiRateTableHtml(): string {
  const rows: [string, string][] = [
    ['Class 3 voluntary contribution', `${gbp(CLASS3_WEEKLY)} a week, ${gbp(annualCost(3))} for a full year`],
    ['Class 2 voluntary contribution (self-employed with low profits)', `${gbp(CLASS2_WEEKLY)} a week, ${gbp(annualCost(2))} for a full year`],
    ['Full new State Pension', `${gbp(FULL_NEW_STATE_PENSION_WEEKLY)} a week, ${gbp(FULL_NEW_STATE_PENSION_ANNUAL)} a year, after ${QUALIFYING_YEARS_FULL} qualifying years`],
    ['Extra State Pension per qualifying year bought', `${gbp(PER_YEAR_WEEKLY)} a week, ${gbp(PER_YEAR_ANNUAL)} a year (1/${QUALIFYING_YEARS_FULL} of the full rate)`],
    ['Minimum record for any State Pension', `${QUALIFYING_YEARS_MIN} qualifying years`],
    ['Payback on a Class 3 year, no tax in retirement', `${paybackYears(3, 0).toFixed(1)} years`],
    ['Payback on a Class 3 year, 20% taxpayer', `${paybackYears(3, 0.2).toFixed(1)} years`],
    ['Payback on a Class 3 year, 40% taxpayer', `${paybackYears(3, 0.4).toFixed(1)} years`],
    ['Payback on a Class 2 year, 20% taxpayer', `${paybackYears(2, 0.2).toFixed(1)} years`],
    ['How far back you can pay', `${BACKDATE_YEARS} tax years, deadline 5 April each year`],
  ]
  return `<table><thead><tr><th>Item (${TAX_YEAR})</th><th>Figure</th></tr></thead><tbody>${rows
    .map(([a, b]) => `<tr><td>${a}</td><td><strong>${b}</strong></td></tr>`)
    .join('')}</tbody></table>`
}
