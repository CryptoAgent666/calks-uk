import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Care home cost calculator
const AVG_COSTS = {
  residential: { weekly: 800, name: 'Residential Care' },
  nursing: { weekly: 1100, name: 'Nursing Care' },
  dementia: { weekly: 1200, name: 'Dementia Care' },
  home_care: { weekly: 350, name: 'Home Care (live-in)' },
  domiciliary: { weekly: 200, name: 'Domiciliary (visiting)' },
}

const CAPITAL_UPPER = 23_250
const CAPITAL_LOWER = 14_250

function calculate(careType: string, savings: number, weeklyIncome: number, propertyValue: number, ownsHome: boolean) {
  const info = AVG_COSTS[careType as keyof typeof AVG_COSTS] || AVG_COSTS.residential
  const weeklyCost = info.weekly
  const annualCost = weeklyCost * 52

  const totalCapital = savings + (ownsHome && careType !== 'home_care' && careType !== 'domiciliary' ? propertyValue : 0)

  let fundingType: string
  let councilPays = 0
  if (totalCapital > CAPITAL_UPPER) {
    fundingType = 'Self-funded (capital over £23,250)'
    councilPays = 0
  } else if (totalCapital > CAPITAL_LOWER) {
    const tariffIncome = Math.floor((totalCapital - CAPITAL_LOWER) / 250) // £1/week per £250 above lower
    fundingType = 'Means-tested (tariff income applies)'
    councilPays = Math.max(0, weeklyCost - weeklyIncome - tariffIncome)
  } else {
    fundingType = 'Council-funded (capital below £14,250)'
    councilPays = Math.max(0, weeklyCost - weeklyIncome)
  }

  const youPay = weeklyCost - councilPays
  const yearsCapitalLasts = totalCapital > 0 ? totalCapital / (youPay * 52) : 0

  return { weeklyCost, annualCost, totalCapital, fundingType, councilPays, youPay, yearsCapitalLasts, info }
}

export default function CareCostCalculator() {
  const [type, setType] = useState('residential')
  const [savings, setSavings] = useState('50000')
  const [income, setIncome] = useState('250')
  const [property, setProperty] = useState('250000')
  const [ownsHome, setOwnsHome] = useState(true)

  const s = parseFloat(savings.replace(/,/g,'')) || 0
  const i = parseFloat(income) || 0
  const p = parseFloat(property.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(type, s, i, p, ownsHome), [type, s, i, p, ownsHome])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Care Type</label><select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring">{Object.entries(AVG_COSTS).map(([k,v]) => <option key={k} value={k}>{v.name} (~£{v.weekly}/wk)</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Savings / Capital</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={savings} onChange={(e) => setSavings(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Weekly Income (pension etc.)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={ownsHome} onChange={(e) => setOwnsHome(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Owns property</span></label>
        {ownsHome && <div className="ml-8"><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={property} onChange={(e) => setProperty(e.target.value)} placeholder="Property value" className="w-48 rounded-xl border border-input bg-background px-8 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>}
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-destructive/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">{result.info.name} — You Pay</p>
          <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.youPay)}/week</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.annualCost)}/year total cost</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-4 text-center text-sm">
          <p className="font-medium">{result.fundingType}</p>
          {result.councilPays > 0 && <p className="text-muted-foreground mt-1">Council contributes: {formatCurrency(result.councilPays)}/week</p>}
          {result.yearsCapitalLasts > 0 && result.yearsCapitalLasts < 50 && <p className="text-muted-foreground mt-1">Your capital lasts ~{result.yearsCapitalLasts.toFixed(1)} years at this rate</p>}
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Capital over £{CAPITAL_UPPER.toLocaleString()}: self-funded. Below £{CAPITAL_LOWER.toLocaleString()}: council-funded. Between: means-tested (£1/week per £250 above £{CAPITAL_LOWER.toLocaleString()}). Property excluded if spouse still living there or you receive home care.</p>
        </div>
      </div>
    </div>
  )
}
