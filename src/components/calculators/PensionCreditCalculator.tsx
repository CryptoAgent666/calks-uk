import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Pension Credit 2026/27 (Guarantee Credit) — uprated from 6 April 2026
// Standard minimum guarantee uprated by earnings (4.8%); additional amounts by CPI (3.8%)
const SINGLE_GUARANTEE = 238.00 // weekly (was £227.10 in 2025/26)
const COUPLE_GUARANTEE = 363.25 // weekly (was £346.60 in 2025/26)

const SEVERE_DISABILITY = 86.05 // per qualifying person, 2026/27 (gov.uk; was £82.90 in 2025/26, +3.8% CPI)
const CARER_ADDITION = 48.15 // 2026/27 (was £46.40; DWP rounds these premiums to the nearest 5p)
const CAPITAL_DISREGARD = 10_000

// Savings Credit 2026/27 (DWP rates; State Pension Credit Act 2002 s.3 and Regs 2002 reg.7): 60% above the
// threshold, up to the maximum, less 40% of income above the appropriate minimum guarantee
const SC_THRESHOLD_SINGLE = 208.07
const SC_THRESHOLD_COUPLE = 329.75
const SC_MAX_SINGLE = 17.96
const SC_MAX_COUPLE = 20.10

// disabledCount / carerCount: how many people in the claim qualify for that amount (0, 1, or 2 for a couple)
function calculate(isSingle: boolean, weeklyIncome: number, weeklyPension: number, hasSavings: boolean, savings: number, disabledCount: number | boolean, carerCount: number | boolean, savingsCreditAge: boolean) {
  const guarantee = isSingle ? SINGLE_GUARANTEE : COUPLE_GUARANTEE
  const disabled = Math.min(Math.max(Number(disabledCount) || 0, 0), isSingle ? 1 : 2)
  const carers = Math.min(Math.max(Number(carerCount) || 0, 0), isSingle ? 1 : 2)
  let additionalAmount = disabled * SEVERE_DISABILITY // couple where both qualify: 2 x £86.05 = £172.10
  additionalAmount += carers * CARER_ADDITION // couple where both qualify: 2 x £48.15 = £96.30

  const totalGuarantee = guarantee + additionalAmount
  const totalIncome = weeklyIncome + weeklyPension

  // Savings: £1 a week deemed (tariff) income for every £500, or part of £500, over £10,000
  let deemedIncome = 0
  if (savings > CAPITAL_DISREGARD) deemedIncome = Math.ceil((savings - CAPITAL_DISREGARD) / 500)

  const assessableIncome = totalIncome + deemedIncome
  const guaranteeCredit = Math.max(0, totalGuarantee - assessableIncome)

  let savingsCredit = 0
  if (savingsCreditAge) {
    const threshold = isSingle ? SC_THRESHOLD_SINGLE : SC_THRESHOLD_COUPLE
    const maximum = isSingle ? SC_MAX_SINGLE : SC_MAX_COUPLE
    const amountA = Math.min(maximum, Math.max(0, assessableIncome - threshold) * 0.6)
    const amountB = Math.max(0, assessableIncome - totalGuarantee) * 0.4
    savingsCredit = Math.max(0, amountA - amountB)
  }

  const pensionCredit = guaranteeCredit + savingsCredit
  const annual = pensionCredit * 52
  const monthly = annual / 12

  return { guarantee: totalGuarantee, assessableIncome, guaranteeCredit, savingsCredit, pensionCredit, annual, monthly, eligible: pensionCredit > 0, deemedIncome }
}

export default function PensionCreditCalculator() {
  const [single, setSingle] = useState(true)
  const [income, setIncome] = useState('50')
  const [pension, setPension] = useState('150')
  const [hasSavings, setHasSavings] = useState(false)
  const [savings, setSavings] = useState('5000')
  const [disabled, setDisabled] = useState(0)
  const [carers, setCarers] = useState(0)
  const [savingsCreditAge, setSavingsCreditAge] = useState(false)
  const [coupleAge, setCoupleAge] = useState('both')

  const i = parseFloat(income) || 0
  const p = parseFloat(pension) || 0
  const s = parseFloat(savings.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(single, i, p, hasSavings, hasSavings ? s : 0, disabled, carers, savingsCreditAge), [single, i, p, hasSavings, s, disabled, carers, savingsCreditAge])
  // A couple qualifies only if both have reached State Pension age, or one gets Housing Benefit for people over that age
  const coupleBlocked = !single && coupleAge === 'blocked'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setSingle(true)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${single ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Single</button>
        <button onClick={() => setSingle(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${!single ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Couple</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Weekly State Pension</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={pension} onChange={(e) => setPension(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weekly State Pension" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Other Weekly Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Other Weekly Income" /></div></div>
      </div>
      <div className="space-y-2">
        {!single && (
          <div className="flex flex-wrap items-center gap-3"><label htmlFor="pc-age" className="text-sm">State Pension age</label><select id="pc-age" value={coupleAge} onChange={(e) => setCoupleAge(e.target.value)} className="rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="State Pension age"><option value="both">We have both reached it</option><option value="hb">One of us has not, but one of us gets Housing Benefit for people over State Pension age</option><option value="blocked">One of us has not, and neither gets that Housing Benefit</option></select></div>
        )}
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={hasSavings} onChange={(e) => setHasSavings(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Savings over £10,000</span></label>
        {hasSavings && <div className="ml-8"><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={savings} onChange={(e) => setSavings(e.target.value)} className="w-48 rounded-xl border border-input bg-background px-8 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Total savings" /></div></div>}
        {single ? (
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={disabled > 0} onChange={(e) => setDisabled(e.target.checked ? 1 : 0)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Severe disability (+£86.05/week)</span></label>
        ) : (
          <div className="flex items-center gap-3"><label htmlFor="pc-sda" className="text-sm">Severe disability amount</label><select id="pc-sda" value={disabled} onChange={(e) => setDisabled(parseInt(e.target.value) || 0)} className="rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Severe disability amount"><option value={0}>Neither of us</option><option value={1}>One of us (+£86.05/week)</option><option value={2}>Both of us (+£172.10/week)</option></select></div>
        )}
        {single ? (
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={carers > 0} onChange={(e) => setCarers(e.target.checked ? 1 : 0)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Carer (+£48.15/week)</span></label>
        ) : (
          <div className="flex items-center gap-3"><label htmlFor="pc-carer" className="text-sm">Carer amount</label><select id="pc-carer" value={carers} onChange={(e) => setCarers(parseInt(e.target.value) || 0)} className="rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Carer amount"><option value={0}>Neither of us</option><option value={1}>One of us (+£48.15/week)</option><option value={2}>Both of us (+£96.30/week)</option></select></div>
        )}
        {carers > 0 && <p className="ml-8 text-xs text-muted-foreground">Carer&apos;s Allowance counts as income, so if it is paid to you, include it in Other Weekly Income.</p>}
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={savingsCreditAge} onChange={(e) => setSavingsCreditAge(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">{single ? 'Reached' : 'One of us reached'} State Pension age before 6 April 2016 (Savings Credit)</span></label>
      </div>

      <div className={`rounded-2xl p-6 text-center ${result.eligible && !coupleBlocked ? 'bg-green-100 dark:bg-green-950' : 'bg-muted/50'}`}>
        {coupleBlocked ? (
          <p className="text-lg font-medium text-muted-foreground">A couple can usually get Pension Credit only if both partners have reached State Pension age, or one of them gets Housing Benefit for people over State Pension age</p>
        ) : result.eligible ? (
          <>
            <p className="text-sm text-muted-foreground">Estimated Weekly Pension Credit</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.pensionCredit)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthly)}/month &middot; {formatCurrency(result.annual)}/year</p>
            {result.savingsCredit > 0 && <p className="text-sm text-muted-foreground mt-1">Guarantee Credit {formatCurrency(result.guaranteeCredit)} + Savings Credit {formatCurrency(result.savingsCredit)} a week</p>}
          </>
        ) : (
          <p className="text-lg font-medium text-muted-foreground">Your income exceeds the Pension Credit guarantee level of {formatCurrency(result.guarantee)}/week</p>
        )}
      </div>

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>Guarantee Credit tops up weekly income to {formatCurrency(single ? SINGLE_GUARANTEE : COUPLE_GUARANTEE)}{single ? ' (single)' : ' (couple)'}.</p>
        <p className="mt-1">No upper savings limit (unlike Universal Credit). Savings over £10,000: £1/week deemed income for every £500 or part of £500.</p>
        <p className="mt-1">Savings Credit treats all income entered as qualifying, although a few benefits such as incapacity benefit and maternity allowance do not count. This estimate leaves out extra amounts for children and young people and for housing costs such as ground rent or service charges, so you may still qualify even if it shows nothing.</p>
      </div>
    </div>
  )
}
