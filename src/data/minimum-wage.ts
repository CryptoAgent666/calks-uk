/**
 * National Minimum Wage and National Living Wage figures shared by the minimum wage
 * calculators and their page prose, so the components and the text can never disagree.
 * When the government confirms the April 2027 rates (expected at the Budget on
 * 28 October 2026), update this file and nowhere else.
 *
 * Current rates: gov.uk/national-minimum-wage-rates (rates from 1 April 2026).
 * Accommodation offset: gov.uk/national-minimum-wage-accommodation (from April 2026).
 * April 2027 projection: Low Pay Commission consultation letter, 1 April 2026, which
 * gives an indicative range for the NLW at two-thirds of median earnings in April 2027.
 * Budget date: Chancellor's letter to the Treasury Select Committee, 31 July 2026.
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

/**
 * Low Pay Commission indicative figures for the NLW in April 2027, from its consultation
 * letter of 1 April 2026: "a rate between £13.02 and £13.34 ... would be required in
 * April 2027, with a central estimate of £13.18 (3.7 per cent)". Indicative only: the
 * LPC recommends by the end of October 2026 and the government decides.
 */
export const LPC_APRIL_2027 = {
  central: 13.18,
  low: 13.02,
  high: 13.34,
  published: '1 April 2026',
  recommendationDue: 'the end of October 2026',
  sourceUrl: 'https://www.gov.uk/government/consultations/low-pay-commission-consultation-2026/lpc-consultation-letter-2026',
  remitUrl:
    'https://www.gov.uk/government/publications/national-minimum-wage-and-national-living-wage-low-pay-commission-remit-2026/low-pay-commission-remit-2026-national-living-wage-and-national-minimum-wage',
}

export const NMW_2027_EFFECTIVE_FROM = '1 April 2027'

export const BUDGET_2026 = {
  date: '28 October 2026',
  sourceUrl: 'https://www.gov.uk/government/publications/chancellor-letter-to-the-treasury-select-committee-tsc-budget-2026-date',
}

/** Percentage rise from the current NLW to a projected rate, one decimal place (13.18 gives 3.7). */
export const nlwRisePct = (projected: number) => Math.round(((projected / NMW_RATES['21plus'].rate) - 1) * 1000) / 10

const money = (v: number) => `£${v.toFixed(2)}`
const annual = (rate: number, hours: number) => `£${Math.round(rate * hours * 52).toLocaleString('en-GB')}`

/** Current rates against the LPC range for April 2027, as an HTML table for the page's rate table. */
export function nmw2027TableHtml(hours = 37.5) {
  const nlw = NMW_RATES['21plus'].rate
  const scenarios: [string, number][] = [
    ['LPC low estimate', LPC_APRIL_2027.low],
    ['LPC central estimate', LPC_APRIL_2027.central],
    ['LPC high estimate', LPC_APRIL_2027.high],
  ]
  const rows = [
    `<tr><td>Current National Living Wage (21+), from ${NMW_EFFECTIVE_FROM}</td><td><strong>${money(nlw)}</strong></td><td>confirmed</td><td>${annual(nlw, hours)}</td></tr>`,
    ...scenarios.map(([label, rate]) =>
      `<tr><td>${label} for ${NMW_2027_EFFECTIVE_FROM}</td><td>${money(rate)}</td><td>+${nlwRisePct(rate).toFixed(1)}%</td><td>${annual(rate, hours)}</td></tr>`),
  ].join('')
  return `<table><thead><tr><th>Rate</th><th>Hourly</th><th>Change</th><th>Annual at ${hours} hours a week</th></tr></thead><tbody>${rows}</tbody></table>`
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
