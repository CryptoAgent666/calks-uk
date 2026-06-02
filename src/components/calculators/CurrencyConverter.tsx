import { useState, useEffect } from 'react'

// Fallback rates (per £1 GBP) — used until the live feed loads, or if it's unreachable.
const FALLBACK_RATES: Record<string, number> = {
  GBP: 1, EUR: 1.17, USD: 1.27, AUD: 1.93, CAD: 1.73, CHF: 1.12,
  JPY: 192.5, CNY: 9.21, INR: 107.5, PLN: 5.08, SEK: 13.2, NOK: 13.8,
  DKK: 8.73, NZD: 2.11, SGD: 1.71, HKD: 9.91, ZAR: 23.1, AED: 4.67,
  TRY: 41.2, BRL: 7.15, MXN: 21.8, KRW: 1685, THB: 44.2,
}
const CURRENCIES = Object.keys(FALLBACK_RATES)

const NAMES: Record<string, string> = {
  GBP: 'British Pound', EUR: 'Euro', USD: 'US Dollar', AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar', CHF: 'Swiss Franc', JPY: 'Japanese Yen', CNY: 'Chinese Yuan',
  INR: 'Indian Rupee', PLN: 'Polish Zloty', SEK: 'Swedish Krona', NOK: 'Norwegian Krone',
  DKK: 'Danish Krone', NZD: 'New Zealand Dollar', SGD: 'Singapore Dollar', HKD: 'Hong Kong Dollar',
  ZAR: 'South African Rand', AED: 'UAE Dirham', TRY: 'Turkish Lira', BRL: 'Brazilian Real',
  MXN: 'Mexican Peso', KRW: 'South Korean Won', THB: 'Thai Baht',
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('GBP')
  const [to, setTo] = useState('EUR')
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES)
  const [status, setStatus] = useState<'loading' | 'live' | 'cached'>('loading')
  const [updated, setUpdated] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    // Free, key-less, CORS-enabled daily FX feed (base GBP). Falls back to cached rates on any error.
    fetch('https://open.er-api.com/v6/latest/GBP', { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        if (data?.result !== 'success' || !data.rates) throw new Error('bad payload')
        const next: Record<string, number> = { ...FALLBACK_RATES }
        for (const code of CURRENCIES) {
          if (typeof data.rates[code] === 'number' && data.rates[code] > 0) next[code] = data.rates[code]
        }
        next.GBP = 1
        setRates(next)
        setStatus('live')
        if (data.time_last_update_utc) {
          setUpdated(new Date(data.time_last_update_utc).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }))
        }
      })
      .catch(() => setStatus('cached'))
    return () => controller.abort()
  }, [])

  const a = parseFloat(amount) || 0
  const fromRate = rates[from] || 1
  const toRate = rates[to] || 1
  const converted = (a / fromRate) * toRate
  const rate = toRate / fromRate

  const swap = () => { setFrom(to); setTo(from) }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Amount" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="From">
            {CURRENCIES.map((c) => <option key={c} value={c}>{c} — {NAMES[c]}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="To">
            {CURRENCIES.map((c) => <option key={c} value={c}>{c} — {NAMES[c]}</option>)}
          </select>
        </div>
      </div>

      <button onClick={swap} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-sm font-medium hover:bg-accent transition-colors mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
        Swap currencies
      </button>

      {a > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">{a.toLocaleString()} {from} =</p>
            <p className="text-3xl font-bold text-primary mt-1">{converted.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}</p>
            <p className="text-sm text-muted-foreground mt-2">1 {from} = {rate.toFixed(4)} {to}</p>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            {status === 'live'
              ? `Live mid-market rates${updated ? `, updated ${updated}` : ''}. Indicative — banks and providers add a margin on top.`
              : status === 'loading'
                ? 'Fetching the latest rates… showing recent cached rates meanwhile.'
                : 'Showing recent cached rates (live feed unavailable). Indicative only — check with your bank or provider.'}
          </p>
        </div>
      )}
    </div>
  )
}
