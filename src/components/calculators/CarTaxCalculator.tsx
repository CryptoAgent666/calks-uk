import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// VED rates 2025/26 first year + standard rate
const STANDARD_RATE = 190 // per year after first year (petrol/diesel)
const EV_RATE = 10 // electric vehicles from April 2025

function getFirstYearRate(co2: number, fuelType: string): number {
  if (fuelType === 'electric') return 10
  if (co2 === 0) return 10
  if (co2 <= 50) return 10
  if (co2 <= 75) return 30
  if (co2 <= 90) return 135
  if (co2 <= 100) return 175
  if (co2 <= 110) return 195
  if (co2 <= 130) return 220
  if (co2 <= 150) return 270
  if (co2 <= 170) return 680
  if (co2 <= 190) return 1_095
  if (co2 <= 225) return 1_650
  if (co2 <= 255) return 2_340
  return 2_745
}

function calculate(co2: number, fuelType: string, listPrice: number) {
  const firstYear = getFirstYearRate(co2, fuelType)
  const standard = fuelType === 'electric' ? EV_RATE : STANDARD_RATE
  const expensiveSupplement = listPrice > 40_000 ? 410 : 0 // £410/yr for 5 years if over £40k
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
          <input type="number" min="0" max="300" value={co2} onChange={(e) => setCo2(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Fuel Type</label>
          <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="hybrid">Hybrid</option>
            <option value="electric">Electric</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">List Price (new)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={listPrice} onChange={(e) => setListPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
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
          <p>Standard rate (year 2+): <span className="font-medium text-foreground">£{STANDARD_RATE}</span> (petrol/diesel/hybrid)</p>
          <p>Electric vehicles: <span className="font-medium text-foreground">£{EV_RATE}</span> from April 2025</p>
          <p>Cars over £40,000: <span className="font-medium text-foreground">+£410/year</span> supplement for 5 years</p>
        </div>
      </div>
    </div>
  )
}
