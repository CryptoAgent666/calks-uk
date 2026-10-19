import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Compares two ways of using cash that could clear the mortgage today:
//  A) repay now and pay the early repayment charge (ERC);
//  B) keep the cash in savings, pay the mortgage from it until the ERC period ends,
//     then clear the remaining balance with no charge.
// Measured at the end of the ERC period, A minus B equals
//   mortgage interest over the period - ERC - interest the savings earn over the period.
// With no ERC left, the same comparison runs over the next 12 months.
function calculate(balance: number, rate: number, remainingYears: number, ercPct: number, ercYearsLeft: number, savingsRate: number) {
  const months = Math.round(remainingYears * 12)
  if (balance <= 0 || months <= 0) return null

  const r = Math.max(0, rate) / 100 / 12
  const monthly = r > 0 ? balance * r / (1 - Math.pow(1 + r, -months)) : balance / months
  const totalInterest = monthly * months - balance

  const ercMonths = Math.min(months, Math.round(Math.max(0, ercYearsLeft) * 12))
  const erc = ercMonths > 0 ? balance * Math.max(0, ercPct) / 100 : 0
  const horizon = ercMonths > 0 ? ercMonths : Math.min(12, months)

  // Savings rate is an annual equivalent rate after tax, converted to a monthly rate
  const s = Math.pow(1 + Math.max(0, savingsRate) / 100, 1 / 12) - 1

  let bal = balance
  let pot = balance + erc
  let mortgageInterest = 0
  let savingsInterest = 0
  for (let m = 0; m < horizon; m++) {
    const i = bal * r
    mortgageInterest += i
    bal = Math.max(0, bal + i - monthly)
    const si = Math.max(0, pot) * s
    savingsInterest += si
    pot = pot + si - monthly
  }

  const netBenefit = mortgageInterest - erc - savingsInterest // > 0: repaying now is ahead

  return {
    monthly, totalInterest, erc, totalToPayOff: balance + erc, horizon, ercMonths,
    mortgageInterest, savingsInterest, balanceAtEnd: bal, netBenefit,
  }
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? '' : 's'}`
}

function period(monthsCount: number) {
  if (monthsCount % 12 === 0 && monthsCount >= 24) return plural(monthsCount / 12, 'year')
  return plural(monthsCount, 'month')
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function MortgageEarlyRepaymentCalculator() {
  const [balance, setBalance] = useState('180000')
  const [rate, setRate] = useState('4.5')
  const [years, setYears] = useState('20')
  const [ercPct, setErcPct] = useState('2')
  const [ercYears, setErcYears] = useState('1')
  const [savingsRate, setSavingsRate] = useState('4')

  const b = Math.max(0, parseFloat(balance.replace(/,/g, '')) || 0)
  const r = parseFloat(rate) || 0
  const y = parseFloat(years) || 0
  const ep = parseFloat(ercPct) || 0
  const ey = parseFloat(ercYears) || 0
  const sr = parseFloat(savingsRate) || 0
  const result = useMemo(() => calculate(b, r, y, ep, ey, sr), [b, r, y, ep, ey, sr])

  const ahead = result ? Math.abs(result.netBenefit) : 0
  const close = ahead < 50

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label htmlFor="erc-balance" className="block text-sm font-medium mb-2">Outstanding Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input id="erc-balance" type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label htmlFor="erc-rate" className="block text-sm font-medium mb-2">Mortgage Rate (%)</label><input id="erc-rate" type="number" min="0" max="15" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass} /></div>
        <div><label htmlFor="erc-term" className="block text-sm font-medium mb-2">Remaining Term (years)</label><input id="erc-term" type="number" min="1" max="40" value={years} onChange={(e) => setYears(e.target.value)} className={inputClass} /></div>
        <div><label htmlFor="erc-pct" className="block text-sm font-medium mb-2">ERC Rate (%)</label><input id="erc-pct" type="number" min="0" max="10" step="0.5" value={ercPct} onChange={(e) => setErcPct(e.target.value)} className={inputClass} /></div>
        <div><label htmlFor="erc-years" className="block text-sm font-medium mb-2">ERC Years Left</label><input id="erc-years" type="number" min="0" max="10" step="0.25" value={ercYears} onChange={(e) => setErcYears(e.target.value)} className={inputClass} /></div>
        <div><label htmlFor="erc-savings" className="block text-sm font-medium mb-2">Savings Interest After Tax (%)</label><input id="erc-savings" type="number" min="0" max="10" step="0.1" value={savingsRate} onChange={(e) => setSavingsRate(e.target.value)} className={inputClass} /></div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              {result.ercMonths > 0
                ? `Repaying now vs saving the cash until the ERC ends in ${period(result.ercMonths)}`
                : `No ERC: repaying now vs keeping the cash in savings for the next ${period(result.horizon)}`}
            </p>
            <p className="text-2xl font-bold text-primary mt-1">
              {close
                ? 'About the same either way'
                : result.netBenefit > 0
                  ? `Repaying now comes out ${formatCurrency(ahead)} ahead`
                  : `${result.ercMonths > 0 ? 'Waiting' : 'Keeping the savings'} comes out ${formatCurrency(ahead)} ahead`}
            </p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Balance to repay now</td><td className="text-right tabular-nums">{formatCurrency(b)}</td></tr>
              {result.erc > 0 && <tr className="border-b border-border/50"><td className="py-2">Early repayment charge ({ep}%)</td><td className="text-right tabular-nums">{formatCurrency(result.erc)}</td></tr>}
              <tr className="border-b border-border/50 font-medium"><td className="py-2">Cash needed to repay now</td><td className="text-right tabular-nums">{formatCurrency(result.totalToPayOff)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Mortgage interest over the next {period(result.horizon)} if you keep it</td><td className="text-right tabular-nums">{formatCurrency(result.mortgageInterest)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Savings interest on that cash over the same {period(result.horizon)}</td><td className="text-right tabular-nums">{formatCurrency(result.savingsInterest)}</td></tr>
              <tr className="border-b border-border/50 font-medium"><td className="py-2">Net effect of repaying now (interest saved − ERC − savings interest)</td><td className="text-right tabular-nums">{result.netBenefit < 0 ? '−' : ''}{formatCurrency(ahead)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-muted-foreground">Monthly payment</td><td className="text-right tabular-nums text-muted-foreground">{formatCurrency(result.monthly)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-muted-foreground">Balance left after {period(result.horizon)} (repaid then{result.ercMonths > 0 ? ', no charge' : ''})</td><td className="text-right tabular-nums text-muted-foreground">{formatCurrency(result.balanceAtEnd)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-muted-foreground">Interest over the whole remaining term ({plural(y, 'year')})</td><td className="text-right tabular-nums text-muted-foreground">{formatCurrency(result.totalInterest)}</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground">Waiting means keeping the cash in savings, paying the mortgage from it, and clearing the balance once the ERC period ends. The charge is applied to the whole balance, as many lenders do on a full repayment; paying off up to your yearly overpayment allowance (often 10%) is usually free. Enter the savings rate you would actually keep after tax.</p>
        </div>
      )}
    </div>
  )
}
