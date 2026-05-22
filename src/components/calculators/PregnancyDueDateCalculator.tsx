import { useState, useMemo } from 'react'

function calculate(lmp: string) {
  if (!lmp) return null
  const lmpDate = new Date(lmp)
  if (isNaN(lmpDate.getTime())) return null

  const dueDate = new Date(lmpDate)
  dueDate.setDate(dueDate.getDate() + 280) // 40 weeks

  const now = new Date()
  const diffMs = now.getTime() - lmpDate.getTime()
  const daysPregnant = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(daysPregnant / 7)
  const days = daysPregnant % 7
  const trimester = weeks < 13 ? 1 : weeks < 27 ? 2 : 3
  const daysRemaining = Math.max(0, Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

  // Key milestones
  const milestone12 = new Date(lmpDate); milestone12.setDate(milestone12.getDate() + 84)
  const milestone20 = new Date(lmpDate); milestone20.setDate(milestone20.getDate() + 140)
  const milestone28 = new Date(lmpDate); milestone28.setDate(milestone28.getDate() + 196)
  const milestone37 = new Date(lmpDate); milestone37.setDate(milestone37.getDate() + 259)

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return { dueDate: fmt(dueDate), weeks, days, trimester, daysRemaining, daysPregnant, milestones: [
    { week: 12, date: fmt(milestone12), label: '12-week scan' },
    { week: 20, date: fmt(milestone20), label: '20-week scan' },
    { week: 28, date: fmt(milestone28), label: 'Third trimester' },
    { week: 37, date: fmt(milestone37), label: 'Full term' },
  ] }
}

export default function PregnancyDueDateCalculator() {
  const [lmp, setLmp] = useState('')
  const result = useMemo(() => calculate(lmp), [lmp])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">First Day of Last Menstrual Period (LMP)</label>
        <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="First Day of Last Menstrual Period (LMP)" />
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Due Date</p>
            <p className="text-2xl font-bold text-primary mt-1">{result.dueDate}</p>
            <p className="text-sm text-muted-foreground mt-2">{result.weeks} weeks and {result.days} days pregnant &middot; Trimester {result.trimester}</p>
            <p className="text-sm text-muted-foreground">{result.daysRemaining} days remaining</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Key Milestones</h3>
            <div className="space-y-2">
              {result.milestones.map((m) => (
                <div key={m.week} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div><span className="text-sm font-medium">{m.label}</span><span className="text-xs text-muted-foreground ml-2">Week {m.week}</span></div>
                  <span className="text-sm text-muted-foreground">{m.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
