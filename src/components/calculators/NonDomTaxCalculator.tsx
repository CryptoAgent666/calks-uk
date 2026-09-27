import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// 4-year foreign income and gains (FIG) regime, from 6 April 2025 (rUK income tax rates, 2026/27)
const PA = 12_570
const BASIC_BAND = 37_700
const ADDITIONAL_THRESHOLD = 125_140

function personalAllowance(income: number) {
  if (income <= 100_000) return PA
  return Math.max(0, PA - Math.floor((income - 100_000) / 2))
}

function incomeTax(income: number, pa: number) {
  const taxable = Math.max(0, income - pa)
  return (
    Math.min(taxable, BASIC_BAND) * 0.20 +
    Math.max(0, Math.min(taxable, ADDITIONAL_THRESHOLD) - BASIC_BAND) * 0.40 +
    Math.max(0, taxable - ADDITIONAL_THRESHOLD) * 0.45
  )
}

// yearOfResidence: which year of UK residence this is, after at least 10 years non-resident (1 = first year)
function calculate(ukIncome: number, foreignIncome: number, yearOfResidence: number) {
  const year = Math.max(1, Math.floor(yearOfResidence))
  const eligible = year <= 4

  // Claiming FIG: foreign income and gains exempt, but no Personal Allowance (and no CGT annual exempt amount) for the year
  const taxIfClaim = incomeTax(ukIncome, 0)

  // Not claiming: worldwide income taxed, Personal Allowance kept (tapered on total income over £100,000)
  const totalIncome = ukIncome + foreignIncome
  const taxNoClaim = incomeTax(totalIncome, personalAllowance(totalIncome))
  const ukTaxNoClaim = incomeTax(ukIncome, personalAllowance(totalIncome))

  const claim = eligible && foreignIncome > 0 && taxIfClaim < taxNoClaim
  const totalTax = claim ? taxIfClaim : taxNoClaim
  const ukTax = claim ? taxIfClaim : ukTaxNoClaim
  const foreignTax = claim ? 0 : taxNoClaim - ukTaxNoClaim
  const afterIncomeTax = ukIncome + foreignIncome - totalTax

  return {
    eligible, claim, taxIfClaim, taxNoClaim, saving: taxNoClaim - taxIfClaim,
    ukTax, foreignTax, totalTax, afterIncomeTax,
    yearsRemaining: eligible ? 4 - year : 0, year,
  }
}

export default function NonDomTaxCalculator() {
  const [ukIncome, setUkIncome] = useState('60000')
  const [foreignIncome, setForeignIncome] = useState('40000')
  const [years, setYears] = useState('2')

  const uk = parseFloat(ukIncome.replace(/,/g,'')) || 0
  const fi = parseFloat(foreignIncome.replace(/,/g,'')) || 0
  const y = parseInt(years) || 1
  const result = useMemo(() => calculate(uk, fi, y), [uk, fi, y])

  const status = !result.eligible
    ? 'FIG period ended: all worldwide income taxable'
    : `Year ${result.year} of 4 in the FIG regime${result.yearsRemaining > 0 ? `, ${result.yearsRemaining} more eligible year${result.yearsRemaining !== 1 ? 's' : ''} after this one` : ', the last eligible year'}`

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">UK Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={ukIncome} onChange={(e) => setUkIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="UK Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Foreign Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={foreignIncome} onChange={(e) => setForeignIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Foreign Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Year of UK Residence</label><input type="number" min="1" max="20" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Year of UK Residence" /><p className="text-xs text-muted-foreground mt-1">After at least 10 years non-resident (1 = first year)</p></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className={`rounded-xl p-3 text-center text-sm font-medium ${result.eligible ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400'}`}>
          {status}
        </div>

        {result.eligible && fi > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl p-4 text-center ${result.claim ? 'bg-green-100 dark:bg-green-950 border-2 border-green-300 dark:border-green-800' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Tax if you claim FIG</p><p className="text-lg font-bold">{formatCurrency(result.taxIfClaim)}</p><p className="text-xs text-muted-foreground">No Personal Allowance</p></div>
            <div className={`rounded-xl p-4 text-center ${!result.claim ? 'bg-green-100 dark:bg-green-950 border-2 border-green-300 dark:border-green-800' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Tax if you don't claim</p><p className="text-lg font-bold">{formatCurrency(result.taxNoClaim)}</p><p className="text-xs text-muted-foreground">Foreign income taxed</p></div>
          </div>
        )}
        {result.eligible && fi > 0 && (
          <p className="text-sm text-center font-medium">
            {result.claim
              ? `Claiming saves ${formatCurrency(result.saving)} this year`
              : `Claiming would cost ${formatCurrency(-result.saving)} more, because you lose the Personal Allowance`}
          </p>
        )}

        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Total Income Tax{result.eligible && fi > 0 ? (result.claim ? ' (claiming FIG)' : ' (not claiming)') : ''}</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalTax)}</p>
          <p className="text-sm text-muted-foreground mt-1">Income after income tax (before NI): {formatCurrency(result.afterIncomeTax)}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Tax on UK Income</p><p className="text-lg font-bold">{formatCurrency(result.ukTax)}</p></div>
          <div className={`rounded-xl p-4 text-center ${result.foreignTax > 0 ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}><p className="text-xs text-muted-foreground">Tax on Foreign Income</p><p className={`text-lg font-bold ${result.foreignTax > 0 ? 'text-destructive' : 'text-green-700 dark:text-green-400'}`}>{result.claim ? 'Exempt (FIG)' : formatCurrency(result.foreignTax)}</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">New rules from April 2025:</p>
          <p>The old remittance basis is abolished and domicile no longer matters. In your first 4 years of UK residence after at least 10 years abroad you can claim the Foreign Income and Gains (FIG) regime, year by year, on your Self Assessment return. A claim exempts foreign income and gains but costs you the Personal Allowance and the Capital Gains Tax annual exempt amount for that year. Foreign employment earnings are not covered. After 4 years, all worldwide income is taxable. No more £30K/£60K annual charges. Figures use rUK income tax rates and ignore foreign tax credit relief.</p>
        </div>
      </div>
    </div>
  )
}
