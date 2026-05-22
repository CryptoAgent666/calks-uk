import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const APPLIANCES = [
  { name: 'Kettle', watts: 3000, defaultHours: 0.17 },
  { name: 'Washing Machine', watts: 500, defaultHours: 1 },
  { name: 'Tumble Dryer', watts: 2500, defaultHours: 1 },
  { name: 'Dishwasher', watts: 1800, defaultHours: 1 },
  { name: 'Oven', watts: 2000, defaultHours: 1 },
  { name: 'Microwave', watts: 800, defaultHours: 0.25 },
  { name: 'TV (55")', watts: 100, defaultHours: 4 },
  { name: 'Laptop', watts: 65, defaultHours: 6 },
  { name: 'Desktop PC', watts: 300, defaultHours: 6 },
  { name: 'Games Console', watts: 150, defaultHours: 2 },
  { name: 'Fridge-Freezer', watts: 150, defaultHours: 24 },
  { name: 'Electric Shower', watts: 8500, defaultHours: 0.17 },
  { name: 'Hair Dryer', watts: 2200, defaultHours: 0.17 },
  { name: 'Iron', watts: 2400, defaultHours: 0.25 },
  { name: 'Fan Heater', watts: 2000, defaultHours: 3 },
  { name: 'LED Light Bulb', watts: 10, defaultHours: 5 },
]

function calculate(watts: number, hoursPerDay: number, elecRate: number) {
  const kwhPerDay = (watts * hoursPerDay) / 1000
  const dailyCost = kwhPerDay * (elecRate / 100)
  return { kwhPerDay, dailyCost, weeklyCost: dailyCost * 7, monthlyCost: dailyCost * 30.44, annualCost: dailyCost * 365 }
}

export default function ElectricityCostCalculator() {
  const [watts, setWatts] = useState('2000')
  const [hours, setHours] = useState('1')
  const [rate, setRate] = useState('24.5')

  const w = parseFloat(watts) || 0
  const h = parseFloat(hours) || 0
  const r = parseFloat(rate) || 0
  const result = useMemo(() => calculate(w, h, r), [w, h, r])

  const selectAppliance = (idx: number) => {
    const a = APPLIANCES[idx]
    setWatts(a.watts.toString())
    setHours(a.defaultHours.toString())
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Quick Select Appliance</label>
        <select onChange={(e) => selectAppliance(parseInt(e.target.value))} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Quick Select Appliance">
          <option value="">-- Select an appliance --</option>
          {APPLIANCES.map((a, i) => <option key={a.name} value={i}>{a.name} ({a.watts}W)</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Power (Watts)</label><input type="number" min="0" max="20000" value={watts} onChange={(e) => setWatts(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Power (Watts)" /></div>
        <div><label className="block text-sm font-medium mb-2">Hours per Day</label><input type="number" min="0" max="24" step="0.25" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours per Day" /></div>
        <div><label className="block text-sm font-medium mb-2">Electricity Rate (p/kWh)</label><input type="number" min="0" max="60" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Electricity Rate (p/kWh)" /></div>
      </div>

      {w > 0 && h > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Daily</p><p className="text-lg font-bold">{formatCurrency(result.dailyCost)}</p><p className="text-xs text-muted-foreground">{result.kwhPerDay.toFixed(2)} kWh</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Weekly</p><p className="text-lg font-bold">{formatCurrency(result.weeklyCost)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly</p><p className="text-lg font-bold">{formatCurrency(result.monthlyCost)}</p></div>
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Annual</p><p className="text-xl font-bold text-primary">{formatCurrency(result.annualCost)}</p></div>
        </div>
      )}
    </div>
  )
}
