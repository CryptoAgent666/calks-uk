import { useState } from 'react'
import { formatCurrency } from '@/utils'

export default function SplitBillCalculator() {
  const [items, setItems] = useState([
    { name: 'Shared item', amount: 50, splitAll: true, paidBy: '' },
  ])
  const [people, setPeople] = useState(['Alice', 'Bob', 'Charlie'])

  const addItem = () => setItems([...items, { name: '', amount: 0, splitAll: true, paidBy: '' }])
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: string, value: any) => setItems(items.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  const addPerson = () => setPeople([...people, `Person ${people.length + 1}`])
  const removePerson = (i: number) => setPeople(people.filter((_, idx) => idx !== i))

  const totalBill = items.reduce((s, i) => s + (i.amount || 0), 0)
  const perPerson = people.length > 0 ? totalBill / people.length : 0

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
              <div className="relative w-24"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input type="number" min="0" step="0.01" value={item.amount || ''} onChange={(e) => updateItem(i, 'amount', parseFloat(e.target.value) || 0)} className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm text-right font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              <button onClick={() => removeItem(i)} className="px-1.5 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-xs">x</button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-primary/10 p-6 text-center animate-fade-in-up">
        <p className="text-sm text-muted-foreground">Total Bill</p>
        <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(totalBill)}</p>
        <p className="text-sm text-muted-foreground mt-1">Split {people.length} ways: <span className="font-bold">{formatCurrency(perPerson)}</span> each</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {people.map(p => (
          <div key={p} className="rounded-xl border border-border p-3 text-center">
            <p className="text-sm font-medium">{p}</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(perPerson)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
