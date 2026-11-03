import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const AIA_LIMIT = 1_000_000
const WDA_SPECIAL = 6 // percent, unchanged by Budget 2026
const FIRST_DATE = '2023-04-01' // full expensing begins and the £1M AIA becomes permanent
const LONG_LIFE_LIMIT = 100_000 // long-life spend of this or less in a 12-month period goes in the main pool
const SMALL_POOL_LIMIT = 1_000 // a pool at or below this can be claimed in full

type AssetType = 'plant' | 'integral' | 'special' | 'car_zero' | 'car_low' | 'car_high'

const TAX_RATES = {
  company: [['25', '25% main rate'], ['26.5', '26.5% marginal relief band'], ['19', '19% small profits rate']],
  other: [['20', '20% basic rate'], ['40', '40% higher rate'], ['45', '45% additional rate']],
}

const ASSET_INFO: Record<AssetType, { name: string; pool: string; mainPool: boolean }> = {
  plant: { name: 'Plant & Machinery', pool: 'Main pool', mainPool: true },
  integral: { name: 'Integral Features', pool: 'Special rate pool', mainPool: false },
  special: { name: 'Long-life asset', pool: 'Special rate pool over £100,000, otherwise main pool', mainPool: false },
  car_zero: { name: 'Electric or zero-emission car', pool: '100% first-year allowance if new, otherwise main pool', mainPool: true },
  car_low: { name: 'Car (CO2 1-50g/km)', pool: 'Main pool', mainPool: true },
  car_high: { name: 'Car (CO2 >50g/km)', pool: 'Special rate pool', mainPool: false },
}

const YEAR_ENDS = [
  ['03-31', '31 March'], ['04-05', '5 April'], ['04-30', '30 April'], ['05-31', '31 May'], ['06-30', '30 June'],
  ['07-31', '31 July'], ['08-31', '31 August'], ['09-30', '30 September'], ['10-31', '31 October'],
  ['11-30', '30 November'], ['12-31', '31 December'], ['01-31', '31 January'], ['02-28', 'End of February'],
]

// Dates as whole UTC day numbers, so periods and boundaries compare and subtract cleanly
const toDay = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d) / 86_400_000
const isoToDay = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return toDay(y, m, d) }
const showDay = (day: number) => new Date(day * 86_400_000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

const yearEndDay = (year: number, yearEnd: string) => {
  const [m, d] = yearEnd.split('-').map(Number)
  return m === 2 ? toDay(year, 3, 0) : toDay(year, m, d)
}

type Straddle = { date: number; before: number; days: number }
type WdaRate = { low: number; high: number; label: string; straddle?: Straddle }
const flatRate = (rate: number): WdaRate => ({ low: rate, high: rate, label: `${rate}%` })

// Main pool WDA for a chargeable period: by when the period begins, not when the asset was bought.
// 18% to 14% (2026): a period straddling the date takes the hybrid in Finance Act 2026 s.28, weighted
// by days and rounded up to 2 decimal places. 14% to 12% (2027, Budget 2026): HMRC says only that the
// hybrid depends on the proportion of the period each side of the date. No formula is published until
// Finance Bill 2026-27, so a straddling period is the range between the two rates, not a guessed figure.
function mainPoolRate(start: number, end: number, isCompany: boolean): WdaRate {
  const from2026 = isCompany ? toDay(2026, 4, 1) : toDay(2026, 4, 6)
  const from2027 = isCompany ? toDay(2027, 4, 1) : toDay(2027, 4, 6)
  const days = end - start + 1
  if (end < from2026) return flatRate(18)
  if (start < from2026) {
    const before = from2026 - start
    const hybrid = Math.ceil((18 * before + 14 * (days - before)) * 100 / days) / 100
    return { low: hybrid, high: hybrid, label: `${hybrid}% hybrid` }
  }
  if (end < from2027) return flatRate(14)
  if (start < from2027) return { low: 12, high: 14, label: '12% to 14% hybrid', straddle: { date: from2027, before: from2027 - start, days } }
  return flatRate(12)
}

// Main rate first-year allowance outside full expensing, by the date the expenditure is incurred
const mainRateFya = (purchase: number) => purchase >= toDay(2027, 1, 1) ? 50 : purchase >= toDay(2026, 1, 1) ? 40 : 0

type ScheduleRow = { year: number; periodEnd: number; rate: string; small: boolean; wdaLow: number; wdaHigh: number; remainingLow: number; remainingHigh: number; straddle?: Straddle }
type PeriodPlan = { firstEndYear: number; yearEnd: string; isCompany: boolean }

// Reducing balance over 12-month periods; year 1 is the period the purchase falls in.
// Low and high stay equal unless a period straddles 1 or 6 April 2027.
// The asset is treated as alone in its pool, so the small pools allowance applies once the balance is
// £1,000 or less. Private use means a single asset pool: no small pools allowance, and the claim is
// reduced to the business share while the balance still falls by the full allowance.
const wdaSchedule = (amount: number, mainPool: boolean, firstYear: number, plan: PeriodPlan, businessShare: number) => {
  const rows: ScheduleRow[] = []
  let low = amount
  let high = amount
  for (let y = firstYear; y <= 10; y++) {
    const endYear = plan.firstEndYear + y - 1
    const start = yearEndDay(endYear - 1, plan.yearEnd) + 1
    const end = yearEndDay(endYear, plan.yearEnd)
    const rate = mainPool ? mainPoolRate(start, end, plan.isCompany) : flatRate(WDA_SPECIAL)
    const smallPools = businessShare === 1
    const smallLow = smallPools && low <= SMALL_POOL_LIMIT
    const smallHigh = smallPools && high <= SMALL_POOL_LIMIT
    const small = smallLow && smallHigh
    const wdaLow = (smallLow ? low : low * rate.low / 100) * businessShare
    const wdaHigh = (smallHigh ? high : high * rate.high / 100) * businessShare
    low -= smallLow ? low : low * rate.high / 100
    high -= smallHigh ? high : high * rate.low / 100
    rows.push({ year: y, periodEnd: end, rate: small ? 'Small pool' : rate.label, small, wdaLow, wdaHigh, remainingLow: low, remainingHigh: high, straddle: small ? undefined : rate.straddle })
    if (low === 0 && high === 0) break
  }
  return rows
}

const wdaMethod = (row: ScheduleRow) => row.small ? 'Small pools allowance (pool of £1,000 or less)' : `Writing Down Allowance (${row.rate})`

// Year-1 relief. AIA (£1m) covers plant including integral features and long-life assets, new or
// used, never cars. Above the AIA, for new assets only: companies get full expensing (100%) on
// main-rate plant and a 50% FYA on special-rate assets; other businesses get the main rate FYA on
// main-rate plant (40% from 1 January 2026, 50% from 1 January 2027). Used assets and special-rate
// assets outside a company take the WDA. The balance goes into the pool.
function calculate(cost: number, assetType: AssetType, useAIA: boolean, isCompany: boolean, purchaseDate: string, yearEnd: string, isNew: boolean, taxRatePct: number, businessUsePct: number) {
  const info = ASSET_INFO[assetType]
  const taxRate = taxRatePct / 100
  // Only sole traders and partnerships reduce allowances for private use
  const businessShare = isCompany ? 1 : businessUsePct / 100
  const purchase = isoToDay(purchaseDate)
  const purchaseYear = Number(purchaseDate.slice(0, 4))
  const plan: PeriodPlan = { firstEndYear: purchase > yearEndDay(purchaseYear, yearEnd) ? purchaseYear + 1 : purchaseYear, yearEnd, isCompany }
  const finish = (method: string, year1Low: number, year1High: number, schedule: ScheduleRow[]) => ({
    method, year1Low, year1High, taxLow: year1Low * taxRate, taxHigh: year1High * taxRate, taxRatePct, schedule, straddleRow: schedule.find((r) => r.straddle),
  })

  if (assetType === 'car_zero') {
    const lastDay = isCompany ? toDay(2027, 3, 31) : toDay(2027, 4, 5)
    if (isNew && purchase <= lastDay) return finish('100% first-year allowance (to 31 March 2027 for companies, 5 April 2027 otherwise)', cost * businessShare, cost * businessShare, [])
    const schedule = wdaSchedule(cost, true, 1, plan, businessShare)
    return finish(`${wdaMethod(schedule[0])}: ${isNew ? `the 100% first-year allowance ended ${showDay(lastDay)}` : 'a used electric car goes in the main pool'}`, schedule[0].wdaLow, schedule[0].wdaHigh, schedule)
  }
  if (assetType === 'car_low' || assetType === 'car_high') {
    const schedule = wdaSchedule(cost, info.mainPool, 1, plan, businessShare)
    return finish(`${wdaMethod(schedule[0])}, cars get no AIA`, schedule[0].wdaLow, schedule[0].wdaHigh, schedule)
  }

  // Long-life spend of £100,000 or less in the period is main-rate expenditure
  const isMain = assetType === 'plant' || (assetType === 'special' && cost <= LONG_LIFE_LIMIT)
  const aiaPart = useAIA ? Math.min(cost, AIA_LIMIT) : 0
  const rest = cost - aiaPart
  const parts: string[] = []
  if (aiaPart > 0) parts.push('Annual Investment Allowance')
  let restLow = 0
  let restHigh = 0
  let schedule: ScheduleRow[] = []
  if (rest > 0) {
    const fya = !isNew ? 0 : isMain ? (isCompany ? 100 : mainRateFya(purchase)) : (isCompany ? 50 : 0)
    if (fya > 0) {
      const fyaAmount = rest * fya / 100
      restLow = restHigh = fyaAmount * businessShare
      parts.push(fya === 100 ? 'Full Expensing (100%)' : `${fya}% first-year allowance`)
      if (fya < 100) schedule = wdaSchedule(rest - fyaAmount, isMain, 2, plan, businessShare)
    } else {
      schedule = wdaSchedule(rest, isMain, 1, plan, businessShare)
      restLow = schedule[0].wdaLow
      restHigh = schedule[0].wdaHigh
      parts.push(wdaMethod(schedule[0]))
    }
  }
  return finish(parts.join(' + '), aiaPart * businessShare + restLow, aiaPart * businessShare + restHigh, schedule)
}

const money = (low: number, high: number) => Math.abs(high - low) < 0.005 ? formatCurrency(low) : `${formatCurrency(low)} to ${formatCurrency(high)}`

export default function CapitalAllowancesCalculator() {
  const [cost, setCost] = useState('50000')
  const [asset, setAsset] = useState<AssetType>('plant')
  const [aia, setAia] = useState(true)
  const [company, setCompany] = useState(true)
  const [purchaseDate, setPurchaseDate] = useState('2026-11-01')
  const [yearEnd, setYearEnd] = useState('03-31')
  const [condition, setCondition] = useState('new')
  const [taxRate, setTaxRate] = useState('25')
  const [businessUse, setBusinessUse] = useState('100')

  const changeCompany = (isCompany: boolean) => {
    setCompany(isCompany)
    setYearEnd(isCompany ? '03-31' : '04-05')
    setTaxRate(isCompany ? '25' : '20')
  }

  const c = parseFloat(cost.replace(/,/g,'')) || 0
  const dateOk = purchaseDate >= FIRST_DATE
  const isNew = condition === 'new'
  const rate = parseFloat(taxRate)
  const use = businessUse.trim() === '' ? 100 : Math.min(100, Math.max(0, parseFloat(businessUse) || 0))
  const result = useMemo(() => dateOk ? calculate(c, asset, aia, company, purchaseDate, yearEnd, isNew, rate, use) : null, [c, asset, aia, company, purchaseDate, yearEnd, isNew, rate, use, dateOk])
  const showCondition = asset !== 'car_low' && asset !== 'car_high'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Asset Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Asset Cost" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Asset Type</label><select value={asset} onChange={(e) => setAsset(e.target.value as AssetType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Asset Type">{Object.entries(ASSET_INFO).map(([k,v]) => <option key={k} value={k}>{v.name}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Purchase Date</label><input type="date" min={FIRST_DATE} value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Purchase Date" /></div>
        <div><label className="block text-sm font-medium mb-2">Accounting Year Ends</label><select value={yearEnd} onChange={(e) => setYearEnd(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Accounting Year Ends">{YEAR_ENDS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
        {showCondition && <div><label className="block text-sm font-medium mb-2">New or Used</label><select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="New or Used"><option value="new">New and unused</option><option value="used">Used (second-hand)</option></select></div>}
        <div><label className="block text-sm font-medium mb-2">Your Tax Rate</label><select value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Your Tax Rate">{(company ? TAX_RATES.company : TAX_RATES.other).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
        {!company && <div><label className="block text-sm font-medium mb-2">Business Use (%)</label><input type="number" min="0" max="100" value={businessUse} onChange={(e) => setBusinessUse(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Business Use percentage" /></div>}
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={aia} onChange={(e) => setAia(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Claim AIA (up to £1M)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={company} onChange={(e) => changeCompany(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Limited company (eligible for Full Expensing)</span></label>
      </div>

      {!dateOk && <p className="text-sm text-muted-foreground">Enter a purchase date on or after 1 April 2023, when full expensing began. Earlier purchases followed different rules.</p>}
      {c > 0 && result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">{result.method}</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{money(result.year1Low, result.year1High)}</p>
            <p className="text-sm text-muted-foreground mt-1">Year 1 tax relief &middot; Tax saving: {money(result.taxLow, result.taxHigh)} (at {result.taxRatePct}% {company ? 'Corporation Tax' : 'income tax'}{company ? '' : ', before any Class 4 National Insurance saving'})</p>
          </div>
          {result.schedule.length > 0 && (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Year to</th><th className="text-right py-2 font-medium text-muted-foreground">Rate</th><th className="text-right py-2 font-medium text-muted-foreground">WDA</th><th className="text-right py-2 font-medium text-muted-foreground">Remaining</th></tr></thead>
              <tbody>{result.schedule.map(r => (
                <tr key={r.year} className="border-b border-border/50"><td className="py-1.5">{showDay(r.periodEnd)}</td><td className="text-right">{r.rate}</td><td className="text-right tabular-nums text-green-600">{money(r.wdaLow, r.wdaHigh)}</td><td className="text-right tabular-nums">{money(r.remainingLow, r.remainingHigh)}</td></tr>
              ))}</tbody>
            </table>
          )}
          {asset === 'special' && c <= LONG_LIFE_LIMIT && <p className="text-sm text-muted-foreground">Long-life spending of £100,000 or less in a 12-month period goes in the main pool, so this is treated as main-rate. If your long-life spending for the period is over £100,000 in total, it goes in the special rate pool at 6%.</p>}
          {!company && use < 100 && <p className="text-sm text-muted-foreground">With private use the asset has its own pool. You claim {use}% of each allowance, but the balance still falls by the full allowance.</p>}
          {result.straddleRow?.straddle && (
            <p className="text-sm text-muted-foreground">The year to {showDay(result.straddleRow.periodEnd)} begins before {showDay(result.straddleRow.straddle.date)} and ends after it, with {result.straddleRow.straddle.before} of its {result.straddleRow.straddle.days} days before that date. A hybrid rate between 14% and 12% applies, set by that proportion, but its formula will not be known until Finance Bill 2026-27 is published. That year and the later ones therefore show the range between the two rates.</p>
          )}
        </div>
      )}

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>The first-year allowance follows the date the expenditure is incurred: on main-rate plant outside full expensing, 40% from 1 January 2026 and 50% on or after 1 January 2027. The main pool rate follows the date each accounting period begins: 14%, then 12% for periods beginning on or after 1 April 2027 (Corporation Tax) or 6 April 2027 (Income Tax). Both Budget 2026 changes await Finance Bill 2026-27. The table assumes 12-month periods and that the asset is alone in its pool, so a real pool's balance and any small pools allowance will differ. The 6% special rate and the £1M AIA are unchanged. Full expensing and first-year allowances need a new asset, while the AIA covers new or used.</p>
        {!company && <p className="mt-2">If you use the cash basis, the default for sole traders since 2024/25, you can claim capital allowances only on cars. Other equipment you buy to keep and use is a normal allowable expense instead, so this table does not apply to it.</p>}
      </div>
    </div>
  )
}
