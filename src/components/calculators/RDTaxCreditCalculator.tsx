import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// R&D relief for accounting periods starting on or after 1 April 2024: the merged
// expenditure credit scheme, plus Enhanced R&D Intensive Support (ERIS) for loss-making
// SMEs whose R&D is at least 30% of total expenditure.
const RDEC_RATE = 0.20          // taxable expenditure credit on qualifying spend
const CORP_TAX_RATE = 0.25      // main rate on a profit-making company's credit -> 15p per £1
const NOTIONAL_TAX_RATE = 0.19  // small profits rate, for small profit-makers and loss-makers -> 16.2p per £1
const ERIS_ADDITIONAL = 0.86    // extra deduction, so the surrenderable loss is up to 186% of costs
const ERIS_CREDIT_RATE = 0.145  // payable credit on the surrendered loss -> about 27p per £1
// A payable credit (loss-maker or ERIS) is limited to £20,000 plus 300% of the company's PAYE and
// NIC liabilities for the period, unless the company is exempt (CTA09/S1112E). Under the merged scheme
// the excess is carried forward as expenditure credit; under ERIS a claim above the cap is invalid.
const PAYE_CAP_BASE = 20_000
const PAYE_CAP_MULTIPLE = 3

type CompanyType = 'profitable' | 'small_profit' | 'loss_making' | 'eris'

function calculate(qualifyingSpend: number, companyType: CompanyType, payeNic: number | null) {
  let uncapped: number
  let method: string
  if (companyType === 'eris') {
    const surrenderableLoss = qualifyingSpend * (1 + ERIS_ADDITIONAL)
    uncapped = surrenderableLoss * ERIS_CREDIT_RATE
    method = `ERIS payable credit: 14.5% of up to ${formatCurrency(surrenderableLoss)} of surrendered loss`
  } else {
    const credit = qualifyingSpend * RDEC_RATE
    const taxOnCredit = credit * (companyType === 'profitable' ? CORP_TAX_RATE : NOTIONAL_TAX_RATE)
    uncapped = credit - taxOnCredit
    method = companyType === 'profitable'
      ? `Merged scheme credit of ${formatCurrency(credit)}, less 25% tax`
      : companyType === 'small_profit'
        ? `Merged scheme credit of ${formatCurrency(credit)}, less 19% tax`
        : `Merged scheme credit of ${formatCurrency(credit)}, less 19% notional tax, paid in cash`
  }

  // The PAYE/NIC cap only limits a PAYABLE credit; a profitable company sets its credit against tax
  const payable = companyType === 'loss_making' || companyType === 'eris'
  const payeCap = payable && payeNic !== null ? PAYE_CAP_BASE + PAYE_CAP_MULTIPLE * payeNic : null
  const capped = payeCap !== null && uncapped > payeCap
  const netBenefit = capped && payeCap !== null ? payeCap : uncapped
  const excess = capped ? uncapped - netBenefit : 0
  const rate = qualifyingSpend > 0 ? (netBenefit / qualifyingSpend) * 100 : 0
  return { netBenefit, uncapped, payeCap, capped, excess, payable, rate, method }
}

export default function RDTaxCreditCalculator() {
  const [spend, setSpend] = useState('100000')
  const [type, setType] = useState<CompanyType>('profitable')
  const [payeNic, setPayeNic] = useState('')

  const s = Math.max(0, parseFloat(spend.replace(/,/g, '')) || 0)
  // Blank means "do not apply the cap"; any figure (including 0) applies it
  const p = payeNic.trim() === '' ? null : Math.max(0, parseFloat(payeNic.replace(/,/g, '')) || 0)
  const result = useMemo(() => calculate(s, type, p), [s, type, p])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Qualifying R&D Spend</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={spend} onChange={(e) => setSpend(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Qualifying R&D Spend" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Company Status</label><select value={type} onChange={(e) => setType(e.target.value as CompanyType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Company Status"><option value="profitable">Profitable, Main Rate (25%)</option><option value="small_profit">Profitable, Small Profits Rate (19%)</option><option value="loss_making">Loss-Making</option><option value="eris">Loss-Making, R&D-Intensive (ERIS)</option></select></div>
      </div>
      {result.payable && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">PAYE and NIC paid in the period (optional)</label>
            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={payeNic} onChange={(e) => setPayeNic(e.target.value)} placeholder="Leave blank to ignore the cap" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="PAYE and NIC paid in the period (optional)" /></div>
            <p className="text-xs text-muted-foreground mt-1">A payable credit is capped at £20,000 plus 300% of the company's PAYE and NIC for the period. Leave this blank if the company is exempt from the cap (see below).</p>
          </div>
        </div>
      )}

      {s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated R&D Tax Benefit</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.netBenefit)}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.method} ({result.rate.toFixed(1)}% of spend)</p>
          </div>
          {result.capped && result.payeCap !== null && (
            <p className="text-sm text-muted-foreground" role="status">Capped by the PAYE and NIC limit: £20,000 + 300% × {formatCurrency(p ?? 0)} = {formatCurrency(result.payeCap)}. The uncapped credit was {formatCurrency(result.uncapped)}. {type === 'eris' ? <>Under ERIS a claim above the cap is invalid, so claim no more than the cap: the {formatCurrency(result.excess)} excess is not carried forward as credit.</> : <>Under the merged scheme the {formatCurrency(result.excess)} excess is carried forward as expenditure credit for the next accounting period.</>}</p>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">How it works (accounting periods from 1 April 2024):</p>
            <p className="mt-1">Merged scheme: a {RDEC_RATE * 100}% expenditure credit on qualifying spend. The credit is taxable, so a profit-making company keeps 15p per £1 at the 25% main rate, or 16.2p at the 19% small profits rate, and a loss-maker receives 16.2p per £1 in cash after 19% notional tax. A company in the marginal relief band keeps a little less than 15p, because its marginal Corporation Tax rate is above 25%.</p>
            <p>ERIS: loss-making SMEs spending at least 30% of total expenditure on R&D can surrender a loss of up to 186% of qualifying costs for a 14.5% payable credit, about 27p per £1. This assumes the trading loss is at least that large.</p>
            <p className="mt-1">Payable credits are capped at £20,000 plus 300% of the company's PAYE and NIC liabilities. A company is exempt if its employees create or manage relevant intellectual property and connected-party subcontractors and agency workers are no more than 15% of its qualifying spend. Qualifying costs: staff, subcontractors, consumables, software, data licences, cloud computing used for R&D. Grants and subsidies do not reduce them.</p>
          </div>
        </div>
      )}
    </div>
  )
}
