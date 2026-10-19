import { useState } from 'react'
import { formatCurrency } from '@/utils'

// Illustrative annual energy cost by EPC band for a typical home (not the figure on any specific EPC)
const EPC_COSTS: Record<string, number> = { A: 600, B: 900, C: 1300, D: 1800, E: 2500, F: 3200, G: 4000 }

function calculate(current: string, target: string, upgradeCost: number) {
  const currentCost = EPC_COSTS[current] || 0
  const targetCost = EPC_COSTS[target] || 0
  const annualSaving = currentCost - targetCost
  const tenYearSaving = annualSaving * 10
  const paybackYears = annualSaving > 0 && upgradeCost > 0 ? upgradeCost / annualSaving : 0
  const tenYearNet = tenYearSaving - upgradeCost
  return { currentCost, targetCost, annualSaving, tenYearSaving, paybackYears, tenYearNet }
}

export default function EPCRatingCalculator() {
  const [current, setCurrent] = useState('D')
  const [target, setTarget] = useState('C')
  const [upgrade, setUpgrade] = useState('')

  const upgradeCost = Math.max(0, parseFloat(upgrade) || 0)
  const { annualSaving, tenYearSaving, paybackYears, tenYearNet } = calculate(current, target, upgradeCost)
  const bands = ['A','B','C','D','E','F','G']
  const colors: Record<string,string> = { A:'bg-green-600', B:'bg-green-500', C:'bg-lime-500', D:'bg-yellow-500', E:'bg-orange-500', F:'bg-orange-600', G:'bg-red-600' }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Current EPC Band</label><select value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Current EPC Band">{bands.map(b => <option key={b} value={b}>Band {b} (~£{EPC_COSTS[b].toLocaleString('en-GB')}/yr)</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Target EPC Band</label><select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Target EPC Band">{bands.map(b => <option key={b} value={b}>Band {b} (~£{EPC_COSTS[b].toLocaleString('en-GB')}/yr)</option>)}</select></div>
      </div>
      <div><label className="block text-sm font-medium mb-2">Upgrade cost (£, optional)</label><input type="number" min="0" step="100" value={upgrade} placeholder="e.g. 5000" onChange={(e) => setUpgrade(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Upgrade cost (£, optional)" /></div>
      <div className="flex gap-1 justify-center">{bands.map(b => <div key={b} className={`${colors[b]} text-white text-sm font-bold w-10 h-10 rounded flex items-center justify-center ${b === current ? 'ring-2 ring-foreground ring-offset-2' : 'opacity-60'}`}>{b}</div>)}</div>
      {annualSaving > 0 && (
        <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center animate-fade-in-up">
          <p className="text-sm text-muted-foreground">Moving from Band {current} to Band {target}</p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">Save {formatCurrency(annualSaving)}/year</p>
          <p className="text-sm text-muted-foreground mt-1">10-year saving: {formatCurrency(tenYearSaving)}</p>
          {upgradeCost > 0 && (
            <p className="text-sm text-muted-foreground mt-1">Payback on a {formatCurrency(upgradeCost)} upgrade: {paybackYears.toFixed(1)} years &middot; 10-year saving net of the upgrade: {formatCurrency(tenYearNet)}</p>
          )}
        </div>
      )}
      {annualSaving < 0 && (
        <div className="rounded-xl border border-border p-4 text-center text-sm text-muted-foreground animate-fade-in-up">Band {target} costs about {formatCurrency(-annualSaving)} more a year than band {current}. Pick a better target band to see a saving.</div>
      )}
      {annualSaving === 0 && (
        <div className="rounded-xl border border-border p-4 text-center text-sm text-muted-foreground animate-fade-in-up">Same band selected: pick a better target band to see a saving.</div>
      )}
      <p className="text-xs text-muted-foreground">Band costs are illustrative averages for a typical home, not the figure printed on a specific EPC, which is modelled for that property.</p>
    </div>
  )
}
