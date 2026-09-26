import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const AIA_LIMIT = 1_000_000
const WRITING_DOWN_MAIN = 0.14 // from April 2026 (was 18%)
const WRITING_DOWN_SPECIAL = 0.06

type AssetType = 'plant' | 'integral' | 'special' | 'car_zero' | 'car_low' | 'car_high'

const ASSET_INFO: Record<AssetType, { name: string; pool: string; rate: number }> = {
  plant: { name: 'Plant & Machinery', pool: 'Main pool', rate: WRITING_DOWN_MAIN },
  integral: { name: 'Integral Features', pool: 'Special rate pool', rate: WRITING_DOWN_SPECIAL },
  special: { name: 'Special Rate (long-life)', pool: 'Special rate pool', rate: WRITING_DOWN_SPECIAL },
  car_zero: { name: 'New zero-emission car', pool: '100% first-year allowance', rate: WRITING_DOWN_MAIN },
  car_low: { name: 'Car (CO2 1-50g/km)', pool: 'Main pool', rate: WRITING_DOWN_MAIN },
  car_high: { name: 'Car (CO2 >50g/km)', pool: 'Special rate pool', rate: WRITING_DOWN_SPECIAL },
}

const wdaSchedule = (amount: number, rate: number, firstYear: number) => {
  const rows: { year: number; wda: number; remaining: number }[] = []
  let remaining = amount
  for (let y = firstYear; y <= 10; y++) {
    const wda = remaining * rate
    remaining -= wda
    rows.push({ year: y, wda, remaining })
  }
  return rows
}

// Year-1 relief on a new asset. AIA (£1m) covers plant including integral features and
// long-life assets, never cars. Above the AIA: companies get full expensing (100%) on main-rate
// plant and a 50% FYA on special-rate assets; other businesses get the 40% FYA on main-rate plant
// (from 1 January 2026) and the 6% WDA on special-rate assets. The balance goes into the pool.
function calculate(cost: number, assetType: AssetType, useAIA: boolean, isCompany: boolean) {
  const info = ASSET_INFO[assetType]
  const taxRate = isCompany ? 0.25 : 0.40

  if (assetType === 'car_zero') {
    return { method: '100% first-year allowance (to 31 March 2027 for companies, 5 April 2027 otherwise)', year1Relief: cost, taxSaving: cost * taxRate, taxRate, schedule: [] }
  }
  if (assetType === 'car_low' || assetType === 'car_high') {
    const schedule = wdaSchedule(cost, info.rate, 1)
    return { method: `Writing Down Allowance (${info.rate * 100}%), cars get no AIA`, year1Relief: schedule[0].wda, taxSaving: schedule[0].wda * taxRate, taxRate, schedule }
  }

  const isMain = assetType === 'plant'
  const aiaPart = useAIA ? Math.min(cost, AIA_LIMIT) : 0
  const rest = cost - aiaPart
  const parts: string[] = []
  if (aiaPart > 0) parts.push('Annual Investment Allowance')
  let restRelief = 0
  let pool = 0
  let schedule: { year: number; wda: number; remaining: number }[] = []
  if (rest > 0) {
    if (isMain && isCompany) { restRelief = rest; parts.push('Full Expensing (100%)') }
    else if (isMain) { restRelief = rest * 0.40; pool = rest - restRelief; parts.push('40% first-year allowance') }
    else if (isCompany) { restRelief = rest * 0.50; pool = rest - restRelief; parts.push('50% first-year allowance') }
    else {
      schedule = wdaSchedule(rest, info.rate, 1)
      restRelief = schedule[0].wda
      parts.push(`Writing Down Allowance (${info.rate * 100}%)`)
    }
    if (pool > 0) schedule = wdaSchedule(pool, info.rate, 2)
  }
  const year1Relief = aiaPart + restRelief
  return { method: parts.join(' + '), year1Relief, taxSaving: year1Relief * taxRate, taxRate, schedule }
}

export default function CapitalAllowancesCalculator() {
  const [cost, setCost] = useState('50000')
  const [asset, setAsset] = useState<AssetType>('plant')
  const [aia, setAia] = useState(true)
  const [company, setCompany] = useState(true)

  const c = parseFloat(cost.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(c, asset, aia, company), [c, asset, aia, company])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Asset Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Asset Cost" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Asset Type</label><select value={asset} onChange={(e) => setAsset(e.target.value as AssetType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Asset Type">{Object.entries(ASSET_INFO).map(([k,v]) => <option key={k} value={k}>{v.name}</option>)}</select></div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={aia} onChange={(e) => setAia(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Claim AIA (up to £1M)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={company} onChange={(e) => setCompany(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Limited company (eligible for Full Expensing)</span></label>
      </div>

      {c > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">{result.method}</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.year1Relief)}</p>
            <p className="text-sm text-muted-foreground mt-1">Year 1 tax relief &middot; Tax saving: {formatCurrency(result.taxSaving)} (at {result.taxRate * 100}% {company ? 'Corporation Tax' : 'income tax'})</p>
          </div>
          {result.schedule.length > 0 && (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Year</th><th className="text-right py-2 font-medium text-muted-foreground">WDA</th><th className="text-right py-2 font-medium text-muted-foreground">Remaining</th></tr></thead>
              <tbody>{result.schedule.map(r => (
                <tr key={r.year} className="border-b border-border/50"><td className="py-1.5">{r.year}</td><td className="text-right tabular-nums text-green-600">{formatCurrency(r.wda)}</td><td className="text-right tabular-nums">{formatCurrency(r.remaining)}</td></tr>
              ))}</tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
