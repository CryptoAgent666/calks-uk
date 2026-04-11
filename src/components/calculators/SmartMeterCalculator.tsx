import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const APPLIANCES = [
  { name: 'Fridge-Freezer', watts: 150, hours: 24, always: true },
  { name: 'Washing Machine', watts: 500, hours: 1, always: false },
  { name: 'Tumble Dryer', watts: 2500, hours: 0.5, always: false },
  { name: 'Dishwasher', watts: 1800, hours: 1, always: false },
  { name: 'Oven/Hob', watts: 2000, hours: 0.5, always: false },
  { name: 'Kettle', watts: 3000, hours: 0.1, always: false },
  { name: 'TV', watts: 100, hours: 4, always: false },
  { name: 'Laptop/PC', watts: 100, hours: 6, always: false },
  { name: 'Router', watts: 10, hours: 24, always: true },
  { name: 'Lighting (LED x10)', watts: 100, hours: 5, always: false },
  { name: 'Electric Shower', watts: 8500, hours: 0.15, always: false },
  { name: 'Heating (if electric)', watts: 2000, hours: 0, always: false },
]

function calculate(appliances: { watts: number; hours: number }[], elecRate: number) {
  let dailyKwh = 0
  appliances.forEach(a => { dailyKwh += (a.watts * a.hours) / 1000 })
  const dailyCost = dailyKwh * (elecRate / 100)
  return { dailyKwh, dailyCost, weeklyCost: dailyCost * 7, monthlyCost: dailyCost * 30.44, annualCost: dailyCost * 365 }
}

export default function SmartMeterCalculator() {
  const [items, setItems] = useState(APPLIANCES.map(a => ({ ...a })))
  const [rate, setRate] = useState('24.5')

  const r = parseFloat(rate) || 0
  const result = useMemo(() => calculate(items, r), [items, r])

  const updateHours = (i: number, hours: number) => setItems(prev => prev.map((item, idx) => idx === i ? { ...item, hours } : item))

  return (
    <div className="space-y-6">
      <div><label className="block text-sm font-medium mb-2">Electricity Rate (p/kWh)</label><input type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-48 rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.name} className="flex items-center gap-3 rounded-xl border border-border p-3">
            <span className="text-sm font-medium w-36 shrink-0">{item.name}</span>
            <span className="text-xs text-muted-foreground w-16 shrink-0">{item.watts}W</span>
            <input type="number" min="0" max="24" step="0.25" value={item.hours} onChange={(e) => updateHours(i, parseFloat(e.target.value) || 0)} className="w-20 rounded-lg border border-input bg-background px-2 py-1.5 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
            <span className="text-xs text-muted-foreground">hrs/day</span>
            <span className="text-sm font-medium ml-auto">{((item.watts * item.hours / 1000) * (r / 100)).toFixed(2)}p</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-primary/10 p-6 text-center animate-fade-in-up">
        <p className="text-sm text-muted-foreground">Estimated Daily Electricity Cost</p>
        <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.dailyCost)}</p>
        <p className="text-sm text-muted-foreground mt-1">{result.dailyKwh.toFixed(1)} kWh/day &middot; {formatCurrency(result.monthlyCost)}/month &middot; {formatCurrency(result.annualCost)}/year</p>
      </div>
    </div>
  )
}
