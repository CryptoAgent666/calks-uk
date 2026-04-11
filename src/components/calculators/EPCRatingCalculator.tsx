import { useState } from 'react'
import { formatCurrency } from '@/utils'

// Energy cost by EPC band (annual average)
const EPC_COSTS: Record<string, number> = { A: 600, B: 900, C: 1300, D: 1800, E: 2500, F: 3200, G: 4000 }

export default function EPCRatingCalculator() {
  const [current, setCurrent] = useState('D')
  const [target, setTarget] = useState('C')

  const currentCost = EPC_COSTS[current] || 0
  const targetCost = EPC_COSTS[target] || 0
  const annualSaving = currentCost - targetCost
  const bands = ['A','B','C','D','E','F','G']
  const colors: Record<string,string> = { A:'bg-green-600', B:'bg-green-500', C:'bg-lime-500', D:'bg-yellow-500', E:'bg-orange-500', F:'bg-orange-600', G:'bg-red-600' }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Current EPC Band</label><select value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring">{bands.map(b => <option key={b} value={b}>Band {b} (~£{EPC_COSTS[b]}/yr)</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Target EPC Band</label><select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring">{bands.map(b => <option key={b} value={b}>Band {b} (~£{EPC_COSTS[b]}/yr)</option>)}</select></div>
      </div>
      <div className="flex gap-1 justify-center">{bands.map(b => <div key={b} className={`${colors[b]} text-white text-sm font-bold w-10 h-10 rounded flex items-center justify-center ${b === current ? 'ring-2 ring-foreground ring-offset-2' : 'opacity-60'}`}>{b}</div>)}</div>
      {annualSaving > 0 && (
        <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center animate-fade-in-up">
          <p className="text-sm text-muted-foreground">Moving from Band {current} to Band {target}</p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">Save {formatCurrency(annualSaving)}/year</p>
          <p className="text-sm text-muted-foreground mt-1">10-year saving: {formatCurrency(annualSaving * 10)}</p>
        </div>
      )}
    </div>
  )
}
