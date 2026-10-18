import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Flat rate percentages by sector, gov.uk/vat-flat-rate-scheme/how-much-you-pay.
const FLAT_RATES: Record<string, number> = {
  'Accountancy/bookkeeping': 14.5, 'Advertising': 11, 'Architecture/surveying': 14.5,
  'Boarding/care of animals': 12, 'Business services': 12, 'Catering/takeaway': 12.5,
  'Computer/IT consultancy': 14.5, 'Computer repair': 10.5, 'Entertainment/journalism': 12.5,
  'Estate agency': 12, 'Farming/agriculture': 6.5, 'Film/TV/radio': 13,
  'Financial services': 13.5, 'Freight transport': 10, 'General building': 9.5,
  'Hairdressing/beauty': 13, 'Hiring goods': 9.5, 'Hotels/accommodation': 10.5,
  'Investigation/security': 12, 'Labour-only building': 14.5, 'Laundry/dry cleaning': 12,
  'Legal services': 14.5, 'Management consultancy': 14, 'Manufacturing': 9.5,
  'Membership organisations': 8, 'Mining/quarrying': 10, 'Photography': 11,
  'Post offices': 5, 'Printing': 8.5, 'Property management': 12,
  'Public relations': 12, 'Publishing': 11, 'Real estate': 14,
  'Repairing personal goods': 10, 'Repairing vehicles': 8.5, 'Retailing (food)': 4,
  'Retailing (non-food)': 7.5, 'Secretarial services': 13, 'Social work': 11,
  'Software/games': 14.5, 'Sport/recreation': 8.5, 'Transport/storage': 10,
  'Travel agency': 10.5, 'Veterinary': 11,
  'Other (not listed)': 12,
}

// Limited cost business (VAT Notice 733 para 4.4): spending on goods, excluding
// capital items, motor costs, food and drink and goods for resale, under 2% of
// VAT-inclusive turnover or under £1,000 a year, means 16.5% whatever the sector.
const LIMITED_COST_RATE = 16.5
// 1 percentage point off the flat rate in the first year of VAT registration.
const FIRST_YEAR_DISCOUNT = 1
const JOIN_LIMIT = 150_000 // VAT-taxable turnover, excluding VAT, to join
const LEAVE_LIMIT = 230_000 // total income including VAT; must leave above this

function calculate(turnover: number, sectorRate: number, limitedCost: boolean, firstYear: boolean, inputVat: number) {
  const appliedRate = Math.max(0, (limitedCost ? LIMITED_COST_RATE : sectorRate) - (firstYear ? FIRST_YEAR_DISCOUNT : 0))
  const vatCollected = turnover * 0.20
  const grossTurnover = turnover + vatCollected
  const vatToPay = grossTurnover * (appliedRate / 100)
  // Standard VAT accounting: output VAT charged less input VAT reclaimed.
  const standardLiability = vatCollected - inputVat
  const vatSaving = standardLiability - vatToPay

  return { turnover, vatCollected, grossTurnover, vatToPay, standardLiability, vatSaving, appliedRate, sectorRate }
}

export default function VatFlatRateCalculator() {
  const [turnover, setTurnover] = useState('')
  const [sector, setSector] = useState('Business services')
  const [inputVat, setInputVat] = useState('')
  const [limitedCost, setLimitedCost] = useState(false)
  const [firstYear, setFirstYear] = useState(false)

  const t = parseFloat(turnover.replace(/,/g, '')) || 0
  const iv = Math.max(0, parseFloat(inputVat.replace(/,/g, '')) || 0)
  const sectorRate = FLAT_RATES[sector] || 12
  const result = useMemo(() => calculate(t, sectorRate, limitedCost, firstYear, iv), [t, sectorRate, limitedCost, firstYear, iv])
  const saves = result.vatSaving > 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Annual Turnover (excl. VAT)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={turnover} onChange={(e) => setTurnover(e.target.value)} placeholder="60,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Turnover (excl. VAT)" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Business Sector</label>
          <select value={sector} onChange={(e) => setSector(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Business Sector">
            {Object.entries(FLAT_RATES).map(([name, rate]) => (
              <option key={name} value={name}>{name} ({rate}%)</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Input VAT you could reclaim on standard VAT accounting (£ per year)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={inputVat} onChange={(e) => setInputVat(e.target.value)} placeholder="0" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Input VAT you could reclaim on standard VAT accounting (£ per year)" /></div>
          <p className="text-xs text-muted-foreground mt-1">VAT on your purchases: equipment, software, stock, materials. 0 if you buy almost nothing with VAT on it.</p>
        </div>
        <div className="space-y-3 sm:pt-7">
          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={limitedCost} onChange={(e) => setLimitedCost(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-input" />
            <span>Limited cost business (goods under 2% of turnover or under £1,000 a year): 16.5% rate</span>
          </label>
          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={firstYear} onChange={(e) => setFirstYear(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-input" />
            <span>First year of VAT registration (1% discount)</span>
          </label>
        </div>
      </div>

      {t > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">VAT Charged (20%)</p><p className="text-lg font-bold">{formatCurrency(result.vatCollected)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Standard VAT Bill (after input VAT)</p><p className="text-lg font-bold">{formatCurrency(result.standardLiability)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Flat Rate Payment ({result.appliedRate}%)</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.vatToPay)}</p></div>
            <div className={`rounded-xl p-4 text-center ${saves ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
              <p className="text-xs text-muted-foreground">{saves ? 'You Keep' : 'Extra Cost'}</p>
              <p className={`text-lg font-bold ${saves ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(Math.abs(result.vatSaving))}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p>
              Flat rate applied: <span className="font-semibold text-foreground">{result.appliedRate}%</span> of VAT-inclusive turnover ({formatCurrency(result.grossTurnover)}).
              {limitedCost ? ` The 16.5% limited cost rate overrides the ${sector} rate of ${sectorRate}%.` : ` ${sector}: ${sectorRate}%.`}
              {firstYear ? ' Less the 1% discount for the first year of VAT registration.' : ''}
            </p>
            <p>Standard VAT accounting: {formatCurrency(result.vatCollected)} charged less {formatCurrency(iv)} input VAT reclaimed = {formatCurrency(result.standardLiability)}.</p>
            <p>You {saves ? 'keep' : 'lose'} {formatCurrency(Math.abs(result.vatSaving))} a year on the Flat Rate Scheme compared with standard VAT. On the flat rate you cannot reclaim input VAT, except on a single capital asset costing £2,000 or more including VAT on one invoice.</p>
            <p>You can join if VAT-taxable turnover is £150,000 or less (excluding VAT), and must leave once total income including VAT passes £230,000.</p>
            {t > JOIN_LIMIT && (
              <p className="rounded-lg bg-orange-100 dark:bg-orange-950 px-3 py-2 text-orange-800 dark:text-orange-300">
                Turnover of {formatCurrency(t)} is above the £150,000 limit for joining the Flat Rate Scheme.
                {result.grossTurnover > LEAVE_LIMIT ? ` Including VAT it is ${formatCurrency(result.grossTurnover)}, above the £230,000 point at which existing users must leave.` : ''}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
