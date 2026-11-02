import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Finance Act 2026: unused pension funds count towards the estate for deaths from 6 April 2027
// (death-in-service benefits and dependants' scheme pensions excluded).
// The residence nil-rate band is the lower of the home left to direct descendants and the
// allowance after its taper of £1 for every £2 the estate exceeds £2m (IHTA 1984 s8D, s8E), so
// adding the pension can also cost some or all of it.
const rnrbFor = (homeToDescendants: number, estateValue: number) =>
  Math.min(homeToDescendants, Math.max(0, 175_000 - Math.max(0, estateValue - 2_000_000) / 2))

function calculate(estate: number, pensionPot: number, spouseFromEstate: number, spouseFromPension: number, homeToDescendants: number, beneficiaryRate: number) {
  const NRB = 325_000
  // Neither spouse gift can exceed what is there to give, and the home sits inside the estate
  const estateToSpouse = Math.min(spouseFromEstate, estate)
  const pensionToSpouse = Math.min(spouseFromPension, pensionPot)
  const home = Math.min(homeToDescendants, estate)

  // Current rules (pre-April 2027): pension outside estate, so only the estate gift is exempted
  const RNRB = rnrbFor(home, estate)
  const currentTaxableEstate = Math.max(0, estate - estateToSpouse - NRB - RNRB)
  const currentIHT = currentTaxableEstate * 0.40

  // New rules (April 2027+): pension IN estate, and pension left to a spouse is exempt too
  const newTotalEstate = estate + pensionPot
  const newRNRB = rnrbFor(home, newTotalEstate)
  const newTaxableEstate = Math.max(0, newTotalEstate - estateToSpouse - pensionToSpouse - NRB - newRNRB)
  const newIHT = newTaxableEstate * 0.40

  const extraIHT = newIHT - currentIHT

  // Death at 75 or over: illustrative income tax on the pension after deducting the IHT on it
  // (ITEPA 2003 s567B, inserted by FA 2026 s70), sharing the IHT across the chargeable estate pro rata
  const chargeableEstate = estate - estateToSpouse
  const chargeablePension = pensionPot - pensionToSpouse
  const chargeableTotal = chargeableEstate + chargeablePension
  const pensionIHT = chargeableTotal > 0 ? newIHT * (chargeablePension / chargeableTotal) : 0
  const after75IncomeTax = (pensionPot - pensionIHT) * (beneficiaryRate / 100)
  const after75Combined = pensionIHT + after75IncomeTax
  const after75CombinedPct = pensionPot > 0 ? (after75Combined / pensionPot) * 100 : 0

  return { currentIHT, newIHT, extraIHT, newTotalEstate, pensionPot, RNRB, newRNRB, pensionIHT, after75IncomeTax, after75Combined, after75CombinedPct }
}

export default function InheritanceTaxPensionCalculator() {
  const [estate, setEstate] = useState('500000')
  const [pension, setPension] = useState('300000')
  const [spouse, setSpouse] = useState(false)
  const [spouseEstate, setSpouseEstate] = useState('0')
  const [spousePension, setSpousePension] = useState('0')
  const [rnrb, setRnrb] = useState(true)
  const [homeValue, setHomeValue] = useState('300000')
  const [taxRate, setTaxRate] = useState('40')

  const e = parseFloat(estate.replace(/,/g,'')) || 0
  const p = parseFloat(pension.replace(/,/g,'')) || 0
  const se = spouse ? parseFloat(spouseEstate.replace(/,/g,'')) || 0 : 0
  const sp = spouse ? parseFloat(spousePension.replace(/,/g,'')) || 0 : 0
  const home = rnrb ? parseFloat(homeValue.replace(/,/g,'')) || 0 : 0
  const parsedRate = parseFloat(taxRate)
  const rate = Number.isNaN(parsedRate) ? 0 : Math.min(48, Math.max(0, parsedRate)) // 0% is a real rate; 48% is the top UK rate
  const result = useMemo(() => calculate(e, p, se, sp, home, rate), [e, p, se, sp, home, rate])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Estate (excl. pension)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={estate} onChange={(ev) => setEstate(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Estate (excl. pension)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Pension Pot</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={pension} onChange={(ev) => setPension(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Pension Pot" /></div></div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={spouse} onChange={(ev) => setSpouse(ev.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Married / civil partner</span></label>
        {spouse && <div className="ml-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">Left to spouse from the estate (exempt)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={spouseEstate} onChange={(ev) => setSpouseEstate(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Amount left to spouse or civil partner from the estate" /></div></div>
          <div><label className="block text-sm font-medium mb-2">Pension left to spouse (exempt from 2027)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={spousePension} onChange={(ev) => setSpousePension(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Pension left to spouse or civil partner" /></div></div>
        </div>}
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={rnrb} onChange={(ev) => setRnrb(ev.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Home passes to direct descendants (RNRB)</span></label>
        {rnrb && <div className="ml-8"><label className="block text-sm font-medium mb-2">Value of the home they inherit (after any mortgage)</label><div className="relative w-full sm:w-64"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={homeValue} onChange={(ev) => setHomeValue(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Value of the home direct descendants inherit" /></div></div>}
      </div>
      <div className="sm:w-64"><label className="block text-sm font-medium mb-2">Beneficiary&apos;s income tax rate (%), for death at 75+</label><input type="number" min="0" max="48" value={taxRate} onChange={(ev) => setTaxRate(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Beneficiary's income tax rate (%), for death at 75 or over" /></div>

      {(e > 0 || p > 0) && (
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
          {p > 0 && (
            <div className="rounded-xl border border-border p-4 text-center">
              <p className="text-sm font-medium">Death at 75 or over: IHT plus income tax on the pension</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(result.after75Combined)} ({result.after75CombinedPct.toFixed(1)}% of the pot)</p>
              <p className="text-xs text-muted-foreground mt-1">{formatCurrency(result.pensionIHT)} IHT, its share of the total pro rata, plus {formatCurrency(result.after75IncomeTax)} income tax at an illustrative flat {rate}% on the rest, including anything left to a spouse. Income tax is charged on the amount after IHT. Real tax depends on how much the beneficiary draws each year.</p>
            </div>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Key change from April 2027:</p>
            <p>Unused pensions are included in the estate for IHT for deaths from 6 April 2027 (Finance Act 2026); death-in-service benefits and dependants' scheme pensions stay outside. The personal representatives are liable for reporting and paying the tax, and pension beneficiaries are generally jointly liable. Above £2m the residence nil-rate band tapers away{result.newRNRB < result.RNRB ? `, which here costs ${formatCurrency(result.RNRB - result.newRNRB)} of it` : ''}, and it can never exceed the value of the home. Income tax also applies to what beneficiaries draw if you die at 75 or over.</p>
          </div>
        </div>
      )}
    </div>
  )
}
