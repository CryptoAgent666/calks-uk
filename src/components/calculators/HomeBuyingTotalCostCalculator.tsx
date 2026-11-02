import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type Country = 'england' | 'scotland' | 'wales'
type Buyer = 'standard' | 'ftb' | 'additional'
type Band = { from: number; to: number; rate: number }

// SDLT from April 2025 (England & Northern Ireland); same figures as StampDutyCalculator
const SDLT_BANDS: Band[] = [
  { from: 0, to: 125_000, rate: 0 },
  { from: 125_000, to: 250_000, rate: 0.02 },
  { from: 250_000, to: 925_000, rate: 0.05 },
  { from: 925_000, to: 1_500_000, rate: 0.10 },
  { from: 1_500_000, to: Infinity, rate: 0.12 },
]
const SDLT_FTB_BANDS: Band[] = [
  { from: 0, to: 300_000, rate: 0 },
  { from: 300_000, to: 500_000, rate: 0.05 },
]
const SDLT_FTB_MAX_PRICE = 500_000
const SDLT_SURCHARGE = 0.05

// LBTT (revenue.scot); same figures as LandTransactionTaxCalculator
const LBTT_BANDS: Band[] = [
  { from: 0, to: 145_000, rate: 0 },
  { from: 145_000, to: 250_000, rate: 0.02 },
  { from: 250_000, to: 325_000, rate: 0.05 },
  { from: 325_000, to: 750_000, rate: 0.10 },
  { from: 750_000, to: Infinity, rate: 0.12 },
]
// First-time buyer relief lifts the nil rate band to £175,000, saving up to £600
const LBTT_FTB_BANDS: Band[] = [
  { from: 0, to: 175_000, rate: 0 },
  ...LBTT_BANDS.slice(1).map((b) => (b.from === 145_000 ? { ...b, from: 175_000 } : b)),
]
const ADS_RATE = 0.08 // Additional Dwelling Supplement on the whole price, from 5 December 2024

// LTT (gov.wales); same figures as LandTransactionTaxCalculator
const LTT_BANDS: Band[] = [
  { from: 0, to: 225_000, rate: 0 },
  { from: 225_000, to: 400_000, rate: 0.06 },
  { from: 400_000, to: 750_000, rate: 0.075 },
  { from: 750_000, to: 1_500_000, rate: 0.10 },
  { from: 1_500_000, to: Infinity, rate: 0.12 },
]
const LTT_HIGHER_BANDS: Band[] = [
  { from: 0, to: 180_000, rate: 0.05 },
  { from: 180_000, to: 250_000, rate: 0.085 },
  { from: 250_000, to: 400_000, rate: 0.10 },
  { from: 400_000, to: 750_000, rate: 0.125 },
  { from: 750_000, to: 1_500_000, rate: 0.15 },
  { from: 1_500_000, to: Infinity, rate: 0.17 },
]

// None of the three additional-property charges applies below £40,000
const ADDITIONAL_MIN_PRICE = 40_000

function bandTax(price: number, bands: Band[]) {
  return bands.reduce((tax, b) => (price > b.from ? tax + (Math.min(price, b.to) - b.from) * b.rate : tax), 0)
}

function propertyTax(price: number, country: Country, buyer: Buyer) {
  const additional = buyer === 'additional' && price >= ADDITIONAL_MIN_PRICE
  if (country === 'scotland') {
    const base = bandTax(price, buyer === 'ftb' ? LBTT_FTB_BANDS : LBTT_BANDS)
    return { tax: base + (additional ? price * ADS_RATE : 0), name: additional ? 'LBTT + ADS' : 'LBTT' }
  }
  if (country === 'wales') {
    return { tax: bandTax(price, additional ? LTT_HIGHER_BANDS : LTT_BANDS), name: additional ? 'LTT (higher rates)' : 'LTT' }
  }
  const base = buyer === 'ftb' && price <= SDLT_FTB_MAX_PRICE ? bandTax(price, SDLT_FTB_BANDS) : bandTax(price, SDLT_BANDS)
  return { tax: base + (additional ? price * SDLT_SURCHARGE : 0), name: additional ? 'Stamp Duty (with 5% surcharge)' : 'Stamp Duty' }
}

// Same fee scale and VAT basis as the Solicitor Fee calculator; a rough estimate
function solicitorFee(price: number) {
  if (price > 500_000) return 2000
  if (price > 300_000) return 1700
  if (price > 200_000) return 1500
  return 1200
}

function calculate(price: number, deposit: number, country: Country, buyer: Buyer, rate: number, term: number, includeSurvey: boolean, includeRemovals: boolean) {
  const depositPaid = Math.min(deposit, price)
  const mortgage = price - depositPaid

  const { tax, name: taxName } = propertyTax(price, country, buyer)

  const solicitorNet = solicitorFee(price)
  const solicitorVat = solicitorNet * 0.20
  const solicitor = solicitorNet + solicitorVat
  const survey = includeSurvey ? (price < 250_000 ? 400 : 600) : 0
  const searches = 300
  // HM Land Registry Scale 1, portal fee for a whole-title transfer (from 9 Dec 2024)
  const landRegistry = price <= 80_000 ? 20 : price <= 100_000 ? 40 : price <= 200_000 ? 100 : price <= 500_000 ? 150 : price <= 1_000_000 ? 295 : 500
  const mortgageFee = mortgage > 0 ? 999 : 0 // a cash buyer has no arrangement fee
  const removals = includeRemovals ? 800 : 0
  const totalUpfront = depositPaid + tax + solicitor + survey + searches + landRegistry + mortgageFee + removals

  const monthlyRate = rate / 100 / 12
  const payments = term * 12
  const monthlyMortgage = monthlyRate > 0 ? mortgage * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1) : mortgage / payments

  return { depositPaid, tax, taxName, solicitorNet, solicitor, survey, searches, landRegistry, mortgageFee, removals, totalUpfront, monthlyMortgage, mortgage }
}

const TAX_NOTES: Record<Country, string> = {
  england: 'Stamp Duty Land Tax for England and Northern Ireland. First-time buyer relief ends above £500,000, and additional properties usually pay 5% on the whole price.',
  scotland: 'LBTT for Scotland. First-time buyer relief lifts the nil rate band to £175,000, and additional properties usually pay the 8% Additional Dwelling Supplement on the whole price.',
  wales: 'LTT for Wales. There is no first-time buyer relief, and additional properties usually pay the higher rates, which are charged from the first pound.',
}

export default function HomeBuyingTotalCostCalculator() {
  const [price, setPrice] = useState('350000')
  const [deposit, setDeposit] = useState('35000')
  const [country, setCountry] = useState<Country>('england')
  const [buyer, setBuyer] = useState<Buyer>('standard')
  const [rate, setRate] = useState('4.5')
  const [term, setTerm] = useState('25')
  const [includeSurvey, setIncludeSurvey] = useState(true)
  const [includeRemovals, setIncludeRemovals] = useState(true)

  const p = parseFloat(price.replace(/,/g,'')) || 0
  const d = parseFloat(deposit.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 0
  const t = parseInt(term) || 25
  const result = useMemo(() => calculate(p, d, country, buyer, r, t, includeSurvey, includeRemovals), [p, d, country, buyer, r, t, includeSurvey, includeRemovals])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Property Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Property Price" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Deposit" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Rate (%)</label><input type="number" min="1" max="8" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Rate (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Term (years)</label><input type="number" min="1" max="40" step="1" value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Term (years)" /></div>
        <div><label className="block text-sm font-medium mb-2">Where</label><select value={country} onChange={(e) => setCountry(e.target.value as Country)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Where you are buying"><option value="england">England / NI</option><option value="scotland">Scotland</option><option value="wales">Wales</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Buyer</label><select value={buyer} onChange={(e) => setBuyer(e.target.value as Buyer)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Buyer type"><option value="standard">Moving home</option><option value="ftb">First-time buyer</option><option value="additional">Additional property</option></select></div>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={includeSurvey} onChange={(e) => setIncludeSurvey(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Include a survey</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={includeRemovals} onChange={(e) => setIncludeRemovals(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Include removals</span></label>
      </div>
      {d > p && p > 0 && <p className="text-sm text-destructive">Your deposit is more than the price, so the total below counts only the price. Check the two figures.</p>}

      {p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-destructive/10 p-5 text-center"><p className="text-sm text-muted-foreground">Total Cash Needed</p><p className="text-2xl font-bold text-destructive">{formatCurrency(result.totalUpfront)}</p></div>
            <div className="rounded-2xl bg-primary/10 p-5 text-center"><p className="text-sm text-muted-foreground">Monthly Mortgage</p><p className="text-2xl font-bold text-primary">{formatCurrency(result.monthlyMortgage)}</p><p className="text-xs text-muted-foreground mt-1">{result.mortgage > 0 ? `Repayment over ${t} years` : 'Cash purchase, no mortgage'}</p></div>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Deposit</td><td className="text-right tabular-nums">{formatCurrency(result.depositPaid)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">{result.taxName}</td><td className="text-right tabular-nums">{formatCurrency(result.tax)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Solicitor ({formatCurrency(result.solicitorNet)} + 20% VAT)</td><td className="text-right tabular-nums">{formatCurrency(result.solicitor)}</td></tr>
              {includeSurvey && <tr className="border-b border-border/50"><td className="py-2">Survey</td><td className="text-right tabular-nums">{formatCurrency(result.survey)}</td></tr>}
              <tr className="border-b border-border/50"><td className="py-2">Searches</td><td className="text-right tabular-nums">{formatCurrency(result.searches)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Land Registry</td><td className="text-right tabular-nums">{formatCurrency(result.landRegistry)}</td></tr>
              {result.mortgageFee > 0 && <tr className="border-b border-border/50"><td className="py-2">Mortgage Fee</td><td className="text-right tabular-nums">{formatCurrency(result.mortgageFee)}</td></tr>}
              {includeRemovals && <tr className="border-b border-border/50"><td className="py-2">Removals</td><td className="text-right tabular-nums">{formatCurrency(result.removals)}</td></tr>}
              <tr className="font-semibold"><td className="py-2">Total</td><td className="text-right tabular-nums">{formatCurrency(result.totalUpfront)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>{TAX_NOTES[country]} The solicitor, survey, searches, mortgage fee and removals lines are rough estimates. The Land Registry line is the HM Land Registry online fee for England and Wales; Scotland and Northern Ireland have their own registers and fees, so treat it as a guide there.</p>
          </div>
        </div>
      )}
    </div>
  )
}
