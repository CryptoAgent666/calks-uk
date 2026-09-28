import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Regional maximum cash discounts — Housing (Right to Buy) (Limits on Discount)
// (England) Order 2024 (SI 2024/1073), Schedule 1, in force 21 November 2024.
const REGION_CAPS: Record<string, number> = {
  'London': 16_000,
  'East of England': 34_000,
  'South East': 38_000,
  'South West': 30_000,
  'East Midlands': 24_000,
  'West Midlands': 26_000,
  'North East': 22_000,
  'North West': 26_000,
  'Yorkshire and the Humber': 24_000,
}

// Local exceptions — SI 2024/1073 art 2(3) and Schedule 2 (£16,000), art 2(4) (£38,000)
const LOCAL_EXCEPTIONS: Record<string, { areas: string; cap: number }> = {
  'London': { areas: 'Barking and Dagenham or Havering', cap: 38_000 },
  'East of England': { areas: 'Watford', cap: 16_000 },
  'South East': { areas: 'Reading, West Berkshire, Hart, Oxford, Vale of White Horse, Tonbridge and Malling, Epsom and Ewell, or Reigate and Banstead', cap: 16_000 },
}

// Share of the discount repaid on a sale in years 1-5 after buying (Housing Act 1985 s155A)
const REPAYMENT_SHARE = [100, 80, 60, 40, 20]

function calculate(marketValue: number, yearsAsTenant: number, isHouse: boolean, region: string, inLocalException: boolean) {
  const baseDiscount = isHouse ? 35 : 50 // houses 35%, flats 50% (for 3–5 years' tenancy)
  const additionalPerYear = isHouse ? 1 : 2 // +1%/yr (houses) / +2%/yr (flats) for each year ABOVE 5
  const minYears = 3 // 3 years with a public sector landlord to qualify
  const incrementFromYear = 5 // base rate applies for 3–5 years; extra % only kicks in after year 5
  const exception = LOCAL_EXCEPTIONS[region]
  const maxDiscount = inLocalException && exception ? exception.cap : REGION_CAPS[region] ?? 16_000

  const qualifies = yearsAsTenant >= minYears
  const extraYears = Math.max(0, Math.floor(yearsAsTenant) - incrementFromYear)
  const discountPct = qualifies ? Math.min(baseDiscount + extraYears * additionalPerYear, 70) : 0
  const uncappedDiscount = marketValue * (discountPct / 100)
  const discountAmount = Math.min(uncappedDiscount, maxDiscount)
  const isCapped = uncappedDiscount > maxDiscount
  // The discount actually received as a percentage of the value at purchase: this is the
  // percentage applied to the resale value if you sell within 5 years
  const effectivePct = marketValue > 0 ? (discountAmount / marketValue) * 100 : 0
  const purchasePrice = marketValue - discountAmount

  return { qualifies, minYears, discountPct, uncappedDiscount, discountAmount, isCapped, effectivePct, purchasePrice, maxDiscount }
}

function calculateRepayment(effectivePct: number, resaleValue: number, yearOfSale: number) {
  const share = yearOfSale >= 1 && yearOfSale <= 5 ? REPAYMENT_SHARE[yearOfSale - 1] : 0
  const discountOnResale = resaleValue * (effectivePct / 100)
  const repayment = discountOnResale * (share / 100)
  return { share, discountOnResale, repayment }
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function RightToBuyCalculator() {
  const [value, setValue] = useState('180000')
  const [years, setYears] = useState('12')
  const [isHouse, setIsHouse] = useState(true)
  const [region, setRegion] = useState('North West')
  const [inException, setInException] = useState(false)
  const [showResale, setShowResale] = useState(false)
  const [resale, setResale] = useState('200000')
  const [saleYear, setSaleYear] = useState('4')

  const v = parseFloat(value.replace(/,/g, '')) || 0
  const y = parseInt(years) || 0
  const exception = LOCAL_EXCEPTIONS[region]
  const localActive = inException && !!exception
  const result = useMemo(() => calculate(v, y, isHouse, region, localActive), [v, y, isHouse, region, localActive])
  const rv = parseFloat(resale.replace(/,/g, '')) || 0
  const sy = parseInt(saleYear) || 6
  const repay = useMemo(() => calculateRepayment(result.effectivePct, rv, sy), [result.effectivePct, rv, sy])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Market value of your home</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Market value of your home" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years as a public sector tenant</label><input type="number" min="0" max="60" value={years} onChange={(e) => setYears(e.target.value)} className={inputClass} aria-label="Years as a public sector tenant" /><p className="text-xs text-muted-foreground mt-1">Council, housing association or NHS trust; the years do not have to be in a row.</p></div>
        <div><label className="block text-sm font-medium mb-2">Property type</label><div className="grid grid-cols-2 gap-2" role="group" aria-label="Property type"><button type="button" aria-pressed={isHouse} onClick={() => setIsHouse(true)} className={`px-4 py-3 rounded-xl text-sm font-medium border ${isHouse ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>House</button><button type="button" aria-pressed={!isHouse} onClick={() => setIsHouse(false)} className={`px-4 py-3 rounded-xl text-sm font-medium border ${!isHouse ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Flat</button></div></div>
        <div><label className="block text-sm font-medium mb-2">Region</label><select value={region} onChange={(e) => { setRegion(e.target.value); setInException(false) }} className={inputClass} aria-label="Region">{Object.keys(REGION_CAPS).map(r => <option key={r} value={r}>{r} — £{REGION_CAPS[r].toLocaleString('en-GB')} cap</option>)}</select></div>
      </div>
      {exception && (
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={inException} onChange={(e) => setInException(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label={`Home is in ${exception.areas}`} /><span className="text-sm">My home is in {exception.areas} (£{exception.cap.toLocaleString('en-GB')} cap)</span></label>
      )}
      <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-sm text-orange-800 dark:text-orange-300">Right to Buy discounts in England were cut from 21 November 2024 (SI 2024/1073) to regional cash caps of £16,000–£38,000, with different caps in a few council areas. The discount is the lower of your percentage entitlement and the cap. It can also be reduced if your landlord has spent money building, buying, repairing or improving the home (the cost floor), or if you have used Right to Buy before.</div>
      {!result.qualifies && y > 0 && <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-center text-sm text-orange-800 dark:text-orange-300">You need at least {result.minYears} years with a public sector landlord to qualify</div>}
      {v > 0 && result.qualifies && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Your purchase price</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.purchasePrice)}</p>
            <p className="text-sm text-muted-foreground mt-1">Discount: {formatCurrency(result.discountAmount)} ({result.effectivePct.toFixed(1)}% of value){result.isCapped ? `, your ${result.discountPct}% entitlement is limited by the ${formatCurrency(result.maxDiscount)} cap` : ''}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Entitlement ({result.discountPct}%)</p><p className="text-lg font-bold">{formatCurrency(result.uncappedDiscount)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Cash cap</p><p className="text-lg font-bold">{formatCurrency(result.maxDiscount)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Discount you get</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.discountAmount)}</p></div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={showResale} onChange={(e) => setShowResale(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label="Estimate the repayment if I sell within 5 years" /><span className="text-sm">Sell within 5 years? Estimate the discount repayment</span></label>
          {showResale && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-2">Expected sale price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={resale} onChange={(e) => setResale(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Expected sale price" /></div></div>
                <div><label className="block text-sm font-medium mb-2">When you sell</label><select value={saleYear} onChange={(e) => setSaleYear(e.target.value)} className={inputClass} aria-label="When you sell"><option value="1">1st year after buying (repay 100%)</option><option value="2">2nd year (repay 80%)</option><option value="3">3rd year (repay 60%)</option><option value="4">4th year (repay 40%)</option><option value="5">5th year (repay 20%)</option><option value="6">After 5 years (nothing to repay)</option></select></div>
              </div>
              <div className="rounded-xl bg-destructive/10 p-4 text-center">
                <p className="text-xs text-muted-foreground">Discount to repay</p>
                <p className="text-2xl font-bold text-destructive">{formatCurrency(Math.round(repay.repayment * 100) / 100)}</p>
                <p className="text-xs text-muted-foreground mt-1">{result.effectivePct.toFixed(2)}% of {formatCurrency(rv)} = {formatCurrency(Math.round(repay.discountOnResale * 100) / 100)}, × {repay.share}%</p>
              </div>
              <p className="text-xs text-muted-foreground">If you sell within 10 years you must first offer the home to your former landlord or another social landlord in the area. You may not have to repay the discount if you transfer the home to a family member, which you need to agree with your landlord first.</p>
            </div>
          )}
        </div>
      )}
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>This calculator covers Right to Buy for council tenants in England, including the Preserved Right to Buy. Housing association tenants may instead have the Right to Acquire, which has fixed discounts of £9,000 to £16,000 and is not covered here. The Social Housing Bill [HL], now before the House of Commons, would lengthen the qualifying period to 10 years and cut the discount to 5% rising to 15% of value, but it is not yet law, so the rules above still apply.</p>
      </div>
    </div>
  )
}
