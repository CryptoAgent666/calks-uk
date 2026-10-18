/**
 * Budget 2026 (Wednesday 28 October 2026): the April-2027 schedule under current law.
 *
 * One list feeds the Budget 2026 calculator component, the rate table on its page
 * and the prose. Every value here is either reused from the site's own calculators
 * (2026/27 constants) or taken from a cited gov.uk / legislation.gov.uk page, with the
 * page and date recorded on the item. Nothing in this file is a forecast.
 *
 * ON BUDGET DAY: update PAGE_UPDATED, revise the `status`/`to`/`detail` of any item the
 * Chancellor changes, move settled WATCH_LIST items into APRIL_2027_SCHEDULE, then
 * refresh the quickAnswer / example / FAQs in calculator-content.ts and faqs.ts.
 */

export const BUDGET_2026_DATE = 'Wednesday 28 October 2026'
export const BUDGET_2026_DATE_SHORT = '28 October'
export const BUDGET_2026_DATE_ISO = '2026-10-28'
/** Date shown in the component status line; bump on every revision of this page. */
export const PAGE_UPDATED = '13 October 2026'
/** HM Treasury: Chancellor's letter to the Treasury Select Committee fixing the Budget date (published 31 July 2026). */
export const BUDGET_2026_SOURCE_URL =
  'https://www.gov.uk/government/publications/chancellor-letter-to-the-treasury-select-committee-tsc-budget-2026-date/chancellor-letter-to-the-treasury-select-committee-tsc'

export const STATUS_LINE = `Updated ${PAGE_UPDATED}. Budget 2026 is on ${BUDGET_2026_DATE_SHORT}; this page will be revised the same day.`

// ---------------------------------------------------------------------------
// 2026/27 constants, identical to the site's calculators
// (IncomeTaxCalculator, NationalInsuranceCalculator, DividendTaxCalculator,
//  PayPerMileCalculator, ISACalculator, MakingTaxDigitalCalculator,
//  InheritanceTaxPensionCalculator, TakeHomePayCalculator).
// ---------------------------------------------------------------------------
export const PERSONAL_ALLOWANCE = 12_570
export const BASIC_RATE_BAND = 37_700 // width of the 20% band in taxable income
export const BASIC_RATE_LIMIT = 50_270 // gross income where 40% starts on a full allowance
export const HIGHER_RATE_LIMIT = 125_140 // taxable income where 45% starts
export const PA_TAPER_START = 100_000
export const SALARY_RATES = { basic: 0.2, higher: 0.4, additional: 0.45 }

export const NI_PRIMARY_THRESHOLD = 12_570
export const NI_UPPER_EARNINGS_LIMIT = 50_270
export const NI_MAIN_RATE = 0.08
export const NI_ADDITIONAL_RATE = 0.02
export const EMPLOYER_NI_RATE = 0.15
export const EMPLOYER_NI_SECONDARY_THRESHOLD = 5_000

export const DIVIDEND_ALLOWANCE = 500
export const DIVIDEND_RATES = { basic: 0.1075, higher: 0.3575, additional: 0.3935 }

export const ISA_ALLOWANCE = 20_000
/** SI 2026/1018, in force 6 April 2027: cash ISA subscriptions for anyone aged 64 or under at the end of the tax year. */
export const CASH_ISA_LIMIT_UNDER_65_FROM_2027 = 12_000
export const PERSONAL_SAVINGS_ALLOWANCE = { basic: 1_000, higher: 500, additional: 0 }
export const SAVINGS_RATES_NOW = { basic: 0.2, higher: 0.4, additional: 0.45 }
/** Finance Act 2026 s.5: savings rates for 2027/28. */
export const SAVINGS_RATES_FROM_2027 = { basic: 0.22, higher: 0.42, additional: 0.47 }

/** Fuel duty on petrol and diesel, pence per litre (gov.uk "Amended Fuel Duty rates 2026 to 2027", published 22 May 2026). */
export const FUEL_DUTY_PENCE = 52.95 // to 31 December 2026
export const FUEL_DUTY_PENCE_JAN_2027 = 55.95 // from 1 January 2027 (legislative default)
export const FUEL_DUTY_PENCE_MAR_2027 = 57.95 // from 1 March 2027 (legislative default)
export const VAT = 0.2

export const MTD_THRESHOLD_2026 = 50_000
export const MTD_THRESHOLD_2027 = 30_000
export const MTD_THRESHOLD_2028 = 20_000

export const IHT_NIL_RATE_BAND = 325_000
export const IHT_RATE = 0.4

export const PLAN2_REPAYMENT_THRESHOLD = 29_385
export const NATIONAL_LIVING_WAGE_21_PLUS = 12.71
export const CORPORATION_TAX_MAIN_RATE = 0.25
export const CORPORATION_TAX_SMALL_PROFITS_RATE = 0.19

// ---------------------------------------------------------------------------
// The schedule
// ---------------------------------------------------------------------------
export type ScheduleStatus = 'legislated' | 'announced' | 'watch'

export const STATUS_LABELS: Record<ScheduleStatus, string> = {
  legislated: 'In law',
  announced: 'Announced, legislation pending',
  watch: 'Not yet decided',
}

export interface ScheduleItem {
  id: string
  label: string
  status: ScheduleStatus
  /** When it takes effect, as printed on the source. */
  effective: string
  /** Position in 2026/27. */
  from: string
  /** Position after the effective date under current law. */
  to: string
  /** One plain sentence; no forecasts. */
  detail: string
  sourceUrl?: string
  sourceName?: string
  /** Date the source page was published or last updated, as shown on it. */
  sourceDate?: string
}

const TIIN_THRESHOLDS_2031 =
  'https://www.gov.uk/government/publications/maintaining-income-tax-and-equivalent-national-insurance-contributions-thresholds-until-5-april-2031/income-tax-maintaining-the-personal-allowance-and-the-basic-rate-limit-for-income-tax-and-equivalent-national-insurance-contributions-thresholds-unt'
const RATES_AND_THRESHOLDS_2026_27 = 'https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027'
const FUEL_DUTY_AMENDED_RATES =
  'https://www.gov.uk/government/publications/amended-fuel-duty-rates-for-2026-to-2027/amended-fuel-duty-rates-2026-to-2027'
const FA2026 = 'https://www.legislation.gov.uk/ukpga/2026/11'

export const APRIL_2027_SCHEDULE: ScheduleItem[] = [
  {
    id: 'personal-allowance',
    label: 'Income tax Personal Allowance',
    status: 'legislated',
    effective: '6 April 2027 (held to 5 April 2031)',
    from: '£12,570',
    to: '£12,570',
    detail:
      'Finance Act 2026 section 10 keeps the allowance at £12,570 and the basic-rate band at £37,700 for every tax year up to 2030/31, so neither rises with inflation.',
    sourceUrl: TIIN_THRESHOLDS_2031,
    sourceName: 'HMRC tax information note',
    sourceDate: '26 November 2025',
  },
  {
    id: 'higher-rate-threshold',
    label: 'Higher-rate (40%) threshold',
    status: 'legislated',
    effective: '6 April 2027 (held to 5 April 2031)',
    from: '£50,270',
    to: '£50,270',
    detail:
      'With the allowance and the basic-rate band both fixed, 40% tax keeps starting at £50,270 of income for anyone with the full allowance; the 45% rate still starts at £125,140.',
    sourceUrl: TIIN_THRESHOLDS_2031,
    sourceName: 'HMRC tax information note',
    sourceDate: '26 November 2025',
  },
  {
    id: 'ni-thresholds',
    label: 'Employee National Insurance (Class 1)',
    status: 'legislated',
    effective: '6 April 2027 (held to 5 April 2031)',
    from: '8% from £12,570 to £50,270, then 2%',
    to: '8% from £12,570 to £50,270, then 2%',
    detail:
      'The Primary Threshold stays aligned with the Personal Allowance and the Upper Earnings Limit with the higher-rate threshold until 5 April 2031.',
    sourceUrl: TIIN_THRESHOLDS_2031,
    sourceName: 'HMRC tax information note',
    sourceDate: '26 November 2025',
  },
  {
    id: 'employer-ni',
    label: 'Employer National Insurance',
    status: 'legislated',
    effective: 'No change scheduled',
    from: '15% above £5,000',
    to: '15% above £5,000',
    detail:
      'The 15% rate and the £5,000 Secondary Threshold introduced in April 2025 continue; no later change has been legislated or announced.',
    sourceUrl: RATES_AND_THRESHOLDS_2026_27,
    sourceName: 'HMRC rates and thresholds for employers',
    sourceDate: '1 September 2026',
  },
  {
    id: 'dividend-rates',
    label: 'Dividend tax rates',
    status: 'legislated',
    effective: 'No change scheduled',
    from: '10.75% / 35.75% / 39.35%',
    to: '10.75% / 35.75% / 39.35%',
    detail:
      'The ordinary and upper rates rose by 2 percentage points on 6 April 2026 under Finance Act 2026 section 4; the £500 dividend allowance and the 39.35% additional rate are unchanged.',
    sourceUrl:
      'https://www.gov.uk/government/publications/changes-to-tax-rates-for-property-savings-dividend-income/changes-to-tax-rates-for-property-savings-dividend-income',
    sourceName: 'HMRC policy paper',
    sourceDate: '26 November 2025',
  },
  {
    id: 'savings-rates',
    label: 'Tax on savings interest held outside an ISA',
    status: 'legislated',
    effective: '6 April 2027',
    from: '20% / 40% / 45%',
    to: '22% / 42% / 47%',
    detail:
      'Finance Act 2026 section 5 sets the savings basic, higher and additional rates for 2027/28 two points higher; the Personal Savings Allowance of £1,000, £500 or nil is unchanged.',
    sourceUrl: `${FA2026}/section/5`,
    sourceName: 'Finance Act 2026, s.5',
    sourceDate: 'Royal Assent 18 March 2026',
  },
  {
    id: 'property-rates',
    label: 'Tax on rental (property) income',
    status: 'legislated',
    effective: '6 April 2027',
    from: '20% / 40% / 45%',
    to: '22% / 42% / 47%',
    detail:
      'Finance Act 2026 section 7 creates separate property rates for 2027/28 in England, Wales and Northern Ireland, two points above the main rates.',
    sourceUrl: `${FA2026}/section/7`,
    sourceName: 'Finance Act 2026, s.7',
    sourceDate: 'Royal Assent 18 March 2026',
  },
  {
    id: 'cash-isa',
    label: 'Cash ISA limit for savers aged under 65',
    status: 'legislated',
    effective: '6 April 2027',
    from: '£20,000',
    to: '£12,000 (within the £20,000 overall allowance)',
    detail:
      'The Individual Savings Account (Amendment) (No. 2) Regulations 2026 (SI 2026/1018, made 10 September 2026) cap cash ISA subscriptions at £12,000 for anyone aged 64 or under at the end of the tax year; savers aged 65 and over keep £20,000.',
    sourceUrl: 'https://www.legislation.gov.uk/uksi/2026/1018/made',
    sourceName: 'SI 2026/1018',
    sourceDate: 'Made 10 September 2026',
  },
  {
    id: 'iht-pensions',
    label: 'Inheritance tax on unused pension funds',
    status: 'legislated',
    effective: 'Deaths on or after 6 April 2027',
    from: 'Outside the estate',
    to: 'Inside the estate',
    detail:
      'Finance Act 2026 sections 66 to 71 bring most unused pension funds and death benefits into the estate; death-in-service benefits and dependants scheme pensions are excluded, and personal representatives report and pay the tax.',
    sourceUrl:
      'https://www.gov.uk/government/publications/inheritance-tax-on-pensions-technical-note/technical-note-inheritance-tax-on-pensions',
    sourceName: 'HMRC technical note',
    sourceDate: 'Updated 29 May 2026',
  },
  {
    id: 'mtd',
    label: 'Making Tax Digital for Income Tax',
    status: 'legislated',
    effective: '6 April 2027',
    from: 'Qualifying income over £50,000',
    to: 'Qualifying income over £30,000',
    detail:
      'Sole traders and landlords whose gross self-employment and property income for 2025/26 was above £30,000 keep digital records and send quarterly updates from 6 April 2027; the £20,000 tier follows on 6 April 2028.',
    sourceUrl: 'https://www.gov.uk/guidance/check-if-youre-eligible-for-making-tax-digital-for-income-tax',
    sourceName: 'HMRC guidance',
    sourceDate: 'Updated 26 March 2026',
  },
  {
    id: 'fuel-duty-jan',
    label: 'Fuel duty on petrol and diesel (legislative default)',
    status: 'legislated',
    effective: '1 January 2027',
    from: '52.95p a litre',
    to: '55.95p a litre',
    detail:
      'The temporary 5p cut ends on 31 December 2026 and duty steps up by 3p; the gov.uk rates page says the government will confirm final rates at Budget 2026.',
    sourceUrl: FUEL_DUTY_AMENDED_RATES,
    sourceName: 'HMRC amended fuel duty rates',
    sourceDate: '22 May 2026',
  },
  {
    id: 'fuel-duty-mar',
    label: 'Fuel duty on petrol and diesel (legislative default)',
    status: 'legislated',
    effective: '1 March 2027',
    from: '55.95p a litre',
    to: '57.95p a litre',
    detail:
      'The second step restores the pre-March 2022 rate; because 20% VAT is charged on duty, the full 5p rise adds 6p a litre at the pump if passed on in full.',
    sourceUrl: FUEL_DUTY_AMENDED_RATES,
    sourceName: 'HMRC amended fuel duty rates',
    sourceDate: '22 May 2026',
  },
  {
    id: 'corporation-tax',
    label: 'Corporation Tax for the financial year 2027',
    status: 'legislated',
    effective: '1 April 2027',
    from: '25% main rate, 19% small profits rate',
    to: '25% main rate, 19% small profits rate',
    detail:
      'Finance Act 2026 sections 11 and 12 fix the rates for the year from 1 April 2027 at 25% and 19%, with the 3/200ths marginal relief fraction unchanged.',
    sourceUrl: `${FA2026}/section/11`,
    sourceName: 'Finance Act 2026, ss.11 and 12',
    sourceDate: 'Royal Assent 18 March 2026',
  },
  {
    id: 'plan2-threshold',
    label: 'Plan 2 student loan repayment threshold',
    status: 'announced',
    effective: '6 April 2027 (for three years)',
    from: '£29,385',
    to: '£29,385',
    detail:
      'Budget 2025 said the threshold would stay at its 2026/27 level for three years from April 2027; the figure is set each year by regulations, so the 2027/28 regulations are still to be made.',
    sourceUrl: 'https://www.gov.uk/government/publications/budget-2025-document/budget-2025-html',
    sourceName: 'HM Treasury, Budget 2025',
    sourceDate: '26 November 2025',
  },
  {
    id: 'nlw',
    label: 'National Living Wage (21 and over)',
    status: 'watch',
    effective: '1 April 2027',
    from: '£12.71 an hour',
    to: 'Not yet announced',
    detail:
      'The Low Pay Commission recommends the April 2027 rates in the autumn and the government announces its decision afterwards; nothing has been published yet.',
    sourceUrl: 'https://www.gov.uk/government/organisations/low-pay-commission',
    sourceName: 'Low Pay Commission',
    sourceDate: 'Checked 13 October 2026',
  },
  {
    id: 'state-pension',
    label: 'State Pension uprating (triple lock)',
    status: 'watch',
    effective: 'April 2027',
    from: '£241.30 a week (full new State Pension)',
    to: 'Not yet announced',
    detail:
      'The increase is the highest of average earnings growth, September CPI inflation and 2.5%; the earnings and CPI figures are published in October and the rate is confirmed after that.',
  },
  {
    id: 'benefits',
    label: 'Working-age benefits uprating',
    status: 'watch',
    effective: 'April 2027',
    from: '2026/27 rates',
    to: 'Not yet announced',
    detail:
      'Most benefits are uprated by the previous September CPI figure, which is published in October; the government then confirms the new rates.',
  },
]

/** Live items for the "Watch on 28 October" panel. Plain statements only; no predictions. */
export interface WatchItem {
  id: string
  label: string
  line: string
}

export const WATCH_LIST: WatchItem[] = [
  {
    id: 'fuel-duty',
    label: 'Fuel duty',
    line: `The table above is the legal default (52.95p to 55.95p on 1 January, 57.95p on 1 March 2027); the government has said it will confirm final rates at this Budget.`,
  },
  {
    id: 'nlw',
    label: 'National Living Wage from April 2027',
    line: 'Not yet announced. The Low Pay Commission recommends the rates and the government decides; until then payroll tools keep £12.71 an hour.',
  },
  {
    id: 'thresholds',
    label: 'Income tax and National Insurance thresholds',
    line: 'Frozen in law until 5 April 2031. A Budget can change that law, but no change has been announced.',
  },
  {
    id: 'state-pension',
    label: 'State Pension',
    line: 'The April 2027 triple-lock increase has not been confirmed; it follows the September earnings and inflation figures.',
  },
  {
    id: 'benefits',
    label: 'Benefit uprating for April 2027',
    line: 'The April 2027 uprating of working-age and disability benefits follows September CPI; the rates are confirmed after the Budget.',
  },
  {
    id: 'isa',
    label: 'ISAs',
    line: 'The £12,000 cash ISA limit for under-65s is already law from 6 April 2027. Watch for any further ISA announcement; none has been made.',
  },
  {
    id: 'capital-taxes',
    label: 'Dividend, capital gains, inheritance and stamp duty taxes',
    line: 'No change is scheduled beyond the items in the table; anything on these would be a new announcement.',
  },
  {
    id: 'student-loans',
    label: 'Student loans',
    line: 'The Plan 2 threshold freeze at £29,385 from April 2027 was announced at Budget 2025; the regulations have not yet been made.',
  },
]

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** HTML table for the calculator page (rateTable) and anywhere else the schedule is shown. */
export function scheduleTableHtml(): string {
  const rows = APRIL_2027_SCHEDULE.map((i) => {
    const source = i.sourceUrl
      ? `<a href="${i.sourceUrl}" rel="noopener" target="_blank">${esc(i.sourceName ?? 'Source')}</a>${i.sourceDate ? `, ${esc(i.sourceDate)}` : ''}`
      : 'No decision published'
    return `<tr><td>${esc(i.label)}</td><td>${esc(STATUS_LABELS[i.status])}</td><td>${esc(i.effective)}</td><td>${esc(i.from)}</td><td><strong>${esc(i.to)}</strong></td><td>${source}</td></tr>`
  }).join('')
  return `<table><thead><tr><th>Measure</th><th>Status</th><th>Takes effect</th><th>2026/27</th><th>From the date shown</th><th>Source</th></tr></thead><tbody>${rows}</tbody></table>`
}
