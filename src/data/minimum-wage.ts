/**
 * National Minimum Wage and National Living Wage figures shared by the minimum wage
 * calculators and their page prose, so the components and the text can never disagree.
 * Update this file and nowhere else when the rates change.
 *
 * Current rates: gov.uk/national-minimum-wage-rates (rates from 1 April 2026).
 * Accommodation offset: gov.uk/national-minimum-wage-accommodation (from April 2026).
 * Rates from 1 April 2027: Budget 2026 document, 28 October 2026 (the government accepted
 * the Low Pay Commission's recommendations in full).
 */

export type NmwBand = '21plus' | '18to20' | 'under18' | 'apprentice'

export const NMW_TAX_YEAR = '2026/27'
export const NMW_EFFECTIVE_FROM = '1 April 2026'
export const NMW_SOURCE_URL = 'https://www.gov.uk/national-minimum-wage-rates'

/** Rates from 1 April 2026 (the only legal minimums until 31 March 2027). */
export const NMW_RATES: Record<NmwBand, { rate: number; name: string }> = {
  '21plus': { rate: 12.71, name: 'National Living Wage (21+)' },
  '18to20': { rate: 10.85, name: 'Age 18-20' },
  'under18': { rate: 8.00, name: 'Under 18' },
  'apprentice': { rate: 8.00, name: 'Apprentice' },
}

/** Rates from 1 April 2025 to 31 March 2026, for the year-on-year context. */
export const NMW_PRIOR_RATES: Record<NmwBand, number> = {
  '21plus': 12.21,
  '18to20': 10.00,
  'under18': 7.55,
  'apprentice': 7.55,
}

/** Accommodation offset from 1 April 2026 (gov.uk/national-minimum-wage-accommodation). */
export const ACCOMMODATION_OFFSET = { daily: 11.10, weekly: 77.70 }

export const NMW_2027_EFFECTIVE_FROM = '1 April 2027'

/** Rates from 1 April 2027, confirmed at Budget 2026. The current rates stay the legal minimum until 31 March 2027. */
export const NMW_RATES_2027: Record<NmwBand, number> = {
  '21plus': 13.21,
  '18to20': 11.27,
  'under18': 8.31,
  'apprentice': 8.31,
}

/** Accommodation offset from 1 April 2027: £11.53 a day (Budget 2026); weekly is 7 x the daily rate. */
export const ACCOMMODATION_OFFSET_2027 = { daily: 11.53, weekly: 80.71 }

export const BUDGET_2026 = {
  date: '28 October 2026',
  sourceUrl: 'https://www.gov.uk/government/publications/budget-2026-document/budget-2026-html',
}

/** Percentage rise from the current rate to the April 2027 rate for a band, one decimal place. */
export const nmwRisePct = (band: NmwBand) => Math.round(((NMW_RATES_2027[band] / NMW_RATES[band].rate) - 1) * 1000) / 10

const money = (v: number) => `£${v.toFixed(2)}`
const annual = (rate: number, hours: number) => `£${Math.round(rate * hours * 52).toLocaleString('en-GB')}`
const round2 = (v: number) => Math.round((v + 1e-9) * 100) / 100
/** £ with commas and two decimals, for page prose. */
export const gbp2 = (v: number) => `£${round2(v).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/**
 * The worked figures quoted in the page prose: a 21+ worker on the National Living Wage for
 * 37.5 hours a week and 52 weeks. Tax and NI are 2026/27 values, frozen to April 2031, and at
 * this pay every extra pound is in the 20% tax and 8% NI bands.
 */
const FULL_TIME_HOURS = 37.5 * 52
const nowPay = NMW_RATES['21plus'].rate * FULL_TIME_HOURS
const nextPay = NMW_RATES_2027['21plus'] * FULL_TIME_HOURS
const takeHome = (pay: number) => pay - (pay - 12_570) * 0.2 - (pay - 12_570) * 0.08
const employerNi = (pay: number) => (pay - 5_000) * 0.15
export const NLW_FULL_TIME = {
  now: round2(nowPay),
  next: round2(nextPay),
  rise: round2(nextPay - nowPay),
  riseMonthly: round2((nextPay - nowPay) / 12),
  takeHomeNow: round2(takeHome(nowPay)),
  takeHomeNext: round2(takeHome(nextPay)),
  takeHomeRise: round2(takeHome(nextPay) - takeHome(nowPay)),
  takeHomeRiseMonthly: round2((takeHome(nextPay) - takeHome(nowPay)) / 12),
  employerNiRise: round2(employerNi(nextPay) - employerNi(nowPay)),
  employerCostNow: Math.round(nowPay + employerNi(nowPay)),
  employerCostNext: Math.round(nextPay + employerNi(nextPay)),
  employerCostRise: round2(nextPay + employerNi(nextPay) - nowPay - employerNi(nowPay)),
}

/** Current and April 2027 rates for each band and the accommodation offset, as an HTML table for the page's rate table. */
export function nmw2027TableHtml(hours = 37.5) {
  const rows = (Object.keys(NMW_RATES) as NmwBand[]).map((b) => {
    const r = NMW_RATES[b]
    return `<tr><td>${r.name}</td><td>${money(r.rate)}</td><td><strong>${money(NMW_RATES_2027[b])}</strong></td><td>+${nmwRisePct(b).toFixed(1)}%</td><td>${annual(r.rate, hours)}</td><td>${annual(NMW_RATES_2027[b], hours)}</td></tr>`
  })
  const offsetPct = Math.round(((ACCOMMODATION_OFFSET_2027.daily / ACCOMMODATION_OFFSET.daily) - 1) * 1000) / 10
  rows.push(`<tr><td>Accommodation offset (a day)</td><td>${money(ACCOMMODATION_OFFSET.daily)}</td><td><strong>${money(ACCOMMODATION_OFFSET_2027.daily)}</strong></td><td>+${offsetPct.toFixed(1)}%</td><td>n/a</td><td>n/a</td></tr>`)
  return `<table><thead><tr><th>Rate</th><th>Now</th><th>From ${NMW_2027_EFFECTIVE_FROM}</th><th>Rise</th><th>Annual now at ${hours} hours a week</th><th>Annual from April 2027</th></tr></thead><tbody>${rows.join('')}</tbody></table>`
}

/** All four current bands with the 2025/26 rate they replaced. */
export function nmwCurrentRatesTableHtml() {
  const rows = (Object.keys(NMW_RATES) as NmwBand[]).map((b) => {
    const r = NMW_RATES[b]
    const prior = NMW_PRIOR_RATES[b]
    const pct = Math.round(((r.rate / prior) - 1) * 1000) / 10
    return `<tr><td>${r.name}</td><td>${money(prior)}</td><td><strong>${money(r.rate)}</strong></td><td>+${pct.toFixed(1)}%</td></tr>`
  }).join('')
  return `<table><thead><tr><th>Age band</th><th>April 2025</th><th>April 2026</th><th>Rise</th></tr></thead><tbody>${rows}</tbody></table>`
}
