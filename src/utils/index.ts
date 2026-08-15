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
    Math.min(taxable, 37_700) * 0.20 +
    Math.max(0, Math.min(taxable, 125_140) - 37_700) * 0.40 +
    Math.max(0, taxable - 125_140) * 0.45
  )
}
