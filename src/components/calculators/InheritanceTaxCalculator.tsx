import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

const NIL_RATE_BAND = 325_000
const RNRB = 175_000 // Residence nil-rate band
const IHT_RATE = 0.40
const RNRB_TAPER_START = 2_000_000

function calculate(estate: number, hasProperty: boolean, passToDirectDescendant: boolean, spouseExempt: number) {
  const netEstate = Math.max(0, estate - spouseExempt)

  let nrb = NIL_RATE_BAND
  let rnrb = 0

  if (hasProperty && passToDirectDescendant) {
    rnrb = RNRB
    if (netEstate > RNRB_TAPER_START) {
      const taperReduction = Math.floor((netEstate - RNRB_TAPER_START) / 2)
      rnrb = Math.max(0, RNRB - taperReduction)
    }
  }

  const totalNilRate = nrb + rnrb
  const taxableEstate = Math.max(0, netEstate - totalNilRate)
  const iht = taxableEstate * IHT_RATE

  return {
    estate, netEstate, nrb, rnrb, totalNilRate, taxableEstate, iht,
    effectiveRate: estate > 0 ? (iht / estate) * 100 : 0,
  }
}

export default function InheritanceTaxCalculator() {
  const [estate, setEstate] = useState('')
  const [hasProperty, setHasProperty] = useState(true)
  const [descendant, setDescendant] = useState(true)
  const [spouseExempt, setSpouseExempt] = useState('0')

  const e = parseFloat(estate.replace(/,/g, '')) || 0
  const s = parseFloat(spouseExempt.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(e, hasProperty, descendant, s), [e, hasProperty, descendant, s])

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="iht-estate" className="block text-sm font-medium mb-2">Total Estate Value</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
          <input id="iht-estate" type="text" inputMode="numeric" value={estate} onChange={(e) => setEstate(e.target.value)} placeholder="500,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[325_000, 500_000, 750_000, 1_000_000, 2_000_000].map((a) => (
            <button key={a} onClick={() => setEstate(a.toLocaleString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">£{a >= 1_000_000 ? `${a / 1_000_000}M` : `${a / 1000}K`}</button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="iht-spouse" className="block text-sm font-medium mb-2">Amount Left to Spouse/Civil Partner (exempt)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <input id="iht-spouse" type="text" inputMode="numeric" value={spouseExempt} onChange={(e) => setSpouseExempt(e.target.value)} placeholder="0" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
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
              <tr className="border-b border-border/50"><td className="py-2.5">Nil-Rate Band</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(result.nrb)}</td></tr>
              {result.rnrb > 0 && <tr className="border-b border-border/50"><td className="py-2.5">Residence Nil-Rate Band</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(result.rnrb)}</td></tr>}
              <tr className="border-b border-border/50"><td className="py-2.5">Taxable Estate</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.taxableEstate)}</td></tr>
              <tr className="font-semibold"><td className="py-2.5 text-destructive">IHT at 40%</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.iht)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
