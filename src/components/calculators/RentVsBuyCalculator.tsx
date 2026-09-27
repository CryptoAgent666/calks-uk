import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Stamp Duty Land Tax, England and Northern Ireland, from 1 April 2025 (gov.uk/stamp-duty-land-tax).
// First-time buyers: nil to £300,000, 5% to £500,000, no relief if the price is over £500,000.
const SDLT_BANDS: [number, number][] = [[125_000, 0], [250_000, 0.02], [925_000, 0.05], [1_500_000, 0.10], [Infinity, 0.12]]

function stampDuty(price: number, firstTimeBuyer: boolean) {
  if (firstTimeBuyer && price <= 500_000) return Math.max(0, price - 300_000) * 0.05
  let tax = 0
  let lower = 0
  for (const [upper, rate] of SDLT_BANDS) {
    if (price > lower) tax += (Math.min(price, upper) - lower) * rate
    lower = upper
  }
  return tax
}

interface Inputs {
  price: number; deposit: number; rate: number; term: number; rent: number
  houseGrowth: number; rentGrowth: number; years: number; firstTimeBuyer: boolean
  buyingCosts: number; maintenance: number; sellingCosts: number; investReturn: number
}

// Equal-budget comparison: each month the cheaper option invests the difference, and the renter
// invests the upfront cash (deposit, stamp duty, fees) that the buyer spends on day one.
function calculate(i: Inputs) {
  const deposit = Math.min(i.deposit, i.price)
  const loan = i.price - deposit
  const r = i.rate / 100 / 12
  const n = i.term * 12
  const monthlyMortgage = loan === 0 || n === 0 ? 0 : r > 0 ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n
  const sdlt = stampDuty(i.price, i.firstTimeBuyer)
  const upfront = deposit + sdlt + i.buyingCosts
  const invR = Math.pow(1 + i.investReturn / 100, 1 / 12) - 1

  let balance = loan
  let value = i.price
  let rent = i.rent
  let renterPot = upfront
  let buyerPot = 0
  let mortgagePaid = 0
  let interestPaid = 0
  let maintenancePaid = 0
  let rentPaid = 0
  let renterContrib = 0
  let buyerContrib = 0
  const rows: { year: number; equity: number; buyerWealth: number; renterWealth: number }[] = []

  for (let y = 1; y <= i.years; y++) {
    const maintMonthly = value * (i.maintenance / 100) / 12
    for (let m = 0; m < 12; m++) {
      renterPot *= 1 + invR
      buyerPot *= 1 + invR
      let pay = 0
      if (balance > 0.005) {
        const interest = balance * r
        pay = Math.min(monthlyMortgage, balance + interest)
        balance = balance + interest - pay
        interestPaid += interest
      }
      mortgagePaid += pay
      maintenancePaid += maintMonthly
      rentPaid += rent
      const diff = pay + maintMonthly - rent
      if (diff > 0) { renterPot += diff; renterContrib += diff } else { buyerPot -= diff; buyerContrib -= diff }
    }
    value *= 1 + i.houseGrowth / 100
    rent *= 1 + i.rentGrowth / 100
    const equity = value - Math.max(0, balance) - value * (i.sellingCosts / 100)
    rows.push({ year: y, equity, buyerWealth: equity + buyerPot, renterWealth: renterPot })
  }

  const balanceLeft = Math.max(0, balance)
  const sellingCost = value * (i.sellingCosts / 100)
  const equity = value - balanceLeft - sellingCost
  const buyerWealth = equity + buyerPot
  const buyerPaidOut = upfront + mortgagePaid + maintenancePaid + buyerContrib
  const renterPaidOut = rentPaid + upfront + renterContrib
  const breakEven = rows.find((row) => row.buyerWealth >= row.renterWealth)?.year ?? null

  return {
    loan, monthlyMortgage, sdlt, upfront, mortgagePaid, interestPaid, maintenancePaid, buyerPot, buyerContrib,
    propertyValue: value, balanceLeft, sellingCost, equity, buyerWealth, buyerPaidOut,
    rentPaid, renterContrib, renterPot, renterPaidOut,
    buyingBetter: buyerWealth >= renterPot,
    difference: Math.abs(buyerWealth - renterPot),
    breakEven, rows,
  }
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'
const moneyClass = 'w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function RentVsBuyCalculator() {
  const [price, setPrice] = useState('300000')
  const [deposit, setDeposit] = useState('30000')
  const [rate, setRate] = useState('5.73')
  const [term, setTerm] = useState('25')
  const [rent, setRent] = useState('1200')
  const [hGrowth, setHGrowth] = useState('3')
  const [rGrowth, setRGrowth] = useState('3')
  const [years, setYears] = useState('10')
  const [ftb, setFtb] = useState(true)
  const [buyCosts, setBuyCosts] = useState('2000')
  const [maint, setMaint] = useState('1')
  const [sell, setSell] = useState('1.8')
  const [invest, setInvest] = useState('4')

  const num = (v: string) => parseFloat(v.replace(/,/g, '')) || 0
  const inputs: Inputs = {
    price: num(price), deposit: num(deposit), rate: num(rate), term: parseInt(term) || 0, rent: num(rent),
    houseGrowth: num(hGrowth), rentGrowth: num(rGrowth), years: parseInt(years) || 0, firstTimeBuyer: ftb,
    buyingCosts: num(buyCosts), maintenance: num(maint), sellingCosts: num(sell), investReturn: num(invest),
  }
  const y = inputs.years
  const key = JSON.stringify(inputs)
  const result = useMemo(() => (inputs.price > 0 && inputs.rent > 0 && y > 0 && y <= 40) ? calculate(inputs) : null, [key])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Property Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className={moneyClass} aria-label="Property Price" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} className={moneyClass} aria-label="Deposit" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Mortgage Rate (%)</label><input type="number" min="0" max="15" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass} aria-label="Mortgage Rate (%)" /><p className="text-xs text-muted-foreground mt-1">5.73% = average 2-year fix, Moneyfacts, 15 Sep 2026</p></div>
        <div><label className="block text-sm font-medium mb-2">Mortgage Term (years)</label><input type="number" min="1" max="40" value={term} onChange={(e) => setTerm(e.target.value)} className={inputClass} aria-label="Mortgage Term (years)" /></div>
        <div><label className="block text-sm font-medium mb-2">Monthly Rent</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} className={moneyClass} aria-label="Monthly Rent" /></div></div>
        <div><label className="block text-sm font-medium mb-2">House Price Growth (%/yr)</label><input type="number" min="-5" max="15" step="0.5" value={hGrowth} onChange={(e) => setHGrowth(e.target.value)} className={inputClass} aria-label="House Price Growth (%/yr)" /></div>
        <div><label className="block text-sm font-medium mb-2">Rent Growth (%/yr)</label><input type="number" min="0" max="15" step="0.5" value={rGrowth} onChange={(e) => setRGrowth(e.target.value)} className={inputClass} aria-label="Rent Growth (%/yr)" /></div>
        <div><label className="block text-sm font-medium mb-2">Comparison Period (years)</label><input type="number" min="1" max="40" value={years} onChange={(e) => setYears(e.target.value)} className={inputClass} aria-label="Comparison Period (years)" /></div>
        <div><label className="block text-sm font-medium mb-2">Legal &amp; Survey Fees</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={buyCosts} onChange={(e) => setBuyCosts(e.target.value)} className={moneyClass} aria-label="Legal and Survey Fees" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Maintenance (% of value/yr)</label><input type="number" min="0" max="5" step="0.1" value={maint} onChange={(e) => setMaint(e.target.value)} className={inputClass} aria-label="Maintenance (% of value per year)" /></div>
        <div><label className="block text-sm font-medium mb-2">Selling Costs (% of sale price)</label><input type="number" min="0" max="5" step="0.1" value={sell} onChange={(e) => setSell(e.target.value)} className={inputClass} aria-label="Selling Costs (% of sale price)" /><p className="text-xs text-muted-foreground mt-1">1.8% = 1.5% agent fee plus VAT</p></div>
        <div><label className="block text-sm font-medium mb-2">Investment Return (%/yr)</label><input type="number" min="0" max="12" step="0.5" value={invest} onChange={(e) => setInvest(e.target.value)} className={inputClass} aria-label="Investment Return (%/yr)" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={ftb} onChange={(e) => setFtb(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">First-time buyer (stamp duty relief up to £500,000)</span></label>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.buyingBetter ? 'bg-green-100 dark:bg-green-950' : 'bg-primary/10'}`}>
            <p className="text-sm text-muted-foreground">Wealth after {y} years</p>
            <p className="text-3xl font-bold mt-1">{result.buyingBetter ? <span className="text-green-700 dark:text-green-400">Buying ahead</span> : <span className="text-primary">Renting ahead</span>}</p>
            <p className="text-sm text-muted-foreground mt-1">by {formatCurrency(result.difference)} &middot; {result.breakEven ? `buying pulls ahead in year ${result.breakEven}` : `buying does not pull ahead within ${y} years`}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4">
              <p className="font-semibold text-sm mb-2">Buying</p>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">Monthly mortgage</td><td className="text-right tabular-nums">{formatCurrency(result.monthlyMortgage)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">Deposit + stamp duty ({formatCurrency(result.sdlt)}) + fees</td><td className="text-right tabular-nums">{formatCurrency(result.upfront)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">Mortgage payments (interest {formatCurrency(result.interestPaid)})</td><td className="text-right tabular-nums">{formatCurrency(result.mortgagePaid)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">Maintenance</td><td className="text-right tabular-nums">{formatCurrency(result.maintenancePaid)}</td></tr>
                  {result.buyerContrib > 0 && <tr className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">Invested when rent was dearer</td><td className="text-right tabular-nums">{formatCurrency(result.buyerContrib)}</td></tr>}
                  <tr className="border-b border-border font-medium"><td className="py-1.5">Total paid out</td><td className="text-right tabular-nums">{formatCurrency(result.buyerPaidOut)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">Home value in year {y}</td><td className="text-right tabular-nums">{formatCurrency(result.propertyValue)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">Mortgage still owed</td><td className="text-right tabular-nums">-{formatCurrency(result.balanceLeft)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">Selling costs</td><td className="text-right tabular-nums">-{formatCurrency(result.sellingCost)}</td></tr>
                  {result.buyerPot > 0 && <tr className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">Savings pot</td><td className="text-right tabular-nums">{formatCurrency(result.buyerPot)}</td></tr>}
                  <tr className="font-semibold"><td className="py-1.5">Wealth at the end</td><td className="text-right tabular-nums">{formatCurrency(result.buyerWealth)}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="font-semibold text-sm mb-2">Renting and investing</p>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">Rent paid</td><td className="text-right tabular-nums">{formatCurrency(result.rentPaid)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">Invested on day one (buyer's upfront cash)</td><td className="text-right tabular-nums">{formatCurrency(result.upfront)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">Invested when buying was dearer</td><td className="text-right tabular-nums">{formatCurrency(result.renterContrib)}</td></tr>
                  <tr className="border-b border-border font-medium"><td className="py-1.5">Total paid out</td><td className="text-right tabular-nums">{formatCurrency(result.renterPaidOut)}</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1.5 text-muted-foreground">Investment growth at {inputs.investReturn}%</td><td className="text-right tabular-nums">{formatCurrency(result.renterPot - result.upfront - result.renterContrib)}</td></tr>
                  <tr className="font-semibold"><td className="py-1.5">Wealth at the end</td><td className="text-right tabular-nums">{formatCurrency(result.renterPot)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4 overflow-x-auto">
            <p className="font-semibold text-sm mb-2">Net wealth year by year (if you sold or stopped that year)</p>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground"><th className="py-1.5 text-left font-medium">Year</th><th className="text-right font-medium">Buying</th><th className="text-right font-medium">Renting</th><th className="text-right font-medium">Buying minus renting</th></tr></thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={row.year} className="border-b border-border/50"><td className="py-1.5">{row.year}</td><td className="text-right tabular-nums">{formatCurrency(Math.round(row.buyerWealth))}</td><td className="text-right tabular-nums">{formatCurrency(Math.round(row.renterWealth))}</td><td className={`text-right tabular-nums ${row.buyerWealth >= row.renterWealth ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(Math.round(row.buyerWealth - row.renterWealth))}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground">Both households spend the same each month: whichever option is cheaper that month invests the difference at your investment return, and the renter invests the deposit, stamp duty and fees the buyer pays on day one. Stamp duty uses England and Northern Ireland rates; Scotland (LBTT) and Wales (LTT) differ. Buildings insurance and service charges are not included separately, so add them to the maintenance percentage. Investment returns are shown before any tax, as in an ISA.</p>
        </div>
      )}
    </div>
  )
}
