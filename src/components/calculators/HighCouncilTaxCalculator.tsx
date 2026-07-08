import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// High Value Council Tax Surcharge (HVCTS) — announced Budget 2025, from April
// 2028. An annual charge ON THE OWNER of a residential property in England with
// a current market value of £2m+, ON TOP of normal Council Tax. The £2,500 floor
// (£2m+) and £7,500 ceiling (£5m+) are gov-confirmed; the intermediate bands are
// the government's proposed structure and are subject to consultation (closes
// 14 Jul 2026). Property values are set by a Valuation Office revaluation, next
// due 2033, then every 5 years.
const SURCHARGE_BANDS = [
  { from: 2_000_000, to: 2_500_000, label: '£2m – £2.5m', charge: 2_500 },
  { from: 2_500_000, to: 3_500_000, label: '£2.5m – £3.5m', charge: 3_500 },
  { from: 3_500_000, to: 5_000_000, label: '£3.5m – £5m', charge: 5_000 },
  { from: 5_000_000, to: Infinity, label: 'Over £5m', charge: 7_500 },
]

function surchargeFor(marketValue: number): number {
  if (marketValue < 2_000_000) return 0
  const band = SURCHARGE_BANDS.find(b => marketValue >= b.from && marketValue < b.to)
  return band ? band.charge : SURCHARGE_BANDS[SURCHARGE_BANDS.length - 1].charge
}

function calculate(marketValue: number, baseCouncilTax: number) {
  const surcharge = surchargeFor(marketValue)
  const inScope = marketValue >= 2_000_000
  const total = baseCouncilTax + surcharge
  return { surcharge, inScope, baseCouncilTax, total, monthly: total / 12 }
}

export default function HighCouncilTaxCalculator() {
  const [value, setValue] = useState('2750000')
  const [baseTax, setBaseTax] = useState('4000')
  const v = parseFloat(value.replace(/,/g, '')) || 0
  const b = parseFloat(baseTax.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(v, b), [v, b])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Current Market Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Current Market Value" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Your Current Council Tax (£/yr)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={baseTax} onChange={(e) => setBaseTax(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Current Council Tax" /></div></div>
      </div>

      <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-sm text-orange-800 dark:text-orange-300">Proposed <strong>High Value Council Tax Surcharge</strong>: an annual charge on the owner of an England home worth £2m+, on top of normal Council Tax, from <strong>April 2028</strong>. Charges start at £2,500 (£2m+) and rise to £7,500 (£5m+). Intermediate bands are the government's proposal and are subject to consultation.</div>

      {v > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">{result.inScope ? 'Estimated Annual Cost (Council Tax + Surcharge)' : 'Estimated Annual Council Tax'}</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.total)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthly)}/month</p>
          </div>
          {result.inScope ? (
            <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-center text-sm text-orange-800 dark:text-orange-300">Includes {formatCurrency(result.surcharge)}/year high-value surcharge (proposed, from April 2028)</div>
          ) : (
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center text-sm text-green-800 dark:text-green-300">Below the £2m threshold — no high-value surcharge would apply.</div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Property Value</th><th className="text-right py-2 font-medium text-muted-foreground">Annual Surcharge</th></tr></thead>
              <tbody>{SURCHARGE_BANDS.map(band => (
                <tr key={band.label} className={`border-b border-border/50 ${result.inScope && result.surcharge === band.charge ? 'bg-primary/5 font-medium' : ''}`}><td className="py-1.5">{band.label}</td><td className="py-1.5 text-right tabular-nums">{formatCurrency(band.charge)}</td></tr>
              ))}</tbody>
            </table>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>The surcharge is separate from your Council Tax band (which is based on 1991 values). It is charged on the property owner. Values will be set by a Valuation Office revaluation, with the first due in 2033. This is a proposal — the exact bands may change after consultation.</p>
          </div>
        </div>
      )}
    </div>
  )
}
