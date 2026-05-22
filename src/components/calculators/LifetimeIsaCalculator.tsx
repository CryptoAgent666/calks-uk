import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const LISA_ANNUAL_LIMIT = 4_000
const LISA_BONUS_PCT = 0.25
const LISA_MAX_AGE = 50 // can contribute until 50

function calculate(monthlyDeposit: number, currentAge: number, currentBalance: number, growthRate: number, purpose: string) {
  const yearlyDeposit = Math.min(monthlyDeposit * 12, LISA_ANNUAL_LIMIT)
  const yearlyBonus = yearlyDeposit * LISA_BONUS_PCT
  const monthlyGrowth = growthRate / 100 / 12
  const yearsContributing = Math.max(0, LISA_MAX_AGE - currentAge)

  let balance = currentBalance
  let totalDeposits = currentBalance
  let totalBonus = 0

  for (let y = 0; y < yearsContributing; y++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyGrowth) + Math.min(monthlyDeposit, LISA_ANNUAL_LIMIT / 12)
    }
    const bonus = Math.min(monthlyDeposit * 12, LISA_ANNUAL_LIMIT) * LISA_BONUS_PCT
    balance += bonus
    totalDeposits += yearlyDeposit
    totalBonus += bonus
  }

  // No penalty applies for qualifying use (first home or age 60+ retirement)
  const totalGrowth = balance - totalDeposits - totalBonus

  return { balance, totalDeposits, totalBonus, totalGrowth, yearsContributing, yearlyDeposit, yearlyBonus }
}

export default function LifetimeIsaCalculator() {
  const [monthly, setMonthly] = useState('333')
  const [age, setAge] = useState('25')
  const [current, setCurrent] = useState('0')
  const [growth, setGrowth] = useState('5')
  const [purpose, setPurpose] = useState('property')

  const m = parseFloat(monthly.replace(/,/g,'')) || 0
  const a = parseInt(age) || 25
  const c = parseFloat(current.replace(/,/g,'')) || 0
  const g = parseFloat(growth) || 0
  const result = useMemo(() => calculate(m, a, c, g, purpose), [m, a, c, g, purpose])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setPurpose('property')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${purpose === 'property' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>First Home</button>
        <button onClick={() => setPurpose('retirement')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${purpose === 'retirement' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Retirement (60+)</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Monthly Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Deposit" /></div><p className="text-xs text-muted-foreground mt-1">Max £{(LISA_ANNUAL_LIMIT/12).toFixed(0)}/month</p></div>
        <div><label className="block text-sm font-medium mb-2">Your Age</label><input type="number" min="18" max="49" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Age" /></div>
        <div><label className="block text-sm font-medium mb-2">Current Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current Balance" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Growth Rate (%)</label><input type="number" min="0" max="10" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Growth Rate (%)" /></div>
      </div>

      {m > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Projected LISA Balance at 50</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.balance)}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.yearsContributing} years of contributions</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Your Deposits</p><p className="text-lg font-bold">{formatCurrency(result.totalDeposits)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Government Bonus (25%)</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalBonus)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Investment Growth</p><p className="text-lg font-bold">{formatCurrency(result.totalGrowth)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>LISA: 25% government bonus on up to £4,000/year. Must be 18-39 to open. Use for first home (up to £450,000) or retirement (age 60+). Early withdrawal for other reasons incurs a 25% penalty.</p>
          </div>
        </div>
      )}
    </div>
  )
}
