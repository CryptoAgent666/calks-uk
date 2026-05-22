import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(salary: number, coverPct: number, deferredWeeks: number, retireAge: number, currentAge: number) {
  const monthlyCover = (salary * coverPct / 100) / 12
  const yearsOfCover = retireAge - currentAge

  // Indicative premium: ~3-5% of benefit amount depending on age/deferral
  const baseRate = currentAge < 30 ? 0.025 : currentAge < 40 ? 0.035 : currentAge < 50 ? 0.05 : 0.07
  const deferralDiscount = deferredWeeks >= 26 ? 0.6 : deferredWeeks >= 13 ? 0.75 : deferredWeeks >= 4 ? 0.9 : 1
  const annualPremium = monthlyCover * 12 * baseRate * deferralDiscount
  const monthlyPremium = annualPremium / 12
  const totalPremiums = annualPremium * yearsOfCover

  return { monthlyCover, annualCover: monthlyCover * 12, monthlyPremium, annualPremium, yearsOfCover, totalPremiums }
}

export default function IncomeProtectionCalculator() {
  const [salary, setSalary] = useState('40000')
  const [cover, setCover] = useState('60')
  const [deferred, setDeferred] = useState('13')
  const [retire, setRetire] = useState('67')
  const [age, setAge] = useState('35')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(s, parseFloat(cover)||60, parseInt(deferred)||13, parseInt(retire)||67, parseInt(age)||35), [s, cover, deferred, retire, age])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Cover Level (%)</label><select value={cover} onChange={(e) => setCover(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Cover Level (%)"><option value="50">50%</option><option value="60">60% (typical)</option><option value="70">70%</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Deferred Period</label><select value={deferred} onChange={(e) => setDeferred(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Deferred Period"><option value="4">4 weeks</option><option value="8">8 weeks</option><option value="13">13 weeks</option><option value="26">26 weeks</option><option value="52">52 weeks</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Your Age</label><input type="number" min="18" max="64" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Age" /></div>
        <div><label className="block text-sm font-medium mb-2">Cover Until Age</label><input type="number" min="55" max="70" value={retire} onChange={(e) => setRetire(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Cover Until Age" /></div>
      </div>

      {s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Monthly Benefit (if you can't work)</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.monthlyCover)}</p>
            <p className="text-sm text-muted-foreground mt-1">{cover}% of salary &middot; Pays after {deferred} weeks</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Benefit</p><p className="text-lg font-bold">{formatCurrency(result.annualCover)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Est. Monthly Premium</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.monthlyPremium)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Cover Duration</p><p className="text-lg font-bold">{result.yearsOfCover} years</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Premiums</p><p className="text-lg font-bold">{formatCurrency(result.totalPremiums)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Premiums are indicative only. Actual costs depend on health, occupation, smoker status and provider. A longer deferred period reduces premiums significantly.</p>
          </div>
        </div>
      )}
    </div>
  )
}
