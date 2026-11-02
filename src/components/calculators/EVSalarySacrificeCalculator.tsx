import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Company car appropriate percentages for 2026/27 to 2030/31 (Budget 2026 Annex A). Only bands at
// 50 g/km or less are offered. Above 75 g/km the salary sacrifice rules differ, see the note on the page.
const BIK_BANDS = [
  { label: 'Pure electric (0 g/km): 4%', rates: [4, 5, 7, 9, 10] },
  { label: 'Plug-in hybrid, over 130 miles electric range: 4%', rates: [4, 5, 18, 19, 20] },
  { label: 'Plug-in hybrid, 70 to 129 miles: 7%', rates: [7, 8, 18, 19, 20] },
  { label: 'Plug-in hybrid, 40 to 69 miles: 10%', rates: [10, 11, 18, 19, 20] },
  { label: 'Plug-in hybrid, 30 to 39 miles: 14%', rates: [14, 15, 18, 19, 20] },
  { label: 'Plug-in hybrid, under 30 miles: 16%', rates: [16, 17, 18, 19, 20] },
]

// Effective cost assumes the first payment falls in December 2026, leaving 4 monthly payments in 2026/27
const PAYMENTS_LEFT_IN_FIRST_TAX_YEAR = 4
const NATIONAL_LIVING_WAGE = 12.71

// Scottish income tax 2026/27: band widths on TAXABLE income, so the total-income thresholds move
// down when the Personal Allowance tapers. Same values as ScottishIncomeTaxCalculator.tsx.
const SCOTTISH_BANDS = [
  { rate: 0.19, width: 3_967 },
  { rate: 0.20, width: 12_989 },
  { rate: 0.21, width: 14_136 },
  { rate: 0.42, width: 31_338 },
  { rate: 0.45, width: 62_710 },
  { rate: 0.48, width: Infinity },
]

function calculate(salary: number, carListPrice: number, bikRates: number[], leaseTerm: number, monthlyLease: number, scottish: boolean, hoursPerWeek: number) {
  const newGross = salary - monthlyLease * 12
  const taxBefore = calcTax(salary, scottish)
  const niBefore = calcNI(salary)
  const taxAfter = calcTax(newGross, scottish)
  const niAfter = calcNI(newGross)
  const taxSaving = taxBefore - taxAfter
  const niSaving = niBefore - niAfter
  const totalSaving = taxSaving + niSaving

  // BiK tax: the car benefit is added to taxable pay after the sacrifice, so charge the exact extra
  // income tax it causes (covers the band edges, the £100k taper and 45%). No employee NI on a car
  // benefit; the employer pays Class 1A.
  const annualBikTax = (rate: number) => calcTax(newGross + carListPrice * (rate / 100), scottish) - calcTax(newGross, scottish)
  const bikTax = annualBikTax(bikRates[0])
  const monthlyBikTax = bikTax / 12

  const netMonthlyCost = monthlyLease - (totalSaving / 12) + monthlyBikTax

  // Effective cost walks the lease month by month through the published rate for each tax year
  let termBikTax = 0
  for (let month = 0; month < leaseTerm; month++) {
    const yearIndex = month < PAYMENTS_LEFT_IN_FIRST_TAX_YEAR ? 0 : 1 + Math.floor((month - PAYMENTS_LEFT_IN_FIRST_TAX_YEAR) / 12)
    termBikTax += annualBikTax(bikRates[Math.min(yearIndex, bikRates.length - 1)]) / 12
  }
  const equivalentPurchaseCost = (monthlyLease - totalSaving / 12) * leaseTerm + termBikTax

  // NMW check on cash pay after the sacrifice
  const nmwFloor = NATIONAL_LIVING_WAGE * hoursPerWeek * 52
  const hourlyAfterSacrifice = hoursPerWeek > 0 ? newGross / (hoursPerWeek * 52) : 0
  const belowMinimumWage = hoursPerWeek > 0 && newGross < nmwFloor

  return { monthlyLease, newGross, taxSaving, niSaving, totalSaving, bikTax, monthlyBikTax, netMonthlyCost, equivalentPurchaseCost, hourlyAfterSacrifice, belowMinimumWage }
}

function calcTax(income: number, scottish: boolean) {
  let pa = 12_570
  if (income > 100_000) pa = Math.max(0, 12_570 - Math.floor((income - 100_000) / 2))
  let t = 0
  if (income > pa) {
    if (scottish) {
      let remaining = income - pa
      for (const band of SCOTTISH_BANDS) {
        const inBand = Math.min(remaining, band.width)
        t += inBand * band.rate
        remaining -= inBand
      }
    }
    else if (income <= 50_270) t = (income - pa) * 0.20
    else if (income <= 125_140) t = 37_700 * 0.20 + (income - pa - 37_700) * 0.40
    else t = 37_700 * 0.20 + (125_140 - 37_700) * 0.40 + (income - 125_140) * 0.45
  }
  return t
}

function calcNI(income: number) {
  if (income <= 12_570) return 0
  if (income <= 50_270) return (income - 12_570) * 0.08
  return (50_270 - 12_570) * 0.08 + (income - 50_270) * 0.02
}

export default function EVSalarySacrificeCalculator() {
  const [salary, setSalary] = useState('45000')
  const [price, setPrice] = useState('35000')
  const [band, setBand] = useState(0)
  const [term, setTerm] = useState('36')
  const [lease, setLease] = useState('450')
  const [hours, setHours] = useState('37.5')
  const [scotland, setScotland] = useState(false)

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const p = parseFloat(price.replace(/,/g,'')) || 0
  const t = Math.min(48, Math.max(24, parseInt(term) || 36))
  const l = parseFloat(lease.replace(/,/g,'')) || 0
  const h = parseFloat(hours) || 0
  const result = useMemo(() => calculate(s, p, BIK_BANDS[band].rates, t, l, scotland, h), [s, p, band, t, l, scotland, h])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Car List Price / P11D Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Car List Price" /></div><p className="text-xs text-muted-foreground mt-1">Use the P11D value if your scheme quote gives one</p></div>
        <div><label className="block text-sm font-medium mb-2">Monthly Lease Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={lease} onChange={(e) => setLease(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Lease Cost" /></div><p className="text-xs text-muted-foreground mt-1">Gross amount sacrificed per month</p></div>
        <div><label className="block text-sm font-medium mb-2">Car Type (2026/27 BiK)</label><select value={band} onChange={(e) => setBand(Number(e.target.value))} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Car Type (2026/27 BiK)">{BIK_BANDS.map((option, index) => <option key={option.label} value={index}>{option.label}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Lease Term (months)</label><input type="number" min="24" max="48" value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Lease Term (months)" /><p className="text-xs text-muted-foreground mt-1">24 to 48 months</p></div>
        <div><label className="block text-sm font-medium mb-2">Hours per Week</label><input type="number" min="0" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours per Week" /><p className="text-xs text-muted-foreground mt-1">For the minimum wage check</p></div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={scotland} onChange={(e) => setScotland(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">I pay Scottish Income Tax (NI is the same across the UK)</span></label>

      {s > 0 && p > 0 && l > 0 && result.newGross <= 0 && (
        <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-center text-sm text-orange-800 dark:text-orange-300">The sacrifice of {formatCurrency(l * 12)} a year is more than your salary, so this lease cannot be run through salary sacrifice.</div>
      )}

      {s > 0 && p > 0 && l > 0 && result.newGross > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          {result.belowMinimumWage && <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-center text-sm text-orange-800 dark:text-orange-300">Cash pay after the sacrifice would be {formatCurrency(result.newGross)}, about {formatCurrency(result.hourlyAfterSacrifice)} an hour on {h} hours a week. That is below the £12.71 National Living Wage for age 21 and over, so your employer must cap the sacrifice. Lower rates apply under 21 and to some apprentices.</div>}
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Net Monthly Cost (after tax/NI savings)</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.netMonthlyCost)}</p>
            <p className="text-sm text-muted-foreground mt-1">vs {formatCurrency(result.monthlyLease)}/month gross sacrifice</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Tax Saved/Year</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.taxSaving)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">NI Saved/Year</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.niSaving)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">BiK Tax/Month (2026/27)</p><p className="text-lg font-bold">{formatCurrency(result.monthlyBikTax)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Effective Cost ({t}mo)</p><p className="text-lg font-bold">{formatCurrency(result.equivalentPurchaseCost)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>EV salary sacrifice: lease an electric car through your employer, saving income tax and NI. The BiK rate for a pure electric car is 4% in 2026/27. Includes insurance, servicing, breakdown cover and tyres. One of the most tax-efficient employee benefits.</p>
            <p className="mt-2">Net monthly cost uses the 2026/27 rate. Effective cost assumes the first payment is in December 2026, with salary and lease unchanged, and follows the published rates for each tax year: pure electric 4%, 5%, 7%, 9% and 10% from 2026/27 to 2030/31.</p>
            <p className="mt-2">Your employer may base pension contributions, overtime and pay rises on the lower salary, which this does not model. Check before you sign. Cars above 75 g/km are taxed on the higher of the salary given up and the BiK charge, so they are not offered here.</p>
          </div>
        </div>
      )}
    </div>
  )
}
