import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// PAYE refund estimator 2026/27. Cumulative PAYE assumes your year-to-date pay
// continues all year; stop working mid-year (redundancy, career break, study,
// retirement) and you have usually overpaid. Compare tax actually deducted
// with tax due on what the full year will really total.
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

const REBATE_CHECKLIST = [
  { label: 'Uniform / work clothing flat-rate allowance', detail: '£60–£140/year depending on trade — claim 4 back years', href: null },
  { label: 'Business mileage paid below 55p/mile', detail: 'Claim relief on the shortfall vs HMRC approved rates', href: '/calculator/mileage-allowance-calculator/' },
  { label: 'Working-from-home relief', detail: '£6/week if required to work from home', href: '/calculator/work-from-home-tax-relief-calculator/' },
  { label: 'Marriage Allowance not claimed', detail: 'Up to £252/year, backdatable 4 years', href: '/calculator/marriage-allowance-calculator/' },
  { label: 'Professional fees & subscriptions', detail: 'HMRC-approved bodies (e.g. NMC, UNISON sections)', href: null },
  { label: 'Emergency tax on a pension withdrawal', detail: 'Month-1 code over-taxes one-off withdrawals', href: '/calculator/pension-emergency-tax-calculator/' },
]

function calculate(paidToDate: number, taxToDate: number, furtherIncome: number, region: Region) {
  if (paidToDate <= 0 && taxToDate <= 0) return null
  const annualTotal = paidToDate + furtherIncome
  const due = annualTax(annualTotal, region)
  const refund = taxToDate - due
  return { annualTotal, due, refund }
}

export default function TaxRefundCalculator() {
  const [paid, setPaid] = useState('18,000')
  const [tax, setTax] = useState('2,200')
  const [further, setFurther] = useState('0')
  const [region, setRegion] = useState<Region>('ruk')

  const p = parseFloat(paid.replace(/,/g, '')) || 0
  const t = parseFloat(tax.replace(/,/g, '')) || 0
  const f = parseFloat(further.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(p, t, f, region), [p, t, f, region])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Taxable Pay So Far This Year</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={paid} onChange={(e) => setPaid(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Taxable Pay So Far This Year" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">"Total pay to date" on your P45 or last payslip</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Tax Deducted So Far</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={tax} onChange={(e) => setTax(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Tax Deducted So Far" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">"Total tax to date" on the same document</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Further Taxable Income Expected by 5 April</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={further} onChange={(e) => setFurther(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Further Taxable Income Expected" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">0 if you've stopped working for the rest of the tax year</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setRegion('ruk')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${region === 'ruk' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>England, Wales &amp; NI</button>
        <button onClick={() => setRegion('scotland')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${region === 'scotland' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Scotland</button>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.refund > 0 ? 'bg-green-100/60 dark:bg-green-950/60' : 'bg-muted/50 border border-border'}`}>
            <p className="text-sm text-muted-foreground">{result.refund > 0 ? 'Estimated Tax Refund' : result.refund < 0 ? 'Estimated Underpayment' : 'Nothing Owed Either Way'}</p>
            <p className={`text-3xl font-bold mt-1 ${result.refund > 0 ? 'text-green-700 dark:text-green-400' : ''}`}>{formatCurrency(Math.abs(result.refund))}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Tax due on a full-year income of {formatCurrency(result.annualTotal)}: {formatCurrency(result.due)} · deducted so far: {formatCurrency(t)}
            </p>
          </div>

          {result.refund > 0 && (
            <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">How to claim</p>
              <p className="mt-1">
                Stopped working and not claiming benefits? Use form <strong>P50</strong> after 4 weeks out of work.
                Otherwise HMRC reconciles automatically after 5 April and sends a <strong>P800</strong> letter —
                claim the refund to your bank via your Personal Tax Account, or a cheque follows.
                Refunds can be claimed for the current year plus the previous <strong>4 tax years</strong>.
              </p>
            </div>
          )}

          <div className="rounded-xl border border-border p-4">
            <p className="text-sm font-medium mb-2">Also commonly owed — check these:</p>
            <ul className="space-y-2">
              {REBATE_CHECKLIST.map((r) => (
                <li key={r.label} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0"></span>
                  <span>
                    {r.href ? <a href={r.href} className="text-primary underline">{r.label}</a> : <span className="text-foreground">{r.label}</span>}
                    {' — '}{r.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
