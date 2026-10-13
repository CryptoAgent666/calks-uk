import { useMemo } from 'react'
import { formatCurrency } from '@/utils'
import ShareRow, { useUrlParam } from '@/components/ShareRow'
import {
  taxTrap,
  trapBandRows,
  PERSONAL_ALLOWANCE,
  PA_TAPER_START,
  PA_TAPER_END,
  PENSION_ANNUAL_ALLOWANCE,
  CHILDCARE_INCOME_CAP,
} from '@/data/tax-trap'

const num = (s: string) => parseFloat(s.replace(/,/g, '')) || 0
const inputClass =
  'w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring'
const toggleClass = (on: boolean) =>
  `px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors ${on ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`

export default function SixtyPercentTaxTrapCalculator() {
  const [salary, setSalary] = useUrlParam('salary', '110000')
  const [bonus, setBonus] = useUrlParam('bonus', '')
  const [pension, setPension] = useUrlParam('pension', '')
  const [unit, setUnit] = useUrlParam('unit', 'gbp') // gbp | pct
  const [method, setMethod] = useUrlParam('method', 'sacrifice') // sacrifice | ras
  const [giftAid, setGiftAid] = useUrlParam('gift', '')

  const s = num(salary)
  const b = num(bonus)
  const p = num(pension)
  const g = num(giftAid)
  const sacrifice = method !== 'ras'
  const pensionGross = unit === 'pct' ? (s + b) * (Math.min(p, 100) / 100) : p

  const result = useMemo(
    () => taxTrap({ salary: s, bonus: b, pensionGross, sacrifice, giftAidNet: g }),
    [s, b, pensionGross, sacrifice, g],
  )
  const rows = useMemo(() => trapBandRows(), [])

  // Which band-table row describes the current adjusted net income
  const activeRow = rows.reduce((best, r, idx) => (r.income <= result.ani ? idx : best), -1)

  const shareParams: Record<string, string> = {
    salary,
    ...(bonus ? { bonus } : {}),
    ...(pension ? { pension, unit, method } : {}),
    ...(giftAid ? { gift: giftAid } : {}),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="trap-salary" className="block text-sm font-medium mb-2">
            Annual Salary
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
            <input
              id="trap-salary"
              type="text"
              inputMode="numeric"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="110,000"
              className={inputClass}
              aria-label="Annual Salary"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {[100_000, 105_000, 110_000, 115_000, 120_000, PA_TAPER_END].map((amount) => (
              <button
                key={amount}
                onClick={() => setSalary(amount.toLocaleString())}
                className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors"
              >
                £{amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="trap-bonus" className="block text-sm font-medium mb-2">
            Bonus and other taxable income (optional)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
            <input
              id="trap-bonus"
              type="text"
              inputMode="numeric"
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
              placeholder="0"
              className={inputClass}
              aria-label="Bonus and other taxable income"
            />
          </div>
        </div>

        <div>
          <label htmlFor="trap-gift" className="block text-sm font-medium mb-2">
            Gift Aid donations in the year (optional)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
            <input
              id="trap-gift"
              type="text"
              inputMode="numeric"
              value={giftAid}
              onChange={(e) => setGiftAid(e.target.value)}
              placeholder="0"
              className={inputClass}
              aria-label="Gift Aid donations in the year"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Each £1 given takes £1.25 off adjusted net income.</p>
        </div>

        <div>
          <label htmlFor="trap-pension" className="block text-sm font-medium mb-2">
            Pension contribution you already make (gross)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                {unit === 'pct' ? '%' : '£'}
              </span>
              <input
                id="trap-pension"
                type="text"
                inputMode="decimal"
                value={pension}
                onChange={(e) => setPension(e.target.value)}
                placeholder="0"
                className={inputClass}
                aria-label="Pension contribution you already make"
              />
            </div>
            <div className="grid grid-cols-2 gap-1">
              <button onClick={() => setUnit('gbp')} className={toggleClass(unit !== 'pct')} aria-label="Pension entered in pounds">
                £
              </button>
              <button onClick={() => setUnit('pct')} className={toggleClass(unit === 'pct')} aria-label="Pension entered as a percentage of pay">
                %
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Enter the gross amount reaching the pension, including any basic-rate relief the provider adds.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">How the pension is paid</label>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setMethod('sacrifice')} className={toggleClass(sacrifice)} aria-label="Salary sacrifice">
              Salary sacrifice
            </button>
            <button onClick={() => setMethod('ras')} className={toggleClass(!sacrifice)} aria-label="Relief at source or net pay">
              Relief at source / net pay
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Both cut adjusted net income. Only salary sacrifice also cuts National Insurance, because the pay itself is lower.
          </p>
        </div>
      </div>

      {s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Adjusted net income</p>
              <p className="text-lg font-bold">{formatCurrency(result.ani)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Personal Allowance left</p>
              <p className="text-lg font-bold">{formatCurrency(result.allowance)}</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(result.allowanceLost)} of {formatCurrency(PERSONAL_ALLOWANCE)} lost</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Marginal rate on your next £1</p>
              <p className="text-lg font-bold text-destructive">{Math.round(result.marginalTax * 100)}%</p>
              <p className="text-xs text-muted-foreground">{Math.round(result.marginalTotal * 100)}% with employee NI</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Income in the £100k to £125,140 band</p>
              <p className="text-lg font-bold">{formatCurrency(result.inBand)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Tax on that slice (60%)</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(result.bandTax)}</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(result.taperTax)} of it is the lost allowance</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Take-home after tax, NI and pension</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(result.takeHome)}</p>
              <p className="text-xs text-muted-foreground">Income tax {formatCurrency(result.tax)}, NI {formatCurrency(result.ni)}</p>
            </div>
          </div>

          {/* Escape route */}
          {result.ani > PA_TAPER_START ? (
            <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-5 space-y-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Extra gross pension contribution that brings adjusted net income back to {formatCurrency(PA_TAPER_START)}</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.escape.contribution)}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Real cost to you {formatCurrency(result.escape.netCost)}, so each £1 in the pension costs {Math.round((1 - result.escape.reliefRate) * 100)}p
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium text-muted-foreground"></th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Now</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">After contribution</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Saving</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2">Adjusted net income</td>
                      <td className="text-right tabular-nums">{formatCurrency(result.ani)}</td>
                      <td className="text-right tabular-nums">{formatCurrency(result.escape.aniAfter)}</td>
                      <td></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2">Personal Allowance</td>
                      <td className="text-right tabular-nums">{formatCurrency(result.allowance)}</td>
                      <td className="text-right tabular-nums">{formatCurrency(PERSONAL_ALLOWANCE)}</td>
                      <td></td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2">Income tax</td>
                      <td className="text-right tabular-nums">{formatCurrency(result.tax)}</td>
                      <td className="text-right tabular-nums">{formatCurrency(result.tax - result.escape.taxSaved)}</td>
                      <td className="text-right tabular-nums text-green-600">{formatCurrency(result.escape.taxSaved)}</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2">Employee NI</td>
                      <td className="text-right tabular-nums">{formatCurrency(result.ni)}</td>
                      <td className="text-right tabular-nums">{formatCurrency(result.ni - result.escape.niSaved)}</td>
                      <td className="text-right tabular-nums text-green-600">{formatCurrency(result.escape.niSaved)}</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2">Pension pot gains</td>
                      <td className="text-right tabular-nums">{formatCurrency(result.pensionGross)}</td>
                      <td className="text-right tabular-nums">{formatCurrency(result.escape.totalPension)}</td>
                      <td className="text-right tabular-nums text-green-600">{formatCurrency(result.escape.contribution)}</td>
                    </tr>
                    <tr className="font-semibold">
                      <td className="py-2">Take-home pay</td>
                      <td className="text-right tabular-nums">{formatCurrency(result.takeHome)}</td>
                      <td className="text-right tabular-nums">{formatCurrency(result.escape.takeHomeAfter)}</td>
                      <td className="text-right tabular-nums text-destructive">-{formatCurrency(result.takeHome - result.escape.takeHomeAfter)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground">
                {sacrifice
                  ? 'Salary sacrifice: the saving includes 2% employee NI on the sacrificed pay. Your employer also saves 15% NI and may share it.'
                  : 'Relief at source or net pay: no NI saving. With relief at source the provider adds 20% and you claim the rest through Self Assessment or a tax code change.'}
                {result.escape.overAnnualAllowance &&
                  ` Total contributions would exceed the £${PENSION_ANNUAL_ALLOWANCE.toLocaleString()} annual allowance; unused allowance from the previous three years can be carried forward.`}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-5 text-center">
              <p className="text-sm text-muted-foreground">Adjusted net income is at or below {formatCurrency(PA_TAPER_START)}</p>
              <p className="text-xl font-bold text-green-700 dark:text-green-400 mt-1">Full Personal Allowance kept. You are outside the taper.</p>
            </div>
          )}

          {/* Childcare cliff */}
          <div className={`rounded-xl border p-4 text-sm ${result.childcareLost ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800' : 'border-border'}`}>
            <p className="font-semibold">
              Childcare cliff at {formatCurrency(CHILDCARE_INCOME_CAP)}: {result.childcareLost ? 'you are above it' : 'you are below it'}
            </p>
            <p className="text-muted-foreground mt-1">
              gov.uk ends both the 30 funded hours for working parents and Tax-Free Childcare when you or your partner has an expected adjusted net income over £100,000 for the tax year. It is a cliff edge, not a taper: £1 over the line loses the whole entitlement.
              {result.childcareLost && result.escape.contribution > 0 && ' The pension contribution above also restores eligibility, because it is adjusted net income that is tested.'}{' '}
              Put your childcare bill through the{' '}
              <a href="/calculator/childcare-cost-calculator/" className="text-primary underline">
                childcare cost calculator
              </a>{' '}
              to see what the entitlement is worth to you.
            </p>
          </div>

          {/* Band table */}
          <div>
            <h3 className="text-sm font-semibold mb-3">The taper band, salary only, £5,000 steps</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">Adjusted net income</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Allowance</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Allowance lost</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Income tax</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Extra from taper</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Marginal</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={r.income} className={`border-b border-border/50 ${idx === activeRow ? 'bg-primary/10 font-semibold' : ''}`}>
                      <td className="py-2 tabular-nums">{formatCurrency(r.income)}</td>
                      <td className="text-right py-2 tabular-nums">{formatCurrency(r.allowance)}</td>
                      <td className="text-right py-2 tabular-nums">{formatCurrency(r.allowanceLost)}</td>
                      <td className="text-right py-2 tabular-nums">{formatCurrency(r.tax)}</td>
                      <td className="text-right py-2 tabular-nums text-destructive">{formatCurrency(r.taperTax)}</td>
                      <td className="text-right py-2 tabular-nums">{Math.round(r.marginalTax * 100)}% / {Math.round(r.marginalTotal * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Marginal column: income tax / income tax plus 2% employee NI. Above £125,140 the allowance has gone and the marginal rate settles at 45% (47% with NI). The highlighted row is the step at or below your adjusted net income.
            </p>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
            <p>
              England, Wales and Northern Ireland rates. Scotland applies the same £100,000 taper to the same allowance but on its own six bands, so the trap there runs at 67.5% (45% advanced rate plus the lost allowance at 45%); use the{' '}
              <a href="/calculator/scottish-income-tax-calculator/" className="text-primary underline">
                Scottish income tax calculator
              </a>{' '}
              for the Scottish bill.
            </p>
            <p>
              Adjusted net income is total taxable income less gross pension contributions and grossed-up Gift Aid. Bonuses, benefits in kind, rental profit, interest and dividends all count towards it, so a bonus paid in March can pull a £95,000 salary into the band for the whole year.
            </p>
          </div>

          <ShareRow params={shareParams} />
        </div>
      )}
    </div>
  )
}
