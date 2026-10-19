import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Benchmarks: Defra, Farm rents in England 2024/25 statistics notice (updated 12 March 2026),
// average rent per hectare, current prices. FAT = agreement made before 1 September 1995
// (mostly Agricultural Holdings Act 1986 tenancies). England only.
const BENCHMARKS: { id: string; group: string; label: string; perHa: number }[] = [
  { id: 'fbt', group: 'By agreement type', label: 'FBT average, England', perHa: 230 },
  { id: 'fat', group: 'By agreement type', label: '1986 Act / FAT average, England', perHa: 174 },
  { id: 'seasonal', group: 'By agreement type', label: 'Seasonal let average, England', perHa: 166 },
  { id: 'cropping-fbt', group: 'By farm type', label: 'General cropping farms, FBT', perHa: 205 },
  { id: 'dairy-fbt', group: 'By farm type', label: 'Dairy farms, FBT', perHa: 296 },
  { id: 'dairy-all', group: 'By farm type', label: 'Dairy farms, all agreements', perHa: 285 },
  { id: 'lfa-all', group: 'By farm type', label: 'LFA grazing livestock farms, all agreements', perHa: 93 },
  { id: 'em-fbt', group: 'FBT by region', label: 'East Midlands, FBT', perHa: 301 },
  { id: 'lse-fbt', group: 'FBT by region', label: 'London & South East, FBT', perHa: 293 },
]

type LandType = 'arable' | 'mixed' | 'grassland' | 'upland'

const LAND_TYPES: Record<LandType, { label: string; cropRevenue: boolean; defaultBenchmark: string }> = {
  arable: { label: 'Arable', cropRevenue: true, defaultBenchmark: 'cropping-fbt' },
  mixed: { label: 'Mixed', cropRevenue: true, defaultBenchmark: 'fbt' },
  grassland: { label: 'Lowland grassland', cropRevenue: false, defaultBenchmark: 'fbt' },
  upland: { label: 'Upland / LFA grazing', cropRevenue: false, defaultBenchmark: 'lfa-all' },
}

const GROUPS = Array.from(new Set(BENCHMARKS.map((b) => b.group)))

function calculate(hectares: number, benchmarkPerHa: number, currentRent: number, yieldPerHa: number, pricePerTonne: number) {
  const marketRent = hectares * benchmarkPerHa
  const difference = currentRent - marketRent
  const revenue = hectares * yieldPerHa * pricePerTonne
  const rentAsPctRevenue = revenue > 0 ? (currentRent / revenue) * 100 : 0

  return { marketRent, difference, revenue, rentAsPctRevenue, perHa: hectares > 0 ? currentRent / hectares : 0 }
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function FarmTenancyCalculator() {
  const [ha, setHa] = useState('100')
  const [type, setType] = useState<LandType>('arable')
  const [benchmarkId, setBenchmarkId] = useState(LAND_TYPES.arable.defaultBenchmark)
  const [rent, setRent] = useState('22000')
  // Defaults: 8 t/ha winter wheat; £210/t is close to AHDB UK feed wheat futures for
  // November 2026 (about £209.75/t on 14 September 2026).
  const [yld, setYld] = useState('8')
  const [price, setPrice] = useState('210')

  const h = Math.max(0, parseFloat(ha) || 0)
  const r = Math.max(0, parseFloat(rent.replace(/,/g, '')) || 0)
  const y = Math.max(0, parseFloat(yld) || 0)
  const p = Math.max(0, parseFloat(price.replace(/,/g, '')) || 0)
  const benchmark = BENCHMARKS.find((b) => b.id === benchmarkId) ?? BENCHMARKS[0]
  const showRevenue = LAND_TYPES[type].cropRevenue
  const result = useMemo(() => calculate(h, benchmark.perHa, r, y, p), [h, benchmark.perHa, r, y, p])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Hectares</label><input type="number" min="1" max="5000" value={ha} onChange={(e) => setHa(e.target.value)} className={inputClass} aria-label="Hectares" /></div>
        <div><label className="block text-sm font-medium mb-2">Current Annual Rent</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Current Annual Rent" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Land Use</label><select value={type} onChange={(e) => { const t = e.target.value as LandType; setType(t); setBenchmarkId(LAND_TYPES[t].defaultBenchmark) }} className={inputClass} aria-label="Land Use">{(Object.entries(LAND_TYPES) as [LandType, typeof LAND_TYPES[LandType]][]).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Compare With (Defra 2024/25)</label><select value={benchmark.id} onChange={(e) => setBenchmarkId(e.target.value)} className={inputClass} aria-label="Compare with Defra 2024/25 average rent">
          {GROUPS.map((g) => (
            <optgroup key={g} label={g}>
              {BENCHMARKS.filter((b) => b.group === g).map((b) => <option key={b.id} value={b.id}>{b.label} (£{b.perHa}/ha)</option>)}
            </optgroup>
          ))}
        </select></div>
        {showRevenue && (
          <>
            <div><label className="block text-sm font-medium mb-2">Crop Yield (t/ha)</label><input type="number" min="0" step="0.1" value={yld} onChange={(e) => setYld(e.target.value)} className={inputClass} aria-label="Crop Yield (t/ha)" /></div>
            <div><label className="block text-sm font-medium mb-2">Crop Price (£/t)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Crop Price (£ per tonne)" /></div></div>
          </>
        )}
      </div>

      {h > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Your Rent/ha</p><p className="text-lg font-bold">{formatCurrency(result.perHa)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Defra Average/ha</p><p className="text-lg font-bold">{formatCurrency(benchmark.perHa)}</p></div>
            <div className={`rounded-xl p-3 text-center ${result.difference > 0 ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}><p className="text-xs text-muted-foreground">vs Average, per Year</p><p className={`text-lg font-bold ${result.difference > 0 ? 'text-destructive' : 'text-green-700 dark:text-green-400'}`}>{result.difference > 0 ? '+' : ''}{formatCurrency(result.difference)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Rent as % of Crop Revenue</p>{showRevenue ? <p className="text-lg font-bold">{result.rentAsPctRevenue.toFixed(1)}%</p> : <p className="text-sm font-medium text-muted-foreground mt-1">Not meaningful for grazing land</p>}</div>
          </div>
          {showRevenue && <p className="text-xs text-muted-foreground text-center">Crop revenue: {h} ha × {y} t/ha × {formatCurrency(p)}/t = {formatCurrency(result.revenue)}</p>}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Averages are from Defra&apos;s Farm Rents in England 2024/25 statistics (updated 12 March 2026) and cover England only; Scotland, Wales and Northern Ireland are not included. FAT means a tenancy agreed before 1 September 1995, mostly under the Agricultural Holdings Act 1986. Actual rents depend on land quality, buildings, location and the lease terms.</p>
          </div>
        </div>
      )}
    </div>
  )
}
