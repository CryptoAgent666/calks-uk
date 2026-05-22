import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(targetTakeHome: number, workingDays: number, insideIR35: boolean) {
  if (insideIR35) {
    // Inside IR35: need to gross up for PAYE + employee NI + employer NI
    // Iterative approach
    let dayRate = targetTakeHome / workingDays * 2 // initial guess
    for (let i = 0; i < 20; i++) {
      const gross = dayRate * workingDays
      const employerNI = Math.max(0, (gross - 5000) * 0.15)
      const netBeforeTax = gross - employerNI
      const tax = calcTax(netBeforeTax)
      const ni = calcNI(netBeforeTax)
      const takeHome = netBeforeTax - tax - ni
      const diff = targetTakeHome - takeHome
      dayRate += diff / workingDays * 0.5
    }
    const gross = dayRate * workingDays
    const employerNI = Math.max(0, (gross - 5000) * 0.15)
    const netGross = gross - employerNI
    const tax = calcTax(netGross)
    const ni = calcNI(netGross)
    return { dayRate: Math.ceil(dayRate / 5) * 5, annualGross: gross, tax, ni, employerNI, takeHome: netGross - tax - ni }
  }

  // Outside IR35: Ltd company, salary + dividends
  const optSalary = 12570
  const annualRevenue = targetTakeHome * 1.25 // rough 25% overhead
  const dayRate = annualRevenue / workingDays
  const corpTax = (annualRevenue - optSalary) * 0.19
  const dividends = annualRevenue - optSalary - corpTax
  const divTax = Math.max(0, dividends - 500) * 0.0875
  const takeHome = optSalary + dividends - divTax

  return { dayRate: Math.ceil(dayRate / 5) * 5, annualGross: annualRevenue, takeHome, corpTax, divTax }
}

function calcTax(income: number) {
  let pa = 12570
  if (income > 100000) pa = Math.max(0, 12570 - Math.floor((income - 100000) / 2))
  let t = 0
  if (income > pa) {
    if (income <= 50270) t = (income - pa) * 0.20
    else if (income <= 125140) t = (50270 - pa) * 0.20 + (income - 50270) * 0.40
    else t = (50270 - pa) * 0.20 + (125140 - 50270) * 0.40 + (income - 125140) * 0.45
  }
  return t
}

function calcNI(income: number) {
  if (income <= 12570) return 0
  if (income <= 50270) return (income - 12570) * 0.08
  return (50270 - 12570) * 0.08 + (income - 50270) * 0.02
}

export default function ContractorDayRateCalculator() {
  const [target, setTarget] = useState('60000')
  const [days, setDays] = useState('220')
  const [ir35, setIr35] = useState(false)

  const t = parseFloat(target.replace(/,/g, '')) || 0
  const d = parseInt(days) || 220
  const result = useMemo(() => calculate(t, d, ir35), [t, d, ir35])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Target Annual Take-Home</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="60,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Target Annual Take-Home" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Working Days/Year</label>
          <input type="number" min="100" max="260" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Working Days/Year" /></div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={ir35} onChange={(e) => setIr35(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">Inside IR35 (taxed as employment)</span>
      </label>

      {t > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Minimum Day Rate Needed</p>
            <p className="text-4xl font-bold text-primary mt-1">£{result.dayRate}</p>
            <p className="text-sm text-muted-foreground mt-1">{ir35 ? 'Inside IR35' : 'Outside IR35 (Ltd company)'}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Revenue</p><p className="text-lg font-bold">{formatCurrency(result.annualGross)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Take-Home</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.takeHome)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
