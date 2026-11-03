import { useState } from 'react'

// Software and sign-up are required: without them the result cannot say ready, whatever the score.
// Agent and VAT apply only to some people, so they can be marked not applicable and leave the score.
const CHECKLIST = [
  { id: 'software', label: 'Using HMRC-compatible software, or a spreadsheet with bridging software', fix: 'Choose compatible software, or bridging software for your spreadsheet', category: 'Records', required: true },
  { id: 'digital_records', label: 'All self-employment and property income and expenses recorded digitally', fix: 'Record your self-employment and property income and expenses digitally', category: 'Records' },
  { id: 'categories', label: 'Each record has its amount, date and category', fix: 'Give each record its amount, date and category', category: 'Records' },
  { id: 'quarterly', label: 'Understand the quarterly deadlines and which update periods to use', fix: 'Check the quarterly deadlines, and choose calendar update periods before your first update if your accounts run to 31 March', category: 'Submissions' },
  { id: 'agent', label: 'Authorised an agent', fix: 'Authorise your agent', category: 'Submissions', optional: true },
  { id: 'hmrc_account', label: 'HMRC online services account set up', fix: 'Set up your HMRC online services account', category: 'HMRC' },
  { id: 'mtd_enrolled', label: 'Signed up for MTD for Income Tax', fix: 'Sign up for MTD for Income Tax', category: 'HMRC', required: true },
  { id: 'vat_mtd', label: 'Already doing MTD for VAT', fix: 'Start filing VAT through MTD', category: 'HMRC', optional: true },
]

function assess(checked: Set<string>, notApplicable: Set<string>) {
  const items = CHECKLIST.filter((item) => !(item.optional && notApplicable.has(item.id)))
  const score = items.filter((item) => checked.has(item.id)).length
  const total = items.length
  const pct = (score / total) * 100
  const todo = items.filter((item) => !checked.has(item.id))
  const missingRequired = todo.filter((item) => item.required)
  const ready = pct >= 80 && missingRequired.length === 0
  return { score, total, pct, ready, missingRequired, fixList: [...missingRequired, ...todo.filter((item) => !item.required)] }
}

export default function MTDReadinessCalculator() {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [notApplicable, setNotApplicable] = useState<Set<string>>(new Set())

  const toggleIn = (setter: typeof setChecked, id: string) => setter(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })

  const { score, total, pct, ready, missingRequired, fixList } = assess(checked, notApplicable)
  const amber = !ready && pct >= 50

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {CHECKLIST.map(item => {
          const na = notApplicable.has(item.id)
          const ticked = checked.has(item.id) && !na
          return (
            <div key={item.id} className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border p-3 transition-colors ${ticked ? 'border-green-300 dark:border-green-800 bg-green-100/50 dark:bg-green-950/50' : 'border-border hover:bg-accent'} ${na ? 'opacity-60' : ''}`}>
              <label className="flex flex-1 items-center gap-3 cursor-pointer min-w-[14rem]">
                <input type="checkbox" checked={ticked} disabled={na} onChange={() => toggleIn(setChecked, item.id)} className="h-5 w-5 rounded border-border" />
                <div><span className="text-sm font-medium">{item.label}</span><span className="text-xs text-muted-foreground ml-2">{item.required ? 'Required' : item.category}</span></div>
              </label>
              {item.optional && <label className="flex items-center gap-2 text-xs cursor-pointer"><input type="checkbox" checked={na} onChange={() => toggleIn(setNotApplicable, item.id)} className="h-4 w-4 rounded border-border" />Not applicable</label>}
            </div>
          )
        })}
      </div>

      <div className={`rounded-2xl p-6 text-center ${ready ? 'bg-green-100 dark:bg-green-950' : amber ? 'bg-yellow-100 dark:bg-yellow-950' : 'bg-destructive/10'}`}>
        <p className="text-sm text-muted-foreground">MTD Readiness Score</p>
        <p className={`text-4xl font-bold mt-1 ${ready ? 'text-green-700 dark:text-green-400' : amber ? 'text-yellow-700 dark:text-yellow-400' : 'text-destructive'}`}>{score}/{total}</p>
        <div className="w-full bg-muted/50 rounded-full h-3 mt-3 overflow-hidden"><div className={`h-3 rounded-full ${ready ? 'bg-green-500' : amber ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width:`${pct}%`}} /></div>
        <p className="text-sm text-muted-foreground mt-2">{ready ? 'Looking good — you\'re well prepared!' : missingRequired.length > 0 ? `Not ready yet — ${missingRequired.length === 2 ? 'software and sign-up are' : missingRequired[0].id === 'software' ? 'software is' : 'sign-up is'} required, whatever the score` : amber ? 'Getting there — complete the remaining items' : 'Needs work — start with the basics'}</p>
      </div>

      {fixList.length > 0 && (
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
          <p className="font-medium text-foreground">What to fix:</p>
          {fixList.map(item => <p key={item.id}>• {item.required ? <span className="font-medium text-foreground">Required: </span> : null}{item.fix}</p>)}
        </div>
      )}

      <p className="text-sm text-muted-foreground">A bank feed and scanned receipts can help but are not required, so they do not score. Keep your original records or copies of them, such as bank statements and invoices, as you do for Self Assessment.</p>
    </div>
  )
}
