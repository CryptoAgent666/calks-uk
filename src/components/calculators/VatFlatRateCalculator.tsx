import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

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
  'Travel agency': 10.5, 'Veterinary': 11, 'Waste/recycling': 10.5,
  'Other (not listed)': 12,
}

function calculate(turnover: number, flatRate: number) {
  const vatCollected = turnover * 0.20
  const grossTurnover = turnover + vatCollected
  const vatToPay = grossTurnover * (flatRate / 100)
  const vatSaving = vatCollected - vatToPay

  return { turnover, vatCollected, grossTurnover, vatToPay, vatSaving, flatRate }
}

export default function VatFlatRateCalculator() {
  const [turnover, setTurnover] = useState('')
  const [sector, setSector] = useState('Business services')

  const t = parseFloat(turnover.replace(/,/g, '')) || 0
  const fr = FLAT_RATES[sector] || 12
  const result = useMemo(() => calculate(t, fr), [t, fr])

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
      </div>

      {t > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">VAT Collected (20%)</p><p className="text-lg font-bold">{formatCurrency(result.vatCollected)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">VAT to Pay ({fr}%)</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.vatToPay)}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.vatSaving > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
              <p className="text-xs text-muted-foreground">{result.vatSaving > 0 ? 'You Keep' : 'Extra Cost'}</p>
              <p className={`text-lg font-bold ${result.vatSaving > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(Math.abs(result.vatSaving))}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p>Flat Rate Scheme: you charge clients 20% VAT but pay HMRC a fixed {fr}% of gross turnover.</p>
            <p>You {result.vatSaving > 0 ? 'keep' : 'lose'} the difference of {formatCurrency(Math.abs(result.vatSaving))}/year.</p>
            <p>Eligible if taxable turnover is under £150,000 (excl. VAT).</p>
          </div>
        </div>
      )}
    </div>
  )
}
