import { useState } from 'react'

export default function PercentageCalculator() {
  const [pctOf_pct, setPctOf_pct] = useState('')
  const [pctOf_num, setPctOf_num] = useState('')
  const [isWhat_part, setIsWhat_part] = useState('')
  const [isWhat_whole, setIsWhat_whole] = useState('')
  const [change_from, setChange_from] = useState('')
  const [change_to, setChange_to] = useState('')

  const pctOfResult = (parseFloat(pctOf_pct) / 100) * parseFloat(pctOf_num)
  const isWhatResult = (parseFloat(isWhat_part) / parseFloat(isWhat_whole)) * 100
  const changeResult = ((parseFloat(change_to) - parseFloat(change_from)) / parseFloat(change_from)) * 100

  const fmt = (n: number) => isNaN(n) || !isFinite(n) ? '' : n.toLocaleString('en-GB', { maximumFractionDigits: 4 })

  return (
    <div className="space-y-8">
      {/* What is X% of Y? */}
      <div className="rounded-xl border border-border p-5 space-y-3">
        <h3 className="font-semibold">What is X% of Y?</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">What is</span>
          <input type="number" value={pctOf_pct} onChange={(e) => setPctOf_pct(e.target.value)} placeholder="15" className="w-24 rounded-lg border border-input bg-background px-3 py-2 text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          <span className="text-sm text-muted-foreground">% of</span>
          <input type="number" value={pctOf_num} onChange={(e) => setPctOf_num(e.target.value)} placeholder="200" className="w-28 rounded-lg border border-input bg-background px-3 py-2 text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          <span className="text-sm text-muted-foreground">=</span>
          <span className="text-lg font-bold text-primary min-w-[60px]">{fmt(pctOfResult)}</span>
        </div>
      </div>

      {/* X is what % of Y? */}
      <div className="rounded-xl border border-border p-5 space-y-3">
        <h3 className="font-semibold">X is what % of Y?</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <input type="number" value={isWhat_part} onChange={(e) => setIsWhat_part(e.target.value)} placeholder="30" className="w-24 rounded-lg border border-input bg-background px-3 py-2 text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          <span className="text-sm text-muted-foreground">is what % of</span>
          <input type="number" value={isWhat_whole} onChange={(e) => setIsWhat_whole(e.target.value)} placeholder="200" className="w-28 rounded-lg border border-input bg-background px-3 py-2 text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          <span className="text-sm text-muted-foreground">=</span>
          <span className="text-lg font-bold text-primary min-w-[60px]">{fmt(isWhatResult)}%</span>
        </div>
      </div>

      {/* Percentage change */}
      <div className="rounded-xl border border-border p-5 space-y-3">
        <h3 className="font-semibold">Percentage Change</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">From</span>
          <input type="number" value={change_from} onChange={(e) => setChange_from(e.target.value)} placeholder="100" className="w-28 rounded-lg border border-input bg-background px-3 py-2 text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          <span className="text-sm text-muted-foreground">to</span>
          <input type="number" value={change_to} onChange={(e) => setChange_to(e.target.value)} placeholder="125" className="w-28 rounded-lg border border-input bg-background px-3 py-2 text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          <span className="text-sm text-muted-foreground">=</span>
          <span className={`text-lg font-bold min-w-[60px] ${parseFloat(fmt(changeResult)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {fmt(changeResult) ? `${parseFloat(fmt(changeResult)) >= 0 ? '+' : ''}${fmt(changeResult)}%` : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
