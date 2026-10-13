/**
 * Kilogram / stone / pound conversions shared by the three focused converters
 * (kg-to-stone, stone-to-kg, lbs-to-stone) and the static charts on their pages,
 * so the live result and the table on the same page can never disagree.
 *
 * Definitions, not measurements, so nothing here ever needs re-verifying:
 * the international avoirdupois pound has been exactly 0.45359237 kg since the
 * 1959 agreement adopted by the UK (Weights and Measures Act 1963, Sch 1);
 * 1 stone = 14 lb; 1 lb = 16 oz.
 */

export const KG_PER_LB = 0.45359237
export const LB_PER_ST = 14
export const OZ_PER_LB = 16
export const KG_PER_ST = KG_PER_LB * LB_PER_ST // 6.35029318

export interface StoneLb {
  st: number
  /** pounds remainder, already rounded to 1 decimal place (0.0 to 13.9) */
  lb: number
}

const round1 = (n: number) => Math.round(n * 10) / 10

export const kgToLb = (kg: number) => kg / KG_PER_LB
export const lbToKg = (lb: number) => lb * KG_PER_LB
export const stLbToLb = (st: number, lb: number) => st * LB_PER_ST + lb
export const stLbToKg = (st: number, lb: number) => lbToKg(stLbToLb(st, lb))

/**
 * Split a pound total into whole stones and a pounds remainder to 1 decimal.
 * The remainder is rounded first and only then checked against 14, so a value
 * such as 13.97 lb carries into the next stone instead of printing "13 st 14.0 lb".
 */
export function lbToStLb(totalLb: number): StoneLb {
  const safe = Math.max(0, totalLb)
  let st = Math.floor(safe / LB_PER_ST)
  let lb = round1(safe - st * LB_PER_ST)
  if (lb >= LB_PER_ST) {
    st += 1
    lb = 0
  }
  return { st, lb }
}

export const kgToStLb = (kg: number) => lbToStLb(kgToLb(kg))

/** Kilograms to 1 decimal place, or 2 below 10 kg where a tenth is too coarse. */
export const fmtKg = (kg: number) => (kg < 10 ? kg.toFixed(2) : kg.toFixed(1))

/** "12 st 0.9 lb" */
export const fmtStLb = ({ st, lb }: StoneLb) => `${st} st ${lb.toFixed(1)} lb`

/** Decimal input as the user typed it, with thousands separators on large values. */
export const fmtNum = (n: number) => n.toLocaleString('en-GB', { maximumFractionDigits: 3 })

/** Always one decimal place, with thousands separators: "2,702.0" */
export const fmt1 = (n: number) => n.toLocaleString('en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const range = (from: number, to: number, step: number) => {
  const out: number[] = []
  for (let v = from; v <= to + 1e-9; v += step) out.push(Math.round(v * 1000) / 1000)
  return out
}

export const KG_CHART = { from: 40, to: 150, step: 1 }
export const ST_CHART = { from: 5, to: 25, step: 1 }
export const LB_CHART = { from: 100, to: 300, step: 5 }

/** Kilograms to stone and pounds chart, 40 kg to 150 kg in 1 kg steps (server-rendered). */
export function kgToStoneChartHtml() {
  const rows = range(KG_CHART.from, KG_CHART.to, KG_CHART.step)
    .map((kg) => `<tr id="kg-${kg}"><td><strong>${kg} kg</strong></td><td>${fmtStLb(kgToStLb(kg))}</td><td>${kgToLb(kg).toFixed(1)} lb</td></tr>`)
    .join('')
  return `<table><thead><tr><th>Kilograms</th><th>Stone and pounds</th><th>Pounds</th></tr></thead><tbody>${rows}</tbody></table><p class="text-xs text-muted-foreground mt-2">Pounds are shown to one decimal place. 1 lb = ${KG_PER_LB} kg exactly, 1 st = 14 lb = ${KG_PER_ST.toFixed(4)} kg. For a weight between two rows, type it into the converter above.</p>`
}

/** Whole stones 5 st to 25 st in kilograms, plus 1 lb to 14 lb in kilograms (server-rendered). */
export function stoneToKgChartHtml() {
  const stRows = range(ST_CHART.from, ST_CHART.to, ST_CHART.step)
    .map((st) => `<tr id="st-${st}"><td><strong>${st} st</strong></td><td>${fmtKg(stLbToKg(st, 0))} kg</td><td>${stLbToLb(st, 0)} lb</td></tr>`)
    .join('')
  const lbRows = range(1, LB_PER_ST, 1)
    .map((lb) => `<tr id="lb-${lb}"><td><strong>${lb} lb${lb === LB_PER_ST ? ' (1 st)' : ''}</strong></td><td>${fmtKg(lbToKg(lb))} kg</td><td>${Math.round(lbToKg(lb) * 1000).toLocaleString('en-GB')} g</td></tr>`)
    .join('')
  return `<table><thead><tr><th>Stone</th><th>Kilograms</th><th>Pounds</th></tr></thead><tbody>${stRows}</tbody></table><p class="mt-5 mb-2 text-sm font-semibold">Pounds to kilograms (add to the stone figure)</p><table><thead><tr><th>Pounds</th><th>Kilograms</th><th>Grams</th></tr></thead><tbody>${lbRows}</tbody></table><p class="text-xs text-muted-foreground mt-2">To convert a mixed weight, add the two rows: 10 st 5 lb is ${fmtKg(stLbToKg(10, 0))} kg plus ${fmtKg(lbToKg(5))} kg, which is ${fmtKg(stLbToKg(10, 5))} kg. 1 st = ${KG_PER_ST.toFixed(4)} kg, 1 lb = ${KG_PER_LB} kg exactly.</p>`
}

/** Pounds to stone and kilograms chart, 100 lb to 300 lb in 5 lb steps (server-rendered). */
export function lbsToStoneChartHtml() {
  const rows = range(LB_CHART.from, LB_CHART.to, LB_CHART.step)
    .map((lb) => `<tr id="lb-${lb}"><td><strong>${lb} lb</strong></td><td>${fmtStLb(lbToStLb(lb))}</td><td>${fmtKg(lbToKg(lb))} kg</td></tr>`)
    .join('')
  return `<table><thead><tr><th>Pounds</th><th>Stone and pounds</th><th>Kilograms</th></tr></thead><tbody>${rows}</tbody></table><p class="text-xs text-muted-foreground mt-2">Divide pounds by 14 for whole stones; the remainder is the pounds figure. 1 lb = ${KG_PER_LB} kg exactly. For a weight between two rows, type it into the converter above.</p>`
}
