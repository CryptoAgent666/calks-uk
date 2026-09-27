import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const PA = 12_570
const TRANSFER_AMOUNT = 1_260
const TRANSFEROR_PA = PA - TRANSFER_AMOUNT // £11,310
const MAX_SAVING = TRANSFER_AMOUNT * 0.20 // £252
// Highest income at which the recipient still pays basic rate (rUK) or the
// starter, basic or intermediate rate (Scotland), per gov.uk/marriage-allowance
const RECIPIENT_LIMIT = { ruk: 50_270, scotland: 43_662 }

type Region = keyof typeof RECIPIENT_LIMIT

// Income tax on income up to the recipient limit (full Personal Allowance).
// Scottish starter 19% to £3,967 of taxable income, basic 20% to £16,956, then 21%.
function taxBelowHigherRate(income: number, allowance: number, region: Region): number {
  const taxable = Math.max(0, income - allowance)
  if (region === 'ruk') return taxable * 0.20
  return Math.min(taxable, 3_967) * 0.19 +
    Math.max(0, Math.min(taxable, 16_956) - 3_967) * 0.20 +
    Math.max(0, taxable - 16_956) * 0.21
}

function calculate(income1: number, income2: number, region: Region = 'ruk') {
  const lowerEarner = Math.min(income1, income2)
  const higherEarner = Math.max(income1, income2)
  const limit = RECIPIENT_LIMIT[region]

  const lowerEarnerEligible = lowerEarner <= PA
  const higherEarnerEligible = higherEarner > PA && higherEarner <= limit

  const eligible = lowerEarnerEligible && higherEarnerEligible

  // The £252 is a tax reduction, so it cannot exceed the recipient's tax bill.
  const recipientSaving = eligible ? Math.min(MAX_SAVING, taxBelowHigherRate(higherEarner, PA, region)) : 0
  // The transferor's allowance falls to £11,310, so income above that is taxed.
  const transferorExtraTax = eligible ? taxBelowHigherRate(lowerEarner, TRANSFEROR_PA, region) : 0
  const saving = Math.max(0, recipientSaving - transferorExtraTax)

  return {
    eligible, lowerEarner, higherEarner, lowerEarnerEligible, higherEarnerEligible, limit,
    recipientSaving, transferorExtraTax, saving,
  }
}

export default function MarriageAllowanceCalculator() {
  const [income1, setIncome1] = useState('')
  const [income2, setIncome2] = useState('')
  const [region, setRegion] = useState<Region>('ruk')

  const i1 = parseFloat(income1.replace(/,/g, '')) || 0
  const i2 = parseFloat(income2.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(i1, i2, region), [i1, i2, region])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Annual Income</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={income1} onChange={(e) => setIncome1(e.target.value)} placeholder="10,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Annual Income" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Partner's Annual Income</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={income2} onChange={(e) => setIncome2(e.target.value)} placeholder="30,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Partner's Annual Income" /></div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Where do you pay tax?</label>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setRegion('ruk')} aria-pressed={region === 'ruk'} className={`px-3 py-3 rounded-xl text-sm font-medium border ${region === 'ruk' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>England, Wales &amp; NI</button>
          <button onClick={() => setRegion('scotland')} aria-pressed={region === 'scotland'} className={`px-3 py-3 rounded-xl text-sm font-medium border ${region === 'scotland' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Scotland</button>
        </div>
      </div>

      {(i1 > 0 || i2 > 0) && (
        <div className="space-y-4 animate-fade-in-up">
          {result.eligible ? (
            <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
              <p className="text-sm text-muted-foreground">You are eligible. Annual saving for the couple:</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.saving)}</p>
              <p className="text-sm text-muted-foreground mt-2">The lower earner transfers £{TRANSFER_AMOUNT.toLocaleString()} of their Personal Allowance to the higher earner.</p>
              <div className="text-sm text-muted-foreground mt-2 space-y-1">
                <p>Recipient's tax falls by {formatCurrency(result.recipientSaving)}{result.recipientSaving < MAX_SAVING ? ` (capped at their tax bill, the maximum is ${formatCurrency(MAX_SAVING)})` : ''}.</p>
                {result.transferorExtraTax > 0 && (
                  <p>The lower earner's allowance drops to £{TRANSFEROR_PA.toLocaleString()}, so they pay {formatCurrency(result.transferorExtraTax)} more tax.</p>
                )}
                {result.saving <= 0 && <p className="font-medium text-foreground">The transfer gains nothing overall at these incomes.</p>}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-destructive/10 p-6 text-center">
              <p className="text-lg font-bold text-destructive">Not Eligible</p>
              <div className="text-sm text-muted-foreground mt-2 space-y-1">
                {!result.lowerEarnerEligible && <p>The lower earner must earn less than £{PA.toLocaleString()} (Personal Allowance).</p>}
                {!result.higherEarnerEligible && (
                  <p>{region === 'scotland'
                    ? `The higher earner must pay the starter, basic or intermediate rate (earn between £${(PA + 1).toLocaleString()} and £${result.limit.toLocaleString()}).`
                    : `The higher earner must be a basic rate taxpayer (earn between £${(PA + 1).toLocaleString()} and £${result.limit.toLocaleString()}).`}</p>
                )}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Marriage Allowance conditions:</p>
            <p>You must be married or in a civil partnership.</p>
            <p>One partner earns less than £{PA.toLocaleString()} (Personal Allowance).</p>
            <p>The other partner pays basic rate (earns up to £{RECIPIENT_LIMIT.ruk.toLocaleString()}), or in Scotland the starter, basic or intermediate rate (up to £{RECIPIENT_LIMIT.scotland.toLocaleString()}).</p>
            <p>You can backdate a claim to 6 April 2022: four earlier tax years worth up to £1,008, on top of £252 for this year.</p>
          </div>
        </div>
      )}
    </div>
  )
}
