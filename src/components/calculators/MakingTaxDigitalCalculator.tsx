import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Each phase is decided by one tax year's return: gross self-employment turnover plus gross
// property income (your share of joint lets), before expenses. A later year's income does not
// bring an earlier phase back, so 2025/26 is tested against £30,000, never £50,000.
const PHASES = [
  { year: '2024/25', threshold: 50_000, startYear: 2026 },
  { year: '2025/26', threshold: 30_000, startYear: 2027 },
  { year: '2026/27', threshold: 20_000, startYear: 2028 },
]

type YearIncome = { selfEmployment: number; rent: number }

function calculate(years: YearIncome[]) {
  const rows = PHASES.map((phase, i) => {
    const total = years[i].selfEmployment + years[i].rent
    return { ...phase, total, over: total > phase.threshold, selfEmployment: years[i].selfEmployment, rent: years[i].rent }
  })
  const phase = rows.find((r) => r.over) ?? null
  // Updates go in for each business, so a trade and a property business mean 8 a year
  const businesses = phase ? (phase.selfEmployment > 0 ? 1 : 0) + (phase.rent > 0 ? 1 : 0) : 0
  return { rows, phase, businesses, updatesPerYear: businesses * 4 }
}

const money = (value: string) => Math.max(0, parseFloat(value.replace(/,/g, '')) || 0)

export default function MakingTaxDigitalCalculator() {
  const [income, setIncome] = useState(PHASES.map(() => ({ selfEmployment: '55000', rent: '0' })))
  const [sameEveryYear, setSameEveryYear] = useState(false)

  const updateIncome = (i: number, field: 'selfEmployment' | 'rent', value: string) => setIncome(income.map((row, idx) => idx === i ? { ...row, [field]: value } : row))

  const years = PHASES.map((_, i) => {
    const row = income[sameEveryYear ? 0 : i]
    return { selfEmployment: money(row.selfEmployment), rent: money(row.rent) }
  })
  const key = years.map((y) => `${y.selfEmployment}|${y.rent}`).join(',')
  const result = useMemo(() => calculate(years), [key])
  const { phase } = result

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {PHASES.slice(0, sameEveryYear ? 1 : 3).map((p, i) => (
          <div key={p.year}>
            <p className="text-sm font-semibold mb-2">{sameEveryYear ? 'All three tax years' : `Tax year ${p.year}`}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-2">Self-employment turnover, before expenses</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income[i].selfEmployment} onChange={(e) => updateIncome(i, 'selfEmployment', e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label={`Self-employment turnover ${sameEveryYear ? 'all years' : p.year}`} /></div></div>
              <div><label className="block text-sm font-medium mb-2">Gross rent, your share, before expenses</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income[i].rent} onChange={(e) => updateIncome(i, 'rent', e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label={`Gross rent ${sameEveryYear ? 'all years' : p.year}`} /></div></div>
            </div>
          </div>
        ))}
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={sameEveryYear} onChange={(e) => setSameEveryYear(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Shortcut: use the same figures for all three tax years</span></label>
        {sameEveryYear && <p className="text-sm text-muted-foreground">This assumes your income has not changed. Each phase depends on one tax year's return, so enter the years separately if it has.</p>}
        <p className="text-sm text-muted-foreground">Count sole trader and property income only. Your share of a partnership's profit, employment pay, pensions and dividends do not count. For 2026/27, which has not ended yet, use your best estimate.</p>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className={`rounded-2xl p-6 text-center ${phase ? (phase.startYear === 2026 ? 'bg-orange-100 dark:bg-orange-950' : 'bg-yellow-100 dark:bg-yellow-950') : 'bg-green-100 dark:bg-green-950'}`}>
          {phase ? (
            <><p className={`text-lg font-bold ${phase.startYear === 2026 ? 'text-orange-700 dark:text-orange-400' : 'text-yellow-700 dark:text-yellow-400'}`}>MTD for Income Tax applies from 6 April {phase.startYear}</p><p className="text-sm text-muted-foreground mt-1">{phase.year} qualifying income of {formatCurrency(phase.total)} is over the £{phase.threshold.toLocaleString()} threshold for that year</p></>
          ) : (
            <><p className="text-lg font-bold text-green-700 dark:text-green-400">Not required on these figures</p><p className="text-sm text-muted-foreground mt-1">None of the three tax years is over its threshold, and no start date has been set for qualifying income of £20,000 or less</p></>
          )}
        </div>

        <table className="w-full text-sm">
          <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Tax year's return</th><th className="text-right py-2 font-medium text-muted-foreground">Qualifying income</th><th className="text-right py-2 font-medium text-muted-foreground">Must be over</th><th className="text-right py-2 font-medium text-muted-foreground">Start date if so</th></tr></thead>
          <tbody>{result.rows.map((r) => (
            <tr key={r.year} className="border-b border-border/50"><td className="py-1.5">{r.year}</td><td className={`text-right tabular-nums ${r.over ? 'font-medium' : ''}`}>{formatCurrency(r.total)}</td><td className="text-right tabular-nums">£{r.threshold.toLocaleString()}</td><td className="text-right">6 April {r.startYear}</td></tr>
          ))}</tbody>
        </table>
        <p className="text-sm text-muted-foreground">Only that tax year's return decides each phase. HMRC checks the return and writes to you, but it is still your responsibility to check if no letter comes. You also need to be registered for Self Assessment and to have submitted a return.</p>

        {phase && (
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">What MTD means for you:</p>
            <p>• Keep digital records of your self-employment and property income and expenses in compatible software: the amount, date and category of each. HMRC's software finder lists recognised products, and some free products are available with limits</p>
            <p>• Send {result.updatesPerYear} quarterly updates a year: 4 for each business, and these figures show {result.businesses === 1 ? '1 business' : '2 businesses'}. A second trade, or a foreign property business, adds 4 more. Each update gives totals by category for the tax year so far</p>
            <p>• First quarterly update due by 7 August {phase.startYear}, and your first tax return through software due by 31 January {phase.startYear + 2}</p>
            <p>• You still submit one tax return a year and pay by 31 January. The return for the tax year before you start is filed the usual way</p>
            {phase.startYear === 2026 && <p>• HMRC will not apply penalty points for late quarterly updates in 2026/27, but the updates must still be sent before you can submit your tax return, and points still apply to a late return</p>}
            {phase.startYear === 2027 && <p>• April 2027 joiners get no penalty points for late submission of their first four quarterly updates in 2027/28 (announced at Budget 2026), but the updates must still be sent before the tax return can be filed</p>}
            {phase.startYear === 2028 && <p>• A late quarterly update earns a penalty point and 4 points bring a £200 penalty. The Budget 2026 easement covers April 2027 joiners only</p>}
            <p>• You may be exempt, for example if you are digitally excluded, which you have to apply for. Rollout is deferred until further notice for people eligible for qualifying care relief, non-UK resident foreign entertainers and sportspeople, and expected non-resident customers</p>
          </div>
        )}
      </div>
    </div>
  )
}
