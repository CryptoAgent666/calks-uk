import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const RATES_2025: Record<string, { rate: number; name: string }> = {
  '21plus': { rate: 12.71, name: 'National Living Wage (21+)' },
  '18to20': { rate: 10.85, name: 'Age 18-20' },
  'under18': { rate: 8.00, name: 'Under 18' },
  'apprentice': { rate: 8.00, name: 'Apprentice' },
}

function calculate(ageGroup: string, hoursPerWeek: number) {
  const info = RATES_2025[ageGroup] || RATES_2025['21plus']
  const weekly = info.rate * hoursPerWeek
  const monthly = weekly * 52 / 12
  const annual = weekly * 52

  return { rate: info.rate, name: info.name, weekly, monthly, annual, dailyFT: info.rate * 8 }
}

export default function MinimumWageCalculator() {
  const [age, setAge] = useState('21plus')
  const [hours, setHours] = useState('37.5')

  const h = parseFloat(hours) || 0
  const result = useMemo(() => calculate(age, h), [age, h])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Age Group</label><select value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Age Group">{Object.entries(RATES_2025).map(([k,v]) => <option key={k} value={k}>{v.name} (£{v.rate}/hr)</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Hours/Week</label><input type="number" min="1" max="60" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours/Week" /></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
        <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Hourly</p><p className="text-xl font-bold text-primary">£{result.rate}</p></div>
        <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Weekly</p><p className="text-lg font-bold">{formatCurrency(result.weekly)}</p></div>
        <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly</p><p className="text-lg font-bold">{formatCurrency(result.monthly)}</p></div>
        <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annual</p><p className="text-lg font-bold">{formatCurrency(result.annual)}</p></div>
      </div>
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">2026/27 National Minimum/Living Wage rates:</p>
        {Object.entries(RATES_2025).map(([,v]) => <p key={v.name}>{v.name}: <span className="font-medium text-foreground">£{v.rate}/hour</span></p>)}
      </div>
    </div>
  )
}
