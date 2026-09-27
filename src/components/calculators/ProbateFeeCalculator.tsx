import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Probate fees, England & Wales (HMCTS), from 6 July 2026 (S.I. 2026/642).
// Application fee £526 for estates over £5,000 (same for personal and solicitor
// applications). Copies of the grant: £2 each when ordered with the application,
// £16 each if ordered later. Source: gov.uk/applying-for-probate/fees.
const APPLICATION_FEE = 526
const FEE_THRESHOLD = 5_000
const COPY_FEE_WITH_APPLICATION = 2
const COPY_FEE_LATER = 16

function calculate(estateValue: number, copies: number) {
  // No fee if the net estate is £5,000 or less
  const needsProbate = estateValue > FEE_THRESHOLD
  const applicationFee = needsProbate ? APPLICATION_FEE : 0
  const copiesCount = Math.max(0, Math.floor(copies))
  const extraCopies = needsProbate ? copiesCount * COPY_FEE_WITH_APPLICATION : 0
  const extraCopiesIfLater = needsProbate ? copiesCount * COPY_FEE_LATER : 0

  // Solicitor fees (approximate)
  const solicitorFeePct = 1.5 // typical 1-2% of estate
  const solicitorFee = estateValue * (solicitorFeePct / 100)

  return { estateValue, needsProbate, applicationFee, copies: copiesCount, extraCopies, extraCopiesIfLater, solicitorFee, totalDIY: applicationFee + extraCopies, totalWithSolicitor: applicationFee + extraCopies + solicitorFee }
}

export default function ProbateFeeCalculator() {
  const [estate, setEstate] = useState('')
  const [copies, setCopies] = useState('3')
  const val = parseFloat(estate.replace(/,/g, '')) || 0
  const n = parseInt(copies) || 0
  const result = useMemo(() => calculate(val, n), [val, n])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-2">Total Estate Value (net)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={estate} onChange={(e) => setEstate(e.target.value)} placeholder="300,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Total Estate Value (net)" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Extra Copies of the Grant</label>
          <input type="number" min="0" max="20" value={copies} onChange={(e) => setCopies(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Extra Copies of the Grant" />
        </div>
      </div>

      {val > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          {!result.needsProbate ? (
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center">
              <p className="text-lg font-bold text-green-700 dark:text-green-400">No probate application fee</p>
              <p className="text-sm text-muted-foreground mt-1">There is no fee for estates of £5,000 or less, and small estates often don't need a grant at all.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-primary/10 p-5 text-center">
                  <p className="text-sm font-medium">DIY Probate</p>
                  <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(result.totalDIY)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Application fee + copies</p>
                </div>
                <div className="rounded-xl border border-border p-5 text-center">
                  <p className="text-sm font-medium">With Solicitor (est.)</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(result.totalWithSolicitor)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Includes ~{1.5}% solicitor fee</p>
                </div>
              </div>

              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border/50"><td className="py-2.5">Probate application fee</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.applicationFee)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2.5">Extra copies with the application ({result.copies} × £{COPY_FEE_WITH_APPLICATION})</td><td className="text-right tabular-nums">{formatCurrency(result.extraCopies)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2.5 text-muted-foreground">Solicitor fee (est. 1.5%)</td><td className="text-right tabular-nums text-muted-foreground">{formatCurrency(result.solicitorFee)}</td></tr>
                </tbody>
              </table>
              {result.copies > 0 && (
                <p className="text-xs text-muted-foreground">Copies ordered after you submit the application cost £{COPY_FEE_LATER} each, so the same {result.copies} would cost {formatCurrency(result.extraCopiesIfLater)} later.</p>
              )}
            </>
          )}
          <p className="text-xs text-muted-foreground">Fees for England and Wales from 6 July 2026. Scotland (confirmation) and Northern Ireland have separate rules and fees.</p>
        </div>
      )}
    </div>
  )
}
