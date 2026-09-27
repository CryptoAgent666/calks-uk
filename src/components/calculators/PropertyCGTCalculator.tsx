import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent, ukPersonalAllowance, UK_BASIC_BAND } from '@/utils'

const CGT_ALLOWANCE = 3_000
const RESIDENTIAL_BASIC = 0.18
const RESIDENTIAL_HIGHER = 0.24
/** Final period of ownership that always qualifies once the home was your main residence. */
const FINAL_PERIOD_MONTHS = 9

function calculate(purchasePrice: number, salePrice: number, costs: number, improvements: number, otherIncome: number, isMainHome: boolean, yearsOwned: number, yearsLived: number, livedUntilSale: boolean) {
  const lived = isMainHome ? Math.min(Math.max(0, yearsLived), Math.max(0, yearsOwned)) : 0
  if (isMainHome && yearsLived > 0 && yearsLived >= yearsOwned) return { exempt: true, reason: 'Private Residence Relief: fully exempt' }

  const gain = salePrice - purchasePrice - costs - improvements
  if (gain <= 0) return { exempt: true, reason: `No gain (${formatCurrency(gain)})` }

  // Partial Private Residence Relief. The final 9 months always count once the
  // property has been your main home. If you lived there up to the sale they
  // already fall inside the occupation period, so they are not added twice.
  let pprRelief = 0
  let pprMonths = 0
  const totalMonths = yearsOwned * 12
  if (totalMonths > 0 && lived > 0) {
    const occupied = lived * 12
    pprMonths = livedUntilSale ? Math.max(occupied, FINAL_PERIOD_MONTHS) : occupied + FINAL_PERIOD_MONTHS
    pprMonths = Math.min(pprMonths, totalMonths)
    pprRelief = gain * (pprMonths / totalMonths)
  }

  const gainAfterRelief = gain - pprRelief
  const allowanceUsed = Math.min(CGT_ALLOWANCE, gainAfterRelief)
  const taxableGain = Math.max(0, gainAfterRelief - CGT_ALLOWANCE)

  // Gains sit on top of taxable income. The basic rate band is £37,700 of
  // taxable income, so the room left is £37,700 minus income after the
  // (tapered) Personal Allowance. Unused allowance cannot be set against gains.
  const taxableIncome = Math.max(0, otherIncome - ukPersonalAllowance(otherIncome))
  const remainingBasic = Math.max(0, UK_BASIC_BAND - taxableIncome)
  const gainAtBasic = Math.min(taxableGain, remainingBasic)
  const gainAtHigher = taxableGain - gainAtBasic
  const cgt = gainAtBasic * RESIDENTIAL_BASIC + gainAtHigher * RESIDENTIAL_HIGHER

  return { exempt: false, gain, pprRelief, pprMonths, totalMonths, allowanceUsed, taxableGain, gainAtBasic, gainAtHigher, cgt, effectiveRate: gain > 0 ? (cgt / gain) * 100 : 0 }
}

export default function PropertyCGTCalculator() {
  const [purchase, setPurchase] = useState('')
  const [sale, setSale] = useState('')
  const [costs, setCosts] = useState('5000')
  const [improvements, setImprovements] = useState('0')
  const [income, setIncome] = useState('40000')
  const [mainHome, setMainHome] = useState(false)
  const [yearsOwned, setYearsOwned] = useState('10')
  const [yearsLived, setYearsLived] = useState('0')
  const [livedUntilSale, setLivedUntilSale] = useState('no')

  const p = parseFloat(purchase.replace(/,/g,'')) || 0
  const s = parseFloat(sale.replace(/,/g,'')) || 0
  const c = parseFloat(costs.replace(/,/g,'')) || 0
  const imp = parseFloat(improvements.replace(/,/g,'')) || 0
  const inc = parseFloat(income.replace(/,/g,'')) || 0
  const yo = parseInt(yearsOwned) || 0
  const yl = parseInt(yearsLived) || 0
  const untilSale = livedUntilSale === 'yes'
  const result = useMemo(() => calculate(p, s, c, imp, inc, mainHome, yo, yl, untilSale), [p, s, c, imp, inc, mainHome, yo, yl, untilSale])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Purchase Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={purchase} onChange={(e) => setPurchase(e.target.value)} placeholder="200,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Purchase Price" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Sale Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={sale} onChange={(e) => setSale(e.target.value)} placeholder="350,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Sale Price" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Buying/Selling Costs</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={costs} onChange={(e) => setCosts(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Buying/Selling Costs" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Improvements</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={improvements} onChange={(e) => setImprovements(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Improvements" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Other Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Other Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years Owned</label><input type="number" min="0" max="50" value={yearsOwned} onChange={(e) => setYearsOwned(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years Owned" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={mainHome} onChange={(e) => setMainHome(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">I lived in it as my main home at some point (Private Residence Relief)</span></label>
      {mainHome && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">Years Lived In as Main Home</label><input type="number" min="0" max="50" value={yearsLived} onChange={(e) => setYearsLived(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years Lived In as Main Home" /></div>
          <div><label className="block text-sm font-medium mb-2">Did You Live There Until the Sale?</label><select value={livedUntilSale} onChange={(e) => setLivedUntilSale(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Did You Live There Until the Sale?"><option value="no">No, I moved out before selling</option><option value="yes">Yes, it was my home up to the sale</option></select></div>
        </div>
      )}

      {p > 0 && s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          {'exempt' in result && result.exempt ? (
            <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center"><p className="text-lg font-bold text-green-700 dark:text-green-400">{result.reason}</p></div>
          ) : 'cgt' in result && (
            <>
              <div className="rounded-2xl bg-destructive/10 p-6 text-center">
                <p className="text-sm text-muted-foreground">Capital Gains Tax on Property</p>
                <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.cgt)}</p>
                <p className="text-sm text-muted-foreground mt-1">Effective rate: {formatPercent(result.effectiveRate)}</p>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border/50"><td className="py-2">Total Gain</td><td className="text-right tabular-nums">{formatCurrency(result.gain)}</td></tr>
                  {'pprRelief' in result && result.pprRelief > 0 && <tr className="border-b border-border/50"><td className="py-2 text-green-600">Private Residence Relief ({result.pprMonths} of {result.totalMonths} months)</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(result.pprRelief)}</td></tr>}
                  <tr className="border-b border-border/50"><td className="py-2 text-green-600">Annual Exempt (£{CGT_ALLOWANCE.toLocaleString()})</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(result.allowanceUsed)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2">Taxable Gain</td><td className="text-right tabular-nums">{formatCurrency(result.taxableGain)}</td></tr>
                  {result.gainAtBasic > 0 && <tr className="border-b border-border/50"><td className="py-2">At 18% ({formatCurrency(result.gainAtBasic)})</td><td className="text-right tabular-nums">{formatCurrency(result.gainAtBasic * RESIDENTIAL_BASIC)}</td></tr>}
                  {result.gainAtHigher > 0 && <tr className="border-b border-border/50"><td className="py-2">At 24% ({formatCurrency(result.gainAtHigher)})</td><td className="text-right tabular-nums">{formatCurrency(result.gainAtHigher * RESIDENTIAL_HIGHER)}</td></tr>}
                  <tr className="font-semibold"><td className="py-2 text-destructive">CGT (18%/24%)</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.cgt)}</td></tr>
                </tbody>
              </table>
              <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
                <p>CGT on property: 18% on the part of the gain inside your unused basic rate band, 24% above it. Report and pay within 60 days of completion. The last 9 months of ownership always count for relief if the property was your main home at some point. Letting Relief, which now applies only where you shared the home with a tenant, is not included.</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
