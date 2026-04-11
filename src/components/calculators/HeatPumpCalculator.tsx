import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(houseSize: number, currentFuel: string, boilerEfficiency: number, copASHP: number, elecRate: number, gasRate: number, oilRate: number, installCost: number) {
  // Typical heat demand kWh/m²/year for UK
  const heatDemand = houseSize * 120 // ~120 kWh/m²/year average UK home

  const fuelRates: Record<string, number> = { gas: gasRate, oil: oilRate, electric: elecRate, lpg: 8.5 }
  const currentRate = fuelRates[currentFuel] || gasRate
  const currentCost = (heatDemand / (boilerEfficiency / 100)) * (currentRate / 100)

  // Heat pump cost
  const heatPumpElec = heatDemand / copASHP
  const heatPumpCost = heatPumpElec * (elecRate / 100)

  const annualSaving = currentCost - heatPumpCost
  const payback = annualSaving > 0 ? installCost / annualSaving : 0
  const saving10yr = annualSaving * 10 - installCost

  return { heatDemand, currentCost, heatPumpCost, heatPumpElec, annualSaving, payback, saving10yr }
}

export default function HeatPumpCalculator() {
  const [size, setSize] = useState('90')
  const [fuel, setFuel] = useState('gas')
  const [boilerEff, setBoilerEff] = useState('85')
  const [cop, setCop] = useState('3.0')
  const [elec, setElec] = useState('24.5')
  const [gas, setGas] = useState('6.76')
  const [oil, setOil] = useState('5.5')
  const [installCost, setInstallCost] = useState('12000')

  const result = useMemo(() => calculate(parseFloat(size)||0, fuel, parseFloat(boilerEff)||85, parseFloat(cop)||3, parseFloat(elec)||24.5, parseFloat(gas)||6.76, parseFloat(oil)||5.5, parseFloat(installCost.replace(/,/g,''))||0), [size, fuel, boilerEff, cop, elec, gas, oil, installCost])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">House Size (m²)</label><input type="number" min="20" max="500" value={size} onChange={(e) => setSize(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Current Heating</label><select value={fuel} onChange={(e) => setFuel(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"><option value="gas">Gas Boiler</option><option value="oil">Oil Boiler</option><option value="electric">Electric Heating</option><option value="lpg">LPG Boiler</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Boiler Efficiency (%)</label><input type="number" min="50" max="100" value={boilerEff} onChange={(e) => setBoilerEff(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Heat Pump COP</label><input type="number" min="2" max="5" step="0.1" value={cop} onChange={(e) => setCop(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Electricity (p/kWh)</label><input type="number" min="0" step="0.1" value={elec} onChange={(e) => setElec(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Gas (p/kWh)</label><input type="number" min="0" step="0.1" value={gas} onChange={(e) => setGas(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Installation Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={installCost} onChange={(e) => setInstallCost(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>

      {parseFloat(size) > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Current Heating Cost</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.currentCost)}/yr</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Heat Pump Cost</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.heatPumpCost)}/yr</p></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Saving</p><p className="text-lg font-bold text-primary">{formatCurrency(result.annualSaving)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Payback Period</p><p className="text-lg font-bold">{result.payback.toFixed(1)} years</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">10-Year Net Saving</p><p className={`text-lg font-bold ${result.saving10yr > 0 ? 'text-green-600' : 'text-destructive'}`}>{formatCurrency(result.saving10yr)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
