import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// ShPP 2026/27
const SHPP_RATE = 194.32 // per week or 90% AWE
const MAX_WEEKS = 50 // shared between partners (37 ShPP-eligible after 2 weeks compulsory maternity)
const COMPULSORY_MAT = 2

function calculate(motherWeeks: number, partnerWeeks: number, weeklyPay1: number, weeklyPay2: number) {
  const totalShared = MAX_WEEKS - COMPULSORY_MAT
  const motherShPP = Math.min(motherWeeks, totalShared)
  const partnerShPP = Math.min(partnerWeeks, totalShared - motherShPP)

  const motherRate = Math.min(weeklyPay1 * 0.90, SHPP_RATE)
  const partnerRate = Math.min(weeklyPay2 * 0.90, SHPP_RATE)

  // Mother: 6 weeks at 90% + remaining at ShPP rate
  const mother6Weeks = weeklyPay1 * 0.90 * 6
  const motherShPPPay = motherShPP > 0 ? motherRate * motherShPP : 0
  const motherTotal = mother6Weeks + motherShPPPay + COMPULSORY_MAT * motherRate

  const partnerTotal = partnerShPP * partnerRate

  const grandTotal = motherTotal + partnerTotal
  const totalWeeksUsed = COMPULSORY_MAT + 6 + motherShPP + partnerShPP

  return { motherShPP, partnerShPP, motherTotal, partnerTotal, grandTotal, totalWeeksUsed, motherRate, partnerRate, remainingWeeks: Math.max(0, totalShared - motherShPP - partnerShPP) }
}

export default function SharedParentalLeaveCalculator() {
  const [motherWeeks, setMotherWeeks] = useState('20')
  const [partnerWeeks, setPartnerWeeks] = useState('10')
  const [pay1, setPay1] = useState('600')
  const [pay2, setPay2] = useState('500')

  const mw = parseInt(motherWeeks) || 0
  const pw = parseInt(partnerWeeks) || 0
  const p1 = parseFloat(pay1) || 0
  const p2 = parseFloat(pay2) || 0
  const result = useMemo(() => calculate(mw, pw, p1, p2), [mw, pw, p1, p2])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Mother's ShPL Weeks</label><input type="number" min="0" max="48" value={motherWeeks} onChange={(e) => setMotherWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Partner's ShPL Weeks</label><input type="number" min="0" max="48" value={partnerWeeks} onChange={(e) => setPartnerWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Mother's Weekly Pay</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={pay1} onChange={(e) => setPay1(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Partner's Weekly Pay</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={pay2} onChange={(e) => setPay2(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Total Shared Parental Pay</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.grandTotal)}</p>
          <p className="text-sm text-muted-foreground mt-1">{result.totalWeeksUsed} weeks total &middot; {result.remainingWeeks} weeks unused</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Mother's Pay</p><p className="text-lg font-bold">{formatCurrency(result.motherTotal)}</p><p className="text-xs text-muted-foreground">{COMPULSORY_MAT + 6 + result.motherShPP} weeks</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Partner's Pay</p><p className="text-lg font-bold">{formatCurrency(result.partnerTotal)}</p><p className="text-xs text-muted-foreground">{result.partnerShPP} weeks</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>50 weeks total leave (52 minus 2 compulsory maternity). 37 weeks eligible for ShPP at £{SHPP_RATE}/week or 90% AWE. Parents can split leave and take it in blocks.</p>
        </div>
      </div>
    </div>
  )
}
