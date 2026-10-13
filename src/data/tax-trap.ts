/**
 * Shared maths for the Personal Allowance taper between £100,000 and £125,140 (the
 * "60% tax trap"), 2026/27, England, Wales and Northern Ireland.
 *
 * Used by SixtyPercentTaxTrapCalculator.tsx AND by the page copy in
 * calculator-content.ts / faqs.ts, so the band table, the worked example and the
 * calculator itself can never disagree. The constants mirror
 * IncomeTaxCalculator.tsx and NationalInsuranceCalculator.tsx exactly.
 *
 * gov.uk/income-tax-rates/income-over-100000: "Your Personal Allowance goes down by
 * £1 for every £2 that your adjusted net income is above £100,000. This means your
 * allowance is zero if your income is £125,140 or above."
 */

export const PERSONAL_ALLOWANCE = 12_570
export const PA_TAPER_START = 100_000
export const PA_TAPER_RATE = 2 // £1 of allowance lost for every £2 of adjusted net income
export const PA_TAPER_END = PA_TAPER_START + PERSONAL_ALLOWANCE * PA_TAPER_RATE // 125,140
export const BASIC_RATE_BAND = 37_700 // width of the 20% band in taxable income
export const HIGHER_RATE_LIMIT = 125_140 // taxable income where 45% starts
export const BASIC_RATE = 0.2
export const HIGHER_RATE = 0.4
export const ADDITIONAL_RATE = 0.45

// Employee Class 1 National Insurance 2026/27 (annualised)
export const NI_PRIMARY_THRESHOLD = 12_570
export const NI_UPPER_EARNINGS_LIMIT = 50_270
export const NI_MAIN_RATE = 0.08
export const NI_ADDITIONAL_RATE = 0.02

// Gift Aid: every £1 given takes £1.25 off adjusted net income (gov.uk/guidance/adjusted-net-income)
export const GIFT_AID_GROSS_UP = 1.25

// 30 funded hours for working parents and Tax-Free Childcare both end when either
// parent's expected adjusted net income is over £100,000
// (gov.uk/check-eligible-free-childcare-if-youre-working, gov.uk/tax-free-childcare)
export const CHILDCARE_INCOME_CAP = 100_000

export const PENSION_ANNUAL_ALLOWANCE = 60_000

/** Personal Allowance after the taper, from adjusted net income. */
export function personalAllowance(adjustedNetIncome: number): number {
  if (adjustedNetIncome <= PA_TAPER_START) return PERSONAL_ALLOWANCE
  const reduction = Math.floor((adjustedNetIncome - PA_TAPER_START) / PA_TAPER_RATE)
  return Math.max(0, PERSONAL_ALLOWANCE - reduction)
}

/** Employee Class 1 NI on one employment's earnings. */
export function employeeNI(earnings: number): number {
  if (earnings <= NI_PRIMARY_THRESHOLD) return 0
  const main = Math.min(earnings, NI_UPPER_EARNINGS_LIMIT) - NI_PRIMARY_THRESHOLD
  const additional = Math.max(0, earnings - NI_UPPER_EARNINGS_LIMIT)
  return main * NI_MAIN_RATE + additional * NI_ADDITIONAL_RATE
}

/**
 * Income tax on `income` (pay after any pension contribution), with the Personal
 * Allowance set by `adjustedNetIncome` and the basic and higher rate limits extended
 * by `bandExtension` (the grossed-up Gift Aid, ITA 2007 s414). The basic-rate band is
 * a fixed width of taxable income, so it moves down as the allowance tapers.
 */
export function incomeTax(income: number, adjustedNetIncome: number, bandExtension = 0): number {
  const allowance = personalAllowance(adjustedNetIncome)
  const taxable = Math.max(0, income - allowance)
  const basicTop = BASIC_RATE_BAND + bandExtension
  const higherTop = HIGHER_RATE_LIMIT + bandExtension
  const basic = Math.min(taxable, basicTop)
  const higher = Math.min(Math.max(0, taxable - basicTop), higherTop - basicTop)
  const additional = Math.max(0, taxable - higherTop)
  return basic * BASIC_RATE + higher * HIGHER_RATE + additional * ADDITIONAL_RATE
}

export interface TrapInputs {
  salary: number
  bonus: number
  /** Gross pension contribution for the year (what lands in the pot). */
  pensionGross: number
  /** true = salary sacrifice (saves NI too); false = relief at source or net pay (tax only). */
  sacrifice: boolean
  /** Net Gift Aid donations in the year. */
  giftAidNet: number
}

function position(i: TrapInputs) {
  const gross = i.salary + i.bonus
  const pensionGross = Math.min(Math.max(0, i.pensionGross), gross)
  const giftAidGross = Math.max(0, i.giftAidNet) * GIFT_AID_GROSS_UP
  const incomeAfterPension = gross - pensionGross
  const ani = Math.max(0, incomeAfterPension - giftAidGross)
  const tax = incomeTax(incomeAfterPension, ani, giftAidGross)
  const ni = employeeNI(i.sacrifice ? incomeAfterPension : gross)
  return { gross, pensionGross, giftAidGross, ani, tax, ni, takeHome: gross - pensionGross - tax - ni }
}

/** Full picture at the current income, plus the contribution that escapes the taper. */
export function taxTrap(i: TrapInputs) {
  const now = position(i)
  const allowance = personalAllowance(now.ani)
  const allowanceLost = PERSONAL_ALLOWANCE - allowance
  // Slice of adjusted net income sitting inside the £100,000 to £125,140 band
  const inBand = Math.max(0, Math.min(now.ani, PA_TAPER_END) - PA_TAPER_START)
  const taperTax = allowanceLost * HIGHER_RATE // the extra 20p per £1 on top of 40%
  const bandTax = inBand * HIGHER_RATE + taperTax // 60% of the slice

  // Marginal rates on the next £100 of pay (pension fixed in £)
  const step = 100
  const next = position({ ...i, salary: i.salary + step })
  const marginalTax = (next.tax - now.tax) / step
  const marginalNI = (next.ni - now.ni) / step

  // Gross contribution that brings adjusted net income back to £100,000
  const contribution = Math.max(0, now.ani - PA_TAPER_START)
  const after = position({ ...i, pensionGross: now.pensionGross + contribution })
  const taxSaved = now.tax - after.tax
  const niSaved = now.ni - after.ni
  const netCost = contribution - taxSaved - niSaved

  const noPension = position({ ...i, pensionGross: 0, giftAidNet: 0 })

  return {
    ...now,
    allowance,
    allowanceLost,
    inBand,
    taperTax,
    bandTax,
    marginalTax,
    marginalNI,
    marginalTotal: marginalTax + marginalNI,
    inTrap: now.ani > PA_TAPER_START && now.ani < PA_TAPER_END,
    aboveTrap: now.ani >= PA_TAPER_END,
    childcareLost: now.ani > CHILDCARE_INCOME_CAP,
    escape: {
      contribution,
      totalPension: now.pensionGross + contribution,
      taxSaved,
      niSaved,
      netCost,
      reliefRate: contribution > 0 ? (taxSaved + niSaved) / contribution : 0,
      takeHomeAfter: after.takeHome,
      aniAfter: after.ani,
      overAnnualAllowance: now.pensionGross + contribution > PENSION_ANNUAL_ALLOWANCE,
    },
    noPension,
  }
}

/** Salary-only view of the band, £5,000 steps from £100,000 to £125,140. */
export const TRAP_BAND_INCOMES = [100_000, 105_000, 110_000, 115_000, 120_000, 125_000, PA_TAPER_END]

export function trapBandRows() {
  return TRAP_BAND_INCOMES.map((income) => {
    const r = taxTrap({ salary: income, bonus: 0, pensionGross: 0, sacrifice: false, giftAidNet: 0 })
    // Marginal rate ON the row's income: the £1 after £125,140 is taxed at 45%, so
    // the top row reports the band it has just left (60%) to describe the band itself.
    const marginalTax = income >= PA_TAPER_END ? HIGHER_RATE + BASIC_RATE : r.marginalTax
    return {
      income,
      allowance: r.allowance,
      allowanceLost: r.allowanceLost,
      tax: r.tax,
      taperTax: r.taperTax,
      marginalTax,
      marginalTotal: marginalTax + r.marginalNI,
      takeHome: r.takeHome,
    }
  })
}

const gbp = (n: number) => '£' + Math.round(n).toLocaleString('en-GB')
const pct = (n: number) => Math.round(n * 100) + '%'

/** £ for prose: whole pounds when the value is whole, otherwise two decimals (£4,210.60). */
export function fmtGBP(n: number): string {
  const rounded = Math.round(n * 100) / 100
  return Number.isInteger(rounded)
    ? '£' + rounded.toLocaleString('en-GB')
    : '£' + rounded.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** HTML band table for the page's rate-table block (same maths as the calculator). */
export function trapBandTableHtml(): string {
  const rows = trapBandRows()
    .map(
      (r) =>
        `<tr><td>${gbp(r.income)}</td><td>${gbp(r.allowance)}</td><td>${gbp(r.allowanceLost)}</td><td>${gbp(r.tax)}</td><td>${gbp(r.taperTax)}</td><td><strong>${pct(r.marginalTax)}</strong></td><td>${pct(r.marginalTotal)}</td></tr>`,
    )
    .join('')
  return `<table><thead><tr><th>Adjusted net income</th><th>Personal Allowance</th><th>Allowance lost</th><th>Income tax (salary only)</th><th>Extra tax from the taper</th><th>Marginal income tax</th><th>Marginal tax + NI</th></tr></thead><tbody>${rows}</tbody></table>`
}
