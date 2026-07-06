import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// 2026/27. The first flexible pension withdrawal is usually taxed on an
// emergency Month-1 code (1257L M1): only 1/12 of the Personal Allowance and
// of each tax band is applied to the payment, so large one-off withdrawals are
// heavily over-taxed. Since April 2025 HMRC moves repeat withdrawals onto a
// cumulative code faster, but the FIRST payment still stings — reclaim with
// P50Z / P53Z / P55, or wait for the automatic P800 after the tax year ends.
const PERSONAL_ALLOWANCE = 12_570
const PA_TAPER = 100_000

const RUK_BANDS = [
  { rate: 0.20, width: 37_700 },
  { rate: 0.40, width: 125_140 - 50_270 },
  { rate: 0.45, width: Infinity },
]
const SCOT_BANDS = [
  { rate: 0.19, width: 16_537 - 12_570 },
  { rate: 0.20, width: 29_526 - 16_537 },
  { rate: 0.21, width: 43_662 - 29_526 },
  { rate: 0.42, width: 75_000 - 43_662 },
  { rate: 0.45, width: 125_140 - 75_000 },
  { rate: 0.48, width: Infinity },
]

type Region = 'ruk' | 'scotland'

// Annual tax on `income` using tapered PA + banded rates
function annualTax(income: number, region: Region): number {
  let pa = PERSONAL_ALLOWANCE
  if (income > PA_TAPER) pa = Math.max(0, PERSONAL_ALLOWANCE - Math.floor((income - PA_TAPER) / 2))
  let taxable = Math.max(0, income - pa)
  let tax = 0
  for (const b of region === 'scotland' ? SCOT_BANDS : RUK_BANDS) {
    const slice = Math.min(taxable, b.width)
    tax += slice * b.rate
    taxable -= slice
    if (taxable <= 0) break
  }
  return tax
}

// Month-1 emergency code: 1/12 of PA and of every band applied to one payment
function month1Tax(taxablePayment: number, region: Region): number {
  let remaining = Math.max(0, taxablePayment - PERSONAL_ALLOWANCE / 12)
  let tax = 0
  for (const b of region === 'scotland' ? SCOT_BANDS : RUK_BANDS) {
    const slice = Math.min(remaining, b.width / 12)
    tax += slice * b.rate
    remaining -= slice
    if (remaining <= 0) break
  }
  return tax
}

function calculate(withdrawal: number, taxFreeIncluded: boolean, otherIncome: number, potEmptied: boolean, region: Region) {
  if (withdrawal <= 0) return null
  const taxFree = taxFreeIncluded ? withdrawal * 0.25 : 0
  const taxablePart = withdrawal - taxFree

  const emergency = month1Tax(taxablePart, region)
  const actual = annualTax(otherIncome + taxablePart, region) - annualTax(otherIncome, region)
  const overpaid = Math.max(0, emergency - actual)
  const underpaid = Math.max(0, actual - emergency)

  const form = potEmptied
    ? (otherIncome > 0 ? 'P53Z' : 'P50Z')
    : 'P55'

  return { taxFree, taxablePart, emergency, actual, overpaid, underpaid, form, youReceive: withdrawal - emergency }
}

export default function PensionEmergencyTaxCalculator() {
  const [amount, setAmount] = useState('20,000')
  const [taxFreeIncluded, setTaxFreeIncluded] = useState(true)
  const [otherIncome, setOtherIncome] = useState('12,000')
  const [potEmptied, setPotEmptied] = useState(false)
  const [region, setRegion] = useState<Region>('ruk')

  const w = parseFloat(amount.replace(/,/g, '')) || 0
  const oi = parseFloat(otherIncome.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(w, taxFreeIncluded, oi, potEmptied, region), [w, taxFreeIncluded, oi, potEmptied, region])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Withdrawal Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Withdrawal Amount" />
          </div>
          <label className="flex items-center gap-2 mt-2 cursor-pointer text-sm">
            <input type="checkbox" checked={taxFreeIncluded} onChange={(e) => setTaxFreeIncluded(e.target.checked)} className="h-4 w-4 rounded border-border" />
            <span>Includes the 25% tax-free lump sum</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Other Taxable Income This Tax Year</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Other Taxable Income This Tax Year" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">State Pension, other pensions, earnings, rental income</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setRegion('ruk')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${region === 'ruk' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>England, Wales &amp; NI</button>
        <button onClick={() => setRegion('scotland')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${region === 'scotland' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Scotland</button>
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={potEmptied} onChange={(e) => setPotEmptied(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">This withdrawal empties the pension pot</span>
      </label>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Emergency Tax Withheld (Month-1 code)</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.emergency)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              You receive {formatCurrency(result.youReceive)} of your {formatCurrency(w)} withdrawal
              {result.taxFree > 0 ? ` (${formatCurrency(result.taxFree)} tax-free)` : ''}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">Tax Actually Due</p>
              <p className="text-lg font-bold">{formatCurrency(result.actual)}</p>
            </div>
            <div className={`rounded-xl p-4 text-center ${result.overpaid > 0 ? 'bg-green-100/60 dark:bg-green-950/60' : 'bg-muted/50'}`}>
              <p className="text-xs text-muted-foreground">{result.overpaid > 0 ? 'Your Refund' : 'Further Tax Due'}</p>
              <p className={`text-lg font-bold ${result.overpaid > 0 ? 'text-green-700 dark:text-green-400' : ''}`}>
                {formatCurrency(result.overpaid > 0 ? result.overpaid : result.underpaid)}
              </p>
            </div>
          </div>

          {result.overpaid > 0 && (
            <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">How to reclaim: form {result.form}</p>
              <p className="mt-1">
                {result.form === 'P55' && 'P55 — you took part of the pot and are not taking regular payments. '}
                {result.form === 'P53Z' && 'P53Z — you emptied the pot and have other taxable income. '}
                {result.form === 'P50Z' && 'P50Z — you emptied the pot and have no other taxable income this year. '}
                File online via your Personal Tax Account; HMRC refunds in around 30 days. If you do nothing,
                HMRC reconciles automatically after the tax year ends (P800 letter) — you get the money either way, just later.
              </p>
              <p className="mt-1">Taking a second withdrawal in the same tax year usually moves you onto a cumulative code, which self-corrects the overpayment through that payment instead.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
