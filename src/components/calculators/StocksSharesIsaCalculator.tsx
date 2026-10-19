import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const ISA_ALLOWANCE = 20_000
const DIVIDEND_ALLOWANCE = 500 // 2026/27
const CGT_ANNUAL_EXEMPT = 3_000 // 2026/27
const CGT_BASIC_RATE = 0.18 // all assets since 30 Oct 2024
const DIVIDEND_BASIC_RATE = 0.1075 // 2026/27

function calculate(monthlyDeposit: number, currentBalance: number, years: number, growthRate: number, dividendYield: number) {
  const yearlyDeposit = Math.min(monthlyDeposit * 12, ISA_ALLOWANCE)
  const effectiveMonthly = yearlyDeposit / 12
  const monthlyGrowth = growthRate / 100 / 12
  const monthlyDivYield = dividendYield / 100 / 12

  let balance = currentBalance
  let totalDeposited = currentBalance
  let totalDividends = 0
  let totalGrowth = 0
  let yearDividends = 0
  let yearGrowth = 0
  let totalTaxSaved = 0

  // Indicative tax saved vs a general investment account: basic-rate taxpayer, all gains realised each
  // year. Neither the £500 dividend allowance nor the £3,000 CGT annual exempt amount carries over, so
  // each is netted off that year's dividends and growth only
  for (let m = 1; m <= years * 12; m++) {
    const growth = balance * monthlyGrowth
    const dividend = balance * monthlyDivYield
    totalGrowth += growth
    totalDividends += dividend
    yearGrowth += growth
    yearDividends += dividend
    balance += growth + dividend + effectiveMonthly
    totalDeposited += effectiveMonthly
    if (m % 12 === 0) {
      totalTaxSaved += Math.max(0, yearDividends - DIVIDEND_ALLOWANCE) * DIVIDEND_BASIC_RATE
      totalTaxSaved += Math.max(0, yearGrowth - CGT_ANNUAL_EXEMPT) * CGT_BASIC_RATE
      yearDividends = 0
      yearGrowth = 0
    }
  }

  return { balance, totalDeposited, totalGrowth, totalDividends, totalReturn: totalGrowth + totalDividends, totalTaxSaved }
}

export default function StocksSharesIsaCalculator() {
  const [monthly, setMonthly] = useState('500')
  const [current, setCurrent] = useState('10000')
  const [years, setYears] = useState('15')
  const [growth, setGrowth] = useState('6')
  const [divYield, setDivYield] = useState('2')

  const m = parseFloat(monthly.replace(/,/g,'')) || 0
  const c = parseFloat(current.replace(/,/g,'')) || 0
  const y = parseInt(years) || 0
  const g = parseFloat(growth) || 0
  const d = parseFloat(divYield) || 0
  const result = useMemo(() => calculate(m, c, y, g, d), [m, c, y, g, d])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Monthly Contribution</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Contribution" /></div><p className="text-xs text-muted-foreground mt-1">Max £{Math.round(ISA_ALLOWANCE/12).toLocaleString('en-GB')}/month</p></div>
        <div><label className="block text-sm font-medium mb-2">Current Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current Balance" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years</label><input type="number" min="1" max="40" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years" /></div>
        <div><label className="block text-sm font-medium mb-2">Capital Growth (%)</label><input type="number" min="0" max="15" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Capital Growth (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Dividend Yield (%)</label><input type="number" min="0" max="10" step="0.5" value={divYield} onChange={(e) => setDivYield(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Dividend Yield (%)" /></div>
      </div>

      {y > 0 && m > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">S&S ISA Value in {y} Years</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.balance)}</p>
            <p className="text-sm text-muted-foreground mt-1">All growth and dividends tax-free</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Deposited</p><p className="text-lg font-bold">{formatCurrency(result.totalDeposited)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Capital Growth</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalGrowth)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Dividends</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalDividends)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Indicative tax saved vs a general account</p><p className="text-lg font-bold">{formatCurrency(result.totalTaxSaved)}</p></div>
          </div>
          <p className="text-xs text-muted-foreground">Tax saved assumes a basic-rate taxpayer, all gains realised each year, and the £{DIVIDEND_ALLOWANCE} dividend allowance and £{CGT_ANNUAL_EXEMPT.toLocaleString('en-GB')} CGT exemption set against each year's dividends and growth; unused allowance cannot be carried forward. Enter a growth rate net of platform and fund charges.</p>
        </div>
      )}
    </div>
  )
}
