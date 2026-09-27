import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Care cost calculator — England means test, 2026/27 (LAC(DHSC)(2026)2).
// Average self-funder fees: Lottie, January 2026 (as cited by Which?): residential
// £1,300/wk, nursing £1,512, residential dementia £1,375, live-in care £220/day
// (£1,540/wk), hourly home care £32/hr (so ~6 hours a week is about £200).
const AVG_COSTS = {
  residential: { weekly: 1300, name: 'Residential Care', home: false },
  nursing: { weekly: 1512, name: 'Nursing Care', home: false },
  dementia: { weekly: 1375, name: 'Dementia Care (residential)', home: false },
  home_care: { weekly: 1540, name: 'Home Care (live-in)', home: true },
  domiciliary: { weekly: 200, name: 'Domiciliary (visiting, ~6 hrs/wk)', home: true },
}

const CAPITAL_UPPER = 23_250
const CAPITAL_LOWER = 14_250
const PEA = 31.80                  // Personal Expenses Allowance, care home residents (per week)
const MIG_PENSION_AGE = 241.45     // Minimum Income Guarantee, single, Pension Credit age (per week)
const MIG_UNDER_PENSION_AGE = 120.40 // MIG, single 25+ below Pension Credit age, before premiums

function calculate(careType: string, savings: number, weeklyIncome: number, propertyValue: number, ownsHome: boolean, someoneInHome: boolean, pensionAge: boolean) {
  const info = AVG_COSTS[careType as keyof typeof AVG_COSTS] || AVG_COSTS.residential
  const weeklyCost = info.weekly
  const annualCost = weeklyCost * 52
  const isHomeCare = info.home

  // The home is ignored for care at home, and for a care home when a spouse,
  // partner or qualifying relative still lives there.
  const propertyCounted = ownsHome && !isHomeCare && !someoneInHome
  const totalCapital = savings + (propertyCounted ? propertyValue : 0)

  // Income the person keeps: PEA in a care home, MIG when care is at home
  const protectedIncome = isHomeCare ? (pensionAge ? MIG_PENSION_AGE : MIG_UNDER_PENSION_AGE) : PEA
  const incomeContribution = Math.max(0, weeklyIncome - protectedIncome)

  // Tariff income: £1/week for every £250 or part of £250 above the lower limit
  const tariffIncome = totalCapital > CAPITAL_LOWER ? Math.ceil((Math.min(totalCapital, CAPITAL_UPPER) - CAPITAL_LOWER) / 250) : 0

  let fundingType: string
  let youPay: number
  if (totalCapital > CAPITAL_UPPER) {
    fundingType = 'Self-funded (capital over £23,250)'
    youPay = weeklyCost
  } else {
    youPay = Math.min(weeklyCost, incomeContribution + tariffIncome)
    fundingType = tariffIncome > 0 ? 'Means-tested (tariff income applies)' : 'Means-tested (capital below £14,250)'
  }
  const councilPays = weeklyCost - youPay

  // Time until capital falls to the upper limit, after income covers part of the fee
  const weeklyDrawOnCapital = Math.max(0, weeklyCost - incomeContribution)
  const yearsCapitalLasts = totalCapital > CAPITAL_UPPER && weeklyDrawOnCapital > 0 ? (totalCapital - CAPITAL_UPPER) / (weeklyDrawOnCapital * 52) : 0

  return { weeklyCost, annualCost, totalCapital, propertyCounted, protectedIncome, incomeContribution, tariffIncome, fundingType, councilPays, youPay, yearsCapitalLasts, isHomeCare, info }
}

export default function CareCostCalculator() {
  const [type, setType] = useState('residential')
  const [savings, setSavings] = useState('50000')
  const [income, setIncome] = useState('250')
  const [property, setProperty] = useState('250000')
  const [ownsHome, setOwnsHome] = useState(true)
  const [someoneInHome, setSomeoneInHome] = useState(false)
  const [pensionAge, setPensionAge] = useState(true)

  const s = parseFloat(savings.replace(/,/g,'')) || 0
  const i = parseFloat(income) || 0
  const p = parseFloat(property.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(type, s, i, p, ownsHome, someoneInHome, pensionAge), [type, s, i, p, ownsHome, someoneInHome, pensionAge])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Care Type</label><select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Care Type">{Object.entries(AVG_COSTS).map(([k,v]) => <option key={k} value={k}>{v.name} (~£{v.weekly.toLocaleString()}/wk)</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Savings / Capital</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={savings} onChange={(e) => setSavings(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Savings / Capital" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Weekly Income (pension etc.)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weekly Income (pension etc.)" /></div></div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={pensionAge} onChange={(e) => setPensionAge(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Reached Pension Credit age</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={ownsHome} onChange={(e) => setOwnsHome(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Owns property</span></label>
        {ownsHome && (
          <div className="ml-8 space-y-2">
            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={property} onChange={(e) => setProperty(e.target.value)} placeholder="Property value" className="w-48 rounded-xl border border-input bg-background px-8 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Property value" /></div>
            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={someoneInHome} onChange={(e) => setSomeoneInHome(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Spouse/partner or qualifying relative still lives in the home</span></label>
          </div>
        )}
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-destructive/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">{result.info.name}: You Pay</p>
          <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.youPay)}/week</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.weeklyCost)}/week, {formatCurrency(result.annualCost)}/year total cost</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-4 text-center text-sm">
          <p className="font-medium">{result.fundingType}</p>
          {result.councilPays > 0 && <p className="text-muted-foreground mt-1">Council contributes: {formatCurrency(result.councilPays)}/week</p>}
          {result.totalCapital <= CAPITAL_UPPER && <p className="text-muted-foreground mt-1">You keep {formatCurrency(result.protectedIncome)}/week ({result.isHomeCare ? 'Minimum Income Guarantee' : 'Personal Expenses Allowance'}){result.tariffIncome > 0 ? `; tariff income ${formatCurrency(result.tariffIncome)}/week` : ''}</p>}
          {result.yearsCapitalLasts > 0 && result.yearsCapitalLasts < 50 && <p className="text-muted-foreground mt-1">Council help starts in ~{result.yearsCapitalLasts.toFixed(1)} years, when capital falls to £{CAPITAL_UPPER.toLocaleString()}</p>}
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>England, 2026/27. Capital over £{CAPITAL_UPPER.toLocaleString()}: self-funded. Below that, you pay from income above £{PEA.toFixed(2)}/week in a care home, or above the Minimum Income Guarantee (£{MIG_PENSION_AGE.toFixed(2)}/week at Pension Credit age, £{MIG_UNDER_PENSION_AGE.toFixed(2)} for a single person 25+ under it, before disability premiums) for care at home, plus £1/week for every £250 or part of £250 above £{CAPITAL_LOWER.toLocaleString()}. Your home is ignored for care at home, and for a care home if a partner or qualifying relative still lives there; otherwise it is disregarded for the first 12 weeks. Fees are UK self-funder averages (Lottie, January 2026) and vary widely by area.</p>
        </div>
      </div>
    </div>
  )
}
