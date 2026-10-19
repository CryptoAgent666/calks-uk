import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const LUMP_SUM_ALLOWANCE = 268_275 // cap on tax-free cash (25% of the pot up to this)
const ISA_ALLOWANCE = 20_000 // per tax year, across all ISAs
const ANNUAL_ALLOWANCE = 60_000 // gross pension input per tax year, employer contributions included

type Region = 'ruk' | 'scotland'

// Relief rate for each band. Relief at source adds 20% to every contribution; the
// rest of a higher, additional or Scottish intermediate/higher/advanced/top rate is
// claimed back through Self Assessment. Scottish starter-rate (19%) taxpayers still
// get the full 20% at source.
const BANDS: Record<Region, { value: string; label: string; relief: number }[]> = {
  ruk: [
    { value: 'basic', label: 'Basic (20%)', relief: 0.20 },
    { value: 'higher', label: 'Higher (40%)', relief: 0.40 },
    { value: 'additional', label: 'Additional (45%)', relief: 0.45 },
  ],
  scotland: [
    { value: 'starter', label: 'Starter (19%, relief paid at 20%)', relief: 0.20 },
    { value: 'basic', label: 'Basic (20%)', relief: 0.20 },
    { value: 'intermediate', label: 'Intermediate (21%)', relief: 0.21 },
    { value: 'higher', label: 'Higher (42%)', relief: 0.42 },
    { value: 'advanced', label: 'Advanced (45%)', relief: 0.45 },
    { value: 'top', label: 'Top (48%)', relief: 0.48 },
  ],
}

function calculate(monthlyNet: number, years: number, growthRate: number, reliefRate: number, retirementTaxRate: number) {
  // Effective monthly rate equivalent to the annual growth rate.
  const monthlyGrowth = Math.pow(1 + growthRate / 100, 1 / 12) - 1

  // Equal net cost: both wrappers cost you the same each month. In the pension that
  // buys a gross contribution of net / (1 - relief rate), which assumes any relief
  // above 20% claimed through Self Assessment is paid back into the pension.
  const pensionMonthly = monthlyNet / (1 - reliefRate)

  let pensionPot = 0
  let isaPot = 0
  for (let m = 0; m < years * 12; m++) {
    pensionPot = pensionPot * (1 + monthlyGrowth) + pensionMonthly
    isaPot = isaPot * (1 + monthlyGrowth) + monthlyNet
  }

  // Pension: 25% tax-free up to the Lump Sum Allowance, the rest taxed at the
  // retirement rate entered.
  const pensionLumpSum = Math.min(pensionPot * 0.25, LUMP_SUM_ALLOWANCE)
  const pensionTax = (pensionPot - pensionLumpSum) * retirementTaxRate
  const pensionNet = pensionPot - pensionTax

  // ISA: no tax on growth or withdrawal.
  const isaNet = isaPot

  return {
    pensionMonthly,
    pensionAnnualGross: pensionMonthly * 12,
    reliefMonthly: pensionMonthly - monthlyNet,
    pensionPot,
    pensionLumpSum,
    pensionTax,
    pensionNet,
    isaPot,
    isaNet,
    pensionAdvantage: pensionNet - isaNet,
  }
}

export default function PensionVsIsaCalculator() {
  const [amount, setAmount] = useState('500')
  const [years, setYears] = useState('20')
  const [growth, setGrowth] = useState('5')
  const [region, setRegion] = useState<Region>('ruk')
  const [band, setBand] = useState('basic')
  const [retirementRate, setRetirementRate] = useState('20')

  const bands = BANDS[region]
  const bandDef = bands.find((b) => b.value === band) ?? bands[0]

  const a = Math.max(0, parseFloat(amount.replace(/,/g, '')) || 0)
  const y = Math.max(0, parseInt(years) || 0)
  const g = Math.max(0, parseFloat(growth) || 0)
  const rt = Math.min(60, Math.max(0, parseFloat(retirementRate) || 0)) / 100
  const result = useMemo(() => calculate(a, y, g, bandDef.relief, rt), [a, y, g, bandDef.relief, rt])

  const changeRegion = (r: Region) => {
    setRegion(r)
    if (!BANDS[r].some((b) => b.value === band)) setBand('basic')
  }

  const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Monthly Amount (net cost to you)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Monthly Amount (net cost to you)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years</label><input type="number" min="1" max="40" value={years} onChange={(e) => setYears(e.target.value)} className={inputClass} aria-label="Years" /></div>
        <div><label className="block text-sm font-medium mb-2">Growth (% a year)</label><input type="number" min="0" max="12" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className={inputClass} aria-label="Growth (% a year)" /></div>
        <div><label className="block text-sm font-medium mb-2">Where you pay Income Tax</label><select value={region} onChange={(e) => changeRegion(e.target.value as Region)} className={inputClass} aria-label="Where you pay Income Tax"><option value="ruk">England, Wales or NI</option><option value="scotland">Scotland</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Tax Band (now)</label><select value={bandDef.value} onChange={(e) => setBand(e.target.value)} className={inputClass} aria-label="Tax Band (now)">{bands.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Tax rate in retirement (%)</label><input type="number" min="0" max="48" step="1" value={retirementRate} onChange={(e) => setRetirementRate(e.target.value)} className={inputClass} aria-label="Tax rate in retirement (%)" /></div>
      </div>

      {a > 0 && y > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-2xl p-6 text-center ${result.pensionAdvantage > 0 ? 'bg-green-100 dark:bg-green-950 border-2 border-green-300 dark:border-green-800' : 'border border-border'}`}>
              <p className="text-sm font-medium">Pension (after tax)</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(result.pensionNet)}</p>
              <p className="text-xs text-muted-foreground mt-1">Pot: {formatCurrency(result.pensionPot)}</p>
              {result.pensionAdvantage > 0 && <span className="inline-block mt-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Better by {formatCurrency(result.pensionAdvantage)}</span>}
            </div>
            <div className={`rounded-2xl p-6 text-center ${result.pensionAdvantage <= 0 ? 'bg-green-100 dark:bg-green-950 border-2 border-green-300 dark:border-green-800' : 'border border-border'}`}>
              <p className="text-sm font-medium">ISA</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(result.isaNet)}</p>
              <p className="text-xs text-muted-foreground mt-1">All tax-free</p>
              {result.pensionAdvantage <= 0 && <span className="inline-block mt-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Better by {formatCurrency(-result.pensionAdvantage)}</span>}
            </div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm space-y-1">
            <p>Gross pension contribution: <strong>{formatCurrency(result.pensionMonthly)}</strong> a month ({formatCurrency(a)} from you plus {formatCurrency(result.reliefMonthly)} of tax relief at {Math.round(bandDef.relief * 100)}%).</p>
            <p>Tax-free lump sum: {formatCurrency(result.pensionLumpSum)}. Tax on the rest at {Math.round(rt * 100)}%: {formatCurrency(result.pensionTax)}.</p>
          </div>
          {a * 12 > ISA_ALLOWANCE && (
            <div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-4 text-sm">
              <p>{formatCurrency(a * 12)} a year is more than the £20,000 ISA allowance, so the ISA side could not take all of it in one tax year.</p>
            </div>
          )}
          {result.pensionAnnualGross > ANNUAL_ALLOWANCE && (
            <div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-4 text-sm">
              <p>Gross pension contributions of {formatCurrency(result.pensionAnnualGross)} a year are over the £60,000 annual allowance, which also counts employer contributions. Anything above it faces an annual allowance charge.</p>
            </div>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
            <p>Both wrappers cost you the same each month. The pension gets the gross amount that net cost buys at your relief rate, so any relief above 20% claimed through Self Assessment is assumed to be paid back into the pension. Withdrawals: 25% tax-free up to the £268,275 Lump Sum Allowance, the rest taxed at the retirement rate you enter (in practice it depends on your other income and how you draw the pot).</p>
            <p>Relief at your top rate only applies to contributions that fit within the income you pay that rate on, and relief is limited to 100% of your UK earnings. The £60,000 annual allowance tapers for adjusted income over £260,000 and drops to £10,000 (the Money Purchase Annual Allowance) once you have flexibly drawn a pension. Pension usually wins for higher-rate taxpayers who expect to pay basic rate in retirement.</p>
          </div>
        </div>
      )}
    </div>
  )
}
