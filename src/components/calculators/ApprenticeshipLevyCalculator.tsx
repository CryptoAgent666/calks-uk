import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const LEVY_RATE = 0.005 // 0.5%
const ALLOWANCE = 15_000

function calculate(payBill: number) {
  const grossLevy = payBill * LEVY_RATE
  const netLevy = Math.max(0, grossLevy - ALLOWANCE)
  const monthlyLevy = netLevy / 12
  const isLevyPayer = payBill > 3_000_000
  // The automatic 10% government top-up was removed from 1 August 2026, so the training fund equals the levy paid
  const totalFunding = netLevy

  return { grossLevy, netLevy, monthlyLevy, isLevyPayer, totalFunding, payBill }
}

export default function ApprenticeshipLevyCalculator() {
  const [payBill, setPayBill] = useState('4000000')

  const p = parseFloat(payBill.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(p), [p])

  return (
    <div className="space-y-6">
      <div><label className="block text-sm font-medium mb-2">Annual Pay Bill</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={payBill} onChange={(e) => setPayBill(e.target.value)} placeholder="4,000,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Pay Bill" /></div><p className="text-xs text-muted-foreground mt-1">Levy applies if pay bill exceeds £3M</p></div>

      {p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-xl p-3 text-center text-sm font-medium ${result.isLevyPayer ? 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400' : 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'}`}>
            {result.isLevyPayer ? 'You are an Apprenticeship Levy payer' : 'Below £3M threshold — no levy due'}
          </div>
          {result.isLevyPayer && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Levy</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.netLevy)}</p></div>
                <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly Levy</p><p className="text-xl font-bold">{formatCurrency(result.monthlyLevy)}</p></div>
                <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Training Fund</p><p className="text-xl font-bold text-primary">{formatCurrency(result.totalFunding)}</p></div>
              </div>
              <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
                <p>Levy: 0.5% of pay bill minus £15,000 allowance. Funds go into your apprenticeship service account. There is no government top-up on funds from 1 August 2026, and funds entering the account from August 2026 expire after 12 months (older funds after 24). They pay for apprenticeship training and assessment, and apprenticeship units from August 2026. Can transfer up to 50% to other employers, such as supply chain partners.</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
