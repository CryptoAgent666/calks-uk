import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

function calculate(dayRate: number, daysPerYear: number, umbrellaMargin: number, pensionPct: number) {
  const grossRevenue = dayRate * daysPerYear
  const employerNI = Math.max(0, (grossRevenue - 5_000) * 0.15)
  const apprenticeshipLevy = grossRevenue > 3_000_000 / 12 * daysPerYear / 220 ? grossRevenue * 0.005 : 0
  const umbrellaFee = umbrellaMargin * 12

  const grossSalary = grossRevenue - employerNI - apprenticeshipLevy - umbrellaFee
  const pension = grossSalary * (pensionPct / 100)

  let pa = 12_570
  if (grossSalary > 100_000) pa = Math.max(0, 12_570 - Math.floor((grossSalary - 100_000) / 2))
  let tax = 0
  if (grossSalary > pa) {
    if (grossSalary <= 50_270) tax = (grossSalary - pa) * 0.20
    else if (grossSalary <= 125_140) tax = (50_270 - pa) * 0.20 + (grossSalary - 50_270) * 0.40
    else tax = (50_270 - pa) * 0.20 + (125_140 - 50_270) * 0.40 + (grossSalary - 125_140) * 0.45
  }

  let ni = 0
  if (grossSalary > 12_570) {
    if (grossSalary <= 50_270) ni = (grossSalary - 12_570) * 0.08
    else ni = (50_270 - 12_570) * 0.08 + (grossSalary - 50_270) * 0.02
  }

  const takeHome = grossSalary - tax - ni - pension
  const effectiveRate = grossRevenue > 0 ? ((grossRevenue - takeHome) / grossRevenue) * 100 : 0

  return { grossRevenue, employerNI, umbrellaFee, grossSalary, tax, ni, pension, takeHome, effectiveRate }
}

export default function UmbrellaCompanyCalculator() {
  const [rate, setRate] = useState('400')
  const [days, setDays] = useState('220')
  const [margin, setMargin] = useState('25')
  const [pensionPct, setPensionPct] = useState('5')

  const r = parseFloat(rate) || 0
  const d = parseInt(days) || 220
  const m = parseFloat(margin) || 0
  const p = parseFloat(pensionPct) || 0
  const result = useMemo(() => calculate(r, d, m, p), [r, d, m, p])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Day Rate</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Day Rate" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Days/Year</label><input type="number" min="100" max="260" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Days/Year" /></div>
        <div><label className="block text-sm font-medium mb-2">Umbrella Margin (£/wk)</label><input type="number" min="0" max="100" value={margin} onChange={(e) => setMargin(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Umbrella Margin (£/wk)" /></div>
        <div><label className="block text-sm font-medium mb-2">Pension (%)</label><input type="number" min="0" max="20" step="0.5" value={pensionPct} onChange={(e) => setPensionPct(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Pension (%)" /></div>
      </div>

      {r > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Annual Take-Home Pay</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.takeHome)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.takeHome / 12)}/month &middot; Effective deduction: {formatPercent(result.effectiveRate)}</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Gross Revenue ({d} days x £{r})</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.grossRevenue)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Employer NI (15%)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.employerNI)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Umbrella Fee</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.umbrellaFee)}</td></tr>
              <tr className="border-b border-border font-medium"><td className="py-2">Gross Salary</td><td className="text-right tabular-nums">{formatCurrency(result.grossSalary)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income Tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.tax)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Employee NI</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.ni)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Pension ({pensionPct}%)</td><td className="text-right tabular-nums">-{formatCurrency(result.pension)}</td></tr>
              <tr className="font-semibold"><td className="py-2 text-primary">Take-Home</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.takeHome)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
