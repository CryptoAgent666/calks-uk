/**
 * Car insurance premium model shared by the Car Insurance Estimate Calculator and the
 * page's "premium by insurance group" table, so the two can never disagree. Every
 * calibration constant lives here; change it here and nowhere else.
 *
 * Model: BASE_PREMIUM[age] x COVER_FACTOR[cover] x (1 + (group - BASE_GROUP) x GROUP_STEP)
 *        x mileageFactor(miles) x (1 - NCB_DISCOUNT[years])
 */

export type CoverType = 'comprehensive' | 'tpft' | 'tpo'
export type AgeGroup = '17-20' | '21-29' | '30-39' | '40-49' | '50-59' | '60-69' | '70+'

// Market anchors the model is calibrated to
// ABI Motor Insurance Premium Tracker: average comprehensive price paid, Q2 2026 (£560 in Q1 2026)
export const ABI_AVERAGE_PAID = 566
export const ABI_AVERAGE_PAID_PERIOD = 'Q2 2026'
// Confused.com Car Insurance Price Index: average quote for a new policy, Q3 2026
export const CONFUSED_AVERAGE_QUOTE = 713

// Annual comprehensive premium before no-claims discount, for a group 15 car
// doing 6,000-10,000 miles, including 12% Insurance Premium Tax.
// Calibrated so that each age band, at a typical no-claims record for that age,
// lands near Confused.com's Q3 2026 average quote by age scaled to price paid
// (x0.79 = ABI Q2 2026 average paid £566 / Confused Q3 2026 average quote £713),
// and the default profile (30-39, 5 years NCB) matches the ABI average.
export const BASE_PREMIUM: Record<AgeGroup, number> = {
  '17-20': 1500, '21-29': 1450, '30-39': 1400, '40-49': 1350, '50-59': 1075, '60-69': 900, '70+': 950,
}

// For the same driver, cover levels price closely. Third party only is often
// dearer than comprehensive because riskier drivers choose it (Uswitch, Feb-Apr 2026).
export const COVER_FACTOR: Record<CoverType, number> = { comprehensive: 1.0, tpft: 0.95, tpo: 1.05 }

// No-claims discount by claim-free years, capped at 60% from year five.
export const NCB_DISCOUNT: Record<number, number> = { 0: 0, 1: 0.25, 2: 0.35, 3: 0.45, 4: 0.52, 5: 0.60 }
export const MAX_NCB_YEARS = 5

// Insurance group 1-50: each group above or below 15 moves the premium by 3%
export const BASE_GROUP = 15
export const GROUP_STEP = 0.03

export function mileageFactor(miles: number) {
  if (miles < 6000) return 0.92
  if (miles <= 10000) return 1.0
  if (miles <= 15000) return 1.08
  return 1.15
}

export function groupFactor(carGroup: number) {
  return 1 + (carGroup - BASE_GROUP) * GROUP_STEP
}

/** Pure premium estimate; the calculator and the page table both call this. */
export function estimatePremium(ageGroup: AgeGroup, cover: CoverType, ncbYears: number, carGroup: number, miles: number) {
  const base = BASE_PREMIUM[ageGroup] * COVER_FACTOR[cover]
  const milesFactor = mileageFactor(miles)
  const ncbDiscount = NCB_DISCOUNT[Math.min(Math.max(ncbYears, 0), MAX_NCB_YEARS)] || 0

  const grossPremium = base * groupFactor(carGroup) * milesFactor
  const discount = grossPremium * ncbDiscount
  const netPremium = grossPremium - discount
  const monthlyPremium = netPremium / 12

  return { grossPremium, discount, netPremium, monthlyPremium, ncbPct: ncbDiscount * 100 }
}

/** Profile behind the page's "premium by insurance group" table: the calculator's own defaults. */
export const GROUP_TABLE_PROFILE = { age: '30-39' as AgeGroup, cover: 'comprehensive' as CoverType, ncbYears: 5, miles: 8_000 }
// Groups 23 and 34 are included because people search for them by name
export const GROUP_TABLE_GROUPS = [1, 5, 10, 15, 20, 23, 25, 30, 34, 35, 40, 45, 50]

const gbp10 = (n: number) => '£' + (Math.round(n / 10) * 10).toLocaleString('en-GB')

/**
 * Static HTML for the page's rate table (server-rendered, so search engines see it).
 * Every figure comes from estimatePremium() for GROUP_TABLE_PROFILE, rounded to the nearest £10.
 */
export function carInsuranceGroupTableHtml() {
  const p = GROUP_TABLE_PROFILE
  const rows = GROUP_TABLE_GROUPS.map((g) => {
    const r = estimatePremium(p.age, p.cover, p.ncbYears, g, p.miles)
    const annual = Math.round(r.netPremium / 10) * 10
    return `<tr><td><strong>Group ${g}</strong></td><td>×${groupFactor(g).toFixed(2)}</td><td>${gbp10(r.grossPremium)}</td><td><strong>${gbp10(r.netPremium)}</strong></td><td>£${Math.round(annual / 12).toLocaleString('en-GB')}</td></tr>`
  }).join('')
  const ncbPct = Math.round(estimatePremium(p.age, p.cover, p.ncbYears, BASE_GROUP, p.miles).ncbPct)
  const topGroup = GROUP_TABLE_GROUPS[GROUP_TABLE_GROUPS.length - 1]
  return `<p class="text-sm text-muted-foreground mb-3">These are this calculator's own estimates, not quotes from any insurer, for one fixed profile: a driver aged ${p.age}, comprehensive cover, ${p.ncbYears} years of no-claims bonus (a ${ncbPct}% discount) and ${p.miles.toLocaleString('en-GB')} miles a year. Each group above or below ${BASE_GROUP} moves the premium by ${Math.round(GROUP_STEP * 100)}%, so a group ${topGroup} car costs about ${groupFactor(topGroup).toFixed(2)} times as much as a group ${BASE_GROUP} car on the same record.</p><table><thead><tr><th>Insurance group</th><th>Cost factor against group ${BASE_GROUP}</th><th>Before no-claims discount</th><th>Estimated annual premium</th><th>Monthly equivalent</th></tr></thead><tbody>${rows}</tbody></table><p class="text-xs text-muted-foreground mt-2">Rounded to the nearest £10. The group ${BASE_GROUP} row is the calculator's default and sits close to the ABI average price paid of £${ABI_AVERAGE_PAID} (${ABI_AVERAGE_PAID_PERIOD}). Your postcode, occupation, claims history and the exact car will move the real price either way, so change the group, age and no-claims years in the calculator above for your own profile.</p>`
}
