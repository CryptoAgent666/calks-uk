# App Store Connect — Calks.UK listing (copy-paste ready)

Bundle ID: `uk.calks.app` · SKU: `calks-uk` · Primary language: English (U.K.)

## Name & subtitle
- **App Name** (≤30 chars): `Calks.UK – UK Calculators` (25)
- **Subtitle** (≤30 chars): `Tax, salary, mortgage & more` (28)

_Alternatives for the name if you prefer:_ `Calks.UK: Tax & Salary Calc` (27) · `Calks.UK – Free UK Calc` (23)

## Promotional text (≤170 chars)
```
331 free UK calculators — Income Tax, take-home pay, mortgage, pension, VAT, Stamp Duty and more. Updated for the 2026/27 tax year. Works fully offline.
```

## Description (≤4000 chars)
```
Calks.UK puts 331 free UK calculators in your pocket — and they all work offline, with no sign-up, no ads, and nothing leaving your phone.

Every calculation runs locally on your device, so your numbers stay private. Figures track the latest UK rates and thresholds for the 2026/27 tax year, and the app refreshes itself automatically when new calculators or rate changes go live — so you're never stuck on out-of-date numbers.

CALCULATE ANYTHING UK
• Tax & HMRC — Income Tax, National Insurance, take-home pay, Scottish Income Tax, dividends, Capital Gains, Corporation Tax, Self Assessment
• Pay & Salary — salary to hourly, pro-rata, overtime, payslip breakdown, minimum & living wage
• Mortgage & Property — repayments, affordability, Stamp Duty (SDLT), overpayments, remortgage
• Pensions & Retirement — contributions, tax relief, drawdown, State Pension
• Loans & Debt — personal loans, APR, credit-card payoff, car finance
• Business & Self-Employed — VAT, invoices, profit, IR35, contractor vs employee
• Savings & Investment — compound interest, ISA, savings goals
• Benefits & Welfare — Universal Credit, Child Benefit, statutory pay
• Motoring — fuel cost, mileage, EV charging, road tax (VED)
• Health & Fitness — BMI, BMR, calories, body fat

WHY CALKS.UK
• Works 100% offline — use it on the train, abroad, anywhere
• Private — every calculation runs in the app; nothing is sent to a server
• No ads, no account, no nonsense
• Always current — rates update automatically, over the air
• Clear, step-by-step results with plain-English explanations and FAQs
• Light & dark mode

Whether you're an employee checking your take-home pay, a freelancer working out VAT and IR35, a homebuyer estimating Stamp Duty, a saver planning ahead, or you just need a quick, accurate answer — Calks.UK has a calculator for it.

Free. Offline. Private. Try it today.

Calculations are estimates for general guidance and are not financial advice. For decisions, check gov.uk or a qualified adviser.
```

## Keywords (≤100 chars, comma-separated — avoid words already in name/subtitle)
```
paye,national insurance,take-home,payslip,sdlt,ir35,dividend,hmrc,wage,vat,isa,net pay,uk tax
```

## URLs
- **Support URL:** `https://calks.uk`
- **Marketing URL:** `https://calks.uk`
- **Privacy Policy URL:** `https://calks.uk/privacy`

## Category & rating
- **Primary category:** Finance
- **Secondary category:** Utilities
- **Age rating:** 4+ (no objectionable content)

## App Privacy ("nutrition label")
**Select "Data Not Collected".** In the native app:
- Google Analytics is disabled (gated off inside the app) and AdSense is stripped — no analytics, no ads, no tracking.
- All calculations run locally on device.
- The only network calls are: (a) the OTA update check to `calks.uk/app/latest.json`, and (b) live FX rates for the currency converter — neither sends personal data.

_Note:_ ordinary server request logs (e.g. IP) are not used to track users, so they don't require declaration. If App Store review asks, the app collects no data linked to identity.

## Export compliance
The app uses only standard HTTPS encryption → **exempt**. `ITSAppUsesNonExemptEncryption` has been set to `false` in `Info.plist`, so App Store Connect won't ask the export-compliance question on each upload.

## Screenshots — ready ✅ (polished promo style: brand bg + headline + app screen)
Generated in app-mode (no ads), exact slot sizes:
- **iPhone 6.5"/6.7" → `app-store-assets/store-iphone-6.5/` (1284×2778), 5 shots** — home, income-tax, take-home, stamp-duty, dark-mode.
- **iPad 13" → `app-store-assets/store-ipad-13/` (2048×2732), 3 shots** — home, income-tax, take-home. (Required because the app is universal — iPhone+iPad.)
- **iPhone 6.9" → `app-store-assets/store-iphone-6.9/` (1320×2868), 5 shots** — same promo style, for the 6.9" slot if shown. (Raw un-captioned 6.9" caps remain in `screenshots-ios/`.)

Regenerate any time with `python3 scripts/make-store-shots.py` (captions are in that script). The Android shots in `play-store-assets/` (1080×2340) are NOT valid for the App Store.

## What's New (release notes, first version)
```
First release of Calks.UK for iPhone: 331 UK calculators, fully offline, updated for the 2026/27 tax year. No ads, no account, nothing leaves your device.
```
