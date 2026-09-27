import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type Plan = 'pay3' | 'pay4' | 'financing'

// perMonth = most instalments that can fall in one calendar month (Pay in 4 is collected every 2 weeks).
const PLANS: Record<Plan, { name: string; instalments: number; perMonth: number }> = {
  pay3: { name: 'Pay in 3 (monthly, interest-free)', instalments: 3, perMonth: 1 },
  pay4: { name: 'Pay in 4 (every 2 weeks, interest-free)', instalments: 4, perMonth: 2 },
  financing: { name: 'Monthly financing (with interest)', instalments: 12, perMonth: 1 },
}

// Section 75 of the Consumer Credit Act covers single items with a cash price over £100 and up to £30,000.
// It applies to BNPL (deferred payment credit) agreements made from 15 July 2026, when FCA regulation began.
const S75_MIN = 100
const S75_MAX = 30_000

function calculate(amount: number, plan: Plan, customInstalments: number, customApr: number, lateFee = 6, missed = 0, otherMonthly = 0) {
  const info = PLANS[plan]
  const instalments = plan === 'financing' ? Math.max(1, customInstalments) : info.instalments
  const apr = plan === 'financing' ? customApr : 0
  const monthlyRate = Math.pow(1 + apr / 100, 1 / 12) - 1

  const payment = monthlyRate > 0
    ? amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -instalments))
    : amount / instalments
  const totalPaid = payment * instalments
  const interest = totalPaid - amount
  const missedCount = Math.min(Math.max(0, missed), instalments)
  const lateFees = lateFee * missedCount
  const totalWithFees = totalPaid + lateFees
  const monthlyCommitment = payment * Math.min(info.perMonth, instalments)
  const combinedMonthly = monthlyCommitment + otherMonthly
  const section75 = amount > S75_MIN && amount <= S75_MAX

  return { payment, totalPaid, interest, instalments, lateFees, totalWithFees, monthlyCommitment, combinedMonthly, section75, hasInterest: apr > 0 }
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'
const moneyClass = 'w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function BNPLCalculator() {
  const [amount, setAmount] = useState('200')
  const [plan, setPlan] = useState<Plan>('pay3')
  const [customInst, setCustomInst] = useState('12')
  const [customApr, setCustomApr] = useState('18.9')
  const [lateFee, setLateFee] = useState('6')
  const [missed, setMissed] = useState('0')
  const [other, setOther] = useState('0')

  const a = parseFloat(amount.replace(/,/g, '')) || 0
  const lf = parseFloat(lateFee.replace(/,/g, '')) || 0
  const ms = parseInt(missed) || 0
  const ot = parseFloat(other.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(a, plan, parseInt(customInst) || 12, parseFloat(customApr) || 0, lf, ms, ot), [a, plan, customInst, customApr, lf, ms, ot])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Purchase Amount</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="200" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Purchase Amount" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Plan Type</label><select value={plan} onChange={(e) => setPlan(e.target.value as Plan)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Plan Type">
          {Object.entries(PLANS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
        </select></div>
      </div>

      {plan === 'financing' && (
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">Monthly Instalments</label><input type="number" min="2" max="36" value={customInst} onChange={(e) => setCustomInst(e.target.value)} className={inputClass} aria-label="Monthly Instalments" /></div>
          <div><label className="block text-sm font-medium mb-2">APR (%)</label><input type="number" min="0" max="50" step="0.1" value={customApr} onChange={(e) => setCustomApr(e.target.value)} className={inputClass} aria-label="APR (%)" /></div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Late Fee per Missed Payment</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={lateFee} onChange={(e) => setLateFee(e.target.value)} className={moneyClass} aria-label="Late Fee per Missed Payment" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Missed Payments</label><input type="number" min="0" max="36" value={missed} onChange={(e) => setMissed(e.target.value)} className={inputClass} aria-label="Missed Payments" /></div>
        <div><label className="block text-sm font-medium mb-2">Other BNPL Payments (£/month)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={other} onChange={(e) => setOther(e.target.value)} className={moneyClass} aria-label="Other BNPL Payments per month" /></div></div>
      </div>

      {a > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">{result.instalments} Payments of</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.payment)}</p>
            <p className="text-sm text-muted-foreground mt-1">Total with late fees: {formatCurrency(result.totalWithFees)}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total if Paid on Time</p><p className="text-lg font-bold">{formatCurrency(result.totalPaid)}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.interest > 0.005 ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}><p className="text-xs text-muted-foreground">Interest</p><p className={`text-lg font-bold ${result.interest > 0.005 ? 'text-destructive' : 'text-green-700 dark:text-green-400'}`}>{result.interest > 0.005 ? formatCurrency(result.interest) : 'FREE'}</p></div>
            <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-center"><p className="text-xs text-muted-foreground">Late Fees</p><p className="text-lg font-bold text-orange-700 dark:text-orange-400">{formatCurrency(result.lateFees)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">All BNPL, per Month</p><p className="text-lg font-bold">{formatCurrency(result.combinedMonthly)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
            <p>This purchase adds up to {formatCurrency(result.monthlyCommitment)} a month{PLANS[plan].perMonth > 1 ? ' (two fortnightly instalments can fall in the same month)' : ''}, taking your BNPL total to {formatCurrency(result.combinedMonthly)} a month.</p>
            <p>BNPL agreements made from 15 July 2026 are regulated by the FCA: the lender must check you can afford it, tell you the late fee before you sign and help if you struggle, and you can complain to the Financial Ombudsman. {result.section75 ? 'Section 75 protection also applies, as the item costs over £100 and no more than £30,000.' : 'Section 75 only covers items costing over £100 and up to £30,000.'} Agreements made before 15 July 2026 are not regulated. Missed payments can be reported to credit reference agencies.</p>
          </div>
        </div>
      )}
    </div>
  )
}
