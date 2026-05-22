import { useState, useMemo } from 'react'

function calculate(dob: string, gender: string) {
  if (!dob) return null
  const birth = new Date(dob)
  const birthYear = birth.getFullYear()
  const birthMonth = birth.getMonth()

  // State Pension age rules (simplified)
  let spaAge: number
  if (birthYear < 1954) spaAge = gender === 'female' ? 60 : 65 // already past
  else if (birthYear < 1960) spaAge = 66
  else if (birthYear >= 1960 && birthYear < 1978) spaAge = 67
  else spaAge = 68 // born 1978+

  // More precise for 1954-1960 transition
  if (birthYear >= 1954 && birthYear <= 1960) {
    if (birthYear < 1955) spaAge = 65 + (birthMonth + 1) / 12 // gradual increase to 66
    else spaAge = 66
  }
  if (birthYear >= 1960 && birthYear < 1961) spaAge = 67 // transition

  const spaDate = new Date(birth)
  spaDate.setFullYear(spaDate.getFullYear() + Math.floor(spaAge))
  spaDate.setMonth(spaDate.getMonth() + Math.round((spaAge % 1) * 12))

  const now = new Date()
  const daysUntil = Math.max(0, Math.ceil((spaDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  const yearsUntil = (daysUntil / 365.25).toFixed(1)
  const reached = now >= spaDate

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return { spaAge: Math.floor(spaAge), spaDate: fmt(spaDate), daysUntil, yearsUntil, reached }
}

export default function StatePensionAgeCalculator() {
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('male')
  const result = useMemo(() => calculate(dob, gender), [dob, gender])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Date of Birth</label><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Date of Birth" /></div>
        <div><label className="block text-sm font-medium mb-2">Gender</label><div className="grid grid-cols-2 gap-2"><button onClick={() => setGender('male')} className={`px-4 py-3 rounded-xl text-sm font-medium border ${gender === 'male' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Male</button><button onClick={() => setGender('female')} className={`px-4 py-3 rounded-xl text-sm font-medium border ${gender === 'female' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Female</button></div></div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.reached ? 'bg-green-100 dark:bg-green-950' : 'bg-primary/10'}`}>
            {result.reached ? (
              <><p className="text-lg font-bold text-green-700 dark:text-green-400">You've reached State Pension age!</p><p className="text-sm text-muted-foreground mt-1">Your SPA was {result.spaAge}</p></>
            ) : (
              <><p className="text-sm text-muted-foreground">Your State Pension Age</p><p className="text-4xl font-bold text-primary mt-1">{result.spaAge}</p><p className="text-sm text-muted-foreground mt-1">{result.spaDate}</p><p className="text-sm text-muted-foreground">{result.daysUntil.toLocaleString()} days ({result.yearsUntil} years) to go</p></>
            )}
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Current UK State Pension ages:</p>
            <p>Born before 6 March 1961: <span className="font-medium text-foreground">66</span></p>
            <p>Born 6 March 1961 – 5 April 1977: <span className="font-medium text-foreground">67</span> (rising from 2028)</p>
            <p>Born 6 April 1977+: <span className="font-medium text-foreground">68</span> (under review)</p>
            <p className="mt-1">Check your exact date at gov.uk/state-pension-age</p>
          </div>
        </div>
      )}
    </div>
  )
}
