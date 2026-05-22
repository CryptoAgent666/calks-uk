import { useState } from 'react'
import { formatCurrency } from '@/utils'

const COSTS: Record<string, number> = { A: 600, B: 900, C: 1300, D: 1800, E: 2500, F: 3200, G: 4000 }

export default function EPCSavingsCalculator() {
  const [band, setBand] = useState('D')
  const bands = ['A','B','C','D','E','F','G']
  const currentCost = COSTS[band]

  return (
    <div className="space-y-6">
      <div><label className="block text-sm font-medium mb-2">Your EPC Band</label><select value={band} onChange={(e) => setBand(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Your EPC Band">{bands.map(b => <option key={b} value={b}>Band {b}</option>)}</select></div>
      <div className="space-y-2">
        {bands.filter(b => bands.indexOf(b) < bands.indexOf(band)).map(target => {
          const saving = currentCost - COSTS[target]
          return (
            <div key={target} className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm font-medium">Upgrade to Band {target}</span>
              <span className="text-sm font-bold text-green-700 dark:text-green-400">Save {formatCurrency(saving)}/year</span>
            </div>
          )
        })}
      </div>
      <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-sm text-muted-foreground">Current estimated energy cost</p><p className="text-2xl font-bold text-primary">{formatCurrency(currentCost)}/year</p></div>
    </div>
  )
}
