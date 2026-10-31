/**
 * Budget 2026 (delivered Wednesday 28 October 2026): what was announced and the schedule it sets.
 *
 * One list feeds the Budget 2026 calculator component, the rate table on its page
 * and the prose. Every value here is either reused from the site's own calculators
 * (2026/27 constants) or taken from a cited gov.uk / legislation.gov.uk page, with the
 * page and date recorded on the item. Nothing in this file is a forecast.
 *
 * Status labels: Budget 2026 measures awaiting Finance Bill 2026-27 or regulations are
 * 'announced', not 'legislated'. WHEN FINANCE ACT 2027 PASSES: update PAGE_UPDATED, move
 * those items to 'legislated' with the section reference, then refresh the quickAnswer,
 * example and FAQs in calculator-content.ts and faqs.ts.
 */

export const BUDGET_2026_DATE = 'Wednesday 28 October 2026'
export const BUDGET_2026_DATE_SHORT = '28 October 2026'
export const BUDGET_2026_DATE_ISO = '2026-10-28'
/** Date shown in the component status line; bump on every revision of this page. */
export const PAGE_UPDATED = '31 October 2026'

/** HM Treasury: Budget 2026 document. */
export const BUDGET_2026_SOURCE_URL =
  'https://www.gov.uk/government/publications/budget-2026-document/budget-2026-html'
/** HM Treasury / HMRC: Budget 2026 overview of tax legislation and rates (OOTLAR). */
export const BUDGET_2026_OOTLAR_URL =
  'https://www.gov.uk/government/publications/budget-2026-overview-of-tax-legislation-and-rates-ootlar/budget-2026-overview-of-tax-legislation-and-rates-ootlar'
/** OOTLAR Annex A: rates and allowances, 2026/27 against 2027/28. */
export const BUDGET_2026_ANNEX_A_URL =
  'https://www.gov.uk/government/publications/budget-2026-overview-of-tax-legislation-and-rates-ootlar/annex-a-rates-and-allowances'
/** HMRC tax information note: Pension Tax Allowance. */
export const PENSION_TAX_ALLOWANCE_URL =
  'https://www.gov.uk/government/publications/income-tax-reduction-for-eligible-pensioners/reduction-in-income-tax-for-eligible-pensioners'

export const STATUS_LINE = `Updated ${PAGE_UPDATED}. Budget 2026 was delivered on ${BUDGET_2026_DATE_SHORT}. Most of its tax measures are announced and still need Finance Bill 2026-27 to become law.`

// ---------------------------------------------------------------------------
// 2026/27 constants, identical to the site's calculators
// (IncomeTaxCalculator, NationalInsuranceCalculator, DividendTaxCalculator,
//  PayPerMileCalculator, ISACalculator, MakingTaxDigitalCalculator,
//  InheritanceTaxPensionCalculator, TakeHomePayCalculator).
// Thresholds are frozen, so the same bands apply in 2027/28 (Annex A).
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

/** Overall ISA allowance and cash ISA limit: both £20,000 for all savers (OOTLAR 2.5). */
export const ISA_ALLOWANCE = 20_000
export const CASH_ISA_LIMIT = 20_000
export const PERSONAL_SAVINGS_ALLOWANCE = { basic: 1_000, higher: 500, additional: 0 }
export const SAVINGS_STARTING_RATE_BAND = 5_000
export const SAVINGS_RATES_NOW = { basic: 0.2, higher: 0.4, additional: 0.45 }
/** OOTLAR 1.1 and Annex A: savings rates for 2027/28, UK-wide. */
export const SAVINGS_RATES_FROM_2027 = { basic: 0.24, higher: 0.44, additional: 0.49 }
/** 2026/27: property income is charged at the main rates (Annex A). */
export const PROPERTY_RATES_NOW = { basic: 0.2, higher: 0.4, additional: 0.45 }
/** OOTLAR 1.2 and Annex A: property rates for 2027/28, England, Wales and Northern Ireland. */
export const PROPERTY_RATES_FROM_2027 = { basic: 0.24, higher: 0.44, additional: 0.49 }

/** Fuel duty on petrol and diesel, pence per litre (Annex A). */
export const FUEL_DUTY_PENCE = 52.95 // to 30 June 2027
export const FUEL_DUTY_PENCE_JUL_2027 = 60.59 // from 1 July 2027
/** Rises planned before the Budget and cancelled by it; kept only to show what the extension saves. */
export const FUEL_DUTY_PENCE_CANCELLED_JAN_2027 = 55.95
export const FUEL_DUTY_PENCE_CANCELLED_MAR_2027 = 57.95
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
export type ScheduleStatus = 'legislated' | 'announced'

export const STATUS_LABELS: Record<ScheduleStatus, string> = {
  legislated: 'In law',
  announced: 'Announced, not yet in law',
}

export interface ScheduleItem {
  id: string
  label: string
  status: ScheduleStatus
  /** When it takes effect, as printed on the source. */
  effective: string
  /** Position in 2026/27. */
  from: string
  /** Position after the effective date. */
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
const FA2026 = 'https://www.legislation.gov.uk/ukpga/2026/11'

const BUDGET_DOC = { sourceUrl: BUDGET_2026_SOURCE_URL, sourceName: 'HM Treasury, Budget 2026', sourceDate: '28 October 2026' }
const OOTLAR = { sourceUrl: BUDGET_2026_OOTLAR_URL, sourceName: 'Budget 2026 overview of tax legislation and rates', sourceDate: '28 October 2026' }
const ANNEX_A = { sourceUrl: BUDGET_2026_ANNEX_A_URL, sourceName: 'Budget 2026 rates and allowances (Annex A)', sourceDate: '28 October 2026' }

export const APRIL_2027_SCHEDULE: ScheduleItem[] = [
  // Announced at Budget 2026
  {
    id: 'savings-rates',
    label: 'Tax on savings interest held outside an ISA',
    status: 'announced',
    effective: '6 April 2027',
    from: '20% / 40% / 45%',
    to: '24% / 44% / 49%',
    detail:
      'Budget 2026 set the savings rates at 24%, 44% and 49% across the UK, replacing the 22%, 42% and 47% in Finance Act 2026; the Personal Savings Allowance of £1,000, £500 or nil and the £5,000 starting rate limit are unchanged.',
    ...OOTLAR,
  },
  {
    id: 'property-rates',
    label: 'Tax on rental (property) income',
    status: 'announced',
    effective: '6 April 2027',
    from: '20% / 40% / 45%',
    to: '24% / 44% / 49%',
    detail:
      'Budget 2026 set the property rates at 24%, 44% and 49% for England, Wales and Northern Ireland, replacing the 22%, 42% and 47% in Finance Act 2026; the devolved governments of Scotland and Wales can set property income rates under their income tax powers.',
    ...OOTLAR,
  },
  {
    id: 'cash-isa',
    label: 'Cash ISA limit',
    status: 'announced',
    effective: 'From 6 April 2027',
    from: '£20,000',
    to: '£20,000 for all savers',
    detail:
      'The Budget cancelled the £12,000 cap planned for under-65s from 6 April 2027, which SI 2026/1018 had enacted, and the government said it will keep the limit at £20,000 for all savers over 18; the overall ISA allowance also stays at £20,000.',
    ...OOTLAR,
  },
  {
    id: 'fuel-duty',
    label: 'Fuel duty on petrol and diesel',
    status: 'announced',
    effective: 'Freeze to 1 July 2027; new rate from that date',
    from: '52.95p a litre',
    to: '52.95p to 1 July 2027, then 60.59p a litre',
    detail:
      'The planned rises to 55.95p on 1 January 2027 and 57.95p on 1 March 2027 were cancelled and the 5p cut extended; from 1 July 2027 the rate returns to its pre-March 2022 level uprated by RPI, a rise of 7.64p, or 9.17p a litre at the pump with 20% VAT if passed on in full.',
    ...ANNEX_A,
  },
  {
    id: 'nlw',
    label: 'National Living Wage (21 and over)',
    status: 'announced',
    effective: '1 April 2027',
    from: '£12.71 an hour',
    to: '£13.21 an hour',
    detail:
      'The government accepted the Low Pay Commission recommendations in full, with every rate up 3.9%: £13.21 for 21 and over, £11.27 for 18 to 20, £8.31 for 16 to 17 and eligible apprentices, and an accommodation offset of £11.53 a day.',
    ...BUDGET_DOC,
  },
  {
    id: 'state-pension',
    label: 'State Pension uprating (triple lock)',
    status: 'announced',
    effective: 'April 2027',
    from: '£241.30 a week (full new State Pension)',
    to: '£250.70 a week (+3.9%)',
    detail:
      'The full annual value of the new State Pension rises to £13,036.40 from the tax year beginning 6 April 2027, which is £250.70 a week and 3.9% more than now.',
    sourceUrl: 'https://www.gov.uk/government/publications/pension-tax-allowance-explainer/pension-tax-allowance-explainer',
    sourceName: 'HM Treasury, Pension Tax Allowance explainer',
    sourceDate: '28 October 2026',
  },
  {
    id: 'triple-lock-2030',
    label: 'Adjusted Triple Lock',
    status: 'announced',
    effective: 'April 2030',
    from: 'Highest of earnings growth, inflation or 2.5%',
    to: 'Highest of 2.5%, inflation or the rise needed to hold the April 2029 value relative to earnings',
    detail:
      'The current Triple Lock continues each year through to April 2029; the Budget says the adjustment from April 2030 means the State Pension will track earnings over time.',
    ...BUDGET_DOC,
  },
  {
    id: 'pension-tax-allowance',
    label: 'Pension Tax Allowance',
    status: 'announced',
    effective: '6 April 2027 to 5 April 2030',
    from: 'No allowance',
    to: 'No income tax in effect on total income up to £13,037 above State Pension age',
    detail:
      'A tax reduction worth up to £94 in 2027/28 for people above State Pension age or reaching it in the tax year, withdrawn at £1 for every £3 of income above the full new State Pension and gone at £13,319. Someone on exactly £13,036.40 has £93.28 of tax removed.',
    sourceUrl: PENSION_TAX_ALLOWANCE_URL,
    sourceName: 'HMRC tax information note',
    sourceDate: '28 October 2026',
  },
  {
    id: 'child-benefit',
    label: 'Child Benefit',
    status: 'announced',
    effective: '2027/28',
    from: '£27.05 eldest, £17.90 other children (a week)',
    to: '£28.00 eldest, £18.55 other children (a week)',
    detail:
      'Annex A prints the 2027/28 rates for Child Benefit and for Guardian\'s Allowance (£23.75 a week); other benefit rates for 2027/28 are not in the Budget tax documents.',
    ...ANNEX_A,
  },
  {
    id: 'electricity-vat',
    label: 'VAT on domestic electricity (Great Britain)',
    status: 'announced',
    effective: 'Extended to 1 July 2027',
    from: '0% to 31 March 2027',
    to: '0% to 1 July 2027',
    detail:
      'The 0% rate that began on 1 October 2026 runs for three more months and is expected to take around £50 off the annual Ofgem price cap in April 2027; gas stays at 5%, and the Northern Ireland Executive gets funding for comparable support.',
    ...BUDGET_DOC,
  },
  {
    id: 'household-energy-payment',
    label: 'Household Energy Payment',
    status: 'announced',
    effective: 'From January 2027',
    from: 'None',
    to: '£100 for council tax bands A to D in England',
    detail:
      'A £100 payment made through the council tax system to up to 20 million households in England; the devolved governments receive their share through the Barnett formula.',
    ...BUDGET_DOC,
  },
  {
    id: 'amap',
    label: 'Approved Mileage Allowance Payments (cars and vans)',
    status: 'announced',
    effective: '6 April 2027',
    from: '55p first 10,000 miles, then 25p',
    to: '55p first 10,000 miles, then 35p',
    detail:
      'The 55p rate that started on 6 April 2026 was made permanent and the rate above 10,000 business miles rises to 35p; the change will be made by statutory instrument and covers the self-employed simplified mileage rates too.',
    ...OOTLAR,
  },
  {
    id: 'ved',
    label: 'Vehicle Excise Duty standard rate',
    status: 'announced',
    effective: '1 April 2027',
    from: '£200 a year',
    to: '£210 a year',
    detail:
      'VED rates for cars, vans and motorcycles rise with RPI, and the first-year rates for new cars rise too; the £440 expensive car supplement stays the same.',
    ...ANNEX_A,
  },
  {
    id: 'trading-allowance',
    label: 'Trading Allowance',
    status: 'announced',
    effective: '6 April 2027',
    from: '£1,000',
    to: '£3,000',
    detail:
      'Up to £3,000 of trading and miscellaneous income becomes tax-free, and the Self Assessment trading income reporting threshold rises to £3,000 too; the property allowance did not change.',
    ...OOTLAR,
  },
  {
    id: 'badr',
    label: 'Business Asset Disposal Relief lifetime limit',
    status: 'announced',
    effective: 'Disposals on or after 6 April 2027',
    from: '£1,000,000',
    to: '£500,000',
    detail:
      'The relief still charges Capital Gains Tax at 18% on qualifying gains, but on half the lifetime amount; main Capital Gains Tax rates of 18% and 24% and the £3,000 exempt amount are unchanged.',
    ...OOTLAR,
  },
  {
    id: 'capital-allowances',
    label: 'Capital allowances (main rate)',
    status: 'announced',
    effective: 'First-year allowance 1 January 2027; writing-down allowance 1 April 2027 (Corporation Tax), 6 April 2027 (Income Tax)',
    from: 'Writing-down allowance 14%, first-year allowance 40%',
    to: 'Writing-down allowance 12%, first-year allowance 50%',
    detail:
      'The main pool writing-down allowance falls by two points while the main rate first-year allowance rises for expenditure incurred on or after 1 January 2027.',
    ...OOTLAR,
  },
  // Already in law or announced earlier; Budget 2026 left these as they were.
  {
    id: 'personal-allowance',
    label: 'Income tax Personal Allowance',
    status: 'legislated',
    effective: 'Held to 5 April 2031',
    from: '£12,570',
    to: '£12,570',
    detail:
      'Finance Act 2026 section 10 keeps the allowance at £12,570 and the basic-rate band at £37,700 for every tax year up to 2030/31, so neither rises with inflation, and Budget 2026 did not change that.',
    sourceUrl: TIIN_THRESHOLDS_2031,
    sourceName: 'HMRC tax information note',
    sourceDate: '26 November 2025',
  },
  {
    id: 'higher-rate-threshold',
    label: 'Higher-rate (40%) threshold',
    status: 'legislated',
    effective: 'Held to 5 April 2031',
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
    effective: 'Held to 5 April 2031',
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
    effective: 'No change',
    from: '15% above £5,000',
    to: '15% above £5,000',
    detail:
      'The 15% rate and the £5,000 Secondary Threshold introduced in April 2025 continue; Budget 2026 did not change them.',
    sourceUrl: RATES_AND_THRESHOLDS_2026_27,
    sourceName: 'HMRC rates and thresholds for employers',
    sourceDate: '1 September 2026',
  },
  {
    id: 'dividend-rates',
    label: 'Dividend tax rates',
    status: 'legislated',
    effective: 'No change',
    from: '10.75% / 35.75% / 39.35%',
    to: '10.75% / 35.75% / 39.35%',
    detail:
      'Annex A shows the same dividend rates for 2027/28 as for 2026/27, with the £500 dividend allowance unchanged; the ordinary and upper rates last rose on 6 April 2026 under Finance Act 2026 section 4.',
    ...ANNEX_A,
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
      'The thresholds did not change, with the £20,000 tier following on 6 April 2028; Budget 2026 added that April 2027 joiners get no penalty points for late submission of their first four quarterly updates in 2027/28, and deferred the rollout for several taxpayer groups until further notice.',
    ...BUDGET_DOC,
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
]

/** Schedule items shown as a plain list below the personal figures in the calculator. */
export const OTHER_MEASURE_IDS = [
  'nlw',
  'state-pension',
  'triple-lock-2030',
  'pension-tax-allowance',
  'child-benefit',
  'electricity-vat',
  'household-energy-payment',
  'amap',
  'ved',
  'trading-allowance',
  'badr',
  'capital-allowances',
]

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** HTML table for the calculator page (rateTable) and anywhere else the schedule is shown. */
export function scheduleTableHtml(): string {
  const rows = APRIL_2027_SCHEDULE.map((i) => {
    const source = i.sourceUrl
      ? `<a href="${i.sourceUrl}" rel="noopener" target="_blank">${esc(i.sourceName ?? 'Source')}</a>${i.sourceDate ? `, ${esc(i.sourceDate)}` : ''}`
      : ''
    return `<tr><td>${esc(i.label)}</td><td>${esc(STATUS_LABELS[i.status])}</td><td>${esc(i.effective)}</td><td>${esc(i.from)}</td><td><strong>${esc(i.to)}</strong></td><td>${source}</td></tr>`
  }).join('')
  return `<table><thead><tr><th>Measure</th><th>Status</th><th>Takes effect</th><th>2026/27</th><th>From the date shown</th><th>Source</th></tr></thead><tbody>${rows}</tbody></table>`
}
