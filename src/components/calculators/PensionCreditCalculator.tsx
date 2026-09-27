import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Pension Credit 2026/27 (Guarantee Credit) — uprated from 6 April 2026
// Standard minimum guarantee uprated by earnings (4.8%); additional amounts by CPI (3.8%)
const SINGLE_GUARANTEE = 238.00 // weekly (was £227.10 in 2025/26)
const COUPLE_GUARANTEE = 363.25 // weekly (was £346.60 in 2025/26)

const SEVERE_DISABILITY = 86.05 // per qualifying person, 2026/27 (gov.uk; was £82.90 in 2025/26, +3.8% CPI)
const CARER_ADDITION = 48.15 // 2026/27 (was £46.40; DWP rounds these premiums to the nearest 5p)
const CAPITAL_DISREGARD = 10_000

// disabledCount: how many people in the claim qualify for the severe disability amount (0, 1, or 2 for a couple)
function calculate(isSingle: boolean, weeklyIncome: number, weeklyPension: number, hasSavings: boolean, savings: number, disabledCount: number | boolean, hasCarer: boolean) {
  const guarantee = isSingle ? SINGLE_GUARANTEE : COUPLE_GUARANTEE
  const disabled = Math.min(Math.max(Number(disabledCount) || 0, 0), isSingle ? 1 : 2)
  let additionalAmount = disabled * SEVERE_DISABILITY // couple where both qualify: 2 x £86.05 = £172.10
  if (hasCarer) additionalAmount += CARER_ADDITION

  const totalGuarantee = guarantee + additionalAmount
  const totalIncome = weeklyIncome + weeklyPension

  // Savings: £1 a week deemed (tariff) income for every £500, or part of £500, over £10,000
  let deemedIncome = 0
  if (savings > CAPITAL_DISREGARD) deemedIncome = Math.ceil((savings - CAPITAL_DISREGARD) / 500)

  const assessableIncome = totalIncome + deemedIncome
  const pensionCredit = Math.max(0, totalGuarantee - assessableIncome)

  const annual = pensionCredit * 52
  const monthly = annual / 12

  return { guarantee: totalGuarantee, assessableIncome, pensionCredit, annual, monthly, eligible: pensionCredit > 0, deemedIncome }
}

export default function PensionCreditCalculator() {
  const [single, setSingle] = useState(true)
  const [income, setIncome] = useState('50')
  const [pension, setPension] = useState('150')
  const [hasSavings, setHasSavings] = useState(false)
  const [savings, setSavings] = useState('5000')
  const [disabled, setDisabled] = useState(0)
  const [carer, setCarer] = useState(false)

  const i = parseFloat(income) || 0
  const p = parseFloat(pension) || 0
  const s = parseFloat(savings.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(single, i, p, hasSavings, hasSavings ? s : 0, disabled, carer), [single, i, p, hasSavings, s, disabled, carer])

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
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={hasSavings} onChange={(e) => setHasSavings(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Savings over £10,000</span></label>
        {hasSavings && <div className="ml-8"><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={savings} onChange={(e) => setSavings(e.target.value)} className="w-48 rounded-xl border border-input bg-background px-8 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Total savings" /></div></div>}
        {single ? (
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={disabled > 0} onChange={(e) => setDisabled(e.target.checked ? 1 : 0)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Severe disability (+£86.05/week)</span></label>
        ) : (
          <div className="flex items-center gap-3"><label htmlFor="pc-sda" className="text-sm">Severe disability amount</label><select id="pc-sda" value={disabled} onChange={(e) => setDisabled(parseInt(e.target.value) || 0)} className="rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Severe disability amount"><option value={0}>Neither of us</option><option value={1}>One of us (+£86.05/week)</option><option value={2}>Both of us (+£172.10/week)</option></select></div>
        )}
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={carer} onChange={(e) => setCarer(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Carer</span></label>
      </div>

      <div className={`rounded-2xl p-6 text-center ${result.eligible ? 'bg-green-100 dark:bg-green-950' : 'bg-muted/50'}`}>
        {result.eligible ? (
          <>
            <p className="text-sm text-muted-foreground">Estimated Weekly Pension Credit</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.pensionCredit)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthly)}/month &middot; {formatCurrency(result.annual)}/year</p>
          </>
        ) : (
          <p className="text-lg font-medium text-muted-foreground">Your income exceeds the Pension Credit guarantee level of {formatCurrency(result.guarantee)}/week</p>
        )}
      </div>

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>Guarantee Credit tops up weekly income to {formatCurrency(single ? SINGLE_GUARANTEE : COUPLE_GUARANTEE)}{single ? ' (single)' : ' (couple)'}.</p>
        <p className="mt-1">No upper savings limit (unlike Universal Credit). Savings over £10,000: £1/week deemed income for every £500 or part of £500.</p>
      </div>
    </div>
  )
}
