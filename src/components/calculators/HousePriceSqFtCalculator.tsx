import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const SQFT_PER_SQM = 10.7639

// Rough benchmarks: UK HPI July 2026 average prices divided by the English Housing Survey
// average home of about 96 m² (about 1,033 sq ft). Estimates, not measured £/sq ft series.
const AVG_HOME_SQFT = 96 * SQFT_PER_SQM
const UK_AVG = 265        // £273,000 / 1,033 sq ft
const LONDON_AVG = 530    // £550,037 / 1,033 sq ft, about double the UK figure
const NORTH_EAST_AVG = 160 // £166,943 / 1,033 sq ft
const NORTH_WEST_AVG = 215 // £221,445 / 1,033 sq ft

type Unit = 'sqft' | 'sqm'

function calculate(price: number, area: number, unit: Unit, localPerSqft: number) {
  if (area <= 0 || price <= 0) return null
  const sqft = unit === 'sqft' ? area : area * SQFT_PER_SQM
  const sqm = sqft / SQFT_PER_SQM
  const pricePerSqft = price / sqft
  const pricePerSqm = price / sqm

  const comparison = pricePerSqft < UK_AVG * 0.8 ? 'Below UK average'
    : pricePerSqft < UK_AVG * 1.2 ? 'Around UK average'
    : pricePerSqft < LONDON_AVG ? 'Above UK average'
    : 'London-level pricing'

  const local = localPerSqft > 0
    ? { diffPct: (pricePerSqft / localPerSqft - 1) * 100, priceAtLocal: localPerSqft * sqft }
    : null

  return { pricePerSqft, pricePerSqm, sqft, sqm, comparison, local }
}

export default function HousePriceSqFtCalculator() {
  const [price, setPrice] = useState('300000')
  const [area, setArea] = useState('1000')
  const [unit, setUnit] = useState<Unit>('sqft')
  const [local, setLocal] = useState('')

  const p = Math.max(0, parseFloat(price.replace(/,/g, '')) || 0)
  const a = Math.max(0, parseFloat(area.replace(/,/g, '')) || 0)
  const l = Math.max(0, parseFloat(local.replace(/,/g, '')) || 0)
  const result = useMemo(() => calculate(p, a, unit, l), [p, a, unit, l])

  const unitLabel = unit === 'sqft' ? 'sq ft' : 'm²'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ppsf-price" className="block text-sm font-medium mb-2">Property Price</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input id="ppsf-price" type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="300,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
        <div>
          <label htmlFor="ppsf-area" className="block text-sm font-medium mb-2">Floor Area ({unitLabel})</label>
          <div className="flex gap-2">
            <input id="ppsf-area" type="text" inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} placeholder={unit === 'sqft' ? '1,000' : '93'} className="min-w-0 flex-1 rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
            <div className="flex rounded-xl border border-input overflow-hidden" role="group" aria-label="Area unit">
              {(['sqft', 'sqm'] as Unit[]).map((u) => (
                <button key={u} type="button" onClick={() => setUnit(u)} aria-pressed={unit === u} className={`px-3 py-2 text-sm font-medium min-h-[44px] ${unit === u ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'}`}>{u === 'sqft' ? 'sq ft' : 'm²'}</button>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">The EPC gives total floor area in m²; agents&apos; floor plans often use sq ft</p>
        </div>
        <div>
          <label htmlFor="ppsf-local" className="block text-sm font-medium mb-2">Local £ per sq ft to compare (optional)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input id="ppsf-local" type="text" inputMode="decimal" value={local} onChange={(e) => setLocal(e.target.value)} placeholder="e.g. 310" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <p className="text-xs text-muted-foreground mt-1">From recent sales of similar homes nearby</p>
        </div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Price per Square Foot</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.pricePerSqft)}/sq ft</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.pricePerSqm)}/m² &middot; {result.sqft.toLocaleString('en-GB', { maximumFractionDigits: 0 })} sq ft = {result.sqm.toLocaleString('en-GB', { maximumFractionDigits: 1 })} m²</p>
          </div>
          {result.local && (
            <div className="rounded-xl bg-muted/50 p-4 text-sm text-center">
              <p className="font-medium">{Math.abs(result.local.diffPct) < 0.5 ? 'In line with' : `${Math.abs(result.local.diffPct).toFixed(0)}% ${result.local.diffPct > 0 ? 'above' : 'below'}`} the local figure of {formatCurrency(l)}/sq ft</p>
              <p className="text-muted-foreground mt-1">At {formatCurrency(l)}/sq ft this home would be {formatCurrency(Math.round(result.local.priceAtLocal))}</p>
            </div>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground text-center">
            <p className="font-medium text-foreground">{result.comparison}</p>
            <p className="mt-1">Rough guide: UK about £{UK_AVG}/sq ft, London about £{LONDON_AVG}/sq ft or more, North West about £{NORTH_WEST_AVG}, North East about £{NORTH_EAST_AVG}.</p>
            <p className="mt-1 text-xs">Estimates: UK House Price Index average prices for July 2026 divided by the English Housing Survey average home of about 96 m² ({Math.round(AVG_HOME_SQFT).toLocaleString('en-GB')} sq ft). Compare with sold prices on your street for a real benchmark.</p>
          </div>
        </div>
      )}
    </div>
  )
}
