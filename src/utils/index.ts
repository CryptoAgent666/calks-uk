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
