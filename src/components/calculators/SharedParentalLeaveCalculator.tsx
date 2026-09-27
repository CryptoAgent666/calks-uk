import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// SMP / ShPP 2026/27 (gov.uk/shared-parental-leave-and-pay)
const SHPP_RATE = 194.32 // per week, or 90% of AWE if lower
const LEL = 129 // average weekly earnings needed for SMP / ShPP
const MAX_LEAVE_WEEKS = 52 // maternity leave + SPL across both parents
const MAX_PAID_WEEKS = 39 // SMP + ShPP across both parents
const COMPULSORY_MAT = 2 // first 2 weeks after birth, mother only, cannot be shared
const HIGHER_RATE_WEEKS = 6 // SMP only: first 6 weeks at 90% of AWE, no cap

// motherWeeks = the mother's total weeks off (maternity leave plus any SPL she books),
// partnerWeeks = the partner's SPL. Weekly statutory pay is taken in order: the
// mother's weeks first, then the partner's, until the 39 paid weeks run out.
function calculate(motherWeeks: number, partnerWeeks: number, weeklyPay1: number, weeklyPay2: number) {
  const mWeeks = Math.min(MAX_LEAVE_WEEKS, Math.max(COMPULSORY_MAT, Math.floor(motherWeeks)))
  const pWeeks = Math.min(Math.max(0, Math.floor(partnerWeeks)), MAX_LEAVE_WEEKS - mWeeks)
  const partnerCapped = Math.max(0, Math.floor(partnerWeeks)) > pWeeks

  const motherEligible = weeklyPay1 >= LEL
  const partnerEligible = weeklyPay2 >= LEL

  // Mother: SMP for her first 6 weeks at 90% of AWE, then £194.32 or 90% if lower
  const motherPaidWeeks = Math.min(mWeeks, MAX_PAID_WEEKS)
  const motherHigher = Math.min(motherPaidWeeks, HIGHER_RATE_WEEKS)
  const motherStandard = motherPaidWeeks - motherHigher
  const motherRate = Math.min(weeklyPay1 * 0.9, SHPP_RATE)
  const motherTotal = motherEligible ? motherHigher * weeklyPay1 * 0.9 + motherStandard * motherRate : 0

  // Partner: ShPP only, no 90% period, from whatever is left of the 39 weeks
  const partnerPaidWeeks = Math.min(pWeeks, MAX_PAID_WEEKS - motherPaidWeeks)
  const partnerRate = Math.min(weeklyPay2 * 0.9, SHPP_RATE)
  const partnerTotal = partnerEligible ? partnerPaidWeeks * partnerRate : 0

  const totalWeeksUsed = mWeeks + pWeeks
  const paidWeeks = (motherEligible ? motherPaidWeeks : 0) + (partnerEligible ? partnerPaidWeeks : 0)

  return {
    mWeeks, pWeeks, partnerCapped, motherEligible, partnerEligible,
    motherPaidWeeks: motherEligible ? motherPaidWeeks : 0,
    partnerPaidWeeks: partnerEligible ? partnerPaidWeeks : 0,
    motherTotal, partnerTotal, grandTotal: motherTotal + partnerTotal,
    totalWeeksUsed, paidWeeks, unpaidWeeks: totalWeeksUsed - paidWeeks,
    remainingWeeks: MAX_LEAVE_WEEKS - totalWeeksUsed, motherRate, partnerRate,
  }
}

export default function SharedParentalLeaveCalculator() {
  const [motherWeeks, setMotherWeeks] = useState('26')
  const [partnerWeeks, setPartnerWeeks] = useState('10')
  const [pay1, setPay1] = useState('600')
  const [pay2, setPay2] = useState('500')

  const mw = parseInt(motherWeeks) || 0
  const pw = parseInt(partnerWeeks) || 0
  const p1 = parseFloat(pay1.replace(/,/g, '')) || 0
  const p2 = parseFloat(pay2.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(mw, pw, p1, p2), [mw, pw, p1, p2])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Mother's Total Leave (weeks)</label><input type="number" min="2" max="52" value={motherWeeks} onChange={(e) => setMotherWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Mother's Total Leave (weeks)" /><p className="text-xs text-muted-foreground mt-1">Maternity leave plus any SPL she takes, minimum 2</p></div>
        <div><label className="block text-sm font-medium mb-2">Partner's SPL (weeks)</label><input type="number" min="0" max="50" value={partnerWeeks} onChange={(e) => setPartnerWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Partner's SPL (weeks)" /></div>
        <div><label className="block text-sm font-medium mb-2">Mother's Weekly Pay</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={pay1} onChange={(e) => setPay1(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Mother's Weekly Pay" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Partner's Weekly Pay</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={pay2} onChange={(e) => setPay2(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Partner's Weekly Pay" /></div></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Total Statutory Pay (SMP + ShPP)</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.grandTotal)}</p>
          <p className="text-sm text-muted-foreground mt-1">{result.totalWeeksUsed} of 52 weeks used &middot; {result.paidWeeks} paid &middot; {result.unpaidWeeks} unpaid &middot; {result.remainingWeeks} unused</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Mother's Pay</p><p className="text-lg font-bold">{formatCurrency(result.motherTotal)}</p><p className="text-xs text-muted-foreground">{result.mWeeks} weeks &middot; {result.motherPaidWeeks} paid</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Partner's Pay</p><p className="text-lg font-bold">{formatCurrency(result.partnerTotal)}</p><p className="text-xs text-muted-foreground">{result.pWeeks} weeks &middot; {result.partnerPaidWeeks} paid</p></div>
        </div>
        {(result.partnerCapped || !result.motherEligible || !result.partnerEligible) && (
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            {result.partnerCapped && <p>The partner's leave has been cut to {result.pWeeks} weeks, because the two of you cannot take more than 52 weeks in total.</p>}
            {!result.motherEligible && <p>The mother's average pay is below £{LEL} a week, so she gets no Statutory Maternity Pay. She may qualify for Maternity Allowance instead, which this calculator does not include.</p>}
            {!result.partnerEligible && <p>The partner's average pay is below £{LEL} a week, so their leave is unpaid (no ShPP).</p>}
          </div>
        )}
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Up to 52 weeks of leave and 39 weeks of statutory pay in total. The first 2 weeks after birth are compulsory maternity leave, so up to 50 weeks of leave and 37 weeks of ShPP can be shared. Only the mother's first 6 weeks of SMP are paid at 90% of earnings; after that, and for all ShPP, the rate is £{SHPP_RATE}/week or 90% of earnings if lower.</p>
        </div>
      </div>
    </div>
  )
}
