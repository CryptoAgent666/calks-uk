/**
 * Key stage 2 (SATs) scaled-score data shared by the KS2 calculator component and the
 * page prose, so the two can never disagree. Update this file and nowhere else when the
 * Standards and Testing Agency publishes the next year's conversion tables (mid July).
 *
 * Conversion tables: STA, "2026 key stage 2 scaled score conversion tables", gov.uk,
 * published 16 July 2026. Each array index is a raw mark and the value is the scaled
 * score; null means the raw mark is too low for the lowest scaled score (the NCA Portal
 * shows "N" and the outcome "NS"). Some scaled scores cannot be reached in a given year
 * (reading 2026 has no 80, 83, 115 or 119), which the STA guidance explains is a
 * consequence of the number of marks in the test.
 *
 * National figures: DfE, "Key stage 2 attainment (provisional): 2026", Explore Education
 * Statistics, published 10 September 2026 (updated 16 September 2026).
 */

export const KS2_YEAR = 2026
export const KS2_TABLES_URL =
  'https://www.gov.uk/government/publications/key-stage-2-tests-2026-scaled-scores/2026-key-stage-2-scaled-score-conversion-tables'
export const KS2_TABLES_PUBLISHED = '16 July 2026'
export const KS2_GUIDANCE_URL = 'https://www.gov.uk/guidance/understanding-scaled-scores-at-key-stage-2'

export const MIN_SCALED = 80
export const MAX_SCALED = 120
export const EXPECTED_STANDARD = 100
export const HIGHER_STANDARD = 110
/** Raw marks needed before any scaled score is awarded (STA, all three 2026 tests). */
export const MIN_RAW_FOR_SCALED = 3

export type Ks2Subject = 'reading' | 'maths' | 'gps'

export interface Ks2SubjectInfo {
  id: Ks2Subject
  name: string
  short: string
  maxRaw: number
  papers: string
  /** Average scaled score, 2026 (DfE provisional) */
  nationalAverage: number
  /** % of pupils meeting the expected standard, 2026 */
  expectedPct: number
  /** % of pupils reaching the higher standard (110 or more), 2026; null where DfE publishes no headline figure */
  higherPct: number | null
  scaled: (number | null)[]
}

export const KS2_SUBJECTS: Ks2SubjectInfo[] = [
  {
    id: 'reading',
    name: 'English reading',
    short: 'Reading',
    maxRaw: 50,
    papers: 'one paper, 50 marks',
    nationalAverage: 106,
    expectedPct: 75,
    higherPct: 31,
    scaled: [null, null, null, 81, 82, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 93, 94, 95, 95, 96, 97, 98, 98, 99, 99, 100, 101, 101, 102, 103, 103, 104, 105, 106, 106, 107, 108, 109, 109, 110, 111, 112, 113, 114, 116, 117, 118, 120, 120, 120, 120],
  },
  {
    id: 'maths',
    name: 'Mathematics',
    short: 'Maths',
    maxRaw: 110,
    papers: 'paper 1 arithmetic 40 marks, papers 2 and 3 reasoning 35 marks each',
    nationalAverage: 105,
    expectedPct: 75,
    higherPct: 27,
    scaled: [null, null, null, 80, 80, 80, 80, 81, 82, 83, 83, 84, 85, 85, 86, 86, 87, 87, 88, 88, 89, 89, 90, 90, 90, 91, 91, 92, 92, 92, 93, 93, 93, 94, 94, 94, 94, 95, 95, 95, 96, 96, 96, 96, 97, 97, 97, 97, 98, 98, 98, 98, 99, 99, 99, 99, 100, 100, 100, 100, 101, 101, 101, 101, 101, 102, 102, 102, 102, 103, 103, 103, 103, 104, 104, 104, 104, 105, 105, 105, 106, 106, 106, 106, 107, 107, 107, 108, 108, 108, 108, 109, 109, 109, 110, 110, 111, 111, 112, 112, 113, 113, 114, 114, 115, 116, 117, 118, 119, 120, 120],
  },
  {
    id: 'gps',
    name: 'English grammar, punctuation and spelling',
    short: 'GPS',
    maxRaw: 70,
    papers: 'paper 1 questions 50 marks, paper 2 spelling 20 marks',
    nationalAverage: 105,
    expectedPct: 74,
    higherPct: null,
    scaled: [null, null, null, 80, 81, 82, 83, 84, 85, 86, 87, 87, 88, 89, 90, 90, 91, 91, 92, 92, 93, 94, 94, 95, 95, 95, 96, 96, 97, 97, 98, 98, 99, 99, 100, 100, 100, 101, 101, 102, 102, 103, 103, 104, 104, 105, 105, 106, 106, 107, 107, 108, 108, 109, 109, 110, 111, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 120, 120, 120, 120],
  },
]

export const subjectInfo = (id: Ks2Subject) => KS2_SUBJECTS.find((s) => s.id === id)!

/** Scaled score for a raw mark, or null where the mark is below the lowest scaled score. */
export function scaledScore(id: Ks2Subject, raw: number): number | null {
  const s = subjectInfo(id)
  if (!Number.isFinite(raw)) return null
  const r = Math.min(s.maxRaw, Math.max(0, Math.round(raw)))
  return s.scaled[r] ?? null
}

/** Lowest raw mark that reaches at least the target scaled score, or null if the test cannot reach it. */
export function rawFor(id: Ks2Subject, target: number): number | null {
  const s = subjectInfo(id)
  const i = s.scaled.findIndex((v) => v !== null && v >= target)
  return i === -1 ? null : i
}

export type Ks2Standard = 'none' | 'below' | 'expected' | 'higher'

export function standardFor(scaled: number | null): { key: Ks2Standard; label: string } {
  if (scaled === null) return { key: 'none', label: 'N: below the lowest scaled score' }
  if (scaled >= HIGHER_STANDARD) return { key: 'higher', label: `Higher standard (${HIGHER_STANDARD} or more)` }
  if (scaled >= EXPECTED_STANDARD) return { key: 'expected', label: 'Expected standard met' }
  return { key: 'below', label: 'Expected standard not met' }
}

/** DfE "Key stage 2 attainment (provisional): 2026", percentages of pupils in England. */
export const KS2_NATIONAL_2026 = {
  rwmExpected: 63,
  rwmExpectedPrior: 62,
  rwmHigher: 9,
  rwmHigherPrior: 8,
  rwmExpected2019: 65,
  readingExpected: 75,
  readingHigher: 31,
  mathsExpected: 75,
  mathsHigher: 27,
  writingExpected: 73,
  writingGreaterDepth: 13,
  gpsExpected: 74,
  scienceExpected: 82,
  pupilsNotMeetingRwm: 182_167,
  published: '10 September 2026',
  sourceUrl: 'https://explore-education-statistics.service.gov.uk/find-statistics/key-stage-2-attainment/2025-26-provisional',
}

/** Test and results dates, all from gov.uk (STA "Primary assessments: future dates" and the KS2 ARA). */
export const KS2_DATES = {
  tests2026: [
    { date: 'Monday 11 May 2026', activity: 'English grammar, punctuation and spelling, papers 1 and 2' },
    { date: 'Tuesday 12 May 2026', activity: 'English reading' },
    { date: 'Wednesday 13 May 2026', activity: 'Mathematics papers 1 and 2' },
    { date: 'Thursday 14 May 2026', activity: 'Mathematics paper 3' },
  ],
  results2026Planned: '7 July 2026',
  results2026: 'Thursday 16 July 2026',
  tests2027: [
    { date: 'Monday 10 May 2027', activity: 'English grammar, punctuation and spelling, papers 1 and 2' },
    { date: 'Tuesday 11 May 2027', activity: 'English reading' },
    { date: 'Wednesday 12 May 2027', activity: 'Mathematics papers 1 and 2' },
    { date: 'Thursday 13 May 2027', activity: 'Mathematics paper 3' },
  ],
  results2027: 'Tuesday 6 July 2027',
  materials2027: 'Friday 21 May 2027',
  datesUrl: 'https://www.gov.uk/guidance/primary-assessments-future-dates',
}

/** Raw marks needed in 2026 for the key scaled scores, as an HTML table for the page's rate table. */
export function ks2ThresholdsTableHtml() {
  const cell = (v: number | null) => (v === null ? 'not reachable' : String(v))
  const rows = KS2_SUBJECTS.map((s) => {
    const lowest = s.scaled.find((v) => v !== null) as number
    return `<tr><td>${s.name}</td><td>${s.maxRaw}</td><td>${cell(rawFor(s.id, lowest))} (scaled ${lowest})</td><td><strong>${cell(rawFor(s.id, EXPECTED_STANDARD))}</strong></td><td>${cell(rawFor(s.id, HIGHER_STANDARD))}</td><td>${cell(rawFor(s.id, MAX_SCALED))}</td><td>${s.nationalAverage}</td></tr>`
  }).join('')
  return `<table><thead><tr><th>Test</th><th>Marks available</th><th>Lowest scaled score</th><th>Raw marks for ${EXPECTED_STANDARD}</th><th>Raw marks for ${HIGHER_STANDARD}</th><th>Raw marks for ${MAX_SCALED}</th><th>2026 average scaled score</th></tr></thead><tbody>${rows}</tbody></table>`
}
