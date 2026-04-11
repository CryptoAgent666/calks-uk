import { useState } from 'react'

type Gender = 'women' | 'men'

const WOMEN_SIZES = [
  { uk: 4, eu: 32, us: 0, bust: '76', waist: '58', hip: '82' },
  { uk: 6, eu: 34, us: 2, bust: '80', waist: '62', hip: '86' },
  { uk: 8, eu: 36, us: 4, bust: '84', waist: '66', hip: '90' },
  { uk: 10, eu: 38, us: 6, bust: '88', waist: '70', hip: '94' },
  { uk: 12, eu: 40, us: 8, bust: '92', waist: '74', hip: '98' },
  { uk: 14, eu: 42, us: 10, bust: '96', waist: '78', hip: '102' },
  { uk: 16, eu: 44, us: 12, bust: '100', waist: '82', hip: '106' },
  { uk: 18, eu: 46, us: 14, bust: '106', waist: '88', hip: '112' },
  { uk: 20, eu: 48, us: 16, bust: '112', waist: '94', hip: '118' },
  { uk: 22, eu: 50, us: 18, bust: '118', waist: '100', hip: '124' },
]

const MEN_SIZES = [
  { uk: 'XS', eu: 44, us: 34, chest: '86-91', waist: '71-76' },
  { uk: 'S', eu: 46, us: 36, chest: '91-96', waist: '76-81' },
  { uk: 'M', eu: 48, us: 38, chest: '96-101', waist: '81-86' },
  { uk: 'L', eu: 50, us: 40, chest: '101-106', waist: '86-91' },
  { uk: 'XL', eu: 52, us: 42, chest: '106-111', waist: '91-96' },
  { uk: 'XXL', eu: 54, us: 44, chest: '111-116', waist: '96-101' },
]

export default function ClothingSizeConverter() {
  const [gender, setGender] = useState<Gender>('women')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setGender('women')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${gender === 'women' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Women's</button>
        <button onClick={() => setGender('men')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border ${gender === 'men' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Men's</button>
      </div>

      <div className="overflow-x-auto">
        {gender === 'women' ? (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="py-2 text-left font-medium text-muted-foreground">UK</th><th className="py-2 text-center font-medium text-muted-foreground">EU</th><th className="py-2 text-center font-medium text-muted-foreground">US</th><th className="py-2 text-center font-medium text-muted-foreground">Bust (cm)</th><th className="py-2 text-center font-medium text-muted-foreground">Waist (cm)</th><th className="py-2 text-center font-medium text-muted-foreground">Hip (cm)</th></tr></thead>
            <tbody>{WOMEN_SIZES.map(s => (
              <tr key={s.uk} className="border-b border-border/50 hover:bg-accent/50"><td className="py-2.5 font-bold">{s.uk}</td><td className="py-2.5 text-center">{s.eu}</td><td className="py-2.5 text-center">{s.us}</td><td className="py-2.5 text-center text-muted-foreground">{s.bust}</td><td className="py-2.5 text-center text-muted-foreground">{s.waist}</td><td className="py-2.5 text-center text-muted-foreground">{s.hip}</td></tr>
            ))}</tbody>
          </table>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="py-2 text-left font-medium text-muted-foreground">UK</th><th className="py-2 text-center font-medium text-muted-foreground">EU</th><th className="py-2 text-center font-medium text-muted-foreground">US</th><th className="py-2 text-center font-medium text-muted-foreground">Chest (cm)</th><th className="py-2 text-center font-medium text-muted-foreground">Waist (cm)</th></tr></thead>
            <tbody>{MEN_SIZES.map(s => (
              <tr key={s.uk} className="border-b border-border/50 hover:bg-accent/50"><td className="py-2.5 font-bold">{s.uk}</td><td className="py-2.5 text-center">{s.eu}</td><td className="py-2.5 text-center">{s.us}</td><td className="py-2.5 text-center text-muted-foreground">{s.chest}</td><td className="py-2.5 text-center text-muted-foreground">{s.waist}</td></tr>
            ))}</tbody>
          </table>
        )}
      </div>
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>Sizes are approximate and vary between brands. Always check the retailer's specific size guide. Measurements in centimetres.</p>
      </div>
    </div>
  )
}
