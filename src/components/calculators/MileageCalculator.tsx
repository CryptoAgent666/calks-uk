import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// HMRC's approved amount is a tax-free ceiling on what an employer can pay, not money anyone is owed.
// Paid less: tax relief on the gap. Paid more: the excess is taxable, and Class 1 NI starts only above
// the NI rate, which is 55p on every business mile in 2026/27, not 55p then 25p.
const NI_RATE_PER_MILE = 0.55

function calculate(annualMiles: number, fuelPriceP: number, mpg: number, employerP: number, otherCostP: number, taxRate: number) {
  // HMRC approved amount
  const hmrcFirst10k = Math.min(annualMiles, 10_000) * 0.55 // 55p from 6 Apr 2026 (was 45p)
  const hmrcOver10k = Math.max(0, annualMiles - 10_000) * 0.25 // 25p for all of 2026/27; 35p from 6 Apr 2027 (Budget 2026)
  const hmrcTotal = hmrcFirst10k + hmrcOver10k

  // What the employer pays, and the tax effect of any gap or excess
  const employerPaid = annualMiles * employerP / 100
  const gap = Math.max(0, hmrcTotal - employerPaid)
  const relief = gap * taxRate / 100
  const excess = Math.max(0, employerPaid - hmrcTotal)
  const taxOnExcess = excess * taxRate / 100
  const niExcess = Math.max(0, employerPaid - annualMiles * NI_RATE_PER_MILE)
  const received = employerPaid + relief - taxOnExcess

  // Actual fuel cost
  const gallons = annualMiles / mpg
  const litres = gallons * 4.54609
  const fuelCost = litres * (fuelPriceP / 100)

  // Other running costs (insurance, maintenance, depreciation), from the reader's own estimate
  const otherCosts = annualMiles * otherCostP / 100
  const totalActual = fuelCost + otherCosts

  return { hmrcTotal, employerPaid, gap, relief, excess, taxOnExcess, niExcess, received, fuelCost, otherCosts, totalActual, netVsFuel: received - fuelCost, netVsTotal: received - totalActual, costPerMile: totalActual / annualMiles, hmrcPerMile: hmrcTotal / annualMiles }
}

export default function MileageCalculator() {
  const [miles, setMiles] = useState('8000')
  const [fuel, setFuel] = useState('175') // UK average petrol, DESNZ w/c 12 Oct 2026 (175.28p)
  const [mpg, setMpg] = useState('40')
  const [employer, setEmployer] = useState('0')
  const [other, setOther] = useState('10')
  const [taxRate, setTaxRate] = useState('20')

  const m = parseFloat(miles.replace(/,/g,'')) || 0
  const f = parseFloat(fuel) || 0
  const g = parseFloat(mpg) || 0
  const e = Math.max(0, parseFloat(employer) || 0)
  const o = Math.max(0, parseFloat(other) || 0)
  const t = parseFloat(taxRate)
  const result = useMemo(() => calculate(m, f, g, e, o, t), [m, f, g, e, o, t])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Business Miles</label><input type="text" inputMode="numeric" value={miles} onChange={(ev) => setMiles(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Business Miles" /></div>
        <div><label className="block text-sm font-medium mb-2">Fuel Price (p/litre)</label><input type="number" min="100" max="300" value={fuel} onChange={(ev) => setFuel(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Fuel Price (p/litre)" /></div>
        <div><label className="block text-sm font-medium mb-2">Your MPG</label><input type="number" min="15" max="70" value={mpg} onChange={(ev) => setMpg(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your MPG" /></div>
        <div><label className="block text-sm font-medium mb-2">Your employer pays (p/mile; 0 if nothing or self-employed)</label><input type="number" min="0" value={employer} onChange={(ev) => setEmployer(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Employer mileage rate in pence per mile" /></div>
        <div><label className="block text-sm font-medium mb-2">Other running costs (p/mile, your own estimate)</label><input type="number" min="0" value={other} onChange={(ev) => setOther(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Other running costs in pence per mile" /></div>
        <div><label className="block text-sm font-medium mb-2">Your income tax rate</label><select value={taxRate} onChange={(ev) => setTaxRate(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Your income tax rate"><option value="20">20% basic rate</option><option value="40">40% higher rate</option><option value="45">45% additional rate</option></select></div>
      </div>

      {m > 0 && g <= 0 && <p className="text-sm text-muted-foreground">Enter your MPG to see the fuel cost.</p>}
      {m > 0 && g > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">HMRC Tax-Free Ceiling</p><p className="text-xl font-bold">{formatCurrency(result.hmrcTotal)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Your Employer Pays</p><p className="text-xl font-bold">{formatCurrency(result.employerPaid)}</p></div>
            {result.excess > 0
              ? <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Tax on {formatCurrency(result.excess)} Above the Ceiling</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.taxOnExcess)}</p></div>
              : <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Tax Relief on the {formatCurrency(result.gap)} Gap</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.relief)}</p></div>}
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Actual Fuel Cost</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.fuelCost)}</p></div>
          </div>
          <div className={`rounded-2xl p-6 text-center ${result.netVsFuel > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
            <p className="text-sm text-muted-foreground">{result.netVsFuel > 0 ? 'Employer pay and tax relief cover your fuel' : 'Employer pay and tax relief don\'t cover your fuel'}</p>
            <p className={`text-2xl font-bold mt-1 ${result.netVsFuel > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{result.netVsFuel > 0 ? '+' : ''}{formatCurrency(result.netVsFuel)}/year vs fuel only</p>
            <p className="text-sm text-muted-foreground mt-1">{result.netVsTotal > 0 ? '+' : ''}{formatCurrency(result.netVsTotal)} vs fuel plus {o}p a mile of other costs</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">HMRC Ceiling per Mile</p><p className="text-lg font-bold">{(result.hmrcPerMile * 100).toFixed(1)}p</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Your Cost per Mile</p><p className="text-lg font-bold">{(result.costPerMile * 100).toFixed(1)}p</p></div>
          </div>
          {result.excess > 0 && <p className="text-sm text-muted-foreground">Your employer pays above the tax-free ceiling, so the excess is taxable. {result.niExcess > 0 ? `Class 1 National Insurance is also due on about ${formatCurrency(result.niExcess)}, the part above 55p a mile.` : 'No Class 1 National Insurance is due on it, because the National Insurance rate is 55p on every business mile.'} National Insurance is tested each pay period, so the yearly figure is a guide.</p>}
          <p className="text-xs text-muted-foreground">Uses the 2026/27 HMRC car and van rates: 55p a mile for the first 10,000 business miles and 25p after that. These are the most an employer can pay tax-free, not money HMRC pays you. The 55p rate is now permanent, and the rate above 10,000 miles rises to 35p from 6 April 2027 (Budget 2026). If you are self-employed, leave the employer rate at 0: the amount is a deduction from profit, and the relief shown is income tax only. Assumes one employer: unrelated employers each have their own 10,000 miles.</p>
        </div>
      )}
    </div>
  )
}
