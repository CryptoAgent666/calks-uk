import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Appropriate percentages for 2026/27, from HMRC 480 Appendix 2. Pure EVs are 4%
// (3% in 2025/26, 5% in 2027/28). Cars at 1-50 g/km are banded by ZERO-EMISSION
// MILEAGE, not by CO2. Above 54 g/km the table rises 1pp per 5 g/km but pauses at
// 21% across 70-79 g/km, then resumes from 22% at 80 g/km and caps at 37%.
const EV_RANGE_BANDS = [
  { key: '130+', label: '130 miles or more', rate: 4 },
  { key: '70-129', label: '70 to 129 miles', rate: 7 },
  { key: '40-69', label: '40 to 69 miles', rate: 10 },
  { key: '30-39', label: '30 to 39 miles', rate: 14 },
  { key: 'under30', label: 'Under 30 miles', rate: 16 },
]

function getBikRate(co2: number, fuelType: string, evRange: string): number {
  if (fuelType === 'electric' || co2 === 0) return 4
  // 4% diesel supplement, non-RDE2 diesel only; the 37% ceiling still applies.
  const base = fuelType === 'diesel-nonrde2' ? 4 : 0
  if (co2 <= 50) {
    const band = EV_RANGE_BANDS.find(b => b.key === evRange) ?? EV_RANGE_BANDS[EV_RANGE_BANDS.length - 1]
    return Math.min(37, band.rate + base)
  }
  if (co2 <= 54) return Math.min(37, 17 + base)
  if (co2 <= 59) return Math.min(37, 18 + base)
  if (co2 <= 64) return Math.min(37, 19 + base)
  if (co2 <= 69) return Math.min(37, 20 + base)
  if (co2 <= 79) return Math.min(37, 21 + base)
  return Math.min(37, 22 + Math.floor((co2 - 80) / 5) + base)
}

function calculate(listPrice: number, co2: number, fuelType: string, taxBand: string, evRange: string) {
  const bikRate = getBikRate(co2, fuelType, evRange)
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
  const [evRange, setEvRange] = useState('40-69')

  const lp = parseFloat(listPrice.replace(/,/g, '')) || 0
  const c = parseInt(co2) || 0
  const result = useMemo(() => calculate(lp, c, fuelType, taxBand, evRange), [lp, c, fuelType, taxBand, evRange])
  // 1-50 g/km cars are banded by electric range, so ask for it only when it matters.
  const needsRange = fuelType !== 'electric' && c > 0 && c <= 50

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Car List Price (P11D value)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={listPrice} onChange={(e) => setListPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Car List Price (P11D value)" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">CO2 Emissions (g/km)</label>
          <input type="number" min="0" max="300" value={co2} onChange={(e) => setCo2(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="CO2 Emissions (g/km)" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Fuel Type</label>
          <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Fuel Type">
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel (RDE2 compliant)</option>
            <option value="diesel-nonrde2">Diesel (non-RDE2, +4% surcharge)</option>
            <option value="hybrid">Plug-in Hybrid</option>
            <option value="electric">Electric (0g CO2)</option>
          </select>
        </div>
        {needsRange && (
          <div>
            <label className="block text-sm font-medium mb-2">Electric-only Range</label>
            <select value={evRange} onChange={(e) => setEvRange(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Electric-only Range">
              {EV_RANGE_BANDS.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2">Your Tax Band</label>
          <select value={taxBand} onChange={(e) => setTaxBand(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Your Tax Band">
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
