import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const TUITION_FEE = 9_790 // 2026/27 England undergraduate tuition fee cap (raised from £9,535)
const MAINTENANCE_LOANS: Record<string, Record<string, number>> = {
  home: { london: 14_135, other: 10_830, parents: 9_118 },
  away: { london: 14_135, other: 10_830, parents: 9_118 },
}

function calculate(years: number, location: string, livingWith: string, monthlySpending: number) {
  const tuitionTotal = TUITION_FEE * years
  const maintenanceLoan = MAINTENANCE_LOANS.away[location === 'london' ? 'london' : 'other'] || 10_830
  const totalMaintenanceLoan = maintenanceLoan * years

  const monthlyLiving = monthlySpending * 9 // ~9 months per academic year
  const totalLiving = monthlyLiving * years
  const totalDebt = tuitionTotal + totalMaintenanceLoan
  const shortfall = Math.max(0, totalLiving - totalMaintenanceLoan) * years / years

  // Repayment estimate (Plan 5: 9% above £25,000, 40 year term)
  const repaymentThreshold = 25_000
  const repaymentRate = 0.09

  return { tuitionTotal, maintenanceLoan, totalMaintenanceLoan, totalLiving, totalDebt, shortfall, monthlyLiving, tuitionPerYear: TUITION_FEE, repaymentThreshold, repaymentRate }
}

export default function UniversityCostCalculator() {
  const [years, setYears] = useState('3')
  const [location, setLocation] = useState('other')
  const [spending, setSpending] = useState('900')

  const y = parseInt(years) || 3
  const s = parseFloat(spending) || 0
  const result = useMemo(() => calculate(y, location, 'away', s), [y, location, s])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Course Length (years)</label><select value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Course Length (years)"><option value="3">3 years</option><option value="4">4 years (incl. placement)</option><option value="5">5 years (medicine etc.)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Location</label><select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Location"><option value="london">London</option><option value="other">Outside London</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Monthly Spending</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={spending} onChange={(e) => setSpending(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Spending" /></div></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-destructive/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Total Student Debt</p>
          <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.totalDebt)}</p>
          <p className="text-sm text-muted-foreground mt-1">Tuition + maintenance loans over {y} years</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2">Tuition fees ({y} x {formatCurrency(result.tuitionPerYear)})</td><td className="text-right tabular-nums">{formatCurrency(result.tuitionTotal)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Maintenance loan ({y} x {formatCurrency(result.maintenanceLoan)})</td><td className="text-right tabular-nums">{formatCurrency(result.totalMaintenanceLoan)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Living costs ({y} x 9 months)</td><td className="text-right tabular-nums">{formatCurrency(result.totalLiving)}</td></tr>
            <tr className="font-semibold"><td className="py-2">Total Debt (loans only)</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.totalDebt)}</td></tr>
          </tbody>
        </table>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Plan 5 repayment: 9% of earnings above £{result.repaymentThreshold.toLocaleString()}. Wiped after 40 years. Interest: RPI + up to 3%.</p>
          <p className="mt-1">Most graduates won't repay in full — treat it like a graduate tax, not a traditional loan.</p>
        </div>
      </div>
    </div>
  )
}
