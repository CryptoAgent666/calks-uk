import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const CITIES: Record<string, { rent: number; food: number; transport: number; utilities: number; index: number }> = {
  'London': { rent: 1800, food: 400, transport: 170, utilities: 200, index: 130 },
  'Manchester': { rent: 1000, food: 320, transport: 80, utilities: 160, index: 90 },
  'Birmingham': { rent: 950, food: 310, transport: 75, utilities: 155, index: 87 },
  'Edinburgh': { rent: 1100, food: 330, transport: 70, utilities: 170, index: 95 },
  'Bristol': { rent: 1200, food: 340, transport: 80, utilities: 165, index: 100 },
  'Leeds': { rent: 900, food: 300, transport: 75, utilities: 150, index: 85 },
  'Glasgow': { rent: 850, food: 310, transport: 70, utilities: 155, index: 82 },
  'Cardiff': { rent: 900, food: 300, transport: 65, utilities: 150, index: 83 },
  'Newcastle': { rent: 800, food: 290, transport: 70, utilities: 145, index: 80 },
  'Liverpool': { rent: 800, food: 290, transport: 65, utilities: 145, index: 78 },
  'Sheffield': { rent: 800, food: 290, transport: 65, utilities: 145, index: 79 },
  'Nottingham': { rent: 850, food: 300, transport: 70, utilities: 150, index: 82 },
}

function calculate(city1: string, city2: string, salary: number) {
  const c1 = CITIES[city1]
  const c2 = CITIES[city2]
  if (!c1 || !c2) return null

  const monthly1 = c1.rent + c1.food + c1.transport + c1.utilities
  const monthly2 = c2.rent + c2.food + c2.transport + c2.utilities
  const difference = monthly2 - monthly1
  const pctDiff = monthly1 > 0 ? ((monthly2 - monthly1) / monthly1) * 100 : 0

  // Use the same itemised-cost basis as the headline "% cheaper" figure so the two agree
  const equivalentSalary = salary > 0 && monthly1 > 0 ? salary * (monthly2 / monthly1) : 0

  return { c1, c2, monthly1, monthly2, difference, pctDiff, equivalentSalary, annual1: monthly1 * 12, annual2: monthly2 * 12 }
}

export default function CostOfLivingComparisonCalculator() {
  const [city1, setCity1] = useState('London')
  const [city2, setCity2] = useState('Manchester')
  const [salary, setSalary] = useState('40000')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(city1, city2, s), [city1, city2, s])
  const cities = Object.keys(CITIES)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Current City</label><select value={city1} onChange={(e) => setCity1(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Current City">{cities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Compare With</label><select value={city2} onChange={(e) => setCity2(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Compare With">{cities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Current Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current Salary" /></div></div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.difference > 0 ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}>
            <p className="text-sm text-muted-foreground">{city2} is {Math.abs(result.pctDiff).toFixed(0)}% {result.difference > 0 ? 'more expensive' : 'cheaper'} than {city1}</p>
            <p className={`text-2xl font-bold mt-1 ${result.difference > 0 ? 'text-destructive' : 'text-green-700 dark:text-green-400'}`}>{result.difference > 0 ? '+' : ''}{formatCurrency(result.difference)}/month</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4">
              <p className="font-semibold text-sm mb-2">{city1}</p>
              <p className="text-xs text-muted-foreground">Rent: {formatCurrency(result.c1.rent)}</p>
              <p className="text-xs text-muted-foreground">Food: {formatCurrency(result.c1.food)}</p>
              <p className="text-xs text-muted-foreground">Transport: {formatCurrency(result.c1.transport)}</p>
              <p className="text-xs text-muted-foreground">Utilities: {formatCurrency(result.c1.utilities)}</p>
              <p className="text-sm font-bold mt-2">{formatCurrency(result.monthly1)}/month</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="font-semibold text-sm mb-2">{city2}</p>
              <p className="text-xs text-muted-foreground">Rent: {formatCurrency(result.c2.rent)}</p>
              <p className="text-xs text-muted-foreground">Food: {formatCurrency(result.c2.food)}</p>
              <p className="text-xs text-muted-foreground">Transport: {formatCurrency(result.c2.transport)}</p>
              <p className="text-xs text-muted-foreground">Utilities: {formatCurrency(result.c2.utilities)}</p>
              <p className="text-sm font-bold mt-2">{formatCurrency(result.monthly2)}/month</p>
            </div>
          </div>

          {s > 0 && (
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <p className="text-sm text-muted-foreground">To maintain the same lifestyle in {city2}, you'd need</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(result.equivalentSalary)}/year</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
