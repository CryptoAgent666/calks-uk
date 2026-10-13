/**
 * Premium Bonds figures shared by the calculator and the page's odds table, so the
 * two can never disagree. When NS&I announces a new prize fund rate or odds, update
 * PRIZE_RATE, ODDS, PRIZES and AS_OF here and nowhere else.
 */

// Prize fund rate 4.35% and odds 21,000 to 1 from the September 2026 draw
// (NS&I PR260818, 18 Aug 2026 — up from 3.80% / 22,000 in July 2026).
export const PRIZE_RATE = 0.0435
export const ODDS = 21_000
export const MIN_HOLDING = 25
export const MAX_HOLDING = 50_000
export const AS_OF = 'September 2026 draw'

// Number of prizes of each value in the September 2026 draw
// (nsandi.com, "How we share out Premium Bonds prizes").
export const PRIZES = [
  { amount: 1_000_000, count: 2, label: '£1,000,000' },
  { amount: 100_000, count: 95, label: '£100,000' },
  { amount: 50_000, count: 192, label: '£50,000' },
  { amount: 25_000, count: 381, label: '£25,000' },
  { amount: 10_000, count: 954, label: '£10,000' },
  { amount: 5_000, count: 1_909, label: '£5,000' },
  { amount: 1_000, count: 19_882, label: '£1,000' },
  { amount: 500, count: 59_646, label: '£500' },
  { amount: 100, count: 2_365_010, label: '£100' },
  { amount: 50, count: 2_365_010, label: '£50' },
  { amount: 25, count: 1_716_787, label: '£25' },
]
export const TOTAL_PRIZES = PRIZES.reduce((sum, p) => sum + p.count, 0)
// Every eligible bond has a 1 in ODDS chance each month, so the number of
// eligible bonds is the number of prizes times the odds (about 137 billion)
export const ELIGIBLE_BONDS = TOTAL_PRIZES * ODDS
export const JACKPOTS = PRIZES.find((p) => p.amount === 1_000_000)!.count
// Odds of one £1 bond winning £1 million in a single draw (about 1 in 68.6 billion)
export const JACKPOT_ODDS_PER_BOND = ELIGIBLE_BONDS / JACKPOTS

// Share of all prizes, in %, for a given prize value
export const prizeShare = (amount: number) => ((PRIZES.find((p) => p.amount === amount)?.count || 0) / TOTAL_PRIZES) * 100

/**
 * Median winnings over a year: the amount half of holders of this size beat and
 * half fall short of. Annual winnings are a sum of independent Poisson counts of
 * each prize value (a compound Poisson distribution), so the distribution of the
 * small prizes is exact by Panjer's recursion in £25 steps. Prizes of £5,000 and
 * above are far rarer and always larger than the median at these holdings, so
 * they enter only as the chance that none of them is won.
 */
function medianAnnualWinnings(holding: number) {
  const lambda = (12 * holding) / ODDS // expected prizes a year
  const UNIT = 25
  const small = PRIZES.filter((p) => p.amount < 5_000)
  const bigShare = PRIZES.filter((p) => p.amount >= 5_000).reduce((s, p) => s + p.count, 0) / TOTAL_PRIZES
  const lambdaSmall = lambda * (1 - bigShare)
  const pNoBig = Math.exp(-lambda * bigShare)
  const smallTotal = small.reduce((s, p) => s + p.count, 0)
  const jumps = small.map((p) => ({ size: p.amount / UNIT, q: p.count / smallTotal }))
  const maxUnits = 5_000 / UNIT
  const f: number[] = [Math.exp(-lambdaSmall)]
  let cdf = pNoBig * f[0]
  if (cdf >= 0.5) return 0
  for (let n = 1; n < maxUnits; n++) {
    let acc = 0
    for (const { size, q } of jumps) if (size <= n) acc += size * q * f[n - size]
    f[n] = (lambdaSmall / n) * acc
    cdf += pNoBig * f[n]
    if (cdf >= 0.5) return n * UNIT
  }
  return NaN // median above £5,000: not reached for holdings up to £50,000
}

export function premiumBondOdds(holding: number) {
  const perBondMonth = 1 / ODDS
  const expectedPrizesPerMonth = holding * perBondMonth
  const chanceMonth = 1 - Math.pow(1 - perBondMonth, holding)
  const chanceYear = 1 - Math.pow(1 - chanceMonth, 12)
  const jackpotMonth = 1 - Math.pow(1 - JACKPOTS / ELIGIBLE_BONDS, holding)
  const jackpotYear = 1 - Math.pow(1 - jackpotMonth, 12)
  const expectedAnnual = holding * PRIZE_RATE
  const medianAnnual = medianAnnualWinnings(holding)
  return {
    expectedPrizesPerMonth,
    expectedPrizesPerYear: expectedPrizesPerMonth * 12,
    chanceMonth,
    chanceYear,
    expectedAnnual,
    medianAnnual,
    medianRate: holding > 0 ? medianAnnual / holding : 0,
    jackpotMonthOneIn: jackpotMonth > 0 ? 1 / jackpotMonth : Infinity,
    jackpotYearOneIn: jackpotYear > 0 ? 1 / jackpotYear : Infinity,
  }
}

export const ODDS_TABLE_HOLDINGS = [1_000, 5_000, 10_000, 15_000, 20_000, 25_000, 30_000, 35_000, 40_000, 45_000, 50_000]

// Round to pence first so that 5,000 x 4.35% (217.4999... in floating point) shows as £218, not £217
const gbp = (n: number) => '£' + Math.round(Math.round(n * 100) / 100).toLocaleString('en-GB')
// One decimal below 10% and between 99.5% and 99.95%, so 99.67% reads 99.7% rather than 100%
const pct = (x: number) => (x >= 0.9995 ? '99.9%+' : (x * 100).toFixed(x < 0.1 || x >= 0.995 ? 1 : 0) + '%')
const oneIn = (n: number) => '1 in ' + (n >= 1e6 ? (n / 1e6).toFixed(1) + ' million' : Math.round(n / 1000).toLocaleString('en-GB') + ',000')

/** Static HTML for the page's rate table (server-rendered, so search engines see it). */
export function premiumBondOddsTableHtml() {
  const rows = ODDS_TABLE_HOLDINGS.map((h) => {
    const o = premiumBondOdds(h)
    return `<tr id="odds-row-${h}"><td><strong>${gbp(h)}</strong></td><td>${o.expectedPrizesPerMonth.toFixed(2)}</td><td>${pct(o.chanceMonth)}</td><td>${pct(o.chanceYear)}</td><td>${gbp(o.expectedAnnual)}</td><td>${gbp(o.medianAnnual)}</td><td>${oneIn(o.jackpotYearOneIn)}</td></tr>`
  }).join('')
  return `<table><thead><tr><th>Holding</th><th>Prizes a month (average)</th><th>Chance of a prize each month</th><th>Chance of a prize in a year</th><th>Average winnings a year</th><th>Typical (median) winnings a year</th><th>Chance of the £1m jackpot in a year</th></tr></thead><tbody>${rows}</tbody></table><p class="text-xs text-muted-foreground mt-2">At the ${(PRIZE_RATE * 100).toFixed(2)}% prize fund rate and odds of ${ODDS.toLocaleString('en-GB')} to 1 per £1 bond per month (${AS_OF}). Bonds must be held for a full calendar month before they enter a draw. The typical figure is the median: half of holders of that size win more in a year and half win less, because the average includes rare large prizes.</p>`
}

/** Holdings that get their own anchored section on the page: the amounts people search for. */
export const SECTION_HOLDINGS = [1_000, 5_000, 10_000, 20_000, 25_000, 50_000]

// "1 in N" to three significant figures: 1 in 4,570, 1 in 114,000, 1 in 1.37 million, 1 in 68.6 billion
const oneInSig = (n: number) => {
  if (n >= 1e9) return `1 in ${+(n / 1e9).toPrecision(3)} billion`
  if (n >= 1e6) return `1 in ${+(n / 1e6).toPrecision(3)} million`
  return `1 in ${Number(n.toPrecision(3)).toLocaleString('en-GB')}`
}

// How often prizes arrive, phrased for the holding: 2.4 a month on £50,000, one every 21 months on £1,000
function prizeFrequency(perMonth: number) {
  if (perMonth >= 1) return `about ${perMonth.toFixed(1)} prizes a month, or roughly ${Math.round(perMonth * 12)} a year`
  const months = Math.round(1 / perMonth)
  if (months <= 1) return `about ${perMonth.toFixed(2)} prizes a month, which is roughly one prize a month, or ${Math.round(perMonth * 12)} a year`
  return `about ${perMonth.toFixed(2)} prizes a month, which is one prize roughly every ${months} months, or about ${(perMonth * 12).toFixed(1)} a year`
}

export interface PremiumBondSection { id: string; title: string; html: string }

/** One anchored section per holding, generated from premiumBondOdds() so the prose can never disagree with the calculator or the table. */
function holdingSection(h: number): PremiumBondSection {
  const o = premiumBondOdds(h)
  const rate = (PRIZE_RATE * 100).toFixed(2)
  const typical = o.medianAnnual > 0
    ? `but the median holder of ${gbp(h)} wins about ${gbp(o.medianAnnual)} (${(o.medianRate * 100).toFixed(1)}%), because a few very large prizes lift the average above what most people see`
    : `but the median outcome is nothing at all: ${Math.round((1 - o.chanceYear) * 100)}% of ${gbp(h)} holders win no prize in a full year, and the average is lifted by the few who land a larger prize`
  return {
    id: `odds-${h}`,
    title: `Odds of winning Premium Bonds with ${gbp(h)}`,
    html: `<p>With ${gbp(h)} in Premium Bonds you hold ${h.toLocaleString('en-GB')} entries in every monthly draw, so you can expect ${prizeFrequency(o.expectedPrizesPerMonth)}, with a ${pct(o.chanceMonth)} chance of at least one prize in any given month and a ${pct(o.chanceYear)} chance of at least one prize across a year. Average winnings are ${gbp(o.expectedAnnual)} a year at the ${rate}% prize fund rate, ${typical}. The £1 million jackpot is a ${oneInSig(o.jackpotMonthOneIn)} chance each month at this holding, or about ${oneInSig(o.jackpotYearOneIn)} over a year.</p>`,
  }
}

function jackpotSection(): PremiumBondSection {
  const max = premiumBondOdds(MAX_HOLDING)
  const draws = 300 // 25 years of monthly draws at the maximum holding
  const lifetime = 1 / (1 - Math.pow(1 - 1 / max.jackpotMonthOneIn, draws))
  const rows = SECTION_HOLDINGS.map((h) => {
    const o = premiumBondOdds(h)
    return `<tr><td><strong>${gbp(h)}</strong></td><td>${oneInSig(o.jackpotMonthOneIn)}</td><td>${oneInSig(o.jackpotYearOneIn)}</td></tr>`
  }).join('')
  return {
    id: 'odds-1-million',
    title: 'Odds of winning £1 million on Premium Bonds',
    html: `<p>Every £1 bond has the same ${oneInSig(JACKPOT_ODDS_PER_BOND)} chance of winning £1 million in a monthly draw, because NS&amp;I pays ${JACKPOTS === 2 ? 'two' : JACKPOTS} jackpots a month and about ${(ELIGIBLE_BONDS / 1e9).toFixed(1)} billion bonds are eligible (${AS_OF}). Holding more bonds multiplies that chance, so the maximum ${gbp(MAX_HOLDING)} gives ${oneInSig(max.jackpotMonthOneIn)} each month and about ${oneInSig(max.jackpotYearOneIn)} over a year. Even ${draws} draws at the maximum, which is 25 years, leave the odds of ever winning the jackpot at about ${oneInSig(lifetime)}, so the top prize is a reason to check your numbers rather than a reason to buy.</p><table><thead><tr><th>Holding</th><th>Chance of £1 million each month</th><th>Chance of £1 million in a year</th></tr></thead><tbody>${rows}</tbody></table>`,
  }
}

/** Anchored sections for the page: one per holding in SECTION_HOLDINGS, then the £1 million jackpot. */
export function premiumBondOddsSections(): PremiumBondSection[] {
  return [...SECTION_HOLDINGS.map(holdingSection), jackpotSection()]
}
