import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type PetType = 'dog' | 'cat'
type CoverLevel = 'accident' | 'time_limited' | 'max_benefit' | 'lifetime'

const BASE_COSTS: Record<PetType, Record<CoverLevel, number>> = {
  dog: { accident: 8, time_limited: 18, max_benefit: 28, lifetime: 42 },
  cat: { accident: 5, time_limited: 10, max_benefit: 16, lifetime: 25 },
}

const COVER_INFO: Record<CoverLevel, { name: string; vetLimit: string; description: string }> = {
  accident: { name: 'Accident Only', vetLimit: '£2,000', description: 'Covers accidents but not illness' },
  time_limited: { name: 'Time-Limited', vetLimit: '£4,000', description: '12 months per condition' },
  max_benefit: { name: 'Maximum Benefit', vetLimit: '£8,000', description: 'Fixed amount per condition' },
  lifetime: { name: 'Lifetime', vetLimit: '£12,000+', description: 'Annual limit, resets each year' },
}

function calculate(petType: PetType, cover: CoverLevel, age: number, breed: string) {
  const base = BASE_COSTS[petType][cover]
  const ageFactor = age <= 2 ? 0.9 : age <= 5 ? 1 : age <= 8 ? 1.5 : age <= 10 ? 2 : 2.8
  const breedFactor = breed === 'pedigree' ? 1.3 : breed === 'crossbreed' ? 1.0 : 0.9
  const monthly = base * ageFactor * breedFactor
  const annual = monthly * 12

  return { monthly, annual, info: COVER_INFO[cover] }
}

export default function PetInsuranceCalculator() {
  const [pet, setPet] = useState<PetType>('dog')
  const [cover, setCover] = useState<CoverLevel>('lifetime')
  const [age, setAge] = useState('3')
  const [breed, setBreed] = useState('crossbreed')

  const a = parseInt(age) || 0
  const result = useMemo(() => calculate(pet, cover, a, breed), [pet, cover, a, breed])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Pet Type</label><select value={pet} onChange={(e) => setPet(e.target.value as PetType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Pet Type"><option value="dog">Dog</option><option value="cat">Cat</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Age</label><input type="number" min="0" max="20" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Age" /></div>
        <div><label className="block text-sm font-medium mb-2">Breed Type</label><select value={breed} onChange={(e) => setBreed(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Breed Type"><option value="crossbreed">Crossbreed</option><option value="pedigree">Pedigree</option><option value="moggy">Moggy / Mixed</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Cover Level</label><select value={cover} onChange={(e) => setCover(e.target.value as CoverLevel)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Cover Level">{Object.entries(COVER_INFO).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}</select></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Monthly Premium</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.monthly)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.annual)}/year</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="font-medium text-sm">{result.info.name}</p>
          <p className="text-sm text-muted-foreground mt-1">{result.info.description}</p>
          <p className="text-sm text-muted-foreground">Vet fee limit: <span className="font-medium text-foreground">{result.info.vetLimit}</span></p>
        </div>
        <p className="text-xs text-muted-foreground text-center">Indicative premiums only — actual costs vary by provider, breed, location and medical history.</p>
      </div>
    </div>
  )
}
