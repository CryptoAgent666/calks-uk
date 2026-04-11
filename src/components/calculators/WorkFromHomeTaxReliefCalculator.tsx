import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// WFH tax relief options 2025/26
const FLAT_RATE_WEEKLY = 6 // £6/week without evidence
const FLAT_RATE_ANNUAL = FLAT_RATE_WEEKLY * 52

function calculate(taxBand: string, weeksWfh: number, useActual: boolean, actualCosts: number) {
  const taxRate = taxBand === 'higher' ? 0.40 : taxBand === 'additional' ? 0.45 : 0.20
  const claimAmount = useActual ? actualCosts : FLAT_RATE_WEEKLY * weeksWfh
  const taxRelief = claimAmount * taxRate

  return { claimAmount, taxRelief, taxRate: taxRate * 100, isFlat: !useActual }
}

export default function WorkFromHomeTaxReliefCalculator() {
  const [band, setBand] = useState('basic')
  const [weeks, setWeeks] = useState('48')
  const [useActual, setUseActual] = useState(false)
  const [actual, setActual] = useState('500')

  const w = parseInt(weeks) || 48
  const a = parseFloat(actual.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(band, w, useActual, a), [band, w, useActual, a])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Tax Band</label><select value={band} onChange={(e) => setBand(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"><option value="basic">Basic (20%)</option><option value="higher">Higher (40%)</option><option value="additional">Additional (45%)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Weeks Working from Home</label><input type="number" min="1" max="52" value={weeks} onChange={(e) => setWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={useActual} onChange={(e) => setUseActual(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Use actual costs (need receipts)</span></label>

      {useActual && (
        <div><label className="block text-sm font-medium mb-2">Actual Additional Costs (annual)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={actual} onChange={(e) => setActual(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      )}

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
          <p className="text-sm text-muted-foreground">Tax Relief (money back)</p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.taxRelief)}</p>
          <p className="text-sm text-muted-foreground mt-1">{result.taxRate}% of {formatCurrency(result.claimAmount)} claim</p>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">{result.isFlat ? 'Flat rate claim' : 'Actual costs claim'}:</p>
          {result.isFlat ? (
            <><p>£{FLAT_RATE_WEEKLY}/week flat rate x {w} weeks = {formatCurrency(result.claimAmount)}</p><p>No receipts needed. Claim via self-assessment or P87 form.</p></>
          ) : (
            <p>You'll need evidence of additional costs (e.g. higher energy bills) that are solely for work purposes.</p>
          )}
          <p>Your employer must require you to work from home — choosing to is not enough.</p>
        </div>
      </div>
    </div>
  )
}
