import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Ofgem price cap 1 Oct–31 Dec 2026, Direct Debit, GB average — pence per kWh + daily standing charge.
// Electricity carries no VAT 1 Oct 2026–31 Mar 2027; gas includes 5% VAT. Reset every quarter.
const ELEC_UNIT = 26.32 // p/kWh
const ELEC_STANDING = 54.83 // p/day
const GAS_UNIT = 7.97 // p/kWh
const GAS_STANDING = 29.68 // p/day

// hasGas = false: no gas supply (all-electric home), so no gas units and no gas standing charge.
// A home with a gas meter but zero use still pays the gas standing charge.
function calculate(elecKwh: number, gasKwh: number, hasGas = true) {
  const elecStanding = ELEC_STANDING * 365 / 100
  const gasStanding = hasGas ? GAS_STANDING * 365 / 100 : 0
  const elecCost = (elecKwh * ELEC_UNIT / 100) + elecStanding
  const gasCost = hasGas ? (gasKwh * GAS_UNIT / 100) + gasStanding : 0
  const totalAnnual = elecCost + gasCost

  return {
    elecCost, gasCost, totalAnnual,
    monthlyTotal: totalAnnual / 12,
    dailyTotal: totalAnnual / 365,
    elecStanding,
    gasStanding,
  }
}

export default function EnergyBillCalculator() {
  const [elec, setElec] = useState('2500')
  const [gas, setGas] = useState('9500')
  const [noGas, setNoGas] = useState(false)

  const e = Math.max(0, parseFloat(elec) || 0)
  const g = Math.max(0, parseFloat(gas) || 0)
  const result = useMemo(() => calculate(e, g, !noGas), [e, g, noGas])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Annual Electricity Usage (kWh)</label>
          <input type="number" min="0" value={elec} onChange={(e) => setElec(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Electricity Usage (kWh)" />
          <p className="text-xs text-muted-foreground mt-1">Ofgem typical: 2,500 kWh/year</p>
        </div>
        {!noGas && (
          <div>
            <label className="block text-sm font-medium mb-2">Annual Gas Usage (kWh)</label>
            <input type="number" min="0" value={gas} onChange={(e) => setGas(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Gas Usage (kWh)" />
            <p className="text-xs text-muted-foreground mt-1">Ofgem typical: 9,500 kWh/year</p>
          </div>
        )}
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={noGas} onChange={(e) => setNoGas(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">No gas supply (electricity only)</span></label>
        <p className="text-xs text-muted-foreground mt-1">Tick only if the home has no gas meter. With a gas meter the standing charge applies even if you use no gas.</p>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Annual Energy Bill</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalAnnual)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyTotal)}/month &middot; {formatCurrency(result.dailyTotal)}/day</p>
        </div>

        <div className={`grid gap-3 ${noGas ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <div className="rounded-xl bg-yellow-100 dark:bg-yellow-950 p-4 text-center">
            <p className="text-xs text-muted-foreground">Electricity</p>
            <p className="text-lg font-bold text-yellow-700 dark:text-yellow-400">{formatCurrency(result.elecCost)}/yr</p>
            <p className="text-xs text-muted-foreground mt-1">of which standing charge {formatCurrency(result.elecStanding)}</p>
          </div>
          {!noGas && (
            <div className="rounded-xl bg-blue-100 dark:bg-blue-950 p-4 text-center">
              <p className="text-xs text-muted-foreground">Gas</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{formatCurrency(result.gasCost)}/yr</p>
              <p className="text-xs text-muted-foreground mt-1">of which standing charge {formatCurrency(result.gasStanding)}</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Ofgem price cap rates, 1 October to 31 December 2026 (Direct Debit, GB average):</p>
          <p>Electricity: {ELEC_UNIT}p/kWh + {ELEC_STANDING}p/day standing charge</p>
          {!noGas && <p>Gas: {GAS_UNIT}p/kWh + {GAS_STANDING}p/day standing charge</p>}
          <p className="text-xs">No VAT on electricity from 1 October 2026 to 31 March 2027; gas rates include 5% VAT.</p>
        </div>
      </div>
    </div>
  )
}
