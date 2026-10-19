import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type Nation = 'england' | 'scotland' | 'wales'

// Band proportions relative to Band D. England and Wales use ninths of Band D (Local Government
// Finance Act 1992 s5), and Wales has a ninth band, I, at 21/9. Scotland has used
// 240:280:320:360:473:585:705:882 since April 2017 (LGFA 1992 s74(1), as amended).
const BAND_RATIOS: Record<Nation, Record<string, number>> = {
  england: { A: 6, B: 7, C: 8, D: 9, E: 11, F: 13, G: 15, H: 18 },
  wales: { A: 6, B: 7, C: 8, D: 9, E: 11, F: 13, G: 15, H: 18, I: 21 },
  scotland: { A: 240, B: 280, C: 320, D: 360, E: 473, F: 585, G: 705, H: 882 },
}

const NATIONS: { id: Nation; label: string }[] = [
  { id: 'england', label: 'England' },
  { id: 'scotland', label: 'Scotland' },
  { id: 'wales', label: 'Wales' },
]

// Care leaver exemption: a local scheme in England; national in Wales (aged 18 to 24) and Scotland (18 to 25)
const CARE_LEAVER_NOTE: Record<Nation, string> = {
  england: 'Care leaver under 25: full exemption assumed. In England this is a local scheme, so check your council.',
  wales: 'Care leaver aged 18 to 24: exempt in Wales.',
  scotland: 'Care leaver aged 18 to 25: exempt in Scotland.',
}

// Discounts apply in turn, each to what is left of the bill: the disabled band reduction, then the
// single person discount, then Council Tax Reduction at the maximum rate your scheme allows
function calculate(annualCT: number, nation: Nation, band: string, isSingle: boolean, isStudent: boolean, isDisabled: boolean, isOnBenefits: boolean, ctrPct: number, isCareLeaver: boolean) {
  const reasons: string[] = []
  let bill = annualCT
  let exempt = false

  if (isStudent) { exempt = true; bill = 0; reasons.push('Everyone living there is a full-time student, so the property is exempt') }
  else if (isCareLeaver) { bill = 0; reasons.push(CARE_LEAVER_NOTE[nation]) }
  else {
    if (isDisabled) {
      // Charged as the band below. Band A has no band below, so its bill is cut by a sixth
      // (to 5/9 of Band D in England and Wales, SI 1992/554 reg 4(3A)(b); one-sixth off in Scotland)
      const ratios = BAND_RATIOS[nation]
      const bands = Object.keys(ratios)
      const i = bands.indexOf(band)
      if (i <= 0) {
        bill = bill * 5 / 6
        reasons.push('Disabled band reduction (Band A bill cut by a sixth)')
      } else {
        bill = bill * ratios[bands[i - 1]] / ratios[band]
        reasons.push(`Disabled band reduction (charged as Band ${bands[i - 1]})`)
      }
    }
    if (isSingle) { bill *= 0.75; reasons.push('Single person discount (25%)') }
    if (isOnBenefits && ctrPct > 0) { bill -= bill * Math.min(ctrPct, 100) / 100; reasons.push(`Council Tax Reduction at ${Math.min(ctrPct, 100)}% (the maximum; a means test can lower it)`) }
  }

  const finalBill = Math.max(0, bill)
  return { discount: annualCT - finalBill, finalBill, exempt, reason: reasons.join(' + '), monthly: finalBill / 10 } // CT paid over 10 months
}

export default function CouncilTaxReductionCalculator() {
  const [ct, setCt] = useState('2000')
  const [nation, setNation] = useState<Nation>('england')
  const [single, setSingle] = useState(true)
  const [student, setStudent] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [benefits, setBenefits] = useState(false)
  const [careleaver, setCareleaver] = useState(false)
  const [band, setBand] = useState('D')
  const [ctrPct, setCtrPct] = useState('100')

  const c = parseFloat(ct.replace(/,/g,'')) || 0
  const pct = parseFloat(ctrPct) || 0
  const bands = Object.keys(BAND_RATIOS[nation])
  // Band I exists only in Wales; switching nation away from Wales falls back to Band H
  const activeBand = bands.includes(band) ? band : 'H'
  const result = useMemo(() => calculate(c, nation, activeBand, single, student, disabled, benefits, pct, careleaver), [c, nation, activeBand, single, student, disabled, benefits, pct, careleaver])

  return (
    <div className="space-y-6">
      <div>
        <p className="block text-sm font-medium mb-2">Where is the property?</p>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Nation">
          {NATIONS.map(n => (
            <button key={n.id} type="button" onClick={() => setNation(n.id)} aria-pressed={nation === n.id} className={`px-3 py-2.5 rounded-xl text-sm font-medium border ${nation === n.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{n.label}</button>
          ))}
        </div>
      </div>
      <div><label className="block text-sm font-medium mb-2">Annual Council Tax Bill</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={ct} onChange={(e) => setCt(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Council Tax Bill" /></div>
        {nation === 'scotland' && <p className="text-xs text-muted-foreground mt-1">Scottish bills add water and sewerage charges. Council Tax Reduction does not cover them, although a CTR award brings a separate reduction of up to 35% on them, so enter the council tax part only.</p>}
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={single} onChange={(e) => setSingle(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Only adult in property (25% discount)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={student} onChange={(e) => setStudent(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">All occupants full-time students (exempt)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Disabled resident, and the home has an extra bathroom, kitchen or other room, or extra wheelchair space, that they need (band reduction)</span></label>
        {disabled && <div className="pl-8"><label className="block text-sm font-medium mb-2">Council Tax Band</label><select value={activeBand} onChange={(e) => setBand(e.target.value)} className="w-32 rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Council Tax Band">{bands.map(b => <option key={b} value={b}>Band {b}</option>)}</select></div>}
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={benefits} onChange={(e) => setBenefits(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">On a low income or benefits (Council Tax Reduction)</span></label>
        {benefits && <div className="pl-8"><label className="block text-sm font-medium mb-2">Maximum reduction in your area (%)</label><input type="number" min="0" max="100" value={ctrPct} onChange={(e) => setCtrPct(e.target.value)} className="w-32 rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Maximum reduction in your area (%)" /><p className="text-xs text-muted-foreground mt-1">100% for pension-age claimants and in Scotland and Wales. Working-age schemes in England are set by each council, so check yours.</p></div>}
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={careleaver} onChange={(e) => setCareleaver(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Care leaver under {nation === 'scotland' ? 26 : 25}, and every other adult in the home is a care leaver or otherwise disregarded</span></label>
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
