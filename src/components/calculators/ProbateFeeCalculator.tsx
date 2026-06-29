import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Probate fees England & Wales 2025
function calculate(estateValue: number) {
  // No probate needed if estate under £5,000 (generally)
  // Fee: £300 if estate over £5,000 (same fee for personal and solicitor applications)
  const needsProbate = estateValue > 5_000
  const applicationFee = needsProbate ? 300 : 0
  const extraCopies = needsProbate ? 16 * 5 : 0 // 5 sealed copies at £16 each (raised from £1.50 on 17 November 2025)

  // Solicitor fees (approximate)
  const solicitorFeePct = 1.5 // typical 1-2% of estate
  const solicitorFee = estateValue * (solicitorFeePct / 100)

  return { estateValue, needsProbate, applicationFee, extraCopies, solicitorFee, totalDIY: applicationFee + extraCopies, totalWithSolicitor: applicationFee + extraCopies + solicitorFee }
}

export default function ProbateFeeCalculator() {
  const [estate, setEstate] = useState('')
  const val = parseFloat(estate.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(val), [val])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Total Estate Value</label>
        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <input type="text" inputMode="numeric" value={estate} onChange={(e) => setEstate(e.target.value)} placeholder="300,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Total Estate Value" /></div>
      </div>

      {val > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          {!result.needsProbate ? (
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center">
              <p className="text-lg font-bold text-green-700 dark:text-green-400">Probate may not be needed</p>
              <p className="text-sm text-muted-foreground mt-1">Estates under £5,000 generally don't require a grant of probate.</p>
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
                  <tr className="border-b border-border/50"><td className="py-2.5">Extra sealed copies (x5)</td><td className="text-right tabular-nums">{formatCurrency(result.extraCopies)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2.5 text-muted-foreground">Solicitor fee (est. 1.5%)</td><td className="text-right tabular-nums text-muted-foreground">{formatCurrency(result.solicitorFee)}</td></tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  )
}
