import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// First Homes national criteria (gov.uk/first-homes-scheme)
const PRICE_CAP = 250_000
const PRICE_CAP_LONDON = 420_000
const INCOME_CAP = 80_000
const INCOME_CAP_LONDON = 90_000
const MIN_MORTGAGE_SHARE = 0.5 // mortgage must cover at least half of the discounted price
const INCOME_MULTIPLE = 4.5 // typical lender limit, not a scheme rule

// SDLT (England and Northern Ireland) from 1 April 2025, charged on the price after the discount
const FTB_NIL_BAND = 300_000
const FTB_MAX_PRICE = 500_000
const STANDARD_BANDS: [number, number][] = [[125_000, 0], [250_000, 0.02], [925_000, 0.05], [1_500_000, 0.1], [Infinity, 0.12]]

function stampDuty(price: number) {
  // First-time buyer relief: 0% to £300,000 and 5% to £500,000; no relief above £500,000
  if (price <= FTB_MAX_PRICE) return Math.max(0, price - FTB_NIL_BAND) * 0.05
  let tax = 0
  let lower = 0
  for (const [upper, rate] of STANDARD_BANDS) {
    if (price > lower) tax += (Math.min(price, upper) - lower) * rate
    lower = upper
  }
  return tax
}

function monthlyPayment(loan: number, ratePct: number, termYears: number) {
  const n = termYears * 12
  const r = ratePct / 100 / 12
  if (loan <= 0 || n <= 0) return 0
  return r > 0 ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n
}

function balanceAfter(loan: number, ratePct: number, termYears: number, years: number) {
  const k = Math.min(years, termYears) * 12
  const r = ratePct / 100 / 12
  const pmt = monthlyPayment(loan, ratePct, termYears)
  if (loan <= 0) return 0
  return r > 0 ? loan * Math.pow(1 + r, k) - pmt * (Math.pow(1 + r, k) - 1) / r : loan - pmt * k
}

function calculate(
  marketValue: number,
  discount: number,
  london: boolean,
  deposit: number,
  salary: number,
  partnerSalary: number,
  ratePct: number,
  termYears: number,
  growthPct: number,
  resaleYears: number,
) {
  const discountedPrice = marketValue * (1 - discount / 100)
  const saving = marketValue - discountedPrice
  const mortgage = Math.max(0, discountedPrice - deposit)
  const householdIncome = salary + partnerSalary
  const priceCap = london ? PRICE_CAP_LONDON : PRICE_CAP
  const incomeCap = london ? INCOME_CAP_LONDON : INCOME_CAP

  const reasons: string[] = []
  if (discountedPrice > priceCap) reasons.push(`The price after the discount, ${formatCurrency(discountedPrice)}, is over the ${formatCurrency(priceCap)} cap${london ? ' for London' : ' (£420,000 in London)'}.`)
  if (householdIncome > incomeCap) reasons.push(`Household income of ${formatCurrency(householdIncome)} is over the ${formatCurrency(incomeCap)} limit${london ? ' for London' : ' (£90,000 in London)'}.`)
  if (mortgage < discountedPrice * MIN_MORTGAGE_SHARE) reasons.push(`The mortgage must cover at least half the price, ${formatCurrency(discountedPrice * MIN_MORTGAGE_SHARE)}, so the deposit can be no more than ${formatCurrency(discountedPrice * (1 - MIN_MORTGAGE_SHARE))}.`)
  const eligible = reasons.length === 0

  const maxBorrow = householdIncome * INCOME_MULTIPLE
  const canAfford = mortgage <= maxBorrow
  const monthly = monthlyPayment(mortgage, ratePct, termYears)
  const sdlt = stampDuty(discountedPrice)

  // Resale: the same percentage discount normally applies to the market value at the time of sale
  const futureMarketValue = marketValue * Math.pow(1 + growthPct / 100, resaleYears)
  const resalePrice = futureMarketValue * (1 - discount / 100)
  const gain = resalePrice - discountedPrice
  const balance = Math.max(0, balanceAfter(mortgage, ratePct, termYears, resaleYears))
  const equityAtResale = resalePrice - balance

  return { discountedPrice, saving, mortgage, householdIncome, priceCap, incomeCap, reasons, eligible, maxBorrow, canAfford, monthly, sdlt, futureMarketValue, resalePrice, gain, balance, equityAtResale }
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'
const moneyInputClass = 'w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function FirstHomesSchemeCalculator() {
  const [value, setValue] = useState('300000')
  const [discount, setDiscount] = useState('30')
  const [london, setLondon] = useState(false)
  const [deposit, setDeposit] = useState('21000')
  const [salary, setSalary] = useState('30000')
  const [partner, setPartner] = useState('25000')
  const [rate, setRate] = useState('5.5')
  const [term, setTerm] = useState('30')
  const [growth, setGrowth] = useState('3')
  const [resaleYears, setResaleYears] = useState('5')

  const v = parseFloat(value.replace(/,/g, '')) || 0
  const d = parseFloat(discount) || 30
  const dp = parseFloat(deposit.replace(/,/g, '')) || 0
  const s = parseFloat(salary.replace(/,/g, '')) || 0
  const ps = parseFloat(partner.replace(/,/g, '')) || 0
  const rt = parseFloat(rate) || 0
  const tm = Math.min(Math.max(parseInt(term) || 0, 0), 40)
  const g = parseFloat(growth) || 0
  const ry = Math.min(Math.max(parseInt(resaleYears) || 0, 0), 40)
  const result = useMemo(() => calculate(v, d, london, dp, s, ps, rt, tm, g, ry), [v, d, london, dp, s, ps, rt, tm, g, ry])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Market value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className={moneyInputClass} aria-label="Market value" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Discount (%)</label><select value={discount} onChange={(e) => setDiscount(e.target.value)} className={inputClass} aria-label="Discount (%)"><option value="30">30% (minimum)</option><option value="40">40%</option><option value="50">50% (maximum)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} className={moneyInputClass} aria-label="Deposit" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Your income (before tax)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className={moneyInputClass} aria-label="Your income before tax" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Joint buyer's income (before tax)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={partner} onChange={(e) => setPartner(e.target.value)} className={moneyInputClass} aria-label="Joint buyer's income before tax" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Mortgage rate (%)</label><input type="number" min="0" max="15" step="0.05" value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass} aria-label="Mortgage rate (%)" /><p className="text-xs text-muted-foreground mt-1">Typical 2026 rate; check lenders.</p></div>
        <div><label className="block text-sm font-medium mb-2">Mortgage term (years)</label><input type="number" min="5" max="40" value={term} onChange={(e) => setTerm(e.target.value)} className={inputClass} aria-label="Mortgage term (years)" /></div>
        <div><label className="block text-sm font-medium mb-2">House price growth (% a year)</label><input type="number" min="-10" max="15" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className={inputClass} aria-label="House price growth (% a year)" /></div>
        <div><label className="block text-sm font-medium mb-2">Sell after (years)</label><input type="number" min="1" max="40" value={resaleYears} onChange={(e) => setResaleYears(e.target.value)} className={inputClass} aria-label="Sell after (years)" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={london} onChange={(e) => setLondon(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label="Home is in London" /><span className="text-sm">Home is in London (£420,000 price cap and £90,000 income limit)</span></label>

      {v > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          {result.eligible ? (
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-sm text-green-800 dark:text-green-300">Meets the national First Homes price, income and mortgage criteria. Councils can set lower price caps and local criteria.</div>
          ) : (
            <div className="rounded-xl bg-destructive/10 p-4 text-sm">
              <p className="font-semibold text-destructive">Not eligible for First Homes</p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">{result.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul>
            </div>
          )}
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Your price ({d}% off)</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.discountedPrice)}</p>
            <p className="text-sm text-muted-foreground mt-1">Saving: {formatCurrency(result.saving)} vs market value</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Mortgage needed</p><p className="text-lg font-bold">{formatCurrency(result.mortgage)}</p></div>
            <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">Monthly payment</p><p className="text-lg font-bold text-primary">{formatCurrency(Math.round(result.monthly * 100) / 100)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Stamp duty (first-time buyer)</p><p className="text-lg font-bold">{formatCurrency(result.sdlt)}</p></div>
            <div className={`rounded-xl p-3 text-center ${result.canAfford ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">{result.canAfford ? 'Within 4.5× income' : 'Over 4.5× income'}</p><p className="text-sm font-bold">Max: {formatCurrency(result.maxBorrow)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm">
            <p className="font-medium mb-2">If you sell after {ry} years at {g}% a year growth</p>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">Market value then</td><td className="text-right tabular-nums">{formatCurrency(Math.round(result.futureMarketValue))}</td></tr>
                <tr className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">First Homes sale price ({d}% off)</td><td className="text-right tabular-nums">{formatCurrency(Math.round(result.resalePrice))}</td></tr>
                <tr className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">Gain on your purchase price</td><td className="text-right tabular-nums">{formatCurrency(Math.round(result.gain))}</td></tr>
                <tr className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">Mortgage still owed</td><td className="text-right tabular-nums">{formatCurrency(Math.round(result.balance))}</td></tr>
                <tr className="font-medium"><td className="py-1.5">Your equity before selling costs</td><td className="text-right tabular-nums">{formatCurrency(Math.round(result.equityAtResale))}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
            <p>First Homes: 30-50% off new-build homes in England for first-time buyers. The price after the discount must be no more than £250,000 (£420,000 in London), household income no more than £80,000 (£90,000 in London), and a mortgage must cover at least half the price. Stamp duty is charged on the discounted price. When you sell, you normally have to sell to another eligible buyer at the same percentage discount; a council can allow an open-market sale after 6 months of unsuccessful marketing, in which case you repay the discount percentage of the sale price.</p>
            <p>National planning policy stopped requiring 25% of affordable homes to be First Homes in December 2024, so supply now depends on councils. A new Your First Home equity loan scheme was announced on 26 September 2026, with details due at the Budget.</p>
          </div>
        </div>
      )}
    </div>
  )
}
