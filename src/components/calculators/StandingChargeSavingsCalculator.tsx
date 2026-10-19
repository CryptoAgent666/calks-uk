import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Ofgem price cap 1 Oct–31 Dec 2026, GB average, Direct Debit. Electricity carries no VAT
// from 1 Oct 2026 to 31 Mar 2027; the gas figures include 5% VAT.
const DEFAULT_ELEC_STANDING = 54.83 // p/day
const DEFAULT_GAS_STANDING = 29.68  // p/day
const DEFAULT_ELEC_RATE = 26.32     // p/kWh
const DEFAULT_GAS_RATE = 7.97       // p/kWh
// Ofgem typical domestic consumption values from 1 Jul 2026
const DEFAULT_ELEC_KWH = 2500
const DEFAULT_GAS_KWH = 9500
// Ofgem lower standing charge tariff pilot (from June 2026): about £150 a year off standing charges
// for dual fuel, split across both fuels. E.ON's pilot tariff adds about 3.5p/kWh to electricity
// and 1p/kWh to gas (MoneySavingExpert, 8 Jul 2026).
const DEFAULT_CUT_PER_FUEL = 75     // £/year
const DEFAULT_ELEC_PREMIUM = 3.5    // p/kWh
const DEFAULT_GAS_PREMIUM = 1       // p/kWh

interface Fuel { standing: number; rate: number; kwh: number; cut: number; premium: number }

function fuelResult(f: Fuel) {
  const standingYear = Math.max(0, f.standing) * 365 / 100
  const units = Math.max(0, f.kwh) * Math.max(0, f.rate) / 100
  const cut = Math.min(Math.max(0, f.cut), standingYear) // cannot go below a zero standing charge
  const extra = Math.max(0, f.kwh) * Math.max(0, f.premium) / 100
  const breakEven = f.premium > 0 ? cut / (f.premium / 100) : Infinity
  return { standingYear, units, current: standingYear + units, cut, extra, net: cut - extra, breakEven }
}

function calculate(elec: Fuel, gas: Fuel, hasGas: boolean) {
  const e = fuelResult(elec)
  const g = hasGas ? fuelResult(gas) : null
  const annualStanding = e.standingYear + (g ? g.standingYear : 0)
  const currentBill = e.current + (g ? g.current : 0)
  const net = e.net + (g ? g.net : 0)
  return {
    e, g, annualStanding, monthlyStanding: annualStanding / 12,
    dailyTotal: elec.standing + (hasGas ? gas.standing : 0),
    currentBill, newBill: currentBill - net, net,
  }
}

function num(v: string) {
  return Math.max(0, parseFloat(v.replace(/,/g, '')) || 0)
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

function Field({ id, label, value, onChange, step = '0.01' }: { id: string; label: string; value: string; onChange: (v: string) => void; step?: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">{label}</label>
      <input id={id} type="number" min="0" step={step} value={value} onChange={(ev) => onChange(ev.target.value)} className={inputClass} />
    </div>
  )
}

function kwhText(n: number) {
  return Number.isFinite(n) ? `${Math.round(n).toLocaleString('en-GB')} kWh` : 'any usage'
}

export default function StandingChargeSavingsCalculator() {
  const [elec, setElec] = useState(DEFAULT_ELEC_STANDING.toString())
  const [gas, setGas] = useState(DEFAULT_GAS_STANDING.toString())
  const [elecRate, setElecRate] = useState(DEFAULT_ELEC_RATE.toString())
  const [gasRate, setGasRate] = useState(DEFAULT_GAS_RATE.toString())
  const [elecKwh, setElecKwh] = useState(DEFAULT_ELEC_KWH.toString())
  const [gasKwh, setGasKwh] = useState(DEFAULT_GAS_KWH.toString())
  const [elecCut, setElecCut] = useState(DEFAULT_CUT_PER_FUEL.toString())
  const [gasCut, setGasCut] = useState(DEFAULT_CUT_PER_FUEL.toString())
  const [elecPremium, setElecPremium] = useState(DEFAULT_ELEC_PREMIUM.toString())
  const [gasPremium, setGasPremium] = useState(DEFAULT_GAS_PREMIUM.toString())
  const [hasGas, setHasGas] = useState(true)

  const result = useMemo(() => calculate(
    { standing: num(elec), rate: num(elecRate), kwh: num(elecKwh), cut: num(elecCut), premium: num(elecPremium) },
    { standing: num(gas), rate: num(gasRate), kwh: num(gasKwh), cut: num(gasCut), premium: num(gasPremium) },
    hasGas,
  ), [elec, gas, elecRate, gasRate, elecKwh, gasKwh, elecCut, gasCut, elecPremium, gasPremium, hasGas])

  const saves = result.net > 0.005
  const costs = result.net < -0.005

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold mb-3">Your current tariff and usage</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field id="sc-elec" label="Electricity standing charge (p/day)" value={elec} onChange={setElec} />
          <Field id="sc-elec-rate" label="Electricity unit rate (p/kWh)" value={elecRate} onChange={setElecRate} />
          <Field id="sc-elec-kwh" label="Electricity use (kWh/year)" value={elecKwh} onChange={setElecKwh} step="100" />
          {hasGas && <>
            <Field id="sc-gas" label="Gas standing charge (p/day)" value={gas} onChange={setGas} />
            <Field id="sc-gas-rate" label="Gas unit rate (p/kWh)" value={gasRate} onChange={setGasRate} />
            <Field id="sc-gas-kwh" label="Gas use (kWh/year)" value={gasKwh} onChange={setGasKwh} step="100" />
          </>}
        </div>
        <label className="flex items-center gap-3 cursor-pointer mt-3"><input type="checkbox" checked={hasGas} onChange={(ev) => setHasGas(ev.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">I have gas supply</span></label>
      </div>

      <div>
        <p className="text-sm font-semibold mb-3">Lower standing charge tariff</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id="sc-elec-cut" label="Electricity standing charge cut (£/year)" value={elecCut} onChange={setElecCut} step="1" />
          <Field id="sc-elec-prem" label="Extra on electricity unit rate (p/kWh)" value={elecPremium} onChange={setElecPremium} step="0.1" />
          {hasGas && <>
            <Field id="sc-gas-cut" label="Gas standing charge cut (£/year)" value={gasCut} onChange={setGasCut} step="1" />
            <Field id="sc-gas-prem" label="Extra on gas unit rate (p/kWh)" value={gasPremium} onChange={setGasPremium} step="0.1" />
          </>}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Defaults follow the Ofgem pilot (about £150 a year off for dual fuel) and E.ON&apos;s pilot unit rates (about +3.5p electricity, +1p gas). Set the cut to your whole standing charge to model a zero standing charge tariff.</p>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-muted/50 p-6 text-center">
          <p className="text-sm text-muted-foreground">Annual Standing Charges</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(result.annualStanding)}</p>
          <p className="text-sm text-muted-foreground mt-1">{result.dailyTotal.toFixed(2)}p a day, {formatCurrency(result.monthlyStanding)}/month, paid even with zero usage</p>
        </div>
        <div className={`rounded-xl p-4 text-center ${saves ? 'bg-green-100 dark:bg-green-950' : 'bg-muted/50'}`}>
          <p className="text-sm text-muted-foreground">Lower standing charge tariff at your usage</p>
          <p className={`text-xl font-bold ${saves ? 'text-green-700 dark:text-green-400' : ''}`}>
            {saves ? `Saves ${formatCurrency(result.net)}/year` : costs ? `Costs ${formatCurrency(-result.net)}/year more` : 'Costs the same'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Bill {formatCurrency(result.currentBill)} now, {formatCurrency(result.newBill)} on the lower standing charge tariff</p>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground"></th><th className="text-right py-2 font-medium text-muted-foreground">Electricity</th>{result.g && <th className="text-right py-2 font-medium text-muted-foreground">Gas</th>}</tr></thead>
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2">Standing charge now</td><td className="text-right tabular-nums">{formatCurrency(result.e.standingYear)}</td>{result.g && <td className="text-right tabular-nums">{formatCurrency(result.g.standingYear)}</td>}</tr>
            <tr className="border-b border-border/50"><td className="py-2">Standing charge cut</td><td className="text-right tabular-nums">−{formatCurrency(result.e.cut)}</td>{result.g && <td className="text-right tabular-nums">−{formatCurrency(result.g.cut)}</td>}</tr>
            <tr className="border-b border-border/50"><td className="py-2">Extra unit costs</td><td className="text-right tabular-nums">+{formatCurrency(result.e.extra)}</td>{result.g && <td className="text-right tabular-nums">+{formatCurrency(result.g.extra)}</td>}</tr>
            <tr className="border-b border-border/50 font-medium"><td className="py-2">Net effect</td><td className="text-right tabular-nums">{result.e.net >= 0 ? 'saves ' : 'costs '}{formatCurrency(Math.abs(result.e.net))}</td>{result.g && <td className="text-right tabular-nums">{result.g.net >= 0 ? 'saves ' : 'costs '}{formatCurrency(Math.abs(result.g.net))}</td>}</tr>
            <tr className="border-b border-border/50"><td className="py-2 text-muted-foreground">Worth it below</td><td className="text-right tabular-nums text-muted-foreground">{kwhText(result.e.breakEven)}</td>{result.g && <td className="text-right tabular-nums text-muted-foreground">{kwhText(result.g.breakEven)}</td>}</tr>
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground">Default rates are the Ofgem price cap for 1 October to 31 December 2026, GB average by Direct Debit. The 54.83p electricity standing charge carries no VAT from 1 October 2026 to 31 March 2027; the 29.68p gas figure includes 5% VAT. Your own region and tariff can differ, so enter the rates from your bill.</p>
      </div>
    </div>
  )
}
