import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Simplified Housing Benefit / UC Housing Element
function calculate(weeklyRent: number, lhaRate: number, isSingle: boolean, age: number, bedrooms: number, weeklyIncome: number, pensionAge: boolean) {
  const eligibleRent = Math.min(weeklyRent, lhaRate)

  // Under 35 single: shared accommodation rate
  const sharedRate = isSingle && age < 35

  // Bedroom tax for social tenants
  const excessBedrooms = 0 // simplified

  // Taper: 65% of excess income (for HB) or 55% for UC
  // Weekly personal allowance 2026/27: working age 25+ £95.55 / couple £150.15; State Pension age
  // (reached after 1 Apr 2021) £238.00 / £363.25, the same as the Pension Credit guarantee
  const applicableAmount = pensionAge ? (isSingle ? 238.00 : 363.25) : (isSingle ? 95.55 : 150.15)
  const excessIncome = Math.max(0, weeklyIncome - applicableAmount)
  const taper = excessIncome * 0.65

  const weeklyHB = Math.max(0, eligibleRent - taper)
  const monthlyHB = weeklyHB * 52 / 12
  const annualHB = weeklyHB * 52

  return { eligibleRent, weeklyHB, monthlyHB, annualHB, taper, applicableAmount, sharedRate }
}

export default function HousingBenefitCalculator() {
  const [rent, setRent] = useState('200')
  const [lha, setLha] = useState('230')
  const [single, setSingle] = useState(true)
  const [age, setAge] = useState('30')
  const [income, setIncome] = useState('100')
  const [pensioner, setPensioner] = useState(false)

  const r = parseFloat(rent) || 0
  const l = parseFloat(lha) || 0
  const a = parseInt(age) || 30
  const i = parseFloat(income) || 0
  const result = useMemo(() => calculate(r, l, single, a, 1, i, pensioner), [r, l, single, a, i, pensioner])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Weekly Rent</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={rent} onChange={(e) => setRent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weekly Rent" /></div></div>
        <div><label className="block text-sm font-medium mb-2">LHA Rate (weekly)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={lha} onChange={(e) => setLha(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="LHA Rate (weekly)" /></div><p className="text-xs text-muted-foreground mt-1">Check at lha-direct.voa.gov.uk</p></div>
        <div><label className="block text-sm font-medium mb-2">Weekly Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weekly Income" /></div></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setSingle(true)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${single ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Single</button>
        <button onClick={() => setSingle(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${!single ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Couple</button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setPensioner(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${!pensioner ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Working age</button>
        <button onClick={() => setPensioner(true)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${pensioner ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>State Pension age</button>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Weekly Housing Benefit</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.weeklyHB)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyHB)}/month</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2">Weekly Rent</td><td className="text-right tabular-nums">{formatCurrency(r)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">LHA Cap</td><td className="text-right tabular-nums">{formatCurrency(l)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Eligible Rent</td><td className="text-right tabular-nums">{formatCurrency(result.eligibleRent)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Applicable Amount</td><td className="text-right tabular-nums">{formatCurrency(result.applicableAmount)}</td></tr>
            {result.taper > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income Taper (65%)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.taper)}</td></tr>}
            <tr className="font-semibold"><td className="py-2 text-primary">Housing Benefit</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.weeklyHB)}</td></tr>
          </tbody>
        </table>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Simplified estimate. Working-age claims now mostly go through the Universal Credit housing element, so new Housing Benefit claims are mainly from people over State Pension age. LHA rates vary by area and bedrooms.</p>
        </div>
      </div>
    </div>
  )
}
