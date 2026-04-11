import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const DEFAULT_ELEC_STANDING = 61.64 // p/day
const DEFAULT_GAS_STANDING = 31.65

function calculate(elecStanding: number, gasStanding: number, hasGas: boolean) {
  const dailyTotal = elecStanding + (hasGas ? gasStanding : 0)
  const annualStanding = dailyTotal * 365 / 100
  const monthlyStanding = annualStanding / 12

  // Zero standing charge tariffs typically charge ~2-3p/kWh more
  const extraPerKwh = 2.5
  const avgElecKwh = 2700
  const avgGasKwh = hasGas ? 11500 : 0
  const extraUnitCost = (avgElecKwh + avgGasKwh) * extraPerKwh / 100
  const saving = annualStanding - extraUnitCost

  return { annualStanding, monthlyStanding, dailyTotal, extraUnitCost, saving, worthSwitching: saving > 0 }
}

export default function StandingChargeSavingsCalculator() {
  const [elec, setElec] = useState(DEFAULT_ELEC_STANDING.toString())
  const [gas, setGas] = useState(DEFAULT_GAS_STANDING.toString())
  const [hasGas, setHasGas] = useState(true)

  const e = parseFloat(elec) || 0
  const g = parseFloat(gas) || 0
  const result = useMemo(() => calculate(e, g, hasGas), [e, g, hasGas])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Electricity Standing Charge (p/day)</label><input type="number" min="0" max="100" step="0.01" value={elec} onChange={(ev) => setElec(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        {hasGas && <div><label className="block text-sm font-medium mb-2">Gas Standing Charge (p/day)</label><input type="number" min="0" max="100" step="0.01" value={gas} onChange={(ev) => setGas(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>}
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={hasGas} onChange={(ev) => setHasGas(ev.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">I have gas supply</span></label>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-destructive/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Annual Standing Charges</p>
          <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.annualStanding)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyStanding)}/month — paid even with zero usage</p>
        </div>
        <div className={`rounded-xl p-4 text-center ${result.worthSwitching ? 'bg-green-100 dark:bg-green-950' : 'bg-muted/50'}`}>
          <p className="text-sm text-muted-foreground">{result.worthSwitching ? 'Zero standing charge tariff would save you' : 'Zero standing charge may cost more'}</p>
          <p className={`text-xl font-bold ${result.worthSwitching ? 'text-green-700 dark:text-green-400' : ''}`}>{result.worthSwitching ? formatCurrency(result.saving) + '/year' : 'Higher unit rates offset savings'}</p>
        </div>
      </div>
    </div>
  )
}
