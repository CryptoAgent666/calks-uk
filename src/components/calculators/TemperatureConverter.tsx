import { useState } from 'react'

function convert(value: number, from: string) {
  let c: number, f: number, k: number
  switch (from) {
    case 'c': c = value; f = value * 9/5 + 32; k = value + 273.15; break
    case 'f': c = (value - 32) * 5/9; f = value; k = (value - 32) * 5/9 + 273.15; break
    case 'k': c = value - 273.15; f = (value - 273.15) * 9/5 + 32; k = value; break
    default: c = 0; f = 32; k = 273.15
  }
  return { c, f, k }
}

export default function TemperatureConverter() {
  const [value, setValue] = useState('20')
  const [from, setFrom] = useState('c')
  const v = parseFloat(value) || 0
  const result = convert(v, from)
  const fmt = (n: number) => n.toFixed(2)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Temperature</label><input type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Temperature" /></div>
        <div><label className="block text-sm font-medium mb-2">From</label><select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="From"><option value="c">Celsius (°C)</option><option value="f">Fahrenheit (°F)</option><option value="k">Kelvin (K)</option></select></div>
      </div>
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
        <div className={`rounded-xl p-4 text-center ${from === 'c' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Celsius</p><p className="text-2xl font-bold">{fmt(result.c)}°C</p></div>
        <div className={`rounded-xl p-4 text-center ${from === 'f' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Fahrenheit</p><p className="text-2xl font-bold">{fmt(result.f)}°F</p></div>
        <div className={`rounded-xl p-4 text-center ${from === 'k' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Kelvin</p><p className="text-2xl font-bold">{fmt(result.k)} K</p></div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {[{l:'Freezing',v:'0',u:'c'},{l:'Body Temp',v:'37',u:'c'},{l:'Boiling',v:'100',u:'c'},{l:'Room Temp',v:'68',u:'f'}].map(p => (
          <button key={p.l} onClick={() => {setValue(p.v); setFrom(p.u)}} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">{p.l}</button>
        ))}
      </div>
    </div>
  )
}
