import { useState, useMemo } from 'react'

function calculate(scored: number, total: number) {
  if (total <= 0) return null
  const pct = (scored / total) * 100

  let grade: string
  if (pct >= 90) grade = 'A* / First / Distinction'
  else if (pct >= 80) grade = 'A / First'
  else if (pct >= 70) grade = 'B / 2:1'
  else if (pct >= 60) grade = 'C / 2:2'
  else if (pct >= 50) grade = 'D / Third'
  else if (pct >= 40) grade = 'E / Pass'
  else grade = 'F / Fail'

  // What do you need on remaining?
  return { pct, grade }
}

function calculateNeeded(currentMarks: number, currentTotal: number, targetPct: number, remainingTotal: number) {
  const needed = (targetPct / 100) * (currentTotal + remainingTotal) - currentMarks
  const neededPct = remainingTotal > 0 ? (needed / remainingTotal) * 100 : 0
  return { needed: Math.max(0, needed), neededPct: Math.max(0, neededPct), achievable: neededPct <= 100 }
}

export default function ExamScoreCalculator() {
  const [scored, setScored] = useState('72')
  const [total, setTotal] = useState('100')
  const [currentMarks, setCurrentMarks] = useState('150')
  const [currentTotal, setCurrentTotal] = useState('200')
  const [targetPct, setTargetPct] = useState('70')
  const [remaining, setRemaining] = useState('100')

  const s = parseFloat(scored) || 0
  const t = parseFloat(total) || 0
  const result = useMemo(() => calculate(s, t), [s, t])

  const cm = parseFloat(currentMarks) || 0
  const ct = parseFloat(currentTotal) || 0
  const tp = parseFloat(targetPct) || 0
  const rem = parseFloat(remaining) || 0
  const needed = useMemo(() => calculateNeeded(cm, ct, tp, rem), [cm, ct, tp, rem])

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Calculate Grade</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">Marks Scored</label><input type="number" min="0" value={scored} onChange={(e) => setScored(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div><label className="block text-sm font-medium mb-2">Total Marks</label><input type="number" min="1" value={total} onChange={(e) => setTotal(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
        {result && (
          <div className="grid grid-cols-2 gap-3 animate-fade-in-up">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Score</p><p className="text-3xl font-bold text-primary">{result.pct.toFixed(1)}%</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Approximate Grade</p><p className="text-xl font-bold">{result.grade}</p></div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">What Do I Need to Get?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div><label className="block text-sm font-medium mb-2">Marks So Far</label><input type="number" min="0" value={currentMarks} onChange={(e) => setCurrentMarks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div><label className="block text-sm font-medium mb-2">Out Of</label><input type="number" min="1" value={currentTotal} onChange={(e) => setCurrentTotal(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div><label className="block text-sm font-medium mb-2">Target Overall (%)</label><input type="number" min="0" max="100" value={targetPct} onChange={(e) => setTargetPct(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div><label className="block text-sm font-medium mb-2">Remaining Marks</label><input type="number" min="0" value={remaining} onChange={(e) => setRemaining(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
        <div className={`rounded-xl p-4 text-center ${needed.achievable ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
          {needed.achievable ? (
            <><p className="text-sm text-muted-foreground">You need to score at least</p><p className="text-2xl font-bold text-green-700 dark:text-green-400">{needed.neededPct.toFixed(1)}%</p><p className="text-sm text-muted-foreground">({needed.needed.toFixed(0)} out of {rem} marks)</p></>
          ) : (
            <p className="text-lg font-bold text-destructive">Target not achievable with remaining marks</p>
          )}
        </div>
      </div>
    </div>
  )
}
