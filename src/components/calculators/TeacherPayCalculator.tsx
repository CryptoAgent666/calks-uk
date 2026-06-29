import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Teacher pay scales 2025/26 (England, outside London) — STPCD 2025, 4% award from 1 September 2025
const MAIN_SCALE = [32_916, 34_823, 37_101, 39_556, 42_057, 45_352]
const UPPER_SCALE = [47_472, 49_232, 51_048]
const LEADERSHIP: Record<string, { min: number; max: number }> = {
  'Head (Group 1)': { min: 58_569, max: 77_924 },
  'Head (Group 4)': { min: 71_330, max: 97_136 },
  'Head (Group 8)': { min: 100_540, max: 143_796 },
}

type Scale = 'main' | 'upper' | 'leadership'

function calculate(scale: Scale, point: number, leadershipGroup: string, isLondon: string) {
  let salary: number
  if (scale === 'main') salary = MAIN_SCALE[Math.min(point, MAIN_SCALE.length - 1)] || MAIN_SCALE[0]
  else if (scale === 'upper') salary = UPPER_SCALE[Math.min(point, UPPER_SCALE.length - 1)] || UPPER_SCALE[0]
  else {
    const group = LEADERSHIP[leadershipGroup] || LEADERSHIP['Head (Group 1)']
    salary = group.min + (group.max - group.min) * (point / 100)
  }

  // London weighting
  const londonAdj: Record<string, number> = { none: 0, inner: 5_000, outer: 2_000, fringe: 1_000 }
  salary += londonAdj[isLondon] || 0

  // Teachers' Pension Scheme — tiered member contribution rate by salary band
  const tpsRate =
    salary < 34_290 ? 0.074 :
    salary < 46_159 ? 0.086 :
    salary < 54_730 ? 0.096 :
    salary < 72_535 ? 0.102 :
    salary < 98_909 ? 0.113 : 0.117
  const pension = salary * tpsRate

  // TPS uses a net-pay arrangement: pension is deducted before income tax (automatic relief),
  // so income tax is charged on salary minus pension. NI is still charged on full salary.
  const taxablePay = Math.max(0, salary - pension)
  let tax = 0
  if (taxablePay > 12_570) {
    if (taxablePay <= 50_270) tax = (taxablePay - 12_570) * 0.20
    else tax = (50_270 - 12_570) * 0.20 + (taxablePay - 50_270) * 0.40
  }
  let ni = 0
  if (salary > 12_570) {
    if (salary <= 50_270) ni = (salary - 12_570) * 0.08
    else ni = (50_270 - 12_570) * 0.08 + (salary - 50_270) * 0.02
  }
  const takeHome = salary - tax - ni - pension

  return { salary, tax, ni, pension, pensionRate: tpsRate, takeHome, monthly: takeHome / 12 }
}

export default function TeacherPayCalculator() {
  const [scale, setScale] = useState<Scale>('main')
  const [point, setPoint] = useState(2)
  const [leadership, setLeadership] = useState('Head (Group 1)')
  const [london, setLondon] = useState('none')

  const result = useMemo(() => calculate(scale, point, leadership, london), [scale, point, leadership, london])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Pay Scale</label><select value={scale} onChange={(e) => { setScale(e.target.value as Scale); setPoint(0) }} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Pay Scale"><option value="main">Main Pay Scale (M1-M6)</option><option value="upper">Upper Pay Scale (UPS1-3)</option><option value="leadership">Leadership</option></select></div>
        {scale !== 'leadership' ? (
          <div><label className="block text-sm font-medium mb-2">Pay Point</label><select value={point} onChange={(e) => setPoint(parseInt(e.target.value))} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Pay Point">{(scale === 'main' ? MAIN_SCALE : UPPER_SCALE).map((_, i) => <option key={i} value={i}>{scale === 'main' ? `M${i+1}` : `UPS${i+1}`}</option>)}</select></div>
        ) : (
          <><div><label className="block text-sm font-medium mb-2">Leadership Group</label><select value={leadership} onChange={(e) => setLeadership(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Leadership Group">{Object.keys(LEADERSHIP).map(k => <option key={k} value={k}>{k}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-2">Point in Range (%)</label><input type="range" min="0" max="100" value={point} onChange={(e) => setPoint(parseInt(e.target.value))} className="w-full mt-3"  aria-label="Point in Range (%)" /></div></>
        )}
        <div><label className="block text-sm font-medium mb-2">London</label><select value={london} onChange={(e) => setLondon(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="London"><option value="none">Rest of England</option><option value="inner">Inner London (+£5K)</option><option value="outer">Outer London (+£2K)</option><option value="fringe">London Fringe (+£1K)</option></select></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Annual Salary</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.salary)}</p>
          <p className="text-sm text-muted-foreground mt-1">Take home: {formatCurrency(result.monthly)}/month</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2">Gross Salary</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.salary)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income Tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.tax)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2 text-destructive">National Insurance</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.ni)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Teachers' Pension ({(result.pensionRate * 100).toFixed(1)}%)</td><td className="text-right tabular-nums">-{formatCurrency(result.pension)}</td></tr>
            <tr className="font-semibold"><td className="py-2 text-primary">Take-Home</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.takeHome)}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
