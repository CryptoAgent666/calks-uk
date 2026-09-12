import { useState } from 'react'
import { formatCurrency } from '@/utils'

// General damages brackets from the Judicial College Guidelines, 18th edition (April 2026).
// Figures already include the 10% Simmons v Castle uplift. "Up to" brackets have min 0.
// Road traffic whiplash lasting up to 2 years is not valued by the Guidelines: it uses the
// fixed tariff in the Whiplash Injury Regulations 2021 as amended by SI 2025/615 (causes of
// action on or after 31 May 2025).
type Range = { severity: string; min: number; max: number; withPsych?: number }

const INJURY_TYPES: Record<string, { name: string; tariff?: boolean; ranges: Range[] }> = {
  whiplash: { name: 'Whiplash, road traffic accident (up to 2 years)', tariff: true, ranges: [
    { severity: 'Up to 3 months', min: 275, max: 275, withPsych: 300 },
    { severity: '3 to 6 months', min: 565, max: 565, withPsych: 595 },
    { severity: '6 to 9 months', min: 965, max: 965, withPsych: 1_025 },
    { severity: '9 to 12 months', min: 1_510, max: 1_510, withPsych: 1_595 },
    { severity: '12 to 15 months', min: 2_335, max: 2_335, withPsych: 2_435 },
    { severity: '15 to 18 months', min: 3_445, max: 3_445, withPsych: 3_550 },
    { severity: '18 to 24 months', min: 4_830, max: 4_830, withPsych: 4_975 },
  ]},
  neck: { name: 'Neck Injury (not tariff whiplash)', ranges: [
    { severity: 'Minor, recovery within 3 months', min: 0, max: 3_240 },
    { severity: 'Minor, recovery within 1 year', min: 3_240, max: 5_750 },
    { severity: 'Minor, recovery within 2 years', min: 5_750, max: 10_420 },
    { severity: 'Moderate (iii)', min: 10_420, max: 18_150 },
    { severity: 'Moderate (ii)', min: 18_150, max: 33_020 },
    { severity: 'Moderate (i)', min: 33_020, max: 50_850 },
    { severity: 'Severe (iii)', min: 60_080, max: 73_970 },
    { severity: 'Severe (ii)', min: 86_860, max: 172_970 },
    { severity: 'Severe (i)', min: 195_970, max: 195_970 },
  ]},
  back: { name: 'Back Injury', ranges: [
    { severity: 'Minor (iii), recovery within 3 months (approx.)', min: 0, max: 3_240 },
    { severity: 'Minor (ii), recovery within 2 years', min: 5_750, max: 10_420 },
    { severity: 'Minor (i), recovery within 5 years', min: 10_420, max: 16_520 },
    { severity: 'Moderate (ii)', min: 16_520, max: 36_680 },
    { severity: 'Moderate (i)', min: 36_680, max: 51_230 },
    { severity: 'Severe (iii)', min: 51_230, max: 92_130 },
    { severity: 'Severe (ii)', min: 97_980, max: 116_820 },
    { severity: 'Severe (i)', min: 120_340, max: 212_670 },
  ]},
  shoulder: { name: 'Shoulder Injury', ranges: [
    { severity: 'Minor, recovery within 3 months', min: 0, max: 3_240 },
    { severity: 'Minor, recovery within 1 year', min: 3_240, max: 5_750 },
    { severity: 'Minor, recovery within 2 years', min: 5_750, max: 10_420 },
    { severity: 'Fracture of clavicle', min: 6_800, max: 16_170 },
    { severity: 'Moderate', min: 10_420, max: 16_870 },
    { severity: 'Serious', min: 16_870, max: 25_370 },
    { severity: 'Severe', min: 25_370, max: 63_450 },
  ]},
  arm: { name: 'Arm Injury', ranges: [
    { severity: 'Simple fracture of the forearm', min: 8_730, max: 25_370 },
    { severity: 'Less severe injury', min: 25_370, max: 51_750 },
    { severity: 'Permanent and substantial disablement', min: 51_750, max: 79_080 },
    { severity: 'Severe injury', min: 127_050, max: 172_970 },
  ]},
  leg: { name: 'Leg Injury', ranges: [
    { severity: 'Less serious (iii), simple fracture or soft tissue', min: 0, max: 15_640 },
    { severity: 'Less serious (ii), simple femur fracture', min: 12_040, max: 18_600 },
    { severity: 'Less serious (i), incomplete recovery', min: 23_730, max: 36_680 },
    { severity: 'Moderate', min: 36_680, max: 51_790 },
    { severity: 'Serious', min: 51_790, max: 72_440 },
    { severity: 'Very serious', min: 72_440, max: 117_210 },
    { severity: 'Most serious short of amputation', min: 127_160, max: 179_560 },
  ]},
  knee: { name: 'Knee Injury', ranges: [
    { severity: 'Moderate (ii)', min: 0, max: 18_150 },
    { severity: 'Moderate (i)', min: 19_610, max: 34_600 },
    { severity: 'Severe (iii)', min: 34_600, max: 57_410 },
    { severity: 'Severe (ii)', min: 68_860, max: 92_130 },
    { severity: 'Severe (i)', min: 92_130, max: 127_110 },
  ]},
  psychological: { name: 'Psychiatric Injury', ranges: [
    { severity: 'Less severe', min: 2_040, max: 7_740 },
    { severity: 'Moderate', min: 7_740, max: 25_190 },
    { severity: 'Moderately severe', min: 25_190, max: 72_440 },
    { severity: 'Severe', min: 72_440, max: 152_900 },
  ]},
  ptsd: { name: 'Post-Traumatic Stress Disorder', ranges: [
    { severity: 'Less severe', min: 5_220, max: 10_810 },
    { severity: 'Moderate', min: 10_810, max: 30_580 },
    { severity: 'Moderately severe', min: 30_580, max: 79_080 },
    { severity: 'Severe', min: 79_080, max: 133_000 },
  ]},
}

const fmtRange = (min: number, max: number) =>
  min === max ? formatCurrency(max) : min === 0 ? `up to ${formatCurrency(max)}` : `${formatCurrency(min)} – ${formatCurrency(max)}`

export default function PersonalInjuryCalculator() {
  const [injuryType, setInjuryType] = useState('whiplash')
  const [severity, setSeverity] = useState(0)
  const [withPsych, setWithPsych] = useState(false)
  const [lostEarnings, setLostEarnings] = useState('0')
  const [medicalCosts, setMedicalCosts] = useState('0')
  const [travelCosts, setTravelCosts] = useState('0')

  const injury = INJURY_TYPES[injuryType]
  const range = injury.ranges[severity] || injury.ranges[0]
  const tariffAmount = injury.tariff && withPsych && range.withPsych ? range.withPsych : null
  const gdMin = tariffAmount ?? range.min
  const gdMax = tariffAmount ?? range.max
  const le = parseFloat(lostEarnings.replace(/,/g,'')) || 0
  const mc = parseFloat(medicalCosts.replace(/,/g,'')) || 0
  const tc = parseFloat(travelCosts.replace(/,/g,'')) || 0
  const specialDamages = le + mc + tc
  const totalMin = gdMin + specialDamages
  const totalMax = gdMax + specialDamages

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Injury Type</label><select value={injuryType} onChange={(e) => { setInjuryType(e.target.value); setSeverity(0) }} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Injury Type">{Object.entries(INJURY_TYPES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">{injury.tariff ? 'Recovery Time' : 'Severity'}</label><select value={severity} onChange={(e) => setSeverity(parseInt(e.target.value))} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Severity">{injury.ranges.map((r, i) => <option key={i} value={i}>{r.severity}</option>)}</select></div>
      </div>
      {injury.tariff && (
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={withPsych} onChange={(e) => setWithPsych(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">With minor psychological injury</span></label>
      )}
      <h3 className="text-sm font-semibold">Special Damages (financial losses)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Lost Earnings</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={lostEarnings} onChange={(e) => setLostEarnings(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Lost Earnings" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Medical Costs</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={medicalCosts} onChange={(e) => setMedicalCosts(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Medical Costs" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Travel / Other Costs</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={travelCosts} onChange={(e) => setTravelCosts(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Travel / Other Costs" /></div></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Compensation</p>
          <p className="text-3xl font-bold text-primary mt-1">{totalMin === totalMax ? formatCurrency(totalMax) : `${formatCurrency(totalMin)} – ${formatCurrency(totalMax)}`}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">{injury.tariff ? 'General Damages (fixed tariff)' : 'General Damages (pain & suffering)'}</p><p className="text-lg font-bold">{fmtRange(gdMin, gdMax)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Special Damages (financial)</p><p className="text-lg font-bold">{formatCurrency(specialDamages)}</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>{injury.tariff
            ? 'Road traffic whiplash lasting up to 2 years is paid on the fixed tariff in the Whiplash Injury Regulations 2021, as uprated for accidents from 31 May 2025. A court can add up to 20% only in exceptional circumstances.'
            : 'Brackets from the Judicial College Guidelines, 18th edition (April 2026), including the 10% Simmons v Castle uplift. They are where a valuation starts, not a guaranteed award.'} Most claims settle out of court, and a no win no fee solicitor can take a success fee of up to 25% of the damages.</p>
        </div>
      </div>
    </div>
  )
}
