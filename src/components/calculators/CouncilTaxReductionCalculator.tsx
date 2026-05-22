import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(annualCT: number, isSingle: boolean, isStudent: boolean, isDisabled: boolean, isOnBenefits: boolean, isCareLeaverUnder25: boolean) {
  let discount = 0
  let exempt = false
  let reason = ''

  if (isStudent) { exempt = true; reason = 'Full-time students are exempt from council tax' }
  else if (isCareLeaverUnder25) { discount = annualCT; reason = 'Care leavers under 25 — full exemption (many councils)' }
  else {
    if (isSingle) { discount += annualCT * 0.25; reason = 'Single person discount (25%)' }
    if (isDisabled) { discount += annualCT * (1/9); reason += (reason ? ' + ' : '') + 'Disabled reduction (one band lower)' }
    if (isOnBenefits) { discount += annualCT * 0.75; reason += (reason ? ' + ' : '') + 'Council Tax Support (up to 100%)' }
  }

  const finalBill = exempt ? 0 : Math.max(0, annualCT - discount)

  return { discount: Math.min(discount, annualCT), finalBill, exempt, reason, monthly: finalBill / 10 } // CT paid over 10 months
}

export default function CouncilTaxReductionCalculator() {
  const [ct, setCt] = useState('2000')
  const [single, setSingle] = useState(true)
  const [student, setStudent] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [benefits, setBenefits] = useState(false)
  const [careleaver, setCareleaver] = useState(false)

  const c = parseFloat(ct.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(c, single, student, disabled, benefits, careleaver), [c, single, student, disabled, benefits, careleaver])

  return (
    <div className="space-y-6">
      <div><label className="block text-sm font-medium mb-2">Annual Council Tax Bill</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={ct} onChange={(e) => setCt(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Council Tax Bill" /></div></div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={single} onChange={(e) => setSingle(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Only adult in property (25% discount)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={student} onChange={(e) => setStudent(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">All occupants full-time students (exempt)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Disabled person (band reduction)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={benefits} onChange={(e) => setBenefits(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">On benefits (Council Tax Support)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={careleaver} onChange={(e) => setCareleaver(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Care leaver under 25</span></label>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className={`rounded-2xl p-6 text-center ${result.discount > 0 || result.exempt ? 'bg-green-100 dark:bg-green-950' : 'bg-muted/50'}`}>
          {result.exempt ? (
            <p className="text-lg font-bold text-green-700 dark:text-green-400">Exempt from Council Tax!</p>
          ) : result.discount > 0 ? (
            <><p className="text-sm text-muted-foreground">You Pay</p><p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.finalBill)}/year</p><p className="text-sm text-muted-foreground mt-1">Saving: {formatCurrency(result.discount)} &middot; {formatCurrency(result.monthly)}/month (10 months)</p></>
          ) : (
            <><p className="text-sm text-muted-foreground">No discounts apply</p><p className="text-2xl font-bold mt-1">{formatCurrency(c)}/year</p></>
          )}
        </div>
        {result.reason && <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground"><p>{result.reason}</p></div>}
      </div>
    </div>
  )
}
