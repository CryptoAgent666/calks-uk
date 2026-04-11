import { useState } from 'react'

const CHECKLIST = [
  { id: 'software', label: 'Using HMRC-compatible record-keeping software', category: 'Records' },
  { id: 'digital_records', label: 'All income and expenses recorded digitally', category: 'Records' },
  { id: 'bank_feed', label: 'Bank feed connected to software', category: 'Records' },
  { id: 'categories', label: 'Transactions categorised correctly', category: 'Records' },
  { id: 'receipts', label: 'Receipts stored digitally (photos/scans)', category: 'Records' },
  { id: 'quarterly', label: 'Understand quarterly submission deadlines', category: 'Submissions' },
  { id: 'agent', label: 'Authorised an agent (if using accountant)', category: 'Submissions' },
  { id: 'hmrc_account', label: 'Government Gateway account set up', category: 'HMRC' },
  { id: 'mtd_enrolled', label: 'Signed up for MTD for Income Tax', category: 'HMRC' },
  { id: 'vat_mtd', label: 'Already doing MTD for VAT (if applicable)', category: 'HMRC' },
]

export default function MTDReadinessCalculator() {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (id: string) => setChecked(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })

  const score = checked.size
  const total = CHECKLIST.length
  const pct = (score / total) * 100
  const ready = pct >= 80

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {CHECKLIST.map(item => (
          <label key={item.id} className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${checked.has(item.id) ? 'border-green-300 dark:border-green-800 bg-green-100/50 dark:bg-green-950/50' : 'border-border hover:bg-accent'}`}>
            <input type="checkbox" checked={checked.has(item.id)} onChange={() => toggle(item.id)} className="h-5 w-5 rounded border-border" />
            <div><span className="text-sm font-medium">{item.label}</span><span className="text-xs text-muted-foreground ml-2">{item.category}</span></div>
          </label>
        ))}
      </div>

      <div className={`rounded-2xl p-6 text-center ${ready ? 'bg-green-100 dark:bg-green-950' : pct >= 50 ? 'bg-yellow-100 dark:bg-yellow-950' : 'bg-destructive/10'}`}>
        <p className="text-sm text-muted-foreground">MTD Readiness Score</p>
        <p className={`text-4xl font-bold mt-1 ${ready ? 'text-green-700 dark:text-green-400' : pct >= 50 ? 'text-yellow-700 dark:text-yellow-400' : 'text-destructive'}`}>{score}/{total}</p>
        <div className="w-full bg-muted/50 rounded-full h-3 mt-3 overflow-hidden"><div className={`h-3 rounded-full ${ready ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width:`${pct}%`}} /></div>
        <p className="text-sm text-muted-foreground mt-2">{ready ? 'Looking good — you\'re well prepared!' : pct >= 50 ? 'Getting there — complete the remaining items' : 'Needs work — start with the basics'}</p>
      </div>
    </div>
  )
}
