import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// Scottish income tax 2026/27: band widths on TAXABLE income, so the total-income thresholds move
// down when the Personal Allowance tapers. Same values as ScottishIncomeTaxCalculator.tsx.
const SCOTTISH_BANDS = [
  { rate: 0.19, width: 3_967 },
  { rate: 0.20, width: 12_989 },
  { rate: 0.21, width: 14_136 },
  { rate: 0.42, width: 31_338 },
  { rate: 0.45, width: 62_710 },
  { rate: 0.48, width: Infinity },
]

function scottishIncomeTax(taxable: number) {
  let remaining = taxable
  let tax = 0
  for (const band of SCOTTISH_BANDS) {
    const inBand = Math.min(remaining, band.width)
    tax += inBand * band.rate
    remaining -= inBand
  }
  return tax
}

function calculate(dayRate: number, daysPerMonth: number, monthsPerYear: number, expenses: number, accountancyFee: number, scottish: boolean) {
  const grossRevenue = dayRate * daysPerMonth * monthsPerYear
  const netProfit = grossRevenue - expenses - accountancyFee

  let pa = 12_570
  if (netProfit > 100_000) pa = Math.max(0, 12_570 - Math.floor((netProfit - 100_000) / 2))

  let tax = 0
  if (netProfit > pa) {
    if (scottish) tax = scottishIncomeTax(netProfit - pa)
    else if (netProfit <= 50_270) tax = (netProfit - pa) * 0.20
    else if (netProfit <= 125_140) tax = 37_700 * 0.20 + (netProfit - pa - 37_700) * 0.40
    else tax = 37_700 * 0.20 + (125_140 - 37_700) * 0.40 + (netProfit - 125_140) * 0.45
  }

  let class4 = 0
  if (netProfit > 12_570) {
    if (netProfit <= 50_270) class4 = (netProfit - 12_570) * 0.06
    else class4 = (50_270 - 12_570) * 0.06 + (netProfit - 50_270) * 0.02
  }
  // Class 2 NI was abolished from 6 April 2024 — no longer payable.

  const totalTax = tax + class4
  const takeHome = netProfit - totalTax
  const effectiveRate = grossRevenue > 0 ? (totalTax / grossRevenue) * 100 : 0
  const needsVAT = grossRevenue > 90_000

  return { grossRevenue, expenses, accountancyFee, netProfit, tax, class4, totalTax, takeHome, effectiveRate, needsVAT, hourlyTakeHome: takeHome / (daysPerMonth * monthsPerYear * 8) }
}

export default function FreelanceTaxCalculator() {
  const [rate, setRate] = useState('350')
  const [days, setDays] = useState('20')
  const [months, setMonths] = useState('11')
  const [expenses, setExpenses] = useState('3000')
  const [accountancy, setAccountancy] = useState('500')
  const [scotland, setScotland] = useState(false)

  const r = parseFloat(rate) || 0
  const d = parseFloat(days) || 0
  const m = parseInt(months) || 0
  const e = parseFloat(expenses.replace(/,/g,'')) || 0
  const a = parseFloat(accountancy) || 0
  const result = useMemo(() => calculate(r, d, m, e, a, scotland), [r, d, m, e, a, scotland])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Day Rate</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={rate} onChange={(ev) => setRate(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Day Rate" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Days/Month</label><input type="number" min="0.5" max="23" step="0.5" value={days} onChange={(ev) => setDays(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Days/Month" /></div>
        <div><label className="block text-sm font-medium mb-2">Months/Year</label><input type="number" min="1" max="12" value={months} onChange={(ev) => setMonths(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Months/Year" /></div>
        <div><label className="block text-sm font-medium mb-2">Annual Expenses</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={expenses} onChange={(ev) => setExpenses(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Expenses" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Accountancy Fee</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={accountancy} onChange={(ev) => setAccountancy(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Accountancy Fee" /></div></div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={scotland} onChange={(ev) => setScotland(ev.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">I pay Scottish Income Tax (Class 4 NI is the same across the UK)</span></label>

      {r > 0 && d > 0 && m > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          {result.needsVAT && <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-center text-sm text-orange-800 dark:text-orange-300">Revenue exceeds £90K — you must register for VAT</div>}
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Annual Take-Home</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.takeHome)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.takeHome / 12)}/month &middot; {formatCurrency(result.hourlyTakeHome)}/hour effective</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Gross Revenue</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.grossRevenue)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Expenses + Accountancy</td><td className="text-right tabular-nums">-{formatCurrency(result.expenses + result.accountancyFee)}</td></tr>
              <tr className="border-b border-border font-medium"><td className="py-2">Net Profit</td><td className="text-right tabular-nums">{formatCurrency(result.netProfit)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income Tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.tax)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Class 4 NI (6%/2%)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.class4)}</td></tr>
              <tr className="font-semibold"><td className="py-2 text-primary">Take-Home</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.takeHome)}</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-center text-muted-foreground">Effective tax rate: {formatPercent(result.effectiveRate)} of gross revenue</p>
        </div>
      )}
    </div>
  )
}
