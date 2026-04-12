import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(annualMiles: number, petrolMpg: number, petrolPriceP: number, evEfficiency: number, homeElecP: number, publicElecP: number, homePct: number) {
  // Petrol costs
  const petrolGallons = annualMiles / petrolMpg
  const petrolLitres = petrolGallons * 4.54609
  const petrolCost = petrolLitres * (petrolPriceP / 100)

  // EV costs
  const evKwh = annualMiles / evEfficiency
  const homeKwh = evKwh * (homePct / 100)
  const publicKwh = evKwh * (1 - homePct / 100)
  const evCost = homeKwh * (homeElecP / 100) + publicKwh * (publicElecP / 100)

  // Other savings
  const vedSaving = 50 // approx VED saving (petrol ~£245 vs EV £195 from April 2025 — EVs now pay standard rate)
  const servicingSaving = 200 // lower servicing costs
  const fuelSaving = petrolCost - evCost
  const totalAnnualSaving = fuelSaving + vedSaving + servicingSaving

  // CO2
  const petrolCO2 = annualMiles * 0.17 // ~170g/km avg
  const evCO2 = evKwh * 0.15 // ~150g/kWh UK grid

  return { petrolCost, evCost, fuelSaving, vedSaving, servicingSaving, totalAnnualSaving, petrolCO2: petrolCO2/1000, evCO2: evCO2/1000, co2Saving: (petrolCO2-evCO2)/1000 }
}

export default function EVSavingsCalculator() {
  const [miles, setMiles] = useState('10000')
  const [mpg, setMpg] = useState('40')
  const [petrolP, setPetrolP] = useState('135')
  const [evEff, setEvEff] = useState('3.5')
  const [homeElec, setHomeElec] = useState('24.5')
  const [publicElec, setPublicElec] = useState('70')
  const [homePct, setHomePct] = useState('80')

  const result = useMemo(() => calculate(parseFloat(miles)||0, parseFloat(mpg)||40, parseFloat(petrolP)||135, parseFloat(evEff)||3.5, parseFloat(homeElec)||24.5, parseFloat(publicElec)||70, parseFloat(homePct)||80), [miles, mpg, petrolP, evEff, homeElec, publicElec, homePct])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Miles</label><input type="number" min="1000" max="40000" step="1000" value={miles} onChange={(e) => setMiles(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Current MPG</label><input type="number" min="15" max="70" value={mpg} onChange={(e) => setMpg(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Petrol (p/litre)</label><input type="number" min="100" max="200" value={petrolP} onChange={(e) => setPetrolP(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">EV Efficiency (mi/kWh)</label><input type="number" min="2" max="5" step="0.1" value={evEff} onChange={(e) => setEvEff(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Home Elec (p/kWh)</label><input type="number" min="0" step="0.1" value={homeElec} onChange={(e) => setHomeElec(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Public (p/kWh)</label><input type="number" min="0" step="1" value={publicElec} onChange={(e) => setPublicElec(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Home Charging (%)</label><input type="number" min="0" max="100" value={homePct} onChange={(e) => setHomePct(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
          <p className="text-sm text-muted-foreground">Total Annual Saving (EV vs Petrol)</p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.totalAnnualSaving)}</p>
          <p className="text-sm text-muted-foreground mt-1">5-year saving: {formatCurrency(result.totalAnnualSaving * 5)}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-sm font-medium">Petrol Cost</p><p className="text-2xl font-bold text-destructive">{formatCurrency(result.petrolCost)}/yr</p><p className="text-xs text-muted-foreground">{result.petrolCO2.toFixed(1)} tonnes CO2</p></div>
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-sm font-medium">EV Cost</p><p className="text-2xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.evCost)}/yr</p><p className="text-xs text-muted-foreground">{result.evCO2.toFixed(1)} tonnes CO2</p></div>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2 text-green-600">Fuel Saving</td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.fuelSaving)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2 text-green-600">VED Saving</td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.vedSaving)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2 text-green-600">Servicing Saving</td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.servicingSaving)}</td></tr>
            <tr className="font-semibold"><td className="py-2">Total Annual Saving</td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.totalAnnualSaving)}</td></tr>
            <tr className="border-t border-border"><td className="py-2 text-muted-foreground">CO2 Saving</td><td className="text-right tabular-nums">{result.co2Saving.toFixed(1)} tonnes/yr</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
