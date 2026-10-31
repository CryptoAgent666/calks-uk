import { useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'
import ShareRow, { useUrlParam } from '@/components/ShareRow'
import {
  STATUS_LINE,
  PERSONAL_ALLOWANCE,
  BASIC_RATE_BAND,
  HIGHER_RATE_LIMIT,
  PA_TAPER_START,
  SALARY_RATES,
  NI_PRIMARY_THRESHOLD,
  NI_UPPER_EARNINGS_LIMIT,
  NI_MAIN_RATE,
  NI_ADDITIONAL_RATE,
  DIVIDEND_ALLOWANCE,
  DIVIDEND_RATES,
  ISA_ALLOWANCE,
  CASH_ISA_LIMIT,
  PERSONAL_SAVINGS_ALLOWANCE,
  SAVINGS_STARTING_RATE_BAND,
  SAVINGS_RATES_NOW,
  SAVINGS_RATES_FROM_2027,
  PROPERTY_RATES_NOW,
  PROPERTY_RATES_FROM_2027,
  FUEL_DUTY_PENCE,
  FUEL_DUTY_PENCE_JUL_2027,
  FUEL_DUTY_PENCE_CANCELLED_JAN_2027,
  FUEL_DUTY_PENCE_CANCELLED_MAR_2027,
  VAT,
  MTD_THRESHOLD_2026,
  MTD_THRESHOLD_2027,
  MTD_THRESHOLD_2028,
  IHT_NIL_RATE_BAND,
  IHT_RATE,
  APRIL_2027_SCHEDULE,
  OTHER_MEASURE_IDS,
  STATUS_LABELS,
} from '@/data/budget-2026'

type Rates = { basic: number; higher: number; additional: number }

const num = (s: string) => parseFloat(s.replace(/,/g, '')) || 0
const pence = (p: number) => `${p.toFixed(2)}p`
// Adjusted net income at which the allowance is fully withdrawn (£100,000 + 2 x £12,570 = £125,140).
const PA_TAPER_END = PA_TAPER_START + 2 * PERSONAL_ALLOWANCE

function taperedAllowance(adjustedNetIncome: number) {
  if (adjustedNetIncome <= PA_TAPER_START) return PERSONAL_ALLOWANCE
  return Math.max(0, PERSONAL_ALLOWANCE - Math.floor((adjustedNetIncome - PA_TAPER_START) / 2))
}

// Tax on the slice of taxable income [from, to) using the 2026/27 band structure:
// £37,700 basic-rate band, 45% above £125,140 of taxable income.
function sliceTax(from: number, to: number, rates: Rates) {
  const basic = Math.max(0, Math.min(to, BASIC_RATE_BAND) - Math.min(from, BASIC_RATE_BAND))
  const higher = Math.max(0, Math.min(to, HIGHER_RATE_LIMIT) - Math.max(from, BASIC_RATE_BAND))
  const additional = Math.max(0, to - Math.max(from, HIGHER_RATE_LIMIT))
  return basic * rates.basic + higher * rates.higher + additional * rates.additional
}

function employeeNI(gross: number) {
  if (gross <= NI_PRIMARY_THRESHOLD) return 0
  const main = Math.min(gross, NI_UPPER_EARNINGS_LIMIT) - NI_PRIMARY_THRESHOLD
  const additional = Math.max(0, gross - NI_UPPER_EARNINGS_LIMIT)
  return main * NI_MAIN_RATE + additional * NI_ADDITIONAL_RATE
}

// The Personal Savings Allowance follows the band of total taxable income.
function savingsBand(totalTaxable: number): keyof Rates {
  if (totalTaxable > HIGHER_RATE_LIMIT) return 'additional'
  if (totalTaxable > BASIC_RATE_BAND) return 'higher'
  return 'basic'
}

interface Inputs {
  salary: number
  bonus: number
  pensionPct: number
  dividends: number
  rent: number
  interest: number
  cashSavings: number
  litresPerMonth: number
  selfEmployed: number
  pensionPot: number
}

export function calculate(i: Inputs) {
  // (a) 2026/27 position. Pension is a workplace (net pay) contribution: it reduces
  // taxable pay but not National Insurance, as in the take-home pay calculator.
  const gross = i.salary + i.bonus
  const pension = gross * (i.pensionPct / 100)
  const earnings = Math.max(0, gross - pension)
  const totalIncome = earnings + i.rent + i.interest + i.dividends
  const allowance = taperedAllowance(totalIncome)
  const taxableEarnings = Math.max(0, earnings - allowance)
  const incomeTax = sliceTax(0, taxableEarnings, SALARY_RATES)

  // Income stacks as pay, then rent, then interest, then dividends. Unused allowance
  // passes up the stack in that order.
  let allowanceLeft = Math.max(0, allowance - earnings)
  const rentTaxable = Math.max(0, i.rent - allowanceLeft)
  allowanceLeft = Math.max(0, allowanceLeft - i.rent)
  const interestTaxable = Math.max(0, i.interest - allowanceLeft)
  allowanceLeft = Math.max(0, allowanceLeft - i.interest)
  const dividendsAfterPA = Math.max(0, i.dividends - allowanceLeft)
  const nonSavingsTaxable = taxableEarnings + rentTaxable
  const dividendAllowanceUsed = Math.min(dividendsAfterPA, DIVIDEND_ALLOWANCE)
  const taxableDividends = dividendsAfterPA - dividendAllowanceUsed
  const dividendStart = nonSavingsTaxable + interestTaxable + dividendAllowanceUsed
  const dividendTax = sliceTax(dividendStart, dividendStart + taxableDividends, DIVIDEND_RATES)

  // Rent uses the same bands in both years; only the rates move on 6 April 2027.
  const rentTaxNow = sliceTax(taxableEarnings, nonSavingsTaxable, PROPERTY_RATES_NOW)
  const rentTax2027 = sliceTax(taxableEarnings, nonSavingsTaxable, PROPERTY_RATES_FROM_2027)

  // Interest: the £5,000 starting rate (reduced £1 for £1 by non-savings taxable income),
  // then the Personal Savings Allowance, then the savings rates. Both 0% slices use band space.
  const sBand = savingsBand(nonSavingsTaxable + interestTaxable + dividendsAfterPA)
  const psa = PERSONAL_SAVINGS_ALLOWANCE[sBand]
  const startingUsed = Math.min(interestTaxable, Math.max(0, SAVINGS_STARTING_RATE_BAND - nonSavingsTaxable))
  const psaUsed = Math.min(interestTaxable - startingUsed, psa)
  const interestCharged = interestTaxable - startingUsed - psaUsed
  const interestStart = nonSavingsTaxable + startingUsed + psaUsed
  const savingsTaxNow = sliceTax(interestStart, interestStart + interestCharged, SAVINGS_RATES_NOW)
  const savingsTax2027 = sliceTax(interestStart, interestStart + interestCharged, SAVINGS_RATES_FROM_2027)
  const savingsRate2027 = SAVINGS_RATES_FROM_2027[sBand]

  const ni = employeeNI(gross)
  const takeHomePay = gross - pension - incomeTax - ni
  const dividendsNet = i.dividends - dividendTax
  const totalNet = takeHomePay + dividendsNet + (i.rent - rentTaxNow) + (i.interest - savingsTaxNow)
  const deductionRate = gross > 0 ? ((incomeTax + ni) / gross) * 100 : 0

  // Band position on taxable earnings (frozen thresholds: the headroom does not move).
  let band: string
  let marginalTaxNI: number
  let headroom: number | null
  let next: string | null
  if (earnings <= allowance) {
    band = 'Personal Allowance (0% tax)'
    marginalTaxNI = gross > NI_PRIMARY_THRESHOLD ? NI_MAIN_RATE * 100 : 0
    headroom = allowance - earnings
    next = 'the 20% basic rate'
  } else if (earnings <= allowance + BASIC_RATE_BAND) {
    band = 'Basic rate (20%)'
    marginalTaxNI = 28
    headroom = allowance + BASIC_RATE_BAND - earnings
    next = 'the 40% higher rate'
  } else if (totalIncome <= PA_TAPER_START) {
    band = 'Higher rate (40%)'
    marginalTaxNI = 42
    headroom = PA_TAPER_START - totalIncome
    next = 'the allowance taper (60% effective)'
  } else if (totalIncome < PA_TAPER_END) {
    // Adjusted net income between £100,000 and £125,140: the allowance is still being withdrawn,
    // so each £1 of pay adds £1.50 of taxable income (the £1 plus 50p of lost allowance). The pay
    // that reaches the 45% band is the rest of the taper plus any taxable earnings still short of
    // £125,140 once the allowance is nil (that second part is only non-zero with dividends).
    band = 'Higher rate inside the allowance taper (60% effective)'
    marginalTaxNI = 62
    const taperLeft = PA_TAPER_END - totalIncome
    headroom = taperLeft + Math.max(0, HIGHER_RATE_LIMIT - (earnings + taperLeft))
    next = 'the 45% additional rate'
  } else if (taxableEarnings < HIGHER_RATE_LIMIT) {
    // Allowance nil, but taxable pay is still below £125,140 because dividends carried income past the taper.
    band = 'Higher rate (40%)'
    marginalTaxNI = 42
    headroom = HIGHER_RATE_LIMIT - taxableEarnings
    next = 'the 45% additional rate'
  } else {
    band = 'Additional rate (45%)'
    marginalTaxNI = 47
    headroom = null
    next = null
  }
  // A pay rise of R raises taxable earnings by R x (1 - pension %).
  const payRiseToNext = headroom !== null ? headroom / Math.max(0.01, 1 - i.pensionPct / 100) : null
  const payRisePct = payRiseToNext !== null && i.salary > 0 ? (payRiseToNext / i.salary) * 100 : null

  // (b) Fuel duty: duty plus the VAT charged on it, per year, for the user's litres.
  const litresPerYear = i.litresPerMonth * 12
  const dutyCost = (p: number, litres: number) => litres * (p / 100) * (1 + VAT)
  const fuelNow = dutyCost(FUEL_DUTY_PENCE, litresPerYear)
  const fuelJul = dutyCost(FUEL_DUTY_PENCE_JUL_2027, litresPerYear)
  // April 2027 to March 2028: three months at 52.95p, then nine months at 60.59p.
  const fuel2027 = dutyCost(FUEL_DUTY_PENCE, i.litresPerMonth * 3) + dutyCost(FUEL_DUTY_PENCE_JUL_2027, i.litresPerMonth * 9)
  const pumpRise = (FUEL_DUTY_PENCE_JUL_2027 - FUEL_DUTY_PENCE) * (1 + VAT)
  // January to June 2027 at 52.95p against the cancelled path: two months at 55.95p, four at 57.95p.
  const fuelCancelledSaving =
    dutyCost(FUEL_DUTY_PENCE_CANCELLED_JAN_2027 - FUEL_DUTY_PENCE, i.litresPerMonth * 2) +
    dutyCost(FUEL_DUTY_PENCE_CANCELLED_MAR_2027 - FUEL_DUTY_PENCE, i.litresPerMonth * 4)

  // MTD for Income Tax (gross self-employment plus property income, 2025/26 test year).
  let mtd: { stage: string; tone: 'in' | 'soon' | 'later' | 'out' }
  if (i.selfEmployed > MTD_THRESHOLD_2026) mtd = { stage: 'Already within Making Tax Digital for Income Tax (from 6 April 2026)', tone: 'in' }
  else if (i.selfEmployed > MTD_THRESHOLD_2027) mtd = { stage: 'Joins Making Tax Digital for Income Tax on 6 April 2027', tone: 'soon' }
  else if (i.selfEmployed > MTD_THRESHOLD_2028) mtd = { stage: 'Outside until 6 April 2028, when the £20,000 tier starts', tone: 'later' }
  else mtd = { stage: i.selfEmployed > 0 ? 'Outside Making Tax Digital at this income' : 'No self-employment or property income entered', tone: 'out' }

  // Cash ISA: £20,000 stays for all savers; only money above the overall allowance sits outside.
  const cashExcessOverall = Math.max(0, i.cashSavings - ISA_ALLOWANCE)

  // IHT on an unused pension pot for deaths on or after 6 April 2027.
  const ihtOnPotMax = i.pensionPot * IHT_RATE

  return {
    gross, pension, earnings, allowance, taxableEarnings, incomeTax, dividendTax, ni,
    takeHomePay, dividendsNet, totalNet, deductionRate,
    band, marginalTaxNI, headroom, next, payRiseToNext, payRisePct,
    litresPerYear, fuelNow, fuelJul, fuel2027, pumpRise, fuelCancelledSaving,
    rentTaxNow, rentTax2027, savingsTaxNow, savingsTax2027, interestCharged,
    mtd, cashExcessOverall, psa, savingsRate2027, sBand,
    ihtOnPotMax,
  }
}

const item = (id: string) => APRIL_2027_SCHEDULE.find((s) => s.id === id)

function Field({
  id, label, value, onChange, prefix, suffix, placeholder, hint,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void
  prefix?: string; suffix?: string; placeholder?: string; hint?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">{prefix}</span>}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-input bg-background ${prefix ? 'pl-8' : 'pl-4'} ${suffix ? 'pr-20' : 'pr-4'} py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring`}
          aria-label={label}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>}
      </div>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  )
}

function SourceLine({ id }: { id: string }) {
  const s = item(id)
  if (!s?.sourceUrl) return null
  return (
    <p className="text-xs text-muted-foreground mt-2">
      Status: {STATUS_LABELS[s.status]}. Source: <a href={s.sourceUrl} target="_blank" rel="noopener" className="text-primary underline">{s.sourceName}</a>{s.sourceDate ? `, ${s.sourceDate}` : ''}.
    </p>
  )
}

export default function Budget2026Calculator() {
  const [salary, setSalary] = useUrlParam('salary', '40,000')
  const [bonus, setBonus] = useUrlParam('bonus', '0')
  const [pensionPct, setPensionPct] = useUrlParam('pension', '5')
  const [dividends, setDividends] = useUrlParam('dividends', '0')
  const [rent, setRent] = useUrlParam('rent', '0')
  const [interest, setInterest] = useUrlParam('interest', '0')
  const [cashSavings, setCashSavings] = useUrlParam('isa', '0')
  const [litres, setLitres] = useUrlParam('litres', '100')
  const [selfEmployed, setSelfEmployed] = useUrlParam('se', '0')
  const [pensionPot, setPensionPot] = useUrlParam('pot', '0')

  const inputs: Inputs = {
    salary: num(salary),
    bonus: num(bonus),
    pensionPct: Math.min(100, Math.max(0, num(pensionPct))),
    dividends: num(dividends),
    rent: num(rent),
    interest: num(interest),
    cashSavings: num(cashSavings),
    litresPerMonth: num(litres),
    selfEmployed: num(selfEmployed),
    pensionPot: num(pensionPot),
  }
  const r = useMemo(() => calculate(inputs), [
    inputs.salary, inputs.bonus, inputs.pensionPct, inputs.dividends, inputs.rent, inputs.interest,
    inputs.cashSavings, inputs.litresPerMonth, inputs.selfEmployed, inputs.pensionPot,
  ])

  const hasPay = inputs.salary + inputs.bonus > 0

  return (
    <div className="space-y-6">
      {/* Status line: the date constant lives in src/data/budget-2026.ts */}
      <p className="rounded-xl border-l-4 border-primary bg-primary/5 px-4 py-3 text-sm font-medium" role="status">
        {STATUS_LINE}
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="b26-salary" label="Annual salary" value={salary} onChange={setSalary} prefix="£" placeholder="40,000" />
        <Field id="b26-bonus" label="Annual bonus" value={bonus} onChange={setBonus} prefix="£" placeholder="0" />
        <Field id="b26-pension" label="Workplace pension contribution" value={pensionPct} onChange={setPensionPct} suffix="% of pay" placeholder="5" hint="Deducted before tax; National Insurance is still charged on full pay." />
        <Field id="b26-dividends" label="Dividends received in the year" value={dividends} onChange={setDividends} prefix="£" placeholder="0" />
        <Field id="b26-rent" label="Rental profit in the year" value={rent} onChange={setRent} prefix="£" placeholder="0" hint="Rents less allowable expenses, before any mortgage interest credit." />
        <Field id="b26-interest" label="Savings interest outside an ISA" value={interest} onChange={setInterest} prefix="£" placeholder="0" hint="Interest a year from bank and building society accounts." />
        <Field id="b26-isa" label="Cash savings you put away each year" value={cashSavings} onChange={setCashSavings} prefix="£" placeholder="0" hint="Used for the cash ISA limit check." />
        <Field id="b26-litres" label="Fuel bought each month" value={litres} onChange={setLitres} suffix="litres" placeholder="100" hint="Petrol or diesel. A 50-litre tank once a fortnight is about 108 litres." />
        <Field id="b26-se" label="Self-employment and rental income (gross, 2025/26)" value={selfEmployed} onChange={setSelfEmployed} prefix="£" placeholder="0" hint="Turnover plus rents before expenses: the Making Tax Digital test." />
        <Field id="b26-pot" label="Pension pot you expect to leave unused" value={pensionPot} onChange={setPensionPot} prefix="£" placeholder="0" hint="Optional, for the inheritance tax note." />
      </div>

      {/* (a) 2026/27 position */}
      {hasPay && (
        <section className="space-y-4 animate-fade-in-up" aria-labelledby="b26-now">
          <h3 id="b26-now" className="text-sm font-semibold">Your 2026/27 position with the current rates</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Income tax on pay</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(r.incomeTax)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Employee National Insurance</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(r.ni)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Pension contribution</p>
              <p className="text-lg font-bold">{formatCurrency(r.pension)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Take-home pay (after tax, NI and pension)</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(r.takeHomePay)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Monthly take-home pay</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(r.takeHomePay / 12)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Tax + NI as a share of pay</p>
              <p className="text-lg font-bold">{formatPercent(r.deductionRate)}</p>
            </div>
            {inputs.dividends > 0 && (
              <>
                <div className="rounded-xl bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">Dividend tax (10.75% / 35.75% / 39.35%)</p>
                  <p className="text-lg font-bold text-destructive">{formatCurrency(r.dividendTax)}</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">Dividends after tax</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(r.dividendsNet)}</p>
                </div>
              </>
            )}
            {inputs.dividends + inputs.rent + inputs.interest > 0 && (
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Total after tax on all income entered</p>
                <p className="text-lg font-bold text-primary">{formatCurrency(r.totalNet)}</p>
              </div>
            )}
          </div>

          {/* Fiscal drag: band position against frozen thresholds */}
          <div className="rounded-xl border border-border p-4 text-sm space-y-2">
            <h4 className="font-semibold">Where you sit in the frozen bands</h4>
            <p className="text-muted-foreground">
              Your taxable pay of {formatCurrency(r.earnings)} (after the pension deduction) uses a Personal Allowance of {formatCurrency(r.allowance)} and sits in the <strong className="text-foreground">{r.band}</strong> band. Counting National Insurance, the next £1 of pay costs you {r.marginalTaxNI}p.
            </p>
            {r.headroom !== null && r.payRiseToNext !== null && (
              <p className="text-muted-foreground">
                You are {formatCurrency(r.headroom)} of taxable pay below {r.next}. A pay rise of about {formatCurrency(r.payRiseToNext)}{r.payRisePct !== null ? ` (${r.payRisePct.toFixed(1)}% of salary)` : ''} would reach it. The thresholds are fixed in law until 5 April 2031, so that gap does not widen with inflation: each pay rise moves you closer to the next band.
              </p>
            )}
            {r.headroom === null && (
              <p className="text-muted-foreground">
                You are already in the top band. The 45% threshold of £125,140 is also fixed, so every future pay rise is taxed at 47% including National Insurance.
              </p>
            )}
            <SourceLine id="personal-allowance" />
          </div>
        </section>
      )}

      {/* (b) What Budget 2026 changes */}
      <section className="space-y-4" aria-labelledby="b26-2027">
        <h3 id="b26-2027" className="text-sm font-semibold">What Budget 2026 changes for you in 2027</h3>

        {/* Fuel duty */}
        <div className="rounded-xl border border-border p-4 text-sm space-y-3">
          <h4 className="font-semibold">Fuel duty: {pence(FUEL_DUTY_PENCE)} to 1 July 2027, then {pence(FUEL_DUTY_PENCE_JUL_2027)}</h4>
          {inputs.litresPerMonth > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium text-muted-foreground">Duty rate</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Duty + VAT on {r.litresPerYear.toLocaleString('en-GB')} litres a year</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2">{pence(FUEL_DUTY_PENCE)} (now, to 1 July 2027)</td>
                      <td className="text-right py-2 tabular-nums">{formatCurrency(r.fuelNow)}</td>
                      <td className="text-right py-2 tabular-nums text-muted-foreground">current</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2">{pence(FUEL_DUTY_PENCE_JUL_2027)} (a full year at the rate from 1 July 2027)</td>
                      <td className="text-right py-2 tabular-nums">{formatCurrency(r.fuelJul)}</td>
                      <td className="text-right py-2 tabular-nums text-destructive">+{formatCurrency(r.fuelJul - r.fuelNow)}</td>
                    </tr>
                    <tr className="font-semibold">
                      <td className="py-2">April 2027 to March 2028 (3 months at {pence(FUEL_DUTY_PENCE)}, 9 at {pence(FUEL_DUTY_PENCE_JUL_2027)})</td>
                      <td className="text-right py-2 tabular-nums">{formatCurrency(r.fuel2027)}</td>
                      <td className="text-right py-2 tabular-nums text-destructive">+{formatCurrency(r.fuel2027 - r.fuelNow)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground">
                The rises planned for 1 January 2027 ({pence(FUEL_DUTY_PENCE_CANCELLED_JAN_2027)}) and 1 March 2027 ({pence(FUEL_DUTY_PENCE_CANCELLED_MAR_2027)}) were cancelled, which leaves you {formatCurrency(r.fuelCancelledSaving)} better off from January to June 2027 at these litres. VAT at 20% is charged on duty, so the July step adds {r.pumpRise.toFixed(2)}p a litre at the pump if retailers pass it on in full. Pump prices also move with oil and the pound, which this comparison leaves out.
              </p>
            </>
          ) : (
            <p className="text-muted-foreground">Enter the litres you buy each month to see the cost of each rate for you.</p>
          )}
          <SourceLine id="fuel-duty" />
        </div>

        {/* Savings and rental income */}
        <div className="rounded-xl border border-border p-4 text-sm space-y-3">
          <h4 className="font-semibold">Tax on savings and rental income: 24%, 44% and 49% from 6 April 2027</h4>
          {inputs.rent + inputs.interest > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">Tax on</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">2026/27</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">2027/28</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {inputs.rent > 0 && (
                    <tr className="border-b border-border/50">
                      <td className="py-2">Rental profit of {formatCurrency(inputs.rent)}</td>
                      <td className="text-right py-2 tabular-nums">{formatCurrency(r.rentTaxNow)}</td>
                      <td className="text-right py-2 tabular-nums">{formatCurrency(r.rentTax2027)}</td>
                      <td className="text-right py-2 tabular-nums text-destructive">+{formatCurrency(r.rentTax2027 - r.rentTaxNow)}</td>
                    </tr>
                  )}
                  {inputs.interest > 0 && (
                    <tr className="border-b border-border/50">
                      <td className="py-2">Interest of {formatCurrency(inputs.interest)}</td>
                      <td className="text-right py-2 tabular-nums">{formatCurrency(r.savingsTaxNow)}</td>
                      <td className="text-right py-2 tabular-nums">{formatCurrency(r.savingsTax2027)}</td>
                      <td className="text-right py-2 tabular-nums text-destructive">+{formatCurrency(r.savingsTax2027 - r.savingsTaxNow)}</td>
                    </tr>
                  )}
                  <tr className="font-semibold">
                    <td className="py-2">Total</td>
                    <td className="text-right py-2 tabular-nums">{formatCurrency(r.rentTaxNow + r.savingsTaxNow)}</td>
                    <td className="text-right py-2 tabular-nums">{formatCurrency(r.rentTax2027 + r.savingsTax2027)}</td>
                    <td className="text-right py-2 tabular-nums text-destructive">+{formatCurrency(r.rentTax2027 + r.savingsTax2027 - r.rentTaxNow - r.savingsTaxNow)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">Enter any rental profit or savings interest above to compare the tax on it this year and next. The rates in 2026/27 are 20%, 40% and 45%.</p>
          )}
          <p className="text-muted-foreground">
            These rates replace the 22%, 42% and 47% in Finance Act 2026. The savings rates apply across the UK; the property rates apply in England, Wales and Northern Ireland. Your Personal Savings Allowance here is {formatCurrency(r.psa)} and the £5,000 starting rate limit is unchanged. Rent is taken before any mortgage interest credit, which the <a href="/calculator/landlord-tax-calculator/" className="text-primary underline">landlord tax calculator</a> handles.
          </p>
          <SourceLine id="savings-rates" />
        </div>

        {/* MTD */}
        <div className={`rounded-xl border p-4 text-sm space-y-2 ${r.mtd.tone === 'soon' ? 'border-amber-400/60 bg-amber-50/60 dark:bg-amber-950/30' : 'border-border'}`}>
          <h4 className="font-semibold">Making Tax Digital for Income Tax: threshold drops to {formatCurrency(MTD_THRESHOLD_2027)} on 6 April 2027</h4>
          <p className="font-medium">{r.mtd.stage}</p>
          <p className="text-muted-foreground">
            The test is gross self-employment turnover plus gross rents in the 2025/26 tax year, before expenses. Over {formatCurrency(MTD_THRESHOLD_2026)} meant joining in April 2026; over {formatCurrency(MTD_THRESHOLD_2027)} means digital records and four quarterly updates a year from April 2027; over {formatCurrency(MTD_THRESHOLD_2028)} follows in April 2028. Employment income and dividends do not count. Budget 2026 kept those thresholds and said April 2027 joiners get no penalty points for late submission of their first four quarterly updates in 2027/28.
          </p>
          <SourceLine id="mtd" />
        </div>

        {/* Cash ISA */}
        <div className={`rounded-xl border p-4 text-sm space-y-2 ${r.cashExcessOverall > 0 ? 'border-amber-400/60 bg-amber-50/60 dark:bg-amber-950/30' : 'border-border'}`}>
          <h4 className="font-semibold">Cash ISA limit: stays {formatCurrency(CASH_ISA_LIMIT)} for all savers</h4>
          <p className="text-muted-foreground">
            Budget 2026 cancelled the £12,000 cap planned for under-65s from 6 April 2027, so you can keep paying up to {formatCurrency(CASH_ISA_LIMIT)} a year into cash ISAs at any age from 18.
          </p>
          {inputs.cashSavings <= 0 ? (
            <p className="text-muted-foreground">Enter how much cash you save each year to check it against the limit.</p>
          ) : r.cashExcessOverall > 0 ? (
            <p className="font-medium">{formatCurrency(CASH_ISA_LIMIT)} of your {formatCurrency(inputs.cashSavings)} can go into a cash ISA. The other {formatCurrency(r.cashExcessOverall)} is above the overall allowance and sits outside an ISA, where interest above your {formatCurrency(r.psa)} Personal Savings Allowance is taxed at {(r.savingsRate2027 * 100).toFixed(0)}% from 6 April 2027.</p>
          ) : (
            <p className="font-medium">All of your {formatCurrency(inputs.cashSavings)} a year fits inside a cash ISA, so none of it needs to sit where interest above your {formatCurrency(r.psa)} Personal Savings Allowance is taxed at {(r.savingsRate2027 * 100).toFixed(0)}% from 6 April 2027.</p>
          )}
          <SourceLine id="cash-isa" />
        </div>

        {/* IHT on pensions */}
        <div className="rounded-xl border border-border p-4 text-sm space-y-2">
          <h4 className="font-semibold">Inheritance tax: unused pensions count in the estate for deaths on or after 6 April 2027</h4>
          {inputs.pensionPot > 0 ? (
            <p className="text-muted-foreground">
              A pot of {formatCurrency(inputs.pensionPot)} left unused would be added to your estate. If the rest of the estate already uses the {formatCurrency(IHT_NIL_RATE_BAND)} nil-rate band and any residence band, the pot alone could carry up to <strong className="text-foreground">{formatCurrency(r.ihtOnPotMax)}</strong> of inheritance tax at {IHT_RATE * 100}%. Anything passing to a spouse or civil partner stays exempt, and death-in-service benefits and dependants scheme pensions are excluded. The <a href="/calculator/inheritance-tax-pension-calculator/" className="text-primary underline">IHT on pensions calculator</a> works through the full estate.
            </p>
          ) : (
            <p className="text-muted-foreground">Enter an expected unused pension pot to see the most it could add to an estate's inheritance tax bill under the new rules.</p>
          )}
          <SourceLine id="iht-pensions" />
        </div>

        {/* Frozen thresholds summary */}
        <div className="rounded-xl border border-border p-4 text-sm space-y-2">
          <h4 className="font-semibold">Thresholds that stay where they are</h4>
          <p className="text-muted-foreground">
            Personal Allowance {formatCurrency(PERSONAL_ALLOWANCE)}, higher-rate threshold {formatCurrency(PERSONAL_ALLOWANCE + BASIC_RATE_BAND)}, additional-rate threshold {formatCurrency(HIGHER_RATE_LIMIT)}, National Insurance from {formatCurrency(NI_PRIMARY_THRESHOLD)} to {formatCurrency(NI_UPPER_EARNINGS_LIMIT)} at 8% then 2%, employer NI at 15% above £5,000, dividend rates at 10.75%, 35.75% and 39.35%. Budget 2026 left all of these as they were.
          </p>
          <SourceLine id="ni-thresholds" />
        </div>
      </section>

      {/* (c) Other measures, from the schedule */}
      <section className="rounded-xl bg-muted/50 p-4 sm:p-5 space-y-3" aria-labelledby="b26-other">
        <h3 id="b26-other" className="text-sm font-semibold">Other Budget 2026 measures</h3>
        <ul className="space-y-2 text-sm">
          {OTHER_MEASURE_IDS.map((id) => {
            const s = item(id)
            if (!s) return null
            return (
              <li key={s.id} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span>
                <span><strong>{s.label}.</strong> {s.from} now; <strong>{s.to}</strong> ({s.effective}). <span className="text-muted-foreground">{s.detail}</span></span>
              </li>
            )
          })}
        </ul>
      </section>

      <p className="text-xs text-muted-foreground">
        The 2026/27 figures use the current rates for England, Wales and Northern Ireland from this site's <a href="/calculator/income-tax-calculator/" className="text-primary underline">income tax</a> and <a href="/calculator/take-home-pay-calculator/" className="text-primary underline">take-home pay</a> calculators, and the 2027/28 comparison keeps the same income in the same frozen bands. The band panel looks at pay alone; rent, interest and dividends sit on top of pay. Scottish income tax bands differ. Student loan repayments, benefits in kind and salary sacrifice are not included.
      </p>

      <ShareRow params={{ salary, bonus, pension: pensionPct, dividends, rent, interest, isa: cashSavings, litres, se: selfEmployed, pot: pensionPot }} />
    </div>
  )
}
