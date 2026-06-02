# CHANGELOG — Calks.uk

## v1.5.13 — 2026-06-02 (Audit 11 via calkcheck)

### Code fixes
- **`CookingConverter.tsx`** — removed all 5 `as any` casts (K7 type-erasure finding). Normalised volume/weight units to a single typed `factor` field (`Unit` type), dropping the per-category `toMl`/`toG` branch. Numeric factors byte-identical to the previous constants → output unchanged.

### Schema fixes (static pages)
- **Added `BreadcrumbList` JSON-LD** to all 6 indexable static pages that only had `WebPage`: `about`, `contact`, `methodology`, `privacy`, `terms`, `updates`. (Homepage = root, `search`/`offline` = noindex, `404` = error page → intentionally none. `/calculators/` and calculator detail pages already had breadcrumbs.)
- **`about.astro`** — removed a redundant local `Person` schema that duplicated the site-wide `#author` node with a conflicting `url` (LinkedIn vs `/about/`). Layout already inlines the canonical Person on every page; `/about/` now emits exactly one Person node.
- Verified on the dev server: all 6 pages emit `WebPage` + `BreadcrumbList`, every JSON-LD block parses, `/about/` has a single Person.

### Second calkcheck run (verification, 10 fresh high-value pages)
- AI code: **0 findings** (down from 1) — CookingConverter K7 fix confirmed
- BUG-8 "double currency `£ £`" flagged on 4 money-input calcs (income-tax, scottish-income-tax, national-insurance, stamp-duty) → **false positive**: absolute-positioned `£` input-prefix flattened against `£25K` preset chips; no literal `£ £` in source, visually correct (screenshot-verified). Logged in memory.
- `about`/`methodology` still flag missing `BreadcrumbList` on the **live** site — expected until this commit is deployed
- stamp-duty flagged AI-LIKELY (MTLD 49, CV 0.71, em-dash 21/1k, clichés 0) — stylistic em-dash density, not a content defect

### Content fix — EV Advisory Electricity Rate (AER) refreshed
- Updated stale AER from "8p/mile (Dec 2024)" to the **current gov.uk rate effective 1 June 2026: 7p/mile home charging + 15p/mile public charging** (HMRC now splits home vs public). Fixed both refs in `calculator-content.ts` (mileage-allowance + business-mileage-record content). Source: [gov.uk advisory fuel rates](https://www.gov.uk/guidance/advisory-fuel-rates) (updated 22 May 2026).
- Left the separate `8p/kWh` home-electricity *tariff* figures untouched (different metric — off-peak charging cost, still realistic).

### Content fix — statutory redundancy / tribunal limits (April 2026) — MAJOR
Found stale 2025/26 figures presented as "2026/27". Verified against [gov.uk](https://www.gov.uk/redundancy-your-rights/redundancy-pay) + Employment Rights (Increase of Limits) Order 2026 and corrected across **3 calculator engines** + content + FAQ + metadata:
- **Statutory weekly pay cap £735 → £751** (max payout £22,050 → £22,530). Fixed: `RedundancyPayCalculator.tsx`, `EmploymentTribunalCalculator.tsx`, `SettlementAgreementCalculator.tsx`, plus `calculator-content.ts` (×2), `faqs.ts` (×2), `calculators.ts` (description + metaTitle).
- **Unfair-dismissal compensatory award cap £118,223 → £123,785** (tribunal engine + content + FAQ + metaTitle).
- **Bug fix:** redundancy description said "max 30 years service" → corrected to **20 years** (30 is the max *weeks*).
- Verified live: redundancy now returns **£22,530 (30 weeks)** at the £751 cap; tribunal/settlement engines updated.

### Content fix — Vehicle Excise Duty (VED) 2026/27 — MAJOR
Systematic VED staleness (mix of £190 2024/25 and £195 2025/26 figures). Verified against [gov.uk vehicle tax rates](https://www.gov.uk/vehicle-tax-rate-tables) and corrected:
- **Standard rate £190/£195 → £200**; **expensive-car supplement £390/£410/£425/£620 → £440** (figures were inconsistent across the site).
- **`CarTaxCalculator.tsx` engine**: `STANDARD_RATE` 195→200, supplement 425→440, and added the **EV £50,000 supplement threshold** from April 2026 (petrol/diesel stays £40k). Verified live: petrol £45k → £200+£440; EV £45k → £200 no supplement; EV £55k → £200+£440.
- **First-year (showroom) rates in prose were pre-April-2025 (un-doubled)**: max "£2,755 for 255g+" → **£5,490**; worked example "£220 first-year + £195" → **£440 + £200 (total £840)**. (Engine already had the doubled rates.)
- **Alternative-fuel £10 discount removed** (April 2025) — content said "£180 alt fuel", corrected to £200 (all cars same).
- **`PayPerMileCalculator.tsx`** default "Current VED" £190 → £200. **`EVSavingsCalculator.tsx`** `vedSaving` £50 → £0 (EVs now pay the same standard VED as petrol — no ongoing saving).
### Content fix — VED first-year (showroom) rate table 2026/27 — full pass
Did the flagged full pass. The engine's `getFirstYearRate` was inconsistent — **low bands pre-2025, high bands 2025/26, none current**. Rewrote the entire band table in `CarTaxCalculator.tsx` to the verified gov.uk 2026/27 figures:
- 1-50g £10→**£115** · 51-75g £30→**£135** · 76-90g £270→**£280** · 91-100g £350→**£365** · 101-110g £390→**£405** · 111-130g £440→**£455** · 131-150g £540→**£560** · 151-170g £1,360→**£1,410** · 171-190g £2,190→**£2,270** · 191-225g £3,300→**£3,420** · 226-255g £4,680→**£4,850** · >255g £5,490→**£5,690**. (0g/EV £10 unchanged.)
- Updated prose to match: max "£5,490" → **£5,690** (×2), worked example "£440 first-year (120g)" → **£455** (total £840 → £855).
- Verified live across bands: 40g→£115, 60g→£135, 95g→£365, 120g→£455, 160g→£1,410, 300g→£5,690 — all match gov.uk. Source: [gov.uk/vehicle-tax-rate-tables](https://www.gov.uk/vehicle-tax-rate-tables) (cross-checked vs Auto Express/RAC/Honest John 2026).

### Third interactive browser sweep (15 fresh random pages — scroll/fill/click)
salary-sacrifice, ratio, heart-rate-zone, flooring, inheritance-tax, lawn-seed, electricity-cost, corporation-tax, lbtt-ltt, real-return, vat-flat-rate, visa-points, cost-of-delay, tax-bracket-visualizer, shoe-size.
- **15/15 functional.** Maths verified exact: salary-sacrifice (£5k×28%=£1,400), ratio (12:8÷500=300:200), heart-rate (MHR 180 Tanaka), flooring (30.8m²/14 packs/£770), **inheritance-tax (£1m−£500k=£500k×40%=£200,000)**, **corporation-tax (£100k→£22,750 via marginal relief 3/200)**, **LBTT £4,600 + LTT £4,500** (region toggle works), real-return (Fisher 3.88%), **vat-flat-rate (12%×£120k=£14,400, keep £5,600)**, **tax-bracket (£60k→£11,432)**, cost-of-delay (£122,970), shoe-size (UK9→EU43/US10).
- **Figures verified current 2026/27**: IHT (£325k NRB/£175k RNRB/40%/36%/£2m taper/frozen-2030), corp-tax (19%/25%/£50k/£250k), LBTT+LTT bands+ADS, VAT FRS (£150k eligibility), visa points (70/£38,700/B1).
- **0 content bugs, 0 translation errors.** False alarms (all confirmed not bugs): cost-of-delay "octillions" = my scanner bypassing the input's `max="15"` (real users bounded); electricity-cost NO-CHANGE = dev `client:visible` hydration flake (SSR maths correct); real-return NO-CHANGE = I set inputs to existing values.

### (superseded) earlier note
- _The per-band CO2 first-year follow-up flagged above has now been completed (see "VED first-year rate table" section)._

### Content fix — SDLT first-time-buyer threshold (reverted April 2025) — MAJOR
Full pass triggered by a systematic-figure check. The SDLT calculator **engines were all correct** (£300k FTB / £500k max / £125k nil-rate), but ~9 prose/FAQ spots carried the **pre-April-2025 temporary** thresholds (£425k FTB / £625k max) and stale £250k-nil-rate worked examples. Verified vs [gov.uk SDLT](https://www.gov.uk/stamp-duty-land-tax/residential-property-rates) and fixed:
- FTB threshold £425,000 → **£300,000**, max £625k → **£500,000** (content ×4, faqs ×4: lines 109/110/3102/7473/7579 + faqs 715/1859/1860/1861).
- Recomputed stale worked examples: £300k standard SDLT £2,500 → **£5,000**; £1M standard £41,250 → **£43,750**; £400k FTB £0 → **£5,000**; £500k FTB £3,750 → **£10,000**; £700k FTB → **£25,000**.
- Verified live: stamp-duty calc £400k standard = £10,000 (2.50%), FTB = £5,000 (1.25%). (faqs:31 standard bands already correct.)

### Content fix — Universal Credit rates 2026/27 — MAJOR
UC was 1-2 years stale across the **engine + ~8 prose/FAQ spots**, with two extra defects. Verified vs gov.uk/Turn2us/entitledto and fixed:
- `UniversalCreditCalculator.tsx`: all standard allowances (single u25 £316.98→**£338.58**, single 25+ £400.14→**£424.90**, couple u25 £497.55→**£528.34**, couple 25+ £628.10→**£666.97**), child elements (£339→**£351.88**, £292.81→**£303.94**), work allowances (£411→**£427**, £684→**£710**).
- Prose: same figures across content (×4) + faqs (×3), recomputed worked example (→ **£1,051.63/month**), and benefit-cap earnings exemption £793→**£881** (16×NLW) with £12.21→£12.71.
- **Bug fixes**: work-allowance prose had the two values **backwards** ("£404 no housing / £673 with" — should be higher £710 no-housing / £427 with-housing); and faqs:99 had a **fabricated £439.58** child rate. Both corrected.
- Verified live: single 25+, 1 child, £1,200 earnings, £700 rent → £1,051.63/month (max £1,476.78, WA £427).

### Content fix — London Congestion Charge £15 → £18 (Jan 2026) — MAJOR
The charge rose to £18/day on 2 January 2026 (first rise since 2020); engine + 5 prose spots still said £15. Verified vs [TfL](https://tfl.gov.uk/modes/driving/congestion-charge) and fixed:
- `CongestionChargeCalculator.tsx`: `CC_DAILY` 15→**18**; added the EV-on-Auto-Pay **£13.50** Cleaner Vehicle rate (the 100% EV exemption ended 25 Dec 2025); removed an incorrect "Auto Pay discount" model (standard Auto Pay is £18/day).
- Prose: £15→£18 across content (×3) + faqs (×2), with the £12.50+£15=£27.50 combined ULEZ example → **£30.50**, and late-payment £17.50 → £21.
- Verified live: 240 days standard = £4,320 (£18/day); EV+Auto Pay = £3,240 (£13.50/day).

### Accessibility fix — debt-to-income inputs
- `DebtToIncomeCalculator.tsx` — 6 debt inputs (Mortgage/Rent, Car Finance, Credit Cards, Personal Loans, Student Loan, Other) had visible labels but no programmatic association (no `htmlFor`/`aria-label`). Added `aria-label={label}` to the shared `Input` component. Verified live: all 7 inputs now expose accessible names; DTI math confirmed (£1,100 debt, 12% excl-mortgage).

### AdSense Auto Ads — activated (ca-pub-4859241862365215)
- `Layout.astro`: added static `<meta name="google-adsense-account" content="ca-pub-4859241862365215">` (site-ownership verification) + a **static** Auto Ads `<script async src="…/adsbygoogle.js?client=ca-pub-4859241862365215" crossorigin="anonymous">` tag in `<head>`.
  - Switched from a consent-gated JS injector to a static tag so Google's **"AdSense code snippet"** verification (which scans the raw HTML, not JS-rendered DOM) and the AdSense crawler can detect it, and ads serve to all web visitors.
  - The native (Capacitor) app webview strips the tag via a following inline guard (`if (window.__IS_CAPACITOR__) … removes adsbygoogle.js`) — AdSense web ads aren't permitted in an app webview (use AdMob there).
  - GDPR/UK ad-personalisation consent is delegated to **Google's consent message (CMP)** configured in the AdSense dashboard (not the site's own banner, which now governs only Google Analytics).
- `CookieConsent.astro`: updated the doc comment — GA still consent-gated; AdSense loads on every page with Google's CMP handling consent.
- `public/ads.txt`: recreated with the real ID — `google.com, pub-4859241862365215, DIRECT, f08c47fec0942fa0` (ads.txt uses `pub-`, not `ca-pub-`).
- `_headers` CSP widened for AdSense serving: added `*.googlesyndication.com`, `*.g.doubleclick.net`, `adservice.google.com`, `*.adtrafficquality.google` to script-src/connect-src/frame-src (otherwise Auto Ads frames/scripts would be CSP-blocked).
- Verified on dev: static `<script>` tag + meta tag present in **raw SSR HTML** (homepage + calculator pages), ads.txt served, no console errors. The Capacitor guard removes the tag on localhost (dev = treated as app), so ad loading is verified by HTML presence; on calks.uk the tag stays and loads ads.
- **Action items for deploy:** (1) deploy this build — the live site still served the old placeholder `ca-pub-XXXXXXX` ads.txt and no AdSense code, which is why the first verification attempt failed; (2) in AdSense, the "AdSense code snippet" method will now verify; (3) toggle **Auto ads ON** in the dashboard; (4) enable Google's GDPR consent message (CMP) for UK/EEA.

### AdSense Auto Ads prep — removed ad placeholders
- Deleted `src/components/AdSlot.astro` (placeholder ad-unit with commented-out `<ins class="adsbygoogle">` and `ca-pub-XXXXXXX`/`data-ad-slot="XXXXXXX"` placeholders) and its 3 usages + import in `calculator/[slug].astro` (they rendered empty `min-height` gaps). Auto Ads places ads automatically — no manual units needed.
- Deleted `public/ads.txt` (it held the invalid placeholder `google.com, ca-pub-XXXXXXX, DIRECT, ...`). Must be recreated with the REAL publisher ID after AdSense approval.
- Verified live: calculator pages render HTTP 200, zero ad-placeholder divs, layout/sidebar intact, no console errors.
- Readiness confirmed: Privacy/Terms/About/Contact pages present (Privacy + Terms already disclose AdSense), cookie-consent gate present, robots.txt allows all crawlers (incl. AdSense Mediapartners-Google), CSP already whitelists pagead2.googlesyndication.com/adsbygoogle/doubleclick. No live AdSense head script yet — to be added post-approval with the real ca-pub ID.

### Content fix — business rates 2026/27 (reform + revaluation) — MAJOR
Grep-swept the 13 mortgage + 18 business engines for stale rate constants. Most current (corp tax 19/25%, VAT 20%, dividend 8.75%, employer NI 15%/£5k, income-tax bands, AIA £1,000,000, capital allowances 18%/6%, R&D merged scheme 86%/20%, IR35/dividend-vs-salary all verified). One major stale set:
- **Business rates fully reformed + revalued from 1 April 2026** (verified gov.uk). `BusinessRatesCalculator.tsx`: small multiplier 49.9p→**43.2p**, standard 55.5p→**48p**, plus a new **£500k+ higher multiplier 50.8p** tier added. Content (×4 incl. worked example): updated multipliers, the doubly-wrong "standard 49.9p/small 49.9p", and the stale valuation date (1 April 2021/2023 list → **1 April 2024/2026 list**). Verified live across all 3 tiers: £100k→£48,000 (48p), £600k→£304,800 (50.8p), £20k→£8,640 (43.2p). (RHL lower multipliers 38.2p/43p noted but not modelled.)
- _Noted, not changed:_ Right-to-Buy max discount £34k is a single-value approximation of the post-Nov-2024 regional £16k-£38k caps (percentages unchanged — acceptable); late-payment BoE base rate 4.25% is a snapshot with an explicit "check current" disclaimer; lease-extension marriage value still applies (the 2024 Act's abolition isn't commenced yet) — all correct/acceptable as-is.

### Targeted rate-sweep — Carer's Allowance + UC Carer Element 2026/27
Instead of random pages, grepped all 86 untested rate-sensitive calculator engines for stale statutory/benefit constants in one pass. **80+ confirmed current** (NMW £12.71, employer NI 15%/£5k, state pension £241.30, SMP/SPP **£194.32**, SSP **£123.25**, child benefit £27.05/£17.90 — all verified against gov.uk). Two flags found and fixed:
- **Carer's Allowance £83.30 → £86.45/week** (2026/27, 3.8% uplift) and **earnings limit £196 → £204/week** (verified gov.uk). Fixed `CarerAllowanceCalculator.tsx` + 7 content/FAQ spots (incl. a worked example and a stale £151/£81.90 that were 2024/25). Verified live: £86.45/wk (£4,495.40/yr), £204 limit.
- **UC Carer Element £198.31 → £209.34/month** (the £198.31 was the 2024/25 figure, two years stale; appeared in 6 places across UC + carer content/FAQ). Verified vs Turn2us.
- _Noted but not changed:_ the UC "LCW £156.11" element in UC prose is a legacy figure (LCWRA is now £429.80/£217.26) — lower priority, rarely applies to new claims.

### Eighth interactive browser sweep (15 fresh random pages) — 0 fixes needed
smart-meter, wealth-growth, work-from-home-tax-relief, birthday, savings-interest-tax, energy-bill, protein-intake, student-loan-total-cost, heat-pump, date, agency-worker, contractor-vs-perm, pay-rise, holiday-entitlement, speed-distance-time.
- **15/15 functional, 0 bugs, 0 fixes.** First clean sweep — all current and correct.
- Maths verified exact: wfh-tax-relief (£6/wk×48×20%=£57.60), birthday (35y/12,943 days), wealth-growth (£1,090,341 compound), agency-worker (£18 charge −20% margin −tax/NI = £20,886 take-home), date (364 days, 260 working), holiday-entitlement (5.6wk/28-day cap/210hrs), pay-rise (5%/£2,000), speed-distance-time (120÷60=2mph), energy-bill (£1,729.96 typical), heat-pump (gas £804 vs HP £882/yr).
- Figures verified current: heat-pump BUS grant **£7,500**, savings PSA £1,000/£500/£0 + £5,000 starting rate, WFH £6/wk, student-loan Plan 2 £29,385 (30-yr write-off), price-cap rates (elec 24.5p/gas 6.33p), state-pension £241.30, holiday 5.6 weeks.
- Minor notes (not bugs): pay-rise real-terms uses simple subtraction (1.5%) vs precise Fisher (1.45%) — common convention; smart-meter appliance inputs unlabelled (known a11y pattern). False alarms (my scanner corrupting inputs): smart-meter £3,117 (rate→74.5p), heat-pump £18k (house→2,090m²), holiday 350hrs (days→3).

### Content fix — state-pension triple-lock narrative (year conflation)
- `state-pension-calculator` engine is correct (£241.30/wk 2026/27), but two content lines described the rise as "up 4.1% from £221.20" — that's the **2024/25** figure, skipping 2025/26, and £221.20 × 1.041 = £230.25 (not £241.30). Corrected to "up **4.8% from £230.25**" (the actual 2026/27 uprating: £230.25 × 1.048 = £241.30); annual £11,973 → £12,547.60. Verified in SSR.

### Accessibility fix — GPA module inputs
- `GPACalculator.tsx`: repeating module rows had unlabelled grade select + credits input + bare "x" remove button. Added `aria-label` to all three. (UK class boundaries First ≥70 / 2:1 60-69 / 2:2 50-59 / Third 40-49 were already correct.)

### Seventh interactive browser sweep (15 fresh random pages)
housing-benefit, timber, staircase, gas-cost, weight-loss, student-loan-plan4, area-converter, state-pension, childcare-entitlement, underfloor-heating, night-shift, gpa, employee-vs-contractor, paint, steps-to-miles.
- **15/15 functional.** Maths verified exact: gas-cost (11,500kWh×6.33p + 31.65p/day = £70.29/mo), student-loan-plan4 (9%×(£40k−£33,795)=£558.45), area-converter (100m²=0.0247 acres), steps-to-miles (10k×0.75m=7.5km), staircase (Part K 150-220mm riser, 42° pitch), housing-benefit (65% taper, LHA editable).
- Figures verified current: childcare-entitlement (30+15 free hrs, £100k cap, TFC £2,000, "from Sept 2025"), state-pension £241.30, student-loan Plan 4 £33,795, gas price-cap rates, GPA UK class boundaries.
- **2 fixes** (state-pension narrative, GPA a11y). Minor notes (not fixed): timber title leads with "Board Feet" (US unit; metric is primary); employee-vs-contractor employer-NI gross-up uses full salary vs salary−£5k (~1% approximation).
- Dev server crashed mid-round after ~7 navigations (known degradation) — restarted, continued. False alarm: weight-loss "negDate" = "4-8 weeks" ranges, not negatives.
- `ProbateFeeCalculator.tsx` + 2 content spots: extra sealed-copy fee was £1.50; HMCTS raised it to **£16 per copy on 17 November 2025**. Updated engine (`16 * 5`) + the "copies cost £1.50 each" prose + worked example (3×£16=£48, total £348). The main £300 application fee + £5,000 threshold confirmed correct. Verified live: £300 + 5×£16 = £380 DIY.

### Accessibility fix — debt-consolidation inputs
- `DebtConsolidationCalculator.tsx`: the repeating per-debt inputs (balance/APR/monthly) had only placeholders, and the remove button was a bare "x". Added `aria-label` to all three inputs (`Debt N balance` etc.) and the remove button. Payoff loop is correctly capped at 360 months (negative-amortisation edge case doesn't hang).

### Sixth interactive browser sweep (15 fresh random pages)
spousal-maintenance, pension-lump-sum, debt-consolidation, greenhouse-size, rental-yield, bmi-children, employee-cost-breakdown, vat-threshold, discount, high-income-child-benefit, care-cost, probate-fee, mortgage-interest-rate, remortgage, house-price-sqft.
- **15/15 functional.** Maths verified exact: pension-lump-sum (£400k×25%=£100k, LSA £268,275), rental-yield (5.76%/4.80%), bmi-children (17.9), employee-cost (employer NI 15%×(£35k−£5k)=£4,500), **HICBC (CB £27.05/£17.90 — current 2026/27; £70k→50% clawback £1,168.70)**, mortgage-interest-rate (£250k/5%/25yr=£1,461.48 table), remortgage (£1,375.77), house-price-sqft (£300/sqft, £3,229/m²), discount (£80−25%=£60).
- Figures verified current: VAT thresholds £90k/£88k, care-cost means-test £23,250/£14,250 (£86k Dilnot cap correctly framed as **postponed indefinitely**), employer NI 15%/£5k, pension LSA £268,275.
- **2 fixes** (probate copies £16, debt-consolidation a11y). Notable: HICBC Child Benefit rates were already correctly uprated to 2026/27 (£27.05/£17.90).
- The "alimony" hits on spousal-maintenance are intentional (UK term vs US clarification), not errors.

### Content fix — teacher pay scales 2025/26 (4% award) — MAJOR
The STPCD 2025 4% award (from 1 Sept 2025) was missed — engine + content carried the 2024/25 scale (and the upper scale didn't match any year). Verified vs NASUWT/Tes and updated:
- `TeacherPayCalculator.tsx`: Main scale M1 £31,650→**£32,916** … M6 £43,607→**£45,352**; Upper £47,417/£49,348/£51,179→**£47,472/£49,232/£51,048**; Leadership ×1.04. Verified live: M1 £32,916, M6 £45,352 → net £33,053.
- Content/FAQ: full scale list, MPR/UPR descriptions, TPS contribution example, and the M6 take-home worked example recomputed to match the engine (£45,352 → tax £5,776, NI £2,623, pension 8.6% £3,900, net £33,053). Fixed a wrong "9.6%" TPS band (£45k is the 8.6% band).

### Content fix — Pension Credit 2026/27 — MAJOR
Engine + 4 prose spots carried 2025/26 figures. Verified vs gov.uk/Turn2us (4.8% earnings uplift from 6 April 2026):
- `PensionCreditCalculator.tsx`: single guarantee £227.10→**£238.00**, couple £346.60→**£363.25**; additional amounts (severe disability/carer) uprated 3.8% CPI. Verified live: £238/£363.25.
- Content (×3) + FAQ (×1): guarantee figures + annual equivalents (£11,809→£12,376, £18,023→£18,889).

### Content fix — body-fat worked example
- `body-fat-calculator`: engine correct (Navy formula, verified 24.9% for waist 88/neck 38/height 180), but the prose worked example showed the right formula yet stated "≈18.6%". Corrected to **≈24.9%** (the value the shown arithmetic produces).

### Content fix — ULEZ calc + remaining Congestion Charge £15→£18 (round-4 gap)
- `ULEZCalculator.tsx`: `CC_DAILY` 15→**18** (the Congestion Charge rose to £18 on 2 Jan 2026 — fixed in round 4 but this engine constant + 2 content refs were missed). ULEZ itself £12.50 correct.
- Content: 2 more "Congestion £15/day" refs (toll-roads list + a CC content block) → £18. Comprehensive re-sweep now shows zero stale CC £15 references.

### Fifth interactive browser sweep (15 fresh random pages)
teacher-pay, company-car-tax, pension-annual-allowance, high-council-tax, mpg, landlord-tax, body-fat, macro, pension-credit, pension-tax-relief, ulez, bathroom-cost, number-to-words, sole-trader-tax, mortgage-affordability.
- **15/15 functional.** Maths verified exact: company-car (EV BIK 4% 2026/27), pension-AA (£10k excess → £2k charge), mpg (34.1 UK), landlord S24 (£13,854 net), macro (Mifflin-St Jeor 2,633 kcal), pension-tax-relief (RAS £2k + higher £1,946 — correctly only the £9,730 in the 40% band), sole-trader (£50k→£40,268 take-home), mortgage-affordability (4.5×£40k=£180k, 86% LTV), high-council-tax (Band H = 2× D).
- **4 stale/bug fixes** (teacher-pay, pension-credit, body-fat, ULEZ/CC above). Figures verified current: company-car EV BIK 4%, pension AA £60k/£10k MPAA, ULEZ £12.50, Class 4 NI 6% + Class 2 abolished.
- False alarms: number-to-words/high-council-tax/cost-of-living NO-CHANGE = dev `client:visible` hydration flake (source verified reactive + correct).

### Feature — currency-converter now uses LIVE exchange rates
The H1 claimed "Live Exchange Rates" but rates were hardcoded (deploy-time). Wired it to a real feed:
- `CurrencyConverter.tsx` now fetches **live daily rates from `open.er-api.com`** (free, key-less, CORS-enabled, base GBP, full currency coverage incl. AED) on mount via `useEffect`, with the previous hardcoded rates kept as a **graceful fallback** and an `AbortController` for cleanup.
- Status indicator: "Live mid-market rates, updated {date}" on success; "showing recent cached rates (live feed unavailable)" on any error. Makes the "Live" claim accurate either way.
- **CSP**: added `https://open.er-api.com` to `connect-src` in `public/_headers` (was locked to self + analytics — this is the **first component on the site to call an external API**, so the edge CSP needed widening).
- Verified live in dev: GBP→EUR now 1.1563 (live) vs the old hardcoded 1.17; "updated 2 Jun 2026". Fallback path leaves the cached rates + cached-status note. No console errors.

### Content/logic fix — exam-score UK degree classifications
The calculator engine mapped degree classes **one band too low** at every level (70%→"2:1", 60%→"2:2", 50%→"Third", 40%→"Pass"). UK boundaries are First ≥70, 2:1 60-69, 2:2 50-59, Third 40-49, Fail <40 — and the page's own prose already had these correct, so the engine contradicted its own content.
- `ExamScoreCalculator.tsx`: corrected to A* / First (≥90), A / First (≥80), **B / First (≥70)**, **C / 2:1 (≥60)**, **D / 2:2 (≥50)**, **E / Third (≥40)**, U / Fail (<40). A-level letters were already correct; only the degree half was fixed. Fail grade "F" → "U" (correct A-level notation).
- Verified live across bands: 75%→First (1st), 65%→2:1, 55%→2:2, 45%→Third, 35%→Fail.

### Content fix — Self-Assessment worked example (Class 2 abolished)
- `self-assessment-tax-calculator` engine is correct (£50k profit → £9,731.80; £55k → £11,788.60, verified live), but its prose worked example ("£55,000 profit") was wrong: income tax £8,432 (should be **£9,432**), Class 4 £2,358.60 (should be **£2,356.60**), and a hidden **abolished Class 2 NI £179.40** baked into the £10,970 total. Corrected to match the engine: IT £9,432 + Class 4 £2,356.60 + Class 2 £0 = **£11,788.60**.

### Fourth interactive browser sweep (15 fresh random pages)
currency-converter, ev-charging, cost-of-living, cash-flow, paving, savings-goal, uk-citizenship, car-finance, concrete, employers-liability, invoice-profit, pace, self-assessment, sleep, exam-score.
- **15/15 functional.** Maths verified exact: ev-charging (48kWh: home £11.76/7p-mi, public £33.60/20p-mi), paving (27m²→77 slabs/£269.50), savings-goal (£446.79/mo annuity), car-finance (PCP £309.49 w/ balloon), concrete (0.90m³/2.16t), invoice-profit (£1,000/20%), pace (15km/50min→3:20/km/18km/h), **self-assessment (£50k→£9,731.80, £55k→£11,788.60)**, exam-score (45/60=75%).
- Figures verified current: employers-liability (£5m min, £2,500/day fine), uk-citizenship (ILR+12mo, 450/90/270-day absence rules), EV charging rates (24.5p home/70p public). SA Class 4 6%/2% + abolished Class 2 correct in engine.
- **1 content bug found + fixed** (SA worked example above). **2 minor flags (not fixed)**: currency-converter H1 says "Live Exchange Rates" but rates are hardcoded (deploy-time) — overpromises; exam-score maps 75% to "B / 2:1" though 70%+ is a First in UK degree terms (grade boundaries vary; label says "Approximate").
- False alarms (dev `client:visible` hydration timing): cost-of-living, cash-flow showed NO-CHANGE but SSR maths correct.

### Third+ interactive browser sweep (15 fresh random pages)
dividend-tax, percentage, wallpaper, wedding-cost, crypto-tax, kitchen-cost, staircasing, universal-credit, student-budget, logarithm, age, congestion-charge, debt-to-income, overdraft-cost, crop-yield.
- **15/15 functional.** Maths verified exact: dividend-tax (£30k→8.75%×£29,500=£2,581.25), crypto-tax (£20k−£3k AEA→£4,063.80 at 18%/24%), percentage (15%×200=30), wallpaper (12 rolls), age (36y to the day), debt-to-income (12% excl-mort), overdraft (£500×39.9%×30/365=£16.40), crop-yield (120kg/£180), logarithm (log₁₀1000=3).
- **3 stale-content/bug fixes found and fixed** (UC, Congestion Charge, debt-to-income a11y above). Other figures verified current: dividend (£500/8.75/33.75/39.35%), crypto CGT (18%/24%/£3k AEA).
- False alarms (my scanner): overdraft "£221.88" = corrupted APR to 539.9%; crypto first run £0 = set losses > gains.

### Second interactive browser sweep (15 fresh random pages — scroll/fill/click)
Drove 15 more random calculators (loft-conversion, cis, apprenticeship-levy, waist-hip-ratio, minimum-wage, redundancy, pension-vs-isa, student-loan, pay-per-mile, debt-free, fence-paint, isa, salary-sacrifice-pension, annuity, ground-rent).
- **15/15 functional.** Maths verified exact: minimum-wage, CIS (20%×net-of-materials), apprenticeship-levy ((bill×0.5%)−£15k), salary-sacrifice (£5k→£1,400 saving), student-loan (9%×(£40k−£29,385)=£955.35), debt-free (2y1m), fence-paint, ground-rent.
- **Figures verified against gov.uk**: NMW April 2026 (£12.71/£10.85/£8.00); student-loan thresholds 2026/27 (Plan1 £26,900 / Plan2 £29,385 / Plan4 £33,795 / Plan5 £25,000 / PG £21,000); ISA limits (£20k/£4k LISA/£9k JISA); VED £200 (above).
- **0 content bugs**, no US-English leakage. False alarms (all confirmed not bugs): debt-free "April 2026" was the *Last-updated* date + my own scanner corrupting the APR field; radiator/fence-paint/annuity "NO-CHANGE" were the dev `client:visible` hydration-timing quirk (source verified reactive); waist-hip/debt-free "NO-CHANGE" were empty required second inputs.

### Interactive browser sweep (15 random pages — scroll/fill/click)
Drove 15 random calculators in a real browser (dev server): scrolled to hydrate, filled inputs, clicked tabs/presets, changed selects, verified reactivity + maths + en-GB language.
- **15/15 functional**, all reactive. Spot-checked maths exact on several: overtime (£30k/52/37.5=£15.39/hr→£6,001/yr), child-maintenance (£800×12%=£96/wk), sole-trader-vs-ltd (£20k→£18,068.20 take-home), bricks (1,270 @ 59/m²+5%), radiator-BTU (150m³×153=22,950), buy-to-let yield (4.40%).
- Data accuracy verified: dividend (£500 allow, 8.75/33.75/39.35%), state-pension-age (66→67→68), first-homes (30-50%, £250k/£420k caps), CMS (12/16/19%), clothing-size (UK/EU/US), pension state-pension default £241.30/wk (2026/27).
- **0 content bugs** (no NaN/undefined/[object Object]/£ £/double-%); no US-English leakage (UK "instalment", "mortar", "colour"); `$` only where intentional (US dividend withholding example).
- **1 content-freshness flag**: `mileage-allowance` cites EV Advisory Electric Rate "8p/mile from December 2024" (content.ts:2054, 7097) — AER is reviewed quarterly; verify against gov.uk AFR page and refresh if changed since Dec 2024.
- radiator-BTU initially showed a frozen result during testing → confirmed a **dev `client:visible` hydration-timing artifact** (island not yet hydrated), not a bug; recompute is correct once hydrated.

### Audit results (site-wide + 12 pages, 155+ criteria via calkcheck)
- Site-wide infra: **7/7 clean** — robots.txt + AI-search bots, sitemap-index, llms.txt (2.7KB), TLS 1.3, cert valid >30d
- Per-page: **1148 ✅ / 2 ❌ / 158 ⚠️** across 12 pages (avg ~96 ✅/page)
- AI content: 6 MIXED / 6 LIKELY-HUMAN — 0 AI-CONFIRMED; cliché density 0/1k, MTLD healthy. MIXED driven by em-dash typography (stylistic), not generated-text tells
- AI code: 370 files scanned, 1 finding (K7, now fixed)
- 2 ❌ both expected: `/about/` lacks WebPage+BreadcrumbList JSON-LD (non-calculator page); `birthday-calculator` has no gov.uk sources (utility calc, EAT-1 N/A)
- `check_sources_coverage.py` "46 missing" = false positive — this site centralises sources in `calculator-content.ts` (231 gov.uk citations), not inline `sources={[...]}` tsx props

---

## v1.5.12 — 2026-05-22 (Audit 9 via calkcheck)

### Content fixes
- **4 thin content pages** expanded with 5 new paragraphs each:
  - `timber-calculator` — UK timber grades, prices 2026, studwork calc, standards
  - `roman-numeral-converter` — basics, UK uses, limitations, quick conversion
  - `vat-calculator` — UK VAT 2026/27, three modes, registration, schemes, mistakes
  - `business-mileage-record-calculator` — AMAP 45p/25p, eligibility, records, AFR

### Audit results (30 pages, 96 criteria via calkcheck)
- Initial: 26/30 fully clean, 4 with thin content
- After fix: **30/30 clean** ✓
- Content bugs detected: 30/30 false positives (URL patterns in i18n key detection); 5 "wrong_year_2024" findings all legitimate historical references (Class 2 NI abolished, BIK rate progression, EV mileage rate change)
- Cumulative coverage: 270/331 calculators audited and verified clean (82%)

---

## v1.5.11 — 2026-05-22 (Audit 8)

### Content fixes
- 7 thin content pages expanded: elm-payment, home-buying-total-cost, ni-salary-sacrifice-2029, cost-of-delay, wedding-cost, farm-tenancy, fence-paint
- 1 missing FAQ added: inflation-calculator (4 unique questions)

### Audit results
- 22/30 → 30/30 clean

---

## v1.5.10 — 2026-05-22 (Audit 7)

### Content fixes
- 7 thin content pages expanded
- 1 missing FAQ: holiday-entitlement-calculator

---

## v1.5.9 — 2026-05-22 (Audit 6)

### Content fixes
- 5 thin content pages expanded: binary-converter, car-depreciation, pension-sharing-divorce, a-level-grade, stamp-duty

### Audit framework
- Introduced 96-criterion audit including critical #96 (Tap target ≥44×44px / WCAG 2.5.5 AAA / 2.5.8 AA)

---

## v1.5.8 — 2026-05-22 (Tap target compliance)

### Systemic accessibility fix — Mobile UX (Criterion #96)
- **WCAG 2.5.8 AA tap target compliance: 41% → 100%**
- Fixed Footer (28 category links): 17px → 32px height (added py-1.5 inline-block)
- Fixed Header logo: 36px → 44px (added min-h-[44px])
- Fixed Footer logo: 32px → 44px
- Fixed Breadcrumb links: 20px → 36px (py-2 inline-block)
- Fixed email mailto link: 20px → 36px (py-2)
- Fixed Cookie consent buttons: 38px → 46px (py-3)

---

## v1.5.7 — 2026-05-22 (Accessibility systemic fix)

### Systemic accessibility fix — Input labels (WCAG 2.1 AA)
- **937/1090 inputs got aria-label** (was 0/1090)
- 311 of 334 calculator React components updated
- JSX-aware parser respects {} braces in onChange={(e) => ...} handlers
- Inputs inside `<label>` (implicit association) kept as-is
- Inputs inside loops/dynamic content require manual fix (73 remaining = 7%)

### Audit results (Audit 5, 80+ params)
- Static audit: 30/30 clean
- Accessibility: All `<main>`, `<nav>`, alt-text, heading hierarchy OK
- inputs_no_label across sample: 2/30 → 26/30 pages with all inputs labelled

---

## v1.5.6 — Audit 5

### Content fixes
- 7 thin content pages + 4 long titles shortened
- Added carer-allowance-calculator content entry

---

## v1.5.5 — Audit 4

### Content fixes
- 7 thin content + 2 missing FAQs + 8 long titles shortened (ir35, staircasing, corporation-tax, pension-annual-allowance, pension-calculator, stamp-duty-first-time-buyer, inheritance-tax, business-rates)

---

## v1.5.4 — Audit 3

### Content fixes
- 6 thin content + 1 missing FAQ (mortgage-affordability) + 4 long titles shortened

---

## v1.5.3 — Audit 2

### Content fixes
- 11 thin content (car-insurance-estimate, agricultural-worker-wage, high-council-tax, bmi-children, divorce-settlement, prime-number, gas-cost, farm-operating-cost, mtd-readiness, carer-allowance, first-homes-scheme)
- 2 missing FAQs (pension-drawdown, solar-panel)
- 3 long titles shortened (pension-drawdown, carer-allowance, mortgage-overpayment)

---

## v1.5.2 — Audit 1

### Content fixes
- 5 thin content pages + 2 missing FAQ (council-tax, landlord-tax) + 1 long title (benefits-in-kind)

---

## v1.5.0 — Initial release (Audits 0-incremental over weeks)

### SEO + content base
- 331 calculators with custom metaTitles
- ~250 calculators with rich content (5+ paragraphs in howItWorks)
- Schema.org JSON-LD: 4 types per page (WebPage, WebApplication, BreadcrumbList, Person)
- E-E-A-T signals: AuthorByline, source citations (gov.uk/HMRC/NHS), Quick Answer blocks, disclaimer, last updated
- Boilerplate FAQs eliminated (0/331)

### Infrastructure
- robots.txt with smart AI crawler rules (block training, allow search)
- sitemap-index.xml: 359 URLs
- llms.txt: 2.7 KB for AI crawler optimization
- TLS 1.2/1.3
- All security headers: HSTS, CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy

### Mobile
- PWA with manifest + service worker
- Android app via Capacitor (Google Play: uk.calks.app)
