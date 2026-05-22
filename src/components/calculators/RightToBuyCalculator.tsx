import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(marketValue: number, yearsAsTenant: number, isHouse: boolean) {
  const baseDiscount = isHouse ? 35 : 50 // houses 35%, flats 50% (from year 3)
  const additionalPerYear = isHouse ? 1 : 2 // +1%/yr for houses, +2%/yr for flats
  const minYears = 3 // 3 years minimum for both houses and flats
  const maxDiscount = 34_000 // England cap (outside London) — reduced from £96K to £38K in Nov 2023, further reduced to ~£34K from Oct 2024

  const qualifies = yearsAsTenant >= minYears
  const extraYears = Math.max(0, yearsAsTenant - minYears)
  const discountPct = Math.min(baseDiscount + extraYears * additionalPerYear, isHouse ? 70 : 70)
  const discountAmount = Math.min(marketValue * (discountPct / 100), maxDiscount)
  const purchasePrice = marketValue - discountAmount

  return { qualifies, minYears, discountPct, discountAmount, purchasePrice, maxDiscount }
}

export default function RightToBuyCalculator() {
  const [value, setValue] = useState('200000')
  const [years, setYears] = useState('10')
  const [isHouse, setIsHouse] = useState(true)

  const v = parseFloat(value.replace(/,/g,'')) || 0
  const y = parseInt(years) || 0
  const result = useMemo(() => calculate(v, y, isHouse), [v, y, isHouse])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Market Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Market Value" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years as Tenant</label><input type="number" min="0" max="50" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years as Tenant" /></div>
        <div><label className="block text-sm font-medium mb-2">Property Type</label><div className="grid grid-cols-2 gap-2"><button onClick={() => setIsHouse(true)} className={`px-4 py-3 rounded-xl text-sm font-medium border ${isHouse ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>House</button><button onClick={() => setIsHouse(false)} className={`px-4 py-3 rounded-xl text-sm font-medium border ${!isHouse ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Flat</button></div></div>
      </div>
      <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-sm text-orange-800 dark:text-orange-300">Right to Buy discounts have been significantly reduced. Max discount £34,000 (outside London) or £38,400 (London) from October 2024. Check gov.uk for the latest caps — further changes are possible.</div>
      {!result.qualifies && y > 0 && <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-center text-sm text-orange-800 dark:text-orange-300">You need at least {result.minYears} years as a public sector tenant to qualify</div>}
      {v > 0 && result.qualifies && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Your Purchase Price</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.purchasePrice)}</p>
            <p className="text-sm text-muted-foreground mt-1">Discount: {formatCurrency(result.discountAmount)} ({result.discountPct}%)</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Market Value</p><p className="text-lg font-bold">{formatCurrency(v)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Discount</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.discountAmount)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Max Discount</p><p className="text-lg font-bold">{formatCurrency(result.maxDiscount)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
