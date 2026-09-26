import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Electric Vehicle Excise Duty (eVED), confirmed in the July 2026 consultation response:
// from April 2028, 3p a mile for battery EVs and 1.5p for plug-in hybrids, uprated by CPI
// from 2029-30, charged ON TOP of normal VED. Mileage is declared at VED renewal and
// checked against MOT odometer readings. Vans, buses and HGVs are out of scope at launch.
const EVED_PENCE: Record<'bev' | 'phev', number> = { bev: 3, phev: 1.5 }
const FUEL_DUTY_PENCE = 52.95 // petrol/diesel duty per litre, 2026/27
const VAT = 0.2
const LITRES_PER_GALLON = 4.54609

function calculate(annualMiles: number, vehicle: 'bev' | 'phev', ved: number, mpg: number) {
  const eved = annualMiles * (EVED_PENCE[vehicle] / 100)
  const evTotal = eved + ved

  // A petrol car covering the same miles: fuel duty plus the VAT charged on that duty, plus VED
  const litres = mpg > 0 ? (annualMiles / mpg) * LITRES_PER_GALLON : 0
  const petrolDuty = litres * (FUEL_DUTY_PENCE / 100) * (1 + VAT)
  const petrolTotal = petrolDuty + ved

  return { eved, evTotal, petrolDuty, petrolTotal, difference: evTotal - petrolTotal, monthlyEved: eved / 12 }
}

export default function PayPerMileCalculator() {
  const [miles, setMiles] = useState('8000')
  const [vehicle, setVehicle] = useState<'bev' | 'phev'>('bev')
  const [ved, setVed] = useState('200') // standard VED rate 2026/27 (£200 from 1 April 2026)
  const [mpg, setMpg] = useState('40')

  const m = parseFloat(miles.replace(/,/g, '')) || 0
  const v = parseFloat(ved) || 0
  const g = parseFloat(mpg) || 40
  const result = useMemo(() => calculate(m, vehicle, v, g), [m, vehicle, v, g])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Miles</label><input type="text" inputMode="numeric" value={miles} onChange={(e) => setMiles(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Annual Miles" /></div>
        <div><label className="block text-sm font-medium mb-2">Vehicle</label><select value={vehicle} onChange={(e) => setVehicle(e.target.value as 'bev' | 'phev')} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Vehicle"><option value="bev">Battery electric (3p/mile)</option><option value="phev">Plug-in hybrid (1.5p/mile)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">VED (£/yr)</label><input type="number" min="0" max="2000" value={ved} onChange={(e) => setVed(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="VED per year" /></div>
        <div><label className="block text-sm font-medium mb-2">Petrol car MPG (to compare)</label><input type="number" min="10" max="70" value={mpg} onChange={(e) => setMpg(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Petrol car MPG for comparison" /></div>
      </div>

      {m > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">eVED from April 2028</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.eved)}/yr</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyEved)}/month, on top of {formatCurrency(v)} VED</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/50 p-5 text-center"><p className="text-sm font-medium">Your {vehicle === 'bev' ? 'EV' : 'plug-in hybrid'}</p><p className="text-2xl font-bold mt-1">{formatCurrency(result.evTotal)}/yr</p><p className="text-xs text-muted-foreground">eVED + VED</p></div>
            <div className="rounded-xl bg-muted/50 p-5 text-center"><p className="text-sm font-medium">{g} mpg petrol car</p><p className="text-2xl font-bold mt-1">{formatCurrency(result.petrolTotal)}/yr</p><p className="text-xs text-muted-foreground">fuel duty (+ VAT on it) + VED</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">How eVED works</p>
            <p>From April 2028 battery electric cars pay 3p a mile and plug-in hybrids 1.5p, rising with CPI from 2029-30, on top of normal VED. You declare your expected mileage when you renew your vehicle tax, and it is checked against MOT odometer readings; there is no GPS tracking. Petrol and diesel cars keep paying fuel duty instead ({FUEL_DUTY_PENCE}p a litre in 2026/27), and vans are outside the scheme at launch. {vehicle === 'phev' ? 'A plug-in hybrid also pays fuel duty on the petrol it burns, which this comparison leaves out.' : ''}</p>
          </div>
        </div>
      )}
    </div>
  )
}
