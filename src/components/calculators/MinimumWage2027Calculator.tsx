import { useMemo } from 'react'
import { formatCurrency, ukIncomeTax } from '@/utils'
import ShareRow, { useUrlParam } from '@/components/ShareRow'
import {
  NMW_RATES,
  NMW_TAX_YEAR,
  NMW_EFFECTIVE_FROM,
  NMW_2027_EFFECTIVE_FROM,
  LPC_APRIL_2027,
  BUDGET_2026,
  nlwRisePct,
  type NmwBand,
} from '@/data/minimum-wage'

// Employee Class 1 NI for 2026/27, the same figures as NationalInsuranceCalculator.tsx.
// Income tax and NI thresholds are frozen to April 2031 (Budget 2025), so 2027/28 uses
// the same values unless the Budget on 28 October 2026 changes them.
const NI_PRIMARY_THRESHOLD = 12_570
const NI_UPPER_EARNINGS_LIMIT = 50_270
const NI_MAIN_RATE = 0.08
const NI_ADDITIONAL_RATE = 0.02
// Employer secondary Class 1 (EmployerNICalculator.tsx). Employees under 21 and
// apprentices under 25 attract 0% up to the upper secondary threshold (gov.uk, rates and
// thresholds for employers 2026 to 2027).
const SECONDARY_THRESHOLD = 5_000
const EMPLOYER_NI_RATE = 0.15
const UPPER_SECONDARY_THRESHOLD = 50_270

type Scenario = 'central' | 'low' | 'high' | 'custom'

const SCENARIOS: { v: Scenario; l: string }[] = [
  { v: 'central', l: `LPC central estimate £${LPC_APRIL_2027.central.toFixed(2)} (+${nlwRisePct(LPC_APRIL_2027.central).toFixed(1)}%)` },
  { v: 'low', l: `LPC low £${LPC_APRIL_2027.low.toFixed(2)} (+${nlwRisePct(LPC_APRIL_2027.low).toFixed(1)}%)` },
  { v: 'high', l: `LPC high £${LPC_APRIL_2027.high.toFixed(2)} (+${nlwRisePct(LPC_APRIL_2027.high).toFixed(1)}%)` },
  { v: 'custom', l: 'Custom hourly rate' },
]

const round2 = (v: number) => Math.round(v * 100) / 100
const parseMoney = (s: string) => parseFloat(s.replace(/[£,\s]/g, '')) || 0

function employeeNi(gross: number) {
  if (gross <= NI_PRIMARY_THRESHOLD) return 0
  const main = Math.min(gross, NI_UPPER_EARNINGS_LIMIT) - NI_PRIMARY_THRESHOLD
  const additional = Math.max(0, gross - NI_UPPER_EARNINGS_LIMIT)
  return main * NI_MAIN_RATE + additional * NI_ADDITIONAL_RATE
}

// Under-21s (categories M) and apprentices under 25 (category H) carry no employer NI up to
// the upper secondary threshold; the apprentice band here assumes an apprentice under 25.
function employerNi(gross: number, band: NmwBand) {
  const threshold = band === '21plus' ? SECONDARY_THRESHOLD : UPPER_SECONDARY_THRESHOLD
  return Math.max(0, gross - threshold) * EMPLOYER_NI_RATE
}

function pack(rate: number, hours: number, weeks: number, band: NmwBand) {
  const weekly = rate * hours
  const annual = weekly * weeks
  const tax = ukIncomeTax(annual)
  const ni = employeeNi(annual)
  const takeHome = annual - tax - ni
  const erNi = employerNi(annual, band)
  return { rate, weekly, monthly: annual / 12, annual, tax, ni, takeHome, takeHomeMonthly: takeHome / 12, erNi, employerCost: annual + erNi }
}

export default function MinimumWage2027Calculator() {
  const [bandParam, setBand] = useUrlParam('band', '21plus')
  const band: NmwBand = (bandParam in NMW_RATES ? bandParam : '21plus') as NmwBand
  const [hours, setHours] = useUrlParam('hours', '37.5')
  const [weeks, setWeeks] = useUrlParam('weeks', '52')
  const [rateNow, setRateNow] = useUrlParam('rate', '')
  const [scenarioParam, setScenario] = useUrlParam('scenario', 'central')
  const scenario: Scenario = (SCENARIOS.some((s) => s.v === scenarioParam) ? scenarioParam : 'central') as Scenario
  const [rate27, setRate27] = useUrlParam('rate27', '')
  const [employerParam, setEmployer] = useUrlParam('employer', '0')
  const employer = employerParam === '1'

  const h = Math.min(80, Math.max(0, parseFloat(hours) || 0))
  const w = Math.min(52, Math.max(1, parseFloat(weeks) || 52))
  const bandRate = NMW_RATES[band].rate
  const currentRate = parseMoney(rateNow) || bandRate

  const result = useMemo(() => {
    const nlwScenario = scenario === 'low' ? LPC_APRIL_2027.low : scenario === 'high' ? LPC_APRIL_2027.high : LPC_APRIL_2027.central
    const factor = nlwScenario / NMW_RATES['21plus'].rate
    // The LPC only projects the 21+ rate; younger bands get the same percentage as a stated assumption
    const projectedFloor = band === '21plus' ? nlwScenario : round2(bandRate * factor)
    const custom = parseMoney(rate27)
    const newRate = scenario === 'custom' ? (custom || currentRate) : Math.max(currentRate, projectedFloor)
    const now = pack(currentRate, h, w, band)
    const next = pack(newRate, h, w, band)
    return {
      projectedFloor,
      newRate,
      aboveFloor: scenario !== 'custom' && currentRate > projectedFloor,
      now,
      next,
      risePct: currentRate > 0 ? ((newRate / currentRate) - 1) * 100 : 0,
    }
  }, [scenario, band, bandRate, rate27, currentRate, h, w])

  const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'
  const diff = (a: number, b: number) => {
    const d = b - a
    return <span className={d > 0 ? 'text-green-700 dark:text-green-400' : d < 0 ? 'text-destructive' : ''}>{d > 0 ? '+' : ''}{formatCurrency(d)}</span>
  }

  const rows: { label: string; now: number; next: number; strong?: boolean }[] = [
    { label: 'Hourly rate', now: result.now.rate, next: result.next.rate, strong: true },
    { label: `Weekly pay (${h} hours)`, now: result.now.weekly, next: result.next.weekly },
    { label: 'Monthly pay', now: result.now.monthly, next: result.next.monthly },
    { label: `Annual pay (${w} weeks)`, now: result.now.annual, next: result.next.annual, strong: true },
    { label: 'Income tax', now: -result.now.tax, next: -result.next.tax },
    { label: 'Employee National Insurance', now: -result.now.ni, next: -result.next.ni },
    { label: 'Take-home pay a year', now: result.now.takeHome, next: result.next.takeHome, strong: true },
    { label: 'Take-home pay a month', now: result.now.takeHomeMonthly, next: result.next.takeHomeMonthly },
  ]
  if (employer) {
    rows.push(
      { label: `Employer NI (15% above ${formatCurrency(band === '21plus' ? SECONDARY_THRESHOLD : UPPER_SECONDARY_THRESHOLD)})`, now: result.now.erNi, next: result.next.erNi },
      { label: 'Total employer cost a year', now: result.now.employerCost, next: result.next.employerCost, strong: true },
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40 p-4 text-sm">
        <p className="font-semibold text-amber-900 dark:text-amber-200">Status: projection until the Budget on {BUDGET_2026.date}</p>
        <p className="mt-1 text-amber-900/90 dark:text-amber-100/90">
          The rates from {NMW_2027_EFFECTIVE_FROM} are not yet set. The Low Pay Commission's indicative range for the National Living Wage, published {LPC_APRIL_2027.published}, is £{LPC_APRIL_2027.low.toFixed(2)} to £{LPC_APRIL_2027.high.toFixed(2)} with a central estimate of £{LPC_APRIL_2027.central.toFixed(2)}. It recommends by {LPC_APRIL_2027.recommendationDue} and the government confirms the rates, expected at the Budget. No estimate exists for the 18 to 20, under 18 and apprentice rates, so this page applies the same percentage to them as a working assumption.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="mw27-band" className="block text-sm font-medium mb-2">Age band</label>
          <select id="mw27-band" value={band} onChange={(e) => setBand(e.target.value)} className={inputClass} aria-label="Age band">
            {(Object.keys(NMW_RATES) as NmwBand[]).map((k) => <option key={k} value={k}>{NMW_RATES[k].name} (£{NMW_RATES[k].rate.toFixed(2)} now)</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="mw27-hours" className="block text-sm font-medium mb-2">Hours a week</label>
          <input id="mw27-hours" type="number" min="1" max="80" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className={inputClass} aria-label="Hours a week" />
        </div>
        <div>
          <label htmlFor="mw27-weeks" className="block text-sm font-medium mb-2">Paid weeks a year</label>
          <input id="mw27-weeks" type="number" min="1" max="52" step="1" value={weeks} onChange={(e) => setWeeks(e.target.value)} className={inputClass} aria-label="Paid weeks a year" />
        </div>
        <div>
          <label htmlFor="mw27-rate" className="block text-sm font-medium mb-2">Current hourly rate <span className="text-muted-foreground font-normal">(blank = the {NMW_TAX_YEAR} minimum)</span></label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input id="mw27-rate" type="text" inputMode="decimal" placeholder={bandRate.toFixed(2)} value={rateNow} onChange={(e) => setRateNow(e.target.value)} className={`${inputClass} pl-8`} aria-label="Current hourly rate" />
          </div>
        </div>
        <div>
          <label htmlFor="mw27-scenario" className="block text-sm font-medium mb-2">Rate from {NMW_2027_EFFECTIVE_FROM}</label>
          <select id="mw27-scenario" value={scenario} onChange={(e) => setScenario(e.target.value)} className={inputClass} aria-label="April 2027 rate scenario">
            {SCENARIOS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
          </select>
        </div>
        {scenario === 'custom' ? (
          <div>
            <label htmlFor="mw27-rate27" className="block text-sm font-medium mb-2">Your projected hourly rate</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
              <input id="mw27-rate27" type="text" inputMode="decimal" placeholder={result.projectedFloor.toFixed(2)} value={rate27} onChange={(e) => setRate27(e.target.value)} className={`${inputClass} pl-8`} aria-label="Projected hourly rate from April 2027" />
            </div>
          </div>
        ) : (
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm font-medium pb-3 cursor-pointer">
              <input type="checkbox" checked={employer} onChange={(e) => setEmployer(e.target.checked ? '1' : '0')} className="h-4 w-4 rounded border-input" aria-label="Show the employer view" />
              Show employer cost (employer NI)
            </label>
          </div>
        )}
        {scenario === 'custom' && (
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm font-medium pb-3 cursor-pointer">
              <input type="checkbox" checked={employer} onChange={(e) => setEmployer(e.target.checked ? '1' : '0')} className="h-4 w-4 rounded border-input" aria-label="Show the employer view" />
              Show employer cost (employer NI)
            </label>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
        <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Now ({NMW_TAX_YEAR})</p><p className="text-xl font-bold">£{result.now.rate.toFixed(2)}</p></div>
        <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">From {NMW_2027_EFFECTIVE_FROM}</p><p className="text-xl font-bold text-primary">£{result.next.rate.toFixed(2)}</p></div>
        <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Rise per hour</p><p className="text-xl font-bold">{result.next.rate - result.now.rate >= 0 ? '+' : ''}£{(result.next.rate - result.now.rate).toFixed(2)} <span className="text-sm font-normal text-muted-foreground">({result.risePct >= 0 ? '+' : ''}{result.risePct.toFixed(1)}%)</span></p></div>
        <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Extra take-home a month</p><p className="text-xl font-bold">{diff(result.now.takeHomeMonthly, result.next.takeHomeMonthly)}</p></div>
      </div>

      {result.aboveFloor && (
        <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
          Your current £{currentRate.toFixed(2)} is already above the projected minimum of £{result.projectedFloor.toFixed(2)} for this band, so the statutory rise would not change your pay. Choose the custom rate to model a pay rise of your own.
        </div>
      )}

      <div className="rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 text-left">
              <th className="p-3 font-medium">Figure</th>
              <th className="p-3 font-medium text-right">Now ({NMW_TAX_YEAR})</th>
              <th className="p-3 font-medium text-right">From {NMW_2027_EFFECTIVE_FROM}</th>
              <th className="p-3 font-medium text-right">Change</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className={`border-t border-border/50 ${r.strong ? 'font-semibold' : ''}`}>
                <td className="p-3">{r.label}</td>
                <td className="p-3 text-right tabular-nums">{r.label === 'Hourly rate' ? `£${r.now.toFixed(2)}` : formatCurrency(r.now)}</td>
                <td className="p-3 text-right tabular-nums">{r.label === 'Hourly rate' ? `£${r.next.toFixed(2)}` : formatCurrency(r.next)}</td>
                <td className="p-3 text-right tabular-nums">{diff(r.now, r.next)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ShareRow params={{ band, hours, weeks, rate: rateNow, scenario, rate27, employer: employer ? '1' : '0' }} />

      <p className="text-xs text-muted-foreground">
        Tax and National Insurance use the {NMW_TAX_YEAR} rules for England, Wales and Northern Ireland: a £{NI_PRIMARY_THRESHOLD.toLocaleString('en-GB')} Personal Allowance, 20% basic rate, and employee NI at 8% between £{NI_PRIMARY_THRESHOLD.toLocaleString('en-GB')} and £{NI_UPPER_EARNINGS_LIMIT.toLocaleString('en-GB')}. Those thresholds are frozen to April 2031, so the 2027/28 column uses the same figures. Pension contributions, student loan repayments and Scottish income tax rates are not included. Current minimum rates apply from {NMW_EFFECTIVE_FROM}.
      </p>
    </div>
  )
}
