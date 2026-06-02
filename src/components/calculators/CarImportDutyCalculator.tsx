import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(carValue: number, shippingCost: number, co2: number, fuelType: string, isEU: boolean) {
  const customsValue = carValue + shippingCost

  // Import duty: 0% from EU (Trade and Cooperation Agreement), 6.5% from non-EU
  const dutyRate = isEU ? 0 : 0.065
  const importDuty = customsValue * dutyRate

  // VAT at 20% on (customs value + duty)
  const vatableAmount = customsValue + importDuty
  const vat = vatableAmount * 0.20

  // Registration: first year VED (2025/26 rates — doubled for 76g/km+ from April 2025, Budget Oct 2024)
  let ved = 0
  if (fuelType === 'electric') ved = 10
  else if (co2 <= 50) ved = 10
  else if (co2 <= 75) ved = 30
  else if (co2 <= 90) ved = 270
  else if (co2 <= 100) ved = 350
  else if (co2 <= 110) ved = 390
  else if (co2 <= 130) ved = 440
  else if (co2 <= 150) ved = 540
  else if (co2 <= 170) ved = 1_360
  else if (co2 <= 190) ved = 2_190
  else if (co2 <= 225) ved = 3_300
  else if (co2 <= 255) ved = 4_680
  else ved = 5_490

  const typeApproval = 300 // IVA or mutual recognition
  const totalCost = carValue + shippingCost + importDuty + vat + ved + typeApproval
  const totalOnTop = totalCost - carValue

  return { customsValue, dutyRate: dutyRate * 100, importDuty, vat, ved, typeApproval, totalCost, totalOnTop }
}

export default function CarImportDutyCalculator() {
  const [value, setValue] = useState('20000')
  const [shipping, setShipping] = useState('1500')
  const [co2, setCo2] = useState('120')
  const [fuel, setFuel] = useState('petrol')
  const [eu, setEu] = useState(true)

  const v = parseFloat(value.replace(/,/g,'')) || 0
  const s = parseFloat(shipping.replace(/,/g,'')) || 0
  const c = parseInt(co2) || 0
  const result = useMemo(() => calculate(v, s, c, fuel, eu), [v, s, c, fuel, eu])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Car Value (purchase)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Car Value (purchase)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Shipping Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={shipping} onChange={(e) => setShipping(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Shipping Cost" /></div></div>
        <div><label className="block text-sm font-medium mb-2">CO2 (g/km)</label><input type="number" min="0" max="300" value={co2} onChange={(e) => setCo2(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="CO2 (g/km)" /></div>
        <div><label className="block text-sm font-medium mb-2">Fuel Type</label><select value={fuel} onChange={(e) => setFuel(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Fuel Type"><option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="electric">Electric</option></select></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setEu(true)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${eu ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>From EU (0% duty)</button>
        <button onClick={() => setEu(false)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${!eu ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Non-EU (6.5% duty)</button>
      </div>

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
              <tr className="border-b border-border/50"><td className="py-2">Type Approval (IVA)</td><td className="text-right tabular-nums">{formatCurrency(result.typeApproval)}</td></tr>
              <tr className="font-semibold"><td className="py-2">Total</td><td className="text-right tabular-nums">{formatCurrency(result.totalCost)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
