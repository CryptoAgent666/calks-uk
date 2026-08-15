import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-GB', {
    maximumFractionDigits: 2,
  }).format(num)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000) {
    return `\u00a3${(amount / 1_000_000).toFixed(1)}M`
  }
  if (amount >= 1_000) {
    return `\u00a3${(amount / 1_000).toFixed(0)}K`
  }
  return formatCurrency(amount)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}

export function parseNumericInput(value: string): number {
  const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

/**
 * UK financial year runs 6 April to 5 April.
 * Returns e.g. "2026-27" for dates between 6 April 2026 and 5 April 2026.
 */
export function getFinancialYear(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = date.getMonth() // 0-indexed
  const day = date.getDate()
  // UK FY starts 6 April
  if (month > 3 || (month === 3 && day >= 6)) {
    return `${year}-${(year + 1).toString().slice(-2)}`
  }
  return `${year - 1}-${year.toString().slice(-2)}`
}

/**
 * Personal Allowance for 2026/27, tapered by £1 for every £2 of income over
 * £100,000 (so it reaches zero at £125,140).
 */
/** Width of the 20% band, measured in TAXABLE income (income after allowances). */
export const UK_BASIC_BAND = 37_700
/**
 * Taxable income at which the 45% additional rate starts. This equals the
 * £125,140 gross threshold because the allowance is already fully tapered to
 * zero by that point, so gross and taxable coincide there.
 */
export const UK_ADDITIONAL_THRESHOLD = 125_140

export function ukPersonalAllowance(gross: number, base = 12_570): number {
  if (gross <= 100_000) return base
  return Math.max(0, base - Math.floor((gross - 100_000) / 2))
}

/**
 * UK income tax (England, Wales, NI) for 2026/27.
 *
 * The basic-rate band is a fixed WIDTH of taxable income (£37,700), not a fixed
 * upper limit of £50,270. When the Personal Allowance tapers away above
 * £100,000 the band moves down with it, so the 40% rate starts earlier in gross
 * terms. Computing the band as (£50,270 − reduced allowance) widens it and
 * understates the tax for every income over £100,000 — by up to £2,514 — and
 * hides the 60% effective marginal rate in the taper zone.
 *
 * Pass `pa` explicitly when the caller has already adjusted the allowance
 * (salary sacrifice, blind person's allowance, and so on).
 */
export function ukIncomeTax(gross: number, pa: number = ukPersonalAllowance(gross)): number {
  const taxable = Math.max(0, gross - pa)
  return (
    Math.min(taxable, UK_BASIC_BAND) * 0.20 +
    Math.max(0, Math.min(taxable, UK_ADDITIONAL_THRESHOLD) - UK_BASIC_BAND) * 0.40 +
    Math.max(0, taxable - UK_ADDITIONAL_THRESHOLD) * 0.45
  )
}

/**
 * Corporation Tax for FY2026 with marginal relief.
 *
 * 19% up to £50,000 and 25% from £250,000, with marginal relief tapering
 * between the two (standard fraction 3/200). Charging a flat 25% across the
 * whole £50k–£250k range overstates the bill by up to £3,000 — the range most
 * owner-managed companies actually sit in.
 */
export function ukCorporationTax(profit: number): number {
  if (profit <= 0) return 0
  if (profit <= 50_000) return profit * 0.19
  if (profit >= 250_000) return profit * 0.25
  return profit * 0.25 - (250_000 - profit) * (3 / 200)
}

/**
 * Dividend tax for 2026/27 (8.75/33.75/39.35 became 10.75/35.75/39.35 after
 * Budget 2025 raised the basic and higher rates by 2pp).
 *
 * Dividends are treated as the TOP slice of income, so the rate depends on how
 * much band room the rest of the income has already used. Applying the basic
 * 10.75% to the whole dividend — a shortcut several calculators took — badly
 * understates the bill for anyone drawing a realistic owner-manager dividend.
 * Band positions are measured in taxable income so the £100k allowance taper is
 * handled correctly. The £500 dividend allowance is taxed at 0% but still uses
 * up band room, which is why it is added to `usedBefore` rather than ignored.
 */
export function ukDividendTax(dividends: number, otherIncome: number, allowance = 500): number {
  if (dividends <= 0) return 0
  const pa = ukPersonalAllowance(otherIncome + dividends)
  const taxableOther = Math.max(0, otherIncome - pa)
  const paLeftForDividends = Math.max(0, pa - otherIncome)
  const dividendsAfterPA = Math.max(0, dividends - paLeftForDividends)
  const taxableDividends = Math.max(0, dividendsAfterPA - allowance)
  if (taxableDividends <= 0) return 0

  const usedBefore = taxableOther + Math.min(allowance, dividendsAfterPA)
  const basicRoom = Math.max(0, UK_BASIC_BAND - usedBefore)
  const higherRoom = Math.max(0, UK_ADDITIONAL_THRESHOLD - Math.max(usedBefore, UK_BASIC_BAND))

  const inBasic = Math.min(taxableDividends, basicRoom)
  const inHigher = Math.min(taxableDividends - inBasic, higherRoom)
  const inAdditional = Math.max(0, taxableDividends - inBasic - inHigher)
  return inBasic * 0.1075 + inHigher * 0.3575 + inAdditional * 0.3935
}
