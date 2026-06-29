import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Average Band D council tax 2026/27 by region (approximate)
const REGIONS: Record<string, number> = {
  'England Average': 2_392,
  'London': 1_902,
  'South East': 2_151,
  'South West': 2_239,
  'East of England': 2_188,
  'East Midlands': 2_214,
  'West Midlands': 2_115,
  'North West': 2_127,
  'North East': 2_190,
  'Yorkshire & Humber': 2_155,
}

const BAND_RATIOS: Record<string, number> = {
  A: 6 / 9, B: 7 / 9, C: 8 / 9, D: 1, E: 11 / 9, F: 13 / 9, G: 15 / 9, H: 18 / 9,
}

const BAND_VALUES: Record<string, string> = {
  A: 'Up to £40,000', B: '£40,001 – £52,000', C: '£52,001 – £68,000', D: '£68,001 – £88,000',
  E: '£88,001 – £120,000', F: '£120,001 – £160,000', G: '£160,001 – £320,000', H: 'Over £320,000',
}

function calculate(region: string, band: string, singlePerson: boolean) {
  const bandD = REGIONS[region] || 2_392
  const ratio = BAND_RATIOS[band] || 1
  const annual = bandD * ratio
  const discount = singlePerson ? annual * 0.25 : 0
  const finalBill = annual - discount

  return { bandD, annual, discount, finalBill, monthly: finalBill / 12, weekly: finalBill / 52 }
}

export default function CouncilTaxCalculator() {
  const [region, setRegion] = useState('England Average')
  const [band, setBand] = useState('D')
  const [single, setSingle] = useState(false)

  const result = useMemo(() => calculate(region, band, single), [region, band, single])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Region</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Region">
            {Object.keys(REGIONS).map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Council Tax Band</label>
          <select value={band} onChange={(e) => setBand(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Council Tax Band">
            {Object.entries(BAND_VALUES).map(([b, v]) => <option key={b} value={b}>Band {b} — {v}</option>)}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={single} onChange={(e) => setSingle(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">Single person discount (25% off)</span>
      </label>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Annual Council Tax</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.finalBill)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthly)}/month &middot; {formatCurrency(result.weekly)}/week</p>
        </div>

        {single && result.discount > 0 && (
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center">
            <p className="text-xs text-muted-foreground">Single Person Discount</p>
            <p className="text-lg font-bold text-green-700 dark:text-green-400">-{formatCurrency(result.discount)}</p>
          </div>
        )}

        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
          <p>Band D rate for {region}: <span className="font-medium text-foreground">{formatCurrency(result.bandD)}</span></p>
          <p>Band {band} ratio: <span className="font-medium text-foreground">{(BAND_RATIOS[band] * 100).toFixed(0)}%</span> of Band D</p>
          <p>Property value (1991): <span className="font-medium text-foreground">{BAND_VALUES[band]}</span></p>
        </div>
      </div>
    </div>
  )
}
