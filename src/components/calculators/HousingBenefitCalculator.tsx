import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Simplified Housing Benefit estimate, 2026/27 (DWP benefit and pension rates 2026 to 2027).
// New claims: gov.uk/housing-benefit. Premiums and earnings disregards are left out on purpose.
type AgeGroup = 'working' | 'spa' | 'mixed'
type Tenancy = 'private' | 'social'

// Non-dependant deductions, weekly (HB Regs 2006 reg 74; Pension Age Regs reg 55)
const NON_DEP_BANDS = [
  { label: 'None', amount: 0 },
  { label: 'Not in paid work, or gross pay under £192 a week: £20.40', amount: 20.40 },
  { label: 'Gross £192 to £278.99 a week: £46.85', amount: 46.85 },
  { label: 'Gross £279 to £364.99 a week: £64.35', amount: 64.35 },
  { label: 'Gross £365 to £484.99 a week: £105.20', amount: 105.20 },
  { label: 'Gross £485 to £604.99 a week: £119.85', amount: 119.85 },
  { label: 'Gross £605 a week or more: £131.45', amount: 131.45 },
]

const CHILD_ALLOWANCE = 87.88
const CAPITAL_LIMIT = 16_000

interface HousingBenefitInput {
  weeklyRent: number
  lhaRate: number
  tenancy: Tenancy
  isSingle: boolean
  ageGroup: AgeGroup
  reachedSpaBefore2021: boolean
  under25: boolean
  children: number
  weeklyIncome: number
  savings: number
  guaranteeCredit: boolean
  nonDepDeduction: number
  spareRooms: number
  specialHousing: boolean
  existingClaim: boolean
}

function calculate(input: HousingBenefitInput) {
  const { weeklyRent, lhaRate, tenancy, isSingle, reachedSpaBefore2021, under25, children, weeklyIncome, savings, nonDepDeduction, spareRooms, specialHousing, existingClaim } = input
  const ageGroup: AgeGroup = isSingle && input.ageGroup === 'mixed' ? 'spa' : input.ageGroup
  const pensionRules = ageGroup !== 'working'
  const guaranteeCredit = pensionRules && input.guaranteeCredit

  // Who can make a new claim
  const barred = (ageGroup === 'working' || ageGroup === 'mixed') && !specialHousing && !existingClaim ? ageGroup : null
  const overCapital = savings > CAPITAL_LIMIT && !guaranteeCredit

  // Eligible rent: LHA caps private rents only; the spare-room cut comes off eligible rent,
  // for working-age social tenants outside supported or temporary housing
  const rentAfterCap = tenancy === 'private' ? Math.min(weeklyRent, lhaRate) : weeklyRent
  const appliesSpareRoomCut = tenancy === 'social' && ageGroup === 'working' && !specialHousing
  const spareRoomRate = !appliesSpareRoomCut ? 0 : spareRooms >= 2 ? 0.25 : spareRooms === 1 ? 0.14 : 0
  const spareRoomCut = rentAfterCap * spareRoomRate
  const eligibleRent = rentAfterCap - spareRoomCut

  // Maximum Housing Benefit is eligible rent less any non-dependant deduction
  const maximumHB = Math.max(0, eligibleRent - nonDepDeduction)

  // Weekly personal allowance 2026/27, plus £87.88 for each child
  let personalAllowance: number
  if (pensionRules) personalAllowance = isSingle ? (reachedSpaBefore2021 ? 256.00 : 238.00) : (reachedSpaBefore2021 ? 383.35 : 363.25)
  else if (isSingle) personalAllowance = under25 && children === 0 ? 75.65 : 95.55
  else personalAllowance = 150.15
  const applicableAmount = personalAllowance + children * CHILD_ALLOWANCE

  // Tariff income: £1 a week for each £250, or part, above £6,000; State Pension age £1 for each £500, or part, above £10,000
  let tariffIncome = 0
  if (!guaranteeCredit) {
    const disregard = pensionRules ? 10_000 : 6_000
    const step = pensionRules ? 500 : 250
    tariffIncome = Math.ceil(Math.max(0, savings - disregard) / step)
  }

  // Guarantee Credit: all income and capital are disregarded
  const assessedIncome = guaranteeCredit ? 0 : weeklyIncome + tariffIncome
  const excessIncome = Math.max(0, assessedIncome - applicableAmount)
  const taper = excessIncome * 0.65

  const weeklyHB = overCapital ? 0 : Math.max(0, maximumHB - taper)
  const monthlyHB = weeklyHB * 52 / 12
  const annualHB = weeklyHB * 52

  return { ageGroup, barred, overCapital, guaranteeCredit, appliesSpareRoomCut, spareRoomCut, eligibleRent, nonDepDeduction, maximumHB, tariffIncome, weeklyHB, monthlyHB, annualHB, taper, applicableAmount }
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'
const selectClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'
const tickClass = 'flex items-center gap-3 cursor-pointer'
const buttonClass = (active: boolean) => `px-4 py-2.5 rounded-xl text-sm font-medium border ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`

export default function HousingBenefitCalculator() {
  const [rent, setRent] = useState('150')
  const [lha, setLha] = useState('160')
  const [income, setIncome] = useState('280')
  const [savings, setSavings] = useState('12000')
  const [tenancy, setTenancy] = useState<Tenancy>('private')
  const [single, setSingle] = useState(true)
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('spa')
  const [before2021, setBefore2021] = useState(false)
  const [under25, setUnder25] = useState(false)
  const [children, setChildren] = useState('0')
  const [guaranteeCredit, setGuaranteeCredit] = useState(false)
  const [nonDep, setNonDep] = useState(0)
  const [spareRooms, setSpareRooms] = useState(0)
  const [specialHousing, setSpecialHousing] = useState(false)
  const [existingClaim, setExistingClaim] = useState(false)

  const r = parseFloat(rent) || 0
  const l = parseFloat(lha) || 0
  const i = parseFloat(income) || 0
  const s = parseFloat(savings) || 0
  const c = Math.max(0, parseInt(children) || 0)
  const result = useMemo(() => calculate({
    weeklyRent: r, lhaRate: l, tenancy, isSingle: single, ageGroup, reachedSpaBefore2021: before2021, under25, children: c,
    weeklyIncome: i, savings: s, guaranteeCredit, nonDepDeduction: NON_DEP_BANDS[nonDep].amount, spareRooms, specialHousing, existingClaim,
  }), [r, l, tenancy, single, ageGroup, before2021, under25, c, i, s, guaranteeCredit, nonDep, spareRooms, specialHousing, existingClaim])

  const group = result.ageGroup
  const needsLha = tenancy === 'private' && l <= 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setSingle(true)} className={buttonClass(single)}>Single</button>
        <button onClick={() => setSingle(false)} className={buttonClass(!single)}>Couple</button>
      </div>
      {single ? (
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setAgeGroup('working')} className={buttonClass(group === 'working')}>Working age</button>
          <button onClick={() => setAgeGroup('spa')} className={buttonClass(group === 'spa')}>State Pension age</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button onClick={() => setAgeGroup('spa')} className={buttonClass(group === 'spa')}>Both reached State Pension age</button>
          <button onClick={() => setAgeGroup('mixed')} className={buttonClass(group === 'mixed')}>Only one of us has</button>
          <button onClick={() => setAgeGroup('working')} className={buttonClass(group === 'working')}>Neither of us has</button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setTenancy('private')} className={buttonClass(tenancy === 'private')}>Private tenant</button>
        <button onClick={() => setTenancy('social')} className={buttonClass(tenancy === 'social')}>Council or social tenant</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Weekly Rent</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={rent} onChange={(e) => setRent(e.target.value)} className={inputClass} aria-label="Weekly Rent" /></div></div>
        {tenancy === 'private' && (
          <div><label className="block text-sm font-medium mb-2">LHA Rate (weekly)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={lha} onChange={(e) => setLha(e.target.value)} className={inputClass} aria-label="LHA Rate (weekly)" /></div><p className="text-xs text-muted-foreground mt-1">Check at lha-direct.voa.gov.uk</p></div>
        )}
        <div><label className="block text-sm font-medium mb-2">Weekly Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={income} onChange={(e) => setIncome(e.target.value)} className={inputClass} aria-label="Weekly Income" /></div><p className="text-xs text-muted-foreground mt-1">Household income, with earnings after tax and NI. Leave out savings.</p></div>
        <div><label className="block text-sm font-medium mb-2">Savings</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={savings} onChange={(e) => setSavings(e.target.value)} className={inputClass} aria-label="Savings" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Dependent Children</label><input type="number" min="0" step="1" value={children} onChange={(e) => setChildren(e.target.value)} className={selectClass} aria-label="Dependent Children" /></div>
        <div className="col-span-2 sm:col-span-1"><label className="block text-sm font-medium mb-2">Non-dependant adult at home</label><select value={nonDep} onChange={(e) => setNonDep(parseInt(e.target.value))} className={selectClass} aria-label="Non-dependant adult at home">{NON_DEP_BANDS.map((b, idx) => <option key={b.label} value={idx}>{b.label}</option>)}</select><p className="text-xs text-muted-foreground mt-1">Choose None if you or your partner are severely sight impaired, or get Attendance Allowance, the DLA care component or PIP daily living.</p></div>
      </div>

      <div className="space-y-3">
        {group !== 'working' && (
          <label className={tickClass}><input type="checkbox" checked={before2021} onChange={(e) => setBefore2021(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">{single ? 'I reached State Pension age before 1 April 2021' : 'One of us reached State Pension age before 1 April 2021'}</span></label>
        )}
        {group !== 'working' && (
          <label className={tickClass}><input type="checkbox" checked={guaranteeCredit} onChange={(e) => setGuaranteeCredit(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">{single ? 'I get' : 'We get'} the Guarantee Credit of Pension Credit</span></label>
        )}
        {group === 'working' && single && c === 0 && (
          <label className={tickClass}><input type="checkbox" checked={under25} onChange={(e) => setUnder25(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">I am under 25 and not on main-phase ESA</span></label>
        )}
        {group !== 'spa' && (
          <label className={tickClass}><input type="checkbox" checked={specialHousing} onChange={(e) => setSpecialHousing(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">{single ? 'I live' : 'We live'} in temporary housing (such as a council B&B or a refuge), or supported or sheltered housing with care, support or supervision</span></label>
        )}
        {group === 'working' && (
          <label className={tickClass}><input type="checkbox" checked={existingClaim} onChange={(e) => setExistingClaim(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">{single ? 'I already get' : 'We already get'} Housing Benefit on an existing claim</span></label>
        )}
        {group === 'mixed' && (
          <label className={tickClass}><input type="checkbox" checked={existingClaim} onChange={(e) => setExistingClaim(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Before 15 May 2019, the older of us had reached State Pension age and we started Pension Credit as a couple, or were already getting Housing Benefit</span></label>
        )}
        {result.appliesSpareRoomCut && (
          <div className="max-w-xs"><label className="block text-sm font-medium mb-2">Spare bedrooms</label><select value={spareRooms} onChange={(e) => setSpareRooms(parseInt(e.target.value))} className={selectClass} aria-label="Spare bedrooms"><option value={0}>None</option><option value={1}>1 (14% off eligible rent)</option><option value={2}>2 or more (25% off eligible rent)</option></select></div>
        )}
      </div>

      {result.barred ? (
        <div className="rounded-2xl bg-destructive/10 p-6 text-sm">
          <p className="text-lg font-bold text-destructive">You cannot make a new Housing Benefit claim</p>
          {result.barred === 'working' ? (
            <p className="mt-2">New claims are limited to people who have reached State Pension age or who live in supported, sheltered or temporary housing. Apply for <a href="/calculator/universal-credit-calculator/" className="text-primary underline">Universal Credit</a> to help with your rent instead.</p>
          ) : (
            <p className="mt-2">A couple can only make a new claim if both have reached State Pension age, so apply for <a href="/calculator/universal-credit-calculator/" className="text-primary underline">Universal Credit</a> instead. The exceptions are supported, sheltered or temporary housing, and the arrangements in place before 15 May 2019 that you can tick above.</p>
          )}
        </div>
      ) : result.overCapital ? (
        <div className="rounded-2xl bg-destructive/10 p-6 text-sm">
          <p className="text-lg font-bold text-destructive">Savings over £16,000</p>
          <p className="mt-2">You usually cannot get Housing Benefit with savings above £16,000. The limit does not apply if you get the Guarantee Credit of Pension Credit.</p>
        </div>
      ) : needsLha ? (
        <div className="rounded-2xl bg-muted/50 border border-border p-6 text-center text-sm text-muted-foreground">Enter the LHA rate for your area and the number of bedrooms you are allowed.</div>
      ) : (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Weekly Housing Benefit</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.weeklyHB)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyHB)}/month</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Weekly Rent</td><td className="text-right tabular-nums">{formatCurrency(r)}</td></tr>
              {tenancy === 'private' && <tr className="border-b border-border/50"><td className="py-2">LHA Cap</td><td className="text-right tabular-nums">{formatCurrency(l)}</td></tr>}
              {result.spareRoomCut > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Spare Bedroom Cut</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.spareRoomCut)}</td></tr>}
              <tr className="border-b border-border/50"><td className="py-2">Eligible Rent</td><td className="text-right tabular-nums">{formatCurrency(result.eligibleRent)}</td></tr>
              {result.nonDepDeduction > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Non-dependant Deduction</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.nonDepDeduction)}</td></tr>}
              <tr className="border-b border-border/50"><td className="py-2">Applicable Amount</td><td className="text-right tabular-nums">{formatCurrency(result.applicableAmount)}</td></tr>
              {result.tariffIncome > 0 && <tr className="border-b border-border/50"><td className="py-2">Tariff Income from Savings</td><td className="text-right tabular-nums">{formatCurrency(result.tariffIncome)}</td></tr>}
              {result.taper > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income Taper (65%)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.taper)}</td></tr>}
              <tr className="font-semibold"><td className="py-2 text-primary">Housing Benefit</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.weeklyHB)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
            <p>This is an estimate. It leaves out premiums (such as disability and carer premiums) and earnings disregards, which can raise an award, and it assumes one non-dependant. Your council works out the actual amount.</p>
            {result.guaranteeCredit && <p>With the Guarantee Credit all your income and savings are ignored, so only eligible rent and any non-dependant deduction count.</p>}
            {specialHousing && group !== 'spa' && <p>Rent rules in supported, sheltered or temporary housing can differ from the LHA and spare-room rules above, so check with your council.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
