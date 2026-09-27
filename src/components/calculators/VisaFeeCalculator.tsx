import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Home Office fees table effective 8 April 2026 (applications from outside the UK unless noted).
// Immigration Health Surcharge (gov.uk/healthcare-immigration-application/how-much-pay):
// £1,035 a year standard; £776 for students and their dependants, under-18s and Youth Mobility.
// Health and Care Worker visa holders and their dependants, ILR and citizenship pay no IHS.
const IHS_STANDARD = 1035
const IHS_REDUCED = 776
// Priority and super priority are charged per applicant (gov.uk/faster-decision-visa-settlement).
const PRIORITY_FEE = 500
const SUPER_PRIORITY_FEE = 1000
const CEREMONY_FEE = 130 // citizenship ceremony, per adult
const CHILD_REGISTRATION_FEE = 1000 // registration of a child as a British citizen

type Duration = { id: string; label: string; fee: number; ihsYears: number }
type Visa = {
  id: string
  name: string
  durations: Duration[]
  ihsAdult: number // per year, main applicant and adult dependants
  ihsChild: number // per year, dependants under 18
  childFee?: number // application fee for a child if different from the main fee
  ceremony?: number // per adult applicant
  priority: boolean
  superPriority: boolean
}

const VISA_TYPES: Visa[] = [
  { id: 'skilled_worker', name: 'Skilled Worker Visa', durations: [
    { id: '3', label: 'Up to 3 years', fee: 819, ihsYears: 3 },
    { id: '5', label: 'Over 3 years (up to 5)', fee: 1618, ihsYears: 5 },
  ], ihsAdult: IHS_STANDARD, ihsChild: IHS_REDUCED, priority: true, superPriority: true },
  { id: 'health_care', name: 'Health and Care Worker Visa', durations: [
    { id: '3', label: 'Up to 3 years', fee: 324, ihsYears: 3 },
    { id: '5', label: 'Over 3 years (up to 5)', fee: 628, ihsYears: 5 },
  ], ihsAdult: 0, ihsChild: 0, priority: true, superPriority: true },
  { id: 'student', name: 'Student Visa', durations: [
    { id: '1', label: 'Up to 1 year', fee: 558, ihsYears: 1 },
    { id: '1.5', label: 'Up to 18 months (e.g. a 1-year master\'s)', fee: 558, ihsYears: 1.5 },
    { id: '2', label: 'Up to 2 years', fee: 558, ihsYears: 2 },
    { id: '3', label: 'Up to 3 years', fee: 558, ihsYears: 3 },
    { id: '4', label: 'Up to 4 years', fee: 558, ihsYears: 4 },
  ], ihsAdult: IHS_REDUCED, ihsChild: IHS_REDUCED, priority: true, superPriority: true },
  // Initial partner visa is 2 years 9 months: the 9-month part-year is charged as a full year of IHS.
  { id: 'spouse', name: 'Spouse / Partner Visa', durations: [
    { id: '33m', label: 'Initial 2 years 9 months', fee: 2064, ihsYears: 3 },
  ], ihsAdult: IHS_STANDARD, ihsChild: IHS_REDUCED, priority: true, superPriority: true },
  { id: 'ilr', name: 'Indefinite Leave to Remain (ILR)', durations: [
    { id: 'perm', label: 'Permanent', fee: 3226, ihsYears: 0 },
  ], ihsAdult: 0, ihsChild: 0, priority: true, superPriority: true },
  // Children register rather than naturalise; super priority is not offered for citizenship.
  { id: 'citizenship', name: 'British Citizenship', durations: [
    { id: 'perm', label: 'Permanent', fee: 1709, ihsYears: 0 },
  ], ihsAdult: 0, ihsChild: 0, childFee: CHILD_REGISTRATION_FEE, ceremony: CEREMONY_FEE, priority: true, superPriority: false },
  { id: 'global_talent', name: 'Global Talent Visa', durations: [
    { id: '3', label: 'Up to 3 years', fee: 766, ihsYears: 3 },
    { id: '5', label: 'Up to 5 years', fee: 766, ihsYears: 5 },
  ], ihsAdult: IHS_STANDARD, ihsChild: IHS_REDUCED, priority: true, superPriority: true },
  // Graduate: 2 years (3 for PhD) if applying by 31 Dec 2026, 18 months from 1 Jan 2027.
  { id: 'graduate', name: 'Graduate Visa', durations: [
    { id: '2', label: '2 years (apply by 31 Dec 2026)', fee: 937, ihsYears: 2 },
    { id: '3', label: '3 years (PhD graduates)', fee: 937, ihsYears: 3 },
    { id: '1.5', label: '18 months (apply from 1 Jan 2027)', fee: 937, ihsYears: 1.5 },
  ], ihsAdult: IHS_STANDARD, ihsChild: IHS_REDUCED, priority: false, superPriority: false },
]

function calculate(visaId: string, durationId: string, speed: string, adultDependants: number, childDependants: number) {
  const visa = VISA_TYPES.find(v => v.id === visaId)
  if (!visa) return null
  const duration = visa.durations.find(d => d.id === durationId) ?? visa.durations[0]

  const baseFee = duration.fee
  const ceremonyFee = visa.ceremony ?? 0
  const ihsTotal = visa.ihsAdult * duration.ihsYears

  const adultFee = adultDependants * (baseFee + ceremonyFee)
  const adultIhs = adultDependants * ihsTotal
  const childFee = childDependants * (visa.childFee ?? baseFee)
  const childIhs = childDependants * visa.ihsChild * duration.ihsYears

  const perApplicationPriority = speed === 'super' && visa.superPriority ? SUPER_PRIORITY_FEE
    : speed === 'priority' && visa.priority ? PRIORITY_FEE : 0
  const applications = 1 + adultDependants + childDependants
  const priorityFee = perApplicationPriority * applications

  const mainTotal = baseFee + ceremonyFee + ihsTotal + perApplicationPriority
  const grandTotal = baseFee + ceremonyFee + ihsTotal + adultFee + adultIhs + childFee + childIhs + priorityFee

  return { baseFee, ceremonyFee, ihsTotal, priorityFee, perApplicationPriority, applications, mainTotal, adultFee, adultIhs, childFee, childIhs, grandTotal, adultDependants, childDependants }
}

export default function VisaFeeCalculator() {
  const [visa, setVisa] = useState('skilled_worker')
  const [duration, setDuration] = useState('3')
  const [priority, setPriority] = useState('standard')
  const [adultDeps, setAdultDeps] = useState('0')
  const [childDeps, setChildDeps] = useState('0')

  const selected = VISA_TYPES.find(v => v.id === visa) ?? VISA_TYPES[0]
  const changeVisa = (id: string) => {
    const next = VISA_TYPES.find(v => v.id === id) ?? VISA_TYPES[0]
    setVisa(next.id)
    setDuration(next.durations[0].id)
    if ((priority === 'priority' && !next.priority) || (priority === 'super' && !next.superPriority)) setPriority('standard')
  }

  const a = Math.max(0, parseInt(adultDeps) || 0)
  const c = Math.max(0, parseInt(childDeps) || 0)
  const result = useMemo(() => calculate(visa, duration, priority, a, c), [visa, duration, priority, a, c])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Visa Type</label>
          <select value={visa} onChange={(e) => changeVisa(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Visa Type">
            {VISA_TYPES.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select></div>
        <div><label className="block text-sm font-medium mb-2">Duration</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Duration">
            {selected.durations.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select></div>
        <div><label className="block text-sm font-medium mb-2">Processing Speed</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Processing Speed">
            <option value="standard">Standard</option>
            {selected.priority && <option value="priority">Priority (+£500 per applicant)</option>}
            {selected.superPriority && <option value="super">Super Priority (+£1,000 per applicant)</option>}
          </select></div>
        <div><label className="block text-sm font-medium mb-2">Adult Dependants (partner)</label>
          <input type="number" min="0" max="10" value={adultDeps} onChange={(e) => setAdultDeps(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Adult Dependants (partner)" /></div>
        <div><label className="block text-sm font-medium mb-2">Child Dependants (under 18)</label>
          <input type="number" min="0" max="10" value={childDeps} onChange={(e) => setChildDeps(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Child Dependants (under 18)" /></div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Visa Cost</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.grandTotal)}</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Application fee (main)</td><td className="text-right tabular-nums">{formatCurrency(result.baseFee)}</td></tr>
              {result.ceremonyFee > 0 && <tr className="border-b border-border/50"><td className="py-2">Citizenship ceremony (main)</td><td className="text-right tabular-nums">{formatCurrency(result.ceremonyFee)}</td></tr>}
              {result.ihsTotal > 0 && <tr className="border-b border-border/50"><td className="py-2">Immigration Health Surcharge (IHS)</td><td className="text-right tabular-nums">{formatCurrency(result.ihsTotal)}</td></tr>}
              {result.adultDependants > 0 && <tr className="border-b border-border/50"><td className="py-2">Adult dependants ({result.adultDependants}x)</td><td className="text-right tabular-nums">{formatCurrency(result.adultFee + result.adultIhs)}</td></tr>}
              {result.childDependants > 0 && <tr className="border-b border-border/50"><td className="py-2">Child dependants ({result.childDependants}x)</td><td className="text-right tabular-nums">{formatCurrency(result.childFee + result.childIhs)}</td></tr>}
              {result.priorityFee > 0 && <tr className="border-b border-border/50"><td className="py-2">Priority processing ({result.applications}x {formatCurrency(result.perApplicationPriority)})</td><td className="text-right tabular-nums">{formatCurrency(result.priorityFee)}</td></tr>}
              <tr className="font-semibold"><td className="py-2">Grand Total</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.grandTotal)}</td></tr>
            </tbody>
          </table>
          {visa === 'health_care' && <p className="text-xs text-muted-foreground">Health and Care Worker visa holders and their dependants are exempt from the Immigration Health Surcharge.</p>}
          {visa === 'citizenship' && <p className="text-xs text-muted-foreground">Adults pay the naturalisation fee plus the ceremony fee. Children register as British citizens for {formatCurrency(CHILD_REGISTRATION_FEE)} each. Super priority is not available for citizenship.</p>}
        </div>
      )}
    </div>
  )
}
