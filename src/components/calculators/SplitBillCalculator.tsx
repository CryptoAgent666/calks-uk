import { useState } from 'react'
import { formatCurrency } from '@/utils'

const toAmount = (value: string) => Math.max(0, parseFloat(value) || 0)

// Works in whole pence, so the shares always add up to the total exactly.
// Any pennies that will not divide evenly go to the first people on the list.
function calculate(amounts: string[], tipPercent: string, peopleCount: number) {
  const billPence = amounts.reduce((sum, amount) => sum + Math.round(toAmount(amount) * 100), 0)
  const tipPence = Math.round((billPence * toAmount(tipPercent)) / 100)
  const totalPence = billPence + tipPence
  const basePence = peopleCount > 0 ? Math.floor(totalPence / peopleCount) : 0
  const extraPennies = peopleCount > 0 ? totalPence - basePence * peopleCount : 0
  const sharesPence = Array.from({ length: peopleCount }, (_, i) => basePence + (i < extraPennies ? 1 : 0))

  return { billPence, tipPence, totalPence, basePence, extraPennies, sharesPence }
}

function nextPersonName(people: string[]) {
  let n = people.length + 1
  while (people.includes(`Person ${n}`)) n++
  return `Person ${n}`
}

const displayName = (name: string, i: number) => name.trim() || `Person ${i + 1}`

function joinNames(names: string[]) {
  if (names.length < 2) return names.join('')
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

export default function SplitBillCalculator() {
  const [items, setItems] = useState([
    { name: 'Shared item', amount: '50' },
  ])
  const [people, setPeople] = useState(['Alice', 'Bob', 'Charlie'])
  const [tipPercent, setTipPercent] = useState('0')

  const addItem = () => setItems([...items, { name: '', amount: '' }])
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: 'name' | 'amount', value: string) => setItems(items.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  const addPerson = () => setPeople([...people, nextPersonName(people)])
  const removePerson = (i: number) => setPeople(people.filter((_, idx) => idx !== i))

  const result = calculate(items.map(item => item.amount), tipPercent, people.length)
  const pennyPayers = people.slice(0, result.extraPennies).map(displayName)

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2"><h3 className="text-sm font-semibold">People</h3><button onClick={addPerson} className="px-3 py-1 rounded-lg bg-muted text-sm font-medium hover:bg-accent">+ Add</button></div>
        <div className="flex flex-wrap gap-2">
          {people.map((p, i) => (
            <div key={i} className="flex items-center gap-1">
              <input type="text" value={p} onChange={(e) => setPeople(people.map((pp, idx) => idx === i ? e.target.value : pp))} className="w-24 rounded-lg border border-input bg-background px-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
              {people.length > 2 && <button onClick={() => removePerson(i)} className="px-1 py-1 rounded-lg bg-muted hover:bg-destructive/10 text-xs">x</button>}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2"><h3 className="text-sm font-semibold">Items</h3><button onClick={addItem} className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-sm font-medium">+ Add Item</button></div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="Item" className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <div className="relative w-24"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input type="number" min="0" step="0.01" value={item.amount} onChange={(e) => updateItem(i, 'amount', e.target.value)} className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm text-right font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Item amount in pounds" /></div>
              <button onClick={() => removeItem(i)} className="px-1.5 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-xs">x</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Tip or service charge to add (%)</label>
        <input type="number" min="0" step="0.5" value={tipPercent} onChange={(e) => setTipPercent(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Tip or service charge to add, per cent" />
        <div className="flex flex-wrap gap-2 mt-2">
          {['0', '10', '12.5', '15'].map(v => <button key={v} onClick={() => setTipPercent(v)} className="px-3 py-1 rounded-lg bg-muted text-xs font-medium hover:bg-accent">{v}%</button>)}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Leave at 0% if a service charge is already included in the items above.</p>
      </div>

      <div className="rounded-2xl bg-primary/10 p-6 text-center animate-fade-in-up">
        <p className="text-sm text-muted-foreground">Total to pay</p>
        <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalPence / 100)}</p>
        {result.tipPence > 0 && <p className="text-sm text-muted-foreground mt-1">Bill {formatCurrency(result.billPence / 100)} + tip {formatCurrency(result.tipPence / 100)}</p>}
        <p className="text-sm text-muted-foreground mt-1">Split {people.length} ways: <span className="font-bold">{formatCurrency(result.basePence / 100)}</span> each{result.extraPennies > 0 && `, plus 1p from ${joinNames(pennyPayers)}`}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {people.map((p, i) => (
          <div key={i} className="rounded-xl border border-border p-3 text-center">
            <p className="text-sm font-medium">{displayName(p, i)}</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(result.sharesPence[i] / 100)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
