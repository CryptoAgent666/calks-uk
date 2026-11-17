import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Origin of manufacture, not the country you buy from. Preferential 0% rates on passenger
// cars in the UK Trade Tariff (preferential measures on 8703 23 90 00, 8703 32 90 00,
// 8703 33 19 00 and 8703 80 90 00, checked 17 Nov 2026). They apply only with proof of
// preferential origin; without it the 10% third-country rate applies. India's preference
// (from 15 July 2026) covers petrol and diesel cars but not electric ones (8703 80).
// NB motor caravans, a separate 8703 subheading, are 6.5%; this calculator covers cars.
type OriginInfo = { label: string; preferential: boolean; evExcluded?: boolean }
export const ORIGINS: Record<string, OriginInfo> = {
  eu: { label: 'EU country', preferential: true },
  jp: { label: 'Japan (0% since 1 February 2026)', preferential: true },
  kr: { label: 'South Korea', preferential: true },
  tr: { label: 'Turkey', preferential: true },
  in: { label: 'India (petrol or diesel, 0% since 15 July 2026)', preferential: true, evExcluded: true },
  mx: { label: 'Mexico', preferential: true },
  ca: { label: 'Canada', preferential: true },
  za: { label: 'South Africa', preferential: true },
  ma: { label: 'Morocco', preferential: true },
  rs: { label: 'Serbia', preferential: true },
  ch: { label: 'Switzerland', preferential: true },
  no: { label: 'Norway', preferential: true },
  au: { label: 'Australia', preferential: true },
  nz: { label: 'New Zealand', preferential: true },
  sg: { label: 'Singapore', preferential: true },
  il: { label: 'Israel', preferential: true },
  us: { label: 'USA (no UK preference on cars)', preferential: false },
  cn: { label: 'China (no UK preference on cars)', preferential: false },
  other: { label: 'Another country', preferential: false },
}

const STANDARD_DUTY = 0.10
const VAT_RATE = 0.20
// Collectors' items (heading 9705): 0% duty, VAT on 25% of the value, so an effective 5%
// (gov.uk/guidance/how-to-value-goods-for-import-vat).
const CLASSIC_VAT_VALUE_SHARE = 0.25

// DVSA statutory IVA inspection, car (M1), basic for personal imports or normal: £199 in
// working hours, £294 outside (vehicle approval test costs: cars, 30 Oct 2026).
const IVA_FEE = 199
const IVA_FEE_OUT_OF_HOURS = 294
// EU-registered car: European Certificate of Conformity, plus a certificate of GB conversion
// IVA (£100) if it is left-hand drive (gov.uk/importing-vehicles-into-the-uk).
const GB_CONVERSION_IVA_FEE = 100
// DVLA fee for first registration of an imported vehicle (V55/5).
const FIRST_REGISTRATION_FEE = 55

// First vehicle tax payment, cars registered from 1 April 2017 (2026/27, gov.uk/vehicle-tax-rate-tables).
// Upper CO2 limit of each band in g/km; anything over 255 g/km takes the last rate.
const CO2_BAND_LIMITS = [0, 50, 75, 90, 100, 110, 130, 150, 170, 190, 225, 255]
// Petrol, alternative fuel, zero emission and diesel cars meeting RDE2
const FIRST_YEAR_STANDARD = [10, 115, 135, 280, 365, 405, 455, 560, 1_410, 2_270, 3_420, 4_850, 5_690]
// All other diesel cars pay one band higher
const FIRST_YEAR_DIESEL = [10, 135, 280, 365, 405, 455, 560, 1_410, 2_270, 3_420, 4_850, 5_690, 5_690]

export function firstYearVed(co2: number, fuelType: string, dieselRde2: boolean) {
  if (fuelType === 'electric') return 10
  let band = 0
  while (band < CO2_BAND_LIMITS.length && co2 > CO2_BAND_LIMITS[band]) band++
  const table = fuelType === 'diesel' && !dieselRde2 ? FIRST_YEAR_DIESEL : FIRST_YEAR_STANDARD
  return table[band]
}

export interface ImportInputs {
  carValue: number
  shippingCost: number
  co2: number
  fuelType: string
  dieselRde2: boolean
  origin: string
  proofOfOrigin: boolean
  classic: boolean
  builtBefore1986: boolean
  over10Years: boolean
  euRegistered: boolean
  leftHandDrive: boolean
  outOfHours: boolean
}

export function calculate(i: ImportInputs) {
  const customsValue = i.carValue + i.shippingCost
  const info = ORIGINS[i.origin] ?? ORIGINS.other

  let dutyRate = STANDARD_DUTY
  let dutyReason: string
  if (i.classic) {
    dutyRate = 0
    dutyReason = "0%: qualifying collector's item (heading 9705)"
  } else if (!info.preferential) {
    dutyReason = '10%: no UK preferential rate for cars made there'
  } else if (info.evExcluded && i.fuelType === 'electric') {
    dutyReason = "10%: India's preferential rate does not cover electric cars"
  } else if (!i.proofOfOrigin) {
    dutyReason = '10%: the 0% rate needs proof of preferential origin'
  } else {
    dutyRate = 0
    dutyReason = '0%: preferential rate with proof of origin'
  }
  const importDuty = customsValue * dutyRate

  // VAT on (customs value + duty); a collector's item is valued at 25% for VAT
  const vatableAmount = (customsValue + importDuty) * (i.classic ? CLASSIC_VAT_VALUE_SHARE : 1)
  const vat = vatableAmount * VAT_RATE
  const effectiveVatRate = i.classic ? VAT_RATE * CLASSIC_VAT_VALUE_SHARE : VAT_RATE

  // Historic vehicle tax class: built before 1 January 1986, nil rate from 1 April 2026
  const historic = i.classic && i.builtBefore1986
  const ved = historic ? 0 : firstYearVed(i.co2, i.fuelType, i.dieselRde2)

  // Cars over 10 years old (and so any 30-year classic) are exempt from vehicle approval
  let typeApproval = 0
  let approvalLabel: string
  if (i.over10Years || i.classic) {
    approvalLabel = 'Vehicle approval (over 10 years, exempt)'
  } else if (i.euRegistered) {
    typeApproval = i.leftHandDrive ? GB_CONVERSION_IVA_FEE : 0
    approvalLabel = i.leftHandDrive ? 'GB conversion IVA (EU CoC, left-hand drive)' : 'EU Certificate of Conformity (no IVA)'
  } else {
    typeApproval = i.outOfHours ? IVA_FEE_OUT_OF_HOURS : IVA_FEE
    approvalLabel = i.outOfHours ? 'IVA test (outside working hours)' : 'IVA test (working hours)'
  }

  const registration = FIRST_REGISTRATION_FEE
  const totalCost = customsValue + importDuty + vat + ved + typeApproval + registration
  const totalOnTop = totalCost - i.carValue

  return { customsValue, dutyRate: dutyRate * 100, dutyReason, importDuty, vat, effectiveVatRate: effectiveVatRate * 100, ved, historic, typeApproval, approvalLabel, registration, totalCost, totalOnTop }
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function CarImportDutyCalculator() {
  const [value, setValue] = useState('20000')
  const [shipping, setShipping] = useState('1500')
  const [co2, setCo2] = useState('120')
  const [fuel, setFuel] = useState('petrol')
  const [rde2, setRde2] = useState(false)
  const [origin, setOrigin] = useState('eu')
  const [proof, setProof] = useState(true)
  const [classic, setClassic] = useState(false)
  const [pre1986, setPre1986] = useState(false)
  const [over10, setOver10] = useState(false)
  const [euRegistered, setEuRegistered] = useState(true)
  const [lhd, setLhd] = useState(true)
  const [outOfHours, setOutOfHours] = useState(false)

  const v = parseFloat(value.replace(/,/g,'')) || 0
  const s = parseFloat(shipping.replace(/,/g,'')) || 0
  const c = parseInt(co2) || 0
  const originInfo = ORIGINS[origin] ?? ORIGINS.other
  const result = useMemo(() => calculate({
    carValue: v, shippingCost: s, co2: c, fuelType: fuel, dieselRde2: rde2, origin, proofOfOrigin: proof,
    classic, builtBefore1986: pre1986, over10Years: over10, euRegistered, leftHandDrive: lhd, outOfHours,
  }), [v, s, c, fuel, rde2, origin, proof, classic, pre1986, over10, euRegistered, lhd, outOfHours])
  const approvalExempt = over10 || classic

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Car Value (purchase)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Car Value (purchase)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Shipping and Insurance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={shipping} onChange={(e) => setShipping(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Shipping and Insurance" /></div></div>
        <div><label className="block text-sm font-medium mb-2">CO2 (g/km)</label><input type="number" min="0" max="400" value={co2} onChange={(e) => setCo2(e.target.value)} className={inputClass}  aria-label="CO2 (g/km)" /></div>
        <div><label className="block text-sm font-medium mb-2">Fuel Type</label><select value={fuel} onChange={(e) => setFuel(e.target.value)} className={inputClass} aria-label="Fuel Type"><option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="electric">Electric</option></select></div>
        <div className="col-span-2"><label className="block text-sm font-medium mb-2">Where the car was made</label><select value={origin} onChange={(e) => setOrigin(e.target.value)} className={inputClass} aria-label="Where the car was made">{Object.entries(ORIGINS).map(([k, o]) => <option key={k} value={k}>{o.label}</option>)}</select></div>
      </div>
      <div className="space-y-3">
        {fuel === 'diesel' && <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={rde2} onChange={(e) => setRde2(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label="Diesel meets the RDE2 standard" /><span className="text-sm">Diesel meets the RDE2 standard (ask the manufacturer; otherwise the first tax is one band higher)</span></label>}
        {originInfo.preferential && !classic && <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={proof} onChange={(e) => setProof(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label="I have proof of preferential origin" /><span className="text-sm">I have proof of preferential origin (without it, 10% duty applies)</span></label>}
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={classic} onChange={(e) => setClassic(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label="Qualifying classic collector's item" /><span className="text-sm">Classic over 30 years old, in original state, that qualifies as a collector's item</span></label>
        {classic && <label className="flex items-center gap-3 cursor-pointer pl-8"><input type="checkbox" checked={pre1986} onChange={(e) => setPre1986(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label="Built before 1 January 1986" /><span className="text-sm">Built before 1 January 1986 (historic vehicle tax class, no vehicle tax to pay)</span></label>}
        {!classic && <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={over10} onChange={(e) => setOver10(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label="Car is over 10 years old" /><span className="text-sm">Car is over 10 years old (no vehicle approval needed)</span></label>}
        {!approvalExempt && <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={euRegistered} onChange={(e) => setEuRegistered(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label="Registered in the EU with a Certificate of Conformity" /><span className="text-sm">Registered in the EU, with a European Certificate of Conformity</span></label>}
        {!approvalExempt && euRegistered && <label className="flex items-center gap-3 cursor-pointer pl-8"><input type="checkbox" checked={lhd} onChange={(e) => setLhd(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label="Left-hand drive" /><span className="text-sm">Left-hand drive (needs a £100 GB conversion IVA)</span></label>}
        {!approvalExempt && !euRegistered && <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={outOfHours} onChange={(e) => setOutOfHours(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label="IVA test outside working hours" /><span className="text-sm">IVA test outside working hours (£294 instead of £199)</span></label>}
      </div>

      {v > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total UK Landing Cost</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.totalCost)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.totalOnTop)} in costs above purchase price</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Car Value</td><td className="text-right tabular-nums">{formatCurrency(v)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Shipping and insurance</td><td className="text-right tabular-nums">{formatCurrency(s)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Import Duty ({result.dutyRate}%)</td><td className="text-right tabular-nums">{formatCurrency(result.importDuty)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Import VAT ({result.effectiveVatRate === 20 ? '20%' : 'effective 5%'})</td><td className="text-right tabular-nums">{formatCurrency(result.vat)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">{result.historic ? 'Vehicle tax (historic class)' : 'First Year VED'}</td><td className="text-right tabular-nums">{formatCurrency(result.ved)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">{result.approvalLabel}</td><td className="text-right tabular-nums">{formatCurrency(result.typeApproval)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">DVLA First Registration</td><td className="text-right tabular-nums">{formatCurrency(result.registration)}</td></tr>
              <tr className="font-semibold"><td className="py-2">Total</td><td className="text-right tabular-nums">{formatCurrency(result.totalCost)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p>Duty: {result.dutyReason}.</p>
            {classic && <p>Collector's-item treatment depends on HMRC's classification: the car must be in its original state and meet HMRC's criteria, and the Tariff Classification Service can advise before you buy.</p>}
            <p>The first tax payment assumes DVLA treats the car as first registered now. A used import first registered abroad may be taxed from its original registration date, which changes the rate, so check with DVLA.</p>
          </div>
        </div>
      )}
    </div>
  )
}
