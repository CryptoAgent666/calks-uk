import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const COSTS = {
  provisionalLicence: 34,
  theoryTest: 23,
  practicalTest: 62,
  practicalTestWeekend: 75,
  lessonCostPerHour: 35,
  avgLessonsNeeded: 45, // DVSA average
  hazardPerceptionTest: 0, // included in theory
}

function calculate(lessons: number, lessonRate: number, isWeekend: boolean, hasProvisional: boolean, passedTheory: boolean) {
  const provisional = hasProvisional ? 0 : COSTS.provisionalLicence
  const theory = passedTheory ? 0 : COSTS.theoryTest
  const practical = isWeekend ? COSTS.practicalTestWeekend : COSTS.practicalTest
  const lessonCost = lessons * lessonRate
  const total = provisional + theory + practical + lessonCost

  return { provisional, theory, practical, lessonCost, total, lessons, lessonRate }
}

export default function DrivingTestCostCalculator() {
  const [lessons, setLessons] = useState('40')
  const [rate, setRate] = useState('35')
  const [weekend, setWeekend] = useState(false)
  const [hasProv, setHasProv] = useState(true)
  const [passedTheory, setPassedTheory] = useState(false)

  const l = parseInt(lessons) || 0
  const r = parseFloat(rate) || 0
  const result = useMemo(() => calculate(l, r, weekend, hasProv, passedTheory), [l, r, weekend, hasProv, passedTheory])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Number of Lessons</label><input type="number" min="0" max="100" value={lessons} onChange={(e) => setLessons(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number of Lessons" /><p className="text-xs text-muted-foreground mt-1">DVSA average: {COSTS.avgLessonsNeeded} hours</p></div>
        <div><label className="block text-sm font-medium mb-2">Lesson Rate (£/hour)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" step="1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Lesson Rate (£/hour)" /></div></div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={hasProv} onChange={(e) => setHasProv(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Already have provisional licence</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={passedTheory} onChange={(e) => setPassedTheory(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Already passed theory test</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={weekend} onChange={(e) => setWeekend(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Weekend/evening practical test (+£13)</span></label>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Total Estimated Cost</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.total)}</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {result.provisional > 0 && <tr className="border-b border-border/50"><td className="py-2">Provisional Licence</td><td className="text-right tabular-nums">{formatCurrency(result.provisional)}</td></tr>}
            {result.theory > 0 && <tr className="border-b border-border/50"><td className="py-2">Theory Test</td><td className="text-right tabular-nums">{formatCurrency(result.theory)}</td></tr>}
            <tr className="border-b border-border/50"><td className="py-2">Practical Test{weekend ? ' (weekend)' : ''}</td><td className="text-right tabular-nums">{formatCurrency(result.practical)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Driving Lessons ({l} x £{r})</td><td className="text-right tabular-nums">{formatCurrency(result.lessonCost)}</td></tr>
            <tr className="font-semibold"><td className="py-2">Total</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.total)}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
