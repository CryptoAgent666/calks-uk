import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Employee tax relief for the extra household costs of working from home ended on
// 6 April 2026 (s360B ITEPA 2003, inserted by FA 2026 s.21). Claims for the four previous tax
// years are still allowed, at £6 a week without receipts for costs, where the employer required
// homeworking (HMRC asks for evidence of that requirement; the 2022/23 year closes on 5 April 2027).
// Employers can still pay £6 a week (£26 a month) tax-free under s316A ITEPA 2003.
const FLAT_RATE_WEEKLY = 6
const EMPLOYER_TAX_FREE_MONTHLY = 26
const CLAIM_YEARS = ['2025-26', '2024-25', '2023-24', '2022-23']
const MAX_WEEKS = 52

function calculate(taxYear: string, taxBand: string, weeksWfh: number, useActual: boolean, actualCosts: number) {
  const taxRate = taxBand === 'higher' ? 0.40 : taxBand === 'additional' ? 0.45 : 0.20
  const reliefAvailable = CLAIM_YEARS.includes(taxYear)
  const claimAmount = reliefAvailable ? (useActual ? actualCosts : FLAT_RATE_WEEKLY * weeksWfh) : 0
  const taxRelief = claimAmount * taxRate
  const employerTaxFree = FLAT_RATE_WEEKLY * weeksWfh

  return { claimAmount, taxRelief, taxRate: taxRate * 100, isFlat: !useActual, reliefAvailable, employerTaxFree }
}

export default function WorkFromHomeTaxReliefCalculator() {
  const [taxYear, setTaxYear] = useState('2026-27')
  const [band, setBand] = useState('basic')
  const [weeks, setWeeks] = useState('48')
  const [useActual, setUseActual] = useState(false)
  const [actual, setActual] = useState('500')

  // A cleared or zero weeks field means no weeks, not the default 48; capped at 52 weeks a year
  const w = Math.min(MAX_WEEKS, Math.max(0, parseInt(weeks) || 0))
  const a = parseFloat(actual.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(taxYear, band, w, useActual, a), [taxYear, band, w, useActual, a])
  const needWeeks = w === 0 && (!result.reliefAvailable || result.isFlat)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Tax Year</label><select value={taxYear} onChange={(e) => setTaxYear(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Tax Year"><option value="2026-27">2026/27 (relief abolished)</option><option value="2025-26">2025/26 (backdated claim)</option><option value="2024-25">2024/25 (backdated claim)</option><option value="2023-24">2023/24 (backdated claim)</option><option value="2022-23">2022/23 (backdated claim)</option></select></div>
        <div>
          <label className="block text-sm font-medium mb-2">Tax Band</label>
          <select value={band} onChange={(e) => setBand(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Tax Band"><option value="basic">Basic (20%)</option><option value="higher">Higher (40%)</option><option value="additional">Additional (45%)</option></select>
          <p className="text-xs text-muted-foreground mt-1">Scottish taxpayers get relief at their own rates (19% to 48%), so the figures differ slightly.</p>
        </div>
        <div><label className="block text-sm font-medium mb-2">Weeks Working from Home</label><input type="number" min="0" max={MAX_WEEKS} value={weeks} onChange={(e) => setWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weeks Working from Home" /></div>
      </div>

      {result.reliefAvailable && (
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={useActual} onChange={(e) => setUseActual(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Use actual costs (need receipts)</span></label>
      )}

      {result.reliefAvailable && useActual && (
        <div><label className="block text-sm font-medium mb-2">Actual Additional Costs (annual)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={actual} onChange={(e) => setActual(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Actual Additional Costs (annual)" /></div></div>
      )}

      <div className="space-y-4 animate-fade-in-up">
        {result.reliefAvailable ? (
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Tax Relief (money back)</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.taxRelief)}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.taxRate}% of {formatCurrency(result.claimAmount)} claim</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Employee Tax Relief for 2026/27</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(0)}</p>
            <p className="text-sm text-muted-foreground mt-1">Abolished from 6 April 2026</p>
          </div>
        )}
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
          {needWeeks && <p className="font-medium text-foreground">Enter the number of weeks you worked from home (1 to {MAX_WEEKS}).</p>}
          {result.reliefAvailable ? (
            <>
              <p className="font-medium text-foreground">{result.isFlat ? 'Flat rate claim' : 'Actual costs claim'}:</p>
              {result.isFlat ? (
                <>
                  {w > 0 && <p>£{FLAT_RATE_WEEKLY}/week flat rate x {w} weeks = {formatCurrency(result.claimAmount)}</p>}
                  <p>No receipts for costs, but HMRC asks for evidence that you had to work from home; the 2022/23 year closes on 5 April 2027. Claim via Self Assessment or form P87.</p>
                </>
              ) : (
                <p>You'll need evidence of additional costs (e.g. higher energy bills) that are solely for work purposes.</p>
              )}
              <p>Your employer must have required you to work from home; choosing to is not enough.</p>
            </>
          ) : (
            <>
              <p className="font-medium text-foreground">What is still available:</p>
              <p>Your employer can pay you up to £{FLAT_RATE_WEEKLY} a week (£{EMPLOYER_TAX_FREE_MONTHLY} a month) tax-free towards homeworking costs{w > 0 && <>, which is {formatCurrency(result.employerTaxFree)} over {w} weeks</>}.</p>
              <p>You can still claim relief for 2022/23 to 2025/26 if your employer required you to work from home in those years. Pick one of those years above to see the value.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
