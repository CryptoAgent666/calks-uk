import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Band proportions in ninths of Band D (Local Government Finance Act 1992 s5)
const BAND_RATIO: Record<string, number> = { A: 6, B: 7, C: 8, D: 9, E: 11, F: 13, G: 15, H: 18 }
const BANDS = Object.keys(BAND_RATIO)

// Discounts apply in turn, each to what is left of the bill: the disabled band reduction, then the
// single person discount, then Council Tax Reduction at the maximum rate your scheme allows
function calculate(annualCT: number, band: string, isSingle: boolean, isStudent: boolean, isDisabled: boolean, isOnBenefits: boolean, ctrPct: number, isCareLeaverUnder25: boolean) {
  const reasons: string[] = []
  let bill = annualCT
  let exempt = false

  if (isStudent) { exempt = true; bill = 0; reasons.push('Everyone living there is a full-time student, so the property is exempt') }
  else if (isCareLeaverUnder25) { bill = 0; reasons.push('Care leaver under 25: full exemption assumed. In England this is a local scheme, so check your council. Wales (under 25) and Scotland (under 26) exempt nationally.') }
  else {
    if (isDisabled) {
      // Charged as the band below; Band A is reduced by a sixth (to 5/9 of Band D)
      const ratio = BAND_RATIO[band] ?? 9
      const lower = band === 'A' ? 5 : BAND_RATIO[BANDS[BANDS.indexOf(band) - 1]]
      bill = bill * lower / ratio
      reasons.push(`Disabled band reduction (charged as ${band === 'A' ? '5/6 of Band A' : `Band ${BANDS[BANDS.indexOf(band) - 1]}`})`)
    }
    if (isSingle) { bill *= 0.75; reasons.push('Single person discount (25%)') }
    if (isOnBenefits && ctrPct > 0) { bill -= bill * Math.min(ctrPct, 100) / 100; reasons.push(`Council Tax Reduction at ${Math.min(ctrPct, 100)}% (the maximum; a means test can lower it)`) }
  }

  const finalBill = Math.max(0, bill)
  return { discount: annualCT - finalBill, finalBill, exempt, reason: reasons.join(' + '), monthly: finalBill / 10 } // CT paid over 10 months
}

export default function CouncilTaxReductionCalculator() {
  const [ct, setCt] = useState('2000')
  const [single, setSingle] = useState(true)
  const [student, setStudent] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [benefits, setBenefits] = useState(false)
  const [careleaver, setCareleaver] = useState(false)
  const [band, setBand] = useState('D')
  const [ctrPct, setCtrPct] = useState('100')

  const c = parseFloat(ct.replace(/,/g,'')) || 0
  const pct = parseFloat(ctrPct) || 0
  const result = useMemo(() => calculate(c, band, single, student, disabled, benefits, pct, careleaver), [c, band, single, student, disabled, benefits, pct, careleaver])

  return (
    <div className="space-y-6">
      <div><label className="block text-sm font-medium mb-2">Annual Council Tax Bill</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={ct} onChange={(e) => setCt(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Council Tax Bill" /></div></div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={single} onChange={(e) => setSingle(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Only adult in property (25% discount)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={student} onChange={(e) => setStudent(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">All occupants full-time students (exempt)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Disabled person (band reduction)</span></label>
        {disabled && <div className="pl-8"><label className="block text-sm font-medium mb-2">Council Tax Band</label><select value={band} onChange={(e) => setBand(e.target.value)} className="w-32 rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Council Tax Band">{BANDS.map(b => <option key={b} value={b}>Band {b}</option>)}</select></div>}
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={benefits} onChange={(e) => setBenefits(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">On a low income or benefits (Council Tax Reduction)</span></label>
        {benefits && <div className="pl-8"><label className="block text-sm font-medium mb-2">Maximum reduction in your area (%)</label><input type="number" min="0" max="100" value={ctrPct} onChange={(e) => setCtrPct(e.target.value)} className="w-32 rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Maximum reduction in your area (%)" /><p className="text-xs text-muted-foreground mt-1">100% for pension-age claimants and in Scotland and Wales. Working-age schemes in England are set by each council, so check yours.</p></div>}
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={careleaver} onChange={(e) => setCareleaver(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Care leaver under 25</span></label>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className={`rounded-2xl p-6 text-center ${result.discount > 0 || result.exempt ? 'bg-green-100 dark:bg-green-950' : 'bg-muted/50'}`}>
          {result.exempt ? (
            <p className="text-lg font-bold text-green-700 dark:text-green-400">Exempt from Council Tax!</p>
          ) : result.discount > 0 ? (
            <><p className="text-sm text-muted-foreground">You Pay</p><p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.finalBill)}/year</p><p className="text-sm text-muted-foreground mt-1">Saving {formatCurrency(result.discount)} a year &middot; you pay {formatCurrency(result.monthly)} a month over 10 months</p></>
          ) : (
            <><p className="text-sm text-muted-foreground">No discounts apply</p><p className="text-2xl font-bold mt-1">{formatCurrency(c)}/year</p></>
          )}
        </div>
        {result.reason && <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground"><p>{result.reason}</p></div>}
      </div>
    </div>
  )
}
