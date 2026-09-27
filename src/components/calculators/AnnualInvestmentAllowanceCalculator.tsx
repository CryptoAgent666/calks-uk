import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const AIA_LIMIT = 1_000_000
const WDA_MAIN = 0.14 // main pool from April 2026
const WDA_SPECIAL = 0.06

type BusinessType = 'company' | 'unincorporated'
type AssetType = 'main' | 'special'

const TAX_RATES: Record<BusinessType, { value: string; label: string }[]> = {
  company: [
    { value: '19', label: '19% (small profits, up to £50k)' },
    { value: '26.5', label: '26.5% (marginal relief, £50k-£250k)' },
    { value: '25', label: '25% (main rate, over £250k)' },
  ],
  unincorporated: [
    { value: '20', label: '20% (basic rate)' },
    { value: '40', label: '40% (higher rate)' },
    { value: '45', label: '45% (additional rate)' },
  ],
}

/**
 * Year-one relief on plant and machinery (2026/27).
 * The first £1M gets the AIA at 100%. Spend above that gets, if new and unused:
 * companies, full expensing (100%) on main-rate assets or the 50% FYA on
 * special-rate assets; sole traders and partnerships, the 40% FYA on main-rate
 * assets (from 1 January 2026). Where an FYA is claimed the balance goes into
 * the pool and earns writing down allowances from the next period. Anything
 * else goes straight into the pool at 14% (main) or 6% (special).
 */
function calculate(spending: number, taxRate: number, businessType: BusinessType = 'company', assetType: AssetType = 'main', isNew = true) {
  const aiaClaimable = Math.min(spending, AIA_LIMIT)
  const remainder = Math.max(0, spending - AIA_LIMIT)

  let remainderRate = assetType === 'main' ? WDA_MAIN : WDA_SPECIAL
  let remainderLabel = assetType === 'main' ? 'Writing down allowance (14%)' : 'Writing down allowance (6%)'
  if (isNew && businessType === 'company' && assetType === 'main') {
    remainderRate = 1
    remainderLabel = 'Full expensing (100%)'
  } else if (isNew && businessType === 'company' && assetType === 'special') {
    remainderRate = 0.5
    remainderLabel = 'First-year allowance (50%)'
  } else if (isNew && businessType === 'unincorporated' && assetType === 'main') {
    remainderRate = 0.4
    remainderLabel = 'First-year allowance (40%)'
  }

  const reliefOnRemainder = remainder * remainderRate
  const totalRelief = aiaClaimable + reliefOnRemainder
  const leftInPool = spending - totalRelief
  const taxSaving = totalRelief * (taxRate / 100)
  const effectiveDiscount = spending > 0 ? (taxSaving / spending) * 100 : 0

  return { aiaClaimable, remainder, remainderLabel, reliefOnRemainder, totalRelief, leftInPool, taxSaving, effectiveDiscount }
}

export default function AnnualInvestmentAllowanceCalculator() {
  const [spending, setSpending] = useState('50000')
  const [businessType, setBusinessType] = useState<BusinessType>('company')
  const [assetType, setAssetType] = useState<AssetType>('main')
  const [isNew, setIsNew] = useState(true)
  const [taxRate, setTaxRate] = useState('19')

  const changeBusinessType = (type: BusinessType) => {
    setBusinessType(type)
    setTaxRate(TAX_RATES[type][0].value)
  }

  const s = parseFloat(spending.replace(/,/g,'')) || 0
  const t = parseFloat(taxRate) || 0
  const result = useMemo(() => calculate(s, t, businessType, assetType, isNew), [s, t, businessType, assetType, isNew])
  const selectClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Capital Spending (plant & machinery)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={spending} onChange={(e) => setSpending(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Capital Spending (plant & machinery)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Business Type</label><select value={businessType} onChange={(e) => changeBusinessType(e.target.value as BusinessType)} className={selectClass} aria-label="Business Type"><option value="company">Limited company</option><option value="unincorporated">Sole trader or partnership</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Asset Type</label><select value={assetType} onChange={(e) => setAssetType(e.target.value as AssetType)} className={selectClass} aria-label="Asset Type"><option value="main">Main rate (most machinery, vans, computers)</option><option value="special">Special rate (integral features, long-life assets)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">{businessType === 'company' ? 'Corporation Tax Rate' : 'Income Tax Rate'}</label><select value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className={selectClass} aria-label={businessType === 'company' ? 'Corporation Tax Rate' : 'Income Tax Rate'}>{TAX_RATES[businessType].map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Assets are new and unused (needed for full expensing and first-year allowances, not for the AIA)</span></label>

      {s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Tax Saving (year 1)</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.taxSaving)}</p>
            <p className="text-sm text-muted-foreground mt-1">Effective discount: {result.effectiveDiscount.toFixed(0)}% off purchase price</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">AIA Claimed (100%)</p><p className="text-lg font-bold">{formatCurrency(result.aiaClaimable)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Above £1M: {result.remainderLabel}</p><p className="text-lg font-bold">{formatCurrency(result.reliefOnRemainder)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Total Relief (year 1)</p><p className="text-lg font-bold">{formatCurrency(result.totalRelief)}</p></div>
          </div>
          {result.leftInPool > 0 && <p className="text-sm text-muted-foreground">{formatCurrency(result.leftInPool)} goes into the {assetType === 'main' ? 'main pool (14%' : 'special rate pool (6%'} a year on the reducing balance) for later years.</p>}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>AIA gives 100% relief on the first £{AIA_LIMIT.toLocaleString()} of qualifying plant and machinery each year, for companies, sole traders and partnerships. Above that, new main-rate assets get full expensing (companies) or a 40% first-year allowance (sole traders and partnerships, from 1 January 2026), and new special-rate assets bought by a company get 50%. Cars are excluded. The saving assumes your profit is at least as large as the allowances. If it is not, the excess becomes a loss to carry forward or back.</p>
          </div>
        </div>
      )}
    </div>
  )
}
