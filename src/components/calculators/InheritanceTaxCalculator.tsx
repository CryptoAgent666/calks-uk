import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

const NIL_RATE_BAND = 325_000
const RNRB = 175_000 // Residence nil-rate band
const IHT_RATE = 0.40
const RNRB_TAPER_START = 2_000_000

// estate = net value of the whole estate (assets minus debts) BEFORE exemptions and reliefs.
// The RNRB taper is tested on that figure, not on what is left after the spouse exemption
// (gov.uk: "do not take off any exemptions such as spouse exemption").
// The RNRB is also capped at the value of the home (or share of it) passing to direct descendants.
// Transfers from a late spouse or civil partner are the unused PERCENTAGE of each band,
// applied to today's band (gov.uk: inheritance-tax-transfer-of-threshold). The survivor's
// own RNRB plus the brought-forward RNRB is the "default allowance", and the £2m taper
// comes off that total before the home cap (IHTA 1984 s.8D(5)(f)-(g)).
function calculate(estate: number, hasProperty: boolean, passToDirectDescendant: boolean, spouseExempt: number, homeToDescendants = RNRB, transferredNrbPct = 0, transferredRnrbPct = 0) {
  const netEstate = Math.max(0, estate - spouseExempt)
  const nrbPct = Math.min(100, Math.max(0, transferredNrbPct))
  const rnrbPct = Math.min(100, Math.max(0, transferredRnrbPct))

  const transferredNrb = NIL_RATE_BAND * nrbPct / 100
  const nrb = NIL_RATE_BAND + transferredNrb
  const transferredRnrb = RNRB * rnrbPct / 100
  let rnrb = 0
  let rnrbTaper = 0
  let rnrbCappedByHome = false

  if (hasProperty && passToDirectDescendant) {
    const defaultAllowance = RNRB + transferredRnrb
    let maxRnrb = defaultAllowance
    if (estate > RNRB_TAPER_START) {
      rnrbTaper = Math.min(defaultAllowance, Math.floor((estate - RNRB_TAPER_START) / 2))
      maxRnrb = defaultAllowance - rnrbTaper
    }
    const homeValue = Math.max(0, Math.min(homeToDescendants, estate))
    rnrb = Math.min(maxRnrb, homeValue)
    rnrbCappedByHome = homeValue < maxRnrb
  }

  const totalNilRate = nrb + rnrb
  const taxableEstate = Math.max(0, netEstate - totalNilRate)
  const iht = taxableEstate * IHT_RATE

  return {
    estate, netEstate, nrb, transferredNrb, transferredRnrb, rnrb, rnrbTaper, rnrbCappedByHome, totalNilRate, taxableEstate, iht,
    effectiveRate: estate > 0 ? (iht / estate) * 100 : 0,
  }
}

export default function InheritanceTaxCalculator() {
  const [estate, setEstate] = useState('')
  const [hasProperty, setHasProperty] = useState(true)
  const [descendant, setDescendant] = useState(true)
  const [spouseExempt, setSpouseExempt] = useState('0')
  const [homeValue, setHomeValue] = useState('300000')
  const [nrbTransfer, setNrbTransfer] = useState('0')
  const [rnrbTransfer, setRnrbTransfer] = useState('0')

  const e = parseFloat(estate.replace(/,/g, '')) || 0
  const s = parseFloat(spouseExempt.replace(/,/g, '')) || 0
  const h = parseFloat(homeValue.replace(/,/g, '')) || 0
  const tn = parseFloat(nrbTransfer) || 0
  const tr = parseFloat(rnrbTransfer) || 0
  const result = useMemo(() => calculate(e, hasProperty, descendant, s, h, tn, tr), [e, hasProperty, descendant, s, h, tn, tr])

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="iht-estate" className="block text-sm font-medium mb-2">Total Estate Value</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
          <input id="iht-estate" type="text" inputMode="numeric" value={estate} onChange={(e) => setEstate(e.target.value)} placeholder="500,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Total Estate Value" />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[325_000, 500_000, 750_000, 1_000_000, 2_000_000].map((a) => (
            <button key={a} onClick={() => setEstate(a.toLocaleString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">£{a >= 1_000_000 ? `${a / 1_000_000}M` : `${a / 1000}K`}</button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Everything owned less debts, before any spouse, charity or other exemptions.</p>
      </div>

      <div>
        <label htmlFor="iht-spouse" className="block text-sm font-medium mb-2">Amount Left to Spouse/Civil Partner (exempt)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <input id="iht-spouse" type="text" inputMode="numeric" value={spouseExempt} onChange={(e) => setSpouseExempt(e.target.value)} placeholder="0" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Amount Left to Spouse/Civil Partner (exempt)" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="iht-nrb-transfer" className="block text-sm font-medium mb-2">Late Spouse's Unused Nil-Rate Band (%)</label>
          <input id="iht-nrb-transfer" type="number" min="0" max="100" step="1" value={nrbTransfer} onChange={(e) => setNrbTransfer(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Late Spouse's Unused Nil-Rate Band (%)" />
        </div>
        <div>
          <label htmlFor="iht-rnrb-transfer" className="block text-sm font-medium mb-2">Late Spouse's Unused Residence Band (%)</label>
          <input id="iht-rnrb-transfer" type="number" min="0" max="100" step="1" value={rnrbTransfer} onChange={(e) => setRnrbTransfer(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Late Spouse's Unused Residence Band (%)" />
        </div>
        <p className="text-xs text-muted-foreground sm:col-span-2 -mt-2">For a widow, widower or surviving civil partner: the percentage of each band the first estate did not use (100% if everything went to you). Leave at 0 otherwise.</p>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={hasProperty} onChange={(e) => setHasProperty(e.target.checked)} className="h-5 w-5 rounded border-border" />
          <span className="text-sm">Estate includes a main residence</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={descendant} onChange={(e) => setDescendant(e.target.checked)} className="h-5 w-5 rounded border-border" />
          <span className="text-sm">Property passes to direct descendants (children/grandchildren)</span>
        </label>
      </div>

      {hasProperty && descendant && (
        <div>
          <label htmlFor="iht-home" className="block text-sm font-medium mb-2">Value of home left to children/grandchildren</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input id="iht-home" type="text" inputMode="numeric" value={homeValue} onChange={(e) => setHomeValue(e.target.value)} placeholder="300,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Value of home left to children/grandchildren" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Your share of the home, less any mortgage on it. The residence nil-rate band cannot exceed this value.</p>
        </div>
      )}

      {e > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Inheritance Tax to Pay</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.iht)}</p>
            <p className="text-sm text-muted-foreground mt-1">Effective rate: {formatPercent(result.effectiveRate)}</p>
          </div>

          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2.5">Total Estate</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.estate)}</td></tr>
              {s > 0 && <tr className="border-b border-border/50"><td className="py-2.5 text-green-600">Spouse Exemption</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(s)}</td></tr>}
              <tr className="border-b border-border/50"><td className="py-2.5">Nil-Rate Band{result.transferredNrb > 0 ? ` (incl. ${formatCurrency(result.transferredNrb)} transferred)` : ''}</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(result.nrb)}</td></tr>
              {result.rnrb > 0 && <tr className="border-b border-border/50"><td className="py-2.5">Residence Nil-Rate Band{result.rnrbCappedByHome ? ' (limited to home value)' : result.rnrbTaper > 0 ? ` (tapered by ${formatCurrency(result.rnrbTaper)})` : ''}</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(result.rnrb)}</td></tr>}
              <tr className="border-b border-border/50"><td className="py-2.5">Taxable Estate</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.taxableEstate)}</td></tr>
              <tr className="font-semibold"><td className="py-2.5 text-destructive">IHT at 40%</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.iht)}</td></tr>
            </tbody>
          </table>
          {hasProperty && descendant && result.rnrbTaper > 0 && (
            <p className="text-xs text-muted-foreground">The residence nil-rate band{result.transferredRnrb > 0 ? ', including the part transferred from your late spouse,' : ''} is reduced by £1 for every £2 the whole estate exceeds £2m, measured before the spouse exemption and other exemptions or reliefs.</p>
          )}
          {hasProperty && descendant && result.transferredRnrb > 0 && (
            <p className="text-xs text-muted-foreground">Residence band available before the taper and home cap: {formatCurrency(RNRB + result.transferredRnrb)} (your {formatCurrency(RNRB)} plus {formatCurrency(result.transferredRnrb)} transferred).</p>
          )}
        </div>
      )}
    </div>
  )
}
