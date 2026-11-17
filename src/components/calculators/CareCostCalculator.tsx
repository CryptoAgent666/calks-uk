import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Care cost calculator — England means test, 2026/27 (LAC(DHSC)(2026)2), with Wales and
// Scotland options. Average self-funder fees: Lottie, January 2026 (as cited by Which?):
// residential £1,300/wk, nursing £1,512, residential dementia £1,375, live-in care £220/day
// (£1,540/wk), hourly home care £32/hr (so ~6 hours a week is about £200). These are
// assumptions: the source does not say whether the nursing figure includes the NHS
// contribution, and the calculator assumes it does.
const AVG_COSTS = {
  residential: { weekly: 1300, name: 'Residential Care', home: false },
  nursing: { weekly: 1512, name: 'Nursing Care', home: false },
  dementia: { weekly: 1375, name: 'Dementia Care (residential)', home: false },
  home_care: { weekly: 1540, name: 'Home Care (live-in)', home: true },
  domiciliary: { weekly: 200, name: 'Domiciliary (visiting, ~6 hrs/wk)', home: true },
}

type Nation = 'england' | 'wales' | 'scotland'

// England
const CAPITAL_UPPER = 23_250
const CAPITAL_LOWER = 14_250
const PEA = 31.80                  // Personal Expenses Allowance, care home residents (per week)
const MIG_PENSION_AGE = 241.45     // Minimum Income Guarantee, single, Pension Credit age (per week)
const MIG_UNDER_PENSION_AGE = 120.40 // MIG, single 25+ below Pension Credit age, before premiums
// NHS-funded nursing care (England) from 1 April 2026, paid by the NHS straight to the
// nursing home (DHSC, gov.uk news "Better community care thanks to nursing funding boost").
const FNC_STANDARD = 267.68
const FNC_HIGHER = 368.24
// Main home disregarded for the first 12 weeks of permanent care when other capital is
// below the upper limit (Care and support statutory guidance, Annex B; Wales code of practice).
const PROPERTY_DISREGARD_WEEKS = 12

// Wales (gov.wales/charging-social-care): care home capital limit £50,000 (single limit,
// no tariff), at least £46.35 a week kept; home care charge capped at £100 a week, capital
// limit £24,000 excluding the home.
const WALES_CARE_HOME_LIMIT = 50_000
const WALES_MIA = 46.35
const WALES_HOME_CARE_CAP = 100
const WALES_HOME_CARE_CAPITAL = 24_000

// Scotland (mygov.scot/personal-nursing-care/costs, from 1 April 2026): personal care is
// free; care home residents get £260.30 a week for personal care, £117.10 for nursing care.
const SCOT_PERSONAL_CARE = 260.30
const SCOT_NURSING_CARE = 117.10

function calculate(careType: string, savings: number, weeklyIncome: number, propertyValue: number, ownsHome: boolean, someoneInHome: boolean, pensionAge: boolean, nation: Nation = 'england', fncHigher = false) {
  const info = AVG_COSTS[careType as keyof typeof AVG_COSTS] || AVG_COSTS.residential
  const weeklyFee = info.weekly
  const annualCost = weeklyFee * 52
  const isHomeCare = info.home
  const isNursing = careType === 'nursing'

  // England: the NHS pays its nursing contribution to the home, so only the rest of the
  // fee is split between the resident and the council.
  const nhsNursing = nation === 'england' && isNursing ? (fncHigher ? FNC_HIGHER : FNC_STANDARD) : 0
  const weeklyCost = Math.max(0, weeklyFee - nhsNursing)

  const base = { info, weeklyFee, annualCost, isHomeCare, nation, nhsNursing, weeklyCost }

  // Scotland: free personal care. Only the self-funder position is modelled.
  if (nation === 'scotland') {
    if (isHomeCare) {
      return { ...base, mode: 'scotland_home' as const, youPay: 0, councilPays: 0, youPayIsMaximum: false, fundingType: 'Personal care at home is free in Scotland after a care needs assessment', protectedIncome: 0, tariffIncome: 0, totalCapital: savings, capitalLimit: 0, propertyCounted: false, first12: null, yearsCapitalLasts: 0, incomeContribution: 0 }
    }
    const councilPays = Math.min(weeklyFee, SCOT_PERSONAL_CARE + (isNursing ? SCOT_NURSING_CARE : 0))
    return { ...base, mode: 'scotland_care_home' as const, youPay: weeklyFee - councilPays, councilPays, youPayIsMaximum: false, fundingType: isNursing ? 'Paying your own fees: the council pays for personal and nursing care' : 'Paying your own fees: the council pays for personal care', protectedIncome: 0, tariffIncome: 0, totalCapital: savings, capitalLimit: 0, propertyCounted: false, first12: null, yearsCapitalLasts: 0, incomeContribution: 0 }
  }

  // Wales, care at home: charge capped at £100 a week.
  if (nation === 'wales' && isHomeCare) {
    const youPay = Math.min(weeklyCost, WALES_HOME_CARE_CAP)
    return { ...base, mode: 'wales_home' as const, youPay, councilPays: weeklyCost - youPay, youPayIsMaximum: true, fundingType: savings > WALES_HOME_CARE_CAPITAL ? 'Savings over £24,000: you may pay up to the £100 weekly maximum' : 'Charge depends on your disposable income, capped at £100 a week', protectedIncome: 0, tariffIncome: 0, totalCapital: savings, capitalLimit: WALES_HOME_CARE_CAPITAL, propertyCounted: false, first12: null, yearsCapitalLasts: 0, incomeContribution: 0 }
  }

  const capitalLimit = nation === 'wales' ? WALES_CARE_HOME_LIMIT : CAPITAL_UPPER

  // The home is ignored for care at home, and for a care home when a spouse,
  // partner or qualifying relative still lives there.
  const propertyCounted = ownsHome && !isHomeCare && !someoneInHome
  const totalCapital = savings + (propertyCounted ? propertyValue : 0)
  // 12-week property disregard on entering permanent care, if other capital is within the limit
  const disregardApplies = propertyCounted && propertyValue > 0 && savings <= capitalLimit

  // Income the person keeps: PEA (Wales: Minimum Income Amount) in a care home, MIG when care is at home
  const protectedIncome = nation === 'wales' ? WALES_MIA : isHomeCare ? (pensionAge ? MIG_PENSION_AGE : MIG_UNDER_PENSION_AGE) : PEA
  const incomeContribution = Math.max(0, weeklyIncome - protectedIncome)

  const assess = (capital: number) => {
    if (capital > capitalLimit) {
      return { youPay: weeklyCost, tariffIncome: 0, selfFunded: true, fundingType: `Self-funded (capital over £${capitalLimit.toLocaleString()})` }
    }
    if (nation === 'wales') {
      return { youPay: Math.min(weeklyCost, incomeContribution), tariffIncome: 0, selfFunded: false, fundingType: 'Council-supported (capital at or below £50,000)' }
    }
    // Tariff income: £1/week for every £250 or part of £250 above the lower limit
    const tariffIncome = capital > CAPITAL_LOWER ? Math.ceil((capital - CAPITAL_LOWER) / 250) : 0
    return { youPay: Math.min(weeklyCost, incomeContribution + tariffIncome), tariffIncome, selfFunded: false, fundingType: tariffIncome > 0 ? 'Means-tested (tariff income applies)' : 'Means-tested (capital below £14,250)' }
  }

  const later = assess(totalCapital)
  const early = disregardApplies ? assess(savings) : null
  const first12 = early ? { ...early, councilPays: weeklyCost - early.youPay } : null

  // Time until capital falls to the limit, after income covers part of the fee. Where the
  // home is disregarded for the first 12 weeks, self-funding only starts in week 13.
  const weeklyDrawOnCapital = Math.max(0, weeklyCost - incomeContribution)
  const yearsCapitalLasts = later.selfFunded && weeklyDrawOnCapital > 0
    ? (totalCapital - capitalLimit) / (weeklyDrawOnCapital * 52) + (first12 ? PROPERTY_DISREGARD_WEEKS / 52 : 0)
    : 0

  return { ...base, mode: 'means_test' as const, youPay: later.youPay, councilPays: weeklyCost - later.youPay, youPayIsMaximum: false, fundingType: later.fundingType, protectedIncome, tariffIncome: later.tariffIncome, totalCapital, capitalLimit, propertyCounted, first12, yearsCapitalLasts, incomeContribution }
}

export default function CareCostCalculator() {
  const [nation, setNation] = useState<Nation>('england')
  const [type, setType] = useState('residential')
  const [savings, setSavings] = useState('50000')
  const [income, setIncome] = useState('250')
  const [property, setProperty] = useState('250000')
  const [ownsHome, setOwnsHome] = useState(true)
  const [someoneInHome, setSomeoneInHome] = useState(false)
  const [pensionAge, setPensionAge] = useState(true)
  const [fncHigher, setFncHigher] = useState(false)

  const s = parseFloat(savings.replace(/,/g,'')) || 0
  const i = parseFloat(income) || 0
  const p = parseFloat(property.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(type, s, i, p, ownsHome, someoneInHome, pensionAge, nation, fncHigher), [type, s, i, p, ownsHome, someoneInHome, pensionAge, nation, fncHigher])

  const nations: { key: Nation; label: string }[] = [
    { key: 'england', label: 'England' },
    { key: 'wales', label: 'Wales' },
    { key: 'scotland', label: 'Scotland' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {nations.map((n) => (
          <button key={n.key} onClick={() => setNation(n.key)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${nation === n.key ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>{n.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Care Type</label><select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Care Type">{Object.entries(AVG_COSTS).map(([k,v]) => <option key={k} value={k}>{v.name} (~£{v.weekly.toLocaleString()}/wk)</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Savings / Capital</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={savings} onChange={(e) => setSavings(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Savings / Capital" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Weekly Income (pension etc.)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weekly Income (pension etc.)" /></div></div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={pensionAge} onChange={(e) => setPensionAge(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Reached Pension Credit age</span></label>
        {nation === 'england' && type === 'nursing' && (
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={fncHigher} onChange={(e) => setFncHigher(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">NHS pays the higher nursing rate (£{FNC_HIGHER.toFixed(2)}/wk): only if the NHS has told you that you qualify</span></label>
        )}
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
          <p className="text-sm text-muted-foreground">{result.info.name}: You Pay{result.first12 ? ' (from week 13)' : ''}</p>
          {result.mode === 'scotland_home'
            ? <p className="text-2xl font-bold text-destructive mt-1">Personal care is free</p>
            : <p className="text-3xl font-bold text-destructive mt-1">{result.youPayIsMaximum ? 'Up to ' : ''}{formatCurrency(result.youPay)}/week</p>}
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.weeklyFee)}/week, {formatCurrency(result.annualCost)}/year total cost{result.nhsNursing > 0 ? `, of which the NHS pays ${formatCurrency(result.nhsNursing)}/week` : ''}</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-4 text-center text-sm">
          <p className="font-medium">{result.fundingType}</p>
          {result.nhsNursing > 0 && <p className="text-muted-foreground mt-1">NHS-funded nursing care: {formatCurrency(result.nhsNursing)}/week, paid by the NHS straight to the home</p>}
          {result.councilPays > 0 && <p className="text-muted-foreground mt-1">Council contributes: {formatCurrency(result.councilPays)}/week</p>}
          {result.mode === 'means_test' && result.totalCapital <= result.capitalLimit && <p className="text-muted-foreground mt-1">You keep {formatCurrency(result.protectedIncome)}/week ({result.isHomeCare ? 'Minimum Income Guarantee' : nation === 'wales' ? 'Minimum Income Amount' : 'Personal Expenses Allowance'}){result.tariffIncome > 0 ? `; tariff income ${formatCurrency(result.tariffIncome)}/week` : ''}</p>}
          {result.first12 && <p className="text-muted-foreground mt-1">Weeks 1 to 12, while your home is disregarded: you pay {formatCurrency(result.first12.youPay)}/week and the council {formatCurrency(result.first12.councilPays)}/week. After that your home counts unless you agree a deferred payment.</p>}
          {result.yearsCapitalLasts > 0 && result.yearsCapitalLasts < 50 && <p className="text-muted-foreground mt-1">Capital falls to £{result.capitalLimit.toLocaleString()} in ~{result.yearsCapitalLasts.toFixed(1)} years{result.first12 ? ', counting the 12 disregarded weeks' : ''}, when council help starts</p>}
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          {nation === 'england' && <p>England, 2026/27. Capital over £{CAPITAL_UPPER.toLocaleString()}: self-funded. Below that, you pay from income above £{PEA.toFixed(2)}/week in a care home, or above the Minimum Income Guarantee (£{MIG_PENSION_AGE.toFixed(2)}/week at Pension Credit age, £{MIG_UNDER_PENSION_AGE.toFixed(2)} for a single person 25+ under it, before disability premiums) for care at home, plus £1/week for every £250 or part of £250 above £{CAPITAL_LOWER.toLocaleString()}. Your home is ignored for care at home, and for a care home if a partner or qualifying relative still lives there; otherwise it is disregarded for the first 12 weeks if your other capital is £{CAPITAL_UPPER.toLocaleString()} or less. In a nursing home the NHS pays NHS-funded nursing care (£{FNC_STANDARD.toFixed(2)}/week, or £{FNC_HIGHER.toFixed(2)} at the higher rate) straight to the home, and the calculator takes it off the fee.</p>}
          {nation === 'wales' && <p>Wales (gov.wales). Care home: capital over £{WALES_CARE_HOME_LIMIT.toLocaleString()} pays the full cost; at or below it the council helps and you pay from your income, keeping at least £{WALES_MIA.toFixed(2)}/week, with no lower limit or tariff income. Your home is treated as in England: ignored if a partner or qualifying relative lives there, otherwise disregarded for the first 12 weeks if your other capital is within the limit. Care at home: the charge is capped at £{WALES_HOME_CARE_CAP}/week, and with savings over £{WALES_HOME_CARE_CAPITAL.toLocaleString()} (home excluded) you may pay up to that maximum. The NHS nursing contribution in Wales is not included.</p>}
          {nation === 'scotland' && <p>Scotland, from 1 April 2026. Personal care is free at home after a care needs assessment, though councils may charge for other help such as housework. In a care home, a resident who pays their own fees gets £{SCOT_PERSONAL_CARE.toFixed(2)}/week towards personal care, plus £{SCOT_NURSING_CARE.toFixed(2)}/week for nursing care where it is needed. Scotland's means test for people who need more help with care home fees is not modelled here.</p>}
          <p className="mt-2">Fees are UK self-funder averages (Lottie, January 2026) used as assumptions, and vary widely by area. The source does not say whether the nursing average includes the NHS contribution; the calculator assumes it does.</p>
        </div>
      </div>
    </div>
  )
}
