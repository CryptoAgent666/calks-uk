import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const PA = 12_570
const TRANSFER_AMOUNT = 1_260
const BASIC_LIMIT = 50_270
const TAX_SAVING = TRANSFER_AMOUNT * 0.20 // £252

function calculate(income1: number, income2: number) {
  const lowerEarner = Math.min(income1, income2)
  const higherEarner = Math.max(income1, income2)

  const lowerEarnerEligible = lowerEarner <= PA
  const higherEarnerEligible = higherEarner > PA && higherEarner <= BASIC_LIMIT

  const eligible = lowerEarnerEligible && higherEarnerEligible

  return { eligible, lowerEarner, higherEarner, lowerEarnerEligible, higherEarnerEligible, saving: eligible ? TAX_SAVING : 0 }
}

export default function MarriageAllowanceCalculator() {
  const [income1, setIncome1] = useState('')
  const [income2, setIncome2] = useState('')

  const i1 = parseFloat(income1.replace(/,/g, '')) || 0
  const i2 = parseFloat(income2.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(i1, i2), [i1, i2])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Annual Income</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={income1} onChange={(e) => setIncome1(e.target.value)} placeholder="10,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Partner's Annual Income</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={income2} onChange={(e) => setIncome2(e.target.value)} placeholder="30,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
      </div>

      {(i1 > 0 || i2 > 0) && (
        <div className="space-y-4 animate-fade-in-up">
          {result.eligible ? (
            <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
              <p className="text-sm text-muted-foreground">You are eligible! Annual tax saving:</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.saving)}</p>
              <p className="text-sm text-muted-foreground mt-2">The lower earner transfers £{TRANSFER_AMOUNT.toLocaleString()} of their Personal Allowance to the higher earner.</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-destructive/10 p-6 text-center">
              <p className="text-lg font-bold text-destructive">Not Eligible</p>
              <div className="text-sm text-muted-foreground mt-2 space-y-1">
                {!result.lowerEarnerEligible && <p>The lower earner must earn less than £{PA.toLocaleString()} (Personal Allowance).</p>}
                {!result.higherEarnerEligible && <p>The higher earner must be a basic rate taxpayer (earn between £{PA.toLocaleString()} and £{BASIC_LIMIT.toLocaleString()}).</p>}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Marriage Allowance conditions:</p>
            <p>You must be married or in a civil partnership.</p>
            <p>One partner earns less than £{PA.toLocaleString()} (Personal Allowance).</p>
            <p>The other partner is a basic rate taxpayer (earns up to £{BASIC_LIMIT.toLocaleString()}).</p>
            <p>You can backdate claims for up to 4 tax years.</p>
          </div>
        </div>
      )}
    </div>
  )
}
