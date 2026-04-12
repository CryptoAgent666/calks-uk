import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// BiK rates 2025/26 by CO2 (simplified brackets)
function getBikRate(co2: number, fuelType: string): number {
  if (fuelType === 'electric') return 3
  if (fuelType === 'hybrid' && co2 <= 50) return 3 + Math.ceil(co2 / 5)
  // Petrol/diesel — 4% diesel supplement applies to non-RDE2 compliant diesel only
  const base = fuelType === 'diesel-nonrde2' ? 4 : 0
  if (co2 <= 50) return 2 + base
  if (co2 <= 54) return 15 + base
  // Each 5g above 55 adds 1%
  const extra = Math.floor((co2 - 55) / 5)
  return Math.min(37, 16 + extra + base)
}

function calculate(listPrice: number, co2: number, fuelType: string, taxBand: string) {
  const bikRate = getBikRate(co2, fuelType)
  const bikValue = listPrice * (bikRate / 100)
  const taxRate = taxBand === 'higher' ? 0.40 : taxBand === 'additional' ? 0.45 : 0.20
  const annualTax = bikValue * taxRate
  const monthlyTax = annualTax / 12

  return { bikRate, bikValue, annualTax, monthlyTax, taxRate: taxRate * 100 }
}

export default function CompanyCarTaxCalculator() {
  const [listPrice, setListPrice] = useState('30000')
  const [co2, setCo2] = useState('120')
  const [fuelType, setFuelType] = useState('petrol')
  const [taxBand, setTaxBand] = useState('basic')

  const lp = parseFloat(listPrice.replace(/,/g, '')) || 0
  const c = parseInt(co2) || 0
  const result = useMemo(() => calculate(lp, c, fuelType, taxBand), [lp, c, fuelType, taxBand])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Car List Price (P11D value)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={listPrice} onChange={(e) => setListPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">CO2 Emissions (g/km)</label>
          <input type="number" min="0" max="300" value={co2} onChange={(e) => setCo2(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Fuel Type</label>
          <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel (RDE2 compliant)</option>
            <option value="diesel-nonrde2">Diesel (non-RDE2, +4% surcharge)</option>
            <option value="hybrid">Plug-in Hybrid</option>
            <option value="electric">Electric (0g CO2)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Your Tax Band</label>
          <select value={taxBand} onChange={(e) => setTaxBand(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="basic">Basic Rate (20%)</option>
            <option value="higher">Higher Rate (40%)</option>
            <option value="additional">Additional Rate (45%)</option>
          </select>
        </div>
      </div>

      {lp > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Annual Company Car Tax</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.annualTax)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyTax)}/month</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">BiK Rate</p><p className="text-lg font-bold">{result.bikRate}%</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">BiK Value</p><p className="text-lg font-bold">{formatCurrency(result.bikValue)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Your Tax Rate</p><p className="text-lg font-bold">{result.taxRate}%</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
