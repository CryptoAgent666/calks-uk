import { useState } from 'react'
import { formatCurrency } from '@/utils'

const WEEKS_PER_TERM = 13
const TERMS = 3

export default function StudentBudgetPlannerCalculator() {
  const [loan, setLoan] = useState('10000')
  const [other, setOther] = useState('2000')
  const [rent, setRent] = useState('140')
  const [food, setFood] = useState('40')
  const [bills, setBills] = useState('15')
  const [transport, setTransport] = useState('15')
  const [social, setSocial] = useState('25')
  const [otherExp, setOtherExp] = useState('10')

  const totalIncome = (parseFloat(loan.replace(/,/g,''))||0) + (parseFloat(other.replace(/,/g,''))||0)
  const weeklyExpenses = [rent, food, bills, transport, social, otherExp].reduce((s, v) => s + (parseFloat(v)||0), 0)
  const termExpenses = weeklyExpenses * WEEKS_PER_TERM
  const annualExpenses = termExpenses * TERMS
  const surplus = totalIncome - annualExpenses
  const weeklyBudget = surplus > 0 ? surplus / (WEEKS_PER_TERM * TERMS) : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Maintenance Loan (annual)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={loan} onChange={(e) => setLoan(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Maintenance Loan (annual)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Other Income (job, parents)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={other} onChange={(e) => setOther(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Other Income (job, parents)" /></div></div>
      </div>
      <h3 className="text-sm font-semibold">Weekly Expenses (term time)</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[{l:'Rent',v:rent,s:setRent},{l:'Food',v:food,s:setFood},{l:'Bills',v:bills,s:setBills},{l:'Transport',v:transport,s:setTransport},{l:'Social',v:social,s:setSocial},{l:'Other',v:otherExp,s:setOtherExp}].map(i => (
          <div key={i.l}><label className="block text-xs text-muted-foreground mb-1">{i.l}/week</label><div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input type="number" min="0" value={i.v} onChange={(e) => i.s(e.target.value)} className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        ))}
      </div>

      <div className={`rounded-2xl p-6 text-center ${surplus >= 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
        <p className="text-sm text-muted-foreground">{surplus >= 0 ? 'Annual Surplus' : 'Annual Shortfall'}</p>
        <p className={`text-3xl font-bold mt-1 ${surplus >= 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(Math.abs(surplus))}</p>
        <p className="text-sm text-muted-foreground mt-1">Weekly spending: {formatCurrency(weeklyExpenses)} &middot; Extra budget: {formatCurrency(weeklyBudget)}/week</p>
      </div>
    </div>
  )
}
