import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// VED rates 2026/27 — Budget Oct 2024 changes effective April 2025
// First-year rates doubled for 76g/km+ CO2; EVs now pay standard rate from year 2
const STANDARD_RATE = 195 // per year after first year (petrol/diesel/hybrid/EV)

function getFirstYearRate(co2: number, fuelType: string): number {
  if (fuelType === 'electric') return 10 // lowest band for 0g CO2
  if (co2 === 0) return 10
  if (co2 <= 50) return 10
  if (co2 <= 75) return 30
  // From April 2025: first-year rates doubled for 76g/km+ (Budget Oct 2024)
  if (co2 <= 90) return 270
  if (co2 <= 100) return 350
  if (co2 <= 110) return 390
  if (co2 <= 130) return 440
  if (co2 <= 150) return 540
  if (co2 <= 170) return 1_360
  if (co2 <= 190) return 2_190
  if (co2 <= 225) return 3_300
  if (co2 <= 255) return 4_680
  return 5_490
}

function calculate(co2: number, fuelType: string, listPrice: number) {
  const firstYear = getFirstYearRate(co2, fuelType)
  const standard = STANDARD_RATE // all vehicles pay standard rate from year 2 (inc. EVs from April 2025)
  const expensiveSupplement = listPrice > 40_000 ? 425 : 0 // £425/yr for 5 years if over £40k
  const annualAfterFirst = standard + expensiveSupplement

  return { firstYear, standard, expensiveSupplement, annualAfterFirst, monthlyAfterFirst: annualAfterFirst / 12 }
}

export default function CarTaxCalculator() {
  const [co2, setCo2] = useState('120')
  const [fuelType, setFuelType] = useState('petrol')
  const [listPrice, setListPrice] = useState('25000')

  const c = parseInt(co2) || 0
  const lp = parseFloat(listPrice.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(c, fuelType, lp), [c, fuelType, lp])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">CO2 Emissions (g/km)</label>
          <input type="number" min="0" max="300" value={co2} onChange={(e) => setCo2(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="CO2 Emissions (g/km)" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Fuel Type</label>
          <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Fuel Type">
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="hybrid">Hybrid</option>
            <option value="electric">Electric</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">List Price (new)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={listPrice} onChange={(e) => setListPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="List Price (new)" /></div>
        </div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-primary/10 p-4 text-center">
            <p className="text-xs text-muted-foreground">First Year Rate</p>
            <p className="text-xl font-bold text-primary">{formatCurrency(result.firstYear)}</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <p className="text-xs text-muted-foreground">Standard Rate (year 2+)</p>
            <p className="text-xl font-bold">{formatCurrency(result.annualAfterFirst)}</p>
          </div>
        </div>

        {result.expensiveSupplement > 0 && (
          <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-sm">
            <p className="font-medium text-orange-800 dark:text-orange-300">Expensive car supplement applies</p>
            <p className="text-orange-700 dark:text-orange-400 mt-1">Cars with list price over £40,000 pay an extra £{result.expensiveSupplement}/year for years 2-6.</p>
          </div>
        )}

        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
          <p>Standard rate (year 2+): <span className="font-medium text-foreground">£{STANDARD_RATE}</span> (all vehicles incl. EVs from April 2025)</p>
          <p>First year rate for EVs (0g CO2): <span className="font-medium text-foreground">£10</span></p>
          <p>Cars over £40,000: <span className="font-medium text-foreground">+£425/year</span> supplement for 5 years</p>
          <p className="text-xs">First year rates for 76g+ CO2 cars doubled from April 2025 (Budget Oct 2024)</p>
        </div>
      </div>
    </div>
  )
}
