import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// CGT 2025/26 — rates increased from 30 October 2024 Budget
const ANNUAL_EXEMPT = 3_000
const BASIC_RATE_LIMIT = 50_270
const CGT_BASIC = 0.18      // 18% from Oct 2024 (was 10%)
const CGT_HIGHER = 0.24     // 24% from Oct 2024 (was 20%)
const CGT_PROPERTY_BASIC = 0.18
const CGT_PROPERTY_HIGHER = 0.24

type AssetType = 'shares' | 'property'

function calculate(gain: number, income: number, assetType: AssetType) {
  const taxableGain = Math.max(0, gain - ANNUAL_EXEMPT)
  if (taxableGain <= 0) return { gain, taxableGain: 0, cgt: 0, effectiveRate: 0, basicRateTax: 0, higherRateTax: 0 }

  const basicRate = assetType === 'property' ? CGT_PROPERTY_BASIC : CGT_BASIC
  const higherRate = assetType === 'property' ? CGT_PROPERTY_HIGHER : CGT_HIGHER

  // Remaining basic rate band
  const remainingBasic = Math.max(0, BASIC_RATE_LIMIT - income)
  const gainAtBasic = Math.min(taxableGain, remainingBasic)
  const gainAtHigher = taxableGain - gainAtBasic

  const basicRateTax = gainAtBasic * basicRate
  const higherRateTax = gainAtHigher * higherRate
  const cgt = basicRateTax + higherRateTax

  return { gain, taxableGain, cgt, effectiveRate: gain > 0 ? (cgt / gain) * 100 : 0, basicRateTax, higherRateTax }
}

export default function CapitalGainsTaxCalculator() {
  const [gain, setGain] = useState('')
  const [income, setIncome] = useState('35000')
  const [assetType, setAssetType] = useState<AssetType>('shares')

  const g = parseFloat(gain.replace(/,/g, '')) || 0
  const inc = parseFloat(income.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(g, inc, assetType), [g, inc, assetType])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Asset Type</label>
        <div className="grid grid-cols-2 gap-2">
          {([{ v: 'shares' as AssetType, l: 'Shares & Investments', d: '18% / 24%' }, { v: 'property' as AssetType, l: 'Residential Property', d: '18% / 24%' }]).map((o) => (
            <button key={o.v} onClick={() => setAssetType(o.v)} className={`px-4 py-3 rounded-xl text-sm text-left transition-colors border ${assetType === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
              <div className="font-medium">{o.l}</div>
              <div className={`text-xs ${assetType === o.v ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{o.d}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cgt-gain" className="block text-sm font-medium mb-2">Capital Gain</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input id="cgt-gain" type="text" inputMode="numeric" value={gain} onChange={(e) => setGain(e.target.value)} placeholder="20,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
        <div>
          <label htmlFor="cgt-income" className="block text-sm font-medium mb-2">Annual Income (for rate band)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input id="cgt-income" type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="35,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
      </div>

      {g > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Total Gain</p><p className="text-lg font-bold">{formatCurrency(result.gain)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Annual Exempt (£{ANNUAL_EXEMPT.toLocaleString()})</p><p className="text-lg font-bold text-green-600">-{formatCurrency(Math.min(g, ANNUAL_EXEMPT))}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4"><p className="text-xs text-muted-foreground">CGT to Pay</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.cgt)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Effective Rate</p><p className="text-lg font-bold">{formatPercent(result.effectiveRate)}</p></div>
          </div>

          {result.taxableGain > 0 && (
            <div className="rounded-xl border border-border p-4 text-sm space-y-1">
              <p><span className="font-medium">Taxable gain:</span> {formatCurrency(result.taxableGain)}</p>
              {result.basicRateTax > 0 && <p><span className="font-medium">At 18% (basic rate):</span> {formatCurrency(result.basicRateTax)}</p>}
              {result.higherRateTax > 0 && <p><span className="font-medium">At 24% (higher rate):</span> {formatCurrency(result.higherRateTax)}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
