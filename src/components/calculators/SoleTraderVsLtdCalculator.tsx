import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(profit: number) {
  // SOLE TRADER
  let stPA = 12_570
  if (profit > 100_000) stPA = Math.max(0, 12_570 - Math.floor((profit - 100_000) / 2))
  let stTax = 0
  if (profit > stPA) {
    if (profit <= 50_270) stTax = (profit - stPA) * 0.20
    else if (profit <= 125_140) stTax = (50_270 - stPA) * 0.20 + (profit - 50_270) * 0.40
    else stTax = (50_270 - stPA) * 0.20 + (125_140 - 50_270) * 0.40 + (profit - 125_140) * 0.45
  }
  let stClass4 = 0
  if (profit > 12_570) { if (profit <= 50_270) stClass4 = (profit - 12_570) * 0.06; else stClass4 = (50_270 - 12_570) * 0.06 + (profit - 50_270) * 0.02 }
  const stClass2 = profit >= 12_570 ? 3.50 * 52 : 0
  const stTotal = stTax + stClass4 + stClass2
  const stTakeHome = profit - stTotal

  // LIMITED COMPANY (optimal salary £12,570 + dividends)
  const ltdSalary = 12_570
  const ltdEmployerNI = Math.max(0, (ltdSalary - 5_000) * 0.15)
  const ltdCorpProfit = profit - ltdSalary - ltdEmployerNI
  const ltdCorpTax = ltdCorpProfit <= 50_000 ? ltdCorpProfit * 0.19 : ltdCorpProfit <= 250_000 ? ltdCorpProfit * 0.25 - (250_000 - ltdCorpProfit) * 3/200 : ltdCorpProfit * 0.25
  const ltdDividends = ltdCorpProfit - ltdCorpTax
  // Dividend tax stacks on top of the £12,570 salary (which uses the full Personal Allowance),
  // across the £500 allowance then the 10.75% / 35.75% / 39.35% bands.
  const DIV_ALLOWANCE = 500
  const taxableDiv = Math.max(0, ltdDividends - DIV_ALLOWANCE)
  const basicBandForDiv = Math.max(0, 50_270 - ltdSalary - DIV_ALLOWANCE) // basic-rate room left after salary + allowance
  const higherBandForDiv = 125_140 - 50_270
  const divInBasic = Math.min(taxableDiv, basicBandForDiv)
  const divInHigher = Math.min(Math.max(0, taxableDiv - basicBandForDiv), higherBandForDiv)
  const divInAdditional = Math.max(0, taxableDiv - basicBandForDiv - higherBandForDiv)
  const ltdDivTax = divInBasic * 0.1075 + divInHigher * 0.3575 + divInAdditional * 0.3935
  const ltdAccountancy = 1200
  const ltdTotal = ltdCorpTax + ltdDivTax + ltdEmployerNI + ltdAccountancy
  const ltdTakeHome = profit - ltdTotal

  const saving = ltdTakeHome - stTakeHome
  const ltdBetter = saving > 0

  return { stTax, stClass4, stClass2, stTotal, stTakeHome, ltdSalary, ltdEmployerNI, ltdCorpTax, ltdDividends, ltdDivTax, ltdAccountancy, ltdTotal, ltdTakeHome, saving, ltdBetter }
}

export default function SoleTraderVsLtdCalculator() {
  const [profit, setProfit] = useState('')

  const p = parseFloat(profit.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(p), [p])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Annual Profit / Revenue (before tax)</label>
        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <input type="text" inputMode="numeric" value={profit} onChange={(e) => setProfit(e.target.value)} placeholder="50,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Profit / Revenue (before tax)" /></div>
        <div className="flex flex-wrap gap-2 mt-3">{[30_000, 50_000, 75_000, 100_000].map(a => <button key={a} onClick={() => setProfit(a.toLocaleString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">£{a/1000}K</button>)}</div>
      </div>

      {p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-2xl p-5 text-center ${!result.ltdBetter ? 'bg-green-100 dark:bg-green-950 border-2 border-green-300 dark:border-green-800' : 'border border-border'}`}>
              <p className="text-sm font-medium">Sole Trader</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(result.stTakeHome)}</p>
              <p className="text-xs text-muted-foreground">Tax: {formatCurrency(result.stTotal)}</p>
              {!result.ltdBetter && <span className="inline-block mt-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Better</span>}
            </div>
            <div className={`rounded-2xl p-5 text-center ${result.ltdBetter ? 'bg-green-100 dark:bg-green-950 border-2 border-green-300 dark:border-green-800' : 'border border-border'}`}>
              <p className="text-sm font-medium">Limited Company</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(result.ltdTakeHome)}</p>
              <p className="text-xs text-muted-foreground">Tax + costs: {formatCurrency(result.ltdTotal)}</p>
              {result.ltdBetter && <span className="inline-block mt-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Better by {formatCurrency(result.saving)}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-border p-4 space-y-1">
              <p className="font-semibold mb-2">Sole Trader Breakdown</p>
              <p>Income Tax: <span className="float-right">{formatCurrency(result.stTax)}</span></p>
              <p>Class 4 NI: <span className="float-right">{formatCurrency(result.stClass4)}</span></p>
              <p>Class 2 NI: <span className="float-right">{formatCurrency(result.stClass2)}</span></p>
            </div>
            <div className="rounded-xl border border-border p-4 space-y-1">
              <p className="font-semibold mb-2">Ltd Company Breakdown</p>
              <p>Corp Tax: <span className="float-right">{formatCurrency(result.ltdCorpTax)}</span></p>
              <p>Dividend Tax: <span className="float-right">{formatCurrency(result.ltdDivTax)}</span></p>
              <p>Employer NI: <span className="float-right">{formatCurrency(result.ltdEmployerNI)}</span></p>
              <p>Accountancy: <span className="float-right">{formatCurrency(result.ltdAccountancy)}</span></p>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Ltd assumes: £12,570 salary + dividends, ~£1,200 accountancy. Below ~£35K profit, sole trader is usually simpler and cheaper. Above ~£40-50K, Ltd often saves tax. Consider IR35, admin burden and mortgage implications.</p>
          </div>
        </div>
      )}
    </div>
  )
}
