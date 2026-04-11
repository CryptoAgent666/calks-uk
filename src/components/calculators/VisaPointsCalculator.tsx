import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// UK Skilled Worker Visa points system
const MANDATORY_POINTS = [
  { id: 'job', label: 'Job offer from approved sponsor', points: 20, required: true },
  { id: 'skill', label: 'Job at appropriate skill level (RQF 3+)', points: 20, required: true },
  { id: 'english', label: 'English language at required level (B1+)', points: 10, required: true },
]

const TRADEABLE_POINTS = [
  { id: 'salary_min', label: 'Salary: £23,200 – £25,479', points: 0 },
  { id: 'salary_low', label: 'Salary: £25,480 – £29,999', points: 10 },
  { id: 'salary_med', label: 'Salary: £30,000 – £38,699', points: 20 },
  { id: 'salary_high', label: 'Salary: £38,700+', points: 20 },
  { id: 'phd', label: 'PhD in subject relevant to job', points: 10 },
  { id: 'phd_stem', label: 'PhD in STEM subject relevant to job', points: 20 },
  { id: 'shortage', label: 'Job on Immigration Salary List', points: 20 },
  { id: 'new_entrant', label: 'New entrant (under 26, student switching, etc.)', points: 0 },
]

const REQUIRED_TOTAL = 70

export default function VisaPointsCalculator() {
  const [selected, setSelected] = useState<Set<string>>(new Set(['job', 'skill', 'english']))

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const totalPoints = useMemo(() => {
    let total = 0
    for (const item of [...MANDATORY_POINTS, ...TRADEABLE_POINTS]) {
      if (selected.has(item.id)) total += item.points
    }
    return total
  }, [selected])

  const eligible = totalPoints >= REQUIRED_TOTAL

  return (
    <div className="space-y-6">
      {/* Mandatory */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Mandatory Requirements (all 3 needed)</h3>
        <div className="space-y-2">
          {MANDATORY_POINTS.map((item) => (
            <label key={item.id} className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-colors ${selected.has(item.id) ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent'}`}>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggle(item.id)} className="h-5 w-5 rounded border-border" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <span className="text-sm font-bold text-primary">{item.points} pts</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tradeable */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Tradeable Points (select applicable)</h3>
        <div className="space-y-2">
          {TRADEABLE_POINTS.map((item) => (
            <label key={item.id} className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-colors ${selected.has(item.id) ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent'}`}>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggle(item.id)} className="h-5 w-5 rounded border-border" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <span className={`text-sm font-bold ${item.points > 0 ? 'text-primary' : 'text-muted-foreground'}`}>{item.points} pts</span>
            </label>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className={`rounded-2xl p-6 text-center ${eligible ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
        <p className="text-sm text-muted-foreground">Your Points</p>
        <p className={`text-4xl font-bold mt-1 ${eligible ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{totalPoints}</p>
        <p className="text-sm mt-1">{eligible ? 'You meet the 70-point threshold!' : `You need ${REQUIRED_TOTAL - totalPoints} more points (minimum ${REQUIRED_TOTAL})`}</p>
      </div>
    </div>
  )
}
