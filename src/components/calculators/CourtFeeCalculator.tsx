import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Civil court fees England & Wales 2025
const MONEY_CLAIM_FEES = [
  { upTo: 300, fee: 35 },
  { upTo: 500, fee: 50 },
  { upTo: 1_000, fee: 70 },
  { upTo: 1_500, fee: 80 },
  { upTo: 3_000, fee: 115 },
  { upTo: 5_000, fee: 205 },
  { upTo: 10_000, fee: 455 },
  { upTo: 200_000, feePct: 5 },
  { upTo: Infinity, fee: 10_000 },
]

const HEARING_FEES = [
  { upTo: 300, fee: 27 },
  { upTo: 500, fee: 59 },
  { upTo: 1_000, fee: 119 },
  { upTo: 1_500, fee: 176 },
  { upTo: 3_000, fee: 335 },
  { upTo: 10_000, fee: 335 },
  { upTo: 25_000, fee: 545 },
  { upTo: 50_000, fee: 1_090 },
  { upTo: 100_000, fee: 1_635 },
  { upTo: 200_000, fee: 2_180 },
  { upTo: Infinity, fee: 2_180 },
]

function calculate(claimAmount: number) {
  let issueFee = 0
  for (const band of MONEY_CLAIM_FEES) {
    if (claimAmount <= band.upTo) {
      issueFee = 'feePct' in band ? claimAmount * (band.feePct / 100) : band.fee
      break
    }
  }

  let hearingFee = 0
  for (const band of HEARING_FEES) {
    if (claimAmount <= band.upTo) {
      hearingFee = band.fee
      break
    }
  }

  return { claimAmount, issueFee, hearingFee, totalFees: issueFee + hearingFee }
}

export default function CourtFeeCalculator() {
  const [amount, setAmount] = useState('')
  const val = parseFloat(amount.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(val), [val])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Claim Amount</label>
        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="5,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[1_000, 5_000, 10_000, 25_000, 50_000, 100_000].map(a => (
            <button key={a} onClick={() => setAmount(a.toLocaleString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">£{a >= 1000 ? `${a/1000}K` : a}</button>
          ))}
        </div>
      </div>

      {val > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Issue Fee</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.issueFee)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Hearing Fee</p><p className="text-lg font-bold">{formatCurrency(result.hearingFee)}</p></div>
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total Fees</p><p className="text-xl font-bold text-primary">{formatCurrency(result.totalFees)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Court fees for money claims in England & Wales. Fees may differ for other claim types.</p>
            <p className="mt-1">Fee remission (Help with Fees) may be available if on low income or benefits.</p>
          </div>
        </div>
      )}
    </div>
  )
}
