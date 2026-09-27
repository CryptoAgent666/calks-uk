import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Boiler Upgrade Scheme (England and Wales): £7,500 towards an air or ground source heat pump,
// plus £1,500 until March 2027 where the home is off the gas grid and heated by oil or LPG.
// https://www.gov.uk/apply-boiler-upgrade-scheme/what-you-can-get
const BUS_GRANT = 7500
const BUS_OFF_GAS_UPLIFT = 1500

// Default fuel prices in pence per kWh of fuel.
// Heating oil: BoilerJuice UK average kerosene 116.06p per litre (1,000 litres, inc. VAT), 27 Sep 2026,
// at about 10.35 kWh per litre = 11.2p/kWh. LPG: assumed bulk-tank price, users should enter their own quote.
const DEFAULT_OIL = 11.2
const DEFAULT_LPG = 8.5

function busGrant(currentFuel: string, useGrant: boolean) {
  if (!useGrant) return 0
  return BUS_GRANT + (currentFuel === 'oil' || currentFuel === 'lpg' ? BUS_OFF_GAS_UPLIFT : 0)
}

function calculate(houseSize: number, currentFuel: string, boilerEfficiency: number, copASHP: number, elecRate: number, gasRate: number, oilRate: number, lpgRate: number, installCost: number, useGrant: boolean) {
  // Typical heat demand kWh/m²/year for UK
  const heatDemand = houseSize * 120 // ~120 kWh/m²/year average UK home

  const fuelRates: Record<string, number> = { gas: gasRate, oil: oilRate, electric: elecRate, lpg: lpgRate }
  const currentRate = fuelRates[currentFuel] ?? gasRate
  // Direct electric heating turns each kWh into a kWh of heat; boiler efficiency only applies to fuel-burning boilers
  const efficiency = currentFuel === 'electric' ? 100 : boilerEfficiency
  const currentCost = (heatDemand / (efficiency / 100)) * (currentRate / 100)

  // Heat pump cost
  const heatPumpElec = heatDemand / copASHP
  const heatPumpCost = heatPumpElec * (elecRate / 100)

  // The grant is deducted from the installer's price, so it can never exceed it
  const grant = Math.min(busGrant(currentFuel, useGrant), installCost)
  const netInstallCost = installCost - grant

  const annualSaving = currentCost - heatPumpCost
  const payback = annualSaving > 0 ? netInstallCost / annualSaving : 0
  const saving10yr = annualSaving * 10 - netInstallCost

  return { heatDemand, currentCost, heatPumpCost, heatPumpElec, grant, netInstallCost, annualSaving, payback, saving10yr }
}

export default function HeatPumpCalculator() {
  const [size, setSize] = useState('90')
  const [fuel, setFuel] = useState('gas')
  const [boilerEff, setBoilerEff] = useState('85')
  const [cop, setCop] = useState('3.0')
  const [elec, setElec] = useState('26.11')
  const [gas, setGas] = useState('7.33')
  const [oil, setOil] = useState(String(DEFAULT_OIL))
  const [installCost, setInstallCost] = useState('12000')
  const [lpg, setLpg] = useState(String(DEFAULT_LPG))
  const [useGrant, setUseGrant] = useState(true)

  const result = useMemo(() => calculate(parseFloat(size)||0, fuel, parseFloat(boilerEff)||85, parseFloat(cop)||3, parseFloat(elec)||26.11, parseFloat(gas)||7.33, parseFloat(oil)||DEFAULT_OIL, parseFloat(lpg)||DEFAULT_LPG, parseFloat(installCost.replace(/,/g,''))||0, useGrant), [size, fuel, boilerEff, cop, elec, gas, oil, lpg, installCost, useGrant])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">House Size (m²)</label><input type="number" min="20" max="500" value={size} onChange={(e) => setSize(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="House Size (m²)" /><p className="text-xs text-muted-foreground mt-1">Heat demand assumed at 120 kWh per m² a year</p></div>
        <div><label className="block text-sm font-medium mb-2">Current Heating</label><select value={fuel} onChange={(e) => setFuel(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Current Heating"><option value="gas">Gas Boiler</option><option value="oil">Oil Boiler</option><option value="electric">Electric Heating</option><option value="lpg">LPG Boiler</option></select></div>
        {fuel !== 'electric' && <div><label className="block text-sm font-medium mb-2">Boiler Efficiency (%)</label><input type="number" min="50" max="100" value={boilerEff} onChange={(e) => setBoilerEff(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Boiler Efficiency (%)" /></div>}
        <div><label className="block text-sm font-medium mb-2">Heat Pump COP</label><input type="number" min="2" max="5" step="0.1" value={cop} onChange={(e) => setCop(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Heat Pump COP" /></div>
        <div><label className="block text-sm font-medium mb-2">Electricity (p/kWh)</label><input type="number" min="0" step="0.1" value={elec} onChange={(e) => setElec(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Electricity (p/kWh)" /></div>
        {fuel === 'gas' && <div><label className="block text-sm font-medium mb-2">Gas (p/kWh)</label><input type="number" min="0" step="0.1" value={gas} onChange={(e) => setGas(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Gas (p/kWh)" /></div>}
        {fuel === 'oil' && <div><label className="block text-sm font-medium mb-2">Heating Oil (p/kWh)</label><input type="number" min="0" step="0.1" value={oil} onChange={(e) => setOil(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Heating Oil (p/kWh)" /><p className="text-xs text-muted-foreground mt-1">Kerosene at 116p a litre is about 11.2p/kWh (BoilerJuice UK average, 27 Sep 2026)</p></div>}
        {fuel === 'lpg' && <div><label className="block text-sm font-medium mb-2">LPG (p/kWh)</label><input type="number" min="0" step="0.1" value={lpg} onChange={(e) => setLpg(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="LPG (p/kWh)" /><p className="text-xs text-muted-foreground mt-1">Assumed bulk-tank price. Enter the rate from your own supplier</p></div>}
        <div><label className="block text-sm font-medium mb-2">Installation Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={installCost} onChange={(e) => setInstallCost(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Installation Cost" /></div></div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={useGrant} onChange={(e) => setUseGrant(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label="Deduct Boiler Upgrade Scheme grant" /><span className="text-sm">Deduct Boiler Upgrade Scheme grant (£7,500, or £9,000 when replacing oil or LPG until March 2027)</span></label>

      {parseFloat(size) > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Current Heating Cost</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.currentCost)}/yr</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Heat Pump Cost</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.heatPumpCost)}/yr</p></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Saving</p><p className="text-lg font-bold text-primary">{formatCurrency(result.annualSaving)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Payback Period</p><p className="text-lg font-bold">{result.annualSaving > 0 ? `${result.payback.toFixed(1)} years` : 'Never at these rates'}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">10-Year Net Saving</p><p className={`text-lg font-bold ${result.saving10yr > 0 ? 'text-green-600' : 'text-destructive'}`}>{formatCurrency(result.saving10yr)}</p></div>
          </div>
          <p className="text-xs text-muted-foreground">
            {result.grant > 0
              ? `Payback and the 10-year figure use the net installation cost of ${formatCurrency(result.netInstallCost)}, after the ${formatCurrency(result.grant)} Boiler Upgrade Scheme grant.`
              : `Payback and the 10-year figure use the full installation cost of ${formatCurrency(result.netInstallCost)}, with no grant deducted.`}
          </p>
        </div>
      )}
    </div>
  )
}
