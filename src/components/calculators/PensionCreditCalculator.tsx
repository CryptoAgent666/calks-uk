import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Pension Credit 2026/27 (Guarantee Credit) — uprated April 2025
// Single/couple uprated by earnings (triple lock ~4.1%); additional amounts by CPI 1.7%
const SINGLE_GUARANTEE = 227.10 // weekly (was £218.15 in 2024/25)
const COUPLE_GUARANTEE = 346.60 // weekly (was £332.95 in 2024/25)

function calculate(isSingle: boolean, weeklyIncome: number, weeklyPension: number, hasSavings: boolean, savings: number, hasDisability: boolean, hasCarer: boolean) {
  const guarantee = isSingle ? SINGLE_GUARANTEE : COUPLE_GUARANTEE
  let additionalAmount = 0
  if (hasDisability) additionalAmount += 84.65 // severe disability (was £81.50 in 2024/25, uprated 1.7% CPI + adjustment)
  if (hasCarer) additionalAmount += 46.40 // carer addition (was £45.60 in 2024/25, uprated 1.7% CPI)

  const totalGuarantee = guarantee + additionalAmount
  const totalIncome = weeklyIncome + weeklyPension

  // Savings: £1 deemed income per £500 over £10,000
  let deemedIncome = 0
  if (savings > 10_000) deemedIncome = Math.floor((savings - 10_000) / 500)

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
  const [disability, setDisability] = useState(false)
  const [carer, setCarer] = useState(false)

  const i = parseFloat(income) || 0
  const p = parseFloat(pension) || 0
  const s = parseFloat(savings.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(single, i, p, hasSavings, hasSavings ? s : 0, disability, carer), [single, i, p, hasSavings, s, disability, carer])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setSingle(true)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${single ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Single</button>
        <button onClick={() => setSingle(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${!single ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Couple</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Weekly State Pension</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={pension} onChange={(e) => setPension(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Other Weekly Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={hasSavings} onChange={(e) => setHasSavings(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Savings over £10,000</span></label>
        {hasSavings && <div className="ml-8"><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={savings} onChange={(e) => setSavings(e.target.value)} className="w-48 rounded-xl border border-input bg-background px-8 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>}
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={disability} onChange={(e) => setDisability(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Severe disability</span></label>
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
        <p className="mt-1">No upper savings limit (unlike Universal Credit). Savings over £10,000: £1/week deemed income per £500.</p>
      </div>
    </div>
  )
}
