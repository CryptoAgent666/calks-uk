import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(propertyValue: number, currentLease: number, groundRent: number) {
  // Simplified valuation (Leasehold Reform Act)
  // Marriage value only applies if <80 years remaining
  const hasMV = currentLease < 80
  const relativityPct = currentLease <= 70 ? 75 : currentLease <= 80 ? 85 : currentLease <= 90 ? 92 : 97

  const diminutionInReversion = propertyValue * (1 - relativityPct / 100) * 0.5
  const capitalGroundRent = groundRent * Math.min(currentLease, 50) * 0.7 // simplified PV

  let marriageValue = 0
  if (hasMV) {
    const currentValue = propertyValue * (relativityPct / 100)
    const extendedValue = propertyValue * 0.99 // ~99% of freehold after extension
    marriageValue = (extendedValue - currentValue) * 0.5 // landlord gets 50%
  }

  const premium = diminutionInReversion + capitalGroundRent + marriageValue
  const valuerFee = 700
  const legalFee = 1500
  const landlordCosts = 1500
  const totalCost = premium + valuerFee + legalFee + landlordCosts

  // Value uplift
  const valueAfter = propertyValue * (99 / relativityPct)
  const uplift = valueAfter - propertyValue

  return { premium, marriageValue, diminutionInReversion, capitalGroundRent, valuerFee, legalFee, landlordCosts, totalCost, relativityPct, hasMV, uplift, valueAfter }
}

export default function LeaseExtensionCalculator() {
  const [value, setValue] = useState('350000')
  const [lease, setLease] = useState('75')
  const [rent, setRent] = useState('200')

  const v = parseFloat(value.replace(/,/g,'')) || 0
  const l = parseInt(lease) || 0
  const r = parseFloat(rent) || 0
  const result = useMemo(() => calculate(v, l, r), [v, l, r])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Current Property Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current Property Value" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Remaining Lease (years)</label><input type="number" min="1" max="999" value={lease} onChange={(e) => setLease(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Remaining Lease (years)" />{l < 80 && <p className="text-xs text-orange-600 mt-1">Under 80 years — marriage value applies!</p>}</div>
        <div><label className="block text-sm font-medium mb-2">Annual Ground Rent</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={rent} onChange={(e) => setRent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Ground Rent" /></div></div>
      </div>

      {v > 0 && l > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Total Cost</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.totalCost)}</p>
            <p className="text-sm text-muted-foreground mt-1">Premium: {formatCurrency(result.premium)} + fees: {formatCurrency(result.valuerFee + result.legalFee + result.landlordCosts)}</p>
          </div>
          {result.uplift > 0 && (
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center">
              <p className="text-xs text-muted-foreground">Value Uplift After Extension</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">+{formatCurrency(result.uplift)}</p>
              <p className="text-xs text-muted-foreground">Property worth {formatCurrency(result.valueAfter)} with extended lease</p>
            </div>
          )}
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Diminution in reversion</td><td className="text-right tabular-nums">{formatCurrency(result.diminutionInReversion)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Capitalised ground rent</td><td className="text-right tabular-nums">{formatCurrency(result.capitalGroundRent)}</td></tr>
              {result.marriageValue > 0 && <tr className="border-b border-border/50"><td className="py-2 text-orange-600">Marriage value (50%)</td><td className="text-right tabular-nums text-orange-600">{formatCurrency(result.marriageValue)}</td></tr>}
              <tr className="border-b border-border/50 font-medium"><td className="py-2">Premium</td><td className="text-right tabular-nums">{formatCurrency(result.premium)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Surveyor / Valuer</td><td className="text-right tabular-nums">{formatCurrency(result.valuerFee)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Legal Fees (yours)</td><td className="text-right tabular-nums">{formatCurrency(result.legalFee)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Landlord's Costs</td><td className="text-right tabular-nums">{formatCurrency(result.landlordCosts)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Current relativity: {result.relativityPct}% of freehold value. {result.hasMV ? 'Under 80 years: marriage value applies, increasing the premium significantly. Extend before it drops below 80!' : 'Over 80 years: no marriage value — cheaper to extend.'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
