import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type Debt = { balance: number; apr: number; monthly: number }

// A UK APR (or an overdraft EAR) is an annual effective rate, so the monthly rate is (1 + APR)^(1/12) - 1
function monthlyRateFromApr(apr: number) {
  return apr > 0 ? Math.pow(1 + apr / 100, 1 / 12) - 1 : 0
}

// Month-by-month payoff of one debt. A payment that does not cover the first month's interest never clears it.
function payOffDebt(balance: number, apr: number, monthly: number) {
  const rate = monthlyRateFromApr(apr)
  const firstMonthInterest = balance * rate
  if (balance > 0 && monthly <= firstMonthInterest) return { neverRepays: true, months: 0, interest: 0, firstMonthInterest }
  let bal = balance
  let interest = 0
  let months = 0
  while (bal > 0.005 && months < 1200) {
    const int = bal * rate
    interest += int
    bal = bal + int - Math.min(monthly, bal + int)
    months++
  }
  return { neverRepays: false, months, interest, firstMonthInterest }
}

function calculate(debts: Debt[], consolidationApr: number, consolidationTerm: number, arrangementFee = 0) {
  // Current situation
  let totalBalance = 0
  let totalMonthly = 0
  let totalInterest = 0
  let monthsToClear = 0
  const perDebt = debts.map(d => {
    totalBalance += d.balance
    totalMonthly += d.monthly
    const payoff = payOffDebt(d.balance, d.apr, d.monthly)
    if (!payoff.neverRepays) {
      totalInterest += payoff.interest
      monthsToClear = Math.max(monthsToClear, payoff.months)
    }
    return { ...d, ...payoff }
  })
  const anyNeverRepays = perDebt.some(d => d.neverRepays)

  // Consolidated loan
  const consMonthlyRate = monthlyRateFromApr(consolidationApr)
  const consPayments = consolidationTerm * 12
  const consMonthly = consMonthlyRate > 0 ? totalBalance * (consMonthlyRate * Math.pow(1 + consMonthlyRate, consPayments)) / (Math.pow(1 + consMonthlyRate, consPayments) - 1) : totalBalance / consPayments
  const consTotalPaid = consMonthly * consPayments
  const consInterest = consTotalPaid - totalBalance
  const consTotalCost = consInterest + arrangementFee

  const monthlySaving = totalMonthly - consMonthly
  // With a debt that never clears, current interest has no end, so the saving cannot be put as one figure
  const interestSaving = anyNeverRepays ? 0 : totalInterest - consTotalCost

  return { perDebt, anyNeverRepays, totalBalance, totalMonthly, totalInterest, monthsToClear, consMonthly, consTotalPaid, consInterest, consTotalCost, arrangementFee, monthlySaving, interestSaving, savesInterest: anyNeverRepays || interestSaving > 0 }
}

export default function DebtConsolidationCalculator() {
  const [debts, setDebts] = useState<Debt[]>([
    { balance: 3000, apr: 22.9, monthly: 69 },
    { balance: 2000, apr: 29.9, monthly: 50 },
    { balance: 3000, apr: 39.9, monthly: 100 },
  ])
  const [consApr, setConsApr] = useState('7.9')
  const [consTerm, setConsTerm] = useState('4')
  const [fee, setFee] = useState('0')

  const addDebt = () => setDebts([...debts, { balance: 0, apr: 0, monthly: 0 }])
  const removeDebt = (i: number) => setDebts(debts.filter((_, idx) => idx !== i))
  const updateDebt = (i: number, field: string, value: number) => setDebts(debts.map((d, idx) => idx === i ? { ...d, [field]: value } : d))

  const a = parseFloat(consApr) || 0
  const t = parseInt(consTerm) || 5
  const f = parseFloat(fee.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(debts.filter(d => d.balance > 0), a, t, f), [debts, a, t, f])
  const neverRepaid = debts.map((d, i) => ({ ...d, n: i + 1, ...payOffDebt(d.balance, d.apr, d.monthly) })).filter(d => d.balance > 0 && d.neverRepays)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Current Debts</h3><button onClick={addDebt} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">+ Add Debt</button></div>
      <div className="space-y-2">
        <div className="flex items-end gap-2 text-xs font-medium text-muted-foreground" aria-hidden="true">
          <span className="w-12">Debt</span>
          <span className="flex-1">Balance</span>
          <span className="w-20 text-center">APR %</span>
          <span className="w-24">Monthly payment</span>
          <span className="w-7" />
        </div>
        {debts.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-12 text-xs text-muted-foreground">#{i + 1}</span>
            <div className="relative flex-1"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input type="number" min="0" value={d.balance || ''} onChange={(e) => updateDebt(i, 'balance', parseFloat(e.target.value)||0)} placeholder="Balance" aria-label={`Debt ${i + 1} balance`} className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <input type="number" min="0" max="50" step="0.1" value={d.apr || ''} onChange={(e) => updateDebt(i, 'apr', parseFloat(e.target.value)||0)} placeholder="APR%" aria-label={`Debt ${i + 1} APR %`} className="w-20 rounded-lg border border-input bg-background px-2 py-2 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
            <div className="relative w-24"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input type="number" min="0" value={d.monthly || ''} onChange={(e) => updateDebt(i, 'monthly', parseFloat(e.target.value)||0)} placeholder="Monthly" aria-label={`Debt ${i + 1} monthly payment`} className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <button onClick={() => removeDebt(i)} aria-label={`Remove debt ${i + 1}`} className="w-7 px-2 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-sm">x</button>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-semibold">Consolidation Loan</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Consolidation APR (%)</label><input type="number" min="0" max="30" step="0.1" value={consApr} onChange={(e) => setConsApr(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Consolidation APR (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Term (years)</label><input type="number" min="1" max="10" value={consTerm} onChange={(e) => setConsTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Term (years)" /></div>
        <div><label className="block text-sm font-medium mb-2">Arrangement Fee (£, optional)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={fee} onChange={(e) => setFee(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Loan arrangement fee (£)" /></div></div>
      </div>

      {result.totalBalance > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          {neverRepaid.length > 0 && (
            <div role="alert" className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive space-y-1">
              {neverRepaid.map(d => <p key={d.n}>Debt {d.n}: {d.monthly > 0 ? `${formatCurrency(d.monthly)} a month does not cover the ${formatCurrency(d.firstMonthInterest)} of monthly interest` : 'no monthly payment is entered'}, so this debt would never be repaid at that payment.</p>)}
              <p>Current interest has no end point while that is the case, so the interest comparison below is left out.</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4 text-center"><p className="text-sm font-medium">Current Debts</p><p className="text-xl font-bold mt-1">{formatCurrency(result.totalMonthly)}/month</p><p className="text-xs text-muted-foreground">{result.anyNeverRepays ? 'Interest: never fully repaid' : `Interest: ${formatCurrency(result.totalInterest)} over ${result.monthsToClear} months`}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.monthlySaving > 0 ? 'bg-green-100 dark:bg-green-950' : 'border border-border'}`}><p className="text-sm font-medium">Consolidated</p><p className="text-xl font-bold mt-1">{formatCurrency(result.consMonthly)}/month</p><p className="text-xs text-muted-foreground">Interest: {formatCurrency(result.consInterest)} over {t * 12} months{result.arrangementFee > 0 ? ` + ${formatCurrency(result.arrangementFee)} fee` : ''}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl p-4 text-center ${result.monthlySaving > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Monthly Saving</p><p className={`text-xl font-bold ${result.monthlySaving > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(result.monthlySaving)}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.savesInterest ? 'bg-green-100 dark:bg-green-950' : 'bg-orange-100 dark:bg-orange-950'}`}><p className="text-xs text-muted-foreground">{result.arrangementFee > 0 ? 'Interest and Fees' : 'Interest'} {result.savesInterest ? 'Saved' : 'Extra'}</p><p className={`text-xl font-bold ${result.savesInterest ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'}`}>{result.anyNeverRepays ? 'n/a' : formatCurrency(Math.abs(result.interestSaving))}</p></div>
          </div>
          {!result.savesInterest && <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-sm text-orange-800 dark:text-orange-300">Lower monthly payment but MORE total interest. You'll pay {formatCurrency(Math.abs(result.interestSaving))} extra over the term. Consider a shorter term or higher monthly payment.</div>}
          <p className="text-xs text-muted-foreground">Current interest assumes you keep paying the amounts entered until each debt is cleared. APRs and overdraft EARs are converted to a monthly rate as annual effective rates. The arrangement fee is treated as paid upfront, not added to the loan. Check whether any existing loan charges an early repayment fee for settling it, and add that to the fee box.</p>
        </div>
      )}
    </div>
  )
}
