import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const ANNUAL_ALLOWANCE = 60_000
const TAPER_START = 260_000 // adjusted income
const TAPER_END = 360_000
const MIN_ALLOWANCE = 10_000
const MONEY_PURCHASE_AA = 10_000
const THRESHOLD_INCOME_LIMIT = 200_000 // taper needs threshold income over this as well
const PERSONAL_ALLOWANCE = 12_570
const PA_TAPER_START = 100_000

// 2026/27 income tax bands as cumulative limits of TAXABLE income (after the Personal Allowance)
const RUK_BANDS = [
  { upTo: 37_700, rate: 0.20 },
  { upTo: 125_140, rate: 0.40 },
  { upTo: Infinity, rate: 0.45 },
]
// Scotland: starter 3,967 / basic 12,989 / intermediate 14,136 / higher 31,338 / advanced 62,710 wide, top 48%
const SCOT_BANDS = [
  { upTo: 3_967, rate: 0.19 },
  { upTo: 16_956, rate: 0.20 },
  { upTo: 31_092, rate: 0.21 },
  { upTo: 62_430, rate: 0.42 },
  { upTo: 125_140, rate: 0.45 },
  { upTo: Infinity, rate: 0.48 },
]

type Method = 'ras' | 'net'

interface Inputs {
  pay: number          // pay and other taxable income, after salary sacrifice, before your own contributions
  own: number          // your own contributions, gross
  method: Method       // relief at source or net pay
  employer: number     // all employer contributions, including salary sacrifice
  sacrifice: number    // of which salary sacrifice / flexible remuneration (arrangements from 9 July 2015)
  carryForward: number // unused allowance from the previous 3 tax years
  mpaa: boolean
  scotland: boolean
}

function personalAllowance(adjustedNetIncome: number) {
  if (adjustedNetIncome <= PA_TAPER_START) return PERSONAL_ALLOWANCE
  return Math.max(0, PERSONAL_ALLOWANCE - Math.floor((adjustedNetIncome - PA_TAPER_START) / 2))
}

// The annual allowance charge is income tax on the excess as if it were the top slice of your
// taxable income (FA 2004 s.227(4)). Relief-at-source contributions extend every band limit
// above the lowest one (ITA 2007 s.192; in Scotland the starter band stays put).
function chargeOnExcess(taxable: number, excess: number, scotland: boolean, rasGross: number) {
  const bands = scotland ? SCOT_BANDS : RUK_BANDS
  const uppers = bands.map((b, i) => (i === 0 && scotland ? b.upTo : b.upTo + rasGross))
  const top = taxable + excess
  const parts: { rate: number; amount: number }[] = []
  let charge = 0
  bands.forEach((b, i) => {
    const from = Math.max(i === 0 ? 0 : uppers[i - 1], taxable)
    const to = Math.min(uppers[i], top)
    if (to > from) {
      parts.push({ rate: b.rate, amount: to - from })
      charge += (to - from) * b.rate
    }
  })
  return { charge, parts }
}

function calculate(inp: Inputs) {
  const pay = Math.max(0, inp.pay)
  const own = Math.max(0, inp.own)
  const employer = Math.max(0, inp.employer)
  const sacrifice = Math.min(Math.max(0, inp.sacrifice), employer)
  const carryForward = inp.mpaa ? 0 : Math.max(0, inp.carryForward)

  // Net pay contributions come off pay before tax, so they reduce net income.
  // Relief-at-source contributions do not; they are deducted for threshold income instead.
  const netPay = inp.method === 'net' ? Math.min(own, pay) : 0
  const rasGross = inp.method === 'ras' ? own : 0
  const netIncome = Math.max(0, pay - netPay)

  // gov.uk "work out your tapered annual allowance":
  // threshold income = net income - gross relief-at-source contributions + salary sacrifice set up after 8 July 2015
  // adjusted income  = net income + net-pay contributions + all employer contributions (salary sacrifice included)
  const thresholdIncome = Math.max(0, netIncome - rasGross + sacrifice)
  const adjustedIncome = netIncome + netPay + employer

  const tapered = thresholdIncome > THRESHOLD_INCOME_LIMIT && adjustedIncome > TAPER_START
  const taperedAA = tapered
    ? Math.max(MIN_ALLOWANCE, ANNUAL_ALLOWANCE - Math.floor((adjustedIncome - TAPER_START) / 2))
    : ANNUAL_ALLOWANCE
  // With the MPAA triggered and only money purchase savings, the charge is on savings over £10,000;
  // carry forward cannot be used against it.
  const aa = inp.mpaa ? MONEY_PURCHASE_AA : taperedAA
  const available = aa + carryForward

  const used = own + employer
  const excess = Math.max(0, used - available)
  const remaining = Math.max(0, available - used)

  // The excess sits on top of taxable income; it does not reduce the Personal Allowance further.
  const pa = personalAllowance(netIncome - rasGross)
  const taxable = Math.max(0, netIncome - pa)
  const { charge, parts } = chargeOnExcess(taxable, excess, inp.scotland, rasGross)

  return {
    netIncome, thresholdIncome, adjustedIncome, tapered, taperedAA, aa, carryForward, available,
    used, excess, remaining, taxable, charge, parts,
    schemePays: charge > 2_000 && used > ANNUAL_ALLOWANCE,
    overEarnings: own > Math.max(pay, 3_600),
  }
}

function parse(v: string) {
  return Math.max(0, parseFloat(v.replace(/,/g, '')) || 0)
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

function MoneyField({ id, label, hint, value, onChange }: { id: string; label: string; hint?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
        <input id={id} type="text" inputMode="numeric" value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      </div>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  )
}

export default function PensionAnnualAllowanceCalculator() {
  const [pay, setPay] = useState('50000')
  const [own, setOwn] = useState('5000')
  const [method, setMethod] = useState<Method>('ras')
  const [employer, setEmployer] = useState('15000')
  const [sacrifice, setSacrifice] = useState('0')
  const [carryForward, setCarryForward] = useState('0')
  const [mpaa, setMpaa] = useState(false)
  const [scotland, setScotland] = useState(false)

  const result = useMemo(() => calculate({
    pay: parse(pay), own: parse(own), method, employer: parse(employer),
    sacrifice: parse(sacrifice), carryForward: parse(carryForward), mpaa, scotland,
  }), [pay, own, method, employer, sacrifice, carryForward, mpaa, scotland])
  const exceeded = result.excess > 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MoneyField id="aa-pay" label="Pay and other taxable income" hint="After any salary sacrifice, before your own pension contributions come off" value={pay} onChange={setPay} />
        <MoneyField id="aa-own" label="Your own pension contributions (gross)" hint="Relief at source: what you pay plus the 20% added (£80 paid = £100)" value={own} onChange={setOwn} />
        <div>
          <label htmlFor="aa-method" className="block text-sm font-medium mb-2">How your own contributions are paid</label>
          <select id="aa-method" value={method} onChange={(e) => setMethod(e.target.value as Method)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="ras">Relief at source (provider adds 20%)</option>
            <option value="net">Net pay (taken from pay before tax)</option>
          </select>
        </div>
        <MoneyField id="aa-employer" label="Employer contributions (incl. salary sacrifice)" value={employer} onChange={setEmployer} />
        <MoneyField id="aa-sacrifice" label="Of which salary sacrifice" hint="Pay given up for pension under arrangements made on or after 9 July 2015" value={sacrifice} onChange={setSacrifice} />
        <MoneyField id="aa-cf" label="Unused allowance carried forward (previous 3 years)" hint="Only years you were in a registered scheme. Not usable against the MPAA" value={carryForward} onChange={setCarryForward} />
      </div>
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={mpaa} onChange={(e) => setMpaa(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Money Purchase Annual Allowance triggered (£10,000 limit)</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={scotland} onChange={(e) => setScotland(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Scottish taxpayer (charge at Scottish rates)</span></label>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className={`rounded-2xl p-6 text-center ${exceeded ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}>
          {exceeded ? (
            <>
              <p className="text-lg font-bold text-destructive">Annual allowance exceeded</p>
              <p className="text-2xl font-bold text-destructive mt-1">Tax charge: {formatCurrency(result.charge)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Excess {formatCurrency(result.excess)}: {result.parts.map((p) => `${formatCurrency(p.amount)} at ${+(p.rate * 100).toFixed(0)}%`).join(' + ')}
              </p>
            </>
          ) : (
            <><p className="text-sm text-muted-foreground">Allowance left this year</p><p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.remaining)}</p></>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">{mpaa ? 'MPAA' : result.tapered ? 'Tapered allowance' : 'Annual allowance'}</p><p className="text-lg font-bold">{formatCurrency(result.aa)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">With carry forward</p><p className="text-lg font-bold">{formatCurrency(result.available)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Pension savings</p><p className="text-lg font-bold">{formatCurrency(result.used)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Excess</p><p className="text-lg font-bold">{formatCurrency(result.excess)}</p></div>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2">Net income</td><td className="text-right tabular-nums">{formatCurrency(result.netIncome)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Threshold income (taper needs over £{THRESHOLD_INCOME_LIMIT.toLocaleString()})</td><td className="text-right tabular-nums">{formatCurrency(result.thresholdIncome)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Adjusted income (taper starts over £{TAPER_START.toLocaleString()})</td><td className="text-right tabular-nums">{formatCurrency(result.adjustedIncome)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Taxable income the excess is added to</td><td className="text-right tabular-nums">{formatCurrency(result.taxable)}</td></tr>
          </tbody>
        </table>
        {result.schemePays && (
          <p className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">The charge is over £2,000, so if this scheme&apos;s pension savings for the year are over £60,000 you can make it pay the charge from your pension (mandatory Scheme Pays). Otherwise you pay it through Self Assessment.</p>
        )}
        {result.overEarnings && (
          <p className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-sm text-orange-800 dark:text-orange-300">Tax relief on your own contributions is limited to 100% of your relevant UK earnings (or £3,600 gross with no earnings). Contributions above that get no relief, and carry forward does not change the limit.</p>
        )}
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
          <p>Standard allowance £{ANNUAL_ALLOWANCE.toLocaleString()}. It tapers by £1 for every £2 of adjusted income over £{TAPER_START.toLocaleString()}, to a minimum of £{MIN_ALLOWANCE.toLocaleString()} at £{TAPER_END.toLocaleString()}, but only when threshold income is also over £{THRESHOLD_INCOME_LIMIT.toLocaleString()}. Threshold income adds back salary sacrificed since 9 July 2015.</p>
          <p>The charge taxes the excess as the top slice of your income at your own rates. MPAA £{MONEY_PURCHASE_AA.toLocaleString()} applies once you have flexibly accessed a defined contribution pension; this tool treats all savings as money purchase and all income as non-savings income.</p>
        </div>
      </div>
    </div>
  )
}
