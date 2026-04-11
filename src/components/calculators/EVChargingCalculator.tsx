import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(batteryKwh: number, currentPct: number, targetPct: number, homeRate: number, publicRate: number, efficiency: number) {
  const kwhNeeded = batteryKwh * ((targetPct - currentPct) / 100)
  const homeCost = kwhNeeded * (homeRate / 100)
  const publicCost = kwhNeeded * (publicRate / 100)
  const rangeAdded = kwhNeeded * efficiency
  const costPerMileHome = homeCost / rangeAdded
  const costPerMilePublic = publicCost / rangeAdded
  // 7kW home charger time
  const hours7kw = kwhNeeded / 7
  // 50kW rapid
  const hours50kw = kwhNeeded / 50
  // 150kW ultra-rapid
  const hours150kw = kwhNeeded / 150

  return { kwhNeeded, homeCost, publicCost, rangeAdded, costPerMileHome, costPerMilePublic, hours7kw, hours50kw, hours150kw }
}

export default function EVChargingCalculator() {
  const [battery, setBattery] = useState('60')
  const [current, setCurrent] = useState('20')
  const [target, setTarget] = useState('80')
  const [homeRate, setHomeRate] = useState('24.5')
  const [publicRate, setPublicRate] = useState('70')
  const [efficiency, setEfficiency] = useState('3.5')

  const b = parseFloat(battery) || 0
  const c = parseFloat(current) || 0
  const t = parseFloat(target) || 0
  const result = useMemo(() => calculate(b, c, t, parseFloat(homeRate)||0, parseFloat(publicRate)||0, parseFloat(efficiency)||3.5), [b, c, t, homeRate, publicRate, efficiency])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Battery Size (kWh)</label><input type="number" min="10" max="200" value={battery} onChange={(e) => setBattery(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Current Charge (%)</label><input type="number" min="0" max="100" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Target Charge (%)</label><input type="number" min="0" max="100" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Home Rate (p/kWh)</label><input type="number" min="0" step="0.1" value={homeRate} onChange={(e) => setHomeRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Public Rate (p/kWh)</label><input type="number" min="0" step="1" value={publicRate} onChange={(e) => setPublicRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Efficiency (mi/kWh)</label><input type="number" min="1" max="6" step="0.1" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {result.kwhNeeded > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Home Charging Cost</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.homeCost)}</p><p className="text-xs text-muted-foreground">{(result.costPerMileHome * 100).toFixed(1)}p/mile</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Public Charging Cost</p><p className="text-xl font-bold">{formatCurrency(result.publicCost)}</p><p className="text-xs text-muted-foreground">{(result.costPerMilePublic * 100).toFixed(1)}p/mile</p></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Energy Needed</p><p className="text-lg font-bold">{result.kwhNeeded.toFixed(1)} kWh</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Range Added</p><p className="text-lg font-bold">{result.rangeAdded.toFixed(0)} mi</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">7kW Home</p><p className="text-lg font-bold">{result.hours7kw.toFixed(1)}h</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">50kW Rapid</p><p className="text-lg font-bold">{(result.hours50kw * 60).toFixed(0)} min</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
