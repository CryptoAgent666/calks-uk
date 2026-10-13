/**
 * Attainment 8 averages by KS2 prior attainment group, the "Progress 8 estimates" that a
 * pupil's Attainment 8 is compared against, plus the DfE minimum (capped) pupil scores.
 *
 * Source: DfE, Secondary accountability measures: 2025 guidance, Annex A, Table 7
 * ("Attainment 8 averages and English, maths, EBacc and open averages for each KS2 prior
 * attainment group") and Table 6 ("Minimum scores in 2024"). Fetched 13 October 2026 from
 * https://www.gov.uk/government/publications/progress-8-school-performance-measure/secondary-accountability-measures-2025-guidance-for-maintained-secondary-schools-academies-and-free-schools
 *
 * Results year: summer 2024 (2023/24 cohort), the last year with a KS2 baseline. The same
 * figures (37.27 for a KS2 scaled score of 101, 57.61 for 110) are quoted in the guidance's
 * Annex B worked examples as "revised 2024 attainment averages", and the Table 6 narrative
 * quotes 15.96 (group 1) and 82.03 (group 34) for 2024. The heading above Table 7 on the
 * page reads "Provisional 2025", which cannot hold because the 2025 cohort had no KS2
 * results. No table exists for 2025 or 2026 results (Progress 8 was not calculated); the
 * next official one will be for summer 2027, published October 2027 and revised after.
 */
export const P8_ESTIMATES_RESULTS_YEAR = 2024
export const P8_GUIDANCE_URL = 'https://www.gov.uk/government/publications/progress-8-school-performance-measure/secondary-accountability-measures-2025-guidance-for-maintained-secondary-schools-academies-and-free-schools'

export interface PriorAttainmentGroup {
  group: number
  /** KS2 average scaled score range covered by the group (inclusive; averages fall in 0.5 steps) */
  low: number
  high: number
  /** national average Attainment 8 for pupils in this group (state-funded mainstream schools) */
  a8: number
  english: number
  maths: number
  ebacc: number
  open: number
  /** DfE minimum pupil Progress 8 score for 2024: extremely negative scores are raised to it before a school is averaged. null = no cap (groups 1 to 16) */
  minP8: number | null
}

export const PRIOR_ATTAINMENT_GROUPS: PriorAttainmentGroup[] = [
  { group: 1, low: 59, high: 82, a8: 15.96, english: 3.86, maths: 2.39, ebacc: 4.37, open: 5.35, minP8: null },
  { group: 2, low: 82.5, high: 86, a8: 16.64, english: 4.18, maths: 2.5, ebacc: 4.37, open: 5.59, minP8: null },
  { group: 3, low: 86.5, high: 87.5, a8: 19.02, english: 4.76, maths: 3.07, ebacc: 5.0, open: 6.19, minP8: null },
  { group: 4, low: 88, high: 89, a8: 20.79, english: 5.15, maths: 3.45, ebacc: 5.49, open: 6.71, minP8: null },
  { group: 5, low: 89.5, high: 90.5, a8: 22.01, english: 5.37, maths: 3.75, ebacc: 5.86, open: 7.03, minP8: null },
  { group: 6, low: 91, high: 92, a8: 23.71, english: 5.74, maths: 4.16, ebacc: 6.34, open: 7.48, minP8: null },
  { group: 7, low: 92.5, high: 93, a8: 25.02, english: 6.02, maths: 4.48, ebacc: 6.67, open: 7.84, minP8: null },
  { group: 8, low: 93.5, high: 94, a8: 26.43, english: 6.34, maths: 4.82, ebacc: 7.06, open: 8.22, minP8: null },
  { group: 9, low: 94.5, high: 95, a8: 27.65, english: 6.55, maths: 5.13, ebacc: 7.44, open: 8.53, minP8: null },
  { group: 10, low: 95.5, high: 96, a8: 29.13, english: 6.82, maths: 5.51, ebacc: 7.92, open: 8.89, minP8: null },
  { group: 11, low: 96.5, high: 97, a8: 30.24, english: 7.03, maths: 5.78, ebacc: 8.2, open: 9.23, minP8: null },
  { group: 12, low: 97.5, high: 98, a8: 32.3, english: 7.46, maths: 6.24, ebacc: 8.82, open: 9.78, minP8: null },
  { group: 13, low: 98.5, high: 99, a8: 33.78, english: 7.73, maths: 6.56, ebacc: 9.29, open: 10.19, minP8: null },
  { group: 14, low: 99.5, high: 100, a8: 35.47, english: 8.06, maths: 6.95, ebacc: 9.81, open: 10.65, minP8: null },
  { group: 15, low: 100.5, high: 101, a8: 37.27, english: 8.39, maths: 7.32, ebacc: 10.39, open: 11.18, minP8: null },
  { group: 16, low: 101.5, high: 102, a8: 38.94, english: 8.72, maths: 7.68, ebacc: 10.9, open: 11.65, minP8: null },
  { group: 17, low: 102.5, high: 103, a8: 41.03, english: 9.1, maths: 8.13, ebacc: 11.59, open: 12.2, minP8: -4.087 },
  { group: 18, low: 103.5, high: 104, a8: 42.98, english: 9.47, maths: 8.52, ebacc: 12.23, open: 12.75, minP8: -4.161 },
  { group: 19, low: 104.5, high: 105, a8: 45.13, english: 9.85, maths: 8.98, ebacc: 12.95, open: 13.35, minP8: -4.174 },
  { group: 20, low: 105.5, high: 106, a8: 47.46, english: 10.28, maths: 9.45, ebacc: 13.74, open: 13.99, minP8: -4.242 },
  { group: 21, low: 106.5, high: 107, a8: 49.77, english: 10.7, maths: 9.93, ebacc: 14.51, open: 14.63, minP8: -4.262 },
  { group: 22, low: 107.5, high: 108, a8: 52.57, english: 11.17, maths: 10.53, ebacc: 15.48, open: 15.39, minP8: -4.268 },
  { group: 23, low: 108.5, high: 109, a8: 55.3, english: 11.66, maths: 11.09, ebacc: 16.38, open: 16.18, minP8: -4.229 },
  { group: 24, low: 109.5, high: 110, a8: 57.61, english: 12.06, maths: 11.57, ebacc: 17.16, open: 16.82, minP8: -4.253 },
  { group: 25, low: 110.5, high: 111, a8: 60.22, english: 12.5, maths: 12.12, ebacc: 18.06, open: 17.54, minP8: -4.274 },
  { group: 26, low: 111.5, high: 112, a8: 62.87, english: 12.99, maths: 12.63, ebacc: 18.92, open: 18.33, minP8: -4.19 },
  { group: 27, low: 112.5, high: 113, a8: 65.48, english: 13.39, maths: 13.2, ebacc: 19.81, open: 19.07, minP8: -4.112 },
  { group: 28, low: 113.5, high: 114, a8: 68.16, english: 13.82, maths: 13.77, ebacc: 20.73, open: 19.84, minP8: -3.96 },
  { group: 29, low: 114.5, high: 115, a8: 70.61, english: 14.23, maths: 14.29, ebacc: 21.53, open: 20.56, minP8: -3.797 },
  { group: 30, low: 115.5, high: 116, a8: 73.17, english: 14.6, maths: 14.91, ebacc: 22.36, open: 21.31, minP8: -3.686 },
  { group: 31, low: 116.5, high: 117, a8: 75.47, english: 14.95, maths: 15.42, ebacc: 23.1, open: 21.99, minP8: -3.539 },
  { group: 32, low: 117.5, high: 118, a8: 77.28, english: 15.27, maths: 15.77, ebacc: 23.69, open: 22.55, minP8: -3.448 },
  { group: 33, low: 118.5, high: 119, a8: 79.75, english: 15.7, maths: 16.26, ebacc: 24.42, open: 23.37, minP8: -3.119 },
  { group: 34, low: 119.5, high: 120, a8: 82.03, english: 16.15, maths: 16.71, ebacc: 25.02, open: 24.15, minP8: -2.748 },
]

/** KS2 tests report scaled scores from 80 to 120; nominal scores down to 59 are assigned to pupils assessed below the standard of the tests. */
export const KS2_SCALED_MIN = 80
export const KS2_SCALED_MAX = 120
export const KS2_NOMINAL_MIN = 59

/** Prior attainment is the average of the reading and maths scaled scores, to one decimal place (110 and 105 give 107.5). */
export function ks2Average(reading: number, maths: number): number {
  return Math.round(((reading + maths) / 2) * 10) / 10
}

/** The DfE group an average scaled score falls in. Averages come in 0.5 steps; a typed 107.3 is taken to the nearest half point. */
export function priorAttainmentGroup(average: number): PriorAttainmentGroup | undefined {
  const a = Math.round(average * 2) / 2
  return PRIOR_ATTAINMENT_GROUPS.find((g) => a >= g.low && a <= g.high)
}

export type PriorAttainmentBand = 'low' | 'middle' | 'high'
/** DfE reporting bands: low below 100, middle 100 to below 110, high 110 and above. */
export function priorAttainmentBand(average: number): PriorAttainmentBand {
  return average < 100 ? 'low' : average < 110 ? 'middle' : 'high'
}

/** Pupil Progress 8: the difference between actual and estimated Attainment 8, divided by 10 (Annex B). */
export function pupilProgress8(a8: number, estimate: number): number {
  return (a8 - estimate) / 10
}

export type P8Band = 'well above average' | 'above average' | 'average' | 'below average' | 'well below average'

/**
 * DfE performance-table banding thresholds (2024): well above average at 0.5 or more, above
 * average between 0 and 0.5, below average between 0 and -0.5, well below average under -0.5.
 * Schools also need the 95% confidence interval entirely on one side of zero; a single pupil
 * has no interval, so this is the plain threshold comparison.
 */
export function progress8Band(score: number): P8Band {
  const s = Math.round(score * 100) / 100
  if (s >= 0.5) return 'well above average'
  if (s > 0) return 'above average'
  if (s === 0) return 'average'
  if (s >= -0.5) return 'below average'
  return 'well below average'
}

const f2 = (n: number) => n.toFixed(2)

/** The full DfE table as HTML for the page's rate-table section, so the figures are citable without opening the calculator. */
export function progress8EstimatesTableHtml(): string {
  const rows = PRIOR_ATTAINMENT_GROUPS.map((g) => {
    const range = g.low === g.high ? String(g.low) : `${g.low} to ${g.high}`
    return `<tr id="pag-${g.group}"><td>${g.group}</td><td>${range}</td><td><strong>${f2(g.a8)}</strong></td><td>${f2(g.english)}</td><td>${f2(g.maths)}</td><td>${f2(g.ebacc)}</td><td>${f2(g.open)}</td><td>${g.minP8 === null ? 'none' : g.minP8.toFixed(2)}</td></tr>`
  }).join('')
  return `<table><thead><tr><th>Prior attainment group</th><th>KS2 average scaled score</th><th>Attainment 8 average</th><th>English</th><th>Maths</th><th>EBacc</th><th>Open</th><th>Minimum pupil Progress 8</th></tr></thead><tbody>${rows}</tbody></table><p class="text-xs text-muted-foreground mt-2">National averages for state-funded mainstream schools in England, summer ${P8_ESTIMATES_RESULTS_YEAR} results (the last year with a KS2 baseline), from Annex A of the DfE secondary accountability guidance. English and maths averages are for the double-weighted slots (out of 18), EBacc and open for three slots each (out of 27). The minimum pupil score is the cap the DfE applied in ${P8_ESTIMATES_RESULTS_YEAR} before averaging a school; groups 1 to 16 had none. There is no table for 2025 or 2026 results, and the 2027 averages will be published in October 2027.</p>`
}
