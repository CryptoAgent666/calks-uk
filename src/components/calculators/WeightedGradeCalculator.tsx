import { useState, useMemo } from 'react'

export default function WeightedGradeCalculator() {
  const [items, setItems] = useState([
    { name: 'Coursework', weight: 40, score: 68 },
    { name: 'Exam 1', weight: 30, score: 72 },
    { name: 'Exam 2', weight: 30, score: 55 },
  ])

  const addItem = () => setItems([...items, { name: `Component ${items.length + 1}`, weight: 0, score: 0 }])
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i))
  const update = (i: number, field: string, value: string | number) => setItems(items.map((item, idx) => idx === i ? { ...item, [field]: value } : item))

  const result = useMemo(() => {
    const totalWeight = items.reduce((s, i) => s + i.weight, 0)
    const weightedSum = items.reduce((s, i) => s + (i.score * i.weight), 0)
    const average = totalWeight > 0 ? weightedSum / totalWeight : 0

    let classification = ''
    if (average >= 70) classification = 'First Class (1st)'
    else if (average >= 60) classification = 'Upper Second (2:1)'
    else if (average >= 50) classification = 'Lower Second (2:2)'
    else if (average >= 40) classification = 'Third Class (3rd)'
    else classification = 'Fail'

    return { average, totalWeight, classification, isValid: Math.abs(totalWeight - 100) < 0.01 }
  }, [items])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Assessment Components</h3>
        <button onClick={addItem} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">+ Add</button>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="text" value={item.name} onChange={(e) => update(i, 'name', e.target.value)} className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
            <div className="flex items-center gap-1"><input type="number" min="0" max="100" value={item.weight} onChange={(e) => update(i, 'weight', parseFloat(e.target.value) || 0)} className="w-16 rounded-lg border border-input bg-background px-2 py-2 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" /><span className="text-xs text-muted-foreground">%</span></div>
            <div className="flex items-center gap-1"><input type="number" min="0" max="100" value={item.score} onChange={(e) => update(i, 'score', parseFloat(e.target.value) || 0)} className="w-16 rounded-lg border border-input bg-background px-2 py-2 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" /><span className="text-xs text-muted-foreground">mark</span></div>
            <button onClick={() => removeItem(i)} className="px-2 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-sm">x</button>
          </div>
        ))}
      </div>

      {!result.isValid && result.totalWeight > 0 && (
        <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-sm text-orange-800 dark:text-orange-300 text-center">Weights total {result.totalWeight}% — should be 100%</div>
      )}

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Weighted Average</p>
          <p className="text-4xl font-bold text-primary mt-1">{result.average.toFixed(1)}%</p>
          <p className="text-lg font-semibold mt-1">{result.classification}</p>
        </div>

        {items.length > 0 && (
          <div className="space-y-1">
            {items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.name} ({item.weight}%)</span>
                <span className="font-medium">{item.score}% → contributes {((item.score * item.weight) / 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
