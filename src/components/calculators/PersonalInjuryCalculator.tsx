import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Judicial College Guidelines — simplified ranges 2025
const INJURY_TYPES: Record<string, { name: string; ranges: { severity: string; min: number; max: number }[] }> = {
  whiplash: { name: 'Whiplash / Neck Injury', ranges: [
    { severity: 'Minor (recovery < 3 months)', min: 500, max: 2_500 },
    { severity: 'Moderate (recovery 3-12 months)', min: 2_500, max: 7_500 },
    { severity: 'Serious (recovery 1-2 years)', min: 7_500, max: 15_000 },
    { severity: 'Severe (long-term)', min: 15_000, max: 50_000 },
  ]},
  back: { name: 'Back Injury', ranges: [
    { severity: 'Minor (recovery < 3 months)', min: 500, max: 2_500 },
    { severity: 'Moderate (recovery 3-12 months)', min: 2_500, max: 12_000 },
    { severity: 'Serious (ongoing issues)', min: 12_000, max: 40_000 },
    { severity: 'Severe (permanent)', min: 40_000, max: 170_000 },
  ]},
  arm: { name: 'Arm / Shoulder Injury', ranges: [
    { severity: 'Minor', min: 1_000, max: 5_000 },
    { severity: 'Moderate', min: 5_000, max: 20_000 },
    { severity: 'Serious', min: 20_000, max: 65_000 },
  ]},
  leg: { name: 'Leg / Knee Injury', ranges: [
    { severity: 'Minor', min: 1_000, max: 5_000 },
    { severity: 'Moderate', min: 5_000, max: 25_000 },
    { severity: 'Serious', min: 25_000, max: 100_000 },
  ]},
  psychological: { name: 'Psychological Injury', ranges: [
    { severity: 'Minor (temporary)', min: 1_500, max: 6_000 },
    { severity: 'Moderate', min: 6_000, max: 22_000 },
    { severity: 'Severe (major impact)', min: 22_000, max: 60_000 },
  ]},
}

export default function PersonalInjuryCalculator() {
  const [injuryType, setInjuryType] = useState('whiplash')
  const [severity, setSeverity] = useState(0)
  const [lostEarnings, setLostEarnings] = useState('0')
  const [medicalCosts, setMedicalCosts] = useState('0')
  const [travelCosts, setTravelCosts] = useState('0')

  const injury = INJURY_TYPES[injuryType]
  const range = injury.ranges[severity] || injury.ranges[0]
  const le = parseFloat(lostEarnings.replace(/,/g,'')) || 0
  const mc = parseFloat(medicalCosts.replace(/,/g,'')) || 0
  const tc = parseFloat(travelCosts.replace(/,/g,'')) || 0
  const specialDamages = le + mc + tc
  const totalMin = range.min + specialDamages
  const totalMax = range.max + specialDamages

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Injury Type</label><select value={injuryType} onChange={(e) => { setInjuryType(e.target.value); setSeverity(0) }} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Injury Type">{Object.entries(INJURY_TYPES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Severity</label><select value={severity} onChange={(e) => setSeverity(parseInt(e.target.value))} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Severity">{injury.ranges.map((r, i) => <option key={i} value={i}>{r.severity}</option>)}</select></div>
      </div>
      <h3 className="text-sm font-semibold">Special Damages (financial losses)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Lost Earnings</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={lostEarnings} onChange={(e) => setLostEarnings(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Lost Earnings" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Medical Costs</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={medicalCosts} onChange={(e) => setMedicalCosts(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Medical Costs" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Travel / Other Costs</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={travelCosts} onChange={(e) => setTravelCosts(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Travel / Other Costs" /></div></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Compensation Range</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(totalMin)} – {formatCurrency(totalMax)}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">General Damages (pain & suffering)</p><p className="text-lg font-bold">{formatCurrency(range.min)} – {formatCurrency(range.max)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Special Damages (financial)</p><p className="text-lg font-bold">{formatCurrency(specialDamages)}</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Based on Judicial College Guidelines. Actual amounts vary by individual circumstances. Most personal injury claims are settled out of court. No win, no fee solicitors typically take 25% of the award.</p>
        </div>
      </div>
    </div>
  )
}
