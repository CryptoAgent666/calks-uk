import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(length: number, width: number, boardWidth: number, boardLength: number, wastePct: number, pricePerBoard: number) {
  const area = length * width
  const boardArea = (boardWidth / 1000) * boardLength // board width in mm, length in m
  const boardsRaw = boardArea > 0 ? area / boardArea : 0
  const boardsNeeded = Math.ceil(boardsRaw * (1 + wastePct / 100))
  const screwsNeeded = Math.ceil(boardsNeeded * 8) // ~8 screws per board
  const joists = Math.ceil(length / 0.4) + 1 // 400mm centres
  const cost = boardsNeeded * pricePerBoard

  return { area, boardsNeeded, screwsNeeded, joists, cost }
}

export default function DeckingCalculator() {
  const [length, setLength] = useState('4')
  const [width, setWidth] = useState('3')
  const [bw, setBw] = useState('145')
  const [bl, setBl] = useState('3.6')
  const [waste, setWaste] = useState('10')
  const [price, setPrice] = useState('8')

  const l = parseFloat(length) || 0
  const w = parseFloat(width) || 0
  const result = useMemo(() => calculate(l, w, parseFloat(bw)||145, parseFloat(bl)||3.6, parseFloat(waste)||10, parseFloat(price)||0), [l, w, bw, bl, waste, price])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Deck Length (m)</label><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Deck Width (m)</label><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Board Width (mm)</label><input type="number" min="50" max="300" value={bw} onChange={(e) => setBw(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Board Length (m)</label><input type="number" min="0.5" max="6" step="0.1" value={bl} onChange={(e) => setBl(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Wastage (%)</label><input type="number" min="0" max="30" value={waste} onChange={(e) => setWaste(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Price per Board (£)</label><input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {l > 0 && w > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Boards</p><p className="text-xl font-bold text-primary">{result.boardsNeeded}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Joists</p><p className="text-lg font-bold">{result.joists}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Screws</p><p className="text-lg font-bold">{result.screwsNeeded}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Area</p><p className="text-lg font-bold">{result.area.toFixed(1)} m²</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Board Cost</p><p className="text-lg font-bold">{formatCurrency(result.cost)}</p></div>
        </div>
      )}
    </div>
  )
}
