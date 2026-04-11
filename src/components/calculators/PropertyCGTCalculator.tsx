import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

const CGT_ALLOWANCE = 3_000
const RESIDENTIAL_BASIC = 0.18
const RESIDENTIAL_HIGHER = 0.24

function calculate(purchasePrice: number, salePrice: number, costs: number, improvements: number, otherIncome: number, isMainHome: boolean, yearsOwned: number, yearsLived: number) {
  if (isMainHome && yearsLived === yearsOwned) return { exempt: true, reason: 'Principal Private Residence Relief — fully exempt' }

  const gain = salePrice - purchasePrice - costs - improvements
  if (gain <= 0) return { exempt: true, reason: `No gain (${formatCurrency(gain)})` }

  // Partial PPR
  let pprRelief = 0
  if (yearsOwned > 0 && yearsLived > 0) {
    const exemptMonths = (yearsLived * 12) + 9 // last 9 months always exempt
    const totalMonths = yearsOwned * 12
    pprRelief = gain * Math.min(exemptMonths / totalMonths, 1)
  }

  const taxableGainBeforeAllowance = gain - pprRelief
  const taxableGain = Math.max(0, taxableGainBeforeAllowance - CGT_ALLOWANCE)

  const remainingBasic = Math.max(0, 50_270 - otherIncome)
  const gainAtBasic = Math.min(taxableGain, remainingBasic)
  const gainAtHigher = taxableGain - gainAtBasic
  const cgt = gainAtBasic * RESIDENTIAL_BASIC + gainAtHigher * RESIDENTIAL_HIGHER

  return { exempt: false, gain, pprRelief, taxableGain, cgt, effectiveRate: gain > 0 ? (cgt / gain) * 100 : 0 }
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

  const p = parseFloat(purchase.replace(/,/g,'')) || 0
  const s = parseFloat(sale.replace(/,/g,'')) || 0
  const c = parseFloat(costs.replace(/,/g,'')) || 0
  const imp = parseFloat(improvements.replace(/,/g,'')) || 0
  const inc = parseFloat(income.replace(/,/g,'')) || 0
  const yo = parseInt(yearsOwned) || 0
  const yl = parseInt(yearsLived) || 0
  const result = useMemo(() => calculate(p, s, c, imp, inc, mainHome, yo, yl), [p, s, c, imp, inc, mainHome, yo, yl])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Purchase Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={purchase} onChange={(e) => setPurchase(e.target.value)} placeholder="200,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Sale Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={sale} onChange={(e) => setSale(e.target.value)} placeholder="350,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Buying/Selling Costs</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={costs} onChange={(e) => setCosts(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Improvements</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={improvements} onChange={(e) => setImprovements(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Other Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years Owned</label><input type="number" min="0" max="50" value={yearsOwned} onChange={(e) => setYearsOwned(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Years Lived In</label><input type="number" min="0" max="50" value={yearsLived} onChange={(e) => setYearsLived(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={mainHome} onChange={(e) => setMainHome(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">This was/is my main home (PPR relief)</span></label>

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
                  {'pprRelief' in result && result.pprRelief > 0 && <tr className="border-b border-border/50"><td className="py-2 text-green-600">PPR Relief</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(result.pprRelief)}</td></tr>}
                  <tr className="border-b border-border/50"><td className="py-2 text-green-600">Annual Exempt (£{CGT_ALLOWANCE.toLocaleString()})</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(CGT_ALLOWANCE)}</td></tr>
                  <tr className="font-semibold"><td className="py-2 text-destructive">CGT (18%/24%)</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.cgt)}</td></tr>
                </tbody>
              </table>
              <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
                <p>Residential property CGT: 18% basic rate / 24% higher rate. Must report and pay within 60 days of completion. Last 9 months of ownership always exempt if you lived there at some point.</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
