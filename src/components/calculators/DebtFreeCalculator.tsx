import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type Strategy = 'avalanche' | 'snowball'

interface DebtRow { id: number; name: string; balance: string; apr: string; minimum: string }
interface Debt { name: string; balance: number; apr: number; minimum: number }

const MAX_MONTHS = 600

const STRATEGIES: { key: Strategy; label: string; hint: string }[] = [
  { key: 'avalanche', label: 'Avalanche', hint: 'Highest APR first' },
  { key: 'snowball', label: 'Snowball', hint: 'Smallest balance first' },
]

const DEFAULT_ROWS: DebtRow[] = [
  { id: 1, name: 'Credit card', balance: '4000', apr: '21', minimum: '100' },
  { id: 2, name: 'Personal loan', balance: '6000', apr: '8', minimum: '150' },
  { id: 3, name: 'Car finance', balance: '3000', apr: '5', minimum: '120' },
]

function parseAmount(value: string) {
  return parseFloat(value.replace(/,/g, '')) || 0
}

// Month-by-month payoff. Interest is added at each debt's effective monthly rate,
// (1 + APR)^(1/12) - 1; minimums are paid on every debt (never more than its balance),
// then everything left in the budget, including minimums freed up by cleared debts,
// goes to the target debt: highest APR first (avalanche) or smallest balance first (snowball).
function simulate(debts: Debt[], budget: number, strategy: Strategy) {
  const balances = debts.map((d) => d.balance)
  const rates = debts.map((d) => Math.pow(1 + d.apr / 100, 1 / 12) - 1)
  const order = debts.map((_, i) => i).sort((a, b) => strategy === 'avalanche'
    ? (debts[b].apr - debts[a].apr) || (debts[a].balance - debts[b].balance)
    : (debts[a].balance - debts[b].balance) || (debts[b].apr - debts[a].apr))
  const payoff: { name: string; month: number }[] = []
  const cleared = debts.map(() => false)
  let months = 0
  let totalInterest = 0

  while (balances.some((b) => b > 0) && months < MAX_MONTHS) {
    months++
    for (let i = 0; i < balances.length; i++) {
      if (balances[i] <= 0) continue
      const interest = balances[i] * rates[i]
      balances[i] += interest
      totalInterest += interest
    }
    let available = budget
    for (let i = 0; i < balances.length; i++) {
      if (balances[i] <= 0) continue
      const pay = Math.min(debts[i].minimum, balances[i], available)
      balances[i] -= pay
      available -= pay
    }
    for (const i of order) {
      if (available <= 0) break
      if (balances[i] <= 0) continue
      const pay = Math.min(balances[i], available)
      balances[i] -= pay
      available -= pay
    }
    for (const i of order) {
      if (!cleared[i] && balances[i] < 0.005) {
        balances[i] = 0
        cleared[i] = true
        payoff.push({ name: debts[i].name, month: months })
      }
    }
  }

  const repaid = balances.every((b) => b <= 0)
  const totalBalance = debts.reduce((s, d) => s + d.balance, 0)
  return { strategy, months, totalInterest, totalPaid: totalBalance + totalInterest, payoff, repaid }
}

function calculate(debts: Debt[], budget: number) {
  const active = debts.filter((d) => d.balance > 0)
  if (active.length === 0 || budget <= 0) return null
  const minimums = active.reduce((s, d) => s + Math.min(d.minimum, d.balance), 0)
  const firstInterest = active.reduce((s, d) => s + d.balance * (Math.pow(1 + d.apr / 100, 1 / 12) - 1), 0)
  if (budget < minimums) return { error: 'minimums' as const, minimums, firstInterest }
  if (budget <= firstInterest) return { error: 'interest' as const, minimums, firstInterest }
  return {
    error: null,
    minimums,
    firstInterest,
    avalanche: simulate(active, budget, 'avalanche'),
    snowball: simulate(active, budget, 'snowball'),
  }
}

function compareStrategies(avalanche: { months: number; totalInterest: number }, snowball: { months: number; totalInterest: number }) {
  const saving = snowball.totalInterest - avalanche.totalInterest
  if (Math.abs(saving) < 0.005) return 'Both strategies cost the same here, because they clear the debts in the same order.'
  const [winner, loser, w, l] = saving > 0 ? ['Avalanche', 'snowball', avalanche, snowball] as const : ['Snowball', 'avalanche', snowball, avalanche] as const
  const monthsSaved = l.months - w.months
  const time = monthsSaved > 0 ? ` and ${monthsSaved} month${monthsSaved !== 1 ? 's' : ''}` : ''
  return `${winner} saves ${formatCurrency(Math.abs(saving))} in interest${time} compared with ${loser}.`
}

function formatDuration(months: number) {
  const years = Math.floor(months / 12)
  const rem = months % 12
  const parts: string[] = []
  if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`)
  if (rem > 0 || years === 0) parts.push(`${rem} month${rem !== 1 ? 's' : ''}`)
  return parts.join(' ')
}

export default function DebtFreeCalculator() {
  const [rows, setRows] = useState<DebtRow[]>(DEFAULT_ROWS)
  const [budget, setBudget] = useState('500')
  const [strategy, setStrategy] = useState<Strategy>('avalanche')

  const debts = useMemo(() => rows.map((r, i) => ({
    name: r.name.trim() || `Debt ${i + 1}`,
    balance: parseAmount(r.balance),
    apr: parseFloat(r.apr) || 0,
    minimum: parseAmount(r.minimum),
  })), [rows])
  const b = parseAmount(budget)
  const result = useMemo(() => calculate(debts, b), [debts, b])

  const updateRow = (id: number, field: keyof Omit<DebtRow, 'id'>, value: string) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  const addRow = () => setRows((prev) => [...prev, { id: Math.max(0, ...prev.map((r) => r.id)) + 1, name: '', balance: '', apr: '', minimum: '' }])
  const removeRow = (id: number) => setRows((prev) => prev.filter((r) => r.id !== id))

  const plans = result && result.error === null ? { avalanche: result.avalanche, snowball: result.snowball } : null
  const chosen = plans ? plans[strategy] : null

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Your debts</h3><button onClick={addRow} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">+ Add debt</button></div>
        {rows.map((r, i) => (
          <div key={r.id} className="grid grid-cols-2 sm:grid-cols-[1.4fr_1fr_0.8fr_1fr_auto] gap-2 items-end rounded-xl border border-border p-3">
            <div className="col-span-2 sm:col-span-1"><label className="block text-xs text-muted-foreground mb-1">Name</label><input type="text" value={r.name} onChange={(e) => updateRow(r.id, 'name', e.target.value)} placeholder={`Debt ${i + 1}`} className="w-full rounded-lg border border-input bg-background px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label={`Debt ${i + 1} name`} /></div>
            <div><label className="block text-xs text-muted-foreground mb-1">Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={r.balance} onChange={(e) => updateRow(r.id, 'balance', e.target.value)} className="w-full rounded-lg border border-input bg-background pl-7 pr-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label={`Debt ${i + 1} balance`} /></div></div>
            <div><label className="block text-xs text-muted-foreground mb-1">APR (%)</label><input type="number" min="0" max="100" step="0.1" value={r.apr} onChange={(e) => updateRow(r.id, 'apr', e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label={`Debt ${i + 1} APR`} /></div>
            <div><label className="block text-xs text-muted-foreground mb-1">Minimum / month</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={r.minimum} onChange={(e) => updateRow(r.id, 'minimum', e.target.value)} className="w-full rounded-lg border border-input bg-background pl-7 pr-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label={`Debt ${i + 1} minimum monthly payment`} /></div></div>
            <div className="flex justify-end"><button onClick={() => removeRow(r.id)} disabled={rows.length <= 1} className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-accent disabled:opacity-40" aria-label={`Remove debt ${i + 1}`}>Remove</button></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Total Monthly Budget</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Total Monthly Budget" /></div>{result && <p className="text-xs text-muted-foreground mt-1">Minimum payments total {formatCurrency(result.minimums)} a month</p>}</div>
        <div><label className="block text-sm font-medium mb-2">Strategy</label><div className="grid grid-cols-2 gap-2">{STRATEGIES.map((s) => (
          <button key={s.key} onClick={() => setStrategy(s.key)} className={`px-4 py-2.5 rounded-xl text-sm text-left border transition-colors ${strategy === s.key ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}><span className="block font-medium">{s.label}</span><span className="block text-xs opacity-80">{s.hint}</span></button>
        ))}</div></div>
      </div>

      {result && result.error === 'minimums' && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
          Your budget must at least cover the minimum payments of {formatCurrency(result.minimums)} a month.
        </div>
      )}
      {result && result.error === 'interest' && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
          Never repaid: this budget does not exceed the {formatCurrency(result.firstInterest)} of interest added each month, so the debts would not go down. Increase the budget or get free debt advice.
        </div>
      )}
      {plans && chosen && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Debt-Free In ({chosen.strategy})</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{chosen.repaid ? formatDuration(chosen.months) : 'Not within 50 years'}</p>
            {chosen.repaid && <p className="text-sm text-muted-foreground mt-1">Total interest {formatCurrency(chosen.totalInterest)}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[plans.avalanche, plans.snowball].map((s) => (
              <div key={s.strategy} className={`rounded-xl border p-4 ${s.strategy === strategy ? 'border-primary bg-primary/10' : 'border-border bg-muted/50'}`}>
                <p className="text-sm font-semibold">{s.strategy === 'avalanche' ? 'Avalanche (highest APR first)' : 'Snowball (smallest balance first)'}</p>
                <table className="w-full text-sm mt-2">
                  <tbody>
                    <tr className="border-b border-border/50"><td className="py-2">Debt-free in</td><td className="text-right tabular-nums font-medium">{s.repaid ? `${s.months} months` : `Not within ${MAX_MONTHS} months`}</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2">Total interest</td><td className="text-right tabular-nums font-medium">{formatCurrency(s.totalInterest)}</td></tr>
                    <tr><td className="py-2">Total paid</td><td className="text-right tabular-nums font-medium">{formatCurrency(s.totalPaid)}</td></tr>
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground mt-2 mb-1">Payoff order</p>
                <ol className="text-sm space-y-0.5 list-decimal list-inside">
                  {s.payoff.map((p, i) => <li key={i}>{p.name} <span className="text-muted-foreground">(month {p.month})</span></li>)}
                </ol>
              </div>
            ))}
          </div>
          {plans.avalanche.repaid && plans.snowball.repaid && (
            <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
              <p>{compareStrategies(plans.avalanche, plans.snowball)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
