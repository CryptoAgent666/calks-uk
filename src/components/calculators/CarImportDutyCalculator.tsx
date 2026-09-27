import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Origin of manufacture, not the country you buy from.
// 'eu': 0% under the UK-EU Trade and Cooperation Agreement with proof of EU origin.
// 'fta': 0% for cars made in a country with a UK trade agreement that has
//        removed car tariffs (Japan, South Korea, Turkey), with proof of origin.
// 'standard': 10% UK Global Tariff rate for passenger cars (HS 8703). NB motor
//        caravans, a separate 8703 subheading, are 6.5%; this calculator covers cars.
type Origin = 'eu' | 'fta' | 'standard'

// DVSA statutory normal IVA inspection, M1 car, in working hours (£294 outside).
const IVA_FEE = 199
// DVLA fee for first registration of an imported vehicle (V55/5).
const FIRST_REGISTRATION_FEE = 55

function calculate(carValue: number, shippingCost: number, co2: number, fuelType: string, origin: Origin, over10Years: boolean) {
  const customsValue = carValue + shippingCost

  const dutyRate = origin === 'standard' ? 0.10 : 0
  const importDuty = customsValue * dutyRate

  // VAT at 20% on (customs value + duty)
  const vatableAmount = customsValue + importDuty
  const vat = vatableAmount * 0.20

  // Registration: first year VED (2026/27 rates, gov.uk vehicle-tax-rate-tables; EV first-year stays £10)
  let ved = 0
  if (fuelType === 'electric') ved = 10
  else if (co2 <= 50) ved = 115
  else if (co2 <= 75) ved = 135
  else if (co2 <= 90) ved = 280
  else if (co2 <= 100) ved = 365
  else if (co2 <= 110) ved = 405
  else if (co2 <= 130) ved = 455
  else if (co2 <= 150) ved = 560
  else if (co2 <= 170) ved = 1_410
  else if (co2 <= 190) ved = 2_270
  else if (co2 <= 225) ved = 3_420
  else if (co2 <= 255) ved = 4_850
  else ved = 5_690

  // Cars over 10 years old are exempt from vehicle approval (gov.uk/vehicle-approval).
  const typeApproval = over10Years ? 0 : IVA_FEE
  const registration = FIRST_REGISTRATION_FEE
  const totalCost = carValue + shippingCost + importDuty + vat + ved + typeApproval + registration
  const totalOnTop = totalCost - carValue

  return { customsValue, dutyRate: dutyRate * 100, importDuty, vat, ved, typeApproval, registration, totalCost, totalOnTop }
}

export default function CarImportDutyCalculator() {
  const [value, setValue] = useState('20000')
  const [shipping, setShipping] = useState('1500')
  const [co2, setCo2] = useState('120')
  const [fuel, setFuel] = useState('petrol')
  const [origin, setOrigin] = useState<Origin>('eu')
  const [over10, setOver10] = useState(false)

  const v = parseFloat(value.replace(/,/g,'')) || 0
  const s = parseFloat(shipping.replace(/,/g,'')) || 0
  const c = parseInt(co2) || 0
  const result = useMemo(() => calculate(v, s, c, fuel, origin, over10), [v, s, c, fuel, origin, over10])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Car Value (purchase)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Car Value (purchase)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Shipping Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={shipping} onChange={(e) => setShipping(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Shipping Cost" /></div></div>
        <div><label className="block text-sm font-medium mb-2">CO2 (g/km)</label><input type="number" min="0" max="300" value={co2} onChange={(e) => setCo2(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="CO2 (g/km)" /></div>
        <div><label className="block text-sm font-medium mb-2">Fuel Type</label><select value={fuel} onChange={(e) => setFuel(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Fuel Type"><option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="electric">Electric</option></select></div>
      </div>
      <div>
        <p className="block text-sm font-medium mb-2">Where the car was made</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button onClick={() => setOrigin('eu')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${origin === 'eu' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>EU (0% duty)</button>
          <button onClick={() => setOrigin('fta')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${origin === 'fta' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Japan, South Korea, Turkey (0%)</button>
          <button onClick={() => setOrigin('standard')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${origin === 'standard' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Elsewhere, e.g. USA (10% duty)</button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">The 0% rates need proof the car was made in that country. Without it, 10% applies.</p>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={over10} onChange={(e) => setOver10(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label="Car is over 10 years old" /><span className="text-sm">Car is over 10 years old (no vehicle approval needed)</span></label>

      {v > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total UK Landing Cost</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.totalCost)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.totalOnTop)} in costs above purchase price</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Car Value</td><td className="text-right tabular-nums">{formatCurrency(v)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Shipping</td><td className="text-right tabular-nums">{formatCurrency(s)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Import Duty ({result.dutyRate}%)</td><td className="text-right tabular-nums">{formatCurrency(result.importDuty)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">VAT (20%)</td><td className="text-right tabular-nums">{formatCurrency(result.vat)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">First Year VED</td><td className="text-right tabular-nums">{formatCurrency(result.ved)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Type Approval (IVA){over10 ? ', exempt' : ''}</td><td className="text-right tabular-nums">{formatCurrency(result.typeApproval)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">DVLA First Registration</td><td className="text-right tabular-nums">{formatCurrency(result.registration)}</td></tr>
              <tr className="font-semibold"><td className="py-2">Total</td><td className="text-right tabular-nums">{formatCurrency(result.totalCost)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
