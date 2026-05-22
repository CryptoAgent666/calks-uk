import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const ULEZ_DAILY = 12.50
const CC_DAILY = 15.00

function calculate(euroStandard: string, fuelType: string, daysInULEZ: number, inCongestionZone: boolean, daysInCC: number) {
  const petrolCompliant = parseInt(euroStandard) >= 4
  const dieselCompliant = parseInt(euroStandard) >= 6
  const isCompliant = fuelType === 'electric' ? true : fuelType === 'petrol' ? petrolCompliant : dieselCompliant

  const ulezAnnual = isCompliant ? 0 : daysInULEZ * ULEZ_DAILY * 52
  const ccAnnual = inCongestionZone ? daysInCC * CC_DAILY * 52 : 0

  // Congestion charge discount for EVs removed from Dec 2025
  const evCCDiscount = fuelType === 'electric' ? 0 : 0

  const totalAnnual = ulezAnnual + ccAnnual
  const weeklyTotal = totalAnnual / 52

  return { isCompliant, ulezAnnual, ccAnnual, totalAnnual, weeklyTotal, ulezDaily: isCompliant ? 0 : ULEZ_DAILY }
}

export default function ULEZCalculator() {
  const [euro, setEuro] = useState('4')
  const [fuel, setFuel] = useState('petrol')
  const [days, setDays] = useState('5')
  const [cc, setCc] = useState(false)
  const [ccDays, setCcDays] = useState('3')

  const d = parseInt(days) || 0
  const cd = parseInt(ccDays) || 0
  const result = useMemo(() => calculate(euro, fuel, d, cc, cd), [euro, fuel, d, cc, cd])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Fuel Type</label><select value={fuel} onChange={(e) => setFuel(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Fuel Type"><option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="electric">Electric</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Euro Standard</label><select value={euro} onChange={(e) => setEuro(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Euro Standard"><option value="3">Euro 3 (pre-2006)</option><option value="4">Euro 4 (2006-2011)</option><option value="5">Euro 5 (2011-2015)</option><option value="6">Euro 6 (2015+)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Days/Week in ULEZ</label><input type="number" min="0" max="7" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Days/Week in ULEZ" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={cc} onChange={(e) => setCc(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Also enter Congestion Charge zone (£{CC_DAILY}/day)</span></label>
      {cc && <div><label className="block text-sm font-medium mb-2">Days/Week in CC Zone</label><input type="number" min="0" max="7" value={ccDays} onChange={(e) => setCcDays(e.target.value)} className="w-32 rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Days/Week in CC Zone" /></div>}

      <div className="space-y-4 animate-fade-in-up">
        <div className={`rounded-xl p-3 text-center text-sm font-medium ${result.isCompliant ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400' : 'bg-destructive/10 text-destructive'}`}>
          {result.isCompliant ? 'Your vehicle is ULEZ compliant — no daily charge' : `Not ULEZ compliant — £${ULEZ_DAILY}/day charge applies`}
        </div>
        <div className="rounded-2xl bg-destructive/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Annual ULEZ + CC Cost</p>
          <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.totalAnnual)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.weeklyTotal)}/week</p>
        </div>
        {result.totalAnnual > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">ULEZ</p><p className="text-lg font-bold">{formatCurrency(result.ulezAnnual)}/yr</p></div>
            {result.ccAnnual > 0 && <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Congestion Charge</p><p className="text-lg font-bold">{formatCurrency(result.ccAnnual)}/yr</p></div>}
          </div>
        )}
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>ULEZ: £{ULEZ_DAILY}/day for non-compliant vehicles (petrol pre-Euro 4, diesel pre-Euro 6). Covers all of Greater London 24/7. Congestion Charge: £{CC_DAILY}/day, Mon-Sun 7am-6pm, central London.</p>
        </div>
      </div>
    </div>
  )
}
