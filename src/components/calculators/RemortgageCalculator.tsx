import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function monthlyPayment(bal: number, monthlyRate: number, payments: number) {
  return monthlyRate > 0 ? bal * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1) : bal / payments
}

// Interest charged in each of the first `months` months of a repayment loan
function interestByMonth(bal: number, monthlyRate: number, payment: number, months: number) {
  const interest: number[] = []
  let balance = bal
  for (let m = 0; m < months; m++) {
    const charged = balance * monthlyRate
    interest.push(charged)
    balance += charged - payment
  }
  return interest
}

// The first month in which interest saved so far covers the cost, or null if it never does in the window
function breakEvenMonth(savedByMonth: number[], cost: number) {
  let saved = 0
  if (cost <= 0 && savedByMonth.length > 0 && savedByMonth[0] > 0) return 0
  for (let m = 0; m < savedByMonth.length; m++) {
    saved += savedByMonth[m]
    if (saved > 0 && saved >= cost) return m + 1
  }
  return null
}

function calculate(balance: number, currentRate: number, newRate: number, remainingYears: number, ercPct: number, arrangementFee: number, valuationFee: number, legalFee: number, dealYears: number, monthsLeft: number, feeOnLoan: boolean) {
  const monthlyRateCurrent = currentRate / 100 / 12
  const monthlyRateNew = newRate / 100 / 12
  const payments = Math.round(remainingYears * 12)
  const fixMonths = Math.min(Math.max(0, monthsLeft), payments)
  const stillInDeal = fixMonths > 0

  const newBalance = balance + (feeOnLoan ? arrangementFee : 0)
  const currentMonthly = monthlyPayment(balance, monthlyRateCurrent, payments)
  const newMonthly = monthlyPayment(newBalance, monthlyRateNew, payments)
  const monthlySaving = currentMonthly - newMonthly
  const annualSaving = monthlySaving * 12

  // An ERC only applies while the current deal is running
  const erc = stillInDeal ? balance * (ercPct / 100) : 0
  const totalFees = erc + arrangementFee + valuationFee + legalFee

  // Still in a deal: the question is switching now against waiting for the fix to end, then taking
  // the same new rate either way. Only the months left differ, and the fees are due either way, so
  // the cost of switching now is the ERC. Already on the SVR: compare the new deal with staying put,
  // over the new deal's length, and all the fees are the cost of switching.
  const dealMonths = Math.min(dealYears, remainingYears) * 12
  const comparedMonths = stillInDeal ? fixMonths : dealMonths
  const switchCost = stillInDeal ? erc : totalFees

  const stayInterest = interestByMonth(balance, monthlyRateCurrent, currentMonthly, payments)
  const switchInterest = interestByMonth(newBalance, monthlyRateNew, newMonthly, payments)
  const savedByMonth = stayInterest.map((interest, m) => interest - switchInterest[m])
  const interestSaved = savedByMonth.slice(0, comparedMonths).reduce((sum, s) => sum + s, 0)
  const paymentCut = monthlySaving * comparedMonths

  const netSaving = interestSaved - switchCost
  // Cash view: a fee added to the loan is not paid up front, and it is already in the new payment
  const paidUpFront = stillInDeal ? erc : totalFees - (feeOnLoan ? arrangementFee : 0)
  const paymentOnlySaving = paymentCut - paidUpFront
  // Waiting costs nothing once the fix ends, so a charge not recovered by then never is
  const breakEvenMonths = breakEvenMonth(savedByMonth.slice(0, stillInDeal ? fixMonths : payments), switchCost)

  return { currentMonthly, newMonthly, monthlySaving, annualSaving, erc, totalFees, switchCost, breakEvenMonths, interestSaved, paymentCut, netSaving, paymentOnlySaving, dealMonths, comparedMonths, stillInDeal }
}

function breakEvenText(months: number | null, stillInDeal: boolean) {
  if (months === null) return stillInDeal ? 'Never before the deal ends' : 'Never'
  if (months === 0) return 'Immediately'
  return `${months} ${months === 1 ? 'month' : 'months'}`
}

export default function RemortgageCalculator() {
  const [balance, setBalance] = useState('200000')
  const [currentRate, setCurrentRate] = useState('7.1') // average SVR 7.13%, Moneyfacts Sept 2026
  const [newRate, setNewRate] = useState('5.5')
  const [deal, setDeal] = useState('2')
  const [years, setYears] = useState('20')
  const [monthsLeft, setMonthsLeft] = useState('0')
  const [erc, setErc] = useState('0')
  const [arrangement, setArrangement] = useState('999')
  const [valuation, setValuation] = useState('0')
  const [legal, setLegal] = useState('500')
  const [feeOnLoan, setFeeOnLoan] = useState(false)

  const b = parseFloat(balance.replace(/,/g,'')) || 0
  const remainingYears = parseFloat(years)
  const termValid = Number.isFinite(remainingYears) && remainingYears > 0 && remainingYears <= 40
  const ercPct = parseFloat(erc) || 0
  const left = Math.max(0, parseInt(monthsLeft) || 0)
  const result = useMemo(() => calculate(b, parseFloat(currentRate)||0, parseFloat(newRate)||0, termValid ? remainingYears : 20, ercPct, parseFloat(arrangement)||0, parseFloat(valuation)||0, parseFloat(legal)||0, Math.max(1, parseInt(deal)||2), left, feeOnLoan), [b, currentRate, newRate, termValid, remainingYears, ercPct, arrangement, valuation, legal, deal, left, feeOnLoan])
  const period = result.stillInDeal ? `the ${result.comparedMonths} ${result.comparedMonths === 1 ? 'Month' : 'Months'} Left` : `${result.dealMonths / 12}-yr Deal`

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Mortgage Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Mortgage Balance" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Current Rate (%)</label><input type="number" min="0" max="15" step="0.1" value={currentRate} onChange={(e) => setCurrentRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current Rate (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">New Rate (%)</label><input type="number" min="0" max="15" step="0.1" value={newRate} onChange={(e) => setNewRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="New Rate (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Remaining Term (yrs)</label><input type="number" min="1" max="40" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Remaining Term (yrs)" />{!termValid && <p className="text-xs text-destructive mt-1">Enter a term above 0 and up to 40 years. Using 20 until then.</p>}</div>
        <div><label className="block text-sm font-medium mb-2">Months Left on Deal</label><input type="number" min="0" max="120" value={monthsLeft} onChange={(e) => setMonthsLeft(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Months Left on Current Deal (0 if on the SVR)" /><p className="text-xs text-muted-foreground mt-1">0 if already on the SVR</p></div>
        <div><label className="block text-sm font-medium mb-2">ERC (%)</label><input type="number" min="0" max="5" step="0.5" value={erc} onChange={(e) => setErc(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="ERC (%)" />{ercPct > 0 && left === 0 && <p className="text-xs text-muted-foreground mt-1">Ignored: an ERC applies only with months left on the deal.</p>}</div>
        <div><label className="block text-sm font-medium mb-2">Arrangement Fee</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={arrangement} onChange={(e) => setArrangement(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Arrangement Fee" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Legal Fee</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={legal} onChange={(e) => setLegal(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Legal Fee" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Valuation Fee</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={valuation} onChange={(e) => setValuation(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Valuation Fee" /></div></div>
        <div><label className="block text-sm font-medium mb-2">New Deal Length (yrs)</label><input type="number" min="1" max="10" value={deal} onChange={(e) => setDeal(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="New Deal Length (years)" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={feeOnLoan} onChange={(e) => setFeeOnLoan(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Add the arrangement fee to the loan (it then costs interest too)</span></label>

      {b > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Current Monthly</p><p className="text-lg font-bold">{formatCurrency(result.currentMonthly)}</p></div>
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">New Monthly</p><p className="text-lg font-bold text-primary">{formatCurrency(result.newMonthly)}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.monthlySaving > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Monthly Payment Cut</p><p className={`text-lg font-bold ${result.monthlySaving > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(result.monthlySaving)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Break-Even on Interest</p><p className="text-lg font-bold">{breakEvenText(result.breakEvenMonths, result.stillInDeal)}</p></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">{result.stillInDeal ? 'ERC: Cost of Switching Now' : 'Remortgage Costs'}</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.switchCost)}</p></div>
              <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Interest Saved over {period}</p><p className="text-lg font-bold">{formatCurrency(result.interestSaved)}</p></div>
              <div className={`rounded-xl p-4 text-center ${result.netSaving > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">{result.stillInDeal ? 'Net Saving against Waiting' : `Net Saving over ${period}`}</p><p className={`text-lg font-bold ${result.netSaving > 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(result.netSaving)}</p></div>
            </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p>In your pocket: the lower payments come to {formatCurrency(result.paymentCut)} over this period, or {formatCurrency(result.paymentOnlySaving)} after what you pay up front. The rest of the interest saved shows up as a lower balance.</p>
            {result.stillInDeal
              ? <p>Compares switching now with waiting until your deal ends and taking the same new rate then. Fees of {formatCurrency(result.totalFees - result.erc)} are due whenever you switch, so they are left out. Rates may move before then.</p>
              : <p>Assumes you would otherwise stay at your current rate for the whole new deal.</p>}
            {feeOnLoan && <p>{result.stillInDeal ? 'The arrangement fee goes on the balance now rather than when the deal ends, so the interest saved allows for the interest on it.' : 'The arrangement fee goes on the balance, so the new payment and the interest include it. The net saving still counts it, because you repay it.'}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
