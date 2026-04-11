import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// From April 2027 pensions will be subject to IHT
function calculate(estate: number, pensionPot: number, hasSpouse: boolean, spouseInherits: number, hasRNRB: boolean) {
  const NRB = 325_000
  const RNRB = hasRNRB ? 175_000 : 0
  const spouseExempt = hasSpouse ? spouseInherits : 0

  // Current rules (pre-April 2027): pension outside estate
  const currentTaxableEstate = Math.max(0, estate - spouseExempt - NRB - RNRB)
  const currentIHT = currentTaxableEstate * 0.40

  // New rules (April 2027+): pension IN estate
  const newTotalEstate = estate + pensionPot
  const newTaxableEstate = Math.max(0, newTotalEstate - spouseExempt - NRB - RNRB)
  const newIHT = newTaxableEstate * 0.40

  const extraIHT = newIHT - currentIHT
  const pensionTaxBefore75 = 0 // currently tax-free if die before 75
  const pensionTaxAfter75 = pensionPot * 0.40 // marginal rate for beneficiary

  return { currentIHT, newIHT, extraIHT, newTotalEstate, pensionPot }
}

export default function InheritanceTaxPensionCalculator() {
  const [estate, setEstate] = useState('500000')
  const [pension, setPension] = useState('300000')
  const [spouse, setSpouse] = useState(false)
  const [spouseAmt, setSpouseAmt] = useState('0')
  const [rnrb, setRnrb] = useState(true)

  const e = parseFloat(estate.replace(/,/g,'')) || 0
  const p = parseFloat(pension.replace(/,/g,'')) || 0
  const sa = parseFloat(spouseAmt.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(e, p, spouse, sa, rnrb), [e, p, spouse, sa, rnrb])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Estate (excl. pension)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={estate} onChange={(ev) => setEstate(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Pension Pot</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={pension} onChange={(ev) => setPension(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={spouse} onChange={(ev) => setSpouse(ev.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Married / civil partner</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={rnrb} onChange={(ev) => setRnrb(ev.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Home passes to direct descendants (RNRB)</span></label>
      </div>

      {e > 0 && p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/50 p-5 text-center"><p className="text-sm font-medium">Current Rules</p><p className="text-xl font-bold mt-1">{formatCurrency(result.currentIHT)}</p><p className="text-xs text-muted-foreground">Pension outside estate</p></div>
            <div className="rounded-xl bg-destructive/10 p-5 text-center"><p className="text-sm font-medium">From April 2027</p><p className="text-xl font-bold text-destructive mt-1">{formatCurrency(result.newIHT)}</p><p className="text-xs text-muted-foreground">Pension IN estate</p></div>
          </div>
          {result.extraIHT > 0 && (
            <div className="rounded-2xl bg-destructive/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">Extra IHT from April 2027</p>
              <p className="text-3xl font-bold text-destructive mt-1">+{formatCurrency(result.extraIHT)}</p>
              <p className="text-sm text-muted-foreground mt-1">Total estate: {formatCurrency(result.newTotalEstate)} (including {formatCurrency(p)} pension)</p>
            </div>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Key change from April 2027:</p>
            <p>Pensions will be included in the estate for IHT. Currently pensions pass outside the estate (tax-free if you die before 75, or at beneficiary's marginal rate after 75). This is one of the biggest IHT changes in decades. Consider: lifetime gifting, spending pension first, whole-of-life insurance to cover the IHT bill.</p>
          </div>
        </div>
      )}
    </div>
  )
}
