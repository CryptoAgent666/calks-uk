/**
 * Attainment 8 slot logic shared by the GCSE grade calculator and the Progress 8
 * calculator, so the two pages cannot drift apart.
 *
 * Source: DfE, Secondary accountability measures: 2025 guidance, Annex A (Attainment 8
 * and Progress 8 methodology) and Annex B (worked examples).
 * https://www.gov.uk/government/publications/progress-8-school-performance-measure
 */

export const GRADE_POINTS: Record<string, number> = { '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2, '1': 1, 'U': 0 }
export const GRADES = Object.keys(GRADE_POINTS)
/** Grade value for a slot whose result is not yet known ("grades I still need" mode). */
export const UNKNOWN_GRADE = '?'
// Combined science (double award) is graded as a pair, 9-9 down to 1-1
export const COMBINED_GRADES = ['9-9', '9-8', '8-8', '8-7', '7-7', '7-6', '6-6', '6-5', '5-5', '5-4', '4-4', '4-3', '3-3', '3-2', '2-2', '2-1', '1-1', 'U']

// National average Attainment 8, state-funded schools in England, summer 2025
// (DfE, Key stage 4 performance 2024/25)
export const NATIONAL_A8 = 46.0

export type SubjectType = 'englang' | 'englit' | 'maths' | 'combined' | 'science' | 'computing' | 'humanity' | 'language' | 'other'

export const SUBJECTS: { v: SubjectType; l: string }[] = [
  { v: 'englang', l: 'English Language' },
  { v: 'englit', l: 'English Literature' },
  { v: 'maths', l: 'Maths' },
  { v: 'combined', l: 'Combined Science (double)' },
  { v: 'science', l: 'Biology, Chemistry or Physics' },
  { v: 'computing', l: 'Computer Science' },
  { v: 'humanity', l: 'History or Geography' },
  { v: 'language', l: 'Language (French, Spanish, Latin…)' },
  { v: 'other', l: 'Other GCSE or technical award' },
]
export const EBACC_TYPES: SubjectType[] = ['combined', 'science', 'computing', 'humanity', 'language']

export interface Row { type: SubjectType; grade: string }

export const isUnknown = (r: Row) => r.grade === UNKNOWN_GRADE

// Points for one row: a combined science pair is averaged (6-5 = 5.5 per slot).
// A slot not yet known scores 0 here; attainment8() can stand a hypothetical grade in for it.
export function rowPoints(r: Row): number {
  if (isUnknown(r)) return 0
  if (r.type === 'combined') {
    if (r.grade === 'U') return 0
    const [a, b] = r.grade.split('-').map(Number)
    return (a + b) / 2
  }
  return GRADE_POINTS[r.grade] ?? 0
}

function pointsFor(r: Row, unknownPoints: number): number {
  return isUnknown(r) ? unknownPoints : rowPoints(r)
}

/**
 * Attainment 8 per the DfE secondary accountability guidance (2025):
 * - maths bucket: double weighted;
 * - English bucket: the better of English language and literature, double weighted only
 *   if both are sat (the other can then count in the open bucket); a single English
 *   qualification counts once;
 * - EBacc bucket: the 3 best EBacc qualifications (sciences, computer science, history,
 *   geography, languages); combined science can fill 2 slots at its averaged grade;
 * - open bucket: the 3 best remaining qualifications, including unused EBacc subjects.
 * Empty slots score 0, so the maximum is 90. Filling the EBacc bucket first with the
 * best EBacc grades is optimal, because the open bucket accepts any subject.
 *
 * `unknownPoints` is the grade assumed for every slot marked "not yet known" (default 0,
 * so only grades in hand count). The total is non-decreasing in it, which gradesNeeded()
 * relies on.
 */
export function attainment8(rows: Row[], unknownPoints = 0) {
  const pts = (r: Row) => pointsFor(r, unknownPoints)
  const english = rows.filter((r) => r.type === 'englang' || r.type === 'englit').map(pts).sort((a, b) => b - a)
  const bothEnglish = rows.some((r) => r.type === 'englang') && rows.some((r) => r.type === 'englit')
  const englishPoints = english.length ? english[0] * (bothEnglish ? 2 : 1) : 0
  const mathsPoints = Math.max(0, ...rows.filter((r) => r.type === 'maths').map(pts)) * 2

  const ebaccCandidates: number[] = []
  const openCandidates: number[] = bothEnglish ? english.slice(1, 2) : []
  for (const r of rows) {
    if (!EBACC_TYPES.includes(r.type)) {
      if (r.type === 'other') openCandidates.push(pts(r))
      continue
    }
    const p = pts(r)
    ebaccCandidates.push(p)
    if (r.type === 'combined') ebaccCandidates.push(p) // two slots
  }
  ebaccCandidates.sort((a, b) => b - a)
  const ebacc = ebaccCandidates.slice(0, 3)
  const open = [...ebaccCandidates.slice(3), ...openCandidates].sort((a, b) => b - a).slice(0, 3)
  const ebaccPoints = ebacc.reduce((s, p) => s + p, 0)
  const openPoints = open.reduce((s, p) => s + p, 0)
  const total = englishPoints + mathsPoints + ebaccPoints + openPoints
  return {
    total, englishPoints, mathsPoints, ebaccPoints, openPoints, bothEnglish,
    hasEnglish: english.length > 0,
    ebaccFilled: ebacc.length, openFilled: open.length,
    average: total / 10, // Attainment 8 is out of 10 weighted slots
  }
}

export interface GradesNeeded {
  /** number of rows marked not yet known */
  unknown: number
  /** Attainment 8 from the grades already in hand (unknown slots at 0) */
  banked: number
  /** Attainment 8 if every unknown slot came in at grade 9 */
  ceiling: number
  /** average grade needed across the unknown slots (0 to 9), or null when not applicable */
  needed: number | null
  status: 'none' | 'reached' | 'possible' | 'impossible'
}

/**
 * Average grade needed in the slots not yet known to reach `target` Attainment 8 points.
 * Every unknown slot is assumed to come in at the same grade x; because attainment8() is
 * non-decreasing in x, the smallest x that reaches the target is found by bisection, which
 * handles the double-weighted English and maths slots and the EBacc/open sorting without
 * any special cases.
 */
export function gradesNeeded(rows: Row[], target: number): GradesNeeded {
  const unknown = rows.filter(isUnknown).length
  const banked = attainment8(rows, 0).total
  const ceiling = attainment8(rows, 9).total
  if (!unknown) return { unknown, banked, ceiling, needed: null, status: banked >= target ? 'reached' : 'none' }
  if (banked >= target) return { unknown, banked, ceiling, needed: 0, status: 'reached' }
  if (ceiling < target - 1e-9) return { unknown, banked, ceiling, needed: null, status: 'impossible' }
  let lo = 0
  let hi = 9
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (attainment8(rows, mid).total >= target) hi = mid
    else lo = mid
  }
  return { unknown, banked, ceiling, needed: hi, status: 'possible' }
}

export const DEFAULT_ROWS: Row[] = [
  { type: 'englang', grade: '6' },
  { type: 'englit', grade: '5' },
  { type: 'maths', grade: '6' },
  { type: 'combined', grade: '6-5' },
  { type: 'humanity', grade: '5' },
  { type: 'language', grade: '4' },
  { type: 'other', grade: '6' },
  { type: 'other', grade: '5' },
]
