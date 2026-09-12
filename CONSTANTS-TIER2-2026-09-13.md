# calks.uk — Tier-2 constants sweep, 13 September 2026

Mode: **tier2** (verify against primary sources, merge verdicts into the ledger, report). **No site changes, no deploy.**
Scope: the 52 `uncertain` ledger entries plus the 8 "known" value≠official entries the gate had been carrying.
Method: three parallel primary-source agents (HMRC/Home Office; council tax/water/public pay; farming/legal/misc), with the highest-impact claims re-checked on the main thread (gov.uk WFH, SSP, ESA, PIP, Help to Save, agricultural pay, HMRC CC/FS11) and the regional council-tax figures independently recomputed from MHCLG Table 10.

## Ledger result

| status | before | after |
|---|---|---|
| current | 1352 | 1351 |
| stale_confirmed | 0 | **47** |
| uncertain | 52 | 6 |
| historical | 5 | 6 |

One entry added to the inventory (`esa_support_group_weekly`). `freshness_verified` → 2026-09-13.

## Materially misleading today (fix first)

| calculator / surface | site says | should say | source |
|---|---|---|---|
| WorkFromHomeTaxReliefCalculator (+ content, faqs) | employees claim £6/week for 2026/27 | **no employee relief from 6 Apr 2026**; past 4 years still claimable; employer can still pay £6/week tax-free (s316A) | [gov.uk](https://www.gov.uk/tax-relief-for-employees/working-at-home) |
| ILRCalculator | Skilled Worker "3 years if earning £45,300+"; 450-day absence cap | **5 years**, no accelerated route (SW 21.1); **180 days in any 12 months** (CR 3.1); earned settlement is consultation only | [Appendix Skilled Worker](https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker), [Continuous Residence](https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-continuous-residence) |
| AgricultureWorkerWageCalculator | "Agricultural Wages Order (England) 2026/27" grades £12.77–£18.13 | **no England order since 1 Oct 2013**: NMW/NLW (£12.71), old AMW only if in a pre-2013 contract | [gov.uk](https://www.gov.uk/agricultural-workers-rights/pay-and-overtime) |
| PersonalInjuryCalculator | whiplash bands to £50k; moderate back max £12k; severe psychiatric max £60k | RTA whiplash tariff £275–£4,975 by duration (SI 2025/615); JCG 18th ed. brackets (moderate back £16,520–£51,230; severe back (i) to £212,670; serious leg to £72,440) | [SI 2025/615](https://www.legislation.gov.uk/uksi/2025/615/made); JCG 18th ed. via law-firm summaries (confidence medium) |
| CouncilTaxCalculator | 8 regional Band D averages £2,115–£2,239 | £2,390–£2,550 (NE £2,535, NW £2,479, YH £2,390, EM £2,460, WM £2,393, EE £2,394, SE £2,472, SW £2,550) | [MHCLG Table 10](https://assets.publishing.service.gov.uk/media/6a02eeeccd2e0e8b5b20b449/Table_10_2026-27.ods) — tax-base-weighted; method reproduces England £2,391.52 (official £2,392) and London £2,068.47 (official £2,068) |
| TeacherPayCalculator | flat London add-ons £5,000 / £2,000 / £1,000 | STPCD 2025 main-range gaps £7,401 / £4,954 / £1,482 (2026 indicative £7,660 / £5,127 / £1,533) | [STPCD 2025 Table 8](https://assets.publishing.service.gov.uk/media/687a6260312ee8a5f0806bb5/School_teachers__pay_and_conditions_document_2025_and_guidance_on_school_teachers__pay_and_conditions.pdf) |
| SSP prose (content 2664–2667, 3234; faqs 695; calculators.ts meta) | 4 consecutive days, £129 LEL, 3 waiting days; "PIP is means-tested" | at least one full working day; no LEL; paid from day one; lower of £123.25 or 80% AWE. PIP is not means-tested. **Calculator code is already correct.** | [SSP eligibility](https://www.gov.uk/statutory-sick-pay/eligibility), [PIP](https://www.gov.uk/pip) |
| Help to Save (calculator + faqs 1596 + content 6234) | UC earning 16 hrs at NLW / £881 a month | UC with **£1+ take-home pay** in the last assessment period (from 6 Apr 2025) | [gov.uk](https://www.gov.uk/get-help-savings-low-income/eligibility) |
| RDTaxCreditCalculator | loss-maker cash credit capped at 18.6% | merged RDEC ~16.2% net; ERIS ~26.97% (APs from 1 Apr 2024) | [gov.uk](https://www.gov.uk/guidance/research-and-development-rd-tax-relief-the-merged-scheme-and-enhanced-rd-intensive-support) |
| StudentLoanInterestCalculator | Plan 5 shown with a £25,000–£49,130 sliding margin | Plan 5 = RPI only, no income band (code bug, not a rate) | code review |

## Also stale

- **Spouse visa** first grant 2.5 → **2.75 years** (33 months); 2.5 only for extensions.
- **English test (SELT B1)** £150 → about **£160–£182**; PSI no longer approved in-UK.
- **ESA** support group £142.25 → **£145.90**; "income-related ESA abolished" → no new claims, existing continue.
- **HMRC disclosure penalties** (faqs 200, 863; content 789): the 10–30% voluntary figure is right for non-deliberate 12m+; the comparison (30–100% / 50–100%) overstates a prompted non-deliberate case (20–30%), and content 789 calls the voluntary case "prompted". [CC/FS11](https://www.gov.uk/government/publications/compliance-checks-penalties-for-failure-to-notify-ccfs11/compliance-checks-penalties-for-failure-to-notify-ccfs11)
- **WTC** prose (faqs 1577, 1731; content 6162, 6740) still describes Working Tax Credit as claimable in 2026 — it closed 5 Apr 2025.
- **SFI**: soil assessment £97 is SFI 2024 legacy only (and omits £6/ha; removed in SFI26); woodland £49/ha was the 2021 pilot. The whole ELM calculator needs an SFI26 review (71 actions, no management payment, several rates cut).
- **NHS bursary** £5,612 matches nothing; nursing students get the LSF (£5,000 training grant); prose "NHS Bursary up to £4,000" also matches nothing.

## Closed as current / historical

- `vat_frs_rate_waste_recycling` 10.5% current (SI 1995/2518 reg 55K).
- `building_regs_riser_min` 150 / `building_regs_going_max` 300 current (Approved Document K Table 1.1).
- `fuel_duty_plus_vat_share_of_pump_price` 0.45 current as an editorial estimate (duty + all VAT: diesel 45.1%, petrol 48.9% at 7 Sep 2026 prices; rises from 1 Jan 2027).
- `esa_assessment_rate` £95.55 current (25+).
- Ledger lag only: `sdlt_band1_rate` → 0, `wtc_basic_element` → 2435 (historical), `tax_credits_income_threshold` → 7955 (historical; £7,582 never existed), `rhl_relief_rate` → 0 (retired).

## Still uncertain (6) — editorial, no single official value

- `council_tax_care_leaver_under_25_exemption`: England is local/discretionary (Wales national <25, Scotland national <26); the calculator applies 100% with only a "(many councils)" label — needs a caveat.
- Water averages ×4: no official average; sampled 2026/27 schedules put the site's water volumetric rate below every company and the sewerage standing charge at about half once drainage is counted. Totals land near Water UK's £639.
- `tps_revaluation_rate_active` 3.2%: a projection assumption (actual Apr 2026 5.4%, Apr 2025 3.3%); label it as such.

## Gate

`scripts/ledger-consistency-baseline.json`: the 19 numeric stale_confirmed entries are added to `known_mismatches` (listed under `tier2_2026_09_13`) so the pre-deploy gate warns instead of blocking while they await phase4; `rhl_relief_rate`, `sdlt_band1_rate`, `wtc_basic_element` removed because they are now consistent and should be guarded. **Phase4 must remove each key from the baseline in the same commit that fixes it.**

## Not done here

- No site edits and no deploy (tier2). The browser-QA fixes in 019775d are also still undeployed; live OTA is 202609101325.
- The Ofgem Q4 price cap (watch date 1 Oct 2026) was not applied — not in force yet.
