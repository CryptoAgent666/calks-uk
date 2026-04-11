import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const AIA_LIMIT = 1_000_000
const WRITING_DOWN_MAIN = 0.18
const WRITING_DOWN_SPECIAL = 0.06
const FULL_EXPENSING_RATE = 1.0 // 100% for qualifying plant/machinery

type AssetType = 'plant' | 'car_low' | 'car_high' | 'special' | 'integral'

const ASSET_INFO: Record<AssetType, { name: string; pool: string; rate: number }> = {
  plant: { name: 'Plant & Machinery', pool: 'Main pool or AIA/Full Expensing', rate: WRITING_DOWN_MAIN },
  car_low: { name: 'Car (CO2 ≤50g/km)', pool: 'Main pool', rate: WRITING_DOWN_MAIN },
  car_high: { name: 'Car (CO2 >50g/km)', pool: 'Special rate pool', rate: WRITING_DOWN_SPECIAL },
  special: { name: 'Special Rate (long-life)', pool: 'Special rate pool', rate: WRITING_DOWN_SPECIAL },
  integral: { name: 'Integral Features', pool: 'Special rate pool', rate: WRITING_DOWN_SPECIAL },
}

function calculate(cost: number, assetType: AssetType, useAIA: boolean, isCompany: boolean) {
  const info = ASSET_INFO[assetType]
  const corpTaxRate = 0.25

  if (useAIA && assetType === 'plant' && cost <= AIA_LIMIT) {
    const relief = cost
    const taxSaving = relief * corpTaxRate
    return { method: 'Annual Investment Allowance (100%)', year1Relief: relief, taxSaving, fullReliefYear1: true, schedule: [] }
  }

  if (isCompany && assetType === 'plant') {
    const relief = cost * FULL_EXPENSING_RATE
    return { method: 'Full Expensing (100%)', year1Relief: relief, taxSaving: relief * corpTaxRate, fullReliefYear1: true, schedule: [] }
  }

  // Writing down allowance
  const schedule: { year: number; wda: number; remaining: number }[] = []
  let remaining = cost
  for (let y = 1; y <= 10; y++) {
    const wda = remaining * info.rate
    remaining -= wda
    schedule.push({ year: y, wda, remaining })
  }

  return { method: `Writing Down Allowance (${(info.rate * 100)}%)`, year1Relief: schedule[0]?.wda || 0, taxSaving: (schedule[0]?.wda || 0) * corpTaxRate, fullReliefYear1: false, schedule }
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
        <div><label className="block text-sm font-medium mb-2">Asset Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Asset Type</label><select value={asset} onChange={(e) => setAsset(e.target.value as AssetType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring">{Object.entries(ASSET_INFO).map(([k,v]) => <option key={k} value={k}>{v.name}</option>)}</select></div>
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
            <p className="text-sm text-muted-foreground mt-1">Year 1 tax relief &middot; Tax saving: {formatCurrency(result.taxSaving)}</p>
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
