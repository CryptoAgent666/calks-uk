/**
 * UK honours degree classification maths shared by the Degree Classification calculator,
 * its page prose and its tables, so they cannot disagree.
 *
 * The class boundaries (70 / 60 / 50 / 40) are the convention used across UK universities.
 * The weighting presets were checked against published regulations on 13 October 2026:
 *  - University of Nottingham, Quality Manual, course specification regulations: "The
 *    standardised weighting for a Bachelor's degree must be 33/67 for Parts I and II".
 *  - University of Exeter, TQA Manual 2026/27 chapter 9 and SID "How your award is
 *    calculated": Stage 1 does not normally count; Stage 2 is one third and Stage 3 two
 *    thirds of the final mark; a First is a weighted average of 69.50% or more, or 68.00%
 *    or more where at least 50% of weighted credits are at 69.50% or more.
 *  - Sheffield Hallam University, Standard Assessment Regulations, Regulation 10: Method 1
 *    is 25% of the Level 5 weighted average plus 75% of the Level 6 weighted average,
 *    Method 2 is 100% of Level 6. Each level's average uses the 100 highest-marked credits
 *    of 120 for results confirmed before 2 November 2026 and all 120 credits from then on;
 *    this module models all credits. Borderline 68.01% to 69.99% with 70% or more in at
 *    least 60 Level 6 credits is a First.
 *  - Manchester Metropolitan University student hub: Level 5 25%, Level 6 75%, or final
 *    year marks only, whichever is better; "Rounding is never used".
 *  - UWE Bristol: Level 6 marks weighted three times Level 5; automatic uplift when the
 *    overall mark is no more than 0.5% below the higher class.
 *  - Durham University, Core Regulations for undergraduate programmes: "performance on
 *    modules studied in the second and third years shall be differentially weighted 2:3".
 *  - University of Glasgow, Guide to the Assessment Regulations: Junior and Senior Honours
 *    session GPAs combined with "equal weighting for most Honours programmes".
 * Every university publishes its own rules, so a result from this module is indicative.
 */

export type ClassKey = 'first' | 'upper' | 'lower' | 'third' | 'fail'

export interface ClassBand {
  key: ClassKey
  label: string
  short: string
  /** Lowest weighted average that earns the class */
  min: number
}

export const BANDS: ClassBand[] = [
  { key: 'first', label: 'First Class Honours', short: 'First', min: 70 },
  { key: 'upper', label: 'Upper Second Class Honours (2:1)', short: '2:1', min: 60 },
  { key: 'lower', label: 'Lower Second Class Honours (2:2)', short: '2:2', min: 50 },
  { key: 'third', label: 'Third Class Honours', short: 'Third', min: 40 },
  { key: 'fail', label: 'Below honours (fail, or an ordinary degree where the university offers one)', short: 'Below 40', min: 0 },
]

/** Width in marks of the typical discretionary zone below each boundary */
export const BORDERLINE_MARKS = 2

export const HONOURS_BANDS = BANDS.filter((b) => b.key !== 'fail')

export function classify(average: number): ClassBand {
  return BANDS.find((b) => average >= b.min) ?? BANDS[BANDS.length - 1]
}

export function bandByKey(key: ClassKey): ClassBand {
  return BANDS.find((b) => b.key === key) ?? BANDS[0]
}

/** The next boundary above the average and how far away it is, or null for a First. */
export function nextBoundary(average: number): { band: ClassBand; distance: number } | null {
  const above = [...HONOURS_BANDS].reverse().find((b) => b.min > average)
  return above ? { band: above, distance: above.min - average } : null
}

/** True when the average sits inside the usual borderline zone below a boundary. */
export function isBorderline(average: number): boolean {
  const next = nextBoundary(average)
  return next !== null && next.distance <= BORDERLINE_MARKS && next.distance > 0
}

export const LEVELS = [4, 5, 6] as const
export type Level = (typeof LEVELS)[number]
export const LEVEL_LABELS: Record<Level, string> = { 4: 'Level 4 (Year 1)', 5: 'Level 5 (Year 2)', 6: 'Level 6 (Final year)' }
export const CREDITS_PER_YEAR = 120
export const MODULE_CREDIT_OPTIONS = [10, 15, 20, 30, 40, 60]

export interface Preset {
  id: string
  label: string
  /** Relative weights for Levels 4, 5 and 6 */
  weights: [number, number, number]
  examples: string
}

export const PRESETS: Preset[] = [
  { id: 'final', label: 'Final year only (Level 6 = 100%)', weights: [0, 0, 1], examples: 'Sheffield Hallam Method 2, Manchester Metropolitan Method 2' },
  { id: '1-2', label: 'Level 5 : Level 6 = 1 : 2 (33 / 67)', weights: [0, 1, 2], examples: 'University of Nottingham, University of Exeter' },
  { id: '1-3', label: 'Level 5 : Level 6 = 1 : 3 (25 / 75)', weights: [0, 1, 3], examples: 'Sheffield Hallam Method 1, Manchester Metropolitan Method 1, UWE Bristol' },
  { id: '40-60', label: 'Level 5 : Level 6 = 40 : 60 (2 : 3)', weights: [0, 2, 3], examples: 'Durham University' },
  { id: '50-50', label: 'Level 5 : Level 6 = 50 : 50', weights: [0, 1, 1], examples: 'Scottish four-year degrees such as Glasgow, where the two Honours years count equally' },
  { id: 'custom', label: 'Custom split', weights: [0, 1, 2], examples: '' },
]

export const DEFAULT_PRESET_ID = '1-2'

export const presetById = (id: string): Preset => PRESETS.find((p) => p.id === id) ?? PRESETS[1]

/** Weights as percentages that sum to 100, for display. */
export function weightsAsPercent(weights: [number, number, number]): [number, number, number] {
  const total = weights.reduce((s, w) => s + w, 0)
  if (total <= 0) return [0, 0, 0]
  return weights.map((w) => (w / total) * 100) as [number, number, number]
}

export interface ModuleMark {
  mark: number
  credits: number
}

/** Credit-weighted average of a set of module marks, or null with no credits. */
export function creditWeightedAverage(modules: ModuleMark[]): { average: number | null; credits: number } {
  const valid = modules.filter((m) => m.credits > 0 && Number.isFinite(m.mark))
  const credits = valid.reduce((s, m) => s + m.credits, 0)
  if (credits <= 0) return { average: null, credits: 0 }
  const average = valid.reduce((s, m) => s + m.mark * m.credits, 0) / credits
  return { average, credits }
}

export interface LevelSummary {
  /** Credit-weighted average of the marks entered so far, or null if none */
  average: number | null
  /** Credits assessed so far */
  credits: number
  /** Credits in the whole year (usually 120) */
  creditsInYear: number
}

/**
 * Overall weighted average across levels. Levels with no marks are left out and the
 * remaining weights are rescaled, so a second-year student still sees a running figure.
 */
export function overallAverage(levels: LevelSummary[], weights: number[]): { average: number | null; usedWeights: number[] } {
  let num = 0
  let den = 0
  const used: number[] = []
  levels.forEach((l, idx) => {
    const w = weights[idx] ?? 0
    if (w > 0 && l.average !== null && l.credits > 0) {
      num += w * l.average
      den += w
      used.push(w)
    } else {
      used.push(0)
    }
  })
  if (den <= 0) return { average: null, usedWeights: used }
  return { average: num / den, usedWeights: used.map((w) => w / den) }
}

export type NeedStatus = 'secured' | 'possible' | 'unreachable' | 'no-remaining'

export interface MarkNeeded {
  /** Average needed across every remaining credit in the weighted levels */
  needed: number | null
  remainingCredits: number
  status: NeedStatus
}

/**
 * Mark needed on every remaining credit to finish with an overall average of `target`.
 * The overall average is linear in the unknown mark x:
 *   overall = sum_l w_l * (c_l*a_l + r_l*x) / (c_l + r_l) / sum_l w_l
 * where c_l and a_l are credits and average already assessed at level l and r_l the credits
 * still to come. Solving for x gives (target - A) / B.
 */
export function markNeeded(levels: LevelSummary[], weights: number[], target: number): MarkNeeded {
  let a = 0
  let b = 0
  let wsum = 0
  let remaining = 0
  levels.forEach((l, idx) => {
    const w = weights[idx] ?? 0
    if (w <= 0) return
    const done = l.average !== null ? l.credits : 0
    const r = Math.max(0, l.creditsInYear - done)
    const total = done + r
    if (total <= 0) return
    wsum += w
    a += (w * done * (l.average ?? 0)) / total
    b += (w * r) / total
    remaining += r
  })
  if (wsum <= 0 || remaining <= 0) return { needed: null, remainingCredits: 0, status: 'no-remaining' }
  const needed = (target * wsum - a) / b
  const status: NeedStatus = needed <= 0 ? 'secured' : needed > 100 ? 'unreachable' : 'possible'
  return { needed, remainingCredits: remaining, status }
}

const pct = (n: number) => `${Math.round(n)}%`

/** Table of classification boundaries for the page. */
export function classificationTableHtml(): string {
  const rows = HONOURS_BANDS.map((b, idx) => {
    const upper = idx === 0 ? '' : ` to ${HONOURS_BANDS[idx - 1].min - 0.01}`
    const range = idx === 0 ? `${b.min}% or more` : `${b.min}%${upper}%`
    return `<tr><td>${b.label}</td><td><strong>${range}</strong></td><td>${b.min - BORDERLINE_MARKS}% to ${b.min - 0.01}%</td></tr>`
  })
  rows.push(`<tr><td>${BANDS[BANDS.length - 1].label}</td><td><strong>Below ${HONOURS_BANDS[HONOURS_BANDS.length - 1].min}%</strong></td><td>n/a</td></tr>`)
  return `<table><thead><tr><th>Classification</th><th>Weighted average</th><th>Typical borderline zone</th></tr></thead><tbody>${rows.join('')}</tbody></table>`
}

/** Table of weighting presets with example universities. */
export function presetTableHtml(): string {
  const rows = PRESETS.filter((p) => p.id !== 'custom').map((p) => {
    const [, l5, l6] = weightsAsPercent(p.weights)
    return `<tr><td>${p.label}</td><td>${pct(l5)}</td><td><strong>${pct(l6)}</strong></td><td>${p.examples}</td></tr>`
  })
  return `<table><thead><tr><th>Weighting</th><th>Level 5</th><th>Level 6</th><th>Examples of universities using it</th></tr></thead><tbody>${rows.join('')}</tbody></table>`
}
