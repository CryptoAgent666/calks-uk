import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(debts: { balance: number; apr: number; monthly: number }[], consolidationApr: number, consolidationTerm: number) {
  // Current situation
  let totalBalance = 0
  let totalMonthly = 0
  let totalInterest = 0

  debts.forEach(d => {
    totalBalance += d.balance
    totalMonthly += d.monthly
    // Estimate total interest on each debt
    const monthlyRate = d.apr / 100 / 12
    let bal = d.balance
    let interest = 0
    let months = 0
    while (bal > 0 && months < 360) {
      const int = bal * monthlyRate
      interest += int
      bal = bal + int - d.monthly
      months++
    }
    totalInterest += interest
  })

  // Consolidated loan
  const consMonthlyRate = consolidationApr / 100 / 12
  const consPayments = consolidationTerm * 12
  const consMonthly = consMonthlyRate > 0 ? totalBalance * (consMonthlyRate * Math.pow(1 + consMonthlyRate, consPayments)) / (Math.pow(1 + consMonthlyRate, consPayments) - 1) : totalBalance / consPayments
  const consTotalPaid = consMonthly * consPayments
  const consInterest = consTotalPaid - totalBalance

  const monthlySaving = totalMonthly - consMonthly
  const interestSaving = totalInterest - consInterest

  return { totalBalance, totalMonthly, totalInterest, consMonthly, consTotalPaid, consInterest, monthlySaving, interestSaving, savesInterest: interestSaving > 0 }
}

export default function DebtConsolidationCalculator() {
  const [debts, setDebts] = useState([
    { balance: 3000, apr: 22.9, monthly: 100 },
    { balance: 2000, apr: 18.9, monthly: 80 },
    { balance: 1500, apr: 39.9, monthly: 50 },
  ])
  const [consApr, setConsApr] = useState('6.9')
  const [consTerm, setConsTerm] = useState('5')

  const addDebt = () => setDebts([...debts, { balance: 0, apr: 0, monthly: 0 }])
  const removeDebt = (i: number) => setDebts(debts.filter((_, idx) => idx !== i))
  const updateDebt = (i: number, field: string, value: number) => setDebts(debts.map((d, idx) => idx === i ? { ...d, [field]: value } : d))

  const a = parseFloat(consApr) || 0
  const t = parseInt(consTerm) || 5
  const result = useMemo(() => calculate(debts.filter(d => d.balance > 0), a, t), [debts, a, t])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Current Debts</h3><button onClick={addDebt} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">+ Add Debt</button></div>
      <div className="space-y-2">
        {debts.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="relative flex-1"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input type="number" min="0" value={d.balance || ''} onChange={(e) => updateDebt(i, 'balance', parseFloat(e.target.value)||0)} placeholder="Balance" className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <input type="number" min="0" max="50" step="0.1" value={d.apr || ''} onChange={(e) => updateDebt(i, 'apr', parseFloat(e.target.value)||0)} placeholder="APR%" className="w-20 rounded-lg border border-input bg-background px-2 py-2 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
            <div className="relative w-24"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input type="number" min="0" value={d.monthly || ''} onChange={(e) => updateDebt(i, 'monthly', parseFloat(e.target.value)||0)} placeholder="Monthly" className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <button onClick={() => removeDebt(i)} className="px-2 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-sm">x</button>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-semibold">Consolidation Loan</h3>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Consolidation APR (%)</label><input type="number" min="0" max="30" step="0.1" value={consApr} onChange={(e) => setConsApr(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Term (years)</label><input type="number" min="1" max="10" value={consTerm} onChange={(e) => setConsTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {result.totalBalance > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4 text-center"><p className="text-sm font-medium">Current Debts</p><p className="text-xl font-bold mt-1">{formatCurrency(result.totalMonthly)}/month</p><p className="text-xs text-muted-foreground">Interest: {formatCurrency(result.totalInterest)}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.monthlySaving > 0 ? 'bg-green-100 dark:bg-green-950' : 'border border-border'}`}><p className="text-sm font-medium">Consolidated</p><p className="text-xl font-bold mt-1">{formatCurrency(result.consMonthly)}/month</p><p className="text-xs text-muted-foreground">Interest: {formatCurrency(result.consInterest)}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl p-4 text-center ${result.monthlySaving > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Monthly Saving</p><p className={`text-xl font-bold ${result.monthlySaving > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(result.monthlySaving)}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.savesInterest ? 'bg-green-100 dark:bg-green-950' : 'bg-orange-100 dark:bg-orange-950'}`}><p className="text-xs text-muted-foreground">Interest {result.savesInterest ? 'Saved' : 'Extra'}</p><p className={`text-xl font-bold ${result.savesInterest ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'}`}>{formatCurrency(Math.abs(result.interestSaving))}</p></div>
          </div>
          {!result.savesInterest && <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-sm text-orange-800 dark:text-orange-300">Lower monthly payment but MORE total interest. You'll pay {formatCurrency(Math.abs(result.interestSaving))} extra over the term. Consider a shorter term or higher monthly payment.</div>}
        </div>
      )}
    </div>
  )
}
